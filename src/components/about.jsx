import React from "react";
import Navbar from "./navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const About = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Container>
        <Row>
          <Col sm={12}>
            <div
              className="d-flex justify-content-center align-items-center text-center"
              style={{ height: "100vh" }}
            >
              <Card className="w-50">
                <Card.Header>
                  <strong>About</strong>
                </Card.Header>
                <Card.Body>
                  <Card.Text>Login Sytem v1.0.0</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default About;
