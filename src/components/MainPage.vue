<script setup>
import { ref } from 'vue';
import NavigationDrawer from './NavigationDrawer.vue';

const value = ref([30, 34, 28, 26, 29])
const labels = ref(["Week 1", "Week 2", "Week 3", "Week 4", "Current"])
</script>

<template>
    <v-main class="d-flex">
        <NavigationDrawer />
        <v-container fluid>
            <v-row class="">
                <v-col cols="8" class="pa-3">
                    <v-container class="d-flex align-center">
                        <v-card variant="text">
                            <v-card-title class="font-weight-black">
                                January 2022
                            </v-card-title>
                            <v-card-subtitle>
                                January 2022
                            </v-card-subtitle>
                        </v-card>
                        <v-spacer></v-spacer>
                        <v-text-field
                            label="Search location"
                            prepend-inner-icon="mdi-magnify"
                            variant="solo-filled"
                            flat
                            hide-details
                            style="max-width: 800px;"
                        ></v-text-field>
                    </v-container>
                    <v-divider class="mx-6"></v-divider>
                    <v-container>
                        <v-card variant="text">
                            <template v-slot:title>
                                <div class="font-weight-bold text-button">Today Overview</div>
                            </template>
                            <template v-slot:text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-card 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-weather-windy"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                12km/h
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                Wind speed
                                            </template>
                                            <template v-slot:append>
                                                <v-icon color="red" icon="mdi-menu-down"></v-icon>
                                                <div class="d-flex">
                                                    2km/h
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-card 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-weather-hail"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                24%
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                Rain Chance
                                            </template>
                                            <template v-slot:append>
                                                <v-icon color="blue-accent-4" icon="mdi-menu-up"></v-icon>
                                                <div class="d-flex">
                                                    10%
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-card 
                                        prepend-icon="mdi-weather-windy" 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-waves"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                720 hpa
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                Pressure
                                            </template>
                                            <template v-slot:append>
                                                <v-icon color="blue-accent-4" icon="mdi-menu-up"></v-icon>
                                                <div class="d-flex">
                                                    32 hpa
                                                </div>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-card 
                                        prepend-icon="mdi-weather-windy" 
                                        class="pa-2" 
                                        variant="flat" 
                                        color="grey-lighten-5">
                                            <template v-slot:prepend>
                                                <v-icon color="blue-accent-4" class="text-h4 pe-6" icon="mdi-shield-sun-outline"></v-icon>
                                            </template>
                                            <template v-slot:title>
                                                2,3
                                            </template>
                                            <template v-slot:subtitle class="mt-2">
                                                UV Index
                                            </template>
                                            <template v-slot:append>
                                                <v-icon color="red" icon="mdi-menu-down"></v-icon>
                                                <div class="d-flex">
                                                    0,3
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
                                    :model-value="value"
                                    show-labels
                                    class="px-12"
                                    line-width="1"
                                    label-size="6"
                                    stroke-linecap="round"
                                    smooth
                                    auto-draw
                                >

                                </v-sparkline>
                            </template>
                        </v-card>
                    </v-container>
                </v-col>
                <v-col cols="4">
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>