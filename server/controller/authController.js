const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*================ GET PROFILE ===============*/ 
exports.getProfile = async(req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    if(!user){
      return res.status(404).json({ message: "User not found "});
    }

    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await db('users')
      .insert({ name, email, password: hashedPassword })
      .returning(['id', 'name', 'email']);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateProfile = async(req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const [user] = await db('users')
    .where({ id })
    .update(updates)
    .returning([ 'id', 'name', 'email']);

    if(!user){
      return res.status(404).json({ message: "User not found"});
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
}

/* ================= DELETE ================= */
exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db('users').where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add productController.js file in which admin can add, update, delete & view product. after add cartContoller.js in which user can add & remove product from cart. after add orderContoller.js file in which user can order the product, cancel order. for product image, use cloudinary & multer. also put different permissions in '001_user_seed.js' so when admin can login then admin can add, update & delete product, & user only view product.