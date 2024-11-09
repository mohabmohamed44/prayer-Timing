import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
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
import { useState, useEffect } from "react";
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

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  const getTimings = async () => {
    console.log("calling the api");
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

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
  }, [timings]);

  // const data = await axios.get(
  // 	"https://api.aladhan.com/v1/timingsByCity?country=SA&city=Riyadh"
  // );

  const setupCountdownTimer = () => {
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
  };
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
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            py: 4,
          }}
        >
          {/* TOP ROW */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <h2>{today}</h2>
                <h1>{selectedCity.displayName}</h1>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <h2>
                  متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}
                </h2>
                <h1>{remainingTime}</h1>
              </Box>
            </Grid>
          </Grid>

          <Divider
            sx={{
              borderColor: "white",
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
              image="/src/assets/img.jpeg"
            />
            <Prayer
              name="العصر"
              time={timings.Asr}
              image="/src/assets/img1.jpeg"
            />
            <Prayer
              name="المغرب"
              time={timings.Sunset}
              image="/src/assets/img2.jpeg"
            />
            <Prayer
              name="العشاء"
              time={timings.Isha}
              image="/src/assets/img4.jpeg"
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
