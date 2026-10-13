import { shallowReactive, reactive, effectScope, getCurrentScope, hasInjectionContext, getCurrentInstance, inject, toRef, computed, defineComponent, h, isReadonly, isRef, isShallow, isReactive, toRaw, ref, mergeProps, useSSRContext, defineAsyncComponent, unref, provide, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, createApp } from "vue";
import { $fetch } from "C:/Users/yrodriguez/Desktop/YR.DEV/Projects/yr-edu-corp/node_modules/ofetch/dist/node.mjs";
import { baseURL } from "#internal/nuxt/paths";
import { createHooks } from "C:/Users/yrodriguez/Desktop/YR.DEV/Projects/yr-edu-corp/node_modules/nuxt/node_modules/hookable/dist/index.mjs";
import { getContext } from "C:/Users/yrodriguez/Desktop/YR.DEV/Projects/yr-edu-corp/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import { sanitizeStatusCode, createError as createError$1 } from "C:/Users/yrodriguez/Desktop/YR.DEV/Projects/yr-edu-corp/node_modules/nuxt/node_modules/h3/dist/index.mjs";
import { hasProtocol, joinURL, withQuery, parseURL, encodePath, decodePath, isScriptProtocol, isEqual, stringifyParsedURL, stringifyQuery, parseQuery } from "C:/Users/yrodriguez/Desktop/YR.DEV/Projects/yr-edu-corp/node_modules/ufo/dist/index.mjs";
import { defu } from "C:/Users/yrodriguez/Desktop/YR.DEV/Projects/yr-edu-corp/node_modules/defu/dist/defu.mjs";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from "vue/server-renderer";
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const nuxtDefaultErrorValue = null;
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.11";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
import.meta.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
function isScopeWithinInstance(instance) {
  const instanceScope = instance.scope;
  let scope = getCurrentScope();
  while (scope) {
    if (scope === instanceScope) {
      return true;
    }
    scope = scope.parent;
  }
  return false;
}
const useRoute = () => {
  if (hasInjectionContext()) {
    const instance = getCurrentInstance();
    if (!instance || isScopeWithinInstance(instance)) {
      return inject(PageRouteSymbol, useNuxtApp()._route);
    }
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const clearError = async (options = {}) => {
  const nuxtApp = useNuxtApp();
  const error = /* @__PURE__ */ useError();
  nuxtApp.callHook("app:error:cleared", options);
  if (options.redirect) {
    await useRouter().replace(options.redirect);
  }
  error.value = nuxtDefaultErrorValue;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
const routerOptions = {};
const sensitiveMatcher = (m, p) => {
  return [];
};
const foldedMatcher = sensitiveMatcher;
const decodeRoutePath = function decodeRoutePath2(path) {
  if (!path.includes("%")) return path;
  const queryIndex = path.indexOf("?");
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  try {
    return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
  } catch {
    return path;
  }
};
const normalizePath = (path, fold) => {
  if (typeof path !== "string") {
    return path;
  }
  const decoded = decodeRoutePath(path);
  return fold ? decoded.toLowerCase() : decoded;
};
const _routeRulesMatcher = (path) => routerOptions.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
const routeRulesMatcher = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => {
        const index = hooks[hook].indexOf(guard);
        if (index !== -1) {
          hooks[hook].splice(index, 1);
        }
      };
    };
    const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    let navigationCounter = 0;
    async function handleNavigation(url, replace) {
      const navigationId = ++navigationCounter;
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (navigationId !== navigationCounter) {
            return;
          }
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return await handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
          if (navigationId !== navigationCounter) {
            return;
          }
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url, false),
      replace: (url) => handleNavigation(url, true),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    const initialLayoutProps = nuxtApp.payload.state._layoutProps;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
          to.meta.layoutProps = initialLayoutProps;
        }
        nuxtApp._processingMiddleware = true;
        {
          nuxtApp._middlewareTo = to;
        }
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          const routeRules = getRouteRules({ path: to.path });
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              const guard = nuxtApp._middleware.named[key];
              if (!guard) {
                continue;
              }
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(guard);
              } else {
                middlewareEntries.delete(guard);
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                delete nuxtApp._middlewareTo;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
        {
          delete nuxtApp._middlewareTo;
        }
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$8 = {
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const scrolled = ref(false);
    const open = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["nav", { scrolled: scrolled.value }]
      }, _attrs))} data-v-86c25ccd><div class="container nav-inner" data-v-86c25ccd><a href="#hero-marketing" class="brand" data-v-86c25ccd><span class="brand-mark" data-v-86c25ccd>✦</span><span class="brand-text" data-v-86c25ccd>Portfolio</span></a><nav class="links" data-v-86c25ccd><a href="#hero-marketing" data-v-86c25ccd>Marketing</a><a href="#galeria" data-v-86c25ccd>Galería</a><a href="#desarrollador" data-v-86c25ccd>Desarrollador</a><a href="#proyectos" data-v-86c25ccd>Proyectos</a></nav><a href="#proyectos" class="btn btn-nav" data-v-86c25ccd>Contacto →</a><button class="burger" aria-label="Abrir menú"${ssrRenderAttr("aria-expanded", open.value)} data-v-86c25ccd>☰</button></div>`);
      if (open.value) {
        _push(`<div class="mobile" data-v-86c25ccd><a href="#hero-marketing" data-v-86c25ccd>Marketing</a><a href="#galeria" data-v-86c25ccd>Galería</a><a href="#desarrollador" data-v-86c25ccd>Desarrollador</a><a href="#proyectos" data-v-86c25ccd>Proyectos</a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-86c25ccd"]]);
