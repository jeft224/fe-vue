<template>
    <div id="app">
        <myHeader></myHeader>    
        <span>{{msg}}</span>
        <p class="test">test text</p>
    </div>
</template>

<script>
import myHeader from './components/header'
    export default{
        name:'app',
        data(){
            return {
                msg:'hello vue!!!'
            }
        },
        components:{
            myHeader
        }
    }
</script>

<style>
.test{
  color: #e10505;
}
</style>
