require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const port = process.env.PORT || 3000;
const methodOverride = require("method-override");
const Article = require("../models/article");
const articlesRouter = require("../routes/article.routes");
const cors = require("cors");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createAt: "desc",
  });
  res.render("index", { articles: articles });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado con MongoDB Atlas"))
  .catch((err) => console.log(err));

app.use("/", articlesRouter);

app.use("/public/", express.static("./public"));

app.listen(port, () => console.log(`Puerto escuchando en ${port}`));
