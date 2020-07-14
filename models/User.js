const { Schema, model } = require('mongoose');

const Address = require('./Address');

const { encrypt, check } = require('../lib/encryption');
const { sign } = require('../lib/authentication');

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Address,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//Mongoose hooks: Whenever saving the document, before saving convert the password to hash.
//Because it is also middleware, we next it.
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await encrypt(this.password);
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  //if there is no provided new password...
  if (!this._update.hasOwnProperty('password')) return next();
  //if there is, we generate hash out of it.
  this._update.password = await encrypt(this._update.password);
  next();
});

//Add authentication as a method to our User Schema because we always have access to the saved password from here.
UserSchema.method('authenticate', async function (loginPassword) {
  return await check(loginPassword, this.password);
});

UserSchema.method('toJSON', function () {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    fullName: this.fullName,
    address: this.address,
  };
});

const tokenSecret = 'fsdfkljsglkj7dfgljfghkljlkdfsjglkdfg3';

UserSchema.method('generateAuthToken', async function () {
  const token = await sign({ _id: this._id, access: 'auth' }, tokenSecret);
  return token;
});

module.exports = model('User', UserSchema);
