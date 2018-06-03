<template>
    <div id="app">
        <span>{{msg}}</span>
        <p class="test">test text</p>
    </div>
</template>

<script>
    export default{
        name:'app',
        data(){
            return {
                msg:'hello vue!!!'
            }
        }
    }
</script>

<style>
.test{
  color: #e10505;
}
</style>
