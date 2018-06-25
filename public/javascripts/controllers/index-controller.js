//import { default as data } from './model.js';
import notes from '../services/rest-client.js';
import dateParser from '../services/date-parser.js';

let indexController = (function() {

    let url = window.location.href;
    let filter = ''; 
    
    if(url.split('?')[1]) {
        filter = url.split('?')[1].split('sort=')[1];
        console.log(url);
        $('.filters #' + filter).attr('checked', 'checked');
    }
    
    // Style switcher
    $('.style-switcher .choice').click(function() {
        $('.style-switcher .choice').toggleClass('active');
    });

    $('.filters input[name=filter]').change(function() {
        let filter = $(this).val(); 
        history.pushState({}, "", "?sort=" + filter);
        renderNotes(filter); 
    });

    function sort(array, filterType) {
        let type = filterType; 
        
        if(!type) {
            type = 'created'; 
        }

        function fn(a, b) {    
            console.log('Type: ' + type);
            console.log(a[type]);
            if (a[type] > b[type]) {
            return -1;
            }
            if (a[type] < b[type]) {
            return 1;
            }
            return 0;
        }
        return array.sort(fn);
    }    

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
                updateDoneView();
                updateDoneDate(update.done, $closest);
            });
        })

        $('.list-item').on('mouseenter mouseleave', function() {
            $(this).find('.item-c span').toggleClass('hovered'); 
        });

        $('.list-item .item-b').click(function() {
            $(this).find('.note-content').toggleClass('open');
        });

        $('#show-done').click(function() {
            updateDoneView();
        });
    }

    function updateDoneDate(isDone, $parent) {
        if(isDone) {
            let date = new Date(); 
            $parent.find('.done-until').html('Done: ' + date.toLocaleDateString('en-GB',{
                day: 'numeric',
                year: 'numeric',
                month: 'long'
                })
            );
        } else {
            parseDoneDates();
        }
    }

    function updateDoneView() {
        if($('#show-done').is(':checked')) {
            $('.list-item[data-done="true"]').show();
        } else {
            $('.list-item[data-done="true"]').hide();
        }
    }

    function parseDoneDates() {
        $('.list-item').each(function(index) {
            let morgen = new Date(); 
            morgen.setHours(0,0,0,0);
            morgen.setDate(morgen.getDate() + 1); 

            let date = new Date($(this).find('.item-b').data('doneUntil'));
 
            if(morgen.getTime() == date.getTime()) {
               $(this).find('.done-until').html('tomorrow'); 
            } else {
                $(this).find('.done-until').html('To do: ' + date.toLocaleDateString('en-GB',{
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                })); 
            }
        }); 
    }
    

    // Render all notes
    const renderer = Handlebars.compile($("#note-list-template").html());

    function renderNotes(filter) {
        notes.getAll(function(data, err) {
            let sortedData = sort(data, filter);
            $(".notes-list").html(renderer({notes: sortedData}));
            addListControllers();
            parseDoneDates(); 
        });
    }
    renderNotes(filter); 

}()); 

export { indexController };



