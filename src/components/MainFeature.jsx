import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  // Game state
  const [gameState, setGameState] = useState('setup') // setup, playing, finished
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', position: 0, color: 'bg-red-500' },
    { id: 2, name: 'Player 2', position: 0, color: 'bg-blue-500' }
  ])
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [canRoll, setCanRoll] = useState(true)
  const [winner, setWinner] = useState(null)

  // Game configuration
  const BOARD_SIZE = 100
  const WINNING_POSITION = 100

  // Snakes and Ladders positions (from -> to)
  const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
  }
  
  const ladders = {
    1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
  }

  // Get square type and destination
  const getSquareInfo = (position) => {
    if (snakes[position]) {
      return { type: 'snake', destination: snakes[position] }
    }
    if (ladders[position]) {
      return { type: 'ladder', destination: ladders[position] }
    }
    return { type: 'normal', destination: position }
  }

  // Generate board squares in snake pattern (right-to-left on even rows)
  const generateBoardPositions = () => {
    const positions = []
    for (let row = 9; row >= 0; row--) {
      if (row % 2 === 1) {
        // Odd rows (from bottom): left to right
        for (let col = 0; col < 10; col++) {
          positions.push(row * 10 + col + 1)
        }
      } else {
        // Even rows: right to left
        for (let col = 9; col >= 0; col--) {
          positions.push(row * 10 + col + 1)
        }
      }
    }
    return positions
  }

  const boardPositions = generateBoardPositions()
// Convert position to grid coordinates
  const getGridCoordinates = (position) => {
    const row = Math.floor((position - 1) / 10)
    const col = (position - 1) % 10
    
    // Adjust for snake pattern (even rows go right-to-left)
    if (row % 2 === 0) {
      return { row: 9 - row, col: 9 - col }
    } else {
      return { row: 9 - row, col }
    }
  }
