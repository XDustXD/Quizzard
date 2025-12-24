import { useEffect, useState, useMemo } from 'react';
import { Container, TextField, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Typography } from '@mui/material';
import axios from 'axios';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import AboutDialog from './components/AboutDialog';
import PendingResult from './components/PendingResult';
import { useAuth } from './context/AuthContext';
import api from './api';
import AccountDialog from './components/AccountDialog';
import CreateQuizDialog from './components/CreateQuizDialog';
import CategoryRow from './components/CategoryRow';
import QuizPlayer from './components/QuizPlayer';
import QuizResult from './components/QuizResult';
import type { Category, Quiz, SubmitQuizDto, ResultDto } from './types';

const App = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<{correct: number, total: number, timeTaken: number} | null>(null);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<SubmitQuizDto | null>(null);
  const auth = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' }>({ open: false, message: '' });

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const sendPending = async () => {
      if (!auth.user || !pendingSubmit) return;
      try {
        const res = await api.post<ResultDto>('/api/Results', pendingSubmit);
        const dto = res.data;

        setResult({ correct: dto.correctCount, total: dto.totalCount, timeTaken: dto.durationSeconds });
        setPendingSubmit(null);
      } catch (err) {
        console.error('Failed to submit pending quiz:', err);
      }
    };
    sendPending();
  }, [auth.user, pendingSubmit]);

  const startQuiz = async (quizId: string) => {
    try {
      const [metaRes, questionsRes] = await Promise.all([
        axios.get<Quiz>(`https://localhost:5001/api/Quizzes/${quizId}`),
        axios.get<import('./types').Question[]>(`https://localhost:5001/api/Quizzes/${quizId}/questions`)
      ]);
      const combined: Quiz = { ...metaRes.data, questions: questionsRes.data };

      setActiveQuiz(combined);
    } catch (error) {
      console.error("Could not load quiz details:", error);
    }
  };

  const handleComplete = async (selectedAnswers: Record<string, string[]>, timeTaken: number) => {
    if (!activeQuiz) return;

    const payload: SubmitQuizDto = {
      quizId: activeQuiz.id,
      durationSeconds: timeTaken,
      selectedAnswers
    };

    if (auth.user) {
      try {
        const res = await api.post<ResultDto>('/api/Results', payload);
        const dto = res.data;

        setResult({
          correct: dto.correctCount,
          total: dto.totalCount,
          timeTaken: dto.durationSeconds
        });
        setActiveQuiz(null);
      } catch (err) {
        console.error('Failed to submit quiz:', err);
      }
    } else {
      setPendingSubmit(payload);
      setActiveQuiz(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteCandidate(id);
    setDeleteDialogOpen(true);
  };

      const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await api.delete(`/api/Quizzes/${deleteCandidate}`);
      setSnack({ open: true, message: 'Викторина удалена', severity: 'success' });
      setDeleteDialogOpen(false);
      setDeleteCandidate(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete quiz', err);
      setSnack({ open: true, message: 'Не удалось удалить викторину', severity: 'error' });
    }
  };

  const handleEdit = async (quiz: Quiz) => {
    try {
      const [metaRes, questionsRes] = await Promise.all([
        axios.get<Quiz>(`https://localhost:5001/api/Quizzes/${quiz.id}`),
        api.get<any[]>(`/api/Quizzes/${quiz.id}/admin`)
      ]);

      const questions = questionsRes.data.map(q => ({
        text: q.text,
        isMultipleChoice: q.isMultipleChoice,
        answers: q.answers.map((a: any) => ({ text: a.text, isCorrect: a.isCorrect }))
      }));

      setEditingQuiz({ id: quiz.id, title: metaRes.data.title, description: metaRes.data.description, timeLimit: metaRes.data.timeLimit, categoryId: metaRes.data.categoryId, questions });
      setAdminOpen(true);
    } catch (err) {
      console.error('Failed to load quiz for editing', err);
    }
  };

  const filteredQuizzes = useMemo(() => 
    quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase())),
  [search, quizzes]);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Header
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        loginOpen={loginOpen}
        setLoginOpen={setLoginOpen}
        registerOpen={registerOpen}
        setRegisterOpen={setRegisterOpen}
        setAccountOpen={setAccountOpen}
        setAdminOpen={setAdminOpen}
      />
      <Leaderboard open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CreateQuizDialog open={adminOpen} onClose={() => { setAdminOpen(false); setEditingQuiz(null); }} categories={categories} onCreated={() => fetchData()} initial={editingQuiz} onUpdated={() => { fetchData(); setEditingQuiz(null); }} />
      <AccountDialog open={accountOpen} onClose={() => { setAccountOpen(false); }} />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удалить викторину</DialogTitle>
          <DialogContent>
            <Typography>Вы уверены, что хотите удалить эту викторину? Это действие нельзя отменить.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button color="error" variant="contained" onClick={confirmDelete}>Удалить</Button>
          </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity ?? 'success'} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <Container sx={{ mt: 10, pb: 4 }}>
          {result ? (
            <QuizResult {...result} onBack={() => setResult(null)} />
          ) : pendingSubmit ? (
            <PendingResult
              onScoreNow={() => setLoginOpen(true)}
              onBack={() => setPendingSubmit(null)}
            />
          ) : activeQuiz ? (
            <QuizPlayer quiz={activeQuiz} onComplete={handleComplete} />
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={'Поиск викторины...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ bgcolor: 'white' }}
                />
                {auth.user?.roleName?.toLowerCase() === 'admin' && (
                  <Button variant="contained" onClick={() => setAdminOpen(true)}>Добавить викторину</Button>
                )}
              </Box>
                {categories.map(category => (
                  <CategoryRow 
                    key={category.id} 
                    category={category} 
                    quizzes={filteredQuizzes} 
                    onStartQuiz={startQuiz}
                    onDeleteQuiz={handleDelete}
                    onEditQuiz={handleEdit}
                  />
                ))}
            </>
          )}
          </Container>
        </Box>
  );
};

export default App;