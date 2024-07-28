from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect,requires_csrf_token
from django.contrib.auth import get_user
from .models import Comment,Comment_like
from quisition.models import Quisition
import json
# Create your views here.

@csrf_protect
@requires_csrf_token
def comment_api(request,id):
    if request.method == 'GET':
        comment = Comment.objects.filter(comment_for_id=id).values('id','body','comment_for_id','author__username','author__first_name','author__last_name')
        comment_list = list(comment)
        return JsonResponse({'message':comment_list})
    elif request.method == 'POST':
        author = get_user(request)
        data = json.loads(request.body)
        body = data.get('body')
        quisition = Quisition.objects.get(id=id)
        comment = Comment.objects.create(author=author,body=body,comment_for=quisition)
        comment.save()
        return JsonResponse({'message':'Comment has been created'})
    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)



def comment_api_options(request,id,comment_id):
    if request.method == 'PUT':
        author = get_user(request)
        data = json.loads(request.body)
        body = data.get('body')
        quisition = Quisition.objects.get(id=id)
        comment = Comment.objects.filter(author=author,comment_for=quisition,id=comment_id)
        comment.update(body = body)
        return JsonResponse({'message':'Comment has been updated'})
    elif request.method == 'DELETE':
            author = get_user(request)
            quisition = Quisition.objects.get(id=id)
            comment = Comment.objects.filter(author=author,comment_for_id=quisition.id,id=comment_id)
            comment.delete()
            return JsonResponse({'message':'Comment has been deleted'})
    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)


@csrf_protect
@requires_csrf_token
def comment_like_api(request,id):
    if request.method == 'GET':
        comment_like = Comment_like.objects.filter(like_for_id=id).values('id','like_for_id','status','author__id','author__username','author__first_name','author__last_name')
        comment_like_list = list(comment_like)
        return JsonResponse({'message':comment_like_list})
    elif request.method == 'POST':
        data = json.loads(request.body)
        status_info = data.get('status')
        author = request.user
        check_like = Comment_like.objects.filter(like_for_id=id, author=author).first()

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
            comment_like = Comment_like(author=author, like_for_id=id, status=status_info)
            comment_like.save()
            status_info = status_info.capitalize()
            return JsonResponse({'message': f'{status_info} has been added'})
    
    else:
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)