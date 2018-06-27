const Datastore = require('nedb');
const db = new Datastore({ filename: './data/notes.db', autoload: true });

function Note(title, description, rating, doneUntil)
{
    let date = new Date(); 
    this.title = title;
    this.description = description;
    this.rating = rating;
    this.doneUntil = doneUntil;
    this.created = date.getTime();
    this.done = false;
    this.doneDate = '';
    this.state = "OK";
}


function publicAdd(data, callback)
{
    let note = new Note(data.title, data.description, data.rating, data.doneUntil);
    db.insert(note, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicRemove(id, callback) {
    db.remove({_id: id}, {}, function (err, numRemoved) {
        callback(err, numRemoved);
    });
}

function publicGet(id, callback)
{   db.findOne({ _id: id }, function (err, doc) {
        callback( err, doc);
    });
}

function publicUpdate(id, update, callback)
{   db.update({ _id: id }, { $set: update }, {}, function (err, doc) {
        callback( err, doc);
    });
}

function publicAll(callback)
{
    db.find({}, function (err, docs) {
        callback( err, docs);
    });
}

module.exports = {put: publicUpdate, add : publicAdd, delete : publicRemove, get : publicGet, all : publicAll};