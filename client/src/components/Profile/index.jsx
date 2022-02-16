import { useState, useEffect } from 'react';
import Transports from "../Transports";
import DatePicker from "react-datepicker";
import Select from 'react-select';

import styles from "./styles.module.css";

export const Profile = ({ }) => {

    var email = localStorage.getItem("email");

    const [user, setUser] = useState('');
    const [myTransports, setMyTransports] = useState([]);

	const [editTransportActive, setEditTransportActive] = useState(false);
	const [editedTransport, setEditedTransport] = useState("");

	const [newFrom, setNewFrom] = useState(null);
	const [newTo, setNewTo] = useState("");
	const [newDate, setNewDate] = useState(new Date());
	const [newPrice, setNewPrice] = useState("");
	const [newPeople, setNewPeople] = useState("");
	const [newLuggage, setNewLuggage] = useState("");
	const [newCarBrand, setNewCarBrand] = useState("");
	const [newCarModel, setNewCarModel] = useState("");
	const [newCarColor, setNewCarColor] = useState("");
	const [newRegistration, setNewRegistration] = useState("");
	const [newStop, setNewStop] = useState("");

    const cities = [
		{ value: 'Celje', label: 'Celje' },
		{ value: 'Maribor', label: 'Maribor' },
		{ value: 'Ljubljana', label: 'Ljubljana' },
		{ value: 'Koper', label: 'Koper' },
		{ value: 'Velenje', label: 'Velenje' },
		{ value: 'Novo mesto', label: 'Novo mesto' },
	];

    useEffect(() => {
		GetMyTransports();
	}, [])

	const GetMyTransports = () => {
		fetch("http://localhost:8080/userTransports/" + email)
		  .then(res => res.json())
		  .then(data => setMyTransports(data))
		  .then(err => console.error("Error: ", err));
	}

    useEffect(() => {
        GetUser();
    }, [])

    const GetUser = () => {
        fetch("http://localhost:8080/users/" + email)
            .then(res => res.json())
            .then(data => setUser(data))
            .then(err => console.error("Error: ", err));
    }

    const deleteTransport = async id => {
		const data = await fetch("http://localhost:8080/transport/delete/" + id, {
			method: "DELETE"
		}).then(res => res.json());

		setMyTransports(myTransports => myTransports.filter(transport => transport._id !== data._id));
	}

    const editTransport = async id => {
		const data = await fetch("http://localhost:8080/transport/edit/" + id, {
		  method : "PUT",
		  headers: {
			"Content-Type": "application/json"
		  },
		  body: JSON.stringify({
			cityFrom: newFrom.value,
			dateFrom: newDate,
			cityTo: newTo.value,
			price: newPrice,
			numOfPeople: newPeople,
			luggage: newLuggage,
			carBrand: newCarBrand,
			carModel: newCarModel,
			carColor: newCarColor,
			registration: newRegistration,
			interStop: newStop})
		}).then(res => res.json());
	
		setMyTransports(transports => transports.map(transport => {
		  if (transport._id === data._id) {
			transport.cityFrom = newFrom.value;
			transport.dateFrom = newDate;
			transport.cityTo = newTo.value;
			transport.price = newPrice;
			transport.numOfPeople = newPeople;
			transport.luggage = newLuggage;
			transport.carBrand = newCarBrand;
			transport.carModel = newCarModel;
			transport.carColor = newCarColor;
			transport.registration = newRegistration;
			transport.interStop = newStop.value;
		  }
	
		setEditTransportActive(false);
		setNewFrom("");
		setNewTo("");
		setNewDate("");
		setNewPrice("");
		setNewPeople("");
		setNewLuggage("");
		setNewCarBrand("");
		setNewCarModel("");
		setNewCarColor("");
		setNewRegistration("");
		setNewStop("");
	
		return transport;
		}))
	}

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleOfferTransports = () => {
        fetch("http://localhost:8080/checkOfferTransport/" + email).then(res => res.json());
        window.location.reload(false);
    };

    const handleSearchTransports = () => {
        fetch("http://localhost:8080/checkSearchTransport/" + email).then(res => res.json());
        window.location.reload(false);
    };

    return (
        <div>
            <nav className={styles.navbar}>
                <h1><a href="/">Transport</a></h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
			<div className={styles.content}>
				<div className={styles.profile_logo_container}>
					<div className={styles.profile_logo}>
						{user && user.firstName && (
							<div className={styles.profile_logo_text}>{user.firstName[0].concat(user.lastName[0])}</div>
						)}
					</div>
				</div>
				<section className={styles.profile_info}>
					<h2>Full name</h2>
					<h2>Rating</h2>
					<h2>Offer transports</h2>
					<h2>Search transports</h2>

					<p>{user.firstName} {user.lastName}</p>
					<p>{user.rating / user.numOfRatings}</p>
					<p><input type="checkbox" checked={user.offerTransport} onChange={handleOfferTransports}/></p>
					<p><input type="checkbox" checked={user.searchTransport} onChange={handleSearchTransports}/></p>
				</section>

				<h1>My Transports</h1>
				<Transports transports={myTransports}
					onDelete={deleteTransport}
					onEdit={setEditTransportActive}
					editedTransport={setEditedTransport}
					newFrom={setNewFrom}
					newDate={setNewDate}
					newTo={setNewTo}
					newPrice={setNewPrice}
					newPeople={setNewPeople}
					newLuggage={setNewLuggage}
					newCarBrand={setNewCarBrand}
					newCarModel={setNewCarModel}
					newCarColor={setNewCarColor}
					newRegistration={setNewRegistration}
					newStop={setNewStop}/>

				{/*Urejanje prevoza*/}
				{editTransportActive ? (
					<div className={styles.popup}>
					<div className={styles.closePopup} onClick={() => setEditTransportActive(false)}>x</div>
					<div className={styles.content} >
						<h3>Edit Transsport</h3>
						<Select className={styles.add_todo_input} options={cities} defaultValue={newFrom} onChange={setNewFrom} value={newFrom} placeholder="From"/>
						<Select className={styles.add_todo_input} options={cities} defaultValue={newTo} onChange={setNewTo} value={newTo} placeholder="To"/>
						<DatePicker className={styles.add_todo_input} selected={newDate} onChange={(date) => setNewDate(date)} dateFormat="dd-mmm-yyyy hh:mm"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewPrice(e.target.value)} 
							value={newPrice} 
							placeholder="Price"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewPeople(e.target.value)} 
							value={newPeople} 
							placeholder="Number of people"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewLuggage(e.target.value)} 
							value={newLuggage} 
							placeholder="Luggage per person"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewCarBrand(e.target.value)} 
							value={newCarBrand} 
							placeholder="Car brand"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewCarModel(e.target.value)} 
							value={newCarModel} 
							placeholder="Car model"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewCarColor(e.target.value)} 
							value={newCarColor} 
							placeholder="Car color"/>
						<input 
							type="text" 
							className={styles.add_todo_input} 
							onChange={e => setNewRegistration(e.target.value)} 
							value={newRegistration} 
							placeholder="Registration"/>
						<Select className={styles.add_todo_input} options={cities} defaultValue={newStop} onChange={setNewStop} value={newStop} placeholder="Inner stops" isSearchable/>
						<div className={styles.add_button} onClick={() => editTransport(editedTransport)}>Edit Transport</div>
					</div>
					</div>
				) : ''}
			</div>
        </div>
    )
}

export default Profile
