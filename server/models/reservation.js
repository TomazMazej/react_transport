const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema za rezervacijo
const reservationSchema = new Schema({
    transportId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    }
})

const reservation = mongoose.model("reservation", reservationSchema);

module.exports = reservation;