const express = require("express");
const Article = require("../models/article");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/new", (req, res) => {
  res.render("new", { article: new Article() });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("show", { article: article });
});

router.post("/new", upload.single("image"), async (req, res) => {
  try {
    // Subida de imagen a cloudinary
    const imgcloudinary = await cloudinary.uploader.upload(req.file.path);

    // Crear Nuevo Articulo
    let article = new Article({
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown,
      image: imgcloudinary.secure_url,
      cloudinary_id: imgcloudinary.public_id,
    });
    // Guardamos articulo en MongoDB
    await article.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let articleId = await Article.findById(req.params.id);

    // Eliminamos img de cloudinary
    await cloudinary.uploader.destroy(articleId.cloudinary_id);

    // Eliminar articulo de MongoDB
    await articleId.remove();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
