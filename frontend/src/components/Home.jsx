import "../styles/Home.css"
import { useEffect, useState } from "react";
import Book from "./Book";
import Sorter from "./Sorter";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from "./Modal";

function Home() {
  const [books, setBooks] = useState([]);
  const [uid, setUid] = useState(null); // ✅ Store UID in state
  const [isModalOpen, setModal] = useState(false);
  const auth = getAuth();
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    // ✅ Track User Authentication State
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // ✅ Store UID in state when user logs in
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // ✅ Fetch books only when uid is available
    if (!uid) return;

    fetch(`http://localhost:3000/dashboard/${uid}`)
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, [uid]); // ✅ Re-run API call when `uid` changes

  const handleSort = (sortOption) => {
    let sorted = [...books];
    
    if (sortOption === "title") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "author") {
      sorted.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortOption === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    setBooks(sorted);
  };

  return (
    <div className="layout">
      <div className="header-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "99.2%" }}>
        <span className="intro" style={{ fontSize: "2.2rem", fontWeight: "bold", marginLeft: "1.1%" }}>My Library</span>
        <Sorter className="sorter" onSortChange={handleSort} />
      </div>

      {books.length > 0 ? (
        books.map((book, index) => (
          <Book key={index} id={book.id} name={book.name} author={book.author} rating={book.rating} review={book.review} cover={book.cover} />
        ))
      ) : (
        <div className="elseDiv">
          <div className="add"><AddCircleIcon onClick={openModal} sx={{ fontSize: 70, boxShadow: "none","&:hover": {
              
                  boxShadow: "none",
                } }}/></div>
          <p>Get started by adding your first book</p>
        </div>
        
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Home;
