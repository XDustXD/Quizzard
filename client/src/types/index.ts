export interface Category {
    id: string;
    name: string;
    quizzes?: Quiz[];
}

// src/types/index.ts
export interface Answer {
    id: string;
    text: string;
    isCorrect: boolean;
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
    timeLimit: number; // Duration in seconds
    questions?: Question[];
}