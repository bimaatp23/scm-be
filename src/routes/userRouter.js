import express from 'express'
import multer from 'multer'
import { unauthorizedResp } from '../../baseResp.js'
import * as userModel from '../models/userModel.js'
import { authenticateJwt, authenticateRole } from './AuthMiddleware.js'

export const userRouter = express.Router()

userRouter.post('/login', multer().none(), async (req, res) => {
    userModel.login(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.get('/all', authenticateJwt, async (req, res) => {
    if (!authenticateRole(req, ['admin'])) return res.status(401).json(unauthorizedResp)
    userModel.getAll(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post('/create-retail', multer().none(), async (req, res) => {
    userModel.createRetail(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})