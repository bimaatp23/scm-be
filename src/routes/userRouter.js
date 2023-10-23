import express from 'express'
import multer from 'multer'
import * as userModel from '../models/userModel.js'
import { authenticateJwt } from './AuthMiddleware.js'

export const userRouter = express.Router()

userRouter.post('/login', multer().none(), async (req, res) => {
    userModel.login(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.get('/all', authenticateJwt, async (req, res) => {
    userModel.getAll(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})