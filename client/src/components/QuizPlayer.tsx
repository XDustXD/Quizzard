import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Radio, FormControlLabel, Checkbox, LinearProgress } from '@mui/material';
import type { Quiz } from '../types';

interface Props {
  quiz: Quiz;
  onComplete: (selectedAnswers: Record<string, string[]>, timeTaken: number) => void;
}

const QuizPlayer = ({ quiz, onComplete }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);

  const currentQuestion = quiz.questions?.[currentIdx];

  const handleFinish = useCallback(() => {
    const finalMap = currentQuestion ? { ...answersMap, [currentQuestion.id]: selectedAnswers } : answersMap;

    const timeTaken = quiz.timeLimit - timeLeft;
    onComplete(finalMap, timeTaken);
  }, [answersMap, selectedAnswers, currentQuestion, quiz.timeLimit, onComplete, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinish]);

  const handleAnswerToggle = (answerId: string) => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.id;

    setSelectedAnswers(prev => {
      let next: string[];
      if (currentQuestion.isMultipleChoice) {
        next = prev.includes(answerId) ? prev.filter(id => id !== answerId) : [...prev, answerId];
      } else {
        next = [answerId];
      }

      setAnswersMap(m => ({ ...m, [questionId]: next }));
      return next;
    });
  };

  const handleNext = () => {
    if (currentIdx + 1 < (quiz.questions?.length || 0)) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextQuestionId = quiz.questions?.[nextIdx]?.id;
      setSelectedAnswers(nextQuestionId ? (answersMap[nextQuestionId] || []) : []);
    } else {
      handleFinish();
    }
  };

  

  if (!currentQuestion) return <Typography>Вопросов не найдено</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Вопрос {currentIdx + 1}/{quiz.questions?.length}</Typography>
        <Typography variant="h6" color={timeLeft < 10 ? 'error' : 'inherit'}>
          Осталось: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
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
          {currentIdx + 1 === quiz.questions?.length ? 'Завершить' : 'Далее'}
        </Button>
      </Paper>
    </Box>
  );
};

export default QuizPlayer;