import express from 'express'
import multer from 'multer'
import * as inventoryItemModel from '../models/inventoryItemModel.js'
import { authenticateJwt, checkRequest } from './authMiddleware.js'

export const inventoryItemRouter = express.Router()

inventoryItemRouter.post('/create', multer().none(), authenticateJwt(['gudang']), checkRequest(['inventory_id', 'quantity', 'status']), async (req, res) => {
    inventoryItemModel.create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryItemRouter.get('/stock', authenticateJwt(['gudang']), async (req, res) => {
    inventoryItemModel.stock(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})