const businessTypesSelect = document.getElementById('select-business-type')
const businessTypesSelectDev = document.getElementById('select-business-dev')
const documentForm = document.getElementById('document-form')
const documentFormDev = document.getElementById('document-dev-form')
const siscombasForm = document.getElementById('siscombas-form')
const driverForm = document.getElementById('vehicle-form')
const cityForm = document.getElementById('city-form')
const dispatchButton = document.getElementById('dispatch')

let table_documents = null;

let table_documents_dev = null;


$(document).ready(function () {
    $('#select-driver').select2({
        placeholder: 'Seleccione una opción',
        width: '100%'
    });

    $('#select-city').select2({
        placeholder: 'Seleccione una opción',
        width: '100%'
    });

    $('#select-city-doc').select2({
        placeholder: 'Seleccione una opción',
        width: '100%',
        dropdownParent: $('#modal-documents')
    });

    let referralState = $('#referral-state').val()

    table_documents = $('#documents_table').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/referrals/${$('#referral-id').val()}/documents`,
            dataSrc: "",
        },

        "columns": [
            {
                "data": null,
                "render": function (data) {


                    return `${data.documento.id}`
                }

            },
            {
                "data": "numero_doc",

            },
            {
                "data": "kilos",

            },
            {
                "data": "unidades",

            },
            {
                "data": null,
                "render": function (data) {


                    return `${data.detalles_producto.descripcion}`
                }

            },
            {
                "data": "canastillas",

            },
            {
                "data": "sellos",

            },
            {
                "data": null,
                "render": function (data, type, row, meta) {


                    return data.negocio.descripcion;
                }

            },
            {
                "data": null,
                "render": function (data) {
                    if (data.unidad_negocio == 1 && data.centro_operacion) {
                        return data.centro_operacion.nombre;
                    } else if (data.tercero) {
                        return data.tercero.nombre;
                    } else {
                        return `No registra`
                    }

                }

            },
            {
                "data": null,
                "render": function (data) {

                    return data.ciudad ? `${data.ciudad.nombre} (${data.ciudad.departamento.nombre})` : `No registra`
                }

            },

            {
                "data": null,
                "render": function (data) {

                    var output = `No aplica`;
                    if (hasPermChange && referralState === 'abierta') {
                        output = `<button class='btn btn-warning rounded-circle text-gray' title='Editar' onclick='editDocument(${JSON.stringify(data)})'><i class="fa-regular fa-pen-to-square"></i></button>`
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


    table_documents_dev = $('#documents_table_dev').DataTable({
        responsive: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json'
        },
        ajax: {
            type: "GET",
            dataType: "json",
            url: `${baseUrl}/api/referrals/${$('#referral-id').val()}/documents_dev`,
            dataSrc: "",
        },

        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {


                    return data.negocio.descripcion;
                }

            },
            {
                "data": null,
                "render": function (data) {
                    if (data.unidad_negocio == 1 && data.centro_operacion) {
                        return data.centro_operacion.nombre;
                    } else if (data.tercero) {
                        return data.tercero.nombre;
                    } else {
                        return `No registra`
                    }

                }

            },
            {
                "data": "canastillas",

            },

            {
                "data": "kilos",

            },
            {
                "data": "unidades",

            },
            {
                "data": null,
                "data": null,
                "render": function (data) {


                    return data.observaciones ? data.observaciones : 'No registra'
                }

            },
            {
                "data": null,
                "render": function (data) {

                    var output = `No aplica`;
                    if (hasPermDocDevChange && referralState === 'retornada') {
                        output = `<button class='btn btn-warning rounded-circle text-gray' title='Editar' onclick='editDocumentDev(${JSON.stringify(data)})'><i class="fa-regular fa-pen-to-square"></i></button>`
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


function editDocument(data) {

    $('#document-id').val(data.id_doc_remision)
    $('#select-doc-type').val(data.id_tipo_doc)
    $('#doc-number').val(data.numero_doc)
    $('#weight').val(data.kilos)
    $('#units').val(data.unidades)
    $('#select-product-type').val(data.producto)
    $('#punnets').val(data.canastillas)
    $('#security-seals').val(data.sellos)
    $('#select-business-type').val(data.unidad_negocio);

    if (parseInt(data.unidad_negocio) == 1) {
        $("#select-arrival-to").data("selected", data.id_centro_operacion);
    } else {
        $("#select-arrival-to").data("selected", data.id_tercero);
    }

    businessTypesSelect.dispatchEvent(new Event('change'))
    $('#select-arrival-to').val()
    $(`#select-city-doc`).val(data.codigo_ciudad);
    $(`#select-city-doc`).trigger('change');

    //Muestra el modal
    $('#modal-documents').modal('show')
}

function editDocumentDev(data) {

    $('#document-dev-id').val(data.id_dev_remision)
    $('#weight-dev').val(data.kilos);
    $('#units-dev').val(data.unidades);
    $('#punnets-dev').val(data.canastillas);
    $('#observations-dev').val(data.observaciones?data.observaciones:'');
    $('#select-business-dev').val(data.unidad_negocio);

    if (parseInt(data.unidad_negocio) == 1) {
        $("#select-origin").data("selected", data.id_centro_operacion);
    } else {
        $("#select-origin").data("selected", data.id_tercero);
    }

    businessTypesSelectDev.dispatchEvent(new Event('change'))
    $('#select-origin').val();

    //Muestra el modal
    $('#modal-documents-dev').modal('show')
}

documentForm.addEventListener('submit', function (e) {
    e.preventDefault()
    e.stopPropagation()

    const isEdit = $('#document-id').val() !== undefined && $('#document-id').val() != ''

    if (documentForm.checkValidity()) {
        let data = {
            id_tipo_doc: $('#select-doc-type').val(),
            numero_doc: $('#doc-number').val(),
            kilos: $('#weight').val(),
            unidades: $('#units').val(),
            producto: $('#select-product-type').val(),
            canastillas: $('#punnets').val(),
            sellos: $('#security-seals').val(),
            destino: $('#select-arrival-to').val(),
            unidad_negocio: $('#select-business-type').val(),
            codigo_ciudad: $('#select-city-doc').val()
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
                    url: `${baseUrl}/api/referrals/${$('#referral-id').val()}/documents${isEdit ? "/" + $('#document-id').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El documento ha sido creado satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            table_documents.ajax.reload();
                            cleanDocFormFields('document-form')
                            $('#modal-documents').modal('hide')
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
                        text = "Ha ocurrido un error al realizar la operación";
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
})

documentFormDev.addEventListener('submit', function (e) {
    e.preventDefault()
    e.stopPropagation()

    const isEdit = $('#document-dev-id').val() !== undefined && $('#document-dev-id').val() != ''

    if (documentFormDev.checkValidity()) {
        let data = {
            kilos: $('#weight-dev').val(),
            unidades: $('#units-dev').val(),
            canastillas: $('#punnets-dev').val(),
            origen: $('#select-origin').val(),
            unidad_negocio: $('#select-business-dev').val(),
            observaciones: $('#observations-dev').val(),
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
                    url: `${baseUrl}/api/referrals/${$('#referral-id').val()}/documents_dev${isEdit ? "/" + $('#document-dev-id').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {
                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "La información de retorno se ha registrado satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            table_documents_dev.ajax.reload();
                            cleanDocFormFields('document-dev-form')//funcion global en main.js
                            $('#modal-documents-dev').modal('hide')
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
                        text = "Ha ocurrido un error al realizar la operación";
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
})

siscombasForm.addEventListener('submit', function (e) {
    e.preventDefault()
    e.stopPropagation()

    const isEdit = $('#siscombas-id').val() !== undefined && $('#siscombas-id').val() != ''

    if (siscombasForm.checkValidity()) {
        let data = {
            num_tiquete: $('#ticket-number').val(),
            peso_tiquete: $('#ticket-weight').val(),
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
                    url: `${baseUrl}/api/referrals/${$('#referral-id').val()}/siscombas${isEdit ? "/" + $('#siscombas-id').val() : ''}`,
                    data: JSON.stringify(data),
                }).done(function (data) {

                    Swal.fire({
                        title: 'Éxito',
                        text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El registro se ha sido creado satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('#siscombas-id').val(data.id)
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
                        text = "Ha ocurrido un error al realizar la operación";
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
})

driverForm.addEventListener('submit', function (e) {
    e.preventDefault()
    e.stopPropagation()

    if (driverForm.checkValidity()) {
        let data = {
            conductor: $('#select-driver').val(),
        }

        Swal.fire({
            title: 'Guardando...',
            backdrop: true,
            timerProgressBar: true,
            allowOutsideClick: () => !Swal.isLoading(),
            didOpen: () => {
                Swal.showLoading()
                $.ajax({
                    type: "PUT",
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
                    url: `${baseUrl}/api/referrals/${$('#referral-id').val()}`,
                    data: JSON.stringify(data),
                }).done(function (data) {

                    Swal.fire({
                        title: 'Éxito',
                        text: "Se han guardado los cambios satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
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
                        text = "Ha ocurrido un error al realizar la operación";
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
})

cityForm.addEventListener('submit', function (e) {
    e.preventDefault()
    e.stopPropagation()

    if (cityForm.checkValidity()) {
        let data = {
            codigo_ciudad: $('#select-city').val(),
        }

        Swal.fire({
            title: 'Guardando...',
            backdrop: true,
            timerProgressBar: true,
            allowOutsideClick: () => !Swal.isLoading(),
            didOpen: () => {
                Swal.showLoading()
                $.ajax({
                    type: "PUT",
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
                    url: `${baseUrl}/api/referrals/${$('#referral-id').val()}`,
                    data: JSON.stringify(data),
                }).done(function (data) {

                    Swal.fire({
                        title: 'Éxito',
                        text: "Se han guardado los cambios satisfactoriamente",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
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
                        text = "Ha ocurrido un error al realizar la operación";
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
})

businessTypesSelect.addEventListener('change', function (e) {

    let selectedElement = $('#select-arrival-to').data('selected')

    let businessType = e.target.value

    let is_operation_center = businessType == '1'

    let url = `${baseUrl}/api/${is_operation_center ? 'operations_center' : 'third_party_users?drivers=0'}`

    $('#select-arrival-to')
        .empty()
        .append(`<option ${selectedElement ? "" : 'selected="selected"'} value="">Seleccione</option>`);

    if (businessType !== '') {
        $('#load-options').css('display', 'inline-block')

        if (businessType == '4') {
            url = `${baseUrl}/api/rapipollos`
        } else if (businessType == '3') {
            url = `${baseUrl}/api/sellers`
        }

        $.ajax({
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
            url: url,

        }).done(function (data) {

            data.forEach(element => {

                if (is_operation_center) {
                    let selected = selectedElement === element.codigo
                    $('#select-arrival-to').append(new Option(element.nombre, element.codigo, selected, selected));

                } else if ((businessType == '4' || businessType == '3') && element.datos_adicionales) {

                    let selected = selectedElement === element.cedula
                    $('#select-arrival-to').append(new Option(element.datos_adicionales.nombre, element.cedula, selected, selected));
                } else if (businessType !== '3' && businessType !== '4') {
                    let selected = selectedElement === element.cedula
                    $('#select-arrival-to').append(new Option(element.nombre, element.cedula, selected, selected));
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
                text = "Ha ocurrido un error al cargar los terceros";
            }
        }).always(function () {
            $('#load-options').css('display', 'none')
        });
    }

})

businessTypesSelectDev.addEventListener('change', function (e) {

    let selectedElement = $('#select-origin').data('selected')

    let businessType = e.target.value

    let is_operation_center = businessType == '1'

    let url = `${baseUrl}/api/${is_operation_center ? 'operations_center' : 'third_party_users?drivers=0'}`

    $('#select-origin')
        .empty()
        .append(`<option ${selectedElement ? "" : 'selected="selected"'} value="">Seleccione</option>`);

    if (businessType !== '') {
        $('#load-options-dev').css('display', 'inline-block')

        if (businessType == '4') {
            url = `${baseUrl}/api/rapipollos`
        } else if (businessType == '3') {
            url = `${baseUrl}/api/sellers`
        }

        $.ajax({
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
            url: url,

        }).done(function (data) {

            data.forEach(element => {

                if (is_operation_center) {
                    let selected = selectedElement === element.codigo
                    $('#select-origin').append(new Option(element.nombre, element.codigo, selected, selected));
                } else if ((businessType == '4' || businessType == '3') && element.datos_adicionales) {
                    let selected = selectedElement === element.cedula
                    $('#select-origin').append(new Option(element.datos_adicionales.nombre, element.cedula, selected, selected));
                } else if (businessType !== '3' && businessType !== '4') {
                    let selected = selectedElement === element.cedula
                    $('#select-origin').append(new Option(element.nombre, element.cedula, selected, selected));
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
                text = "Ha ocurrido un error al cargar los terceros";
            }
        }).always(function () {
            $('#load-options-dev').css('display', 'none')
        });
    }

})

function changeReferralState(state) {

    let title=''
    let message=''

    if(state==='generada'){

        title='¿Está seguro que desea despachar el vehículo?'
        message='Una vez despachado el vehículo no podrá crear documentos'

    }else if(state==='retornada'){

        title='¿Está seguro que desea retornar el vehículo?'

    }else if(state==='cerrada'){

        title='¿Está seguro que desea cerrar la remisón?'
        message='Una vez cerrada la remisión no podrá realizar ningún cambio'

    }else if(state==='anulada'){

        title='¿Está seguro que desea anular la remision?'
        message='Una vez anulada la remisión no podrá realizar ningún cambio'

    }



    Swal.fire({
        title:title ,
        text: message,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'SÍ',
        icon: 'question',
        denyButtonText: `NO`,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Guardando...',
                timerProgressBar: true,
                backdrop: true,
                allowOutsideClick: () => !Swal.isLoading(),
                didOpen: () => {
                    Swal.showLoading()
                    $.ajax({
                        type: "PUT",
                        contentType: 'application/json',
                        dataType: 'json',
                        headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
                        url: `${baseUrl}/api/referrals/${$('#referral-id').val()}`,
                        data: JSON.stringify({ estado: state }),
                    }).done(function (data) {

                        Swal.fire({
                            title: 'Éxito',
                            text: "Se han guardado los cambios satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
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
                        } else if (status === 400 && res.length > 0) {
                            text = res[0]['error'];
                        } else {
                            text = "Ha ocurrido un error al realizar la operación";
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


$('#modal-documents').on('hidden.bs.modal', function (e) {
    cleanDocFormFields('document-form')
    $('#select-arrival-to').removeData('selected')
});


$('#modal-documents-dev').on('hidden.bs.modal', function (e) {
    cleanDocFormFields('document-dev-form')
    $('#select-origin').removeData('selected')
});
