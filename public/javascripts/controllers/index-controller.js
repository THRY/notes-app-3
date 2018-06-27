//import { default as data } from './model.js';
import notes from '../services/rest-client.js';
import { cookie } from '../services/cookie-client.js';

let indexController = (function() {

    let filter = (function() {
        let url = window.location.href;
        let filter = '';

        if(url.split('?')[1]) {
            filter = url.split('?')[1].split('sort=')[1];
            $('.filters #' + filter).attr('checked', 'checked');
        }

        function set(value) {
            filter = value; 
        }

        function get() {
            return filter
        }

        return {
            get: get, 
            set: set
        }
    }());
    
    

    $(document).ready(function() {
        if(cookie.get('showDone') == 'true') {
            $('#show-done').attr('checked','checked');
        }

        if(cookie.get('darkStyle') == 'true') {
            $('body').addClass('dark');
            $('.style-switcher .choice.dark').addClass('active');
            $('.style-switcher .choice.light').removeClass('active');
        }
    });

    // Style switcher
    $('.style-switcher .choice').click(function() {
        $('.style-switcher .choice').toggleClass('active');
        $('body').toggleClass('dark');
        cookie.set('darkStyle', $('body').hasClass('dark'), 1);
    });

    // Render Notes on filter radio input
    $('.filters input[name=filter]').change(function() {
        filter.set($(this).val()); 
        history.pushState({page: 1}, "", "?sort=" + filter.get());
        renderNotes(filter.get(), false); 

        $('.filters input[name=filter] + label span').removeClass('inversed');
    });

    $('.filters input[name=filter] + label').click(function() {
        $(this).children('span').toggleClass('inversed');    

        let isReversed =  $(this).children('span').hasClass('inversed'); 
        renderNotes(filter.get(), isReversed);
    });

    // Sorty by filter value
    function sort(array, filterType, isReversed) {
        let type = filterType; 
        
        if(!type) {
            type = 'created'; 
        }

        function fn(a, b) {    
            if (a[type] > b[type]) {
            return -1;
            }
            if (a[type] < b[type]) {
            return 1;
            }
            return 0;
        }
        let sorted = array.sort(fn);

        if(isReversed) {
            return sorted.reverse(); 
        } else {
            return sorted;
        }
    }    

    // Set Done Date to now
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
            parseToDoDates();
        }
    }

    // Hide done notes
    function showHideDone() {
        if(cookie.get('showDone') == 'true') {
            $('.list-item[data-done="true"]').show();
        } else {
            $('.list-item[data-done="true"]').hide();
        }
    }

    // Parse Date info to readable format
    function parseToDoDates() {
        $('.list-item').each(function(index) {
            let $listItem = $(this); 
            let morgen = new Date(); 
            morgen.setHours(0,0,0,0);
            morgen.setDate(morgen.getDate() + 1); 

            let date = new Date($(this).find('.item-b').data('doneUntil'));
 
            if(morgen.getTime() == date.getTime()) {
               $(this).find('.done-until').html('tomorrow'); 
            } if($(this).data('done')) {
                updateDoneDate(true, $listItem); 
            } else {
                $(this).find('.done-until').html('To do: ' + date.toLocaleDateString('en-GB',{
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                })); 
            }
        }); 
    }
    
    // Add controllers after updating DOM with handlebars
    function addListControllers() {
        $('.done-input').click(function() {
            let $closest = $(this).closest('.list-item');
            let id = $closest.data('id');
        
            let update = {}
            update.done = ($closest.data('done') == true ? false : true); 

            let now = new Date(); 
            now.setHours(0,0,0,0);
            update.doneDate = now.getTime(); 

            notes.updateSingle(id, update, function() {
                renderNotes(filter); 
            });
        })

        $('.list-item').on('mouseenter mouseleave', function() {
            $(this).find('.item-c span').toggleClass('hovered'); 
        });

        $('.list-item .item-b').click(function() {
            $(this).find('.note-content').toggleClass('open');
        });

        $('#show-done').click(function() {
            cookie.set('showDone', $(this).is(":checked"), 1); 
            showHideDone();
        });
    }

    // Render all notes
    const renderer = Handlebars.compile($("#note-list-template").html());

    function renderNotes(filter, isReversed) {
        notes.getAll(function(data, err) {
            let sortedData = sort(data, filter, isReversed);
            $(".notes-list").html(renderer({notes: sortedData}));
            addListControllers();
            parseToDoDates(); 
            showHideDone();
        });
    }
    renderNotes(filter.get()); 

}()); 

export { indexController };



