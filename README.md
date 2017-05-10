# admin-web

> Administration Web Front

## Setup

The admin rest API URL read from environment variable named `ADMIN_API_URL`. The export syntax (in any *nix OS) is `export ADMIN_API_URL='"http://192.168.1.1"'`. The url string is quoated by a pair of double quotes and a pair of single quotes.

## Build and Run

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn start

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
