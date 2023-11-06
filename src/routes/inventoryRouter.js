import express from "express"
import multer from "multer"
import inventoryModel from "../models/inventoryModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const inventoryRouter = express.Router()

inventoryRouter.get("/stock", authenticateJwt(["admin", "gudang", "retail"]), async (req, res) => {
    new inventoryModel().stock(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/create", multer().none(), authenticateJwt(["admin"]), checkRequest(["item_name", "description", "unit", "price"]), async (req, res) => {
    new inventoryModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/update", multer().none(), authenticateJwt(["admin"]), checkRequest(["id", "item_name", "description", "unit", "price"]), async (req, res) => {
    new inventoryModel().update(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/delete", multer().none(), authenticateJwt(["admin"]), checkRequest(["id"]), async (req, res) => {
    new inventoryModel().delete(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post("/create-item", multer().none(), authenticateJwt(["gudang"]), checkRequest(["inventory_id", "quantity", "status"]), async (req, res) => {
    new inventoryModel().createItem(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})