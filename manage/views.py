from django.contrib.auth import login
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from statistic.models import Statistic
from history.models import History
from users.models import Users

@csrf_exempt
def users_list(request):
    email = request.session.get('email')
    if email:
        users = Users.objects.all()
        return HttpResponse(render(request,'tables-data.html',{'users':users}))
    else:
        return redirect("/admin/login")

@csrf_exempt
def history(request):
    email = request.session.get('email')
    if email:
        history = History.objects.all()
        return HttpResponse(render(request,'tables-data2.html',{"history":history}))
    else:
        return redirect("/admin/login")

@csrf_exempt
def statistic(request):
    email = request.session.get('email')
    if email:
        statistic = Statistic.objects.get(pk = 1)
        return HttpResponse(render(request,'charts-flot.html',{"statistic":statistic}))
    else:
        return redirect("/admin/login")

@csrf_exempt
def admin_register(request):
    if request.method == 'GET':
        return HttpResponse(render(request,'backstage_register.html'))
    else:
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        User.objects.create_superuser(username = username,email = email,password = password)
        # user.save()

        return JsonResponse({"res":"管理员注册成功"})

@csrf_exempt
def admin_login(request):
    if request.method == 'GET':
        return HttpResponse(render(request,'backstage_login.html'))
    else:
        email = request.POST.get('email')
        password = request.POST.get('password')
        remember = request.POST.get('remember')
        user = User.objects.get(email = email)
        # print(user)
        pwd = user.password
        is_true = check_password(password,pwd)
        # print(is_true)
        # user = auth.authenticate(request,email=email,password=password)
        # print(user)
        if user and user.is_active and user.is_superuser:
            if is_true:
                login(request,user)
                request.session['email']=email
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return JsonResponse({"res": "登陆成功","code":1})
            else:
                return JsonResponse({"res":"邮箱或密码错误","code":2})
        else:
            return JsonResponse({"res":"该用户不存在"})

        # return redirect('/admin/index')

def admin_logout(request):
    request.session.flush()
    return redirect('/admin/login')