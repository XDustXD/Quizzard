import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Radio, FormControlLabel, Checkbox, LinearProgress } from '@mui/material';
import type { Quiz } from '../types';

interface Props {
  quiz: Quiz;
  onComplete: (score: number, timeTaken: number) => void;
}

const QuizPlayer = ({ quiz, onComplete }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = quiz.questions?.[currentIdx];

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerToggle = (answerId: string) => {
    if (currentQuestion?.isMultipleChoice) {
      setSelectedAnswers(prev => 
        prev.includes(answerId) ? prev.filter(id => id !== answerId) : [...prev, answerId]
      );
    } else {
      setSelectedAnswers([answerId]);
    }
  };

  const handleNext = () => {
    // Basic scoring logic: check if selected answers match correct answers
    const correctIds = currentQuestion?.answers.filter(a => a.isCorrect).map(a => a.id) || [];
    const isCorrect = selectedAnswers.length === correctIds.length && 
                      selectedAnswers.every(id => correctIds.includes(id));
    
    if (isCorrect) setCorrectCount(prev => prev + 1);

    if (currentIdx + 1 < (quiz.questions?.length || 0)) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswers([]);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const timeTaken = quiz.timeLimit - timeLeft;
    onComplete(correctCount, timeTaken);
  };

  if (!currentQuestion) return <Typography>No questions found.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Question {currentIdx + 1}/{quiz.questions?.length}</Typography>
        <Typography variant="h6" color={timeLeft < 10 ? 'error' : 'inherit'}>
          Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={((currentIdx) / quiz.questions!.length) * 100} sx={{ mb: 4 }} />

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>{currentQuestion.text}</Typography>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
          {currentQuestion.answers.map((answer) => (
            <FormControlLabel
              key={answer.id}
              control={
                currentQuestion.isMultipleChoice 
                ? <Checkbox checked={selectedAnswers.includes(answer.id)} onChange={() => handleAnswerToggle(answer.id)} />
                : <Radio checked={selectedAnswers.includes(answer.id)} onChange={() => handleAnswerToggle(answer.id)} />
              }
              label={answer.text}
            />
          ))}
        </Box>
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 4 }} 
          onClick={handleNext}
          disabled={selectedAnswers.length === 0}
        >
          {currentIdx + 1 === quiz.questions?.length ? "Finish" : "Next"}
        </Button>
      </Paper>
    </Box>
  );
};

export default QuizPlayer;