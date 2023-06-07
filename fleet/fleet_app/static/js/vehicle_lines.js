var table_vehicle_lines = null;

$(document).ready(function () {

    table_vehicle_lines = $('#vehicle_lines_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/vehicle_lines`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "id_linea",

            },
            {
                "data": "nombre",
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {

                    
                    var output = ``;

               
                    if (hasPermChange) {
                        output += `<button class='btn btn-warning rounded-circle text-gray' title='editar' onclick="editVehicleLine('${data.id_linea}','${data.nombre}')"><i class="fa-regular fa-pen-to-square"></i></button>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2'title='eliminar'  onclick="removeVehicleLine(${data.id_linea})"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output === `` ? "No aplica" : output;
                }
            }

        ],
        "pageLength": 10,
        "order": [[0, "asc"]],

    });

});

const form = document.getElementById('form-lines')


form.addEventListener('submit', event => {

    event.preventDefault()
    event.stopPropagation()
    var isEdit = $('#line_id').val()!=='';

    if (form.checkValidity()) {
        var data = {
            nombre: $('#name').val(),
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
                    url: `${baseUrl}/api/vehicle_lines${isEdit ? '/' + $('#line_id').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "La línea ha sido creada satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cleanFields()
                            table_vehicle_lines.ajax.reload()
                        }
                    })
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



function editVehicleLine(id, name) {
    $('#line_id').val(id)
    $('#name').val(name)
    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'block')
}

function cleanFields() {
    $('#line_id').val('')
    $('#name').val('')
    $('#btn-save').text('Crear línea')
    $('#btn-discard').css('display', 'none')
    $('#line_id').val('')
}

function removeVehicleLine(line_id) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar la linea de vehículos?',
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
                        url: `${baseUrl}/api/vehicle_lines/${line_id}`
                    }).done(function (data) {
                        table_vehicle_lines.ajax.reload()
                        Swal.fire({
                            title: 'Éxito',
                            text: "La línea se ha eliminado satisfactoriamente",
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