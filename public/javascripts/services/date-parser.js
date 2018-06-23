var dateParser = (function() {
    function parse(notesList, field, dateFormat) {
        notesList.forEach(function(item, index) {
            let date = new Date(item[field]); 
            formattedDate = date.toLocaleDateString('en-US', ); 
            item[field] = formattedDate; 
            console.log(item['field']); 
        })
    };

    return {
        transform: parse
    }
}())

export default dateParser; 