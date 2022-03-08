# GTASKS

Google Tasks on web with react

## Features

* Toggle the status of tasks
* Dragable tasks

## Tech Stack

* React
* Typescript - type safety
* Vite - build tool
* Atlassian/tree - layouting
* Tailwind CSS - styling
* axios - http client

## What this project doesn't provide

* Create new tasks
* Create new tasks lists
* Dragging nested tasks
* Add info to the tasks

## Setup

* Download the source code
* Add the following environment variables

```
VITE_GOOGLE_AUTH_URL=https://accounts.google.com/o/oauth2/auth
VITE_GOOGLE_CLIENT_ID=<client id>
VITE_GOOGLE_REDIRECT_URI=<redirect uri>
VITE_TOKEN_BACKEND_ENDPOINT=<backend endpoint>
```

* TOKEN_BACKEND_ENDPOINT should return access token and it support the following routes
1. /getToken
2. /refreshToken

__/getToken__ receives body as 

```json
{
    code,
    redirect_uri
}
```

__/refreshToken__ receives body as 

```json
{
    refreshToken
}
```


## TODO

* Replace atlassian/tree with something more consistent solution for single and nested tasks dragging
* Implement add tasklist and tasks features
* Implement refreshToken feature
* Implement apiservice class
* Add styling