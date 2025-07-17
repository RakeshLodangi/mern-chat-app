
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    type: {
      type: String,
      enum: ['chat', 'system'],
      default: 'chat',
    },

    // optional read status
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
