async function main() {
    const utils = require('./utils')
    const countries = require('./json/countries.json')
    
    // Load environment configurations
    const config = require('./config')
    config.loadConfig()
    
    // Initliaze the app
    const logger = require('./logger')
    const fastify = require('fastify')({
        logger: logger
    })
    
    // Register other plugins
    fastify.register(require('@fastify/redis'), {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    })
    fastify.register(require('@fastify/cors'), {
        origin: process.env.ALLOWED_ORIGINS.split(' '),
        exposedHeaders: ['X-Ratelimit-Reset', 'Retry-After']
    })
    await fastify.register(require('@fastify/rate-limit'), {
        max: Number(process.env.ALLOWED_REQUEST_PER_MINUTE),
        timeWindow: 60 * 1000,
        hook: 'preHandler',
        keyGenerator: (req) => req.headers['x-client-id']
    })
    fastify.register(require('./plugins/clientValidation'))
    fastify.register(require('@fastify/compress'))
    
    // Register all routes
    const API_VERSION = 1
    fastify.get(`/v${API_VERSION}/:code`, async (req, reply) => {
        try {
            const countryCode = req.params.code
            const result = {code: countryCode, description: ''}
            const { redis } = fastify
        
            const isExists = await redis.exists(countryCode) === 1
            if (isExists) {
                fastify.log.info("Country cache is exists")
                result.description = await redis.get(countryCode)
                return reply.code(200).send(result)
            }
            
            // 43200 Seconds -> 12 Hours
            fastify.log.info("Country cache isn't exists")
            const data = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${countries[countryCode].name}?unitGroup=metric&key=${process.env.VC_KEY}&contentType=json`)
                .then(res => res.json())
            await redis.set(countryCode, data.description, 'EX', 43200)
    
            fastify.log.info(data.description)
            result.description = data.description
            return reply.code(200).send(result)
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })
    
    // Add default ('hello world') route
    fastify.get('/', async (req, reply) => {
        return "Hello, World"
    })
    
    // Listen the app
    fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`Server listening on: ${address}`)
    })
}

main()