const mongoose = require("mongoose")

const tapSchema = new mongoose.Schema({
    tagId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags",
        required: true
    },
    tapCount: {
        success: { type: Number, default: 0 },  // count to be enforced in application logic.
        fails: { type: Number, default: 0 }
    }
},
    {
        timestamps: true
    }
)


const Taps = mongoose.model("taps", tapSchema)

module.exports = Taps