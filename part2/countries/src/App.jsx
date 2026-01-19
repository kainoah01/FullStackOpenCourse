import { useState, useEffect } from "react";
import countryService from "./services/countries.js";
import Country from "./components/Country.jsx";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);

    // Filter counstries based on user input
    const filteredCountries = countries.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    console.log(filteredCountries);

    setCountries(filteredCountries);
  };

  const handleSelectCountry = (countryName) => {
    const selectedCountry = countries.filter(
      (country) => country.name.common === countryName
    );
    setCountries(selectedCountry);
  };

  // Fetch all countries from the API
  useEffect(() => {
    countryService.getAllCountries().then((initialCountries) => {
      setCountries(initialCountries);
    });
  }, []);

  return (
    <>
      <div>
        <p>
          find countries
          <input value={filter} onChange={handleFilterChange} />
        </p>
        {countries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countries.length === 1 ? (
          <div>
            <Country countryObject={countries[0]} />
          </div>
        ) : (
          countries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleSelectCountry(country.name.common)}>
                Show
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
