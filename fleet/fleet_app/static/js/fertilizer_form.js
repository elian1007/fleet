$('#select-vehicle-id').select2({
    placeholder: 'Seleccione una opción',
    width: '100%'
});
$('#select-driver').select2({
    placeholder: 'Seleccione una opción',
    width: '100%'
});

(() => {
    'use strict'

    const form = document.getElementById('fertilizer-form')
    const isEdit = $('#id_fertilizer').val() != '' && $('#id_fertilizer').val() != undefined


    form.addEventListener('submit', event => {

        event.preventDefault()
        event.stopPropagation()

        if (form.checkValidity()) {
            var data = {
                granja: $('#select-farm').val(),
                conductor: $('#select-driver').val(),
                placa: $('#select-vehicle-id').val(),
                destino: $('#select-destination').val(),
                fecha: $('#date').val(),
                kilos_totales: $('#total-kilos').val(),
                costo_flete: $('#cost').val(),
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
                        url: `${baseUrl}/api/fertilizers${isEdit ? "/" + $('#id_fertilizer').val() : ''}`,
                        data: JSON.stringify(data),
                    }).done(function (data) {
                        Swal.fire({
                            title: 'Éxito',
                            text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El registro ha sido creado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace(`${baseUrl}/fertilizers`)
                            }
                        })
                    }).fail(function (data) {

                        var status = data.status
                        var text = 'Ha ocurrido un error'

                        if (status === 500) {
                            text = 'Ha ocurrido un error inesperado, por favor contactar a soporte'
                        } else if (status === 403 || status === 401) {
                            text = "Usted no se encuentra autorizado para realizar esta operación";
                        } else if (status === 400) {
                            text = "No se ha podido crear el registro";
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