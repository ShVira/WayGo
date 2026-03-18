import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../features/app-context/AppContext';
import SiteButton from '../../features/SiteButton/SiteButton';
import UserDao from '../../entities/user/api/UserDao';
import { Layout } from '../../features/layout/Layout';
import './ui/Auth.css';

export default function Auth() {
    const [isLoginView, setIsLoginView] = useState(true);
    const { setUser, setBusy } = useContext(AppContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form States
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [base64Image, setBase64Image] = useState<string>(""); // Store the image string here

    // Function to handle file selection and conversion
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result as string);
            };
            reader.readAsDataURL(file); // Converts image to Base64
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);

        if (isLoginView) {
            const res = await UserDao.authenticate(login, password);
            if (res) {
                window.localStorage.setItem("user-231", JSON.stringify(res));
                setUser(res);
            } else {
                alert("Невірний логін або пароль");
            }
        } else {
            const newUser = {
                name,
                login,
                email,
                address: "Odesa",
                dob: "20/05/1998",
                // Use the uploaded image, or a default if empty
                imageUrl: base64Image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            };
            const res = await UserDao.register(newUser);
            window.localStorage.setItem("user-231", JSON.stringify(res));
            setUser(res);
        }
        setBusy(false);
    };

    return (
        <Layout>
            <div className="auth-container">
                <div className="auth-card">
                    <h1 className="auth-title">{isLoginView ? 'Вхід' : 'Реєстрація'}</h1>
                    
                    <form onSubmit={handleAuth} className="auth-form">
                        {!isLoginView && (
                            <>
                                {/* Profile Picture Upload UI */}
                                <div className="text-center mb-4">
                                    <div 
                                        className="upload-avatar-circle"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ backgroundImage: `url(${base64Image})`, backgroundSize: 'cover' }}
                                    >
                                        {!base64Image && <i className="bi bi-camera"></i>}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        style={{ display: 'none' }} 
                                        accept="image/*"
                                    />
                                    <p className="small text-muted mt-2">Додати фото профілю</p>
                                </div>

                                <div className="input-group">
                                    <label>ПІБ</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Василь Васильович" required />
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@example.com" required />
                                </div>
                            </>
                        )}

                        <div className="input-group">
                            <label>Логін</label>
                            <input type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="user123" required />
                        </div>

                        <div className="input-group">
                            <label>Пароль</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>

                       <div className="auth-actions">
                            <SiteButton text={isLoginView ? "Увійти" : "Зареєструватися"} onClick={() => {}} />
                            <button type="button" className="toggle-btn" onClick={() => setIsLoginView(!isLoginView)}>
                                {isLoginView ? "Немає акаунту? Реєстрація" : "Вже є акаунт? Увійти"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}