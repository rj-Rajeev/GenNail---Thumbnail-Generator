# 🎬 AI YouTube Thumbnail Generator - GenNail

🚀 Create **eye-catching, professional, and high-quality YouTube thumbnails** using AI.
Supports **text prompts + image uploads** to generate thumbnails with the perfect size (**1280x720**) and YouTube-friendly design.

![Demo Preview](https://dummyimage.com/1280x720/000/fff&text=Thumbnail+Preview)

---

## ✨ Features

✔️ **AI-powered thumbnail generation** (using OpenRouter / OpenAI / Stable Diffusion).
✔️ **Custom prompts** → describe your style, theme, or message.
✔️ **Image upload support** → include your logo, face, or screenshots.
✔️ **Dark theme UI** with modern design.
✔️ **Preview in real-time** before saving.
✔️ **Cloudinary integration** for secure and scalable image uploads.
✔️ **Mobile-friendly** web app → works on phones and tablets.

---

## 🖼️ Example Outputs

📌 Example prompt:

> “Create a professional YouTube thumbnail at 1280x720. Neon pink & black theme.
> Title: GraphQL Crash Course. Bold readable text. Tech logo on left. Friendly teacher on right. Dark futuristic background.”

---

## 🛠️ Tech Stack

- **Next.js 14 (App Router)** → full-stack React framework
- **Tailwind CSS** → clean & responsive styling
- **Cloudinary** → image upload & management
- **OpenRouter (AI Models)** → text-to-image generation
- **TypeScript** → type safety and developer experience

---

## 📂 Project Structure

```
/app
 ├─ /api
 │   ├─ /generate   → AI thumbnail generation route
 │   ├─ /upload     → Cloudinary upload route
 ├─ /page.tsx       → main UI page

/components
 ├─ ThumbnailForm.tsx     → form for prompt + image upload
 ├─ ThumbnailPreview.tsx  → live preview of generated thumbnail

/lib
 ├─ openai.ts             → AI helper functions
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourname/ai-thumbnail-generator.git
cd ai-thumbnail-generator
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4️⃣ Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 How It Works

1. 📝 Enter a **prompt** (e.g. _“Neon gaming thumbnail with bold yellow text ‘Epic Win!’”_).
2. 📤 Optionally **upload an image** (face, logo, screenshot).
3. 🤖 Our **AI generator** creates a **1280x720 thumbnail**.
4. 👀 Instantly **preview** your thumbnail in the UI.
5. 💾 Save or use it directly in your YouTube video.

---

## 📈 Improving Thumbnail Quality

AI sometimes struggles with **perfect text rendering**. To get the best results:

- Use AI for **background + subject**.
- Overlay **real crisp text** programmatically (Cloudinary text overlays, Sharp.js, or simple `<canvas>` rendering).
- Keep prompts **specific**:

  - Mention **colors** (e.g., neon pink, bold yellow).
  - Mention **composition** (e.g., logo on left, person on right).
  - Mention **style** (e.g., cinematic, glowing, 3D, clean).

---

## 🔮 Roadmap

- [ ] 🎨 Add **drag-and-drop** editor for text overlays
- [ ] 🧑‍🤝‍🧑 Multi-user accounts & saved designs
- [ ] ⚡ Batch generate multiple thumbnails at once
- [ ] 📊 A/B testing integration to test thumbnail performance

---

## 🤝 Contributing

Pull requests are welcome!
If you have ideas for better **styles, prompts, or UI improvements**, feel free to contribute.

---

## 📜 License

MIT License © 2025 — Made with ❤️ for creators.

---

👉 With this app, you’ll **never need Photoshop** just to make a YouTube thumbnail again.
Start creating **stunning, eye-catching banners** that boost your clicks 🚀
