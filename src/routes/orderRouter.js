import express from "express"
import multer from "multer"
import orderModel from "../models/orderModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const orderRouter = express.Router()

orderRouter.get("/list", authenticateJwt(["admin", "distribusi", "retail"]), async (req, res) => {
    new orderModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/create", multer().none(), authenticateJwt(["retail"]), checkRequest(["order_id", "user_retail", "total", "submit_date", "data"]), async (req, res) => {
    new orderModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/reject", multer().none(), authenticateJwt(["distribusi"]), checkRequest(["order_id", "reject_date"]), async (req, res) => {
    new orderModel().reject(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})