import React, { useContext, useState, createContext } from 'react';

export const GuessContext = createContext({
    "previousGuesses": [],
    "setpreviousGuesses": false,
    "guess": [],
    "answer": ["w", "o", "r", "d", "s"],
    "handleTyping": false
});

export const GuessContextWrapper = ({ children }) => {
    const [guessState, setGuessState] = useState([]);
    const [previousGuesses, setPreviousGuesses] = useState([]);
    const [answer, setAnswer] = useState(["w", "o", "r", "d", "s"]);
    let validWords = ["hello", "fatty", "lumpy", "cocoa", "bread", "words", "ooooo"];
    let guessString = guessState.join("");

    const handleTyping = (event) => {
        switch (event.key) {
            case "Enter":
                if (guessState.length === 5 && validWords.includes(guessString)) {
                    setPreviousGuesses(previousGuesses => [...previousGuesses, guessState]);
                    setGuessState([]);
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
            }}
        >
            {children}
        </GuessContext.Provider>
    );
};

export const useGuessState = () => useContext(GuessContext);