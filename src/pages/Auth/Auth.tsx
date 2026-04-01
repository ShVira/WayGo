import React, { useState, useRef } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './ui/Auth.css';

export default function Auth() {
    const [isLoginView, setIsLoginView] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [base64Image, setBase64Image] = useState<string>("");
    
    // Local states for better UX
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLoginView) {
                // Firebase Login
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // Firebase Register
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Update profile with name and photo
                await updateProfile(userCredential.user, {
                    displayName: name,
                    photoURL: base64Image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
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
                            <>
                                <div className="avatar-upload-container">
                                    <div 
                                        className="upload-avatar-circle"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ backgroundImage: `url(${base64Image})`, backgroundSize: 'cover' }}
                                    >
                                        {!base64Image && <i className="bi bi-camera"></i>}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                                    <p className="upload-text">Додати фото профілю</p>
                                </div>
                                <div className="input-group">
                                    <label>ПІБ</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Василь Васильович" required />
                                </div>
                            </>
                        )}

                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@example.com" required />
                        </div>

                        <div className="input-group">
                            <label>Пароль</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>

                        <div className="auth-actions">
                            <SiteButton 
                                text={isLoading ? "ЗАВАНТАЖЕННЯ..." : (isLoginView ? "УВІЙТИ" : "ЗАРЕЄСТРУВАТИСЯ")} 
                                type="submit" 
                                disabled={isLoading}
                            />
                            <button 
                                type="button" 
                                className="toggle-btn" 
                                onClick={() => {
                                    setIsLoginView(!isLoginView);
                                    setError(null);
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
