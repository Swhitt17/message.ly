/** User class for message.ly */
const db = require("../db");
const ExpressError = require("../expressError");



/** User of the site. */

class User {

  
    static async register({username, password, first_name, last_name, phone}) { 
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (username,password)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING username,password,first_name,last_name,phone`,
            [username, hashedPassword,first_name,last_name,phone]
        );
        return result.rows[0];
    }
  
   
  
    static async authenticate(username, password) { 
        const result = await db.query(
            `SELECT password FROM users
            WHERE username = $1`,
            [username]
        );
        let user = result.rows[0];
        return user && await bcrypt.compare(password, user.password);
    }
  
    /** Update last_login_at for user */
  
    static async updateLoginTimestamp(username) {
       const result = await db.query(
            `UPDATE users
             SET last_login_at = current_timestamp
             WHERE username = $1
             RETURNING username`,
            [username]
          );
          if(!result.rows[0]){
            throw new ExpressError(`Cannot find user: ${username}`, 404);
          }
     }
  
    
  
    static async all() { 
        const results = await db.query(
            `SELECT username, 
            first_name,
            last_name,
            phone,
            join_at,
            last_login_at
            FROM users`
        );
        return results.rows.map(u => new User(u));



    }
  
  
    static async get(username) {
        const results = await db.query(
            `SELECT username,
            first_name,
            last_name,
            phone,
            join_at,
            last_login_at
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = results.rows[0];

        if (user === undefined) {
            const err = new Error(`User not found`);
            err.status = 404;
            throw err;
        }
        return new User(user);
     }
  
  
    static async messagesFrom(username) { 
        const result = await db.query(
            `
            SELECT m.id,
            m.to_username,
            m.body,
            m.sent_at,
            m.read_at,
            u.username,
            u.first_name,
            u.last_name,
            u.phone
            FROM messages as m
            JOIN users AS u
            ON m.to_username = u.username
            WHERE id = $1`, [id]
        );
        if(result.rows.length === 0) {
            throw new ExpressError(`Cannot find message with id of ${id}`)
        }
        return result.rows.map(m => ({
            id: m.id,
            to_user: {
                username: m.to_username,
                first_name: m.first_name,
                last_name: m.last_name,
                phone: m.phone
            },

            body: m.body,
            sent_at: m.sent_at,
            read_at: m.read_at
        }));
    }
  
  
  
    static async messagesTo(username) {
        const result = await db.query(
            `
            SELECT m.id,
            m.from_username,
            m.body,
            m.sent_at,
            m.read_at,
            u.username,
            u.first_name,
            u.last_name,
            u.phone
            FROM messages as m
            JOIN users AS u
            ON m.to_username = u.username
            WHERE id = $1`, [id]
        );
        if(result.rows.length === 0) {
            throw new ExpressError(`Cannot find message with id of ${id}`)
        }
        return result.rows.map(m => ({
            id: m.id,
            to_user: {
                username: m.from_username,
                first_name: m.first_name,
                last_name: m.last_name,
                phone: m.phone
            },

            body: m.body,
            sent_at: m.sent_at,
            read_at: m.read_at
        }));

     }
  }
  
  
  module.exports = User;