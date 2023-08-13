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

//TODO - add today date
function todayDate() {
    const todayDate = moment().format('ddd, MMMM D, YYYY');
    return todayDate;
}
document.getElementById('todayDate').innerHTML = todayDate();
//! **************************************** 1- declare variables End ****************************************
//! ****************************************** 2- fetch data from API ****************************************
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
    document.querySelector('#day0Icon').setAttribute('src', `${icon}`);
    document.querySelector('figcaption').innerHTML = text;
    document.getElementById('temp').innerHTML = `${Math.round(temp_c)}<sup class="display-6 ms-2">°C</sup>`;
    document.getElementById('day0').innerHTML = `<span class="text-primary">${temp_c}</span><sup class="text-primary ms-1">°C</sup>`
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
    const { day: day1 } = forecastday[1];
    const { day: day2 } = forecastday[2];
    const { day: day3 } = forecastday[3];
    const { day: day4 } = forecastday[4];
    const { day: day5 } = forecastday[5];
    const dayAfter1 = document.querySelector('.dayAfter1');
    const dayAfter2 = document.querySelector('.dayAfter2');
    const dayAfter3 = document.querySelector('.dayAfter3');
    const dayAfter4 = document.querySelector('.dayAfter4');

    const { avgtemp_c: avgTodayC, avgtemp_f: avgTodayF, condition: day1Cond } = day1
    const { avgtemp_c: avgDay1C, avgtemp_f: avgDay1F, condition: day2Cond } = day2
    const { avgtemp_c: avgDay2C, avgtemp_f: avgDay2F, condition: day3Cond } = day3
    const { avgtemp_c: avgDay3C, avgtemp_f: avgDay3F, condition: day4Cond } = day4
    const { avgtemp_c: avgDay4C, avgtemp_f: avgDay4F, condition: day5Cond } = day5

    document.querySelector('#day1').innerHTML = ` <span class="text-primary">${avgTodayC}</span><sup class="text-primary ms-1">°C</sup>`;
    document.querySelector('#day2').innerHTML = ` <span class="text-primary">${avgDay1C}</span><sup class="text-primary ms-1">°C</sup>`;
    document.querySelector('#day3').innerHTML = ` <span class="text-primary">${avgDay2C}</span><sup class="text-primary ms-1">°C</sup>`;
    document.querySelector('#day4').innerHTML = ` <span class="text-primary">${avgDay3C}</span><sup class="text-primary ms-1">°C</sup>`;
    document.querySelector('#day5').innerHTML = ` <span class="text-primary">${avgDay4C}</span><sup class="text-primary ms-1">°C</sup>`;
    changeTemp.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.querySelector('#day1').innerHTML = ` <span class="text-primary">${avgTodayF}</span><sup class="text-primary ms-1">°F</sup>`;
            document.querySelector('#day2').innerHTML = ` <span class="text-primary">${avgDay1F}</span><sup class="text-primary ms-1">°F</sup>`;
            document.querySelector('#day3').innerHTML = ` <span class="text-primary">${avgDay2F}</span><sup class="text-primary ms-1">°F</sup>`;
            document.querySelector('#day4').innerHTML = ` <span class="text-primary">${avgDay3F}</span><sup class="text-primary ms-1">°F</sup>`;
            document.querySelector('#day5').innerHTML = ` <span class="text-primary">${avgDay4F}</span><sup class="text-primary ms-1">°F</sup>`
        } else {
            document.querySelector('#day1').innerHTML = ` <span class="text-primary">${avgTodayC}</span><sup class="text-primary ms-1">°C</sup>`;
            document.querySelector('#day2').innerHTML = ` <span class="text-primary">${avgDay1C}</span><sup class="text-primary ms-1">°C</sup>`;
            document.querySelector('#day3').innerHTML = ` <span class="text-primary">${avgDay2C}</span><sup class="text-primary ms-1">°C</sup>`;
            document.querySelector('#day4').innerHTML = ` <span class="text-primary">${avgDay3C}</span><sup class="text-primary ms-1">°C</sup>`;
            document.querySelector('#day5').innerHTML = ` <span class="text-primary">${avgDay4C}</span><sup class="text-primary ms-1">°C</sup>`;

        }
    })

    dayAfter1.innerHTML = moment().add(2, 'days').format('ddd');
    dayAfter2.innerHTML = moment().add(3, 'days').format('ddd');
    dayAfter3.innerHTML = moment().add(4, 'days').format('ddd');
    dayAfter4.innerHTML = moment().add(5, 'days').format('ddd');

    document.querySelector('#day1Icon').setAttribute('src', `${day1Cond.icon}`);
    document.querySelector('#day2Icon').setAttribute('src', `${day2Cond.icon}`);
    document.querySelector('#day3Icon').setAttribute('src', `${day3Cond.icon}`);
    document.querySelector('#day4Icon').setAttribute('src', `${day4Cond.icon}`);
    document.querySelector('#day5Icon').setAttribute('src', `${day5Cond.icon}`);
}
//! ****************************************** 2- fetch data from API End ****************************************
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