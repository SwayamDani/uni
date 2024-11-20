import { Route, Routes } from 'react-router-dom';
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
          <Route path="/unirides" element={<Home />} />
          <Route path="/unirides/learn-more" element={<LearnMore />} />
          <Route path="/unirides/profile" element={<Profile />} />
          <Route path="/unirides/cards" element={<Cards />} />
          <Route path="/unirides/join-group" element={<Cards />} />{' '}
          <Route path="/unirides/create-group" element={<CreateGroup />} />
          <Route path="/unirides/login" element={<Login />} />{' '}
          <Route path="/unirides/my-groups" element={<MyGroups />} />
          <Route path="/unirides/group/:groupId" element={<GroupPage />} />
          <Route path="/unirides/welcome" element={<LandingPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
