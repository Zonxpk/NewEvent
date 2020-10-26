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

    $('#email_to').select2({
        templateSelection : function (tag, container){
            var $option = $(`option:contains(${tag.id})`);
            if ($option.attr('locked')){
                $(container).addClass('locked-tag');
                tag.locked = true; 
            }else{
                tag.locked = false; 
            }
            return tag.text;
        },
    });

    $('#add_mail').on('click', function() {
        var mail = $('[name="mt_mail"]');
        if(mail.val() != ""){
            var newOption = new Option(mail.val(), mail.val(), false, true);
            $('#email_to').append(newOption).trigger('change');
        }
        mail.val(null);

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
                        return '<button type="button" id="remove_detail" value="detail" class="btn btn-danger btn-block"><i class="fa fa-trash"></i>&nbsp;&nbsp;Remove</button>';
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
        if(!de_data.includes("")) table_dt.row.add([de_data[0], de_data[1], de_data[2], null]).draw(false);
    });

    $('#detail_event_table').on( 'click', '#remove_detail', function () {
        table_dt.row($(this).closest("tr")).remove().draw();
    });

    /* -------------------------------------------------------------------------- */
    /*                        Resubmit Department checkbox                        */
    /* -------------------------------------------------------------------------- */

    $.each(DepartmentLists, (key,val) => {
        if($(`.rs-${val.Name}`).length == $(`.rs-${val.Name}:checked`).length){
            $(`#rs-${val.Name}`).prop('checked', true);
        relatedValidate();
    }
        $(`#rs-${val.Name}`).change(function(e) {
                $(`.rs-${val.Name}`).each(function() {
                    this.checked = (e.target.checked) ? true : false;
                });
            relatedValidate();
        });

        $(`.rs-${val.Name}`).click(function () {
            if($(this).is(":checked")) {
                var isAllChecked = 0;

                $(`.rs-${val.Name}`).each(function() {
                    if (!this.checked) isAllChecked = 1;
                });

                if(isAllChecked == 0) {
                $(`#rs-${val.Name}`).prop("checked", true);
                }     
            }else{
                $(`#rs-${val.Name}`).prop("checked", false); 
            }
            relatedValidate();
        });
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