const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// --- CONFIGURATION ---
const TEMP_DIR_BASE = path.join(os.tmpdir(), 'compiler-docker');
const DOCKER_IMAGE = "ncompiler-sandbox";

// Ensure base temp directory exists
(async () => {
    try {
        await fs.mkdir(TEMP_DIR_BASE, { recursive: true });
    } catch (e) {
        console.error("Failed to initialize temp dir:", e);
    }
})();

const LANGUAGE_CONFIG = {
    python: { fileName: 'main.py' },
    javascript: { fileName: 'index.js' },
    c: { fileName: 'main.c' },
    cpp: { fileName: 'main.cpp' },
    java: { fileName: 'Main.java' }
};

/**
 * Execute code using Docker Sandbox
 */
const executeDocker = async (langInput, code, input) => {
    // 1. LANGUAGE AUTO-CORRECTION
    let language = langInput;

    if (['java', 'c', 'cpp'].includes(language)) {
        if (/^\s*def\s+main\(\):|^\s*print\(["']/.test(code) || (code.includes('import sys') && !code.includes('public class'))) {
            language = 'python';
        }
    }
    if (language === 'python' && (code.includes('public class') || code.includes('System.out.println'))) {
        language = 'java';
    }

    // Default to python if unknown, or handle error
    if (!LANGUAGE_CONFIG[language]) {
        return { output: `❌ Language '${language}' not supported in sandbox`, isError: true };
    }

    let config = LANGUAGE_CONFIG[language];
    let finalCode = code;

    // --- C LANGUAGE PRE-PROCESS ---
    if (language === 'c') {
        if (!finalCode.includes('#include <stdio.h>')) {
            finalCode = '#include <stdio.h>\n' + finalCode;
        }
    }

    // --- JAVA SANITIZER LOGIC ---
    if (language === 'java') {
        finalCode = finalCode.replace(/package\s+[\s\S]*?;/g, '');
        const classMatch = finalCode.match(/class\s+(\w+)/);
        const oldClass = classMatch ? classMatch[1] : null;
        finalCode = finalCode.replace(/public\s+class\s+\w+/g, 'public class Main');
        if (!finalCode.includes('public class Main')) {
            finalCode = finalCode.replace(/class\s+\w+/, 'public class Main');
        }
        if (oldClass) {
            finalCode = finalCode.replace(new RegExp(`(\\bpublic\\s+|\\b)${oldClass}\\s*\\(`, 'g'), 'public Main(');
            finalCode = finalCode.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), 'Main');
        }
        if (!finalCode.includes('static void main')) {
            if (finalCode.includes('public class Main')) {
                finalCode = finalCode.replace(
                    /public\s+class\s+Main\s*\{/,
                    'public class Main {\n    public static void main(String[] args) {\n'
                );
                finalCode += '\n    }\n}';
            } else {
                const imports = [];
                const otherLines = [];
                finalCode.split('\n').forEach(line => {
                    if (line.trim().startsWith('import ')) imports.push(line);
                    else otherLines.push(line);
                });
                finalCode = `${imports.join('\n')}\npublic class Main {\n    public static void main(String[] args) {\n${otherLines.join('\n')}\n    }\n}`;
            }
        }
        config.fileName = 'Main.java';
    }

    const runId = crypto.randomUUID();
    const hostDir = path.join(TEMP_DIR_BASE, runId);
    const startTime = Date.now();

    try {
        // 2. Setup Host Directory
        await fs.mkdir(hostDir, { recursive: true });

        // Write Code File
        const filePath = path.join(hostDir, config.fileName);
        await fs.writeFile(filePath, finalCode);

        // Prepare Docker Command
        // Flags: --rm (auto remove), -i (interactive stdin), --network none (security)
        // Limits: --cpus 0.5, --memory 256m
        // Volume: hostDir:/app

        const dockerCmd = `docker run --rm -i \
            --name ${runId} \
            --cpus="0.5" \
            --memory="256m" \
            --network none \
            -v "${hostDir}:/app" \
            ${DOCKER_IMAGE} \
            ${language} ${config.fileName}`;

        // 3. Execution (with Node-level Timeout for safety)
        const EXECUTION_TIMEOUT = 3000; // 3 Seconds

        return new Promise((resolve) => {
            const child = exec(dockerCmd, {
                timeout: EXECUTION_TIMEOUT + 500, // Slightly longer than internal limit to catch hangs
                killSignal: 'SIGKILL'
            }, async (error, stdout, stderr) => {
                const duration = (Date.now() - startTime) / 1000;

                // Cleanup Host Files
                try {
                    await fs.rm(hostDir, { recursive: true, force: true });
                    // Also force remove container just in case --rm failed or timeout hit
                    if (error && error.killed) {
                        exec(`docker rm -f ${runId}`, () => { });
                    }
                } catch (e) { /* ignore */ }

                const output = (stdout || "") + (stderr || "");

                // Handle Timeouts specially
                if (error && error.killed) {
                    resolve({
                        output: "⏱️ Execution Timed Out (Limit: 3s)",
                        isError: true,
                        duration
                    });
                    return;
                }

                if (error) {
                    resolve({
                        output: output || error.message,
                        isError: true,
                        duration
                    });
                } else {
                    resolve({
                        output: output,
                        isError: false,
                        duration
                    });
                }
            });

            // Pass Input to Stdin
            if (input) {
                child.stdin.write(input);
                child.stdin.end();
            } else {
                child.stdin.end(); // Important to close stdin if no input, else some reads hang
            }
        });

    } catch (err) {
        return { output: "System Error: " + err.message, isError: true };
    }
};

module.exports = { executeDocker };
