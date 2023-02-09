const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    // Para rechazar el archivo es necesario pasar `false`, de la siguiente forma:
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("El tipo de archivo no es permitido"), false);
      return;
    }
    // Para aceptar el archivo es necesario pasar `true`, de la siguiente forma:
    cb(null, true);
  },
});
