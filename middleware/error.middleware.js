const errorMiddleware = (err, req, res, next) => {

    return res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server Error" })
}

module.exports = errorMiddleware