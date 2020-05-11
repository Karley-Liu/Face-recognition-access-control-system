from django.urls import path
from . import views

app_name = 'manage'

urlpatterns = [
    path('users_list',views.users_list),
    path('history',views.history),
    path('statistic',views.statistic),
    path('register/',views.admin_register),
    path('login/',views.admin_login),
    path('logout/',views.admin_logout),
]