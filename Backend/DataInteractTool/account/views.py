from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.models import Session
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        # Check if passwords match
        if password != confirm_password:
            return JsonResponse({'message': 'Passwords do not match'}, status=400)

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'message': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email already registered'}, status=400)

        # Create the user
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

    return JsonResponse({'message': 'Invalid request method'}, status=405)



@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            request.session['isAuthenticated'] = True
            request.session['username'] = username

            # Create the response object

            # Optionally set the session cookie explicitly
            session_id = request.session.session_key
            print(session_id)

            response = JsonResponse({'message': 'User logged in successfully','session_id':session_id}, status=200)
            return response
        else:
            return JsonResponse({'message': 'Invalid username or password'}, status=401)


@csrf_exempt
def check_session(request):
    session_id = request.GET.get('session_id')
    
    if not session_id:
        return JsonResponse({'isAuthenticated': False, 'username': ''})
    
    # Fetch session data based on the session key
    try:
        session = Session.objects.get(session_key=session_id)
        session_data = session.get_decoded()  # Decodes the session data
        is_authenticated = session_data.get('isAuthenticated', False)
        username = session_data.get('username', '')

        return JsonResponse({
            'isAuthenticated': is_authenticated,
            'username': username
        })
    except Session.DoesNotExist:
        return JsonResponse({'isAuthenticated': False, 'username': ''})

@csrf_exempt
def user_logout(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    try:
        session = Session.objects.get(session_key=session_id)
        session.delete()
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    except Session.DoesNotExist:
        return JsonResponse({'message': 'Session does not exist'}, status=404)
