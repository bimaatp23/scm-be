import express from 'express'
import multer from 'multer'
import * as inventoryItemModel from '../models/inventoryItemModel.js'
import { authenticateJwt } from './authMiddleware.js'

export const inventoryItemRouter = express.Router()

inventoryItemRouter.post('/create', multer().none(), authenticateJwt(['admin'], ['inventory_id', 'quantity', 'status']), async (req, res) => {
    inventoryItemModel.create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})