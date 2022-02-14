const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema za prevoz
const transportSchema = new Schema({
    cityFrom: {
        type: String,
        required: true
    },
    dateFrom: {
        type: Date,
        default: Date.now,
        format: "dd-mmm-yyyy hh:mm"
    },
    cityTo: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    numOfPeople: {
        type: Number,
        required: true
    },
    luggage: {
        type: Number,
        required: true
    },
    carBrand: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    carColor: {
        type: String,
        required: true
    },
    registration: {
        type: String,
        required: true
    },
    interStop: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: false
    }
})

const transport = mongoose.model("transport", transportSchema);

module.exports = transport;