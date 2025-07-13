# 使用 Node.js 20 作為基礎鏡像
FROM node:20

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package.json ./
COPY package-lock.json* ./

# 安裝依賴
RUN npm install

# 安裝 serve 用於生產模式（可選）
RUN npm install -g serve

# 複製項目文件
COPY . .

# 暴露端口（Vite 默認使用 5173）
EXPOSE 5173

# 默認啟動命令（開發模式）
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]