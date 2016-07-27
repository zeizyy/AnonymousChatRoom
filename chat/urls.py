from django.conf.urls import patterns, url

from chat import views

urlpatterns = patterns('',
    url(r'^$', views.redirect ,name='Redirect'),
    url(r'create$', views.start_chat_room ,name='StartChatRoom'),
    url(r'get/$', views.get_message ,name='GetMessage'),
    url(r'post/$', views.post_message ,name='PostMessage'),
    url(r'test/$', views.test, name='Test'),
    url(r'leave/$', views.leave, name='Leave'),
)