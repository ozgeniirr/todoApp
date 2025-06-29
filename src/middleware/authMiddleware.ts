import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// req.userId'yi Typescript'e tanıt
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Yetkisiz: Token bulunamadı" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    req.userId = decoded.userId;
    next(); // middleware'den geçiş başarılı
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};
