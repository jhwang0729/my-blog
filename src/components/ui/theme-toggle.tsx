'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from './button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'light') return Sun
    if (theme === 'dark') return Moon
    return Monitor
  }

  const getLabel = () => {
    if (theme === 'light') return 'Light mode'
    if (theme === 'dark') return 'Dark mode'
    return 'System theme'
  }

  const Icon = getIcon()

  return (
    <Button
      onClick={cycleTheme}
      variant="ghost"
      size="sm"
      className="relative h-10 w-10 rounded-full border border-white/30 bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/70 dark:hover:bg-slate-800/90"
      title={getLabel()}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.3,
          }}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </AnimatePresence>

      {/* Visual indicator for theme */}
      <motion.div
        className="absolute -bottom-1 left-1/2 h-1 w-1 rounded-full bg-blue-500"
        initial={{ scale: 0, x: '-50%' }}
        animate={{
          scale: 1,
          x: '-50%',
        }}
        transition={{ delay: 0.2 }}
      />
    </Button>
  )
}

// Simple toggle version for mobile or compact layouts
export function SimpleThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full border border-white/30 bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/90 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/70 dark:hover:bg-slate-800/90"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, type: 'spring', damping: 15 }}
          >
            <Sun className="h-4 w-4 text-orange-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.4, type: 'spring', damping: 15 }}
          >
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
