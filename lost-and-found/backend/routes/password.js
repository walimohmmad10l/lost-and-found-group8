const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

// POST /api/password/forgot
// User submits their email → we generate a reset token
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });

    // Always return success even if email not found (security best practice)
    if (!user) {
      return res.json({ message: 'If that email exists, a reset token has been generated.' });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    // In a real app you'd email this link. For college project, we return it directly.
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    res.json({
      message: 'Reset token generated successfully.',
      resetLink, // ← show this to the user so they can click it
      token       // ← also send raw token for convenience
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/password/reset
// User submits token + new password
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // expiry must be in the future
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
    }

    // Set new password and clear the reset token
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully! You can now log in.' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
