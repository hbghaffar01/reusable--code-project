<template>
  <div class="attendees">
    <Table class="attendees-table">
      <template v-slot:children>
        <Thead :type="THEAD_TYPES.PRIMARY_GRADIENT">
          <template v-slot:children>
            <TR>
              <template v-slot:children>
                <TH v-if="viewAttendees.participants && viewAttendees.slots" class="id-column" :value="`${viewAttendees.participants ? viewAttendees.participants : ''}/${viewAttendees.slots ? viewAttendees.slots : ''}`" />
                <TH :value="$t('activity.attendeesTable.profile')" />
                <TH :value="$t('activity.attendeesTable.booking')" />
                <TH :value="$t('activity.attendeesTable.email')" />
                <TH :value="$t('activity.attendeesTable.type')" />
                <TH :value="$t('activity.attendeesTable.contact')" />
                <TH class="search-input" value="">
                  <template v-slot:children>
                    <InputWithIcon :icon="ICONS.SEARCH">
                      <template v-slot:input>
                        <Input
                          v-model="searchParticipants"
                          v-debounce:1s="getParticipants"
                          class="attendees-input"
                          inputType="text"
                          :inputStyle="`${INPUT_STYLE.ROUND} ${INPUT_STYLE.NARROW}`"
                          :placeholder="$t('activity.attendeesTable.searchField')"
                          @keydown.enter.prevent="getParticipants"
                        />
                      </template>
                    </InputWithIcon>
                  </template>
                </TH>
              </template>
            </TR>
          </template>
        </Thead>
        <Tbody :numberOfPages="numberOfPages" @onScroll="handleScroll($event)">
          <template v-slot:children>
            <TR v-for="attendees in viewAttendees.member_schedule_activity" :key="attendees.id.toString()">
              <template v-slot:children>
                <TD class="id-column" :value="attendees.fos_user_user.id.toString()" />
                <TD>
                  <template v-slot:children>
                    <Avatar class="attendees-avatar" :src="attendees.fos_user_user.profile_picture ? constants.getImageUrl(attendees.fos_user_user.profile_picture) : require('@/assets/images/avatars/default_profile_img.png')" :alt="attendees.fos_user_user.id.toString()" />
                  </template>
                </TD>
                <TD :value="`${attendees.fos_user_user.firstname} ${attendees.fos_user_user.lastname}`" />
                <TD :value="attendees.fos_user_user.email" />
                <TD :value="`For ${attendees.member_type.substring(3)}`" />
                <TD :value="getContact(attendees.fos_user_user.UserEmergency)" />
                <TD>
                  <template v-slot:children>
                    <div v-if="attendees.checkin" class="attendees-table-success">
                      <H6 class="attendees-table-success-message" value="Checked-in" />
                      <Icon class="attendees-table-success-icon" :type="ICONS.TICK" />
                    </div>
                    <div v-else class="attendees-table-actions">
                      <Button :btnType="BUTTON_TYPES.PRIMARY" :btnStyle="BUTTON_STYLE.ROUND" :size="BUTTON_SIZE.SMALL" @click="showDelModal(attendees.id)">
                        <template v-slot:children>
                          <Icon :type="ICONS.TRASH" />
                        </template>
                      </Button>
                      <Button :btnType="BUTTON_TYPES.DEFAULT" :size="BUTTON_SIZE.SMALL" :btnStyle="BUTTON_STYLE.ROUND" @click="userChecked(attendees.fos_user_user.id)">
                        <template v-slot:children>
                          <Icon :type="ICONS.SCAN" />
                        </template>
                      </Button>
                    </div>
                  </template>
                </TD>
              </template>
            </TR>
            <template v-for="item in data.limit">
              <TR v-if="loading" :key="item">
                <template v-slot:children>
                  <TD colspan="7" class="attendees-loading">
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
    <WarningPopup
      :icon="warningPopupData.icon"
      :description="warningPopupData.description"
      :actionBtnText="warningPopupData.actionBtnText"
      @onActionYes="actionYesClick()"
    />
  </div>
</template>

<script>
import { TextLoader } from '@/components/TextLoader'
import { Button, BUTTON_TYPES, BUTTON_SIZE, BUTTON_STYLE } from '@/components/Buttons'
import { Table, TABLE_TYPES, Tbody, TD, TH, Thead, THEAD_TYPES, TR } from '@/components/Table'
import { Avatar, Icon, ICONS } from '@/components/UIElements'
import { InputWithIcon, Input, INPUT_STYLE } from '@/components/Form'
import { deleteParticipants, activityAttendees, checkInParticipants } from '@/apiManager/attendanceManagement'
import { makeToast } from '@/utils'
import { WarningPopup } from '@/components/Actions'
import { H6 } from '@/components/Typography'

