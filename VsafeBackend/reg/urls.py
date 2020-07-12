from django.conf.urls import url
from reg import views

app_name='reg'

urlpatterns=[
url(r'^registration/$',views.register,name='register'),
url(r'^user_login/$',views.user_login,name='user_login'),

]
