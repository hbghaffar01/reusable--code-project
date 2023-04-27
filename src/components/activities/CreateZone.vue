<template>
  <div>
    <b-modal
      id="CreateZoneModal"
      size="lg"
      hide-header
      hide-footer
    >
      <div>
        <p class="text-lg font-style my-1">
          Create New Zone
        </p>
        <gmap-autocomplete
          class="invite-ipt ipt-padding"
          @place_changed="setPlace"
        />
      </div>
      <br>
      <gmap-map
        ref="map"
        :center="center"
        :zoom="zoom"
        style="width:100%;height:200px"
      >
        <gmap-marker
          v-for="(m, index) in markers"
          ref="marker"
          :key="index"
          :draggable="true"
          :position="m.position"
          @drag="updateMarker"
        />
      </gmap-map>
      <div class="flex justify-end items-center gap-10 w-full mt-4">

        <button
          type="button"
          class="base-color-main m-0 cursor-pointer font-style"
          @click="hideZoneModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="next-btn-pkg d-flex items-center justify-around"
          @click="saveZone"
        >
          {{ isCreateZone ? "Set Zone" : "Create Zone" }}
        </button>
      </div>

    </b-modal>
  </div>
</template>
<script>
import { Map } from 'vue2-google-maps'
import { createZone } from '@/apiManager/zone'

export default {
  name: 'CreateZone',
  components: {
    'gmap-map': Map,
  },
  props: {
    isCreateZone: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 13,
      markerPosition: { lat: 37.7749, lng: -122.4194 },
      currentPlace: null,
      places: [],
      markers: [],
      payload: {},
    }
  },
  mounted() {
    this.geolocate()
  },
  methods: {
    setPlace(place) {
      this.currentPlace = place
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        }
        this.markers.push({ position: marker })
        this.places.push(this.currentPlace)
        this.center = marker
        this.getPayloadForCreateZone(place)
      }
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
    updateMarker(event) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
    },
    async saveZone() {
      try {
        if (Object.keys(this.payload).length === 0) return false
        if (this.isCreateZone) {
          this.$emit('onUpdateLocation', this.payload)
          this.hideZoneModal()
          return false
        }
        const { statusCode } = await createZone(this.payload)
        if (statusCode === 201) {
          this.makeToast('Zone has been created successfully.', 'success', 'Success')

          this.$emit('onCreatedZone')
          this.hideZoneModal()
        }
      } catch (e) {
        console.log(e)
      }
      return true
    },
    getPayloadForCreateZone(place) {
      this.payload = {
        title: place.name,
        description: place.formatted_address,
        pinaddress: place.url,
        city: place.formatted_address,
        latitude: String(place.geometry.location.lat()),
        longitude: String(place.geometry.location.lng()),
      }
    },

    hideZoneModal() {
      this.$emit('onHideCreateZoneModal')
    },
    makeToast(msg, variant, title) {
      this.$bvToast.toast(msg, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: true,
      })
    },
  },

}
</script>

<style scoped lang="scss">
@import "@/assets/scss/global.scss";
@import "@/@core/mixins/ui/_button.scss";
@import "@/@core/mixins/ui/_input.scss";
@import "@/@core/scss/base/core/colors/palette-variables.scss";

.invite-ipt {
  width: 100%;
  @include input(0 10px, $black, 14px, 400, 17px, #caa8f5, 5px);
}
.ipt-padding {
  padding: 10px;
}
.upload-btn {
  @include button($white, $core-direction-base, $core-direction-base, 5px);
  width: fit-content;
  height: 2.9rem;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  z-index: 2;
}
.next-btn-pkg {
  @include button($white, $core-direction-base, $core-direction-base, 40px);
  padding: 10px 15px;
  width: 150px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}
</style>
