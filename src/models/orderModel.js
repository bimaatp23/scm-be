import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"
import BasicConstant from "../BasicConstant.js"

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
                                const db3 = mysql.createConnection(dbConfig)
                                db3.query(
                                    "SELECT * FROM retails",
                                    (err3, result3) => {
                                        if (err3) {
                                            callback(err3, errorResp(err3.message))
                                        } else {
                                            let returnResult = result.map((data) => {
                                                let items = []
                                                result2.map((data2) => {
                                                    if (data.id === data2.order_id) {
                                                        items.push(data2)
                                                    }
                                                })
                                                let detail_retail = []
                                                result3.map((data3) => {
                                                    if (data.user_retail === data3.username) {
                                                        detail_retail.push(data3)
                                                    }
                                                })
                                                return {
                                                    ...data,
                                                    items: items,
                                                    detail_retail: detail_retail[0]
                                                }
                                            })
                                            callback(null, baseResp(200, "Get order list success", returnResult))
                                        }
                                        db3.end()
                                    }
                                )
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
            "INSERT INTO orders VALUES(?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL)",
            [body.order_id, body.user_retail, body.total, BasicConstant.ORDER_STATUS_SUBMITTED, body.submit_date],
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

    cancel(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE orders SET status = ?, cancel_date = ? WHERE id = ?",
            [BasicConstant.ORDER_STATUS_CANCELLED, body.cancel_date, body.order_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Cancel order success"))
                }
                db.end()
            }
        )
    }

    reject(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE orders SET status = ?, reject_date = ? WHERE id = ?",
            [BasicConstant.ORDER_STATUS_REJECTED, body.reject_date, body.order_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Reject order success"))
                }
                db.end()
            }
        )
    }

    process(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE orders SET status = ?, process_date = ? WHERE id = ?",
            [BasicConstant.ORDER_STATUS_PROCESS, body.process_date, body.order_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Process order success"))
                }
                db.end()
            }
        )
    }
}