const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')

// check ObjectId is valid
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    // create a pet
    static async create(req, res) {

        const { name, age, weight, color } = req.body
        const images = req.files

        const available = true

        // validation
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório!' })
        if (!age) return res.status(422).json({ message: 'A idade é obrigatória!' })
        if (!weight) return res.status(422).json({ message: 'O peso é obrigatório!' })
        if (!color) return res.status(422).json({ message: 'A cor é obrigatória!' })
        if (images.length === 0) return res.status(422).json({ message: 'A imagem é obrigatória!' })

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => { pet.images.push(image.filename) })

        try {
            const newPet = await pet.save()
            return res.status(201).json({ message: 'Pet cadastrado com sucesso!', newPet })
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({ pets: pets })
    }

    static async getAllUserPets(req, res) {

        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
        return res.status(200).json({ pets: pets })
    }

    static async getAllUserAdoptions(req, res) {

        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')
        return res.status(200).json({ pets: pets })
    }

    static async getPetById(req, res) {

        const id = req.params.id

        // check if pet exists
        if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido!' })


        const pet = await Pet.findOne({ _id: id })
        if (!pet) return res.status(404).json({ message: 'Pet não encontrado!' })

        return res.status(200).json({ pet: pet })
    }

    static async removePetById(req, res) {

        const id = req.params.id

        // check if pet exists
        if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido!' })

        const pet = await Pet.findOne({ _id: id })
        if (!pet) return res.status(404).json({ message: 'Pet não encontrado!' })

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // if user logged is the pet owner
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
        }

        await Pet.findByIdAndRemove(id)
        return res.status(200).json({ message: 'Pet removido com sucesso!' })
    }

    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color, available } = req.body
        const images = req.files

        console.log(req.files);

        const updatedData = {}

        // check if pet exists
        if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido!' })

        const pet = await Pet.findOne({ _id: id })
        if (!pet) return res.status(404).json({ message: 'Pet não encontrado!' })

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // if user logged is the pet owner
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
        }

        // validation
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório!' })
        if (!age) return res.status(422).json({ message: 'A idade é obrigatória!' })
        if (!weight) return res.status(422).json({ message: 'O peso é obrigatório!' })
        if (!color) return res.status(422).json({ message: 'A cor é obrigatória!' })

        if (images.length !== 0) {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }
        updatedData.name = name
        updatedData.age = age
        updatedData.weight = weight
        updatedData.color = color


        console.log('updatedData', updatedData);
        await Pet.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: 'Pet atualizado com sucesso!' })
    }

    static async schedule(req, res) {
        const id = req.params.id

        // check if pet exists
        if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido!' })

        const pet = await Pet.findOne({ _id: id })
        if (!pet) return res.status(404).json({ message: 'Pet não encontrado!' })

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // if user logged is NOT the pet owner
        if (pet.user._id.equals(user._id)) return res.status(422).json({ message: 'Você não pode agendar uma visita com seu próprio Pet!' })

        // check if user has already scheduled a visit
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                return res.status(422).json({ message: 'Você já agendou uma visita para este Pet!' })
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}` })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

         // check if pet exists
         if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido!' })

         const pet = await Pet.findOne({ _id: id })
         if (!pet) return res.status(404).json({ message: 'Pet não encontrado!' })

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // if user logged is the pet owner
        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({ message: 'Parabáns!! O ciclo de adoção foi finalizado com sucesso!' })
    }
}