import { useState } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Gamepad2" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                SnakeClimb
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600" 
                />
              </button>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-surface-600">
                <ApperIcon name="Users" className="w-4 h-4" />
                <span>Multiplayer Ready</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative py-12 sm:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-cyan-100/30 to-amber-100/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 mb-6"
            >
              Classic Snake & Ladder
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">
                Reimagined
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg sm:text-xl text-surface-600 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the timeless board game with smooth animations, interactive gameplay, 
              and modern design. Roll the dice, climb ladders, avoid snakes, and race to victory!
            </motion.p>
          </div>

          {/* Feature highlights */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: "Dices", title: "Animated Dice", desc: "Roll with realistic physics" },
              { icon: "Users", title: "Multiplayer", desc: "Play with friends locally" },
              { icon: "Zap", title: "Smooth Animations", desc: "Fluid piece movements" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Game Feature */}
      <section className="py-8 sm:py-12">
        <MainFeature />
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="bg-white/70 backdrop-blur-md border-t border-purple-100 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Gamepad2" className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-surface-900">SnakeClimb</span>
          </div>
          <p className="text-surface-600">
            Bringing classic board games to the digital age with style and innovation.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home