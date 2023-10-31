import express from 'express'
import multer from 'multer'
import * as inventoryModel from '../models/inventoryModel.js'
import { authenticateJwt, checkRequest } from './authMiddleware.js'

export const inventoryRouter = express.Router()

inventoryRouter.post('/create', multer().none(), authenticateJwt(['admin']), checkRequest(['item_name', 'description', 'unit', 'price']), async (req, res) => {
    inventoryModel.create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post('/update', multer().none(), authenticateJwt(['admin']), checkRequest(['id', 'item_name', 'description', 'unit', 'price']), async (req, res) => {
    inventoryModel.update(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

inventoryRouter.post('/delete', multer().none(), authenticateJwt(['admin']), checkRequest(['id']), async (req, res) => {
    inventoryModel.remove(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})