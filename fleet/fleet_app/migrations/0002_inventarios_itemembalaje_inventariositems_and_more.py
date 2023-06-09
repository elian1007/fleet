# Generated by Django 4.1 on 2022-10-24 21:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fleet_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inventarios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_corte', models.DateField()),
                ('hora_inicial', models.TimeField()),
                ('hora_final', models.TimeField()),
                ('nombre_persona', models.CharField(max_length=200)),
                ('cargo_persona', models.CharField(max_length=100)),
                ('observaciones', models.CharField(blank=True, max_length=200, null=True)),
                ('centro_operacion', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='fleet_app.centrosoperacion')),
            ],
            options={
                'verbose_name_plural': 'Inventarios',
            },
        ),
        migrations.CreateModel(
            name='ItemEmbalaje',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=200)),
                ('descripcion', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='InventariosItems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stock', models.IntegerField()),
                ('toma_fisica', models.IntegerField()),
                ('inventario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fleet_app.inventarios')),
                ('item_embalaje', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fleet_app.itemembalaje')),
            ],
            options={
                'verbose_name_plural': 'Inventarios_Items_Embalaje',
            },
        ),
        migrations.AddField(
            model_name='inventarios',
            name='items_embalaje',
            field=models.ManyToManyField(through='fleet_app.InventariosItems', to='fleet_app.itemembalaje'),
        ),
        migrations.AddField(
            model_name='inventarios',
            name='usuario_responsable',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]
