import jwt from 'jsonwebtoken'
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
            } else if (result.length == 0) {
                callback(null, baseResp(401, 'Incorrect username or password'))
            } else {
                const payload = {
                    name: result[0].name,
                    username: result[0].username,
                    role: result[0].role
                }
                callback(null, baseResp(200, 'Login success', {
                    ...payload,
                    token: jwt.sign(payload, process.env.SECRET_KEY, {
                        algorithm: 'HS256'
                    })
                }))
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
                callback(null, baseResp(200, 'Get all users success', filteredResult))
            }
            db.end()
        }
    )
}

export const createRetail = (req, callback) => {
    const body = req.body
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [body.username],
        (err, result) => {
            if (err) {
                callback(err, errorResp(err.message))
            } else if (result.length != 0) {
                callback(null, baseResp(409, 'Username already exists'))
            } else if (body.password != body.re_password) {
                callback(null, baseResp(400, 'Passwords do not match'))
            } else {
                const db2 = mysql.createConnection(dbConfig)
                db2.beginTransaction((err2) => {
                    if (err2) {
                        callback(err2, errorResp(err2.message))
                    }
                    db2.query(
                        'INSERT INTO users VALUES (NULL, ?, ?, "retail", ?)',
                        [body.name, body.username, body.password],
                        (err2) => {
                            if (err2) {
                                return db2.rollback(() => {
                                    callback(err2, errorResp(err2.message))
                                })
                            }
                        }
                    )
                    db2.query(
                        'INSERT INTO retails VALUES (?, ?, ?, ?, ?)',
                        [body.username, body.business_name, body.address, body.email, body.phone],
                        (err2) => {
                            if (err2) {
                                return db2.rollback(() => {
                                    callback(err2, errorResp(err2.message))
                                })
                            }
                        }
                    )
                    db2.commit((err2) => {
                        if (err2) {
                            return db2.rollback(() => {
                                callback(err2, errorResp(err2.message))
                            })
                        }
                    })
                    callback(null, baseResp(200, 'Create retail success', {
                        username: body.username,
                        name: body.name,
                        business_name: body.business_name,
                        address: body.address,
                        email: body.email,
                        phone: body.phone
                    }))
                })
            }
            db.end()
        }
    )
}