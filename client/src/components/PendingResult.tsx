import { Box, Paper, Typography, Button } from '@mui/material';

interface Props {
  onScoreNow: () => void;
  onBack: () => void;
}

const PendingResult = ({ onScoreNow, onBack }: Props) => {
  return (
    <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Викторина завершена</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Вы завершили викторину. Войдите или зарегистрируйтесь, чтобы отправить ответы на проверку и сохранить результат.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={onScoreNow}>Войти и отправить</Button>
        <Button variant="outlined" onClick={onBack}>Вернуться на главную</Button>
      </Box>
    </Paper>
  );
};

export default PendingResult;
