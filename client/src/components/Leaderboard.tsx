import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';
import type { LeaderboardEntry } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const Leaderboard = ({ open, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get<LeaderboardEntry[]>('https://localhost:5001/api/Results/top');
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Лучшие результаты</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : entries.length === 0 ? (
          <Box p={4}><Typography>Записей не найдено</Typography></Box>
        ) : (
          <List>
            {entries.map((e, i) => (
              <ListItem key={e.userName + i} divider>
                <ListItemText
                  primary={`${i + 1}. ${e.userName}`}
                  secondary={`Средний: ${e.averageScore.toFixed(1)}% — Пройдено: ${e.quizzesTaken}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
