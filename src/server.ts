import express from "express";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";

const app = express();
const PORT = 3000;

// GÖVDEYİ PARÇALAYACAK ORTAK MIDDLEWARE (ÇOK ÖNEMLİ!)
app.use(express.json()); // <-- BU SATIR ÇOK ÖNEMLİ

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