// Convert grid coordinates to SVG coordinates (percentage-based)
  const gridToSVG = (position) => {
    const coords = getGridCoordinates(position)
    const x = (coords.col * 10) + 5 // Center of the square (5% offset)
    const y = (coords.row * 10) + 5 // Center of the square (5% offset)
    return { x, y }
  }

  // Generate SVG path for snake (curved)
  const generateSnakePath = (start, end) => {
    const startCoords = gridToSVG(start)
    const endCoords = gridToSVG(end)
    
    // Calculate control points for a curved path
    const midX = (startCoords.x + endCoords.x) / 2
    const midY = (startCoords.y + endCoords.y) / 2
    const offset = 15 // Curve intensity
    
    return `M ${startCoords.x} ${startCoords.y} Q ${midX + offset} ${midY - offset} ${endCoords.x} ${endCoords.y}`
  }

  // Generate SVG path for ladder (stepped)
  const generateLadderPath = (start, end) => {
    const startCoords = gridToSVG(start)
    const endCoords = gridToSVG(end)
    
    // Create a stepped ladder path
    const steps = Math.abs(end - start) > 20 ? 4 : 3
    let path = `M ${startCoords.x} ${startCoords.y}`
    
    for (let i = 1; i <= steps; i++) {
      const progress = i / steps
      const x = startCoords.x + (endCoords.x - startCoords.x) * progress
      const y = startCoords.y + (endCoords.y - startCoords.y) * progress
      const stepOffset = (i % 2 === 0) ? 2 : -2
      path += ` L ${x + stepOffset} ${y}`
    }
    
    return path
  }

  // Render path overlays
  const renderPathOverlays = () => {
    const paths = []
    
    // Add snake paths
    Object.entries(snakes).forEach(([start, end]) => {
      const path = generateSnakePath(parseInt(start), parseInt(end))
      paths.push(
        <path
          key={`snake-${start}-${end}`}
          d={path}
          className="snake-svg-path"
        />
      )
    })
    
    // Add ladder paths
    Object.entries(ladders).forEach(([start, end]) => {
      const path = generateLadderPath(parseInt(start), parseInt(end))
      paths.push(
        <path
          key={`ladder-${start}-${end}`}
          d={path}
          className="ladder-svg-path"
        />
      )
    })
    
    return paths
  }


  // Roll dice function
  const rollDice = () => {
    if (!canRoll || isRolling || gameState !== 'playing') return

    setIsRolling(true)
    setCanRoll(false)

    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
    }, 100)

    setTimeout(() => {
      clearInterval(rollInterval)
      const finalValue = Math.floor(Math.random() * 6) + 1
      setDiceValue(finalValue)
      setIsRolling(false)
      
      // Move player
      movePlayer(finalValue)
    }, 600)
  }

  // Move player function
  const movePlayer = (steps) => {
    const newPlayers = [...players]
    const player = newPlayers[currentPlayer]
    let newPosition = Math.min(player.position + steps, WINNING_POSITION)

    // If exact landing on 100, player wins
    if (newPosition === WINNING_POSITION) {
      player.position = newPosition
      setPlayers(newPlayers)
      setWinner(player)
      setGameState('finished')
      toast.success(`🎉 ${player.name} wins the game!`)
      return
    }

// Get square info for the new position (needed for delay calculation)
    const squareInfo = getSquareInfo(newPosition)
    // If overshooting 100, stay at current position
    if (player.position + steps > WINNING_POSITION) {
      newPosition = player.position
      toast.info(`Cannot move ${steps} steps - would overshoot square 100!`)
    } else {
      player.position = newPosition
      
      // Check for snakes or ladders
      if (squareInfo.type === 'snake') {
        setTimeout(() => {
          player.position = squareInfo.destination
          setPlayers([...newPlayers])
          toast.error(`🐍 Snake bite! Slid down to square ${squareInfo.destination}`)
        }, 1000)
      } else if (squareInfo.type === 'ladder') {
        setTimeout(() => {
          player.position = squareInfo.destination
          setPlayers([...newPlayers])
          toast.success(`🪜 Climbed the ladder to square ${squareInfo.destination}!`)
        }, 1000)
      }
    }

    setPlayers(newPlayers)

    // Switch to next player after a delay
    setTimeout(() => {
      setCurrentPlayer((prev) => (prev + 1) % players.length)
      setCanRoll(true)
    }, squareInfo?.type !== 'normal' ? 2000 : 1500)
  }

  // Start new game
  const startNewGame = () => {
    setGameState('playing')
    setCurrentPlayer(0)
    setWinner(null)
    setPlayers(players.map(player => ({ ...player, position: 0 })))
    setCanRoll(true)
    setDiceValue(1)
    toast.success('New game started! Roll the dice to begin.')
  }

  // Reset game
  const resetGame = () => {
    setGameState('setup')
    setCurrentPlayer(0)
    setWinner(null)
    setPlayers([
      { id: 1, name: 'Player 1', position: 0, color: 'bg-red-500' },
      { id: 2, name: 'Player 2', position: 0, color: 'bg-blue-500' }
    ])
    setCanRoll(true)
    setDiceValue(1)
  }

  // Update player names
  const updatePlayerName = (index, name) => {
    const newPlayers = [...players]
    newPlayers[index].name = name || `Player ${index + 1}`
    setPlayers(newPlayers)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-neu-light border border-purple-100 p-4 sm:p-8"
      >
        {/* Game Setup */}
        {gameState === 'setup' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-8">
              Setup Your Game
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
              {players.map((player, index) => (
                <div key={player.id} className="space-y-3">
                  <label className="block text-sm font-medium text-surface-700">
                    Player {index + 1} Name
                  </label>
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 focus:border-primary focus:outline-none transition-colors"
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                  />
                  <div className={`w-6 h-6 ${player.color} rounded-full mx-auto`}></div>
                </div>
              ))}
            </div>
            
            <button
              onClick={startNewGame}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <ApperIcon name="Play" className="w-5 h-5" />
              <span>Start Game</span>
            </button>
          </motion.div>
        )}

        {/* Game Board */}
        {(gameState === 'playing' || gameState === 'finished') && (
          <div className="space-y-6">
            {/* Game Status */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                {gameState === 'playing' && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${players[currentPlayer].color} rounded-full animate-bounce-gentle`}></div>
                    <span className="text-lg font-semibold text-surface-900">
                      {players[currentPlayer].name}'s Turn
                    </span>
                  </div>
                )}
                {gameState === 'finished' && winner && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Trophy" className="w-6 h-6 text-accent" />
                    <span className="text-lg font-semibold text-surface-900">
                      {winner.name} Wins! 🎉
                    </span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* Dice */}
                <motion.button
                  onClick={rollDice}
                  disabled={!canRoll || isRolling || gameState !== 'playing'}
                  className={`dice-container ${isRolling ? 'animate-roll' : ''} ${
                    !canRoll || gameState !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: canRoll && gameState === 'playing' ? 1.05 : 1 }}
                  whileTap={{ scale: canRoll && gameState === 'playing' ? 0.95 : 1 }}
                >
                  <span className="text-2xl font-bold text-primary">{diceValue}</span>
                </motion.button>

                <button
                  onClick={resetGame}
                  className="p-3 bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
                  title="Reset Game"
                >
                  <ApperIcon name="RotateCcw" className="w-5 h-5 text-surface-600" />
                </button>
              </div>
            </div>

            {/* Players Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    currentPlayer === index && gameState === 'playing'
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'border-surface-200 bg-surface-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 ${player.color} rounded-full`}></div>
                      <span className="font-medium text-surface-900">{player.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-surface-600">Position</div>
                      <div className="text-xl font-bold text-primary">{player.position}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

{/* Game Board */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="game-board-container"
            >
              {/* SVG Path Overlay */}
              <svg 
                className="path-overlay" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                {renderPathOverlays()}
              </svg>
              
              {/* Game Board Grid */}
              <div className="game-board"
            >
              {boardPositions.map((position, index) => {
                const squareInfo = getSquareInfo(position)
                const playersOnSquare = players.filter(p => p.position === position)
                
                return (
                  <motion.div
                    key={position}
                    className={`board-square relative ${
                      squareInfo.type === 'snake' 
                        ? 'bg-red-100 border-red-200' 
                        : squareInfo.type === 'ladder'
                        ? 'bg-green-100 border-green-200'
                        : position === 100
                        ? 'bg-accent/20 border-accent'
                        : 'bg-surface-50 border-surface-200'
                    } border`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.01 }}
                  >
                    {/* Square number */}
                    <span className={`text-xs font-bold ${
                      position === 100 ? 'text-accent' : 'text-surface-700'
                    }`}>
                      {position}
                    </span>
{/* Special square indicators */}
                    {squareInfo.type === 'snake' && (
                      <>
                        <div className="snake-path"></div>
                        <div className="snake-visual">
                          <span className="text-lg">🐍</span>
                        </div>
                        <div className="destination-info text-red-700">
                          →{squareInfo.destination}
                        </div>
                        <ApperIcon name="ArrowDown" className="absolute top-1 left-1 w-3 h-3 text-red-600" />
                      </>
                    )}
                    {squareInfo.type === 'ladder' && (
                      <>
                        <div className="ladder-path"></div>
                        <div className="ladder-visual">
                          <span className="text-lg">🪜</span>
                        </div>
                        <div className="destination-info text-green-700">
                          →{squareInfo.destination}
                        </div>
                        <ApperIcon name="ArrowUp" className="absolute top-1 left-1 w-3 h-3 text-green-600" />
                      </>
                    )}
                    {position === 100 && (
                      <ApperIcon name="Crown" className="absolute top-1 right-1 w-3 h-3 text-accent" />
                    )}
                    
                    {/* Player pieces */}
                    <AnimatePresence>
                      {playersOnSquare.map((player, playerIndex) => (
                        <motion.div
                          key={`${player.id}-${position}`}
                          className={`player-piece ${player.color}`}
                          style={{
                            left: `${20 + playerIndex * 8}%`,
                            top: `${20 + playerIndex * 8}%`
                          }}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
</div>
            </motion.div>

            {/* Game Instructions */}
            <div className="text-center text-sm text-surface-600 space-y-2">
              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="ArrowUp" className="w-3 h-3 text-green-600" />
                  <span>Ladder</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="ArrowDown" className="w-3 h-3 text-red-600" />
                  <span>Snake</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Crown" className="w-3 h-3 text-accent" />
                  <span>Goal</span>
                </div>
              </div>
              <p>Roll the dice to move. Reach square 100 to win! Ladders boost you up, snakes slide you down.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature