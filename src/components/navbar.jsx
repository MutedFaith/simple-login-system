import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import auth from "../services/authService";

function NavbarTop() {
  return (
    <Navbar bg="light" expand="lg" className="mb-5" fixed="top">
      <Navbar.Brand as={Link} to="/">
        Login System
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
        </Nav>
        <Nav>
          {auth.isLoggedIn() && (
            <Navbar.Text className="mr-5">
              Signed in as: <strong>{auth.isLoggedIn()}</strong>
            </Navbar.Text>
          )}
          <Nav.Link as={Link} to="/" onClick={auth.logout}>
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarTop;
