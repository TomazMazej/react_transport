import { useState, useEffect } from 'react';
import Moment from 'moment';

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

    // Nav
	const [user, setUser] = useState("");
	const email = localStorage.getItem("email");

	useEffect(() => {
		GetUser();
	}, [])

	const GetUser = () => {
		fetch("http://localhost:8080/users/" + email)
			.then(res => res.json())
			.then(data => setUser(data))
			.then(err => console.error("Error: ", err));
	}

	localStorage.setItem("username", user.firstName);
	localStorage.setItem("usr", user);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div>
            <nav className={styles.navbar}>
				<h1><a href="/">Transport</a></h1>
				<h1><a href="/profile">{user.firstName}</a></h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
            <table>
                <header><h1>{transport.cityFrom} - {transport.cityTo}</h1></header>
                <tr>
                    <td>
                        <b>Time: </b>
                    </td>
                    <td>
                        <p>{Moment(transport.dateFrom).format('d MMM Y hh:mm')}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Number of people: </b>
                    </td>
                    <td>
                        <p>{transport.numOfPeople}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Luggage per person: </b>
                    </td>
                    <td>
                        <p>{transport.luggage}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Car: </b>
                    </td>
                    <td>
                        <p>{transport.carColor} {transport.carBrand} {transport.carModel}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Registration: </b>
                    </td>
                    <td>
                        <p>{transport.registration}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Inter stops:</b>
                    </td>
                    <td>
                        <p>{transport.interStop}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                    <b>Price: </b>
                    </td>
                    <td>
                    <p>{transport.price}$</p>
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default Transport
