const sqlite3 = require("sqlite3").verbose();
// const filepath = "./sqlitedatabase.db";
const sqlite = require("better-sqlite3");

const DATABASE_PATH = "./sqliteDatabase";

// https://www.digitalocean.com/community/tutorials/how-to-use-sqlite-with-node-js-on-ubuntu-22-04

const crypto = require("crypto");
const bcrypt = require ('bcrypt');


// const {
//   Pool
// } = require('pg');

// const pool = new Pool({
//   user: 't',
//   host: 'localhost',
//   database: 'nivpg',
//   password: 'T',
//   port: 5432,
// });

function generateRandom(length) {
  let r = crypto.randomBytes(length);
  r = r.toString("hex")
  return r;
}

class DatabaseConnection {

  constructor() {
    this.databasePath = "./sqliteDatabase";

    this.db = new sqlite(this.databasePath);

    this.db.prepare(`
      CREATE TABLE if not exists user (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        username      VARCHAR(20) NOT NULL UNIQUE,
        passwordHash  VARCHAR(200) NOT NULL,
        sessionToken  VARCHAR(1000) NULL,
        syncCSRFToken VARCHAR(1000) NULL
      );
    `).run();

    this.db.prepare(`
      CREATE TABLE if not exists posts (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        content   VARCHAR(500) NOT NULL
      );
    `).run();

  }

  addUser = async (username, password) => {
  
      // (async () => {
    
      console.log("add user",username, password)

      let sessionToken = generateRandom(100);
      let syncCSRFToken = generateRandom(100);

      const saltRounds = 10;

        let passwordHash = await bcrypt.hash(password, saltRounds);

      const createUser = this.db.transaction((username, passwordHash, sessionToken, syncCSRFToken) => {

            // console.log("create suer", username, passwordHash, sessionToken, syncCSRFToken)

            let t = this.db.prepare(
              "SELECT * FROM user WHERE USERNAME = (?)"
            ).get(username);            

              if (! t) {
                console.log("nema tog usera")

             let    rows = this.db.prepare(
                  "INSERT INTO user (username, passwordHash, sessionToken, syncCSRFToken) VALUES (?, ?, ?, ?)"
                ).run(username, passwordHash, sessionToken, syncCSRFToken);
          

              return true;


              } else {
                console.log("user exists")


                return false;
              }


      })
      
      return createUser(username, passwordHash, sessionToken, syncCSRFToken);

      // console.log(rows)
  
        // return true;




      // try {

      //   const createUser = this.db.transaction((username, passwordHash, sessionToken, syncCSRFToken) => {



      //   })

      //   rows = this.db.prepare(
      //     "INSERT INTO user (username, passwordHash, sessionToken, syncCSRFToken) VALUES (?, ?, ?, ?)"
      //   ).run(username, passwordHash, sessionToken, syncCSRFToken);
        
      //   // console.log(rows)
    
      //     return true;

      // } catch {

      //   console.log("username exists")
      //   return false;

      // }



      // })();

  }

  isAuthOk  =   async (username, password) => {
    console.log("isAuthOk auth check",username,  password)

    // console.log("login",username,  password)


    let correctPasswordHash = this.db.prepare(
      "SELECT passwordHash FROM user WHERE USERNAME = (?)"
    ).pluck().get(username);            

    if (! correctPasswordHash) {
      console.log("isAuthOk user not exists")


        return false;

    } else {
      console.log("isAuthOk user exists");

      console.log("isAuthOk", correctPasswordHash)
      console.log("isAuthOk", password)



        let r =  await bcrypt.compare(password, correctPasswordHash);

    
          console.log("isAuthOk hash matching", r)

          return r;

    }



    // const loginTransaction = this.db.transaction((username, password) => {
    //   (async () => {


    //   let correctPasswordHash = this.db.prepare(
    //     "SELECT passwordHash FROM user WHERE USERNAME = (?)"
    //   ).pluck().get(username);            


    

    //   })();

    //   })

    //  return loginTransaction(username, password);


  }

  login = async  (username, password) => {


    console.log("login",username,  password)

    const loginTransaction = this.db.transaction((username, password) => {


      let correctPasswordHash = this.db.prepare(
        "SELECT passwordHash FROM user WHERE USERNAME = (?)"
      ).pluck().get(username);            

        if (! correctPasswordHash) {
          console.log("user not exists")


            return false;

        } else {
          console.log("user exists");

    (async () => {

      // console.log(password, correctPasswordHash)

      let r =  await bcrypt.compare(password, correctPasswordHash);

      // conso:le.log(r);
  
          console.log("hash matching", r)

          return r;
  })();

        }


    


      })

      loginTransaction(username, password);





    

  // })();

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