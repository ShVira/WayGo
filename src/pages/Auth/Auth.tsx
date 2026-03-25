import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../features/app-context/AppContext';
import SiteButton from '../../features/SiteButton/SiteButton';
import UserDao from '../../entities/user/api/UserDao';
import { Layout } from '../../features/layout/Layout';
import './ui/Auth.css';

export default function Auth() {
    const [isLoginView, setIsLoginView] = useState(true);
    const { setUser, setBusy } = useContext(AppContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [base64Image, setBase64Image] = useState<string>("");

    useEffect(() => {
        const savedUser = window.localStorage.getItem("user-231");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [setUser]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBase64Image(reader.result as string);
            reader.readAsDataURL(file);
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
                address: "", 
                dob: "", 
                imageUrl: base64Image || "https://via.placeholder.com/150" 
            };
            
            try {
                // FIXED: Passing two arguments
                const res = await UserDao.register(newUser, password);

                // FIXED: Handling string vs object return type
                if (typeof res === "string") {
                    alert(res); 
                } else {
                    window.localStorage.setItem("user-231", JSON.stringify(res));
                    setUser(res);
                }
            } catch (error) {
                alert("Помилка реєстрації");
            }
        }
        setBusy(false);
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
                            <SiteButton 
                                text={isLoginView ? "УВІЙТИ" : "ЗАРЕЄСТРУВАТИСЯ"} 
                                type="submit" 
                            />
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