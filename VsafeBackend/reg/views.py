from django.shortcuts import render
from reg.forms import UserForm,UserInfo
from django.contrib.auth import authenticate,login,logout
from django.http import HttpResponse,HttpResponseRedirect
# from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.urls import reverse
# Create your views here.
def index(request):
    return render(request,'map/landingpage.html')

def log(request):
    return render(request,'reg/login.html')


@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('log'))

def register(request):

    registered = False

    if(request.method=='POST'):
        user_form = UserForm(data=request.POST)
        user_info = UserInfo(data=request.POST)

        if user_form.is_valid() and user_info.is_valid():
            user=user_form.save()
            user.set_password(user.password)
            user.save()

            profile=user_info.save(commit = False)
            profile.user=user

            if 'profile_pic' in request.FILES:
                profile.profile_pic = request.FILES['profile_pic']
            profile.save()
            registered = True
        else:
            print(user_form.errors,user_info.errors)
    else:
        user_form = UserForm()
        user_info = UserInfo()
    return render(request,'reg/registration.html',{'registered':registered,
                                                    'userform':user_form,
                                                    'profileform':user_info})
def user_login(request):
    if request.method == "POST":
        username=request.POST.get('username')
        password=request.POST.get('password')
        user=authenticate(username=username,password=password)

        if user:
            if user.is_active:
                login(request,user)
                return HttpResponseRedirect(reverse('index'))
            else:
                return HttpResponse("ACCOUNT NOT ACTIVE")
        else:
            print("Someone tried to login and failed! ")
            print("Username: {} and password:{}".format(username,password))
            return HttpResponse("invalid login details supplied.Maybe you havent registered.")
    else:
        return render(request,'reg/login.html',{})
