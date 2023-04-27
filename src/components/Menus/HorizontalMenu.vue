<template>
  <div class="horizontal-menu">
    <div class="horizontal-menu-brand">
      <Link to="/">
        <template v-slot:children>
          <ImageElement :src="appLogoPurpleBlackImage" :alt="appName" />
        </template>
      </Link>
    </div>
    <div class="horizontal-menu-actions">
      <Dropdown>
        <template v-slot:toggler>
          <Avatar :src="getUrl(userData.avatar)" :alt="userData.fullName" />
        </template>
        <template v-slot:listItems>
          <li>
            <Link class="link" @click="logoutUser">
              <template v-slot:children>
                <feather-icon
                  size="16"
                  icon="LogOutIcon"
                  class="mr-50"
                />
                <span>Logout</span>
              </template>
            </Link>
          </li>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
import {
  Link,
  ImageElement,
  Avatar,
  Dropdown,
} from '@/components/UIElements'

export default {
  name: 'HorizontalMenu',
  components: {
    Link,
    ImageElement,
    Avatar,
    Dropdown,
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
    }
  },
  setup() {
    const { appName, appLogoPurpleBlackImage } = $themeConfig.app

    return {
      appName,
      appLogoPurpleBlackImage,
    }
  },
  methods: {
    logoutUser() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    getUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';
@import '@/assets/scss/base/variables';

.horizontal-menu {
  height: $horizontalMenuHeight;
  width: 100%;
  background: $white;
  box-shadow: 0px 22px 40px rgba($black, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 37px 0 20px;
  &-brand {
    display: flex;
    max-width: 200px;
  }
  .link {
    padding: 10px 16px;
    color: $black;
    font-weight: 500;
    &:hover {
      background-color: rgba($secondary-default-r, $secondary-default-g, $secondary-default-b, 0.2);
    }
  }
}
</style>
