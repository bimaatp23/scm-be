import express from "express"
import multer from "multer"
import BasicConstant from "../BasicConstant.js"
import inventoryModel from "../models/inventoryModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const inventoryRouter = express.Router()

inventoryRouter.get("/list", authenticateJwt([BasicConstant.ROLE_ADMIN, BasicConstant.ROLE_PENGADAAN, BasicConstant.ROLE_GUDANG, BasicConstant.ROLE_PRODUKSI, BasicConstant.ROLE_DISTRIBUSI, BasicConstant.ROLE_RETAIL, BasicConstant.ROLE_SUPPLIER]), async (req, res) => {
    new inventoryModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.get("/item-list", authenticateJwt([BasicConstant.ROLE_ADMIN, BasicConstant.ROLE_GUDANG, BasicConstant.ROLE_DISTRIBUSI]), async (req, res) => {
    new inventoryModel().getItemList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/create", multer().none(), authenticateJwt([BasicConstant.ROLE_ADMIN]), checkRequest(["item_name", "description", "unit", "tipe", "price"]), async (req, res) => {
    new inventoryModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/update", multer().none(), authenticateJwt([BasicConstant.ROLE_ADMIN]), checkRequest(["id", "item_name", "description", "unit", "tipe", "price"]), async (req, res) => {
    new inventoryModel().update(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/delete", multer().none(), authenticateJwt([BasicConstant.ROLE_ADMIN]), checkRequest(["id"]), async (req, res) => {
    new inventoryModel().delete(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/create-item", multer().none(), authenticateJwt([BasicConstant.ROLE_GUDANG]), checkRequest(["inventory_id", "quantity", "status"]), async (req, res) => {
    new inventoryModel().createItem(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})