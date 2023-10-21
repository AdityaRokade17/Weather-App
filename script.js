// const API_KEY = "b55e7b8774af4c4bae78ab03346d8bff";

// async function fetchWeather() {


//     try{

//         let city = "nashik";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//         const data = await response.json();

//         let newPara = document.createElement('p');
//         newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//         document.body.appendChild(newPara);

//     }catch(e){
//         //handle error here
//     }
    
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "b55e7b8774af4c4bae78ab03346d8bff";
currentTab.classList.add("current-tab");
getfromSessionStorage();


//
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //is it search tab is invisible yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            //switch from search to your weaher tab
            searchForm.classList.remove("active");
            userInfoContainer.remove("active");

            //now im on my your weather tab , and to show weather on here check 
            //local storage first for cooridinates, if saved
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click" , () =>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click" , () =>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check is coorinates already present on session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //apo call
    try{

        const  response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }catch(err){

        loadingScreen.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo){

    //fetch info first

    const cityName = document.querySelector("[data-cityName");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]")


    //fetch values from weather info obj and put it ui elements
    
    cityName.innerText = weatherInfo?.name;
    countryIcon.src =  `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m\s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }else{
        //hw show alert for no geo loaction supprot avialable
        alert("no geo loaction supprot")
    }
}
//call back function
function showPosition(position){

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);


}


const grandAccessButton = document.querySelector("[data-grantAccess");
grandAccessButton.addEventListener("click" , getLocation);



const searchInput = document.querySelector("[data-searchInput");
searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName ===""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
})


async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){

    }
}
