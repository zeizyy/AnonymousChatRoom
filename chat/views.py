from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render_to_response
from chat.models import *
from django.utils import timezone
import math

ROOM_SEPARATION = 10

# Create your views here.
def redirect(request):
    return render_to_response('chatroom_redirect.html')

def index(request):
    return HttpResponse("Index Page")


def start_chat_room(request):
    if request.method != 'GET':
        return HttpResponse('error')
    x_cord = float(request.GET.get('x', ''))
    y_cord = float(request.GET.get('x', ''))
    # create user
    user = User(x_cord = x_cord, y_cord = y_cord)
    user.save()

    # create chatroom
    chatrooms = ChatRoom.objects.all()
    for room in chatrooms:
        distance = _get_distance(x_cord, y_cord, room)
        if distance < ROOM_SEPARATION:
            room.users.add(user)
            room.save()
            return render_to_response('chatroom.html',{ 'user':user, 'chatroom' : room})

    chatroom = ChatRoom(x_cord = x_cord, y_cord = y_cord)
    chatroom.save()
    chatroom.users.add(user)

    return render_to_response('chatroom.html',{ 'user':user, 'chatroom' : chatroom})

def _get_distance(x1, y1, chatroom):
    x2 = float(chatroom.x_cord)
    y2 = float(chatroom.y_cord)
    return math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))

def get_message(request):
    return _success_response(request, [('This is an exmaple message', 'n'), ('Someone has left', 'l')])

def post_message(request):
    if request.method != 'POST':
        return _error_response(request, "TypeError")
    uid = request.POST['uid']
    user = User.objects.get(pk=uid)
    cid = request.POST['cid']
    chatroom = ChatRoom.objects.get(pk=cid)
    text = request.POST['text']
    current_time = timezone.now()
    msg = Message(user=user, chatroom=chatroom, timestamp=current_time, text=msg, type='n')
    msg.save()
    return _success_response()

def _error_response(request, error_msg):
    return JsonResponse({'status': False, 'error': error_msg})

def _success_response(request, resp=None):
    if resp:
        return JsonResponse({'status': True, 'resp': resp})
    else:
        return JsonResponse({'status': True})