import { useState, useEffect } from 'react';
import styles from "./styles.module.css";

export const Transport = ({ }) => {

    var tr = localStorage.getItem("transportId");

    const [transport, setTransport] = useState('');

    useEffect(() => {
        GetTransport();
    }, [])

    const GetTransport = () => {
        fetch("http://localhost:8080/transport/" + tr)
            .then(res => res.json())
            .then(data => setTransport(data))
            .then(err => console.error("Error: ", err));
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div>
            <nav className={styles.navbar}>
                <h1><a href="/">Transport</a></h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            {transport.cityFrom}
        </div>
    )
}

export default Transport
