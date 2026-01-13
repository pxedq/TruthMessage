import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Avatar, 
  Container, 
  Stack,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './App'; // Importáljuk a db-t és auth-ot az App.jsx-ből

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(); // Hivatkozás a chat aljára a görgetéshez

  // --- Üzenetek lekérése valós időben ---
  useEffect(() => {
    // Lekérdezés a 'messages' gyűjteményből, időrendben
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    // Feliratkozás a változásokra (real-time)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // --- Görgetés az aljára új üzenetnél ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Üzenet küldése ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const { uid, displayName, email } = auth.currentUser;
      
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid,
        displayName: displayName || email, // Ha nincs név, az email jelenik meg
        photoURL: auth.currentUser.photoURL
      });

      setNewMessage(''); // Input mező törlése
    } catch (error) {
      console.error("Hiba az üzenet küldésekor:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Fejléc */}
        <Typography variant="h5" align="center"  sx={{ fontSize: '30px', mb:2, textDecoration: 'underline' }}>
          Truth message
        </Typography>

      {/* Üzenetek listája (Scrollable area) */}
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2, 
          mb: 2, 
          bgcolor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((msg) => {
          // Ellenőrizzük, hogy én küldtem-e az üzenetet
          const isMe = msg.uid === auth.currentUser?.uid;

          return (
            <Box 
              key={msg.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: 1
              }}
            >
              {/* Avatar csak másoknál (bal oldalon) */}
              {!isMe && (
                <Avatar sx={{ bgcolor: '#ff5722', width: 32, height: 32, fontSize: 14 }}>
                  {msg.displayName?.charAt(0).toUpperCase() || '?'}
                </Avatar>
              )}

              <Paper 
                elevation={1} 
                sx={{ 
                  p: 1.5, 
                  maxWidth: '70%', 
                  bgcolor: isMe ? '#e3f2fd' : '#ffffff', // Saját üzenet kék, másé fehér
                  borderRadius: isMe ? '20px 20px 0px 20px' : '20px 20px 20px 0px'
                }}
              >
                {!isMe && (
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                    {msg.displayName}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          );
        })}
        {/* Láthatatlan elem a görgetéshez */}
        <div ref={scrollRef} />
      </Paper>

      {/* Input mező */}
      <Paper 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <TextField
          sx={{ ml: 1, flex: 1 }}
          placeholder="Írj egy üzenetet..."
          variant="standard"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="submit" color="primary" sx={{ p: '10px' }}>
          <SendIcon />
        </IconButton>
      </Paper>

    </Container>
  );
}