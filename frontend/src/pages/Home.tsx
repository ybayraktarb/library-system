// frontend/src/pages/Home.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages.css';

interface Book {
  id: number;
  title: string;
  author: number;        
  categories: number[]; 
  
}

interface Category {
  id: number;
  name: string;
}

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  
}

interface Borrow {
  id: number;
  user: string; 
  book: number; 
  book_detail: Book;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Kitap listesi
  const [books, setBooks] = useState<Book[]>([]);

  // çekilecek category  author listeleri
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // klncı seçtiği filtre değerleri
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);

  // Borrow kayıtları 
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchAuthors();
    fetchBorrows();
    
  }, []);

  //  kitapları çek
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Book[]>('http://127.0.0.1:8000/api/books/', {
        headers: {
          Authorization: token ? `Token ${token}` : ''
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // kategorileri çek
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Category[]>('http://127.0.0.1:8000/api/categories/', {
        headers: {
          Authorization: token ? `Token ${token}` : ''
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  //  yazarları çek
  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Author[]>('http://127.0.0.1:8000/api/authors/', {
        headers: {
          Authorization: token ? `Token ${token}` : ''
        }
      });
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  
  const fetchBorrows = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Borrow[]>('http://127.0.0.1:8000/api/borrows/', {
        headers: {
          Authorization: token ? `Token ${token}` : ''
        }
      });
      setBorrows(response.data);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    }
  };

  // Logout 
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  
  const handleBorrowBook = async (bookId: number, bookTitle: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const newBorrowData = {
        book: bookId,
        due_date: '2024-12-31', 
      };

      await axios.post(
        'http://127.0.0.1:8000/api/borrows/',
        newBorrowData,
        {
          headers: {
            Authorization: token ? `Token ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      alert(`'${bookTitle}' kitabı ödünç alındı (Borrow).`);
      
      fetchBorrows();
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Kitap ödünç alırken hata oluştu!');
    }
  };

  
  const handleReturnBook = async (borrowId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(
        `http://127.0.0.1:8000/api/borrows/${borrowId}/`,
        {
          headers: {
            Authorization: token ? `Token ${token}` : '',
          }
        }
      );
      alert(`Borrow #${borrowId} sistemden silindi (teslim alındı).`);

      // Ekranda da silmek için filter ile ayıkla
      setBorrows((prev) => prev.filter((b) => b.id !== borrowId));
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Teslim etme (silme) işleminde hata oluştu!');
    }
  };

 
  const filteredBooks = books.filter((bk) => {
    let match = true;

    
    if (selectedCategory) {
      
      if (!bk.categories.includes(selectedCategory)) {
        match = false;
      }
    }

    
    if (selectedAuthor) {
      if (bk.author !== selectedAuthor) {
        match = false;
      }
    }

    return match;
  });

  return (
    <div className="full-container">
      {/* Header */}
      <div className="header">
        <h1>Library Management System</h1>
        <button className="header-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* İçerik */}
      <div className="content">
        {/* Sol Taraf - Kitap Listesi */}
        <div className="main">
          <div className="filters">
            {/* Kategori Seç */}
            <select
              className="form-select"
              value={selectedCategory || ''} 
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val ? parseInt(val) : null);
              }}
            >
              <option value="">Kategori Seç</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Author Seç */}
            <select
              className="form-select"
              value={selectedAuthor || ''} 
              onChange={(e) => {
                const val = e.target.value;
                setSelectedAuthor(val ? parseInt(val) : null);
              }}
            >
              <option value="">Yazar Seç</option>
              {authors.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.first_name} {auth.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Kitaplar Listesi */}
          <div className="kitaplar">
            <div
              className="row"
              style={{ marginBottom: '10px', borderBottom: '1px solid BLACK' }}
            >
              <div className="col">Kitap Adı</div>
              <div className="col">İşlem</div>
            </div>

            {filteredBooks.map((bk) => (
              <div
                className="row"
                key={bk.id}
                style={{
                  marginBottom: '15px',
                  borderBottom: '1px solid #ccc'
                }}
              >
                <div className="col">{bk.title}</div>
                <div className="col">
                  <button
                    className="btn-primary"
                    onClick={() => handleBorrowBook(bk.id, bk.title)}
                  >
                    Kitap Ekle (Borrow)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Taraf - Borrowed Books Listesi (details) */}
        <div className="details">
          <div className="details-container">
            <h3>Ödünç Alınan Kitaplar</h3>
            {borrows.map((brw) => (
              <div key={brw.id} style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
                <h4>Kitap Adı: {brw.book_detail?.title}</h4>
                <p>Borrow ID: {brw.id}</p>
                <p>Kullanıcı: {brw.user}</p>
                <p>Due Date: {brw.due_date}</p>
                <button
                  className="btn-success"
                  onClick={() => handleReturnBook(brw.id)}
                >
                  Teslim Et
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
