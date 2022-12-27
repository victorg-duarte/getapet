const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// helpers
const createUserToken = require('../helpers/createUserToken');
const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');

module.exports = class UserController {
    static async register(req, res) {

        const { name, email, phone, password, confirmPassword } = req.body

        // validation
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório' })
        if (!email) return res.status(422).json({ message: 'O email é obrigatório' })
        if (!phone) return res.status(422).json({ message: 'O telefone é obrigatório' })
        if (!password) return res.status(422).json({ message: 'A senha é obrigatório' })
        if (!confirmPassword) return res.status(422).json({ message: 'A confirmação de senha é obrigatório' })
        if (password !== confirmPassword) return res.status(422).json({ message: 'A senha e a confirmação de senha não são iguais!' })

        // check if user exists
        const userExists = await User.findOne({ email: email })
        if (userExists) return res.status(422).json({ message: 'Email já esta sendo usado. Utilize outro!' })

        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user
        const user = new User({ name, email, phone, password: passwordHash })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
            return

        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) return res.status(422).json({ message: 'O email é obrigatório' })
        if (!password) return res.status(422).json({ message: 'A senha é obrigatório' })

        // check if user exists
        const user = await User.findOne({ email: email })
        if (!user) return res.status(422).json({ message: 'Não há usuário cadastrado com este email!' })

        // check if password match with db password
        // descriptografa a senha e compara com a senha do req.body
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.status(422).json({ message: 'Senha inválida!' })

        // autenticacao login
        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {

        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'SECRET_KEY_TOKEN')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        } else {
            currentUser = null
        }

        return res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        // validation id
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(422).json({ message: 'Usuário não foi encontrado!' })

        const user = await User.findById(id).select('-password')
        if (!user) return res.status(422).json({ message: 'Usuário não foi encontrado!' })

        return res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        // check id user exists by token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmPassword } = req.body

        // validation id (character hexadecimal)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(422).json({ message: 'Usuário não foi encontrado!' })

        if (req.file) user.image = req.file.filename
        
        // validation
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório' })
        if (!email) return res.status(422).json({ message: 'O email é obrigatório' })
        if (!phone) return res.status(422).json({ message: 'O telefone é obrigatório' })

        // check if email has already taken
        const userExists = await User.findOne({ email: email })
        if (user.email !== email && userExists) return res.status(422).json({ message: 'Por favor, utilize outro email!' })
            
        user.name = name
        user.email = email
        user.phone = phone

        if (password !== confirmPassword) {
            return res.status(422).json({ message: 'A senha e a confirmação de senha não são iguais!' })
        } else if (password === confirmPassword && password != null) {

            // creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }
        try {
            // returns user updated data
            await User.findOneAndUpdate(
                { _id: user.id },
                { $set: user },
                { new: true },
            )
            return res.status(200).json({ message: 'Usuário atualizado com sucesso!' })

        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }
}