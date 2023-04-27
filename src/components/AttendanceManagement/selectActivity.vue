<template>
  <Table class="activity-table">
    <template v-slot:children>
      <Thead :type="THEAD_TYPES.PRIMARY_GRADIENT">
        <template v-slot:children>
          <TR>
            <template v-slot:children>
              <TH class="id-column" :value="$t('activity.activityTable.id')" />
              <TH :value="$t('activity.activityTable.name')" />
              <TH :value="$t('activity.activityTable.booking')" />
              <TH :value="$t('activity.activityTable.type')" />
              <TH :value="$t('activity.activityTable.date')" />
              <TH :value="$t('activity.activityTable.time')" />
              <TH :value="$t('activity.activityTable.payment')" />
              <TH :value="$t('activity.activityTable.status')" />
              <TH class="actions" :value="$t('activity.activityTable.action')" />
            </template>
          </TR>
        </template>
      </Thead>
      <Tbody :numberOfPages="numberOfPages" @onScroll="handleScroll($event)">
        <template v-slot:children>
          <TR v-for="activity in scheduleActivities" :key="activity.id.toString()">
            <template v-slot:children>
              <TD class="id-column" :value="activity.id.toString()" />
              <TD :value="activity.activity_schedule.activity.name" />
              <TD :value="`${activity.bookingCount}/${activity.slots}`" />
              <TD :value="activity.activity_schedule.activity.activity_type.name" />
              <TD :value="formattedDate(activity.schedule_date)" />
              <TD :value="formattedDuration(activity.schedule_date, activity.duration)" />
              <TD :value="getPaymentType(activity.activity_schedule.is_free, activity.activity_schedule.offer_online)" />
              <TD :value="getStatus(activity.schedule_date, activity.duration)" />
              <TD class="actions">
                <template v-slot:children>
                  <Button class="actions-buttons" :btnType="BUTTON_TYPES.PRIMARY" :size="BUTTON_SIZE.SMALL" :btnStyle="BUTTON_STYLE.ROUND" @click="showAttendees(activity)">
                    <template v-slot:children>
                      <Icon :type="ICONS.CHEVRON" />
                    </template>
                  </Button>
                </template>
              </TD>
            </template>
          </TR>
          <template v-for="item in limit">
            <TR v-if="loading" :key="item">
              <template v-slot:children>
                <TD colspan="8" class="activity-loading">
                  <template v-slot:children>
                    <TextLoader height="4rem" />
                  </template>
                </TD>
              </template>
            </TR>
          </template>
        </template>
      </Tbody>
    </template>
  </Table>
</template>

<script>
import { Table, TABLE_TYPES, Thead, THEAD_TYPES, Tbody, TR, TH, TD } from '@/components/Table'
import { Button, BUTTON_TYPES, BUTTON_SIZE, BUTTON_STYLE } from '@/components/Buttons'
import { Icon, ICONS } from '@/components/UIElements'
import { TextLoader } from '@/components/TextLoader'
import { getScheduleActivity } from '@/apiManager/scheduleActivity'
import { getStatus, formattedDate, formattedDuration, getPaymentType } from '@/utils'

export default {
  name: 'SelectActivity',
  components: {
    Button,
    Table,
    Thead,
    Tbody,
    TR,
    TH,
    TD,
    Icon,
    TextLoader,
  },
  data() {
    return {
      TABLE_TYPES,
      THEAD_TYPES,
      BUTTON_TYPES,
      BUTTON_SIZE,
      BUTTON_STYLE,
      ICONS,
      limit: 50,
      offset: 0,
      loading: false,
      scheduleActivities: [],
      totalRecords: 0,
      numberOfPages: 0,
      getStatus,
      formattedDate,
      formattedDuration,
      getPaymentType,
    }
  },
  mounted() {
    this.getActivityListing(this.limit, this.offset)
  },
  methods: {
    async getActivityListing(limit, offset) {
      this.loading = true
      getScheduleActivity({ limit, offset })
        .then(response => {
          if (response.statusCode === 200) {
            this.scheduleActivities = [...this.scheduleActivities, ...response.data]
            this.totalRecords = response.meta.item_count
            this.numberOfPages = Math.ceil(this.totalRecords / this.limit)
            this.scheduleActivities.forEach(items => {
              this.$emit('setHeading', items.instructor)
            })
          }
          this.loading = false
        })
    },
    showAttendees(data) {
      this.$emit('showAttendees', data)
    },
    handleScroll(page) {
      this.offset = this.limit * page
      this.getActivityListing(this.limit, this.offset)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

  .activity {
    &-table {
      .id-column {
        width: 100px;
      }
      .actions {
        &-buttons {
          transform: rotate(180deg) !important;
          margin: auto;
        }
      }
    }
    .loading {
      padding: 0 4px;
      background: transparent;
    }
  }
</style>
