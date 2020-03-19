* you need to use your own AWS key ('./routes/events').
* about:
  - This project uses mongoDB database.
  - Express framework was used to create the server.
  - I used Json Web Token(JWT) to create a Token Based Authentication.

* dependencies:
    - "@hapi/joi" // adds request validation
    - "aws-sdk" // used to access AWS
    - "bcrypt" // used to hash the password
    - "compression" // used to compress the server response
    - "cors" // used to handle Cross-Origin Resource Sharing
    - "express" // a framework for Node.js
    - "express-async-errors" // used to handle async errors
    - "helmet" // helps you secure your Express apps
    - "jsonwebtoken" // used to create JSON-based access tokens
    - "lodash" // a JavaScript utility library 
    - "mongoose" // an Object Data Modeling (ODM) library for MongoDB
    - "multer" // a node.js middleware for handling form data
    - "uuid" // used for generating unique IDs
    - "winston" // a logging library
