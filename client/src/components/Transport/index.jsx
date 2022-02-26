import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment';
import Select from 'react-select';

import styles from "./styles.module.css";
import 'font-awesome/css/font-awesome.min.css';

export const Transport = ({}) => {

    const [transport, setTransport] = useState('');
    const [reservations, setReservations] = useState([]);
    const [reservation, setReservation] = useState("");
    const [user, setUser] = useState("");
    const [rateDialogActive, setRateDialogActive] = useState(false);
    const [ratedPassenger, setRatedPassenger] = useState("");
    const [rating, setRating] = useState("");

	const email = localStorage.getItem("email");
    const tr = localStorage.getItem("transportId");
    localStorage.setItem("username", user.firstName);
	localStorage.setItem("usr", user);

    const ratings = [
		{ value: 1, label: '1' },
		{ value: 2, label: '2' },
		{ value: 3, label: '3' },
		{ value: 4, label: '4' },
		{ value: 5, label: '5' }
	];

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
        fetch("http://localhost:8080/reservation/new/", {
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
        fetch("http://localhost:8080/reservationAccept/" + tr + "/" + e).then(res => res.json());
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
        fetch("http://localhost:8080/pickUp/" + id).then(res => res.json());
        window.location.reload(false);
    };

    const openRateDialog = (e) => {
        setRateDialogActive(true);
        setRatedPassenger(e);
    };

    const rate = () => {
        fetch("http://localhost:8080/rating/" + ratedPassenger + "/" + rating.value).then(res => res.json());
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
            <div className={styles.content}>
                <h1>{transport.cityFrom} - {transport.cityTo}</h1>
                <div className={styles.card}>
                    <table> 
                        <tr>
                            <td><b>Time: </b></td>
                            <td><p>{Moment(transport.dateFrom).format("DD/MM/YYYY HH:MM")}</p></td>
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
                </div>
                {user.email !== transport.owner ? (
                    <div>
                        {reservation !== null && reservation.status !== "cancled" ? (
                            <div>
                                {reservation.status === "accepted" ? (
                                    <div>
                                        <button className={styles.red_btn} onClick={() => cancleReservation(reservation._id, email)}>Cancle Reservation</button>
                                        <FontAwesomeIcon icon={faStar} size="lg" color="yellow" onClick={() => openRateDialog(transport.owner)}/>
                                    </div>
                                ) :
                                    <b>Reservation request pending</b>
                                }
                            </div>
                        ) :
                            <button className={styles.green_btn} onClick={handleReservation}>Reservation</button>  
                        }
                    </div>
                ) : 
                    <div>
                        <h2>Reservations</h2>
                        {reservations.length > 0 ? (
                            <div>
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
                                        <div>
                                            <input type="checkbox" checked={r.pickup} onChange={() => pickUp(r._id)}/>
                                            <FontAwesomeIcon icon={faStar} size="lg" color="yellow" onClick={() => openRateDialog(r.email)}/>
                                        </div>
                                        }
                                    </div>
                                </div>
                                ))}
                            </div>
                        ) :
                            <b>There are currently no reservations.</b>
                        }
                    </div>
                }
            </div>
            	{/*Ocenjevanje prevoza*/}
				{rateDialogActive ? (
					<div className={styles.popup}>
                        <div className={styles.closePopup} onClick={() => setRateDialogActive(false)}>x</div>
                        <div className={styles.content} >
                            <h2>Rate transport provider</h2>
                            <Select className={styles.add_todo_input} options={ratings} defaultValue={rating} onChange={setRating} value={rating} placeholder="Rating"/>
                            <div className={styles.add_button} onClick={() => rate()}>Rate</div>
                        </div>
					</div>
				) : ''}
        </div>
    )
}

export default Transport
