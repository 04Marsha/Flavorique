const Post = require("../models/post");

exports.createPost = async (req, res, next) => {
  try {
    console.log("FILE: ", req.file);
    const imagePath = req.file ? req.file.path : null;

    const post = new Post({
      recipeName: req.body.recipeName,
      yourName: req.body.yourName,
      recipe: req.body.recipe,
      imagePath: imagePath,
      creator: req.userData.userId,
    });

    const createdPost = await post.save();

    return res.status(201).json({
      message: "Post Added Successfully",
      post: {
        ...createdPost._doc,
        id: createdPost._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Creating a post failed!",
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let imagePath = req.body.imagePath;

    if (req.file) {
      imagePath = req.file.path;
    }

    const result = await Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      {
        recipeName: req.body.recipeName,
        yourName: req.body.yourName,
        recipe: req.body.recipe,
        imagePath: imagePath,
      }
    );

    if (result.matchedCount > 0) {
      return res.status(200).json({ message: "Update successful" });
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    console.error("UPDATE POST ERROR:", error);
    return res.status(500).json({ message: "Couldn't update post!" });
  }
};

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Deletion successful",
        });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting posts failed!",
      });
    });
};
