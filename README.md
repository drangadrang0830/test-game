# Vue 像素風格問答遊戲 (Pixel Art Quiz Game)

這是一個使用 Vue 3、Vite 和 Google Apps Script 構建的復古風格問答遊戲。

## ✨ 特色
- **像素藝術介面**：採用 "Press Start 2P" 字體打造復古美學。
- **動態題庫**：從 Google 試算表 (Google Sheet) 動態獲取題目。
- **伺服器端計分**：透過 Google Apps Script 進行安全的後端計分。
- **個性化頭像**：使用 DiceBear API 根據玩家名稱生成獨特的像素頭像。

## 🛠️ 安裝與本地執行

1. **複製專案**
   \`\`\`bash
   git clone <repository-url>
   cd pixel-quiz-game
   \`\`\`

2. **安裝依賴**
   \`\`\`bash
   npm install
   \`\`\`

3. **設定環境變數**
   - 複製 \`.env.example\` 檔案並重新命名為 \`.env\`
   - 將 `VITE_GOOGLE_APP_SCRIPT_URL` 更新為您部署的 Google Apps Script Web App 網址。

4. **啟動開發伺服器**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🚀 部署 (GitHub Pages)

本專案已設定好 GitHub Actions，可自動部署至 GitHub Pages。

### 事前準備
1. **Google Apps Script 網址**：您需要已部署的 Google Apps Script Web App 網址。
2. **GitHub 儲存庫**：將此程式碼推送到 GitHub 儲存庫。

### 設定步驟
1. 進入您的 GitHub 儲存庫頁面，點擊 **Settings** (設定) > **Secrets and variables** > **Actions**。
2. 點擊 **New repository secret** (新增儲存庫密鑰)。
3. **Name (名稱)**: 輸入 `VITE_GOOGLE_APP_SCRIPT_URL`。
4. **Value (值)**: 輸入您的 Google Apps Script 完整網址 (例如 `https://script.google.com/macros/s/.../exec`)。
5. 點擊 **Add secret** (新增密鑰)。
6. 將您的程式碼推送到 `main` (或 `master`) 分支。
7. GitHub Action 將會自動建置並將應用程式部署到 `gh-pages` 分支。
8. 進入 **Settings** > **Pages**，確認 Source (來源) 已設定為 `gh-pages` 分支。

## 🧰 技術棧
- Vue 3 + Vite
- Pinia (狀態管理)
- Axios (API 請求)
- Google Apps Script (後端邏輯)
- DiceBear API (頭像生成)

## 📊 測試題庫範例 (生成式 AI 基礎知識)


您可以複製以下內容並貼上到您的 Google 試算表 `題目` 分頁中 (請使用「資料剖析」或直接貼上測試)。

```text
No Question A B C D Answer
1 生成式 AI (Generative AI) 的主要功能是什麼？ 分類數據 創造新內容 儲存資料 執行算術運算 創造新內容
2 下列哪一個是目前著名的「大型語言模型」 (LLM)？ Excel GPT-4 Firefox Photoshop GPT-4
3 GPT 中的 "P" 代表什麼？ Processing (處理) Pre-trained (預訓練) Programming (程式設計) Protocol (協定) Pre-trained (預訓練)
4 在與 AI 溝通時，「Prompt」指的是什麼？ AI 的名字 用戶輸入的指令或提示詞 電腦的硬體 網路速度 用戶輸入的指令或提示詞
5 下列哪一個主要是用於「生成圖像」的 AI 模型？ ChatGPT Midjourney Google Translate Siri Midjourney
6 當 AI 產生不正確或無中生有的資訊時，這種現象被稱為什麼？ 夢遊 (Sleepwalking) 幻覺 (Hallucination) 錯誤 (Bug) 病毒 (Virus) 幻覺 (Hallucination)
7 Transformer 架構主要對於哪一類任務有重大突破？ 圖像壓縮 自然語言處理 (NLP) 電池管理 3D 列印 自然語言處理 (NLP)
8 ChatGPT 是由哪一家公司開發的？ Google Apple OpenAI Microsoft OpenAI
9 「微調」(Fine-tuning) 在 AI 訓練中指的是什麼？ 調整螢幕亮度 在特定數據集上進一步訓練模型 重新安裝作業系統 清除電腦灰塵 在特定數據集上進一步訓練模型
10 在大型語言模型中，「Token」通常被視為什麼？ 虛擬貨幣 AI 處理文本的基本單位 登入密碼 遊戲代幣 AI 處理文本的基本單位
```


