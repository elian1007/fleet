$('#select-vehicle-id').select2({
    placeholder: 'Seleccione una opción',
    width: '100%'
});


(() => {
    'use strict'

    const form = document.getElementById('form-shipments')
    const isEdit = $('#shipment-id').val() != ''

    form.addEventListener('submit', event => {

        event.preventDefault()
        event.stopPropagation()

        if (form.checkValidity()) {
            var data = {
                placa: $('#select-vehicle-id').val(),
                kilos: $('#weight').val(),
                fecha: $('#date').val(),
                observacion: $('#observations').val()
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
                        url: `${baseUrl}/api/shipments${isEdit ? "/" + $('#shipment-id').val() : ''}`,
                        data: JSON.stringify(data),
                    }).done(function (data) {
                        Swal.fire({
                            title: 'Éxito',
                            text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El despacho ha sido creado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace(`${baseUrl}/shipments`)
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
                            text = "Ha ocurrido un error en la solicitud, por favor contactar a soporte";
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
        form.classList.add('was-validated')
    }, false)


})()