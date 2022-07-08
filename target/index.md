# 应用配置

## errorHandler
通俗来说就是用于处理没有被捕获的代码错误, 与try{}catch{}不同的一点是try{}catch{}能够捕获错误并能够让包裹层外部的代码仍正常执行, 而这是errorHandler做不到的. 注意: errorhandler仅只能处理发生在生命周期内的错误, 是无法捕获js/ts文件内的错误

**参数**
err: 错误原因, 与catch(err)中的err  
vm: this环境
info: 描述错误发生的阶段, 例如: 'create ho ok'、'mounted hook'

**示例**
```js
<!-- main.ts -->
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.errorHandler = (err: any, vm: any, info: any) => {
    console.log(err, vm, info);
};
app.mount('#app')

throw new Error('测试'); // 注意: 该错误是无法被errorHandler捕获的

<!-- App.vue --- 未处理 -->
<template>
  <div class='app-container'>
    Hello World!
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from 'vue';

  // **************功能分割线***************
  onMounted(() => {
    let val = null;
    if(val.length) { // 这里会发生错误, 从而被捕获
        console.log('执行1'); // 不会执行
    }
    console.log('执行2'); // 不会执行
  })
</script>

<template>
  <div class='app-container'>
    Hello World!
  </div>
</template>

<!-- App.vue --- try{}catch{}捕获 -->
<script lang='ts' setup>
  import { ref, onMounted } from 'vue';

  // **************功能分割线***************
  onMounted(() => {
    let val = null;
    try {
      if(val.length) {
        console.log('执行1'); // 不会执行
      }
    } catch (error) {
      console.log(error); // 执行并打印出原因
    }
    console.log('执行2');// 正常执行
  })
</script>
```

## warnHandler
用于捕获警告, 不会再生产环境中生效

**参数**
msg: 警告信息
vm: this环境
trace: 警告错误所发生的文件位置, 例如示例中的为: at <App>

**示例**
```js
<!-- main.ts -->
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.warnHandler = (msg, vm, trace) => {
    console.log(msg, vm, trace);
}
app.mount('#app')
<!-- App.vue -->
<template>
  <div class='app-container'>
    <gorgeous-button>
      {{ 'Hello World!' }}
    </gorgeous-button>
  </div> 
</template>
```

## globalProperties
添加一个可以在全局访问的属性, 可以用于替代vue2中Vue.prototype该种方式, 但是相较于vue2能够习惯使用this来说是一个比较方便的方式, 但是在vue3中普遍人们使用setup语法糖方式进行编码, 因此拿到this是一个比较不便的事情, 需要通过当前实例中拿出

**参数**
无

**示例**
```js
<!-- main.ts -->
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.globalProperties.$myGlobal = (val: string) => {
    console.log(val);
};
app.mount('#app')

<!-- App.vue -->
<template>
  <div class='app-container'>Hello World!</div>
</template>

<script lang='ts' setup>
  import { getCurrentInstance } from 'vue';

  const internalInstance = getCurrentInstance();
  const _this = internalInstance?.appContext.config.globalProperties;
  _this?.$myGlobal('This is a global property') // This is a global property
</script>
```

## optionMergeStrategies
暂时有点没摸清楚这玩意在vue3中的意义

## performance
性能追踪, 好像没啥用, 原生所具有的, 可以查询[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/mark), 仅适用于开发模式, 暂时没摸索出怎么用的

**类型**
boolean

## compilerOptions
运行时编译器的选项

**示例**
```js
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {}
    }
  })],
})
```

## compilerOptions.isCustomElement
用于避免Vue对于自己的无法编译的自定义标签进行警告

**参数**
tag: 标签名

**示例**
```js
<!-- vite.config.js -->
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => {
          console.log(tag); // tag // gorgeous-button // 该打印是在终端中打印的, 就意味着该过程是在编译时进行的
          return tag.indexOf('gorgeous-') != -1;
        }
      }
    }
  })],
})

<!-- App.vue -->
<template>
  <div class='app-container'>
    <gorgeous-button>
      Hello World!
    </gorgeous-button>
  </div> 
</template>
```

## complierOptions.whitespace
控制Vue压缩模板元素时的规则

**参数**
'condense' | 'preserve'
condense: 规则1 & 规则2 & 规则3
preserve: 规则1

**规则**
1. 元素内的多个开头/结尾空格会被压缩成一个空格
2. 元素之间的包括折行在内的多个空格会被移除
3. 文本节点之间可被压缩的空格都会被压缩为一个控制

**示例**
```js
<!-- vite.config.js -->
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => {
          console.log('vite:', tag);
          return tag.indexOf('gorgeous-') != -1;
        },
        whitespace: 'condense', // 'condense' | 'preserve'
        delimiters: ['[[', ']]'],
      }
    }
  })],
})

<!-- App.vue -->
<template>
  <div class='app-container'>
    <div>
      Hello World!
    </div>
  </div>
</template>

<!-- condense编译压缩部分结果 -->
// const _hoisted_2 = /*#__PURE__*/_createElementVNode("gorgeous-button", null, " Hello World! ", -1 /* HOISTED */)

<!-- preserve编译压缩部分结果 -->
const _hoisted_2 = /*#__PURE__*/_createElementVNode("gorgeous-button", null, "\n      Hello World!\n    ", -1 /* HOISTED */)

```

## compilerOptions.delimiters
用于控制在模板中使用值, 及vue的默认这种大胡子语法```{{ 'Hello World!' }}```, 一般用于避免和同样使用大胡子语法的其他框架产生冲突

**注意**
只允许有一种模板语法及```{{ 'Hello World!' }}```与```[[ 'Hello World!' ]]```仅且只能有一种生效

**参数**
[string, string]

**示例**
```js
<!-- vite.config.js -->
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        delimiters: ['[[', ']]'],
      }
    }
  })],
})

<!-- App.vue -->
<template>
  <div class='app-container'>
    <gorgeous-button>
      {{ 'Hello World!' }}[[ 'Hello World!' ]]
    </gorgeous-button>
  </div> 
</template>

<!-- 页面展示出的效果 -->
{{ 'Hello World!' }}Hello World!
```

## compilerOptions.comments
用于控制是否保留js中的注释, 默认为保存注释, 该配置是用于针对生产环境下的代码, 开发环境下的注释是始终被保留的

**注意**
在生产环境中强制保留的注释在build后会变为unicode字符
例如在接下来的实例中: 这是一段注释 -> \u8FD9\u662F\u4E00\u6BB5\u6CE8\u91CA

**参数**
boolean

**示例**
```js
<!-- App.vue -->
<template>
  <div class='app-container'>
    <gorgeous-button>
      <!-- 这是一段注释 -->
      {{ 'Hello World!' }}
    </gorgeous-button>
  </div> 
</template>

<!-- App.vue编译结果--comments:false -->
const el = {},
    tl = { class: "app-container" },
    nl = pr(Ar("Hello World!"));

function sl(e, t) { const n = ii("gorgeous-button"); return fi(), di("div", tl, [Le(n, null, { default: Js(() => [nl]), _: 1 })]) }
var rl = Gi(el, [
    ["render", sl]
]);
const ol = Zi(rl);
ol.mount("#app");
<!-- App.vue编译结果--comments:true -->
const nl = {},
    sl = { class: "app-container" },
    rl = mr(Fr("Hello World!"));

function ol(e, t) { const n = ci("gorgeous-button"); return dr(), di("div", sl, [Ce(n, null, { default: ks(() => [_i(" \u8FD9\u662F\u4E00\u6BB5\u6CE8\u91CA "), rl]), _: 1 })]) }
var il = tl(nl, [
    ["render", ol]
]);
const ll = Gi(il);
ll.mount("#app");
```

# 应用API
在Vue3中不再是直接从Vue库中直接默认导出拿到Vue而是需要导出createApp用来自己调用生成一个应用实例App

## component
能够用于进行注册全局组件和检测某个组件是否全局注册

**参数**
name: string
definition?: Function | Object

**示例**
```js
// HelloWorld.vue
<template>
    <div class='hello-world-container'>
        Hello World!
    </div>
</template>

<script lang="ts">
    export default {
        name: 'HelloWorldComponent'
    }
</script>

// main.ts
import App from './App.vue';
import HelloWorld from './components/HelloWorld.vue';

const app = createApp(App);
// 注册一个全局组件叫做hello-world, 其实例为HelloWorld
app.component('hello-world', HelloWorld);
console.log(HelloWorld.name); // HelloWorldComponent
console.log(app.component('hello-world')); // 组件定义
console.log(app.component('hello-world-1')); // undefined
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    <hello-world/>
  </div> 
</template>
```

## config
一个包含应用配置的对象, 目前不知道官网示例中对于app.config = {}中的对象内的配置应该怎么配置

**示例**
```js
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config = {
    performance: false,
    optionMergeStrategies: {
        // 感觉不到有啥用
    },
    globalProperties: {
        // 不知为何这个没有注册上
        $print: (val: string) => {
            console.log(val);
        }
    },
    compilerOptions: {
        // 与应用配置中的一致效果
    }
}
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    Hello World!
  </div> 
</template>

<script lang='ts' setup>
  import { getCurrentInstance } from 'vue';

  const internalInstance = getCurrentInstance();
  const _this = internalInstance?.appContext.config.globalProperties;
  console.log(_this);
</script>
```

## directive
用于注册全局指令和检测全局指令, 注册的指令可分为正常的注册和函数指令注册两种方式

**参数**
el: Element
binding?: DirectiveBinding<any>

**示例**
```js
// 这是自己写的一个过滤input的指令
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.directive('number', (el: HTMLInputElement, binding) => {
    function handleTrimNoNumber(el: HTMLInputElement): void {
        el.value = el.value.replace(/[^\d]/g, '');
        binding.value(el.value);
    }
    el.addEventListener('input', handleTrimNoNumber.bind(null, el))
});
console.log(app.directive('number')); // 函数
console.log(app.directive('float-number')); // undefined
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    <input type="text" v-number="correctionNumber" >
  </div> 
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  
  // **************功能分割线***************
  const inputVal = ref<string>('');
  const correctionNumber = (val: string) => {
    inputVal.value = val;
  }
</script>
```

