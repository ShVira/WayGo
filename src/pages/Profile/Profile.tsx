import { useContext, useState, useRef, ChangeEvent } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css';
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';

export default function Profile() {
    const { user, setUser } = useContext(AppContext);
    const { savedLocations } = useSaved();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const defaultImageUrl = '/user.png';

    const [isEditing, setIsEditing] = useState(false);
    
    const [editName, setEditName] = useState(user?.name || "");
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [editDob, setEditDob] = useState(user?.dob || "");
    const [editAddress, setEditAddress] = useState(user?.address || "");
    const [editImageUrl, setEditImageUrl] = useState(user?.imageUrl || defaultImageUrl);

    const handleLogout = () => {
        window.localStorage.removeItem("user-231");
        setUser(null);
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

    const handleSave = () => {
        if (!user) return;
        const updatedUser = {
            ...user,
            name: editName,
            email: editEmail,
            dob: editDob,
            address: editAddress,
            imageUrl: editImageUrl
        };
        setUser(updatedUser);
        window.localStorage.setItem("user-231", JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (user) {
            setEditName(user.name || "");
            setEditEmail(user.email || "");
            setEditDob(user.dob || "");
            setEditAddress(user.address || "");
            setEditImageUrl(user.imageUrl || defaultImageUrl);
        }
        setIsEditing(false);
    };

    if (!user) return null;

    const displayImage = editImageUrl || defaultImageUrl;

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
                            <p className="location-distance">@{user.login}</p>
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
                                {isEditing ? (
                                    <input className="edit-input" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                                ) : (
                                    <span className="info-value">{user.email || "Додати email"}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><i className="bi bi-calendar-event"></i></div>
                            <div className="info-content">
                                <span className="info-label">Дата народження</span>
                                {isEditing ? (
                                    <input type="date" className="edit-input" value={editDob} onChange={(e) => setEditDob(e.target.value)} />
                                ) : (
                                    <span className="info-value">{user.dob || "Не вказано"}</span>
                                )}
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><i className="bi bi-geo-alt"></i></div>
                            <div className="info-content">
                                <span className="info-label">Адреса</span>
                                {isEditing ? (
                                    <input className="edit-input" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                                ) : (
                                    <span className="info-value">{user.address || "Додати адресу"}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {isEditing ? (
                            <SiteButton text="Зберегти зміни" icon="bi-check-lg" onClick={handleSave} />
                        ) : (
                            <SiteButton text="Вийти з профілю" icon="bi-box-arrow-right" onClick={handleLogout} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}