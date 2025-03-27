from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Author, Category, Book, Borrow
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer, BorrowSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    

class BorrowViewSet(viewsets.ModelViewSet):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """
        Yeni bir Borrow oluşturulurken user alanını
        otomatik olarak request.user'a set ediyoruz.
        """
        serializer.save(user=self.request.user)
        
    def overdue_borrows(self, request):
        overdue_list = Borrow.objects.filter(
            due_date__lt=timezone.now().date(),
            returned_at__isnull=True
        )
        serializer = BorrowSerializer(overdue_list, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Username ve password zorunludur."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Bu kullanıcı adı zaten alınmış."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        username=username,
        password=password
    )
    return Response(
        {"success": "Kullanıcı başarıyla oluşturuldu."},
        status=status.HTTP_201_CREATED
    )
