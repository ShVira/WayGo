import { useContext, useState, useRef, ChangeEvent } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css'; 
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signOut, updateProfile } from 'firebase/auth';

export default function Profile() {
    const { user } = useContext(AppContext);
    const { savedLocations } = useSaved();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    const [isEditing, setIsEditing] = useState(false);
    
    const [editName, setEditName] = useState(user?.name || "");
    const [editImageUrl, setEditImageUrl] = useState(user?.imageUrl || defaultImageUrl);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const triggerFileSelect = () => {
        if (isEditing) fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        
        try {
            await updateProfile(auth.currentUser, {
                displayName: editName,
                photoURL: editImageUrl
            });
            setIsEditing(false);
            // AppContext will automatically update via onAuthStateChanged
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Помилка оновлення профілю");
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditName(user.name || "");
            setEditImageUrl(user.imageUrl || defaultImageUrl);
        }
        setIsEditing(false);
    };

    if (!user) return null;

    const displayImage = editImageUrl || user.imageUrl || defaultImageUrl;

    return (
        <Layout>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
            />

            <div className="profile-page">
                {/* COLUMN 1: LEFT SIDE (IMAGE) */}
                <div className="location-image-container">
                    <img 
                        src={displayImage} 
                        alt={user.name} 
                        className="location-image" 
                    />
                    
                    <button 
                        className={`bookmark-btn profile-action-btn ${isEditing ? 'active-cancel' : ''}`} 
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}>
                       {isEditing ? '✕' : '✎'}
                    </button>
                    
                    
                    {isEditing && (
                        <div className="change-photo-overlay" onClick={triggerFileSelect}>
                            <i className="bi bi-camera-fill"></i>
                            <span>Змінити фото</span>
                        </div>
                    )}
                </div>

                {/* COLUMN 2: RIGHT SIDE (ALL INFO) */}
                <div className="profile-details-column">
                    <header className="profile-header">
                        <div className="title-section">
                            {isEditing ? (
                                <input 
                                    className="edit-input title-input" 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)} 
                                    autoFocus
                                />
                            ) : (
                                <h1 className="location-title">{user.name}</h1>
                            )}
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
                            <div className="info-icon"><i className="bi bi-envelope"></i></div>
                            <div className="info-content">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                        </div>

                        {/* Note: address and dob are not in Firebase Auth by default. 
                            If needed, these should be stored in Firestore 'users' collection. 
                            For now, we display them as read-only if they exist in user object. 
                        */}
                        {user.dob && (
                             <div className="info-item">
                                <div className="info-icon"><i className="bi bi-calendar-event"></i></div>
                                <div className="info-content">
                                    <span className="info-label">Дата народження</span>
                                    <span className="info-value">{user.dob}</span>
                                </div>
                            </div>
                        )}

                        {user.address && (
                            <div className="info-item">
                                <div className="info-icon"><i className="bi bi-geo-alt"></i></div>
                                <div className="info-content">
                                    <span className="info-label">Адреса</span>
                                    <span className="info-value">{user.address}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-actions">
                        {isEditing ? (
                            <SiteButton text="Зберегти зміни" onClick={handleSave} />
                        ) : (
                            <SiteButton text="Вийти з профілю" onClick={handleLogout} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
