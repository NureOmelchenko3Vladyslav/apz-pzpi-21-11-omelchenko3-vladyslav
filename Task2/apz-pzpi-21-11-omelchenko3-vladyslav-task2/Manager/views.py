from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile, Gym, GymCoach, Zone, SensorData, Training, Reservation
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.db import IntegrityError
import json

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

def user_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def user_register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        role = data.get('role')

        try:
            user = User.objects.create_user(username=username, password=password, email=email)

            if role == 'owner':
                UserProfile.objects.create(user=user, is_owner=True)
            elif role == 'coach':
                UserProfile.objects.create(user=user, is_coach=True)
            elif role == 'client':
                UserProfile.objects.create(user=user, is_client=True)
            else:
                return JsonResponse({'error': 'Invalid role specified'}, status=400)

            return JsonResponse({'success': True})
        except IntegrityError:
            return JsonResponse({'error': 'Email is already in use'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def user_exit(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def homepage(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User is not authenticated'}, status=403)
    
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        response_data = {
            'sign': request.user.is_authenticated, 
            'profile': {
                'id': request.user.id,
                'username': user_profile.user.username,
                'email': user_profile.user.email,
                'is_owner': user_profile.is_owner,
                'is_coach': user_profile.is_coach,
                'is_client': user_profile.is_client,
            },
        }
        
        if user_profile.is_owner:
            gyms = Gym.objects.filter(owner=request.user)
            gyms_data = [{
                'id': gym.id,
                'name': gym.name,
                'address': gym.address,
                'description': gym.description,
            } for gym in gyms]
            response_data['gyms'] = gyms_data
        
        elif user_profile.is_coach:
            coach_gyms = GymCoach.objects.filter(coach=request.user)
            gyms_data = [{
                'id': cg.gym.id,
                'name': cg.gym.name,
                'address': cg.gym.address,
                'description': cg.gym.description,
            } for cg in coach_gyms]
            trainings = Training.objects.filter(coach=request.user)
            trainings_data = [{
                'id': training.id,
                'name': training.name,
                'description': training.description,
                'date': training.date,
                'time_start': training.time_start,
                'time_end': training.time_end,
                'total_places': training.total_places,
            } for training in trainings]
            response_data['gyms'] = gyms_data
            response_data['trainings'] = trainings_data
        
        elif user_profile.is_client:
            reservations = Reservation.objects.filter(client=request.user)
            trainings_data = [{
                'id': reservation.training.id,
                'name': reservation.training.name,
                'description': reservation.training.description,
                'date': reservation.training.date,
                'time_start': reservation.training.time_start,
                'time_end': reservation.training.time_end,
                'total_places': reservation.training.total_places,
            } for reservation in reservations]
            response_data['trainings'] = trainings_data
        
        return JsonResponse(response_data)

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'UserProfile not found'}, status=404)

def create_gym(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        name = data.get('name')
        address = data.get('address')
        description = data.get('description')
        
        gym = Gym(name=name, address=address, description=description, owner=request.user)
        gym.save()
        
        return JsonResponse({'success': True, 'gym_id': gym.id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def edit_gym(request, gym):
    if request.method == "PUT":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        gym = get_object_or_404(Gym, id=gym)
        
        gym.name = data.get('name')
        gym.address = data.get('address')
        gym.description = data.get('description')
            
        gym.save()
        
        return JsonResponse({'success': True})

    elif request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        gym = get_object_or_404(Gym, id=gym)
        gym_data = {
            'name': gym.name,
            'address': gym.address,
            'description': gym.description,
        }
        return JsonResponse(gym_data)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def delete_gym(request, gym):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        gym = get_object_or_404(Gym, id=gym)
        
        gym.delete()
        
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def gyms(request):
    if request.method == "GET":
        gyms = Gym.objects.all()
        gyms_list = []

        for gym in gyms:
            gym_dict = {
                'id': gym.id,
                'name': gym.name,
                'address': gym.address,
                'description': gym.description,
            }
            gyms_list.append(gym_dict)

        return JsonResponse({'gyms': gyms_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def owner_gyms(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        user = request.user
        gyms = Gym.objects.filter(owner=user)
        gyms_list = []

        for gym in gyms:
            gym_dict = {
                'id': gym.id,
                'name': gym.name,
                'address': gym.address,
            }
            if gym.description:
                gym_dict['description'] = gym.description
            gyms_list.append(gym_dict)

        return JsonResponse({'gyms': gyms_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def create_zone(request, gym):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        name = data.get('name')
        description = data.get('description')
        sensor = data.get('sensor')
        if sensor == '':
            sensor = None
        
        gym = get_object_or_404(Gym, id=gym)
        
        zone = Zone(name=name, description=description, gym=gym, sensor=sensor)
        zone.save()
        
        return JsonResponse({'success': True, 'zone_id': zone.id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def edit_zone(request, zone):
    if request.method == "PUT":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        zone = get_object_or_404(Zone, id=zone)
        
        zone.name = data.get('name')
        zone.description = data.get('description')

        sensor_value = data.get('sensor')
        if sensor_value == '':
            sensor_value = None
        zone.sensor = sensor_value
        
        zone.save()
        
        return JsonResponse({'success': True})

    elif request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        zone = get_object_or_404(Zone, id=zone)
        zone_data = {
            'name': zone.name,
            'description': zone.description,
            'sensor': zone.sensor,
            'gym': zone.gym.id
        }
        return JsonResponse(zone_data)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def delete_zone(request, zone):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        zone = get_object_or_404(Zone, id=zone)
        
        zone.delete()
        
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def gym_zones(request, gym):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        gym = get_object_or_404(Gym, id=gym)
        zones = Zone.objects.filter(gym=gym)
        zones_list = []
        
        for zone in zones:
            zone_dict = {
                'id': zone.id,
                'name': zone.name,
            }
            if zone.description:
                zone_dict['description'] = zone.description
            if zone.sensor:
                zone_dict['sensor'] = zone.sensor
            zones_list.append(zone_dict)
        
        return JsonResponse({'zones': zones_list, 'gym_name': gym.name})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def create_training(request, zone=None):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        name = data.get('name')
        description = data.get('description')
        coach = request.user
        date = data.get('date')
        time_start = data.get('time_start')
        time_end = data.get('time_end')
        try:
            total_places = int(data.get('total_places', 0))
        except ValueError:
            return JsonResponse({'error': 'Invalid number of places'}, status=400)

        if total_places <= 0:
            return JsonResponse({'error': 'The number of places cannot be less than one'}, status=400)

        if zone:
            zone = get_object_or_404(Zone, id=zone)
        else:
            zone_id = data.get('zone')
            zone = get_object_or_404(Zone, id=zone_id) if zone_id else None
        
        if not zone:
            return JsonResponse({'error': 'Zone is required'}, status=400)

        training = Training(name=name, description=description, zone=zone, coach=coach,
                            date=date, time_start=time_start, time_end=time_end, total_places=total_places)
        training.save()
        
        return JsonResponse({'success': True, 'training_id': training.id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def edit_training(request, training):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        training = get_object_or_404(Training, id=training)
        
        training_data = {
            'name': training.name,
            'description': training.description,
            'date': training.date,
            'time_start': training.time_start,
            'time_end': training.time_end,
            'total_places': training.total_places,
            'zone': training.zone.id,
            'gym_name': training.zone.gym.name,
            'gym_id': training.zone.gym.id,
            'current_reservations': training.reservation_set.count()
        }

        return JsonResponse(training_data)

    elif request.method == "PUT":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        training = get_object_or_404(Training, id=training)
        data = json.loads(request.body)

        total_places = int(data.get('total_places', 1))

        if total_places < 1:
            return JsonResponse({'error': 'The number of places cannot be less than one'}, status=400)

        current_reservations = Reservation.objects.filter(training=training).count()

        if total_places < current_reservations:
            excess_count = current_reservations - total_places

            excess_reservations = Reservation.objects.filter(training=training).order_by('-id')[:excess_count]

            for reservation in excess_reservations:
                reservation.delete()

        training.name = data.get('name', training.name)
        training.description = data.get('description', training.description)
        training.date = data.get('date', training.date)
        training.time_start = data.get('time_start', training.time_start)
        training.time_end = data.get('time_end', training.time_end)
        training.total_places = total_places
        training.zone_id = data.get('zone', training.zone_id)

        training.save()

        return JsonResponse({'success': True})
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def delete_training(request, training):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        training = get_object_or_404(Training, id=training)
        
        training.delete()
        
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def create_gym_coach(request, gym):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        gym = get_object_or_404(Gym, id=gym)
        
        try:
            coach = User.objects.get(email=data.get('email'))
            if not coach.userprofile.is_coach:
                raise User.DoesNotExist
        except User.DoesNotExist:
            return JsonResponse({'error': 'Coach with this email not found'}, status=404)

        if GymCoach.objects.filter(gym=gym, coach=coach).exists():
            return JsonResponse({'error': 'This coach is already assigned to this gym'}, status=400)

        gym_coach = GymCoach(gym=gym, coach=coach)
        gym_coach.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def delete_gym_coach(request, gym_id, coach_id):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        gym_coach = get_object_or_404(GymCoach, gym_id=gym_id, coach_id=coach_id)
        
        trainings = Training.objects.filter(zone__gym_id=gym_id, coach_id=coach_id)
        for training in trainings:
            training.delete()

        gym_coach.delete()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def create_reservation(request, training):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        training = get_object_or_404(Training, id=training)

        remaining_places = training.total_places - Reservation.objects.filter(training=training).count()
        if remaining_places <= 0:
            return JsonResponse({'error': 'No remaining places for this training'}, status=400)

        if Reservation.objects.filter(training=training, client=request.user).exists():
            return JsonResponse({'error': 'You are already registered for this training'}, status=400)

        reservation = Reservation(training=training, client=request.user)
        reservation.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def delete_reservation(request, reservation):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        reservation = get_object_or_404(Reservation, id=reservation)
        
        reservation.delete()
        
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def gym_coaches(request, gym):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        gym = get_object_or_404(Gym, id=gym)
        coaches = GymCoach.objects.filter(gym=gym)
        coaches_list = []
        
        for coach in coaches:
            coach_dict = {
                'id': coach.id,
                'user_id': coach.coach.id,
                'username': coach.coach.username,
                'email': coach.coach.email,
            }
            coaches_list.append(coach_dict)
        
        return JsonResponse({'coaches': coaches_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def coach_gyms(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        coach = request.user
        gyms = GymCoach.objects.filter(coach=coach)
        gyms_list = []

        for gym_coach in gyms:
            gym_dict = {
                'id': gym_coach.gym.id,
                'name': gym_coach.gym.name,
                'address': gym_coach.gym.address,
                'coach_id': coach.id,
            }
            if gym_coach.gym.description:
                gym_dict['description'] = gym_coach.gym.description
            gyms_list.append(gym_dict)

        return JsonResponse({'gyms': gyms_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def zone_trainings(request, zone):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        zone = get_object_or_404(Zone, id=zone)
        trainings = Training.objects.filter(zone=zone)
        trainings_list = []
        
        for training in trainings:
            is_reserved = Reservation.objects.filter(training=training, client=request.user).exists()
            training_dict = {
                'id': training.id,
                'name': training.name,
                'description': training.description,
                'coach_name': training.coach.username,
                'date': training.date,
                'time_start': training.time_start,
                'time_end': training.time_end,
                'total_places': training.total_places,
                'remaining_places': training.total_places - training.reservation_set.count(),
                'is_reserved': is_reserved
            }
            trainings_list.append(training_dict)
        
        return JsonResponse({'trainings': trainings_list, 'zone_name': zone.name})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def gym_trainings(request, gym):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        gym = get_object_or_404(Gym, id=gym)
        zones = Zone.objects.filter(gym=gym)
        trainings = Training.objects.filter(zone__in=zones)
        trainings_list = []
        
        for training in trainings:
            is_reserved = Reservation.objects.filter(training=training, client=request.user).exists()
            training_dict = {
                'id': training.id,
                'name': training.name,
                'zone_name': training.zone.name,
                'description': training.description,
                'coach_name': training.coach.username,
                'date': training.date,
                'time_start': training.time_start,
                'time_end': training.time_end,
                'total_places': training.total_places,
                'remaining_places': training.total_places - training.reservation_set.count(),
                'is_reserved': is_reserved
            }
            trainings_list.append(training_dict)
        
        return JsonResponse({'trainings': trainings_list, 'gym_name': gym.name})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def training_reservations(request, training):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        training = get_object_or_404(Training, id=training)
        reservations = Reservation.objects.filter(training=training)
        reservations_list = []
        
        for reservation in reservations:
            reservation_dict = {
                'id': reservation.id,
                'client_id': reservation.client.id,
                'client_name': reservation.client.username,
            }
            reservations_list.append(reservation_dict)
        
        return JsonResponse({'reservations': reservations_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def client_reservations(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        client = request.user
        reservations = Reservation.objects.filter(client=client)
        trainings_list = []
        
        for reservation in reservations:
            training = reservation.training
            training_dict = {
                'id': training.id,
                'name': training.name,
                'description': training.description,
                'date': training.date,
                'time_start': training.time_start,
                'time_end': training.time_end,
                'total_places': training.total_places,
                'remaining_places': training.total_places - training.reservation_set.count(),
                'reservation_id': reservation.id
            }
            trainings_list.append(training_dict)
        
        return JsonResponse({'trainings': trainings_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def coach_trainings(request, gym_id=None, zone_id=None):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        if zone_id:
            trainings = Training.objects.filter(zone_id=zone_id, coach=request.user)
        elif gym_id:
            trainings = Training.objects.filter(zone__gym_id=gym_id, coach=request.user)
        else:
            trainings = Training.objects.filter(coach=request.user)

        trainings_data = [{
            'id': training.id,
            'name': training.name,
            'description': training.description,
            'date': training.date,
            'time_start': training.time_start,
            'time_end': training.time_end,
            'total_places': training.total_places,
        } for training in trainings]

        return JsonResponse({'trainings': trainings_data})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def add_sensor(request, zone):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        data = json.loads(request.body)
        
        zone = get_object_or_404(Zone, id=zone)

        zone.sensor = data.get('sensor')
        zone.save()

        return JsonResponse({'success': True, 'sensor': zone.sensor, 'zone_id': zone.id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def delete_sensor(request, zone):
    if request.method == "DELETE":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)
        
        zone = get_object_or_404(Zone, id=zone)

        zone.sensor = None
        zone.save()
        
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_sensor_data(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        sensor_id = data.get('sensor')
        if sensor_id is None:
            return JsonResponse({'error': 'Sensor ID not provided'}, status=400)

        temperature = data.get('temperature')
        humidity = data.get('humidity')
        noise = data.get('noise')

        if temperature is None or humidity is None or noise is None:
            return JsonResponse({'error': 'Missing sensor data'}, status=400)

        sensor, created = SensorData.objects.update_or_create(
            sensor=sensor_id,
            defaults={'temperature': temperature, 'humidity': humidity, 'noise': noise}
        )

        return JsonResponse({"status": "success"}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def display_sensor_data(request, zone):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        zone = get_object_or_404(Zone, id=zone)
        sensor_data = SensorData.objects.filter(sensor=zone.sensor).first()

        if sensor_data:
            return JsonResponse({
                'success': True,
                'sensor': sensor_data.sensor,
                'temperature': sensor_data.temperature,
                'humidity': sensor_data.humidity,
                'noise': sensor_data.noise
            })
        else:
            return JsonResponse({'error': 'Sensor data not found for the specified zone'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
