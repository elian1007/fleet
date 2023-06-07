var vehicle_capacity_table = null;
const form = document.getElementById('form-capacity')
const regionSelect = document.getElementById('select-region-route')

$(document).ready(function () {

    vehicle_capacity_table = $('#vehicle_capacity_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/vehicles_capacity`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "placa",
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return 'No disponible'
                }
            },
            {
                "data": null,
                "render": function (data) {
                    return `${data.ciudad.nombre} (${data.ciudad.departamento.nombre})`;
                }
            },
            {
                "data": "peso_vacio",
            },
            {
                "data": "capacidad_carga",
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return parseFloat(data.peso_vacio) + parseFloat(data.capacidad_carga)
                }
            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    
                    
                    var output = ``;

                    if (hasPermChange) {
                        output += `<button class='btn btn-warning rounded-circle text-gray' title='editar' onclick="editVehicleCapacity('${data.placa}','${data.ciudad.departamento.codigo}','${data.ruta}','${data.peso_vacio}','${data.capacidad_carga}')"><i class="fa-regular fa-pen-to-square"></i></button>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2'title='eliminar'  onclick="removeVehicleCapacity('${data.placa}','${data.ruta}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output === `` ? "No aplica" : output;
                }
            }

        ],
        "pageLength": 10,
        "order": [[0, "asc"]],

    });

});




regionSelect.addEventListener('change', function (e) {

    let selectedCity=$('#select-city-route').data('selected')
    
    $('#select-city-route')
    .empty()
    .append('<option selected="selected" value="">Seleccione una opción</option>');
    if (e.target.value !== '') {
        $('#load-city').css('display','inline-block')
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
            url: `${baseUrl}/api/cities/region/${e.target.value}`,

        }).done(function (data) {
    
            data.forEach(city => {
                
                if(selectedCity && parseInt(selectedCity)===parseInt(city.codigo)){
                    $('#select-city-route').append(new Option(city.nombre, city.codigo, true, true));
                }else{
                    $('#select-city-route').append(new Option(city.nombre, city.codigo));
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
            Swal.fire({
                title: 'Error',
                text: text,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
        }).always(function () {
            $('#load-city').css('display','none')
        });
    }
})

form.addEventListener('submit', event => {

    event.preventDefault()
    event.stopPropagation()
    var isEdit = $('#select-vehicle-id').prop('disabled');

    if (form.checkValidity()) {
        var data = {
            placa: $('#select-vehicle-id').val(),
            ruta:$('#select-city-route').val(),
            peso_vacio:$('#weight').val(),
            capacidad_carga:$('#vehicle-capacity').val(),
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
                    url: `${baseUrl}/api/vehicles_capacity${isEdit ? `/` + $('#select-vehicle-id').val()+ `?route=${$('#select-city-route').val()}`: ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El registro ha sido creado satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cleanFields()
                            vehicle_capacity_table.ajax.reload()
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
                        text = "Ha ocurrido un error al guardar el registro";
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


/**TODO se debe enviar el departamento desde el server /vehicles_capacity
 * 
 * @param {*} vehicle_id 
 * @param {*} route 
 * @param {*} weight 
 * @param {*} capacity 
 */
function editVehicleCapacity(vehicle_id,regionCode, route, weight,capacity) {
    
    let event = new Event('change');
    $('#select-vehicle-id').val(vehicle_id)

    $('#select-city-route').data('selected',route)
    $('#select-region-route').val(regionCode)
    regionSelect.dispatchEvent(event);

    $('#weight').val(weight)
    $('#vehicle-capacity').val(capacity)
    $('#btn-save').text('Guardar cambios')
    $('#btn-discard').css('display', 'block')
    $('#select-vehicle-id').attr('disabled',true)
}

function cleanFields() {
    let event = new Event('change');

    $('#select-vehicle-id').val('')
    $('#select-city-route').removeData('selected')
    $('#select-region-route').val("")
    regionSelect.dispatchEvent(event);
    $('#weight').val('')
    $('#vehicle-capacity').val('')
    $('#btn-save').text('Guardar')
    $('#btn-discard').css('display', 'none')
    $('#select-vehicle-id').attr('disabled',false)
}

function removeVehicleCapacity(vehicle_id, route) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el registro?',
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
                        url: `${baseUrl}/api/vehicles_capacity/${vehicle_id}?route=${route}`
                    }).done(function (data) {
                        vehicle_capacity_table.ajax.reload()
                        Swal.fire({
                            title: 'Éxito',
                            text: "El registro se ha eliminado satisfactoriamente",
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