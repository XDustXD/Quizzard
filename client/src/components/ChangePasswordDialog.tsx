import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Box } from '@mui/material';
import api from '../api';
import type { ChangePasswordDto } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog = ({ open, onClose }: Props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const payload: ChangePasswordDto = { oldPassword, newPassword };
      await api.put('/api/Account/change-password', payload);
      setStatus('Пароль успешно изменён');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setStatus('Не удалось изменить пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Сменить пароль</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {status && <Alert severity={status.includes('успеш') || status.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{status.includes('успеш') || status.includes('successfully') ? 'Пароль успешно изменён' : 'Не удалось изменить пароль'}</Alert>}
          <TextField label="Старый пароль" type="password" fullWidth sx={{ mb: 2 }} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <TextField label="Новый пароль" type="password" fullWidth sx={{ mb: 2 }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!oldPassword || !newPassword || loading}>{loading ? 'Сохранение...' : 'Сменить'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
