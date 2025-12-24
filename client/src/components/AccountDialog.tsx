import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ChangePasswordDialog from './ChangePasswordDialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AccountDialog = ({ open, onClose }: Props) => {
  const [changePwOpen, setChangePwOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Профиль</Typography>
              <Card variant="outlined">
                <CardContent>
                  <Typography><strong>Имя:</strong> {user?.displayName ?? '-'}</Typography>
                  <Typography><strong>Почта:</strong> {user?.email ?? '-'}</Typography>
                  <Typography><strong>Роль:</strong> {user?.roleName ?? '-'}</Typography>
                </CardContent>
              </Card>
            </Box>

           
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
      <ChangePasswordDialog open={changePwOpen} onClose={() => setChangePwOpen(false)} />
    </Dialog>
  );
};

export default AccountDialog;
