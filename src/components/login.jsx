import React, { Component } from "react";
import Joi from "joi-browser";
import { Link, Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import auth from "../services/authService";

class Login extends Component {
  state = {
    isLoggedIn: false,
    data: {
      email: "",
      password: "",
    },
    isPasswordHideChecked: false,
    errors: {},
    validated: false,
  };

  schema = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });

    const errors = {};
    if (!result.error) return null;
    result.error.details.forEach((error) => {
      errors[error.path[0]] = error.message;
    });

    return errors;
  };

  validateOnChange(name, value) {
    const schema = { [name]: this.schema[name] };
    const data = { [name]: value };
    const errors = Joi.validate(data, schema);
    if (!errors.error) return null;
    return errors.error.details[0].message;
  }

  handleChange = (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    const errorMessage = this.validateOnChange(
      e.currentTarget.name,
      e.currentTarget.value
    );

    if (errorMessage) {
      this.setState({ data, errors: { [e.currentTarget.name]: errorMessage } });
    } else {
      this.setState({ data, errors: {} });
    }
  };

  handleShowHidePassword = (e) => {
    this.setState({ isPasswordHideChecked: !this.state.isPasswordHideChecked });
  };

  handleLogOut = (e) => {
    localStorage.removeItem("isLoggedIn");
    this.setState({ isLoggedIn: false });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();

    if (errors) {
      this.setState({ errors });
      return;
    }

    try {
      const { data: loginData } = this.state;
      const { data } = await auth.login(loginData.email, loginData.password);
      if (data.result === "success") {
        localStorage.setItem("isLoggedIn", loginData.email);
        this.setState({ isLoggedIn: true });
      } else {
        toast.error("Your account is blocked!");
        this.setState({
          data: {
            email: "",
            password: "",
          },
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        const errors = {};
        for (let key in ex.response.data.error) {
          errors[key] = ex.response.data.error[key];
        }
        this.setState({ errors });
      }
    }
  };

  componentDidMount() {
    const isLoggedIn = auth.isLoggedIn();
    this.setState({ isLoggedIn });
  }

  render() {
    const { data, isPasswordHideChecked, errors, isLoggedIn } = this.state;
    const { email, password } = data;

    if (isLoggedIn) {
      return <Redirect to="/home" />;
    }

    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="border border-success w-50 bg-light rounded p-5">
          <h3 className="text-muted text-center">Login</h3>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlid="email">
              <Form.Label controlid="email">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={this.handleChange}
                style={errors.email ? { borderColor: "#dc3545" } : {}}
              />
              <Form.Text className="text-danger">
                {errors.email && errors.email}
              </Form.Text>
            </Form.Group>
            <Form.Group controlid="password">
              <Form.Label controlid="password">Password</Form.Label>
              <Form.Control
                type={isPasswordHideChecked ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                style={errors.password ? { borderColor: "#dc3545" } : {}}
              />
              <Form.Text className="text-danger">
                {errors.password && errors.password}
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Show"
                name="showHidePassword"
                onChange={this.handleShowHidePassword}
              />
            </Form.Group>
            <p className="text-right">
              <Link to="/register">Register here</Link>
            </p>
            <Button variant="primary" type="submit" className="mt-2 w-100">
              Submit
            </Button>
          </Form>
        </div>
      </Container>
    );
  }
}

export default Login;
