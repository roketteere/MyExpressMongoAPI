const { Schema, model } = require("mongoose");
const ReactionSchema = require("./Reaction");

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      length: 1 - 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reaction",
      }, 
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  this.reactions.length;
});

function dateFormat() {
  return this.createdAt.toLocalDateString();
}

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
