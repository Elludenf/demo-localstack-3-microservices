const AWS = require('aws-sdk')

class AwsSnsAdapter {
  constructor (accessKeyId, secretAccessKey, region, opts = {}) {
    if (process.env.LOCALSTACK_ENDPOINT) {
      opts.endpoint = process.env.LOCALSTACK_ENDPOINT
    }
    this._sns = new AWS.SNS({ accessKeyId, secretAccessKey, region, ...opts })
  }

  publish (topic, subject, message) {
    const params = {
      TopicArn: topic,
      Subject: subject,
      Message: message
    }
    return this._sns.publish(params).promise()
  }
}

module.exports = { AwsSnsAdapter }
