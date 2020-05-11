from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/',views.register),
    path('login/',views.login),
    path('member_index/',views.member_index),
    path('logout/',views.logout),
    path('change/',views.change),
    path('face/',views.face),
    path('recognition/',views.recognition),
    # path('')
]