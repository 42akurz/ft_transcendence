# Resources
## Private Messaging
https://socket.io/get-started/private-messaging-part-1/


## Swagger UI
https://docs.nestjs.com/openapi/introduction

## TypeORM
https://typeorm.io/
https://docs.nestjs.com/recipes/sql-typeorm

## TypeORM relations
https://typeorm.io/relations

## VUE store
https://vuex.vuejs.org/guide/#the-simplest-store

## OAUTH flows
https://frontegg.com/blog/oauth-flows

## Authorization Roles
https://docs.nestjs.com/security/authorization

## Encryption and Hashing
https://docs.nestjs.com/security/encryption-and-hashing

## RXJS - Communication between components
https://rxjs.dev/guide/overview
https://jasonwatmore.com/post/2019/04/02/vuejs-rxjs-communicating-between-components-with-observable-subject

## Socket.io in Nest
https://docs.nestjs.com/websockets/gateways
https://socket.io/docs/v4/

## TypeOrm ManyToMany with extra properties
https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations


# Documentation of services

## Frontend:
All the user can interact with and see on the website
Framework: Vue.js
STARTCMD: npm run serve
REACH UNDER: http://localhost:8080/

## UI:
https://github.com/Nimon77/ft_transcendence

## Backend:
Data storage and informations of the Frontend
Functionality for frontend(create users and store in db)
Framework: NestJS
START CMD: npm run start:dev
LINKS:
FULL NestJS guide: https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/
https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe
https://www.learmoreseekmore.com/2020/09/nestjs-crud-postgresql.html
https://www.linkedin.com/pulse/call-backend-functions-from-frontend-michiel-vos/
https://medium.com/@jeffrey.allen.lewis/http-requests-compared-why-axios-is-better-than-node-fetch-more-secure-can-handle-errors-better-39fde869a4a6
https://typeorm.io/
https://www.tutorialspoint.com/typeorm/typeorm_query_builder.htm
https://github.com/typeorm/typeorm/pull/8616
REACH UNDER: http://localhost:3000/

## Database:
USER/PASSWORD: trans/trans
LOG:
/var/lib/postgresql/13/main/pg_log
LINKS:
https://citizix.com/how-to-install-and-configure-postgres-14-on-debian-11/
https://www.tutorialspoint.com/postgresql/index.htm
connect to PostgreSQL with vm user: sudo -i -u postgres
connect to PostgreSQL db user: sudo -u postgres psql
connect to db with user: sudo psql -h localhost -d transcendence -U trans
remote  connect to db: psql 'postgres://trans:trans@localhost:5432/transcendence?sslmode=disable'

\du -> users and permissions
\l -> show all database
\c transcendence -> connect to database
\d -> show all tables
\d users_trans -> show tables from database

INSERT INTO USERS_TRANS (USERNAME,PASSWORD) VALUES ('Felix', 'felix123');

SELECT * FROM users_trans;

INSERT INTO USERS_SCORES (USERNAME,SCORE) VALUES ('Felix', 10);

INSERT INTO USERS (USERNAME,PASSWORD,CURRENTHASHEDREFRESHTOKEN) VALUES ('Felix', 'asfsasfasf','asfasfsafassaf');

OAuth 2.0:
https://api.intra.42.fr/apidoc/guides/web_application_flow
https://www.passportjs.org/packages/passport-42/
https://www.youtube.com/watch?v=CPbvxxslDTU

User clicks login on website.
42 link opens up, when login is pressed:

GET to this link ist send: https://api.intra.42.fr/oauth/authorize?client_id=729aeb8c390437ddbbf575994d7ddd984e9b6e1159f91b04026dd5a721958f7d&redirect_uri=http%3A%2F%2F10.11.249.227%3A8080%2Fgame&response_type=code&sate=AlexIstEinSuperDuperWebDEV

It includes the client_id of our service, the redirect url and a unqiue passhphrase for security reason.

After beeing redirected we get back the unqiue code:
42api server sends back a unique code for this uer with the access rights

http://10.11.249.227:8080/game?code=e6aecb93d823ea98f4594b10a63ffdd23298cdc0335d3212fb796b2bad1cae3f

backend needs to confirm this at the 42api server with the token and the service data

POST to this link ist send: https://api.intra.42.fr/oauth/token

CURL CMD FOR SENDING POST:

curl -F grant_type=authorization_code \
-F client_id=ID \
-F client_secret=SECRET \
-F code=9925872d635e26249f525a28ad638dba39e17533ca7a335410b0953a87d88f52 \
-F redirect_uri=http://10.11.249.227:8080/game \
-X POST https://api.intra.42.fr/oauth/token

then respone come back with an access token for the user fromm the 42api

Respone from 42auth server:
{"access_token":"35b90577ed4240a07869928eabf5b6e1f43da046763377d06a539288485b0be9","token_type":"bearer","expires_in":7200,"refresh_token":"0ab832202f5283e6bd3e0157861860420ba6e7c5ffb433bb049cc4324110c04b","scope":"public","created_at":1657114069}
Now we can make calls on the 42api and get data

curl -H "Authorization: Bearer 35b90577ed4240a07869928eabf5b6e1f43da046763377d06a539288485b0be9" https://api.intra.42.fr/v2/me
--> gets all profile data (username ===== login)


# chat
## setup
* In backend folder
```bash
	nest g resource messages
```
* transport layer? --> WebSockets
* generate CRUD entry points? --> yes (meaning CREATE READ UPDATE DELETE methods for messages)


We want a chat server that allows clients to:
* join (join event)
* identify themselves ()
* write messages (create event)
* read all previous existing messages (findAll event)
* see when someone is typing (typing event)

## JS PROMISES

* Promises are great when you do something that takes a long time in the background and you want to do something after its complete
* you can easily catch it if it fails
* Promise is either completed - "resolved"
* or failed - "rejected"

### creating a promise
```bash
	let p = new Promise((resolve, reject) => {
		let a = 1 + 1
		if (a == 2) {
			resolve('success')
		}
		else {
			reject('failed')
		}
	})
```

### working with the promise
```bash
	// then is called when promise is resolved
	// catch is called when promise is rejected
	p.then((message) => {
		console.log('This is in the then ' + message)
	}).catch((message) => {
		console.log('This is in the catch ' + message)
	})
```
