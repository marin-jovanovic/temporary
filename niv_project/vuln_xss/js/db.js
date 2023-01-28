const sqlite = require("better-sqlite3");
const crypto = require("crypto");
const bcrypt = require('bcrypt');

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

        console.log("add user", username, password)

        let sessionToken = generateRandom(100);
        let syncCSRFToken = generateRandom(100);

        const saltRounds = 10;

        let passwordHash = await bcrypt.hash(password, saltRounds);

        const createUser = this.db.transaction((username, passwordHash, sessionToken, syncCSRFToken) => {



            let t = this.db.prepare(
                "SELECT * FROM user WHERE USERNAME = (?)"
            ).get(username);

            if (!t) {
                console.log("nema tog usera")

                let rows = this.db.prepare(
                    "INSERT INTO user (username, passwordHash, sessionToken, syncCSRFToken) VALUES (?, ?, ?, ?)"
                ).run(username, passwordHash, sessionToken, syncCSRFToken);


                return true;


            } else {
                console.log("user exists")


                return false;
            }


        })

        return createUser(username, passwordHash, sessionToken, syncCSRFToken);


    }

    isAuthOk = async (username, password) => {

        /**
         * return @true if @username and password hash pair exists in database  
         */

        console.log("isAuthOk auth check", username, password)

        let correctPasswordHash = this.db.prepare(
            "SELECT passwordHash FROM user WHERE USERNAME = (?)"
        ).pluck().get(username);

        if (!correctPasswordHash) {
            console.log("isAuthOk user not exists")

            return false;

        } else {
            console.log("isAuthOk user exists");
            console.log("isAuthOk", correctPasswordHash)
            console.log("isAuthOk", password)

            let r = await bcrypt.compare(password, correctPasswordHash);

            console.log("isAuthOk hash matching", r)

            return r;

        }

    }

    login = async (username, password) => {
        /**
         * check if credentials are ok
         * generate session token and csrf token
         * 
         * return @true if auth ok
         * 
         */

        // console.log("login", username,  password)

        let isAuthOk = await this.isAuthOk(username, password);

        if (isAuthOk) {

            let sessionToken = generateRandom(100);
            let syncCSRFToken = generateRandom(100);


            let rows = this.db.prepare(`
          
          UPDATE user SET sessionToken = (?), syncCSRFToken = (?)
          WHERE username = (?)
        
          `).run(sessionToken, syncCSRFToken, username);

            // console.log(rows)


            return {
                status: true,
                sessionToken: sessionToken,
                syncCSRFToken: syncCSRFToken,
            }


        } else {

            return {
                status: false
            }

        }

    }

    createPost = (content) => {


      this.db.prepare("INSERT INTO posts (content) VALUES (?)").run(content);


    }

    getAllPosts = () => {
        var rows = this.db.prepare("SELECT * FROM posts").all();
        return rows;
    }

}

const databaseConnection = new DatabaseConnection();


module.exports = databaseConnection;