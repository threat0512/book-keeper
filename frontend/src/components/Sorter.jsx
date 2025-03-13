import * as React from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

export default function Sorter({ onSortChange }) {
  const [sortOption, setSortOption] = React.useState("");

  const handleChange = (event) => {
    setSortOption(event.target.value);
    onSortChange(event.target.value);
  };

  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: 160,
        backgroundColor: "#1e1e1e",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          color: "white", // Text color
          "& .MuiSvgIcon-root": { color: "white" }, // Dropdown arrow color
          "& fieldset": { borderColor: "gray" }, // Default border
          "&:hover fieldset": { borderColor: "#bb86fc" }, // Hover effect
          "&.Mui-focused fieldset": { borderColor: "#ffffff" }, // Focused border
        },
      }}
      size="small"
    >
      <InputLabel sx={{ color: "white"}}>Sort By</InputLabel>
      <Select
        value={sortOption}
        onChange={handleChange}
        label="Sort By"
        sx={{
          backgroundColor: "#1e1e1e",
          color: "white",
          "& .MuiMenuItem-root": { color: "white" },
        }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="rating">Rating (High to Low)</MenuItem>
  
        <MenuItem value="title">Title (A-Z)</MenuItem>
      
        <MenuItem value="author">Author (A-Z)</MenuItem>

      </Select>
    </FormControl>
  );
}
