/**
 * baofeng框架 事件基类
 * User: ningxiao
 * Date: 13-3-19
 * Time: 下午3:06
 */
baofeng.utils.provide("baofeng.events.Event");
baofeng.events.Event = function (type) {
    this.target = null;//事件目标。
    this.type = type;//事件的类型
    this.data = null;//带出数据
}
baofeng.events.Event.ERROR = 'error';
baofeng.events.Event.COMPLETE = 'complete';
baofeng.events.Event.PROGRESS = 'progress';
baofeng.events.Event.LOADSTAET = 'loadstart';

