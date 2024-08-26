from django.contrib import admin
from .models import UserProfile, Gym, GymCoach, Zone, SensorData, Training, Reservation

admin.site.register(UserProfile)
admin.site.register(Gym)
admin.site.register(GymCoach)
admin.site.register(Zone)
admin.site.register(SensorData)
admin.site.register(Training)
admin.site.register(Reservation)