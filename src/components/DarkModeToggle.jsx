import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../features/themeSlice';
import { FaSun, FaMoon } from 'react-icons/fa';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  return (
    <div className='dark-mode-slider'>
      <label className='toggle'>
        <input
          type='checkbox'
          checked={darkMode}
          onChange={() => dispatch(toggleDarkMode())}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        />
        <span className='slider'>
          <FaSun className='icon sun' />
          <FaMoon className='icon moon' />
        </span>
      </label>
    </div>
  );
};

export default DarkModeToggle;
