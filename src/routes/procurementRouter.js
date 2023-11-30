import express from "express"
import multer from "multer"
import BasicConstant from "../BasicConstant.js"
import procurementModel from "../models/procurementModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const procurementRouter = express.Router()

procurementRouter.get("/list", authenticateJwt([BasicConstant.ROLE_ADMIN, BasicConstant.ROLE_PENGADAAN, BasicConstant.ROLE_SUPPLIER]), async (req, res) => {
    new procurementModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/create", multer().none(), authenticateJwt([BasicConstant.ROLE_PENGADAAN]), checkRequest(["procurement_id", "user_supplier", "total", "submit_date", "data"]), async (req, res) => {
    new procurementModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/cancel", multer().none(), authenticateJwt([BasicConstant.ROLE_PENGADAAN]), checkRequest(["procurement_id", "cancel_date"]), async (req, res) => {
    new procurementModel().cancel(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/reject", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["procurement_id", "reject_date"]), async (req, res) => {
    new procurementModel().reject(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/process", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["procurement_id", "process_date"]), async (req, res) => {
    new procurementModel().process(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/delivery", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["procurement_id", "delivery_date"]), async (req, res) => {
    new procurementModel().delivery(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/arrival", multer().none(), authenticateJwt([BasicConstant.ROLE_PENGADAAN]), checkRequest(["procurement_id", "arrival_date", "data"]), async (req, res) => {
    new procurementModel().arrival(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

procurementRouter.post("/done", multer().none(), authenticateJwt([BasicConstant.ROLE_SUPPLIER]), checkRequest(["procurement_id", "done_date"]), async (req, res) => {
    new procurementModel().done(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})