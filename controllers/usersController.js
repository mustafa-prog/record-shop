const mongoose = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new createError.NotFound();
    const user = await User.findById(id);
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new createError.NotFound();
    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new createError.NotFound();
    res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new createError.NotFound();
    const deleted = await User.findByIdAndRemove(id);
    if (!deleted) throw new createError.NotFound();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    //Check if user with the given email exist
    const loginUser = await User.findOne({ email: req.body.email });
    if (!loginUser) throw new createError.Unauthorized();
    const isAuthenticated = await loginUser.authenticate(req.body.password);
    if (!isAuthenticated) throw new createError.Unauthorized();
    res.status(200).send(loginUser);
  } catch (err) {
    next(err);
  }
};
