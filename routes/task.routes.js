const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");
const auth = require("../middleware/authMiddleware");

/* CREATE TASK */
router.post("/", auth, async (req, res) => {
  const { title, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title required" });
  }

  const task = {
    title,
    priority,
    completed: false,
    user: req.user.email,
    createdAt: new Date(),
  };

  const doc = await db.collection("tasks").add(task);
  res.json({ id: doc.id, ...task });
});

/* GET TASKS */
router.get("/", auth, async (req, res) => {
  const snapshot = await db
    .collection("tasks")
    .where("user", "==", req.user.email)
    .get();

  const tasks = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json(tasks);
});

/* UPDATE TASK */
router.put("/:id", auth, async (req, res) => {
  await db.collection("tasks").doc(req.params.id).update(req.body);
  res.json({ message: "Task updated" });
});

/* DELETE TASK */
router.delete("/:id", auth, async (req, res) => {
  await db.collection("tasks").doc(req.params.id).delete();
  res.json({ message: "Task deleted" });
});

module.exports = router;
