import "./styles/Display.css"
import { useGuessState } from "./GuessContext";
import { CheckGuess } from "./CheckWords";
import { useEffect, useState } from "react";
import { DefaultCallbackPostRequest } from "./ApiUtils";


const Display = () => {
    let { guessState, previousGuesses, answer, gameData, setPreviousGuesses } = useGuessState();



    let body = {
        gameId: gameData["gameId"],
        guestId: gameData["guestId"]
    }
    const getPreviousGameData = DefaultCallbackPostRequest("getPreviousGameData/", body, "");

    useEffect(() => {
        getPreviousGameData(setPreviousGuesses)
    }, [])

    let makeBoxes = (array, check = false) => {
        return (
            [...Array(5).keys()].map(el => {
                let color = array[el] && check ? CheckGuess(array[el], el, answer, array) : "";
                return (
                    <div className={"display-letter " + color} key={el}>
                        {array[el] && array[el].toUpperCase()}
                    </div>
                )
            })
        );
    };

    let boxes = (
        [...Array(6).keys()].map(el => {
            return (
                <div className="display-row" key={el}>
                    {previousGuesses[el] && makeBoxes(previousGuesses[el], true)}
                    {el === previousGuesses.length && guessState && makeBoxes(guessState)}
                    {el > previousGuesses.length && makeBoxes(["", "", "", "", ""])}
                </div>
            )
        })
    );

    return (
        <div className="display-container">
            {boxes}
        </div>
    );

};

export default Display;