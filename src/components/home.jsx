import React, { Component } from "react";
import http from "../services/httpService";
import NavbarTop from "./navbar";
import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

class Home extends Component {
  state = {
    status: 1,
    data: [],
    modalShow: false,
    currentUserInAction: {},
    setActivateDeactivateUser: false,
  };

  async getUsers(status = 0) {
    try {
      const { data } = await http.get(
        `/loginsystemapi/users.php/?status=${status}`
      );
      if (data.result === "success") {
        this.setState({ data: data.data });
      }
    } catch (ex) {
      console.log(`Error: ${ex}`);
    }
  }

  handleSortStatus = (selectedKey) => {
    let status = 1;
    if (selectedKey && selectedKey === "blocked") {
      status = 0;
    }

    this.setState({ status });
  };

  handleHideModal = () => this.setState({ modalShow: false });
  handleShowModal = (user) => {
    this.setState({ currentUserInAction: user, modalShow: true });
  };

  handleSetActivateDeactivateUser = () => {
    this.setState({ setActivateDeactivateUser: true, modalShow: false });
  };

  setModal() {
    const { modalShow, status } = this.state;
    return (
      <Modal show={modalShow} onHide={this.handleHideModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {`${status ? "Deactivation" : "Activation"} of user`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Do you really want to ${status ? "block" : "unblock"} this user`}
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={this.handleHideModal}>
            No
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={this.handleSetActivateDeactivateUser}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      status,
      currentUserInAction,
      setActivateDeactivateUser,
    } = this.state;

    if (currentUserInAction && setActivateDeactivateUser) {
      try {
        const { data } = await http.put("/loginsystemapi/users.php", {
          action: status ? "block" : "unblock",
          user_id: currentUserInAction.users_id,
        });
        console.log(data);
        toast.success(
          `${status ? "Blocked" : "Unblocked"} account successfully!`
        );
        this.setState({
          currentUserInAction: {},
          setActivateDeactivateUser: false,
        });
        this.getUsers(status);
      } catch (ex) {
        console.log(ex);
      }
    }

    if (prevState.status !== status) {
      this.getUsers(status);
    }
  }

  async componentDidMount() {
    await this.getUsers(1);
  }

  render() {
    const { status, data } = this.state;
    return (
      <React.Fragment>
        {this.setModal()}
        <NavbarTop />
        <Container className="mt-5 p-5">
          <Tabs defaultActiveKey="active" onSelect={this.handleSortStatus}>
            <Tab eventKey="active" title="Active"></Tab>
            <Tab eventKey="blocked" title="Blocked"></Tab>
          </Tabs>
          <h3 className="text-muted text-center mt-4 mb-4">
            List of{" "}
            {status ? (
              <span className="text-success">Active</span>
            ) : (
              <span className="text-danger">Blocked</span>
            )}{" "}
            Users
          </h3>
          <Table size="sm" striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((user, index) => (
                  <tr key={`${index}-${user.users_id}`}>
                    <td>{user.users_id}</td>
                    <td>{user.email}</td>
                    <td>{user.registration_date}</td>
                    <td>
                      {status ? (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => this.handleShowModal(user)}
                        >
                          Block
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => this.handleShowModal(user)}
                        >
                          Unblock
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </React.Fragment>
    );
  }
}

export default Home;
