from django.urls import path

from . import views

urlpatterns = [
    path('check', views.check, name='check'),
    path('add_results', views.add_results, name='add_results'),
    path('add_request', views.add_request, name='add_request'),
]
