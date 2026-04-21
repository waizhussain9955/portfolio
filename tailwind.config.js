/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: "var(--color-bg-primary)",
                    secondary: "var(--color-bg-secondary)",
                    card: "var(--color-bg-card)",
                },
                accent: {
                    primary: "var(--color-accent-primary)",
                    secondary: "var(--color-accent-secondary)",
                    light: "var(--color-accent-light)",
                },
                text: {
                    primary: "var(--color-text-primary)",
                    secondary: "var(--color-text-secondary)",
                    muted: "var(--color-text-muted)",
                },
                glow: "var(--color-glow)",
            },
            backgroundImage: {
                "gradient-primary": "var(--gradient-primary)",
                "gradient-text": "var(--gradient-text)",
            },
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                body: ["var(--font-body)", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            borderColor: {
                DEFAULT: "var(--color-border)",
            },
        },
    },
    plugins: [],
};
