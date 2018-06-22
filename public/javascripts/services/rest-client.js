
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

    function getAllNotes(filterParam, callback) {
        $.ajax({
            type: "GET",
            url: "/notes" + filterParam,
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
        getAll: getAllNotes,
        getSingle: getSingleNote
    }
}());

export default rest;
    