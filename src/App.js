import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import { wimoTheme } from "./styles/WimoTheme"

// Api Calls
import { signOutNow } from "./api/auth"
import { getConctrDecodedToken } from "./api/token"
import { loadFunctions as loadDeviceApiFunctions } from "./api/device"
import { authSignIn, authRegister } from "./api/auth"
import { setEncodedToken } from "./api/profileToken"

// Pages
import LoginPage from "./pages/LoginPage"
import DevicesPaper from "../src/components/organisms/DevicesPaper"

// Nav
import NavBar from "../src/components/molecules/NavBar"

// css
import "./custom.css"
import "react-toastify/dist/ReactToastify.min.css"

class App extends Component {
  state = {
    decodedToken: getConctrDecodedToken(),
    error: null,
    userData: null
  }

  onSignOut = () => {
    signOutNow()
    this.setState({ decodedToken: null })
    const auth2 = window.gapi.auth2.getAuthInstance()
    if (auth2 != null) {
      auth2.disconnect()
    }
  }

  // if OAuth for Google Login Passes
  onGoogleSuccess = (response, status) => {
    this.setState({ userData: response.profileObj })
    //  set jwt of userData in localstorage
    setEncodedToken(response.profileObj)
    const accessToken = response.Zi.access_token
    const email = response.w3.U3
    const provider = "google"
    if (status === "signIn") {
      authSignIn(email, provider, accessToken)
        .then(decodedToken => {
          console.log(decodedToken)
          this.setState({ decodedToken })
        })
        .catch(err => {
          const conctrError = {
            conctrError: err.response.data.error
          }
          this.setState({ error: conctrError })
        })
    }
    if (status === "register") {
      authRegister(email, provider, accessToken)
        .then(conctrUser => {
          this.setState({ token: conctrUser.jwt })
        })
        .catch(err => {
          console.log(err)
          const conctrError = {
            conctrError: err.response.data.error
          }
          this.setState({ error: conctrError })
        })
    }
  }

  // if OAuth for Google Login fails
  onGoogleFailure = (response, status) => {
    if (status === "signIn") {
      if (response.message) {
        const googleError = {
          error: response.message
        }
        this.setState({ error: googleError })
      }
    }
    // register
    if (status === "register") {
      if (response.message) {
        const googleError = {
          error: response.message
        }
        this.setState({ error: googleError })
      }
    }
  }

  render() {
    const { decodedToken, error, userData } = this.state
    console.log("decodedToken", decodedToken)
    const signedIn = !!decodedToken
    console.log(error)
    // errors
    error && error.conctrError && toast.error(error.conctrError)
    return (
      <Router>
        {/* apply app theme*/}
        <MuiThemeProvider muiTheme={wimoTheme}>
          <main>
            <ToastContainer
              position="top-right"
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
            />
            <NavBar signedIn={signedIn} logOut={this.onSignOut} />
            <Switch>
              <Route
                path="/login"
                exact
                render={() =>
                  signedIn ? (
                    <Redirect to="/" />
                  ) : (
                    <LoginPage
                      GoogleLoginSuccess={this.onGoogleSuccess}
                      GoogleLoginFailure={this.onGoogleFailure}
                      GoogleRegisterSuccess={this.onGoogleSuccess}
                      GoogleRegisterFailure={this.onGoogleFailure}
                      useColor={false}
                      backgroundColor="#C8C8C8"
                    />
                  )
                }
              />
              <Route
                path="/"
                render={({ location }) =>
                  signedIn ? (
                    <DevicesPaper
                      pathname={location.pathname.substring(1)}
                      // handleError={this.handleError}
                    />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />

              <Route
                render={({ location }) => <p>{location.pathname} not found</p>}
              />
            </Switch>
          </main>
        </MuiThemeProvider>
      </Router>
    )
  }
}

export default App
