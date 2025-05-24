'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/types/database'
import { motion } from 'framer-motion'
import { Calendar, ChevronDown, Github, Linkedin, Mail, MapPin } from 'lucide-react'

interface HeroProps {
  profile: Profile | null
}

const Hero = ({ profile }: HeroProps) => {
  const scrollToNext = () => {
    const element = document.querySelector('#about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="floating-blob absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="floating-blob absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium glass">
              👋 Welcome to my portfolio
            </Badge>
          </motion.div>

          {/* Name and Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-gray-100 dark:via-blue-300 dark:to-gray-100 bg-clip-text text-transparent">
              {profile?.full_name || 'Your Name'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed"
          >
            Full Stack Developer & Creative Problem Solver
          </motion.p>

          {/* Bio */}
          {profile?.bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Location and Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-6 mb-12"
          >
            {profile?.location && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <MapPin size={18} />
                <span>{profile.location}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
              <span>Available for opportunities</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Calendar size={18} />
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mail className="mr-2" size={18} />
              Get In Touch
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.querySelector('#resume')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 glass text-gray-700 dark:text-gray-300 transition-all duration-300"
            >
              <ChevronDown className="mr-2" size={18} />
              View Resume
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex justify-center space-x-6"
          >
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:scale-110 transition-all duration-300"
              >
                <Github size={24} className="text-gray-700 dark:text-gray-300" />
              </a>
            )}
            
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:scale-110 transition-all duration-300"
              >
                <Linkedin size={24} className="text-gray-700 dark:text-gray-300" />
              </a>
            )}
            
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="p-3 glass rounded-full hover:scale-110 transition-all duration-300"
              >
                <Mail size={24} className="text-gray-700 dark:text-gray-300" />
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 glass rounded-full hover:scale-110 transition-all duration-300 animate-bounce"
      >
        <ChevronDown size={24} className="text-gray-700 dark:text-gray-300" />
      </motion.button>
    </section>
  )
}

export default Hero 