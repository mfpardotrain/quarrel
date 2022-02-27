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
    const [answer, setAnswer] = useState(false);
    let guessString = guessState.join("");

    let bodyData = {
        "word": guessString
    };
    const getIsValid = DefaultCallbackPostRequest('isWordValid/', bodyData);

    let stupidWorkaround = (aa) => {
        if ((answer.length < 1 || answer === false) && aa) {
            setAnswer(aa)
        }
    }
    

    const handleTyping = async (event) => {
        switch (event.key) {
            case "Enter":
                if (guessState.length === 5) {
                    let check = await getIsValid(false, false)
                    if (check["data"]) {
                        setPreviousGuesses(previousGuesses => [...previousGuesses, guessState]);
                        setGuessState([]);
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
                "guess": guessState,
                "handleTyping": handleTyping,
                "previousGuesses": previousGuesses,
                "answer": answer,
                "setAnswer": stupidWorkaround,
            }}
        >
            {children}
        </GuessContext.Provider>
    );
};

export const useGuessState = () => useContext(GuessContext);