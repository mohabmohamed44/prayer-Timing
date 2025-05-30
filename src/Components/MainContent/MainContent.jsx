import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import Prayer from "../Prayer/Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Container } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import axios from "axios";
import moment from "moment";
import { useState, useEffect, useCallback, useMemo } from "react";
import "moment/dist/locale/ar-dz";
moment.locale("ar");
export default function MainContent() {
  // STATES
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Sunset: "18:03",
    Isha: "19:33",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const [selectedCity, setSelectedCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });

  const [today, setToday] = useState("");

  const avilableCities = [
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
    {
      displayName: "جدة",
      apiName: "Jeddah",
    },
    {
      displayName: "القاهرة",
      apiName: "Cairo",
    },
  ];

  const prayersArray = useMemo(() => [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ], []);
  const getTimings = useCallback(async () => {
    console.log("calling the api");
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  }, [selectedCity]);
  
  useEffect(() => {
    getTimings();
  }, [getTimings]);

  const setupCountdownTimer = useCallback(() => {
    const momentNow = moment();
    let prayerIndex = 2;
    
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration is: ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  }, [timings, prayersArray]);

  useEffect(() => {
    let interval = setInterval(() => {
      console.log("calling timer");
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [setupCountdownTimer]);

  // const data = await axios.get(
  // 	"https://api.aladhan.com/v1/timingsByCity?country=SA&city=Riyadh"
  // );

  

  useEffect(() => {
    let interval = setInterval(() => {
      console.log("calling timer");
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [setupCountdownTimer]);

  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log("the new value is ", event.target.value);
    setSelectedCity(cityObject);
  };

  return (
    <>
      {/* TOP ROW */}
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            py: 6,
          }}
        >
          {/* IDENTIFICATION */}
          <Grid container spacing={4} justifyContent="center">
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography variant="h4" component="h2" color="white">
                {today}
                <Typography
                  component="span"
                  variant="h5"
                  sx={{ ml: 2 }}
                  color="white"
                >
                  {selectedCity.displayName}
                </Typography>
              </Typography>
            </Grid>
          </Grid>

          {/* COUNTDOWN */}
          <Box
            sx={{
              my: 4,
              p: 2,
              bgcolor: "rgba(0, 0, 0, 0.4)",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="white" gutterBottom>
              متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}
            </Typography>
            <Typography variant="h3" color="#00e5ff" component="div">
              {remainingTime}
            </Typography>
          </Box>
          
          <Divider
            sx={{
              borderColor: "rgba(255,255,255,0.1)",
              opacity: 0.1,
              my: 4,
            }}
          />

          {/* PRAYERS CARDS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            gap={4}
            alignItems="center"
            sx={{ my: 4 }}
          >
            <Prayer
              name="الفجر"
              time={timings.Fajr}
              image="https://islam4u.pro/blog/wp-content/uploads/2024/09/islam4u_77256_Lessons_in_Leadership_from_Prophet_Muhammad_PBUH__3d446e53-40f3-4da1-af65-cd12778ab31d.png"
            />
            <Prayer
              name="الظهر"
              time={timings.Dhuhr}
              image="https://kharchoufa.com/en/wp-content/uploads/2024/05/deepening_connection_through_prayer-1.jpg"
            />
            <Prayer
              name="العصر"
              time={timings.Asr}
              image="https://www.islamic-relief.org.uk/wp-content/smush-webp/2022/11/salah-hero-1.jpg.webp"
            />
            <Prayer
              name="المغرب"
              time={timings.Sunset}
              image="https://images.squarespace-cdn.com/content/v1/5c9e26a35df2930001c476e3/1555292187320-0B5V0EHTM5MY7E27POKZ/b156ba2538815c72a32d7d238f922eea.jpg?format=1500w"
            />
            <Prayer
              name="العشاء"
              time={timings.Isha}
              image="https://peacemagazine.com.ng/wp-content/uploads/2024/07/man-praying-in-a-masjid.jpg"
            />
          </Stack>

          {/* SELECT CITY */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <FormControl sx={{ width: { xs: "80%", sm: "50%", md: "20%" } }}>
              <InputLabel id="city-select-label">
                <span style={{ color: "white" }}>المدينة</span>
              </InputLabel>
              <Select
                sx={{ color: "white" }}
                labelId="city-select-label"
                id="city-select"
                label="المدينة"
                onChange={handleCityChange}
              >
                {avilableCities.map((city) => (
                  <MenuItem value={city.apiName} key={city.apiName}>
                    {city.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Container>
    </>
  );
}
