import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';

const BookRecommender = ({ userBooks, uid }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        content: 'Hi! I\'m your personal book recommendation assistant. I can help you find your next read based on your reading history or suggest a great first book if you\'re new to reading. What would you like to know?',
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userBooks: userBooks,
          uid: uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      
      // Add bot response
      setMessages(prev => [...prev, { type: 'bot', content: data.recommendation }]);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'I apologize, but I encountered an error. Please try again later.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#2F3C7E',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <BotIcon />
        <Typography variant="h6">Book Recommendation Assistant</Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              gap: 1,
            }}
          >
            {message.type === 'bot' && (
              <Avatar sx={{ bgcolor: '#2F3C7E' }}>
                <BotIcon />
              </Avatar>
            )}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '80%',
                backgroundColor: message.type === 'user' ? '#2F3C7E' : '#f5f5f5',
                color: message.type === 'user' ? 'white' : 'text.primary',
                borderRadius: 2,
              }}
            >
              <Typography>{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#2F3C7E' }}>
              <BotIcon />
            </Avatar>
            <CircularProgress size={20} />
          </Box>
        )}
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask for book recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            sx={{
              backgroundColor: '#2F3C7E',
              color: 'white',
              '&:hover': {
                backgroundColor: '#4500b5',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
};

export default BookRecommender; 