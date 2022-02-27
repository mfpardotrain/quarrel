import { useState, useEffect } from 'react';
import { DefaultCallbackPostRequest, DefaultCallbackGetRequest } from "./ApiUtils";
import GameSocket from './GameSocket';
import { v4 as uuidv4 } from 'uuid';
import "./styles/Game.css"
import { useGuessState } from './GuessContext';
import { CopyClipboard } from './CopyClipboard';

const Game = (props) => {
    let { urlGameId } = props;
    let guestId = !!localStorage.getItem("guest_id") ? localStorage.getItem("guest_id") : localStorage.setItem("guest_id", uuidv4());
    let { setAnswer, answer, setValidWords } = useGuessState();
    let [choices, setChoices] = useState(false);
    let [success, setSuccess] = useState(false);
    let [copySuccess, setCopySuccess] = useState(false);
    let [connectUrl, setConnectUrl] = useState(false);
    const startWebsocket = DefaultCallbackGetRequest("startWebsocket/", "", setChoices);
    let [gameId, setGameId] = useState(urlGameId ? urlGameId : uuidv4());
    let [gameSocket, setGameSocket] = useState(new GameSocket(gameId, guestId, setAnswer))

    useEffect(() => {
        setAnswer(gameSocket.answer)
    })

    useEffect(() => {
        startWebsocket()
        gameSocket.connect()
    }, [])

    let bodyData = {
        "guestId": guestId,
        "answer": answer,
        "gameId": gameId
    };

    const getWords = DefaultCallbackGetRequest("getWords/", "", setChoices);
    const createGame = DefaultCallbackPostRequest('normalGame/', bodyData);

    let choicesDisplay = choices.data && (
        choices.data.map(word =>
            <div
                className="word-choice"
                key={word}
                onClick={() => {
                    createGame(setSuccess, { "answer": word });
                    if (!urlGameId) {
                        gameSocket.playerOneConnect(guestId, word);
                        setConnectUrl("http://localhost:3000/?gameId=" + gameId);
                    } else {
                        gameSocket.playerTwoConnect(guestId, word);
                    }
                }}
            >
                {word}
            </div>)
    );
    
    const setCopy = (el) => {
        let copyStatusEl = document.getElementById("copy-status") 
        let urlBox = document.getElementById("connect-url")
        setCopySuccess(el)
        copyStatusEl.classList.add("fade-out")
        urlBox.classList.add("fade-background")
        var listener = copyStatusEl.addEventListener('animationend', function() {
            copyStatusEl.classList.remove("fade-out");
            copyStatusEl.removeEventListener('animationend', listener);
        })
        var listener2 = urlBox.addEventListener('animationend', function() {
            urlBox.classList.remove("fade-background");
            urlBox.removeEventListener('animationend', listener2);
        })
    }

    return (
        <div className="create-game-container">
            {connectUrl &&
                <>
                    <div className='connect-url' id='connect-url' onClick={(el) => CopyClipboard(el, setCopy)}>
                        {connectUrl}
                    </div>
                    <div className='copy-status' id='copy-status'>
                        {copySuccess}
                    </div>
                </>
            }
            {!connectUrl && !urlGameId &&
                <>
                    {!!!choices.data && <button className="create-game-button" onClick={() => getWords()}>Play with a friend</button>}
                    {choices.data &&
                        <div className="choices-container">
                            {choicesDisplay}
                        </div>
                    }
                </>
            }
            {urlGameId &&
                <>
                    {!!!choices.data && <button className="create-game-button" onClick={() => getWords()}>Get words</button>}
                    {choices.data &&
                        <div className="choices-container">
                            {choicesDisplay}
                        </div>
                    }
                </>
            }
        </div>
    );
};

export default Game;