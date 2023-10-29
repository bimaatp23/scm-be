import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { inventoryItemRouter } from './src/routes/inventoryItemRouter.js'
import { inventoryRouter } from './src/routes/inventoryRouter.js'
import { userRouter } from './src/routes/userRouter.js'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(cors())
app.use('/user', userRouter)
app.use('/inventory', inventoryRouter)
app.use('/inventory-item', inventoryItemRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})