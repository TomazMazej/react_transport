import styles from "./styles.module.css";
import Moment from 'moment';

export const Transports = ({ transports, onDelete, onEdit, editedTransport, newFrom, newDate, newTo, newPrice, newPeople, newLuggage, newCarBrand, newCarModel, newCarColor, newRegistration, newStop }) => {
    
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
    const onClick = (id) => {
        localStorage.setItem("transportId", id);
        window.location.href = `/transport/${id}`;
    }
    
    return (
        <div>
            <div className={styles.todos}>
                {transports.map(transport => (
                    <div key={transport._id}>
                        <div className={styles.todo} value={transport._id} >
                            <section className={styles.profile_info} onClick={() => onClick(transport._id)}>
                                <h2>From</h2>
                                <h2>To</h2>
                                <h2>Date</h2>
                                <h2>Price</h2>

                                <div className={styles.text}>{transport.cityFrom} </div>
                                <div className={styles.text}>{transport.cityTo}</div>
                                <div className={styles.text}>{Moment(transport.dateFrom).format('d MMM Y hh:mm')}</div>
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
