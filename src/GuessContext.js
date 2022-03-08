import React, { useContext, useState, createContext, } from 'react';
import { DefaultCallbackPostRequest } from './ApiUtils';

export const GuessContext = createContext({
    "previousGuesses": [],
    "setpreviousGuesses": false,
    "guess": [],
    "answer": false,
    "handleTyping": false
});

export const GuessContextWrapper = ({ children }) => {
    const [guessState, setGuessState] = useState([]);
    const [previousGuesses, setPreviousGuesses] = useState([]);
    const [gameData, setGameData] = useState({});
    const [success, setSuccess] = useState(false);

    // const [answer, setAnswer] = useState(['s', 'c', 'a', 'n', 't']);
    const [answer, setAnswer] = useState(false);
    let guessString = guessState.join("");

    let bodyData = {
        "word": guessString
    };
    const getIsValid = DefaultCallbackPostRequest('isWordValid/', bodyData);
    const sendGamestate = DefaultCallbackPostRequest('normalGame/', gameData);

    const handleTyping = async (event) => {
        switch (event.key) {
            case "Enter":
                if (guessState.length === 5) {
                    let check = await getIsValid(false, false)
                    if (check["data"]) {
                        setPreviousGuesses(previousGuesses => [...previousGuesses, guessState]);
                        setGuessState([]);
                        sendGamestate(setSuccess, { previousGuesses: previousGuesses })
                        if (answer.join() === guessState.join()) {
                            localStorage.removeItem("game_id")
                            localStorage.removeItem("answer")
                        }
                    }
                };
                break;
            case "Backspace":
                setGuessState(guessState => guessState.filter((_, i) => i !== guessState.length - 1));
                break;
            default:
                if (guessState.length < 5) {
                    setGuessState(guessState => [...guessState, event.key]);
                };

        };
    };

    return (
        <GuessContext.Provider
            value={{
                "guessState": guessState,
                "handleTyping": handleTyping,
                "previousGuesses": previousGuesses,
                "setPreviousGuesses": setPreviousGuesses,
                "answer": answer,
                "setAnswer": setAnswer,
                "setGameData": setGameData,
                "gameData": gameData,
                "success": success,
            }}
        >
            {children}
        </GuessContext.Provider>
    );
};

export const useGuessState = () => useContext(GuessContext);