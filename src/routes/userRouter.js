import express from "express"
import multer from "multer"
import userModel from "../models/UserModel.js"
import { authenticateJwt, checkRequest } from "./authMiddleware.js"

export const userRouter = express.Router()

userRouter.post("/login", multer().none(), checkRequest(["username", "password"]), async (req, res) => {
    new userModel().login(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.get("/list", authenticateJwt(["admin"]), async (req, res) => {
    new userModel().getList(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post("/create", multer().none(), authenticateJwt(["admin"]), checkRequest(["name", "username", "role"]), async (req, res) => {
    new userModel().create(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post("/update", multer().none(), authenticateJwt(["admin"]), checkRequest(["name", "username", "role"]), async (req, res) => {
    new userModel().update(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post("/delete", multer().none(), authenticateJwt(["admin"]), checkRequest(["username"]), async (req, res) => {
    new userModel().delete(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post("/change-password", multer().none(), authenticateJwt(), checkRequest(["old_password", "new_password", "renew_password"]), async (req, res) => {
    new userModel().changePassword(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})

userRouter.post("/create-retail", multer().none(), checkRequest(["name", "username", "password", "re_password", "business_name", "address", "email", "phone"]), async (req, res) => {
    new userModel().createRetail(req, (err, resp) => {
        return res.status(resp.error_schema.error_code).json(resp)
    })
})