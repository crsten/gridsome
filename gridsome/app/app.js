import Vue from 'vue'
import plugins from '~/.temp/plugins-server'
import main from './main'

import head from './head'
import router from './router'
import fetchPath from './fetchPath'
import { url } from './utils/helpers'
import gaphqlGuard from './graphql/guard'
import graphlMixin from './graphql/mixin'

import Link from './components/Link'
import Image from './components/Image'
import ClientOnly from './components/ClientOnly'

Vue.mixin(graphlMixin)
Vue.component('g-link', Link)
Vue.component('g-image', Image)
Vue.component('ClientOnly', ClientOnly)

Vue.prototype.$url = url
Vue.prototype.$fetch = fetchPath

router.beforeEach(gaphqlGuard)

const context = {
  appOptions: {
    render: h => h('router-view', { attrs: { id: 'app' }}),
    metaInfo: head,
    methods: {},
    data: {},
    router
  },
  isServer: process.isServer,
  isClient: process.isClient,
  router,
  head
}

runPlugins(plugins)

export function runPlugins (plugins) {
  for (const { run, options } of plugins) {
    if (typeof run === 'function') {
      run(Vue, options, context)
    }
  }
}

export function runMain () {
  if (typeof main === 'function') {
    main(Vue, context)
  }
}

export default function createApp () {
  return {
    app: new Vue(context.appOptions),
    router
  }
}
