import React, { useState, useRef, useEffect } from 'react';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography, Paper, InputAdornment } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const newUserMessage = {
  id: '1',
  text: "Welcome to bibble! 📚 I can recommend popular books across different genres. What interests you?",
  sender: 'bot',
  timestamp: new Date(),
};

const returningUserMessage = {
  id: '1',
  text: "Welcome back! 📚 I'll recommend books based on your reading history. What would you like to explore?",
  sender: 'bot',
  timestamp: new Date(),
};

const ChatBox = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      // Fetch user's books when component mounts
      fetch(`${API_URL}/dashboard/${user.uid}`)
        .then(response => response.json())
        .then(data => {
          setUserBooks(data);
          // Set initial message based on whether user has books
          setMessages([data.length === 0 ? newUserMessage : returningUserMessage]);
        })
        .catch(error => {
          console.error('Error fetching user books:', error);
          setMessages([newUserMessage]); // Default to new user message if there's an error
        });
    }
  }, [user]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/i)) {
      return "Hello! 👋 I'm your book recommendation assistant. How can I help you today?";
    }

    // Goodbyes
    if (lowerMessage.match(/^(bye|goodbye|see you|farewell)/i)) {
      return "Goodbye! 👋 Feel free to come back anytime for more book recommendations!";
    }

    // Thank you messages
    if (lowerMessage.match(/^(thank(?:s| you)|appreciate it|thanks a lot)/i)) {
      return "You're welcome! 😊 Let me know if you need any more book recommendations.";
    }

    // How are you
    if (lowerMessage.match(/^(how are you|how's it going|what's up)/i)) {
      return "I'm doing great! 📚 I love helping readers discover new books. How can I assist you today?";
    }

    // Genre preferences
    if (lowerMessage.match(/^(what|which) (genres?|types? of books?) (do|should) (i|you) (read|recommend)/i)) {
      return "I can recommend books from various genres like Fiction, Mystery, Romance, Science Fiction, and more. What genre interests you the most?";
    }

    // Reading habits
    if (lowerMessage.match(/^(how|what) (should|do) (i|you) (read|start with)/i)) {
      return "I'd be happy to help you find the perfect book! Could you tell me what kind of stories you enjoy? For example, do you like mysteries, romance, or something else?";
    }

    // Book recommendations
    if (lowerMessage.match(/^(recommend|suggest) (some|a) (books?|novels?)/i)) {
      return "I'd love to recommend some books! Could you tell me what genres you enjoy or what kind of stories you're looking for?";
    }

    // Help requests
    if (lowerMessage.match(/^(help|what can you do|how do you work)/i)) {
      return "I'm here to help you discover great books! I can recommend books based on your preferences, suggest new genres, or help you find your next favorite read. What would you like to explore?";
    }

    // Default response for unrecognized messages
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setIsTyping(true);

    // Check for predefined responses
    const botResponse = getBotResponse(userMessage);
    if (botResponse) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          uid: user.uid,
          userBooks: userBooks,
          isNewUser: userBooks.length === 0,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "I'm having trouble processing your request. Could you please try again or rephrase your question?", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        width: 360,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 3,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#3f51b5',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
            Bibble
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ 
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.1)' 
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Your Reading Advisor
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: '#FFFFFF',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: '80%',
                bgcolor: message.sender === 'user' ? '#3f51b5' : '#F0F0F0',
                borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  lineHeight: 1.4,
                }}
              >
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', gap: 0.5, p: 1 }}>
            <Box sx={{ width: 6, height: 6, bgcolor: '#3f51b5', borderRadius: '50%', animation: 'bounce 0.5s ease infinite', animationDelay: '0s' }} />
            <Box sx={{ width: 6, height: 6, bgcolor: '#3f51b5', borderRadius: '50%', animation: 'bounce 0.5s ease infinite', animationDelay: '0.1s' }} />
            <Box sx={{ width: 6, height: 6, bgcolor: '#3f51b5', borderRadius: '50%', animation: 'bounce 0.5s ease infinite', animationDelay: '0.2s' }} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          p: 1.5,
          bgcolor: 'white',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          height: '35px' 
        }}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about your reading preferences..."
            disabled={!user}
            onKeyPress={handleKeyPress}
            sx={{
              paddingTop: '15px',
              '& .MuiOutlinedInput-root': {
                height: '36px',
                fontSize: '0.875rem',
                borderRadius: '18px',
                bgcolor: '#F5F5F5',
                '&:hover': {
                  bgcolor: '#F0F0F0',
                },
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3f51b5',
                },
                '& .MuiOutlinedInput-input': {
                  height: '36px',
                  padding: '0 14px',
                  lineHeight: '36px',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                fontSize: '0.875rem',
                color: 'rgba(0, 0, 0, 0.45)',
              },
            }}
          />
          <IconButton 
            type="submit" 
            disabled={!input.trim() || !user}
            size="small"
            sx={{ 
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              bgcolor: '#3f51b5',
              color: 'white',
              padding: 0,
              '&:hover': {
                bgcolor: '#303f9f',
              },
              '&.Mui-disabled': {
                bgcolor: '#E0E0E0',
                color: '#9E9E9E',
              },
            }}
          >
            <SendIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBox;
