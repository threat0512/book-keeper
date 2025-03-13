import { Link } from "@mui/material";

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      underline="none"
      sx={{
        color: active ? 'black' : 'rgba(0,0,0,0.6)',
        fontSize: '0.95rem',
        fontWeight: 500,
        transition: 'color 0.2s ease',
        '&:hover': {
          color: 'black'
        }
      }}
    >
      {children}
    </Link>
  );
}

export default NavLink;