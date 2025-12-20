import { Box, Typography } from '@mui/material';
import QuizCard from './QuizCard';
import { Quiz, Category } from '../types';

interface CategoryRowProps {
  category: Category;
  quizzes: Quiz[];
  onStartQuiz: (id: string) => void; // Add this
}

const CategoryRow = ({ category, quizzes, onStartQuiz }: CategoryRowProps) => {
  const categoryQuizzes = quizzes.filter(q => q.categoryId === category.id);

  if (categoryQuizzes.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{category.name}</Typography>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {categoryQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} onStart={() => onStartQuiz(quiz.id)} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryRow;