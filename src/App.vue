<template>
  <div>
    <div class="style">
      <p class="style-title">
        <strong>Typography</strong>
      </p>
      <div class="style-row">
        <div class="style-col">
          <Display1 value="Display 1" />
          <Display2 value="Display 2" />
          <Display3 value="Display 3" />
          <Display4 value="Display 4" />
          <Display5 value="Display 5" />
          <Display6 value="Display 6" />
        </div>
        <div class="style-col">
          <H1 value="Heading 1" />
          <H2 value="Heading 2" />
          <H3 value="Heading 3" />
          <H4 value="Heading 4" />
          <H5 value="Heading 5" />
          <H6 value="Heading 6" />
        </div>
      </div>
    </div>
    <div class="style">
      <p class="style-title">
        <strong>Colors</strong>
      </p>
      <div class="style-row">
        <div class="style-col">
          <div class="color-box primary-dark">
            <code>$primary-dark</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box primary-default">
            <code>$primary-default</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box primary-light">
            <code>$primary-light</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box primary-extra-light">
            <code>$primary-extra-light</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box primary-bg">
            <code>$primary-bg</code>
          </div>
        </div>
      </div>
      <div class="style-row">
        <div class="style-col">
          <div class="color-box secondary-dark">
            <code>$secondary-dark</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box secondary-default">
            <code>$secondary-default</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box secondary-light">
            <code>$secondary-light</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box secondary-extra-light">
            <code>$secondary-extra-light</code>
          </div>
        </div>
        <div class="style-col">
          <div class="color-box secondary-bg">
            <code>$secondary-bg</code>
          </div>
        </div>
      </div>
    </div>
    <div class="style">
      <p class="style-title">
        <strong>Buttons</strong>
      </p>
      <div class="style-row align-middle">
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Button Primary" />
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" value="Button Secondary" />
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" value="Button default" />
        </div>
      </div>
      <div class="style-row align-middle">
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.SMALL">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.SMALL">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.SMALL">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.MEDIUM">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.MEDIUM">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.MEDIUM">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.LARGE">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.LARGE">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.LARGE">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
      </div>
      <div class="style-row align-middle">
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.SMALL">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.SMALL">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.SMALL">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.MEDIUM">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.MEDIUM">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.MEDIUM">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.LARGE">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.SECONDARY" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.LARGE">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.DEFAULT" :btnStyle="BUTTON_STYLE.SQUARE" :size="BUTTON_SIZE.LARGE">
            <template v-slot:children>
              <Chevron />
            </template>
          </Button>
        </div>
      </div>
    </div>
    <div class="style">
      <p class="style-title">
        <strong>UI elements</strong>
      </p>
      <div class="style-row align-middle">
        <div class="style-col">
          <Avatar src="https://placehold.co/400" :size="SIZES.LARGE" alt="Avatar" />
        </div>
        <div class="style-col">
          <Avatar src="https://placehold.co/400" :size="SIZES.MEDIUM" alt="Avatar" />
        </div>
        <div class="style-col">
          <Avatar src="https://placehold.co/400" :size="SIZES.SMALL" alt="Avatar" />
        </div>
      </div>
      <div class="style-row align-middle">
        <div class="style-col">
          <Link to="/" value="Link default" />
        </div>
        <div class="style-col">
          <Link to="/">
            <template v-slot:children>
              <b>Link with HTML or Component</b>
            </template>
          </Link>
        </div>
        <div class="style-col primary-default menu-link">
          <MenuLink :content="content" :showTitle="true" :route="$route" @click="$router.push({ name: content.href })">
            <template v-slot:icon>
              <ImageElement :src="require('@/assets/images/sidebar-icons/' + content.icon)" :alt="content.title" />
            </template>
          </MenuLink>
        </div>
      </div>'
      <div class="style-row align-middle">
        <div class="style-col">
          <Dropdown>
            <template v-slot:toggler>
              Click me to open dropdown
            </template>
            <template v-slot:listItems>
              <li class="list-item">
                I'm list item
              </li>
              <li class="list-item">
                I'm list item
              </li>
              <li class="list-item">
                I'm list item
              </li>
              <li class="list-item">
                I'm list item
              </li>
            </template>
          </Dropdown>
        </div>
        <div class="style-col">
          <Dropdown>
            <template v-slot:toggler>
              <Avatar src="https://placehold.co/400" :size="SIZES.LARGE" alt="Avatar" />
            </template>
            <template v-slot:listItems>
              <li class="list-item">
                I'm list item
              </li>
              <li class="list-item">
                I'm list item
              </li>
              <li class="list-item">
                I'm list item
              </li>
              <li class="list-item">
                I'm list item
              </li>
            </template>
          </Dropdown>
        </div>
        <div class="style-col">
          <p>Loader for text</p>
          <TextLoader height="50px" width="500px" />
        </div>
      </div>
      <div class="style-row">
        <div class="style-col">
          <ImageElement src="https://placehold.co/400" alt="ImageElement" />
        </div>
      </div>
    </div>
    <div class="style">
      <p class="style-title">
        <strong>Icons</strong>
      </p>
      <div class="style-row no-gap">
        <div v-for="icon in iconsList" :key="icon" class="style-column">
          <div class="icon">
            <Icon :type="ICONS[icon]" :size="SIZES.LARGE" />
          </div>
        </div>
      </div>
      <div class="style-row no-gap color-primary">
        <div v-for="icon in iconsList" :key="icon" class="style-column">
          <div class="icon">
            <Icon :type="ICONS[icon]" :size="SIZES.LARGE" />
          </div>
        </div>
      </div>

      <div class="style-row no-gap">
        <div v-for="icon in iconsList" :key="icon" class="style-column">
          <div class="icon">
            <IconWIthBg :type="ICONS[icon]" bgSize="4rem" :size="SIZES.MEDIUM" />
          </div>
        </div>
      </div>

      <div class="style-row no-gap">
        <div v-for="icon in iconsList" :key="icon" class="style-column">
          <div class="icon">
            <IconWIthBg :bg="ICONS_BG.SECONDARY" :type="ICONS[icon]" bgSize="4rem" :size="SIZES.MEDIUM" />
          </div>
        </div>
      </div>
    </div>
    <div class="style">
      <p class="style-title">
        <strong>Popups</strong>
      </p>
      <div class="style-row">
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup Large with scale animation" @click="showPopup('large')" />
          <Popup ref="popupLarge" :size="POPUP_SIZES.LARGE">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
            </template>
          </Popup>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup Medium with scale animation" @click="showPopup('medium')" />
          <Popup ref="popupMedium" :size="POPUP_SIZES.MEDIUM">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
            </template>
          </Popup>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup Small with scale animation" @click="showPopup('small')" />
          <Popup ref="popupSmall" :size="POPUP_SIZES.SMALL">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
            </template>
          </Popup>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup Large with fade animation" @click="showPopup('fadeLarge')" />
          <Popup ref="popupFadeLarge" :size="POPUP_SIZES.LARGE" :animation="POPUP_ANIMATIONS.FADE">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
            </template>
          </Popup>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup Medium with fade animation" @click="showPopup('fadeMedium')" />
          <Popup ref="popupFadeMedium" :size="POPUP_SIZES.MEDIUM" :animation="POPUP_ANIMATIONS.FADE">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
            </template>
          </Popup>
        </div>
        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup Small with fade animation" @click="showPopup('fadeSmall')" />
          <Popup ref="popupFadeSmall" :size="POPUP_SIZES.SMALL" :animation="POPUP_ANIMATIONS.FADE">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
            </template>
          </Popup>
        </div>

        <div class="style-col">
          <Button :btnType="BUTTON_TYPES.PRIMARY" value="Popup none closeable" @click="showPopup('forceClose')" />
          <Popup ref="popupForceCloseShow" :size="POPUP_SIZES.SMALL" :isCloseAble="false" :animation="POPUP_ANIMATIONS.FADE">
            <template v-slot:children>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam esse adipisci suscipit mollitia vel iusto quae cumque. Et, id eaque ducimus commodi odio dolor sint doloribus, eum aliquid repudiandae officia?
              <br>
              <br>
              <Button :btnType="BUTTON_TYPES.DEFAULT" value="No" @click="popupForceClose()" />
              <Button :btnType="BUTTON_TYPES.PRIMARY" value="Yes" @click="popupForceClose()" />
            </template>
          </Popup>
        </div>
      </div>
    </div>
    <div class="style">
      <p class="style-title">
        <strong>Table</strong>
      </p>
      <div class="style-row">
        <Table>
          <template v-slot:children>
            <Thead :type="THEAD_TYPES.PRIMARY_GRADIENT">
              <template v-slot:children>
                <TR>
                  <template v-slot:children>
                    <TH value="#" />
                    <TH value="Heading" />
                    <TH value="Heading" />
                    <TH value="Heading" />
                    <TH value="Heading" />
                    <TH value="Heading" />
                  </template>
                </TR>
              </template>
            </Thead>
            <Tbody :numberOfPages="1">
              <template v-slot:children>
                <TR v-for="items in 50" :key="items">
                  <template v-slot:children>
                    <TD :value="items" />
                    <TD>
                      <template v-slot:children>
                        <b>{{ items }}</b>
                      </template>
                    </TD>
                    <TD :value="items" />
                    <TD :value="items" />
                    <TD :value="items" />
                    <TD :value="items" />
                  </template>
                </TR>
              </template>
            </Tbody>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>

