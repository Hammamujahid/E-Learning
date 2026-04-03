

// =====================
// 🔐 TOKEN

import { User } from "@/types";

// =====================
export function getToken(): string | null {
    return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
    localStorage.setItem("auth_token", token);
}

export function removeToken() {
    localStorage.removeItem("auth_token");
}

// =====================
// 👤 USER
// =====================
export function getUser(): User | null {
    const user = localStorage.getItem("auth_user");
    return user ? JSON.parse(user) : null;
}

export function setUser(user: User) {
    localStorage.setItem("auth_user", JSON.stringify(user));
}

export function removeUser() {
    localStorage.removeItem("auth_user");
}

// =====================
// 🚪 LOGOUT
// =====================
export function clearAuth() {
    removeToken();
    removeUser();
}

export function redirectToLogin() {
    window.location.href = "/";
}
