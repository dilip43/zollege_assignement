import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, fetchFilteredNews, searchNews, clearResults } from '../features/newsSlice';
import PayoutCalculator from './PayoutCalculator';
import './NewsList.css';

const MAX_DATE_RANGE_START = '2024-11-06';

const NewsList = () => {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.news);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [filters, setFilters] = useState({
    author: '',
    dateRange: ['', ''],
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      dispatch(searchNews(searchKeyword));
    } else {
      dispatch(fetchNews());
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (index, value) => {
    const updatedDateRange = [...filters.dateRange];
    updatedDateRange[index] = value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: updatedDateRange,
    }));
  };

  const applyFilters = () => {
    const [startDate, endDate] = filters.dateRange;

    if (startDate && startDate < MAX_DATE_RANGE_START) {
      setWarning(`Start date cannot be earlier than ${MAX_DATE_RANGE_START}.`);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setWarning('Start date cannot be later than the end date.');
      return;
    }

    setWarning('');
    dispatch(fetchFilteredNews(filters));
  };

  const retryFetchingNews = () => {
    setWarning('');
    dispatch(clearResults());
    dispatch(fetchNews());
  };

  const clearAll = () => {
    setFilters({ author: '', dateRange: ['', ''] });
    setSearchKeyword('');
    setWarning('');
    dispatch(clearResults());
    dispatch(fetchNews());
  };

  if (loading) {
    return <p className='loading-message'>Loading...</p>;
  }

  if (error) {
    return (
      <div className='error-message'>
        <p>Failed to fetch news. Please try again later.</p>
        <button onClick={retryFetchingNews}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`news-container ${darkMode ? 'dark' : 'light'}`}>
      {' '}
      <h2>News Articles</h2>
      {warning && <p className='warning-message'>{warning}</p>}
      <div className='search-bar'>
        <input
          type='text'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder='Search articles by keyword'
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className='filter-section'>
        <input
          type='text'
          name='author'
          value={filters.author}
          onChange={handleFilterChange}
          placeholder='Filter by author'
        />
        <input type='date' value={filters.dateRange[0]} onChange={(e) => handleDateChange(0, e.target.value)} />
        <input type='date' value={filters.dateRange[1]} onChange={(e) => handleDateChange(1, e.target.value)} />
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={clearAll}>Clear All</button>
      </div>
      {articles.length === 0 ? (
        <p className='no-articles-message'>No articles available. Try adjusting filters or search terms.</p>
      ) : (
        <ul className='articles-list'>
          {articles.map((article, index) => (
            <li key={index} className='article-item'>
              <h3>{article.title}</h3>
              <p>Author: {article.author || 'Unknown'}</p>
              <p>Date: {new Date(article.publishedAt).toLocaleDateString()}</p>
              <a href={article.url} target='_blank' rel='noopener noreferrer'>
                Read More
              </a>
            </li>
          ))}
        </ul>
      )}
      <PayoutCalculator articles={articles} />
    </div>
  );
};

export default NewsList;
