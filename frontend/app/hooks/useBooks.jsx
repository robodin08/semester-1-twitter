import { useContext } from "react";

import { BooksContext } from "../../contexts/BookContext";

export function useBooks() {
  const context = useContext(BooksContext);

  if (!context) {
    throw new Error("useBooks must be used within a BooksContext");
  }

  return context;
}
