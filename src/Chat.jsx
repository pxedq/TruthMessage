import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Avatar, 
  Container, 
  Paper,
  InputBase,
  useTheme
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './App';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const { uid, displayName, email, photoURL } = auth.currentUser;
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid,
        displayName: displayName || email,
        photoURL: photoURL || ""
      });
      setNewMessage('');
    } catch (error) {
      console.error("Hiba az üzenet küldésekor:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '85vh', display: 'flex', flexDirection: 'column', py: 2 }}>
      
      {/* Fejléc */}
      <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider', mb: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          Truth Message
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {messages.length} üzenet
        </Typography>
      </Box>

      {/* Üzenetfolyam */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          px: 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#333' : '#e0e0e0', borderRadius: '10px' }
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.uid === auth.currentUser?.uid;
          return (
            <Box 
              key={msg.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                mb: 0.5
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                  <Avatar 
                    src={msg.photoURL} 
                    sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: isMe ? '#4361ee' : (isDark ? '#2a2a2e' : '#f0f0f0') }}
                  >
                    {msg.displayName?.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: '10px 16px', 
                      bgcolor: isMe ? '#4361ee' : (isDark ? '#2a2a2e' : '#f4f4f7'), 
                      color: isMe ? 'white' : 'text.primary',
                      borderRadius: isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    }}
                  >
                    <Typography variant="body2">
                      {msg.text}
                    </Typography>
                  </Paper>
                </Box>
                {!isMe && (
                  <Typography variant="caption" sx={{ ml: 5, mt: 0.5, color: 'text.disabled', fontSize: '0.7rem' }}>
                    {msg.displayName}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
        <div ref={scrollRef} />
      </Box>

      {/* Beviteli mező */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          mt: 2,
          p: '6px 12px', 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: isDark ? '#1e1e21' : '#f4f4f7', 
          borderRadius: '24px',
          transition: '0.2s',
          border: '1px solid',
          borderColor: 'transparent',
          '&:focus-within': { 
            bgcolor: isDark ? '#121214' : '#fff', 
            borderColor: '#4361ee',
            boxShadow: '0 0 0 2px #4361ee33' 
          }
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
          placeholder="Üzenet írása..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton 
          type="submit" 
          disabled={!newMessage.trim()}
          sx={{ color: '#4361ee' }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Box>
    </Container>
  );
}