# Create your models here.
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth import get_user_model
User=get_user_model()

class CentrosOperacion(models.Model):
    codigo = models.CharField(primary_key=True, max_length=5)
    nombre = models.CharField(max_length=50)
    codigo_ciudad = models.ForeignKey('Ciudades', models.DO_NOTHING, db_column='codigo_ciudad', blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    contacto = models.CharField(max_length=50, blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    usuario = models.ManyToManyField(User)

    def __str__(self) -> str:
        return f'{self.codigo} - {self.nombre}'
    class Meta:
        managed = True
        verbose_name_plural = "Centros de operación"
        db_table = 'centros_operacion'

class ItemEmbalaje(models.Model):
    codigo=models.CharField(max_length=200)
    descripcion=models.CharField(max_length=100)

class Inventarios(models.Model):
    fecha_corte = models.DateField()
    hora_inicial=models.TimeField()
    hora_final=models.TimeField()
    nombre_persona=models.CharField(max_length=200)#corresponde al usuario que diligencia
    cargo_persona=models.CharField(max_length=100)#corresponde al cargo del usuario que diligencia
    observaciones=models.CharField(max_length=200, blank=True, null=True)
    usuario_responsable =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True) #corresponde al usuario en sesion
    items_embalaje = models.ManyToManyField(ItemEmbalaje, through='InventariosItems')
    centro_operacion = models.ForeignKey(CentrosOperacion, on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        return f'{self.fecha_corte}'
    class Meta:
        verbose_name_plural = "Inventarios"
       

class InventariosItems(models.Model):
    stock=models.IntegerField()
    toma_fisica=models.IntegerField()
    inventario=models.ForeignKey(Inventarios, on_delete=models.CASCADE)
    item_embalaje=models.ForeignKey(ItemEmbalaje, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'{self.inventario} {self.item_embalaje.descripcion}'
    class Meta:
        verbose_name_plural = "Inventarios_Items_Embalaje"


# ---------------------------------------------------------------------------No controlados


class Abonos(models.Model):
    id = models.IntegerField(primary_key=True)
    granja = models.ForeignKey('Granjas', models.DO_NOTHING, db_column='granja', blank=True, null=True)
    placa = models.ForeignKey('Vehiculos', models.DO_NOTHING, db_column='placa', blank=True, null=True)
    conductor = models.ForeignKey('Terceros', models.DO_NOTHING, db_column='conductor', blank=True, null=True)
    destino = models.CharField(max_length=50, blank=True, null=True)
    kilos_totales = models.CharField(max_length=10, blank=True, null=True)
    costo_flete = models.CharField(max_length=10, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'abonos'


class CapacidadCarga(models.Model):
    placa = models.OneToOneField('Vehiculos', models.DO_NOTHING, db_column='placa', primary_key=True)
    ruta = models.ForeignKey('Ciudades', models.DO_NOTHING, db_column='ruta')
    peso_vacio = models.FloatField(blank=True, null=True)
    capacidad_carga = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'capacidad_carga'
        unique_together = (('placa', 'ruta'),)

class Ciudades(models.Model):
    codigo = models.CharField(primary_key=True, max_length=5)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    codigo_departamento = models.ForeignKey('Departamentos', models.DO_NOTHING, db_column='codigo_departamento', blank=True, null=True)
    id_zona = models.ForeignKey('Zonas', models.DO_NOTHING, db_column='id_zona', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ciudades'


class CostosViaje(models.Model):
    id = models.IntegerField(primary_key=True)
    origen = models.ForeignKey(Ciudades, models.DO_NOTHING, db_column='origen', )
    destino = models.ForeignKey(Ciudades, models.DO_NOTHING, db_column='destino', related_name='+')
    id_linea = models.ForeignKey('Lineas', models.DO_NOTHING, db_column='id_linea')
    toneladas = models.FloatField(blank=True, null=True)
    combustible = models.FloatField(blank=True, null=True)
    peajes = models.FloatField(blank=True, null=True)
    alimentacion = models.FloatField(blank=True, null=True)
    soat = models.FloatField(blank=True, null=True)
    gasto_operativo = models.FloatField(blank=True, null=True)
    gasto_mantenimiento = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'costos_viaje'



class Departamentos(models.Model):
    codigo = models.CharField(primary_key=True, max_length=2)
    nombre = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'departamentos'


class DevRemision(models.Model):
    id_dev_remision = models.BigIntegerField(primary_key=True)
    unidad_negocio = models.ForeignKey('TiposNegocio', models.DO_NOTHING, db_column='unidad_negocio', blank=True, null=True)
    canastillas = models.BigIntegerField(blank=True, null=True)
    kilos = models.BigIntegerField(blank=True, null=True)
    unidades = models.BigIntegerField(blank=True, null=True)
    id_remision = models.ForeignKey('Remisiones', models.DO_NOTHING, db_column='id_remision', blank=True, null=True)
    observaciones = models.CharField(max_length=100, blank=True, null=True)
    id_tercero = models.ForeignKey('Terceros', models.DO_NOTHING, db_column='id_tercero', blank=True, null=True)
    id_centro_operacion = models.ForeignKey(CentrosOperacion, models.DO_NOTHING, db_column='id_centro_operacion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dev_remision'


class DocRemision(models.Model):
    id_remision = models.ForeignKey('Remisiones', models.DO_NOTHING, db_column='id_remision', blank=True, null=True)
    id_tipo_doc = models.ForeignKey('TiposDocumento', models.DO_NOTHING, db_column='id_tipo_doc', blank=True, null=True)
    numero_doc = models.BigIntegerField(blank=True, null=True)
    kilos = models.FloatField(blank=True, null=True)
    unidades = models.BigIntegerField(blank=True, null=True)
    producto = models.ForeignKey('TiposProducto', models.DO_NOTHING, db_column='producto', blank=True, null=True)
    canastillas = models.BigIntegerField(blank=True, null=True)
    sellos = models.BigIntegerField(blank=True, null=True)
    unidad_negocio = models.ForeignKey('TiposNegocio', models.DO_NOTHING, db_column='unidad_negocio', blank=True, null=True)
    codigo_ciudad = models.ForeignKey(Ciudades, models.DO_NOTHING, db_column='codigo_ciudad', blank=True, null=True)
    id_doc_remision = models.BigIntegerField(primary_key=True)
    id_tercero = models.ForeignKey('Terceros', models.DO_NOTHING, db_column='id_tercero', blank=True, null=True)
    id_centro_operacion = models.ForeignKey(CentrosOperacion, models.DO_NOTHING, db_column='id_centro_operacion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'doc_remision'


class Domicilios(models.Model):
    id = models.IntegerField(primary_key=True)
    placa = models.ForeignKey('Vehiculos', models.DO_NOTHING, db_column='placa', blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    kilos = models.CharField(max_length=10, blank=True, null=True)
    observacion = models.CharField(max_length=1000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'domicilios'


class Empresas(models.Model):
    nit = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    contacto = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    codigo_ciudad = models.ForeignKey(Ciudades, models.DO_NOTHING, db_column='codigo_ciudad', blank=True, null=True)
    predeterminada = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'empresas'

        
class Granjas(models.Model):
    codigo = models.CharField(max_length=20)
    nombre_granja = models.CharField(max_length=100)
    area_cria = models.CharField(max_length=20)
    activo = models.CharField(max_length=20)
    etapa_granja = models.CharField(max_length=20)
    tipo_especies = models.CharField(max_length=20)
    nombre_propietario = models.CharField(max_length=100, blank=True, null=True)
    tipo_granja = models.CharField(max_length=20)
    tipo_granjero = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'granjas'


class Lineas(models.Model):
    id_linea = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lineas'

        
class Rapipollos(models.Model):
    codigo = models.CharField(primary_key=True, max_length=3)
    cedula = models.ForeignKey('Terceros', models.DO_NOTHING, db_column='cedula', blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    placa = models.ForeignKey('Vehiculos', models.DO_NOTHING, db_column='placa', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rapipollos'


class Remisiones(models.Model):
    id_remision = models.BigIntegerField(primary_key=True)
    fecha_expedicion = models.DateTimeField(blank=True, null=True)
    fecha_entrega = models.DateTimeField(blank=True, null=True)
    placa = models.ForeignKey('Vehiculos', models.DO_NOTHING, db_column='placa', blank=True, null=True)
    nit = models.ForeignKey(Empresas, models.DO_NOTHING, db_column='nit', blank=True, null=True)
    codigo_ciudad = models.ForeignKey(Ciudades, models.DO_NOTHING, db_column='codigo_ciudad', blank=True, null=True)
    conductor = models.ForeignKey('Terceros', models.DO_NOTHING, db_column='conductor', blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    trailer = models.ForeignKey('Vehiculos', models.DO_NOTHING, db_column='trailer', blank=True, null=True, related_name='+')
    fecha_despacho = models.DateTimeField(blank=True, null=True)
    peso_vacio = models.FloatField(blank=True, null=True)
    fecha_cierre = models.DateTimeField(blank=True, null=True)
    fecha_retorno = models.DateTimeField(blank=True, null=True)
    id_usuario_grabo = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'remisiones'


class Siscombas(models.Model):
    # id = models.BigIntegerField(primary_key=True, blank=True, null=True)
    num_tiquete = models.CharField(max_length=20)
    peso_tiquete = models.FloatField()
    id_remision = models.ForeignKey(Remisiones, models.DO_NOTHING, db_column='id_remision')

    class Meta:
        managed = False
        db_table = 'siscombas'


class Terceros(models.Model):
    cedula = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=50, blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    conductor = models.CharField(max_length=2, blank=True, null=True)
    codigo_ciudad = models.ForeignKey(Ciudades, models.DO_NOTHING, db_column='codigo_ciudad', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'terceros'


class TiposDocumento(models.Model):
    id = models.CharField(primary_key=True, max_length=3)
    descripcion = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'tipos_documento'

class TiposProducto(models.Model):
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'tipos_producto'


class TiposNegocio(models.Model):
    descripcion = models.CharField(max_length=100)
    id_antiguo = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'tipos_negocio'


class TiposVehiculo(models.Model):

    descripcion = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'tipos_vehiculo'


class Usuarios(models.Model):
    id_usuario = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    correo = models.CharField(max_length=100, blank=True, null=True)
    usuario = models.CharField(max_length=50, blank=True, null=True)
    clave = models.CharField(max_length=50, blank=True, null=True)
    registro = models.DateTimeField(blank=True, null=True)
    administrador = models.CharField(max_length=2, blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    exclusivo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'


class Vehiculos(models.Model):
    placa = models.CharField(primary_key=True, max_length=10)
    tipo = models.ForeignKey(TiposVehiculo, models.DO_NOTHING, db_column='tipo', blank=True, null=True)
    marca = models.CharField(max_length=20, blank=True, null=True)
    poliza = models.CharField(max_length=20, blank=True, null=True)
    vencimiento_soat = models.DateTimeField(blank=True, null=True)
    compania_soat = models.CharField(max_length=50, blank=True, null=True)
    linea = models.CharField(max_length=20, blank=True, null=True)
    modelo = models.CharField(max_length=4, blank=True, null=True)
    furgon = models.CharField(max_length=20, blank=True, null=True)
    centro_operacion = models.ForeignKey(CentrosOperacion, models.DO_NOTHING, db_column='centro_operacion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vehiculos'


class Vendedores(models.Model):
    codigo = models.CharField(primary_key=True, max_length=3)
    cedula = models.ForeignKey(Terceros, models.DO_NOTHING, db_column='cedula', blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vendedores'


class Zonas(models.Model):
    codigo = models.CharField(primary_key=True, max_length=3)
    nombre = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'zonas'
 
class Datosperson(models.Model):
    nombre=models.CharField(max_length=50,blank=True,null=True)
    apellido=models.CharField(max_length=100,blank=True,null=True)
    tipodocumento=models.CharField(max_length=50,blank=True,null=True)
    documento = models.CharField( max_length=50, blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)


    