import { H1, H2, H3, H4, H5, H6, Display1, Display2, Display3, Display4, Display5, Display6 } from '@/components/Typography'
import { Avatar, SIZES, Link, MenuLink, ImageElement, Dropdown, Icon, ICONS, IconWIthBg, ICONS_BG } from '@/components/UIElements'
import { Table, TABLE_TYPES, Thead, THEAD_TYPES, Tbody, TR, TH, TD } from '@/components/Table'
import { TextLoader } from '@/components/TextLoader'
import { Button, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPES } from '@/components/Buttons'
import { Popup, POPUP_ANIMATIONS, POPUP_SIZES } from '@/components/Popup'

import Chevron from '@/svgs/Chevron.vue'

export default {
  name: 'StyleGuide',
  components: {
    IconWIthBg,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Display1,
    Display2,
    Display3,
    Display4,
    Display5,
    Display6,
    Avatar,
    Link,
    MenuLink,
    ImageElement,
    Dropdown,
    Table,
    Thead,
    Tbody,
    TR,
    TH,
    TD,
    TextLoader,
    Button,
    Chevron,
    Popup,
    Icon,
  },
  data() {
    return {
      SIZES,
      content: {
        icon: 'dashboard.svg',
        title: 'Menu Link Component',
        href: 'home',
      },
      TABLE_TYPES,
      THEAD_TYPES,
      BUTTON_SIZE,
      BUTTON_STYLE,
      BUTTON_TYPES,
      POPUP_SIZES,
      POPUP_ANIMATIONS,
      ICONS,
      ICONS_BG,
      iconsList: Object.keys(ICONS),
    }
  },
  methods: {
    showPopup(type) {
      if (type === 'large') {
        this.$refs.popupLarge.showPopup()
      }
      if (type === 'medium') {
        this.$refs.popupMedium.showPopup()
      }
      if (type === 'small') {
        this.$refs.popupSmall.showPopup()
      }
      if (type === 'fadeLarge') {
        this.$refs.popupFadeLarge.showPopup()
      }
      if (type === 'fadeMedium') {
        this.$refs.popupFadeMedium.showPopup()
      }
      if (type === 'fadeSmall') {
        this.$refs.popupFadeSmall.showPopup()
      }
      if (type === 'noneClose') {
        this.$refs.popupNoneClose.showPopup()
      }
      if (type === 'forceClose') {
        this.$refs.popupForceCloseShow.showPopup()
      }
    },
    popupForceClose() {
      this.$refs.popupForceCloseShow.close()
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/base/variables";
  @import "@/assets/scss/base/colors";

  .style {
    &:not(:first-child) {
      margin-top: 2rem;
    }
    border-bottom: solid 1px rgba($black, 0.1);
    padding-bottom: 1rem;
    &-title {
      margin-bottom: 2rem;
      strong {
        font-family: $fontFamily;
        color: $fontColor;
        font-size: 2rem;
      }
    }

    &-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      &.align-middle {
        align-items: center;
      }
      &.no-gap {
        gap: 0;
      }
    }
    .menu-link {
      min-width: 275px;
    }
    .primary {
      &-dark {
        background-color: $primary-dark;
      }
      &-default {
        background-color: $primary-default;
      }
      &-light {
        background-color: $primary-light;
      }
      &-extra-light {
        background-color: $primary-extra-light;
      }
      &-bg {
        background-color: $primary-bg;
      }
    }
    .secondary {
      &-dark {
        background-color: $secondary-dark;
      }
      &-default {
        background-color: $secondary-default;
      }
      &-light {
        background-color: $secondary-light;
      }
      &-extra-light {
        background-color: $secondary-extra-light;
      }
      &-bg {
        background-color: $secondary-bg;
      }
    }

    .list-item {
      padding: 10px 16px;
      color: $black;
      font-weight: 500;
      &:hover {
        background-color: rgba($secondary-default, 0.2);
      }
    }

    .color-box {
      width: 15rem;
      min-height: 15rem;
      border-radius: 0.5rem;
      position: relative;
      overflow: hidden;

      code {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0px;
        border-radius: 0;
        padding: 0.7rem;
        font-size: 1rem;
        font-weight: 500;
      }
    }
    .icon {
      width: 6rem;
      height: 6rem;
      font-size: 2.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $fontColor;
    }
    .color-primary {
      .icon {
        color: $primary-default;
      }
    }
  }
</style>