## mixin
可用于作用域全局的任意生命周期统一混入的处理方式

**示例**
```js
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mixin({
    beforeCreate() {
        console.log('mixin beforeCreate!');
    },
    created() {
        console.log('mixin created!');
    },
    beforeMount() {
        console.log('mixin beforeMount!');
    },
    mounted() {
        console.log('mixin mounted!');
    },
    beforeUpdate() {
        console.log('mixin beforeUpdate!');
    },
    updated() {
        console.log('mixin updated!');
    },
    beforeUnmount() {
        console.log('mixin beforeUnmount!');
    },
    unmounted() {
        console.log('mixin unmount!');
    }
})
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    Hello World!
  </div> 
</template>
// 组件运行后首先会自动触发mixin中的beforeCreate, created, beforeMount, mounted, 其他几个生命钩子同理
```

## mount
挂载应用实例的根组件

**参数**
root: Element | string string为一个选择器
isHydrate?: boolean 暂未看到差别


**示例**
```js
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## provide
作为上下文的提供者, 其上下文提供范围为其内所停用的子组件, 在vue中同样能够导出provide, 上下文使用者可以通过inject来获取, 这后面碰到了会在说明

**参数**
key: string
value: any

**示例**
```js
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.provide('print', (val: string) => {
    console.log(val);
})
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    Hello World!
  </div> 
</template>

<script lang='ts' setup>
  import { inject } from 'vue';
  const print = inject<(val: string) => void>('print');
  print && print('Hello World!');
</script>
```

## unmount
卸载组件根实例

**示例**
```js
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');

setTimeout(() => {
  app.unmount(); // 5秒后页面就没有了内容
}, 5000)
```

## use
多用来安装查看, 例如安装UI库|route|vuex等

**参数**
plugin: Function 回调函数
...options: any[] 该参数会传入回调函数的剩余参数

**示例**
该示例演示了一般UI组件库的一个初始注册流程
```js
// Image.vue
<template>
    <img
        class='image-container'
        :src="renderUrl"
    />
</template>

<script>
    export default {
        name: 'Image',
        props: {
            renderUrl: {
                type: String,
                required: true
            }
        }
    }
</script>

// HelloWorld.vue
<template>
    <div class='hello-world-container'>
        Hello World!
    </div>
</template>

<script lang="ts">
    export default {
        name: 'HelloWorldComponent'
    }
</script>

// lib/index.ts
import { App } from "vue";
import HelloWorld from '../components/HelloWorld.vue';
import Image from '../components/Image.vue';

const components = [HelloWorld, Image];
export default function componentRegisterFn(app: App<any>): void {
    for (const Components of components) {
        app.component(Components.name, Components);        
    }
}

// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import componentRegisterFn from './lib/index';

const app = createApp(App);
app.use(componentRegisterFn);
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    Hello World!
    <hello-world-component/>
    <Image renderUrl="https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8c1001e93901213fbaf303f857e736d12e2e95d5.jpg"/>
  </div> 
</template>
```

## version
通过这个能够得知当前安装的vue版本, 对于一些插件开发者来说可以针对不同的版本使用不同的策略

**示例:**
```js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use({
    install(app) {
        const v = app.version.split('.')[0];
        if (v === '3') {
            console.log(`3版本`);
        } else if (v === '2') {
            console.log(`2版本`);
        } else {
            console.log(`0版本/1版本`);
        }
    }
});
app.mount('#app');
```

# 全局API

## createApp
用于创建一个应用

**参数**
component: Object 根组件
props: Object Props传参

**示例**
```js
// 使用的CDN地址
const { createApp } = Vue;

// Es模块化
import { createApp } from 'vue';

// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App, {
    value: 'Hello world!'
});
app.mount('#app');

// App.vue
<template>
  <div class='app-container'>
    {{ value }} // 会显示出Hello World!
  </div> 
</template>

<script lang="ts" setup>
  defineProps({
    value: {
      type: String,
      default: ""
    }
  })
</script>
```

## h
手动创建一个虚拟节点

**参数**
type: string
props: Object 可在其内设置class类名等
children: Array<VNode> | string | VNode 子节点

**示例**
```js
// main.ts
import { createApp, h } from 'vue';
import App from './App.vue';

const Component = () => {
    return h(
        'div',
        {
            class: ['div-container']
        },
        "Hello World!"
    )
}

const app = createApp(Component);
app.mount('#app');
```

## defineComponent
通常会用于编写一些组件时使用, 其内可以返回一个模板, 类似与React的形式, 使用Jsx/Tsx语法

**注意**
关于在vue3中使用Tsx或者Jsx语法, 我后续会出一篇文章专门用于演示

**参数**
setup: Object | Function

**示例**
```js
// main.ts -- Object
import { createApp, defineComponent, h } from 'vue';

// 类似与React的类组件
const Component = defineComponent({
    render() {
        return h('div', {
            onclick: this.onClick
        },this.value);
    },
    data() {
        return {
            value: 'Hello World!'
        }
    },
    methods: {
        onClick() {
            console.log(this.value);
        }
    }
});

const app = createApp(Component);
app.mount('#app');

// main.ts -- Function
import { createApp, defineComponent, h, ref } from 'vue';

// App就是组件名, 其内视为setup函数, 可以用来编写一些组件的逻辑, 其返回可以使用Tsx/Jsx语法替代, 个人感觉很爽
// 感觉类似于React的函数组件
const Component = defineComponent(function App() {
    const value = ref('Hello World!');
    const onClick = () => {
        console.log(value.value);
    }
    return () => 
        h('div', {
            onclick: onClick
        }, value.value);
})

const app = createApp(Component);
app.mount('#app');
```

## defineAsyncComponent
用于创建一个只有在需要时才会进行加载的组件, 并能根据返回的Promise状态进行相关操作, 通常可以利用该方法进行项目优化

**参数**
loader: () => Component // 需要加载的组件, 可通过Promise控制异步组件的状态
loadingComponent?: Component // 等待异步组件时展示的组件
errorComponent?: Component // 加载异常时展示的组件
delay?: number // 延时展示loadingComponent的等待时间
timeout?: number // 组件加载时间超过number则自当判定为加载失败, 如果设置为Infinity则视为永不超时
suspensible?: boolean // 组件是否可被挂起 默认值为true
onError?: (error: Object, retry: () => void, fail: () => void, attempts: number): void


**示例**
```js
// App.vue
<template>
  <div class='app-container'>
    Hello World!
    <AsyncHelloWorldVue />
  </div> 
</template>

<script lang="ts" setup>
  import ErrorMessage from './components/ErrorMessage.vue';
  import LoadingMessage from './components/LoadingMessage.vue';
  import { defineAsyncComponent } from 'vue';

  const AsyncHelloWorldVue = defineAsyncComponent({
    loader: () => {
      return new Promise((resolve, reject) => {
        const num = Math.random();
        setTimeout(() => {
          if (num > 0.5)
            resolve(import('./components/HelloWorld.vue') as any);
          else
            reject();
        }, 1000)
      })
    },
    loadingComponent: LoadingMessage,
    errorComponent: ErrorMessage,
    delay: 500,
    timeout: 1100,
    suspensible: true,
    onError: (error, retry, fail, attempt) => {
      // 错误信息
      console.log(error); // Error: undefined
      console.log(retry); // 用于重试的方法
      console.log(fail); // 用于显示错误组件的方法
      console.log(attempt); // 重试的次数
    }
  })

</script>
```

## defineCustomElement
与defineComponent具有相同的参数, 不过返回的是一个原生的自定义元素, 该元素可用于任意框架或不基于框架

**参数**
与defineComponent相同

**示例**
```js
暂无
```

## resolveComponent
允许按照名称解析组件, 如果存在该组件则返回该组件, 否则返回该查找名称

**注意**
resolveComponent只能在render/setup中使用

**示例**
```js
// main.ts
import { createApp, resolveComponent, defineComponent, h } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

// 在render中使用
// const App = defineComponent({
//     render() {
//         const HelloWorldComponent = resolveComponent('hello-world');
//         console.log(HelloWorldComponent);
//         return h(HelloWorldComponent, null, undefined)
//     }
// });
// 在setup中使用
const App = defineComponent(function App() {
    const HelloWorldComponent = resolveComponent('hello-world');
    return () => {
        return h(HelloWorldComponent, null, undefined)
    }
});
const app = createApp(App);
app.component('hello-world', HelloWorld);

app.mount('#app');
```

## resolveDynamicComponent
返回一个已解析的Component或者创建一个vNode, 说是会在创建一个vNode时Vue会警告用户, 但是目前个人在使用时并未发现, 不过根据之前的经验, 感觉这个警告准确是警告用户这个vNode标签是无法解析的

**参数**

**示例**
```js
// main.ts
import { createApp, resolveDynamicComponent, resolveComponent, defineComponent, h, Component } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

// 在render中使用
const App = defineComponent({
    render() {
        const HelloWorldComponent = resolveDynamicComponent('hello-world');
        console.log(HelloWorldComponent);
        return h(HelloWorldComponent as Component, null, undefined)
    }
});
// 在setup中使用
// const App = defineComponent(function App() {
//     const HelloWorldComponent = resolveDynamicComponent('hello-world');
//     return () => {
//         return h(HelloWorldComponent as Component, null, undefined)
//     }
// });
const app = createApp(App);
app.component('hello-world', HelloWorld);

app.mount('#app');
```

## resolveDirective
用于获取自定义指令

**参数**
name: string // 自定义指令名称

**示例**
```js
// main.ts
import { createApp, defineComponent, resolveDirective, h } from 'vue';
import HelloWorld from './components/HelloWorld.vue';


// 在render中使用
// const App = defineComponent({
//     render() {
//         const directive = resolveDirective('number');
//         console.log(directive);
//         return h('input', null, undefined);
//     }
// });
// 在setup中使用
const App = defineComponent(function App() {
    const directive = resolveDirective('number');
    console.log(directive);
    return () => {
        return h('input', null, undefined);
    }
});
const app = createApp(App);
app.directive('number', (el: HTMLInputElement, binding) => {
    function handleTrimNoNumber(el: HTMLInputElement): void {
        el.value = el.value.replace(/[^\d]/g, '');
        binding.value(el.value);
    }
    el.addEventListener('input', handleTrimNoNumber.bind(null, el))
});
app.component('hello-world', HelloWorld);

