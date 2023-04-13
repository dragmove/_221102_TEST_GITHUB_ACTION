#!/bin/bash

# IS_GITHUB_ACTIONS=true
# INTEGRATED_VERSION="0.1.1"
# GITHUB_BASE_REF="epic/NOP-29"

if [ $IS_GITHUB_ACTIONS == 'true' ]; then
  # set git user (triggered by github actions)
  GITHUB_ACTOR_NAME="$(git log -n 1 --pretty=format:%an)"
  GITHUB_ACTOR_EMAIL="$(git log -n 1 --pretty=format:%ae)"

  git config --global user.name "${GITHUB_ACTOR_NAME}"
  git config --global user.email "${GITHUB_ACTOR_EMAIL}"

  echo "GITHUB_ACTOR_NAME: ${GITHUB_ACTOR_NAME}"
  echo "GITHUB_ACTOR_EMAIL: ${GITHUB_ACTOR_EMAIL}"

  # update version in package.json when branches are merged
  if [ "$GITHUB_BASE_REF" != 'main' ]; then
    yarn plugin import version
    yarn version $INTEGRATED_VERSION
  fi

  git add package.json .yarn
  git commit -m ":bookmark: ${INTEGRATED_VERSION}"

  PUSH_TARGET_BRANCH="HEAD:${GITHUB_BASE_REF}"

  echo "PUSH_TARGET_BRANCH: ${PUSH_TARGET_BRANCH}"

  git tag $INTEGRATED_VERSION
  git push origin $PUSH_TARGET_BRANCH --tags
fi