const _sfc_main$7 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    id: "hero-marketing",
    class: "hero-blue"
  }, _attrs))} data-v-94d35f1c><div class="container hero-grid" data-v-94d35f1c><p class="top-kicker reveal" data-v-94d35f1c>Maximalism.  Luxury typography.  Conceptual sketch.</p><h1 class="lux-type reveal" data-v-94d35f1c><span class="line line-1" data-v-94d35f1c><span class="serif-cond" data-v-94d35f1c>EDUARDO</span><span class="script" data-v-94d35f1c>Martinez</span></span><span class="line line-2" data-v-94d35f1c><span class="serif-cond small" data-v-94d35f1c>MARKETING</span><span class="script" data-v-94d35f1c>professional</span></span></h1><p class="sub reveal" data-v-94d35f1c>YOU <em data-v-94d35f1c>dont</em> HAVE FOREVER <span data-v-94d35f1c>to create.</span></p><div class="photo-card reveal" data-v-94d35f1c><img class="hero-photo" src="https://images.unsplash.com/photo-1493421419110-74f4e85ba126?q=80&amp;w=1600&amp;auto=format&amp;fit=crop" alt="Eduardo Martinez — Marketing Professional" data-v-94d35f1c><div class="photo-veil" data-v-94d35f1c></div><div class="photo-caption" data-v-94d35f1c><span data-v-94d35f1c>Portfolio — Vol.01</span><span class="cap-right" data-v-94d35f1c>Azul profundo / Editorial</span></div></div><div class="hero-cta reveal" data-v-94d35f1c><a href="#galeria" class="btn btn-light" data-v-94d35f1c>Ver galería ↓</a><a href="#desarrollador" class="btn btn-ghost" data-v-94d35f1c>Soy dev también</a></div></div></section>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroMarketing.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-94d35f1c"]]);
