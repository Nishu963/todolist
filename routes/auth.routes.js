const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const token = jwt.sign({ email }, "SECRET_KEY", {
    expiresIn: "1d",
  });

  res.json({ token });
});

module.exports = router;
