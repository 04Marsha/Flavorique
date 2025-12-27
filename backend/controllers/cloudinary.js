const Post = require("../models/post");

exports.createRecipe = async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : null;

    const post = new Post({
      recipeName: req.body.title,
      yourName: req.body.yourName || "",
      recipe: req.body.description,
      imagePath: imagePath,
      creator: req.userData?.userId,
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
