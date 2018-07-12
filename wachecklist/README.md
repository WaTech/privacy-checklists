# WAChecklist

Built on [KeystoneJS](http://keystonejs.com) of [Node.js](https://nodejs.org/en/) CMS. Documentation http://keystonejs.com/docs/

## Licenses

### Dependencies of project
- async - https://github.com/caolan/async/blob/master/LICENSE
- cloudinary - https://github.com/cloudinary/cloudinary_npm
- dotenv - https://github.com/motdotla/dotenv/blob/master/LICENSE
- express-basic-auth - https://github.com/LionC/express-basic-auth
- express-handlebars - https://github.com/ericf/express-handlebars/blob/master/LICENSE
- handlebars - https://github.com/wycats/handlebars.js/blob/master/LICENSE
- hoek - https://github.com/hapijs/hoek/blob/master/LICENSE
- html-pdf - https://github.com/marcbachmann/node-html-pdf/blob/master/LICENSE
- keystone - https://github.com/keystonejs/keystone/blob/master/LICENSE
- keystone-email - https://github.com/keystonejs/keystone-email/blob/master/LICENSE
- less-plugin-autoprefix -  https://github.com/less/less-plugin-autoprefix/blob/master/LICENSE
- lodash - https://github.com/lodash/lodash/blob/master/LICENSE
- marked - https://github.com/markedjs/marked/blob/master/LICENSE.md
- moment - https://github.com/moment/moment/blob/develop/LICENSE

### Core server
- [Node.js](https://nodejs.org/en/) - https://raw.githubusercontent.com/nodejs/node/master/LICENSE

### Services
- [mLab](https://mlab.com/) - https://mlab.com/company/legal/aup/
- [Cloudinary](https://cloudinary.com) - https://cloudinary.com/tos
 

## Setup project

	npm install

Copy and rename `.env-example` to `.env`. Add the values or new environment variables.

## Start project

Recommend install nodemon https://nodemon.io/
for watching and reload server after changed files.

	npm install -g nodemon

### Run server for development:

	nodemon keystone.js

or

	node keystone.js
	
or

	npm run dev
	
### Start server on production: 
	
	npm run start

### Default user

Email: example@mail.com
Password: 123456
