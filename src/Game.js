import { useState, useEffect } from 'react';
import { DefaultCallbackPostRequest, DefaultCallbackGetRequest } from "./ApiUtils";
import "./styles/Game.css"
import { useGuessState } from './GuessContext';
import { CopyClipboard } from './CopyClipboard';

const Game = (props) => {
    let { urlGameId, gameSocket, gameId, guestId } = props;
    let { setAnswer, answer } = useGuessState();
    let [choices, setChoices] = useState(false);
    let [success, setSuccess] = useState(false);
    let [copySuccess, setCopySuccess] = useState(false);
    let [connectUrl, setConnectUrl] = useState(false);
    const startWebsocket = DefaultCallbackGetRequest("startWebsocket/", "", setChoices);

    useEffect(async () => {
        if (!!!gameSocket.socket) {
            await startWebsocket()
            gameSocket.connect()
        }
        if (!answer) {
            setTimeout(() => {
                if (gameSocket.socket.readyState === 1) {
                    gameSocket.getGamestate()
                }
            }, 50)
        }
        if (gameSocket.socket.readyState > 1) {
            setAnswer(false)
        }
        if (gameSocket.socket.readyState === 1) {
            setAnswer(gameSocket.answer)
        }
    })

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
                    let answer = Array.from(word)
                    createGame(setSuccess, { "answer": answer });
                    if (!urlGameId) {
                        gameSocket.playerOneConnect(guestId, gameId, answer);
                        setConnectUrl(process.env.REACT_APP_CLIENT_URL + "gameId=" + gameId);
                    } else {
                        gameSocket.playerTwoConnect(guestId, gameId, answer);
                    }
                }}
            >
                {word}
            </div>)
    );

    const setCopy = (el) => {
        let copyStatusEl = document.getElementById("copy-status")
        let urlBox = document.getElementById("connect-url")
        console.log("in set copy")
        setCopySuccess(el)
        copyStatusEl.classList.add("fade-out")
        urlBox.classList.add("fade-background")
        var listener = copyStatusEl.addEventListener('animationend', function () {
            copyStatusEl.classList.remove("fade-out");
            copyStatusEl.removeEventListener('animationend', listener);
        })
        var listener2 = urlBox.addEventListener('animationend', function () {
            urlBox.classList.remove("fade-background");
            urlBox.removeEventListener('animationend', listener2);
        })
    }

    return (
        <div className="create-game-container">
            {connectUrl &&
                <>
                    <div className='choice-prompt'>Send this link to your friend and wait for them to choose!</div>
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
                        <>
                            <div className='choice-prompt'>Choose their word</div>
                            <div className="choices-container">
                                {choicesDisplay}
                            </div>
                        </>
                    }
                </>
            }
            {urlGameId &&
                <>
                    {!!!choices.data && <button className="create-game-button" onClick={() => getWords()}>Get words</button>}
                    {choices.data &&
                        <>
                            <div className='choice-prompt'>Choose their word</div>
                            <div className="choices-container">
                                {choicesDisplay}
                            </div>
                        </>
                    }
                </>
            }
        </div>
    );
};

export default Game;