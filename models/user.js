// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: String,
    username: String,
    discriminator: String,
    avatar: String,
    email: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    socialLinks: {
        telegram: { type: String, default: '' },
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
        twitch: { type: String, default: '' }
    }
});

module.exports = mongoose.model('User', userSchema);
