import './styles/ScreenKey.css';
import { useGuessState } from './GuessContext';
import { useEffect } from 'react';
import { CheckGuess } from './CheckWords';

const ScreenKey = (props) => {
    let { handleTyping, previousGuesses, answer } = useGuessState();
    let { letter } = props;

    let findAllIndexes = (array, letter) => {
        return array.reduce((arr, e, i) => {
            if (e == letter) arr.push(i);
            return arr;
        }, []);
    }

    let checkColors = (array, endCond="darkgrey") => {
        if (array.some(el => el === "green")) {
            return "green";
        };
        if (array.some(el => el === "yellow")) {
            return "yellow";
        };
        return endCond;

    };

    let checkKey = () => {
        let test = previousGuesses.map(array => {
            console.log(letter)
            if (array.includes(letter)) {
                let pos = findAllIndexes(array, letter);
                let colors = pos.map(i => CheckGuess(letter, i, answer));
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
        handleTyping(event)
    };

    let fakeEvent = {
        "key": letter
    }

    return (
        <div className={"letter-container " + checkKey()}
            onClick={() => handleCLick(fakeEvent)}>
            {letter.toUpperCase()}
        </div>
    )

};

export default ScreenKey;