import note from '../services/rest-client.js';

var noteController = (function() {

    // Render all notes
    const renderer = Handlebars.compile($("#note-single-template").html());

    let noteId = window.location.hash.substr(1); 
    let rating = 1;

    if(noteId) {
        note.getSingle(noteId, function(data, err) {
            console.log(data);
            $(".note-editor").html(renderer({note: data}));
            $('.save').addClass('edit'); 
            $('.button.delete').show();
            addListControllers(); 
        }) 
    } else {
        $(".note-editor").html(renderer({}));
        $('.save').addClass('first'); 
        addListControllers(); 
    }

    function addListControllers() {
         // Save entry
        $('.note-editor .first.save').click(function() {
            console.log("FIRST SAVE");
            let entry = {}
            entry.title = $('.note-editor #title').val(); 
            entry.description = $('.note-editor #description').val(); 
            entry.rating = rating; 

            let dateDoneUntil = $('.note-editor #datepicker').datepicker( "getDate" );
            dateDoneUntil.setHours(0, 0, 0, 0);
            console.log(dateDoneUntil); 
            entry.doneUntil = dateDoneUntil.getTime(); 

            note.addSingle(entry, function() {
                window.location.reload(history.back());
            });
        });

        // Update entry
        $('.note-editor .edit.save').click(function() {
            let entry = {}
            entry.title = $('.note-editor #title').val(); 
            entry.description = $('.note-editor #description').val(); 
            entry.rating = rating;

            let dateDoneUntil = $('.note-editor #datepicker').datepicker( "getDate" );
            dateDoneUntil.setHours(0, 0, 0, 0);
            console.log(dateDoneUntil); 
            entry.doneUntil = dateDoneUntil.getTime(); 

            note.updateSingle(noteId, entry, function() {
                window.history.back();
            });
        });

        // delete entry
        $('.note-editor .button.delete').click(function() {
            note.deleteSingle(noteId, function() {
                window.history.back();
            });
        });

        // Rating
        $('.rating label').click(function() {
            $('.rating label').removeClass('active');
            $(this).addClass('active');
          });
        
        $('.rating input[name=starValue]').change(function() {
            console.log('changed');
            rating = $(this).val(); 
        }); 
        
        if(noteId) {
            let inverseNumber = 3 - (parseInt($('.rating').data('rating') - 1)); 
            console.log(inverseNumber);
            $('.rating label:nth-child(' + inverseNumber + ')').addClass('active');
        }
        console.log($('.rating').data('rating'));

        

        // Others
        $('.back, .title').click(function() {
            window.history.back();
        })

        $( "#datepicker" ).datepicker({dateFormat: 'd M yy'});

        $(document).ready(function() {
            let date = new Date($( "#datepicker" ).data('done-until'));
            $( "#datepicker" ).datepicker('setDate', date);
        })
    }
}()); 

