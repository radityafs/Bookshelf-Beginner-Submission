const modal = document.querySelector('#myModal');
const btnAddBook = document.querySelector('.addBook');
const btnModalAdd = document.querySelector('.btn-modal');
const btnCloseModal = document.querySelectorAll('.close');
const triggerTabList = document.querySelectorAll('#myTab button');
const searchInput = document.querySelector('.search_input');

const RENDER_EVENT = 'RENDER_EVENT';
const STORAGE_KEY = 'BOOKSHELF_APP';

/**
 * Function to Add Book to Bookshelf
 */
const addBook = (e) => {
  e.preventDefault();

  const bookTitle = document.getElementById('book_input').value;
  const bookAuthor = document.getElementById('author_input').value;
  const bookYear = document.getElementById('year_input').value;

  if (bookTitle !== '' && bookAuthor !== '' && bookYear !== '') {
    const book = {
      id: generateId(),
      title: bookTitle,
      author: bookAuthor,
      year: bookYear,
      isComplete: false
    };

    if (isStorageExist()) {
      const books = JSON.parse(localStorage.getItem(STORAGE_KEY));
      books.push(book);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

      modal.style.display = 'none';

      bookTitle.value = '';
      bookAuthor.value = '';
      bookYear.value = '';

      showToast('Buku berhasil ditambahkan');

      dispatchEvent(new CustomEvent(RENDER_EVENT));
    } else {
      alert('Browser anda tidak mendukung local storage');
    }
  } else {
    showToast('Mohon isi semua field');
  }
};

/**
 * Function to Delete Book from Bookshelf
 */

const deleteBook = (e) => {
  e.preventDefault();

  const parentElement = e.target.parentElement.parentElement;
  const booksId = parentElement.getAttribute('key');

  const books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const newBooks = books.filter((book) => book.id !== parseInt(booksId));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));

  showToast('Buku berhasil dihapus');
  dispatchEvent(new CustomEvent(RENDER_EVENT));
};

/**
 * Function to Edit Book from Bookshelf
 */
const editBook = (e) => {
  e.preventDefault();

  const parentElement = e.target.parentElement.parentElement;
  const booksId = parentElement.getAttribute('key');

  const books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  console.log(booksId);
  const newBooks = books.map((book) => {
    if (book.id === parseInt(booksId)) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });

  showToast('Buku berhasil diubah');

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
  dispatchEvent(new CustomEvent(RENDER_EVENT));
};

/**
 * Function to Search Book from Bookshelf
 */
const searchBooks = debounce(function () {
  dispatchEvent(new CustomEvent(RENDER_EVENT));
}, 500);

/**
 * Function to Render Bookshelf
 */
window.addEventListener(RENDER_EVENT, () => {
  const books = JSON.parse(localStorage.getItem(STORAGE_KEY));

  const unreadBooks = document.querySelector('.unread-books');
  const readBooks = document.querySelector('.read-books');

  const searchValue = document.querySelector('.search_input').value;

  unreadBooks.innerHTML = '';
  readBooks.innerHTML = '';

  books.map((book) => {
    if (book.isComplete && filterBooks(book, searchValue)) {
      readBooks.innerHTML += `
            <div class="book-item" key=${book.id}>
            <div class="book-photo">
              <img src="./assets/img/read.jpg" alt="${book.title}" />
            </div>
      
            <div class="description">
            <p class="title"><b>Judul :</b> ${book.title}</p>
              <p><b>Author :</b> ${book.author}</p>
              <p><b>Tahun :</b> ${book.year}</p>
            </div>
      
            <div class="btn-action">
            <img class="btn-read" src="./assets/img/repeat.svg">
            <img class="btn-delete" src="./assets/img/trash.svg">
          </div>
         </div>
          `;
    }

    if (!book.isComplete && filterBooks(book, searchValue)) {
      unreadBooks.innerHTML += `
        <div class="book-item" key=${book.id}>
        <div class="book-photo">
          <img src="./assets/img/unread.jpg"alt="${book.title}" />
        </div>
    
        <div class="description">
        <p class="title"><b>Judul :</b> ${book.title}</p>
          <p><b>Author :</b> ${book.author}</p>
          <p><b>Tahun :</b> ${book.year}</p>
        </div>
    
        <div class="btn-action">
        <img class="btn-read" src="./assets/img/circle.svg">
        <img class="btn-delete" src="./assets/img/trash.svg">
        </div>
    </div>`;
    }
  });

  if (unreadBooks.innerHTML === '') {
    unreadBooks.innerHTML = `
      <div class="no-book">
        <p>Tidak ada buku yang ditemukan</p>
      </div>
    `;
  }

  if (readBooks.innerHTML === '') {
    readBooks.innerHTML = `
      <div class="no-book">
        <p>Tidak ada buku yang ditemukan</p>
      </div>
    `;
  }

  const btnDelete = document.querySelectorAll('.btn-delete');
  const btnRead = document.querySelectorAll('.btn-read');

  btnDelete.forEach((btn) => {
    btn.addEventListener('click', deleteBook);
  });

  btnRead.forEach((btn) => {
    btn.addEventListener('click', editBook);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  showToast('Selamat Datang di Bookshelf');

  btnAddBook.addEventListener('click', function () {
    modal.style.display = 'block';
  });

  btnCloseModal.forEach((element) => {
    element.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  });

  triggerTabList.forEach((triggerEl) => {
    const tabTrigger = new bootstrap.Tab(triggerEl);

    triggerEl.addEventListener('click', (event) => {
      event.preventDefault();
      tabTrigger.show();
    });
  });

  btnModalAdd.addEventListener('click', addBook);
  searchInput.addEventListener('keyup', searchBooks);

  dispatchEvent(new CustomEvent(RENDER_EVENT));
});
