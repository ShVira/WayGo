import { useContext, useState, useEffect } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css'; 
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signOut, updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { Pencil, X, Mail, Calendar, MapPin, Bookmark, CheckCircle2, ThumbsUp, ThumbsDown, ChevronRight, User, AtSign, Phone, Info, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserDao from '../../entities/user/api/UserDao';

export default function Profile() {
    const { user, setUser } = useContext(AppContext);
    const { savedLocations, visitedLocations, setMessage } = useSaved();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'saved' | 'visited'>('saved');
    
    const [editData, setEditData] = useState({
        fullName: user?.fullName || "",
        username: user?.username || "",
        email: user?.email || "",
        city: user?.city || "",
        dateOfBirth: user?.dateOfBirth || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.bio || ""
    });

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const CITIES_DB = [
        "Київ", "Львів", "Одеса", "Харків", "Дніпро", "Вінниця", "Запоріжжя", 
        "Івано-Франківськ", "Тернопіль", "Луцьк", "Рівне", "Полтава", "Чернігів", 
        "Черкаси", "Житомир", "Суми", "Хмельницький", "Чернівці", "Миколаїв", 
        "Херсон", "Ужгород", "Париж", "Ліон", "Марсель", "Бордо", "Ніцца", "Страсбург"
    ];

    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const likedVisited = visitedLocations.filter((l: any) => l.visitStatus === 'liked');
    const dislikedVisited = visitedLocations.filter((l: any) => l.visitStatus === 'disliked');

    const handleForgotPassword = async () => {
        if (!user?.email) return;
        setIsSaving(true);
        setPasswordError(null);
        try {
            await sendPasswordResetEmail(auth, user.email);
            setResetSent(true);
            setMessage({ text: "Лист для відновлення надіслано", type: 'success' });
            setTimeout(() => setResetSent(false), 5000);
        } catch (error: any) {
            console.error("Reset error:", error);
            setPasswordError("Не вдалося відправити лист.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (user) {
            setEditData({
                fullName: user.fullName || "",
                username: user.username || "",
                email: user.email || "",
                city: user.city || "",
                dateOfBirth: user.dateOfBirth || "",
                phoneNumber: user.phoneNumber || "+380",
                bio: user.bio || ""
            });
        }
    }, [user]);

    const handleCityChange = (val: string) => {
        setEditData({ ...editData, city: val });
        if (val.length > 0) {
            const filtered = CITIES_DB.filter(c => 
                c.toLowerCase().startsWith(val.toLowerCase())
            ).slice(0, 5);
            setCitySuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handlePhoneChange = (val: string) => {
        if (!val.startsWith('+')) {
            val = '+' + val.replace(/\+/g, '');
        }
        setEditData({ ...editData, phoneNumber: val });
    };

    const selectCity = (city: string) => {
        setEditData({ ...editData, city });
        setShowSuggestions(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const validatePhone = (phone: string) => {
        if (!phone) return true;
        const phoneRegex = /^\+?380\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleSave = async () => {
        if (!auth.currentUser || !user) return;
        
        // Validation
        if (!validatePhone(editData.phoneNumber)) {
            setPhoneError("Некоректний номер (+380...)");
            return;
        }
        setPhoneError(null);

        setIsSaving(true);
        try {
            // If email changed, we need to handle it carefully in Firebase Auth
            if (editData.email !== user.email) {
                // This usually requires a recent login. We'll try, but it might fail.
                try {
                    await updateEmail(auth.currentUser, editData.email);
                } catch (e: any) {
                    if (e.code === 'auth/requires-recent-login') {
                        setMessage({ text: "Для зміни email потрібно перезайти в акаунт", type: 'error' });
                        setIsSaving(false);
                        return;
                    }
                    throw e;
                }
            }

            // Update Firestore
            await UserDao.updateUser(user.uid, editData);

            // Update Firebase Auth display name
            if (editData.fullName !== user.fullName) {
                await updateProfile(auth.currentUser, {
                    displayName: editData.fullName
                });
            }

            // Update global state
            setUser({
                ...user,
                ...editData
            });

            setIsEditing(false);
            setMessage({ text: "Профіль оновлено", type: 'success' });
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setMessage({ text: `Помилка: ${error.message}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setPasswordError("Паролі не співпадають");
            return;
        }
        if (passwords.new.length < 8) {
            setPasswordError("Пароль має бути не менше 8 символів");
            return;
        }

        setIsSaving(true);
        setPasswordError(null);
        try {
            const fbUser = auth.currentUser;
            if (fbUser && fbUser.email) {
                const credential = EmailAuthProvider.credential(fbUser.email, passwords.old);
                await reauthenticateWithCredential(fbUser, credential);
                await updatePassword(fbUser, passwords.new);
                setPasswordSuccess(true);
                setMessage({ text: "Пароль змінено", type: 'success' });
                setPasswords({ old: "", new: "", confirm: "" });
                setTimeout(() => {
                    setShowPasswordChange(false);
                    setPasswordSuccess(false);
                }, 3000);
            }
        } catch (error: any) {
            console.error("Password change error:", error);
            let msg = "Не вдалося змінити пароль.";
            if (error.code === 'auth/wrong-password') msg = "Невірний старий пароль.";
            setPasswordError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditData({
                fullName: user.fullName || "",
                username: user.username || "",
                email: user.email || "",
                city: user.city || "",
                dateOfBirth: user.dateOfBirth || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.bio || ""
            });
        }
        setPhoneError(null);
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <Layout>
            <div className="profile-page profile-page--no-photo">
                <div className="profile-details-column">
                    <header className="profile-header">
                        <div className="title-section">
                            <div className="title-row">
                                {isEditing ? (
                                    <div className="edit-container">
                                        <input 
                                            className="edit-input title-input" 
                                            value={editData.fullName} 
                                            onChange={(e) => setEditData({...editData, fullName: e.target.value})} 
                                            placeholder="ПІБ"
                                            autoFocus
                                            disabled={isSaving}
                                        />
                                    </div>
                                ) : (
                                    <h1 className="location-title">{user.fullName || "Користувач"}</h1>
                                )}
                                
                                <button 
                                    className={`profile-edit-trigger ${isEditing ? 'active-cancel' : ''}`} 
                                    onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                                    disabled={isSaving}
                                    title={isEditing ? "Скасувати" : "Редагувати профіль"}
                                >
                                   {isEditing ? <X size={20} /> : <Pencil size={20} />}
                                </button>
                            </div>
                            <p className="location-distance">@{user.username || "username"}</p>
                        </div>
                    </header>

                    <div className="profile-stats-row">
                        <div className={`rating-card ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
                            <div className="rating-row">
                                <Bookmark size={18} fill={activeTab === 'saved' ? "currentColor" : "none"} />
                                {savedLocations.length}
                            </div>
                            <span className="reviews-count">Збережено</span>
                        </div>
                        <div className={`rating-card ${activeTab === 'visited' ? 'active' : ''}`} onClick={() => setActiveTab('visited')}>
                            <div className="rating-row">
                                <CheckCircle2 size={18} fill={activeTab === 'visited' ? "currentColor" : "none"} />
                                {visitedLocations.length}
                            </div>
                            <span className="reviews-count">Відвідано</span>
                        </div>
                    </div>

                    <div className="profile-tabs-content">
                        {activeTab === 'saved' ? (
                            <div className="tab-section">
                                <h3 className="section-title">Збережені локації</h3>
                                {savedLocations.length > 0 ? (
                                    <div className="profile-list">
                                        {savedLocations.map((loc: any) => (
                                            <div key={loc.id} className="profile-card" onClick={() => navigate(`/location/${loc.id}`)}>
                                                <img src={loc.image} alt={loc.name} />
                                                <div className="card-info">
                                                    <h4>{loc.name}</h4>
                                                    <p>{loc.address}</p>
                                                </div>
                                                <ChevronRight size={18} />
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="empty-tab-text">У вас поки немає збережених локацій.</p>}
                            </div>
                        ) : (
                            <div className="tab-section">
                                <h3 className="section-title">Відвідані місця</h3>
                                {visitedLocations.length === 0 ? (
                                    <p className="empty-tab-text">Ви ще не відмітили жодного місця.</p>
                                ) : (
                                    <div className="profile-list">
                                        {visitedLocations.map((loc: any) => (
                                            <div key={loc.id} className="profile-card" onClick={() => navigate(`/location/${loc.id}`)}>
                                                <img src={loc.image} alt={loc.name} />
                                                <div className="card-info">
                                                    <h4>{loc.name}</h4>
                                                    <p>{loc.address}</p>
                                                </div>
                                                <ChevronRight size={18} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="section-divider"></div>

                    <div className="info-blocks">
                        <div className="info-item">
                            <div className="info-icon"><Mail size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Email</span>
                                {isEditing ? (
                                    <input 
                                        type="email"
                                        className="edit-input-small" 
                                        value={editData.email} 
                                        onChange={(e) => setEditData({...editData, email: e.target.value})} 
                                    />
                                ) : (
                                    <span className="info-value">{user.email}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><AtSign size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Username</span>
                                {isEditing ? (
                                    <input 
                                        className="edit-input-small" 
                                        value={editData.username} 
                                        onChange={(e) => setEditData({...editData, username: e.target.value})} 
                                    />
                                ) : (
                                    <span className="info-value">@{user.username || "—"}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><Calendar size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Дата народження</span>
                                {isEditing ? (
                                    <input 
                                        type="date"
                                        className="edit-input-small" 
                                        value={editData.dateOfBirth} 
                                        onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})} 
                                        lang="uk"
                                    />
                                ) : (
                                    <span className="info-value">{user.dateOfBirth || "—"}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><MapPin size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Місто</span>
                                {isEditing ? (
                                    <div className="city-input-wrapper">
                                        <input 
                                            className="edit-input-small" 
                                            value={editData.city} 
                                            onChange={(e) => handleCityChange(e.target.value)} 
                                            onFocus={() => editData.city && setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        />
                                        {showSuggestions && citySuggestions.length > 0 && (
                                            <ul className="city-suggestions">
                                                {citySuggestions.map(city => (
                                                    <li key={city} onClick={() => selectCity(city)}>{city}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <span className="info-value">{user.city || "—"}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><Phone size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Телефон</span>
                                {isEditing ? (
                                    <>
                                        <input 
                                            className={`edit-input-small ${phoneError ? 'input-error' : ''}`}
                                            value={editData.phoneNumber} 
                                            onChange={(e) => handlePhoneChange(e.target.value)} 
                                            placeholder="+380..."
                                        />
                                        {phoneError && <span className="field-error">{phoneError}</span>}
                                    </>
                                ) : (
                                    <span className="info-value">{user.phoneNumber || "—"}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item info-item--full">
                            <div className="info-icon"><Info size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Про мене</span>
                                {isEditing ? (
                                    <textarea 
                                        className="edit-input-small edit-textarea" 
                                        value={editData.bio} 
                                        onChange={(e) => setEditData({...editData, bio: e.target.value})} 
                                    />
                                ) : (
                                    <span className="info-value">{user.bio || "Інформація відсутня"}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="password-section">
                            <button 
                                className="password-toggle" 
                                onClick={() => setShowPasswordChange(!showPasswordChange)}
                            >
                                <Lock size={16} />
                                {showPasswordChange ? "Приховати зміну пароля" : "Змінити пароль"}
                            </button>

                            {showPasswordChange && (
                                <div className="password-form">
                                    <div className="input-group">
                                        <label>Старий пароль</label>
                                        <input 
                                            type="password" 
                                            value={passwords.old} 
                                            onChange={(e) => setPasswords({...passwords, old: e.target.value})} 
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Новий пароль</label>
                                        <input 
                                            type="password" 
                                            value={passwords.new} 
                                            onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Підтвердження</label>
                                        <input 
                                            type="password" 
                                            value={passwords.confirm} 
                                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                                        />
                                    </div>

                                    <button type="button" className="forgot-password-link-profile" onClick={handleForgotPassword}>
                                        Забули старий пароль?
                                    </button>

                                    {passwordError && <p className="error-message">{passwordError}</p>}
                                    {passwordSuccess && <p className="success-message">Пароль успішно змінено!</p>}
                                    
                                    <SiteButton 
                                        text={isSaving ? "Змінюємо..." : "Оновити пароль"} 
                                        onClick={handleChangePassword}
                                        disabled={isSaving || !passwords.old || !passwords.new}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                     <div className="profile-actions">
                        {isEditing ? (
                            <SiteButton 
                                text={isSaving ? "Зберігаємо..." : "Зберегти зміни"} 
                                onClick={handleSave}
                                icon={isSaving ? "spinner" : undefined}
                                disabled={isSaving}
                            />
                        ) : (
                            <SiteButton text="Вийти з профілю" onClick={handleLogout} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
