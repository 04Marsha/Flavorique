const Post = require("../models/post");

exports.createRecipe = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    const imagePath = req.file ? req.file.path : null;

    const post = new Post({
      recipeName: req.body.title, // map title → recipeName
      yourName: req.body.yourName || "", // optional
      recipe: req.body.description, // map description → recipe
      imagePath: imagePath, // Cloudinary URL
      creator: req.userData?.userId, // if auth exists
    });

    const createdPost = await post.save();

    return res.status(201).json({
      message: "Recipe created using Post schema",
      post: {
        ...createdPost._doc,
        id: createdPost._id,
      },
    });
  } catch (err) {
    console.error("CREATE RECIPE ERROR:", err);
    return res.status(500).json({ message: "Error creating recipe" });
  }
};
