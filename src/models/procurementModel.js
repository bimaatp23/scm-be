import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"
import BasicConstant from "../BasicConstant.js"

export default class procurementModel {
    getList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM procurements",
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "SELECT * FROM procurement_items",
                        (err2, result2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                const db3 = mysql.createConnection(dbConfig)
                                db3.query(
                                    "SELECT * FROM suppliers",
                                    (err3, result3) => {
                                        if (err3) {
                                            callback(err3, errorResp(err3.message))
                                        } else {
                                            let returnResult = result.map((data) => {
                                                const items = result2.filter((data2) => data.id === data2.procurement_id)
                                                const detail_supplier = result3.filter((data3) => data.user_supplier === data3.username)
                                                return {
                                                    ...data,
                                                    items: items,
                                                    detail_supplier: detail_supplier[0]
                                                }
                                            })
                                            callback(null, baseResp(200, "Get procurement list success", returnResult))
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
            "INSERT INTO procurements VALUES(?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL)",
            [body.procurement_id, body.user_supplier, body.total, BasicConstant.STATUS_SUBMITTED, body.submit_date],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    let sqlQuery = "INSERT INTO procurement_items VALUES "
                    let sqlValues = JSON.parse(body.data).map((data) => {
                        return `(NULL, ${body.procurement_id}, ${data.inventory_id}, "${data.item_name}", "${data.description}", "${data.unit}", "${data.quantity}", "${data.price}")`
                    })
                    db2.query(
                        sqlQuery + sqlValues.join(","),
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create procurement success"))
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
            "UPDATE procurements SET status = ?, cancel_date = ? WHERE id = ?",
            [BasicConstant.STATUS_CANCELLED, body.cancel_date, body.procurement_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Cancel procurement success"))
                }
                db.end()
            }
        )
    }

    reject(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE procurements SET status = ?, reject_date = ? WHERE id = ?",
            [BasicConstant.STATUS_REJECTED, body.reject_date, body.procurement_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Reject procurement success"))
                }
                db.end()
            }
        )
    }

    process(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE procurements SET status = ?, process_date = ? WHERE id = ?",
            [BasicConstant.STATUS_PROCESS, body.process_date, body.procurement_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Process procurement success"))
                }
                db.end()
            }
        )
    }

    delivery(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE procurements SET status = ?, delivery_date = ? WHERE id = ?",
            [BasicConstant.STATUS_DELIVERY, body.delivery_date, body.procurement_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Delivery procurement success"))
                }
                db.end()
            }
        )
    }

    arrival(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE procurements SET status = ?, arrival_date = ? WHERE id = ?",
            [BasicConstant.STATUS_ARRIVAL, body.arrival_date, body.procurement_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    let sqlQuery = "INSERT INTO inventory_items VALUES "
                    let sqlValues = JSON.parse(body.data).map((data) => {
                        return `(NULL, ${data.inventory_id}, "${data.quantity}", "Procurement ${body.procurement_id}", "${BasicConstant.ITEM_MASUK}")`
                    })
                    db2.query(
                        sqlQuery + sqlValues.join(","),
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Arrival procurement success"))
                            }
                            db2.end()
                        }
                    )
                }
                db.end()
            }
        )
    }

    done(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE procurements SET status = ?, done_date = ? WHERE id = ?",
            [BasicConstant.STATUS_DONE, body.done_date, body.procurement_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Done procurement success"))
                }
                db.end()
            }
        )
    }
}