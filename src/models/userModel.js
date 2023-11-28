import mysql from "mysql2"
import { baseResp, errorResp } from "../../baseResp.js"
import { dbConfig } from "../../db.js"
import BasicConstant from "../BasicConstant.js"

export default class userModel {
    login(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [body.username, body.password],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length === 0) {
                    callback(null, baseResp(401, "Incorrect username or password"))
                } else {
                    callback(null, baseResp(200, "Login success", {
                        name: result[0].name,
                        username: result[0].username,
                        role: result[0].role
                    }))
                }
                db.end()
            }
        )
    }

    getList(req, callback) {
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM users",
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const filteredResult = []
                    result.map((data) => {
                        if ([BasicConstant.ROLE_GUDANG, BasicConstant.ROLE_PENGADAAN, BasicConstant.ROLE_PRODUKSI, BasicConstant.ROLE_DISTRIBUSI].includes(data.role)) {
                            filteredResult.push({
                                name: data.name,
                                username: data.username,
                                role: data.role
                            })
                        }
                    })
                    callback(null, baseResp(200, "Get user list success", filteredResult))
                }
                db.end()
            }
        )
    }

    create(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        const defaultPassword = "scm"
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [body.username],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length !== 0) {
                    callback(null, baseResp(409, "Username already exists"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO users VALUES (NULL, ?, ?, ?, ?)",
                        [body.name, body.username, body.role, defaultPassword],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Create user success", {
                                    name: body.name,
                                    username: body.username,
                                    role: body.role,
                                    password: defaultPassword
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
            "SELECT * FROM users WHERE username = ?",
            [body.username],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length === 0) {
                    callback(null, baseResp(404, "Username not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "UPDATE users SET name = ?, role = ? WHERE username = ?",
                        [body.name, body.role, body.username],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Update user success", {
                                    name: body.name,
                                    username: body.username,
                                    role: body.role
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
            "SELECT * FROM users WHERE username = ?",
            [body.username],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length === 0) {
                    callback(null, baseResp(404, "Username not found"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "DELETE FROM users WHERE username = ?",
                        [body.username],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Delete user success", {
                                    name: result[0].name,
                                    username: result[0].username,
                                    role: result[0].role
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

    changePassword(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [req.payload.username],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length === 0) {
                    callback(null, baseResp(404, "Username not found"))
                } else if (result[0].password !== body.old_password) {
                    callback(null, baseResp(401, "Incorrect old password"))
                } else if (body.new_password !== body.renew_password) {
                    callback(null, baseResp(400, "New passwords do not match"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.query(
                        "UPDATE users SET password = ? WHERE username = ?",
                        [body.new_password, req.payload.username],
                        (err2) => {
                            if (err2) {
                                callback(err2, errorResp(err2.message))
                            } else {
                                callback(null, baseResp(200, "Change password success"))
                            }
                            db2.end()
                        }
                    )
                }
                db.end()
            }
        )
    }

    createRetail(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [body.username],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length !== 0) {
                    callback(null, baseResp(409, "Username already exists"))
                } else if (body.password !== body.re_password) {
                    callback(null, baseResp(400, "Passwords do not match"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.beginTransaction((err2) => {
                        if (err2) {
                            callback(err2, errorResp(err2.message))
                        }
                        db2.query(
                            "INSERT INTO users VALUES (NULL, ?, ?, ?, ?)",
                            [body.name, body.username, BasicConstant.ROLE_RETAIL, body.password],
                            (err2) => {
                                if (err2) {
                                    return db2.rollback(() => {
                                        callback(err2, errorResp(err2.message))
                                    })
                                }
                            }
                        )
                        db2.query(
                            "INSERT INTO retails VALUES (?, ?, ?, ?, ?)",
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
                        callback(null, baseResp(200, "Create retail success", {
                            username: body.username,
                            name: body.name,
                            business_name: body.business_name,
                            address: body.address,
                            email: body.email,
                            phone: body.phone
                        }))
                        db2.end()
                    })
                }
                db.end()
            }
        )
    }

    createSupplier(req, callback) {
        const body = req.body
        const db = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [body.username],
            (err, result) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else if (result.length !== 0) {
                    callback(null, baseResp(409, "Username already exists"))
                } else if (body.password !== body.re_password) {
                    callback(null, baseResp(400, "Passwords do not match"))
                } else {
                    const db2 = mysql.createConnection(dbConfig)
                    db2.beginTransaction((err2) => {
                        if (err2) {
                            callback(err2, errorResp(err2.message))
                        }
                        db2.query(
                            "INSERT INTO users VALUES (NULL, ?, ?, ?, ?)",
                            [body.name, body.username, BasicConstant.ROLE_SUPPLIER, body.password],
                            (err2) => {
                                if (err2) {
                                    return db2.rollback(() => {
                                        callback(err2, errorResp(err2.message))
                                    })
                                }
                            }
                        )
                        db2.query(
                            "INSERT INTO suppliers VALUES (?, ?, ?, ?, ?)",
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
                        callback(null, baseResp(200, "Create supplier success", {
                            username: body.username,
                            name: body.name,
                            business_name: body.business_name,
                            address: body.address,
                            email: body.email,
                            phone: body.phone
                        }))
                        db2.end()
                    })
                }
                db.end()
            }
        )
    }
}