/* MagicMirror²
 * Module: MMM-TopScreenWeather
 *
 * By Jonathan Moreschi
 * MIT Licensed.
 */
Module.register("MMM-TopScreenWeather", {
	// Default module config.
	defaults: {
		city: "",
		countryCode: "",
		apiKey: "",
		updateInterval: 5 * 60 * 1000,
		showTime: true
	},

	getScripts: function () {
		return ["moment.js", "moment-timezone.js"];
	},

	getStyles: function () {
		return [this.file("./css/styles.css")]
	},

	start: function () {
		Log.info("Starting module: " + this.name);
		this.sendSocketNotification('CONFIG_TSW', this.config);
		this.config.lang = config.language;
		this.config.units = config.units;

		this.forecast = {};
		this.scheduleUpdate();
		if (this.config.showTime) {
			this.timeUpdate();
		}
	},

	getDom: function () {

		if (this.loaded) {
			let wrapper = document.createElement("div")
			wrapper.classList.add("TSW_container")

			let forecastContainer = document.createElement("div")
			forecastContainer.classList.add("TSW_forecast")

			let city = document.createElement("div")
			city.classList.add("TSW_city")
			city.innerHTML = this.forecast.name

			let temp = document.createElement("div")
			temp.classList.add("TSW_temperature")
			temp.innerHTML = Math.round(this.forecast.main.temp) + " ºC"

			let description = document.createElement("div")
			description.classList.add("TSW_description")
			description.innerHTML = this.forecast.weather[0].description

			let infosContainer = document.createElement("div")
			infosContainer.classList.add("TSW_infosContainer")

			forecastContainer.append(temp)
			forecastContainer.append(description)

			let windContainer = document.createElement("div")
			windContainer.classList.add("TSW_wind")

			let windArrow = document.createElement("div")
			windArrow.classList.add("TSW_windArrow")
			let windImg = document.createElement("img")
			windImg.src = this.data.path + "assets/arrow.png"
			windArrow.style = "transform: rotate("+ this.forecast.wind.deg +"deg);"
			windArrow.append(windImg)
			windContainer.append(windArrow)

			let displayWeatherContainer = document.createElement("div")
			displayWeatherContainer.classList.add("TSW_weather")

			infosContainer.append(forecastContainer)
			infosContainer.append(windContainer)
			displayWeatherContainer.append(city)
			displayWeatherContainer.append(infosContainer)
			wrapper.append(displayWeatherContainer)

			if (this.config.showTime) {
				let timeWrapper = document.createElement("div")
				timeWrapper.classList.add("TSW_time")
				let hourWrapper = document.createElement("span")
				hourWrapper.classList.add("TSW_hour")
				hourWrapper.innerHTML = this.timeHour
				let minutesWrapper = document.createElement("span")
				minutesWrapper.classList.add("TSW_minutes")
				minutesWrapper.innerHTML = this.timeMinutes

				timeWrapper.append(hourWrapper)
				timeWrapper.append(minutesWrapper)
				wrapper.append(timeWrapper)
			}

			return wrapper;
		} else {
			return "Waiting for data"
		}
	},

	processWeather: function (data) {
		this.forecast = data;
		this.loaded = true;
	},


	scheduleUpdate: function () {
		setInterval(() => {
			this.getWeather();
		}, this.config.updateInterval);
		this.getWeather();
	},

	getWeather: function () {
		this.sendSocketNotification('GET_WEATHER_TSW', this.config);
	},

	timeUpdate: function () {
		setInterval(() => {
			this.showTime()
		}, 15 * 1000)
		this.showTime()
	},

	showTime: function () {
		let now = moment()
		this.timeHour = now.format("HH")
		this.timeMinutes = now.format("mm")
		this.updateDom()
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "WEATHER_RESULT_TSW") {
			this.processWeather(payload);
		}
		this.updateDom();
	},
});
