import { useState } from 'react';
import { DefaultCallbackPostRequest, DefaultCallbackGetRequest } from "./ApiUtils";
import { v4 as uuidv4 } from 'uuid';
import "./styles/Game.css"

const Game = () => {
    let guestId = !!localStorage.getItem("guest_id") ? localStorage.getItem("guest_id") : localStorage.setItem("guest_id", uuidv4());
    let [choices, setChoices] = useState([]);
    let [answer, setAnswer] = useState(false);
    let [success, setSuccess] = useState(false);

    let bodyData = { "guestId": guestId, "answer": answer };
    const getWords = DefaultCallbackGetRequest("getWords/", "", setChoices);
    const createGame = DefaultCallbackPostRequest('normalGame/', bodyData);

    let choicesDisplay = choices.data && (
        choices.data.map(word =>
            <div
                className="word-choice"
                key={word}
                onClick={() => { 
                    createGame(setSuccess, {"answer": word})
                }}
            >
                {word}
            </div>)
    );

    return (
        <div className="create-game-container">
            <button className="create-game-button" onClick={() => getWords()}>Play with a friend</button>
            <div className="choices-container">
                {choicesDisplay}
            </div>
        </div>
    );
};

export default Game;