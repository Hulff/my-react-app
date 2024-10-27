import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    main: string;
  }[];
  name: string;
}

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  const API_KEY = "bcda10ba323e88e96cb486015a104d1d";

  const fetchWeatherData = async (city: string) => {
    try {
      console.log(city)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
    }
  };
  useEffect(() => {
    const previousCity = localStorage.getItem("city") || "sao paulo";
    console.log("Previous city from localStorage or default:", previousCity);
    setCity(previousCity);
    fetchWeatherData(previousCity);
  }, []);



  const handleInputChange = (event: any) => {
    setCity(event.target.value);
    localStorage.setItem("city", event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetchWeatherData(city);
  };

  const getWeatherIconUrl = (main: string) => {
    switch (main) {
      case "Clouds":
        return "/thunder.png";
      case "Rain":
        return "/rain_with_cloud.png";
      case "Mist":
        return "/Tornado.png";
      case "Haze":
        return "/sun.png";
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="container_date">{formattedDate}</h1>
        {weatherData ? (
          <>
            <div className="container_appear">
              <div className="weather_data">
                <h2 className="container_city">{weatherData.name}</h2>
                <img
                  className="container_img"
                  src={getWeatherIconUrl(weatherData.weather[0].main)}
                  width="180px"
                  alt="Weather Icon"
                />
                <h2 className="container_degree">{weatherData.main.temp}°C</h2>
                <h2 className="country_per">{weatherData.weather[0].main}</h2>
              </div>
              <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter city name"
                  value={city}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit">search</button>
              </form>
            </div>
          </>
        ) : (
          <>
              <div className="loading_div">
                <SyncLoader color="#ffffff" />
              </div>
              <button className="button_cancel_search" onClick={() => {
                setCity("sao paulo")
                fetchWeatherData("sao paulo")
                localStorage.setItem("city", "sao paulo");

              }}>cancel</button>
          </>
        )}


      </div>
    </div>
  );
}

export default App;
