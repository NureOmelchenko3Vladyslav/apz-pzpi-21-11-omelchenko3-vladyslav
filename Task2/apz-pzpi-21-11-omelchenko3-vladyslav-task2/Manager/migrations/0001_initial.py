# Generated by Django 5.0.7 on 2024-07-31 17:24

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Gym',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=25)),
                ('address', models.TextField(max_length=50)),
                ('description', models.TextField(blank=True, max_length=250, null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GymCoach',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coach', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('gym', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Manager.gym')),
            ],
        ),
        migrations.CreateModel(
            name='Training',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=25)),
                ('description', models.TextField(blank=True, max_length=250, null=True)),
                ('date', models.DateField(default=datetime.datetime.now)),
                ('time_start', models.TimeField(default=datetime.datetime.now)),
                ('time_end', models.TimeField(default=datetime.datetime.now)),
                ('total_places', models.IntegerField()),
                ('coach', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('training', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Manager.training')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_owner', models.BooleanField(default=False)),
                ('is_coach', models.BooleanField(default=False)),
                ('is_client', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Zone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=25)),
                ('description', models.TextField(blank=True, max_length=250, null=True)),
                ('sensor', models.IntegerField(default=None, null=True)),
                ('gym', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Manager.gym')),
            ],
        ),
        migrations.AddField(
            model_name='training',
            name='zone',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Manager.zone'),
        ),
    ]
