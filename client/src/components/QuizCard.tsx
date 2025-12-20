import type { Quiz } from '../types';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

interface QuizCardProps {
  quiz: Quiz;
  onStart: () => void;
}

const QuizCard = ({ quiz, onStart }: QuizCardProps) => {
  return (
    <Card sx={{ 
      width: 280, 
      height: 220, // Increased height for the button
      display: 'flex', 
      flexDirection: 'column',
      flexShrink: 0 
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>{quiz.title}</Typography>
        <Typography variant="caption" color="primary" gutterBottom>
          Time Limit: {quiz.timeLimit}s
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
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" fullWidth onClick={onStart}>
          Start Quiz
        </Button>
      </CardActions>
    </Card>
  );
};
export default QuizCard;