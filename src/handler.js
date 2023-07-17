const {nanoid} = require('nanoid');

const books = require('./books');

//Menambahkan Buku
const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading,insertedAt,updatedAt,
    };
    
    if (!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code (400);
        console.log(response);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        console.log(response);
        return response;
    }



    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        const response =  h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : id
            },
        });
        response.code(201);
        console.log(response);
        return response;
    }
    const response = h.response ({
        status: 'fail',
        message: 'buku gagal ditambahkan'
    });
    response.code(500);
    console.log(response);
    return response;
};

//Melihat List Semua Buku
const getBookHandler = (request, h) => ({
    status: 'success',
    data: {
        books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }))
    }
});

// Melihat Detail Buku dari ID Buku
const getBookbyIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book
            },
        };
    }
    const response = h.response ({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    console.log(response);
    return response;
};

//Mengedit Detail Buku berdasarkan ID
const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if(index === -1){
        const response = h.response({
            status:'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        console.log(response);
        return response;
       
        }
        
    else if (name === undefined){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            console.log(response);
            return response;
        }
    else if( readPage > pageCount ){
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
                });
                response.code(400);
                console.log(response);
                return response;
            }

         books[index] = {
               ...books[index],
               name,
               year,
               author,
               summary,
               publisher,
               pageCount,
               readPage,
               reading,
               updatedAt 
            
            }; 
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            console.log(response);
            return response;

};

//Menghapus Buku dari ID-nya
const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        console.log(response);
        return response;
    }
    const response = h.response ({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    console.log(response);
    return response;
}


module.exports = {addBookHandler, getBookHandler, getBookbyIdHandler, editBookByIdHandler, deleteBookByIdHandler};