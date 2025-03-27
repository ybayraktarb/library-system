"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token


from library.views import signup_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),  # Uygulamanın URL'leri
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # Token almak için

    # Yeni eklenen: register endpoint
    path('register/', signup_view, name='signup'),
]
