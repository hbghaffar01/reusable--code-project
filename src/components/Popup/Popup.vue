<template>
  <div v-if="show" :class="`popup ${animation} ${popup}`" @click="isCloseAble && closePopup($event)">
    <div ref="popup" :class="`popup-content popup-${size}`">
      <div class="popup-scroll">
        <Button
          v-if="closeButton"
          class="popup-close"
          :btnType="BUTTON_TYPES.PRIMARY"
          :btnStyle="BUTTON_STYLE.ROUND"
          :size="BUTTON_SIZE.MEDIUM"
          value="close"
          @click="close()"
        />
        <div class="popup-body">
          <slot name="children" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPES } from '@/components/Buttons'

export default {
  name: 'Popup',
  components: {
    Button,
  },
  props: {
    size: {
      type: String,
      default: 'lg',
    },
    animation: {
      type: String,
      default: 'scale',
    },
    isCloseAble: {
      type: Boolean,
      default: true,
    },
    closeButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      popup: '',
      BUTTON_TYPES,
      BUTTON_STYLE,
      BUTTON_SIZE,
      show: false,
    }
  },
  methods: {
    showPopup() {
      this.show = true
      setTimeout(() => {
        this.popup = 'show'
      }, 50)
    },
    closePopup(e) {
      if (e.target === this.$refs.popup || this.$refs.popup.contains(e.target)) {
        return
      }
      this.close()
    },
    close() {
      this.popup = ''
      setTimeout(() => {
        this.show = false
      }, 250)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/base/colors';
  @import '@/assets/scss/base/variables';
  @import '@/assets/scss/mixins/responsiveness';

  $selector: '.popup';

  #{$selector} {
    position: fixed;
    z-index: 1050;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba($black, 0.5);
    display: flex;
    justify-content: center;

    &.scale {
      align-items: center;

      #{$selector} {
        &-content {
          transform: scale(0);
          transition: transform 250ms ease-in-out;
        }
      }

      &.show {
        #{$selector} {
          &-content {
            transform: scale(1);
          }
        }
      }
    }

    &.fade {
      #{$selector} {
        &-content {
          position: absolute;
          top: 0;
          opacity: 0;
          transform: translateY(-50%);
          transition: top 250ms ease-in-out, opacity 250ms ease-in-out;
        }
      }

      &.show {
        #{$selector} {
          &-content {
            opacity: 1;
            top: 50%;
          }
        }
      }
    }

    &-content {
      background-color: $white;
      border-radius: 10px;
      margin: auto;
      padding: 5px;
      overflow: hidden;
    }

    &-lg {
      width: 80%;
    }

    &-md {
      width: 60%;
    }

    &-sm {
      width: 30%;
    }

    &-lg, &-md, &-sm {
      @include media-breakpoint-down(md) {
        width: 90%;
      }
    }

    &-scroll {
      padding: 10px 20px;
      max-height: 95vh;
      overflow: auto;
      position: relative;
    }

    &-close {
      position: relative;
      right: 20px;
      top: 20px;
      display: block;
    }
  }
</style>
