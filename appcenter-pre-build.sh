#!/usr/bin/env bash

# Write ENV file from environment variables
echo "OAUTH_SITE=https://arkhamdb.com/" > .env
echo "OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID" > .env
echo "OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET" > .env
