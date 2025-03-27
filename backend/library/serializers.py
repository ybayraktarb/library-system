# library/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author, Category, Book, Borrow

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BorrowSerializer(serializers.ModelSerializer):
    
    user = serializers.StringRelatedField(read_only=True)
   
    book = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        write_only=True
    )
    
    book_detail = BookSerializer(source='book', read_only=True)

    class Meta:
        model = Borrow
        fields = [
            'id', 'user', 'book', 'book_detail',
            'borrowed_at', 'due_date', 'returned_at'
        ]
