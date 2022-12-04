# Generated by Django 4.0.5 on 2022-12-02 23:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_users_profile_picture'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(null=True)),
                ('date', models.TextField()),
                ('time', models.TextField()),
                ('geo_lan', models.TextField()),
                ('geo_lon', models.TextField()),
                ('capacity', models.IntegerField(null=True)),
                ('description', models.TextField(null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.users')),
            ],
        ),
    ]
