const User = require("../models/User");

exports.googleSignInService = async (data) => {
    const user = await User.create(data);
    return user;
}

exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

exports.getUserById = async (userId) => {
    const user = await User.findOne({ _id: userId });
    return user;
}

exports.updateUserByIdService = async (userId, data) => {
    const result = await User.updateOne({ _id: userId }, { $set: data }, { runValidators: true });
    return result;
}

exports.updateUserByEmailService = async (email, data) => {
    const result = await User.updateOne({ email: email }, { $set: data }, { runValidators: true });
    return result;
}
