import { model, Schema } from 'mongoose';

const userSchema = new Schema ({
    username: String,
    pwd: String,
    email: String,
    createdat: String
});

module.exports = model('User', userSchema);