#!/usr/bin/env bash
printf "Configuring localstack components..."

FILE=/root/ready.txt

if [ -f $FILE ]
then
  rm -rf $FILE
fi

sleep 5;


aws configure set profile localstack
aws configure set aws_access_key_id test --profile localstack
aws configure set aws_secret_access_key test --profile localstack
# echo "[localstack]" > ~/.aws/config
# echo "region = us-east-1" >> ~/.aws/config

printf "Creating queues"

aws --endpoint-url=http://host.docker.internal:4566 sqs create-queue --queue-name demo-local-sales --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sqs create-queue --queue-name demo-local-inventory  --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sqs create-queue --queue-name demo-local-notifications  --profile localstack


printf "Creating SNS topics"

aws --endpoint-url=http://host.docker.internal:4566 sns create-topic --name demo-local-sales --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sns create-topic --name demo-local-inventory --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sns create-topic --name demo-local-notifications --profile localstack


printf "Creating SNS subscriptions to Sales"

aws --endpoint-url=http://host.docker.internal:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:demo-local-notifications --protocol sqs --notification-endpoint http://host.docker.internal:4566/000000000000/demo-local-sales --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:demo-local-inventory --protocol sqs --notification-endpoint http://host.docker.internal:4566/000000000000/demo-local-sales --profile localstack

printf "Creating SNS subscriptions to Inventory"

aws --endpoint-url=http://host.docker.internal:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:demo-local-sales --protocol sqs --notification-endpoint http://host.docker.internal:4566/000000000000/demo-local-inventory --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:demo-local-notifications --protocol sqs --notification-endpoint http://host.docker.internal:4566/000000000000/demo-inventory --profile localstack

printf "Creating SNS subscriptions to Notifications"

aws --endpoint-url=http://host.docker.internal:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:demo-local-sales --protocol sqs --notification-endpoint http://host.docker.internal:4566/000000000000/demo-local-notifications --profile localstack
aws --endpoint-url=http://host.docker.internal:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:demo-local-inventory --protocol sqs --notification-endpoint http://host.docker.internal:4566/000000000000/demo-local-notifications --profile localstack

echo "Localstack is ready" >> $FILE
