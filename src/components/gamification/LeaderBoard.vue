<template>
  <div class="table">
    <div class="thead">
      <div class="tr">
        <p class="td heading pl-1 mb-0 font-weight-bold">
          Ranking
        </p>
        <p class="td heading pl-1 mb-0 font-weight-bold">
          Participant Name
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          Log Activity
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          Check-ins
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          Steps
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          Heart Rate
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          On Demand
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          Core Points
        </p>
        <p class="td heading text-center sm-hide mb-0 font-weight-bold">
          Actions
        </p>
      </div>
    </div>
    <div>
      <NoRecordFound v-if="!participents.length" />
      <div class="tbody">
        <div
          v-for="participent in participents"
          :key="participent.id"
          class="tr"
          @click="setUser(participent.id)"
        >
          <div class="td flex items-center">
            <div class="ranking-img-box rounded-full flex align-items-center">
              <img
                :src="getRankImage(participent.rank)"
                alt="ranks"
              >
            </div>
            <div class="ranking-info-box">
              <p class="ranking-title m-0">
                Rank
              </p>
              <p class="ranking-number m-0">
                {{ participent.rank }}
              </p>
            </div>
          </div>
          <div class="td flex items-center">
            <div class="ranker-img-box">
              <img
                :src="getImageUrl(participent.profile_picture)"
                alt="profile"
                class="rounded-full"
              >
            </div>
            <div class="ranker-info-box">
              <p class="ranker-name m-0">
                {{ participent.firstname }} {{ participent.lastname }}
              </p>
              <p class="ranker-core-points lg-hide">
                {{ participent.totalCorePoints ? participent.totalCorePoints : 0 }}
              </p>
            </div>
          </div>
          <p class="td points text-center sm-hide m-0">
            {{ participent.totalActivityLogToday ? participent.totalActivityLogToday : 0 }}
          </p>
          <p class="td points text-center sm-hide m-0">
            {{ participent.checkins ? participent.checkins : 0 }}
          </p>
          <p class="td points text-center sm-hide m-0">
            {{ participent.stepCounts ? participent.stepCounts : 0 }}
          </p>
          <p class="td points text-center sm-hide m-0">
            {{ participent.heartRate ? participent.heartRate : 0 }}
          </p>
          <p class="td points text-center sm-hide m-0">
            {{ participent.totalWatchedVideoToday ? participent.totalWatchedVideoToday : 0 }}
          </p>
          <p class="td points text-center sm-hide m-0">
            {{ participent.totalCorePoints ? participent.totalCorePoints : 0 }}
          </p>
          <Button
            :btnType="BUTTON_TYPES.PRIMARY"
            :btnStyle="BUTTON_STYLE.ROUND"
            :size="BUTTON_SIZE.SMALL"
            @click="showDelModal(participent.challengeId, participent.id)"
          >
            <template v-slot:children>
              <Icon :type="ICONS.TRASH" />
            </template>
          </Button>
        </div>
      </div>
      <WarningPopup
        :icon="warningPopupData.icon"
        :description="warningPopupData.description"
        :actionBtnText="warningPopupData.actionBtnText"
        @onActionYes="actionYesClick()"
      />
      <Pagination
        v-if="participents.length"
        :count="$parent.totalRecords"
        :limit="data.limit"
        :offset="data.offset"
        @fetch-data="getParticipentsWithPagination"
      />
    </div>
  </div>
