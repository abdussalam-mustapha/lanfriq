import { useState } from 'react'
import { Search, X, Clock } from 'lucide-react'
import './SearchModal.css'

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, text: 'Recent Search' },
    { id: 2, text: 'Recent Search' },
    { id: 3, text: 'Recent Search' }
  ])

  const handleClearAll = () => {
    setRecentSearches([])
  }

  const handleRemoveSearch = (id) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__header">
          <h2 className="search-modal__title">Search</h2>
          <button className="search-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="search-modal__input-wrapper">
          <Search size={20} className="search-modal__input-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="2 bedroo"
            className="search-modal__input"
            autoFocus
          />
        </div>

        {recentSearches.length > 0 && (
          <div className="search-modal__recent">
            <div className="search-modal__recent-header">
              <h3 className="search-modal__recent-title">Recent Search</h3>
              <button className="search-modal__clear-all" onClick={handleClearAll}>
                Clear All
              </button>
            </div>

            <div className="search-modal__recent-list">
              {recentSearches.map((search) => (
                <div key={search.id} className="search-modal__recent-item">
                  <Clock size={20} className="search-modal__recent-icon" />
                  <span className="search-modal__recent-text">{search.text}</span>
                  <button 
                    className="search-modal__recent-remove"
                    onClick={() => handleRemoveSearch(search.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
