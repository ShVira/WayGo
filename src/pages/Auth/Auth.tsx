import React, { useState } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './ui/Auth.css';

export default function Auth() {
    const [isLoginView, setIsLoginView] = useState(true);

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
    // Local states for better UX
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isPasswordValid = isLoginView || passwordRegex.test(password);
    const isEmailValid = isLoginView || emailRegex.test(email);
    const isNameValid = isLoginView || name.trim().length > 0;

    const isFormValid = isLoginView 
        ? (email.length > 0 && password.length > 0)
        : (isPasswordValid && isEmailValid && isNameValid);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        setError(null);

        try {
            if (isLoginView) {
                // Firebase Login
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // Firebase Register
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Update profile with name only
                await updateProfile(userCredential.user, {
                    displayName: name
                });
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            // Map Firebase errors to user-friendly messages
            let message = "Помилка авторизації. Перевірте дані.";
            if (error.code === 'auth/email-already-in-use') {
                message = "Цей Email вже використовується іншим користувачем.";
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                message = "Невірний Email або пароль.";
            } else if (error.code === 'auth/weak-password') {
                message = "Пароль має бути не менше 6 символів.";
            } else if (error.message) {
                message = error.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-logo-section">
                        <h2 className="waygo-logo">📍 WayGo</h2>
                        <p className="waygo-tagline">знайди свій вайб поруч</p>
                    </div>

                    <h1 className="auth-title">{isLoginView ? 'Вхід' : 'Реєстрація'}</h1>
                    
                    {error && <div className="auth-error-message">{error}</div>}

                    <form onSubmit={handleAuth} className="auth-form">
                        {!isLoginView && (
                            <div className="input-group">
                                <label>ПІБ</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Василь Васильович" required />
                                {!isNameValid && name.length > 0 && <span className="input-error-hint">Введіть ім'я</span>}
                            </div>
                        )}

                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@example.com" required />
                            {!isEmailValid && email.length > 0 && <span className="input-error-hint">Некоректний формат email</span>}
                        </div>

                        <div className="input-group">
                            <label>Пароль</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                            {!isPasswordValid && !isLoginView && password.length > 0 && (
                                <span className="input-error-hint">
                                    Пароль має містити від 8 символів, 1 велику літеру та 1 цифру
                                </span>
                            )}
                        </div>

                        <div className="auth-actions">
                            <SiteButton 
                                text={isLoading ? "ЗАВАНТАЖЕННЯ..." : (isLoginView ? "УВІЙТИ" : "ЗАРЕЄСТРУВАТИСЯ")} 
                                type="submit" 
                                disabled={isLoading || !isFormValid}
                                icon={isLoading ? "spinner" : undefined}
                            />
                            <button 
                                type="button" 
                                className="toggle-btn" 
                                onClick={() => {
                                    setIsLoginView(!isLoginView);
                                    setError(null);
                                    setName("");
                                    setEmail("");
                                    setPassword("");
                                }}
                                disabled={isLoading}
                            >
                                {isLoginView ? "Немає акаунту? Реєстрація" : "Вже є акаунт? Увійти"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
