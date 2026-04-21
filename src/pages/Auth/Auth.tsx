import React, { useState, useContext } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import UserDao from '../../entities/user/api/UserDao';
import { AppContext } from '../../features/app-context/AppContext';
import './ui/Auth.css';

export default function Auth() {
    const { setUser } = useContext(AppContext);
    const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    const isPasswordValid = view !== 'register' || passwordRegex.test(password);
    const isEmailValid = emailRegex.test(email);
    const isNameValid = view !== 'register' || name.trim().length > 0;
    const isUsernameValid = view !== 'register' || usernameRegex.test(username);

    const isFormValid = () => {
        if (view === 'login') return email.length > 0 && password.length > 0;
        if (view === 'register') return isPasswordValid && isEmailValid && isNameValid && isUsernameValid;
        if (view === 'forgot') return isEmailValid;
        return false;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (view === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
            } else if (view === 'register') {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                await updateProfile(userCredential.user, {
                    displayName: name
                });

                const newUser = {
                    uid: userCredential.user.uid,
                    fullName: name,
                    email: email,
                    username: username,
                    dateOfBirth: '',
                    city: '',
                    phoneNumber: '',
                    bio: ''
                };

                await UserDao.createUser(newUser);
                setUser(newUser);
            } else if (view === 'forgot') {
                await sendPasswordResetEmail(auth, email);
                setSuccessMessage("Інструкції з відновлення пароля надіслано на вашу пошту.");
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            let message = "Помилка. Перевірте дані.";
            if (error.code === 'auth/email-already-in-use') {
                message = "Цей Email вже використовується.";
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                message = "Невірний Email або пароль.";
            } else if (error.code === 'auth/weak-password') {
                message = "Пароль занадто слабкий.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Забагато спроб. Спробуйте пізніше.";
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

                    <h1 className="auth-title">
                        {view === 'login' ? 'Вхід' : view === 'register' ? 'Реєстрація' : 'Відновлення'}
                    </h1>
                    
                    {error && <div className="auth-error-message">{error}</div>}
                    {successMessage && <div className="auth-success-message">{successMessage}</div>}

                    <form onSubmit={handleAuth} className="auth-form">
                        {view === 'register' && (
                            <>
                                <div className="input-group">
                                    <label>ПІБ</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Василь Васильович" required />
                                    {!isNameValid && name.length > 0 && <span className="input-error-hint">Введіть ім'я</span>}
                                </div>
                                <div className="input-group">
                                    <label>Username</label>
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="vasya_cool" required />
                                    {!isUsernameValid && username.length > 0 && <span className="input-error-hint">3-20 символів, лише латиниця, цифри та _</span>}
                                </div>
                            </>
                        )}

                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@example.com" required />
                            {!isEmailValid && email.length > 0 && <span className="input-error-hint">Некоректний формат email</span>}
                        </div>

                        {view !== 'forgot' && (
                            <div className="input-group">
                                <label>Пароль</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                                {!isPasswordValid && view === 'register' && password.length > 0 && (
                                    <span className="input-error-hint">
                                        Від 8 символів, 1 велика літера та 1 цифра
                                    </span>
                                )}
                            </div>
                        )}

                        {view === 'login' && (
                            <button type="button" className="forgot-password-link" onClick={() => setView('forgot')}>
                                Забули пароль?
                            </button>
                        )}

                        <div className="auth-actions">
                            <SiteButton 
                                text={isLoading ? "ЗАВАНТАЖЕННЯ..." : (view === 'login' ? "УВІЙТИ" : view === 'register' ? "ЗАРЕЄСТРУВАТИСЯ" : "ВІДПРАВИТИ")} 
                                type="submit" 
                                disabled={isLoading || !isFormValid()}
                                icon={isLoading ? "spinner" : undefined}
                            />
                            <SiteButton 
                                type="button" 
                                className="toggle-btn" 
                                onClick={() => {
                                    setView(view === 'login' ? 'register' : 'login');
                                    setError(null);
                                    setSuccessMessage(null);
                                    setName("");
                                    setUsername("");
                                    setEmail("");
                                    setPassword("");
                                }}
                                disabled={isLoading}
                                text={view === 'login' ? "Немає акаунту? Реєстрація" : "Вже є акаунт? Увійти"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
