
<script setup>
import { ref } from 'vue';
import NavigationDrawer from './NavigationDrawer.vue';
import axiosClient from '../../axiosClient';
import citiesJSON from '../assets/cities.json';
import "http://unpkg.com/browser-geo-tz@latest/dist/geotz.js";


var cityList = []
const citiesMap = new Map();
for (const city of citiesJSON) {
    var key = city.city_ascii + ", " + city.country
    if (!citiesMap.has(key)) {
        citiesMap.set(key, {lat: city.lat, long: city.lng})
        cityList.push(key)
    }
}
const cities = ref(cityList)


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    x.innerHTML = "Geolocation is not supported by this browser.";
}


async function success(position) {
    updateLocation(position.coords.latitude, position.coords.longitude)
}

function error() {
    alert("Sorry, no position available.");
}

var timezone = "Asia/Kolkata"
const avg_temps = ref([30, 30, 34, 28, 26, 26])
const labels = ref([" ", "Week 1", "Week 2", "Week 3", "Week 4", " "])

const today = new Date()

const dateToday = ref({
    month: today.toLocaleString('en-US', { month:'long' , year:'numeric' , timeZone: timezone }),
    date: today.toLocaleString('en-US', { dateStyle:'full', timeZone: timezone })
})

const location = ref({
    city: "Vellore",
    country: "India"
})
const dailyOverview = ref({
    wind_speed: {
        value: 0,
        diff: 0
    },
    rain_chance: {
        value: 0,
        diff: 0
    },
    pressure: {
        value: 0,
        diff: 0
    },
    uv_index: {
        value: 0,
        diff: 0
    }
})

const curWeather = ref({
    temperature: 20,
    condition: "Mainly clear",
})
const time = ref("")
const loading = ref(false)
const selectedCity = ref(null)
const forecast = ref([
    {
        time: "07 PM",
        value: 10
    },
    {
        time: "08 PM",
        value: 10
    },
    {
        time: "09 PM",
        value: 10
    },
    {
        time: "10 PM",
        value: 10
    }
])
const sunTime = ref({
    sunrise: "05:00 AM",
    sunset: "07:00 PM"
})


setInterval(() => {
    const dat = new Date()
    time.value = dat.toLocaleString('en-US', { hour: '2-digit', hour12: true, minute:'2-digit' ,timeZone: timezone })
}, 10000)

const updateLocation = async (lat, long) => {
    loading.value = true
    const date = new Date()
    timezone = (await GeoTZ.find(lat, long))[0]
    time.value = date.toLocaleString('en-US', { hour: '2-digit', hour12: true, minute:'2-digit' ,timeZone: timezone })
    dateToday.value = {
        month: date.toLocaleString('en-US', { month:'long' , year:'numeric' , timeZone: timezone }),
        date: date.toLocaleString('en-US', { dateStyle:'full', timeZone: timezone })
    }
    axiosClient.get('', {params:{lat,long}}).then((res) => {
        const data = res.data
        dailyOverview.value = {
            wind_speed: {
                value: data.wind_speed_kmh,
                diff: data.wind_speed_diff
            },
            rain_chance: {
                value: data.rain_chance_percent,
                diff: data.rain_chance_diff
            },
            pressure: {
                value: data.pressure_hpa,
                diff: data.pressure_diff
            },
            uv_index: {
                value: data.uv_index,
                diff: data.uv_index_diff
            }
        }
        location.value = {
            city: data.location_info.name,
            country: data.location_info.country
        }
        curWeather.value = {
            temperature: data.current_temperature,
            condition: data.weather_condition
        }
        var avg_temps_list = []
        avg_temps_list.push(data.four_weeks_avg_temp[0])
        for (const tmp of data.four_weeks_avg_temp) {
            if (tmp) avg_temps_list.push(tmp)
        }
        avg_temps_list.push(data.four_weeks_avg_temp[3])
        avg_temps.value = avg_temps_list

        const timeNow = new Date()
        const forecastList = []
        for (var i = 0; i < 4; i++) {
            timeNow.setTime(timeNow.getTime() + (60*60*1000));
            forecastList.push({
                time: timeNow.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: timezone }),
                value: Math.ceil(data.next_5_hours_forecast[i].rain_chance_percent)
            })
        }
        forecast.value = forecastList
        sunTime.value = {
            sunrise: (new Date(data.sunrise)).toLocaleString('en-US', { hour: '2-digit', hour12: true, minute: '2-digit'}),
            sunset: (new Date(data.sunset)).toLocaleString('en-US', { hour: '2-digit', hour12: true, minute:'2-digit'})
        }
        loading.value = false
    })
}

</script>

