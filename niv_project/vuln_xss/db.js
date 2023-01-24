const sqlite3 = require("sqlite3").verbose();
const filepath = "./sqlitedatabase.db";

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
}

function createTable(db) {
    console.log("creating")
  db.exec(`
  CREATE TABLE if not exists posts
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    content   VARCHAR(500) NOT NULL
  );
`);

db.exec(`
CREATE TABLE if not exists csrf
(
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  token   VARCHAR(500) NOT NULL,
  username   VARCHAR(500) NOT NULL,
  sessionToken   VARCHAR(500) NOT NULL,
  form   VARCHAR(500) NOT NULL
);
`);


}

module.exports = createDbConnection();