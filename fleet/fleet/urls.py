"""fleet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as drfviews

admin.site.site_header = 'FLEET DP'
admin.site.index_title = 'ADMIN'   
admin.site.site_title = 'FLEET DP'                   
urlpatterns = [

    path('', include('fleet_app.urls')),#vistas a renderizar
    path('admin/', admin.site.urls),#admin
    path('', include('django.contrib.auth.urls')), #autenticacion por sesion
      # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),#api
    # path('api-token-auth/', drfviews.obtain_auth_token, name='api_token_auth'),  # <-- api auth

]
