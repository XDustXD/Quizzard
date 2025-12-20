import { useEffect, useState, useMemo } from 'react';
import { Container, TextField, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import Header from './components/Header';
import CategoryRow from './components/CategoryRow';
import QuizPlayer from './components/QuizPlayer';
import QuizResult from './components/QuizResult';
import type { Category, Quiz } from './types';

const App = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for Quiz flow
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<{correct: number, total: number, time: number} | null>(null);

  // 1. Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, catRes] = await Promise.all([
          axios.get<Quiz[]>('https://localhost:5001/api/Quizzes'),
          axios.get<Category[]>('https://localhost:5001/api/categories')
        ]);
        setQuizzes(quizRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Start Quiz Logic
  const startQuiz = async (quizId: string) => {
    try {
      const res = await axios.get<Quiz>(`https://localhost:5001/api/Quizzes/${quizId}`);
      setActiveQuiz(res.data);
    } catch (error) {
      console.error("Could not load quiz details:", error);
    }
  };

  const handleComplete = (correctCount: number, timeTaken: number) => {
    setResult({
      correct: correctCount,
      total: activeQuiz?.questions?.length || 0,
      time: timeTaken
    });
    setActiveQuiz(null);
  };

  // 3. Filter Logic
  const filteredQuizzes = useMemo(() => 
    quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase())),
  [search, quizzes]);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ mt: 4, pb: 4 }}>
        {result ? (
          <QuizResult {...result} onBack={() => setResult(null)} />
        ) : activeQuiz ? (
          <QuizPlayer quiz={activeQuiz} onComplete={handleComplete} />
        ) : (
          <>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for a quiz..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 4, bgcolor: 'white' }}
            />
            {categories.map(category => (
              <CategoryRow 
                key={category.id} 
                category={category} 
                quizzes={filteredQuizzes} 
                onStartQuiz={startQuiz} // Pass function down
              />
            ))}
          </>
        )}
      </Container>
    </Box>
  );
};

export default App;