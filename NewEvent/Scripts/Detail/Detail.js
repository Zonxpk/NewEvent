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
    var rv_form = $('form#review').serializeArray();
    rv_form.forEach(function(rv){
        new_rv.push(rv.name.split("-")[1]);
    });

    if(topic_status == "7" || !isQC || !isReview){
        $(".zoom-fab#change_status").addClass("hide-fab");
    }

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
/*                             Resubmit's Validate                            */
/* -------------------------------------------------------------------------- */

var rsm_validator = $('#resubmit_form').validate({
    rules: {
        desc: {required: true,},
        due_date: {required: true,date: true}
    },
    messages: {
        desc: {required: "Please enter a description",},
        due_date: {required: "Please enter a due date",date: "Please enter a valid date"}
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest(".col-form-label").append(error);
      $(".btn-success").prop('disabled', true);
    },
    highlight: function (element, errorClass, validClass) {$(element).addClass('is-invalid');},
    unhighlight: function (element, errorClass, validClass) {$(element).removeClass('is-invalid');}
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
/*                           Related's Wizard modal                           */
/* -------------------------------------------------------------------------- */

// $("#accident_modal").modalWizard();
// $("#accident_modal").on("navigate", (e, navDir, stepNumber) => {
// });

/* -------------------------------------------------------------------------- */
/*                             Resubmit's Validate                            */
/* -------------------------------------------------------------------------- */

    $("#resubmit_form [name='desc'], #resubmit_form [name='due_date']").on("keydown keyup click change", () => {
        if($("#resubmit_form [name='desc']").val() != "" && $("#resubmit_form [name='due_date']").val() !== ""){
            resubmit_formIsEmpty = false;
        }else{
            resubmit_formIsEmpty = true;
        }
        if(!resubmit_formIsEmpty){
            $(".btn-success").prop('disabled', (rsm_validator.form()) ? false : true); 
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

    $('[data-toggle="datepicker"]').datepicker({
        format: 'dd-mm-yyyy'
    });
    
/* -------------------------------------------------------------------------- */
/*                                Topic approve                               */
/* -------------------------------------------------------------------------- */

    $("#tp_approve").click(() => {
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
/*                             Submit review topic                            */
/* -------------------------------------------------------------------------- */

$("form#review").submit((e) => {
    rv_submit = true;
    let RadioNotValidate = checkRadioAndInput(new_rv,rv_submit);
    let InputNotValidate = checkInputRequired();
    if(RadioNotValidate || InputNotValidate){
        return; 
    }

    e.preventDefault();
    $('#loading').removeClass('hidden')
    let rv_form = SerializeReviewForm();
    $.post(InsertReviewPath, (result) => {
        if(result.mail != ""){
            $.post(GenerateMailPath,{ 'mode': result.mail, 'topic_code':topic_code, 'dept':result.dept, 'pos':result.pos }).fail((error) => {
                console.error(error);
                swal("Error", "Cannot send email to Requestor, Please try again", "error");
                return;
            })
        }
        var promises = [];
        files = file_list;
        console.log("files",files);
        
        for(var index in files){
            files[index].file = files[index].detail.file;
            delete files[index].detail;
        }

        files.forEach(element => {
            var Data = new FormData();
            Data.append("file",element.file);
            Data.append("description",element.description);
            promises.push($.ajax({
                type: "POST",
                url: InsertFilePath,
                data: Data,
                cache: false,
                processData: false,
                contentType: false,
                error: function() {
                    swal("Error", "Upload file not success", "error");
                }
            }));
        });

        rv_form.forEach(element => {
            console.log(element);
            promises.push(
                $.post(InsertReviewItemPath, {
                    'status' : element.status,
                    'description' : element.desc,
                    'id' : element.id,
                },(data) => {
                    console.log('Inserted item');
                }).fail(() => {
                    alert('error handling here');
                })
            )
        });
        
        Promise.all(promises).then(() => {
            $('#loading').addClass('hidden')
            $("#ReviewSubmit").prop("disabled",true)
            swal("Success", "Insert Complete", "success").then(setTimeout(() => { location.reload(); }, 1500));
        })
    }).fail(() => {
        setTimeout(() => { location.reload(); }, 1500);
    });

});

/* -------------------------------------------------------------------------- */
/*                             Submit trial topic                             */
/* -------------------------------------------------------------------------- */

$("form#Trial").submit((e) => {
    e.preventDefault();
    $('#loading').removeClass('hidden')
        let trial_form = $("form#Trial").serializeArray();
        var promises = [];

        files = file_list;
        console.log("files",files);
        
        for(var index in files){
            files[index].file = files[index].detail.file;
            delete files[index].detail;
        }

        promises.push($.post(InsertTrialPath,{ desc: trial_form[0].value},(result) => {
            if(result.mail != ""){
                $.post(GenerateMailPath,{ 'mode': result.mail, 'topic_code':topic_code, 'dept':result.dept, 'pos':result.pos }).fail((error) => {
                    console.error(error);
                    swal("Error", "Cannot send email to Requestor, Please try again", "error");
                    return;
                })
            }
            console.log('Inserted trial');
            files.forEach(element => {
                var Data = new FormData();
                Data.append("file",element.file);
                Data.append("description",element.description);
                promises.push($.ajax({
                    type: "POST",
                    url: InsertFileTrialPath,
                    data: Data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function () {
                        console.log('trial file uploaded');
                    },error: function() {
                        swal("Error", "Upload file not success", "error");
                    }
                }));
            });
        }).fail(() => {
            swal("Error", "Trial is not succes, Please contact admin", "error");
            $('#loading').addClass('hidden')
        }));
        
        Promise.all(promises).then(() => {
            $('#loading').addClass('hidden')
            InsertReviewStatus = false;
            $("#trial_submit").prop("disabled",true)
            swal("Success", "Insert Complete", "success").then(setTimeout(() => { location.reload(); }, 1500));
        })
});


/* -------------------------------------------------------------------------- */
/*                               Apply resubmit                               */
/* -------------------------------------------------------------------------- */
    $("form#resubmit_form").submit((e) => {
        e.preventDefault();
        let quick_form = $(".rsm_related_radio").serializeArray();
        for(x in quick_form){
            quick_form[x] = quick_form[x].name;
        }

        console.log(quick_form);
        $.post(InsertRelatedPath, {dept_list:quick_form}, () =>{
            console.log('Related created');
            $.post(RequestResubmitPath, $("#resubmit_form").serialize(), (res) =>{
                console.log('Resubmit created');
                if(res.code){
                    moment.locale('en');
                    $.post(GenerateMailPath,{ 'mode': 'RequestDocument', 'topic_code':topic_code, 'due_date': moment(due_date,"DD-MM-YYYY").format('D MMMM YYYY'), 'dept_arry': rsm_related_list, }).fail((error) => {
                        console.error(error);
                        swal("Error", "Cannot send email to Requestor, Please try again", "error");
                        return;
                    })
                    swal("Success", "Resubmit Complete", "success").then(setTimeout(() => { location.reload(); }, 1500));
                }else{
                    swal("Error", "Resubmit Not Success, Please Try Again", "error");
                }
            });
        });
    });


/* -------------------------------------------------------------------------- */
/*                              Response resubmit                             */
/* -------------------------------------------------------------------------- */

    $("#submit_reply_form").click((e) => {
        e.preventDefault();
        $('#loading').removeClass('hidden')
            let form_response = $("form.reply_form").serializeArray();
            // var response_id = $("form.reply_form").attr("id");
            // var response_id = $("form.reply_form").attr("id");
            var promises = [];

            files = file_list_rd;
            console.log("files",files);
            
            for(var index in files){
                files[index].file = files[index].detail.file;
                delete files[index].detail;
            }

            promises.push($.post(InsertResponsePath,{ desc: form_response[0].value, resubmit_id: rsm_id},() => {
                console.log('Inserted item');
                files.forEach(element => {
                    var Data = new FormData();
                    Data.append("file",element.file);
                    Data.append("description",element.description);
                    promises.push($.ajax({
                        type: "POST",
                        url: InsertFileResponsePath,
                        data: Data,
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function () {
                        },
                        error: function() {
                            swal("Error", "Upload file not success", "error");
                        }
                    }));
                });
            }).fail(() => {
                swal("Error", "Reply not success", "error");
            }));

            Promise.all(promises).then(() => {
                $('#loading').addClass('hidden')
                InsertReviewStatus = false;
                $("#ResponseSubmit").prop("disabled",true)
                $("#reply_modal").modal("hide")
                swal("Success", "Insert Complete", "success").then(setTimeout(() => { location.reload(); }, 1500));
            })
    });


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

function SerializeReviewForm(){
    var f_list = [];
    $("form#review [data-id]:not(:disabled)").each(function (i,v) {
        let rv_id = $(this).data('id');
        if(f_list[`${rv_id}`] == null) f_list[`${rv_id}`] = {id:rv_id, status: null, desc: null}
        
        if($(this).data('type') == "status" && $(this)[0].checked == true){
            f_list[`${rv_id}`].status = this.value;
        }else if($(this).data('type') == "desc"){
            f_list[`${rv_id}`].desc = this.value;
        }
    });
    return f_list.filter(Boolean);
}