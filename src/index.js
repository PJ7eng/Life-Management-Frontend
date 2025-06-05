// 引入 React 核心庫
import React from 'react';
// 引入 ReactDOM 客戶端渲染方法
import ReactDOM from 'react-dom/client';
// 引入全局樣式
import './index.css';
// 引入根組件
import App from './App.jsx';
// 引入性能監測工具
import reportWebVitals from './reportWebVitals';

// 創建根渲染節點
const root = ReactDOM.createRoot(document.getElementById('root'));
// 渲染應用
root.render(
  // 嚴格模式，用於突出顯示應用中的潛在問題
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 報告網頁性能指標
reportWebVitals();
