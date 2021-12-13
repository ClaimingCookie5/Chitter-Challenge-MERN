const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');

const database = require('./database/dbConnect');

const peepRouter = require('./routes/peep_router');
const userRouter = require('./routes/user_router');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    `${process.env.CLIENT_URL}`
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

database.dbConnect()
  .on('error', (error) => console.log('Error: ', error))
  
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, 'client','build', 'index.html'));
  });  
};

app.use('/peeps', peepRouter);
app.use('/users', userRouter);



app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
});