from django.contrib.auth.models import User, Group
 resfromt_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from fleet_app.models import Datosperson, Abonos, CapacidadCarga, CentrosOperacion, Ciudades, CostosViaje, Rapipollos ,TiposProducto,TiposDocumento,Departamentos, Domicilios, Empresas, Granjas, InventariosItems, Lineas, Remisiones, ItemEmbalaje,Inventarios, Terceros, TiposVehiculo, Vehiculos, Zonas, DocRemision,TiposNegocio,Siscombas,DevRemision,Vendedores


class datospersonalesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=Datosperson
        fields=['nombre','apellido','tipodocumento','documento','celular']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email',  'first_name']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class DepartamentosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Departamentos
        fields = '__all__'

class ZonasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Zonas
        fields = '__all__'
        
class CiudadesSerializer(serializers.ModelSerializer):
    departamento=DepartamentosSerializer(read_only=True, source='codigo_departamento')
    codigo_departamento=serializers.PrimaryKeyRelatedField(queryset=Departamentos.objects.all())
    id_zona=serializers.PrimaryKeyRelatedField(queryset=Zonas.objects.all())
    zona=ZonasSerializer(read_only=True, source='id_zona')

    class Meta:
        model = Ciudades
        fields = ['codigo','nombre','codigo_departamento','departamento','id_zona','zona']

class CentrosOperacionSerializer(serializers.ModelSerializer):

    usuario = UserSerializer(many=True, read_only=True)
    ciudad = CiudadesSerializer(read_only=True, source='codigo_ciudad')
    class Meta:
        model = CentrosOperacion
        fields = ['codigo', 'nombre', 'codigo_ciudad','ciudad',
                  'direccion', 'telefono', 'contacto', 'celular','usuario']

class ItemEmbalajeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemEmbalaje
        fields = ['id','codigo', 'descripcion']



class InventariosSerializer(serializers.ModelSerializer):

    usuario_responsable = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    centro_operacion = serializers.PrimaryKeyRelatedField(queryset=CentrosOperacion.objects.all())
    # centro_operacion = CentrosOperacionSerializer(read_only=True)
    class Meta:
        model = Inventarios
        fields = ['id', 'fecha_corte', 'hora_inicial', 'hora_final', 'nombre_persona',
                  'cargo_persona', 'observaciones', 'usuario_responsable', 'centro_operacion',]

class InventariosSerializerCO(serializers.ModelSerializer):

    # centro_operacion = serializers.PrimaryKeyRelatedField(queryset=CentrosOperacion.objects.all())
    centro_operacion = CentrosOperacionSerializer(read_only=True)
    class Meta:
        model = Inventarios
        fields = ['id', 'fecha_corte', 'hora_inicial', 'hora_final', 'nombre_persona',
                  'cargo_persona', 'observaciones', 'usuario_responsable', 'centro_operacion']


class InventariosItemsSerializer(serializers.ModelSerializer):

    inventario=serializers.PrimaryKeyRelatedField(queryset=Inventarios.objects.all())
    item_embalaje=serializers.PrimaryKeyRelatedField(queryset=ItemEmbalaje.objects.all())
    # inventario = InventariosSerializer(many=True, read_only=True)
    class Meta:
        model = InventariosItems
        fields = ['stock','toma_fisica','inventario','item_embalaje']

class InventariosItemsSerializerList(serializers.ModelSerializer):

    # inventario=serializers.PrimaryKeyRelatedField(queryset=Inventarios.objects.all())
    item_embalaje= ItemEmbalajeSerializer()
    inventario = InventariosSerializerCO()
    class Meta:
        model = InventariosItems
        fields = ['stock','toma_fisica','inventario','item_embalaje']
        
class EmpresasSerializer(serializers.ModelSerializer):
    ciudad=CiudadesSerializer(read_only=True, source='codigo_ciudad')
    codigo_ciudad=serializers.PrimaryKeyRelatedField(queryset=Ciudades.objects.all())
    class Meta:
        model = Empresas
        fields = ['nit','nombre','telefono','contacto','direccion','ciudad','codigo_ciudad','predeterminada']

