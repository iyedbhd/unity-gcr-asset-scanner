# 🔍 Unity GCR Asset Scanner

A web-based tool to check which of your Unity Asset Store purchases from **Greater China Region** publishers will be removed on **March 31st, 2026**.

Due to updated regional licensing, distribution, and compliance policy requirements, assets from publishers based in Greater China Region (including Hong Kong and Macau) will be removed from the Global Unity Asset Store.

## 🌐 Live Demo

**[Use the Scanner →](https://iyedbhd.github.io/unity-gcr-asset-scanner/)**

## 📋 Features

- 📁 **Easy Export** - Copy-paste script to export your assets from Unity Asset Store
- 🔍 **Instant Scan** - Upload your JSON file and get immediate results
- 📊 **Visual Dashboard** - See statistics on affected vs safe assets
- 📥 **Export Report** - Download a detailed JSON report of affected assets
- 🔗 **Direct Links** - Quick access to asset pages for downloading

## 🚀 How to Use

### Step 1: Export Your Assets

1. Go to [Unity Asset Store - My Assets](https://assetstore.unity.com/account/assets)
2. Make sure you're **logged in**
3. Press **F12** to open Chrome DevTools
4. Go to the **Console** tab
5. Copy and paste the export script (available on the website)
6. Press **Enter** and wait for the `myassets.json` download

### Step 2: Scan Your Assets

1. Visit the scanner website
2. Upload your `myassets.json` file
3. View the results instantly!

## 📦 What Gets Detected

The scanner compares your owned assets against the official Unity list of assets from Greater China Region publishers being discontinued on March 31st, 2026. It detects:

- ✅ Exact name matches
- ✅ Partial name matches
- ✅ Publisher-based matches

## 💰 Refund Policy

- If you purchased an affected asset **within the past 6 months**, you can request a refund
- After a refund is issued, you will **lose entitlement** to that asset
- Your license remains valid - you can continue using assets in your projects
- Assets remain downloadable via Package Manager, but publishers won't provide updates or support after March 31st

## 🛠️ Local Development

To run locally:

1. Clone this repository
2. Open `index.html` in a browser
3. Or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

## 📁 Project Structure

```
unity-gcr-asset-scanner/
├── index.html              # Main HTML page
├── style.css               # Stylesheet
├── scanner.js              # Scanner logic
├── removed_assets_data.js  # GCR removal list data
└── README.md               # This file
```

## ⚠️ Disclaimer

- This tool is provided as-is for informational purposes
- Always verify important information directly with Unity
- Data is sourced from Unity's official announcement
- The scanner runs entirely in your browser - your data never leaves your device

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest improvements
- Submit pull requests

## 📄 License

MIT License - feel free to use and modify!

---

Made with ❤️ to help the Unity community
