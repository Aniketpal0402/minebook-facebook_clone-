const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/facebook");
const postSchema = new mongoose.Schema({
    postText: {
    type: String, 
    required: true 
    },

    users:[{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user' 
    }],

    image: { 
    type: String
    },   

    createdAt: { 
    type: Date, 
    default: Date.now 
    }
   
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
