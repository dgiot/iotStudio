<template>
  <el-select
    :value="rawValue"
    v-bind="$attrs"
    class="emq-select"
    v-on="$listeners"
  >
    <slot>
      <el-option
        v-for="(item, i) in options"
        :key="i"
        :value="item[fieldName.value]"
        :label="item[fieldName.label]"
        :disabled="isDisabled(item)"
      >
        <slot name="option" :item="item"></slot>
      </el-option>
    </slot>
  </el-select>
</template>

<script>
  export default {
    name: 'EmqSelect',
    components: {},
    props: {
      field: {
        type: Object,
        required: true,
      },
      fieldName: {
        type: Object,
        default: () => ({
          label: 'label',
          value: 'value',
        }),
      },
      disabledItem: {
        type: Array,
        default: () => [],
      },
      refresh: {
        type: Boolean,
      },
    },
    data() {
      return {
        options: [],
        parserField: {},
      }
    },
    computed: {
      rawValue: {
        get() {
          return typeof this.value === 'boolean'
            ? this.value.toString()
            : this.value
        },
        set(val) {
          const valueKey = this.fieldName.value
          const item = this.options.find(($) => $[valueKey] === val)
          if (item && this.parserField[valueKey]) {
            val = val === 'true'
          }
          this.$emit('update:value', val)
        },
      },
    },
    watch: {
      refresh(val) {
        if (val) {
          this.loadData()
        }
      },
      field: {
        handler() {
          this.loadData()
        },
        deep: true,
      },
    },
    created() {
      this.loadData()
    },
    methods: {
      async loadData() {
        const options = await this.getOptions()
        this.parserField = {}
        const valueKey = this.fieldName.value
        const labelKey = this.fieldName.label
        this.options = options.map((option) => {
          const value = option[valueKey]
          const label = option[labelKey]
          if (typeof value === 'boolean') {
            this.parserField[valueKey] = 'boolean'
            option[valueKey] = value.toString()
            if (typeof label === 'boolean') {
              option[labelKey] = label.toString()
            }
          }
          return option
        })
        this.$emit('update:refresh', false)
      },
      isDisabled(item) {
        return this.disabledItem.includes(item[this.fieldName.value])
      },
      async getOptions() {
        const { api, url, options, list } = this.field
        let value = []
        if (options) {
          value = options
        } else if (list) {
          value = list.map(($) => ({ label: $, value: $ }))
        } else if (api) {
          value = await api()
        }
        return value
      },
    },
  }
</script>
