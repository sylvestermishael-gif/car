import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parser limit configuration for potential future APIs
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Standard API health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online", 
      service: "AutoAventus Backend Engine", 
      timestamp: new Date().toISOString() 
    });
  });

  // Client-side static delivery vs. Development Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting AutoAventus server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting AutoAventus server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files compiled by Vite build
    app.use(express.static(distPath));
    
    // Route fallback to single-page client app index
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoAventus backend unified server is listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical error starting backend server:", error);
  process.exit(1);
});
