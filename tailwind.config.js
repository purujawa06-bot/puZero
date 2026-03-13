/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './views/**/*.ejs',
        './public/js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: '#0f172a',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'spin-slow': 'spin 3s linear infinite',
                'loading-bar': 'loading-bar 1.5s infinite linear',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate3d(0px, 0px, 0) scale(1)' },
                    '33%': { transform: 'translate3d(30px, -50px, 0) scale(1.1)' },
                    '66%': { transform: 'translate3d(-20px, 20px, 0) scale(0.9)' },
                    '100%': { transform: 'translate3d(0px, 0px, 0) scale(1)' },
                },
                'loading-bar': {
                    '0%': { transform: 'translate3d(-100%, 0, 0)' },
                    '100%': { transform: 'translate3d(100%, 0, 0)' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}