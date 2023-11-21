import express from "express"
import multer from "multer"
import BasicConstant from "../BasicConstant.js"
import productionModel from "../models/productionModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const productionRouter = express.Router()

productionRouter.post("/create", multer().none(), authenticateJwt([BasicConstant.ROLE_PRODUKSI]), checkRequest(["production_id", "submit_date", "material", "product"]), async (req, res) => {
    new productionModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})