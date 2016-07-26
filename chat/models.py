from django.db import models
from django.utils import timezone
import datetime
# Create your models here.

MESSAGETYPE = (
    ('j', 'Join'),
    ('l', 'Leave'),
    ('n', 'Normal'),
)

class User(models.Model):
    x_cord = models.FloatField()
    y_cord = models.FloatField()

    def __str__(self):
        return "User(" + str(self.x_cord) + ", " + str(self.y_cord) + ")"

class ChatRoom(models.Model):
    x_cord = models.FloatField()
    y_cord = models.FloatField()
    users = models.ManyToManyField(User)

    def __str__(self):
        return "ChatRoom(" + str(self.x_cord) + ", " + str(self.y_cord) + ")"

class Message(models.Model):
    user = models.ForeignKey(User)
    chatroom = models.ForeignKey(ChatRoom)
    timestamp = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=200)
    type = models.CharField(max_length=1, choices=MESSAGETYPE)

    def __str__(self):
        return self.user + ": " + self.msg