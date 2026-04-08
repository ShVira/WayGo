import { useNavigate } from 'react-router-dom';
import { useHistory } from '../../app/providers/HistoryContext';
import { useSaved } from '../../app/providers/SavedContext';
import { Layout } from '../../features/layout/Layout';
import SiteButton from '../../features/SiteButton/SiteButton'; // Import SiteButton
import { MapPin, ChevronRight, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import './ui/History.css';

export default function History() {
    const { history, clearHistory } = useHistory();
    const { visitedLocations } = useSaved();
    const navigate = useNavigate();

    const getVisitStatus = (id: string | number) => {
        return visitedLocations?.find((l: any) => l.id === id)?.visitStatus || null;
    };

    return (
        <Layout>
            <div className="history-page">
                <div className="history-header">
                    <h1 className="history-title">Історія</h1>
                    <p className="history-subtitle">Місця, які ви переглядали нещодавно.</p>
                </div>

                {history.length > 0 ? (
                    <>
                        <div className="history-list">
                            {history.map((item) => {
                                const visitStatus = getVisitStatus(item.id);
                                return (
                                    <div 
                                        key={item.id} 
                                        className="history-card"
                                        onClick={() => navigate(`/location/${item.id}`)}
                                    >
                                        <img src={item.imageUrl} alt={item.name} className="history-card-img" />
                                        <div className="history-card-info">
                                            <div className="history-card-title-row">
                                                <h3>{item.name}</h3>
                                                {visitStatus === 'liked' && <ThumbsUp size={16} color="#4caf50" fill="#4caf50" />}
                                                {visitStatus === 'disliked' && <ThumbsDown size={16} color="#f44336" fill="#f44336" />}
                                            </div>
                                            <p><MapPin size={13} /> {item.address}</p>
                                        </div>
                                        <ChevronRight size={18} className="history-chevron" strokeWidth={2.5} />
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Use SiteButton for clearing history */}
                        <div className="action-footer" style={{ marginTop: '40px' }}>
                            <SiteButton 
                                text="Очистити історію" 
                                icon="bi-trash3" 
                                onClick={clearHistory} 
                            />
                        </div>
                    </>
                ) : (
                    <div className="empty-history">
                        <div className="empty-icon-circle">
                            <Clock size={32} strokeWidth={1.5} />
                        </div>
                        <h3>Тут поки порожньо</h3>
                        <p>Ваші переглянуті локації з'являться тут автоматично.</p>
                        
                        {/* Use SiteButton to go back to Home */}
                        <div style={{ marginTop: '24px' }}>
                            <SiteButton 
                                text="Знайти цікаві місця" 
                                icon="bi-search" 
                                onClick={() => navigate('/')} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}