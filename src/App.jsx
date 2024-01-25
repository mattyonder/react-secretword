// CSS
import './App.css'

// React
import { useCallback, useEffect, useState} from 'react'

// Words Data
import { wordsList } from "./data/words";

// Components
import StartScreen from './components/StartScreen/StartScreen'
import Game from './components/Game/Game';
import GameOver from './components/GameOver/GameOver';


// Game Stages
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

const guessesQty = 3;

function App() {
  // Stage One useState
  const [gameStage, setGameStage] = useState(stages[0].name);

  // Stage Two useStates
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0)

  // Pick a random word from a random category
  const pickWordAndPickCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // Pick a random word

    const word = words[category][Math.floor(Math.random() * words[category].length)]


    return { word, category };
  }, [words]);

  // Starts the secret word game
  const startGame = useCallback(() => {
    //Pick word and pick category
    const { word, category } = pickWordAndPickCategory();
    
    // Create  an array of letters and changing letters to lower case
    let wordLetters = word.split("").map((l) => l.toLowerCase());;


    // Fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndPickCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()
    // check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) =>
        [
          ...actualGuessedLetters,
          normalizedLetter,
        ]);
    } else {
      setWrongLetters((actualWrongLetters) =>
        [
          ...actualWrongLetters,
          normalizedLetter,
        ]);
      
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };
  
  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])

  }
   
  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name)
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {


    if (gameStage != stages[1].name) {
      return
      
    } else {
      const uniqueLetters = [
        ...new Set(letters)
      ];
  
      // win condition
  
      if (guessedLetters.length === uniqueLetters.length) {
        // add score
        console.log(guessedLetters.length, uniqueLetters.length)
        setScore((actualScore) => actualScore += 100)
        clearLetterStates();
        startGame();
      }
    }
  }, [guessedLetters])
  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name)
  }

  return (
    <>
      <div className='App'>
        {gameStage === "start" && <StartScreen startGame={startGame} />}
        {gameStage === "game" &&
          <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}

          />}
        {gameStage === "end" && <GameOver retry={retry} score={score} />}

      </div>
    </>
  )
}

export default App
