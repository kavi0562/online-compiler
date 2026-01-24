const fs = require('fs');
const path = require('path');

// Basic In-Memory Blacklist (For persistent, use Redis/DB)
const SECURITY_VIOLATIONS = {};
const BLACKLIST_THRESHOLD = 3; // Block user after 3 security alerts
const BLACKLIST = new Set();

const LOG_FILE = path.join(__dirname, '../../server.log');

/**
 * Log event to console and file (and handle security alerts)
 * @param {string} type - 'INFO' | 'WARN' | 'security' | 'ERROR'
 * @param {object} data - Structured data to log
 */
const logEvent = (type, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level: type.toUpperCase(),
        ...data
    };

    const logString = JSON.stringify(logEntry);

    // 1. Console Output (Colorized for dev)
    if (type === 'security') {
        console.warn(`🚨 [SECURITY]`, logString);
    } else if (type === 'error') {
        console.error(`❌ [ERROR]`, logString);
    } else {
        console.log(`ℹ️ [INFO]`, logString);
    }

    // 2. File Output
    fs.appendFile(LOG_FILE, logString + '\n', (err) => {
        if (err) console.error("Logged Write Failed:", err);
    });

    // 3. Security Watchlist Logic
    if (type === 'security' && data.ip) {
        const ip = data.ip;
        SECURITY_VIOLATIONS[ip] = (SECURITY_VIOLATIONS[ip] || 0) + 1;

        if (SECURITY_VIOLATIONS[ip] >= BLACKLIST_THRESHOLD) {
            BLACKLIST.add(ip);
            console.error(`🚫 [BLACKLIST] IP ${ip} has been blocked due to repeated violations.`);
        }
    }
};

/**
 * Check if IP is blacklisted
 */
const isBlocked = (ip) => BLACKLIST.has(ip);

module.exports = { logEvent, isBlocked };
