const sqlite3 = require("sqlite3").verbose();
// const filepath = "./sqlitedatabase.db";
const sqlite = require("better-sqlite3");

const DATABASE_PATH = "./sqliteDatabase";

// https://www.digitalocean.com/community/tutorials/how-to-use-sqlite-with-node-js-on-ubuntu-22-04


class DatabaseConnection {

  constructor() {
    this.databasePath = "./sqliteDatabase";

  }

  createDbConnection = () => {
    const db = new sqlite3.Database(this.databasePath, (error) => {
        if (error) {
            return console.error(error.message);
        }
        createTable(db);
    });
    console.log("Connection with SQLite has been established");
    return db;   
  }

  createTable = (db) => {
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

  insertRow = (content) => {
    db.run(
        `INSERT INTO posts (content) VALUES (?)`,
        [content],
        function(error) {
            if (error) {
                console.error(error.message);
            }
        }
    );
  }

  insertToken = (token, username, sessionToken, form) => {

    db.run(
        `INSERT INTO csrf (token, username, sessionToken, form) VALUES (?, ?, ?, ?)`,
        [token, username, sessionToken, form],
        function(error) {
            if (error) {
                console.error(error.message);
            }
        }
    );
  
  }


  selectRows = () => {
    var db = new sqlite(this.databasePath);
    var rows = db.prepare("SELECT * FROM posts").all();
    return rows;
  }

}

const databaseConnection = new DatabaseConnection();

// export {
//   databaseConnection
// }

// export const db = {
//   createDbConnection,
//   insertRow,
//   insertToken,
//   selectRows
// }


module.exports = databaseConnection;