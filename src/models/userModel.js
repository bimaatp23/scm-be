import mysql from 'mysql2'
import { baseResp, errorResp } from '../../baseResp.js'
import { dbConfig } from '../../db.js'

export const getUsers = (req, callback) => {
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM users',
        (err, result) => {
            if (err) {
                callback(err, errorResp(err))
            } else {
                const row = result
                callback(null, baseResp(200, 'Get User Success', result))
            }
            db.end()
        }
    )
}