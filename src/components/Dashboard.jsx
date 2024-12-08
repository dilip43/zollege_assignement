import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import NewsList from './NewsList';
import { logoutSuccess } from '../features/authSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className='dashboard-header'>
        <h1>Welcome to the Dashboard</h1>
        <p>{user ? `Logged in as: ${user.email}` : 'Not logged in'}</p>
      </header>
      <button className='logoutButton' onClick={handleLogout}>
        Logout
      </button>
      <main className='dashboard-main'>
        <section className='dashboard-controls'>
          <DarkModeToggle />
        </section>
        <section className='dashboard-content'>
          <h2>Latest News</h2>
          <NewsList />
        </section>
      </main>
      <footer className='dashboard-footer'>
        <p>&copy; {new Date().getFullYear()} Your App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
