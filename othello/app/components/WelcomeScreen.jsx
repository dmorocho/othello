import React, {useEffect} from 'react'
import '../styles/WelcomeScreen.css'

const WelcomeScreen = ({onStart}) => {
  useEffect(() => {
    const styleSheet = createStyleSheet()
    document.head.appendChild(styleSheet)

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  const handlePlayerChoice = (mode) => {
    onStart(mode)
  }

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to Othello!</h1>
      <p className="welcome-description">
        Othello is a strategy board game for two players. It is played on an 8x8 uncheckered board. Each player has 32 pieces,
        which are black and white discs. Players take turns placing their discs on the board, with the goal of having more
        discs than their opponent.
      </p>
      <button onClick={() => handlePlayerChoice('twoPlayers')} className="start-button">
        Play with Two Players
      </button>
      <button onClick={() => handlePlayerChoice('computer')} className="start-button">
        Play with Computer
      </button>
      <button onClick={() => handlePlayerChoice('obstacles')} className="start-button">
        Play with Obstacles
      </button>
      <button onClick={() => handlePlayerChoice('obstaclesVsComputer')} className="start-button">
        Play with Obstacles VS Computer
      </button>
    </div>
  )
}

// Function to create a style element
const createStyleSheet = () => {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  return styleSheet
}

export default WelcomeScreen
