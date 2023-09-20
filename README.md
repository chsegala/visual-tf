# Visual TF

This is a quick and dirty application to list all resources that are being destroyed and created
listing them side by side to make it easy to move resources. This is mainly used to migrate
resources where there are almost 1:1 deletes to creates.

This is not intended to be anything production ready, it was done as a helper to a specific
problem I had.

## Usage

1. clone this repo
2. yarn install && yarn build && npm link .
3. cd /my/terraform/folder
4. terraform init
5. visual-tf serve

If you want a specific port, please set a `PORT=3001` environment variable.

## Disclaimer

This was put together in a hurry to help on a specific problem, it is in no
shape to be "releasable", but can help. 