from django.http import JsonResponse
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect,requires_csrf_token

# Create your views here.

@csrf_protect
@requires_csrf_token
def Logout(request):
    logout(request)
    return JsonResponse({'message':'Logout Successfully'})