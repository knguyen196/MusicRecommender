// Top navigation bar links to all sections and collapses to a menu on mobile
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Headphones, Radio, Heart, Menu, X, Search } from 'lucide-react'

export function Navbar({ activeSection, setActiveSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'search', label: 'Search', icon: Search},
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'browse', label: 'Browse', icon: Headphones },
    { id: 'rated', label: 'My Ratings', icon: Heart},
    { id: 'about', label: 'About', icon: Radio },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navbar"
    >
      <div className="navbar-container">
        <div className="navbar-content">
          <h1 className="navbar-title">Music Recommender</h1>

          <div className="nav-desktop">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`nav-button ${
                  activeSection === item.id
                    ? 'nav-button-active'
                    : 'nav-button-inactive'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-nav"
            >
              <div className="mobile-nav-content">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMobileMenuOpen(false)
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`mobile-nav-item ${
                      activeSection === item.id
                        ? 'mobile-nav-item-active'
                        : 'mobile-nav-item-inactive'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}