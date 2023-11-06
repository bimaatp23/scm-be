import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"

export default class orderModel {
    getList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM orders",
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "SELECT * FROM order_items",
                        (err2, result2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                console.log(result)
                                console.log(result2)
                                let returnResult = result.map((data) => {
                                    let items = []
                                    result2.map((data2) => {
                                        if (data.id == data2.order_id) {
                                            items.push(data2)
                                        }
                                    })
                                    return {
                                        ...data,
                                        items: items
                                    }
                                })
                                callback(null, baseResp(200, "Get order list success", returnResult))
                            }
                            db2.end()
                        }
                    )
                }
                db.end()
            }
        )
    }

    create(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "INSERT INTO orders VALUES(?, ?, ?, ?, ?, NULL, NULL)",
            [body.order_id, body.user_retail, body.total, "Submitted", body.submitted_date],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    let sqlQuery = "INSERT INTO order_items VALUES "
                    let sqlValues = JSON.parse(body.data).map((data) => {
                        return `(NULL, ${body.order_id}, ${data.inventory_id}, '${data.item_name}', '${data.description}', '${data.unit}', '${data.quantity}', '${data.price}')`
                    })
                    db2.query(
                        sqlQuery + sqlValues.join(","),
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create order success"))
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