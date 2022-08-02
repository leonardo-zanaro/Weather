const api = {
    key: '5dea246d113680103774abc496c41e35',
    region: 'pt_br',
    url: 'https://api.openweathermap.org/data/2.5/'
}
let lon;
let lat;

const dayComplete = document.querySelector("#today");
const city = document.querySelector("#city");
const temp = document.querySelector("#temperature");
const weather = document.querySelector("#weather");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const icon = document.querySelector("#icon");
const windSpeed = document.querySelector("#wind-speed");
const listForecast = document.querySelector("#list-forecast");
const tempMax = document.querySelector("#temp-max");
const tempMin = document.querySelector("#temp-min");
const humidity = document.querySelector("#humidity");
const uv = document.querySelector("#uv");

navigator.geolocation.watchPosition(success, denied);


function clean()
{
    city.innerText = '';
    temp.innerText = '';
    weather.innerText = '';
    sunrise.innerText = '';
    sunset.innerText = '';
    windSpeed.innerText = '';
    let itens = document.querySelectorAll("#list-forecast .list-item");

    itens.forEach(i => {
        listForecast.removeChild(i);
    })

}

function success(data)
{
    lon = data.coords.longitude;
    lat = data.coords.latitude;
    let url = `${api.url}forecast?lat=${lat}&lon=${lon}&appid=${api.key}&lang=${api.region}&units=metric`;
    const result = fetch(url).then(response => {
        if(!response.ok)
            throw new Error(`Ocorreu um erro ao acessar a API, Status code: ${response.status}`)
        return response.json();
    }).catch(err => {
        console.log(err);
    }).then(response => {
        showResults(response);
    });
}

function denied(data)
{
    console.log(data);
}
function showResults(data)
{
    clean();

    let firstDay = (new Date(data.list[0].dt * 1000));
    dayComplete.innerText = `${dateBuilder(firstDay)}`;
    city.innerText =  `${data.city.name}`;
    temp.innerText = `${Math.round(data.list[0].main.temp)}℃`;
    tempMax.innerText = `${Math.round(data.list[0].main.temp_max)}℃`;
    tempMin.innerText = `${Math.round(data.list[0].main.temp_min)}℃`;
    weather.innerText = `${data.list[0].weather[0].description}`;
    humidity.innerText = `${data.list[0].main.humidity}%`;

    sunrise.innerText = new Date(data.city.sunrise * 1000).toLocaleTimeString();
    sunset.innerText = new Date(data.city.sunset * 1000).toLocaleTimeString();

    let iconName = data.list[0].weather[0].icon;
    icon.src = `./icons/${iconName}.svg`;

    windSpeed.innerText = `${data.list[0].wind.speed} km/h`;

    let itens = listForecast.querySelector("#list-forecast li");

    for (let i = 0; i < 8; i++)
    {
        let item = `
        <li class="list-item">
            <div>
                <small>${new Date(data.list[i].dt * 1000).toLocaleTimeString()}</small>
                <img src="./icons/${data.list[i].weather[0].icon}.svg">
                <h4>${Math.round(data.list[i].main.temp)}℃</h4>
            </div>
        </li>
        `
        listForecast.insertAdjacentHTML('beforeend', item);
    }


    let yesterday = new Date(firstDay.setDate(firstDay.getDate() - 1));

    let day = yesterday.getDate();
    let month = yesterday.getMonth() +1;
    let year = yesterday.getFullYear();

    let urlMap = `https://apiprec.inmet.gov.br/${year}-${month}-${day}`;
    fetch(urlMap).then(response => {
        if(!response.ok)
            throw new Error(`Ocorreu um erro ao acessar a API, Status code: ${response.status}`)
        return response.json();
    }).catch(err => {
        console.log(err);
    }).then(response => {
        document.querySelector("#inmet").src = response[0].base64;
    });

}

function dateBuilder(data) {
    let days = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sabádo"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days[data.getDay()];
    let date = data.getDate();
    let month = months[data.getMonth()];
    let year = data.getFullYear();

    return `${day}, ${date} de ${month} ${year}`
}

let today = new Date();
if(today.getHours() >= 6 && today.getHours() <= 18)
    document.body.classList.add("day")
else
    document.body.classList.add("night");
