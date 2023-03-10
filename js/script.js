document.addEventListener("DOMContentLoaded", function () {
  const searchBook = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");
  const resetButton = document.getElementById("resetSubmit");
  const searchBookshelfList = document.getElementById("searchBookshelfList");
  const inputBook = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  let books = getBooksFromStorage();
  render();

  function render() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    books.forEach((book) => {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        completeBookshelfList.append(bookElement);
      } else {
        incompleteBookshelfList.append(bookElement);
      }
    });
  }

  function getBooksFromStorage() {
    let books;
    const booksStorage = localStorage.getItem("booksStorage");
    if (booksStorage) {
      books = JSON.parse(booksStorage);
    } else {
      books = [];
    }
    return books;
  }

  function saveBooksToStorage(books) {
    localStorage.setItem("booksStorage", JSON.stringify(books));
  }

  function makeBookElement(book) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.dataset.id = book.id;
    bookItem.dataset.shelf = book.isComplete
      ? "completeBook"
      : "incompleteBook";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.textContent = `Tahun: ${book.year}`;

    const action = document.createElement("div");
    action.classList.add("action");

    const buttonFinish = document.createElement("button");
    buttonFinish.classList.add("green");
    buttonFinish.textContent = book.isComplete
      ? "Belum Selesai Dibaca"
      : "Selesai Dibaca";

    const buttonEdit = document.createElement("button");
    buttonEdit.classList.add("blue");
    buttonEdit.textContent = "Edit Buku";

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("red");
    buttonDelete.textContent = "Hapus Buku";

    bookItem.append(title, author, year, action);
    action.append(buttonFinish, buttonEdit, buttonDelete);

    return bookItem;
  }

  inputBook.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("Title").value;
    const author = document.getElementById("Author").value;
    const year = document.getElementById("Year").value;
    const isComplete = document.getElementById("IsComplete").checked;

    const book = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(book);
    saveBooksToStorage(books);
    event.target.reset();
    render();
    alertDialog("Data berhasil disimpan");
  });

  function toogleBookStatus(id, shelfStatus) {
    const book = books.find((book) => book.id == id);
    book.isComplete = shelfStatus;
    bookItem = document.querySelector(`[data-id='${id}']`);
    bookItem.dataset.shelf = shelfStatus ? "completeBook" : "incompleteBook";
    saveBooksToStorage(books);
    render();
    alertDialog("Data berhasil dipindah");
  }

  function editBook(id, title, author, year) {
    const book = books.find((book) => book.id == id);

    if (title !== null && title !== "") {
      book.title = title;
    }
    if (author !== null && author !== "") {
      book.author = author;
    }
    if (year !== null && year !== "") {
      book.year = year;
    }

    saveBooksToStorage(books);
    render();
    alertDialog("Data berhasil diubah");
  }

  function deleteBook(id) {
    books = books.filter((book) => book.id != id);
    saveBooksToStorage(books);
    render();
    alertDialog("Data berhasil dihapus");
  }

  function handleBookshelfClick(event) {
    const id = event.target.closest(".book_item").dataset.id;
    const shelfStatus = event.target.closest(".book_item").dataset.shelf;

    if (event.target.classList.contains("green")) {
      toogleBookStatus(id, shelfStatus === "completeBook" ? false : true);
    } else if (event.target.classList.contains("blue")) {
      const book = books.find((book) => book.id == id);
      const title = prompt("Edit Judul Buku", book.title);
      const author = prompt("Edit Penulis Buku", book.author);
      const year = prompt("Edit Tahun Terbit Buku", book.year);
      editBook(id, title, author, year);
    } else if (event.target.classList.contains("red")) {
      deleteBook(id);
    }
  }

  incompleteBookshelfList.addEventListener("click", handleBookshelfClick);
  completeBookshelfList.addEventListener("click", handleBookshelfClick);

  searchBook.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) => {
      const bookTitle = book.title.toLowerCase();
      return bookTitle.includes(keyword);
    });

    renderSearchResult(filteredBooks);

    searchBookshelfList.addEventListener("click", (event) => {
      const id = event.target.closest(".book_item").dataset.id;
      const shelfStatus = event.target.closest(".book_item").dataset.shelf;

      if (event.target.classList.contains("green")) {
        toogleBookStatus(id, shelfStatus === "completeBook" ? false : true);
        renderSearchResult(filteredBooks);
      } else if (event.target.classList.contains("blue")) {
        const book = books.find((book) => book.id == id);
        const title = prompt("Edit Judul Buku", book.title);
        const author = prompt("Edit Penulis Buku", book.author);
        const year = prompt("Edit Tahun Terbit Buku", book.year);
        editBook(id, title, author, year);
        renderSearchResult(filteredBooks);
      } else if (event.target.classList.contains("red")) {
        deleteBook(id);
        searchBookTitle.value = "";
        searchBookshelfList.innerHTML = "";
      }
    });
  });

  resetButton.addEventListener("click", (event) => {
    event.preventDefault();
    searchBookTitle.value = "";
    searchBookshelfList.innerHTML = "";
  });

  function renderSearchResult(booksList) {
    searchBookshelfList.innerHTML = "";
    booksList.forEach((book) => {
      const bookElement = makeBookElement(book);
      searchBookshelfList.append(bookElement);
    });
  }

  function alertDialog(message, duration = 3000) {
    const dialog = document.createElement("div");
    dialog.classList.add("dialog");

    const dialogMessage = document.createElement("p");
    dialogMessage.textContent = message;

    dialog.appendChild(dialogMessage);
    document.body.appendChild(dialog);

    setTimeout(() => {
      dialog.classList.add("show");
    }, 100);

    setTimeout(() => {
      dialog.remove();
    }, duration);
  }
});
