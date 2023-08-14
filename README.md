# Umbrella-Corporation
This app is a basic forum platform with features for creating, editing, and deleting topics, as well as adding and viewing comments (reviews) for each topic. 
It provides user authentication to control access to certain functionalities and stores session data in MongoDB.

## INSTALL
Dependencies:

"bcryptjs": "^2.4.3",
"cloudinary": "^1.38.0",
"connect-mongo": "^5.0.0",
"cookie-parser": "~1.4.4",
"debug": "~2.6.9",
"dotenv": "^16.3.1",
"express": "~4.16.1",
"express-session": "^1.17.3",
"hbs": "~4.0.4",
"http-errors": "~1.6.3",
"luxon": "^3.3.0",
"mongoose": "^7.3.4",
"morgan": "~1.9.1",
"multer": "^1.4.5-lts.1",
"multer-storage-cloudinary": "^4.0.0"

Scripts:
Add "dev": "nodemon ./bin/www" , yor script field should look like this:
"scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  },

$ npm i express --hbs --git express-with-hbs-configuration

$ npm i dotenv mongoose bcryptjs cloudinary connect-mongo luxon --save multer 

Also you will need to create .env file in you project folder and add following keys:

PORT (the one that you want to have your localhost)
MONGODB_URI (your db link)
CLOUDINARY_NAME
CLOUDINARY_KEY
CLOUDINARY_SECRET

## Dev

$npm run dev

You are all set!