app.mount('#app');
```

## withDirectives
用于将指令应用在vNode上

**参数**
vNode: vNode // 需要应用指令的虚拟节点
directives: [Directive, any][] // 指令与参数形成的二维数组

**示例**
```js
import { createApp, defineComponent, resolveDirective, h, withDirectives, Directive } from 'vue';

// 在render中使用
const App = defineComponent({
    render() {
        const number = resolveDirective('number');
        return withDirectives(h('input', null, undefined), [
            [number as Directive, '']
        ]);
    }
});
// 在setup中使用
// const App = defineComponent(function App() {
//     const number = resolveDirective('number');
//     return () => {
//         return withDirectives(h('input', null, undefined), [
//             [number as Directive, '']
//         ]);
//     }
// });
const app = createApp(App);
app.directive('number', (el: HTMLInputElement, binding) => {
    function handleTrimNoNumber(el: HTMLInputElement): void {
        el.value = el.value.replace(/[^\d]/g, '');
        try {
            binding.value(el.value);
        } catch (error) {}
    }
    el.addEventListener('input', handleTrimNoNumber.bind(null, el))
});

app.mount('#app');
```

## createRenderer
这个是主要用于应对跨平台开发使用

## nextTick
将回调函数自动推迟到下次DOM更新时, 可以作为一个函数内部的await等待操作使用, 在函数内步等待使用就可以在等待完毕后就能拿到一个ref标记的元素

**参数**
fn: (this) => void // 回调函数

**示例**
```js
<template>
  <div class='app-container'>
    Hello World!
  </div> 
</template>

<script lang="ts" setup>
  import { onMounted, nextTick } from 'vue';

  onMounted(() => {
    console.log('mounted触发');
  })

  nextTick(() => {
    console.log('nextTick触发');
  })

  const fn = async () => {
    console.log("fn start");
    await nextTick()
    console.log("fn end");
  }
  fn();
</script>

/**
 * fn start => mounted触发 => nextTick触发 => fn end
 */
```

## mergeProps
用于将多个对象合并, 类似与Object.assign的功能, 但是该合并不会应该第一位的对象, 而是会返回一个新对象
好像对于attrs的对象的合并情况并没有一个Object.assign合并的情况好像并不是单单合并, 对一些属性有特殊的处理, 例如对于class的处理不会进行属性覆盖而是会在其基础上进行增加

**参数**
...objects: object[] // 对象数组

**示例**
```js
<template>
    <div id="id3" class='card-container'>
        <slot/>
    </div>
</template>

<script lang='ts' setup>
    import { useAttrs, mergeProps, reactive } from 'vue';

    const attrs = useAttrs();
    const obj1 = reactive({a: 1, b: 2});
    const obj2 = reactive({c: 3, d: 4, a: 5});

    // 将obj1和obj2对象合并成一个新的对象
    const merged = mergeProps(obj1, obj2);
    console.log(merged, obj1, obj2); // {a: 5, b: 2, c: 3, d: 4} Proxy {a: 1, b: 2} Proxy {c: 3, d: 4, a: 5}
    console.log(attrs);
    const merged2 = mergeProps(attrs, { class: 'class2', id: 'id2' });
    console.log(merged2); // {id: 'id2', class: 'class1 class2', val: 1}
    console.log({
        ...attrs,
        class: 'class2',
        id: 'id2'
    });
</script>
```

## useCssModule
用于拿到<style module></style>中的样式, 这个module中生成的结构类似与css模块化一样, 就是```选择器: 唯一值选择器```

**示例**
这是一个非常简单的字体颜色变幻的示例, 当然不只有该种方式, 也可以使用其他方式实现
```js
<template>
  <div :class='{
    "app-container": true,
    [style[myClass]]: true
  }'>
    Hello World!
  </div> 
</template>

<script lang="ts" setup>
  import { useCssModule, ref } from 'vue';
  let style: any = useCssModule();
  let style2 = Object.keys(style);
  const myClass = ref('');
  const index = ref<number>(0);
  setInterval(() => {
    myClass.value = style2[index.value];
    if (index.value == style2.length - 1) index.value = 0;
    else index.value = index.value + 1;
  }, 1000);

</script>

<style scoped>
.app-container {
  transition: all 1s;
}
</style>

<style module>
.style1 {
  color: red;
}

.style2 {
  color: blue;
}

.style3 {
  color: #abcdef;
}
</style>
```

## version
与应用API中的version相同, 这个是用于检测当前应用的版本号

# 选项

## Data

  ### data
  data为一个函数, 该函数必须返回一个对象, 对象内返回的会被进行响应式代理, 但是如果属性key是以$或者_开头就不会被注入到组件内, 也就意味着组件内是访问不到该属性的, 在组件内部data就相当于一个数据管理中心

  **参数**
  ```js
  import { createApp, h } from 'vue';

  const app = createApp({
      data: () => {
          return {
              val1: 1,
              $val2: '2',
              _val3: {
                  a: 1
              }
          }
      },
      methods: {
          fn1() {
              console.log('fn1');
          }
      },
      render() {
          return h('div', null, `Hello World!${this.val1}`);
      }
  }).mount('#app');
  console.log(app);// 在其身上是无法访问到$val2和_val3的
  ```

  ### props
  用于接受父组件传递的数组

  **注意**
  如果您配置了validator进行校验数据, 如果没有通过验证, 即返回了false, 但在vue中只会抛出一个警告, 但不会影响该属性值的使用

  **参数**
  props: string[] | {[key: string]: { type?: any, required?: boolean, default: any, validator?: (va;: any) => boolean }}
 
  **示例**
  ```js
  defineProps({
      prop1: {
          type: String,
          default: '',
          required: true,
          validator: (val: any) => {
              console.log(val);
              return true;
          }
      }
  })
  ```

  ### computed
  计算属性, 常用于计算一个由多个值影响的一个新值, 并且后续多个值中任意一个变化都会影响到新值的改动

  **参数**
  computed(() => any);
  computed({get: () => any, set: (val: any) => void}); // 该种方式不是很熟悉, 目前感受到的是只有在自己触发set时才会触发数据响应式

  **示例**
  ```js
  <template>
    <div class='children-component-container'>
        这是子组件
        {{ sum }}
        {{ sum2 }}
    </div>
  </template>

  <script lang='ts' setup>
      import { ref, computed } from 'vue';

      const props = defineProps({
          prop1: {
              type: Number,
              required: true
          },
          prop2: {
              type: Number,
              required: true
          }
      });

      const sum = computed(() => {
          console.log(1);
          return props.prop1 + props.prop2;
      })

      let val = ref(1);
      let sum2 = computed({
          get() {
              return val.value;
          },
          set(v: any) {
              val.value = props.prop1 + props.prop2;
          }
      })
      sum2.value = 3;
  </script>
  ```

  ### methods
  会被混合到组件实例中, 用作事件处理函数等作用

  **参数**
  methods: {
    [key: string]: (...args: any[]) => any
  }

  **示例**
  ```js
  <template>
    <div class='app-container'>
      Hello World!
      <ChildrenComponent @click="handleClick('Hello Component!')"/>
    </div> 
  </template>

  <script lang="ts" setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    const handleClick = (str: string) => {
      console.log(str);
    }
  </script>
  ```

  ### watch
  监听属性变化, 当属性变化时会触发回调函数, 回调函数中可以对属性进行操作

  **注意**
  对于像数组和对象这种引用类型的数据需要进行deep深层监听

  **参数**
  watch(val: any, (value: any, oldValue: any) => void, {
    deep?: boolean
    immediate?: boolean
  });

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div>{{ val1 }}</div>
      <div>{{ val2 }}</div>
      <div>{{ val3 }}</div>
      <div>{{ val4 }}</div>
      <div>{{ val5 }}</div>
      <button @click="handleChange">Change</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, watch } from 'vue';
    const val1 = ref(0);
    const val2 = ref(0);
    const val3 = ref(0);
    const val4 = ref([1]);
    const val5 = ref({});
    watch(val1, () => {
      console.log('触发1');
    })
    watch([val1, val2], () => {
      console.log('触发2');
    })
    watch(() => val4, () => {
      console.log('触发3');
    }, {
      deep: true
    });
    watch(() => val5, () => {
      console.log('触发4');
    }, {
      deep: true
    });
    const handleChange = () => {
      val1.value = val1.value + 1;
      val2.value = val2.value + 1;
      val3.value = val3.value + 1;
      val4.value = [...val4.value];
      val5.value = { ...val5.value, a: 1 };
    }
  </script>
  ```

  ### emits
  从子组件触发的自定义事件 

  **注意**
  emit的验证函数只能起到验证的作用, 并不能阻止事件的产生

  **参数**
  emit({
    [key: string]: null | (payload: any) => boolean
  } | string[])

  **示例**
  ```html
  // App.vue
  <template>
    <div class='app-container'>
      Hello World!
      <ChildrenComponent
        @submit1="handleSubmit1"
        @submit2="handleSubmit2"
      />
    </div> 
  </template>

  <script lang="ts" setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';

    const handleSubmit1 = (val: string) => {
      console.log('submit1', val);
    }
    const handleSubmit2 = () => {
      console.log('submit2');
    }
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='children-component-container'>
        这是子组件
        <input type="text" v-model="inputValue" />
        <button @click="handelSubmit">提交</button>
    </div>
  </template>

  <script lang='ts' setup>
      import { ref } from 'vue';
      const inputValue = ref('');

      const emit = defineEmits({
          submit1: (payload) => {
              if (payload) return true;
              else {
                  console.error('提交框不能为空');
                  return false;
              }
          },
          submit2: null
      })
      const handelSubmit = () => {
          emit('submit1', inputValue.value);
          emit('submit2');
      }
  </script>
  ```

  ### expose
  在实例上主动暴露属性给外部

  **参数**
  defineExport({
    [key: string]: any
  })

  **示例**
  ```js
  // App.vue
  <template>
    <div class='app-container'>
      Hello World!
      <ChildrenComponent
        ref="children"
      />
    </div> 
  </template>

  <script lang="ts" setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    import { ref, onMounted } from 'vue';

    const children = ref();
    onMounted(() => {
      console.log(children.value.inputValue); // 1
    })
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='children-component-container'>
        这是子组件
        <input type="text" v-model="inputValue" />
        <button>提交</button>
    </div>
  </template>

  <script lang='ts' setup>
      import { ref, defineExpose } from 'vue';
      const inputValue = ref('1');

      defineExpose({inputValue});
  </script>
  ```

