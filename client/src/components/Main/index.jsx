import { useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import Transports from "../Transports";
import Select from 'react-select';

import styles from "./styles.module.css";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://localhost:8080";

const Main = () => {

	// Prevozi
	const [transports, setTransports] = useState([]);
	const [addTransportActive, setAddTransportActive] = useState(false);

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

	const email = localStorage.getItem("email");

	useEffect(() => {
		GetTransports();
	  }, [])

	const GetTransports = () => {
		fetch(API_BASE + "/transports")
		  .then(res => res.json())
		  .then(data => setTransports(data))
		  .then(err => console.error("Error: ", err));
	}

	const addTransport = async () => {
		const data = await fetch("http://localhost:8080/transport/new/", {
			method: "POST",
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
				interStop: newStop,
				owner: email})
		}).then(res => res.json());

		setTransports([...transports, data]);
		setAddTransportActive(false);
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
	}

	// Nav
	const [user, setUser] = useState("");

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
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1><a href="/">Transport</a></h1>
				<h1><a href="/profile">{user.firstName}</a></h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>

            <h1>Offered Transports</h1>
			<Transports transports={transports}/>
            <div className={styles.addPopup} onClick={() => setAddTransportActive(true)}>+</div>

            {/*Dodajanje prevoza*/}
            {addTransportActive ? (
              <div className={styles.popup}>
                <div className={styles.closePopup} onClick={() => setAddTransportActive(false)}>x</div>
                <div className={styles.content}>
                	<h3>Add Transport</h3>
					<Select className={styles.add_todo_input} options={cities} defaultValue={newFrom} onChange={setNewFrom} value={newFrom} placeholder="From" isSearchable/>
					<Select className={styles.add_todo_input} options={cities} defaultValue={newTo} onChange={setNewTo} value={newTo} placeholder="To" isSearchable/>
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
					<input 
						type="text" 
						className={styles.add_todo_input} 
						onChange={e => setNewStop(e.target.value)} 
						value={newStop} 
						placeholder="Inner stops"/>

                  <div className={styles.add_button} onClick={addTransport}>Add Transport</div>
                  </div>
              </div>
            ) : ''}   

		</div>
	);
};

export default Main;
