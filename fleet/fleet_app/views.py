import io
from datetime import datetime

from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.pagination import LimitOffsetPagination
from xlsxwriter.workbook import Workbook

from fleet_app.models import (Abonos, CapacidadCarga, CentrosOperacion,
                              Ciudades, CostosViaje, Departamentos,
                              DocRemision, Domicilios, Empresas, Granjas,
                              Inventarios, InventariosItems, ItemEmbalaje,
                              Lineas, Rapipollos, Remisiones, Siscombas,
                              Terceros, TiposDocumento, TiposNegocio,
                              TiposProducto, TiposVehiculo, Vehiculos,
                              Vendedores, Zonas,DevRemision,Datosperson)
from fleet_app.serializers import (AbonosSerializer, CapacidadCargaSerializer,
                                   CentrosOperacionSerializer,
                                   CiudadesSerializer, CostosViajeSerializer,
                                   DepartamentosSerializer,
                                   DocRemisionSerializer, DomiciliosSerializer,
                                   EmpresasSerializer,
                                   InventariosItemsSerializer,
                                   InventariosItemsSerializerList,
                                   InventariosSerializer, LineasSerializer,
                                   RapipollosSerializer, RemisionesSerializer,
                                   SiscombasSerializer, TercerosSerializer,
                                   VehiculosSerializer, VendedoresSerializer,
                                   ZonasSerializer,DevRemisionSerializer,datospersonalesSerializer)

# Views para la gestion de la aplicación fleet.

@login_required(login_url='/login/')
def index(request):
    return render(request, 'index.html')

@login_required(login_url='/login/')
def vendors(request):
    third= Terceros.objects.all()
    return render(request, 'vendors.html',{'thirds':third})

@login_required(login_url="/login/")
def rapipollo(request):
    third= Terceros.objects.all()
    vehicle= Vehiculos.objects.all()

    return render(request, 'rapipollos.html',{'thirds':third, 'vehicles':vehicle})

@login_required(login_url="/login/")
def datosperson(request):
    tipodocumentos = Datosperson.objects.all()
    return render(request,'datosperson.html',{'tipodocumentos': tipodocumentos })

# Renderiza la vista que contiene el historico de reportes de inventarios


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_inventarios'], login_url='/login/')
def inventories(request):
    return render(request, 'inventories.html')


