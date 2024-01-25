// React
import React from 'react'

// CSS
import "./GameOver.css"

const GameOver = ({retry, score}) => {
  return (
    <div>
      <h1>Fim do Jogo!</h1>
      <h2>
        A sua pontuação foi: <span score={score}></span>
      </h2>
      <button onClick={retry}>Resetar o jogo</button>
    </div>
  )
}

export default GameOver