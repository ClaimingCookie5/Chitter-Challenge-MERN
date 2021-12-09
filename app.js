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

database.dbConnect().on('error', (error) => console.log('Error: ', error))

// Code for deployment starts
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, "./client/build")));

  app.get("/*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });
}
// Code for deployment ends

app.use('/peeps', peepRouter);
app.use('/users', userRouter);
app.use((req, res) => {
  res.header("Allow-Control-Request-Headers")
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;