## DOM

  ### template
  模板, 模板会替换所挂载元素的内容, 如果Vue选项中有渲染函数, 则模板渲染会被忽略, 在Vue3中是允许模板有多个根

  **示例**
  ```html
  <template>
    <div>
      Hello World!
    </div>
  </template>
  ```

  ### render
  函数式的编写模板, 和tsx/jsx方式类似, 写过react应该比较容易接受, 该方式渲染的会优先级高于template方式渲染

  **示例**
  此处示例为写了一个全局注册的组件
  ```js
  // main.ts
  import { createApp, h } from 'vue';
  import App from './App.vue';

  const app = createApp(App);
  app.component('hello-world', {
      render() {
          return h('h1', null, 'Hello World');
      }
  })
  app.mount('#app');
  
  // App.vue
  <template>
    <div class='app-container'>
      <hello-world></hello-world>
    </div> 
  </template>
  ```

## 生命周期钩子

  ### beforeCreate
  实例初始化前, 这个阶段是访问不到实例的, 一般也不做什么

  **注意**
  在setup语法糖中, beforeCreate阶段是无法配置的, 因为setup运行在beforeCreate和created之前, 这两个阶段相对来说是无意义的

  ### created
  实例初始化后立即调用, 这个阶段是可以访问到实例的, 此时数据响应式、监听、事件、计算属性都已经完成, 但是节点尚未挂载

  **注意**
  在setup语法糖中, created阶段是无法配置的, 因为setup运行在beforeCreate和created之前, 这两个阶段相对来说是无意义的

  ### beforeMount
  实例挂载前一刻

  **注意**
  此处的参数和示例皆为setup语法糖中, 如不是则接近Vue2.x阶段的写法, 此处不再示意, 正常在beforeMount中是无法访问到节点的, 但是可通过等待nextTick进行等待

  **参数**
  onBeforeMount(hook: () => any, target?: ComponentInternalInstance | null): boolean | Function

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div ref="oDiv">Hello World!</div>
    </div> 
  </template>

  <script lang="ts" setup>
    import { onBeforeMount, ref, nextTick } from 'vue';

    const oDiv = ref();
    onBeforeMount(async () => {
      console.log('before mount');
      console.log(oDiv.value); // undefined
      await nextTick();
      console.log(oDiv.value); // 可访问到
    });
  </script>
  ```

  ### mounted
  实例正式挂载, 此时是可以访问到节点

  **参数**
  onMounted(hook: () => any, target?: ComponentInternalInstance | null): boolean | Function

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div ref="oDiv">Hello World!</div>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, nextTick, onMounted } from 'vue';

    const oDiv = ref();
    onMounted(() => {
      console.log('mounted');
      console.log(oDiv.value); // 可以访问到节点
    })
    nextTick(() => {
      console.log('nextTick');
    })
  </script>
  ```

  ### beforeUpdate
  数据更新前触发, 此时页面未重新渲染, 只是数据更新

  **注意**
  如果数据更新前与更新后一致, 则不会触发此阶段生命周期, 这算是Vue中自带的一种优化策略, 在React中只不过是变为可以自己掌控决定是否此次数据变动应否引起页面变化

  **参数**
  onBeforeUpdate(hook: () => any, target?: ComponentInternalInstance | null): boolean | Function

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div>
  </template>

  <script lang="ts" setup>
    import { ref, onBeforeUpdate } from 'vue';

    const str = ref('Hello World!');
    onBeforeUpdate(() => {
      console.log('数据即将发生变化');
      console.log(str.value); // 访问到的仍然是更新
    })
    const handleClick = () => {
      str.value = str.value += '!';
    };
  </script>
  ```

  ### updated
  数据更新后触发, 此时页面已重新渲染, 但并不能保证其所有子组件都已重新渲染完毕

  **参数**
  onUpdated(hook: () => any, target?: ComponentInternalInstance | null): boolean | Function | undefined

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onUpdated } from 'vue';

    const str = ref('Hello World!');

    onUpdated(() => {
      console.log('数据已经发生了变化');
      console.log(str.value);
    });
    const handleClick = () => {
      str.value = str.value += '!';
    };
  </script>
  ```

  ### activated
  被keep-alive包裹的组件会触发该生命周期, 特点就是能够保留之前的状态, 组件不需要重新初始化状态, 每次该种逐渐被激活时, 及被使用时会触发该钩子

  **参数**
  onActivated(hook: () => any, target?: ComponentInternalInstance | null): void

  **示例**
  ```js
  // App.vue
  <template>
    <div class='component-container'>
      <keep-alive >
        <ChildrenComponent v-if="lock"/>
        <ChildrenComponentTwo v-else/>
      </keep-alive>
      <button @click="lock = !lock">-> click toggle</button>
    </div>
  </template>

  <script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    import ChildrenComponentTwo from './components/ChildrenComponentTwo.vue';
    import { ref } from 'vue';

    const lock = ref(true);
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onActivated, onDeactivated } from 'vue';

    const str = ref('Hello World!');

    onActivated(() => {
      console.log('activated');
    });

    onDeactivated(() => {
      console.log('deactivated');
    })

    const handleClick = () => {
      str.value = str.value += '!';
    };
  </script>

  // ChildrenComponentTwo.vue
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onActivated, onDeactivated } from 'vue';

    const str = ref('Hello World?');

    onActivated(() => {
      console.log('activated2');
    });

    onDeactivated(() => {
      console.log('deactivated2');
    })

    const handleClick = () => {
      str.value = str.value += '?';
    };
  </script>
  ```

  ### deactivated
  该钩子运行在被keep-alive包裹的组件失去激活时触发, 意味着该组件此刻不被访问

  **参数**
  onDeActivated(hook: () => any, target?: ComponentInternalInstance | null): void

  **示例**
  ```js
  // App.vue
  <template>
    <div class='component-container'>
      <keep-alive >
        <ChildrenComponent v-if="lock"/>
        <ChildrenComponentTwo v-else/>
      </keep-alive>
      <button @click="lock = !lock">-> click toggle</button>
    </div>
  </template>

  <script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    import ChildrenComponentTwo from './components/ChildrenComponentTwo.vue';
    import { ref } from 'vue';

    const lock = ref(true);
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onDeactivated } from 'vue';

    const str = ref('Hello World!');

    onDeactivated(() => {
      console.log('deactivated');
    })

    const handleClick = () => {
      str.value = str.value += '!';
    };
  </script>

  // ChildrenComponentTwo.vue
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onDeactivated } from 'vue';

    const str = ref('Hello World?');

    onDeactivated(() => {
      console.log('deactivated2');
    })

    const handleClick = () => {
      str.value = str.value += '?';
    };
  </script>
  ```

  ### beforeUnmount
  组件即将被卸载之前调用

  **参数**
  onBeforeUnmount(hook: () => any, target?: ComponentInternalInstance | null): false | Function | undefined

  **示例**
  ```js
  // ChildrenComponent.vue
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onBeforeUnmount } from 'vue';

    const str = ref('Hello World!');

    onBeforeUnmount(() => {
      console.log('unmount');
    })

    const handleClick = () => {
      str.value = str.value += '!';
    };
  </script>
  ```

  ### unmounted
  此时组件实例已正式卸载

  **参数**
  onUnmounted(hook: () => any, target?: ComponentInternalInstance | null): false | Function | undefined

  **示例**
  ```js
  ...
    onUnmounted(() => {
      console.log('unmounted', str.value);
    })
  ...
  ```

  ### errorCaptured
  用于捕获错误, 当子组件发生错误时, 可在父组件使用该生命周期进行对错误的处理, 该处理会一级一级的向上传递错误, 直到有一个钩子内返回了false, false代表着该问题已经处理完毕, 如果不阻止则最终也会唤起全局中配置的错误处理函数

  **参数**
  onErrorCaptured(hook: (error: Error, instance: ComponentInternalInstance | null, info: string) => any, target?: ComponentInternalInstance | null): void

  **示例**
  ```js
  // A.vue
  <template>
    <div class='component-container'>
        <App/>
    </div>
  </template>

  <script lang='ts' setup>
      import App from './App.vue';
      import { onErrorCaptured } from 'vue';

      onErrorCaptured((e) => {
          console.log(e);
          return false;
      })
  </script>

  <style scoped>

  </style>
  // App.vue
  <template>
    <div class='component-container'>
        <ChildrenComponent/>
    </div>
  </template>

  <script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    import { onErrorCaptured } from 'vue';
    onErrorCaptured((e) => {
      console.log(e);
      // return false;
    })
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <button @click="handleClick">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onUnmounted } from 'vue';

    const str = ref('Hello World!');

    onUnmounted(() => {
      console.log('unmounted');
    })

    const handleClick = () => {
      str.value.a.b; // 这里是错误点
      str.value = str.value += '!';
    };
  </script>
  ```

  ### renderTracked
  当虚拟DOM变化时会触发该生命周期, 就是在你变动了Dom节点的时候触发, 会在初始化时运行一次

  **注意**
  子组件的虚拟DOM变动不会触发父组件内该生命周期

  **参数**
  onRenderTracked(hook: (e: DebuggerEvent) => void, target?: ComponentInternalInstance | null): false | Function | undefined

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <div ref="oDiv">{{ str2 }}</div>
      <div ref="oDiv" v-if="lock">{{ str3 }}</div>
      <button @click="handleToggle">-> click here!</button>
    </div> 
  </template>

  <script lang="ts" setup>
    import { ref, onRenderTracked } from 'vue';

    const str = ref('Hello World!');
    const str2 = ref('Hello World!2');
    const str3 = ref('Hello World!3');

    const handleClick = () => {
      str.value = str.value += '!';
    };
    const lock = ref(false);
    const handleToggle = () => {
      lock.value = !lock.value;
    }

    onRenderTracked((e) => {
      console.log('render tracked', e);
    })
  </script>
  ```

  ### renderTriggered
  引起虚拟Dom变化时触发, 钩子内能够拿到引起此次变化的操作类型、属性等

  **参数**
  onRenderTriggered(hook: (e: DebuggerEvent) => void, target?: ComponentInternalInstance | null): false | Function | undefined

  **示例**
  ```js
  <template>
    <div class='app-container'>
      <div ref="oDiv">{{ str }}</div>
      <div ref="oDiv">{{ str2 }}</div>
      <div ref="oDiv" v-if="lock">{{ str3 }}</div>
      <button @click="handleToggle">-> click here!</button>
    </div>
  </template>

  <script lang="ts" setup>
    import { ref, onRenderTriggered } from 'vue';

    const str = ref('Hello World!');
    const str2 = ref('Hello World!2');
    const str3 = ref('Hello World!3');

    const lock = ref(false);
    const handleToggle = () => {
      lock.value = !lock.value;
    }

    onRenderTriggered((e) => {
      console.log('render triggered', e);
    })
  </script>
  ```

## 选项/资源

  ### directives
  局部自定义指令, 定义一个变量以v开头就可以被视为自定义指令

  **参数**
  同应用API中的directives一致

  **示例**
  此处简单示例一个自定义指令用于控制input内容, 当然局部的指令可能并没有太大的作用, 因为还有许多种方法可以实现相同的功能
  ```js
  <template>
    <div class='app-container'>
      <input
        v-model="inputVal"
        v-focus="print1"
      >
      <button @click="print1">click</button>
    </div>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue';
    const inputVal = ref('');
    const print1 = () => {
      console.log(inputVal.value);
    }
    const vFocus = (el: HTMLInputElement, binding: DirectiveBinding<any>) => {
      function handleTrimNoNumber(): void {
          console.log(binding);
          inputVal.value = inputVal.value.replace(/[^\d]/g, '');
      }
      el.addEventListener('input', handleTrimNoNumber);
  }
  </script>
  ```

  ### components
  局部注册组件

  **注意**
  在setup语法糖中直接引入该组件即被默认注册为局部组件

  **示例**
  ```js
  <template>
    <div class='component-container'>
        <ChildrenComponent/>
    </div>
  </template>

  <script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
  </script>
  ```

## 组合

  ### mixins
  混合属性与生命周期

  **注意**
  在setup语法糖中好像没有mixins, 反而是可以把一部分功能抽离为独立的文件, 并在需要时进行引入

  ### extends
  没有太明白存在的意义, 也是能用于继承某个组件的属性

  **注意**
  我在使用setup语法糖中没找到怎么使用extends的方式, 于是只能采用vue2的方式进行书写组件, 该种继承是无法将vue3的组件进行正常进行, 意味着就是访问不到继承的属性, 在继承组件改为vue2写法是才正常继承并可以访问到继承的属性

  **示例**
  ```js
  // App.vue
  <template>
    <div class='component-container'>
      {{ inputVal }}
    </div>
  </template>

  <script lang='ts'>
    import ChildrenComponentVue from "./components/ChildrenComponent.vue"
    export default {
      extends: ChildrenComponentVue,
      data() {
        return {}
      }
    }
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='app-container'>
      <input v-model="inputVal">
    </div>
  </template>

  <script lang="ts" setup>
    import { ref, defineExpose } from 'vue';
    const inputVal = ref('Hello World');
    
    defineExpose({
      inputVal
    });
  </script>
  ```

  ### provide/inject
  父组件向子组件中注入一个依赖, 只要组件为提供者的子组件, 无论层级多深都可以接收到该依赖

  **注意**
  传递的值其不是响应式的, 如果需要则需要您传入一个响应式的数据而不是一个固定的数据

  **参数**
  provide(): void
  inject<T>(key: string, defaultValue: T, treatDefaultAsFactory?: false): T   第三个参数treatDefaultAsFactory是用来默认值为一个函数时, 对该函数默认执行

  **示例**
  ```html
  // App.vue
  <template>
    <div class='component-container'>
      <ChildrenComponent />
      <button @click="str += '\t!'">-> click here</button>
    </div>
  </template>

  <script lang='ts' setup>
    import { ref, provide } from 'vue';
    import ChildrenComponent from './components/ChildrenComponent.vue';
    const str = ref("Hello World!");
    provide('foo', str);
    provide('foo2', 'Hello World2!');
  </script>

  // ChildrenComponent.vue
  <template>
    <div class='component-container'>
      <div>{{ temp }}</div>
      <div>{{ temp2 }}</div>
      <div v-for="item in temp3" :key="item">{{ item }}</div>
    </div>
  </template>

  <script lang='ts' setup>
    import { inject } from 'vue';
    
    const temp = inject('foo');
    const temp2 = inject('foo2', '这是一个默认值');
    const temp3 = inject('foo3', () => ['默认1', '默认2'], true);
  </script>
  ```

  ### setup
  Vue3中新增的, 是组合式API的入口点, 生命周期在beforeCreate前执行. 同时setup也可以作为属性出现在script标签上, 在标签上时代表该区域内都为setup作用域内, 在其内定义的变量不需要在通过return注入组件中.

  **参数**

  **示例**
  ```html
  <template>
    <div class='component-container'>
      {{ str }}
    </div>
  </template>

  <script lang='ts'>
    import { ref } from 'vue';
    
    export default {
      setup() {
        const str = ref('Hello Vue3!');
        return {
          str
        }
      }
    }
  </script>
  ```

## 杂项

  ### name
  用于设置组件的名称, 当您使用setup语法糖时想要设置name可通过在创建一个script标签进行设置, 或者您可以```yarn add vite-plugin-vue-setup-extend -D```安装此插件, 按照[Github文档](https://github.com/vbenjs/vite-plugin-vue-setup-extend/tree/main#readme)在vite配置文件中配置好后即可在书写setup语法糖同时在script标签上增添属性name, 此name和单独一个script标签导出一个name作用是一致的. 该name设置后也可以让我们在通过vue浏览器插件查看组件树时结构更加清晰明了.

  **参数**
  name: string

  **示例**
  ```html
  <!-- setup语法糖时正常写法 -->
  <template>
    <div class='component-container'>
      Hello Children
      <!-- 防止递归爆栈, 这要是运气好爆了那可以去买彩票了 -->
      <ChildrenComponent v-if="ifShow"/>
    </div>
  </template>

  <script lang="ts">
    export default {
      name: 'ChildrenComponent',
    }
  </script>

  <script lang='ts' setup>
    const ifShow = Math.random() > 0.5;
  </script>

  <!-- setup语法糖时使用插件写法, 明显简介许多$ -->
  <template>
    <div class='component-container'>
      Hello Children
      <!-- 防止递归爆栈, 这要是运气好爆了那可以去买彩票了 -->
      <Children v-if="ifShow"/>
    </div>
  </template>

  <script lang='ts' setup name="Children">
    const ifShow = Math.random() > 0.5;
  </script>
  ```

  ### inheritAttrs
  当父组件通过props向子组件传递了一些子组件不需要的属性时, 该属性会成为子组件根元素标签上的一个属性, 有时候我们并不想要这种行为, 因为这种行为可能不安全,这时候我们可以通过设置inheritAttrs未false阻止这种行为, 阻止后子组件根元素标签上将不会出现那些多余的属性.

  **参数**
  inheritAttrs: boolean

  **示例**
  ```html
  <template>
    <div class='component-container'>
      Hello Children
    </div>
  </template>

  <script>
    export default {
      inheritAttrs: false
    }
  </script>
  ```

  ### compilerOptions
  同应用配置中的配置项一致, 不过我在使用试验该属性时发现好像都不生效, 有了解的小伙伴可以分享一下.

  ### delimiters
  从vue3.1开始该属性已被废弃, 如需使用请参考compilerOptions.delimiters.

# 实例property

## $data
用于访问组件实例中的数据对象, 通过组件公开实例.$data访问, 但是我观察到的setup语法糖中的数据是不存在组件内部实例和组件公开实例上的, 正常使用setup函数通过return返回页面需要的函数是正常存在组件公开实例中的.

**参数**
无

**示例**
```html
<template>
  <div class='component-container'>
    {{ data1 }} {{data2}}
    {{ str }}
    <div>1</div>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        data1: 'Hello',
        data2: 'Children!',
        component: null
      }
    },
    created() {
      console.log(this);
    }
  }
