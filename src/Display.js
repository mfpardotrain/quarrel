import "./styles/Display.css"
import { useGuessState } from "./GuessContext";
import { CheckGuess } from "./CheckWords";


const Display = () => {
    let { guess, previousGuesses, answer } = useGuessState();

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
                    {el === previousGuesses.length && guess && makeBoxes(guess)}
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