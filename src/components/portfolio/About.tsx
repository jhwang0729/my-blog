'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { Profile } from '@/types/database'
import { motion } from 'framer-motion'
import { Code2, Coffee, Heart, Lightbulb, Target, User } from 'lucide-react'

interface AboutProps {
  profile: Profile | null
}

const About = ({ profile }: AboutProps) => {
  const stats = [
    { icon: Code2, label: 'Projects Built', value: '15+' },
    { icon: Coffee, label: 'Cups of Coffee', value: '∞' },
    { icon: Lightbulb, label: 'Ideas Implemented', value: '50+' },
    { icon: Target, label: 'Goals Achieved', value: '100%' },
  ]

  const interests = [
    '🚀 Technology Innovation',
    '💡 Problem Solving',
    '🎨 UI/UX Design',
    '📚 Continuous Learning',
    '🌱 Open Source',
    '🏃‍♂️ Running',
  ]

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <User className="text-blue-600 dark:text-blue-400 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                About Me
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate developer with a love for creating elegant solutions to complex problems
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Bio Card */}
              <Card className="glass shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Heart className="text-red-500 dark:text-red-400 mr-3" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Story</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {profile?.bio || `I'm a passionate full-stack developer who loves turning ideas into reality through code. 
                    With a strong foundation in modern web technologies and a keen eye for detail, 
                    I create digital experiences that are both functional and beautiful.`}
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <stat.icon className="text-blue-600 dark:text-blue-400 mx-auto mb-3" size={32} />
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Interests & Values */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Interests */}
              <Card className="glass shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Lightbulb className="text-yellow-500 dark:text-yellow-400 mr-3" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Interests & Passions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest, index) => (
                      <motion.div
                        key={interest}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/30 px-4 py-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-700 dark:text-gray-300 font-medium hover:shadow-md transition-all duration-300"
                      >
                        {interest}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Let's Connect
                  </h3>
                  <div className="space-y-4">
                    {profile?.email && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <span className="font-medium mr-2">📧 Email:</span>
                        <a 
                          href={`mailto:${profile.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          {profile.email}
                        </a>
                      </div>
                    )}
                    
                    {profile?.location && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <span className="font-medium mr-2">📍 Location:</span>
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile?.website && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <span className="font-medium mr-2">🌐 Website:</span>
                        <a 
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 