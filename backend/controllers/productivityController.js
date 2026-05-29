import Reminder from '../models/Reminder.js';
import User from '../models/User.js';

// @desc    Create a reminder
// @route   POST /api/productivity/reminders
// @access  Private
export const createReminder = async (req, res, next) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide title and due date' });
    }

    const reminder = await Reminder.create({
      user: req.user.id,
      title,
      dueDate
    });

    res.status(201).json({ success: true, reminder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reminders for user
// @route   GET /api/productivity/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json({ success: true, reminders });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle complete status of reminder
// @route   PUT /api/productivity/reminders/:id/complete
// @access  Private
export const completeReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();

    res.status(200).json({ success: true, reminder });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/productivity/reminders/:id
// @access  Private
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    res.status(200).json({ success: true, message: 'Reminder removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user app-wide preferences
// @route   PUT /api/productivity/settings
// @access  Private
export const updateUserSettings = async (req, res, next) => {
  try {
    const { theme, fontSize, notifications, sound, chatBackground } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (theme !== undefined) user.settings.theme = theme;
    if (fontSize !== undefined) user.settings.fontSize = fontSize;
    if (notifications !== undefined) user.settings.notifications = notifications;
    if (sound !== undefined) user.settings.sound = sound;
    if (chatBackground !== undefined) user.settings.chatBackground = chatBackground;

    await user.save();
    res.status(200).json({ success: true, settings: user.settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage user memory items (add/delete memory block)
// @route   PUT /api/productivity/memory
// @access  Private
export const updateUserMemory = async (req, res, next) => {
  try {
    const { memory } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.memory = memory || [];
    await user.save();

    res.status(200).json({ success: true, memory: user.memory });
  } catch (error) {
    next(error);
  }
};

// @desc    Get simulated weather feeds
// @route   GET /api/productivity/weather
// @access  Private
export const getWeather = async (req, res, next) => {
  try {
    const city = req.query.city || 'New York';
    
    // Simulate real weather response depending on query
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Snowy', 'Stormy'];
    const pickCond = conditions[Math.floor((city.charCodeAt(0) || 1) % conditions.length)];
    const temp = Math.floor(15 + (city.charCodeAt(0) % 20));

    res.status(200).json({
      success: true,
      city,
      temp: `${temp}°C`,
      condition: pickCond,
      humidity: `${40 + (city.charCodeAt(1) % 40)}%`,
      wind: `${5 + (city.charCodeAt(2) % 25)} km/h`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic developer tech news
// @route   GET /api/productivity/news
// @access  Private
export const getNews = async (req, res, next) => {
  try {
    const feed = [
      {
        id: 1,
        title: "Gemini 3.5 Models Outperform Industry Benchmarks in Code Syntheses",
        summary: "Developers report massive improvements in architectural multi-file edits using the new reasoning pipelines.",
        source: "AetherNews",
        time: "2 hours ago"
      },
      {
        id: 2,
        title: "Node.js 22 Formally Enters Long-Term Support (LTS)",
        summary: "The latest stable build introduces native websocket servers and improved ESM loaders by default.",
        source: "JS Gazette",
        time: "5 hours ago"
      },
      {
        id: 3,
        title: "React 19 Server Components Become Industry Standard in Production",
        summary: "Organizations migrating to Server Actions highlight highly improved SEO performance and bundle savings.",
        source: "React Tech",
        time: "1 day ago"
      }
    ];

    res.status(200).json({ success: true, news: feed });
  } catch (error) {
    next(error);
  }
};
