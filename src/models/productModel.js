import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"

export default class productModel {
    getList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            `
            SELECT
                i.id,
                i.inventory_id,
                ii.item_name,
                ii.description,
                ii.unit,
                ii.tipe,
                i.price,
                i.user_supplier
            FROM
                products i
            LEFT JOIN
                inventorys ii ON i.inventory_id = ii.id
            GROUP BY
                ii.item_name, ii.unit
            ORDER BY
                i.id
            `,
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Get product list success", result))
                }
                db.end()
            }
        )
    }

    create(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM products WHERE inventory_id = ? AND user_supplier = ?",
            [body.inventory_id, body.user_supplier],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length !== 0) {
                    callback(null, baseResp(409, "Item name already exists"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO products VALUES (NULL, ?, ?, ?)",
                        [body.inventory_id, body.price, body.user_supplier],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create product success"))
                            }
                            db2.end()
                        }
                    )
                }
                db.end()
            }
        )
    }

    update(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM products WHERE id = ?",
            [body.id],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length === 0) {
                    callback(null, baseResp(404, "Product id not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "UPDATE products SET price = ? WHERE id = ?",
                        [body.price, body.id],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Update product success"))
                            }
                            db2.end()
                        }
                    )
                }
                db.end()
            }
        )
    }

    delete(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM products WHERE id = ?",
            [body.id],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length === 0) {
                    callback(null, baseResp(404, "Product id not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "DELETE FROM products WHERE id = ?",
                        [body.id],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Delete product success"))
                            }
                            db2.end()
                        }
                    )
                }
                db.end()
            }
        )
    }
}