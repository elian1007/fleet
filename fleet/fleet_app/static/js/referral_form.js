(() => {
    'use strict'

    const form = document.getElementById('form-referral')
    const isEdit = $('#referral-id').val() != ''

    let event = new Event('change');
    const vehicleTypesSelect = document.getElementById('select-vehicle-type')
    
    $('#trailer-container').css('display','none')
    $('#select-vehicle-id').select2({
        placeholder: 'Seleccione una opción',
        width: '100%'
    });

    $('#trailer-select').select2({
        placeholder: 'Seleccione una opción',
        width: '100%'
    });
    
    
    form.addEventListener('submit', event => {

        event.preventDefault()
        event.stopPropagation()

        if (form.checkValidity()) {
            let data = {
                nit: $('#nit-company').val(),
                fecha_entrega: $('#deadline').val(),
                placa: $('#select-vehicle-id').val(),
                peso_vacio: $('#weight').val(),
                fecha_expedicion:$('#start-date').val()
            }

            if($('#select-vehicle-type').val()=='3'){
                data['trailer']=$('#trailer-select').val()
            }else{
                data['trailer']=null
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
                        url: `${baseUrl}/api/referrals${isEdit ? "/" + $('#referral-id').val() : ''}`,
                        data: JSON.stringify(data),
                    }).done(function (data) {
                        Swal.fire({
                            title: 'Éxito',
                            text: isEdit ? "Se han guardado los cambios satisfactoriamente" : "La remisión ha sido creado satisfactoriamente",
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace(`${baseUrl}/referrals`)
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
        form.classList.add('was-validated')
    }, false)


    vehicleTypesSelect.addEventListener('change', function (e) {

        let selectedVehicle=$('#select-vehicle-id').data('selected')
        

        $('#select-vehicle-id')
            .empty()
            .append(`<option ${selectedVehicle?"":'selected="selected"'} value="">Seleccione</option>`);
        if (e.target.value !== '') {
            $('#load-vehicle').css('display', 'inline-block')
            $.ajax({
                type: "GET",
                contentType: 'application/json',
                dataType: 'json',
                headers: { "Accepts": "text/plain; charset=utf-8", "X-CSRFToken": getCookie('csrftoken') },
                url: `${baseUrl}/api/vehicles?type=${e.target.value}`,
    
            }).done(function (data) {

                data.forEach(vehicle => {
                    if(selectedVehicle && selectedVehicle===vehicle.placa){
                        $('#select-vehicle-id').append(new Option(vehicle.placa, vehicle.placa, true, true));
                    }else{
                        $('#select-vehicle-id').append(new Option(vehicle.placa, vehicle.placa));
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
                $('#load-vehicle').css('display', 'none')
            });
        }

        if(e.target.value!==''){
            
            if(e.target.value==='3'){
                $('#trailer-select').prop('required',true)
                $('#trailer-container').css('display','block')
            }else {
                $('#trailer-select').prop('required',false)
                $('#trailer-container').css('display','none')
            }
        }
    
    })
  
    vehicleTypesSelect.dispatchEvent(event);
})()


