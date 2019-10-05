import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const imageSchema = new Schema({
    title: String,
    username: String,
    //filename: String,
    //views: String,
    createdat: String,
    comments: [{
        comment: String,
        username: String,
        createdat: String
    }],
    likes: [{
        username: String,
        createdat: String
    }],
  
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }]
});

module.exports = model('Image', imageSchema);
