<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';


const drawer = ref(true)
const rail = ref(false)
const route = useRoute()
</script>

<template>
    <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        class="bg-blue-grey-lighten-4"
        theme="dark"
        @click="rail = false"
        permanent
        :location="$vuetify.display.mobile ? 'top' : undefined"
    >
    <v-list>
        <v-list-item
            nav
        >
            <template v-slot:title>
                <div class="text-h6 text-blue-accent-4 font-weight-black">WeatherPal</div>
            </template>
            <template v-slot:append>
                <v-btn
                icon="mdi-chevron-left"
                variant="text"
                class="text-blue-accent-4"
                @click.stop="rail = !rail"
                v-if="!rail"
                ></v-btn>
            </template>
        </v-list-item>
    </v-list>
        <v-list nav density="compact">
            <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="Dashboard">
                <template v-slot:title>
                    <div class="text-subtitle-2">
                        Dashboard
                    </div>
                </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-map" title="Map" value="map">
                <template v-slot:title>
                    <div class="font-weight-bold">
                        Map
                    </div>
                </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-book-marker" title="Saved Location" value="saved">
                <template v-slot:title>
                    <div class="font-weight-bold">
                        Saved Location
                    </div>
                </template>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>