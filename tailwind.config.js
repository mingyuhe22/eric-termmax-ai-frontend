// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主背景顏色
        background: {
          DEFAULT: '#0a0d19', // 深藍色主背景
          secondary: '#0c1624', // 卡片背景
          tertiary: '#0a1525', // 輸入框、下拉選單背景
        },
        // 文字顏色
        text: {
          DEFAULT: '#ffffff', // 主要文字
          secondary: '#9ca3af', // 次要文字
          tertiary: '#6b7280', // 描述性文字
        },
        // 主題顏色
        primary: {
          DEFAULT: '#47A6E5', // 主要強調色 - 亮藍色
          hover: '#3a91c9', // 懸停狀態
          light: '#78bdec', // 較亮版本
        },
        // 邊框顏色
        border: {
          DEFAULT: '#1e2c3b', // 主要邊框
          light: '#2a3e54', // 較亮邊框
        },
        // 強調顏色
        accent: {
          success: '#4CC38A', // 成功
          warning: '#F59E0B', // 警告
          danger: '#EF4444', // 危險
          purple: '#8A63D2', // 紫色強調
        }
      },
    },
  },
  plugins: [],
}