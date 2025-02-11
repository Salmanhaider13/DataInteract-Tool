"""
URL configuration for DataInteractTool project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from account.views import register,user_login,check_session,user_logout
from file_service.views import upload_file,preprocess_data,correlation_view,train_model

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/',register,name='register'),
    path('login/',user_login,name='user_login'),
    path('check-session/',check_session,name='check_session'),
    path('logout/',user_logout,name='user_logout'),
    path('upload/', upload_file, name='upload_file'),
    path('api/preprocess', preprocess_data, name='preprocess_data'),
    path('api/correlation',correlation_view,name='correlation_view'),
    path('api/train',train_model,name='train_model'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)