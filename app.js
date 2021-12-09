const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const logger = require('morgan');

const database = require('./database/dbConnect')

const peepRouter = require('./routes/peep_router');
const userRouter = require('./routes/user_router');

const app = express();
const port = process.env.PORT || '5000';

app.use(cors({
  origin: [
    (process.env.NODE_ENV === 'production') ? `${process.env.PUBLIC_URL}` : 'http://localhost:3000'
  ],
  credentials: true
}));

app.use(cookieParser())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json")
  res.header("Allow-Control-Request-Headers");
  next();
})

database.dbConnect().on('error', (error) => console.log('Error: ', error))

// Code for deployment starts

app.use(express.static("./client/build"));

app.get("/*", function (request, response) {
  response.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

// Code for deployment ends

app.use('/api/peeps', peepRouter);
app.use('/api/users', userRouter);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
