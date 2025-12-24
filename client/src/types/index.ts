export interface Category {
    id: string;
    name: string;
    quizzes?: Quiz[];
}

export interface Answer {
    id: string;
    text: string;
    isCorrect?: boolean;
}

export interface Question {
    id: string;
    text: string;
    isMultipleChoice: boolean;
    answers: Answer[];
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    categoryName: string;
    timeLimit: number;
    questions?: Question[];
}

export interface SubmitQuizDto {
    quizId: string;
    durationSeconds: number;
    selectedAnswers: Record<string, string[]>;
}

export interface ResultDto {
    id: string;
    correctCount: number;
    totalCount: number;
    scorePoint: number;
    durationSeconds: number;
}

export interface LeaderboardEntry {
    userName: string;
    averageScore: number;
    quizzesTaken: number;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}

export interface ResultHistoryEntry {
    quizTitle: string;
    score: number;
    correctCount: number;
    totalCount: number;
    durationSeconds: number;
    dateTaken: string; 
}

export interface CreateAnswerDto {
    text: string;
    isCorrect: boolean;
}

export interface PostQuestionWithAnswersDto {
    text: string;
    isMultipleChoice: boolean;
    answers: CreateAnswerDto[];
}

export interface PostQuizDto {
    title: string;
    description?: string;
    timeLimit: number;
    categoryId: string;
    questions: PostQuestionWithAnswersDto[];
}