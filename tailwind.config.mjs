/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-red': '#FF4B4B',   // Adjust these hex codes as needed
                'primary-blue': '#4B7BFF',
                'primary-green': '#4BFF4B',
                'text-dark': '#1a1a1a',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                anton: ['var(--font-anton)', 'sans-serif'],
                dancing: ['var(--font-dancing)', 'cursive'],
            },
        },
    },
    plugins: [],
};
