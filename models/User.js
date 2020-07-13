const { Schema, model } = require('mongoose');

const Address = require('./Address');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: Address,
        required: true
    }
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

UserSchema
    .virtual('fullName')
    .get(function() { return `${this.firstName} ${this.lastName}`; });

module.exports = model('User', UserSchema);