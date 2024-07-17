const date = require('date-and-time')
const LOG_FILENAME = `${date.format(new Date(), 'DD-MM-YYYY')}.log`
const LOG_DIR = 'logs'

module.exports = {
    transport: {
        targets: process.env.NODE_ENV === 'development' ? [
            {
                target: "@fastify/one-line-logger",
                level: "trace",
                options: {
                    destination: `./${LOG_DIR}/${LOG_FILENAME}`,
                    colorize: false,
                    append: false
                }
            },
            { target: "@fastify/one-line-logger", level: "trace" }
        ] : [
            { target: "@fastify/one-line-logger" }
        ]
    }
}