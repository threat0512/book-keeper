import { useEffect, useState } from "react";

import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Book from "./Book";
import Sorter from "./Sorter";
import Header from "./Header";
function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/dashboard") // Backend API call
      .then((response) => response.json())
      .then((data) => setBooks(data)) // Store books in state
      .catch((error) => console.error("Error fetching books:", error));
  }, []);
  const handleSort = (onSortChange) => {
    let sorted = [...books];
    console.log(onSortChange);
    if (onSortChange === "title"){
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (onSortChange === "author") {
      sorted.sort((a, b) => a.author.localeCompare(b.author));
    } else if (onSortChange === "rating"){
      sorted.sort((a, b) => b.rating - a.rating); // ✅ Works with numbers
    }
    setBooks(sorted);
  }
  console.log(books); // Check if data is retrieved
  
  return (
    <div className="layout">
      
      <div className="header-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "99.2%" }}>
  <span className="intro" style={{ fontSize: "2.2rem", fontWeight: "bold", paddingLeft  : "0px" }}>books I've read</span>
  <Sorter className="sorter" onSortChange={handleSort} />
</div>

      
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
      
    </div>
  );
}

export default Home;
