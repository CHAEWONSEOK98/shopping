const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../uploads')));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('연결 완료');
  })
  .catch((err) => {
    console.error(err);
  });

app.get('/', (req, res, next) => {
  setImmediate(() => {
    next(new Error('it is an error'));
  });
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message || '서버 에러');
});

app.use('/users', require('./routes/users'));

app.listen(4000, () => {
  console.log(`${port}번에서 실행이 되었습니다`);
});
