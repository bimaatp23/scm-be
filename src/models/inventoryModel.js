import mysql from 'mysql2'
import { baseResp, errorResp } from '../../baseResp.js'
import { dbConfig } from '../../db.js'

export const create = (req, callback) => {
    const body = req.body
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM inventorys WHERE item_name = ?',
        [body.item_name],
        (err, result) => {
            if (err) {
                callback(err, errorResp(err.message))
            } else if (result.length != 0) {
                callback(null, baseResp(409, 'Item name already exists'))
            } else {
                const db2 = mysql.createConnection(dbConfig)
                db2.query(
                    'INSERT INTO inventorys VALUES (NULL, ?, ?, ?, ?)',
                    [body.item_name, body.description, body.unit, body.price],
                    (err2) => {
                        if (err2) {
                            callback(err2, errorResp(err2.message))
                        } else {
                            callback(null, baseResp(200, 'Create inventory success', {
                                item_name: body.item_name,
                                description: body.description,
                                unit: body.unit,
                                price: body.price
                            }))
                        }
                        db2.end()
                    }
                )
            }
            db.end()
        }
    )
}

export const update = (req, callback) => {
    const body = req.body
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM inventorys WHERE id = ?',
        [body.id],
        (err, result) => {
            if (err) {
                callback(err, errorResp(err.message))
            } else if (result.length == 0) {
                callback(null, baseResp(404, 'Item id not found'))
            } else {
                const db2 = mysql.createConnection(dbConfig)
                db2.query(
                    'UPDATE inventorys SET item_name = ?, description = ?, unit = ?, price = ? WHERE id = ?',
                    [body.item_name, body.description, body.unit, body.price, body.id],
                    (err2) => {
                        if (err2) {
                            callback(err2, errorResp(err2.message))
                        } else {
                            callback(null, baseResp(200, 'Update inventory success', {
                                item_name: body.item_name,
                                description: body.description,
                                unit: body.unit,
                                price: body.price
                            }))
                        }
                        db2.end()
                    }
                )
            }
            db.end()
        }
    )
}

export const remove = (req, callback) => {
    const body = req.body
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM inventorys WHERE id = ?',
        [body.id],
        (err, result) => {
            if (err) {
                callback(err, errorResp(err.message))
            } else if (result.length == 0) {
                callback(null, baseResp(404, 'Item id not found'))
            } else {
                const db2 = mysql.createConnection(dbConfig)
                db2.query(
                    'DELETE FROM inventorys WHERE id = ?',
                    [body.id],
                    (err2) => {
                        if (err2) {
                            callback(err2, errorResp(err2.message))
                        } else {
                            callback(null, baseResp(200, 'Delete inventory success', {
                                item_name: result[0].item_name,
                                description: result[0].description,
                                unit: result[0].unit
                            }))
                        }
                        db2.end()
                    }
                )
            }
            db.end()
        }
    )
}