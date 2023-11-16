const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getWeather: async function() {

        const response = await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + this.config.city + ',' + this.config.countryCode + '&appid=' + this.config.apiKey)
		const latLon = await response.json()

		const reponse2 = await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ latLon[0].lat +'&lon='+ latLon[0].lon + '&units=' + this.config.units + '&lang=' + this.config.lang + '&appid=' + this.config.apiKey)
		const weather = await reponse2.json()

        this.sendSocketNotification('WEATHER_RESULT_TSW', weather);

    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_WEATHER_TSW') {
			this.config = payload
            this.getWeather();
        }
        if (notification === 'CONFIG_TSW') {
			console.log(payload)
            this.config = payload;
        }
    }

});
