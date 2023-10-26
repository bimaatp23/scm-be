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
                    'INSERT INTO inventorys VALUES (NULL, ?, ?, ?)',
                    [body.item_name, body.description, body.unit],
                    (err2) => {
                        if (err2) {
                            callback(err2, errorResp(err2.message))
                        } else {
                            callback(null, baseResp(200, 'Create inventory success', {
                                item_name: body.item_name,
                                description: body.description,
                                unit: body.unit
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