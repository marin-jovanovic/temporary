# Generated by Django 4.0.5 on 2022-10-25 22:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0021_delete_gamestate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='playerorder',
            old_name='index',
            new_name='join_index',
        ),
        migrations.AddField(
            model_name='playerorder',
            name='turn_index',
            field=models.IntegerField(null=True),
        ),
    ]
