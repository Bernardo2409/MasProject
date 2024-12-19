function validate() {
    var retVal = true;
    if ($("#Firstname").val().length < 4) {
        $("#Nome1Error").removeClass("d-none");
        retVal = false;
    } else {
        $("#Nome1Error").addClass("d-none");
    }

    if ($("#Lastname").val().length < 4) {
        $("#Nome2Error").removeClass("d-none");
        retVal = false;
    } else {
        $("#Nome2Error").addClass("d-none");
    }

    if ($("#Email").val().length < 8 || $("#Email").val().length > 100 || $("#Email").val().indexOf("@") == -1 || $("#Email").val().lastIndexOf("@") > $("#Email").val().lastIndexOf(".") || $("#Email").val().lastIndexOf(".") == $("#Email").val().length - 1) {
        $("#EmailError").removeClass("d-none");
        
        retVal = false;
    } else {
        $("#EmailError").addClass("d-none");
        
    }

    if ($("#Text").val().split(' ').length < 10) {
        $("#TextError").removeClass("d-none");
        retVal = false;
    } else {
        $("#TextError").addClass("d-none");
    }

    if ($('#Terms:checked').length == 0) {
        $("#TermsError").removeClass("d-none");
        retVal = false;
        
    } else {
        $("#TermsError").addClass("d-none");
    };

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var lst = $("#Datepicker").val().split('-');

    if ($("input[name='avaliacao']:checked").length == 0) {
        $("#SuggestionError").removeClass("d-none");
        retVal = false;
    } else {
        $("#SuggestionError").addClass("d-none");
    }

    


    if (lst[0] > today.getFullYear()){
        $("#DateError").removeClass("d-none");
        retVal = false;

    }else if(lst[0] == today.getFullYear()){
        if (lst[1] > today.getMonth()+1){
            $("#DateError").removeClass("d-none");
            retVal = false;

        }else if(lst[1] == today.getMonth()+1){
            if (lst[2] > today.getDate()){
                $("#DateError").removeClass("d-none");
                retVal = false;
            }else{
                $("#DateError").addClass("d-none"); 
            }
        }else{
            $("#DateError").addClass("d-none"); 
        }

    }else{
        $("#DateError").addClass("d-none");
    }

    return retVal;
};

function resetFunc(){
    $("#Nome1Error").addClass("d-none");
    $("#Nome2Error").addClass("d-none");
    $("#EmailError").addClass("d-none");
    $("#TextError").addClass("d-none");
    $("#TermsError").addClass("d-none");
    $("#DateError").addClass("d-none");
}
$(document).ready(function(){
    $(".form-select").change(function(){
        if ($(".form-select option:selected").val() != 0) {
            $("#Formulario").removeClass("d-none");
        } else {
            $("#Formulario").addClass("d-none");
        }

        if ($(".form-select option:selected").val() == 1) {
            $("#Bugs").removeClass("d-none");
            $("#suggestion").addClass("d-none");
        } else if ($(".form-select option:selected").val() == 2) {
            $("#suggestion").removeClass("d-none");
            $("#Bugs").addClass("d-none");
        } else {
            $("#Bugs").addClass("d-none");
            $("#suggestion").addClass("d-none");
        }
    });
});

function showThankYouMessage() {
    document.getElementById("thank-you-message").style.display = "block";
}

const radios = document.querySelectorAll('input[name="avaliacao"]');
const submitBtn = document.getElementById('submit-btn');

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        submitBtn.disabled = false; 
    });
});