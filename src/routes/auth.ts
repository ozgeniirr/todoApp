// src/routes/auth.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// REGISTER → Yeni kullanıcı oluştur
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ message: "Bu e-mail zaten kayıtlı." });
       return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Kayıt başarılı", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

// LOGIN → Kullanıcı giriş ve JWT üretimi
router.post("/login", async (req: Request , res: Response ): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ message: "Kullanıcı bulunamadı." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Şifre hatalı." });
      return;
    }

    // JWT token üret
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ message: "Giriş başarılı", token });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

// PROFILE → Korunan route
router.get("/profile", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Middleware'den gelen userId ile kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ message: "Kullanıcı bulunamadı" });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

export default router;
