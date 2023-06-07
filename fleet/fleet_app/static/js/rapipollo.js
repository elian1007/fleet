var table_companies = null;

const form = document.getElementById('form-company')
const nitInput = document.getElementById('codigo')
const regionsSelect = document.getElementById('select-region')
$(document).ready(function () {
    $('#select-tercero').select2({
        placeholder: 'Seleccione una opción',
        width: '100%'
    });
    $('#select-placa').select2({
        placeholder: 'Seleccione una opción',
        width: '100%',
    });
    table_companies = $('#companies_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/rapipollos`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "codigo",

            },
            {
                "data": null,
                "render":function(data){
                    
                    return data.datos_adicionales && data.datos_adicionales.nombre ? data.datos_adicionales.nombre: 'No registra'
                }
            },
            {
                "data": "placa",
            },
            {
                "data": "celular",

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    console.log(data)
                    var output = ``;
                    
                    if (hasPermChange) {
                        output += `<button class='btn btn-warning rounded-circle text-gray' title='editar' onclick="editCompany('${data.codigo}','${data.cedula}','${data.celular}','${data.placa}')"><i class="fa-regular fa-pen-to-square"></i></button>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2'title='eliminar'  onclick="removeCompany('${data.codigo}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output === `` ? "No aplica" : output;
                }
            }

        ],
        "pageLength": 10,
        "order": [[0, "asc"]],

    });

});


var isNumber = (evt) => {
    let iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
}

form.addEventListener('submit', event => {

    event.preventDefault()
    event.stopPropagation()
    var isEdit = $('#code').prop('disabled');

    if (form.checkValidity()) {
        var data = {
            codigo: $('#code').val(),
            cedula: $('#select-tercero').val(),
            celular: $('#contact').val(),
            placa: $('#select-placa').val(),
        }

        if (!isEdit) {
            data['codigo'] = $('#code').val();
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
                    url: `${baseUrl}/api/rapipollos${isEdit ? '/' + $('#code').val() : ''}`,
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
                        if(res['codigo']){
                            text = "Ya existe una empresa registrada con este codigo";
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

function editCompany(codigo, cedula, celular,placa) {
    let event = new Event('change');

    $('#code').val(codigo)
    $('#contact').val(celular)
    $('#select-tercero').val(cedula)
    $('#select-placa').val(placa)
    $('#select-tercero').trigger('change'); // Notify any JS components that the value changed
    $('#select-placa').trigger('change'); // Notify any JS components that the value changed

    // regionsSelect.dispatchEvent(event);

    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'inline-block')
    $('#code').attr('disabled', true)

}

function cleanFields() {
    let event = new Event('change');

    $('#code').val('')
    $('#select-tercero').val('')
    $('#select-tercero').trigger('change')
    $('#select-placa').val('')
    $('#select-placa').trigger('change')

    $('#contact').val('')
    // regionsSelect.dispatchEvent(event);
    $('#is-default').prop( "checked", false );
    $('#btn-save').text('Crear rapipollo')
    $('#btn-discard').css('display', 'none')
    $('#code').attr('disabled', false)
}

function removeCompany(codigo) {

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
                        url: `${baseUrl}/api/rapipollos/${codigo}`
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

