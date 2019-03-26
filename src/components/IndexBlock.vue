<template>
    <Tabs type="card">
        <TabPane label="手机" icon="md-phone-portrait"> <Phone/> </TabPane>
        <TabPane label="配件" icon="md-battery-charging"> <Accessory/> </TabPane>
        <TabPane label="家电" icon="md-bulb"> <Appliance/> </TabPane>
        <TabPane label="智能硬件" icon="ios-car"> <Hardware/> </TabPane>
    </Tabs>
</template>

<script>
export default {
  name: 'block',
  data() {
    return {

    }
  },
  components: {
    Phone: resolve => require(['../components/blocks/Phone.vue'], resolve),
    Accessory: resolve => require(['../components/blocks/Accessory.vue'], resolve),
    Hardware: resolve => require(['../components/blocks/Hardware.vue'], resolve),
    Appliance: resolve => require(['../components/blocks/Appliance.vue'], resolve),
  }
}
</script>

<style lang="css" scoped>
</style>
