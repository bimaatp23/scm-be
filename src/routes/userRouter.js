import express from 'express'
import * as userModel from '../models/userModel.js'

export const userRouter = express.Router()

userRouter.get('/all', async (req, res) => {
    userModel.getUsers(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})