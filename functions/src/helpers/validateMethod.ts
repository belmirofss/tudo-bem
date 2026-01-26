import { Request, Response } from "express";

function validateMethod(
  req: Request,
  res: Response,
  allowedMethod: string,
): boolean {
  if (req.method !== allowedMethod) {
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

export { validateMethod };
