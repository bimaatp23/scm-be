import jwt from 'jsonwebtoken'
import { baseResp } from '../../baseResp.js'

export const authenticateJwt = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  let resp
  if (!token) {
    resp = baseResp(401, 'Unauthorized')
    return res.status(resp.error_schema.error_code).json(resp)
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      resp = baseResp(402, 'Invalid token')
      return res.status(resp.error_schema.error_code).json(resp)
    }

    req.payload = payload
    next()
  })
}