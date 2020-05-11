from django.contrib.auth.models import User
from django.utils import timezone

from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from statistic.models import Statistic
from history.models import History
from .models import Users
from django.views.generic import View
import cv2
import face_recognition
import numpy as np

# Create your views here.
def register(request):
    if request.method == 'GET':
        return HttpResponse(render(request,'reg.html'))
    else:
        users = Users()
        users.u_truename = request.POST["truename"]
        users.u_phone = request.POST["phone"]
        users.u_password = make_password(request.POST["pwd"])
        users.u_house_number = request.POST["house_number"]
        # users.u_type = 0

        users.save()
        context = {
            "res":'注册成功'
        }
        return JsonResponse(context)
        # return HttpResponse(render(request,'login.html',{res:res}))


def login(request):
    if request.method == 'GET':
        return HttpResponse(render(request,'login.html'))
    else:
        u_phone = request.POST['UserName']
        u_password = request.POST['Pwd']

        user = Users.objects.filter(u_phone=u_phone).first()
        if user:
            is_right = check_password(u_password,user.u_password)
            if is_right == True:
                request.session['uid'] = user.u_id
                request.session['username'] = user.u_truename
                request.session['phone'] = user.u_phone
                request.session['house_number'] = user.u_house_number
                # print(request.session['username'])
                context = {
                    "RspCode":1,
                    "res" : '登陆成功'
                }
                # print(context)
                return JsonResponse(context)
            else:
                context = {
                    "RspCode": 2,
                    "res": '密码错误'
                }
                # print(context)
                return JsonResponse(context)
        else:
            context = {
                "RspCode": 3,
                "res": '该用户不存在'
            }
            # print(context)
            return JsonResponse(context)

        # print(user)


def member_index(request):
    return HttpResponse(render(request,'member_index.html'))

def logout(request):
    request.session.flush()
    context = {
        "RspCode":1,
        "res":'退出登录成功'
    }
    return JsonResponse(context)

def change(request):
    if request.method == "GET":
        return HttpResponse(render(request,'change.html'))
    else:
        user = Users.objects.get(pk=request.session['uid'])
        user.u_truename = request.POST['truename']
        user.u_phone = request.POST['phone']
        user.u_house_number = request.POST['house_number']
        user.save()
        request.session['uid'] = user.u_id
        request.session['username'] = user.u_truename
        request.session['phone'] = user.u_phone
        request.session['house_number'] = user.u_house_number
        context = {
            "res":'修改成功'
        }
        return JsonResponse(context)

def face(request):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    # smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    # 调用摄像头
    cap = cv2.VideoCapture(0)
    # a=1
    while (True):
        # 获取摄像头拍摄到的画面
        ret, frame = cap.read()
        faces = face_cascade.detectMultiScale(frame, 1.3, 2)

        # faces = face_engine.detectMultiScale(img,scaleFactor = 1.3,minNeighbors = 5)
        img = frame
        for (x, y, w, h) in faces:
            img = cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
            face_area = img[y:y + h, x:x + w]
            eyes = eye_cascade.detectMultiScale(face_area, 1.3, 15)
            for (ex, ey, ew, eh) in eyes:
                cv2.rectangle(face_area, (ex, ey), (ex + ey, ey + eh), (0, 255, 0), 1)

        # face_encodings = face_re
        # 实时展示效果画面
        cv2.imshow('frame', img)
        # 每5毫秒监听一次键盘动作
        if cv2.waitKey(5) & 0xFF == ord('0'):
            path = f"static/avatar/{request.session['uid']}.jpg"
            cv2.imwrite(path,face_area)
            user = Users.objects.filter(pk=request.session['uid']).first()
            if user.u_face == '':
                user = Users(u_face=path)
                user.save()
            else:
                user.u_face = path
                user.save()
            break
    cv2.destroyAllWindows()
    cap.release()
    return JsonResponse({"res":"人脸存储成功"})

def recognition(request):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    # smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    # 调用摄像头
    cap = cv2.VideoCapture(0)
    # a=1
    while (True):
        # 获取摄像头拍摄到的画面
        ret, frame = cap.read()
        faces = face_cascade.detectMultiScale(frame, 1.3, 2)

        # faces = face_engine.detectMultiScale(img,scaleFactor = 1.3,minNeighbors = 5)
        img = frame
        for (x, y, w, h) in faces:
            img = cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
            face_area = img[y:y + h, x:x + w]
            eyes = eye_cascade.detectMultiScale(face_area, 1.3, 15)
            for (ex, ey, ew, eh) in eyes:
                cv2.rectangle(face_area, (ex, ey), (ex + ey, ey + eh), (0, 255, 0), 1)
        # 实时展示效果画面
        cv2.imshow('frame', img)
        # 每5毫秒监听一次键盘动作
        # a = True
        if cv2.waitKey(5) & 0xFF == ord('0'):
            face_encodings = face_recognition.face_encodings(img)
                # print(face_encodings[0])
            user = Users.objects.filter(pk=request.session['uid']).first()
            y = face_recognition.face_encodings(cv2.imread(user.u_face))[0]

            res = face_recognition.compare_faces([y], face_encodings[0], tolerance=0.5)

            break
    cv2.destroyAllWindows()
    cap.release()
    # print(type(res))
    statistic = Statistic.objects.get(pk = 1)
    if res[0] == True:
        # print("欢迎业主回家")
        context = {
            "res":'欢迎业主回家'
        }
        history = History(h_username = request.session['username'],h_house_number = request.session['house_number'],
                          h_datetime=timezone.now(),h_event='进门')
        history.save()

        # statistic = Statistic(s_true = )
        statistic.s_true += 1
        statistic.save()
        # print("欢迎业主回家")
        return JsonResponse(context)
        # return HttpResponse("欢迎业主回家")
    else:
        context = {
            "res":'抱歉，您不是手机持有者'
        }
        # print("请重新识别")
        # statistic = Statistic.objects.get(pk = 1)
        statistic.s_false += 1
        statistic.save()
        return JsonResponse(context)
    # return redirect("/users/member_index")


