const express = require("express");
const PostController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("", checkAuth, upload, PostController.createPost);

router.put("/:id", checkAuth, upload, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
