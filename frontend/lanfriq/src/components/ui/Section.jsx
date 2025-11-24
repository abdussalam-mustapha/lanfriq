import './Section.css'

const Section = ({ 
  children, 
  id,
  className = '',
  variant = 'default',
  ...props 
}) => {
  return (
    <section id={id} className={`section section--${variant} ${className}`} {...props}>
      <div className="container">
        {children}
      </div>
    </section>
  )
}

export default Section
