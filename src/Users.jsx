import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Avatar, Box, CircularProgress, Grid, Card, useTheme 
} from '@mui/material';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './App';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("username", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={30} thickness={5} sx={{ color: '#4361ee' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1 }}>Közösség</Typography>
        <Typography variant="body1" color="text.secondary">Ismerd meg a többi felhasználót</Typography>
      </Box>

      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} key={user.id}>
            <Card 
              elevation={0} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                borderRadius: 3, 
                border: '1px solid', 
                borderColor: 'divider',
                transition: '0.3s',
                '&:hover': { 
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Avatar 
                src={user.photoURL} 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: theme.palette.mode === 'light' ? '#f0f2f5' : '#2a2a2e',
                  color: theme.palette.primary.main,
                  fontWeight: 700
                }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}>
                  Tag ettől: {user.createdAt?.seconds 
                    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('hu-HU') 
                    : 'Nemrég'}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {users.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'background.default' }}>
          <Typography color="text.secondary">Még nincsenek felhasználók a rendszerben.</Typography>
        </Paper>
      )}
    </Container>
  );
}