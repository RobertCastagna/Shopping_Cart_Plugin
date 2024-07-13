from django.urls import path, include
from rest_framework.routers import DefaultRouter
from product_api.views import ProductViewSet, process_url

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/process-url/', process_url, name='process-url'),
]