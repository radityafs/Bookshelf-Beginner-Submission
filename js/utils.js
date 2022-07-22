function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser anda tidak mendukung local storage');
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const filterBooks = (book, keyword) => {
  if (keyword === '') {
    return true;
  }

  if (
    book.title.toLowerCase().includes(keyword.toLowerCase()) ||
    book.author.toLowerCase().includes(keyword.toLowerCase()) ||
    book.year.toLowerCase().includes(keyword.toLowerCase())
  ) {
    return true;
  } else {
    return false;
  }
};

const showToast = (message) => {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background:
        'linear-gradient(90deg, rgba(244, 89, 112, .7), rgba(244, 91, 167, .7))'
    }
  }).showToast();
};
