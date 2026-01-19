const Country = ({ countryObject }) => {
  return (
    <>
      <h1>{countryObject.name.common}</h1>
      <p>{countryObject.capital}</p>
      <p>Area {countryObject.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(countryObject.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={countryObject.flags.png}
        alt={`Flag of ${countryObject.name.common}`}
      />
    </>
  );
};

export default Country;
