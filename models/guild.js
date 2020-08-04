const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    GuildOwnerID: String,
    GuildOwnerName: String,  
    messages: Number,
    prefix: String,
    welcome: String,
    leave: String,
    
});

module.exports = mongoose.model('Guild', guildSchema);