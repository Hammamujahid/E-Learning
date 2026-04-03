export interface Subject {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface LearningMaterial {
    id: number;
    subject_id: number;
    subject?: {
        id: number;
        name: string;
    };
    name: string;
    created_by: string;
    description: string;
    file_path: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface Question {
    id: number;
    learning_material_id: number;
    learning_material?: {
        id: number;
        name: string;
    };
    media_path: string;
    question_text: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface Activity{
    id: number;
    model_id: number;
    type: string;
    description: string;
    action: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface Profile {
    id: number;
    user?:{
        id: number;
        name: string;
        email: string;
    }
    city?: {
        id: number;
        name: string;
    }
    fullname: string;
    birth_date: string;
    phone_number: string;
    gender: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}