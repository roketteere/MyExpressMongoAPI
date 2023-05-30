const router = require("express").Router();
const { User, Thought } = require("../models");

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
    const user = await User.findOne({
      _id: req.params._id,
    })
      .populate("thoughts")
      .populate("friends");
    res.status(200).json(user);
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
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/users/:_id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params._id, {
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
  try {
    const thoughts = await Thought.find({});
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/thoughts/:_id", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params._id });
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/thoughts", async (req, res) => {
  try {
    const thought = new Thought({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });
    await thought.save();
    // Push the created thought's _id to the associated user's thoughts array field
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $push: { thoughts: thought._id } },
      { new: true }
    );
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
