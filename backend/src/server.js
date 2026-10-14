// /home/z/my-project/UrbanDana/backend/src/server.js
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🧢 UrbanDana API running at http://localhost:${PORT}`);
  console.log(`   → http://localhost:${PORT}/api/products`);
});
