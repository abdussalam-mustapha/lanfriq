import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Hero from '../../components/sections/Hero'
import Features from '../../components/sections/Features'
import TargetAudience from '../../components/sections/TargetAudience'
import Statistics from '../../components/sections/Statistics'
import HowItWorks from '../../components/sections/HowItWorks'
import CTA from '../../components/sections/CTA'
import Footer from '../../components/layout/Footer'

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
      offset: 100,
    })
  }, [])

  return (
    <>
      <Hero />
      <div data-aos="fade-up">
        <Features />
      </div>
      <div data-aos="fade-up">
        <TargetAudience />
      </div>
      <div data-aos="fade-up">
        <Statistics />
      </div>
      <div data-aos="fade-up">
        <HowItWorks />
      </div>
      <div data-aos="fade-up">
        <CTA />
      </div>
      <Footer />
    </>
  )
}

export default LandingPage
