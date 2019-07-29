$(document).ready(function () {
    localStorage.setItem('count', 0);

    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.ajax({
        dataType: "json",
        method: "POST",
        url: "/get_fields/",
        data: {}
    }).done(function(response) {
        for (i in response.fields) {
            if (response.fields.hasOwnProperty(i)) {
                let field = response.fields[i];
                insert_html(field['k'], field['v']);
                $('#city-id-' + field['k']).trigger('keyup');
            }
        }
    }).fail(function(response) {
        console.log(response);
    });

    $('input[type=radio][name=parameters-type]').change(function() {
        show_radio_content(this.value)
    });

    let cnf_city_name = $('#city-name');
    let cnf_country_code = $('#city-name-fields #country-code');
    let cif_city_id = $('#city-id');
    let gcf_latitude = $('#geographic-coordinates-fields #latitude');
    let gcf_longitude = $('#geographic-coordinates-fields #longitude');
    let zcf_zip_code = $('#zip-code-fields #zip-code');
    let zcf_country_code = $('#zip-code-fields #country-code');
    let rzf_longitude_left = $('#rectangle-zone-fields #longitude-left');
    let rzf_latitude_bottom = $('#rectangle-zone-fields #latitude-bottom');
    let rzf_longitude_right = $('#rectangle-zone-fields #longitude-right');
    let rzf_latitude_top = $('#rectangle-zone-fields #latitude-top');
    let rzf_zoom = $('#rectangle-zone-fields #zoom');
    let czf_latitude = $('#cycle-zone-fields #latitude');
    let czf_longitude = $('#cycle-zone-fields #longitude');
    let czf_count = $('#cycle-zone-fields #count');

    cnf_city_name.keyup({pattern: /^[A-Za-zА-Яа-я-]+$/, required_inputs: []}, validate_required_input);
    cnf_country_code.keyup({pattern: /^[A-Za-z]{2}$/}, validate_optional_input);
    cif_city_id.keyup({pattern: /^\d+$/, required_inputs: []}, validate_required_input);
    gcf_latitude.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [gcf_longitude]}, validate_required_input);
    gcf_longitude.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [gcf_latitude]}, validate_required_input);
    zcf_zip_code.keyup({pattern: /^\d{6}$/, required_inputs: [zcf_country_code]}, validate_required_input);
    zcf_country_code.keyup({pattern: /^[A-Za-z]{2}$/, required_inputs: [zcf_zip_code]}, validate_required_input);
    rzf_longitude_left.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [rzf_latitude_bottom, rzf_longitude_right, rzf_latitude_top, rzf_zoom]}, validate_required_input);
    rzf_latitude_bottom.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [rzf_longitude_left, rzf_longitude_right, rzf_latitude_top, rzf_zoom]}, validate_required_input);
    rzf_longitude_right.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [rzf_longitude_left, rzf_latitude_bottom, rzf_latitude_top, rzf_zoom]}, validate_required_input);
    rzf_latitude_top.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [rzf_longitude_left, rzf_latitude_bottom, rzf_longitude_right, rzf_zoom]}, validate_required_input);
    rzf_zoom.keyup({pattern: /^\d+$/, required_inputs: [rzf_longitude_left, rzf_latitude_bottom, rzf_longitude_right, rzf_latitude_top]}, validate_required_input);
    czf_latitude.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [czf_longitude, czf_count]}, validate_required_input);
    czf_longitude.keyup({pattern: /^\d+(\.\d+)?$/, required_inputs: [czf_latitude, czf_count]}, validate_required_input);
    czf_count.keyup({pattern: /^\d+$/, required_inputs: [czf_latitude, czf_longitude]}, validate_required_input);

    let checked_radio = $('input[type=radio][name=parameters-type]:checked');
    if (checked_radio.length === 1) {
        show_radio_content(checked_radio.attr('value'));
        cnf_city_name.trigger('keyup');
        cnf_country_code.trigger('keyup');
        cif_city_id.trigger('keyup');
        gcf_latitude.trigger('keyup');
        gcf_longitude.trigger('keyup');
        zcf_zip_code.trigger('keyup');
        zcf_country_code.trigger('keyup');
        rzf_longitude_left.trigger('keyup');
        rzf_latitude_bottom.trigger('keyup');
        rzf_longitude_right.trigger('keyup');
        rzf_latitude_top.trigger('keyup');
        rzf_zoom.trigger('keyup');
        czf_latitude.trigger('keyup');
        czf_longitude.trigger('keyup');
        czf_count.trigger('keyup');
    }
});


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


function add_input() {
    if (window.localStorage) {
        let count = localStorage.getItem('count');
        localStorage.setItem('count', ++count);
        insert_html(count);
    }
}


function insert_html(count, value='') {
    $('#city-id-form-group').parent().find('.form-group:last').after(
            '<div class="form-group" id="city-id-form-group-' + count + '">' +
                '<label for="city-id-' + count + '" class="hide">Идентификатор города</label>' +
                '<div class="row">' +
                    '<div class="col pr-0">' +
                        '<input type="text" class="form-control" id="city-id-' + count + '" name="city-id-' + count + '" placeholder="1496747" data-parent="city-id-fields" value="' + value + '">' +
                    '</div>' +
                    '<div class="col pl-0">' +
                        '<button type="button" class="btn btn-link h-100 pt-0 pb-0" onclick="del_input(' + count + ')">' +
                            '<i class="fas fa-minus-circle fa-2x h-100"></i>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
        $('#city-id-' + count).keyup({pattern: /^\d+$/}, validate_optional_input);
}


function del_input(n) {
    $('#city-id-form-group-' + n).detach();
}


function validate_required_input(e) {
    let input = $(e.target);
    let content = input.val();
    let button = $('#' + input.attr('data-parent')).find('#get_weather');
    if (content !== '') {
        if (e.data.pattern.test(content)) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');
            let all_valid = true;
            for (let i in e.data.required_inputs) {
                if (e.data.required_inputs.hasOwnProperty(i)) {
                    if (!$(e.data.required_inputs[i]).hasClass('is-valid')) {
                        all_valid = false;
                    }
                }
            }
            button.attr('disabled', !all_valid);
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');
            button.attr('disabled', true);
        }
    } else {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
        button.attr('disabled', true);
    }
}


function validate_optional_input(e) {
    let input = $(e.target);
    let content = input.val();
    if (content !== '') {
        if (e.data.pattern.test(content)) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');
        }
    } else {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
    }
}


function show_radio_content(value) {
    $('.show').each(function (i, e) {
        $(e).removeClass('show');
        $(e).addClass('hide');
    });
    var fields = $('#' + value + '-fields');
    fields.removeClass('hide');
    fields.addClass('show');
}