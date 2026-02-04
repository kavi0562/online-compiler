import axios from 'axios';

// Create axios instance with explicit config
// In 'proxy' mode (CRA), we just use relative paths '/api/...'
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout to catch 504s early
});

export const checkHealth = async () => {
    try {
        const response = await api.get('/test');
        return response.data;
    } catch (error) {
        console.error("Health Check Failed:", error);
        throw error;
    }
};

export const executeCode = async (code, language) => {
    try {
        console.log("Sending execution request...", { language });
        const response = await api.post('/execute', {
            script: code,
            language: language,
            versionIndex: "0",
        });
        return response.data;
    } catch (error) {
        console.error("Execution Failed:", error);
        throw error;
    }
};

export default api;
