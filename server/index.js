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
// User
const Users = require('./models/user')
app.get('/users/:e', async (req, res) => {
    const user = await Users.User.findOne({ email: req.params.e });

    res.json(user);
})

// Transports
const Transport = require('./models/transport')
app.get('/transports', async(req, res) => {
    const transports = await Transport.find();

    res.json(transports);
})

app.get('/userTransports/:e', async(req, res) => {
    const transports = await Transport.find({ owner: req.params.e });
  
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
        interStop: req.body.interStop,
        owner: req.body.owner
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

// Profile
app.get('/checkOfferTransport/:e', async (req, res) => {
    const user = await Users.User.findOne({ email: req.params.e });
    user.offerTransport = !user.offerTransport;
    user.save();

    res.json(user)
})

app.get('/checkSearchTransport/:e', async (req, res) => {
    const user = await Users.User.findOne({ email: req.params.e });
    user.searchTransport = !user.searchTransport;
    user.save();

    res.json(user)
})

// Reservation
const Reservation = require('./models/reservation')
app.get('/reservations/:tr', async(req, res) => {
    const reservations = await Reservation.find({$and:[{transportId: req.params.tr}, {status: 'pending'}]});
  
    res.json(reservations);
})

app.get('/reservation/:tr/:e', async(req, res) => {
    const reservation = await Reservation.findOne({$and:[{transportId: req.params.tr}, {email: req.params.e}]});
  
    res.json(reservation);
})

app.post('/reservation/new', (req, res) => {
    const reservation = new Reservation({
        transportId: req.body.transportId,
        name: req.body.name,
        email: req.body.email,
        status: "pending"
    })
    reservation.save();

    res.json(reservation);
})

app.delete('/reservation/delete/:id', async(req, res) => {
    const result = await Reservation.findByIdAndDelete(req.params.id);

    res.json(result);
})

app.get('/reservationAccept/:tr/:e', async (req, res) => {
    const transport = await Transport.findById(req.params.tr);
    transport.numOfPeople = transport.numOfPeople - 1;
    transport.save();

    const reservation = await Reservation.findOne({$and:[{transportId: req.params.tr}, {email: req.params.e}]});
    reservation.status = "accepted";
    reservation.save();

    res.json(reservation)
})

app.get('/reservationCancle/:tr/:e', async (req, res) => {
    const transport = await Transport.findById(req.params.tr);
    transport.numOfPeople = transport.numOfPeople + 1;
    transport.save();

    res.json(transport)
})

// Notification
app.get('/notification/:tr', async (req, res) => {
    const transport = await Transport.findById(req.params.tr);
    transport.notification = !transport.notification;
    transport.save();

    res.json(transport)
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));