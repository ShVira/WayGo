
import React, { useState } from 'react';
import { Sparkles, Send, AlertCircle, Loader2 } from 'lucide-react';
import { fetchAiTags } from '../api/gemini';
import './AiMoodSearch.css';

interface AiMoodSearchProps {
  onTagsFound: (tags: string[]) => void;
}

export const AiMoodSearch: React.FC<AiMoodSearchProps> = ({ onTagsFound }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const tags = await fetchAiTags(inputValue);
      if (tags.length > 0) {
        onTagsFound(tags);
        setIsOpen(false);
        setInputValue('');
      } else {
        setError('AI не зміг підібрати вайб під цей опис. Спробуйте іншими словами.');
      }
    } catch (err: any) {
      setError(err.message || 'Сталася помилка. Перевірте з’єднання.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-mood-container ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="ai-mood-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <Sparkles size={18} className="ai-mood-icon" />
        <span>✨ Підібрати вайб з ШІ</span>
      </button>

      <div className="ai-mood-panel">
        <div className="ai-mood-inner">
          <textarea
            placeholder="Опиши свій настрій або чого хочеться зараз..."
            className="ai-mood-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          
          {error && (
            <div className="ai-mood-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button 
            className="ai-mood-submit"
            onClick={handleSearch}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="ai-spinner" />
                <span>Аналізуємо...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Знайти</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