@login_required(login_url='/login/')
@permission_required(['fleet_app.add_inventarios'], login_url='/login/')
def inventories_new_report(request):

    # Retorna solo los centros de operación que el usuario en sesion tiene asignados
    operations_center = CentrosOperacion.objects.all().filter(
        Q(usuario=request.user))
    packaging_items = ItemEmbalaje.objects.all()

    return render(request, 'report_form.html', {'operations_center': operations_center, 'packaging_items': packaging_items})


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_inventarios'], login_url='/login/')
def inventories_export(request, format=None):

    date_start = request.GET.get("date-start", "")
    date_end = request.GET.get("date-end", "")

    if date_start and date_end:

        serializer_context = {
            'request': request,
        }

        inventories = InventariosItems.objects.all().filter(
            inventario__fecha_corte__gte=date_start, inventario__fecha_corte__lte=date_end)
        serializer = InventariosItemsSerializerList(
            inventories, many=True, context=serializer_context)

        output = io.BytesIO()

        book = Workbook(output)
        sheet = book.add_worksheet('Reporte')
        labels = ['Fecha corte', 'Hora inicio', 'Hora fin', 'centro operación', 'Código item',
                  'Descripción item', 'Cantidad en stock', 'Toma Fisica', 'Diferencia', 'Reportado por', 'Observaciones']

        for index, value in enumerate(labels):
            sheet.write(0, index, value)

        for row, value in enumerate(serializer.data):

            sheet.write(row+1, 0, value['inventario']['fecha_corte'])
            sheet.write(row+1, 1, value['inventario']['hora_inicial'])
            sheet.write(row+1, 2, value['inventario']['hora_final'])
            sheet.write(row+1, 3, value['inventario']
                        ['centro_operacion']['nombre'])
            sheet.write(row+1, 4, value['item_embalaje']['codigo'])
            sheet.write(row+1, 5, value['item_embalaje']['descripcion'])
            sheet.write(row+1, 6, value['stock'])
            sheet.write(row+1, 7, value['toma_fisica'])
            sheet.write(row+1, 8, abs(value['toma_fisica']-value['stock']))
            sheet.write(row+1, 9, value['inventario']['nombre_persona'])
            sheet.write(row+1, 10, value['inventario']['observaciones'])

        book.close()

        # construct response
        output.seek(0)
        response = HttpResponse(
            output.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f"attachment; filename=reporte_inventario_{date_start}_a_{date_end}.xlsx"
        return response

    return JsonResponse([{'error': 'Debe proporcionar un intervalo de fechas'}], safe=False, status=400)


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_abonos'], login_url='/login/')
def fertilizers_export(request):

    date_start = request.GET.get("date-start", "")
    date_end = request.GET.get("date-end", "")

    if date_start and date_end:

        serializer_context = {
            'request': request,
        }

        fertilizers = Abonos.objects.all().filter(
            fecha__gte=date_start, fecha__lte=date_end)
        serializer = AbonosSerializer(
            fertilizers, many=True, context=serializer_context)

        output = io.BytesIO() #Reporte generado en memoria, no se escribe sobre el disco

        book = Workbook(output)
        sheet = book.add_worksheet('Registros')
        labels = ['Granja', 'Placa', 'Conductor', 'Destino', 'Kilos Totales',
                  'Costo Flete', 'Valor Flete', 'Fecha']

        for index, value in enumerate(labels):
            sheet.write(0, index, value)

        for row, value in enumerate(serializer.data):
            
            sheet.write(row+1, 0, value['granja_detail']['nombre_granja'])
            sheet.write(row+1, 1, value['placa'])
            sheet.write(row+1, 2, value['conductor_vehiculo']['nombre'])
            sheet.write(row+1, 3, value['destino'])
            sheet.write(row+1, 4, value['kilos_totales'])
            sheet.write(row+1, 5, value['costo_flete'] )
            sheet.write(row+1, 6, int(value['kilos_totales'])*int(value['costo_flete']))
            sheet.write(row+1, 7, value['fecha'])

        book.close()

        # construct response
        output.seek(0)
        response = HttpResponse(
            output.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f"attachment; filename=reporte_abonos_{date_start}_a_{date_end}.xlsx"
        return response

    return JsonResponse([{'error': 'Debe proporcionar un intervalo de fechas'}], safe=False, status=400)



@login_required(login_url='/login/')
@permission_required(['fleet_app.view_dev_remision'], login_url='/login/')
def dev_referral_export(request):

    """Generate a xlsx report of information of return """
    
    date_start = request.GET.get("date-start", "")
    date_end = request.GET.get("date-end", "")

    if date_start and date_end:

        serializer_context = {
            'request': request,
        }

        documents = DevRemision.objects.all().filter(
            id_remision__fecha_retorno__gte=date_start, id_remision__fecha_retorno__lte=date_end)
        serializer = DevRemisionSerializer(
            documents, many=True, context=serializer_context)

        output = io.BytesIO() #Reporte generado en memoria, no se escribe sobre el disco

        book = Workbook(output)
        sheet = book.add_worksheet('Registros')
        labels = ['No. REMISIÓN','FECHA','VEHICULO','TIPO DE NEGOCIO','ORIGEN','No. CANASTAS RETORNO','KILOS','UNIDADES','OBSERVACIONES']

        for index, value in enumerate(labels):
            sheet.write(0, index, value)

        for row, value in enumerate(serializer.data):
            
            sheet.write(row+1, 0, value['id_remision'])
            sheet.write(row+1, 1, value['remision']['fecha_retorno'])
            sheet.write(row+1, 2, value['remision']['placa'])
            sheet.write(row+1, 3, value['negocio']['descripcion'])

            if value.get('negocio').get('id')==1:#es distribucion nacional
                if(value.get('centro_operacion')):
                    sheet.write(row+1, 4, value['centro_operacion']['nombre'])
                else:
                    sheet.write(row+1, 4, 'No registra')
            else:
                if(value.get('tercero')):
                    sheet.write(row+1, 4, value['tercero']['nombre'])
                else:
                    sheet.write(row+1, 4, 'No registra')

            sheet.write(row+1, 5, value['canastillas'])
            sheet.write(row+1, 6, value['kilos'] )
            sheet.write(row+1, 7, value['unidades'] )
            sheet.write(row+1, 8, value['observaciones'])
 

        book.close()

        # construct response
        output.seek(0)
        response = HttpResponse(
            output.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f"attachment; filename=reporte_retorno_{date_start}_a_{date_end}.xlsx"
        return response

    return JsonResponse([{'error': 'Debe proporcionar un intervalo de fechas'}], safe=False, status=400)

@login_required(login_url='/login/')
@permission_required(['fleet_app.view_dev_remision'], login_url='/login/')
def referrals_export(request):

    """Generate a xlsx report of detailed referrals"""

    date_start = request.GET.get("date-start", "")
    date_end = request.GET.get("date-end", "")

    if date_start and date_end:

        serializer_context = {
            'request': request,
        }

        documents = DevRemision.objects.all().filter(
            id_remision__fecha_retorno__gte=date_start, id_remision__fecha_retorno__lte=date_end)
        serializer = DevRemisionSerializer(
            documents, many=True, context=serializer_context)

        output = io.BytesIO() #Reporte generado en memoria, no se escribe sobre el disco

        book = Workbook(output)
        sheet = book.add_worksheet('Registros')
        labels = ['No. REMISIÓN','FECHA','VEHICULO','TIPO DE NEGOCIO','ORIGEN','No. CANASTAS RETORNO','KILOS','UNIDADES','OBSERVACIONES']

        for index, value in enumerate(labels):
            sheet.write(0, index, value)

        for row, value in enumerate(serializer.data):
            
            sheet.write(row+1, 0, value['id_remision'])
            sheet.write(row+1, 1, value['remision']['fecha_retorno'])
            sheet.write(row+1, 2, value['remision']['placa'])
            sheet.write(row+1, 3, value['negocio']['descripcion'])

            if value.get('negocio').get('id')==1:#es distribucion nacional
                if(value.get('centro_operacion')):
                    sheet.write(row+1, 4, value['centro_operacion']['nombre'])
                else:
                    sheet.write(row+1, 4, 'No registra')
            else:
                if(value.get('tercero')):
                    sheet.write(row+1, 4, value['tercero']['nombre'])
                else:
                    sheet.write(row+1, 4, 'No registra')

            sheet.write(row+1, 5, value['canastillas'])
            sheet.write(row+1, 6, value['kilos'] )
            sheet.write(row+1, 7, value['unidades'] )
            sheet.write(row+1, 8, value['observaciones'])
 

        book.close()

        # construct response
        output.seek(0)
        response = HttpResponse(
            output.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f"attachment; filename=remisiones_{date_start}_a_{date_end}.xlsx"
        return response

    return JsonResponse([{'error': 'Debe proporcionar un intervalo de fechas'}], safe=False, status=400)


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_remisiones'], login_url='/login/')
def referrals(request):
    return render(request, 'referrals.html')


@login_required(login_url='/login/')
@permission_required(['fleet_app.add_remisiones'], login_url='/login/')
def new_referrals(request):
    default_company = Empresas.objects.filter(predeterminada=1)
    vehicle_types = TiposVehiculo.objects.filter(
        ~Q(id=4))  # todos a excepcion de los trailers
    trailers = Vehiculos.objects.filter(tipo__id=4)

    return render(request, 'new_referral.html', {'company': default_company[0], 'vehicle_types': vehicle_types, 'vehicles': [], 'trailers': trailers})


@login_required(login_url='/login/')
@permission_required(['fleet_app.change_remisiones'], login_url='/login/')
def edit_referral(request, pk):
    default_company = Empresas.objects.filter(predeterminada=1)
    vehicle_types = TiposVehiculo.objects.filter(~Q(id=4))
    referral = Remisiones.objects.get(pk=pk)
    
    vehicle = Vehiculos.objects.get(pk=referral.placa.placa)
    vehicles = Vehiculos.objects.filter(tipo=vehicle.tipo.id)
    trailers = Vehiculos.objects.filter(tipo__id=4)
    return render(request, 'new_referral.html', {'company': default_company[0], 'vehicle_types': vehicle_types, 'referral': referral, 'vehicles': vehicles, 'trailers': trailers})


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_remisiones'], login_url='/login/')
def detail_referral(request, pk):

    referral = Remisiones.objects.get(pk=pk)
    cities = Ciudades.objects.all()
    doc_types = TiposDocumento.objects.all()
    product_types = TiposProducto.objects.all()
    business_types = TiposNegocio.objects.all()
    drivers = Terceros.objects.filter(
        estado='activo', conductor='si').order_by('nombre').values()
    siscombas = None
    try:
        siscombas = Siscombas.objects.get(id_remision=pk)

    except Siscombas.DoesNotExist:

        print('Siscombas no existe!!')

    return render(request, 'referral_detail.html', {'business_types': business_types, 'doc_types': doc_types, 'referral': referral, 'product_types': product_types, 'drivers': drivers, 'cities': cities, 'siscombas': siscombas})


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_remisiones'], login_url='/login/')
def print_referral(request, pk):

    referral = Remisiones.objects.get(pk=pk)
    
    total_units=0
    total_product_weight=0
    total_punnets=0
    total_punnets_weight=0
    total_weight_efficiency=''
    total_weight=0
    vehicle_capacity=None
    trailer_vehicle_capacity=None
    siscombas_dif=''
    referral_documents_count=DocRemision.objects.filter(id_remision=pk,unidad_negocio__id=5).count()#Cantidad de documentos para terceros, regla de negocio
    referral_documents=DocRemision.objects.filter(id_remision=pk)
    referral_documents_dev=DevRemision.objects.filter(id_remision=pk)
    dict_query_set= referral_documents.values()
    siscombas = None

    for i in dict_query_set:
        total_units+=i['unidades']
        total_product_weight+=i['kilos']
        total_punnets+=i['canastillas']
        total_punnets_weight+=(i['canastillas']*2)

    total_weight=total_product_weight+total_punnets_weight

    try:
        vehicle_capacity = CapacidadCarga.objects.get(placa=referral.placa)
        total_weight_efficiency=f'{(total_weight/vehicle_capacity.capacidad_carga)*100:.2f}%'
    except CapacidadCarga.DoesNotExist:
        print('Vehículo sin capacidad de carga ')

    try:
        trailer_vehicle_capacity = CapacidadCarga.objects.get(placa=referral.trailer)

    except CapacidadCarga.DoesNotExist:
        print('El trailer del vehículo no tiene capacidad de carga')

 
    try:
        siscombas = Siscombas.objects.get(id_remision=pk)
        siscombas_dif=f'{(siscombas.peso_tiquete-total_weight):.2f}'
    except Siscombas.DoesNotExist:
        print('Siscombas no existe!!')

        
    totals_doc_referral={'total_units':total_units,'total_product_weight':total_product_weight,'total_punnets':total_punnets,'total_punnets_weight':total_punnets_weight,'total_weight_efficiency':total_weight_efficiency,'total_weight':total_weight,'total_gross_weight':total_weight+referral.peso_vacio,'siscombas_dif':siscombas_dif}

    return render(request, 'referral_detail_print.html', {'referral': referral,'vehicle_capacity':vehicle_capacity ,'trailer_vehicle_capacity':trailer_vehicle_capacity,'referral_documents':referral_documents,'referral_documents_count':referral_documents_count, 'totals_doc_referral': totals_doc_referral, 'siscombas': siscombas,'referral_documents_dev':referral_documents_dev})



@login_required(login_url='/login/')
@permission_required(['fleet_app.view_centrosoperacion'], login_url='/login/')
def operations_center(request):
    data = CentrosOperacion.objects.all()
    return render(request, 'operations_center.html', {'co': data})


@login_required(login_url='/login/')
@permission_required(['fleet_app.add_centrosoperacion'], login_url='/login/')
def new_operation_center(request):

    regions = Departamentos.objects.all().order_by('nombre')
    zones = Zonas.objects.all()
    # employees = Usuarios.objects.all().filter(
    #     Q(estado='activo') & ~Q(usuario='admin') & ~Q(usuario='admin'))
    employees = User.objects.filter(is_active=True, is_staff=False)
    return render(request, 'operations_center_form.html', {'cities': [], 'zones': zones, 'employees': employees, 'regions': regions})


@login_required(login_url='/login/')
@permission_required(['fleet_app.change_centrosoperacion'], login_url='/login/')
def edit_operation_center(request, pk):

    operation_center = CentrosOperacion.objects.get(pk=pk)
    region_code = operation_center.codigo_ciudad.codigo_departamento.codigo
    cities = Ciudades.objects.filter(
        codigo_departamento=region_code).order_by('nombre')
    regions = Departamentos.objects.all().order_by('nombre')
    zones = Zonas.objects.all()

    # employees = Usuarios.objects.all().filter(
    #     Q(estado='activo') & ~Q(usuario='admin') & ~Q(usuario='admin'))

    employees = User.objects.filter(is_active=True, is_staff=False)
    return render(request, 'operations_center_form.html', {'cities': cities, 'regions': regions, 'zones': zones, 'employees': employees, 'operation_center': operation_center})


@login_required(login_url='/login/')
@permission_required(['fleet_app.view_zonas'], login_url='/login/')
def zones(request):
    return render(request, 'zones.html')


@permission_required(['fleet_app.view_departamentos'], login_url='/login/')
@login_required(login_url='/login/')
def regions(request):

    return render(request, 'regions.html')


@permission_required(['fleet_app.view_ciudades'], login_url='/login/')
@login_required(login_url='/login/')
def cities_region(request, pk):
    region = Departamentos.objects.get(pk=pk)
    return render(request, 'cities.html', {'region': region})


@permission_required(['fleet_app.view_terceros'], login_url='/login/')
@login_required(login_url='/login/')
def third_party_users(request):

    return render(request, 'third_party_users.html')


@permission_required(['fleet_app.add_terceros'], login_url='/login/')
@login_required(login_url='/login/')
def add_third_party_users(request):

    regions = Departamentos.objects.all()
    cities = Ciudades.objects.all().order_by('nombre')

    return render(request, 'third_party_user_form.html', {'cities': cities, 'regions': regions})


@permission_required(['fleet_app.change_terceros'], login_url='/login/')
@login_required(login_url='/login/')
def edit_third_party_users(request, pk):
    third_party_user = Terceros.objects.get(pk=pk)
    region_code = third_party_user.codigo_ciudad.codigo_departamento.codigo
    cities = Ciudades.objects.filter(
        codigo_departamento=region_code).order_by('nombre')
    regions = Departamentos.objects.all()
    return render(request, 'third_party_user_form.html', {'cities': cities, 'regions': regions, 'third_party_user': third_party_user})


@permission_required(['fleet_app.view_vehiculos'])
@login_required()
def vehicles(request):
    return render(request, 'vehicles.html')


@permission_required(['fleet_app.add_vehiculos'])
@login_required()
def new_vehicle(request):
    operations_center = CentrosOperacion.objects.all()
    zones = Zonas.objects.all()
    lines = Lineas.objects.all()
    vehicle_types = TiposVehiculo.objects.all()

    return render(request, 'vehicle_form.html', {'operations_center': operations_center, 'zones': zones, 'lines': lines, 'vehicle_types': vehicle_types})


@permission_required(['fleet_app.change_vehiculos'])
@login_required()
def edit_vehicle(request, pk):
    operations_center = CentrosOperacion.objects.all()
    zones = Zonas.objects.all()
    lines = Lineas.objects.all()
    vehicle = Vehiculos.objects.get(pk=pk)
    vehicle_types = TiposVehiculo.objects.all()
    return render(request, 'vehicle_form.html', {'operations_center': operations_center, 'zones': zones, 'lines': lines, 'vehicle_types': vehicle_types, 'vehicle': vehicle})


@permission_required(['fleet_app.view_domicilios'])
@login_required()
def shipments(request):

    return render(request, 'shipments.html')


@permission_required(['fleet_app.add_domicilios'])
@login_required()
def new_shipment(request):
    vehicles = Vehiculos.objects.all()
    return render(request, 'shipment_form.html', {'vehicles': vehicles})


@permission_required(['fleet_app.change_domicilios'])
@login_required()
def edit_shipment(request, pk):
    vehicles = Vehiculos.objects.all()
    shipment = Domicilios.objects.get(pk=pk)

    return render(request, 'shipment_form.html', {'vehicles': vehicles, 'shipment': shipment})


@permission_required(['fleet_app.view_abonos'])
@login_required()
def fertilizers(request):
    return render(request, 'fertilizers.html')


@permission_required(['fleet_app.add_abonos'])
@login_required()
def new_fertilizer(request):

    farms = Granjas.objects.all()
    drivers = Terceros.objects.filter(
        estado='activo', conductor='si').order_by('nombre').values()
    vehicles = Vehiculos.objects.all()
    return render(request, 'new_fertilizer.html', {'farms': farms, 'drivers': drivers, 'vehicles': vehicles})


@permission_required(['fleet_app.change_abonos'])
@login_required()
def edit_fertilizer(request, pk):
    farms = Granjas.objects.all()
    drivers = Terceros.objects.filter(
        estado='activo', conductor='si').order_by('nombre').values()
    vehicles = Vehiculos.objects.all()
    fertilizer = Abonos.objects.get(pk=pk)
    return render(request, 'new_fertilizer.html', {'farms': farms, 'drivers': drivers, 'vehicles': vehicles, 'fertilizer': fertilizer})


@permission_required(['fleet_app.view_lineas'])
@login_required()
def vehicle_lines(request):
    return render(request, 'vehicle_lines.html')


@permission_required(['fleet_app.view_capacidad_carga'])
@login_required()
def vehicles_capacity(request):
    vehicles = Vehiculos.objects.all()
    regions = Departamentos.objects.all()
    return render(request, 'vehicle_capacity.html', {'vehicles': vehicles, 'regions': regions})


@permission_required(['fleet_app.view_costos_viaje'])
@login_required()
def travel_costs(request):

    return render(request, 'travel_costs.html')


@permission_required(['fleet_app.add_costos_viaje'])
@login_required()
def new_travel_costs(request):
    vehicle_lines = Lineas.objects.all()
    regions = Departamentos.objects.all()

    return render(request, 'travel_cost_form.html', {'vehicle_lines': vehicle_lines, 'regions': regions, 'cities': []})


@permission_required(['fleet_app.change_costos_viaje'])
@login_required()
def edit_travel_costs(request, pk):
    vehicle_lines = Lineas.objects.all()
    regions = Departamentos.objects.all()
    travel_cost = CostosViaje.objects.get(pk=pk)
    cities = Ciudades.objects.filter(
        codigo_departamento=travel_cost.destino.codigo_departamento).order_by('nombre')
    return render(request, 'travel_cost_form.html', {'vehicle_lines': vehicle_lines, 'travel_cost': travel_cost, 'regions': regions, 'cities': cities})


@permission_required(['fleet_app.view_empresas'])
@login_required()
def companies(request):
    cities = Ciudades.objects.all()

    regions = Departamentos.objects.all()
    return render(request, 'companies.html', {'cities': cities, 'regions': regions})


def login(request):

    return render(request, 'login.html')

# ---------------------------------------------------------------------------------API-----------------------------------------------------------


@api_view(['GET', 'POST'])
def operation_center_list(request, format=None):
    """
    List all operation_centers, or create a new operation_center.
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_centrosoperacion'):
        serializer_context = {
            'request': request,
        }
        operation_centers = CentrosOperacion.objects.all()
        serializer = CentrosOperacionSerializer(
            operation_centers, many=True, context=serializer_context)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_centrosoperacion'):
        data = request.data
        serializer = CentrosOperacionSerializer(data=data)

        if serializer.is_valid():
            res = serializer.save()

            if (len(data['empleados']) > 0):
                users = User.objects.filter(pk__in=data['empleados'])
                res.usuario.set(users)

            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def operation_center_detail(request, pk):
    """
    Retrieve, update or delete a operation_center.
    """
    if request.user.has_perm('fleet_app.view_centrosoperacion'):
        try:
            operation_center = CentrosOperacion.objects.get(pk=pk)
        except CentrosOperacion.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = CentrosOperacionSerializer(operation_center)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_centrosoperacion'):
            data = request.data
            serializer = CentrosOperacionSerializer(
                operation_center, data=data)
            if serializer.is_valid():
                serializer.save()
                employeesLength = len(data['empleados'])

                if employeesLength == 0:

                    operation_center.usuario.clear()  # elimina todas las asociaciones

                elif employeesLength > 0:

                    usersToAssociate = User.objects.filter(
                        pk__in=data['empleados'])
                    operation_center.usuario.set(usersToAssociate)

                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_centrosoperacion'):
            operation_center.delete()
            return HttpResponse(status=204)
    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def inventories_list(request, format=None):
    """
    List all inventories, or create a new inventory.
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_inventarios'):
        serializer_context = {
            'request': request,
        }
        inventories = InventariosItems.objects.all()
        serializer = InventariosItemsSerializerList(
            inventories, many=True, context=serializer_context)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_inventarios'):

        data = request.data
        data['usuario_responsable'] = request.user.id
        serializer = InventariosSerializer(data=data)
        # serializer.centro_operacion=CentrosOperacion.objects.get(pk=data['centro_operacion_id'])

        if serializer.is_valid():
            res = serializer.save()
            for i in data['items_embalaje']:
                i['inventario'] = res.id
                serializerItem = InventariosItemsSerializer(data=i)

                if serializerItem.is_valid():
                    serializerItem.save()

            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def zone_list(request):
    """
    List all zones, or create a new zone
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_zonas'):
        zones = Zonas.objects.all()
        serializer = ZonasSerializer(zones, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_zonas'):
        data = request.data
        serializer = ZonasSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def zone_detail(request, pk):
    """
    Retrieve, update or delete a zone.
    """
    if request.user.has_perm('fleet_app.view_zonas'):
        try:
            zone = Zonas.objects.get(pk=pk)
        except Zonas.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = ZonasSerializer(zone)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_zonas'):
            data = request.data
            data['codigo'] = pk
            serializer = ZonasSerializer(zone, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_zonas'):
            zone.delete()
            return HttpResponse(status=204)
    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def regions_list(request):
    """
    List all regions, or create a new region
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_departamentos'):
        regions = Departamentos.objects.all()
        serializer = DepartamentosSerializer(regions, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_departamentos'):
        data = request.data
        serializer = DepartamentosSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def region_detail(request, pk):
    """
    Retrieve, update or delete a region.
    """
    if request.user.has_perm('fleet_app.view_departamentos'):
        try:
            region = Departamentos.objects.get(pk=pk)

        except Departamentos.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':  # retorna las ciudades de un departamento
            # cities = Ciudades.objects.all().filter(codigo_departamento=pk)
            # serializer = CiudadesSerializer(cities,many=True)
            # return JsonResponse(serializer.data,safe=False)
            serializer = DepartamentosSerializer(region)
            return JsonResponse(serializer.data, safe=False)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_departamentos'):
            data = request.data
            data['codigo'] = pk
            serializer = DepartamentosSerializer(region, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_departamentos'):
            region.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def cities_list(request):
    """
    List all zones, or create a new city
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_ciudades'):
        cities = Ciudades.objects.all()
        serializer = CiudadesSerializer(cities, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_ciudades'):
        data = request.data
        serializer = CiudadesSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET'])
def cities_region_list(request, region_id):
    """
    List all cities of a region
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_ciudades'):
        cities = Ciudades.objects.all().filter(codigo_departamento=region_id)
        serializer = CiudadesSerializer(cities, many=True)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def city_detail(request, pk):
    """
    Retrieve, update or delete a city.
    """
    if request.user.has_perm('fleet_app.view_ciudades'):
        try:
            city = Ciudades.objects.get(pk=pk)
        except Ciudades.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = CiudadesSerializer(city)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_ciudades'):
            data = request.data
            data['codigo'] = pk
            serializer = CiudadesSerializer(city, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_ciudades'):
            city.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def third_party_users_list(request):
    """
    List all third_party_users, or create a new third_party_user
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_terceros'):
        drivers = request.GET.get('drivers', '')
        third_party_users = []

        if drivers != '':
            only_drivers = int(drivers) == 1

            if only_drivers:
                third_party_users = Terceros.objects.filter(
                    estado='activo', conductor='si').order_by('nombre')
            else:
                third_party_users = Terceros.objects.filter(
                    estado='activo', conductor='no').order_by('nombre')
        else:
            third_party_users = Terceros.objects.filter(
                estado='activo').order_by('nombre')

        serializer = TercerosSerializer(third_party_users, many=True)

        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_terceros'):
        data = request.data
        serializer = TercerosSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def third_party_user_detail(request, pk):
    """
    Retrieve, update or delete a third_party_user detail.
    """
    if request.user.has_perm('fleet_app.view_terceros'):
        try:
            third_party_user = Terceros.objects.get(pk=pk)
        except Terceros.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = TercerosSerializer(third_party_user)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_terceros'):
            data = request.data
            data['cedula'] = pk
            serializer = TercerosSerializer(third_party_user, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_terceros'):
            third_party_user.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def vehicles_list(request):
    """
    List all vehicle, or create a new vehicle
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_vehicles'):

        vehicles = []
        type = request.GET.get('type', -1)

        if type == -1:
            vehicles = Vehiculos.objects.all()
        else:
            vehicles = Vehiculos.objects.filter(tipo=int(type))

        serializer = VehiculosSerializer(vehicles, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_vehicles'):
        data = request.data
        serializer = VehiculosSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def vehicles_detail(request, pk):
    """
    Retrieve, update or delete a vehicle.
    """
    if request.user.has_perm('fleet_app.view_vehiculos'):
        try:
            vehicle = Vehiculos.objects.get(pk=pk)
        except Vehiculos.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = VehiculosSerializer(vehicle)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_vehiculos'):
            data = request.data
            data['placa'] = pk
            serializer = VehiculosSerializer(vehicle, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_vehiculos'):
            vehicle.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def shipments_list(request):
    """
    List all shipments, or create a new shipment
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_domicilios'):
        
        length = request.GET.get('length', 50)
        start = request.GET.get('start', 0)
        search = request.GET.get('search[value]', '').upper()
        shipments = []
        total_filtered = 0
        total = Domicilios.objects.count()
        if search != '':
            shipments = Domicilios.objects.filter(placa__placa__icontains=search).order_by(
                '-fecha')[int(start):int(start)+int(length)]
            total_filtered = Domicilios.objects.filter(
                placa__placa__icontains=search).count()
            
        else:
            shipments = Domicilios.objects.all().order_by(
                '-fecha')[int(start):int(start)+int(length)]
            total_filtered = total

        serializer = DomiciliosSerializer(shipments, many=True)
        return JsonResponse({'data': serializer.data,
                             'recordsTotal': total,
                             'recordsFiltered': total_filtered}, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_domicilios'):
        data = request.data
        serializer = DomiciliosSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def shipments_detail(request, pk):
    """
    Retrieve, update or delete a shipment.
    """
    if request.user.has_perm('fleet_app.view_domicilios'):
        try:
            shipment = Domicilios.objects.get(pk=pk)
        except Domicilios.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = DomiciliosSerializer(shipment)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_domicilios'):
            data = request.data
            data['id'] = pk
            serializer = DomiciliosSerializer(shipment, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_domicilios'):
            shipment.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def fertilizers_list(request):
    """
    List all fertilizers, or create a new fertilizer 
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_abonos'):
        fertilizers = Abonos.objects.all()
        serializer = AbonosSerializer(fertilizers, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_abonos'):
        data = request.data
        
        serializer = AbonosSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def fertilizer_detail(request, pk):
    """
    Retrieve, update or delete a fertilizer.
    """
    if request.user.has_perm('fleet_app.view_abonos'):
        try:
            fertilizer = Abonos.objects.get(pk=pk)
        except Abonos.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = AbonosSerializer(fertilizer)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_abonos'):
            data = request.data
            data['id'] = pk
            serializer = AbonosSerializer(fertilizer, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_abonos'):
            fertilizer.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def vehicle_lines_list(request):
    """
    List all vehicle lines, or create a new vehicle line 
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_lineas'):
        vehicle_lines = Lineas.objects.all()
        serializer = LineasSerializer(vehicle_lines, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_lineas'):
        data = request.data

        serializer = LineasSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def vehicle_lines_detail(request, pk):
    """
    Retrieve, update or delete a vehicle line.
    """
    if request.user.has_perm('fleet_app.view_abonos'):
        try:
            vehicle_line = Lineas.objects.get(pk=pk)
        except Lineas.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = LineasSerializer(vehicle_line)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_lineas'):
            data = request.data
            data['id_linea'] = pk
            serializer = LineasSerializer(vehicle_line, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_lineas'):
            vehicle_line.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def vehicles_capacity_list(request):
    """
    List all vehicle capacities, or create a new vehicle capacity 
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_capacidad_carga'):
        vehicle_lines = CapacidadCarga.objects.all()
        serializer = CapacidadCargaSerializer(vehicle_lines, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_capacidad_carga'):
        data = request.data

        serializer = CapacidadCargaSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def vehicle_capacity_detail(request, vehicle_id):
    """
    Retrieve, update or delete a vehicle capacity.
    """
    if request.user.has_perm('fleet_app.view_capacidad_carga'):
        try:
            route = request.GET.get('route', None)
            if route:
                vehicle_capacity = CapacidadCarga.objects.get(
                    placa=vehicle_id, ruta=route)
            else:
                return HttpResponse(status=404)

        except CapacidadCarga.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = CapacidadCargaSerializer(vehicle_capacity)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_capacidad_carga'):
            data = request.data
            serializer = CapacidadCargaSerializer(vehicle_capacity, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_capacidad_carga'):
            vehicle_capacity.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def travel_costs_list(request):
    """
    List all travel costs, or create a new travel cost
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_costos_viaje'):
        travel_cost = CostosViaje.objects.all()
        serializer = CostosViajeSerializer(travel_cost, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_costos_viaje'):
        data = request.data

        serializer = CostosViajeSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def travel_cost_detail(request, pk):
    """
    Retrieve, update or delete a vehicle capacity.
    """
    if request.user.has_perm('fleet_app.view_costos_viaje'):
        try:
            travel_cost = CostosViaje.objects.get(pk=pk)
        except CostosViaje.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = CostosViajeSerializer(travel_cost)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_costos_viaje'):
            data = request.data
            serializer = CostosViajeSerializer(travel_cost, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_costos_viaje'):
            travel_cost.delete()
            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)





@api_view(['GET','PUT','DELETE'])
def vendors_detail(request,pk):
    if request.user.has_perm('fleet_app.view_vendors'):
        try:
            siller= Vendedores.objects.get(pk=pk)
        except Vendedores.DoesNotExist:
            return HttpResponse(status=404)
        if request.method == 'GET':
            serializer = VendedoresSerializer(siller)
            return JsonResponse(serializer.data)
        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_vendors'):
            data = request.data
            data['codigo']=pk

            if data['predeterminada']:
                default_siller= Vendedores.objects.filter(~Q(codigo=pk), predeterminada=1)
                if len(default_siller)>0:
                    return JsonResponse([{"error":"Ya existe un vendedor predeterminado"}], status=400, safe=False)
            serializer =VendedoresSerializer(siller, data=data)
            if serializer.if_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.error,status=400)
        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_vendors'):
            siller.delete()
            return HttpResponse(status=204)
    return JsonResponse([{"error":"No autorizado"}],status=401, safe=False)

    

@api_view(['GET', 'POST'])
def companies_list(request):
    """
    List all companies, or create a new compani
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_empresas'):
        company = Empresas.objects.all()
        serializer = EmpresasSerializer(company, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_empresas'):

        data = request.data

        if data['predeterminada']:

            default_company = Empresas.objects.filter(predeterminada=1)

            if len(default_company) > 0:
                return JsonResponse([{"error": "Ya existe una empresa predeterminada"}], status=400, safe=False)

        serializer = EmpresasSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)



@api_view(['GET', 'PUT', 'DELETE'])
def companies_detail(request, pk):
    """
    Retrieve, update or delete a company.
    """
    if request.user.has_perm('fleet_app.view_empresas'):
        try:
            company = Empresas.objects.get(pk=pk)
        except Empresas.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = EmpresasSerializer(company)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_empresas'):
            data = request.data
            data['nit'] = pk

            if data['predeterminada']:

                default_company = Empresas.objects.filter(
                    ~Q(nit=pk), predeterminada=1)

                if len(default_company) > 0:
                    return JsonResponse([{"error": "Ya existe una empresa predeterminada"}], status=400, safe=False)

            serializer = EmpresasSerializer(company, data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_empresas'):
            company.delete()

            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def referrals_list(request):
    """
    List all referrals, or create a new referral.
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_remisiones'):

        length = request.GET.get('length', 50)
        start = request.GET.get('start', 0)
        search = request.GET.get('search[value]', '')
      
        referrals = []
        total_filtered = 0
        total = Remisiones.objects.count()
        if search != '':
            referrals = Remisiones.objects.filter(Q(placa__placa__icontains=search) | Q(
                id_remision__icontains=search)).order_by('-id_remision')[int(start):int(start)+int(length)]
            total_filtered = Remisiones.objects.filter(
                Q(placa__placa__icontains=search) | Q(id_remision__icontains=search)).count()
            
        else:
            referrals = Remisiones.objects.all().order_by(
                '-id_remision')[int(start):int(start)+int(length)]
            total_filtered = total

        serializer = RemisionesSerializer(referrals, many=True)
        return JsonResponse({'data': serializer.data,
                             # 'per_page': 50,
                             'recordsTotal': total,
                             'recordsFiltered': total_filtered}, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_remisiones'):

        data = request.data
        # now = datetime.now()
        # data['fecha_expedicion']=now
        data['estado'] = "abierta"
        serializer = RemisionesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def referral_detail(request, pk):
    """
    Retrieve, update or delete a referral.
    """
    if request.user.has_perm('fleet_app.view_remisiones'):
        try:
            referral = Remisiones.objects.get(pk=pk)
        except Remisiones.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = RemisionesSerializer(referral)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_remisiones'):
            data = request.data
            state = data.get('estado')
            if state:
                # se valida que la remision tenga documentos, conductor, ciudad y pesaje registrado
                documents= DocRemision.objects.filter(id_remision=pk).count()

                siscombas= Siscombas.objects.filter(id_remision=pk).count()
               

                if state == 'generada' and (not referral.codigo_ciudad or not referral.conductor or documents == 0 or siscombas == 0):
                    return JsonResponse([{"error": "El vehículo no puede ser despachado, por favor revise si tiene asignado un conductor, una ciudad de destino, el pesaje y al menos un documento"}], status=400, safe=False)
                
                now=datetime.now()
                if state=='generada':
                    data['fecha_despacho']=now
                elif state=='cerrada':
                    data['fecha_cierre']=now
                elif state=='retornada':
                    data['fecha_retorno']=now
                    
            serializer = RemisionesSerializer(referral, data=data)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_remisiones'):
            referral.delete()

            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def referral_documents(request, referral_id):
    """
    List all referral documents, or create a new referral document.
    """

    if request.method == 'GET' and request.user.has_perm('fleet_app.view_doc_remision'):
        documents = DocRemision.objects.filter(id_remision=referral_id)

        serializer = DocRemisionSerializer(documents, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_doc_remision'):

        referral = Remisiones.objects.get(pk=referral_id)
        
        if referral.estado !='generada':
            data = request.data

            data['id_remision'] = referral_id

            co_or_user = data.pop('destino', None)

            if int(data['unidad_negocio']) == 1:
                data['id_centro_operacion'] = co_or_user

            else:
                data['id_tercero'] = co_or_user

            serializer = DocRemisionSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)

            return JsonResponse(serializer.errors, status=400)
        
        return JsonResponse([{"error": "La remisión ha sido generada, por tanto no se pueden agregar documentos"}], status=400, safe=False)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)

@api_view(['GET', 'POST'])
def referral_documents_dev(request, referral_id):
    """
    List all referral documents of return, or create a new referral document of return.
    """

    if request.method == 'GET' and request.user.has_perm('fleet_app.view_dev_remision'):
        documents = DevRemision.objects.filter(id_remision=referral_id)

        serializer = DevRemisionSerializer(documents, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_dev_remision'):

        referral = Remisiones.objects.get(pk=referral_id)
        
        if referral.estado == 'retornada':
            data = request.data

            data['id_remision'] = referral_id

            co_or_user = data.pop('origen', None)

            if int(data['unidad_negocio']) == 1:
                data['id_centro_operacion'] = co_or_user

            else:
                data['id_tercero'] = co_or_user

            serializer = DevRemisionSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)

            return JsonResponse(serializer.errors, status=400)
        
        return JsonResponse([{"error": "Solo se pueden agrgar documentos de retorno cuando la remisión fue retornada"}], status=400, safe=False)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)



@api_view(['GET', 'POST'])
def referral_siscombas(request, referral_id):
    """
    List all referral siscombas, or create a new siscombas
    """

    if request.method == 'GET' and request.user.has_perm('fleet_app.view_siscombas'):
        siscombas = Siscombas.objects.filter(id_remision=referral_id)

        serializer = SiscombasSerializer(siscombas, many=True)
        return JsonResponse(serializer.data[0], safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_siscombas'):

        siscombas = Siscombas.objects.filter(id_remision=referral_id)

        if len(siscombas) == 0:
            data = request.data

            data['id_remision'] = referral_id

            serializer = SiscombasSerializer(data=data)

            if serializer.is_valid():
                serializer.save()

                return JsonResponse(serializer.data, status=201)

            return JsonResponse(serializer.errors, status=400)

        return JsonResponse([{"error": "Solo se puede crear un registro por remisión"}], status=400, safe=False)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT', 'DELETE'])
def referral_document_detail(request, referral_id, document_id):
    """
    Retrieve, update or delete a document referral.
    """

    if request.user.has_perm('fleet_app.view_doc_remision'):
        try:
            document = DocRemision.objects.get(pk=document_id)
        except DocRemision.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = DocRemisionSerializer(document)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_doc_remision'):

            referral = Remisiones.objects.get(pk=referral_id)
        
            if referral.estado !='generada' and referral.estado !='anulada': #validación de regla de negocio
                data = request.data

                co_or_user = data.pop('destino', None)
                
                if co_or_user and data.get('unidad_negocio') !=None :
                    if int(data['unidad_negocio']) == 1:
                        data['id_centro_operacion'] = co_or_user
                    else:
                        data['id_tercero'] = co_or_user

                serializer = DocRemisionSerializer(document, data=data)

                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data, status=201)

                return JsonResponse(serializer.errors, status=400)
            
            return JsonResponse([{"error": "La remisión ha sido generada, por tanto no se pueden editar documentos"}], status=400, safe=False)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_doc_remision'):
            document.delete()

            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)

@api_view(['GET', 'PUT', 'DELETE'])
def referral_document_dev_detail(request, referral_id, document_dev_id):
    """
    Retrieve, update or delete a document referral of return.
    """

    if request.user.has_perm('fleet_app.view_dev_remision'):
        try:
            document = DevRemision.objects.get(pk=document_dev_id)
        except DevRemision.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = DevRemisionSerializer(document)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_dev_remision'):

            referral = Remisiones.objects.get(pk=referral_id)
        
            if referral.estado == 'retornada': #validación de regla de negocio
                data = request.data

                co_or_user = data.pop('origen', None)
                
                if co_or_user and data.get('unidad_negocio') !=None :
                    if int(data['unidad_negocio']) == 1:
                        data['id_centro_operacion'] = co_or_user
                    else:
                        data['id_tercero'] = co_or_user

                serializer = DevRemisionSerializer(document, data=data)

                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data, status=201)

                return JsonResponse(serializer.errors, status=400)
            
            return JsonResponse([{"error": "La remisión ha sido cerrada o aún no ha sido retornada, por tanto no se pueden editar documentos"}], status=400, safe=False)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_dev_remision'):
            document.delete()

            return HttpResponse(status=204)

    return JsonResponse([{"error":"No autorizado"}], status=401, safe=False)

@api_view(['GET', 'PUT', 'DELETE'])
def referral_siscombas_detail(request, referral_id, siscombas_id):
    """
    Retrieve, update or delete a siscombas referral.
    """

    if request.user.has_perm('fleet_app.view_siscombas'):
        try:
            siscombas = Siscombas.objects.get(pk=siscombas_id)
        except Siscombas.DoesNotExist:

            return HttpResponse(status=404)

        if request.method == 'GET':
            serializer = SiscombasSerializer(siscombas)
            return JsonResponse(serializer.data)

        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_siscombas'):
            data = request.data
            data['id'] = siscombas_id
            data['id_remision'] = referral_id
            serializer = SiscombasSerializer(siscombas, data=data)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)

            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'DELETE' and request.user.has_perm('fleet_app.delete_siscombas'):
            siscombas.delete()

            return HttpResponse(status=204)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'POST'])
def seller_list(request):
    """
    List all sellers, or create a new seller
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_vendedores'):
        seller = Vendedores.objects.all()
        serializer = VendedoresSerializer(seller, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_vendedores'):
        data = request.data
        serializer = VendedoresSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error": "No autorizado"}], status=401, safe=False)


@api_view(['GET', 'PUT','DELETE'])
def seller_detele(request,pk):

    if request.user.has_perm('fleet_app.view_vendedores'):
        try:
            siller=Vendedores.objects.get(pk=pk)
        except Vendedores.DoesNotExist:
            return HttpResponse(status=404)
        if request.method == 'GET':
            serializer = VendedoresSerializer(siller)
            return JsonResponse(serializer.data)
        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_vendedores'):
            data = request.data

            serializer = VendedoresSerializer(siller,data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.error,status=400)
        elif request.method == 'DELETE' and request.user.has_perm('fleet_app-delete_vendedores'):
            siller.delete()
            return HttpResponse(status=204)
        return JsonResponse([{"error":"No autorizado"}], status=401, safe=False)
    

@api_view(['GET','POST'])
def datosPerson_list(request):
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_datosperson'):
        datosperson = Datosperson.objects.all()
        serializer = datospersonalesSerializer(datosperson, many=True)
        return JsonResponse(serializer.data,safe=False)
    
    elif request.methon == 'POST' and request.user.has_perm('fleet_app.view_datosperson'):
        data=request.data
        serializer= datospersonalesSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error":"No autorizado"}], status=401,safe=False)

@api_view(['GET','PUT','DELETE'])
def datosPerson_delete(request,pk):
    if request.user.has_perm('feet_app.view_datosperson'):
        try:
            rapipollo_pk=Datosperson.objects.get(pk=pk)
        except Datosperson.DoesNotExist:
            return HttpResponse(status=404)
        if request.method == 'GET':
            serializer= datospersonalesSerializer(rapipollo_pk)
            return JsonResponse(serializer.data)
        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_datosperson'):
            data = request.data

            serializer= RapipollosSerializer(rapipollo_pk,data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.error,status=400)
        elif request.method == 'DELETE' and request.user.has_perm('fleet_app-delete_datosperson'):
            rapipollo_pk.delete()
            return HttpResponse(status=204)
        
    return JsonResponse([{"error":"No autorizado"}],status=401,safe=False)
    




@api_view(['GET', 'POST'])
def rapipollos_list(request):
    """
    List all rapipollos, or create a new rapipollo
    """
    if request.method == 'GET' and request.user.has_perm('fleet_app.view_rapipollos'):
        rapipollo = Rapipollos.objects.all()
        serializer = RapipollosSerializer(rapipollo, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and request.user.has_perm('fleet_app.add_rapipollos'):
        data = request.data
        serializer = RapipollosSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    return JsonResponse([{"error":"No autorizado"}], status=401,safe=False)

@api_view(['GET','PUT','DELETE'])
def rapipollo_delete(request,pk):
    if request.user.has_perm('feet_app.view_rapipollos'):
        try:
            rapipollo_pk=Rapipollos.objects.get(pk=pk)
        except Rapipollos.DoesNotExist:
            return HttpResponse(status=404)
        if request.method == 'GET':
            serializer= RapipollosSerializer(rapipollo_pk)
            return JsonResponse(serializer.data)
        elif request.method == 'PUT' and request.user.has_perm('fleet_app.change_rapipollo'):
            data = request.data

            serializer= RapipollosSerializer(rapipollo_pk,data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.error,status=400)
        elif request.method == 'DELETE' and request.user.has_perm('fleet_app-delete_rapipollo'):
            rapipollo_pk.delete()
            return HttpResponse(status=204)
        
    return JsonResponse([{"error":"No autorizado"}],status=401,safe=False)
    


