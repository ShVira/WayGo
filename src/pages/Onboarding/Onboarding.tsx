import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../features/app-context/AppContext';
import UserDao from '../../entities/user/api/UserDao';
import SiteButton from '../../features/SiteButton/SiteButton';
import { MapPin, Compass, Sparkles, Check, ChevronLeft, Sun, Moon } from 'lucide-react';
import './ui/Onboarding.css';

const AVAILABLE_VIBES = [
    { id: 'Cozy', label: 'Затишок', icon: '☕' },
    { id: 'Active', label: 'Активність', icon: '🏃' },
    { id: 'Social', label: 'Спілкування', icon: '🍸' },
    { id: 'Nature', label: 'Природа', icon: '🌿' },
    { id: 'Explore', label: 'Дослідження', icon: '🧭' },
    { id: 'Special', label: 'Особливе', icon: '✨' }
];

interface OnboardingProps {
    onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const toggleVibe = (id: string) => {
        setSelectedVibes(prev => 
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };

    const handleComplete = async (skipped = false) => {
        setIsSubmitting(true);
        
        const updateData = {
            hasCompletedOnboarding: true,
            preferredVibes: skipped ? [] : [...selectedVibes]
        };

        try {
            if (user?.uid) {
                await UserDao.updateUser(user.uid, updateData);
                setUser({ ...user, ...updateData });
            } else {
                localStorage.setItem('waygo_onboarding_completed', 'true');
                if (!skipped) {
                    localStorage.setItem('waygo_guest_vibes', JSON.stringify(updateData.preferredVibes));
                }
                if (onComplete) onComplete();
            }
            navigate('/');
        } catch (error) {
            console.error("Onboarding update failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleAuthRedirect = () => {
        localStorage.setItem('waygo_onboarding_completed', 'true');
        if (selectedVibes.length > 0) {
            localStorage.setItem('waygo_guest_vibes', JSON.stringify(selectedVibes));
        }
        if (onComplete) onComplete();
        navigate('/auth?mode=register');
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                <button 
                    className="onboarding-theme-toggle" 
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="onboarding-progress">
                    {[1, 2, 3].map(step => (
                        <div 
                            key={step} 
                            className={`progress-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                        />
                    ))}
                </div>

                <div className="onboarding-content">
                    {currentStep === 1 && (
                        <div className="step-fade-in">
                            <div className="icon-circle main-icon"><Sparkles size={40} /></div>
                            <h1>Знайди свій вайб поруч</h1>
                            <p>WayGo — це не просто мапа. Це твій емоційний навігатор містом. Обирай настрій, а ми знайдемо ідеальне місце.</p>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step-fade-in">
                            <h2>Що тобі до душі?</h2>
                            <p>Обери декілька вайбів, щоб ми краще розуміли твої вподобання.</p>
                            <div className="vibe-grid">
                                {AVAILABLE_VIBES.map(vibe => (
                                    <button 
                                        key={vibe.id}
                                        className={`vibe-card ${selectedVibes.includes(vibe.id) ? 'selected' : ''}`}
                                        onClick={() => toggleVibe(vibe.id)}
                                    >
                                        <span className="vibe-emoji">{vibe.icon}</span>
                                        <span className="vibe-label">{vibe.label}</span>
                                        {selectedVibes.includes(vibe.id) && <div className="check-badge"><Check size={12} /></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step-fade-in">
                            <div className="icon-circle geo-icon"><MapPin size={40} /></div>
                            <h2>Майже готово!</h2>
                            <p>Для повноцінної роботи нам потрібен доступ до твоєї геолокації. Так ми зможемо показувати місця, що знаходяться прямо за рогом.</p>
                            <div className="info-box">
                                <Compass size={20} />
                                <span>Твої дані конфіденційні та використовуються лише для пошуку.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="onboarding-actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%' }}>
                            {currentStep > 1 && (
                                <button className="btn-back" onClick={prevStep} disabled={isSubmitting}>
                                    <ChevronLeft size={20} /> Назад
                                </button>
                            )}
                            
                            {currentStep < 3 ? (
                                <SiteButton 
                                    text="Далі" 
                                    onClick={nextStep} 
                                />
                            ) : (
                                <SiteButton 
                                    text={isSubmitting ? "Завантаження..." : (user ? "Почати пригоду" : "До карти")} 
                                    onClick={() => handleComplete()}
                                    disabled={isSubmitting}
                                />
                            )}
                        </div>

                        {currentStep === 3 && !user && (
                            <button 
                                className="btn-auth-onboarding" 
                                onClick={handleAuthRedirect}
                                style={{ 
                                    background: 'var(--primary)', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '12px 24px', 
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    width: '100%',
                                    marginTop: '4px'
                                }}
                            >
                                Створити акаунт, щоб зберегти вибір
                            </button>
                        )}
                    </div>

                    {currentStep === 1 && (
                        <button className="btn-skip" onClick={() => handleComplete(true)}>
                            Пропустити
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
