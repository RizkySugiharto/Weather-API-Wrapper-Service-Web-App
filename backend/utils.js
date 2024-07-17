function returnGeneralError(error, reply) {
    if (process.env.NODE_ENV === 'development') {
        return reply.code(error.statusCode || 500).send(error)
    }
    return reply.code(error.statusCode || 500).send({ success: false })
}

module.exports = {
    returnGeneralError
}