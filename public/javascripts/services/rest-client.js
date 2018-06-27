
let rest = (function() {

    function addNewNote(entry, callback) {
        $.ajax({
            type: "POST",
            url: "/notes/",
            data: entry,
            success: callback
        });
    }

    function updateSingleNote(id, entry, callback) {
        $.ajax({
            type: "POST",
            url: "/notes/" + id,
            data: entry,
            success: callback
        });
    }

    function deleteSingleNote(id, callback) {
        $.ajax({
            type: "POST",
            url: "/notes/" + id + '?delete=true',
            data: {},
            success: callback
        });
    }

    function getAllNotes(callback) {
        $.ajax({
            type: "GET",
            url: "/notes",
            data: {},
            success: callback
        });
    }

    function getSingleNote(id, callback) {
        $.ajax({
            type: "GET",
            url: "/notes/" + id,
            data: {},
            success: callback
        });
    }

    return {
        addSingle: addNewNote,
        updateSingle: updateSingleNote,
        deleteSingle: deleteSingleNote,
        getAll: getAllNotes,
        getSingle: getSingleNote
    }
}());

export default rest;
    