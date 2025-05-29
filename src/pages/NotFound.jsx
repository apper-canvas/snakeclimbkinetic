import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Gamepad2" className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-surface-900 mb-4">
            Game Over!
          </h2>
          <p className="text-lg text-surface-600 mb-8 max-w-md mx-auto">
            Looks like you've slid down a snake to a page that doesn't exist. 
            Let's get you back to the game board!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Game</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound