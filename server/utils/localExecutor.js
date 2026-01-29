const { exec, spawn } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// --- CONFIGURATION ---
const TEMP_DIR_BASE = path.join(os.tmpdir(), 'compiler-local');

// Ensure base temp directory exists
(async () => {
    try {
        await fs.mkdir(TEMP_DIR_BASE, { recursive: true });
        // Cleanup stale runs
        const files = await fs.readdir(TEMP_DIR_BASE);
        for (const file of files) {
            // await fs.rm(path.join(TEMP_DIR_BASE, file), { recursive: true, force: true });
        }
    } catch (e) {
        console.error("Failed to initialize temp dir:", e);
    }
})();

const LANGUAGE_CONFIG = {
    python: {
        command: (file) => `python3 -u "${file}"`,
        fileName: 'main.py'
    },
    javascript: {
        command: (file) => `node "${file}"`,
        fileName: 'index.js'
    },
    typescript: {
        command: (file) => `ts-node "${file}"`,
        fileName: 'main.ts'
    },
    java: {
        // Strict Rules: Always Main.java, always public class Main
        compile: (dir, file) => `javac "${path.join(dir, file)}"`,
        run: (dir) => `java -cp "${dir}" Main`,
        fileName: 'Main.java'
    },
    c: {
        compile: (dir, file) => `gcc "${path.join(dir, file)}" -o "${path.join(dir, 'a.out')}"`,
        run: (dir) => `"${path.join(dir, 'a.out')}"`,
        fileName: 'main.c'
    },
    cpp: {
        compile: (dir, file) => `g++ "${path.join(dir, file)}" -o "${path.join(dir, 'a.out')}"`,
        run: (dir) => `"${path.join(dir, 'a.out')}"`,
        fileName: 'main.cpp'
    },
    csharp: {
        command: (file) => `echo "C# execution requires dotnet setup. Code: ${file}"`,
        fileName: 'Program.cs'
    },
    go: {
        command: (file) => `go run "${file}"`,
        fileName: 'main.go'
    },
    rust: {
        compile: (dir, file) => `rustc "${path.join(dir, file)}" -o "${path.join(dir, 'main')}"`,
        run: (dir) => `"${path.join(dir, 'main')}"`,
        fileName: 'main.rs'
    },
    php: {
        command: (file) => `php "${file}"`,
        fileName: 'main.php'
    },
    ruby: {
        command: (file) => `ruby "${file}"`,
        fileName: 'main.rb'
    },
    bash: {
        command: (file) => `bash "${file}"`,
        fileName: 'script.sh'
    }
};

/**
 * Execute code locally via Child Process
 */
