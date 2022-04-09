import "./styles/Display.css"
import { useGuessState } from "./GuessContext";
import { CheckGuess } from "./CheckWords";
import { useEffect, useState } from "react";
import { DefaultCallbackPostRequest } from "./ApiUtils";


const Display = () => {
    let { guessState, previousGuesses, answer, gameData, setPreviousGuesses, isValid } = useGuessState();

    let body = {
        gameId: gameData["gameId"],
        guestId: gameData["guestId"]
    }
    const getPreviousGameData = DefaultCallbackPostRequest("getPreviousGameData/", body, "");

    useEffect(() => {
        getPreviousGameData(setPreviousGuesses)
    }, []);

    const addDelay = (el, rowNum) => {
        let delay = 300;
        var guessEl = document.getElementById("letter" + rowNum + el);
        guessEl.style.animationDelay = `${delay * el}ms`;

        var guessOuter = document.getElementById("letter-outer" + rowNum + el);
        guessOuter.style.animationDelay = `${delay * el}ms`;
    };

    let makeBoxes = (array, rowNum, check = false) => {
        return (
            [...Array(5).keys()].map(el => {
                array[el] && check && addDelay(el, rowNum)
                let color = array[el] && check ? CheckGuess(array[el], el, answer, array) + " flip" : "";
                let flip = array[el] && check ? "flip" : "";
                return (
                    <div className={"letter-outer " + flip} id={"letter-outer" + rowNum + el} key={"lo" + el}>
                        <div className={"display-letter " + color} key={el} id={"letter" + rowNum + el}>
                            {array[el] && array[el].toUpperCase()}
                        </div>
                    </div>
                );
            })
        );
    };

    let boxes = (
        [...Array(6).keys()].map(el => {
            return (
                <div className={"display-row"} id={el === previousGuesses.length ? "current-guess" : ""} key={"row" + el}>
                    {previousGuesses[el] && makeBoxes(previousGuesses[el], el, true)}
                    {el === previousGuesses.length && guessState && makeBoxes(guessState, el)}
                    {el > previousGuesses.length && makeBoxes(["", "", "", "", ""], el)}
                </div>
            );
        })
    );

    return (
        <div className="display-container">
            {boxes}
        </div>
    );

};

export default Display;