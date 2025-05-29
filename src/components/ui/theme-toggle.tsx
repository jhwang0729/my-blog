'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full border border-white/30 bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/70 dark:hover:bg-slate-800/90"
        >
          <AnimatePresence mode="wait" initial={false}>
            {resolvedTheme === 'light' ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <Sun className="h-4 w-4 text-orange-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <Moon className="h-4 w-4 text-blue-400" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border border-white/20 bg-white/90 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/90"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center space-x-2 transition-colors hover:bg-blue-50 dark:hover:bg-slate-700/50"
        >
          <Sun className="h-4 w-4 text-orange-500" />
          <span>Light</span>
          {theme === 'light' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center space-x-2 transition-colors hover:bg-blue-50 dark:hover:bg-slate-700/50"
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Dark</span>
          {theme === 'dark' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center space-x-2 transition-colors hover:bg-blue-50 dark:hover:bg-slate-700/50"
        >
          <Monitor className="h-4 w-4 text-gray-500" />
          <span>System</span>
          {theme === 'system' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
