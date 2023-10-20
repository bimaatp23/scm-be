import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2'
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
        callback(err)
      } else {
        const row = result
        callback(null, result)
      }
      db.end()
    }
  )
}

app.get('/', (req, res) => {
    test(req, (err, resp) => {
      if (err) return res.status(500).json(err)
      else return res.status(200).json(resp)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})