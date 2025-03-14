const mongoose = require('mongoose');
const DB_URI = process.env.DB_URI

const dbConnect = async () => {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log(`[db] connected to: ${DB_URI}`)

    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = { dbConnect, mongoose }