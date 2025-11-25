import { X, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react'
import { IconBrandDiscord } from '@tabler/icons-react'
import { useTheme } from '../../context/ThemeContext'
import logo from '../../assets/LanfriqLogoFooter.png'
import watermarkLight from '../../assets/lanfriqWatermarkLight.png'
import watermarkDark from '../../assets/LanfriqWatermarkDark.png'
import './Footer.css'

const Footer = () => {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()
  const watermark = theme === 'light' ? watermarkLight : watermarkDark

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__watermark">
          <img src={watermark} alt="Lanfriq" />
        </div>
        
        <div className="footer__content">
          <div className="footer__brand">
            <img src={logo} alt="Lanfriq Logo" className="footer__logo" />
            <p className="footer__tagline">
              Invest in Real Estate, One Token at a Time.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Sections</h4>
              <ul className="footer__list">
                <li><a href="#benefits">Benefits</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Use Case</h4>
              <ul className="footer__list">
                <li><a href="#investors">For Investor</a></li>
                <li><a href="#property-owners">Property Owner</a></li>
                <li><a href="#businesses">Business/Firm</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer__social">
            <a href="#" aria-label="Twitter" className="footer__social-link">
              <X size={20} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Instagram" className="footer__social-link">
              <Instagram size={24} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Discord" className="footer__social-link">
              <IconBrandDiscord size={24} stroke={1.5} />
            </a>
            <a href="#" aria-label="Facebook" className="footer__social-link">
              <Facebook size={16} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="LinkedIn" className="footer__social-link">
              <Linkedin size={24} strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="YouTube" className="footer__social-link">
              <Youtube size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <img src={logo} alt="Lanfriq Logo" className="footer__logo-small" />
            <p className="footer__copyright">
              © {currentYear} Lanfriq. All rights reserved
            </p>
          </div>
          <div className="footer__bottom-right">
            <a href="#terms">Terms of service</a>
            <a href="#privacy">Privacy & Policy</a>
            <a href="#cookies">Cookies settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer