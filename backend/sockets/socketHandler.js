import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Reminder from '../models/Reminder.js';
import { queryAI } from '../utils/ai.js';

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] New client connected: ${socket.id}`);

    // Join specialized chat room
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`[Socket.io] Socket ${socket.id} joined room: ${roomId}`);
    });

    // Leave chat room
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
      console.log(`[Socket.io] Socket ${socket.id} left room: ${roomId}`);
    });

    // Typing start indicator
    socket.on('typing_start', ({ roomId, username }) => {
      socket.to(roomId).emit('typing_receive', { username, isTyping: true });
    });

    // Typing stop indicator
    socket.on('typing_stop', ({ roomId, username }) => {
      socket.to(roomId).emit('typing_receive', { username, isTyping: false });
    });

    // Send and process message
    socket.on('send_message', async ({ roomId, userId, content, fileAttachment }) => {
      try {
        const chat = await Chat.findById(roomId);
        if (!chat) return;

        // 1. Create and broadcast user's message
        const userMessage = await Message.create({
          chat: roomId,
          sender: 'user',
          content,
          fileAttachment
        });

        io.to(roomId).emit('receive_message', userMessage);

        // 2. Trigger glowing typing indicator to mimic thinking
        io.to(roomId).emit('typing_receive', { username: 'AetherAI', isTyping: true });

        // 3. Process with AI Engine
        let fileTextContext = '';
        if (fileAttachment && fileAttachment.url) {
          // If attachment uploaded, we can fetch extra context from the summary
          fileTextContext = fileAttachment.summary || '';
        }

        const aiResponse = await queryAI(content, chat.personality, fileTextContext);

        // 4. Handle smart AI side-actions
        if (aiResponse.action === 'todo') {
          // Task triggers, print or log action
          console.log(`[Smart Action] Insert Todo:`, aiResponse.actionData);
        } else if (aiResponse.action === 'reminder') {
          // Automatically register reminder model in database
          try {
            await Reminder.create({
              user: userId,
              title: aiResponse.actionData.title,
              dueDate: new Date(Date.now() + aiResponse.actionData.offsetMinutes * 60 * 1000)
            });
            // Send trigger to update client reminder state
            socket.emit('refresh_productivity');
          } catch (reminderErr) {
            console.error('[Socket Smart Action Failure]', reminderErr.message);
          }
        }

        // 5. Create AI response message
        const aiMessage = await Message.create({
          chat: roomId,
          sender: 'ai',
          content: aiResponse.text
        });

        // 6. Deliver AI response with simulated network latency for visual pacing
        setTimeout(() => {
          io.to(roomId).emit('typing_receive', { username: 'AetherAI', isTyping: false });
          io.to(roomId).emit('receive_message', aiMessage);
          
          // Optionally provide suggested follow-ups
          socket.emit('ai_suggestions', { suggestedReplies: aiResponse.suggestedReplies });
        }, 1500);

      } catch (err) {
        console.error(`[Socket Message Processing Failure]`, err.message);
      }
    });

    // Sync message reaction
    socket.on('sync_reaction', async ({ roomId, messageId, reactions }) => {
      socket.to(roomId).emit('reaction_updated', { messageId, reactions });
    });

    // Sync read receipts
    socket.on('mark_read', async ({ roomId, messageIds }) => {
      try {
        await Message.updateMany({ _id: { $in: messageIds } }, { $set: { isRead: true } });
        socket.to(roomId).emit('read_sync', { messageIds });
      } catch (err) {
        console.error('[Socket Mark Read Failure]', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
