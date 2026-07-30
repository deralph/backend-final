const asyncHandler = require("express-async-handler");
const Perks = require("../model/perk.model");
const PerkCategory = require("../model/perkCategory.model")

const createPerk = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId;

    const {
        perkName,
        perkCategoryId,
        contentType,
        description,
    } = req.body;

    if (!perkName || !perkCategoryId || !contentType) {
        const error = new Error("Required fields missing");
        error.statusCode = 400;
        throw error;
    }

    // validate perks categoryId
    const isPerkCategoryValid = await PerkCategory.findById(perkCategoryId)
    if(!isPerkCategoryValid){
 const error = new Error("Perk category does not exist");
        error.statusCode = 400;
        throw error;
    }

    const fileUrl = req.file?.path || req.fileUrl || req.body.fileUrl || null;
    if(!fileUrl){
        const error = new Error("No file attached, file is required");
        error.statusCode = 400;
        throw error;
    }

    const perk = await Perks.create({
        artistId,
        perkName,
        perkCategoryId,
        contentType,
        fileUrl,
        description,
    });

    res.status(201).json({
        success: true,
        message: "Perk created successfully",
        data: perk,
    });
});

const getPerks = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [perks, total] = await Promise.all([
        Perks.find({ artistId })
            .populate("perkCategoryId", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Perks.countDocuments({ artistId }),
    ]);

    res.status(200).json({
        success: true,
        data: perks,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
});

const updatePerk = asyncHandler(async (req, res) => {
    const artistId = req.user.accountId;
    const { perkId } = req.params;

    const perk = await Perks.findOne({
        _id: perkId,
        artistId,
    });

    if (!perk) {
        const error = new Error("Perk not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = [
        "perkName",
        "perkCategoryId",
        "contentType",
        "description",
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            perk[field] = req.body[field];
        }
    });

    if (req.file?.path) {
        perk.fileUrl = req.file.path;
    }

    const updatedPerk = await perk.save();

    res.status(200).json({
        success: true,
        message: "Perk updated successfully",
        data: updatedPerk,
    });
});

const deletePerk = asyncHandler(async (req, res) => {

    const artistId = req.user.accountId;
    const { perkId } = req.params;

    const perk = await Perks.findOne({
        _id: perkId,
        artistId,
    });

    if (!perk) {
        const error = new Error("Perk not found");
        error.statusCode = 404;
        throw error;
    }

    await perk.deleteOne();

    res.status(200).json({
        success: true,
        message: "Perk deleted successfully",
    });
});


module.exports = {
    createPerk, getPerks, updatePerk, deletePerk
};