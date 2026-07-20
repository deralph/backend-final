const mongoose = require("mongoose")

const TagSchema = mongoose.Schema({

    tagId: {
        type: String,  //generated UUID
        required: true
    },
    campaignProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaign-products",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["inactive", "activated", "disabled"],
        default: "inactive"
    }
},
    {
        timestamps: true
    }
)


const Tags = mongoose.model("tags", TagSchema)

module.exports = Tags