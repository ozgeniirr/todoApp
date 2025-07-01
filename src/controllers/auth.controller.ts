import { Request, Response } from "express";
import prisma from "../config/prisma";
import{
    registerUserService,
    loginUserService,
    getProfileService,
} from "../services/auth.service";

import { registerSchema } from "../validators/userValidator";


export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const userData = parsed.data;

  try {
    const newUser = await registerUserService(userData);
    return res.status(201).json({ message: "Kayıt başarılı", userId: newUser.id });
  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ message: "Bu e-mail zaten kayıtlı." });
    }

    return res.status(500).json({ message: "Sunucu hatası", error });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const userData = parsed.data;

  try {
    const result = await loginUserService(userData);
    return res.json({ message: "Giriş başarılı", token: result.token });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }
    if (error.message === "INVALID_PASSWORD") {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    return res.status(500).json({ message: "Sunucu hatası", error });
  }
};



export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await getProfileService((req as any).userId);
    res.json({ user });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    return res.status(500).json({ message: "Sunucu hatası", error });
  }
};


