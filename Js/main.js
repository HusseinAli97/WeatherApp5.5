//? **************************************** Site Structure ****************************************
// 1- declare variables
//            - set today date
// 2- fetch data from API
// 3- get currant location for user
// 4- get weather data with current location
// 5- split data adn send it to functions that show on dom
//? **************************************** Site Structure End ****************************************
//! **************************************** 1- declare variables ****************************************
const api = 'https://api.weatherapi.com/v1/forecast.json?';
const apiKey = 'key=a222c6df791a4ef486513234231208';
const apiUrl = api + apiKey;
const changeTemp = document.querySelector('input[name="changeTemp"]');
const searchInput = document.getElementById('search');
const hourlyTempElements = document.querySelectorAll('.hourlyTemp');
const dailyTempElements = document.querySelectorAll('.dailyTemp');

//TODO - add today date
function todayDate() {
    const todayDate = moment().format('ddd, MMMM D, YYYY');
    return todayDate;
}
document.getElementById('todayDate').innerHTML = todayDate();
//! **************************************** 1- declare variables End ****************************************
//! ****************************************** 2- fetch data from API and Handle Errors ****************************************
async function getWeather(searchKey) {
    try {
        const res = await fetch(`${apiUrl}&q=${searchKey}&days=6`);
        if (res.status !== 200) {
            throw new Error(showError());
        }
        const { location, current, forecast } = await res.json();
        displayOnHeader(location, current, forecast);
        displayHours(forecast);
        displayDays(forecast);
    }
    catch (err) {
        console.log(err);
    }
}
function showError() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: 'error',
        title: 'You must enter a valid city'
    })
}
//! ****************************************** 2- fetch data from API and Handle Errors End ****************************************
function displayOnHeader(location, current, forecast) {
    const minMaxTemp = document.getElementById('minMaxTemp');
    const { name: city, country } = location;
    const { temp_c, temp_f, condition, wind_kph, wind_dir, cloud, humidity } = current;
    const { icon, text } = condition //NOTE - icon + text distribution from condition
    const { forecastday } = forecast;
    const { day: today } = forecastday[0];
    const { maxtemp_c: maxTempToday_c, mintemp_c: minTempToday_c, maxtemp_f: maxTempToday_f, mintemp_f: minTempToday_f } = today
    const currantHour = document.getElementById('curruntHour')
    document.getElementById('city').innerHTML = city;
    document.getElementById('country').innerHTML = country;
    document.querySelector('.weatherIcon').setAttribute('src', `${icon}`);
    document.querySelector('.hourlyIcons0').setAttribute('src', `${icon}`);
    document.querySelector('figcaption').innerHTML = text;
    document.getElementById('temp').innerHTML = `${Math.round(temp_c)}<sup class="display-6 ms-2">°C</sup>`;
    document.getElementById('wind').innerHTML = `${wind_kph} kp/h`;
    document.getElementById('humidity').innerHTML = `${humidity}%`;
    document.getElementById('cloud').innerHTML = `${cloud}%`;
    document.getElementById('windDir').innerHTML = wind_dir;
    currantHour.innerHTML = ` <span class="text-primary">${temp_c}</span><sup class="text-primary ms-1">°C</sup>`;
    const span = document.createElement('span');
    const sup = document.createElement('sup');
    minMaxTemp.innerHTML = `
        <span class="text-primary" id="">${Math.round(minTempToday_c)}</span>
    <sup class="ms-1 text-primary me-2">o</sup>
/
    <span class="text-danger ms-2">${Math.round(maxTempToday_c)}</span>
    <sup class="ms-1 text-danger">o</sup>
    `;
    if (minTempToday_c > 15) {
        span.classList.add('text-danger');
        sup.classList.add('text-danger');
    } else {
        span.classList.add('text-primary');
        sup.classList.add('text-primary');
    }

    changeTemp.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('temp').innerHTML = `${Math.round(temp_f)}<sup class="display-6 ms-2">°F</sup>`;
            minMaxTemp.innerHTML = `
            <span class="text-primary" id="">${Math.round(minTempToday_f)}</span>
            <sup class="ms-1 text-primary me-2">o</sup>
            /
            <span class="text-danger ms-2">${Math.round(maxTempToday_f)}</span>
            <sup class="ms-1 text-danger">o</sup>`;
            currantHour.innerHTML = ` <span class="text-primary">${temp_f}</span><sup class="text-primary ms-1">°F</sup>`;
            document.getElementById('day0').innerHTML = `<span class="text-primary">${temp_f}</span><sup class="text-primary ms-1">°F</sup>`
        } else {
            document.getElementById('temp').innerHTML = `${Math.round(temp_c)}<sup class="display-6 ms-2">°C</sup>`;
            minMaxTemp.innerHTML = `
            <span class="text-primary" id="">${Math.round(minTempToday_c)}</span>
        <sup class="ms-1 text-primary me-2">o</sup>
    /
        <span class="text-danger ms-2">${Math.round(maxTempToday_c)}</span>
        <sup class="ms-1 text-danger">o</sup>
        `;
            currantHour.innerHTML = ` <span class="text-primary">${temp_c}</span><sup class="text-primary ms-1">°C</sup>`
            document.getElementById('day0').innerHTML = `<span class="text-primary">${temp_c}</span><sup class="text-primary ms-1">°C</sup>`
        }
    })

}
function displayHours(forecast) {
    const { forecastday } = forecast;
    const { hour: hour0, } = forecastday[0];
    const timeTempData = [
        { tempC: hour0[0].temp_c, tempF: hour0[0].temp_f, icon: hour0[0].condition.icon },
        { tempC: hour0[3].temp_c, tempF: hour0[3].temp_f, icon: hour0[3].condition.icon },
        { tempC: hour0[6].temp_c, tempF: hour0[6].temp_f, icon: hour0[6].condition.icon },
        { tempC: hour0[9].temp_c, tempF: hour0[9].temp_f, icon: hour0[9].condition.icon },
        { tempC: hour0[12].temp_c, tempF: hour0[12].temp_f, icon: hour0[12].condition.icon }
    ];
    updateTemperatureDisplay('C');
    updateTemperatureIcons();
    function updateTemperatureDisplay(unit,) {
        hourlyTempElements.forEach((hourlyTempElement, index) => {
            hourlyTempElement.innerHTML = '';
            const span = document.createElement('span');
            const sup = document.createElement('sup');
            span.classList.add('text-primary');
            span.appendChild(document.createTextNode(timeTempData[index][unit === 'C' ? 'tempC' : 'tempF']));
            span.appendChild(sup);
            sup.appendChild(document.createTextNode(unit === 'F' ? '°F' : '°C'));
            hourlyTempElement.appendChild(span);
        })
    }
    changeTemp.addEventListener('change', (e) => {
        if (e.target.checked) {
            updateTemperatureDisplay('F');
        } else {
            updateTemperatureDisplay('C');
        }
    })
    function updateTemperatureIcons() {
        const hourlyTempIcons = document.querySelectorAll('.hourlyTempIcon');
        hourlyTempIcons.forEach((hourlyTempIcon, index) => {
            hourlyTempIcon.setAttribute('src', timeTempData[index].icon);
        })
    }
}
function displayDays(forecast) {
    const { forecastday } = forecast;
    const dailyData = [
        { tempC: forecastday[0].day.avgtemp_c, tempF: forecastday[0].day.avgtemp_f, icon: forecastday[0].day.condition.icon },//Today
        { tempC: forecastday[1].day.avgtemp_c, tempF: forecastday[1].day.avgtemp_f, icon: forecastday[1].day.condition.icon },//Next Day
        { tempC: forecastday[2].day.avgtemp_c, tempF: forecastday[2].day.avgtemp_f, icon: forecastday[2].day.condition.icon },//Next Day+1
        { tempC: forecastday[3].day.avgtemp_c, tempF: forecastday[3].day.avgtemp_f, icon: forecastday[3].day.condition.icon },//Next Day+2
        { tempC: forecastday[4].day.avgtemp_c, tempF: forecastday[4].day.avgtemp_f, icon: forecastday[4].day.condition.icon },//Next Day+3
        { tempC: forecastday[5].day.avgtemp_c, tempF: forecastday[5].day.avgtemp_f, icon: forecastday[5].day.condition.icon } //Next Day+4
    ];
    updateDailyTempDisplay('C');
    updateDailyTempIcons();
    dayDate()
    function updateDailyTempDisplay(unit) {
        dailyTempElements.forEach((dailyTempElement, index) => {
            dailyTempElement.innerHTML = '';
            const span = document.createElement('span');
            const sup = document.createElement('sup');
            span.classList.add('text-primary');
            span.appendChild(document.createTextNode(dailyData[index][unit === 'C' ? 'tempC' : 'tempF']));
            span.appendChild(sup);
            sup.appendChild(document.createTextNode(unit === 'F' ? '°F' : '°C'));
            dailyTempElement.appendChild(span);
        });
    }
    changeTemp.addEventListener('change', (e) => {
        if (e.target.checked) {
            updateDailyTempDisplay('F');
        } else {
            updateDailyTempDisplay('C');
        }
    });
    function updateDailyTempIcons() {
        const dailyTempIcons = document.querySelectorAll('.dailyTempIcon');
        dailyTempIcons.forEach((dailyTempIcon, index) => {
            dailyTempIcon.setAttribute('src', dailyData[index].icon);
        })
    }
    function dayDate() {
        const dayDate = document.querySelectorAll('.dayDate');
        dayDate.forEach((dayDate, index) => {
            dayDate.innerHTML = moment().add(index + 1, 'days').format('ddd');
        })
    }
}

//! ****************************************** 3- get currant location for user ****************************************
function getUserLocation() {
    const success = (position) => {
        const currantLoc = `${position.coords.latitude},${position.coords.longitude}`;
        getWeather(currantLoc);
    }
    const error = () => {
        const latitude = (Math.random() * 180 - 90).toFixed(4);
        const longitude = (Math.random() * 360 - 180).toFixed(4);
        getWeather(`${latitude},${longitude}`);
    }
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}
getUserLocation();

searchInput.addEventListener('keyup', (e) => {
    if (e.target.value.length > 0) {
        if (e.key === 'Enter') {
            getWeather(searchInput.value);
        }
    } else {
        showError();
    }
})
document.querySelector('#searchBtn').addEventListener('click', (e) => {
    if (searchInput.value.length > 0) {
        getWeather(searchInput.value);
    } else {
        showError();
    }
})