import React, { useState, useEffect } from 'react';
import { executeCode, checkHealth } from '../api';

const SafeModeTest = () => {
    const [status, setStatus] = useState('CHECKING...');
    const [details, setDetails] = useState('');

    const runTest = async () => {
        setStatus('PINGING BACKEND...');
        try {
            // 1. Check basic GET
            const health = await checkHealth();
            setDetails(d => d + `\n[GET] /api/test: SUCCESS (${JSON.stringify(health)})`);

            // 2. Check POST execution
            setStatus('TESTING EXECUTION...');
            const exec = await executeCode('print("hello")', 'python3');
            setDetails(d => d + `\n[POST] /api/execute: SUCCESS (${JSON.stringify(exec)})`);

            setStatus('✅ SYSTEM OPERATIONAL');
        } catch (err) {
            console.error(err);
            setStatus('❌ CONNECTION FAILED');
            setDetails(d => d + `\nERROR: ${err.message}\nCheck console for details.`);
        }
    };

    useEffect(() => {
        runTest();
    }, []);

    return (
        <div style={{
            padding: '20px',
            margin: '20px',
            border: '4px solid ' + (status.includes('✅') ? 'green' : 'red'),
            backgroundColor: '#1e1e1e',
            color: '#fff',
            fontFamily: 'monospace'
        }}>
            <h2>🛡️ SAFE MODE DIAGNOSTIC</h2>
            <h1>{status}</h1>
            <pre style={{ background: '#000', padding: '10px' }}>
                {details}
            </pre>
            <button
                onClick={runTest}
                style={{
                    padding: '10px 20px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                RE-RUN TEST
            </button>
            <p>
                If this works, your previous errors were due to:<br />
                1. Database hanging<br />
                2. Bad Proxy setup<br />
                3. Wrong Port
            </p>
        </div>
    );
};

export default SafeModeTest;
