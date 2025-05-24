'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Profile } from '@/types/database'
import { motion } from 'framer-motion'
import { Github, Globe, Linkedin, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'

interface ContactProps {
  profile: Profile | null
}

const Contact = ({ profile }: ContactProps) => {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email,
      href: profile?.email ? `mailto:${profile.email}` : null,
      color: 'red',
      bgClass: 'from-red-50 to-pink-50',
      borderClass: 'border-red-200/50',
      iconClass: 'text-red-600'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.phone,
      href: profile?.phone ? `tel:${profile.phone}` : null,
      color: 'green',
      bgClass: 'from-green-50 to-emerald-50',
      borderClass: 'border-green-200/50',
      iconClass: 'text-green-600'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile?.location,
      href: null,
      color: 'blue',
      bgClass: 'from-blue-50 to-indigo-50',
      borderClass: 'border-blue-200/50',
      iconClass: 'text-blue-600'
    }
  ]

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: profile?.github_url,
      color: 'gray',
      hoverColor: 'hover:text-gray-900',
      bgColor: 'hover:bg-gray-100'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: profile?.linkedin_url,
      color: 'blue',
      hoverColor: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      icon: Globe,
      label: 'Website',
      url: profile?.website,
      color: 'purple',
      hoverColor: 'hover:text-purple-600',
      bgColor: 'hover:bg-purple-50'
    }
  ]

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 180, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="text-blue-600 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Let's Connect
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I'm always interested in new opportunities and interesting projects. 
              Let's discuss how we can work together!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Get In Touch
              </h3>

              {/* Contact Methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  if (!method.value) return null
                  
                  const IconComponent = method.icon
                  const content = (
                    <Card className={`bg-gradient-to-br ${method.bgClass} border ${method.borderClass} hover:shadow-lg transition-all duration-300 ${method.href ? 'cursor-pointer hover:scale-105' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full bg-white/70 border border-white/30`}>
                            <IconComponent className={method.iconClass} size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {method.label}
                            </h4>
                            <p className="text-gray-600">
                              {method.value}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )

                  return (
                    <motion.div
                      key={method.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {method.href ? (
                        <a href={method.href} className="block">
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Follow Me
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    if (!social.url) return null
                    
                    const IconComponent = social.icon
                    return (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-full ${social.hoverColor} ${social.bgColor} transition-all duration-300 shadow-lg hover:shadow-xl`}
                      >
                        <IconComponent size={24} />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quick Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:pl-8"
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                <CardContent className="p-8 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-6"
                    >
                      <Send className="text-blue-600 mx-auto" size={48} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Start a Project?
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Whether you have a specific project in mind or just want to explore possibilities, 
                      I'd love to hear from you. Let's create something amazing together!
                    </p>

                    {/* Primary CTA */}
                    {profile?.email && (
                      <a href={`mailto:${profile.email}?subject=Let's Work Together!`}>
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
                        >
                          <Mail className="mr-2" size={18} />
                          Send Email
                        </Button>
                      </a>
                    )}

                    {/* Secondary CTA */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => document.querySelector('#resume')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-300"
                    >
                      View Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50 shadow-lg">
              <CardContent className="py-6">
                <p className="text-gray-600 text-sm">
                  © {new Date().getFullYear()} {profile?.full_name || 'Portfolio'} • Built with Next.js, Tailwind CSS, and ❤️
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact 