
(() => {
    'use strict'

    const form = document.getElementById('form-travel-cost')
    const isEdit = $('#travel-cost-id').val() != ''
    const regionsSelect = document.getElementById('select-region')

    form.addEventListener('submit', event => {

        event.preventDefault()
        event.stopPropagation()

        if (form.checkValidity()) {
            var data = {
                origen: '63001',
                destino: $('#select-city').val(),
                id_linea: $('#select-vehicle').val(),
                toneladas: $('#capacity').val(),
                combustible: $('#fuel-cost').val(),
                peajes: $('#additional-cost').val(),
                alimentacion: $('#feeding-cost').val(),
                soat: $('#insurance-cost').val(),
                gasto_operativo: $('#operative-cost').val(),
                gasto_mantenimiento: $('#maintenance-cost').val()
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
                        url: `${baseUrl}/api/travel_costs${isEdit ? "/" + $('#travel-cost-id').val() : ''}`,
                        data: JSON.stringify(data),
                    }).done(function (data) {
                        Swal.fire({
                            title: 'Éxito',
                            text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "El costo de viaje ha sido creado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace(`${baseUrl}/travel_costs`)
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
                            text = "Ya existe un registro con esta combinación de parametros";
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


    regionsSelect.addEventListener('change', function (e) {

        let selectedCity=$('#select-city').data('selected') 
        $('#select-city')
            .empty()
            .append(`<option ${selectedCity?"":'selected="selected"'} value="">Seleccione</option>`);
        if (e.target.value !== '') {
            $('#load-city').css('display', 'inline-block')
            $.ajax({
                type: "GET",
                contentType: 'application/json',
                dataType: 'json',
                headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
                url: `${baseUrl}/api/cities/region/${e.target.value}`,
    
            }).done(function (data) {
    
                
                data.forEach(city => {
                    if(selectedCity && parseInt(selectedCity)===parseInt(city.codigo)){
                        $('#select-city').append(new Option(city.nombre, city.codigo, true, true));
                    }else{
                        $('#select-city').append(new Option(city.nombre, city.codigo));
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
                    text = "Ha ocurrido un error al guardar la línea";
                }
            }).always(function () {
                $('#load-city').css('display', 'none')
            });
        }
    
    })
})()