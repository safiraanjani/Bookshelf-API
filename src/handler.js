const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, x) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const bookId = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = x.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = x.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((b) => b.bookId === bookId).length > 0;

  if (isSuccess) {
    const response = x.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
      },
    });
    response.code(201);
    return response;
  }

  const response = x.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksByReadStatus = (isRead) => {
  const arrayBooks = [];
  if (isRead === '1') {
    for (let i = 0; i < books.length; i++) {
      const {
        bookId, name, publisher, reading,
      } = books[i];
      if (reading) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  } else if (isRead === '0') {
    for (let i = 0; i < books.length; i++) {
      const {
        bookId, name, publisher, reading,
      } = books[i];
      if (!reading) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  }
  return arrayBooks;
};

const getAllBooksByFinishedStatus = (isFinished) => {
  const arrayBooks = [];
  if (isFinished === '1') {
    for (let i = 0; i < books.length; i++) {
      const {
        bookId, name, publisher, finished,
      } = books[i];
      if (finished) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  } else if (isFinished === '0') {
    for (let i = 0; i < books.length; i++) {
      const {
        bookId, name, publisher, finished,
      } = books[i];
      if (!finished) {
        arrayBooks.push({
          id: bookId,
          name,
          publisher,
        });
      }
    }
  }
  return arrayBooks;
};

const getAllBooksByContainName = (queryName) => {
  const arrayBooks = [];
  for (let i = 0; i < books.length; i++) {
    const {
      bookId, name, publisher,
    } = books[i];
    if (name.toUpperCase().includes(queryName.toUpperCase())) {
      console.log('ooo');
      arrayBooks.push({
        id: bookId,
        name,
        publisher,
      });
    }
  }
  return arrayBooks;
};

const getAllBooks = () => {
  const arrayBooks = [];
  for (let i = 0; i < books.length; i++) {
    const {
      bookId, name, publisher,
    } = books[i];
    arrayBooks.push({
      id: bookId,
      name,
      publisher,
    });
  }
  return arrayBooks;
};

const getAllBookByQueryHandler = (request, x) => {
  let dataRequired;

  const { reading, finished, name } = request.query;

  if (reading !== undefined) {
    dataRequired = getAllBooksByReadStatus(reading);
  } else if (finished !== undefined) {
    dataRequired = getAllBooksByFinishedStatus(finished);
  } else if (name !== undefined) {
    dataRequired = getAllBooksByContainName(name);
  } else {
    dataRequired = getAllBooks();
  }

  const response = x.response({
    status: 'success',
    data: {
      books: dataRequired,
    },
  });
  response.code(200);

  return response;
};

const getBookByIdHandler = (request, x) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.bookId === bookId)[0];

  if (book !== undefined) {
    const changeKey = {
      ...book,
    };
    changeKey.id = changeKey.bookId;
    delete changeKey.bookId;

    const response = x.response({
      status: 'success',
      data: {
        book: changeKey,
      },
    });

    response.code(200);
    return response;
  }

  const response = x.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookHandler = (request, x) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = x.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = x.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const i = books.findIndex((b) => b.bookId === bookId);

  if (i !== -1) {
    books[i] = {
      ...books[i],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = x.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = x.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, x) => {
  const { bookId } = request.params;

  const i = books.findIndex((b) => b.bookId === bookId);

  if (i !== -1) {
    books.splice(i, 1);
    const response = x.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = x.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookByQueryHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
