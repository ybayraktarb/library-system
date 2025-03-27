from django.contrib import admin
from .models import Author, Category, Book, Borrow

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'birth_date')
    search_fields = ('first_name', 'last_name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'publication_date', 'available_copies')
    search_fields = ('title', 'isbn')
    list_filter = ('categories', 'author', 'publication_date')

@admin.register(Borrow)
class BorrowAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrowed_at', 'due_date', 'returned_at')
    search_fields = ('user__username', 'book__title')
    list_filter = ('due_date', 'returned_at')
