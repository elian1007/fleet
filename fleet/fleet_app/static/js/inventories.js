var table_inventories = null;
const form = document.getElementById('form-report');
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

    table_inventories = $('#inventories_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
   
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/inventories`,
            dataSrc: "",
        },
        "columns": [
            {
                "data": "inventario.fecha_corte",

            },

            {
                "data": null,
                "render": function (data) {
                    
                    return `${data.inventario.centro_operacion.codigo} - ${data.inventario.centro_operacion.nombre}`;
                }
            },
            {
                "data": "item_embalaje.codigo"

            },
            {
                "data": "item_embalaje.descripcion"

            },
            {
                "data": "stock"

            },
            {
                "data": "toma_fisica"
            },
        
            {
                "data": null,
                "render": function (data) {
                    var dif = Math.abs(parseInt(data.stock) - parseInt(data.toma_fisica))
                    return `<p style="color:${dif !== 0 ? '#8b0909;' : ''}">${dif}</p>`;
                }
            },
            {
                "data": null,
                "render": function (data) {

                    if(data.inventario.observaciones && data.inventario.observaciones.trim()!==''){
                        return data.inventario.observaciones
                    }
                    return `No registra`;
                }
            },
            {
                "data": null,
                "render": function (data) {
                        
                    return `${data.inventario.nombre_persona} - ${data.inventario.cargo_persona}`;
                }
            },
            // {
            //     "data": null,
            //     "render": function (data, type, row, meta) {
            //        
            //         var output = ``;
            //         output += `<a class='btn btn-success rounded-circle text-gray' href='${baseUrl}/inventories/${data.id}/'><i class="fa-regular fa-eye"></i></a>`
            //         return output;
            //     }
            // }

        ],
        "pageLength": 50,
        "order": [[0, "asc"]],
    });

});

