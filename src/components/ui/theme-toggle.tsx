'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from './button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './dropdown-menu'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative w-10 h-10 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            {resolvedTheme === 'light' ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <Sun className="h-4 w-4 text-orange-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.3, type: "spring" }}
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
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <Sun className="h-4 w-4 text-orange-500" />
          <span>Light</span>
          {theme === 'light' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Dark</span>
          {theme === 'dark' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <Monitor className="h-4 w-4 text-gray-500" />
          <span>System</span>
          {theme === 'system' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
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
      className="relative w-10 h-10 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, type: "spring", damping: 15 }}
          >
            <Sun className="h-4 w-4 text-orange-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.4, type: "spring", damping: 15 }}
          >
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 