<template>
    <div>
        <h1>{{msg}}</h1>
        <img src="../assets/images/logo.png" alt="logo" />
    </div>
</template>

<script>
    export default {
        name:'header',
        data(){
            return {
                msg:'头部'
            }
        }
    }
</script>

<style scoped>
h1{
    color: blue;
}
</style>
