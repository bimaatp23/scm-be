import express from "express"
import multer from "multer"
import BasicConstant from "../BasicConstant.js"
import productModel from "../models/productModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const productRouter = express.Router()

productRouter.get("/list", authenticateJwt([BasicConstant.ROLE_SUPPLIER]), async (req, res) => {
    new productModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productRouter.post("/create", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["inventory_id", "price", "user_supplier"]), async (req, res) => {
    new productModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productRouter.post("/update", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["id", "price"]), async (req, res) => {
    new productModel().update(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productRouter.post("/delete", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["id"]), async (req, res) => {
    new productModel().delete(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})