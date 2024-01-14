const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "mysqldb",
});

// Creating table if not exists
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error getting database connection: ", err);
  } else {
    const sql =
      "CREATE TABLE IF NOT EXISTS mytable (id int, name varchar(20), subject varchar(20), marks int)";
    connection.query(sql, (queryErr, result) => {
      connection.release();

      if (queryErr) {
        console.error("Error executing query: ", queryErr);
      } else {
        console.log("Table Created");
      }
    });
  }
});

// Fetch all data
app.get("/fetch", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query("SELECT * FROM mytable", (queryErr, result) => {
      connection.release();

      if (queryErr) {
        console.error("Error executing query: ", queryErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.send(result);
    });
  });
});

// Fetch data by ID
app.get("/fetchbyid/:id", (req, res) => {
  const fetched = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      "SELECT * FROM mytable WHERE id = ?",
      fetched,
      (queryErr, result) => {
        connection.release();

        if (queryErr) {
          console.error("Error executing query: ", queryErr);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.send(result);
      }
    );
  });
});

// Add data
app.post("/fetchpost", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const subject = req.body.subject;
  const marks = req.body.marks;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      "INSERT INTO mytable VALUES (?, ?, ?, ?)",
      [id, name, subject, marks],
      (queryErr, result) => {
        connection.release();

        if (queryErr) {
          console.error("Error executing query: ", queryErr);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.send("Posted");
      }
    );
  });
});

// Add list of data
app.post("/postlist", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const values = req.body.map((element) => [
      element.id,
      element.name,
      element.subject,
      element.marks,
    ]);

    connection.query(
      "INSERT INTO mytable VALUES ?",
      [values],
      (queryErr, result) => {
        connection.release();

        if (queryErr) {
          console.error("Error executing query: ", queryErr);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.send("List Posted");
      }
    );
  });
});

// Update data by ID
app.put("/update/:id", (req, res) => {
  const upid = req.params.id;
  const name = req.body.name;
  const subject = req.body.subject;
  const marks = req.body.marks;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      "UPDATE mytable SET name=?, subject=?, marks=? WHERE id=?",
      [name, subject, marks, upid],
      (queryErr, result) => {
        connection.release();

        if (queryErr) {
          console.error("Error executing query: ", queryErr);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.send("Updated");
      }
    );
  });
});

// Delete all data
app.delete("/deletedata", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query("DELETE FROM mytable", (queryErr, result) => {
      connection.release();

      if (queryErr) {
        console.error("Error executing query: ", queryErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (result.affectedRows === 0) {
        console.log("No rows present");
      } else {
        res.send("Deleted");
      }
    });
  });
});

app.delete("/deletedata/:id", (req, res) => {
    const delid=req.params.id;
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection: ", err);
        res.status(500).send("Internal Server Error");
        return;
      }
  
      connection.query("DELETE FROM mytable WHERE id=?",delid, (queryErr, result) => {
        connection.release();
  
        if (queryErr) {
          console.error("Error executing query: ", queryErr);
          res.status(500).send("Internal Server Error");
          return;
        }
  
        if (result.affectedRows === 0) {
          console.log("No rows present");
        } else {
          res.send("Deleted");
        }
      });
    });
  });
  
// Fetch max marks
app.get("/getmax", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query("SELECT MAX(marks) AS maxmark FROM mytable", (queryErr, result) => {
      connection.release();

      if (queryErr) {
        console.error("Error executing query: ", queryErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.send(result);
      let data = JSON.parse(JSON.stringify(result));
      console.log(data[0].maxmark);
    });
  });
});

// Start the server
const port = 4000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});
