const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// --- CONFIGURATION ---
// --- CONFIGURATION ---
// USE LOCAL TEMP DIR to avoid Docker File Sharing issues on Mac
const TEMP_DIR_BASE = path.join(__dirname, '../temp');
const DOCKER_IMAGE = "ncompiler-sandbox";

// Ensure base temp directory exists
(async () => {
    try {
        await fs.mkdir(TEMP_DIR_BASE, { recursive: true });
        await fs.chmod(TEMP_DIR_BASE, 0o777); // Ensure global write access
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
    // USE ABSOLUTE PATH RESOLUTION
    const hostDir = path.resolve(TEMP_DIR_BASE, runId);
    const startTime = Date.now();

    try {
        // 2. Setup Host Directory
        await fs.mkdir(hostDir, { recursive: true });
        await fs.chmod(hostDir, 0o777);

        // Write Code File
        const filePath = path.join(hostDir, config.fileName);
        await fs.writeFile(filePath, finalCode);
        await fs.chmod(filePath, 0o777);

        // Prepare Docker Command
        // DEBUG MODE: Run 'ls -la /app' first to PROVE file existence
        // We override entrypoint to /bin/bash to chain commands

        const dockerCmd = `docker run --rm -i \
            --name ${runId} \
            --cpus="0.5" \
            --memory="256m" \
            --network none \
            -v "${hostDir}:/app" \
            ${DOCKER_IMAGE} \
            ${language} ${config.fileName}`;

        // 3. Execution
        const EXECUTION_TIMEOUT = 3000;

        return new Promise((resolve) => {
            const child = exec(dockerCmd, {
                timeout: EXECUTION_TIMEOUT + 500,
                killSignal: 'SIGKILL'
            }, async (error, stdout, stderr) => {
                const duration = (Date.now() - startTime) / 1000;

                // Cleanup Host Files
                try {
                    await fs.rm(hostDir, { recursive: true, force: true });
                    if (error && error.killed) {
                        exec(`docker rm -f ${runId}`, () => { });
                    }
                } catch (e) { /* ignore */ }

                const output = (stdout || "") + (stderr || "");

                if (error && error.killed) {
                    resolve({
                        output: "⏱️ Execution Timed Out (Limit: 3s)",
                        isError: true,
                        duration
                    });
                } else {
                    resolve({
                        output: output,
                        isError: !!error,
                        duration
                    });
                }
            });

            // Pass Input to Stdin
            if (input) {
                child.stdin.write(input);
                child.stdin.end();
            } else {
                child.stdin.end();
            }
        });

    } catch (err) {
        return { output: "System Error: " + err.message, isError: true };
    }
};

module.exports = { executeDocker };
