<template>
  <multiselect
    v-model="model"
    :options="options"
    :multiple="multiple"
    :close-on-select="false"
    :clear-on-select="false"
    :preserve-search="true"
    :placeholder="placeholder"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const emit = defineEmits(['update:modelValue'])
const model = defineModel()
</script>
<style scoped>
::v-deep(.multiselect__tags) {
  background-color: #4b1d1d;
  color: #f5e9e0;
  font-size: 16px;
  border: 1px solid #4b1d1d;
}

::v-deep(.multiselect__tag) {
  background-color: #7f1d1d;
  color: #f5e9e0;
  border-radius: 4px;
  font-weight: 600;
}

::v-deep(.multiselect__option) {
  background-color: #f7ecec;
  color: #4b1d1d;
  font-style: normal;
  padding: 8px 12px;
  cursor: pointer;
}

::v-deep(.multiselect__option--highlight) {
  background-color: #7f1d1d;
  color: #f5e9e0;
  font-weight: bold;
}

::v-deep(.multiselect) {
  background-color: #4b1d1d;
  border: 1px solid #7f1d1d;
  border-radius: 10px;
}
</style>
