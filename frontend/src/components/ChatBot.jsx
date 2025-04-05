import React, { useState, useRef, useEffect } from 'react';
import { Send as SendIcon, Close as CloseIcon, SmartToy as BotIcon } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography, Paper, InputAdornment, Avatar, CircularProgress } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    if (user && isOpen) {
      // Reset messages when chat is opened
      const initialMessageId = Date.now();
      setMessages([{
        id: `bot-${initialMessageId}-welcome`,
        text: "Welcome to bibble! 📚 I can recommend books based on your interests. What kind of books do you enjoy?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      
      // Fetch user's books
      fetch(`${API_URL}/dashboard/${user.uid}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch books');
          return response.json();
        })
        .then(data => {
          if (data.books && data.books.length > 0) {
            setUserBooks(data.books);
            setMessages(prev => [...prev, {
              id: `bot-${Date.now()}-returning`,
              text: "I see you have some books in your library! Would you like recommendations based on your current reads?",
              sender: 'bot',
              timestamp: new Date()
            }]);
          }
        })
        .catch(error => {
          console.error('Error fetching user books:', error);
          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}-error`,
            text: "I'm having trouble accessing your book library. But I can still help you discover new books!",
            sender: 'bot',
            timestamp: new Date()
          }]);
        });
    }
  }, [user, isOpen]);

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

    const messageId = Date.now();
    const userMessage = {
      id: `user-${messageId}-msg`,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // First try the predefined responses
      const quickResponse = getBotResponse(userMessage.text);
      if (quickResponse) {
        setTimeout(() => {
          const botResponse = {
            id: `bot-${Date.now()}-quick`,
            text: quickResponse,
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      console.log('Sending chat request:', {
        message: userMessage.text,
        uid: user.uid,
        booksCount: userBooks?.length
      });

      // If no predefined response, call the API
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          uid: user.uid,
          userBooks: userBooks,
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Invalid response format from server');
      }

      console.log('Received chat response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `Server error: ${response.status}`);
      }

      if (!data || (typeof data.response !== 'string' && typeof data.message !== 'string')) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response format from server');
      }

      const botResponse = {
        id: `bot-${Date.now()}-api`,
        text: data.response || data.message,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: `bot-${Date.now()}-error`,
        text: error.message === "Failed to fetch" || error.message.includes("timeout") 
          ? "I'm having trouble connecting to the server. Please check your internet connection and try again."
          : `I'm having trouble processing your request: ${error.message}`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
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
              gap: 1,
            }}
          >
            {message.sender === 'bot' && (
              <Avatar 
                key={`avatar-${message.id}`}
                sx={{ 
                  bgcolor: '#3f51b5', 
                  width: 32, 
                  height: 32 
                }}
              >
                <BotIcon sx={{ fontSize: 20 }} />
              </Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: '75%',
                bgcolor: message.sender === 'user' ? '#3f51b5' : '#F0F0F0',
                borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-line',
                }}
              >
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box 
            key="typing-indicator"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Avatar sx={{ bgcolor: '#3f51b5', width: 32, height: 32 }}>
              <BotIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box sx={{ display: 'flex', gap: 0.5, p: 1 }}>
              <CircularProgress size={8} sx={{ color: '#3f51b5' }} />
              <CircularProgress size={8} sx={{ color: '#3f51b5' }} />
              <CircularProgress size={8} sx={{ color: '#3f51b5' }} />
            </Box>
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
