/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#1e1e1e', // VS Code Editor BG
                header: '#2d2d2d', // VS Code Header
                sidebar: '#252526', // VS Code Sidebar
                terminal: '#181818', // Close to black
                accent: '#4f46e5', // Indigo-600
                success: '#059669', // Emerald-600
                error: '#f43f5e', // Rose-500
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
