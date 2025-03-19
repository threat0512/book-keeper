// import { useState} from "react";
// import Modal from "./Modal"; // Import the Modal component
// import Delete from "./Delete";
// import Rating from '@mui/material/Rating';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Button from '@mui/material/Button';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// function Book(props) {
//   const [isModalOpen, setModal] = useState(false);
//   const [isEditOpen, setEdit] = useState(false);
//   const [bookData, setBookData] = useState({});
//   const [isDeleteOpen, setDelOpen] = useState(false);

//   const openDel = () => setDelOpen(true);
//   const closeDel = () => setDelOpen(false);

//   const openModal = async () => {
//     setModal(true);
//     setEdit(true);

//     try {
//       const response = await fetch(`http://localhost:3000/getData/${props.id}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setBookData(data);
//       } else {
//         console.error("Failed to fetch book details:", await response.text());
//       }
//     } catch (error) {
//       console.error("Error fetching book details:", error);
//     }
//   };

//   const closeModal = () => {
//     setModal(false);
//     setEdit(false);
//     setBookData({});
//   };

//   return (
//     <div style={{ paddingTop: '20px', display: "flex", alignItems: "center", gap: "20px", width: "100%" }}>
      
//       {/* Book Cover */}
//       <img 
//         src={props.cover} 
//         alt="Book Cover" 
//         style={{ width: "150px", height: "220px", objectFit: "cover", borderRadius: "5px" }} 
//       />
      
//       {/* Right Side: Buttons & Book Info */}
//       <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        
//         {/* Buttons - Positioned on the Right of the Image */}
//         <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
//           <ButtonGroup disableElevation variant="contained">
//             <Button 
//               onClick={openModal}  
//               variant="contained"
//               size="medium"
//               sx={{
//                 backgroundColor: 'black',
//                 borderRadius: '8px',
//                 textTransform: 'none',
//                 padding: '6px 20px',
//                 fontSize: '0.95rem',
//                 fontWeight: 400,
//                 boxShadow: 'none',
//                 '&:hover': {
//                   backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                   boxShadow: 'none',
//                 },
//               }}>
//               <EditIcon />
//             </Button>
//             <Button 
//               onClick={openDel}  
//               variant="contained"
//               size="medium"
//               sx={{
//                 backgroundColor: 'black',
//                 borderRadius: '8px',
//                 textTransform: 'none',
//                 padding: '6px 20px',
//                 fontSize: '0.95rem',
//                 fontWeight: 400,
//                 boxShadow: 'none',
//                 '&:hover': {
//                   backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                   boxShadow: 'none',
//                 },
//               }}>
//               <DeleteIcon />
//             </Button>
//           </ButtonGroup>
//         </div>

//         {/* Book Details */}
//         <h2 style={{ marginBottom: '0px' }}>{props.name}</h2>
//         <div style={{ opacity: '0.5', paddingBottom: '10px' }}>{props.author}</div>

//         {/* Rating */}
//         <Rating name="read-only" value={props.rating} readOnly />
//         <p>{props.review}</p>
//       </div>
//       <hr />

//       {/* Modals */}
//       <Modal isOpen={isModalOpen} onClose={closeModal} isEdit={isEditOpen} bookData={bookData} />
//       <Delete isOpen={isDeleteOpen} onClose={closeDel} bookId={props.id}/>
//     </div>
//   );
// }

// export default Book;
import React, { useState } from 'react';
import Delete from "./Delete";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Rating,
  TextField,
  Box,
  Stack,
  Chip,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import Modal from "./Modal"; // Import the Modal component
export default function Book(props) {
  const [isModalOpen, setModal] = useState(false);
  const [isEditOpen, setEdit] = useState(false);
  const [bookData, setBookData] = useState({});
  const [isDeleteOpen, setDelOpen] = useState(false);

  const openDel = () => setDelOpen(true);
  const closeDel = () => setDelOpen(false);

  const openModal = async () => {
    setModal(true);
    setEdit(true);

    try {
      const response = await fetch(`http://localhost:3000/getData/${props.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setBookData(data);
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
    setBookData({});
  };


  return (
    <Paper 
      elevation={2}
      sx={{ 
        display: 'flex',
        height: '200px',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        overflow: 'hidden',
        borderRadius: 2,
        marginBottom: '1%'
      }}
    >
      {/* Book Cover */}
      <Box sx={{ width: '140px', flexShrink: 0, position: 'relative', height: '200px' }}>
        <CardMedia
          component="img"
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          image={props.cover}
          alt={props.title}
        />
       
      </Box>

      {/* Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1,
        p: 2,
        overflow: 'hidden'
      }}>
        
          <>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {props.title}
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 'bold',
                fontSize: '1.1em'
              }}
            >
              {props.author}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={props.rating} precision={0.5} readOnly size="small" />
             
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {props.review || "A captivating book that takes readers on an unforgettable journey through its pages, offering insights and entertainment in equal measure."}
            </Typography>
          </>
         
      </Box>
      <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
          backgroundColor: 'black',
          borderRadius: '20px',
          padding: '4px'
        }}>
       
            <>
              <IconButton
                size="small"
                onClick={openModal}
                sx={{ color: 'white' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={openDel}  
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
      
        </Box>
      <Modal isOpen={isModalOpen} onClose={closeModal} isEdit={isEditOpen} bookData={bookData} userid={props.user}/>
      <Delete isOpen={isDeleteOpen} onClose={closeDel} bookId={props.id} userid={props.user}/>
    </Paper>
  );
}