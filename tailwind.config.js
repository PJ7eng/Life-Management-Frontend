/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // 監控 src 目錄下所有 .js, .jsx, .ts, .tsx 文件
    ],
    theme: {
      extend: {}, // 可在此擴展自定義主題（如顏色、字體等）
    },
    plugins: [], // 可添加 Tailwind 插件
  };