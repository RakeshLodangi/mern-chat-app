
const Chat = require('../models/Chat');
const User = require('../models/User');

// Access or create one-to-one chat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send('UserId not sent');

  let isChat = await Chat.findOne({
    users: { $all: [req.user._id, userId]},
  })
  .populate('users', '-password')
  .populate('latestMessage');

  if (isChat) {
    return res.status(200).send(isChat);
  }

  // Create new chat if not exist
  const newChat = await Chat.create({
    users: [req.user._id, userId],
  });

  const fullChat = await Chat.findById(newChat._id).populate('users', '-password');
  res.status(200).send(fullChat);
};

// Get all chats for a user
const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('latestMessage')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'username email',
        }
      })
      .sort({ updatedAt: -1 });

    res.status(200).send(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { accessChat, fetchChats }