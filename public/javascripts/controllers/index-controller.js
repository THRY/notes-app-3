//import { default as data } from './model.js';
import notes from '../services/rest-client.js';
import dateParser from '../services/date-parser.js';

let indexController = (function() {

    let url = window.location.href;
    let filter = ''; 
    
    if(url.split('?')[1]) {
        filter = url.split('?')[1].split('sort=')[1];
        $('.filters #' + filter).attr('checked', 'checked');
    }

    $(document).ready(function() {
        if(getCookie('showDone') == 'true') {
            $('#show-done').attr('checked','checked');
        }
    });
    
    // Style switcher
    $('.style-switcher .choice').click(function() {
        $('.style-switcher .choice').toggleClass('active');
    });

    // Filter radio input
    $('.filters input[name=filter]').change(function() {
        let filter = $(this).val(); 
        history.pushState({}, "", "?sort=" + filter);
        renderNotes(filter); 
    });

    // Sorty by filter value
    function sort(array, filterType) {
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
        return array.sort(fn);
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


    function showHideDone() {
        if(getCookie('showDone') == 'true') {
            $('.list-item[data-done="true"]').show();
        } else {
            $('.list-item[data-done="true"]').hide();
        }
    }

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

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    // Add controllers after updating DOM with handlebars
    function addListControllers() {
        // Done
        $('.done-input').click(function() {
            let $closest = $(this).closest('.list-item');
            let id = $closest.data('id');
        
            let update = {}
            update.done = ($closest.data('done') == true ? false : true); 

            let now = new Date(); 
            now.setHours(0,0,0,0);
            update.doneDate = now.getTime(); 

            notes.updateSingle(id, update, function() {
                /*
                $closest.attr('data-done', update.done);
                $closest.data('done', update.done);
                showHideDone();
                updateDoneDate(update.done, $closest);
                */
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
            setCookie('showDone', $(this).is(":checked"), 1); 
            showHideDone();
        });
    }

    // Render all notes
    const renderer = Handlebars.compile($("#note-list-template").html());

    function renderNotes(filter) {
        notes.getAll(function(data, err) {
            let sortedData = sort(data, filter);
            $(".notes-list").html(renderer({notes: sortedData}));
            addListControllers();
            parseToDoDates(); 
            showHideDone();
        });
    }
    renderNotes(filter); 

}()); 

export { indexController };



