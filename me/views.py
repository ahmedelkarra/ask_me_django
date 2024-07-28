from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect,requires_csrf_token
from django.contrib.auth import get_user,login
from django.contrib.auth.models import User
import json

# Create your views here.

@csrf_protect
@requires_csrf_token
def Me(request):
    user = get_user(request)
    if user.is_authenticated:
        return JsonResponse({'message':{'id':user.id,'fName':user.first_name,'lName':user.last_name,'email':user.email,'username':user.username}},status=200)
    else:
        return JsonResponse({'message':'You have to be user'},status=401)
    

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, requires_csrf_token
from django.contrib.auth.models import User
import json

@csrf_protect
@requires_csrf_token
def edit_user(request, id):
    if request.method not in ['DELETE', 'PUT']:
        return JsonResponse({'message': 'Method not allowed'}, status=405)

    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=404)

    data = json.loads(request.body)
    password = data.get('pass')

    if not user.check_password(password):
        return JsonResponse({'message': 'Wrong password'}, status=400)

    if request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'User has been deleted'}, status=200)

    # If the request method is PUT
    email = data.get('email')
    username = data.get('username')
    first_name = data.get('fName')
    last_name = data.get('lName')
    newPass = data.get('newPass')
    confirmNewPass = data.get('confirmNewPass')

    # Check if the new email or username already exists
    if email and User.objects.filter(email=email).exclude(id=id).exists():
        return JsonResponse({'message': 'Email is already in use'}, status=400)
    if username and User.objects.filter(username=username).exclude(id=id).exists():
        return JsonResponse({'message': 'Username is already in use'}, status=400)

    if newPass and newPass != confirmNewPass:
        return JsonResponse({'message': 'Your new password does not match'}, status=400)

    user.email = email if email else user.email
    user.username = username if username else user.username
    user.first_name = first_name if first_name else user.first_name
    user.last_name = last_name if last_name else user.last_name

    if newPass:
        user.set_password(newPass)

    user.save()
    login(request,user)
    return JsonResponse({'message': 'User has been updated'}, status=200)
