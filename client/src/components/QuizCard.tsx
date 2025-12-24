import type { Quiz } from '../types';
import { Card, CardContent, CardActions, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface QuizCardProps {
  quiz: Quiz;
  onStart: () => void;
  onEdit?: (q: Quiz) => void;
  onDelete?: (id: string) => void;
}

const QuizCard = ({ quiz, onStart, onEdit, onDelete }: QuizCardProps) => {
  const { user } = useAuth();
  const isAdmin = user?.roleName?.toLowerCase() === 'admin';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  return (
    <Card sx={{ 
      width: 280, 
      height: 220,
      display: 'flex', 
      flexDirection: 'column',
      flexShrink: 0,
      position: 'relative'
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>{quiz.title}</Typography>
        <Typography variant="caption" color="primary" gutterBottom>
          Доступное время: {quiz.timeLimit} сек
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mt: 1
        }}>
          {quiz.description}
        </Typography>

        {isAdmin && (
          <IconButton size="small" onClick={handleOpenMenu} aria-label="more" sx={{ position: 'absolute', top: 8, right: 8 }}>
            <MoreVertIcon />
          </IconButton>
        )}
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem onClick={() => { handleCloseMenu(); onEdit?.(quiz); }}>{'Редактировать'}</MenuItem>
          <MenuItem onClick={() => { handleCloseMenu(); onDelete?.(quiz.id); }}>{'Удалить'}</MenuItem>
        </Menu>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" fullWidth onClick={onStart}>
          Начать викторину
        </Button>
      </CardActions>
    </Card>
  );
};
export default QuizCard;