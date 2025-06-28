import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
  