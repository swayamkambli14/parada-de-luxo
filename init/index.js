const mongoose = require('mongoose');
const data = require("./data.js")
const listing = require("../model/listing.js")

main()
    .then(() => console.log("Connection successful"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/paradadeluxo');
}

const initDB = async () => { 
    await listing.deleteMany({});
    await listing.insertMany(data.data);
    console.log("Data initialised")
}

initDB();