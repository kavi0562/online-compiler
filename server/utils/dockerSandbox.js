const { execFile } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

// --- CONFIGURATION ---
const TEMP_DIR_BASE = path.join(os.tmpdir(), 'compiler-sandbox');
const TIMEOUT_MS = 3000; // 3 seconds max execution
const MEMORY_LIMIT = '128m';
const CPU_LIMIT = '0.5';
const PIDS_LIMIT = '64';

// Ensure base temp directory exists
// Ensure base temp directory exists and is clean on startup
(async () => {
    try {
        await fs.mkdir(TEMP_DIR_BASE, { recursive: true });

        // Startup Sweeper: Remove any stale execution folders from previous crashes
        const files = await fs.readdir(TEMP_DIR_BASE);
        if (files.length > 0) {
            console.log(`🧹 [CLEANUP] Found ${files.length} stale items in sandbox. Cleaning...`);
            for (const file of files) {
                await fs.rm(path.join(TEMP_DIR_BASE, file), { recursive: true, force: true });
            }
            console.log(`✨ [CLEANUP] Sandbox hygiene restored.`);
        }
    } catch (e) {
        console.error("Failed to initialize temp dir:", e);
    }
})();

const LANGUAGE_CONFIG = {
    python: {
        image: 'python:3.11-slim',
        command: ['python3', '/app/main.py'],
        fileName: 'main.py'
    },
    javascript: {
        image: 'node:20-slim',
        command: ['node', '/app/index.js'],
        fileName: 'index.js'
    },
    java: {
        image: 'openjdk:17-slim',
        command: ['java', '/app/Main.java'], // Needs entrypoint wrapper if compiling
        fileName: 'Main.java'
    },
    cpp: {
        image: 'gcc:latest',
        // Simple one-shot compile and run for demonstration
        // In prod, separation of compile/run is better
        command: ['sh', '-c', 'g++ -o /tmp/out /app/main.cpp && /tmp/out'],
        fileName: 'main.cpp'
    },
    // Add others as needed
};

/**
 * Execute code in a secure Docker container
 * @param {string} language - Programming language
 * @param {string} code - Source code
 * @param {string} input - Stdin input (optional)
 * @returns {Promise<{output: string, isError: boolean, executionTime: number}>}
 */
const executeDocker = async (language, code, input) => {
    const config = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG['python']; // Fallback
    const runId = uuidv4();
    const containerName = `sandbox-${runId}`;
    const hostDir = path.join(TEMP_DIR_BASE, runId);

    const startTime = Date.now();

    try {
        // 1. SETUP: Create Host Temp Directory & Write Code
        await fs.mkdir(hostDir, { recursive: true });
        await fs.writeFile(path.join(hostDir, config.fileName), code);

        // If input exists, maybe write to file or pipe it? 
        // For simplicity, we will just pipe it via stdin in real exec, 
        // but child_process.execFile with input is tricky with docker run -i. 
        // Better: Write input to a file `input.txt` and cat it? 
        // OR: use the `stdin` option of execFile if supported, or just use `input` arg.
        // Let's use `create input.txt` and redirect in shell for maximum compatibility if needed,
        // or just rely on 'echo input | docker ...'
        // For strict isolation, let's write input.txt and redirect inside container if possible,
        // or just use options.input of execFile if we weren't wrapping docker.

        // Simpler approach for this step: We passed `input` to the function. 
        // Let's assume we handle stdin via the child process input stream.

    } catch (err) {
        // console.error("Staging Error:", err); // Keep internal log
        return { output: "System Error: Failed to stage code environment.", isError: true };
    }

    // 2. BUILD COMMAND
    // Note: We use 'sh -c' to handle piping input if necessary, or just run directly.
    // If input is provided, we need to pipe it.

    const dockerArgs = [
        'run',
        '--rm',                     // Auto delete
        '--name', containerName,    // Identification
        '--memory', MEMORY_LIMIT,   // RAM Limit
        '--cpus', CPU_LIMIT,        // CPU Limit
        '--network', 'none',        // No Internet
        '--pids-limit', PIDS_LIMIT, // No Fork Bombs
        '--read-only',              // Read-only filesystem
        '-v', `${hostDir}:/app:ro`, // Mount Code Read-Only
        '-w', '/app',               // Working Directory
        '-i',                       // Interactive (keep stdin open)
        config.image,
        ...config.command
    ];

    return new Promise((resolve) => {
        let isTimedOut = false;

        // 3. EXECUTE
        const child = execFile('docker', dockerArgs, {
            timeout: TIMEOUT_MS + 500, // Safety buffer for node timeout
            killSignal: 'SIGKILL'
        }, async (error, stdout, stderr) => {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            // 4. CLEANUP (Async - don't block response)
            // Remove temp dir
            try {
                await fs.rm(hostDir, { recursive: true, force: true });
            } catch (e) {
                console.error(`Failed to clean dir ${hostDir}:`, e);
            }

            // Just in case --rm failed or timeout happened, ensure kill
            if (isTimedOut || error?.killed) {
                try {
                    // Force kill if it's still hanging around (race condition)
                    require('child_process').exec(`docker kill ${containerName}`);
                } catch (e) { /* ignore */ }
            }

            // 5. PROCESS RESULT
            if (isTimedOut || (error && error.killed)) {
                return resolve({
                    output: `⏱️ Execution Timed Out (${TIMEOUT_MS / 1000}s limit exceeded)`,
                    isError: true,
                    duration
                });
            }

            if (error) {
                // Docker exit code non-zero (runtime error)
                // often stdout/stderr has the info.
                const combined = (stdout || "") + (stderr || "");
                return resolve({
                    output: combined || error.message || "Runtime Error",
                    isError: true,
                    duration
                });
            }

            const combined = (stdout || "") + (stderr || "");
            resolve({
                output: combined,
                isError: false,
                duration
            });
        });

        // Pipe Standard Input
        if (input) {
            child.stdin.write(input);
            child.stdin.end();
        } else {
            child.stdin.end(); // Close stdin if no input
        }

        // Manual Timeout Fallback (Node's execFile timeout includes waiting for output, 
        // sometimes processes hang differently)
        const timer = setTimeout(() => {
            isTimedOut = true;
            child.kill('SIGKILL');
            // Also try to docker kill explicitly if needed
            require('child_process').exec(`docker kill ${containerName}`, () => { });
        }, TIMEOUT_MS);

        // Clear timeout if finished early
        child.on('exit', () => clearTimeout(timer));
    });
};

module.exports = { executeDocker };