</script>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';

  const str = ref<string>('Hello React!');
  const instance = getCurrentInstance();
  console.log(instance);
  // 这个和上面的this不一样, 但是是可以通过instance.data拿到注入组件实例的属性的
</script>
```

## $props
组件实例中用于接收到的props对象, 可以通过组件公开实例.$props访问.

**参数**
无

**示例**
```html
<template>
  <div class='component-container'>
    {{ data1 }} {{data2}}
    {{ str }}
    {{ val1 }} {{ val2 }}
    <div>1</div>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        data1: 'Hello',
        data2: 'Children!',
        component: null
      }
    },
    props: {
      val1: String,
      val2: String
    },
    created() {
      console.log(this);
    }
  }
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  // const props = defineProps({
  //   val1: {
  //     type: String
  //   },
  //   val2: {
  //     type: String
  //   }
  // })
  const str = ref<string>('Hello React!');
</script>
```

## $el
当前组件的根实例元素, 可以通过组件公开实例.$el访问, 注意\$el只能在组件挂载之后才可以拿到, 即在mounted阶段及其之后才可以获取, 在之前的阶段都是null.

**参数**
无

**示例**
```html
<template>
  <div class='component-container'>
    <div>Hello React!</div>
  </div>
</template>

<script lang="ts">
  export default {
    created() {
      console.log(this.$el); // null
    },
    mounted() {
      console.log(this.$el);
    }
  }
