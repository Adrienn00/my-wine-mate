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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const model = defineModel()
</script>
<style scoped>
::v-deep(.multiselect__tags) {
  background-color: #fff9f1;
  color: #2d1f1c;
  font-size: 16px;
  border: 1px solid rgba(128, 45, 65, 0.26);
  border-radius: 0.75rem;
}

::v-deep(.multiselect__tag) {
  background-color: #7a2038;
  color: #fff7ef;
  border-radius: 4px;
  font-weight: 600;
}

::v-deep(.multiselect__option) {
  background-color: #fff6ec;
  color: #3a2521;
  font-style: normal;
  padding: 8px 12px;
  cursor: pointer;
}

::v-deep(.multiselect__option--highlight) {
  background-color: #8c2d41;
  color: #fff6ef;
  font-weight: bold;
}

::v-deep(.multiselect) {
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
}
</style>
