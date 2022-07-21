const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'interns',
  port: 3306
});

app.post('/create', (req, res) => {
  const name = req.body.name;
  const date = req.body.date;
  const status = req.body.status;
  const notes = req.body.notes;

  db.query('INSERT INTO intern_data2 (name, date, status, notes) VALUES (?, ?, ?, ?)', [name, date, status, notes], (err, result) => {
    if (err) console.log(err);
    else {
      res.send("Values Inserted");
    }
  }
  );
});

app.get('/internships', (req, res) => {
  db.query("SELECT * FROM intern_data2", (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  })
})

app.delete('/delete/:key', (req, res) => {
  const key = req.params.key;
  db.query("DELETE FROM `intern_data2` WHERE `key` = ?", key, (err, result) => {
    if (err) console.log(err);
    else {
      res.send("Entry Deleted");
    }
  });
})

app.listen(3001, () => {
  console.log("hi");
})