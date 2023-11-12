import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"

export default class inventoryModel {
    getList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            `
            SELECT
                i.id,
                i.item_name,
                i.description,
                i.unit,
                i.price,
                COALESCE(SUM(CASE WHEN ii.status = "Masuk" THEN ii.quantity ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN ii.status = "Keluar" THEN ii.quantity ELSE 0 END), 0) AS stock
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
                    callback(null, baseResp(200, "Get stock inventory item success", result))
                }
                db.end()
            }
        )
    }

    getItemList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM inventory_items",
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Get inventory item list success", result))
                }
                db.end()
            }
        )
    }

    create(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM inventorys WHERE item_name = ?",
            [body.item_name],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length != 0) {
                    callback(null, baseResp(409, "Item name already exists"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO inventorys VALUES (NULL, ?, ?, ?, ?)",
                        [body.item_name, body.description, body.unit, body.price],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create inventory success", {
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

    update(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM inventorys WHERE id = ?",
            [body.id],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length == 0) {
                    callback(null, baseResp(404, "Item id not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "UPDATE inventorys SET item_name = ?, description = ?, unit = ?, price = ? WHERE id = ?",
                        [body.item_name, body.description, body.unit, body.price, body.id],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Update inventory success", {
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

    delete(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM inventorys WHERE id = ?",
            [body.id],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length == 0) {
                    callback(null, baseResp(404, "Item id not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "DELETE FROM inventorys WHERE id = ?",
                        [body.id],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Delete inventory success", {
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

    createItem(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM inventorys WHERE id = ?",
            [body.inventory_id],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length == 0) {
                    callback(null, baseResp(404, "Item id not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO inventory_items VALUES (NULL, ?, ?, ?)",
                        [body.inventory_id, body.quantity, body.status],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create inventory item success", {
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
}