export default {
  name: 'ViewAttendees',
  components: {
    WarningPopup,
    Button,
    Avatar,
    Table,
    Thead,
    Tbody,
    TH,
    TD,
    TR,
    TextLoader,
    InputWithIcon,
    Input,
    Icon,
    H6,
  },
  props: {
    participantId: {
      type: String,
      required: true,
    },
    showActivity: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      TABLE_TYPES,
      THEAD_TYPES,
      BUTTON_TYPES,
      BUTTON_STYLE,
      BUTTON_SIZE,
      ICONS,
      INPUT_STYLE,
      loading: false,
      numberOfPages: 0,
      searchParticipants: '',
      participants: '',
      delId: '',
      viewAttendees: [],
      deleteAction: '',
      userId: '',
      id: this.participantId,
      makeToast,
      debounce: '',
      data: {
        id: '',
        name: '',
        limit: 50,
        offset: 0,
      },
      warningPopupData: {
        icon: '',
        description: '',
        actionBtnText: '',
      },
    }
  },
  mounted() {
    this.getParticipants(this.limit, this.offset)
    this.deleteAction = this.$children.find(child => child.$options.name === 'WarningPopup')
  },
  methods: {
    actionYesClick() {
      if (this.warningPopupData.description) {
        this.checkInUser()
      } else {
        this.removeParticipants()
      }
    },
    checkInUser() {
      const data = {
        id: this.id,
        userId: this.userId,
      }
      checkInParticipants(data).then(response => {
        if (response.statusCode === 200) {
          this.makeToast(this.$bvToast, this.$t('activity.attendeesTable.scan'), 'success')
          this.getParticipants()
        } else {
          this.makeToast(this.$bvToast, response.message, 'danger')
        }
        this.deleteAction.$refs.warningPopup.close()
      })
    },
    handleScroll(page) {
      this.offset = this.limit * page
      this.getParticipants(this.limit, this.offset)
    },
    userChecked(data) {
      this.userId = data
      this.warningPopupData.icon = ICONS.SCAN
      this.warningPopupData.description = this.$t('activity.editCapacity.sureSubHeading')
      this.warningPopupData.actionBtnText = this.$t('activity.editCapacity.checkin')
      this.deleteAction.$refs.warningPopup.showPopup()
    },
    showDelModal(data) {
      this.delId = data
      this.warningPopupData.icon = ''
      this.warningPopupData.description = ''
      this.warningPopupData.actionBtnText = ''
      this.deleteAction.$refs.warningPopup.showPopup()
    },
    getContact(data) {
      const number = data.length ? data.map(item => (item.phoneNumber.length > 0 ? item.phoneNumber : '-')) : '-'
      const [num] = number
      return num
    },
    async getParticipants() {
      this.loading = true
      this.data.id = this.participantId
      this.data.name = this.searchParticipants
      await activityAttendees(this.data).then(response => {
        if (response.statusCode === 200) {
          this.viewAttendees = response.data
          this.loading = false
        }
      })
    },
    removeParticipants() {
      deleteParticipants(this.delId).then(response => {
        if (response.statusCode === 204) {
          this.makeToast(this.$bvToast, this.$t('activity.attendeesTable.successCreate'), 'success')
          this.deleteAction.$refs.warningPopup.close()
        }
        this.viewAttendees.member_schedule_activity.forEach((item, index) => {
          if (item.id === this.delId) {
            const data = this.viewAttendees.member_schedule_activity
            data.splice(index, 1)
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/colors';

.attendees {
  &-table {
    &-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
    }
    &-success {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      text-align: center;
      &-message {
        margin-top: 10px !important;
      }
      &-icon {
        padding: 5px;
        background-color: $primary-default;
        color: $white;
        border-radius: 50%;
      }
    }
    .id-column {
      width: 100px;
    }
  }

  &-input {
    width: 100%;
  }

  &-loading {
    padding: 0 4px;
    background: transparent;
  }
  .search-input {
    width: 300px;
    padding: 0 2rem 0 0 !important;
  }

  &-avatar {
    margin: auto;
  }
}
</style>
