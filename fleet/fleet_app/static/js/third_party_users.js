var table_third_party_users=null;

$(document).ready(function () {

    table_third_party_users=$('#third_party_users_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
  
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/third_party_users`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "cedula",

            },
            {
                "data": "nombre",

            },
            {
                "data": null,
                "render": function (data) {
                    return `${data.ciudad.nombre} (${data.ciudad.departamento.nombre})`;
                }
            },
            {
                "data": "direccion",

            },
            {
                "data": "telefono",

            },
            {
                "data": "estado",

            },
            {
                "data": "conductor",

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                   
                    var output = ``;
                    if(hasPermChange){
                        output += `<a class='btn btn-warning rounded-circle text-gray' title='Editar' href='${baseUrl}/third_party_users/${data.cedula}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    if(hasPermDelete){
                        output += `<button class='btn btn-danger rounded-circle ms-2' title='Eliminar'  onclick="remove_third_party_user('${data.cedula}')"><i class="fa-regular fa-trash-can"></i></button>`
                    }
                    return output===``? "No aplica" : output;
                }
            }

        ],
        "pageLength": 50,
        "order": [[0, "asc"]],

    });

});

function remove_third_party_user(user_id) {

    Swal.fire({
        title: '¿Está seguro que desea eliminar el tercero?',
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
                    url: `${baseUrl}/api/third_party_users/${user_id}`
                }).done(function(data) {
                    table_third_party_users.ajax.reload()
                    Swal.fire({
                        title: 'Éxito',
                        text: "El tercero se ha eliminado satisfactoriamente",
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