<template>
    <v-main class="d-flex">
        <!-- <NavigationDrawer /> -->
        <v-container fluid class="pa-0 d-flex align-stretch">
            <v-row min-height="100%">
                <v-col cols="12" md="8" class="pa-3">
                    <v-container class="d-flex align-center">
                        <v-card variant="text">
                            <v-card-title class="font-weight-black">
                                {{ dateToday.month }}
                            </v-card-title>
                            <v-card-subtitle>
                                {{ dateToday.date }}
                            </v-card-subtitle>
                        </v-card>
                        <v-spacer></v-spacer>
                        <v-autocomplete
                            label="Search location"
                            prepend-inner-icon="mdi-magnify"
                            :items="cities"
                            variant="solo-filled"
                            flat
                            hide-details
                            style="max-width: 800px;"
                            :loading="loading"
                            :disabled="loading"
                            :model-value="selectedCity"
                            v-on:update:model-value="(event) => {const {lat, long} = citiesMap.get(event); updateLocation(lat, long)}"
                        ></v-autocomplete>
                    </v-container>
                    <v-divider class="mx-6"></v-divider>
                    <v-container>
                        <v-card variant="text">
                            <template v-slot:title>
                                <div class="font-weight-bold text-button">Today Overview</div>
                            </template>
                            <template v-slot:text>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-card 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-weather-windy"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                {{dailyOverview.wind_speed.value}}km/h
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                <div class="text-disabled">
                                                    Wind speed
                                                </div>
                                            </template>
                                            <template v-slot:append>
                                                <v-icon v-if="dailyOverview.wind_speed.value >= 0" color="green" icon="mdi-menu-up"></v-icon>
                                                <v-icon v-else color="red" icon="mdi-menu-down"></v-icon>
                                                <div class="d-flex">
                                                    {{Math.abs(dailyOverview.wind_speed.diff)}}km/h
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-card 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-weather-hail"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                {{dailyOverview.rain_chance.value}}%
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                <div class="text-disabled">
                                                    Rain Chance
                                                </div>
                                            </template>
                                            <template v-slot:append>
                                                <v-icon v-if="dailyOverview.rain_chance.diff >= 0" color="green" icon="mdi-menu-up"></v-icon>
                                                <v-icon v-else color="red" icon="mdi-menu-down"></v-icon>
                                                <div class="d-flex">
                                                    {{Math.abs(dailyOverview.rain_chance.diff)}}%
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-card 
                                        prepend-icon="mdi-weather-windy" 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-waves"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                {{ dailyOverview.pressure.value }} hpa
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                <div class="text-disabled">
                                                    Pressure
                                                </div>
                                            </template>
                                            <template v-slot:append>
                                                <v-icon v-if="dailyOverview.pressure.diff >= 0" color="green" icon="mdi-menu-up"></v-icon>
                                                <v-icon v-else color="red" icon="mdi-menu-down"></v-icon>
                                                <div class="d-flex">
                                                    {{Math.abs(dailyOverview.pressure.diff)}} hpa
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-card 
                                        prepend-icon="mdi-weather-windy" 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-shield-sun-outline"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                {{ dailyOverview.uv_index.value }}
                                            </template>
                                            <template v-slot:subtitle class="mt-2 ">
                                                <div class="text-disabled">
                                                    UV Index
                                                </div>
                                            </template>
                                            <template v-slot:append>
                                                <v-icon v-if="dailyOverview.uv_index.diff >= 0" color="green" icon="mdi-menu-up"></v-icon>
                                                <v-icon v-else color="red" icon="mdi-menu-down"></v-icon>
                                                <div class="d-flex">
                                                    {{Math.abs(dailyOverview.uv_index.diff)}} hpa
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-card>
                        <v-card variant="text">
                            <template v-slot:title>
                                <div class="font-weight-bold text-button">Average Weekly Temperature</div>
                            </template>
                            <template v-slot:text>
                                <v-sparkline
                                    :labels="labels"
                                    :model-value="avg_temps"
                                    show-labels
                                    class="px-12"
                                    line-width="1"
                                    label-size="6"
                                    stroke-linecap="round"
                                    smooth
                                    auto-draw
                                    padding="1"
                                >

                                </v-sparkline>
                            </template>
                        </v-card>
                    </v-container>
                </v-col>
                <v-col cols="12" md="4" class="" style="color: #FFFFFF;background: linear-gradient(150deg, #3e5787, #395180, #1c2c54, #0d1b3f, #0c1a3f, #12244d, #1d386b, #1e3b70)">
                    <v-container class="d-flex align-center">
                        <v-card variant="text" >
                            <v-card-title class="font-weight-black pl-0">
                                {{ location.city }}
                            </v-card-title>
                            <v-card-subtitle class="pl-0">
                                {{ location.country }}
                            </v-card-subtitle>
                        </v-card>
                        <v-spacer></v-spacer>
                        <div class="font-weight-bold pa-4">{{ time }}</div>
                    </v-container>
                    <v-container class="d-flex mt-2 align-center justify-space-around">
                        <div class="text-h2 text-md-h1">{{ curWeather.temperature }}° C</div>
                        <div class="text-overline">{{ curWeather.condition }}</div>
                    </v-container>
                    <v-divider :thickness="2" class="px-10 my-2 mx-4"></v-divider>
                    <v-container class="d-flex flex-column">
                        <div class="text-h6">Chance of rain</div>
                        <div class="d-flex align-center my-2" v-for="item in forecast">
                            <div class="text-button text-no-wrap mr-4">{{item.time}}</div>
                            <v-progress-linear
                                color="light-blue"
                                height="25"
                                :model-value="item.value"
                                rounded
                                rounded-bar
                            ></v-progress-linear>
                            <div class="text-button text-no-wrap ml-4">{{ item.value }} %</div>
                        </div>
                    </v-container>
                    <v-container class="d-flex flex-column ga-6 flex-lg-row justify-space-evenly">
                        <v-card class="pa-4" variant="tonal" prepend-icon="mdi-white-balance-sunny" :title="sunTime.sunrise" subtitle="Sunrise">
                        </v-card>
                        <v-card class="pa-4" variant="tonal" prepend-icon="mdi-weather-sunset" :title="sunTime.sunset" subtitle="Sunset">
                        </v-card>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>