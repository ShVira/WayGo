import { useContext, useState, useRef, ChangeEvent } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css';
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';

export default function Profile() {
    const { user, setUser } = useContext(AppContext);
    const { savedLocations } = useSaved();
    
    // File input ref for image upload
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Define default image path
    const defaultImageUrl = '/user.png'; // Make sure this file exists in your /public folder

    // Edit Logic States
    const [isEditing, setIsEditing] = useState(false);
    
    // We initialize states, prioritizing context data, falling back to empty/default
    const [editName, setEditName] = useState(user?.name || "");
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [editDob, setEditDob] = useState(user?.dob || "");
    const [editAddress, setEditAddress] = useState(user?.address || "");
    const [editImageUrl, setEditImageUrl] = useState(user?.imageUrl || defaultImageUrl);

    const handleLogout = () => {
        window.localStorage.removeItem("user-231");
        setUser(null);
    };

    // --- Image Upload Logic ---
    const triggerFileSelect = () => {
        // Only allow clicking if we are in edit mode
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set the local state to the Base64 string for immediate preview
                setEditImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file); // Converts image to Base64
        }
    };
    // ---------------------------

    const handleSave = () => {
        if (!user) return;
        
        const updatedUser = {
            ...user,
            name: editName,
            email: editEmail,
            dob: editDob,
            address: editAddress,
            imageUrl: editImageUrl // Save the new (or default) image URL
        };

        // Update Context and LocalStorage
        setUser(updatedUser);
        window.localStorage.setItem("user-231", JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset local states back to original user data
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

    // The image to display: always show the 'editImageUrl' state.
    // If user has no image, the state was initialized to '/user.png'.
    const displayImage = editImageUrl || defaultImageUrl;

    return (
        <Layout>
            {/* Hidden file input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
            />

            <div className="location-page profile-page">
                <div className="location-image-container">
                    <img 
                        src={displayImage} // Display image based on state
                        alt={user.name} 
                        className="location-image" 
                    />
                    
                    {/* The Toggle Edit/Cancel Button */}
                    <button 
                        className={`bookmark-btn profile-action-btn ${isEditing ? 'active-cancel' : ''}`} 
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}>
                       {isEditing ? '✕' : '✎'}
                    </button>
                    
                    {/* The "Change Photo" overlay (visible only in edit mode) */}
                    {isEditing && (
                        <div className="change-photo-overlay" onClick={triggerFileSelect}>
                            <i className="bi bi-camera-fill"></i>
                            <span>Змінити фото</span>
                        </div>
                    )}
                </div>

                <div className="profile-header">
                    <div>
                        {isEditing ? (
                            <input 
                                className="edit-input title-input" 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)} 
                                placeholder="Ваше ім'я"
                            />
                        ) : (
                            <h1 className="location-title">{user.name}</h1>
                        )}
                        <p className="location-distance">@{user.login}</p>
                    </div>
                    
                    <div className="rating-card">
                        <div className="rating-row">
                            <span className="rating-value">{savedLocations.length}</span>
                            <i className="bi bi-bookmark-fill text-success"></i>
                        </div>
                        <span className="reviews-count">Збережено</span>
                    </div>
                </div>

                <div className="info-blocks">
                    {/* Email Field */}
                    <div className="info-item">
                        <i className="bi bi-envelope info-icon text-success"></i>
                        <div className="info-content">
                            <span className="info-label">Email:</span>
                            {isEditing ? (
                                <input 
                                    className="edit-input" 
                                    type="email"
                                    value={editEmail} 
                                    onChange={(e) => setEditEmail(e.target.value)} 
                                    placeholder="mail@example.com"
                                />
                            ) : (
                                <span className="info-value">{user.email || "Додати email"}</span>
                            )}
                        </div>
                    </div>

                    {/* DOB Field */}
                    <div className="info-item">
                        <i className="bi bi-calendar-event info-icon text-success"></i>
                        <div className="info-content">
                            <span className="info-label">Дата народження:</span>
                            {isEditing ? (
                                <input 
                                    type="date" 
                                    className="edit-input" 
                                    value={editDob} 
                                    onChange={(e) => setEditDob(e.target.value)} 
                                />
                            ) : (
                                <span className="info-value">{user.dob || "Не вказано"}</span>
                            )}
                        </div>
                    </div>

                    {/* Address Field */}
                    <div className="info-item">
                        <i className="bi bi-geo-alt info-icon text-success"></i>
                        <div className="info-content">
                            <span className="info-label">Адреса:</span>
                            {isEditing ? (
                                <input 
                                    className="edit-input" 
                                    value={editAddress} 
                                    onChange={(e) => setEditAddress(e.target.value)} 
                                    placeholder="Місто, вулиця..."
                                />
                            ) : (
                                <span className="info-value">{user.address || "Додати адресу"}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center py-4 action-footer">
                    {isEditing ? (
                        <SiteButton text="Зберегти зміни" icon="bi-check-lg" onClick={handleSave} />
                    ) : (
                        <SiteButton text="Вийти з профілю" icon="bi-box-arrow-right" onClick={handleLogout} />
                    )}
                </div>
            </div>
        </Layout>
    );
}