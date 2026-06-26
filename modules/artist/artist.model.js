const mongoose = require("mongoose")
const ACCOUNT = require("../../shared/constants/account")

const artistSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isEmailConfirmed: { type: Boolean },
    emailConfirmedAt: { type: Date, default: null },
    emailVerified: { type: Boolean, default: null },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true, select: false },
    accountType: { type: String, default: ACCOUNT.TYPE.ARTIST, enum: [ACCOUNT.TYPE.ARTIST] },
    accountStatus: { type: String, default: ACCOUNT.STATUS.ACIVE },
},
    {
        timestamps: true
    }
)



const Artists = mongoose.model("Artists", artistSchema)
module.exports = Artists