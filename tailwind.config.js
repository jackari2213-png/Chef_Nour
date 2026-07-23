/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#FFF8E1',
                    100: '#FFECB3',
                    200: '#FFE082',
                    300: '#FFD54F',
                    400: '#FFCA28',
                    500: '#F57C00', // Primary Chef Nour Orange
                    600: '#EF6C00',
                    700: '#E65100',
                    800: '#BF360C',
                    900: '#8D2600',
                },
                surface: {
                    bg: '#FAFAFA',
                    card: '#FFFFFF',
                    dark: '#111827',
                    darkCard: '#1F2937',
                },
                accent: {
                    green: '#4CAF50',
                    red: '#E53935',
                    gold: '#FFB300',
                }
            },
            fontFamily: {
                arabic: ['Tajawal', 'Cairo', 'sans-serif'],
                latin: ['Inter', 'Poppins', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
                'card': '0 10px 30px -5px rgba(0, 0, 0, 0.06)',
                'orange-glow': '0 8px 25px -5px rgba(245, 124, 0, 0.35)',
            }
        },
    },
    plugins: [],
}
