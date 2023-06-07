var table_zone = null;

$(document).ready(function () {

    table_zone = $('#zones_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/zones`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "codigo",

            },
            {
                "data": "nombre",
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {

                    var output = ``;
                    if (hasPermChange) {
                        output += `<button class='btn btn-warning rounded-circle text-gray' title="Editar" onclick="editZone('${data.codigo}','${data.nombre}')"><i class="fa-regular fa-pen-to-square"></i></button>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2' title="Eliminar" onclick="removeZone('${data.codigo}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output === `` ? "No aplica" : output;
                }
            }

        ],
        "pageLength": 10,
        "order": [[0, "asc"]],

    });

});

const form = document.getElementById('form-zone')


form.addEventListener('submit', event => {

    event.preventDefault()
    event.stopPropagation()
    var isEdit = $('#code').prop('disabled');

    if (form.checkValidity()) {
        var data = {
            nombre: $('#name').val(),
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
                    url: `${baseUrl}/api/zones${isEdit ? '/' + $('#code').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "La zona ha sido creada satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cleanFields()
                            table_zone.ajax.reload()
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
                        text = "Ya existe una zona registrada con este código";
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

function editZone(code, name) {
    $('#code').val(code)
    $('#name').val(name)
    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'block')
    $('#code').attr('disabled', true)

}

function cleanFields() {
    $('#code').val('')
    $('#name').val('')
    $('#btn-save').text('Crear zona')
    $('#btn-discard').css('display', 'none')
    $('#code').attr('disabled', false)
}

function removeZone(code) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar la zona?',
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
                        url: `${baseUrl}/api/zones/${code}`
                    }).done(function (data) {
                        table_zone.ajax.reload()
                        Swal.fire({
                            title: 'Éxito',
                            text: "La zona se ha eliminado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        })
                    }).fail(function (data) {

                        var res = data.responseJSON;
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