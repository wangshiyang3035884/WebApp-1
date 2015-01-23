/*********************************************************************************
 * animation.js
 * 帮助类
 *
 * @project baofeng-js-framework
 * @version $id$
 * @copyright 2001-2013 sampeng
 * @author sampeng <penglingjun@baofeng.com>
 * @license {@link www.baofeng.com}
 *********************************************************************************/
baofeng.utils.provide("baofeng.animation");
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {  
    window.setTimeout(callback, 1000 / 60);
} 
var cancelAnimationFrame = window.cancelAnimationFrame ||window.webkitCancelAnimationFrame ||window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.clearTimeout;
baofeng.animation.animate = {};
baofeng.animation.playAnimate = false;
baofeng.animation.mix = function(r, s, ov, wl) {
    if (!s || !r)
        return r;
    if (ov === undefined)
        ov = true;
    var i, p, len;

    if (wl && ( len = wl.length)) {
        for ( i = 0; i < len; i++) {
            p = wl[i];
            if ( p in s) {
                baofeng.animation._mix(p, r, s, ov);
            }
        }
    } else {
        for (p in s) {
            baofeng.animation._mix(p, r, s, ov);
        }
    }
    return r;
};

baofeng.animation._mix = function() {
    if (ov || !( p in r)) {
        r[p] = s[p];
    }
};
baofeng.animation.startDraw = function(){
    for(var i in baofeng.animation.animate){
        baofeng.animation.animate[i]();
    }
    if(baofeng.animation.playAnimate){
        requestAnimationFrame(baofeng.animation.startDraw);
    }   
}
baofeng.animation.Animate = function(obj,json,times,fx,fn){
    var iCur = {},startTime = baofeng.animation.now();
    if( typeof times == 'undefined' ){
        times = 400;
        fx = 'linear';
    }
    if( typeof times == 'string' ){
        if(typeof fx == 'function'){
            fn = fx;
        }
        fx = times;
        times = 400;
    }else if(typeof times == 'function'){
        fn = times;
        times = 400;
        fx = 'linear';
    }else if(typeof times == 'number'){
        if(typeof fx == 'function'){
            fn = fx;
            fx = 'linear';
        }else if(typeof fx == 'undefined'){
            fx = 'linear';
        }
    }
    for(var attr in json){
        iCur[attr] = 0;
        if( attr == 'opacity' ){
            if(Math.round(baofeng.animation.getStyle(obj,attr)*100) == 0){
                iCur[attr] = 0;
            }else{
                iCur[attr] = Math.round(baofeng.animation.getStyle(obj,attr)*100) || 100;
            }
        }else{
            iCur[attr] = parseInt(baofeng.animation.getStyle(obj,attr)) || 0;
        }
    }
    baofeng.animation.ClearAnimate(obj["animateKey"]);
    obj["animateKey"] = baofeng.animation.gUid();
    baofeng.animation.addAnimate(obj["animateKey"],function(){
        var changeTime = baofeng.animation.now();
        var scale = 1 - Math.max(0,startTime - changeTime + times)/times;
        for(var attr in json){
            var value = baofeng.animation.Tween[fx](scale*times, iCur[attr] , json[attr] - iCur[attr] , times );
            if(attr == 'opacity'){
                obj.style.filter = 'alpha(opacity='+ value +')';
                obj.style.opacity = value/100;
            }
            else{
                obj.style[attr] = value + 'px';
            }                
        }
        if(scale == 1){
            baofeng.animation.stopAnimate(obj["animateKey"]);
            if(fn){
                fn.call(obj);
            }
        }
    });
    return obj["animateKey"]; 
}
baofeng.animation.addAnimate = function(key,animate){
    if(!baofeng.animation.playAnimate){
        baofeng.animation.playAnimate = true;
        baofeng.animation.startDraw();
    }   
    baofeng.animation.animate[key] = animate;
}
baofeng.animation.stopAnimate = function(key){
    baofeng.animation.playAnimate = false;
    if(baofeng.animation.animate[key]){
        baofeng.animation.animate[key] = null;
        delete baofeng.animation.animate[key];
    }
    for(var i in baofeng.animation.animate){
        baofeng.animation.playAnimate = true;
    }   
}
baofeng.animation.gUid = function () {
    return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function (c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}
baofeng.animation.now = function(){
    return (new Date()).getTime();  
}
baofeng.animation.getStyle = function(obj,attr){
    return obj["currentStyle"]?obj["currentStyle"][attr]:getComputedStyle(obj,null)[attr];
}
baofeng.animation.ClearAnimate = function(key){
    if(key in baofeng.animation.animate){
        baofeng.animation.animate[key] = null;
        delete baofeng.animation.animate[key];
    }   
}
baofeng.animation.Tween = {
    "linear": function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    "easeIn": function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    "easeOut": function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    "easeBoth": function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    "easeInStrong": function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    "easeOutStrong": function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    "easeBothStrong": function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    "elasticIn": function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) { 
            return b; 
        }
        if ( (t /= d) == 1 ) {
            return b+c; 
        }
        if (!p) {
            p=d*0.3; 
        }
        if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    "elasticOut": function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },    
    "elasticBoth": function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    "backIn": function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
           s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    "backOut": function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }, 
    "backBoth": function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    "bounceIn": function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - baofeng.animation.Tween['bounceOut'](d-t, 0, c, d) + b;
    },       
    "bounceOut": function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },      
    "bounceBoth": function(t, b, c, d){
        if (t < d/2) {
            return baofeng.animation.Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return baofeng.animation.Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}
