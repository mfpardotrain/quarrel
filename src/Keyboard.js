import './styles/Keyboard.css';
import ScreenKey from './ScreenKey';

const Keyboard = (props) => {

    let topLetters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]
    let middleLetters = ["a", "s", "d", "f", "g", "h", "j", "k", "l"]
    let bottomLetters = ["Enter", "z", "x", "c", "v", "b", "n", "m", "Delete"]

    let row = (letters) => {
        let screenKeys = letters.map(letter => {
            return <ScreenKey letter={letter} setUpGame={props.setUpGame} key={letter} />
        })
        return screenKeys;
    };

    const topRow = row(topLetters);
    const middleRow = row(middleLetters);
    const bottomRow = row(bottomLetters);

    return (
        <div className="keyboard-container">
            <div className="keyboard-row">{topRow}</div>
            <div className="keyboard-row">{middleRow}</div>
            <div className="keyboard-row">{bottomRow}</div>
        </div>
    );
};

export default Keyboard;