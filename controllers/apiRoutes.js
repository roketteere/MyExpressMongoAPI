const router = require("express").Router();
const { User, Thought, Reaction } = require("../models");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({})
      .populate("thoughts", {
        reactions: true,
      })
      .populate("friends");
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
    const user = await User.findByIdAndDelete(req.params._id, { new: true });
    res.status(200).json({ user: user, message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/users/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $push: { friends: req.params.friendId },
      },
      { new: true }
    ).populate("friends");
    res.status(200).json({
      userId: req.params.userId,
      friendId: req.params.friendId,
      user: user,
      message: "Friend added",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/users/:userId/friends/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } },
      { new: true }
    )
      .populate("friends")
      .populate("thoughts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      userId: userId,
      friendId: friendId,
      message: "Friend deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({}).populate("reactions");
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

router.delete("/thoughts/:thoughtId", async (req, res) => {
  try {
    const { thoughtId } = req.params;

    const thought = await Thought.deleteOne({ _id: thoughtId }, { new: true });
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.status(200).json({
      thought: thoughtId,
      message: "Thought deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

router.get("/reactions", async (req, res) => { 
  try {
    const reactions = await Reaction.find({});
    res.status(200).json(reactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/thoughts/:thoughtId/reactions", async (req, res) => {
  try {
    const reaction = new Reaction(req.body);
    const thought = await Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      {
        $push: {
          reactions: reaction,
        },
      },
      { new: true }
    ).populate("reactions");
    await thought.save();
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete(
  "/thoughts/:thoughtId/reactions/:reactionId",
  async (req, res) => {
    try {
      const { thoughtId, reactionId } = req.params;

      const thought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { reactionId: reactionId } } }
      ).populate("reactions");
      if (!thought) {
        return res.status(404).json({ error: "Thought not found" });
      }
      await thought.save();
      res.status(200).json({
        reactions: reactionId,
        message: "Reaction deleted",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
