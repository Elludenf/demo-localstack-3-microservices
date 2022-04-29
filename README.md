# Running SQS and SNS services locally

For this purpose we use the public `localstack` docker image. To see more documentation please see the following repository: https://github.com/localstack/localstack

First set a new profile for aws on your system.
 Set **test** as `aws_access_key_id` and `aws_secret_access_key` . 
 Set **us-east-1** for the `region` in the profile configuration.

```sh

aws configure --profile localstack

```
By default on the `docker-compose.yml` for the `localstack` service
Under volume we run always a setup script tha can be found in the following path `/scripts/localstack-entrypoint`

This script configures localstack we an exact replica of the cloud configuration.

#### List of Queues (SQS).
For the most cases we have one normal queue and one dead letter queue for each microservice. 

 - demo-[env]-sales
 - demo-[env]-inventory
 - demo-[env]-notifications
 - 
 *[env] can be replaced by `local` (default) on local setup(see `/scripts/localstack-entrypoint`), `development`, `staging`, `production`

#### List of Topics (SNS).
There is a topic for each microservice 
 - demo-[env]-sales
 - demo-[env]-inventory
 - demo-[env]-notifications
 
 #### Subscriptions (SNS)

#####   Sales
This queue listens to the following topics

 - notifications
 - inventory
#####   Inventory
This queue listens to the following topics
 - sales
 - notifications

#####   Notifications
This queue listens to the following topics
 - sales
 - inventory

-------------

To build the image and have it ready run the following command in the current workspace.

```sh

docker-compose up localstack

```
When you see the following message **Localstack is ready**. This means localstack has been successfully setup.

Before you can start the other microservices  we need to change some environment variables please make sure all your `.env` files under packages have the following configuration 

```sh

AWS_SNS_TOPIC_ARN_PREFIX=arn:aws:sns:us-east-1:000000000000
AWS_SQS_QUEUE_DOMAIN=http://localstack:4566/000000000000
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_REGION=us-east-1
LOCALSTACK_ENDPOINT=http://localstack:4566

```
*Note1:You can interchange the variable `localstack` for `host.docker.internal` on the urls.  (Windows only fix)


To start the other microservices run  the following command

```sh

docker-compose up sales inventory notifications
```

To check the setup is done we can try the following commands

1)To list all sqs queues

```sh

aws --endpoint-url=http://localhost:4566 sqs list-queues --profile localstack

```

2)To list  all topics


```sh

aws --endpoint-url=http://localhost:4566 sns list-subscriptions --profile localstack

```

3)To purge all queues (deletes all messages from quues)


```sh

aws sqs purge-queue --endpoint-url=http://localhost:4566 --queue-url http://localhost:4566/000000000000/annise-local-sales --profile localstack
aws sqs purge-queue --endpoint-url=http://localhost:4566 --queue-url http://localhost:4566/000000000000/annise-local-inventory --profile localstack
aws sqs purge-queue --endpoint-url=http://localhost:4566 --queue-url http://localhost:4566/000000000000/annise-local-sales --profile localstack

```


 - To send a message (Example: this emits the`Sales:created` topic in the `notifications`  queue). Basically the message should be **stringified** in the `message-body` param.
	```sh

	aws sqs send-message --endpoint-url=http://localhost:4566 --profile localstack --queue-url http://localhost:4566/000000000000/demo-local-notifications --message-body “{\“Subject\“:\“Sales:created\“,\“Message\“:\“{\“quantity\“:30,\“amount\“:10,\“date\“:\“2021-12-01\“,\“vehicleId\“:2,\“userId\“:1}\“}”
    

	```

-------------

NOTE: Sometimes when  restarting the container, the services hang indefinitely with the following message. 	**Waiting for all LocalStack services to be ready.** If this is the case please remove the container with the following command to fix the issue for now.

> ```sh
> 
> docker rm demo_localstack
> 
> ```

And restart the localstack container