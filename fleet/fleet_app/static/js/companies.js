var table_companies = null;

const form = document.getElementById('form-company')
const nitInput = document.getElementById('nit')
const regionsSelect = document.getElementById('select-region')
$(document).ready(function () {

    table_companies = $('#companies_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/companies`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "nit",

            },
            {
                "data": "nombre",
            },
            {
                "data": null,
                "render": function (data) {
                    return `${data.ciudad.nombre} (${data.ciudad.departamento.nombre})`;
                }
            },
            {
                "data": "direccion",
            },
            {
                "data": "telefono",

            },
            {
                "data": "contacto",
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return data.predeterminada ? "SÍ" : 'NO';
                }
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    console.log(data)
                    var output = ``;
                    
                    if (hasPermChange) {
                        output += `<button class='btn btn-warning rounded-circle text-gray' title='editar' onclick="editCompany('${data.nit}','${data.nombre}','${data.codigo_ciudad}','${data.ciudad.departamento.codigo}','${data.direccion}','${data.telefono}','${data.contacto}',${data.predeterminada})"><i class="fa-regular fa-pen-to-square"></i></button>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2'title='eliminar'  onclick="removeCompany('${data.nit}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output === `` ? "No aplica" : output;
                }
            }

        ],
        "pageLength": 10,
        "order": [[0, "asc"]],

    });

});


regionsSelect.addEventListener('change', function (e) {

    let selectedCity=$('#select-city').data('selected') 
    $('#select-city')
        .empty()
        .append(`<option ${selectedCity?"":'selected="selected"'} value="">Seleccione</option>`);
    if (e.target.value !== '') {
        $('#load-city').css('display', 'inline-block')
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
            url: `${baseUrl}/api/cities/region/${e.target.value}`,

        }).done(function (data) {

            
            data.forEach(city => {
                if(selectedCity && parseInt(selectedCity)===parseInt(city.codigo)){
                    $('#select-city').append(new Option(city.nombre, city.codigo, true, true));
                }else{
                    $('#select-city').append(new Option(city.nombre, city.codigo));
                }
            });

        }).fail(function (data) {

            var status = data.status
            var text = 'Ha ocurrido un error'

            if (status === 500) {
                text = 'Ha ocurrido un error inesperado, por favor contactar a soporte'
            } else if (status === 403 || status === 401) {
                text = "Usted no se encuentra autorizado para realizar esta operación";
            } else if (status === 400) {
                text = "Ha ocurrido un error al guardar la línea";
            }
        }).always(function () {
            $('#load-city').css('display', 'none')
        });
    }

})

nitInput.addEventListener('blur', (e) => {

    var value = e.target.value;
    var dv = ""
    if (value.trim() !== "") {
        dv = calcularDigitoVerificacion(value)
    }
    $('#dv').val(dv)

})

var isNumber = (evt) => {
    let iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
}



form.addEventListener('submit', event => {

    event.preventDefault()
    event.stopPropagation()
    var isEdit = $('#nit').prop('disabled');

    if (form.checkValidity()) {
        var data = {
            nombre: $('#name').val(),
            telefono: $('#phone').val(),
            contacto: $('#contact').val(),
            direccion: $('#address').val(),
            codigo_ciudad: $('#select-city').val(),
            predeterminada: $('#is-default').is(":checked") 
        }

        if (!isEdit) {
            data['nit'] = $('#nit').val();
        }
        Swal.fire({
            title: 'Guardando...',
            backdrop: true,
            timerProgressBar: true,
            allowOutsideClick: () => !Swal.isLoading(),
            didOpen: () => {
                Swal.showLoading()
                $.ajax({
                    type: isEdit ? "PUT" : "POST",
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
                    url: `${baseUrl}/api/companies${isEdit ? '/' + $('#nit').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "La empresa ha sido creada satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cleanFields()
                            table_companies.ajax.reload()
                        }
                    })
                }).fail(function (data) {

                    var res = data.responseJSON;
                    var status = data.status
                    var text = 'Ha ocurrido un error'

                    if (status === 500) {
                        text = 'Ha ocurrido un error inesperado, por favor contactar a soporte'
                    } else if (status === 403 || status === 401) {
                        text = "Usted no se encuentra autorizado para realizar esta operación";
                    } else if (status === 400) {
                        if(res['nit']){
                            text = "Ya existe una empresa registrada con este NIT";
                        }else{
                            text = res[0]['error'];
                        }
                    }
                    Swal.fire({
                        title: 'Error',
                        text: text,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                    })
                }).always(function () {
                    Swal.hideLoading()
                });
            },
        })
    }

}, false)

function editCompany(nit, nombre, codigo_ciudad,codigo_departamento, direccion, telefono, contacto, predeterminada) {
    let dv = calcularDigitoVerificacion(nit)
    let event = new Event('change');

    $('#nit').val(nit)
    $('#dv').val(dv)
    $('#name').val(nombre)
    $('#select-city').data('selected',codigo_ciudad)
    $('#select-region').val(codigo_departamento)
    regionsSelect.dispatchEvent(event);

    $('#address').val(direccion)
    $('#phone').val(telefono)
    $('#contact').val(contacto)
    $('#is-default').prop( "checked", predeterminada );
    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'inline-block')
    $('#nit').attr('disabled', true)

}

function cleanFields() {
    let event = new Event('change');

    $('#nit').val('')
    $('#dv').val('')
    $('#name').val('')
    $('#select-city').removeData('selected')
    $('#select-region').val("")
    regionsSelect.dispatchEvent(event);
    $('#address').val('')
    $('#phone').val('')
    $('#contact').val('')
    $('#is-default').prop( "checked", false );
    $('#btn-save').text('Crear empresa')
    $('#btn-discard').css('display', 'none')
    $('#nit').attr('disabled', false)
}

function removeCompany(nit) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar la empresa?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'SÍ',
        icon: 'question',
        denyButtonText: `NO`,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando...',
                timerProgressBar: true,
                backdrop: true,
                allowOutsideClick: () => !Swal.isLoading(),
                didOpen: () => {
                    Swal.showLoading()
                    $.ajax({
                        type: "DELETE",
                        contentType: 'application/json',
                        dataType: 'json',
                        headers: { "X-CSRFToken": getCookie('csrftoken') },
                        url: `${baseUrl}/api/companies/${nit}`
                    }).done(function (data) {
                        table_companies.ajax.reload()
                        Swal.fire({
                            title: 'Éxito',
                            text: "La empresa se ha eliminado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        })
                    }).fail(function (data) {

                        var status = data.status
                        var text = 'Ha ocurrido un error'

                        if (status === 500) {
                            text = 'Ha ocurrido un error inesperado, por favor contactar a soporte'
                        } else if (status === 403 || status === 401) {
                            text = "Usted no se encuentra autorizado para realizar esta operación";
                        }

                        Swal.fire({
                            title: 'Error',
                            text: text,
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                        })

                    }).always(function () {
                        Swal.hideLoading()
                    });
                }
            })
        }
    })
}

