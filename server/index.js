require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Requests
const Transport = require('./models/transport')
app.get('/transports', async(req, res) => {
    const transports = await Transport.find();

    res.json(transports);
})

app.post('/transport/new', (req, res) => {
    const transport = new Transport({
        cityFrom: req.body.cityFrom,
        dateFrom: req.body.dateFrom,
        cityTo: req.body.cityTo,
        price: req.body.price,
        numOfPeople: req.body.numOfPeople,
        luggage: req.body.luggage,
        carBrand: req.body.carBrand,
        carModel: req.body.carModel,
        carColor: req.body.carColor,
        registration: req.body.registration,
        interStop: req.body.interStop
    })

    transport.save();

    res.json(transport);
})

app.put('/transport/edit/:id', async(req, res) => {
    const transport = await Transport.findById(req.params.id);

    transport.cityFrom = req.body.cityFrom,
        transport.dateFrom = req.body.dateFrom,
        transport.cityTo = req.body.cityTo,
        transport.price = req.body.price,
        transport.numOfPeople = req.body.numOfPeople,
        transport.luggage = req.body.luggage,
        transport.carBrand = req.body.carBrand,
        transport.carModel = req.body.carModel,
        transport.carColor = req.body.carColor,
        transport.registration = req.body.registration,
        transport.interStop = req.body.interStop

    transport.save();

    res.json(transport)
})

app.delete('/transport/delete/:id', async(req, res) => {
    const result = await Transport.findByIdAndDelete(req.params.id);

    res.json(result);
})

app.get('/transport/:id', async (req, res) => {
    const transport = await Transport.findById(req.params.id);

    res.json(transport)
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));