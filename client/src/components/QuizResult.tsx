// src/components/QuizResult.tsx
import { Paper, Typography, Button } from '@mui/material';

interface ResultProps {
  correct: number;
  total: number;
  timeTaken: number;
  onBack: () => void;
}

const QuizResult = ({ correct, total, timeTaken, onBack }: ResultProps) => {
  const score = (correct / total) * 100;

  return (
    <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Quiz Completed!</Typography>
      <Typography variant="h2" color="primary" sx={{ my: 2 }}>{score.toFixed(0)}%</Typography>
      <Typography variant="body1">Correct Answers: {correct} / {total}</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>Time Taken: {timeTaken} seconds</Typography>
      <Button variant="contained" onClick={onBack}>Back to Dashboard</Button>
    </Paper>
  );
};

export default QuizResult;