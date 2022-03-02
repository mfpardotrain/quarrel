import Keyboard from './Keyboard';
import Display from './Display';
import Game from "./Game.js";
import { useGuessState } from './GuessContext';
import GameSocket from './GameSocket';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import "./styles/Pages.css";

const Pages = () => {
    let token = window.location.href.includes("gameId=") && window.location.href.match(/gameId=.*/)[0].split("=")[1];
    let { setAnswer, answer, setGameData, guessState, success } = useGuessState();
    let guestId = !!localStorage.getItem("guest_id") ? localStorage.getItem("guest_id") : localStorage.setItem("guest_id", uuidv4());

    let initialGameId = () => {
        if (token) {
            localStorage.setItem("game_id", token)
            return token
        };
        if (!!localStorage.getItem("game_id")) {
            return localStorage.getItem("game_id")
        } else {
            let gid = uuidv4()
            localStorage.setItem("game_id", gid)
            return gid
        };
    };

    let [gameId, setGameId] = useState(initialGameId);
    let [gameSocket, setGameSocket] = useState(new GameSocket(gameId, guestId, setAnswer));

    let quit = () => {
        gameSocket.sendClose();
        setTimeout(setAnswer(false), 50)
        let gid = uuidv4()
        setGameId(gid)
        localStorage.setItem("game_id", gid)
        window.location = process.env.REACT_APP_CLIENT_URL
    };

    useEffect(() => {
        let gameData = {
            "guestId": guestId,
            "gameId": gameId,
            "answer": answer,
            "guessState": guessState
        }
        setGameData(gameData)
    }, [answer, gameId, guestId, guessState, setGameData]);

    let home = (
        <div className='home'>
            <Game gameSocket={gameSocket} urlGameId={token} gameId={gameId} guestId={guestId} />
        </div>
    );

    let play = (
        <>
            <button className='create-game-button quit-button' onClick={() => quit()}>Quit</button>
            <Display gameSocket={gameSocket} />
            <Keyboard />
        </>
    );

    let winner = (
        <div className='modal-background'>
            <div className='modal-content winner-container'>
                <span className='winner'>Winner!</span>
                <button className='create-game-button new-game-button' onClick={() => quit()}>New Game</button>
            </div>
        </div>
    );

    let loser = (
        <div className='modal-background'>
            <div className='modal-content loser-container'>
                <span className='loser'>Loser!</span>
                <button className='create-game-button new-game-button' onClick={() => quit()}>New Game</button>
            </div>
        </div>
    );

    return (
        <>
            {!answer && home}
            {answer && play}
            {success && success["data"]["message"] === "winner" && winner}
            {success && success["data"]["message"] === "loser" && loser}
        </>
    );
};

export default Pages;
