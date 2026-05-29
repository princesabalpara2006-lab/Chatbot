import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [typingState, setTypingState] = useState({ username: '', isTyping: false });
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [todos, setTodos] = useState([]);

  const socketRef = useRef(null);

  // Initialize Socket.io Connection
  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:5000', {
        transports: ['websocket'],
        upgrade: false
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[Socket Connected] Id:', socket.id);
      });

      // Socket Message listener
      socket.on('receive_message', (message) => {
        setMessages((prev) => {
          // Avoid duplicate appends
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      });

      // Socket Typing listener
      socket.on('typing_receive', ({ username, isTyping }) => {
        setTypingState({ username, isTyping });
      });

      // Socket Action listener to refresh productivity panel
      socket.on('refresh_productivity', () => {
        fetchReminders();
      });

      // Socket AI suggestions listener
      socket.on('ai_suggestions', ({ suggestedReplies }) => {
        setSuggestedReplies(suggestedReplies || []);
      });

      // Sync Reactions listener
      socket.on('reaction_updated', ({ messageId, reactions }) => {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === messageId ? { ...msg, reactions } : msg))
        );
      });

      // Sync Read receipts listener
      socket.on('read_sync', ({ messageIds }) => {
        setMessages((prev) =>
          prev.map((msg) => (messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg))
        );
      });

      fetchChats();
      fetchReminders();

      return () => {
        socket.disconnect();
      };
    } else {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
    }
  }, [user]);

  // Handle joining distinct room ids
  useEffect(() => {
    if (socketRef.current && currentChat) {
      socketRef.current.emit('join_room', { roomId: currentChat._id });
      fetchMessages(currentChat._id);
      
      // Auto-trigger read receipts
      setTimeout(() => {
        const unreadIds = messages.filter(m => m.sender === 'ai' && !m.isRead).map(m => m._id);
        if (unreadIds.length > 0) {
          socketRef.current.emit('mark_read', { roomId: currentChat._id, messageIds: unreadIds });
        }
      }, 1000);

      return () => {
        socketRef.current.emit('leave_room', { roomId: currentChat._id });
        setTypingState({ username: '', isTyping: false });
        setSuggestedReplies([]);
      };
    }
  }, [currentChat]);

  const fetchChats = async () => {
    try {
      const res = await API.get('/chats');
      if (res.data.success) {
        setChats(res.data.chats);
      }
    } catch (err) {
      console.error('[Error fetching chats]', err.message);
    }
  };

  const fetchMessages = async (chatId) => {
    setChatLoading(true);
    try {
      const res = await API.get(`/chats/${chatId}/messages`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('[Error fetching messages]', err.message);
    }
    setChatLoading(false);
  };

  const createNewChat = async (title, personality) => {
    try {
      const res = await API.post('/chats', { title, personality });
      if (res.data.success) {
        setChats((prev) => [res.data.chat, ...prev]);
        setCurrentChat(res.data.chat);
        return res.data.chat;
      }
    } catch (err) {
      console.error('[Error creating chat]', err.message);
    }
    return null;
  };

  const renameChat = async (chatId, title) => {
    try {
      const res = await API.put(`/chats/${chatId}`, { title });
      if (res.data.success) {
        setChats((prev) => prev.map((c) => (c._id === chatId ? res.data.chat : c)));
        if (currentChat && currentChat._id === chatId) {
          setCurrentChat(res.data.chat);
        }
      }
    } catch (err) {
      console.error('[Error renaming chat]', err.message);
    }
  };

  const changeChatPersonality = async (chatId, personality) => {
    try {
      const res = await API.put(`/chats/${chatId}`, { personality });
      if (res.data.success) {
        setChats((prev) => prev.map((c) => (c._id === chatId ? res.data.chat : c)));
        if (currentChat && currentChat._id === chatId) {
          setCurrentChat(res.data.chat);
        }
      }
    } catch (err) {
      console.error('[Error changing personality]', err.message);
    }
  };

  const togglePinChat = async (chatId) => {
    try {
      const res = await API.put(`/chats/${chatId}/pin`);
      if (res.data.success) {
        // Fetch chats again to retain sorting
        fetchChats();
      }
    } catch (err) {
      console.error('[Error pinning chat]', err.message);
    }
  };

  const deleteChatRoom = async (chatId) => {
    try {
      const res = await API.delete(`/chats/${chatId}`);
      if (res.data.success) {
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        if (currentChat && currentChat._id === chatId) {
          setCurrentChat(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('[Error deleting chat]', err.message);
    }
  };

  const emitSendMessage = (content, fileAttachment = null) => {
    if (socketRef.current && currentChat && user) {
      socketRef.current.emit('send_message', {
        roomId: currentChat._id,
        userId: user.id,
        content,
        fileAttachment
      });
      // Clear suggestion chips
      setSuggestedReplies([]);
    }
  };

  const emitTyping = (isTyping) => {
    if (socketRef.current && currentChat && user) {
      socketRef.current.emit(isTyping ? 'typing_start' : 'typing_stop', {
        roomId: currentChat._id,
        username: user.username
      });
    }
  };

  const reactToMessage = async (msgId, emoji) => {
    try {
      const res = await API.post(`/chats/messages/${msgId}/react`, { emoji });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === msgId ? { ...msg, reactions: res.data.reactions } : msg))
        );
        // Sync with room via socket
        if (socketRef.current && currentChat) {
          socketRef.current.emit('sync_reaction', {
            roomId: currentChat._id,
            messageId: msgId,
            reactions: res.data.reactions
          });
        }
      }
    } catch (err) {
      console.error('[Error reacting to message]', err.message);
    }
  };

  const removeSingleMessage = async (msgId) => {
    try {
      const res = await API.delete(`/chats/messages/${msgId}`);
      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      }
    } catch (err) {
      console.error('[Error deleting message]', err.message);
    }
  };

  // Productivity integrations
  const fetchReminders = async () => {
    try {
      const res = await API.get('/productivity/reminders');
      if (res.data.success) {
        setReminders(res.data.reminders);
      }
    } catch (err) {
      console.error('[Error fetching reminders]', err.message);
    }
  };

  const addNewReminder = async (title, dueDate) => {
    try {
      const res = await API.post('/productivity/reminders', { title, dueDate });
      if (res.data.success) {
        setReminders((prev) => [...prev, res.data.reminder]);
        return true;
      }
    } catch (err) {
      console.error('[Error creating reminder]', err.message);
    }
    return false;
  };

  const toggleCompleteReminder = async (id) => {
    try {
      const res = await API.put(`/productivity/reminders/${id}/complete`);
      if (res.data.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === id ? res.data.reminder : r))
        );
      }
    } catch (err) {
      console.error('[Error checking reminder]', err.message);
    }
  };

  const deleteReminderItem = async (id) => {
    try {
      const res = await API.delete(`/productivity/reminders/${id}`);
      if (res.data.success) {
        setReminders((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error('[Error deleting reminder]', err.message);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      messages,
      chatLoading,
      typingState,
      suggestedReplies,
      reminders,
      todos,
      setTodos,
      setCurrentChat,
      createNewChat,
      renameChat,
      changeChatPersonality,
      togglePinChat,
      deleteChatRoom,
      emitSendMessage,
      emitTyping,
      reactToMessage,
      removeSingleMessage,
      fetchChats,
      fetchReminders,
      addNewReminder,
      toggleCompleteReminder,
      deleteReminderItem
    }}>
      {children}
    </ChatContext.Provider>
  );
};
