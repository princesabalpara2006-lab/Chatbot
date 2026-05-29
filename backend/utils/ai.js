import dotenv from 'dotenv';
dotenv.config();

// Fallback response database based on AI personalities
const PERSONALITY_TUNING = {
  friendly: {
    systemPrompt: "You are a warm, kind, and enthusiastic AI companion. Use emojis occasionally and maintain an encouraging, empathetic tone.",
    greetings: ["Hello there! How can I bring a smile to your face today? 😊", "Hey! It's so wonderful to chat with you. How can I help you today?"],
    generalFallbacks: [
      "That's a very interesting thought! I think you're approaching this in a really creative way.",
      "I hear you! Dealing with that can be tricky, but I'm right here with you. What do you think our next step should be?",
      "That sounds like an adventure! Let's explore that further together. What details are you most curious about? ✨",
    ]
  },
  professional: {
    systemPrompt: "You are an expert, polished, and structured AI assistant. Maintain a business-appropriate, precise, and objective tone.",
    greetings: ["Welcome. How may I assist you with your projects or queries today?", "Good day. Please specify the information or task you require assistance with."],
    generalFallbacks: [
      "Let us analyze this systemically. The primary factors involved here are performance, scalability, and long-term viability.",
      "To optimize this process, I suggest we segment the requirements into clear milestones. How would you prioritize them?",
      "I have reviewed the criteria. The most efficient execution pattern suggests establishing a robust middleware layer before proceeding.",
    ]
  },
  funny: {
    systemPrompt: "You are a witty, playful AI full of jokes, clever analogies, and lighthearted sarcasm.",
    greetings: ["Oh great, another human. Just kidding! What's cooking, chief? 🍳", "Greetings! I'm here, you're here. Let's make some absolute magic (or just look at funny cat memes). 😺"],
    generalFallbacks: [
      "Well, science says 90% of solving problems is just turning it off and on again, but let's try actually thinking this time! 😂",
      "That's a million-dollar question! Unfortunately, I only deal in digital pennies. Here is my hot take though...",
      "I'd write a song about that, but my guitar is currently made of pure lines of code. Let's solve it anyway!",
    ]
  },
  teacher: {
    systemPrompt: "You are a patient, highly educational AI tutor. Break down complex items into simple, logical analogies and step-by-step lists.",
    greetings: ["Hello! What subject or concept are we exploring today? Learning is a lifetime journey! 📚", "Welcome to our study session! Let's break down some barriers and learn something new."],
    generalFallbacks: [
      "To understand this, let's look at an analogy: think of a server as a chef in a restaurant, and the database as the pantry where ingredients are kept...",
      "That is a fundamental concept! Let's break this down into three simple components: 1) Input, 2) Processing, and 3) Output.",
      "Excellent question! Let's examine the history of this concept first so we understand *why* it was created in the first place.",
    ]
  },
  motivational: {
    systemPrompt: "You are a high-energy, passionate personal coach AI. Elevate the user, speak of growth, persistence, and breaking through limits.",
    greetings: ["Rise and shine! Today is another perfect opportunity to build your dream. Let's get it! 🔥", "You are capable of incredible things. What are we conquering today?"],
    generalFallbacks: [
      "Remember: consistency beats intensity! Every single line of code, every single task completed, is a block in the monument of your success!",
      "Don't fear the obstacles—fear staying in the exact same place! Let's push through this boundary right now.",
      "You've got the spark! Let's funnel that energy into a clear action plan. What is the one thing we can execute immediately?",
    ]
  }
};

/**
 * Clean & process raw text to detect smart commands
 */