const _sfc_main$6 = {
  __name: "GallerySection",
  __ssrInlineRender: true,
  setup(__props) {
    const mk = (seed, w = 800, h2 = 600) => `https://picsum.photos/seed/${seed}/${w}/${h2}`;
    const themes = ref([
      {
        slug: "branding",
        title: "Branding",
        subtitle: "Identidad & Dirección de arte",
        cover: mk("edu-branding", 700, 900),
        count: 6,
        photos: ["edu-brand-1", "edu-brand-2", "edu-brand-3", "edu-brand-4", "edu-brand-5", "edu-brand-6"].map((s) => mk(s))
      },
      {
        slug: "lifestyle",
        title: "Lifestyle",
        subtitle: "Retrato editorial",
        cover: mk("edu-life", 700, 900),
        count: 6,
        photos: ["edu-life-1", "edu-life-2", "edu-life-3", "edu-life-4", "edu-life-5", "edu-life-6"].map((s) => mk(s))
      },
      {
        slug: "producto",
        title: "Producto",
        subtitle: "Still life & Comercial",
        cover: mk("edu-prod", 700, 900),
        count: 6,
        photos: ["edu-prod-1", "edu-prod-2", "edu-prod-3", "edu-prod-4", "edu-prod-5", "edu-prod-6"].map((s) => mk(s))
      },
      {
        slug: "eventos",
        title: "Eventos",
        subtitle: "Backstage & Escenario",
        cover: mk("edu-event", 700, 900),
        count: 6,
        photos: ["edu-ev-1", "edu-ev-2", "edu-ev-3", "edu-ev-4", "edu-ev-5", "edu-ev-6"].map((s) => mk(s))
      },
      {
        slug: "viajes",
        title: "Viajes",
        subtitle: "Paisaje & Urbano",
        cover: mk("edu-travel", 700, 900),
        count: 6,
        photos: ["edu-tr-1", "edu-tr-2", "edu-tr-3", "edu-tr-4", "edu-tr-5", "edu-tr-6"].map((s) => mk(s))
      }
    ]);
    const active = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "galeria",
        class: "gallery-blue"
      }, _attrs))} data-v-33e3b4a4><div class="container" data-v-33e3b4a4><div class="gal-head reveal" data-v-33e3b4a4><p class="section-label" data-v-33e3b4a4>02 — Galería</p><h2 data-v-33e3b4a4> Cinco mundos, <em data-v-33e3b4a4>cinco temas.</em></h2><p class="gal-desc" data-v-33e3b4a4>Elige un tema para ver las fotos. Cada tarjeta abre su colección (lightbox incluido).</p></div><div class="gal-grid" data-v-33e3b4a4><!--[-->`);
      ssrRenderList(themes.value, (t, i) => {
        _push(`<button class="gal-card reveal" style="${ssrRenderStyle({ transitionDelay: i * 60 + "ms" })}" data-v-33e3b4a4><img${ssrRenderAttr("src", t.cover)}${ssrRenderAttr("alt", t.title)} loading="lazy" data-v-33e3b4a4><span class="gal-num" data-v-33e3b4a4>0${ssrInterpolate(i + 1)}</span><span class="gal-overlay" data-v-33e3b4a4></span><span class="gal-info" data-v-33e3b4a4><span class="gal-kicker" data-v-33e3b4a4>${ssrInterpolate(t.count)} fotos</span><span class="gal-title" data-v-33e3b4a4>${ssrInterpolate(t.title)}</span><span class="gal-sub" data-v-33e3b4a4>${ssrInterpolate(t.subtitle)}</span><span class="gal-link" data-v-33e3b4a4>Ver fotos →</span></span></button>`);
      });
      _push(`<!--]--></div></div>`);
      if (active.value) {
        _push(`<div class="lightbox" data-v-33e3b4a4><div class="lb-box" data-v-33e3b4a4><div class="lb-head" data-v-33e3b4a4><div data-v-33e3b4a4><p class="section-label" data-v-33e3b4a4>${ssrInterpolate(active.value.subtitle)}</p><h3 data-v-33e3b4a4>${ssrInterpolate(active.value.title)}</h3></div><button class="lb-close" data-v-33e3b4a4>✕</button></div><div class="lb-grid" data-v-33e3b4a4><!--[-->`);
        ssrRenderList(active.value.photos, (p, idx) => {
          _push(`<img${ssrRenderAttr("src", p)}${ssrRenderAttr("alt", `${active.value.title} ${idx + 1}`)} loading="lazy" data-v-33e3b4a4>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GallerySection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-33e3b4a4"]]);
const _sfc_main$5 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    id: "desarrollador",
    class: "dev-hero"
  }, _attrs))} data-v-c2667b6b><div class="container dev-grid" data-v-c2667b6b><div class="dev-left reveal" data-v-c2667b6b><p class="dev-kicker" data-v-c2667b6b><span class="dot" data-v-c2667b6b></span> FULL-STACK &amp; UNITY DEVELOPER</p><h2 data-v-c2667b6b>Building Web<br data-v-c2667b6b>Experiences &amp;<br data-v-c2667b6b>Interactive Worlds</h2><p class="dev-desc" data-v-c2667b6b> Independent developer focused on creating robust full-stack architectures and immersive virtual environments. I merge the precision of logical engineering with the creativity of game design. </p><div class="dev-cta" data-v-c2667b6b><a href="#proyectos" class="btn btn-dark" data-v-c2667b6b>View My Work →</a><a href="#contacto" class="btn btn-outline" data-v-c2667b6b>Let&#39;s Talk</a></div><pre class="code" data-v-c2667b6b>System.out.println(&quot;Hello World&quot;);</pre></div><div class="dev-right reveal" data-v-c2667b6b><div class="sketch-card" data-v-c2667b6b><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&amp;w=800&amp;auto=format&amp;fit=crop" alt="Eduardo Martinez — Developer" data-v-c2667b6b></div><div class="stack-chips" data-v-c2667b6b><span data-v-c2667b6b>TypeScript</span><span data-v-c2667b6b>Next.js</span><span data-v-c2667b6b>Prisma</span><span data-v-c2667b6b>Docker</span><span data-v-c2667b6b>Redis</span></div></div></div></section>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroDeveloper.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-c2667b6b"]]);
