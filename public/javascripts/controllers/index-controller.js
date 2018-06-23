//import { default as data } from './model.js';
import notes from '../services/rest-client.js';
import dateParser from '../services/date-parser.js';

let indexController = (function() {
    // Add body classes depending on view
    let path = window.location.pathname;
    $('body').addClass(path.split("/")[1]); 

    let url = window.location.href;
    let filter = ''; 
    if(url.split('?')[1]) {
        filter = url.split('?')[1].split('sortby=')[1];
        console.log(url);
        $('.filters #' + filter).attr('checked', 'checked');
    }
    
    // Style switcher
    $('.style-switcher .choice').click(function() {
        $('.style-switcher .choice').toggleClass('active');
    });

    $('.filters input[name=filter]').change(function() {
        window.location.href = '?sortby=' + $(this).val();
    });

    function addListControllers() {
        // Done
        $('.done-input').click(function() {
            let $closest = $(this).closest('.list-item');
            let id = $closest.data('id');

            let update = {}
            update.done = ($closest.data('done') == true ? false : true); 

            notes.updateSingle(id, update, function() {
                $closest.attr('data-done', update.done);
                $closest.data('done', update.done);
            });
        })

        $('.list-item').on('mouseenter mouseleave', function() {
            $(this).find('span').toggleClass('hovered'); 
        });

        $('.list-item .item-b').click(function() {
            $(this).find('.note-content').toggleClass('open');
        });

    }

    function parseDates() {
        $('.list-item').each(function(index) {
            let morgen = new Date(); 
            morgen.setHours(0,0,0,0);
            morgen.setDate(morgen.getDate() + 1); 

            let date = new Date($(this).find('.item-b').data('doneUntil'));
 
            if(morgen.getTime() == date.getTime()) {
               $(this).find('.done-until').html('tomorrow'); 
            } else {
                $(this).find('.done-until').html(date.toLocaleDateString('en-GB',{
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                })); 
            }
        }); 
    }
    

    // Render all notes
    const renderer = Handlebars.compile($("#note-list-template").html());

    function renderNotes() {
        if(filter != '') {
            filter = '?sortby=' + filter; 
        }
        notes.getAll(filter, function(data, err) {
            $(".notes-list").html(renderer({notes: data}));
            addListControllers();
            parseDates(); 
        });
    }
    renderNotes(); 

}()); 

export { indexController };



