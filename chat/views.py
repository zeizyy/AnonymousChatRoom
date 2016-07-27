from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render_to_response
from chat.models import *
from django.utils import timezone
from chatroom import settings
import math

DOMAIN_ROOT = settings.DOMAIN_ROOT

ROOM_SEPARATION = 0.01

# Create your views here.
def redirect(request):
    return render_to_response('index.html')

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
    found = False
    chatroom = None
    chatrooms = ChatRoom.objects.all()
    for room in chatrooms:
        distance = _get_distance(x_cord, y_cord, room)
        if distance < ROOM_SEPARATION:
            room.users.add(user)
            room.save()
            found = True
            chatroom = room
            break

    if not found:
        chatroom = ChatRoom(x_cord = x_cord, y_cord = y_cord)
        chatroom.save()
        chatroom.users.add(user)

    join_message = Message(user=user, chatroom=chatroom, text='Someone has joined!', type='j')
    join_message.save()

    return render_to_response('chatroom.html',{ 'user':user, 'chatroom' : chatroom})

def _get_distance(x1, y1, chatroom):
    x2 = float(chatroom.x_cord)
    y2 = float(chatroom.y_cord)
    return math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))

def get_message(request):
    if request.method != 'GET':
        return _error_response(request, "TypeError")
    cid = request.GET.get('cid', None)
    chatroom = ChatRoom.objects.get(pk=cid)
    msgs = Message.objects.filter(chatroom=chatroom)
    msgs_dict = [(msg.text, msg.type, msg.id) for msg in msgs][-5:]
    return _success_response(request, msgs_dict)

def like(request):
    mid = request.GET.get('mid')
    msg = Message.objects.get(pk = mid)
    msg.type = 'z'
    msg.save()
    return _success_response(request)

def post_message(request):
    if request.method != 'POST':
        return _error_response(request, "TypeError")
    uid = request.POST['uid']
    user = User.objects.get(pk=uid)
    cid = request.POST['cid']
    chatroom = ChatRoom.objects.get(pk=cid)
    text = request.POST['text']
    current_time = timezone.now()
    msg = Message(user=user, chatroom=chatroom, timestamp=current_time, text=text, type='n')
    msg.save()
    return _success_response(request)

def leave(request):
    if request.method != 'POST':
        return _error_response(request, "TypeError")
    userId = request.POST['uid']
    userToRemove = User.objects.get(pk=userId)
    chatroomId = request.POST['cid']
    masterChatroom = ChatRoom.objects.get(pk=chatroomId)

    if masterChatroom.users.count() == 1:
        if masterChatroom.users.first().id != userId:
            masterChatroom.delete()
            return _error_response(request, "User trying to leave does not exist in chatroom.")

    else:
        text = "A user has left the room."
        current_time = timezone.now()
        msg = Message(user=userToRemove, chatroom=masterChatroom, timestamp=current_time, text=text, type='l')
        msg.save()
        userToRemove.delete()

        return _success_response(request)


def test(request):
    return render_to_response('test.html')

def _error_response(request, error_msg):
    return JsonResponse({'status': False, 'resp': error_msg})

def _success_response(request, resp=None):
    if resp:
        return JsonResponse({'status': True, 'resp': resp})
    else:
        return JsonResponse({'status': True})