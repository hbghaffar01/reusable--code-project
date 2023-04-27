<template>
  <Popup ref="warningPopup" :size="POPUP_SIZES.SMALL" :isCloseAble="false" :animation="POPUP_ANIMATIONS.SCALE">
    <template v-slot:children>
      <div class="warning">
        <IconWIthBg class="warning-icon" bgSize="6rem" :size="SIZES.LARGE" :type="icon ? icon : ICONS.EXCLAMATION" />
        <Paragraph class="warning-title" :value="title ? title : $t('global.warningPopup.title')" />
        <Paragraph class="warning-description" :value="description ? description : $t('global.warningPopup.description')" />

        <div class="warning-buttons">
          <Button
            :btnType="BUTTON_TYPES.DEFAULT"
            :value="closeBtnText ? closeBtnText : $t('global.close')"
            @click="close()"
          />
          <Button
            :btnType="BUTTON_TYPES.PRIMARY"
            :value="actionBtnText ? actionBtnText : $t('global.remove')"
            @click="actionYes()"
          />
        </div>
      </div>
    </template>
  </Popup>
</template>

<script>
import { Paragraph } from '@/components/Typography'
import { Popup, POPUP_SIZES, POPUP_ANIMATIONS } from '@/components/Popup'
import { IconWIthBg, ICONS, SIZES } from '@/components/UIElements'
import { Button, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPES } from '@/components/Buttons'

export default {
  name: 'WarningPopup',
  components: {
    Paragraph,
    IconWIthBg,
    Popup,
    Button,
  },
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    closeBtnText: {
      type: String,
      default: '',
    },
    actionBtnText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      POPUP_SIZES,
      POPUP_ANIMATIONS,
      BUTTON_STYLE,
      BUTTON_TYPES,
      BUTTON_SIZE,
      ICONS,
      SIZES,
    }
  },
  methods: {
    close() {
      this.$refs.warningPopup.close()
    },
    actionYes() {
      this.$emit('onActionYes')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';
@import '@/assets/scss/base/variables';

.warning {
  padding: 18px;
  text-align: center;
  &-icon {
    margin: 2rem auto;
    padding: 20px;
    color: $white;
  }
  &-title {
    font-weight: 700;
    font-size: 1.25rem;
    margin-top: 2rem;
  }
  &-description {
    font-weight: normal;
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  &-title, &-description {
    font-family: $fontFamily;
    line-height: 1.33;
    color: $fontColor;
  }
  &-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 0.5rem;
    width: 100%;
  }
}
</style>
