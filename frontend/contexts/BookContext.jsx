import { createContext, useState } from "react";

const DATABASE_ID = "68e3c08b00396ba4398e";
const COLLECTION_ID = "books";

export const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);

  async function fetchBooks() {
    try {
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchBookById(id) {
    try {
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createBook(data) {
    try {
    } catch (error) {
      console.log(error.message);
    }
  }

  async function deleteBook(id) {
    try {
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <BooksContext.Provider
      value={{ books, fetchBooks, fetchBookById, createBook, deleteBook }}
    >
      {children}
    </BooksContext.Provider>
  );
}