</script>
```

## $options
用于查看组件初始化时的配置项, 例如render函数、文件绝对路径、文件热更新Id值等都在其内, 可以通过组件公开实例.$options查看.

**参数**
无

**示例**
```html
<template>
  <div class='component-container'>
    <div>{{ dataVal }}</div>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        dataVal: "Hello React!"
      }
    },
    props: {
      val1: String
    },
    created() {
      console.log(this.$options);
    },
    mounted() {}
  }
</script>
```

## $parent
在vue2能够用于获取父组件的实例进而调动其上的方法, 但是在vue3中通过this.$parent身上什么都没有, 不知道有什么用, 有知道的小伙伴可以一起讨论, 后续发现在setup中可通过getCurrentInstance()获取到组件实例, 可以通过instance.parent获取到父组件内部实例, instance.parent.proxy则能拿到其父组件公开实例

**参数**
无

**示例**
```html
```

## $root
和$parent一样, 身上什么都没有, 不知道什么情况, 同样后续发现在组件内部实例上是可以拿到组件树根组件的内部实例.

**参数**
无

**示例**
```html
<!-- App -->
<template>
  <div class='app-container'>
    Hello World!
    <ChildrenComponent></ChildrenComponent>
  </div> 
</template>

<script lang="ts" setup>
  import ChildrenComponent from './components/ChildrenComponent.vue';
</script>

<script lang="ts">
  export default {
    data() {
      return {
        dataVal: "Hello App!"
      }
    },
    props: {
      val1: String
    },
    created() {
    },
    mounted() {
    },
    methods: {
      print() {
        console.log("你好~");
      }
    }
  }
</script>

<!-- ChildrenComponent -->
<template>
    <div class='component-container'>
    <div>Hello React!</div>
    <SonComponent />
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance } from 'vue';
  import SonComponent from './SonComponent.vue';

  const instance = getCurrentInstance();
  console.log(instance?.root);
</script>

<!-- SonComponent -->
<template>
    <div class='component-container'>
        SonComponent
    </div>
</template>

<script lang='ts' setup>
    import { ref, getCurrentInstance } from 'vue';
    const instance = getCurrentInstance();
    console.log(instance?.root);// 打印的和ChildrenComponent打印的一样, 都是App组件的内部实例
</script>
```

## $slots
可以访问到用于供给组件所需要的插槽函数, 加入组件提供了三个插槽但是外部使用组件时只填写了两个插槽, 则在$slots中只会有两个响应的插槽所需的函数.

**参数**
无

**示例**
```html
<!-- App -->
<template>
  <div class='app-container'>
    Hello World!
    <ChildrenComponent>
      <template #title>
        这是Title插槽区域
      </template>
      <template #default>
        这是Default插槽区域
      </template>
      <template #footer>
        这是Footer插槽区域
      </template>
    </ChildrenComponent>
  </div> 
</template>

<script lang="ts" setup>
  import ChildrenComponent from './components/ChildrenComponent.vue';
</script>

<!-- ChildrenComponent -->
<template>
    <div class='component-container'>
    <slot name="title"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance } from 'vue';

  const instance = getCurrentInstance();
  console.log(instance?.proxy?.$slots);
  console.log(instance?.slots);
</script>
```

## $refs
用于标记元素从而获取该元素的DOM, 通过对元素设置属性ref="name"标记元素, 在setup语法糖中可直接通过其所绑定的变量在元素挂载后访问, 也可以通过组件公开实例.$refs.name访问到, 或者通过组件内部实例.refs.name访问到.

**参数**
无

**示例**
```html
<template>
  <div
    ref="oDiv"
    class='component-container'>
    <slot name="title"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance, onMounted } from 'vue';

  const oDiv = ref();
  const instance = getCurrentInstance();
  onMounted(() => {
    console.log(oDiv.value === instance?.refs.oDiv); // true
  })
</script>
```

## $attrs
用于接受那些在引用组件时向组件身上添加除props或者事件以外的属性, 这些属性会出现在$attrs中, 我们可以通过组件内部实例.attrs访问到, 或者通过组件公开示例.\$attrs访问到, 我们可以在组件内部通过v-bind="$attrs"向元素绑定一些额外的参数或者用于快速向下传递参数, attrs能够帮助我们更好的封装高阶组件.

**参数**
无

**示例**
```html
<template>
  <div class='component-container'>
    <slot name="title"></slot>
    <slot></slot>
    <slot name="footer"></slot>
    <div
      v-bind="$attrs"
    >
      你好
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance } from 'vue';

  defineProps({
    val2: String,
  });

  const instance = getCurrentInstance();
  console.log(instance?.attrs); // {val1: "value1", val3: "value3"}
</script>
```

# 实例方法

## $watch
通常用于监听组件某个数据的变动, 当数据变动时会触发该监听函数的回调函数. 如果你使用setup语法糖, 可以直接从vue库中导出watch进行使用, 同样可以通过getCurrentInstance().proxy获取当前组件的公开实例进而拿到\$watch同样可以进行监听, 如果使用的是vue2版本的写法可以使用watch选项或者自行通过this.\$watch进行使用监听.

**参数**
\$watch(val: () => any | any, callback: (newVal: any, oldVal: any) => void)

**示例**
```html
<template>
  <div class='app-container'>
    Hello World!{{ count }}
    <button @click="count++">+</button>
  </div> 
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance, watch } from 'vue';
  const count = ref(0);
  const instance = getCurrentInstance();
  instance?.proxy?.$watch(() => count.value, (newVal: number, oldVal: number) => {
    console.log('更新了', newVal, oldVal);
  })
  watch(() => count.value, (newVal: number, oldVal: number) => {
    console.log('更新了', newVal, oldVal);
  })
</script>
```

## $emit
用于当子组件发生改变时自定义通知父组件进行相应操作, 同样当你使用setup语法糖写法时可以通过组件公开实例调用, 也可以使用vue库中提供的defineEmits方法进行注册定义事件, 通过其返回的参数进行向上通知父组件. vue2中应该就只可以通过this.\$emit触发.

**参数**
\$emit(eventName: string, ...args: any[])

**示例**
```html
<!-- App.vue -->
<template>
  <div class='app-container'>
    Hello World!{{ count }}
    <ChildrenComponent @decrease="handleChange" @increase="handleChange"/>
  </div> 
</template>

<script lang="ts" setup>
  import ChildrenComponent from './components/ChildrenComponent.vue';
  import { ref } from 'vue';
  const count = ref(0);
  const handleChange =(val : number) => {
    count.value += val;
  }
</script>

<!-- ChildrenComponent.vue -->
<template>
  <div class='component-container'>
    <button @click="handleDecrease">-</button>
    <button @click="handleIncrease">+</button>
  </div> 
</template>

<script lang="ts" setup>
  import { getCurrentInstance } from 'vue';
  const instance = getCurrentInstance();
  const handleDecrease = () => {
    instance?.proxy?.$emit("decrease", -1);
  }
  const emit = defineEmits(['increase']);
  const handleIncrease = () => {
    emit('increase', 1);
  }
</script>
```

## $forceUpdate
用于手动强制刷新组件实例, 会触发组件更新阶段的生命周期钩子. 目前在vue3中好像是没什么用的, 因为在3中使用的是Proxy代理的数据.

**参数**
无

**示例**
无

## $nextTick
同nextTick一致, 只不过这个是从组件公开实例上获取的.

**参数**
无

**示例**
```html
<template>
  <div class='app-container'>
    <div ref="oDiv">Hello World!</div>
  </div> 
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance, nextTick } from 'vue';
  const oDiv = ref<HTMLElement>();

  const instance = getCurrentInstance();
  async function init () {
    console.log(oDiv.value); // undefined
    await nextTick(() => {
      console.log(oDiv.value); // div
    });
    await instance?.proxy?.$nextTick((...args) => {
      console.log(oDiv.value); // div
    })
  };
  init();
</script>
```

# 指令

## v-text
主要用于将一个变量值以文本形式插入到组件中, 该种形式的插入并不会被Xss攻击, 这种插值方式vue提供有语法糖形式```{{ 内容 }}```, 当你使用v-text插值时想要拼接一下其他内容时不妨试试v-text的语法糖形式会更加方便快捷, 顺道提一嘴: 语法糖形式的这符号是可以在vite,config.ts文件中配置的, 详见可以看**应用配置中的compilerOptions.delimiters**进行相应配置.

**参数**
v-text="str"

**示例**
```html
<template>
    <div class='component-container'>
        <div v-text="str"></div>
        <!-- 语法糖形式 -->
        <div>中文: 你好 世界! English: {{ str }}</div>
    </div>
</template>

<script lang='ts' setup>
    const str = '<h1>Hello World!</h1>';
</script>
```

## v-html
主要用于将一段文本以渲染html的形式渲染, 存在着Xss攻击以及其他风险, **慎用**. 你不能信任用于所传递的值, 如果这是一个必须的, 则你需要尽可能的处理一下文本中可能存在的风险性后再进行渲染.

**注意**
当你的字符串中含有```<script></script>```标签时, 如果你用该字符串当作v-html值, vue会进行报错处理, 这算是vue中自带的一种防止攻击的方式. 暂时不知道该问题怎么解决, 不过绝大多数情况下应该都是不会出现这种情况的.

**参数**
v-html="str"

**示例**
```html
<template>
    <div class='component-container'>
        <div v-html="str"></div>
    </div>
</template>

<script lang='ts' setup>
    const str = '<h1>Hello World!</h1><iframe src="http://www.bilibili.com">';
</script>
```

## v-show
v-show指令就是通过控制display样式控制组件是否展示, false代表隐藏, true代表展示, 该指令常用于一些元素会经常性的在隐藏与展示之间切换.

**注意**
通过display控制元素该种方式时, 该元素初始化是会正常进入渲染树中的, 如果控制的是一个组件, 则该组件标签为正常初始化, 当display值变动时是不会重新触发组件初始化的生命周期钩子的.

**参数**
v-show="boolean"

**示例**
```html
<template>
    <div class='component-container'>
        <div v-show="lock">你好 世界!</div>
        <div role="button" @click="lock = !lock">click</div>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const lock = ref<boolean>(false);
