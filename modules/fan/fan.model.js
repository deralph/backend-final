const mongoose = require("mongoose")

const fanSchema = new mongoose.Schema({

},
    {
        timestamps: true
    }
)



const Fans = mongoose.model("fans", fanSchema)
module.exports = Fans