module.exports = {
    database: {
        // DBCON: 'mongodb://localhost/merng'
        DBCON: process.env.MONGO_DB_URI
    },/*
    SECRET_KEY: {
        TOKEN_KEY: 'some very secret key'
    },*/
    facebook: {
        secret: ''
    },
    SECRET_KEY: 'some very secret key'

};