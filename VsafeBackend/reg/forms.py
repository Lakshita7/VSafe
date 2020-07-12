from django import forms
from django.contrib.auth.models import User
from reg.models import Userprofileinfo

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta():
        model = User
        fields = ('username','email','password','first_name','last_name')

class UserInfo(forms.ModelForm):    #related to class Userprofileinfo in models
    class Meta():
        model = Userprofileinfo
        fields = ('profile_pic','age')
