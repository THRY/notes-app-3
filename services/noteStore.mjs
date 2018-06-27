import Datastore from 'nedb';

export class Note { 
    constructor(title, description, rating, doneUntil) {
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
}

export class NoteStore {
    constructor(db) {
        this.db = db || new Datastore({filename: '../data/notes.db', autoload: true});
    }

    add(data, callback) {
        let note = new Note(data.title, data.description, data.rating, data.doneUntil);
        this.db.insert(note, function(err, newDoc){
            if(callback){
                callback(err, newDoc);
            }
        });
    }

    remove(id, callback) {
        this.db.remove({_id: id}, {}, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    }

    get(id, callback) {   
        this.db.findOne({ _id: id }, function (err, doc) {
            callback( err, doc);
        });
    }

    update(id, update, callback) {   
        this.db.update({ _id: id }, { $set: update }, {}, function (err, doc) {
            callback( err, doc);
        });
    }

    all(callback) {
        this.db.find({}, function (err, docs) {
            callback( err, docs);
        });
    }
}

export const store = new NoteStore();
