# MMM-Finviz

A MagicMirror² module that displays the **Finviz Stock Market Heatmap**. Get a high-level overview of the S&P 500 performance directly on your mirror.

![Finviz Heatmap](https://img.shields.io/badge/MagicMirror-Module-00AEEF?style=for-the-badge)

## ✨ Features

- 📈 **Live Heatmap**: Displays the signature Finviz S&P 500 heatmap.
- 🎨 **Clean Visuals**: Automatically fetches and maintains the latest heatmap image.
- ⚙️ **Customizable**: Configurable update intervals and module width.
- 🔄 **Automated Fetching**: Uses Playwright to headlessly capture the most recent market data.

## 🚀 Installation

1. Navigate to your MagicMirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```
2. Clone this repository:
   ```bash
   git clone https://github.com/schris88/MMM-Finviz.git
   ```
3. Install the required dependencies:
   ```bash
   cd MMM-Finviz
   npm install
   npx playwright install --with-deps chromium
   ```

## 🛠 Configuration

Add the module to your `config/config.js` file.

```javascript
{
    module: "MMM-Finviz",
    position: "top_right",
    config: {
        updateInterval: 60 * 60 * 1000, // Update every hour
        maxWidth: "100%"
    }
}
```

## ⚙️ Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `updateInterval` | `Number` | `86400000` | Sync frequency in milliseconds (Default: 24h). |
| `maxWidth` | `String` | `"100%"` | Maximum width of the module container. |
| `retryDelay` | `Number` | `5000` | Delay before retrying a failed fetch (in ms). |

## 🧬 How it Works

The module uses **Playwright** to headlessly navigate to the Finviz heatmap page. It captures a screenshot of the S&P 500 map, saves it locally to the `public/` folder, and notifies the Mirror to refresh the image. To prevent browser caching issues, the module appends a timestamp to the image URL each time it updates.

## ⚠️ Notes

- **Dependencies**: Playwright requires certain system libraries to run Chromium. If you encounter issues, ensure you've run `npx playwright install --with-deps`.
- **Market Hours**: Since this captures a live page, the data is most relevant during US market hours.

## 📄 License

MIT © [Christian Stengel](https://github.com/schris88)
