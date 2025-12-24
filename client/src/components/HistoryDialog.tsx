import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress, Alert, Typography, Card, CardContent, Divider } from '@mui/material';
import api from '../api';
import type { ResultHistoryEntry } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const HistoryDialog = ({ open, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ResultHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await api.get<ResultHistoryEntry[]>('/api/Account/history');
        setHistory(res.data.map(r => ({ ...r, dateTaken: new Date(r.dateTaken).toISOString() })));
      } catch (err) {
        console.error(err);
          setError('Не удалось загрузить историю');
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>История</DialogTitle>
        <DialogTitle>История</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : history.length === 0 ? (
           <Typography>Результатов не найдено</Typography>
        ) : (
          <Box>
            {history.map((h, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">{h.quizTitle} — {Math.round(h.score)}%</Typography>
                    <Typography variant="caption" color="text.secondary">{h.correctCount}/{h.totalCount} — {h.durationSeconds}s — {new Date(h.dateTaken).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
                {i < history.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryDialog;