</script>
```

## v-if
v-if同样用于控制元素是否展示的, 不过该指令与v-show有很大的不同, 常用于切换很少, 那么该指令在一定程度上来说是比较好的选择.

**注意**
v-if是通过增添与卸载元素进行控制的, 即意味着用该指令经常性切换显示与隐藏是一个会消耗大量资源的事情, 通过v-if控制的组件在切换状态时是会触发其生命周期函数钩子的.

**参数**
v-if="boolean"

**示例**
```html
<template>
    <div class='component-container'>
        <div v-if="lock">你好 世界!</div>
        <div role="button" @click="lock = !lock">click</div>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const lock = ref<boolean>(false);
</script>
```

## v-else
v-else指令用于当上一个v-if或v-else-if指令不满足条件时会渲染这个元素.

**注意**
带有v-else指令的元素的前一个兄弟元素必须存在v-if或者v-else-if指令.

**参数**
无

**示例**
```html
<template>
    <div class='component-container'>
        <div v-if="lock">你好 世界!</div>
        <div v-else>世界! 你好</div>
        <!-- 这里只是为了演示所用, 实际上真实开发中下面这种方式更加好一些 -->
        <div>{{ lock ? "你好 世界!" : "世界! 你好" }}</div>
        <div role="button" @click="lock = !lock">click</div>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const lock = ref<boolean>(false);
</script>
```

## v-else-if
主要用于多种情况判断的使用使用, 当上一个v-if或v-else-if指令不满足条件时会渲染这个元素.

**注意**
带有v-else-if指令的元素的前一个兄弟元素必须存在v-if或者v-else-if指令.

**示例**
```html
<template>
    <div class='component-container'>
        <div v-if="num >= 0.66">你好 世界!</div>
        <div v-else-if="num >= 0.33">世界 你好!</div>
        <div v-else>Hello World!</div>
        <div role="button" @click="num = Math.random()">click</div>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const num = ref<number>(Math.random());
</script>
```

## v-for
v-for指令主要用于根据一个可迭代数据进行迭代生成渲染多个元素.

**注意**
- 当只用v-for进行多次渲染时记得绑定key值并且保证key值的唯一性, 唯一值的key有助于提高性能, 详情可以去看一下vue中的diff算法.
- Map集合与Set集合也是可以使用v-for的哦.

**参数**
v-for="(item, index) in array"

**示例**
```html
<template>
    <ul class='component-container'>
        <li
            v-for="item in dataArrList"
            :key="item.key"
        >
            {{ item.content }}
        </li>
        <li
            v-for="(value, key, index) in dataObj"
            :key="index"
        >
            {{ key }}: {{ value }}
        </li>
        <li
            v-for="([key, value], index) in dataMap"
            :key="index"
        >
            {{ key }}: {{ value }}
        </li>
        <li
            v-for="(item, index) in dataSet"
            :key="index"
        >
            {{ item }}
        </li>
    </ul>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const dataArrList = ref([{
        key: 1,
        show: true,
        content: '张三'
    }, {
        key: 2,
        show: true,
        content: '李四'
    }, {
        key: 3,
        show: false,
        content: '王五'
    }, {
        key: 4,
        show: true,
        content: '赵六'
    }]);
    const dataObj = ref({
        name: "CodeGorgeous",
        age: 22,
        sex: "男孩子",
        slogan: "集中一点, 登峰造极!"
    })
    const dataMap = ref(new Map<string, string | number>([["name", "毛毛"], ["sex", "女孩子"], ["age", 18]]))
    const dataSet = ref(new Set<string | number>(["小维", "男孩子", "20"]));
</script>
```

## v-on
主要用于事件前, 我们常用的是其语法糖写法:```@```. 可以搭配一些修饰符使用.

**修饰符**
- .stop
    - 阻止事件向上冒泡
- .prevent
    - 阻止元素的默认行为, 例如a标签的默认跳转行为.
- .capture
    - 用修饰符修饰的事件将处于捕获阶段触发回调函数.
- .self
    - 只有当事件的触发源为自身时才会触发事件回调函数.
- .{keyAlias}
    - 仅当事件是从特定的按键触发才会触发函数.
- .once
    - 事件回调仅触发一次
- .left
    - 鼠标左键点击触发
- .right
    - 鼠标右键点击触发
- .middle
    - 鼠标中间(滚轮键)点击触发
- .passive
    - 提前告知浏览器不阻止默认行为, 浏览器得知后会提前准备好默认行为相关事项, 提高性能.

**注意**
事件修饰符是可以串联使用的, 例如: ```@.stop.prevent.once```, 不同的修饰符组合用起来是具有不同效果的, 例如: ```@.prevent.once```会造成事件触发一次后再次点击则可以触发事件默认行为.

**参数**
v-on="{
    click: handleClick,
    mousemove: handleMouseMove,
    ...
}"
或者v-on:click="handleClick"
或者@click="handleClick"

**示例**
```html

```

## v-bind
常用于绑定传递props参数, 同样可用于绑定class和style. 如果子组件没有相应的prop接受, 则这些多余的prop会到子组件根元素的标签上成为一个属性, 该情况可通过配置**inheritAttrs: false**进行关闭.

**修饰符**
- .attr
    - 强制将该绑定的属性变为元素/子组件根元素身上的属性, 如果你在子组件有接受响应的prop时会忽略这个prop仍然直接变为子组件根元素身上的属性. 当然如果你的子组件设置了**inheritAttrs: false**则相当于该修饰符失效(ps: 子组件仍不会通过props收到该值), 注意如果子组件接受的prop设置有默认则在其收不到prop时使用其prop的默认值.
- .camel
    - 未看出有什么用, 看来一下别人分析这个适用于一些标签的属性需要驼峰式的命名形式才可以作为attribute使用, 例如svg的viewBox属性, 但是我不会svg, 直接开摆, 后面有机会的话给大家补上一个示例.
- .prop
    - 会将绑定的属性变为元素/子组件根元素的Dom身上的一个属性(ps: 注意这是说的属性和标签上的属性不是一回事哦).

**注意**
v-bind的修饰符不可搭配使用.

**示例**
```html
<!-- App.vue -->
<template>
    <div class='component-container'>
        <ChildrenComponent :props1.attr="'attr1'" :props2="'attr1'" />
        <ChildrenComponentTwo :props1.prop="'attr1'" :props2="'attr2'" />
    </div>
</template>

<script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    import ChildrenComponentTwo from './components/ChildrenComponentTwo.vue';
</script>

<!-- ChildrenComponent -->
<template>
	<div class='component-container'>
		这是一个子组件
		{{ props1 }}
	</div>
</template>

<script lang='ts' setup>
	defineProps({
		props1: {
			type: String,
			required: true
		}
	})
</script>

<!-- ChildrenComponentTwo -->
<template>
  <div ref="oDiv" class='component-container'>
    你好
  </div>
</template>

<script lang='ts' setup>
import { ref, watchEffect, getCurrentInstance, nextTick } from 'vue';
    const oDiv = ref();

    nextTick(() => {
      console.dir(oDiv.value);
    })
</script>
```

## v-model
常用于组件双向同步数据中, vue3中是将vue2中的v-model与.sync整合到一起的产物, vue3中可以自定义v-model的名字并且可以在子组件中进行接收值通过相应的事件即可使得v-model双向数据通信.

**注意**
未定义v-model名字时子组件通过prop会接收到一个modelValue的值, 子组件应在合适的事件抛出一个update:modelValue的事件. 当你自定义v-model的名字后子组件接收到的prop的名字会是你自定义的名字, 需要抛出的事件为update:自定义的名字.

**示例**
```html
<!-- App -->
<template>
    <div class='component-container'>
        <ChildrenComponent v-model="val" v-model:title="val2" />
    </div>
</template>

<script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
    import { ref } from 'vue';
    const val = ref(0);
    const val2 = ref(10);
</script>

<!-- ChildrenComponent -->
<template>
    <div class='component-container'>
        {{ modelValue }}-----{{ title }}
		<button @click="handleChange">change</button>
    </div>
</template>

<script lang='ts' setup>
	import { PropType } from 'vue';

    const props = defineProps({
        modelValue: {
			type: Number as PropType<number>,
			required: true
		},
		title: {
			type: Number as PropType<number>,
			required: true
		}
    });

	const emit = defineEmits(["update:modelValue", "update:title"]);
	const handleChange = () => {
		emit("update:modelValue", props.modelValue + 1);
		emit("update:title", props.title + 1);
	}
</script>
```

## v-slot
常用于指定插槽, 可指定插槽, 在不接受子组件注入slot的prop时可使用语法糖```#```.

**注意**
- 当你想要使用来自子组件的prop时不要使用v-slot的语法糖. 
- 当子组件具有默认插槽但父组件使用子组件没有显式表明插槽的时候, 将会默认识别为默认插槽内容, 如下代码所示, 同时您应当发现一个有趣的现象就是如果子组件插槽如果具有默认元素则在父组件未使用插槽时子组件会以默认元素展示, 相当于插槽默认内容的感觉.

**示例**
```html
<!-- App -->
<template>
    <div class='component-container'>
        <ChildrenComponent>
            这是一段默认插槽内容
        </ChildrenComponent>
    </div>
</template>

<!-- ChildrenComponent -->
<template>
	<div class='component-container'>
		<slot>Hello World</slot>
	</div>
</template>
```

**示例**
```html
<!-- App -->
<template>
    <div class='component-container'>
        <ChildrenComponent>
            <template #head>这是head</template>
            <template #>这是默认插槽</template>
            <template v-slot:prop="{ prop1, index }" >{{ prop1 }}{{ index }}</template>
        </ChildrenComponent>
    </div>
</template>

<script lang='ts' setup>
    import ChildrenComponent from './components/ChildrenComponent.vue';
</script>

<!-- ChildrenComponent -->
<template>
	<div class='component-container'>
		<p><slot></slot></p>
		<p><slot name="head"></slot></p>
		<p v-for="item in 3" :key="item">
			<slot name="prop" :index="item" prop1="这是子组件设定的自定义值, 这是元素的序列号->"></slot>
		</p>
	</div>
</template>
```

## v-pre
用于跳过元素及其子元素的编译过程, 跳过大量没有指令的节点可以加快编译效率.

