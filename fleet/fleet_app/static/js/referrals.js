var table_referrals = null;
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
    table_referrals = $('#referrals_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/referrals`,
            // dataSrc: "",
        },
        processing: true,
        serverSide: true,
        "columns": [
            {
                "data": "id_remision",

            },
            {
                "data": null,
                "render":function (data) {
                    let color="secondary";
                    if(data.estado==="generada"){
                        color="success";
                    }else if(data.estado==="abierta"){
                        color="primary";
                    }else if(data.estado==="anulada"){
                        color="danger";
                    }else if(data.estado==="retornada"){
                        color="info";
                    }

                    return data.estado && data.estado!==''? `<span style="font-size:9px" class="badge bg-${color} ">${data.estado.toUpperCase()}</span>`:'No registra'
                }

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    
                    return new Date(data.fecha_expedicion).toLocaleString();
                }

            },
            {
                "data": null,
                "render": function (data) {

                    return data.fecha_despacho? new Date(data.fecha_despacho).toLocaleString():'No registra';
                }

            },
            {
                "data": null,
                "render":function (data) {
                    
                    return `${data.empresa.nombre} (${data.nit})`
                }

            },
            {
                "data": null,
                "render": function (data) {

                    return new Date(data.fecha_entrega).toLocaleDateString();
                }

            },
            {
                "data": null,
                "render":function (data) {

                    if(data.vehiculo && data.vehiculo.tipo===3){
                        return `${data.placa}  trailer-${data.trailer}`
                    }


                    return data.placa
                }
            },
            {
                "data": "peso_vacio",
            },
            {
                "data": null,
                "render":function (data) {
                    
                    if( data.ciudad_destino){
                        return `${data.ciudad_destino.nombre} (${data.ciudad_destino.departamento.nombre})`
                    }

                    return "No registra"
                }

            },
            {
                "data": null,
                "render":function (data) {
                 
                    if( data.conductor_vehiculo){
                        return `${data.conductor_vehiculo.nombre} (${data.conductor_vehiculo.cedula})`
                    }

                    return "No registra"
                }

            },
            {
                "data": null,
                "render":function(data){
                    return  data.fecha_retorno? new Date(data.fecha_retorno).toLocaleDateString():'No registra';
                }

            },
            {
                "data": null,
                "render":function(data){
                    return  data.fecha_cierre? new Date(data.fecha_cierre).toLocaleDateString():'No registra';
                }

            },
            {
                "data": null,
                "render": function (data) {
                    
                    var output = ``;
                    if(hasPermChange){
                        output += `<a class='btn btn-warning rounded-circle text-gray' title='Editar' href='${baseUrl}/referrals/${data.id_remision}'><i class="fa-regular fa-pen-to-square"></i></a>`
                    }
                    output+= `<a class='btn btn-info rounded-circle ms-2' title='Ver remisión'  href='${baseUrl}/referrals/detail/${data.id_remision}'><i class="fa-regular fa-eye"></i></a>`
                    if(data.estado==='generada' || data.estado==='cerrada' || data.estado==='retornada' ){
                        output += `<a class='btn btn-primary rounded-circle ms-2' title='Ver remisión'  href='${baseUrl}/referrals/print/${data.id_remision}'><i class="fa-solid fa-print"></i></a>`
                    }
                    return output;
                }
            }

        ],
        "pageLength": 50,
        // "columnDefs": [
        //     { "orderable": false, "targets": [5, 7] }
        // ],
        // "order": [[0, "asc"]],

    });

});

function showCollapseReport(type){

    if(type==="info_return"){
        $('#title-export').text('Exportar información de retorno')
        $('#report-form').attr("action", "dev_referral_export");
    }else{
        $('#title-export').text('Exportar información detallada')
        $('#report-form').attr("action", "referrals_export");
    }

    $('#collapseOne').collapse('show')
}

function hideCollapseReport(type){

    $('#collapseOne').collapse('hide')
}



