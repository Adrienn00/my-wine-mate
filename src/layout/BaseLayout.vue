<template>
  <div>
    <h2>BaseLayout</h2>
    <router-link to="/">Home</router-link> 
    <router-link to="/about">About</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "BaseLayout",
};
</script>
