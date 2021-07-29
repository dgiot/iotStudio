<template>
  <div v-if="detail" class="changeInfo">
    <el-row
      v-show="showHard == true"
      type="flex"
      class="row-bg"
      justify="space-around"
    >
      <el-col :span="6">
        <div class="grid-content bg-purple">
          {{ $translateTitle('Maintenance.Ticket number') }} :
          {{ detail.number }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          {{ $translateTitle('Maintenance.Ticket type') }} : {{ detail.type }}
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple">
          {{ $translateTitle('Maintenance.the starting time') }} :
          {{ $moment(detail.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </el-col>
    </el-row>
    <el-steps
      v-show="showHard == true"
      class="steps"
      :active="step"
      simple
      finish-status="success"
    >
      <el-step :title="$translateTitle('Maintenance.To be assigned')" />
      <el-step :title="$translateTitle('Maintenance.Assigned')" />
      <el-step :title="$translateTitle('Maintenance.Processed')" />
      <el-step :title="$translateTitle('Maintenance.Statement')" />
    </el-steps>
    <step1
      v-if="step === 1"
      ref="step1"
      :detail="detail"
      :step="step"
      :show-hard="showHard"
      :show-footer="showFooter"
      @change-step="handleSetStep"
    />
    <step2
      v-if="step === 2"
      ref="step2"
      :detail="detail"
      :step="step"
      show-hard="showHard"
      :show-footer="showFooter"
      @change-step="handleSetStep"
    />
    <step3
      v-if="step === 3"
      ref="step3"
      :detail="detail"
      :step="step"
      show-hard="showHard"
      :show-footer="showFooter"
      @change-step="handleSetStep"
    />
    <Step4
      v-if="step === 4"
      ref="step4"
      :detail="detail"
      :show-footer="showFooter"
      show-hard="showHard"
      :step="step"
      @change-step="handleSetStep"
    />
  </div>
  <div v-else class="empty">
    <vab-empty />
  </div>
</template>
<script>
  import Step1 from './components/Step1'
  import Step2 from './components/Step2'
  import Step3 from './components/Step3'
  import Step4 from './components/Step4'

  export default {
    name: 'ChangeInfo',
    components: { Step1, Step2, Step3, Step4 },
    props: {
      detail: {
        type: Object,
        default: () => {},
      },
      showFooter: {
        type: Boolean,
        default: false,
      },
      showHard: {
        type: Boolean,
        default: false,
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        isStep: 0,
      }
    },
    mounted() {
      if (this.step == 4) {
        // this.step = 0
        this.isStep = 4
      }
      console.log(this.step)
    },
    methods: {
      next() {
        if (this.isStep++ > 5) this.isStep = 0
      },
      handleSetStep(step, detail) {
        if (detail) this.form = Object.assign(this.form, detail)
      },
    },
  }
</script>
<style scoped lang="scss">
  .changeInfo {
    .steps {
      margin: 20px 0;
    }
  }
</style>
