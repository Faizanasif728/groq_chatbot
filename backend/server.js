const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const groqRoutes = require("./routes/groqRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/groq", groqRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
