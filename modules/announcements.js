const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://prince:9949606614@cluster0-rnlcj.mongodb.net/Otaku?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
var conn =mongoose.Collection;
var announceSchema =new mongoose.Schema({
    announce_cat: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},

    date:{
        type: Date, 
        default: Date.now }
});

var announceModel = mongoose.model('announcement', announceSchema);
module.exports=announceModel;