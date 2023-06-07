(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault()
            event.stopPropagation()

            if (form.checkValidity()) {

                var itemsEmbalaje = []

                document.querySelectorAll('input[type="checkbox"]').forEach(item => {

                    if (item.checked) {
                        var data = item.id.split('-')
                        var id = data[1]
                        itemsEmbalaje.push({
                            item_embalaje: id,
                            stock: $(`#stock-${id}`).val(),
                            toma_fisica: $(`#tf-${id}`).val()
                        },)
                    }
                })

                if (itemsEmbalaje.length === 0) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Debe registrar por lo menos un item de embalaje',
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                    })
                } else {
                    var data = {
                        fecha_corte: $('#picker-date').val(),
                        hora_inicial: $('#picker-date-start').val(),
                        hora_final: $('#picker-date-end').val(),
                        nombre_persona: $('#name').val(),
                        cargo_persona: $('#job-title').val(),
                        observaciones: $('#observations').val().trim() !== '' ? $('#observations').val() : null,
                        items_embalaje: itemsEmbalaje,
                        centro_operacion: $('#select-co').val()
                    }

                    Swal.fire({
                        title: 'Guardando...',
                        backdrop: true,
                        timerProgressBar: true,
                        allowOutsideClick: () => !Swal.isLoading(),
                        didOpen: () => {
                            Swal.showLoading()
                            $.ajax({
                                headers: { "X-CSRFToken": getCookie('csrftoken') },
                                url: `${baseUrl}/api/inventories`,
                                type: "POST",
                                data: JSON.stringify(data),
                                dataType: 'json',
                                contentType: "application/json",

                            }).done(function (data) {
                                Swal.fire({
                                    title: 'Éxito',
                                    text: "El reporte ha sido creado satisfactoriamente",
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Ok',
                                    allowOutsideClick: false
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location.replace(`${baseUrl}/inventories`)
                                    }
                                })
                            }).fail(function (data) {

                                var status = data.status
                                var text = 'Ha ocurrido un error'

                                if (status === 500) {
                                    text = 'Ha ocurrido un error inesperado, por favor contactar a soporte'
                                } else if (status === 403 || status === 401) {
                                    text = "Usted no se encuentra autorizado para realizar esta operación";
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
            }


            form.classList.add('was-validated')
        }, false)
    })

    document.querySelectorAll('.reporter').forEach(item => {
        item.addEventListener('keyup', event => {
            var data = event.target.id.split('-')
            var stock = $(`#stock-${data[1]}`).val()
            var tomaFisica = $(`#tf-${data[1]}`).val()
            if (stock.trim() !== "" && tomaFisica.trim() !== "") {
                var res = parseInt(stock) - parseInt(tomaFisica)
                $(`#dif-${data[1]}`).val(Math.abs(res))
                if (res === 0) {
                    $(`#dif-${data[1]}`).css('background-color', '#b7d0b7')
                } else {
                    $(`#dif-${data[1]}`).css('background-color', '#fdcfcf')
                }
            }
        })
    })


    document.querySelectorAll('input[type="checkbox"]').forEach(item => {
        item.addEventListener('change', event => {
            var data = event.target.id.split('-')
            var id = data[1]
            $(`#stock-${id}`).attr('disabled', !item.checked)
            $(`#tf-${id}`).attr('disabled', !item.checked)

            $(`#stock-${id}`).val('')
            $(`#tf-${id}`).val('')
            $(`#dif-${id}`).val('')
            $(`#dif-${id}`).css('background-color', '#e9ecef')

        })
    })
})()