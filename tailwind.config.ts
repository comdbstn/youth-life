import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 게임 UI 컬러 팔레트
        'cyber-blue': '#00D9FF',
        'neon-pink': '#FF2E63',
        'neon-green': '#00FF9F',
        'neon-gold': '#FFEB3B',
        'dark-navy': '#0A0E27',
        'dark-bg': '#0F1629',
        'dark-card': '#1A1F3A',
        'dark-border': '#2A3F5F',

        // 테마 컬러
        execute: '#FF6B35',     // 🔥 실행의 날
        focus: '#4ECDC4',       // 🧱 집중의 날
        organize: '#45B7D1',    // 💧 정리의 날
        expand: '#96CEB4',      // 🌳 확장의 날
        wrap: '#FFEAA7',        // ⚙ 마감의 날
        recover: '#DFE6E9',     // 🪶 회복의 날
        reflect: '#A29BFE',     // 🌙 성찰의 날
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 217, 255, 0.5)',
        'neon-pink': '0 0 10px rgba(255, 46, 99, 0.5)',
        'neon-green': '0 0 10px rgba(0, 255, 159, 0.5)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'level-up': 'levelUp 1s ease-out',
        'exp-gain': 'expGain 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 1)' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        expGain: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
