import { Heart } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const wishlistData = [
    {
      id: 1,
      name: 'BlockWealth Assets',
      owner: '0x1a5F...9f3a',
      image: '/property-1.jpg',
      price: '200.102 SOL',
      verified: true
    },
    {
      id: 2,
      name: 'BlockWealth Assets',
      owner: '0x1a5F...9f3a',
      image: '/property-2.jpg',
      price: '200.102 SOL',
      verified: false
    },
    {
      id: 3,
      name: 'BlockWealth Assets',
      owner: '0x1a5F...9f3a',
      image: '/property-3.jpg',
      price: '200.102 SOL',
      verified: false
    }
  ];

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__header">
        <div className="wishlist-page__title-section">
          <div className="wishlist-page__icon">
            <Heart size={24} />
          </div>
          <h1>Wishlist</h1>
        </div>
      </div>

      <div className="wishlist-page__hero">
        <h2>Discover verified real estate opportunities across Africa with blockchain-backed trust.</h2>
      </div>

      <div className="wishlist-page__grid">
        {wishlistData.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-card__image">
              <img src={item.image} alt={item.name} />
              <button className="wishlist-card__heart">
                <Heart size={20} fill="#ff4444" color="#ff4444" />
              </button>
            </div>
            <div className="wishlist-card__content">
              <div className="wishlist-card__header">
                <h3>{item.name}</h3>
                {item.verified && (
                  <div className="wishlist-card__verified">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" fill="#8cc043"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="wishlist-card__owner">
                <div className="wishlist-card__avatar" />
                <span>{item.owner}</span>
                {item.verified && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#8cc043"/>
                    <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p className="wishlist-card__price">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
