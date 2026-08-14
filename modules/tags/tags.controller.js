const Tags = require("./tag.model")


// get all tags
const getTags = asyncHandler(async (req, res) => {

    const artistId = req.user.accountId
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Tags.find({ artistId })  //make the artistId in campaignId equals the artistId from the query
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Tags.countDocuments(),
    ]);

    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
});

// get campaign all tags
const getCampaignTags = asyncHandler(async (req, res) => {

    const artistId = req.user.accountId
    const { campaignId } = req.params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
        Tags.find({ campaignId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Tags.countDocuments(),
    ]);

    res.status(200).json({
        success: true,
        data: { tags },
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
});


module.exports = { getTags, getCampaignTags }