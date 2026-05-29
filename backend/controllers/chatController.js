import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

// @desc    Create new chat room
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res, next) => {
  try {
    const { title, personality } = req.body;

    const chatCount = await Chat.countDocuments({ user: req.user.id });
    const chatTitle = title || `Chat Room #${chatCount + 1}`;

    const chat = await Chat.create({
      title: chatTitle,
      user: req.user.id,
      personality: personality || 'friendly'
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chat rooms for user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ isPinned: -1, updatedAt: -1 });
    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history for a specific room
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat room not found or access denied.' });
    }

    const messages = await Message.find({ chat: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin status of chat room
// @route   PUT /api/chats/:id/pin
// @access  Private
export const pinChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    chat.isPinned = !chat.isPinned;
    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chat settings (title, personality, background)
// @route   PUT /api/chats/:id
// @access  Private
export const updateChat = async (req, res, next) => {
  try {
    const { title, personality, background } = req.body;
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user.id });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    if (title !== undefined) chat.title = title;
    if (personality !== undefined) chat.personality = personality;
    if (background !== undefined) chat.background = background;

    await chat.save();
    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat room and all its messages
// @route   DELETE /api/chats/:id
// @access  Private
export const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    // Delete associated messages
    await Message.deleteMany({ chat: req.params.id });

    res.status(200).json({ success: true, message: 'Chat room and history deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reaction to a message
// @route   POST /api/chats/messages/:msgId/react
// @access  Private
export const addReaction = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const { msgId } = req.params;

    const message = await Message.findById(msgId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const reactionIndex = message.reactions.findIndex(
      (r) => r.user.toString() === req.user.id && r.emoji === emoji
    );

    if (reactionIndex > -1) {
      // Remove reaction if exists (toggle off)
      message.reactions.splice(reactionIndex, 1);
    } else {
      // Clean previous reactions by this user, then add new one
      message.reactions = message.reactions.filter((r) => r.user.toString() !== req.user.id);
      message.reactions.push({ user: req.user.id, emoji });
    }

    await message.save();
    res.status(200).json({ success: true, reactions: message.reactions });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single message
// @route   DELETE /api/chats/messages/:msgId
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.msgId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Security: Verify chat belongs to user
    const chat = await Chat.findOne({ _id: message.chat, user: req.user.id });
    if (!chat) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await message.deleteOne();
    res.status(200).json({ success: true, message: 'Message removed successfully' });
  } catch (error) {
    next(error);
  }
};
