'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ 
      behavior: 'smooth' 
    })
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#resume', label: 'Resume' },
    { href: '#contact', label: 'Contact' }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          transition-all duration-300
          ${isScrolled 
            ? 'glass shadow-lg' 
            : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/50'
          }
          rounded-full px-6 py-3 hidden md:flex items-center space-x-6
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => scrollToSection(item.href)}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            {item.label}
          </button>
        ))}
        
        {/* Theme Toggle */}
        <div className="ml-2 flex items-center">
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <motion.button
          className={`
            fixed top-4 right-4 z-50 p-3 rounded-full
            ${isScrolled 
              ? 'glass shadow-lg' 
              : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/50'
            }
            transition-all duration-300
          `}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Theme Toggle for Mobile */}
        <motion.div
          className={`
            fixed top-4 right-20 z-50
            ${isScrolled 
              ? 'glass shadow-lg' 
              : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/50'
            }
            rounded-full transition-all duration-300
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ThemeToggle />
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="glass rounded-2xl p-8 mx-4 w-full max-w-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className="w-full text-left py-3 px-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/70 transition-colors duration-200 text-gray-700 dark:text-gray-300 font-medium"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
} 