const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");

exports.createRecipe = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "flavorique",
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating recipe" });
  }
};
