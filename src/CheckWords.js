export const CheckGuess = (letter, pos, answer, guess) => {
    if (answer.includes(letter)) {
        let indexOfAllAnswer = indexOfAll(answer, letter)
        let indexOfAllGuess = indexOfAll(guess, letter)
        if (indexOfAllAnswer.includes(pos)) {
            return "green"
        }
        if (indexOfAllGuess.length === indexOfAllAnswer.length || (pos + 1) <= indexOfAllAnswer.length) {
            return "yellow"
        }
        else {
            return "darkgrey"
        }
    }
    else {
        return "darkgrey"
    }
};

const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);
