import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { userRouter } from './src/routes/userRouter.js'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(cors())
app.use('/user', userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})