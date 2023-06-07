var shipments_table = null;

$(document).ready(function () {

    shipments_table = $('#shipments_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/shipments`
        },
        processing: true,
        serverSide: true,
        "columns": [
            {
                "data": null,
                "render": function (data) {

                    let co = data.vehiculo.centro_operacion_detail;

                    if (co) {
                        let city = data.vehiculo.centro_operacion_detail.ciudad;
                        if (city.zona) {
                            return city.zona.nombre
                        }
                    }

                    return "No registra";
                }
            },

            {
                "data": null,
                "render": function (data) {
                    
                    let co = data.vehiculo.centro_operacion_detail
                    if (co) {
                        return co.nombre
                    }

                    return "No registra";
                }
            },
            {
                "data": "placa",
            },
            {
                "data": null,
                "render": function (data) {
                    return new Date(data.fecha).toLocaleDateString();
                }

            },
            {
                "data": "kilos",
            },
            {
                "data": null,
                "render": function (data) {
                    return data.observacion ? data.observacion : 'No registra';
                }

            },
            {
                "data": null,
                "render": function (data) {

                    var output = ``;
                    if (hasPermChange) {
                        output += `<a class='btn btn-warning rounded-circle text-gray' title='Editar'  href='${baseUrl}/shipments/${data.id}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    if (hasPermDelete) {
                        output += `<button class='btn btn-danger rounded-circle ms-2' title='Eliminar'  onclick="remove_shipment('${data.id}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output === `` ? "No aplica" : output;
                }
            }


        ],
        "pageLength": 50,
        // "order": [[0, "asc"]],
    });


});

function remove_shipment(id) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el despacho?',
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
                backdrop:true,
                allowOutsideClick: () => !Swal.isLoading(),
                didOpen: () => {
                  Swal.showLoading()
                  $.ajax({
                    type:"DELETE",
                    contentType : 'application/json',
                    dataType : 'json',
                    headers: {"X-CSRFToken": getCookie('csrftoken')},
                    url: `${baseUrl}/api/shipments/${id}`
                }).done(function(data) {
                    shipments_table.ajax.reload()
                    Swal.fire({
                        title: 'Éxito',
                        text: "El despacho se ha eliminado satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    })
                }).fail(function(data) {
    
                    var res=data.responseJSON;
                    var status=data.status
                    var text='Ha ocurrido un error'
    
                    if(status===500){
                        text='Ha ocurrido un error inesperado, por favor contactar a soporte'
                    }else if(status===403 ||status===401){
                        text="Usted no se encuentra autorizado para realizar esta operación";
                    } 
    
                    Swal.fire({
                        title: 'Error',
                        text: text,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                    })
                  
                }).always(function() {
                    Swal.hideLoading()
                });
                }
            })
            
        }
    })

}