import React, { useEffect, useRef } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import { useState } from 'react';
import { getPackageDownloads, searchPackages } from 'query-registry';
import { FaGithub, FaNpm } from "react-icons/fa";
import { CiLink } from "react-icons/ci";
import '../Popup/Popup.css';

const Newtab = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const submitRef = useRef()

  const fetchPackageInfo = async (query) => {
    try {
      const data = await searchPackages({ text: query });
      console.log(data.objects)
      return data.objects || [];
    } catch (error) {
      console.error('Error fetching package information:', error);
      return [];
    }
  };

  const handleSearch = async (args) => {
    let results = await fetchPackageInfo(args);
    const downloads = await Promise.all(results.map(async (pkg) => await getDownloads(pkg.package.name)))
    results = results.map((pkg, idx) => {
      pkg.package.downloads = downloads[idx]
      return pkg
    })
    setSearchResults(results);
  };


  const get_magnitude_notation = (num) => {
    if (num <= 999999 && num >= 1000) {
      return Math.floor(num / 1000) + "K+";
    } else if (num <= 99999999 && num >= 1000000) {
      return Math.floor(num / 1000000) + "M+";
    } else {
      return num;
    }
  }


  const getDownloads = async (name) => {
    try {
      let { downloads } = await getPackageDownloads(name, "last-week");
      downloads = get_magnitude_notation(downloads)
      // console.log(downloads)
      return downloads;
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    setSearchInput("hamburger-react")
    // submitRef.current.click()
    handleSearch("hamburger-react")
    console.log(submitRef)
  }, [])

  return (
    <div className="popup-container">
      <div className="header">
        <img className="logo" src="icon-34.png" alt="NPM Logo" />
        <h1>NPM Explorer</h1>
      </div>
      <div className="content mx-12">
        <input
          id="search"
          placeholder="e.g. express"
          title="try to use hyphen(-) between words"
          className="input"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button ref={submitRef} className="search-button" onClick={handleSearch}>Search</button>
      </div>
      <div className="results">
        {searchResults.map((pkg, idx) => (
          <div key={idx} className="package">
            <h2 className='heading'>{pkg.package.name}</h2>
            <p className='lh w-[75%]'>{pkg.package.description || 'No description available'}</p>
            <p>Version: <span className="bolder">{pkg.package.version}</span></p>
            <div className='info'>
              <span>Downloads: <span className="bolder">{pkg.package.downloads}</span></span>
              <span className='icons'>
                <a href={pkg.package.links.homepage} target="_blank" rel="noreferrer" className="icon" title="NPM">
                  <CiLink fontSize={'1rem'} color='black' />
                </a>
                <a href={pkg.package.links.repository} target="_blank" rel="noreferrer" className="icon" title="Repository">
                  <FaGithub color='black' />
                </a>
                <a href={pkg.package.links.npm} target="_blank" rel="noreferrer" className="icon" title="Repository">
                  <FaNpm fontSize={'1.2rem'} color='black' />
                </a>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newtab;
