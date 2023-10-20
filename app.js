import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2'
import { baseResp, errorResp } from './baseResp.js'
import { dbConfig } from './db.js'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(cors())

const test = (req, callback) => {
  const db = mysql.createConnection(dbConfig)
  db.query(
    'SELECT * FROM users',
    (err, result) => {
      if (err) {
        callback(err, errorResp(err))
      } else {
        const row = result
        callback(null, baseResp(200, 'Get User Success', result))
      }
      db.end()
    }
  )
}

app.get('/', (req, res) => {
  test(req, (err, resp) => { return res.status(resp.error_schema.error_code).json(resp) })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})