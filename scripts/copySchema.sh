#!/bin/bash

gq https://gapi.arkhamcards.com/v1/graphql -H "X-Hasura-Admin-Secret: $MASTER_KEY" --introspect > schema.graphql

