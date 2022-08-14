const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const payload = jwt.verify(token, 'phamCongDongSecret')
    req.user = payload
    next()
  } catch {
    res.status(500).json({ message: 'Token is not valid' })
  }
}
