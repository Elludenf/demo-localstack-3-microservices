const { AwsSqsAdapter } = require('../aws-sqs')

module.exports = new AwsSqsAdapter(process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY, process.env.AWS_REGION)
