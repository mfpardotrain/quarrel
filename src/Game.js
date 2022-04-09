import { useState, useEffect } from 'react';
import { DefaultCallbackPostRequest, DefaultCallbackGetRequest } from "./ApiUtils";
import "./styles/Game.css"
import { useGuessState } from './GuessContext';
import { CopyClipboard } from './CopyClipboard';
import { v4 as uuidv4 } from 'uuid';
import Keyboard from './Keyboard';

const Game = (props) => {
    let { urlGameId, gameSocket, setUpGame, connectUrl } = props;
    let { setAnswer, answer, choice } = useGuessState();
    let [choices, setChoices] = useState(false);
    let [copySuccess, setCopySuccess] = useState(false);
    const startWebsocket = DefaultCallbackGetRequest("startWebsocket/", "", setChoices);

    useEffect(async () => {
        if (!!!gameSocket.socket) {
            await startWebsocket()
            gameSocket.connect()
        }
        if (answer.length === 0) {
            setTimeout(() => {
                if (gameSocket.socket.readyState === 1) {
                    gameSocket.getGamestate()
                }
            }, 100)
        }
        if (gameSocket.socket.readyState > 1) {
            setAnswer([]);
        }
        if (gameSocket.socket.readyState === 1) {
            console.log(gameSocket.answer)
            setAnswer(gameSocket.answer)
        }
    })

    const handleCreateGameButton = () => {
        setChoices(true)
        let gid = uuidv4();
        localStorage.setItem("game_id", gid);
    }

    let makeBoxes = (array) => {
        return (
            [...Array(5).keys()].map(el => {
                return (
                    <div className={"display-letter"} key={el}>
                        {array[el] && array[el].toUpperCase()}
                    </div>
                );
            })
        );
    };

    const setCopy = (el) => {
        let copyStatusEl = document.getElementById("copy-status")
        let urlBox = document.getElementById("connect-url")
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
                    {choices !== true && <button className="create-game-button" onClick={() => handleCreateGameButton()}>Play with a friend</button>}
                    {choices === true &&
                        <>
                            <div className='choice-prompt'>Choose their word</div>
                            <div className="display-row" id='current-guess'>
                                {makeBoxes(choice)}
                            </div>
                            <Keyboard setUpGame={setUpGame} />
                        </>
                    }
                </>
            }
            {urlGameId &&
                <>
                    <div className='choice-prompt'>Choose their word</div>
                    <div className="display-row" id='current-guess'>
                        {makeBoxes(choice)}
                    </div>
                    <Keyboard setUpGame={setUpGame} />
                </>
            }
        </div>
    );
};

export default Game;