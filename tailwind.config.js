/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-out': {
                    '0%': { opacity: '1', transform: 'translateY(0Y)' },
                    '100%': { opacity: '0', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-out forwards',
                'fade-out': 'fade-out 0.2s ease-in-out forwards',
            },
            boxShadow: {
                'custom-large': '0 30px 50px rgba(0, 0, 0, 0.9)',
            }
        },
    },

    plugins: [],
}

