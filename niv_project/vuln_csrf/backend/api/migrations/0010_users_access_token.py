# Generated by Django 4.0.5 on 2022-10-16 08:05

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0009_alter_users_password_hash_alter_users_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='access_token',
            field=models.TextField(default='f'),
            preserve_default=False,
        ),
    ]