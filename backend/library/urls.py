from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, CategoryViewSet, BookViewSet, BorrowViewSet

router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='authors')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'books', BookViewSet, basename='books')
router.register(r'borrows', BorrowViewSet, basename='borrows')

urlpatterns = [
    
    path('borrows/overdue/', BorrowViewSet.as_view({'get': 'overdue_borrows'}), name='borrows-overdue'),
    
    path('', include(router.urls)),
]
