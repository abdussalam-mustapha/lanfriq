import { useState } from 'react'
import Section from '../../components/ui/Section'
import './Marketplace.css'

const Marketplace = () => {
  const [properties, setProperties] = useState([])
  const [filter, setFilter] = useState('all')

  return (
    <Section variant="default" className="marketplace">
      <div className="marketplace__header">
        <h1 className="marketplace__title">Marketplace</h1>
        <p className="marketplace__description">
          Browse and invest in tokenized properties
        </p>
      </div>

      <div className="marketplace__filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Properties
        </button>
        <button 
          className={`filter-btn ${filter === 'residential' ? 'active' : ''}`}
          onClick={() => setFilter('residential')}
        >
          Residential
        </button>
        <button 
          className={`filter-btn ${filter === 'commercial' ? 'active' : ''}`}
          onClick={() => setFilter('commercial')}
        >
          Commercial
        </button>
      </div>

      <div className="marketplace__grid">
        {properties.length === 0 ? (
          <div className="marketplace__empty">
            <p>No properties available yet</p>
          </div>
        ) : (
          properties.map(property => (
            <div key={property.id} className="property-card">
              {/* Property card content */}
            </div>
          ))
        )}
      </div>
    </Section>
  )
}

export default Marketplace
