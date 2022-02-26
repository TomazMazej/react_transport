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
	const [searchTransports, setSearchTransports] = useState([]);

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
	const [searchFrom, setSearchFrom] = useState("");
	const [searchTo, setSearchTo] = useState("");
	const [searchDate, setSearchDate] = useState(null);
	const [sortType, setSortType] = useState('');

	const cities = [
		{ value: 'Celje', label: 'Celje' },
		{ value: 'Maribor', label: 'Maribor' },
		{ value: 'Ljubljana', label: 'Ljubljana' },
		{ value: 'Koper', label: 'Koper' },
		{ value: 'Velenje', label: 'Velenje' },
		{ value: 'Novo mesto', label: 'Novo mesto' },
	];

	const types = [
		{ value: 'default', label: 'Default' },
		{ value: 'price', label: 'Price' },
		{ value: 'numOfPeople', label: 'Number of people' },
		{ value: 'luggage', label: 'Luggage per person' }
	];

	const email = localStorage.getItem("email");

	useEffect(() => {
		GetTransports();
	}, [])

	useEffect(() => {
		GetSearchTransports();
	}, [])

	useEffect(() => {
		const sortArray = type => {
		  if(type !== 'default'){
			const sorted = [...transports].sort((a, b) => b[type] - a[type]);
			setTransports(sorted);
		  }
		};
		sortArray(sortType.value);
	}, [sortType]);

	const GetTransports = () => {
		fetch(API_BASE + "/transports")
		  .then(res => res.json())
		  .then(data => setTransports(data))
		  .then(err => console.error("Error: ", err));
	}

	const GetSearchTransports = () => {
		fetch(API_BASE + "/transports")
		  .then(res => res.json())
		  .then(data => setSearchTransports(data))
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
				interStop: newStop.value,
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

	const search = () => {
		let resultArray;
		if(searchFrom.value !== undefined){
			resultArray = searchTransports.filter(transport => transport.cityFrom === searchFrom.value);
		}
		if(searchTo.value !== undefined){
			resultArray = searchTransports.filter(transport => transport.cityTo === searchTo.value);
		}
		if(searchDate !== null){
			resultArray = searchTransports.filter(transport => new Date(transport.dateFrom).getDay() === searchDate.getDay()).filter(transport => new Date(transport.dateFrom).getMonth() === searchDate.getMonth()).filter(transport => new Date(transport.dateFrom).getFullYear() === searchDate.getFullYear());	
		}
		setTransports(resultArray);
	};

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
			<div className={styles.content}>
				
				<h1>Search transports</h1>
				<div class={styles.card}>	
					<section className={styles.profile_info}>
						<h2>From:</h2>
						<h2>To:</h2>
						<h2>Date:</h2>
						<h2>Order By:</h2>

						<Select className={styles.add_todo_input} options={cities} defaultValue={searchFrom} onChange={setSearchFrom} value={searchFrom} placeholder="From" isSearchable/>
						<Select className={styles.add_todo_input} options={cities} defaultValue={searchTo} onChange={setSearchTo} value={searchTo} placeholder="To" isSearchable/>
						<DatePicker className={styles.add_todo_input} selected={searchDate} onChange={(date) => setSearchDate(date)} dateFormat="d MMM Y"/>
						<Select className={styles.add_todo_input} options={types} defaultValue={sortType} onChange={setSortType} value={sortType} placeholder="Order by" />
					</section>
					<button className={styles.black_btn} onClick={search}>Search</button>
				</div>

				<h1>Offered Transports</h1>
				<Transports transports={transports}/>
				<div className={styles.addPopup} onClick={() => setAddTransportActive(true)}>+</div>

				{/*Dodajanje prevoza*/}
				{addTransportActive ? (
				<div className={styles.popup}>
					<div className={styles.closePopup} onClick={() => setAddTransportActive(false)}>x</div>
					<div className={styles.content}>
						<h2>Add Transport</h2>
						<Select className={styles.add_todo_input} options={cities} defaultValue={newFrom} onChange={setNewFrom} value={newFrom} placeholder="From" isSearchable/>
						<Select className={styles.add_todo_input} options={cities} defaultValue={newTo} onChange={setNewTo} value={newTo} placeholder="To" isSearchable/>
						<DatePicker className={styles.add_todo_input} selected={newDate} onChange={(date) => setNewDate(date)} dateFormat="d MMM Y hh:mm"/>
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
					<div className={styles.add_button} onClick={addTransport}>Add Transport</div>
					</div>
				</div>
				) : ''}   
			</div>
		</div>
	);
};

export default Main;
