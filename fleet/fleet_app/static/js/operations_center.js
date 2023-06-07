var table_co=null;

$(document).ready(function () {

    table_co=$('#operations_center_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
  
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/operations_center`,
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
                "render": function (data) {
                    
                    if(data.ciudad){
                        return `${data.ciudad.nombre} (${data.ciudad.departamento.nombre})`
                    }
                    return '<p>No registra</p>'
                  
                }
            },
            {
                "data": "direccion",

            },
            {
                "data": "celular",

            },
            {
                "data": "telefono",

            },

            {
                "data": "contacto",

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    if(data.usuario.length>0){
                        var output = `<div class='d-flex flex-column text-capitalize'>`;
                        data.usuario.forEach(user => {
                            output+=`<p class='my-1'>${user.first_name}</p>`
                        });
                        output+=`</div>`
                    
                        return output;
                    }

                    return '<p>No registra</p>'
                  
                }
            }
            , {
                "data": null,
                "render": function (data, type, row, meta) {
                   
                    var output = ``;
                    if(hasPermChange){
                        output += `<a class='btn btn-warning rounded-circle text-gray' title='Editar' href='${baseUrl}/operations_center/${data.codigo}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    if(hasPermDelete){
                        output += `<button class='btn btn-danger rounded-circle ms-2' title='Eliminar' onclick="removeCO('${data.codigo}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output===``? "No aplica" : output;
                }
            }

        ],
        "pageLength": 50,
        // "columnDefs": [
        //     { "orderable": false, "targets": [1] }
        // ],
        // dom: 'Blfrtip',
        // buttons: [
        //     'copy', 'excel', 'pdf'
        // ],
        "order": [[0, "asc"]],

    });

});

function removeCO(code) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el centro de operación?',
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
                    url: `${baseUrl}/api/operations_center/${code}`
                }).done(function(data) {
                    table_co.ajax.reload()
                    Swal.fire({
                        title: 'Éxito',
                        text: "El centro de operaciones se ha eliminado satisfactoriamente",
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