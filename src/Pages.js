import Keyboard from './Keyboard';
import Display from './Display';
import Game from "./Game.js";
import { useGuessState } from './GuessContext';

const Pages = () => {
    let token = window.location.href.includes("gameId=") && window.location.href.match(/gameId=.*/)[0].split("=")[1]
    let { answer } = useGuessState();

    let home = (
        <div className='home'>
            <Game urlGameId={token} />
        </div>
    )

    let play = (
        <>
            <Display />
            <Keyboard />
        </>
    )


    return (
        <>
            {!answer && home}
            {answer && play}
        </>
    );
};

export default Pages;