</template>
<script>
import DefaultImage from '@/assets/images/avatars/default_profile_img.png'
import Pagination from '@/components/common/Pagination.vue'
import NoRecordFound from '@/components/common/NoRecordFound.vue'
import { Button, BUTTON_TYPES, BUTTON_SIZE, BUTTON_STYLE } from '@/components/Buttons'
import { Icon, ICONS } from '@/components/UIElements'
import { deleteBooking } from '@/apiManager/gamification'
import { WarningPopup } from '@/components/Actions'
import { makeToast } from '@/utils'
export default {
  name: 'CorePointListing',
  components: {
    Icon,
    Button,
    Pagination,
    NoRecordFound,
    WarningPopup,
  },
  props: {
    participents: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      BUTTON_TYPES,
      BUTTON_SIZE,
      BUTTON_STYLE,
      ICONS,
      makeToast,
      data: this.$parent.data,
      loading: false,
      deleteAction: '',
      id: '',
      challengeId: '',
      warningPopupData: {
        icon: '',
        description: '',
        actionBtnText: '',
      },
      rankImages: [
        {
          src: require('@/assets/images/ranks/rank1.svg'),
          toolTip: 'rank1',
        },
        {
          src: require('@/assets/images/ranks/rank2.svg'),
          toolTip: 'rank2',
        },
        {
          src: require('@/assets/images/ranks/rank3.svg'),
          toolTip: 'rank3',
        },
        {
          src: require('@/assets/images/ranks/rank4.svg'),
          toolTip: 'rank4',
        },
        {
          src: require('@/assets/images/ranks/rank5.svg'),
          toolTip: 'rank5',
        },
      ],
    }
  },
  mounted() {
    this.deleteAction = this.$children.find(child => child.$options.name === 'WarningPopup')
  },
  methods: {
    setUser(id) {
      this.$emit('getUserGamificationData', id)
    },
    getImageUrl(imagePath) {
      return imagePath ? this.constants.getImageUrl(imagePath) : DefaultImage
    },
    getParticipentsWithPagination() {
      this.$parent.getParticipants(this.data)
    },
    showDelModal(challengeId, id) {
      this.id = id
      this.challengeId = challengeId
      this.warningPopupData.icon = ''
      this.warningPopupData.description = ''
      this.warningPopupData.actionBtnText = ''
      this.deleteAction.$refs.warningPopup.showPopup()
    },
    actionYesClick() {
      const data = {
        id: this.id,
        challengeId: this.challengeId,
      }
      deleteBooking(data).then(response => {
        if (response.statusCode === 200) {
          this.makeToast(this.$bvToast, this.$t('activity.attendeesTable.successCreate'), 'success')
          this.deleteAction.$refs.warningPopup.close()
        }
        this.participents.forEach((item, index) => {
          if (item.id === this.id) {
            const data = this.participents
            data.splice(index, 1)
          }
        })
        this.deleteAction.$refs.warningPopup.close()
      })
    },
    getRankImage(rank) {
      if (rank && rank === 1) {
        return this.rankImages[0].src
      }
      if (rank && rank === 2) {
        return this.rankImages[1].src
      }
      if (rank && rank === 3) {
        return this.rankImages[2].src
      }
      if (rank && rank === 4) {
        return this.rankImages[3].src
      }
      return this.rankImages[4].src
    },
  },
}
</script>
<style scoped>
.tr {
    width: 100%;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
@media screen and (min-width: 992px) {
    .tr {
        grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
        margin-bottom: 10px;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }
}
@media screen and (max-width: 991px) {
    .tr {
        grid-template-columns: 1fr 2fr 1fr;
        margin-bottom: 5px;
    }
}
@media (max-width: 389px) {
    .tr {
        grid-template-columns: 2fr 4fr 1fr;
    }
}
.thead .tr {
    color: #FFFFFF;
    background-color: #690FAD;
    border-radius: 11px 11px 0 0;
    padding: 22px 26px;
    height: 60px;
}
.tbody .tr {
    color: #000000;
    background-color: #FFFFFF;
    -webkit-box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.15);
    box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.15);
    border-radius: 11px;
    padding: 10px 30px;
}
.tbody .tr:hover {
    color: #FFFFFF;
    background-color: #690FAD;
}
.tbody .tr:hover .btn-rank svg,
.tbody .tr:hover .btn-rank path {
    fill: #FFFFFA;
}
@media screen and (min-width: 992px) {
    .lg-hide {
        display: none;
    }
}
@media screen and (max-width: 991px) {
    .sm-hide {
        display: none;
    }
}
.ranker-img-box, .ranking-img-box {
    margin-right: 13px;
    width: 100%;
    max-width: 36px;
    display: flex;
    align-items: center;
}
.ranker-img-box img,
.ranker-img-box svg {
    width: 39px;
    max-width: 39px;
    height: 39px;
    max-height: 39px;
    object-fit: fill;
}
.ranker-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 17px;
    letter-spacing: 0;
    text-align: left;
}
</style>





