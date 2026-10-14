/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // DESIGN.md Emerald & Dark Spruce Palette
        brand: {
          darkest: '#052E22', // Deepest Forest
          dark: '#064E3B',    // Hero & Footer Forest Green
          spruce: '#0B7A5C',  // Secondary / Hover
          emerald: '#10B981', // Emerald Accent
          primary: '#12B886', // Operational Green
          mint: '#E6F7EF',    // Tag & Light Mint Surface
          pale: '#F3F8FC',    // Pale Canvas Base
          slate: '#172B3A',   // Tertiary Navy / Headings
          neutral: '#526170', // Paragraph Slate
          border: '#E4EBF1',  // Hairline Border
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
