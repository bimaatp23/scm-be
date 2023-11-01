import jwt from 'jsonwebtoken'
import { badRequestResp, baseResp, invalidTokenResp, unauthorizedResp } from '../../baseResp.js'

export const authenticateJwt = (allowedRole = []) => (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  let resp
  if (!token) {
    return res.status(unauthorizedResp.error_schema.error_code).json(unauthorizedResp)
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      resp = baseResp(402, 'Invalid token')
      return res.status(invalidTokenResp.error_schema.error_code).json(invalidTokenResp)
    } else if (allowedRole.length > 0) {
      if (!(allowedRole.some(role => role == payload.role))) {
        return res.status(unauthorizedResp.error_schema.error_code).json(unauthorizedResp)
      }
    }
    req.payload = payload
    next()
  })
}

export const checkRequest = (allowedReq = []) => (req, res, next) => {
  if (allowedReq.length > 0) {
    let undefinedCount = 0
    allowedReq.map(element => {
      if (req.body[element] == undefined) {
        undefinedCount = undefinedCount + 1
      }
    })
    if (undefinedCount > 0) {
      return res.status(badRequestResp.error_schema.error_code).json(badRequestResp)
    }
  }
  next()
}