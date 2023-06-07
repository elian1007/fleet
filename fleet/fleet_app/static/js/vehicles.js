var vehicles_table=null;

$(document).ready(function () {

    vehicles_table=$('#vehicles_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
  
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/vehicles`,
            dataSrc: "",
        },
        "columns": [
            {
                "data":null,
                "render": function (data) {

                    return data.tipo_vehiculo.descripcion
                    
                }

            },
           
            {
                "data": "placa",

            },
            {
                "data": "marca",

            },
            {
                "data": "linea",

            },
            {
                "data": "modelo",

            },
            {
                "data": null,
                "render":function (data) {
                    
                    let tmp=new Date(data.vencimiento_soat)

                    return tmp.toLocaleDateString('es-CO')
                }
            },
            {
                "data": "compania_soat",

            },
            {
                "data":'poliza',
            }
            , {
                "data": null,
                "render": function (data, type, row, meta) {
                    
                    var output = ``;
                    if(hasPermChange){
                        output += `<a class='btn btn-warning rounded-circle text-gray'  href='${baseUrl}/vehicles/${data.placa}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    if(hasPermDelete){
                        output += `<button class='btn btn-danger rounded-circle ms-2' onclick="removeVehicle('${data.placa}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output===``? "No aplica" : output;
                }
            }

        ],
        "pageLength": 50,
        "order": [[0, "asc"]],
    });

});

function removeVehicle(placa) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el vehículo?',
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
                    url: `${baseUrl}/api/vehicles/${placa}`
                }).done(function(data) {
                    vehicles_table.ajax.reload()
                    Swal.fire({
                        title: 'Éxito',
                        text: "El vehículo se ha eliminado satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    })
                }).fail(function(data) {
    
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