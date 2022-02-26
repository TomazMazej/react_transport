import Moment from 'moment';
import addNotification from 'react-push-notification';

import styles from "./styles.module.css";

export const Transports = ({ transports, onDelete, onEdit, editedTransport, newFrom, newDate, newTo, newPrice, newPeople, newLuggage, newCarBrand, newCarModel, newCarColor, newRegistration, newStop }) => {
    
    const email = localStorage.getItem("email");

    const editTransport = (transport) => {
        editedTransport(transport._id);

        newFrom(transport.cityFrom);
		newTo(transport.cityTo);
		//newDate(transport.dateFrom);
		newPrice(transport.price);
		newPeople(transport.numOfPeople);
		newLuggage(transport.luggage);
		newCarBrand(transport.carBrand);
		newCarModel(transport.carModel);
		newCarColor(transport.carColor);
		newRegistration(transport.registration);
		newStop(transport.interStop);
        onEdit(true);
    }

    // Preusmeritev na prevoz
    const onClick = (transport) => {
        if(transport.notification && transport.owner === email){
            notifications(transport._id);
            setTimeout(function () {
                localStorage.setItem("transportId", transport._id);
                window.location.href = `/transport/${transport._id}`;
            }, 5000);
        } else{
            localStorage.setItem("transportId", transport._id);
            window.location.href = `/transport/${transport._id}`;
        }
    }

    const notifications = (tr) => {
        addNotification({
            title: 'Warning',
            message: 'One of the passengers has cancled reservation!',
            theme: 'red',
            native: false // when using native, your OS will handle theming.
        });
        fetch("http://localhost:8080/notification/" + tr).then(res => res.json());
    };
    
    return (
        <div>
            <div className={styles.todos}>
                {transports.map(transport => (
                    <div key={transport._id}>
                        <div className={styles.todo} value={transport._id} >
                            <section className={styles.profile_info} onClick={() => onClick(transport)}>
                                <h2>From</h2>
                                <h2>To</h2>
                                <h2>Date</h2>
                                <h2>Price</h2>

                                <div className={styles.text}>{transport.cityFrom} </div>
                                <div className={styles.text}>{transport.cityTo}</div>
                                <div className={styles.text}>{Moment(transport.dateFrom).format("DD/MM/YYYY HH:MM")}</div>
                                <div className={styles.text}>{transport.price}$</div>
                            </section>
                            {onDelete ? (
                                <div>
                                    <div className={styles.delete_todo} onClick={() => onDelete(transport._id)}>x</div>
                                    <div className={styles.edit_todo} onClick={() => editTransport(transport)}>i</div>
                                </div>
                            ) : ""}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Transports
