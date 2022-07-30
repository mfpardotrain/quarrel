import GameSocket from './GameSocket';
import { useEffect, useState } from 'react';
import "./styles/Pages.css";
import "./styles/Admin.css";
import { DefaultCallbackGetRequest } from "./ApiUtils";

const Admin = () => {
    let [data, setData] = useState("");
    let setGames = (data) => {
        console.log("set games", data)
        return (
            data &&
            Object.keys(data).map(el => {
                return (
                    <tr>
                        <td>{data[el].gameId}</td>
                        <td>{data[el].guestId}</td>
                        <td>{data[el].method}</td>
                        <td>{data[el].answer}</td>
                        <td><button className="del-button" onClick={() => gameSocket.sendClose(data[el].gameId)}>X</button></td>
                    </tr>
                )
            })
        )
    };

    let [gameSocket, setGameSocket] = useState(new GameSocket(false, setData));
    const startWebsocket = DefaultCallbackGetRequest("startWebsocket/", "", setData);

    useEffect(async () => {
        if (!!!gameSocket.socket) {
            await startWebsocket()
            gameSocket.connect()
        }
        if (data.length === 0) {
            setTimeout(() => {
                if (gameSocket.socket.readyState === 1) {
                    gameSocket.getGamestate()
                }
            }, 100)
        }
    })

    return (
        <>
            <button onClick={async () => await gameSocket.getAllGames()}>Get Games</button>
            <table>
                <th>Game ID</th>
                <th>Guest ID</th>
                <th>Player</th>
                <th>Answer</th>
                <th>Delete Game</th>
                {setGames(data)}
            </table>
        </>
    );
};

export default Admin;
