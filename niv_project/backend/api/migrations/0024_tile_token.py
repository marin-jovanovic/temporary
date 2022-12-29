# Generated by Django 4.0.5 on 2022-10-28 08:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0023_gamelog_performed'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('game', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.game')),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.IntegerField()),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.users')),
                ('where', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.tile')),
            ],
        ),
    ]