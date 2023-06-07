var travel_costs_table=null;

$(document).ready(function () {

    travel_costs_table=$('#travel_costs_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
  
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/travel_costs`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": null,
                "render": function (data) {
                    return `${data.ciudad_origen.nombre} (${data.ciudad_origen.departamento.nombre})`;

                }

            },
            {
                "data": null,
                "render": function (data) {
                    return `${data.ciudad_destino.nombre} (${data.ciudad_destino.departamento.nombre})`;

                }

            },
            {
                "data": null,
                "render": function (data) {
                    return data.linea.nombre;

                }

            },
            {
                "data": "toneladas",

            },
            {
                "data": null,
                "render": function (data) {
                    return formatPrice(data.combustible);

                }

            },
            {
                "data": null,
                "render": function (data) {
                    return formatPrice(data.peajes);

                }

            },
            {
                "data": null,
                "render": function (data) {
                    return formatPrice(data.alimentacion);

                }

            },
            {
                "data": null,
                "render": function (data) {
                    return formatPrice(data.soat);

                }

            },

            {
                "data": null,
                "render": function (data) {
                    return formatPrice(data.gasto_operativo);

                }

            },
             {
                "data": null,
                "render": function (data) {
                    return formatPrice(data.gasto_mantenimiento);

                }

            },

            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return '0';

                }

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return '0';

                }

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    
                    var output = ``;
                    if(hasPermChange){
                        output += `<a class='btn btn-warning rounded-circle text-gray'  href='${baseUrl}/travel_costs/${data.id}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    if(hasPermDelete){
                        output += `<button class='btn btn-danger rounded-circle ms-2' onclick="removeTravelCost('${data.id}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output===``? "No aplica" : output;
                }
            }

        ],
        "pageLength": 50,
        "order": [[0, "asc"]],

    });

});

function removeTravelCost(code) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el costo de viaje?',
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
                    url: `${baseUrl}/api/travel_costs/${code}`
                }).done(function(data) {
                    travel_costs_table.ajax.reload()
                    Swal.fire({
                        title: 'Éxito',
                        text: "El costo de viaje se ha eliminado satisfactoriamente",
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