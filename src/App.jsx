import { useState, useEffect } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";
import { useTranslation } from "react-i18next";

moment.locale("ar");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

function App() {
  const { t, i18n } = useTranslation();

  // ============== STATES ==============
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale, setLocal] = useState("ar");
  const [country, setCountry] = useState("Syria"); // ✅ الدولة الافتراضية
  const direction = locale === "ar" ? "rtl" : "ltr";

  // ✅ قائمة البلدان
  const countries = [
    "Syria",
    "Lebanon",
    "Jordan",
    "Iraq",
    "Egypt",
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Bahrain",
    "Oman",
    "Yemen",
    "Turkey",
    "France",
    "Germany",
    "United Kingdom",
    "United States",
    "China",
    "Japan",
    "India",
  ];

  // ============== EVENT HANDLERS ==============
  function handleLanguageClick() {
    if (locale === "ar") {
      setLocal("en");
      moment.locale("en");
      i18n.changeLanguage("en");
    } else {
      setLocal("ar");
      moment.locale("ar");
      i18n.changeLanguage("ar");
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }

  async function fetchWeather(selectedCountry) {
    try {
      setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry}&appid=e18ea0896663088be72dbb7f56771a78`
      );

      const responseTemp = Math.round(response.data.main.temp - 272.15);
      const min = Math.round(response.data.main.temp_min - 272.15);
      const max = Math.round(response.data.main.temp_max - 272.15);
      const description = response.data.weather[0].description;
      const responseIcon = response.data.weather[0].icon;

      setTemp({
        number: responseTemp,
        min,
        max,
        description,
        icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("⚠️ لم يتم العثور على هذه المدينة. حاول اختيار بلد آخر.");
    }
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
    fetchWeather(country);
  }, []);

  useEffect(() => {
    fetchWeather(country);
  }, [country]);

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            {/* CARD */}
            <div
              dir={direction}
              style={{
                width: "100%",
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "0px 15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
              }}
            >
              {/* SELECT COUNTRY */}
              <FormControl
                fullWidth
                size="small"
                style={{
                  background: "white",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                <InputLabel>{t("")}</InputLabel>
                <Select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  label={t("Country")}
                >
                  {countries.map((c) => (
                    <MenuItem key={c} value={c}>
                      {t(c)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* CONTENT */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                  dir={direction}
                >
                  <Typography
                    variant="h2"
                    style={{ marginRight: "20px", fontWeight: "600" }}
                  >
                    {t(country)}
                  </Typography>

                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>

                <hr />

                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                  dir={direction}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} alt="weather icon" />
                    </div>

                    <Typography variant="h6">{t(temp.description)}</Typography>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("min")}: {temp.min}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}>|</h5>
                      <h5>
                        {t("max")}: {temp.max}
                      </h5>
                    </div>
                  </div>

                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
              </div>
            </div>

            {/* TRANSLATION BUTTON */}
            <div
              dir={direction}
              style={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Button
                style={{ color: "white" }}
                variant="text"
                onClick={handleLanguageClick}
              >
                {locale === "en" ? "Arabic" : "انجليزية"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
