const input = document.querySelector('input');
const submit = document.getElementById('submit');
const city = document.getElementsByClassName('location');
const degrees = document.getElementsByClassName('degrees');
const condition = document.getElementsByClassName('condition');
const tempFelt = document.getElementsByClassName('feels-like');
const wind = document.getElementsByClassName('wind-mph');
const humid = document.getElementsByClassName('humidity');
const errorMsg = document.getElementsByClassName('error-msg');

submit.addEventListener('click',  getData => {
    errorMsg[0].textContent = "";
    getData.preventDefault();
    let nation = country(input.value);
    let cityName = nation.countryCity;
    let nationCode = nation.countryCode;
    let code = nationCode[0];
    processData(cityName, code);
});

async function processData(cityName, code){
    let repeatOn = 0;
    try{
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName},${code}&APPID=5747ef4524de59dd49571a7fd7244288`, {mode: 'cors'});
        const weatherData = await response.json();
        console.log(weatherData);
        city[0].textContent =  weatherData.name.toUpperCase() +", "+ weatherData.sys.country.toUpperCase();
        let ourTemp = (weatherData.main.temp - 273.15) * (9/5) + 32;
        degrees[0].textContent = Math.trunc(ourTemp);
        condition[0].textContent = weatherData.weather["0"].description.toUpperCase();

        let tempGuest = Math.trunc((weatherData.main.feels_like - 273.15) * (9/5) + 32);
        tempFelt[0].textContent = "IT FEELS LIKE: " + tempGuest +'\xB0' + "F";
        console.log(tempGuest);

        let time = new Date(weatherData.dt*1000+(weatherData.timezone*1000));
        cityTime(time);

        wind[0].textContent =  "WIND: " + weatherData.wind.speed + " MPH";
        humid[0].textContent = "HUMIDITY: " + weatherData.main.humidity;
        repeatOn = 1
    } catch(err) {
        //console.log(err);
            errorMsg[0].textContent = "-Please enter a city & country code!-"; 
            repeatOn = 0;

    }
    if (repeatOn == 1){
        setInterval(function(){   
            processData(cityName, code);   
            errorMsg[0].textContent = "";
            //console.log(1);
        }, 30000); 
    } 

};

function country(string) {
    let stringCount = string.split(" ").splice(-1).join("").length;
    if(stringCount == 2){
        let countryCity = string.split(" ").slice(0, -1).join(" ");
        let countryCode = string.split(" ").splice(-1);
        return {countryCity, countryCode};
    }
    else{
        let countryCity = string;
        let countryCode = " ";
        return {countryCity, countryCode};
    }
}

input.addEventListener("focus", function(){
    this.value = " ";
});

function error(err){
    console.log("Enter a city with its country code!!");
};

function cityTime(str){
        let time = str.toUTCString();
        let appTime = time.split(" ").slice(0, -1).join(" ")
        document.getElementById('time').innerHTML = appTime;
}