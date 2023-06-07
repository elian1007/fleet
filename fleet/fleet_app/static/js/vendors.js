var table_companies = null;
const form = document.getElementById('form-seller')


$(document).ready(function () {
    $('#select-tercero').select2({
        placeholder: 'Seleccione una opción',
        width: '100%'
    });
    table_companies = $('#companies_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/sellers`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "codigo",

            },
            {
                "data": null,
                "render": function (data) {
                
                    return data.datos_adicionales.nombre
                }
            },
           

            {
                "data": "celular",

            },

            {
                "data": null,
                "render": function (data) {
                    console.log(data)
                    var output = ``;
                    
                    if (hasPermChange) {
                        output += `<button class='btn btn-warning rounded-circle text-gray' title='editar' onclick="editCompany('${data.codigo}','${data.celular}','${data.cedula}')"><i class="fa-regular fa-pen-to-square"></i></button>`
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
            celular: $('#cell_phone').val(),
            cedula: $('#select-tercero').val(),
           
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
                    url: `${baseUrl}/api/sellers${isEdit ? '/' + $('#code').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El vendedor ha sido creada satisfactoriamente",
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
                            text = "Ya existe el vendedor registrado con este Codigo";
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

function editCompany(codigo,celular, cedula) {
    let dv = calcularDigitoVerificacion(codigo)
    let event = new Event('change');

    $('#code').val(codigo)
    $('#cell_phone').val(celular)
    $('#select-tercero').val(cedula)
    $('#select-tercero').trigger('change'); // Notify any JS components that the value changed
    // regionsSelect.dispatchEvent(event);

    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'inline-block')
    $('#code').attr('disabled', true)

}

function cleanFields() {
    let event = new Event('change');

    $('#code').val('')
    $('#select-tercero').val('')
    $('#select-tercero').trigger('change'); 
    $('#cell_phone').val('')
    // regionsSelect.dispatchEvent(event);
    $('#is-default').prop( "checked", false );
    $('#btn-save').text('Crear Vendedor')
    $('#btn-discard').css('display', 'none')
    $('#code').attr('disabled', false)
}

function removeCompany(codigo) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el vendedor?',
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
                        url: `${baseUrl}/api/sellers/${codigo}`
                    }).done(function (data) {
                        table_companies.ajax.reload()
                        Swal.fire({
                            title: 'Éxito',
                            text: "El vendedor se ha eliminado satisfactoriamente",
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

