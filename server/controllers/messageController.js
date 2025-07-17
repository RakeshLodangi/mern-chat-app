const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
  const { text, chatId } = req.body;

  if (!text || !chatId) return res.status(400).send('Invalid data');

  const newMessage = {
    sender: req.user._id,
    text,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'username email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'username email',
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: 'Invalid chat ID' });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username email')
      .populate('chat');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
