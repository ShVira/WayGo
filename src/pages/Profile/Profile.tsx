import { useContext, useState, useEffect } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css'; 
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { Pencil, X, Mail, Calendar, MapPin } from 'lucide-react';

export default function Profile() {
    const { user, setUser } = useContext(AppContext);
    const { savedLocations } = useSaved();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    
    const [editName, setEditName] = useState(user?.name || "");

    // Update local state when user object changes
    useEffect(() => {
        if (user) {
            setEditName(user.name || "");
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser || !user) return;
        
        // Alphanumeric validation (letters and numbers only)
        const alphanumericRegex = /^[a-zA-Z0-9а-яА-ЯіІєЄїЇґҐ\s]+$/;
        if (!alphanumericRegex.test(editName)) {
            setNameError('Нікнейм може містити лише літери та цифри');
            return;
        }
        
        setNameError(null);
        setIsSaving(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: editName
            });

            // Update global state immediately for reactive UI
            setUser({
                ...user,
                name: editName
            });

            setIsEditing(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert(`Помилка: ${error.message || "Не вдалося оновити ім'я"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditName(user.name || "");
        }
        setNameError(null);
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
                                            className={`edit-input title-input ${nameError ? 'input-error' : ''}`} 
                                            value={editName} 
                                            onChange={(e) => {
                                                setEditName(e.target.value);
                                                if (nameError) setNameError(null);
                                            }} 
                                            maxLength={20}
                                            autoFocus
                                            disabled={isSaving}
                                        />
                                        {nameError && <span className="error-message">{nameError}</span>}
                                    </div>
                                ) : (
                                    <h1 className="location-title">{user.name}</h1>
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
                            <p className="location-distance">{user.email}</p>
                        </div>
                        
                        <div className="rating-card">
                            <div className="rating-row">
                                {savedLocations.length}
                            </div>
                            <span className="reviews-count">Збережено</span>
                        </div>
                    </header>

                    <div className="info-blocks">
                        <div className="info-item">
                            <div className="info-icon"><Mail size={20} /></div>
                            <div className="info-content">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                        </div>

                        {user.dob && (
                             <div className="info-item">
                                <div className="info-icon"><Calendar size={20} /></div>
                                <div className="info-content">
                                    <span className="info-label">Дата народження</span>
                                    <span className="info-value">{user.dob}</span>
                                </div>
                            </div>
                        )}

                        {user.address && (
                            <div className="info-item">
                                <div className="info-icon"><MapPin size={20} /></div>
                                <div className="info-content">
                                    <span className="info-label">Адреса</span>
                                    <span className="info-value">{user.address}</span>
                                </div>
                            </div>
                        )}
                    </div>

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
