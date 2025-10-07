# 🚀 Quick Setup Instructions for Recipe Finder App

## Step 1: Prerequisites Check

Make sure you have Node.js installed:

```bash
node --version
npm --version
```

If not installed, download from: <https://nodejs.org/>

## Step 2: Navigate to Project

```bash
cd Session11_Intro_React/recipe-finder-app
```

## Step 3: Install Dependencies

```bash
npm install
```

This will install:

- React 18 (latest version)
- React DOM
- Parcel (zero-config bundler)

## Step 4: Start Development Server

```bash
npm run dev
```

or

```bash
npm start
```

## Step 5: Open in Browser

Your default browser should automatically open to:

```
http://localhost:3000
```

If not, manually navigate to that URL.

## 🎉 Success

You should see the Recipe Finder app with:

- Beautiful gradient header
- Search functionality
- Recipe cards with images
- Dark/Light theme toggle
- Responsive design

## 🛠️ Development Tips

- **Hot Reloading**: Changes automatically refresh the browser
- **Console**: Check browser developer tools for any errors
- **Network**: Images load from Unsplash (requires internet)

## 📝 What to Try

1. Search for "pasta" or "chicken"
2. Toggle between light and dark themes
3. Hover over recipe cards for animations
4. Click "View Full Recipe" buttons
5. Try the app on mobile (responsive design)

## 🐛 Troubleshooting

**Port already in use?**

- The app runs on port 3000 by default
- If port 3000 is busy, specify a different port:

```bash
npm run dev -- --port 3001
```

**Dependencies not installing?**

```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

**Images not loading?**

- Check your internet connection
- The app uses Unsplash CDN for images

---

**Enjoy learning React! 🎯**
