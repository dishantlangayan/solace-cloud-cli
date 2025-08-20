#!/bin/bash
# Run a job to cleanup environment and broker using Solace Cloud CLI
# Outputs results as json 

# Variable block
environmentName="DemoDevEnv"
brokerName="DemoBroker"
numberOfBrokers=2

# Delete brokers
echo "$numberOfBrokers Event Broker Services will be deleted"
for number in $(seq 1 $numberOfBrokers)
do
    echo "Deleting Event Broker Service with name '$brokerName-$number'"
    status=$(sc missionctrl broker delete --name "$brokerName-$number" --json | jq -r '.status')
    if [ "$status" == "SUCCEEDED" ]; then
        echo "Event Broker Service '$brokerName-$number' has been deleted successfully...STATUS: $status"
    elif [ "$status" == "FAILED" ]; then
        echo "Failed to delete Event Broker Service '$brokerName-$number'."
        break
    else
        echo "Event Broker Service '$brokerName-$number' is being deleted...STATUS: $status"
    fi
done

# Wait 5 seconds before deleting the environment
echo "Waiting 5 seconds before deleting the environment..."
sleep 5

# Delete environment
echo "Deleting Environment '$environmentName'"
sc platform env delete --name "$environmentName" --json

# Output the details
echo "Basic cleanup example has completed. Here is the output displayed in table format:"
echo ""
echo "Environments:"
sc platform env list
echo ""
echo "Brokers:"
sc missionctrl broker list