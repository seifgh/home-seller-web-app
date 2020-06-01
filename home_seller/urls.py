
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.views.static import serve

from django.contrib import admin
from django.urls import path, include
from home_seller_app.views import HomePageView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('static/<path>', serve, {'document_root', settings.STATIC_ROOT}),
    path('properties/', include('home_seller_app.properties.urls')),
    path('sell/', include('home_seller_app.sell.urls')),
    path('user/', include('home_seller_app.user.urls')),
    path('', HomePageView.as_view(), name="home-page")


]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
