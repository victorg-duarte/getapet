const mongoose = require('mongoose');
const DB_URL =  `mongodb+srv://root:root@cluster0.snfbs.mongodb.net/?retryWrites=true&w=majority`

async function main() {
    await mongoose.connect(DB_URL)
    console.log('Conectou ao Mongoose!');
}

main().catch((err) => console.log(err))

module.exports = mongoose