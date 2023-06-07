from django.contrib import admin

from fleet_app.models import CentrosOperacion, Inventarios, InventariosItems, Ciudades

# Register your models here.
admin.site.register(CentrosOperacion)
admin.site.register(Inventarios)
admin.site.register(InventariosItems)
admin.site.register(Ciudades)
