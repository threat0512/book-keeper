import { useState} from "react";
import Modal from "./Modal"; // Import the Modal component
import Delete from "./Delete";
function Book(props) {
  const [isModalOpen, setModal] = useState(false);
  const [isEditOpen, setEdit] = useState(false);
  const [bookData, setBookData] = useState({}); // Store retrieved book details
    const [isDeleteOpen, setDelOpen] = useState(false);
    const openDel = () => {
        setDelOpen(true);
    } 
    const closeDel = () => {
        setDelOpen(false);
    }
  const openModal = async () => {
    setModal(true);
    setEdit(true);

    // Fetch book details from backend when editing
    try {
      const response = await fetch(`http://localhost:3000/getData/${props.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setBookData(data); // Set the retrieved book details
      } else {
        console.error("Failed to fetch book details:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
    setEdit(false);
    setBookData({}); // Reset book data when modal closes
  };

  return (
    <div>
      <h2>{props.name}</h2>
      <button onClick={openModal}>EDIT</button>
      <button onClick={openDel}>DELETE</button>
      <div>{props.author}</div>
      <div>{props.rating}</div>
      <p>{props.review}</p>
      <img src={props.cover} alt="Book Cover" />

      {/* Use the same modal for editing, passing the existing book data */}
      <Modal
        isOpen={isModalOpen} 
        onClose={closeModal} 
        isEdit={isEditOpen} 
        bookData={bookData} 
      />
      <Delete isOpen={isDeleteOpen} 
        onClose={closeDel} bookId={props.id}/>
    </div>
  );
}

export default Book;
