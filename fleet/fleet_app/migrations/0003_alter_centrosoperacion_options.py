# Generated by Django 4.1 on 2022-10-24 21:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fleet_app', '0002_inventarios_itemembalaje_inventariositems_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='centrosoperacion',
            options={'managed': True, 'verbose_name_plural': 'Centros de operación'},
        ),
    ]