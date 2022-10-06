#!/usr/bin/env bash

set -e

execCli() {
  if [ "$NODE_ENV" == "production" ]; then
    npm run cli "$@"
  else
    npm run cli:dev "$@"
  fi
}

execCli "$@"