class TercerosSerializer(serializers.ModelSerializer):

    ciudad=CiudadesSerializer(read_only=True, source='codigo_ciudad')
    codigo_ciudad=serializers.PrimaryKeyRelatedField(queryset=Ciudades.objects.all())
    class Meta:
        model = Terceros
        fields = ['cedula','nombre','direccion','telefono','estado','conductor','codigo_ciudad','ciudad']

        
class TiposVehiculoSerializer(serializers.ModelSerializer):

    class Meta:
        model = TiposVehiculo
        fields = ['id','descripcion']

        
class VehiculosSerializer(serializers.ModelSerializer):

    centro_operacion_detail=CentrosOperacionSerializer(read_only=True, source='centro_operacion')
    centro_operacion=serializers.PrimaryKeyRelatedField(queryset=CentrosOperacion.objects.all())
    tipo_vehiculo= TiposVehiculoSerializer(read_only=True, source='tipo')
    class Meta:
        model = Vehiculos
        fields = ['placa','tipo','tipo_vehiculo','marca','poliza','vencimiento_soat','compania_soat','linea','modelo','furgon','centro_operacion','centro_operacion_detail']


class RemisionesSerializer(serializers.ModelSerializer):

    empresa=EmpresasSerializer(read_only=True, source='nit')
    conductor_vehiculo=TercerosSerializer(read_only=True, source='conductor')
    ciudad_destino=CiudadesSerializer(read_only=True, source='codigo_ciudad')
    vehiculo=VehiculosSerializer(read_only=True, source='placa')
    class Meta:
        model = Remisiones
        fields = ['id_remision', 'fecha_expedicion', 'fecha_entrega', 'placa','vehiculo' ,'nit','empresa' ,'codigo_ciudad', 'ciudad_destino','conductor','conductor_vehiculo', 'estado',
                  'trailer', 'fecha_despacho', 'peso_vacio', 'fecha_cierre', 'fecha_retorno', 'id_usuario_grabo']

        extra_kwargs = {
                    'id_remision': {'read_only': True}
                }

class RapipollosSerializer(serializers.ModelSerializer):

    datos_adicionales=TercerosSerializer(read_only=True, source='cedula')
    class Meta:
        model = Rapipollos
        fields = ['codigo','cedula','celular','placa','datos_adicionales']

class VendedoresSerializer(serializers.ModelSerializer):
    datos_adicionales=TercerosSerializer(read_only=True, source='cedula')
    class Meta:
        model = Vendedores
        fields = ['codigo','cedula','celular','datos_adicionales']


class DomiciliosSerializer(serializers.ModelSerializer):

    vehiculo=VehiculosSerializer(read_only=True, source='placa')
    placa=serializers.PrimaryKeyRelatedField(queryset=Vehiculos.objects.all())

    class Meta:
        model = Domicilios
        fields = ['id','placa','vehiculo','fecha','kilos','observacion']
        extra_kwargs = {
            'id': {'read_only': True}
        }
class GranjasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Granjas
        fields = ['id','codigo', 'nombre_granja']

class AbonosSerializer(serializers.ModelSerializer):

    conductor_vehiculo=TercerosSerializer(read_only=True, source='conductor')
    granja_detail=GranjasSerializer(read_only=True, source='granja')
    placa=serializers.PrimaryKeyRelatedField(queryset=Vehiculos.objects.all())

    class Meta:
        model = Abonos
        fields = ['id','granja','granja_detail','placa','conductor','conductor_vehiculo','destino','kilos_totales','costo_flete','fecha']
        extra_kwargs = {
            'id': {'read_only': True}
        }


class LineasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lineas
        fields = '__all__'
        

class CapacidadCargaSerializer(serializers.ModelSerializer):

    
    ciudad=CiudadesSerializer(read_only=True, source='ruta')
    ruta=serializers.PrimaryKeyRelatedField(queryset=Ciudades.objects.all())

    class Meta:
        model = CapacidadCarga
        fields = ['placa','ruta','ciudad','peso_vacio','capacidad_carga']

