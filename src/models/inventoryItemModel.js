import mysql from 'mysql2'
import { baseResp, errorResp } from '../../baseResp.js'
import { dbConfig } from '../../db.js'


export default class inventoryItemModel {
    create(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            'SELECT * FROM inventorys WHERE id = ?',
            [body.inventory_id],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length == 0) {
                    callback(null, baseResp(404, 'Item id not found'))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        'INSERT INTO inventory_items VALUES (NULL, ?, ?, ?)',
                        [body.inventory_id, body.quantity, body.status],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, 'Create inventory item success', {
                                    item_name: result[0].item_name,
                                    quantity: body.quantity,
                                    status: body.status
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
    
    stock(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            `
            SELECT
                i.item_name,
                i.unit,
                COALESCE(SUM(CASE WHEN ii.status = 'Masuk' THEN ii.quantity ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN ii.status = 'Keluar' THEN ii.quantity ELSE 0 END), 0) AS stock
            FROM
                inventorys i
            LEFT JOIN
                inventory_items ii ON i.id = ii.inventory_id
            GROUP BY
                i.item_name, i.unit
            `,
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, 'Get stock inventory item success', result))
                }
                db.end()
            }
        )
    }
}