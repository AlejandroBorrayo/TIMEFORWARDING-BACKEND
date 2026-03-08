import multer from "multer";

const storage = multer.memoryStorage(); // usa memory si lo mandarás a S3 o DB

export const upload = multer({ storage });

