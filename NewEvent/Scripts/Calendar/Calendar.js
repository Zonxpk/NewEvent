var Search;
var GetLine;
var GetSearch;
var GetTopicDetail;
var SessionUser;
var table_cr;
$(document).ready(function () {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        themeSystem: 'bootstrap',
        customButtons: {
            openNewEvent: {
              text: 'New Event',
              click: function() {
                alert('clicked the custom button!');
              }
            }
          },
        headerToolbar: { 
            left: 'prev,next openNewEvent',
            center: 'title',
            right: 'listWeek,dayGridWeek,dayGridMonth' 
        }, // buttons for switching between views
    });
    calendar.render();

    return;
    $('#calendar').fullCalendar({
        timeFormat: 'H:mm',
        editable: true,      
        droppable: true, // this allows things to be dropped onto the calendar !!!
        selectable: true,
        lang: 'en',
        views: {
            month: {
                eventLimit: 3,
                eventLimitText: "Something"
            },
            day: {
                eventLimit: 6,
                eventLimitText: "Something"
            },
            week: {
                eventLimit: 8,
                eventLimitText: "Something"
            },
        },

        // themeSystem: 'bootstrap', 
        //eventLimit: 3, // If you set a number it will hide the itens
        //eventLimitText: "Something", // Default is `more` (or "more" in the lang you pick in the option)
      
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay,listDay'
        },

        eventClick: function (info) {
            $('#modeledit').modal('show');
        },
        dayClick: function (startDate, endDate, jsEvent, view, resource) {
            $('#modeladd').modal('show');
            console.log(moment(startDate).format('YYYY-MM-DD HH:mm'));
            console.log(moment(endDate).format('YYYY-MM-DD HH:mm'));
        },
        select: function (startDate, endDate, jsEvent, view, resource) {
                  

        },
        eventRender: function (eventObj, element, view) {
            console.log(view.type);
            if (view.type == "basicWeek") {

                element.html("<div>" + "TITLE1 :" + eventObj.title + "<br></div>");
                element.popover({
                    title: eventObj.title + "12",
                    content: eventObj.title + " EIEI",
                    trigger: 'hover',
                    placement: 'top',
                    container: 'body'
                });
            }
            else if (view.type == "basicDay") {
                element.html("<div>" + "TITLE2 :" + eventObj.title + "<br></div>");
                element.popover({
                    title: eventObj.title + " 34",
                    content: eventObj.title + " EIEI",
                    trigger: 'hover',
                    placement: 'top',
                    container: 'body'
                });
            }
            else if (view.type == "month") {
                element.html("<div>" + "TITLE3 :" + eventObj.title + "<br></div>");
                element.popover({
                    title: eventObj.title + " 56",
                    content: eventObj.title + " EIEI",
                    trigger: 'hover',
                    placement: 'top',
                    container: 'body'
                });
            } 
        
        
        },

        events: [{
            title: 'All Day Event',
            id:'55',
            start: new Date(y, m, 1)
        },{
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        },{
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
            allDay: false
        },{
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false
        },{
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        },{
            title: 'Meeting2',
            start: new Date(y, m, d, 11, 30),
            allDay: false
        },{
            title: 'Meeting3',
            start: new Date(y, m, d, 12, 30),
            allDay: false
        },{
            title: 'Meeting4',
            start: new Date(y, m, d, 13, 30),
            allDay: false
        },{
            title: 'Meeting5',
            start: new Date(y, m, d, 14, 30),
            allDay: false
        },{
            title: 'Meeting6',
            start: new Date(y, m, d, 15, 30),
            allDay: false
        },{
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        },{
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        },{
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }]
    });

});
