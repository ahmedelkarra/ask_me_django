from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
import json



@csrf_exempt
def Register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

        first_name = data.get('fName')
        last_name = data.get('lName')
        email = data.get('email')
        username = data.get('username')
        password = data.get('pass')
        confirm_password = data.get('confirmPass')

        if not all([first_name, last_name, email, username, password, confirm_password]):
            return JsonResponse({'message': 'Please check your inputs'}, status=400)

        if password != confirm_password:
            return JsonResponse({'message': 'Your password does not match'}, status=400)

        emailData = User.objects.filter(email=email)
        usernameData = User.objects.filter(username=username)

        if emailData.exists():
            return JsonResponse({'message': 'Email is already used'}, status=401)
        if usernameData.exists():
            return JsonResponse({'message': 'Username is already used'}, status=401)

        try:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                username=username,
                email=email,
                password=password
            )
            user.save()
            login(request, user)
            return JsonResponse({'message': 'User has been created'}, status=200)
        except Exception as e:
            return JsonResponse({'message': f'Something went wrong: {str(e)}'}, status=400)
    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)