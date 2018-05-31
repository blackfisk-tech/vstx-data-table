<template lang="pug">
  .vstx-data-table
    table.table
      thead
        th Id
      tbody
        tr(v-for="item in items")
          td {{ item.id }}
</template>

<script>
export default {
  name: 'vstx-data-table',
  introduction: 'A data table component for the Vue Stacks Template',
  description: '',
  data () {
    return {
      items: [
        {id: 1},
        {id: 2},
        {id: 3}
      ]
    }
  }
}
</script>

<style lang="stylus">
  .vstx-data-table
    border 1px solid red
</style>