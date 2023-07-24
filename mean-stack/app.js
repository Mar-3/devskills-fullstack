const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');

const db = require('./config/database')

mongoose.Promise = global.Promise

mongoose.connect(
    `mongodb+srv://mean-stack:${db.secret}@atlascluster.nugcdq7.mongodb.net/mean-stack?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } 
    );
const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection failed: "));
database.once("open", () => console.log('Connected to the database successfully.'));

const app = express();

const users = require('./routes/users');

const port = process.env.port||8080;

// CORS Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

// Passport middleware
app.use(session({
    secret: config.secret,
    saveUninitialized: true,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port);
});