
(() => {
    'use strict'

    const form = document.getElementById('vehicle-form')
    const isEdit = $('#vehicle_id').val() != ''

    form.addEventListener('submit', event => {

        event.preventDefault()
        event.stopPropagation()

        if (form.checkValidity()) {
            var data = {
                tipo:$('#select-vehicle-type').val(),
                placa: $('#vehicle_id').val(),
                // marca: $('#brand').val(),
                // linea: $('#select-line').val(),
                modelo: $('#model').val(),
                vencimiento_soat:$('#soat-expiration-date').val(),
                // compania_soat: $('#insurance-company').val(),
                poliza: $('#policy-number').val(),
                furgon: $('#boxcar').val(),
                centro_operacion: $('#select-co').val(),
            }


            if($('#select-vehicle-type').val()==='2'){
                delete data.marca
                delete data.linea
            }else {
                delete data.furgon
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
                        url: `${baseUrl}/api/vehicles${isEdit ? "/" + $('#vehicle_id').val() : ''}`,
                        data: JSON.stringify(data),
                    }).done(function (data) {
                        Swal.fire({
                            title: 'Éxito',
                            text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El vehículo ha sido creado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace(`${baseUrl}/vehicles`)
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
                            text = "Ya existe un vehículo registrado con esta placa";
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

$('#select-vehicle-type').on('change',function (e) {

    var value=e.target.value;

    if( value!==''){

        if(value==='2'){
            $('#brand').prop('required',false)
            $('#brand-container').css('display','none')
            $('#select-line').prop('required',false)
            $('#line-container').css('display','none')
            $('#boxcar').prop('required',true)
            $('#boxcar-container').css('display','block')
        }else {
            $('#brand').prop('required',true)
            $('#brand-container').css('display','block')
            $('#line').prop('required',true)
            $('#line-container').css('display','block')
            $('#boxcar').prop('required',false)
            $('#boxcar-container').css('display','none')
        }
    }
    
    
})

$('#select-vehicle-type').change()