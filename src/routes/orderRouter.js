import express from "express"
import multer from "multer"
import BasicConstant from "../BasicConstant.js"
import orderModel from "../models/orderModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const orderRouter = express.Router()

orderRouter.get("/list", authenticateJwt([BasicConstant.ROLE_ADMIN, BasicConstant.ROLE_DISTRIBUSI, BasicConstant.ROLE_RETAIL]), async (req, res) => {
    new orderModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/create", multer().none(), authenticateJwt([BasicConstant.ROLE_RETAIL]), checkRequest(["order_id", "user_retail", "total", "submit_date", "data"]), async (req, res) => {
    new orderModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/cancel", multer().none(), authenticateJwt([BasicConstant.ROLE_RETAIL]), checkRequest(["order_id", "cancel_date"]), async (req, res) => {
    new orderModel().cancel(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/reject", multer().none(), authenticateJwt([BasicConstant.ROLE_DISTRIBUSI]), checkRequest(["order_id", "reject_date"]), async (req, res) => {
    new orderModel().reject(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/process", multer().none(), authenticateJwt([BasicConstant.ROLE_DISTRIBUSI]), checkRequest(["order_id", "process_date"]), async (req, res) => {
    new orderModel().process(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

orderRouter.post("/delivery", multer().none(), authenticateJwt([BasicConstant.ROLE_DISTRIBUSI]), checkRequest(["order_id", "delivery_date"]), async (req, res) => {
    new orderModel().delivery(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})