//? **************************************** Site Structure ****************************************
// 1- declare variables
//            - set today date
// 2- fetch data from API
// 3- get currant location for user
// 4- get weather data with current location
// 5- split data adn send it to functions that show on dom
//? **************************************** Site Structure End ****************************************
//! **************************************** 1- declare variables ****************************************
const api = "https://api.weatherapi.com/v1/forecast.json";
const apiKey = "key=a9f6a95cfc1449d3936200309252710";
const apiUrl = `${api}?${apiKey}`;
const changeTemp = document.querySelector('input[name="changeTemp"]');
const searchInput = document.getElementById("search");
const hourlyTempElements = document.querySelectorAll(".hourlyTemp");
const dailyTempElements = document.querySelectorAll(".dailyTemp");

//TODO - add today date
function todayDate() {
    const todayDate = moment().format("ddd, MMMM D, YYYY");
    return todayDate;
}
document.getElementById("todayDate").innerHTML = todayDate();
//! **************************************** 1- declare variables End ****************************************
//! ****************************************** 2- fetch data from API and Handle Errors ****************************************
async function getWeather(searchKey) {
    try {
        const res = await fetch(`${apiUrl}&q=${searchKey}&days=6`);
        if (res.status !== 200) {
            throw new Error(showError());
        }
        const { location, current, forecast } = await res.json();
        let { condition } = current;
        displayHeaderData(location, current, forecast);
        displayHours(forecast);
        displayDays(forecast);
        changeWallpaper(condition);
    } catch (err) {
        console.log(err);
    }
}
function showError() {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    Toast.fire({
        icon: "error",
        title: "You must enter a valid city",
    });
}
//! ****************************************** 2- fetch data from API and Handle Errors End ****************************************
function displayHeaderData(location, current, forecast) {
    const minMaxTemp = document.getElementById("minMaxTemp");
    const { name: city, country } = location;
    const { temp_c, temp_f, condition, wind_kph, wind_dir, cloud, humidity } =
        current;
    const { icon, text } = condition;
    const { forecastday } = forecast;
    const { day: today } = forecastday[0];
    const {
        maxtemp_c: maxTempToday_c,
        mintemp_c: minTempToday_c,
        maxtemp_f: maxTempToday_f,
        mintemp_f: minTempToday_f,
    } = today;
    const currantHour = document.getElementById("curruntHour");
    document.getElementById("city").innerHTML = city;
    document.getElementById("country").innerHTML = country;
    document.querySelector(".weatherIcon").setAttribute("src", icon);
    document.querySelector(".hourlyIcons0").setAttribute("src", icon);
    document.querySelector("figcaption").innerHTML = text;
    document.getElementById("temp").innerHTML = `${Math.round(
        temp_c
    )}<sup class="display-6 ms-2">°C</sup>`;
    document.getElementById("wind").innerHTML = `${wind_kph} kp/h`;
    document.getElementById("humidity").innerHTML = `${humidity}%`;
    document.getElementById("cloud").innerHTML = `${cloud}%`;
    document.getElementById("windDir").innerHTML = wind_dir;
    currantHour.innerHTML = ` <span class="text-primary">${temp_c}</span><sup class="text-primary ms-1">°C</sup>`;

    const minMaxTempContent = `
        <span class="text-primary">${Math.round(minTempToday_c)}
        <sup class="text-primary ms-1">o</sup>
        </span>
        /
        <span class='text-primary'} ms-2">${Math.round(
            maxTempToday_c
        )}<sup class="ms-1 text-primary">o</sup></span>
        
    `;
    minMaxTemp.innerHTML = minMaxTempContent;

    changeTemp.addEventListener("change", (e) => {
        const newTempUnit = e.target.checked ? "F" : "C";
        updateTemperatureDisplay(newTempUnit);
        updateMinMaxTempContent(newTempUnit);
    });

    function updateTemperatureDisplay(unit) {
        const tempValue =
            unit === "F" ? Math.round(temp_f) : Math.round(temp_c);
        const tempUnit = unit === "F" ? "°F" : "°C";
        document.getElementById(
            "temp"
        ).innerHTML = `${tempValue}<sup class="display-6 ms-2">${tempUnit}</sup>`;
        currantHour.innerHTML = ` <span class="text-primary">${tempValue}</span><sup class="text-primary ms-1">${tempUnit}</sup>`;
    }
    function updateMinMaxTempContent(unit) {
        const minTemp =
            unit === "F"
                ? Math.round(minTempToday_f)
                : Math.round(minTempToday_c);
        const maxTemp =
            unit === "F"
                ? Math.round(maxTempToday_f)
                : Math.round(maxTempToday_c);
        const tempColorClass = minTemp > 15 ? "text-primary" : "text-danger";
        const updatedMinMaxTempContent = `
            <span class="${tempColorClass}">${minTemp}<sup class=" ${tempColorClass} ms-1">o</sup></span>
            /
            <span class="${tempColorClass} ms-2">${maxTemp}</span>
            <sup class="ms-1 ${tempColorClass}">o</sup>
        `;
        minMaxTemp.innerHTML = updatedMinMaxTempContent;
    }
}
function displayHours(forecast) {
    const { forecastday } = forecast;
    const { hour: hour0 } = forecastday[0];
    const timeTempData = [
        {
            tempC: hour0[0].temp_c,
            tempF: hour0[0].temp_f,
            icon: hour0[0].condition.icon,
        },
        {
            tempC: hour0[3].temp_c,
            tempF: hour0[3].temp_f,
            icon: hour0[3].condition.icon,
        },
        {
            tempC: hour0[6].temp_c,
            tempF: hour0[6].temp_f,
            icon: hour0[6].condition.icon,
        },
        {
            tempC: hour0[9].temp_c,
            tempF: hour0[9].temp_f,
            icon: hour0[9].condition.icon,
        },
        {
            tempC: hour0[12].temp_c,
            tempF: hour0[12].temp_f,
            icon: hour0[12].condition.icon,
        },
    ];
    updateTemperatureDisplay("C");
    function updateTemperatureDisplay(unit) {
        hourlyTempElements.forEach((hourlyTempElement, index) => {
            hourlyTempElement.innerHTML = "";
            const span = document.createElement("span");
            const sup = document.createElement("sup");
            span.classList.add("text-primary");
            span.appendChild(
                document.createTextNode(
                    timeTempData[index][unit === "C" ? "tempC" : "tempF"]
                )
            );
            span.appendChild(sup);
            sup.appendChild(
                document.createTextNode(unit === "F" ? "°F" : "°C")
            );
            hourlyTempElement.appendChild(span);
        });
    }
    changeTemp.addEventListener("change", (e) => {
        if (e.target.checked) {
            updateTemperatureDisplay("F");
        } else {
            updateTemperatureDisplay("C");
        }
    });
    function updateTemperatureIcons() {
        const hourlyTempIcons = document.querySelectorAll(".hourlyTempIcon");
        hourlyTempIcons.forEach((hourlyTempIcon, index) => {
            hourlyTempIcon.setAttribute("src", timeTempData[index].icon);
        });
    }
    updateTemperatureIcons();
}
function displayDays(forecast) {
    const { forecastday } = forecast;
    const dailyData = [
        {
            tempC: forecastday[0].day.avgtemp_c,
            tempF: forecastday[0].day.avgtemp_f,
            icon: forecastday[0].day.condition.icon,
        }, //Today
        {
            tempC: forecastday[1].day.avgtemp_c,
            tempF: forecastday[1].day.avgtemp_f,
            icon: forecastday[1].day.condition.icon,
        }, //Next Day
        {
            tempC: forecastday[2].day.avgtemp_c,
            tempF: forecastday[2].day.avgtemp_f,
            icon: forecastday[2].day.condition.icon,
        }, //Next Day+1
        {
            tempC: forecastday[3].day.avgtemp_c,
            tempF: forecastday[3].day.avgtemp_f,
            icon: forecastday[3].day.condition.icon,
        }, //Next Day+2
        {
            tempC: forecastday[4].day.avgtemp_c,
            tempF: forecastday[4].day.avgtemp_f,
            icon: forecastday[4].day.condition.icon,
        }, //Next Day+3
        {
            tempC: forecastday[5].day.avgtemp_c,
            tempF: forecastday[5].day.avgtemp_f,
            icon: forecastday[5].day.condition.icon,
        }, //Next Day+4
    ];
    updateDailyTempDisplay("C");
    updateDailyTempIcons();
    dayDate();
    function updateDailyTempDisplay(unit) {
        dailyTempElements.forEach((dailyTempElement, index) => {
            dailyTempElement.innerHTML = "";
            const span = document.createElement("span");
            const sup = document.createElement("sup");
            span.classList.add("text-primary");
            span.appendChild(
                document.createTextNode(
                    dailyData[index][unit === "C" ? "tempC" : "tempF"]
                )
            );
            span.appendChild(sup);
            sup.appendChild(
                document.createTextNode(unit === "F" ? "°F" : "°C")
            );
            dailyTempElement.appendChild(span);
        });
    }
    changeTemp.addEventListener("change", (e) => {
        if (e.target.checked) {
            updateDailyTempDisplay("F");
        } else {
            updateDailyTempDisplay("C");
        }
    });
    function updateDailyTempIcons() {
        const dailyTempIcons = document.querySelectorAll(".dailyTempIcon");
        dailyTempIcons.forEach((dailyTempIcon, index) => {
            dailyTempIcon.setAttribute("src", dailyData[index].icon);
        });
    }
    function dayDate() {
        const dayDate = document.querySelectorAll(".dayDate");
        dayDate.forEach((dayDate, index) => {
            dayDate.innerHTML = moment()
                .add(index + 1, "days")
                .format("ddd");
        });
    }
}

