const { executeDocker } = require('../server/utils/dockerSandbox');

// MOCK: Config for test
// We are testing executeDocker directly, bypassing regex validation
// This proves that even if regex fails, Docker saves us.

const runTest = async (name, payload, expected) => {
    console.log(`\n🔹 TEST: ${name}`);
    console.log(`   Payload: ${payload.replace(/\n/g, ' ')}`);

    // Using Python for all checks as it's easiest to express these
    const result = await executeDocker('python', payload);

    console.log(`   Result Output: "${result.output.trim()}"`);
    console.log(`   Is Error: ${result.isError}`);
    console.log(`   Duration: ${result.duration}s`);

    if (result.output.includes(expected) || (expected === 'TIMEOUT' && result.output.includes('Execution Timed Out'))) {
        console.log(`   ✅ PASS`);
    } else {
        console.log(`   ❌ FAIL (Expected "${expected}")`);
    }
};

(async () => {
    console.log("🛡️ STARTING SECURITY PROOF 🛡️");

    // 1. TIMEOUT TEST
    await runTest(
        "Infinite Loop (Timeout)",
        "while True: pass",
        "TIMEOUT"
    );

    // 2. ISOLATION TEST (Try to list root or /etc)
    // Docker should show its own filesystem, not host's. 
    // Host has /Users/kavi, container has /app, /bin, etc.
    // If we see 'app', it's the container.
    await runTest(
        "Filesystem Isolation",
        "import os; print(os.listdir('/'))",
        "app"
    );

    // 3. READ-ONLY FILESYSTEM TEST
    await runTest(
        "Read-Only Write Attempt",
        "with open('/junk.txt', 'w') as f: f.write('hacked')",
        "Read-only file system"
    );

    // 4. FORK BOMB TEST
    // Python fork bomb. Should hit pids-limit and crash quickly/safely.
    // Note: This might be dangerous if pids-limit not working.
    await runTest(
        "Fork Bomb (PIDs Limit)",
        "import os\nwhile True: os.fork()",
        "Resource temporarily unavailable" // or "Runtime Error" / captured by strict limit
    );

    console.log("\n🛡️ SECURITY PROOF COMPLETE 🛡️");
})();
