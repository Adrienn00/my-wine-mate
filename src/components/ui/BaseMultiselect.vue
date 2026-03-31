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
  font-size: 0.95rem;
  border: 1px solid rgba(128, 45, 65, 0.26);
  border-radius: 0.9rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

::v-deep(.multiselect__tag) {
  background-color: #7a2038;
  color: #fff7ef;
  border-radius: 999px;
  font-weight: 600;
}

::v-deep(.multiselect__option) {
  background-color: #fff6ec;
  color: #3a2521;
  font-style: normal;
  font-size: 0.92rem;
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
  border-radius: 0.9rem;
  font-family: inherit;
}

::v-deep(.multiselect__placeholder),
::v-deep(.multiselect__single),
::v-deep(.multiselect__input) {
  font-family: inherit;
  font-size: 0.95rem;
}
</style>