const _sfc_main$4 = {
  __name: "ProjectsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const webProjects = [
      {
        title: "Nexus ERP Dashboard",
        tags: ["React", "Node.js", "PostgreSQL"],
        desc: "A high-performance enterprise resource planning tool featuring real-time data synchronization and complex state management.",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "Chronos Portfolio",
        tags: ["Next.js", "Tailwind", "Prisma"],
        desc: "An ultra-fast, SEO-optimized portfolio engine designed for creative developers and digital artists.",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "SyncStream Core",
        tags: ["Go", "Redis", "Docker"],
        desc: "A backend infrastructure project focused on low-latency data streaming and microservices orchestration.",
        img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop"
      }
    ];
    const gameProjects = [
      {
        title: "Ink & Iron",
        tags: "C# • Unity 3D • ShaderLab",
        desc: "A tactical RPG with a unique hand-drawn aesthetic where every frame looks like a digital painting. Built with custom SRP shaders.",
        img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
      },
      {
        title: "Void Runner",
        tags: "C# • Unity 2D • ProBuilder",
        desc: "A minimalist precision platformer exploring abstract architectural spaces. Features custom gravity mechanics and procedural levels.",
        img: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?q=80&w=800&auto=format&fit=crop"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "proyectos",
        class: "projects-bw"
      }, _attrs))} data-v-e905e72b><div class="container" data-v-e905e72b><div class="proj-head reveal" data-v-e905e72b><span class="proj-icon" data-v-e905e72b>▤</span><h2 data-v-e905e72b>Full-Stack Web</h2><span class="proj-rule" data-v-e905e72b></span></div><div class="cards-3" data-v-e905e72b><!--[-->`);
      ssrRenderList(webProjects, (p) => {
        _push(`<article class="card reveal" data-v-e905e72b><div class="card-media" data-v-e905e72b><img${ssrRenderAttr("src", p.img)}${ssrRenderAttr("alt", p.title)} loading="lazy" data-v-e905e72b></div><div class="card-body" data-v-e905e72b><div class="tags" data-v-e905e72b><!--[-->`);
        ssrRenderList(p.tags, (t) => {
          _push(`<span data-v-e905e72b>${ssrInterpolate(t)}</span>`);
        });
        _push(`<!--]--></div><h3 data-v-e905e72b>${ssrInterpolate(p.title)}</h3><p data-v-e905e72b>${ssrInterpolate(p.desc)}</p><div class="card-actions" data-v-e905e72b><a href="#" class="btn-mini grow" data-v-e905e72b>⚡ Live Demo</a><a href="#" class="btn-mini sq" aria-label="Código" data-v-e905e72b>&lt;&gt;</a></div></div></article>`);
      });
      _push(`<!--]--></div><div class="proj-head reveal proj-head-2" data-v-e905e72b><span class="proj-icon" data-v-e905e72b>♘</span><h2 data-v-e905e72b>Unity Game Development</h2><span class="proj-rule" data-v-e905e72b></span></div><div class="cards-2" data-v-e905e72b><!--[-->`);
      ssrRenderList(gameProjects, (g) => {
        _push(`<article class="card wide reveal" data-v-e905e72b><div class="card-media side" data-v-e905e72b><img${ssrRenderAttr("src", g.img)}${ssrRenderAttr("alt", g.title)} loading="lazy" data-v-e905e72b></div><div class="card-body" data-v-e905e72b><div class="tags" data-v-e905e72b><span data-v-e905e72b>${ssrInterpolate(g.tags)}</span></div><h3 data-v-e905e72b>${ssrInterpolate(g.title)}</h3><p data-v-e905e72b>${ssrInterpolate(g.desc)}</p><div class="card-actions" data-v-e905e72b><a href="#" class="btn-mini dark" data-v-e905e72b>▶ Play Game</a><a href="#" class="btn-mini" data-v-e905e72b>📖 Devlog</a></div></div></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProjectsSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-e905e72b"]]);
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({
    id: "contacto",
    class: "footer"
  }, _attrs))} data-v-00f8ee1d><div class="container foot-grid" data-v-00f8ee1d><div data-v-00f8ee1d><p class="foot-brand" data-v-00f8ee1d>Portfolio</p><p class="foot-sub" data-v-00f8ee1d>Marketing Professional · Full-Stack &amp; Unity Developer</p></div><div class="foot-links" data-v-00f8ee1d><a href="#hero-marketing" data-v-00f8ee1d>Marketing</a><a href="#galeria" data-v-00f8ee1d>Galería</a><a href="#desarrollador" data-v-00f8ee1d>Desarrollador</a><a href="#proyectos" data-v-00f8ee1d>Proyectos</a></div><div class="foot-cta" data-v-00f8ee1d><a href="mailto:hola@portfolio.com" class="btn btn-light" data-v-00f8ee1d>hola@portfolio.com</a><p class="copy" data-v-00f8ee1d>© 2026 Portfolio. Built with logic &amp; ink.</p></div></div></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-00f8ee1d"]]);
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppNavbar = __nuxt_component_0;
      const _component_HeroMarketing = __nuxt_component_1;
      const _component_GallerySection = __nuxt_component_2;
      const _component_HeroDeveloper = __nuxt_component_3;
      const _component_ProjectsSection = __nuxt_component_4;
      const _component_AppFooter = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_AppNavbar, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(_component_HeroMarketing, null, null, _parent));
      _push(ssrRenderComponent(_component_GallerySection, null, null, _parent));
      _push(ssrRenderComponent(_component_HeroDeveloper, null, null, _parent));
      _push(ssrRenderComponent(_component_ProjectsSection, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import("./_nuxt/error-404-BQAk_3aK.js"));
    const _Error = defineAsyncComponent(() => import("./_nuxt/error-500-Dgf6h1rd.js"));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));
export {
  _export_sfc as _,
  useNuxtApp as a,
  useRuntimeConfig as b,
  nuxtLinkDefaults as c,
  entry_default as default,
  encodeRoutePath as e,
  navigateTo as n,
  resolveRouteObject as r,
  tryUseNuxtApp as t,
  useRouter as u
};
//# sourceMappingURL=server.mjs.map
