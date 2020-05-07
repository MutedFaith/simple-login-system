import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

function NotFound() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClick={() => setShow(false)} dismissible>
        <Alert.Heading>Oh Welcome to NotFound page</Alert.Heading>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          inventore doloremque ea animi nesciunt, reiciendis corrupti earum quia
          asperiores neque!
        </p>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Message</Button>;
}

export default NotFound;
