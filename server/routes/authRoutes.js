const express = require("express");
const { signup, login, getProfile, updateProfile, deleteProfile } = require("../controller/authController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", getProfile);
router.put("/update/:id", auth, updateProfile);
router.delete("/delete/:id", auth, deleteProfile);

module.exports = router;
