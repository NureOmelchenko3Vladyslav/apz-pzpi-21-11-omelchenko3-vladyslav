from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, date, time

User._meta.get_field('email')._unique = True

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_coach = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)

class Gym(models.Model):
    name = models.TextField(max_length=25)
    address = models.TextField(max_length=50)
    description = models.TextField(blank=True, null=True, max_length=250)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class GymCoach(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE)
    coach = models.ForeignKey(User, on_delete=models.CASCADE)

class Zone(models.Model):
    name = models.TextField(max_length=25)
    description = models.TextField(blank=True, null=True, max_length=250)
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE)
    sensor = models.IntegerField(default=None, null=True)

    def __str__(self):
        return self.name

class SensorData(models.Model):
    sensor = models.IntegerField(default=None, null=True)
    temperature = models.IntegerField(default=None, null=True)
    humidity = models.IntegerField(default=None, null=True)
    noise = models.IntegerField(default=None, null=True)

class Training(models.Model):
    name = models.TextField(max_length=25)
    description = models.TextField(blank=True, null=True, max_length=250)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    coach = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=datetime.now)
    time_start = models.TimeField(default=datetime.now)
    time_end = models.TimeField(default=datetime.now)
    total_places = models.IntegerField()

    def __str__(self):
        return self.name

class Reservation(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    training = models.ForeignKey(Training, on_delete=models.CASCADE)