const fp = require('fastify-plugin')
const { validate: uuidValidate } = require('uuid')
const { version: uuidVersion } = require('uuid')
const { Forbidden } = require('http-errors')

module.exports = fp(function(fastify, opts, done) {
    fastify.addHook('preValidation', (req, reply, done) => {
        try {
            const userId = req.headers['x-client-id']
            const isValid = uuidValidate(userId) && uuidVersion(userId) === 7
    
            if (!isValid) {
                throw Forbidden("Client is Forbidden")
            }
        } catch (error) {
            reply.code(error.statusCode || 500).send(error)
        }

        done()
    })

    done()
})