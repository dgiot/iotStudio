<template>
  <div class="runData">
    <div
      v-if="_tableDict"
      class="devicedetail"
    >
      <el-row class="runData_row">
        <el-col
          v-for="(item, index) in _tableDict"
          :key="index"
          class="runData_col"
          :span="4"
        >
          <el-card
            class="box-card"
            shadow="hover"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>{{ item.name }}</span>
              <el-button
                icon="el-icon-refresh"
                style="float: right; padding: 3px 0"
                type="text"
              />
            </div>
            <div class="text item">
              {{ item.identifier }}
              {{ devicedetail[`${item.identifier}`] }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <f-render
        v-if="_tableParser.formDesc"
        v-model="_tableParser"
        :config="_tableParser"
        pure
      />
      <vab-empty v-else />
    </div>
    <vab-empty v-else />
  </div>
</template>
<script>
/* eslint-disable */
/* eslint-disable */
import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'DeviceState',
    props: {
      devicedetail: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        _tableDict: 'global/_tableDict',
      }),
      _tableParser: {
        get: function () {
          console.log(this.$store.state.global._tableParser)
          return this.$store.state.global._tableParser
        },
        set: function (val) {
          this.$emit('ParserSave', val)
        },
      },
    },
    methods: {
      ...mapMutations({
        set_tableDict: 'global/set_tableDict',
        set_tableParser: 'global/set_tableParser',
      }),
    },
  }
</script>
<style scoped lang="scss">
  .runData {
    height: 50%;
    overflow-y: auto;
    .devicedetail {
      width: 100%;
      height: 100%;

      .runData_row {
        width: 100%;
        .runData_col {
          margin: 10px;
          font-size: 14px;
        }
      }
    }
  }
</style>
