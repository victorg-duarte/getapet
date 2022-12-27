const jwt = require('jsonwebtoken')
const getToken = require('./getToken')

// middleware to validate token
const checkToken = (req,res,next) =>{
    
    // check if has authorization
    if(!req.headers.authorization) return res.status(401).json({message: 'Acesso negado!'})
    
    const token = getToken(req)

    if(!token) return res.status(401).json({message: 'Acesso negado!'})
    
    try {
        // if not match token, go to catch
        const verified = jwt.verify(token, 'SECRET_KEY_TOKEN')
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({message: 'Token inválido!'})
    }
}

module.exports = checkToken