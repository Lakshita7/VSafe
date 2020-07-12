from django.shortcuts import render
from map.forms import Form

# Create your views here.
def startjourney(request):
    return render(request,'map/before.html')

def rate(request):

    x=Form()
    #print("hi")
    if request.method == 'POST':
        #print('hello')
        x=Form(request.POST)
        if x.is_valid():
            x.save(commit = True)
    return render(request,'map/after.html',{'rating':x})



def after(request):
    return render(request,'map/after.html')
