#!/bin/bash
# Run a job to create environment and broker using Solace Cloud CLI
# Outputs results as json 

# Variable block
environmentName="DemoDevEnv"
brokerName="DemoBroker"
numberOfBrokers=2

# Create environment
echo "Creating Environment '$environmentName'"
sc platform env create --name "$environmentName" --description "Demo Environment for Solace Cloud CLI" --json

# Wait 5 seconds before creating the brokers
echo "Waiting 5 seconds before creating the brokers..."
sleep 5

# Create brokers
echo "$numberOfBrokers Event Broker Services will be created"
echo ""
for number in $(seq 1 $numberOfBrokers)
do
    echo "Creating Event Broker Service with name '$brokerName-$number'"
    sc missionctrl broker create --name "$brokerName-$number" --env-name "$environmentName" --service-class-id "DEVELOPER" --datacenter-id "eks-ca-central-1a" --json
done

# Wait for brokers to be created
for number in $(seq 1 $numberOfBrokers)
do
    echo "Waiting for Event Broker Service '$brokerName-$number' to be created..."
    while true; do
        status=$(sc missionctrl broker opstatus --name "$brokerName-$number" --json | jq -r '.[].status')
        if [ "$status" == "SUCCEEDED" ]; then
            echo "Event Broker Service '$brokerName-$number' created successfully."
            break
        elif [ "$status" == "FAILED" ]; then
            echo "Failed to create Event Broker Service '$brokerName-$number'."
            break
        else
            echo "Event Broker Service '$brokerName-$number' is still being created...STATUS: $status"
            sleep 5
        fi
    done
done

# Output the details
echo "Completed setting up the environment and brokers. Here is the output displayed in table format:"
echo ""
echo "Environment Details:"
sc platform env display --name "$environmentName"
echo "Broker Details:"
for number in $(seq 1 $numberOfBrokers)
do
    sc missionctrl broker display --name "$brokerName-$number"
done