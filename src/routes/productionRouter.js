import express from "express"
import multer from "multer"
import BasicConstant from "../BasicConstant.js"
import productionModel from "../models/productionModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const productionRouter = express.Router()

productionRouter.get("/list", authenticateJwt([BasicConstant.ROLE_ADMIN, BasicConstant.ROLE_GUDANG, BasicConstant.ROLE_PRODUKSI]), async (req, res) => {
    new productionModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productionRouter.post("/create", multer().none(), authenticateJwt([BasicConstant.ROLE_PRODUKSI]), checkRequest(["production_id", "submit_date", "material", "product"]), async (req, res) => {
    new productionModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productionRouter.post("/cancel", multer().none(), authenticateJwt([BasicConstant.ROLE_PRODUKSI]), checkRequest(["production_id", "cancel_date"]), async (req, res) => {
    new productionModel().cancel(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productionRouter.post("/reject", multer().none(), authenticateJwt([BasicConstant.ROLE_GUDANG]), checkRequest(["production_id", "reject_date"]), async (req, res) => {
    new productionModel().reject(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productionRouter.post("/process", multer().none(), authenticateJwt([BasicConstant.ROLE_GUDANG]), checkRequest(["production_id", "process_date", "material"]), async (req, res) => {
    new productionModel().process(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

productionRouter.post("/done", multer().none(), authenticateJwt([BasicConstant.ROLE_PRODUKSI]), checkRequest(["production_id", "done_date", "product"]), async (req, res) => {
    new productionModel().done(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})