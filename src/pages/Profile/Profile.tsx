import { useContext } from 'react';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/Profile.css'; // New CSS file
import { AppContext } from '../../features/app-context/AppContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';

export default function Profile() {
    const { user, setUser } = useContext(AppContext);
    const { savedLocations } = useSaved();

    const handleLogout = () => {
        window.localStorage.removeItem("user-231");
        setUser(null);
    };

    if (!user) return null;

    return (
            <Layout>
        
        <div className="location-page profile-page">
            {/* Avatar Header (Reusing your image container style) */}
            <div className="location-image-container">
                <img 
                    src={user.imageUrl} 
                    alt={user.name} 
                    className="location-image" 
                />
                {/* Floating Edit Button (Reusing bookmark button style) */}
                <button className="bookmark-btn">
                    <i className="bi bi-pencil-fill"></i>
                </button>
            </div>

            <div className="profile-header">
                <div>
                    <h1 className="location-title">{user.name}</h1>
                    <p className="location-distance">@{user.login}</p>
                </div>
                
                {/* Saved Count (Reusing rating card style) */}
                <div className="rating-card">
                    <div className="rating-row">
                        <span className="rating-value">{savedLocations.length}</span>
                        <i className="bi bi-bookmark-fill text-success"></i>
                    </div>
                    <span className="reviews-count">Збережено</span>
                </div>
            </div>

            <p className="location-description">
                Вітаємо у вашому профілі WayGo! Тут ви можете бачити ваші особисті дані 
                та керувати збереженими локаціями.
            </p>

            {/* Info Blocks (Using your info-item logic) */}
            <div className="info-blocks">
                <div className="info-item">
                    <i className="bi bi-envelope info-icon text-success"></i>
                    <div className="info-content">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                    </div>
                </div>

                <div className="info-item">
                    <i className="bi bi-calendar-event info-icon text-success"></i>
                    <div className="info-content">
                        <span className="info-label">Дата народження:</span>
                        <span className="info-value">{user.dob}</span>
                    </div>
                </div>

                <div className="info-item">
                    <i className="bi bi-geo-alt info-icon text-success"></i>
                    <div className="info-content">
                        <span className="info-label">Адреса:</span>
                        <span className="info-value">{user.address}</span>
                    </div>
                </div>
            </div>

            <hr className="location-separator" />

            <div className="text-center pb-5">
                <SiteButton 
                    text="Вийти з профілю" 
                    icon="bi-box-arrow-right"
                    onClick={handleLogout} 
                />
            </div>
        </div>
            </Layout>

    );
}