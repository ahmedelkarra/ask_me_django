from django.http import JsonResponse
from .models import Quisition,Quisition_like
from django.contrib.auth import get_user
from django.views.decorators.csrf import csrf_protect,requires_csrf_token
import json

# Create your views here.

@csrf_protect
@requires_csrf_token
def quisition_all_info(request):
    try:
        quisitions = Quisition.objects.all().values('title', 'body','id','author__username','author__first_name','author__last_name', 'created_at')
        
        if quisitions.exists():
            quisition_list = list(quisitions)
            return JsonResponse({'message': quisition_list}, status=200)
        else:
            return JsonResponse({'message': 'Quisition not found'}, status=404)
    except Quisition.DoesNotExist:
        return JsonResponse({'message': 'Quisition not found'}, status=404)



@csrf_protect
@requires_csrf_token
def quisition_api(request):
    if request.method == 'POST':
        author = get_user(request)
        try:
            data = json.loads(request.body)
            title = data.get('title')
            body = data.get('body')

            if not title or not body:
                return JsonResponse({'message': 'Title and body are required'}, status=400)

            Quisition.objects.create(title=title, body=body, author=author)
            return JsonResponse({'message': 'Your quisition has been added'}, status=201)

        except Exception as e:
            return JsonResponse({'message': 'Error occurred: ' + str(e)}, status=400)

    elif request.method == 'GET':
        author = get_user(request)
        quisitions = Quisition.objects.filter(author=author).values('title', 'body', 'author__username', 'created_at')

        if quisitions.exists():
            quisition_list = list(quisitions)
            return JsonResponse({'message': quisition_list}, status=200)
        else:
            return JsonResponse({'message': 'No quisitions found for this author'}, status=404)

    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    



@csrf_protect
@requires_csrf_token
def quisition_api_like(request, id):
    if request.method == 'GET':
        quisition_like = Quisition_like.objects.filter(like_for_id=id).values(
            'id', 'like_for', 'status','like_for__title', 'author__id','author__username', 'author__first_name', 'author__last_name')
        quisition_like_list = list(quisition_like)
        return JsonResponse({'message': quisition_like_list})
    elif request.method == 'POST':
        data = json.loads(request.body)
        status_info = data.get('status')
        author = request.user
        check_like = Quisition_like.objects.filter(like_for_id=id, author=author).first()

        if check_like:
            if check_like.status == 'like' and status_info == 'like':
                check_like.delete()
                return JsonResponse({'message': 'Like has been removed'})
            elif check_like.status == 'like' and status_info == 'dislike':
                check_like.status = 'dislike'
                check_like.save()
                return JsonResponse({'message': 'Dislike has been added'})
            elif check_like.status == 'dislike' and status_info == 'dislike':
                check_like.delete()
                return JsonResponse({'message': 'Like has been removed'})
            elif check_like.status == 'dislike' and status_info == 'like':
                check_like.status = 'like'
                check_like.save()
                return JsonResponse({'message': 'Like has been added'})
        else:
            quisition_like = Quisition_like(author=author, like_for_id=id, status=status_info)
            quisition_like.save()
            status_info = status_info.capitalize()
            return JsonResponse({'message': f'{status_info} has been added'})
    
    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)