class CostosViajeSerializer(serializers.ModelSerializer):


    ciudad_origen=CiudadesSerializer(read_only=True, source='origen')
    ciudad_destino=CiudadesSerializer(read_only=True, source='destino')
    origen=serializers.PrimaryKeyRelatedField(queryset=Ciudades.objects.all())
    destino=serializers.PrimaryKeyRelatedField(queryset=Ciudades.objects.all())
    id_linea=serializers.PrimaryKeyRelatedField(queryset=Lineas.objects.all())
    linea=LineasSerializer(read_only=True, source='id_linea')

    class Meta:
        model = CostosViaje
        fields = ['id','origen','destino','ciudad_origen','ciudad_destino','id_linea','linea','toneladas','combustible','peajes','alimentacion','soat','gasto_operativo','gasto_mantenimiento']
        extra_kwargs = {
            'id': {'read_only': True}
        }
        # validators = [
        #     UniqueTogetherValidator(
        #         queryset=CostosViaje.objects.all(),
        #         fields=['origen', 'destino', 'id_linea']
        #     )
        # ]

        
class TiposProductoSerializer(serializers.ModelSerializer):

    class Meta:
        model = TiposProducto
        fields = '__all__'

class TiposNegocioSerializer(serializers.ModelSerializer):

    class Meta:
        model = TiposNegocio
        fields = '__all__'

class TiposDocumentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = TiposDocumento
        fields = '__all__'


class SiscombasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Siscombas
        fields = ['id','num_tiquete','peso_tiquete','id_remision']
        extra_kwargs = {
            'id': {'read_only': True}
        }
        
        
class DocRemisionSerializer(serializers.ModelSerializer):

    detalles_producto=TiposProductoSerializer(read_only=True, source='producto')
    producto=serializers.PrimaryKeyRelatedField(queryset=TiposProducto.objects.all())

    ciudad=CiudadesSerializer(read_only=True, source='codigo_ciudad')
    codigo_ciudad=serializers.PrimaryKeyRelatedField(queryset=Ciudades.objects.all())

    tercero=TercerosSerializer(read_only=True, source='id_tercero')
    id_tercero=serializers.PrimaryKeyRelatedField(queryset=Terceros.objects.all(), required=False)

    centro_operacion=CentrosOperacionSerializer(read_only=True, source='id_centro_operacion')
    id_centro_operacion=serializers.PrimaryKeyRelatedField(queryset=CentrosOperacion.objects.all(), required=False)

    negocio=TiposNegocioSerializer(read_only=True, source='unidad_negocio')
    unidad_negocio=serializers.PrimaryKeyRelatedField(queryset=TiposNegocio.objects.all())

    documento=TiposDocumentoSerializer(read_only=True, source='id_tipo_doc')
    id_tipo_doc=serializers.PrimaryKeyRelatedField(queryset=TiposDocumento.objects.all())
    
    class Meta:
        model = DocRemision
        fields = ['id_remision','detalles_producto','tercero','centro_operacion','negocio','id_tipo_doc','numero_doc','kilos','unidades','producto','canastillas','sellos','unidad_negocio','codigo_ciudad','ciudad','id_doc_remision','id_tercero','id_centro_operacion','documento']
        extra_kwargs = {
            'id_doc_remision': {'read_only': True}
        }


class DevRemisionSerializer(serializers.ModelSerializer):

    tercero=TercerosSerializer(read_only=True, source='id_tercero')
    id_tercero=serializers.PrimaryKeyRelatedField(queryset=Terceros.objects.all(), required=False)

    centro_operacion=CentrosOperacionSerializer(read_only=True, source='id_centro_operacion')
    id_centro_operacion=serializers.PrimaryKeyRelatedField(queryset=CentrosOperacion.objects.all(), required=False)

    negocio=TiposNegocioSerializer(read_only=True, source='unidad_negocio')
    unidad_negocio=serializers.PrimaryKeyRelatedField(queryset=TiposNegocio.objects.all())

    remision=RemisionesSerializer(read_only=True, source='id_remision')
    id_remision=serializers.PrimaryKeyRelatedField(queryset=Remisiones.objects.all())
    class Meta:
        model = DevRemision
        fields = ['id_remision','remision','tercero','centro_operacion','negocio','kilos','unidades','canastillas','unidad_negocio','id_dev_remision','id_tercero','id_centro_operacion','observaciones']
        extra_kwargs = {
            'id_dev_remision': {'read_only': True}
        }


