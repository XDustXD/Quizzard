import { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface Props { open: boolean; onClose: () => void }

const LoginDialog = ({ open, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      setError(null);
      await login(email, password);
      onClose();
    } catch (err: unknown) {
      let message = 'Не удалось войти';
      if (axios.isAxiosError(err)) {
        const d = err.response?.data;
        if (typeof d === 'string') message = d;
        else if (d && typeof d === 'object') message = JSON.stringify(d);
        else message = err.message || message;
      } else {
        message = String(err);
      }
      setError(message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Вход</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}
        <TextField label="Электронная почта" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>Войти</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