const detectProductivityTriggers = (prompt) => {
  const text = prompt.toLowerCase();

  // 1. To-do task insertion detector
  if (text.includes('todo add') || text.includes('add task') || text.includes('todo:')) {
    const taskText = prompt.replace(/(todo add|add task|todo:)/gi, '').trim();
    if (taskText) {
      return {
        type: 'todo',
        data: { title: taskText },
        response: `✅ **Smart AI Action**: I've successfully added **"${taskText}"** to your personal To-Do list!`
      };
    }
  }

  // 2. Reminder scheduler detector
  if (text.includes('remind me to') || text.includes('schedule reminder')) {
    const reminderText = prompt.replace(/(remind me to|schedule reminder)/gi, '').trim();
    if (reminderText) {
      return {
        type: 'reminder',
        data: { title: reminderText, offsetMinutes: 30 },
        response: `⏰ **Smart AI Action**: Done! I have scheduled a reminder: **"${reminderText}"** in your notifications panel.`
      };
    }
  }

  // 3. Calculator helper
  if (text.includes('calculate') || text.includes('compute')) {
    const mathExp = text.replace(/(calculate|compute)/gi, '').replace(/[a-zA-Z]/g, '').trim();
    try {
      if (mathExp && /^[\d+\-*/\s().]+$/.test(mathExp)) {
        const result = eval(mathExp);
        return {
          type: 'calculator',
          data: { mathExp, result },
          response: `🧮 **Smart AI Action**: Evaluated expression \`${mathExp}\` = **${result}**`
        };
      }
    } catch (e) {
      // Ignore evaluation failures
    }
  }

  return null;
};

/**
 * Detect language of prompt
 */
const detectLanguage = (text) => {
  const words = text.toLowerCase().split(' ');
  const frenchWords = ['bonjour', 'comment', 'salut', 'merci', 'oui', 'non', 'pourquoi', 'avec'];
  const spanishWords = ['hola', 'como', 'gracias', 'si', 'no', 'por', 'que', 'amigo'];
  const germanWords = ['hallo', 'danke', 'ja', 'nein', 'wie', 'warum', 'mit', 'und'];

  if (words.some(w => frenchWords.includes(w))) return 'French';
  if (words.some(w => spanishWords.includes(w))) return 'Spanish';
  if (words.some(w => germanWords.includes(w))) return 'German';
  return 'English';
};

/**
 * Core AI generation query wrapper
 */
export const queryAI = async (prompt, personality = 'friendly', fileContent = '') => {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    return {
      text: "⚠️ **Configuration Error**: `GROK_API_KEY` is missing from your backend `.env` file. Please set it to receive live responses directly from Groq.",
      suggestedReplies: ["How do I set the Groq API key?", "Try again"],
      detectedLanguage: 'English'
    };
  }

  // 1. Check for local productivity actions in text
  const action = detectProductivityTriggers(prompt);
  if (action) {
    return {
      text: action.response,
      suggestedReplies: ["View my Tasks", "Check Reminders", "Thank you!"],
      action: action.type,
      actionData: action.data,
      detectedLanguage: 'English'
    };
  }

  // Detect language
  const lang = detectLanguage(prompt);

  // Select personality configurations
  const tone = PERSONALITY_TUNING[personality] || PERSONALITY_TUNING.friendly;

  try {
    const userMessageContent = fileContent
      ? `Context File Content:\n${fileContent}\n\nUser Query: ${prompt}`
      : prompt;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: tone.systemPrompt
          },
          {
            role: 'user',
            content: userMessageContent
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0]?.message?.content) {
      const aiResult = data.choices[0].message.content;
      return {
        text: aiResult,
        suggestedReplies: [
          "Can you explain that further?",
          "Give me another example.",
          "Write a code block for this."
        ],
        detectedLanguage: lang
      };
    } else {
      throw new Error("No response content found in choices from Groq API.");
    }
  } catch (apiError) {
    console.error(`[Groq API Dispatch Error]`, apiError.message);
    return {
      text: `❌ **Groq API Error**: Failed to query Groq API.\n\n*Error Details*: ${apiError.message}\n\nPlease check that your \`GROK_API_KEY\` in your \`.env\` file is valid and has sufficient quota/permissions.`,
      suggestedReplies: ["Check my API Key", "Retry"],
      detectedLanguage: lang
    };
  }
};
