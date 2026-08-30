export interface Subject {
    id: number;
    name: string;
    description: string | null;
    is_deleted: boolean;
    created_at: string | null;
    updated_at: string | null;
}

export interface City {
    id: number;
    name: string;
    is_deleted: boolean;
    created_at: string | null;
    updated_at: string | null;
}

/** Minimal shape used for select inputs and badges. */
export interface SubjectRef {
    id: number;
    name: string;
}

export interface LearningMaterial {
    id: number;
    name: string;
    description: string | null;
    file_path: string | null;
    is_deleted: boolean;
    created_at: string | null;
    subject: SubjectRef | null;
    creator_name: string | null;
    questions_count?: number;
    can?: { update: boolean; delete: boolean };
}

/** Answer option as shown to a student: no `is_correct` field exists here. */
export interface AnswerOption {
    id: number;
    answer_text: string;
    media_path: string | null;
}

/** Answer as shown to a teacher or admin managing the bank. */
export interface Answer extends AnswerOption {
    is_correct: boolean;
}

export interface Question {
    id: number;
    question_text: string;
    media_path: string | null;
    created_at?: string | null;
    answers: Answer[];
    can: { update: boolean; delete: boolean };
}

/** Question as delivered to a student taking a quiz. */
export interface QuizQuestion {
    id: number;
    question_text: string;
    media_path: string | null;
    answers: AnswerOption[];
}

export type QuizAttemptStatus = 'in_progress' | 'submitted';

export interface QuizAttempt {
    id: number;
    score: number;
    status: QuizAttemptStatus;
    submitted_at: string | null;
    created_at: string | null;
}

export interface QuestionResult {
    question_id: number;
    question_text: string;
    media_path: string | null;
    is_correct: boolean;
    chosen_answer_id: number | null;
    correct_answer_id: number | null;
    answers: AnswerOption[];
}

export interface QuizResult {
    quiz_attempt_id: number;
    learning_material_id: number;
    score: number;
    correct_count: number;
    total: number;
    submitted_at: string | null;
    results: QuestionResult[];
}

export type ActivityType = 'user' | 'learning_material' | 'question';
export type ActivityAction = 'created' | 'updated' | 'deleted';

export interface Activity {
    id: number;
    model_id: number;
    type: ActivityType;
    action: ActivityAction;
    description: string;
    created_at: string | null;
}

export interface Profile {
    id: number;
    fullname: string | null;
    birth_date: string | null;
    phone_number: string | null;
    gender: string | null;
    is_deleted: boolean;
    city: SubjectRef | null;
    city_id: number | null;
}
