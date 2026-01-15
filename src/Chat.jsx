import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, IconButton, Typography, Avatar, Paper, InputBase, 
  Autocomplete, TextField, useTheme, Fade
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where 
} from 'firebase/firestore';
import { db, auth } from './App';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]); // Az összes felhasználó listája
  const [selectedUser, setSelectedUser] = useState(null); // Kivel beszélgetek épp?
  
  const scrollRef = useRef();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = auth.currentUser;

  // 1. Felhasználók betöltése a legördülő listához
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("username", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser.uid); // Magunkat ne lássuk a listában
      setUsers(usersList);
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  // 2. Chat szoba azonosító generálása
  // Ha nincs kiválasztva senki -> "global_chat"
  // Ha van -> "uid1_uid2" (ABC sorrendben, hogy mindig ugyanaz legyen a szoba ID)
  const getChatId = () => {
    if (!selectedUser) return "global_chat";
    const ids = [currentUser.uid, selectedUser.id];
    ids.sort(); // Fontos! Így mindkét félnél ugyanaz lesz az ID (pl. "A_B" és "B_A" helyett mindig "A_B")
    return ids.join("_");
  };

  // 3. Üzenetek lekérése a kiválasztott szobából
  useEffect(() => {
    const chatId = getChatId();

    // Lekérdezés: Csak az adott szoba üzenetei
    const q = query(
      collection(db, "messages"), 
      where("chatRoomId", "==", chatId), 
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedUser]); // Újra lefut, ha váltunk felhasználót

  // Görgetés az aljára
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const chatId = getChatId();
      
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        chatRoomId: chatId // Eltároljuk, melyik szobához tartozik
      });
      
      setNewMessage('');
    } catch (error) {
      console.error("Hiba az üzenet küldésekor:", error);
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 80px)', // Levonjuk a Navbar magasságát
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '900px',
      margin: '0 auto',
      pt: 2
    }}>
      
      {/* --- PARTNER VÁLASZTÓ --- */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, mb: 2, borderRadius: 3, 
          bgcolor: isDark ? '#1e1e21' : '#fff',
          display: 'flex', alignItems: 'center', gap: 2,
          border: '1px solid', borderColor: 'divider'
        }}
      >
        <Typography variant="body1" fontWeight={600} sx={{ minWidth: 'fit-content' }}>
          Kinek írsz:
        </Typography>
        
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.username}
          value={selectedUser}
          onChange={(event, newValue) => setSelectedUser(newValue)}
          fullWidth
          renderInput={(params) => (
            <TextField 
              {...params} 
              placeholder="Válassz partnert vagy maradj a Közösben..." 
              variant="standard" 
              InputProps={{ ...params.InputProps, disableUnderline: true }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ gap: 2 }}>
              <Avatar 
                src={option.photoURL} 
                sx={{ width: 28, height: 28, fontSize: '0.9rem' }}
              >
                {option.username?.charAt(0).toUpperCase()}
              </Avatar>
              {option.username}
            </Box>
          )}
        />
      </Paper>

      {/* --- ÜZENETEK LISTÁJA --- */}
      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 3, 
          borderRadius: 4, 
          bgcolor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 5, opacity: 0.6 }}>
            <Typography variant="body1">
              {selectedUser 
                ? `Még nincsenek üzenetek ${selectedUser.username} felhasználóval.` 
                : "Ez a Közös csevegő. Válassz fent valakit a privát üzenethez!"}
            </Typography>
          </Box>
        )}

        {messages.map((msg) => {
          const isMe = msg.uid === currentUser.uid;
          
          return (
            <Fade in={true} key={msg.id}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                mb: 1
              }}>
                <Box sx={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1, maxWidth: '75%' }}>
                  
                  {/* Avatar csak akkor, ha nem én vagyok */}
                  {!isMe && (
                    <Avatar 
                      src={msg.photoURL} 
                      sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: '0.8rem' }}
                    >
                      {msg.displayName?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}

                  <Box>
                    {!isMe && selectedUser === null && (
                      <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                        {msg.displayName}
                      </Typography>
                    )}
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: '10px 16px', 
                        bgcolor: isMe 
                          ? (isDark ? theme.palette.primary.dark : theme.palette.primary.main) 
                          : (isDark ? '#2a2a2e' : '#ffffff'),
                        color: isMe ? '#fff' : 'text.primary',
                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
                        {msg.text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </Fade>
          );
        })}
        <div ref={scrollRef} />
      </Paper>

      {/* --- BEVITELI MEZŐ --- */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          mt: 2, mb: 1, p: '6px 12px', 
          display: 'flex', alignItems: 'center', 
          bgcolor: isDark ? '#1e1e21' : '#fff', 
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid', borderColor: 'divider'
        }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1, fontSize: '0.95rem' }}
          placeholder={selectedUser ? `Üzenet írása neki: ${selectedUser.username}` : "Üzenet a közösbe..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton 
          type="submit" 
          disabled={!newMessage.trim()}
          sx={{ 
            color: 'white', 
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            width: 40, height: 40
          }}
        >
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}