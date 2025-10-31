import { useState } from "react";
import "./App.css";
// import Test from "./test";
import { createTheme, ThemeProvider } from "@mui/material";

// REACT
import { useEffect } from "react";

//MATERIAL UI COMPONENT

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// EXTERNAL LIBRARY
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

let concelAxios = null;
function App() {
  // ============== STATES ==============

  const { t, i18n } = useTranslation();
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale, setLocal] = useState("ar");
  const direction = locale == "ar" ? "rtl" : "ltr"

  // ============== EVENT HANDELERS ==============
  function handleLanguageClick() {
    if (locale == "ar") {
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
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);

  useEffect(() => {
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=34.802075&lon=38.996815&appid=e18ea0896663088be72dbb7f56771a78",
        {
          cancelToken: new axios.CancelToken((c) => {
            concelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        console.log(response.data);
        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => {
      concelAxios();
    };
  }, []);
  return (
    <div
      className="App"
      style={{
        textAlign: "center",
      }}
    >
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" style={{}}>
          {/* CONTENT CONTAINER */}
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
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
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
                    {t("Syria")}
                  </Typography>

                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}{" "}
                  </Typography>
                </div>
                {/* === CITY & TIME === */}

                <hr />
                {/* container of degree + cloud icon */}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
              dir={direction}
                >
                  {/* DEGREE & DESCRIPTION */}
                  <div>
                    {/* TEMP */}
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

                      <img src={temp.icon} />
                    </div>
                    {/* === TEMP === */}
                    <Typography variant="h6">{t(temp.description)}</Typography>
                    {/* MIN & MAX */}
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
                  {/* === DEGREE & DESCRIPTION === */}

                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
                {/* === container of degree + cloud icon === */}
              </div>
              {/* === CONTENT === */}
            </div>
            {/* === CARD === */}
            {/* TRANSLATION CONTAINER */}
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
                {locale == "en" ? "Arabic" : "انجليزي"}
              </Button>
            </div>
            {/* === TRANSLATION CONTAINER === */}
          </div>
          {/* === CONTENT CONTAINER === */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