//! ****************************************** 3- get currant location for user ****************************************
function getUserLocation() {
    showLoadingScreen();

    const success = (position) => {
        const latitude = position.coords.latitude.toFixed(4);
        const longitude = position.coords.longitude.toFixed(4);
        const currentLoc = `${latitude},${longitude}`;
        console.log("✅ Current Location: - main.js:286", currentLoc);
        getWeather(currentLoc);
        setTimeout(hideLoadingScreen, 2000);
    };

    const error = (err) => {
        console.warn("⚠️ Geolocation failed: - main.js:292", err.message);
        // بدل random بإحداثيات ثابتة شغالة (مثلاً القاهرة)
        const fallbackLoc = "30.0444,31.2357";
        getWeather(fallbackLoc);
        setTimeout(hideLoadingScreen, 2000);
    };

    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

getUserLocation();

searchInput.addEventListener("keyup", (e) => {
    if (e.target.value.length > 0) {
        if (e.key === "Enter") {
            getWeather(searchInput.value);
        }
    }
});
document.querySelector("#searchBtn").addEventListener("click", (e) => {
    if (searchInput.value.length > 0) {
        getWeather(searchInput.value);
    }
});

function showLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");
    loadingScreen.classList.replace("d-none", "d-flex");
    document.querySelector("section").classList.replace("d-flex", "d-none");
}

function hideLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");
    loadingScreen.classList.replace("d-flex", "d-none");
    document.querySelector("section").classList.replace("d-none", "d-flex");
}
