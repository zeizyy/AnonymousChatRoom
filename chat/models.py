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

class ChatRoom(models.Model):
    x_cord = models.FloatField()
    y_cord = models.FloatField()
    users = models.ManyToManyField(User)

class Message(models.Model):
    user = models.ForeignKey(User)
    timestamp = models.DateTimeField(default=timezone.now)
    msg = models.CharField(max_length=200)
    type = models.CharField(max_length=1, choices=MESSAGETYPE)