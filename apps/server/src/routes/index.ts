import fs from "fs";
import path from "path";
import { Request, Router } from "express";
import multer, { FileFilterCallback } from "multer";
import { processTransactions } from "../services";
import iconv from "iconv-lite";

const router: Router = Router();

// const uploadDir = path.join(process.cwd(), "uploads");
// fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     const safeName = `${Date.now()}-${file.originalname}`;
//     cb(null, safeName);
//   },
// });

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const isCsv = file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv");

  if (!isCsv) {
    return cb(new Error("Only CSV files are allowed"));
  }

  return cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

router.get("/", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const decoded = iconv.decode(req.file.buffer, "windows1250");
    await processTransactions(decoded);
  } catch (e) {
    return res.status(201).json({
      message: "Error",
    });
  }

  return res.status(201).json({
    message: "Success",
  });
});

export default router;
