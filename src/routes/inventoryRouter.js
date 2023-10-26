import express from 'express'
import multer from 'multer'
import { unauthorizedResp } from '../../baseResp.js'
import * as inventoryModel from '../models/inventoryModel.js'
import { authenticateJwt, authenticateRole } from './AuthMiddleware.js'

export const inventoryRouter = express.Router()

inventoryRouter.post('/create', authenticateJwt, multer().none(), async (req, res) => {
    if (!authenticateRole(req, ['admin'])) return res.status(401).json(unauthorizedResp)
    inventoryModel.create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})