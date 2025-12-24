import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, Box, IconButton, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import api from '../api';
import type { PostQuizDto, PostQuestionWithAnswersDto, CreateAnswerDto } from '../types';
import type { Category } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onCreated?: () => void;
  // optional initial payload when editing an existing quiz
  initial?: {
    id: string;
    title: string;
    description?: string;
    timeLimit: number;
    categoryId: string;
    questions: PostQuestionWithAnswersDto[];
  } | null;
  onUpdated?: () => void;
}

const emptyAnswer = (): CreateAnswerDto => ({ text: '', isCorrect: false });
const emptyQuestion = (): PostQuestionWithAnswersDto => ({ text: '', isMultipleChoice: false, answers: [emptyAnswer(), emptyAnswer()] });

const CreateQuizDialog = ({ open, onClose, categories, onCreated, initial, onUpdated }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(300);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [questions, setQuestions] = useState<PostQuestionWithAnswersDto[]>([emptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = () => {
    setTitle('');
    setDescription('');
    setTimeLimit(300);
    setCategoryId(categories[0]?.id ?? '');
    setQuestions([emptyQuestion()]);
    setEditingId(null);
  };

  // prefill when editing
  useEffect(() => {
    if ((initial) && open) {
      setTitle(initial.title ?? '');
      setDescription(initial.description ?? '');
      setTimeLimit(initial.timeLimit ?? 300);
      setCategoryId(initial.categoryId ?? categories[0]?.id ?? '');
      setQuestions(initial.questions?.map(q => ({ text: q.text, isMultipleChoice: q.isMultipleChoice, answers: q.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })) })) ?? [emptyQuestion()]);
      setEditingId(initial.id);
    }
    if (!open && !initial) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  const addQuestion = () => setQuestions(qs => [...qs, emptyQuestion()]);
  const removeQuestion = (idx: number) => setQuestions(qs => qs.filter((_, i) => i !== idx));
  const updateQuestion = (idx: number, next: PostQuestionWithAnswersDto) => setQuestions(qs => qs.map((q, i) => i === idx ? next : q));

  const handleSubmit = async () => {
    if (!title || !categoryId || questions.length === 0) return;
    for (const q of questions) {
      if (q.answers.length < 2) return;
      if (!q.answers.some(a => a.isCorrect)) return;
    }

    const normalizedQuestions = questions.map(q => ({ ...q, isMultipleChoice: q.answers.filter(a => a.isCorrect).length > 1 }));
    const payload: PostQuizDto = { title, description, timeLimit, categoryId, questions: normalizedQuestions };
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/api/Quizzes/${editingId}`, payload);
        onClose();
        setEditingId(null);
        onUpdated?.();
      } else {
        await api.post('/api/Quizzes', payload);
        onClose();
        reset();
        onCreated?.();
      }
    } catch (err) {
      console.error('Failed to save quiz', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{editingId ? 'Редактировать викторину' : 'Создать викторину'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Название" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-label">Категория</InputLabel>
            <Select labelId="category-label" value={categoryId} label="Категория" onChange={(e) => setCategoryId(String(e.target.value))}>
              {categories.map(c => <MenuItem value={c.id} key={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <TextField label="Описание" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Лимит времени (сек)" type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} sx={{ mb: 2 }} />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Вопросы</Typography>
            <Button startIcon={<AddCircleOutlineIcon />} onClick={addQuestion}>Добавить вопрос</Button>
          </Box>

          {questions.map((q, qi) => (
            <Box key={qi} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                {/* Make question text field use the same flex as answers for consistent widths */}
                <TextField label={`Вопрос ${qi + 1}`} value={q.text} onChange={(e) => updateQuestion(qi, { ...q, text: e.target.value })} sx={{ flex: 1 }} />
                <IconButton onClick={() => removeQuestion(qi)}><RemoveCircleOutlineIcon /></IconButton>
              </Box>

              <Box>
                {q.answers.map((a, ai) => (
                  <Box key={ai} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <TextField label={`Ответ ${ai + 1}`} value={a.text} onChange={(e) => {
                      const next = q.answers.map((ax, i) => i === ai ? { ...ax, text: e.target.value } : ax);
                      updateQuestion(qi, { ...q, answers: next });
                    }} sx={{ flex: 1 }} />
                    <FormControlLabel control={<Checkbox checked={a.isCorrect} onChange={(e) => {
                      const next = q.answers.map((ax, i) => i === ai ? { ...ax, isCorrect: e.target.checked } : ax);
                      updateQuestion(qi, { ...q, answers: next });
                    }} />} label="Верный" />
                    <IconButton onClick={() => {
                      const next = q.answers.filter((_, i) => i !== ai);
                      updateQuestion(qi, { ...q, answers: next });
                    }}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      const next = [...q.answers.slice(0, ai + 1), emptyAnswer(), ...q.answers.slice(ai + 1)];
                      updateQuestion(qi, { ...q, answers: next });
                    }}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { onClose(); setEditingId(null); }}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>{editingId ? 'Сохранить' : 'Создать'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuizDialog;
