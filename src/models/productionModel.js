import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"
import BasicConstant from "../BasicConstant.js"

export default class productionModel {
    getList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM productions",
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "SELECT * FROM production_items",
                        (err2, result2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                let returnResult = result.map((data) => {
                                    const material = result2.filter((data2) => data.id === data2.production_id && data2.tipe === BasicConstant.INVENTORY_BAHAN)
                                    const product = result2.filter((data2) => data.id === data2.production_id && data2.tipe === BasicConstant.INVENTORY_PRODUK)
                                    return {
                                        ...data,
                                        material: material,
                                        product: product
                                    }
                                })
                                callback(null, baseResp(200, "Get production list success", returnResult))
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
            "INSERT INTO productions VALUES(?, ?, ?, NULL, NULL, NULL, NULL)",
            [body.production_id, BasicConstant.STATUS_SUBMITTED, body.submit_date],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    let sqlQuery = "INSERT INTO production_items VALUES "
                    let sqlMaterial = JSON.parse(body.material).map((data) => {
                        return `(NULL, ${body.production_id}, ${data.inventory_id}, '${data.item_name}', '${data.unit}', '${data.tipe}', '${data.quantity}')`
                    })
                    let sqlProduct = JSON.parse(body.product).map((data) => {
                        return `(NULL, ${body.production_id}, ${data.inventory_id}, '${data.item_name}', '${data.unit}', '${data.tipe}', '${data.quantity}')`
                    })
                    db2.query(
                        sqlQuery + sqlMaterial.concat(sqlProduct).join(","),
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create production success"))
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
            "UPDATE productions SET status = ?, cancel_date = ? WHERE id = ?",
            [BasicConstant.STATUS_CANCELLED, body.cancel_date, body.production_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Cancel production success"))
                }
                db.end()
            }
        )
    }

    reject(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE productions SET status = ?, reject_date = ? WHERE id = ?",
            [BasicConstant.STATUS_REJECTED, body.reject_date, body.production_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    callback(null, baseResp(200, "Reject production success"))
                }
                db.end()
            }
        )
    }

    process(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "UPDATE productions SET status = ?, process_date = ? WHERE id = ?",
            [BasicConstant.STATUS_PROCESS, body.process_date, body.production_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    let sqlQuery = "INSERT INTO inventory_items VALUES "
                    let sqlValues = JSON.parse(body.material).map((data) => {
                        return `(NULL, ${data.inventory_id}, '${data.quantity}', 'Production ${body.production_id}', '${BasicConstant.ITEM_KELUAR}')`
                    })
                    db2.query(
                        sqlQuery + sqlValues.join(","),
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Process production success"))
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
            "UPDATE productions SET status = ?, done_date = ? WHERE id = ?",
            [BasicConstant.STATUS_DONE, body.done_date, body.production_id],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    let sqlQuery = "INSERT INTO inventory_items VALUES "
                    let sqlValues = JSON.parse(body.product).map((data) => {
                        return `(NULL, ${data.inventory_id}, '${data.quantity}', 'Production ${body.production_id}', '${BasicConstant.ITEM_MASUK}')`
                    })
                    db2.query(
                        sqlQuery + sqlValues.join(","),
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Done production success"))
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