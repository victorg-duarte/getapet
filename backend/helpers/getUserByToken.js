const jwt = require('jsonwebtoken');

const User = require('../models/User')

// get used by jwt token
const getUserByToken = async (token) => {
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    const decoded = jwt.verify(token, 'SECRET_KEY_TOKEN')

    const userId = decoded.id

    const user = await User.findOne({ _id: userId })

    return user
}

module.exports = getUserByToken