const router = require("express").Router();
const { User, Thought, Reaction } = require("../models");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users/:_id", async (req, res) => {
  try {
    const users = await User.findOne({
      _id: req.params._id,
    });
    res.status(200).json({ umm: "UMM", user: users });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/users", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/users/:_id", async (req, res) => {
  try {
    const user = await User.updateOne({
      _id: req.params.id,
      username: req.body.username,
      email: req.body.email,
    });
    res.status(200).json({
      message: "User updated",
      user: user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// Create a DELETE route to delete an item
router.delete("/users/:_id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params._id);
    res.status(200).json({ user: user, message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find({});
  res.status(200).json(thoughts);
});

// Create a GET route to get all items
router.get("/thoughts/:_id", async (req, res) => {
  try {
    const thoughts = await Thought.findOne(req.params.id);
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a POST route to create a new item
router.post("/thoughts", (req, res) => {
  try {
    const thoughts = new Thought({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });
    thoughts.save();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Export the router
module.exports = router;
