from django.conf.urls import patterns, url

from chat import views

urlpatterns = patterns('',
    url(r'^$', views.index ,name='Index'),
    url(r'create$', views.start_chat_room ,name='StartChatRoom'),
)