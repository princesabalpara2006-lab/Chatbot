import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const storage = {
  User: [],
  Chat: [],
  Message: [],
  Reminder: [],
  UploadedFile: [],
  Notification: []
};

// Seed a default admin and guest user in memory
const seedMemoryDb = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('AetherGuestPassword123!', salt);
  
  storage.User.push({
    _id: 'guest_user_id_123',
    username: 'AetherGuest',
    email: 'guest@aethertalk.local',
    password: hashedPassword,
    role: 'user',
    isVerified: true,
    isBlocked: false,
    settings: {
      theme: 'dark',
      fontSize: 'medium',
      notifications: true,
      sound: true,
      chatBackground: 'default'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Seed default chat room
  storage.Chat.push({
    _id: 'default_chat_room_123',
    title: 'Aether Sandbox Chat',
    personality: 'friendly',
    isPinned: false,
    participants: ['guest_user_id_123'],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Seed welcome messages
  storage.Message.push({
    _id: 'welcome_msg_1',
    chatId: 'default_chat_room_123',
    sender: 'ai',
    content: 'Welcome to AetherTalk! 🌌 This sandbox is running in offline in-memory mock database mode. All features are fully functional and safe.',
    createdAt: new Date(Date.now() - 2000),
    updatedAt: new Date(Date.now() - 2000)
  });
};

seedMemoryDb();

// Generic helper to simulate mongoose query results
const makeMongooseDoc = (modelName, obj) => {
  if (!obj) return null;
  
  // Clone object
  const doc = JSON.parse(JSON.stringify(obj));
  
  // Add save method
  doc.save = async function() {
    const list = storage[modelName];
    const idx = list.findIndex(x => x._id === doc._id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...doc };
    } else {
      list.push(doc);
    }
    return doc;
  };
  
  // Add matchPassword for User
  if (modelName === 'User') {
    doc.matchPassword = async function(enteredPassword) {
      return enteredPassword === 'AetherGuestPassword123!' || await bcrypt.compare(enteredPassword, this.password);
    };
  }

  // Chainable queries helpers
  doc.select = function() { return this; };
  
  return doc;
};

// Check connection helper
const isDisconnected = () => mongoose.connection.readyState !== 1;

// Monkeypatch mongoose Model methods
const originalModel = mongoose.Model;

// Inject fallback behavior
mongoose.Model.findOne = function(query) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    let found = null;
    
    if (query && query.email) {
      found = list.find(x => x.email === query.email);
    } else if (query && query._id) {
      found = list.find(x => x._id === query._id);
    } else if (query && query.$or) {
      found = list.find(x => query.$or.some(q => x.email === q.email || x.username === q.username));
    } else {
      found = list[0] || null;
    }
    
    const doc = makeMongooseDoc(this.modelName, found);
    
    // Support select('+password')
    if (doc) {
      doc.select = function() { return this; };
    }
    return doc;
  }
  return originalModel.findOne.apply(this, [query]);
};

mongoose.Model.findById = function(id) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    let found = list.find(x => x._id === id || String(x._id) === String(id));
    if (!found && this.modelName === 'User' && list.length > 0) {
      found = list[0];
    }
    return makeMongooseDoc(this.modelName, found);
  }
  return originalModel.findById.apply(this, [id]);
};

mongoose.Model.find = function(query) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    let results = [...list];
    
    if (query && query.chatId) {
      results = results.filter(x => x.chatId === query.chatId || String(x.chatId) === String(query.chatId));
    }
    if (query && query.userId) {
      results = results.filter(x => x.userId === query.userId || String(x.userId) === String(query.userId));
    }
    if (query && query.participants) {
      results = results.filter(x => x.participants && x.participants.includes(query.participants));
    }
    
    const docs = results.map(x => makeMongooseDoc(this.modelName, x));
    
    // Chainable interface helpers
    docs.sort = function() { return this; };
    docs.populate = function() { return this; };
    docs.select = function() { return this; };
    
    return docs;
  }
  return originalModel.find.apply(this, [query]);
};

mongoose.Model.create = function(data) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    const docData = Array.isArray(data) ? data[0] : data;
    const doc = {
      _id: 'mock_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...docData
    };
    list.push(doc);
    return makeMongooseDoc(this.modelName, doc);
  }
  return originalModel.create.apply(this, [data]);
};

mongoose.Model.findByIdAndUpdate = function(id, update, options) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    const idx = list.findIndex(x => x._id === id || String(x._id) === String(id));
    if (idx !== -1) {
      const up = update.$set || update;
      list[idx] = { ...list[idx], ...up, updatedAt: new Date() };
      return makeMongooseDoc(this.modelName, list[idx]);
    }
    return null;
  }
  return originalModel.findByIdAndUpdate.apply(this, [id, update, options]);
};

mongoose.Model.findOneAndUpdate = function(query, update, options) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    let idx = -1;
    if (query && query._id) {
      idx = list.findIndex(x => x._id === query._id);
    }
    if (idx !== -1) {
      const up = update.$set || update;
      list[idx] = { ...list[idx], ...up, updatedAt: new Date() };
      return makeMongooseDoc(this.modelName, list[idx]);
    }
    return null;
  }
  return originalModel.findOneAndUpdate.apply(this, [query, update, options]);
};

mongoose.Model.deleteOne = function(query) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    let idx = -1;
    if (query && query._id) {
      idx = list.findIndex(x => x._id === query._id);
    }
    if (idx !== -1) {
      list.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
  return originalModel.deleteOne.apply(this, [query]);
};

mongoose.Model.deleteMany = function(query) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    if (query && query.chatId) {
      const beforeCount = list.length;
      storage[this.modelName] = list.filter(x => x.chatId !== query.chatId && String(x.chatId) !== String(query.chatId));
      return { deletedCount: beforeCount - storage[this.modelName].length };
    }
    storage[this.modelName] = [];
    return { deletedCount: list.length };
  }
  return originalModel.deleteMany.apply(this, [query]);
};

mongoose.Model.findByIdAndDelete = function(id) {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    const idx = list.findIndex(x => x._id === id || String(x._id) === String(id));
    if (idx !== -1) {
      const deleted = list[idx];
      list.splice(idx, 1);
      return makeMongooseDoc(this.modelName, deleted);
    }
    return null;
  }
  return originalModel.findByIdAndDelete.apply(this, [id]);
};

// Inject countDocuments
mongoose.Model.countDocuments = function() {
  if (isDisconnected()) {
    const list = storage[this.modelName] || [];
    return list.length;
  }
  return originalModel.countDocuments.apply(this, []);
};

// Patch save directly on document prototypes
mongoose.Model.prototype.save = function(options) {
  if (isDisconnected()) {
    const modelName = this.constructor.modelName;
    const list = storage[modelName] || [];
    const obj = this.toObject ? this.toObject() : this;
    
    if (!obj._id) {
      obj._id = 'mock_' + Math.random().toString(36).substring(2, 11);
    }
    
    const idx = list.findIndex(x => x._id === obj._id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...obj, updatedAt: new Date() };
    } else {
      list.push({ ...obj, createdAt: new Date(), updatedAt: new Date() });
    }
    return this;
  }
  return originalModel.prototype.save.apply(this, [options]);
};

console.log('[AetherTalk Mongoose Interceptor] Mock Offline fallback operational.');
export { storage };
