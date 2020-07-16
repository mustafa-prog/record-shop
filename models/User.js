const { Schema, model } = require('mongoose');

const Address = require('./Address');

const { encrypt, check } = require('../lib/encryption');
const { sign, verify } = require('../lib/authentication');

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
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      default: 'user',
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

// Add a static method that checks for whether the ID inside a JWT token can be found in the database
// Important: Schema methods only work with document instances. Since we need to find a document first, we need to create a static.

const tokenSecret = 'fsdfkljsglkj7dfgljfghkljlkdfsjglkdfg3';

UserSchema.static('findByToken', async function (token) {
  //If there is a token, we check for whether it is created with its own secret(its validity). Verify method returns payload. It converts the encoded token to the object.
  let payload;
  try {
    payload = await verify(token, tokenSecret);
  } catch (error) {
    return null;
  }
  // we are checking for whether there is a user with this ID inside the payload.
  const user = await this.findOne({ _id: payload._id });
  return user;
});

// Add a method that generates a JWT token that includes the current user
UserSchema.method('generateAuthToken', async function () {
  const token = await sign({ _id: this._id, access: 'auth' }, tokenSecret);
  // const token = await sign({ _id: this._id, access: 'auth' }, tokenSecret, {
  //   expiresIn: '1m',
  // });
  return token;
});

module.exports = model('User', UserSchema);
