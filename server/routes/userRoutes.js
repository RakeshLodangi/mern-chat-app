
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/users - get all users except current user
router.get('/', protect, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

module.exports = router;
