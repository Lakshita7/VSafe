from django import forms
from django.core import validators
from map.models import area

class Form(forms.Form):
    class Meta:
        model = area
        fields = "__all__"
