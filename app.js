const Handler = (() => {
    async function oneCallApi(lat, long) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=880ffa59f6aeed6d569e7450459fec7e`);

        const oneCallData = await response.json();

        return oneCallData;
    };

    async function getCoordinates(city) {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=880ffa59f6aeed6d569e7450459fec7e`);

        const coordinateData = await response.json();

        if (coordinateData.length === 0) {
            alert('No such City');
            return;
        } else {
            return coordinateData;
        }


    };

    async function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            const data = await oneCallApi(latitude.toFixed(2), longitude.toFixed(2));
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}&appid=880ffa59f6aeed6d569e7450459fec7e`);

            const currentData = await response.json();

            DisplayController.setHeader(currentData.name);
            DisplayController.setDash(data);
        });


    };

    console.log(navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude)
    }));

    return { getCoordinates, oneCallApi, getCurrentLocation }
})();

const Display = (() => {

    const inputForm = () => {
        const dom = document.querySelector('.content');
        const container = document.createElement('nav');
        const input = document.createElement('input');
        const btn = document.createElement('button');

        container.setAttribute('class', 'search');
        btn.innerHTML = 'search';
        btn.onclick = () => getInput();
        Object.assign(input, {
            type: 'text',
            placeholder: 'city name...',
            class: 'search-input'
        });

        async function getInput() {

            try {
                const data = await Handler.getCoordinates(input.value);
                const lat = data[0].lat.toFixed(2);
                const long = data[0].lon.toFixed(2);
                const dataApi = await Handler.oneCallApi(lat, long);

                DisplayController.setHeader(`${data[0].name}, ${data[0].state}`);
                DisplayController.setDash(dataApi);
            } catch (error) {
                console.log(error)
                return;
            }


        };

        container.appendChild(input);
        container.appendChild(btn);
        dom.appendChild(container);
    };

    const dash = () => {
        const dom = document.querySelector('.content');
        const section = document.createElement('section');
        const header = document.createElement('h1');
        const container = document.createElement('div');

        container.setAttribute('class', 'grid');

        section.appendChild(header);
        section.appendChild(container)
        dom.appendChild(section);
    }

    const currentTemp = () => {
        const grid = document.querySelector('.grid');
        const element = document.createElement('div');
        const box = document.createElement('div');
        const temp = document.createElement('span');
        const feelsLike = document.createElement('span');
        const humidity = document.createElement('span');
        const condition = document.createElement('img');
        const wind = document.createElement('span');
        const riseSet = document.createElement('span');

        Object.assign(element, {
            className: 'current',
        });
        Object.assign(box, {
            className: 'current-box',
        });
        Object.assign(temp, {
            className: 'current-temp',
        });
        Object.assign(feelsLike, {
            className: 'current-feels-like',
        });
        Object.assign(humidity, {
            className: 'current-humidity',
        });
        Object.assign(wind, {
            className: 'current-wind',
        });
        Object.assign(riseSet, {
            className: 'current-rise',
        });
        Object.assign(condition, {
            className: 'current-condition',
        });

        box.appendChild(feelsLike);
        box.appendChild(humidity);
        box.appendChild(wind);
        box.appendChild(riseSet);

        element.appendChild(condition);
        element.appendChild(temp);
        element.appendChild(box);

        grid.appendChild(element);
    };

    const weekTemps = () => {
        const grid = document.querySelector('.grid');
        const element = document.createElement('div');

        element.setAttribute('class', 'week-temps');

        grid.appendChild(element);
    }

    const weekTempCard = () => {
        const card = document.createElement('div');
        const day = document.createElement('h2');
        const img = document.createElement('img');
        const temp = document.createElement('span');
        const condition = document.createElement('span');

        card.setAttribute('class', 'week-card');
        day.setAttribute('class', 'week-day');
        img.setAttribute('class', 'week-img');
        temp.setAttribute('class', 'week-temp');
        condition.setAttribute('class', 'week-condition');

        card.appendChild(day);
        card.appendChild(img);
        card.appendChild(temp);
        card.appendChild(condition);

        return card;

    }

    const initiateDom = (() => {
        inputForm();
        dash();
        currentTemp();
        weekTemps();
    })();

    return { inputForm, currentTemp, weekTempCard }
})();

const DisplayController = (() => {

    const setHeader = (newHeader) => {
        const header = document.querySelector('section h1');

        header.innerHTML = newHeader;
    };

    const setDash = (data) => {
        console.log(data);
        console.log(data.current);
        setCurrentTemp(data);
        setWeekTemps(data);
    };

    const setWeekTemps = (data) => {
        const container = document.querySelector('.week-temps');
        container.innerHTML = '';
        data.daily.forEach(element => {
            const card = Display.weekTempCard();

            card.querySelector('.week-day').innerHTML = getHumanDay(element.dt);
            card.querySelector('.week-img').src = `http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`;
            card.querySelector('.week-temp').innerHTML = element.temp.day.toFixed(0) + '°F';
            card.querySelector('.week-condition').innerHTML = element.weather[0].main;

            container.appendChild(card);
        });
    };

    const setCurrentTemp = (data) => {
        const temp = document.querySelector('.current-temp');
        const feelsLike = document.querySelector('.current-feels-like');
        const condition = document.querySelector('.current-condition');
        const riseSet = document.querySelector('.current-rise');
        const humidity = document.querySelector('.current-humidity');
        const wind = document.querySelector('.current-wind');

        temp.innerHTML = data.current.temp.toFixed(0);
        feelsLike.innerHTML = 'feels like ' + data.current.feels_like.toFixed(0) + '°F';
        condition.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`;
        riseSet.innerHTML = `Sunrise: ${getHumanTime(data.current.sunrise)} Sunset: ${getHumanTime(data.current.sunset)}`;
        humidity.innerHTML = 'humidity: ' + data.current.humidity + '%';
        wind.innerHTML = 'wind: ' + data.current.wind_speed + ' mph';
    };

    const getHumanDay = (time) => {
        const miliseconds = time * 1000;
        const dateObject = new Date(miliseconds);

        const humanDate = dateObject.toLocaleString("en-US", { weekday: "long" });

        return humanDate;
    };

    const getHumanTime = (time) => {
        const miliseconds = time * 1000;
        const dateObject = new Date(miliseconds);

        const humanTime = dateObject.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

        return humanTime;
    };

    return { setHeader, setDash };
})();

window.onload = async () => await Handler.getCurrentLocation();
