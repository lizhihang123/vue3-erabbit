<template>
    <div v-show="name === activeName">
        <slot />
    </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabPanel',
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return {
      activeName
    }
  }
}
</script>
