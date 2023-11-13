"use strict";

/* Package System */
import React from "react";
import { connect } from "react-redux";

/* Package Application */
import _ from "lodash";
import Image from "next/image";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Button,
  TextField,
} from "@mui/material";

import Spinkit from "@views/Admin/Components/Spinkit";
import { login } from "@features/Account";

/* Package style */
import styles from "@public/scss/admin/pages/login.module.scss";
import logo from "@public/images/logo-login.svg";

// login
const { base64Encode } = require("@utils/Helper");
let renewTimeout = null;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      values: {},
      status: {
        showPassword: {},
        showLoginForm: "signIn",
        remember: false,
        waitingSubmit: false,
        disabledButton: false,
      },
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearTimeout(renewTimeout);
  }

  handleValues = (e) => {
    let _value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({
      values: { ...this.state.values, [e.target.name]: _value },
    });
  };

  handleTogglePassword = (e) => {
    this.setState({
      status: {
        ...this.state.status,
        showPassword: {
          ...this.state.status.showPassword,
          [e]: !this.state.status.showPassword[e],
        },
      },
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.setState({
      status: {
        ...this.state.status,
        waitingSubmit: true,
        disabledButton: true,
      },
    });
    this.props.login(this.state.values);
    this.setState({
      status: {
        ...this.state.status,
        waitingSubmit: false,
        disabledButton: false,
      },
    });
    renewTimeout = setTimeout(
      () =>
        this.props.renewToken(
          base64Encode(
            this.props.stateAccount.email +
              "," +
              this.props.stateAccount.refresh_token
          ),
          true
        ),
      25 * 60 * 1000
    );
  };

  render() {
    let _status = this.props.stateStatus.status;
    let _err = _status?.msg?.errors ?? [];
    let _keyEmail = _.findIndex(_err, { key: "email" });
    let _keyPass = _.findIndex(_err, { key: "password" });

    return (
      <>
        <div
          id={styles.pageLogin}
          className="d-flex justify-content-center align-items-center flex-root"
        >
          <div className={styles.loginForm}>
            <div
              id={styles.loginFormSignIn}
              className={
                "animate__animated animate__faster " +
                (this.state.status.showLoginForm == "signIn"
                  ? " animate__zoomIn " + styles.show
                  : "")
              }
            >
              <div
                className={
                  "d-flex justify-content-center " + styles.pageLoginLogo
                }
              >
                <Image src={logo} alt="logo" />
              </div>
              <div className={styles.LoginHead}>
                <h3>Log in to your account</h3>
                <p>Welcome back! Please enter your details.</p>
              </div>

              <div className={styles.box}>
                <form noValidate autoComplete="off" onSubmit={this.handleLogin}>
                  <div className={styles.formGroup}>
                    <TextField
                      className={
                        "wp-100 filled-borderRadius" +
                        (_keyEmail >= 0 ? " errors" : "")
                      }
                      type="text"
                      name="email"
                      helperText={_err[_keyEmail]?.msg ?? ""}
                      onChange={this.handleValues}
                      value={this.state.values.email || ""}
                      label="Email"
                      placeholder="Enter your email"
                      startDecorator={<EmailOutlinedIcon />}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <TextField
                      className={
                        "wp-100 filled-borderRadius" + (_keyPass >= 0 ? " errors" : "")
                      }
                      type={
                        this.state.status.showPassword["password"]
                          ? "text"
                          : "password"
                      }
                      name="password"
                      label="Password"
                      variant="outlined"
                      helperText={_err[_keyPass]?.msg ?? ""}
                      onChange={this.handleValues}
                      placeholder="••••••••"
                      value={this.state.values.password || ""}
                      startDecorator={<LockOutlinedIcon />}
                    />
                  </div>
                  <div className="d-flex flex-wrap flex-center">
                    <Button
                      color="inherit"
                      className="btn btn-primary wp-100"
                      variant="contained"
                      type="submit"
                      disabled={this.state.status.disabledButton}
                    >
                      Sign in{" "}
                      {this.state.status.waitingSubmit && (
                        <Spinkit name="sk-fading-circle" color="white" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stateStatus: state.status,
    stateAccount: state.account,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (params) => {
      dispatch(login(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
