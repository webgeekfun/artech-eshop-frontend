/*

触发方式：

vee-validate提供了四种触发验证的方式，默认情况下用户输入时触发。

1. Aggressive，输入时触发(默认)
2. Passive，表单提交时触发
3. Lazy，失去焦点(blur)或者更改(change)时触发
4. Eager，Aggressive 和 Lazy 的组合，当输入框失去焦点(blur)或者内容更改(change)时触发一次校验，如果无效，进入Aggressive模式，直到输入变为有效

*/

import { extend, localize } from 'vee-validate';
import { required, email, min, length, confirmed } from 'vee-validate/dist/rules';
import zh from 'vee-validate/dist/locale/zh_CN.json';
// import en from 'vee-validate/dist/locale/en.json';

extend('email', email);

extend('min', min);
extend('required', required);

extend('length', length);

extend('confirmed', confirmed);

extend('password', {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max']
});

// 手机号验证
extend('telephone', {
  validate(value) {
    // return /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(value)
    return /^1[0-9]{10}$/.test(value); //1开头的11位数字
  }
});

localize({
  'zh-CN': {
    // names: {
    //   email: '邮箱',
    //   password: '密码'
    // },
    messages: {
      ...zh.messages, //...zh.messages是加载vee-validate内置的错误消息
      required: '请输入{_field_}', //{_field_}是一个占位符，它会被ValidationProvider的name属性值所替代
      // email: '请输入正确的邮箱格式',
      // password: '密码必须是6到18位',
      telephone: '手机号码格式不正确',
      confirmed: '密码和确认密码不一致'
    }
  }
  // en: {
  //   names: {
  //     email: 'email',
  //     password: 'password'
  //   },
  //   messages: {
  //     ...en.messages,
  //     required: 'please input {_field_}',
  //     email: 'please input correct email',
  //     password: 'the password length should be 6 to 18'
  //   }
  // }
});

// 使用某种语言
localize('zh-CN');
// localize('en')
