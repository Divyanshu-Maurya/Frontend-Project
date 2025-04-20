// Weather API setup
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

// Preload background images
const bgImages = [
    'bg.jpg',
    'bg1.jpg',
    'clear.jpg',
    'clouds.jpg',
    'drizzle.jpg',
    'mist.jpg',
    'rainy.jpg',
    'snow.jpg',
    'sunny.jpg',
    'thunderstorm.jpg',
    'fog.jpg'
];

bgImages.forEach(imgName => {
    const img = new Image();
    img.src = `img/${imgName}`;
});

// Event: Trigger on Enter key press
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherReport(searchInputBox.value);
    }
});

// Fetch weather data
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(showWeatherReport);
}

// Show weather data
function showWeatherReport(weather) {
    let code = weather.cod;

    if (code === '400') {
        swal("Empty Input", "Please enter a city", "error");
        reset();
    } else if (code === '404') {
        swal("Not Found", "City not recognized", "warning");
        reset();
    } else {
        const op = document.getElementById('weather-body');
        op.style.display = 'block';

        const todayDate = new Date();

        op.innerHTML = `
            <div class="location-deatils">
                <div class="city">${weather.name}, ${weather.sys.country}</div>
                <div class="date">${dateManage(todayDate)}</div>
            </div>
            <div class="weather-status">
                <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
                <div class="weather">${weather.weather[0].main} 
                    <i class="${getIconClass(weather.weather[0].main)}"></i>
                </div>
                <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
                <div id="updated_on">Updated at ${getTime(todayDate)}</div>
            </div>
            <hr>
            <div class="day-details">
                <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}% <br>
                    Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH
                </div>
            </div>
        `;

        changeBg(weather.weather[0].main);
        reset();
    }
}

// Time helpers
function getTime(date) {
    let hour = addZero(date.getHours());
    let minute = addZero(date.getMinutes());
    return `${hour}:${minute}`;
}

function addZero(i) {
    return i < 10 ? "0" + i : i;
}

// Date formatter
function dateManage(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];

    return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]}) , ${date.getFullYear()}`;
}

// Background changer with fade-in effect
function changeBg(status) {
    const bgMap = {
        Clouds: 'clouds.jpg',
        Rain: 'rainy.jpg',
        Clear: 'clear.jpg',
        Snow: 'snow.jpg',
        Sunny: 'sunny.jpg',
        Thunderstorm: 'thunderstorm.jpg',
        Drizzle: 'drizzle.jpg',
        Mist: 'mist.jpg',
        Haze: 'mist.jpg',
        Fog: 'fog.jpg'
    };

    const imageName = bgMap[status] || 'bg1.jpg';
    const body = document.body;

    // Apply fade effect
    body.style.transition = 'background-image 0.5s ease-in-out';
    body.style.backgroundImage = `url('img/${imageName}')`;
}

// Weather icon generator
function getIconClass(type) {
    const icons = {
        Rain: 'fas fa-cloud-showers-heavy',
        Clouds: 'fas fa-cloud',
        Clear: 'fas fa-cloud-sun',
        Snow: 'fas fa-snowman',
        Sunny: 'fas fa-sun',
        Mist: 'fas fa-smog',
        Thunderstorm: 'fas fa-bolt',
        Drizzle: 'fas fa-cloud-rain'
    };
    return icons[type] || 'fas fa-cloud-sun';
}

// Clear input
function reset() {
    searchInputBox.value = "";
}

// Theme Toggle with background brightness adjustment
const themeToggleBtn = document.getElementById('theme-toggle-btn');
themeToggleBtn.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark');
    body.classList.toggle('light');

    // Toggle icon
    themeToggleBtn.textContent = body.classList.contains('dark') ? '☀️' : '🌙';

    // Adjust brightness filter for background
    if (body.classList.contains('dark')) {
        body.style.filter = 'brightness(0.7)';
    } else {
        body.style.filter = 'brightness(1)';
    }
});
