const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./fish.db";

// https://www.digitalocean.com/community/tutorials/how-to-use-sqlite-with-node-js-on-ubuntu-22-04

function createDbConnection() {
    const db = new sqlite3.Database(filepath, (error) => {
        if (error) {
          return console.error(error.message);
        }
        createTable(db);
      });
      console.log("Connection with SQLite has been established");
      return db;
  


//     if (fs.existsSync(filepath)) {
//     return new sqlite3.Database(filepath);
//   } else {
//     const db = new sqlite3.Database(filepath, (error) => {
//       if (error) {
//         return console.error(error.message);
//       }
//       createTable(db);
//     });
//     console.log("Connection with SQLite has been established");
//     return db;
//   }
}

function createTable(db) {
    console.log("creating")
  db.exec(`
  CREATE TABLE if not exists credentials
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    username   VARCHAR(50) NOT NULL,
    password   VARCHAR(50) NOT NULL
  );
`);
}

module.exports = createDbConnection();