import { useContext, useState, useRef, ChangeEvent, useEffect } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css'; 
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';
import { auth, storage, ref, uploadBytes, getDownloadURL } from '../../app/api/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { Pencil, X, Camera, Mail, Calendar, MapPin, Loader2 } from 'lucide-react';

export default function Profile() {
    const { user } = useContext(AppContext);
    const { savedLocations } = useSaved();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [editName, setEditName] = useState(user?.name || "");
    const [editImageUrl, setEditImageUrl] = useState(user?.imageUrl || defaultImageUrl);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Update local state when user object changes (e.g. after Firebase update)
    useEffect(() => {
        if (user) {
            setEditName(user.name || "");
            setEditImageUrl(user.imageUrl || defaultImageUrl);
            setSelectedFile(null);
        }
    }, [user, defaultImageUrl]);

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
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        
        setIsSaving(true);
        try {
            let photoURL = user?.imageUrl || null;

            if (selectedFile) {
                const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`);
                const snapshot = await uploadBytes(storageRef, selectedFile);
                photoURL = await getDownloadURL(snapshot.ref);
            }

            await updateProfile(auth.currentUser, {
                displayName: editName,
                photoURL: photoURL
            });
            
            setIsEditing(false);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Помилка оновлення профілю. Перевірте підключення або спробуйте інше фото.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditName(user.name || "");
            setEditImageUrl(user.imageUrl || defaultImageUrl);
            setSelectedFile(null);
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
                <div className="profile-avatar-wrapper">
                    <div className="location-image-container">
                        <img 
                            src={displayImage} 
                            alt={user.name} 
                            className="location-image" 
                        />
                        
                        {isEditing && (
                            <div className="change-photo-overlay" onClick={triggerFileSelect}>
                                <Camera size={32} />
                                <span>Змінити фото</span>
                            </div>
                        )}
                    </div>

                    <button 
                        className={`bookmark-btn profile-action-btn ${isEditing ? 'active-cancel' : ''}`} 
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                        disabled={isSaving}>
                       {isEditing ? <X size={20} /> : <Pencil size={20} />}
                    </button>
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
                                    disabled={isSaving}
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

