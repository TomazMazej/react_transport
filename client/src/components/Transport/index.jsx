import { useState, useEffect } from 'react';
import Moment from 'moment';

import styles from "./styles.module.css";

export const Transport = ({}) => {

    const [transport, setTransport] = useState('');
    const [reservations, setReservations] = useState([]);
    const [reservation, setReservation] = useState("");
    const [user, setUser] = useState("");

	const email = localStorage.getItem("email");
    const tr = localStorage.getItem("transportId");
    localStorage.setItem("username", user.firstName);
	localStorage.setItem("usr", user);

    useEffect(() => {
		GetReservations();
	}, [])

    useEffect(() => {
        GetReservation();
	}, [])

    useEffect(() => {
        GetTransport();
    }, [])

    useEffect(() => {
		GetUser();
	}, [])

	const GetReservations = () => {
		fetch("http://localhost:8080/reservations/" + tr)
		  .then(res => res.json())
		  .then(data => setReservations(data))
		  .then(err => console.error("Error: ", err));
	}

    const GetReservation = () => {
		fetch("http://localhost:8080/reservation/" + tr + "/" + email)
		  .then(res => res.json())
		  .then(data => setReservation(data))
		  .then(err => console.error("Error: ", err));
	}
    
    const GetTransport = () => {
        fetch("http://localhost:8080/transport/" + tr)
            .then(res => res.json())
            .then(data => setTransport(data))
            .then(err => console.error("Error: ", err));
    }

	const GetUser = () => {
		fetch("http://localhost:8080/users/" + email)
			.then(res => res.json())
			.then(data => setUser(data))
			.then(err => console.error("Error: ", err));
	}

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleReservation = () => {
        const data = fetch("http://localhost:8080/reservation/new/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				transportId: tr,
				name: user.firstName,
                email: email})
		}).then(res => res.json());
        window.location.reload(false);
    };

    const acceptReservation = (id, e) => {
        const data = fetch("http://localhost:8080/reservationAccept/" + tr + "/" + e).then(res => res.json());
        window.location.reload(false);
    };

    const declineReservation = (id) => {
        deleteReservation(id);
        window.location.reload(false);
    };

    const cancleReservation = (id, e) => {
        fetch("http://localhost:8080/reservationCancle/" + tr + "/" + e).then(res => res.json());
        fetch("http://localhost:8080/notification/" + tr).then(res => res.json());
        deleteReservation(id);
        window.location.reload(false);
    };

    const deleteReservation = (id) => {
		const data = fetch("http://localhost:8080/reservation/delete/" + id, {
			method: "DELETE"
		}).then(res => res.json());

		setReservations(reservations => reservations.filter(reservation => reservation._id !== data._id));
	}

    const pickUp = (id) => {
        const data = fetch("http://localhost:8080/pickUp/" + id).then(res => res.json());
        window.location.reload(false);
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
                    <td><b>Time: </b></td>
                    <td><p>{Moment(transport.dateFrom).format('d MMM Y hh:mm')}</p></td>
                </tr>
                <tr>
                    <td><b>Number of people: </b></td>
                    <td><p>{transport.numOfPeople}</p></td>
                </tr>
                <tr>
                    <td><b>Luggage per person: </b></td>
                    <td><p>{transport.luggage}</p></td>
                </tr>
                <tr>
                    <td><b>Car: </b></td>
                    <td><p>{transport.carColor} {transport.carBrand} {transport.carModel}</p></td>
                </tr>
                <tr>
                    <td><b>Registration: </b></td>
                    <td><p>{transport.registration}</p></td>
                </tr>
                <tr>
                    <td><b>Inter stops:</b></td>
                    <td><p>{transport.interStop}</p></td>
                </tr>
                <tr>
                    <td><b>Price: </b></td>
                    <td><p>{transport.price}$</p></td>
                </tr>
            </table>
            {user.email !== transport.owner ? (
                <div>
                    {reservation !== null && reservation.status !== "cancled" ? (
                        <div>
                            {reservation.status === "accepted" ? (
                                <button className={styles.red_btn} onClick={() => cancleReservation(reservation._id, email)}>Cancle Reservation</button>
                            ) :
                                <p>Reservation request pending</p>
                            }
                        </div>
                    ) :
                        <button className={styles.green_btn} onClick={handleReservation}>Reservation</button>  
                    }
                </div>
            ) : 
                <div>
                    <h2>Reservations</h2>
                    {reservations.map(r => (
                    <div key={r._id}>
                        <div className={styles.todo} value={r._id} >
                            <div className={styles.text}>{r.name} </div>
                            {r.status === "pending" ? (
                                <div>
                                    <button className={styles.accept_btn} onClick={() => acceptReservation(r._id, r.email)}>Accept</button>
                                    <button className={styles.decline_btn} onClick={() => declineReservation(r._id)}>Decline</button>
                            </div>
                            ) : 
                            <input type="checkbox" checked={r.pickup} onChange={() => pickUp(r._id)}/>
                            }
                        </div>
                    </div>
                ))}
                </div>
            }
        </div>
    )
}

export default Transport
