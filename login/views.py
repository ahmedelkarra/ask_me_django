from django.http import JsonResponse
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

# Create your views here.

@csrf_exempt
def Login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('pass')
            user = User.objects.get(username=username)
            if user.check_password(password):
                login(request,user)
                return JsonResponse({'message':'Login successfully'})
            else:
                return JsonResponse({'message': 'Wrong username or password'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Wrong username or password'}, status=404)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)