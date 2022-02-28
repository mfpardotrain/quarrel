class GameSocket {

    constructor(gameId, guestId, setAnswer) {
        this.gameId = gameId;
        this.guestId = guestId;
        this.setAnswer = setAnswer;
    }

    connect() {
        this.socket = new WebSocket("ws://18.119.105.184:8765/");
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = (event) => this.onMessage(event, this);
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
    }

    send(message) {
        this.socket.send(JSON.stringify(message))
    }

    playerOneConnect(guestId, answer) {
        let message = {
            method: "player_1_connect",
            gameId: this.gameId,
            guestId: guestId,
            answer: answer
        }
        this.socket.send(JSON.stringify(message))
    }

    playerTwoConnect(guestId, answer) {
        let message = {
            method: "player_2_connect",
            gameId: this.gameId,
            guestId: guestId,
            answer: answer
        }
        this.socket.send(JSON.stringify(message))
    }

    sendClose() {
        let message = {
            method: "kill",
        }
        this.socket.send(JSON.stringify(message))
    }

    onOpen() {
        console.log("connected!");
    }

    onMessage(event, thisCopy) {
        let data = JSON.parse(event.data);
        if (data["guest_id"] === this.guestId) {
            console.log(data.answer)
            // this.setAnswer(data.answer)
            this.answer = data.answer
        }
    }

    onError(event) {
        if (event.data === undefined) {
            return null;
        } else {
            let data = JSON.parse(event.data);
            this.error = data;
        }
    }

    onClose() {
        console.log("connection closed.")
    }

}

export default GameSocket