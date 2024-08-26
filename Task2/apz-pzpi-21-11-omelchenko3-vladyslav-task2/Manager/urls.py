from django.urls import include, path
from . import views

urlpatterns = [
    path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),

    path('login/', views.user_login, name='login'),
    path('register/', views.user_register, name='register'),
    path('exit/', views.user_exit, name='exit'),

    path('homepage/', views.homepage, name='homepage'),

    path('create_gym/', views.create_gym, name='create_gym'),
    path('edit_gym/<int:gym>/', views.edit_gym, name='edit_gym'),
    path('delete_gym/<int:gym>/', views.delete_gym, name='delete_gym'),

    path('create_zone/<int:gym>/', views.create_zone, name='create_zone'),
    path('edit_zone/<int:zone>/', views.edit_zone, name='edit_zone'),
    path('delete_zone/<int:zone>/', views.delete_zone, name='delete_zone'),

    path('create_training/<int:zone>/', views.create_training, name='create_training'),
    path('create_training/', views.create_training, name='create_training_no_zone'),

    path('edit_training/<int:training>/', views.edit_training, name='edit_training'),
    path('delete_training/<int:training>/', views.delete_training, name='delete_training'),

    path('create_gym_coach/<int:gym>/', views.create_gym_coach, name='create_gym_coach'),
    path('delete_gym_coach/<int:gym_id>/<int:coach_id>/', views.delete_gym_coach, name='delete_gym_coach'),

    path('create_reservation/<int:training>/', views.create_reservation, name='create_reservation'),
    path('delete_reservation/<int:reservation>/', views.delete_reservation, name='delete_reservation'),

    path('gyms/', views.gyms, name='gyms'),
    path('owner_gyms/', views.owner_gyms, name='owner_gyms'),
    path('gym_zones/<int:gym>/', views.gym_zones, name='gym_zones'),
    path('gym_coaches/<int:gym>/', views.gym_coaches, name='gym_coaches'),
    path('coach_gyms/', views.coach_gyms, name='coach_gyms'),
    path('zone_trainings/<int:zone>/', views.zone_trainings, name='zone_trainings'),
    path('gym_trainings/<int:gym>/', views.gym_trainings, name='gym_trainings'),
    
    path('training_reservations/<int:training>/', views.training_reservations, name='training_reservations'),
    path('client_reservations/', views.client_reservations, name='client_reservations'),
    path('coach_trainings/', views.coach_trainings, name='coach_trainings'),

    path('add_sensor/<int:zone>/', views.add_sensor, name='add_sensor'),
    path('delete_sensor/<int:zone>/', views.delete_sensor, name='delete_sensor'),
    path('get_sensor_data/', views.get_sensor_data, name='get_sensor_data'),
    path('display_sensor_data/<int:zone>/', views.display_sensor_data, name='display_ensor_data'),
]