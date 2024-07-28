from django.shortcuts import render

# Create your views here.

def Home(request):
    return render(request,'index.html')


def Quisition(request,id):
    return render(request,'index.html')