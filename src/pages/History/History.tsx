import { useNavigate } from 'react-router-dom';
import { useHistory } from '../../app/providers/HistoryContext';
import { Layout } from '../../features/layout/Layout';
import { MapPin, ChevronRight, Clock } from 'lucide-react';
import './ui/History.css';

export default function History() {
    const { history, clearHistory } = useHistory();
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="history-page">
                <div className="history-header">
                    <h1 className="history-title">Історія переглядів</h1>
                    <p className="history-subtitle">Тут будуть ваші нещодавні локації.</p>
                </div>

                {history.length > 0 ? (
                    <>
                        <div className="history-list">
                            {history.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="history-card"
                                    onClick={() => navigate(`/location/${item.id}`)}
                                >
                                    <img src={item.imageUrl} alt={item.name} className="history-card-img" />
                                    <div className="history-card-info">
                                        <h3>{item.name}</h3>
                                        <p><MapPin size={14} /> {item.address}</p>
                                    </div>
                                    <ChevronRight size={20} className="history-chevron" />
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-5">
                            <button className="clear-history-link" onClick={clearHistory}>
                                Очистити всю історію
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-history">
                        <div className="empty-icon-circle">
                            <Clock size={40} />
                        </div>
                        <h3>Історія порожня</h3>
                        <p>Ви ще не переглядали жодного місця.</p>
                        <button className="btn-primary mt-3" onClick={() => navigate('/')}>
                            Знайти цікаві місця
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}