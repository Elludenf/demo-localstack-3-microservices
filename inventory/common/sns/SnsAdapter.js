const { AwsSnsAdapter } = require('../aws-sns')

module.exports = new AwsSnsAdapter(process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY, process.env.AWS_REGION)
