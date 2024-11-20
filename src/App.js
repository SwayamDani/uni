import { Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Cards from './components/Cards';
import Login from './components/Login';
import CreateGroup from './components/CreateGroup';
import GroupPage from './components/GroupPage';
import MyGroups from './components/MyGroups';
import LearnMore from './components/LearnMore';
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';
const App = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/join-group" element={<Cards />} />{' '}
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/login" element={<Login />} />{' '}
          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/welcome" element={<LandingPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
