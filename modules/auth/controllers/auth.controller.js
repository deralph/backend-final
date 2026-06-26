const asyncHandler = require("express-async-handler")
const Artists = require("../../artist/artist.model")
const hashPassword = require("../../../shared/utils/hashPassword")
const generateJWT = require("../../../shared/utils/JWT")
const comparePassword = require("../../../shared/utils/comparePassword")


const registerArtist = asyncHandler(async (req, res) => {

    // collect req data
    const { firstName, middleName, lastName, userName, email, phone, password } = req.body

    // check for empty fields
    if (!firstName || !lastName || !userName || !phone || !email || !password) {
        const error = new Error("Required fields missing")
        error.statusCode = 400
        throw error
    }

    const isEmailExist = await Artists.findOne({ email })
    if (isEmailExist) {
        const error = new Error("Email already registered with another account")
        error.statusCode = 400
        throw error
    }

    const isPhoneExist = await Artists.findOne({ phone })
    if (isPhoneExist) {
        const error = new Error("Phone number already registered with another account")
        error.statusCode = 400
        throw error
    }

    const isPasswordLengthValid = password.length >= 8
    if (!isPasswordLengthValid) {
        const error = new Error("Minimum password character required is 8")
        error.statusCode = 400
        throw error
    }

    // hash password
    const hashedPassword = await hashPassword(password)


    // register artist
    const artist = await Artists.create({
        firstName,
        middleName,
        lastName,
        userName,
        email,
        phone,
        password: hashedPassword
    })

    if (!artist) {
        const error = new Error("Internal server error occured creating artist")
        error.statusCode = 500
        throw error
    }

    const payload = { accountId: artist._id, accountType: artist.accountType }
    const accessToken = generateJWT(payload, "accessToken")
    const refreshToken = generateJWT(payload, "refreshToken")

    return res.status(201).json({
        message: "Artist account created successfully",
        success: true,
        refreshToken,
        accessToken,
        data: {
            artist
        }
    })

})


const loginArtist = asyncHandler(async (req, res) => {

    // collect data from req body
    const email = req.body.email?.trim();
    const phone = req.body.phone?.trim();
    const password = req.body.password;

    if ((!email && !phone) || !password) {
        const error = new Error("Required fields missing")
        error.statusCode = 400
        throw error
    }

    // validate data
    let account
    if (email) {
        account = await Artists.findOne({ email })
            .select("+password")
    }
    else {
        account = await Artists.findOne({ phone })
            .select("+password")
    }

    if (!account) {
        const error = new Error("Invalid credentials")
        error.statusCode = 401
        throw error
    }



    // compare password
    if ((account.email == email || account.phone == phone) && (await comparePassword(password, account.password))) {
        // generate tokens
        const payload = { accountId: account._id, accountType: account.accountType }
        const accessToken = generateJWT(payload, "accessToken")
        const refreshToken = generateJWT(payload, "refreshToken")

        return res.status(200).json({
            message: "Login successful", success: true, refreshToken, accessToken, data: {
                firstName: account.firstName,
                middleName: account.middleName,
                lastName: account.middleName,
                email: account.email,
                emailVerified: account.emailVerified,
                accountType: account.accountType
            }
        })
    }


    const error = new Error("Invalid login credentials")
    error.statusCode = 400
    throw error

})

const artistProfile = asyncHandler(async (req, res) => {

    const accountId = req.user.accountId

    const account = await Artists.findById(accountId)

    if (!account) {
        const error = new Error("Account not found")
        error.status = 404
        throw error
    }

    return res.status(200).json({ message: "Account retrieved", success: true, account })

})


module.exports = { loginArtist, registerArtist, artistProfile }