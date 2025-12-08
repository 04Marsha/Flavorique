const fs = require("fs");
const Post = require("../models/post");
const cloudinary = require("../middleware/cloudinary");

// exports.createPost = (req, res, next) => {
//   const url = req.protocol + "://" + req.get("host");
//   const post = new Post({
//     recipeName: req.body.recipeName,
//     yourName: req.body.yourName,
//     recipe: req.body.recipe,
//     imagePath: url + "/images/" + req.file.filename,
//     creator: req.userData.userId,
//   });
//   post
//     .save()
//     .then((createdPost) => {
//       res.status(201).json({
//         message: "Post Added Successfully",
//         post: {
//           ...createdPost,
//           id: createdPost._id,
//         },
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Creating a post failed!",
//       });
//     });
// };

// exports.updatePost = (req, res, next) => {
//   let imagePath = req.body.imagePath;
//   if (req.file) {
//     const url = req.protocol + "://" + req.get("host");
//     imagePath = url + "/images/" + req.file.filename;
//   }
//   const post = new Post({
//     _id: req.body.id,
//     recipeName: req.body.recipeName,
//     yourName: req.body.yourName,
//     recipe: req.body.recipe,
//     imagePath: imagePath,
//     creator: req.userData.userId,
//   });
//   Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
//     .then((result) => {
//       if (result.matchedCount > 0) {
//         res.status(200).json({
//           message: "Update successful",
//         });
//       } else {
//         res.status(401).json({ message: "Not Authorized" });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Couldn't update post!",
//       });
//     });
// };

// exports.getPosts = (req, res, next) => {
//   Post.find()
//     .then((documents) => {
//       res.status(200).json({
//         message: "Posts fetched successfully",
//         posts: documents,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Fetching posts failed!",
//       });
//     });
// };

// exports.getPost = (req, res, next) => {
//   Post.findById(req.params.id)
//     .then((post) => {
//       if (post) {
//         res.status(200).json(post);
//       } else {
//         res.status(404).json({ message: "Post not found!" });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Fetching post failed!",
//       });
//     });
// };

// exports.deletePost = (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
//     .then((result) => {
//       if (result.deletedCount > 0) {

//         res.status(200).json({
//           message: "Deletion successful",
//         });
//       } else {
//         res.status(401).json({ message: "Not Authorized!" });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Deleting posts failed!",
//       });
//     });
// };

// CREATE POST
exports.createPost = async (req, res, next) => {
  try {
    let imagePath = null;

    if (req.file) {
      // Upload temp file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "flavorique-posts", // any folder name you like
      });

      imagePath = result.secure_url; // HTTPS Cloudinary URL

      // Delete temp file
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Temp file delete error:", err);
      });
    }

    const post = new Post({
      recipeName: req.body.recipeName,
      yourName: req.body.yourName,
      recipe: req.body.recipe,
      imagePath: imagePath,          // <-- Cloudinary URL
      creator: req.userData.userId,
    });

    const createdPost = await post.save();

    res.status(201).json({
      message: "Post Added Successfully",
      post: {
        ...createdPost._doc,
        id: createdPost._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Creating a post failed!",
    });
  }
};

// UPDATE POST
exports.updatePost = async (req, res, next) => {
  try {
    let imagePath = req.body.imagePath; // existing URL from frontend

    // If a new file comes, upload new one to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "flavorique-posts",
      });

      imagePath = result.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Temp file delete error:", err);
      });
    }

    const post = new Post({
      _id: req.body.id,
      recipeName: req.body.recipeName,
      yourName: req.body.yourName,
      recipe: req.body.recipe,
      imagePath: imagePath,          // existing or new Cloudinary URL
      creator: req.userData.userId,
    });

    const result = await Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    );

    if (result.matchedCount > 0) {
      res.status(200).json({
        message: "Update successful",
      });
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Couldn't update post!",
    });
  }
};

// GET ALL POSTS
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

// GET SINGLE POST
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

// DELETE POST
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
