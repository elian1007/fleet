var fertilizers_table=null;
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} 
if(mm<10){
  mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("picker-date-start").setAttribute("max", today);
document.getElementById("picker-date-end").setAttribute("max", today);
$(document).ready(function () {

    fertilizers_table=$('#fertilizers_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
  
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/fertilizers`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": null,
                "render": function (data) {
                
                    return data.granja_detail.nombre_granja;
                }
            },
           
            {
                "data": "placa",

            },
            {
                "data": null,
                "render": function (data) {
                    
                    return data.conductor_vehiculo?data.conductor_vehiculo.nombre:'No registra';
                }
            },
            {
                "data": "destino",

            },
            {
                "data": "kilos_totales",

            },
            {
                "data": "costo_flete",
            },
            {
                "data": null,
                "render": function (data) {
                    let kilos=parseFloat(data.kilos_totales);
                    let costo=parseInt(data.costo_flete)
                    
                    return formatPrice(kilos*costo);
                }
            },
            {
                "data":'fecha',
            }, 
            {
                "data": null,
                "render": function (data) {
                    
                    var output = ``;
                    if(hasPermChange){
                        output += `<a class='btn btn-warning rounded-circle text-gray' href='${baseUrl}/fertilizers/${data.id}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    if(hasPermDelete){
                        output += `<button class='btn btn-danger rounded-circle ms-2' onclick="removeFertilizer('${data.id}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output===``? "No aplica" : output;
                }
            }

        ],
        "pageLength": 50,
        "order": [[0, "asc"]],
    });

});

function removeFertilizer(id) {

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
                backdrop:true,
                allowOutsideClick: () => !Swal.isLoading(),
                didOpen: () => {
                  Swal.showLoading()
                  $.ajax({
                    type:"DELETE",
                    contentType : 'application/json',
                    dataType : 'json',
                    headers: {"X-CSRFToken": getCookie('csrftoken')},
                    url: `${baseUrl}/api/fertilizers/${id}`
                }).done(function(data) {
                    fertilizers_table.ajax.reload()
                    Swal.fire({
                        title: 'Éxito',
                        text: "El registro se ha eliminado satisfactoriamente",
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