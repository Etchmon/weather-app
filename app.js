const Handler = (() => {
    async function oneCallApi() {
        const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=880ffa59f6aeed6d569e7450459fec7e');

        const oneCallData = await response.json();
        console.log(oneCallData);
    }

    async function getCoordinates() {
        const response = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=880ffa59f6aeed6d569e7450459fec7e');

        const coordinateData = await response.json();
        console.log(coordinateData);
    }

    console.log(navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude)
    }));

    oneCallApi();
    getCoordinates();
})();

