import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AboutDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>О Quizzard</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Quizzard — простое приложение для викторин, демонстрирующее full-stack пример на ASP.NET Core и React.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Проект разраобатан с учебной целью. Исходный код доступен на <a href="https://github.com/xdustxd/Quizzard">GitHub</a>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
