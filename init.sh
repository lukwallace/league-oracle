#!/bin/bash
echo "Initializing . . ."

# Finds the absolute path of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER=${DIR}/server
CLIENT=${DIR}/client

# Run npm install if there are no node_modules
if [ ! -d ${SERVER}/node_modules ]; then
echo "Installing server node modules"
cd ${SERVER}
npm install
fi


if [ ! -d ${CLIENT}/node_modules ]; then
echo "Installing client node modules"
cd ${CLIENT}
npm install
fi

echo "Initializing MongoDB"
mongod --fork --logpath ${DIR}/log/mongodb.log


# Clean up
mongo --eval "db.getSiblingDB('admin').shutdownServer()"
rm mongodb.log