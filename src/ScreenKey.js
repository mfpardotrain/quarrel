import './styles/ScreenKey.css';
import { useGuessState } from './GuessContext';
import { useEffect } from 'react';
import { CheckGuess } from './CheckWords';

const ScreenKey = (props) => {
    let { handleTyping, handleSetGuessTyping, previousGuesses, answer } = useGuessState();
    let { letter, setUpGame } = props;

    let findAllIndexes = (array, letter) => {
        return array.reduce((arr, e, i) => {
            if (e === letter) arr.push(i);
            return arr;
        }, []);
    }

    let checkColors = (array, endCond = "darkgrey") => {
        if (array.some(el => el === "green")) {
            return "green";
        };
        if (array.some(el => el === "yellow")) {
            return "yellow";
        };
        if (array.some(el => el === "darkgrey")) {
            return "darkgrey"
        }
        return endCond;
    };

    let checkKey = () => {
        let test = previousGuesses.map(array => {
            if (array.includes(letter)) {
                let pos = findAllIndexes(array, letter);
                let colors = pos.map(i => CheckGuess(letter, i, answer, array));
                return checkColors(colors);
            };
            return
        })
        return checkColors(test, "");
    };

    let handlePress = (event) => {
        var key = event.key;
        if (key === letter) {
            handleCLick(event);
        };
    };

    useEffect(() => {
        window.addEventListener('keydown', handlePress, false);
        return () => {
            window.removeEventListener('keydown', handlePress, false);
        };
    });

    let handleCLick = (event) => {
        answer.length > 0 ? handleTyping(event) : handleSetGuessTyping(event, setUpGame);
    };

    let fakeEvent = {
        "key": letter
    };

    return (
        <div className={"letter-container " + checkKey()}
            onClick={() => handleCLick(fakeEvent)}>
            {letter.toUpperCase()}
        </div>
    );

};

export default ScreenKey;