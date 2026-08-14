const Taps = require("./tap.model")

async function tapTag(tagId, ownerId, success, deviceType, location, tapType, session) {
    const tap = new Taps({
        tagId,
        userId: ownerId,
        success,
        tapType,
        deviceType,
        location: { country: location.country, state: location.state, city: location.city }
    })
    await tap.save({ session })
}


module.exports = { tapTag }