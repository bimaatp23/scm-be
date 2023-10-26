import express from 'express'
import multer from 'multer'
import * as userModel from '../models/userModel.js'
import { authenticateJwt } from './authMiddleware.js'

export const userRouter = express.Router()

userRouter.post('/login', multer().none(), async (req, res) => {
    userModel.login(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.get('/all', authenticateJwt(['admin']), async (req, res) => {
    userModel.getAll(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post('/create-retail', multer().none(), async (req, res) => {
    userModel.createRetail(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})