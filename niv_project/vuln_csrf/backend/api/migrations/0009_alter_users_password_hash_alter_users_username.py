# Generated by Django 4.0.5 on 2022-10-15 21:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0008_users_remove_consumptionentry_location_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='password_hash',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='users',
            name='username',
            field=models.TextField(),
        ),
    ]
