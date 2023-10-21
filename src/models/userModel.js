import mysql from 'mysql2'
import { baseResp, errorResp } from '../../baseResp.js'
import { dbConfig } from '../../db.js'

export const login = (req, callback) => {
    const body = req.body
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [
            body.username,
            body.password
        ],
        (err, result) => {
            if (err) {
                callback(err, errorResp(err.message))
            } else {
                const row = result
                if (result.length == 0) {
                    callback(null, baseResp(401, 'Incorrect Username or Password'))
                } else {
                    callback(null, baseResp(200, 'Login Success', {
                        name: row[0].name,
                        username: row[0].username,
                        role: row[0].role,
                        token: "???"
                    }))
                }
            }
            db.end()
        }
    )
}