const Handler = (() => {
    async function oneCallApi(lat, long) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=880ffa59f6aeed6d569e7450459fec7e`);

        const oneCallData = await response.json();
        console.log(oneCallData);

        return oneCallData;
    }

    async function getCoordinates(city) {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=880ffa59f6aeed6d569e7450459fec7e`);

        const coordinateData = await response.json();
        console.log(coordinateData);

        return coordinateData;
    }

    console.log(navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude)
    }));

    return { getCoordinates, oneCallApi }
})();

const Display = (() => {

    const inputForm = () => {
        const dom = document.querySelector('.content');
        const container = document.createElement('div');
        const input = document.createElement('input');
        const btn = document.createElement('button');

        btn.innerHTML = 'search';
        btn.onclick = () => getInput();
        Object.assign(input, {
            type: 'text',
            placeholder: 'city name...'
        });

        async function getInput() {
            const data = await Handler.getCoordinates(input.value);
            console.log(data);
            const lat = data[0].lat.toFixed(2);
            const long = data[0].lon.toFixed(2);

            console.log(lat, long);

            const dataApi = await Handler.oneCallApi(lat, long);

            console.log(dataApi);

        };

        container.appendChild(input);
        container.appendChild(btn);
        dom.appendChild(container);

        return getInput;
    };

    const initiateDom = (() => {
        inputForm();
    })();

    return { inputForm }
})();
