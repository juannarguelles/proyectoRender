const mongoose = require("mongoose");
const { marked } = require("marked");
const slugify = require("slugify");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const dompurify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    require: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    require: true,
  },
});

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

module.exports = mongoose.model("Article", articleSchema);
