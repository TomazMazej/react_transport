import { useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import Transports from "../Transports";

import styles from "./styles.module.css";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://localhost:8080";

const Main = () => {

	// Prevozi
	const [transports, setTransports] = useState([]);
	const [addTransportActive, setAddTransportActive] = useState(false);
	const [editTransportActive, setEditTransportActive] = useState(false);
	const [editedTransport, setEditedTransport] = useState("");

	const [newFrom, setNewFrom] = useState("");
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
				cityFrom: newFrom,
				dateFrom: newDate,
				cityTo: newTo,
				price: newPrice,
				numOfPeople: newPeople,
				luggage: newLuggage,
				carBrand: newCarBrand,
				carModel: newCarModel,
				carColor: newCarColor,
				registration: newRegistration,
				interStop: newStop})
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

	const editTransport = async id => {
		const data = await fetch(API_BASE + "/transport/edit/" + id, {
		  method : "PUT",
		  headers: {
			"Content-Type": "application/json"
		  },
		  body: JSON.stringify({
			cityFrom: newFrom,
			dateFrom: newDate,
			cityTo: newTo,
			price: newPrice,
			numOfPeople: newPeople,
			luggage: newLuggage,
			carBrand: newCarBrand,
			carModel: newCarModel,
			carColor: newCarColor,
			registration: newRegistration,
			interStop: newStop})
		}).then(res => res.json());
	
		setTransports(transports => transports.map(transport => {
		  if (transport._id === data._id) {
			transport.cityFrom = newFrom;
			transport.dateFrom = newDate;
			transport.cityTo = newTo;
			transport.price = newPrice;
			transport.numOfPeople = newPeople;
			transport.luggage = newLuggage;
			transport.carBrand = newCarBrand;
			transport.carModel = newCarModel;
			transport.carColor = newCarColor;
			transport.registration = newRegistration;
			transport.interStop = newStop;
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

	const deleteTransport = async id => {
		const data = await fetch("http://localhost:8080/transport/delete/" + id, {
			method: "DELETE"
		}).then(res => res.json());

		setTransports(transports => transports.filter(transport => transport._id !== data._id));
	}

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Transport</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>

			<Transports transports={transports}
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
            <div className={styles.addPopup} onClick={() => setAddTransportActive(true)}>+</div>

            {/*Dodajanje prevoza*/}
            {addTransportActive ? (
              <div className={styles.popup}>
                <div className={styles.closePopup} onClick={() => setAddTransportActive(false)}>x</div>
                <div className={styles.content}>
                	<h3>Add Transport</h3>
                	<input 
						type="text" 
						className={styles.add_todo_input} 
						onChange={e => setNewFrom(e.target.value)} 
						value={newFrom} 
						placeholder="From"/>
					<DatePicker selected={newDate} onChange={(date) => setNewDate(date)} dateFormat="dd-mmm-yyyy hh:mm"/>
					<input 
						type="text" 
						className={styles.add_todo_input} 
						onChange={e => setNewTo(e.target.value)} 
						value={newTo} 
						placeholder="To"/>
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

			{/*Urejanje prevoza*/}
            {editTransportActive ? (
                <div className={styles.popup}>
                  <div className={styles.closePopup} onClick={() => setEditTransportActive(false)}>x</div>
                  <div className={styles.content} >
                    <h3>Edit Transsport</h3>
                    <input 
						type="text" 
						className={styles.add_todo_input} 
						onChange={e => setNewFrom(e.target.value)} 
						value={newFrom} 
						placeholder="From"/>
					<DatePicker selected={newDate} onChange={(date) => setNewDate(date)} dateFormat="dd-mmm-yyyy hh:mm"/>
					<input 
						type="text" 
						className={styles.add_todo_input} 
						onChange={e => setNewTo(e.target.value)} 
						value={newTo} 
						placeholder="To"/>
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
                    <div className={styles.add_button} onClick={() => editTransport(editedTransport)}>Edit Transport</div>
                  </div>
                </div>
              ) : ''}
		</div>
	);
};

export default Main;
