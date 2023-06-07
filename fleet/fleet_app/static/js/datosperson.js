var datos_tables = null;

$(document).ready(function () {

    datos_tables = $('#datos_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/datosperson`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "nombre",

            },
            {
                "data": "apellido",
            },

            {
                "data": "tipodocumento",
            },
            {
                "data": "documento",

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
                        output += `<button class='btn btn-warning rounded-circle text-gray' title='editar' onclick="editCompany('${data.nombre}','${data.apellido}','${data.tipodocumento}','${data.documento}','${data.celular}')"><i class="fa-regular fa-pen-to-square"></i></button>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2'title='eliminar'  onclick="removeCompany('${data.documento}')"><i class="fa-regular fa-trash-can"></i></button>`
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
    var isEdit = $('#documento').prop('disabled');

    if (form.checkValidity()) {
        var data = {
            nombre: $('#nombre').val(),
            apellido: $('#apellido').val(),
            tipodocumento: $('#tipodocumento').val(),
            documento: $('#documento').val(),
            celular: $('#celular').val(),
        }

        if (!isEdit) {
            data['documento'] = $('#documento').val();
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
                    url: `${baseUrl}/api/datosperson${isEdit ? '/' + $('#doumento').val() : ''}`,
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

function editCompany(id, nombre, apellido,tipodocumento, documento, celular) {
    let event = new Event('change');

    $('#nombre').val(nombre)
    $('#apellido').val(apellido)
    $('#tipodocumento').val(tipodocumento)
    $('#tipodocumento').trigger('change');
    $('#documento').val(documento)
    $('#celular').val(celular)

    // regionsSelect.dispatchEvent(event);
    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'inline-block')
    $('#documento').attr('disabled', true)

}

function cleanFields() {
    let event = new Event('change');

    $('#nombre').val('')
    $('#apellido').val("")
    $('#tipodocumento ').val('')
    $('#tipodocumento').trigger('change'); 

    $('#documento').val("")
    $('#celular').val('')
    regionsSelect.dispatchEvent(event);
    $('#is-default').prop( "checked", false );
    $('#btn-save').text('Crear usuario')
    $('#btn-discard').css('display', 'none')
    $('#documento').attr('disabled', false)
}

function removeCompany(id) {

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
                        url: `${baseUrl}/api/datosperson/${documento}`
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

