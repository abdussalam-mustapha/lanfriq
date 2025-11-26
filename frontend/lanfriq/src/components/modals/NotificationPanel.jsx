import { X, CheckCircle, XCircle } from 'lucide-react'
import './NotificationPanel.css'

const NotificationPanel = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Congrats',
      message: "you're verified! You can now tokenize properties.",
      time: '1 m',
      isRead: false
    },
    {
      id: 2,
      type: 'error',
      title: 'Verification not approved.',
      message: 'Name mismatch. Re-upload corrected ID.',
      time: '1 m',
      isRead: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Congrats',
      message: "you're verified! You can now tokenize properties.",
      time: '1 m',
      isRead: false
    },
    {
      id: 4,
      type: 'error',
      title: 'Verification not approved.',
      message: 'Name mismatch. Re-upload corrected ID.',
      time: '1 m',
      isRead: false
    },
    {
      id: 5,
      type: 'success',
      title: 'Congrats',
      message: "you're verified! You can now tokenize properties.",
      time: '1 m',
      isRead: false
    }
  ]

  if (!isOpen) return null

  return (
    <div className="notification-panel-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-panel__header">
          <h2 className="notification-panel__title">Notification</h2>
          <button className="notification-panel__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="notification-panel__list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-panel__item">
              <div className={`notification-panel__icon notification-panel__icon--${notification.type}`}>
                {notification.type === 'success' ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <div className="notification-panel__content">
                <h3 className="notification-panel__item-title">{notification.title}</h3>
                <p className="notification-panel__message">{notification.message}</p>
              </div>
              <div className="notification-panel__meta">
                <span className="notification-panel__time">{notification.time}</span>
                {!notification.isRead && <span className="notification-panel__dot"></span>}
              </div>
            </div>
          ))}
        </div>

        <button className="notification-panel__see-more">See more</button>
      </div>
    </div>
  )
}

export default NotificationPanel
