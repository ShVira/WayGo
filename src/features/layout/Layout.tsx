import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isLocationPage = location.pathname === "/" || location.pathname.startsWith("/location");

  return (
    <>
      <header
        style={{
          height: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          margin: "-10px",
          marginBottom:"20px",
          padding: "10px",
          flexDirection: "column",
        }}
      >
        <img style={{ height: "60px" }} src="/logo.png" alt="logo" />
       <div style={{ fontSize: "12px", color: "#555", marginTop:"-10px" }}>
        {isLocationPage && <h3>Find your location</h3>}

       </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style ={{borderTop: "1px solid #ddd", display:"flex", justifyContent:"spaceAround", alignItems:"center", padding:"10px", margin:"-10px", marginTop:"20px"}}>

        
      </footer>
    </>
  );
}