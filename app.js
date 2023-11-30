import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { inventoryRouter } from "./src/routes/inventoryRouter.js"
import { orderRouter } from "./src/routes/orderRouter.js"
import { procurementRouter } from "./src/routes/procurementRouter.js"
import { productionRouter } from "./src/routes/productionRouter.js"
import { userRouter } from "./src/routes/userRouter.js"

dotenv.config()
const app = express()
const port = 5000

app.use(cors())
app.use("/user", userRouter)
app.use("/inventory", inventoryRouter)
app.use("/production", productionRouter)
app.use("/order", orderRouter)
app.use("/procurement", procurementRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})