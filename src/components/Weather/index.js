import React, { useState } from 'react';
import {TailSpin} from 'react-loader-spinner'

import './index.css';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [apistatus, setApistatus] = useState(apiStatusConstants.initial);
  const apikey = '7cf586d5f401414d4b12c16f7b347229';

  const weatherDatas = async (city) => {
    try {
      setApistatus(apiStatusConstants.inProgress);
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${apikey}`);
      const fetchedData = await response.json();
      console.log(fetchedData);
      if (fetchedData && fetchedData.length > 0) {
        const { lat, lon } = fetchedData[0];
        tempDetails(lat, lon);
      }
      setWeatherData(fetchedData);
      setApistatus(apiStatusConstants.success);
    } catch (error) {
      console.error('Error fetching data:', error);
      setApistatus(apiStatusConstants.failure);
    }
  };

  const tempDetails = async (lat, lon) => {
    try {
      setApistatus(apiStatusConstants.inProgress);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
      const fetchedData = await response.json();
      console.log(fetchedData);
      setSelectedCity(fetchedData);
      setApistatus(apiStatusConstants.success);
    } catch (error) {
      console.error('Error fetching data:', error);
      setApistatus(apiStatusConstants.failure);
    }
  };

  const onChangeCityname = (event) => {
    setCity(event.target.value);
  };

  const onSubmitCityname = (event) => {
    event.preventDefault();
    weatherDatas(city);
    setCity('')
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      weatherDatas(city);
      setCity('')
    }
  };

  const onSelectCity = (event) => {
    const [lat, lon] = event.target.value.split(',');
    tempDetails(lat, lon);
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={onSubmitCityname}>
        <input
          type="search"
          placeholder="Search City"
          value={city}
          onChange={onChangeCityname}
          onKeyDown={onKeyDown}
        />
       <button type="submit" class="search-button">Search</button>
      </form>

      {apistatus === apiStatusConstants.inProgress && <div className="Loader-container">  <TailSpin type="TailSpin" color="#0284C7" height={50} width={50} /> </div>}
      {apistatus === apiStatusConstants.failure && <p>Failed to fetch data. Please try again.</p>}

      {weatherData &&  weatherData.length > 0 && (
        <div className="dropdown-container">
          <h3>Select state</h3>
          <select onChange={onSelectCity}>
            {weatherData.map((city, index) => (
              <option key={index} value={`${city.lat},${city.lon}`}>
                {city.state}
              </option>
            ))}
          </select>
        </div>
      )}


       {weatherData === null && <p class="dropdown-container">Enter a city to get weather information.</p>}


      {selectedCity  && (
        <div className="dropdown-container">
          <h2>Weather Details </h2>
          <p>Temperature: {Math.round(selectedCity.main.temp - 273.15)} °C</p>
          <p>Description: {selectedCity.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
