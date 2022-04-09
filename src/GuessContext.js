import React, { useContext, useState, createContext, } from 'react';
import { DefaultCallbackPostRequest } from './ApiUtils';

export const GuessContext = createContext({
    "previousGuesses": [],
    "setpreviousGuesses": false,
    "guess": [],
    "answer": [],
    "handleTyping": false
});

export const GuessContextWrapper = ({ children }) => {
    const [guessState, setGuessState] = useState([]);
    const [previousGuesses, setPreviousGuesses] = useState([]);
    const [gameData, setGameData] = useState({});
    const [success, setSuccess] = useState(false);

    // const [answer, setAnswer] = useState(['s', 'c', 'a', 'n', 't']);
    const [answer, setAnswer] = useState([]);
    const [choice, setChoice] = useState([]);

    let guessString = guessState.join("");
    let choiceString = choice.join("");

    let bodyData = {
        "word": guessString
    };
    const getIsValid = DefaultCallbackPostRequest('isWordValid/', bodyData);

    let choiceBody = {
        "word": choiceString
    };
    const getChoiceValid = DefaultCallbackPostRequest('isWordValid/', choiceBody);

    const sendGamestate = DefaultCallbackPostRequest('normalGame/', gameData);

    const handleValidWord = async (validCheck) => {
        let out = await validCheck(false, false);
        if (!out["data"]) {
            var guessEl = document.getElementById("current-guess");
            guessEl.classList.add("shake")
            var listener = guessEl.addEventListener('animationend', function () {
                guessEl.classList.remove("shake");
                guessEl.removeEventListener('animationend', listener);
            })
        };
        return out;
    };

    const handleTyping = async (event) => {
        switch (event.key) {
            case "Enter":
                if (guessState.length === 5) {
                    let check = await handleValidWord(getIsValid);
                    if (check["data"]) {
                        setPreviousGuesses(previousGuesses => [...previousGuesses, guessState]);
                        setGuessState([]);
                        sendGamestate(setSuccess, { previousGuesses: previousGuesses });
                        if (answer.join() === guessState.join()) {
                            localStorage.removeItem("game_id");
                            localStorage.removeItem("answer");
                        };
                    };
                };
                break;
            case "Delete":
                setGuessState(guessState => guessState.filter((_, i) => i !== guessState.length - 1));
                break;
            default:
                if (guessState.length < 5) {
                    setGuessState(guessState => [...guessState, event.key]);
                };

        };
    };

    const handleSetGuessTyping = async (event, setUpGame) => {
        switch (event.key) {
            case "Enter":
                if (choice.length === 5) {
                    let check = await handleValidWord(getChoiceValid);
                    if (check["data"]) {
                        setUpGame();
                    };
                };
                break;
            case "Delete":
                setChoice(choice => choice.filter((_, i) => i !== choice.length - 1));
                break;
            default:
                if (choice.length < 5) {
                    setChoice(choice => [...choice, event.key]);
                };

        };
    };

    return (
        <GuessContext.Provider
            value={{
                "guessState": guessState,
                "handleTyping": handleTyping,
                "handleSetGuessTyping": handleSetGuessTyping,
                "previousGuesses": previousGuesses,
                "setPreviousGuesses": setPreviousGuesses,
                "answer": answer,
                "setAnswer": setAnswer,
                "setGameData": setGameData,
                "gameData": gameData,
                "success": success,
                "choice": choice,
            }}
        >
            {children}
        </GuessContext.Provider>
    );
};

export const useGuessState = () => useContext(GuessContext);