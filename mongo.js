const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];

console.log(password);

const url = `mongodb+srv://MyMongo:${password}@cluster0.nfqes.mongodb.net/personApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Persone = mongoose.model("Person", personSchema);

const getPersonsList = () => {
    mongoose
    .connect(url)
    .then(() => {
        Persone.find({}).then(result => {
            result.forEach(persone => {
                console.log(persone);
            })
        
            mongoose.connection.close()
        })
    })
    .catch((err) => console.log(err));
}

console.log(1 + 2);

const setPersonInfo = (name, number) => {
    mongoose
    .connect(url)
    .then(() => {
        console.log("connected");

        const persone = new Persone({
            name: name,
            number: number,
        });

        return persone.save();
    })
    .then(() => {
        console.log("note saved!");
        return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}

if (process.argv.length === 5) {
    setPersonInfo(process.argv[3], process.argv[4])
} else {
    getPersonsList();
}