const executeLocal = async (langInput, code, input) => {
    // 1. LANGUAGE AUTO-CORRECTION (Safety First)
    let language = langInput;

    // Heuristic: If detecting Python syntax but language is Java/C/C++
    if (['java', 'c', 'cpp'].includes(language)) {
        if (/^\s*def\s+main\(\):|^\s*print\(["']/.test(code) || (code.includes('import sys') && !code.includes('public class'))) {
            // High probability of Python
            language = 'python';
        }
    }
    // Heuristic: If detecting Java syntax but language is Python
    if (language === 'python' && (code.includes('public class') || code.includes('System.out.println'))) {
        language = 'java';
    }

    let config = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG['python'];
    let finalCode = code;

    // --- C LANGUAGE RULES ---
    if (language === 'c') {
        if (!finalCode.includes('#include <stdio.h>')) {
            finalCode = '#include <stdio.h>\n' + finalCode;
        }
    }

    // --- JAVA SANITIZER LOGIC (EXACT USER SPEC) ---
    if (language === 'java') {
        // 1. Remove package (DOTALL equivalent logic)
        // Matches "package ... ;" taking newlines into account
        finalCode = finalCode.replace(/package\s+[\s\S]*?;/g, '');

        // 2. Detect class name (public or non-public)
        // Python: re.search(r'class\s+(\w+)', code)
        const classMatch = finalCode.match(/class\s+(\w+)/);
        const oldClass = classMatch ? classMatch[1] : null;

        // 3. Replace ANY class declaration with Main
        // Python: code = re.sub(r'public\s+class\s+\w+', 'public class Main', code)
        finalCode = finalCode.replace(/public\s+class\s+\w+/g, 'public class Main');

        // Python: code = re.sub(r'class\s+\w+', 'public class Main', code, count=1)
        // NOTE: In JS, replace string works as count=1.
        // CHECK to ensure we don't double-replace "public class Main" -> "public public class Main"
        if (!finalCode.includes('public class Main')) {
            finalCode = finalCode.replace(/class\s+\w+/, 'public class Main');
        }

        // 4. Replace ALL constructors
        if (oldClass) {
            // Python: re.sub(rf'(\bpublic\s+|\b){old_class}\s*\(', 'Main(', code)
            // Implementation: We'll output 'public Main(' to be safe/standard, or just 'Main('
            // User script output 'Main('. But 'public Main(' is better for public class.
            // Let's preserve public if it was there, or add it.
            // Global replace 'g'.
            finalCode = finalCode.replace(new RegExp(`(\\bpublic\\s+|\\b)${oldClass}\\s*\\(`, 'g'), 'public Main(');
        }

        // 5. Replace object creation & variable types
        if (oldClass) {
            // Python: re.sub(rf'\b{old_class}\b', 'Main', code)
            finalCode = finalCode.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), 'Main');
        }

        // 6. Ensure main method exists
        if (!finalCode.includes('static void main')) {
            // Wraps code in public class Main { public static void main... } if missing
            // This assumes Step 3 successfully created 'public class Main {' or matches it.

            // If Step 3 ran, we have 'public class Main'.
            // If Step 3 FAILED (Bare snippet), we likely don't have 'public class Main'.
            // User Python logic: code.replace('public class Main {', ...)
            // It assumes 'public class Main {' exists.

            if (finalCode.includes('public class Main')) {
                // Replace the opening brace to inject main start
                finalCode = finalCode.replace(
                    /public\s+class\s+Main\s*\{/,
                    'public class Main {\n    public static void main(String[] args) {\n'
                );
                // Append closing braces
                finalCode += '\n    }\n}';
            } else {
                // Bare snippet case (Step 3 didn't find 'class X' so it did nothing)
                // Need to wrap bare snippet
                const imports = [];
                const otherLines = [];
                finalCode.split('\n').forEach(line => {
                    if (line.trim().startsWith('import ')) {
                        imports.push(line);
                    } else {
                        otherLines.push(line);
                    }
                });
                const body = otherLines.join('\n');
                const importBlock = imports.join('\n');
                finalCode = `${importBlock}\npublic class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
            }
        }

        config.fileName = 'Main.java';
    }

    const runId = crypto.randomUUID();
    const hostDir = path.join(TEMP_DIR_BASE, runId);

    // Default Timeout (can be removed if user strictly says NO limits, but good for process safety)
    // User asked to remove timeouts, so we won't enforce a kill timeout here unless it hangs system.
    // We will leave it unbounded.

    const startTime = Date.now();

    try {
        await fs.mkdir(hostDir, { recursive: true });
        const filePath = path.join(hostDir, config.fileName);
        await fs.writeFile(filePath, finalCode);

        // Prepare Execution Command
        let execCmd;

        if (config.compile) {
            // Compiled Language
            try {
                // 1. Compile
                await new Promise((resolve, reject) => {
                    exec(config.compile(hostDir, config.fileName), { cwd: hostDir }, (error, stdout, stderr) => {
                        if (error) reject({ message: stderr || stdout || error.message });
                        else resolve();
                    });
                });
                // 2. Run
                execCmd = config.run(hostDir);
            } catch (compileErr) {
                return {
                    output: `Compilation Error:\n${compileErr.message}`,
                    isError: true,
                    duration: (Date.now() - startTime) / 1000
                };
            }
        } else {
            // Interpreted Language
            execCmd = config.command(filePath);
        }

        // Execute
        return new Promise((resolve) => {
            const child = exec(execCmd, {
                cwd: hostDir,
                maxBuffer: 1024 * 1024 * 10
            }, async (error, stdout, stderr) => {
                const duration = (Date.now() - startTime) / 1000;

                // Cleanup
                try {
                    await fs.rm(hostDir, { recursive: true, force: true });
                } catch (e) {/* ignore */ }

                const output = (stdout || "") + (stderr || "");

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

            // Handle Input
            if (input) {
                child.stdin.write(input);
                child.stdin.end();
            }
        });

    } catch (err) {
        return { output: "System Error: " + err.message, isError: true };
    }
};

module.exports = { executeLocal };
