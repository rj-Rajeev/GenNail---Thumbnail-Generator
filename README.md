<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>🎬 AI YouTube Thumbnail Generator - GenNail</title>
</head>
<body style="font-family: Arial, sans-serif; background:#0d0d0d; color:#f2f2f2; line-height:1.6; padding:25px; max-width:1100px; margin:auto;">

  <!-- HEADER -->
  <h1 style="color:#ff0080; text-align:center; font-size:2.4rem;">🎬 GenNail — AI YouTube Thumbnail Generator</h1>
  <p style="text-align:center; font-size:1.2rem; color:#ccc; margin-bottom:20px;">
    Create <b>eye-catching, professional, and high-quality thumbnails</b> that drive clicks 🚀
  </p>

  <!-- PREVIEW -->
  <div style="text-align:center; margin:30px 0;">
    <img src="https://dummyimage.com/1280x720/000/fff&text=AI+Thumbnail+Preview"
         alt="Thumbnail Preview"
         style="max-width:100%; border:3px dashed #ff0080; border-radius:12px;">
  </div>

  <!-- ABOUT -->
  <h2 style="color:#ffcc00;">📖 What is GenNail?</h2>
  <p>
    GenNail is an <b>AI-powered YouTube thumbnail generator</b> designed for creators, educators, and marketers.  
    It focuses on delivering <span style="color:#ff0080;">engaging visuals, bold text, and click-worthy compositions</span> in seconds.  
    Unlike random AI art, GenNail is optimized for <b>video performance and user experience</b>.
  </p>

  <!-- FEATURES -->
  <h2 style="color:#ffcc00;">✨ Key Features</h2>
  <ul>
    <li>🎨 <b>Customizable Prompts</b> — Define style, theme, and subject</li>
    <li>🖼️ <b>Upload & Mix</b> — Add your face/logo/screenshot for authenticity</li>
    <li>⚡ <b>Fast Rendering</b> — Generate thumbnails in seconds</li>
    <li>📱 <b>Mobile-Ready UI</b> — Looks like a modern web app</li>
    <li>🛠️ <b>Preview Mode</b> — Compare thumbnails before download</li>
    <li>☁️ <b>Cloud Storage</b> — Integrated with Cloudinary</li>
    <li>🔮 <b>AI Scaling</b> — Adapt to trends, styles, and CTR optimization</li>
  </ul>

  <!-- HOW IT WORKS -->
  <h2 style="color:#ffcc00;">⚙️ How It Works</h2>
  <ol>
    <li>✍️ Enter a <b>prompt</b> describing your thumbnail (colors, text, layout)</li>
    <li>🖼️ (Optional) Upload your <b>photo/logo</b></li>
    <li>🤖 GenNail uses <b>AI image models</b> (via OpenRouter) to create the base</li>
    <li>🎨 Crisp <b>text overlays</b> are added for readability</li>
    <li>🚀 Preview, tweak, and save your <b>ready-to-upload thumbnail</b></li>
  </ol>

  <!-- EXAMPLE PROMPTS -->
  <h2 style="color:#ffcc00;">🖼️ Example Prompts</h2>
  <blockquote style="border-left:4px solid #ff0080; padding-left:12px; color:#ccc;">
    “Create a 1280x720 YouTube thumbnail for <b>GraphQL Crash Course</b>.  
    Neon pink & black theme, bold readable text on left,  
    GraphQL logo in circle, teacher face on right, dark futuristic background.”
  </blockquote>
  <blockquote style="border-left:4px solid #ff0080; padding-left:12px; color:#ccc;">
    “Thumbnail for <b>Top 10 AI Tools in 2025</b>.  
    Futuristic tech background, glowing blue text, icons of AI tools,  
    bold white headline, energetic style.”
  </blockquote>

  <!-- TECH STACK -->
  <h2 style="color:#ffcc00;">🛠️ Tech Stack</h2>
  <ul>
    <li>⚛️ <b>Next.js 14 (App Router)</b></li>
    <li>🎨 <b>Tailwind CSS</b></li>
    <li>☁️ <b>Cloudinary</b> (upload & overlays)</li>
    <li>🤖 <b>OpenRouter API</b> (AI models like GPT-image, Stable Diffusion)</li>
    <li>🔒 <b>TypeScript</b></li>
  </ul>

  <!-- INSTALLATION -->
  <h2 style="color:#ffcc00;">🚀 Installation & Setup</h2>
  <pre style="background:#1a1a1a; padding:12px; border-radius:6px; overflow:auto;">
git clone https://github.com/yourname/ai-thumbnail-generator.git
cd ai-thumbnail-generator
npm install
npm run dev
  </pre>

  <h3 style="color:#ff0080;">🔑 Environment Variables</h3>
  <pre style="background:#1a1a1a; padding:12px; border-radius:6px; overflow:auto;">
OPENROUTER_API_KEY=your_openrouter_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
  </pre>

  <!-- BEST PRACTICES -->
  <h2 style="color:#ffcc00;">💡 Best Practices for High-CTR Thumbnails</h2>
  <ul>
    <li>✔️ Use <b>bright colors</b> that contrast with YouTube’s dark mode</li>
    <li>✔️ Keep <b>text under 5 words</b> — big & bold</li>
    <li>✔️ Add <b>faces with emotion</b> — surprised, excited, happy</li>
    <li>✔️ Use <b>icons/logos</b> that people instantly recognize</li>
    <li>✔️ Test multiple thumbnails (A/B testing)</li>
  </ul>

  <!-- TROUBLESHOOTING -->
  <h2 style="color:#ffcc00;">🛠️ Troubleshooting</h2>
  <ul>
    <li>❌ <b>Blurry text?</b> — Generate background with AI, then overlay text manually</li>
    <li>❌ <b>Wrong aspect ratio?</b> — Always enforce <code>1280x720</code></li>
    <li>❌ <b>Weird faces?</b> — Use real photo upload + AI blend</li>
    <li>❌ <b>Not eye-catching?</b> — Add <b>neon outlines</b>, <b>high-contrast colors</b></li>
  </ul>

  <!-- SCALING -->
  <h2 style="color:#ffcc00;">📈 Scaling Your App</h2>
  <ul>
    <li>⚡ Use <b>caching</b> for frequently used prompts</li>
    <li>🖼️ Pre-generate multiple thumbnails per video</li>
    <li>📊 Add <b>analytics</b> to track CTR & engagement</li>
    <li>☁️ Store assets on <b>Cloudinary or S3</b> for speed</li>
    <li>🧑‍🤝‍🧑 Team collaboration (multi-user dashboard)</li>
  </ul>

  <!-- FAQ -->
  <h2 style="color:#ffcc00;">❓ FAQ</h2>
  <p><b>Q: Can AI generate perfect text?</b><br>
  A: No, AI text is often blurry. Use AI for design + manual text overlay for perfection.</p>

  <p><b>Q: Is it free?</b><br>
  A: Depends on your OpenRouter & Cloudinary plan usage.</p>

  <p><b>Q: Can I use my brand colors?</b><br>
  A: Yes, just include them in the prompt (e.g., “red & black theme”).</p>

  <!-- CONTRIBUTING -->
  <h2 style="color:#ffcc00;">🤝 Contributing</h2>
  <p>
    Contributions are welcome! Feel free to fork, submit issues, or create PRs.  
    Whether it’s <b>improving prompts, UI/UX, or scaling ideas</b>, your help makes GenNail better.
  </p>

  <!-- LICENSE -->
  <h2 style="color:#ffcc00;">📜 License</h2>
  <p>MIT License © 2025 — Built with ❤️ for content creators</p>

</body>
</html>
