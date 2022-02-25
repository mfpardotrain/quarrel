export const CheckGuess = (letter, pos, answer) => {
    if (answer.includes(letter)) {
        if (answer.indexOf(letter) === pos) {
            return "green"
        }
        return "yellow"
    }
    else {
        return "darkgrey"
    }
};
