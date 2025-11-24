import Section from '../ui/Section'
import './Statistics.css'

const Statistics = () => {
  const stats = [
    {
      value: '5,000+',
      label: 'Total property value on platform'
    },
    {
      value: '+32%',
      label: 'Average yearly ROI'
    },
    {
      value: '5000+',
      label: 'Number of SPVs created'
    },
    {
      value: '50+',
      label: 'Verified valuers count'
    }
  ]

  return (
    <Section variant="stats" className="statistics">
      <div className="statistics__grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default Statistics
