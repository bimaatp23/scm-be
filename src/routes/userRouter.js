import express from 'express'
import multer from 'multer'
import * as userModel from '../models/userModel.js'
import { authenticateJwt, checkRequest } from './authMiddleware.js'

export const userRouter = express.Router()

userRouter.post('/login', multer().none(), checkRequest(['username', 'password']), async (req, res) => {
    userModel.login(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.get('/list', authenticateJwt(['admin']), async (req, res) => {
    userModel.getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post('/create-user', multer().none(), authenticateJwt(['admin']), checkRequest(['name', 'username', 'role']), async (req, res) => {
    userModel.createUser(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post('/update-user', multer().none(), authenticateJwt(['admin']), checkRequest(['name', 'username', 'role']), async (req, res) => {
    userModel.updateUser(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post('/delete-user', multer().none(), authenticateJwt(['admin']), checkRequest(['username']), async (req, res) => {
    userModel.deleteUser(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post('/create-retail', multer().none(), checkRequest(['username', 'name', 'business_name', 'address', 'email', 'phone']), async (req, res) => {
    userModel.createRetail(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})