import express from 'express'
import multer from 'multer'
import * as userModel from '../models/userModel.js'

export const userRouter = express.Router()

userRouter.post('/login', multer().none(), async (req, res) => {
    console.log(req.body)
    userModel.login(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})