import { useEffect, useState } from "react";

import Book from "./Book";
import Modal from "./Modal";
function Home() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setModal] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3000/") // Backend API call
      .then((response) => response.json())
      .then((data) => setBooks(data)) // Store books in state
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  console.log(books); // Check if data is retrieved
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  return (
    <div>
      <button onClick={openModal} variant="outlined">
        POST
      </button>
      {books.length > 0 ? (
        books.map(
          (
            book,
            index // ✅ Correctly mapping over books
          ) => (
            <Book
              key={index} // Adding a unique key
              id={book.id}
              name={book.name} // ✅ Corrected property access
              author={book.author}
              rating={book.rating}
              review={book.review}
              cover={book.cover}
            />
          )
        )
      ) : (
        <p>Loading books...</p> // Display message while fetching
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Home;
