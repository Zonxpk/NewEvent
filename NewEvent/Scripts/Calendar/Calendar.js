var Search;
var GetLine;
var GetSearch;
var GetTopicDetail;
var SessionUser;
var table_cr;
$(document).ready(function () {
    var calendarEl = document.getElementById('calendar');
    // $("[name='timing']").datepicker('setDate', (this.checked) ? '01-01-9999' : moment().format("DD-MM-YYYY"));
    // $("[name='timing']").datepicker();
    $('[data-toggle="datepicker"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        startDate: moment().startOf('second'),
        locale:{
            format: 'DD-MM-YYYY hh:mm A'
        },
        parentEl: "#for_datepicker",
        drops: "up"
    });

    let prod = $("select[name='prod']");
    if(prod.val() != "default") GetLineByProduction(prod.val());

    prod.on('change', function() {
        if(this.value != "default") GetLineByProduction(this.value);
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        contentHeight: 'auto',
        themeSystem: 'bootstrap',
        customButtons: {
            openNewEvent: {
              text: 'New Event',
              click: function() {
                $('#new_event_modal').modal('show');
              }
            }
          },
        headerToolbar: { 
            left: 'prev,next openNewEvent',
            center: 'title',
            right: 'listWeek,dayGridWeek,dayGridMonth' 
        }, // buttons for switching between views
        events: [
            {
              id: 'M3241020#1',
              title: 'LCD SEGMENT CHECK',
              description: 'Part table moniter not same Meter assy ( Lcd pattent _ _ _ _AVG ,    00 mile )',
              model: 'K1TA base KZZJ',
              event: 'Japan & A-MO',
              start: '2020-10-24'
            },{
              id: 'M3241020#2',
              title: 'Auto meter assy screwing',
              description: 'M/C not check upper case wrong type',
              model: 'K1TA base KZZJ',
              event: 'Japan & A-MO',
              start: '2020-10-24'
            },{
              id: 'M3071020#1',
              title: 'Auto meter assy screwing',
              description: 'Gap over 0.65 mm  1  pcs actual 1.00 mm',
              model: 'K1TA base KZZJ',
              event: 'Japan & A-MO',
              start: '2020-10-07'
            },{
              id: 'M3071020#2',
              title: 'Illumination',
              description: 'LCD dark point  100%',
              model: 'K1TA base KZZJ',
              event: 'Japan & A-MO',
              start: '2020-10-07'
            }
          ],
          eventClick: function(info) {
              window.open(NavigateToDetail);
          },
          eventDidMount : function(arg){
              console.log(arg);
              $(arg.el).popover({
                  html: true,
                  title: arg.event.title,
                  content: `<b>Problem:</b> ${arg.event.extendedProps.description}<br>
                            <b>Model:</b> ${arg.event.extendedProps.model}<br>
                            <b>Event:</b> ${arg.event.extendedProps.event}<br>`,
                  trigger: 'hover',
              });
          }
        //   eventMouseEnter : function(info) {
        //     console.log(info.el);
        //     $(info.el).tooltip({
        //         placement: 'right',
        //         title: 'test'
        //     });
        //   }
    });
    calendar.render();

    $("#new_event_modal").modalWizard();
    autosize(document.querySelectorAll('textarea'));
    $('.textareaDetails').summernote({
        height: 140,
        toolbar: [
            ['font', ['bold', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['para', ['ul', 'ol']],
        ],
    });

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    table_dt = $('#detail_event_table').DataTable({
        columnDefs:[
            {
                targets: 3,
                render: function (data) {
                    if(data == null){
                        return '<button type="button" id="remove_detail" value="detail" class="btn btn-danger"><i class="fa fa-trash"></i>&nbsp;&nbsp;Remove</button>';
                    }
                    return data;
                }
            }
        ],
        columns: [
            // {},{
            //     className: 'text-left'
            // }
        ]
    });

    $('#detail_event_table').on('click','#add_detail', function() {
        let de_data = [];
        $("#detail_event_table textarea").each(function(i,e) {
            de_data.push(e.value);
            e.value = null;
        })
        table_dt.row.add([de_data[0], de_data[1], de_data[2], null]).draw(false);;

    });

    $('#detail_event_table').on( 'click', '#remove_detail', function () {
        table_dt.row($(this).closest("tr")).remove().draw();
    } );

    

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

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

async function GetLineByProduction(prod){
    console.log('GetLineByProduction');
    await $.post(GetLineByProductionPath, ({Production : prod}) ,(res) => { 
        if(res.status == "success"){
            $("select[name='line']").empty();
            $("select[name='line']").append(`<option disabled value="default" selected>Line</option>`);
            let i = 1;
            res.data.forEach(line => {
                if(i++ == 1){
                    $("select[name='line']").append(new Option(line,line,false,true));
                }else{
                    $("select[name='line']").append(new Option(line,line));
                }
            });
        }
    });
}