**注意**
编译过程就相当于该元素及其子元素不会被编译, 意味着如果你在元素或其子元素中使用了vue的一些指令或者组件什么的, 这些都不会被编译哦就相当于不识别.

**示例**
```Html
<!-- App -->
<template>
    <div class='component-container'>
        <div v-pre>
            {{ str }}
            <ChildrenComponentVue/>
        </div>
    </div>
</template>

<script lang='ts' setup>
    import ChildrenComponentVue from './components/ChildrenComponent.vue';
    const str = `1. 文字1; 2. 文字2; 3. 文字3;`;
</script>

<!-- ChildrenComponent -->
<template>
	<div class='component-container'>
		Hello ChildrenComponent!
	</div>
</template>
```

## v-cloak
这个根据官网的介绍可以理解为这个元素及其子元素未被编译完成时在其元素身上会标记一个v-cloak属性, 我们可以使用css的属性选择器让改元素未编译完成时给元素增添一些样式. 想要体验这个效果可能自行在Html包引入vue然后在一定时间后释放一个值, 这样可以看到的效果会明显一些, 正常直接使用框架模板中好像没怎么体验出来这个. 

**注意**
下面示例中cdn引入的是始终是vue的最新版本, 当你在尝试时请注意版本差异, 示例中的版本号为3.2.36.

**示例**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/vue@next"></script>
    <style>
        div {
            opacity: 1;
            transition: opacity 0.5s;
        }
        div[v-cloak] {
            opacity: 0;
        }
    </style>
    <title>CodeGorgeous</title>
</head>
<body>
    <div id="app" v-cloak>这是一个姓名 --> {{ str }}</div>
    <script>
        const { createApp, h } = Vue;
        const app = createApp({
            data() {
                return {
                    str: 'CodeGorgeous',
                }
            }
        });
        
        setTimeout(() => {
            app.mount('#app');
        }, 3000)
    </script>
</body>
</html>
```

## v-once
用于一些只需要执行渲染一次的元素上. 你可以从下面的示例中看到v-if失效的效果无论你如何点击button.

**示例**
```html
<template>
    <div class='component-container'>
        <button @click="show = !show">toggle</button>
        <div v-if="show" v-once>
            这是一段消息
        </div>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const show = ref(true);
</script>
```

## v-memo

**注意**
该指令与vue3.2+版本才可以使用, 如果要使用请注意版本差异.

## v-is

**注意**
已经在vue3.1版本中废弃, 如要使用请看后面的特殊的attribute中的is章节.

# 特殊attribute

## key
key主要用于提升代码速度, 因为在vue底层是通过diff算法进行计算那些虚拟Dom应该更新哪些不需要更新, 可以理解为key就是这个元素的标识, 最常使用的场景就是配合v-for使用, 这就是一些人经常说的要在使用v-for的时候使用key, 并且一般公司在配置的eslint规则中就会含有这种.

**注意**
应当尽量遵循key的唯一性, 如果你的key为都是同一个值则vue是不会将该值作为标识使用的, 意味着key是无效的.

**注意**
当你为一个元素/组件绑定了灵活的key, 则该元素/组件则会触发完整的过渡效果/生命周期

**示例**
```html
<!-- key重复与不重复情况 -->
<template>
    <div class='component-container'>
        <ul>
            <li
                v-for="item in liList"
                :key="item.key"
            >
                {{ item.name }}
            </li>
        </ul>
        <button @click="handleClick">打乱顺序</button>
        <ul>
            <li
                v-for="(item, index) in liList"
                :key="index"
            >
                {{ item.name }}
            </li>
        </ul>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const liList = ref([{
        name: "CodeGorgeous",
        key: 1
    }, {
        name: "XingJun",
        key: 2
    }, {
        name: "MaoMao",
        key: 2
    }, {
        name: "XingLian",
        key: 3
    }]);
    
    // **************功能分割线***************
    const handleClick = () => {
        const temp = [...liList.value];
        temp.sort(_ => {
            return Math.random() - 0.5;
        });
        liList.value = temp;
    }
</script>

<!-- 元素绑定灵活key, 每次key的变动就会引起完整的过渡动画周期-->
<template>
    <div class='component-container'>
        <transition
            name="fade"
            mode="out-in"
        >
            <span :key="count">
                This is an auto increment count --> 1
            </span>
        </transition>
        <button @click="handleClick">自增</button>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    const count = ref(0);
    
    // **************功能分割线***************
    const handleClick = () => {
        count.value += 1;
    }
</script>

<style scoped>
.fade-enter-active {
    opacity: 0;
    transition: .3s;
}

.fade-enter-to {
    opacity: 1;
}

.fade-leave-active {
    opacity: 1;
    transition: .3s;
}

.fade-leave-to {
    opacity: 0;
}
</style>

<!-- 组件绑定了灵活的key, 会触发完成的证明周期 -->
<!-- App -->
<template>
    <div class='component-container'>
        <ChildrenComponentVue :key="count" />
        <button @click="handleClick">自增</button>
    </div>
</template>

<script lang='ts' setup>
    import { ref } from 'vue';
    import ChildrenComponentVue from './components/ChildrenComponent.vue';
    const count = ref(0);
    
    // **************功能分割线***************
    const handleClick = () => {
        count.value += 1;
    }
</script>

<style scoped>
.fade-enter-active {
    opacity: 0;
    transition: .3s;
}

.fade-enter-to {
    opacity: 1;
}

.fade-leave-active {
    opacity: 1;
    transition: .3s;
}

.fade-leave-to {
    opacity: 0;
}
</style>
<!-- ChildrenComponent -->
<template>
	<div class='component-container'>
		Hello CodeGorgeous!
	</div>
</template>

<script lang='ts' setup>
	import {
		onBeforeMount,
		onMounted,
		onBeforeUnmount,
		onUnmounted
	} from 'vue';
console.log("create");
onBeforeMount(() => {
	console.log("before mount");
})
onMounted(() => {
	console.log("mounted");
})
onBeforeUnmount(() => {
	console.log("before unmount");
})
onUnmounted(() => {
	console.log("unmounted");
})
</script>
```

## ref
通常用于获取元素/组件实例, 可以使用配置为函数或者ref

**注意**
如果你使用ref属性传递为函数时, 该函数的触发时机为onMounted阶段, 但是该函数会比onMounted的回调函数早一点触发, 可能是因为onMounted是指整个组件挂载完毕会执行回调而ref函数则是该元素执行完毕后就会执行.

**示例**
```html
<template>
    <div class='component-container'>
        <p ref="oP">这是一个p元素</p>
        <p :ref="handleElement">这是一个p元素</p>
        <ChildrenComponentVue ref="oChildren" />
        <ChildrenComponentVue :ref="handleComponentElement" />
    </div>
</template>

<script lang='ts' setup>
    import ChildrenComponentVue from './components/ChildrenComponent.vue';
    import { ref, nextTick } from 'vue';

    const oP = ref();
    const oChildren = ref();
    nextTick(() => {
        console.log(oP.value); // p元素
        console.log(oChildren.value); // ChildrenComponentVue组件的公开实例
    })
    const handleElement = (el: any) => {
        console.log(el); // p元素
    }
    const handleComponentElement = (el: any) => {
        console.log(el); // ChildrenComponentVue组件的公开实例
    }
</script>
```

## is
用与component组件进行配合使用, 可以实现切换组件就可以触发元素/组件的生命周期和过渡动画. 与此同时我们可能会在原生元素身上使用is, 正常在原生情况下使用则is会作为元素的attr出现在元素身上, 但是有时候我们想让一个组件替换一个原生元素, 那么可在这个标签身上添加属性*is="vue:组件名"*该种形式(ps: 该种情况暂时不了解什么情况下会遇到, 先记一笔)

**注意**
*is="vue:组件名"*需要vue3.1+版本使用, 并且该种情况is不可以使用v-bind绑定否则is不会产生组件替换原生元素的情况

**示例**
```html
<template>
    <div class='component-container'>
        <transition
            name="fade"
            mode="out-in"
        >
            <component :is="lock ? ChildrenComponentVue : ChildrenComponentTwoVue"></component>
        </transition>
        <button @click="lock = !lock">Toggle</button>
        <div is="This is Is Attr">Hello World!</div>
        <div is="vue:ChildrenComponentVue">Hello World2!</div>
    </div>
</template>

<script lang='ts' setup>
    import ChildrenComponentVue from './components/ChildrenComponent.vue';
    import ChildrenComponentTwoVue from './components/ChildrenComponentTwo.vue';
    import { ref } from 'vue';

    const lock = ref(false);
</script>

<style scoped>
.fade-enter-active {
    opacity: 0;
    transition: .3s;
}

.fade-enter-to {
    opacity: 1;
}

.fade-leave-active {
    opacity: 1;
    transition: .3s;
}

.fade-leave-to {
    opacity: 0;
}
</style>
```

# 内置组件

## component

## transition

## transition-group

## keep-alive

## slot

## teleport

# 响应式API

# 组合式API

# 单文件组件

# 遇到的问题

## 报错 Cannot access ambient const enums when the '--isolatedModules' flag is provided.

**环境**
打包时遇到
vue: 3.2.25
vite: 2.9.0
vue-tsc: 0.29.8
typescript: 4.5.4

**翻译(英->中)**
提供"--isolatedModules"标志时无法访问环境常量枚举。

**原因**
有关ts的枚举属性和const一起使用时产生的冲突

**解决方式**
- 改变tsconfig.json中的isolatedModules为false
  1. 不过改变此项可能会发生未知的错误
  2. 这不是一个理想的解决方案
- 在tsconfig.json中compilerOptions新增"skipLibCheck": true
  1. 改变一项会忽略其他模块并仅检查您自己编写的模块
  2. 会语法不过库中的类型定义

## 报错 Uncaught TypeError: Cannot read properties of null (reading 'exposed')

**环境**
在使用h函数时报错
vue: 3.2.25
vite: 2.9.0
vue-tsc: 0.29.8
typescript: 4.5.4

**翻译(英->中)**
未捕获的类型错误：无法读取 null 的属性(读取"exposed")

**原因**
暂时未知

**解决方式**
暂时未知
