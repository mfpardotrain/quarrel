class GameSocket {

    constructor(guestId, setAnswer, admin = false) {
        this.guestId = admin ? "admin" : guestId;
        this.setAnswer = setAnswer;
        this.answer = [];
        this.admin = null;
    };

    connect() {
        this.socket = new WebSocket("wss://api.playquarrel.com/ws/");
        // this.socket = new WebSocket("ws://localhost:8765/");
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = (event) => this.onMessage(event, this);
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
    };

    send(message) {
        this.socket.send(JSON.stringify(message));
    };

    getGamestate() {
        let message = {
            method: "get_gamestate",
            guestId: this.guestId
        };
        this.socket.send(JSON.stringify(message));
    };

    playerOneConnect(guestId, gameId, answer) {
        let message = {
            method: "player_1_connect",
            gameId: gameId,
            guestId: guestId,
            answer: answer
        };
        this.socket.send(JSON.stringify(message));
    };

    playerTwoConnect(guestId, gameId, answer) {
        let message = {
            method: "player_2_connect",
            gameId: gameId,
            guestId: guestId,
            answer: answer
        };
        this.socket.send(JSON.stringify(message));
    };

    sendClose(gameId) {
        let message = {
            method: "kill",
            guestId: this.guestId,
            gameId: gameId,
        };
        this.answer = [];
        this.socket.send(JSON.stringify(message));
    };

    onOpen() {
        console.log("connected!");
    };

    onMessage(event) {
        let data = JSON.parse(event.data);
        if (data["guest_id"] === this.guestId) {
            this.setAnswer(data.answer);
            this.answer = data.answer;
            console.log("answer", this.answer);
        };
        if (data["allGames"] === true) {
            this.setAnswer(data.data);
        };
    };

    onError(event) {
        if (event.data === undefined) {
            return null;
        } else {
            let data = JSON.parse(event.data);
            this.error = data;
        };
    };

    onClose() {
        console.log("connection closed.");
    };

    getAllGames() {
        this.socket.send(JSON.stringify({ method: "get_all_games" }));
    };

}

export default GameSocket