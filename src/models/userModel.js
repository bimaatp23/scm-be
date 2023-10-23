import jwt from 'jsonwebtoken'
import mysql, { createConnection } from 'mysql2'
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
                if (result.length == 0) {
                    callback(null, baseResp(401, 'Incorrect Username or Password'))
                } else {
                    const payload = {
                        name: result[0].name,
                        username: result[0].username,
                        role: result[0].role
                    }
                    callback(null, baseResp(200, 'Login Success', {
                        ...payload,
                        token: jwt.sign(payload, process.env.SECRET_KEY, {
                            algorithm: 'HS256'
                        })
                    }))
                }
            }
            db.end()
        }
    )
}

export const getAll = (req, callback) => {
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM users',
        (err, result) => {
            if (err) {
                callback(err, errorResp(err.message))
            } else {
                const filteredResult = result.map((element) => {
                    return {
                        name: element.name,
                        username: element.username,
                        role: element.role
                    }
                })
                callback(null, baseResp(200, 'Get All Users Success', filteredResult))
            }
            db.end()
        }
    )
}