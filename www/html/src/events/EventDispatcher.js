/**
 * baofeng框架 事件管理中心控制事件删除派发
 * User: ningxiao
 * Date: 13-3-19
 * Time: 下午3:04
 */
baofeng.utils.provide("baofeng.events.EventDispatcher");
baofeng.events.funList = {};//全局注册事件函数存储对象
baofeng.events.uint = 0;//注册对象标示
baofeng.events.EventDispatcher = function () {
}
/**
 * 注册事件
 * @param type 事件类型
 * @param listener 注册事件执行函数
 * @return {Number} 返回当前注册函数key
 */
baofeng.events.EventDispatcher.prototype.addEventListener = function (type, listener) {
    baofeng.events.uint++;
    baofeng.events.funList[baofeng.events.uint] = listener;
    if (this[type] && this[type].constructor === Array) {
        this[type].push(baofeng.events.uint);
    } else {
        this[type] = [baofeng.events.uint];
    }
    return baofeng.events.uint;
}
/**
 * 派发事件执行
 * @param event
 */
baofeng.events.EventDispatcher.prototype.dispatchEvent = function (event) {
    var arr = this[event.type];
    if (!arr) {
        return;
    }
    for (var i = 0, l = arr.length; i < l; i++) {
        if (baofeng.events.funList[arr[i]]) {
            event.target = this;
            baofeng.events.funList[arr[i]].call(this, event);
        }
    }
}
/**
 * 验证是否注册事件
 * @param type 事件类型
 * @return {Boolean} 返回true false
 */
baofeng.events.EventDispatcher.prototype.hasEventListener = function (type) {
    if (this[type]) {
        return true;
    }
    return false;
}
/**
 * 删除全部该类型事件
 * @param type
 */
baofeng.events.EventDispatcher.prototype.removeEventListener = function (type) {
    for (var key in this[type]) {
        delete baofeng.events.funList[key];
    }
    delete this[type];
}
/**
 * 删除指定key事件
 * @param key
 */
baofeng.events.EventDispatcher.prototype.unlistenByKey = function (key) {
    if(key in baofeng.events.funList){
        baofeng.events.funList[key] = null;
        delete baofeng.events.funList[key];
    }
}