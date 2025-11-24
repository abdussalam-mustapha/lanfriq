import './Button.css'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
