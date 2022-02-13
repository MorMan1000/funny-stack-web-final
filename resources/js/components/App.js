import ReactDOM from 'react-dom'
import Contexts from '../contexts/contexts'
import Thanks from '../pages/auth/Thanks';
import { Switch, Route, Router } from 'react-router-dom'
import Home from '../pages/Home'
import UserPage from '../pages/users/UserPage'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import MemePage from '../pages/memes/MemePage'
import UserMemes from '../pages/memes/UserMemes'
import UserUpvotes from '../pages/memes/UserUpvotes'
import NotFoundError from '../pages/errors/NotFoundError'
import Navbar from './layout/Navbar';
import 'materialize-css/dist/css/materialize.min.css'
import history from '../history'
import FindMemes from '../pages/memes/FindMemes';
import UserFollowings from '../pages/users/UserFollowings';
import ResetPassword from '../pages/auth/ResetPassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetMailSent from '../pages/auth/ResetMailSent';
import UserDetails from '../pages/auth/UserDetails';
import ErrorBoundary from '../pages/errors/ErrorBoundary';


function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Contexts >
          <ErrorBoundary>
            <Navbar />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/user/:userId">
                <UserPage />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/thanks">
                <Thanks />
              </Route>
              <Route path="/meme/:memeId?">
                <MemePage />
              </Route>
              <Route path="/user-memes/:userId">
                <UserMemes />
              </Route>
              <Route path="/user-upvotes">
                <UserUpvotes />
              </Route>
              <Route path="/user-followings">
                <UserFollowings />
              </Route>
              <Route path="/search">
                <FindMemes />
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              <Route path="/reset-password">
                <ResetPassword />
              </Route>
              <Route path="/password-reset-mail">
                <ResetMailSent />
              </Route>
              <Route path="/user-details">
                <UserDetails />
              </Route>
              <Route path="*">
                <NotFoundError />
              </Route>
            </Switch>
          </ErrorBoundary>
        </Contexts>
      </Router>
    </div >
  );
}

ReactDOM.render(<App />, document.getElementById('app'))