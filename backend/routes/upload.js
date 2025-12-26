const upload = require("../middleware/upload");

router.post("/create", upload.single("image"), createRecipe);
