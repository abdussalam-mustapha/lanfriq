import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { ArrowRight } from 'lucide-react'
import Header from '../layout/Header'
import heroBgLight from '../../assets/heroBgLight.png'
import heroBgDark from '../../assets/heroBgDark.png'
import heroImgLight from '../../assets/hero-img-light.png'
import heroImgDark from '../../assets/hero-img-dark.png'
import binance from '../../assets/binance.png'
import blockatron from '../../assets/blockatron.png'
import blockchainAppFactory from '../../assets/blockchainAppFactory.png'
import blockchainPropulsion from '../../assets/blockchainPropulsion.png'
import chainalysis from '../../assets/chainalysis.png'
import hashgraph from '../../assets/hashgraph.png'
import hedera from '../../assets/hedera.png'
import './Hero.css'

const Hero = () => {
  const { theme } = useTheme()
  const heroBg = theme === 'light' ? heroBgLight : heroBgDark
  const heroImg = theme === 'light' ? heroImgLight : heroImgDark
  const heroRef = useRef(null)

  // Generate grid cells based on hero dimensions
  const cellSize = 100 // Larger cell size
  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 })

  useEffect(() => {
    const updateGrid = () => {
      if (heroRef.current) {
        const width = heroRef.current.offsetWidth
        const height = heroRef.current.offsetHeight
        setGridDimensions({
          cols: Math.ceil(width / cellSize),
          rows: Math.ceil(height / cellSize)
        })
      }
    }
    
    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [])

  // Generate grid cells
  const cells = []
  for (let row = 0; row < gridDimensions.rows; row++) {
    for (let col = 0; col < gridDimensions.cols; col++) {
      const cellId = `${row}-${col}`
      cells.push(
        <motion.div
          key={cellId}
          className="hero__grid-cell"
          style={{
            left: col * cellSize,
            top: row * cellSize,
            width: cellSize,
            height: cellSize,
          }}
          initial={{ backgroundColor: 'transparent' }}
          whileHover={{ 
            backgroundColor: 'rgba(168, 216, 95, 0.5)',
            scale: 1.08,
            transition: { duration: 1, ease: 'easeOut' }
          }}
          whileTap={{ 
            backgroundColor: 'rgba(140, 192, 67, 0.7)',
            scale: 0.95,
            transition: { duration: 1, ease: 'easeOut' }
          }}
        />
      )
    }
  }

  const partners = [
    { src: blockatron, alt: 'Blockatron' },
    { src: blockchainAppFactory, alt: 'Blockchain App Factory' },
    { src: blockchainPropulsion, alt: 'Blockchain Propulsion' },
    { src: hashgraph, alt: 'Hashgraph' },
    { src: hedera, alt: 'Hedera' },
    { src: chainalysis, alt: 'Chainalysis' },
    { src: binance, alt: 'Binance' }
  ]

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${heroBg})` }} ref={heroRef}>
        <div className="hero__grid-overlay">
          {cells}
        </div>
        <Header />
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              Invest in Real Estate,<br />
              One Token at a Time.
            </h1>
            <p className="hero__description">
              Own fractions of professionally-valued properties through secure SPV structures — with transparent updates, real profit distribution, and NFT-backed receipts.
            </p>
            <div className="hero__actions">
              <button className="btn btn--primary btn--large">
                <span>Get Started</span>
                <ArrowRight size={16} strokeWidth={1.4375} color="#ffffff" />
              </button>
              <button className="btn btn--secondary btn--large">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <div className="hero__image-wrapper">
        <div className="container">
          <div className="hero__image">
            <img src={heroImg} alt="Lanfriq Platform" />
          </div>
        </div>
      </div>

      <section className="hero__partners-section">
        <div className="container">
          <div className="hero__partners">
            <p className="hero__partners-label">Trusted and backed by</p>
            <div className="hero__partners-grid">
              {partners.map((partner, index) => (
                <div key={index} className="hero__partner">
                  <img src={partner.src} alt={partner.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero