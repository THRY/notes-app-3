import note from '../services/rest-client.js';
import { cookie } from '../services/cookie-client.js';

var noteController = (function() {

    let noteId = window.location.hash.substr(1); 

    $(document).ready(function() {
        if(cookie.get('darkStyle') == 'true') {
            $('body').addClass('dark');
        }
    });

    // Render all notes
    const renderer = Handlebars.compile($("#note-single-template").html());

    // Globals
    

    let rating = (function() {
        let rating = 0; 

        function set(value) {
            rating = value; 
        }

        function get() {
            return rating; 
        }

        return {
            get: get,
            set: set
        }
    }())

    // Edit or new Note
    if(noteId) {
        note.getSingle(noteId, function(data, err) {
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

    // Get data from fields
    function getNoteFields() {
        let entry = {}
        entry.title = $('.note-editor #title').val(); 
        entry.description = $('.note-editor #description').val(); 
        entry.rating = rating.get();

        // Parse Date
        let dateDoneUntil = $('.note-editor #datepicker').datepicker( "getDate" );
        dateDoneUntil.setHours(0, 0, 0, 0);
        entry.doneUntil = dateDoneUntil.getTime(); 

        return entry; 
    }

    // Add controlers after DOM Elements have been added
    function addListControllers() {
         // Save entry
        $('.note-editor .first.save').click(function() {
            let entry = getNoteFields();
            
            if(entry.title == '') {
                $('label span.error').html('  Please give your note a title');
            } else {
                note.addSingle(entry, function() {
                    window.location.reload(history.back());
                });
            }
        });

        // Update entry
        $('.note-editor .edit.save').click(function() {
            let entry = getNoteFields();
            note.updateSingle(noteId, entry, function() {
                window.history.back();
            });
        });

        // Delete entry
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
            rating.set($(this).val());
        }); 
        
        // Set Rating view
        if(noteId) {
            let inverseNumber = 3 - (parseInt($('.rating').data('rating') - 1)); 
            $('.rating label:nth-child(' + inverseNumber + ')').addClass('active');
        }        

        // Others
        $('.back, .title').click(function() {
            window.history.back();
        })

        // Init Datepicker
        $( "#datepicker" ).datepicker({dateFormat: 'd M yy'});
        let date = new Date($( "#datepicker" ).data('done-until'));
        $( "#datepicker" ).datepicker('setDate', date);
    }
}()); 

