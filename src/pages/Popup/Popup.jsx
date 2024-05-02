import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchPackageInfo = async (query) => {
    try {
      const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`);
      const data = await response.json();
      return data.objects || [];
    } catch (error) {
      console.error('Error fetching package information:', error);
      return [];
    }
  };

  const handleSearch = async () => {
    const results = await fetchPackageInfo(searchInput);
    console.log(results)
    setSearchResults(results);
  };

  return (
     <div className="popup-container">
      <div className="header">
        <img className="logo" src="/images/icon.png" alt="NPM Logo" />
        <h1>NPM Explore</h1>
      </div>
      <div className="content">
        <input
          id="search"
          placeholder="e.g. express"
          title="try to use hyphen(-) between words"
          className="input"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
        <div className="results">
          {searchResults.map((pkg, idx) => (
            <div key={idx} className="package">
              <h2>{pkg.package.name}</h2>
              <p>{pkg.package.description || 'No description available'}</p>
              <p>Version: {pkg.package.version}</p>
              {/* Add more elements for displaying monthly downloads and demo URL */}
              {/* Use state or props for managing the visibility of these elements */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
