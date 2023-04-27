<template>
  <div class="vertical-menu">
    <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.ROUND" class="vertical-menu-button" :class="navClose && 'vertical-menu-nav-close'" @click="handleClose()">
      <template v-slot:children>
        <Chevron />
      </template>
    </Button>
    <div class="vertical-menu-date">
      {{ currentDate(navClose) }}
    </div>

    <ul class="vertical-menu-list">
      <li v-for="(content, index) in navMenuItems" :key="index">
        <menu-link :content="content" :showTitle="!navClose" :route="$route" @click="$router.push({ name: content.href })">
          <template v-slot:icon>
            <ImageElement :src="require('@/assets/images/sidebar-icons/' + content.icon)" :alt="content.title" />
          </template>
        </menu-link>
      </li>
    </ul>
  </div>
</template>

<script>
import navMenuItems from '@/navigation/vertical'
import { currentDate } from '@/utils'
import { MenuLink, ImageElement } from '@/components/UIElements'
import Chevron from '@/svgs/Chevron.vue'
import { Button, BUTTON_STYLE, BUTTON_TYPES } from '../Buttons'

export default {
  name: 'VerticalMenu',
  components: {
    MenuLink,
    ImageElement,
    Button,
    Chevron,
  },
  props: {
    navClose: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      BUTTON_TYPES,
      BUTTON_STYLE,
      navMenuItems,
      currentDate,
    }
  },
  methods: {
    handleClose() {
      this.$emit('onNavClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.vertical-menu {
  background: $primary-default;
  height: 100vh;
  border-top-right-radius: 6px;
  position: relative;

  &-nav-close {
    transform: rotate(180deg);
  }

  &-button {
    position: absolute;
    border: 2px solid $white-100;
    padding: 0;
    margin: 0;
    right: -15px;
    bottom: 100px;
    box-shadow: 6px 0px 6px 2px rgba(0, 0, 0, 0.1);
    transition: transform 400ms ease;
  }

  &-date {
    background: $secondary-default;
    margin-top: 3rem;
    text-align: center;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3;
    color: $primary-default;
    padding: 3px 0;
  }

  &-list {
    display: flex;
    row-gap: 1rem;
    flex-direction: column;
    margin-top: 2.25rem;
  }
}
</style>
