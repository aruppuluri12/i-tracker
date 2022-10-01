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

app.post('/createIntern', (req, res) => {
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

app.post('/createNetwork', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const notes = req.body.notes;

  db.query('INSERT INTO network_data (name, email, phone, notes) VALUES (?, ?, ?, ?)', [name, email, phone, notes], (err, result) => {
    if (err) console.log(err);
    else {
      res.send("Values Inserted");
    }
  }
  );
});

app.post('/createUser', (req, res) => {
  const user = req.body.username;
  const pass = req.body.password;

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [user, pass], (err, result) => {
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

app.get('/network', (req, res) => {
  db.query("SELECT * FROM network_data", (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  })
})

app.get('/getUsers/:user', (req, res) => {
  const user = req.params.user
  db.query("SELECT * FROM users WHERE username = ?", user, (err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  })
})

app.delete('/deleteIntern/:key', (req, res) => {
  const key = req.params.key;
  db.query("DELETE FROM `intern_data2` WHERE `key` = ?", key, (err, result) => {
    if (err) console.log(err);
    else {
      res.send("Entry Deleted");
    }
  });
})

app.delete('/deleteNetwork/:key', (req, res) => {
  const key = req.params.key;
  db.query("DELETE FROM `network_data` WHERE `key` = ?", key, (err, result) => {
    if (err) console.log(err);
    else {
      res.send("Entry Deleted");
    }
  });
})

app.put('/updateIntern', (req, res) => {
  const key = req.body.key
  const name = req.body.name;
  const date = req.body.date;
  const status = req.body.status;
  const notes = req.body.notes;
  db.query("UPDATE intern_data2 SET name = ?, date = ?, status = ?, notes = ? WHERE `key` = ?",
    [name, date, status, notes, key], (err, result) => {
      if (err) console.log(err);
      else res.send(result);
    })
})

app.put('/updateNetwork', (req, res) => {
  const key = req.body.key
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const notes = req.body.notes;
  db.query("UPDATE network_data SET name = ?, email = ?, phone = ?, notes = ? WHERE `key` = ?",
    [name, email, phone, notes, key], (err, result) => {
      if (err) console.log(err);
      else res.send(result);
    })
})

app.listen(3001, () => {
  console.log("server started");
})