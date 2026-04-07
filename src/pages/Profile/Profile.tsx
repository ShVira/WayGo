import { useContext, useState, useEffect } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css'; 
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';
import { auth } from '../../app/api/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { Pencil, X, Mail, Calendar, MapPin, Bookmark, CheckCircle2, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useContext(AppContext);
    const { savedLocations, visitedLocations } = useSaved();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'saved' | 'visited'>('saved');
    
    const [editName, setEditName] = useState(user?.name || "");

    const likedVisited = visitedLocations.filter((l: any) => l.visitStatus === 'liked');
    const dislikedVisited = visitedLocations.filter((l: any) => l.visitStatus === 'disliked');

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
        if (!auth.currentUser) return;
        
        setIsSaving(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: editName
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
                    </header>

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
                                
                                {likedVisited.length > 0 && (
                                    <div className="visit-group">
                                        <div className="group-header">
                                            <ThumbsUp size={16} color="#4caf50" />
                                            <span>Сподобались</span>
                                        </div>
                                        <div className="profile-list">
                                            {likedVisited.map((loc: any) => (
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
                                    </div>
                                )}

                                {dislikedVisited.length > 0 && (
                                    <div className="visit-group">
                                        <div className="group-header">
                                            <ThumbsDown size={16} color="#f44336" />
                                            <span>Не сподобались</span>
                                        </div>
                                        <div className="profile-list">
                                            {dislikedVisited.map((loc: any) => (
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
                                    </div>
                                )}

                                {visitedLocations.length === 0 && (
                                    <p className="empty-tab-text">Ви ще не відмітили жодного відвіданого місця.</p>
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
