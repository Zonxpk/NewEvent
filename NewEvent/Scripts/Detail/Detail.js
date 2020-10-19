var InsertReviewStatus = false;
var ReviewStatus = false;
var file_list = [];
var file_list_alt = [];
var file_list_rd = [];
var due_date;
var rsm_id = 0;
var resubmit_formIsEmpty = true;
var TrialIsEmpty = true;
var rsm_related_list = [];
var new_related_list = [];
var rv_submit;

/* -------------------------------------------------------------------------- */
/*                          For check radio and input                         */
/* -------------------------------------------------------------------------- */

var findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
var removeDuplicates = (names) => names.filter((v,i) => names.indexOf(v) === i)
var new_rv = [];

$(() => {

    new Zooming().listen('img');
    
    table_dt = $('#detail_event_table').DataTable({
        columnDefs:[{
            targets: [3,4,6],
            orderable: false,
        }],
        column:[]
    });
    
    autosize(document.querySelectorAll('textarea'));

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

/* ---------------------------------------------------------------------------------------------- */
/*                                         Calculate % NG                                         */
/* ---------------------------------------------------------------------------------------------- */
    $("#detail_event_table").on("input","tr [name='dt_ng_qty'], tr [name='dt_fg'], tr [name='dt_qty']", function() {
        let cells = $(this).closest("tr").children().children();
        let ng_qty = cells.closest("[name='dt_ng_qty']");
        let fg = cells.closest("[name='dt_fg']");
       
        if(Number(ng_qty.val()) > Number(fg.val() | 0)) ng_qty.val(fg.val() | 0);
       
        let percent_ng = ng_qty.val() * 100 / fg.val() | 0
        cells.closest("[name='dt_percent_ng']").val( percent_ng + "%"); 

    });

/* -------------------------------------------------------------------------- */
/*                                  Go to top                                 */
/* -------------------------------------------------------------------------- */

    $('[data-toggle="tooltip"]').tooltip();
    var btn = $('#Top');
    $(window).scroll(() => {
        if ($(window).scrollTop() > 600) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });

/* -------------------------------------------------------------------------- */
/*                           Resubmit's Wizard modal                          */
/* -------------------------------------------------------------------------- */

    $("#problem_modal").modalWizard();
    $("#problem_modal").on("navigate", (e, navDir, stepNumber) => {
        if($("#problem_modal").attr("data-current-step") == 3){
            let quick_form = $("form#resubmit_form").serializeArray();
            console.log(quick_form);

            let related = due_date = desc = "";
            
            quick_form.forEach(item => {
                if(item.value == "1"){
                        rsm_related_list.push(item.name);
                        related = (related == "") ? item.name : related + " , " + item.name;
                }else if(item.name == "desc"){
                    desc = item.value;
                }else if(item.name == "due_date"){
                    due_date = item.value;
                }
            });

            moment.locale("th");
            $("#related_date").val(moment(due_date,"DD-MM-YYYY").format('LL'));
            $("#related_dept").html(related);
            $("#related_desc").html(desc);
            console.log("related: ",related);
        }else{
            // $(".btn-success").prop('disabled', true);
            if(navDir == "prev"){
                relatedValidate();
            }else{
                if(!resubmit_formIsEmpty){
                    // $(".btn-success").prop('disabled', (rsm_validator.form()) ? false : true); 
                }
            }
        }
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

/* -------------------------------------------------------------------------- */
/*                        Related Department checkbox                         */
/* -------------------------------------------------------------------------- */

$.each(DepartmentLists, (key,val) => {
    if($(`.rl-${val.Name}`).length == $(`.rl-${val.Name}:checked`).length){
            $(`#rl-${val.Name}`).prop("disabled", true);
            $(`#rl-${val.Name}`).prop('checked', true);
    relatedValidate();
}
    $(`#rl-${val.Name}`).change(function(e) { //Group checkbox
            $(`.rl-${val.Name}`).each(function() { //Sub checkbox
                if(this.disabled == false){ //If sub checkbox is disabled
                    this.checked = (e.target.checked) ? true : false;
                }
            });
        relatedValidate();
    });

    $(`.rl-${val.Name}`).click(function () { //Sub checkbox
        if($(this).is(":checked")) {
            var isAllChecked = 0;

            $(`.rl-${val.Name}`).each(function() {
                if (!this.checked) isAllChecked = 1;
            });

            if(isAllChecked == 0) {
            $(`#rl-${val.Name}`).prop("checked", true);
            }     
        }else{
            $(`#rl-${val.Name}`).prop("checked", false); 
        }
        relatedValidate();
    });
});

    function relatedValidate(){
        checkbox_dept = $('input:checkbox.qForm.checkSingle:checked').length
        $(".rsm-submit").prop('disabled', (checkbox_dept > 0) ? false : true);
    }

/* -------------------------------------------------------------------------- */
/*                                Topic approve                               */
/* -------------------------------------------------------------------------- */

    $("#finish").click(() => {
        swal({
            title: "งานดังกล่าวพบปัญหาหรือไม่", 
            text: "หากไม่พบปัญหา สามารถกด OK เพื่อสิ้นสุด Event ดังกล่าว", 
            // closeOnClickOutside: false,
            buttons : [true,true],
            icon:"warning",
        }).then((res) => {
            if(res){
                $.post(ApproveTopicPath,() => {
                    var promises = [];
                    promises.push($.post(GenerateMailPath,{
                        'mode':(topic_code.substring(0,2) == "EX") ? 'InformUser' : 'InformPE',
                        'topic_code':topic_code,
                        'dept':(topic_code.substring(0,2) == "IN") ? pe_audit : null,
                    }).fail((error) => {
                    console.error(error);
                    swal("Error", "Cannot send email to Requestor, Please try again", "error");
                    return;
                }));
                    swal("Success", "Approve Success", "success").then(location.reload());
                }).fail( function(xhr, textStatus, errorThrown) {
                    console.error(xhr.responseText);
                    swal("Something wrong", "Please contact admin", "error");
                });
            }
        });
    })


/* -------------------------------------------------------------------------- */
/*                              Response resubmit                             */
/* -------------------------------------------------------------------------- */



/* ---- Clear file in filepond when changing from Resubmit topic to topic --- */
    var reply_id = 0;
    $(".reply_modal").click((e) => {
        let new_reply_id = e.target.id.split("-")[1];
        if(new_reply_id != reply_id){
            console.log("id not matched");
            $(".reply_form textarea").val('');
            reply_id = new_reply_id;
            if(file_list_rd.length > 0){
                file_list_rd.forEach(e => {
                    alt_removeFile(e.detail.id);
                });
                file_list_rd = [];
            }
            $("form.reply_form").attr("id", new_reply_id);
        }else{
            console.log("id matched");
        }
    });

/* ---------------------------- Change max value of FG and NG coulumn --------------------------- */

    $('tr').on("input","[name='dt_qty']",function(){
        let max_qty = this.value;
        $(this).parent().parent().find("[name='dt_fg'],[name='dt_ng_qty']").each(function(i,e) {
            if(e.value > max_qty) e.value = max_qty;
            e.max = max_qty
        });
    })

/* -------------------------------- Save able when input new data ------------------------------- */
    $("#detail_event_table input").on("input",function(){
        $("input[value='Update']").removeAttr("disabled");
    });

/* ------------------------------------ Save button on submit ----------------------------------- */
    $("input[value='Update']").click(function(){
        swal({
            title: "ต้องการบันทึกข้อมูลหรือไม่", 
            // text: "หากไม่พบปัญหา สามารถกด OK เพื่อสิ้นสุด Event ดังกล่าว", 
            // closeOnClickOutside: false,
            buttons : [true,true],
            icon:"warning",
        }).then((res) => {
            if(res){
                notyf.success('บันทึกข้อมูลสำเร็จ')
                this.disabled = true;
            //     $.post(ApproveTopicPath,() => {
            //         var promises = [];
            //         promises.push($.post(GenerateMailPath,{
            //             'mode':(topic_code.substring(0,2) == "EX") ? 'InformUser' : 'InformPE',
            //             'topic_code':topic_code,
            //             'dept':(topic_code.substring(0,2) == "IN") ? pe_audit : null,
            //         }).fail((error) => {
            //         console.error(error);
            //         swal("Error", "Cannot send email to Requestor, Please try again", "error");
            //         return;
            //     }));
            //         swal("Success", "Approve Success", "success").then(location.reload());
            //     }).fail( function(xhr, textStatus, errorThrown) {
            //         console.error(xhr.responseText);
            //         swal("Something wrong", "Please contact admin", "error");
            //     });
            }

        });
    });

});

function SetResubmitID(rsm_id){
    this.rsm_id = rsm_id;
}


/* -------------------------------------------------------------------------- */
/*                 Validate input that hvae same id with radio                */
/* -------------------------------------------------------------------------- */

function checkRadioAndInput(radio_input_list,submit_once){
    var isNotfilled = false;
    removeDuplicates(findDuplicates(radio_input_list)).forEach(d => {
        $(`[name="desc-${d}"]`).attr("disabled",($(`[name="rd-${d}"]:checked`).val() == 1) ? false : true);
        if($(`[name="rd-${d}"]:checked`).val() == 1 && $(`[name="desc-${d}"]`).val().length < 1){
            isNotfilled = true;
            if(submit_once) $(`[name="desc-${d}"]`).addClass("is-invalid");
        }else if($(`[name="rd-${d}"]:checked`).val() == 0){
            $(`[name="desc-${d}"]`).val("");
            $(`[name="desc-${d}"]`).removeClass("is-invalid");
        }else{
            $(`[name="desc-${d}"]`).removeClass("is-invalid");

        }
    });

    (!isNotfilled) ? $("#validate-warning").hide() : $("#validate-warning").show();
    return isNotfilled;
}

function checkInputRequired(){
    var isNotfilled = false;

    $("input.required , textarea.required").each(function(i, value) {
        if(this.value == 0){
            isNotfilled = true;
            $(`[name="${this.name}"]`).addClass("is-invalid");
        }else{
            $(`[name="${this.name}"]`).removeClass("is-invalid");
        }
    });

    // $('form#review').find(':submit').attr("disabled",(!isNotfilled) ? false : true);
    (!isNotfilled) ? $("#validate-warning").hide() : $("#validate-warning").show();
    return isNotfilled;
}


function checkMax(e){
    if(Number(e.value) > Number(e.max)){
        e.value = e.max;
    }
}