
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
// Adapted from https://github.com/then/is-promise/blob/master/index.js
// Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
function is_promise(value) {
    return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function append(target, node) {
    target.appendChild(node);
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_style(node, key, value, important) {
    if (value == null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
const managed_styles = new Map();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash$6(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash$6(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
        rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        managed_styles.forEach(info => {
            const { ownerNode } = info.stylesheet;
            // there is no ownerNode if it runs on jsdom.
            if (ownerNode)
                detach(ownerNode);
        });
        managed_styles.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs#run-time-svelte-ondestroy
 */
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
/**
 * Associates an arbitrary `context` object with the current component and the specified `key`
 * and returns that object. The context is then available to children of the component
 * (including slotted content) with `getContext`.
 *
 * Like lifecycle functions, this must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-setcontext
 */
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
}
/**
 * Retrieves the context that belongs to the closest parent component with the specified `key`.
 * Must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-getcontext
 */
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    const options = { direction: 'in' };
    let config = fn(node, params, options);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            started = true;
            delete_rule(node);
            if (is_function(config)) {
                config = config(options);
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    const options = { direction: 'out' };
    let config = fn(node, params, options);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config(options);
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            if (info.blocks[i] === block) {
                                info.blocks[i] = null;
                            }
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
            if (!info.hasCatch) {
                throw error;
            }
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}
function update_await_block_branch(info, ctx, dirty) {
    const child_ctx = ctx.slice();
    const { resolved } = info;
    if (info.current === info.then) {
        child_ctx[info.value] = resolved;
    }
    if (info.current === info.catch) {
        child_ctx[info.error] = resolved;
    }
    info.block.p(child_ctx, dirty);
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        flush_render_callbacks($$.after_update);
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    if (has_stop_immediate_propagation)
        modifiers.push('stopImmediatePropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
function construct_svelte_component_dev(component, props) {
    const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
    try {
        const instance = new component(props);
        if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
            throw new Error(error_message);
        }
        return instance;
    }
    catch (err) {
        const { message } = err;
        if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
            throw new Error(error_message);
        }
        else {
            throw err;
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

const LOCATION = {};
const ROUTER = {};
const HISTORY = {};

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 * https://github.com/reach/router/blob/master/LICENSE
 */

const PARAM = /^:(.+)/;
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Split up the URI into segments delimited by `/`
 * Strip starting/ending `/`
 * @param {string} uri
 * @return {string[]}
 */
const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
/**
 * Strip `str` of potential start and end `/`
 * @param {string} string
 * @return {string}
 */
const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
const rankRoute = (route, index) => {
    const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
              score += SEGMENT_POINTS;

              if (segment === "") {
                  score += ROOT_POINTS;
              } else if (PARAM.test(segment)) {
                  score += DYNAMIC_POINTS;
              } else if (segment[0] === "*") {
                  score -= SEGMENT_POINTS + SPLAT_PENALTY;
              } else {
                  score += STATIC_POINTS;
              }

              return score;
          }, 0);

    return { route, score, index };
};
/**
 * Give a score to all routes and sort them on that
 * If two routes have the exact same score, we go by index instead
 * @param {object[]} routes
 * @return {object[]}
 */
const rankRoutes = (routes) =>
    routes
        .map(rankRoute)
        .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
        );
/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { path, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
const pick = (routes, uri) => {
    let match;
    let default_;

    const [uriPathname] = uri.split("?");
    const uriSegments = segmentize(uriPathname);
    const isRootUri = uriSegments[0] === "";
    const ranked = rankRoutes(routes);

    for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
            default_ = {
                route,
                params: {},
                uri,
            };
            continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
            const routeSegment = routeSegments[index];
            const uriSegment = uriSegments[index];

            if (routeSegment && routeSegment[0] === "*") {
                // Hit a splat, just grab the rest, and return a match
                // uri:   /files/documents/work
                // route: /files/* or /files/*splatname
                const splatName =
                    routeSegment === "*" ? "*" : routeSegment.slice(1);

                params[splatName] = uriSegments
                    .slice(index)
                    .map(decodeURIComponent)
                    .join("/");
                break;
            }

            if (typeof uriSegment === "undefined") {
                // URI is shorter than the route, no match
                // uri:   /users
                // route: /users/:userId
                missed = true;
                break;
            }

            const dynamicMatch = PARAM.exec(routeSegment);

            if (dynamicMatch && !isRootUri) {
                const value = decodeURIComponent(uriSegment);
                params[dynamicMatch[1]] = value;
            } else if (routeSegment !== uriSegment) {
                // Current segments don't match, not dynamic, not splat, so no match
                // uri:   /users/123/settings
                // route: /users/:id/profile
                missed = true;
                break;
            }
        }

        if (!missed) {
            match = {
                route,
                params,
                uri: "/" + uriSegments.slice(0, index).join("/"),
            };
            break;
        }
    }

    return match || default_ || null;
};
/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
const combinePaths = (basepath, path) =>
    `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;

const canUseDOM = () =>
    typeof window !== "undefined" &&
    "document" in window &&
    "location" in window;

/* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.59.2 */
const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

// (42:0) {#if $activeRoute && $activeRoute.route === route}
function create_if_block$1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*component*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
		ctx
	});

	return block;
}

// (51:4) {:else}
function create_else_block$1(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
						get_default_slot_context$1
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(51:4) {:else}",
		ctx
	});

	return block;
}

// (43:4) {#if component}
function create_if_block_1(ctx) {
	let await_block_anchor;
	let promise;
	let current;

	let info = {
		ctx,
		current: null,
		token: null,
		hasCatch: false,
		pending: create_pending_block,
		then: create_then_block,
		catch: create_catch_block,
		value: 12,
		blocks: [,,,]
	};

	handle_promise(promise = /*component*/ ctx[0], info);

	const block = {
		c: function create() {
			await_block_anchor = empty();
			info.block.c();
		},
		m: function mount(target, anchor) {
			insert_dev(target, await_block_anchor, anchor);
			info.block.m(target, info.anchor = anchor);
			info.mount = () => await_block_anchor.parentNode;
			info.anchor = await_block_anchor;
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			info.ctx = ctx;

			if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
				update_await_block_branch(info, ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(info.block);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < 3; i += 1) {
				const block = info.blocks[i];
				transition_out(block);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(await_block_anchor);
			info.block.d(detaching);
			info.token = null;
			info = null;
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(43:4) {#if component}",
		ctx
	});

	return block;
}

// (1:0) <script>     import { getContext, onDestroy }
function create_catch_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_catch_block.name,
		type: "catch",
		source: "(1:0) <script>     import { getContext, onDestroy }",
		ctx
	});

	return block;
}

// (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
function create_then_block(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
	var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
				])
			: {};

			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_then_block.name,
		type: "then",
		source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
		ctx
	});

	return block;
}

// (1:0) <script>     import { getContext, onDestroy }
function create_pending_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_pending_block.name,
		type: "pending",
		source: "(1:0) <script>     import { getContext, onDestroy }",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$activeRoute*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let $activeRoute;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Route', slots, ['default']);
	let { path = "" } = $$props;
	let { component = null } = $$props;
	let routeParams = {};
	let routeProps = {};
	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

	const route = {
		path,
		// If no path prop is given, this Route will act as the default Route
		// that is rendered if no other Route in the Router is a match.
		default: path === ""
	};

	registerRoute(route);

	onDestroy(() => {
		unregisterRoute(route);
	});

	$$self.$$set = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		onDestroy,
		ROUTER,
		canUseDOM,
		path,
		component,
		routeParams,
		routeProps,
		registerRoute,
		unregisterRoute,
		activeRoute,
		route,
		$activeRoute
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
		if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($activeRoute && $activeRoute.route === route) {
			$$invalidate(2, routeParams = $activeRoute.params);
			const { component: c, path, ...rest } = $$props;
			$$invalidate(3, routeProps = rest);

			if (c) {
				if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
			}

			canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		component,
		$activeRoute,
		routeParams,
		routeProps,
		activeRoute,
		route,
		path,
		$$scope,
		slots
	];
}

class Route extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { path: 6, component: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Route",
			options,
			id: create_fragment$4.name
		});
	}

	get path() {
		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set path(value) {
		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get component() {
		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set component(value) {
		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier} [start]
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=} start
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let started = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (started) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        started = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
            // We need to set this to false because callbacks can still happen despite having unsubscribed:
            // Callbacks might already be placed in the queue which doesn't know it should no longer
            // invoke this derived store.
            started = false;
        };
    });
}

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 * https://github.com/reach/router/blob/master/LICENSE
 */

const getLocation = (source) => {
    return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial",
    };
};
const createHistory = (source) => {
    const listeners = [];
    let location = getLocation(source);

    return {
        get location() {
            return location;
        },

        listen(listener) {
            listeners.push(listener);

            const popstateListener = () => {
                location = getLocation(source);
                listener({ location, action: "POP" });
            };

            source.addEventListener("popstate", popstateListener);

            return () => {
                source.removeEventListener("popstate", popstateListener);
                const index = listeners.indexOf(listener);
                listeners.splice(index, 1);
            };
        },

        navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
            state = { ...state, key: Date.now() + "" };
            // try...catch iOS Safari limits to 100 pushState calls
            try {
                if (replace) source.history.replaceState(state, "", to);
                else source.history.pushState(state, "", to);
            } catch (e) {
                source.location[replace ? "replace" : "assign"](to);
            }
            location = getLocation(source);
            listeners.forEach((listener) =>
                listener({ location, action: "PUSH", preserveScroll })
            );
            if(blurActiveElement) document.activeElement.blur();
        },
    };
};
// Stores history entries in memory for testing or other platforms like Native
const createMemorySource = (initialPathname = "/") => {
    let index = 0;
    const stack = [{ pathname: initialPathname, search: "" }];
    const states = [];

    return {
        get location() {
            return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            get entries() {
                return stack;
            },
            get index() {
                return index;
            },
            get state() {
                return states[index];
            },
            pushState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                index++;
                stack.push({ pathname, search });
                states.push(state);
            },
            replaceState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                stack[index] = { pathname, search };
                states[index] = state;
            },
        },
    };
};
// Global history uses window.history as the source if available,
// otherwise a memory history
const globalHistory = createHistory(
    canUseDOM() ? window : createMemorySource()
);
const { navigate } = globalHistory;

/* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.59.2 */

const { Object: Object_1 } = globals;
const file$3 = "node_modules\\svelte-routing\\src\\Router.svelte";

const get_default_slot_changes_1 = dirty => ({
	route: dirty & /*$activeRoute*/ 4,
	location: dirty & /*$location*/ 2
});

const get_default_slot_context_1 = ctx => ({
	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
	location: /*$location*/ ctx[1]
});

const get_default_slot_changes = dirty => ({
	route: dirty & /*$activeRoute*/ 4,
	location: dirty & /*$location*/ 2
});

const get_default_slot_context = ctx => ({
	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
	location: /*$location*/ ctx[1]
});

// (143:0) {:else}
function create_else_block(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[14],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
						get_default_slot_context_1
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(143:0) {:else}",
		ctx
	});

	return block;
}

// (134:0) {#if viewtransition}
function create_if_block(ctx) {
	let previous_key = /*$location*/ ctx[1].pathname;
	let key_block_anchor;
	let current;
	let key_block = create_key_block(ctx);

	const block = {
		c: function create() {
			key_block.c();
			key_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			key_block.m(target, anchor);
			insert_dev(target, key_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
				group_outros();
				transition_out(key_block, 1, 1, noop);
				check_outros();
				key_block = create_key_block(ctx);
				key_block.c();
				transition_in(key_block, 1);
				key_block.m(key_block_anchor.parentNode, key_block_anchor);
			} else {
				key_block.p(ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(key_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(key_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(key_block_anchor);
			key_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(134:0) {#if viewtransition}",
		ctx
	});

	return block;
}

// (135:4) {#key $location.pathname}
function create_key_block(ctx) {
	let div;
	let div_intro;
	let div_outro;
	let current;
	const default_slot_template = /*#slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			add_location(div, file$3, 135, 8, 4659);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[14],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
						get_default_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (!current) return;
				if (div_outro) div_outro.end(1);
				div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
				div_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			if (detaching && div_outro) div_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_key_block.name,
		type: "key",
		source: "(135:4) {#key $location.pathname}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*viewtransition*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let $location;
	let $routes;
	let $base;
	let $activeRoute;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Router', slots, ['default']);
	let { basepath = "/" } = $$props;
	let { url = null } = $$props;
	let { viewtransition = null } = $$props;
	let { history = globalHistory } = $$props;

	const viewtransitionFn = (node, _, direction) => {
		const vt = viewtransition(direction);
		if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
	};

	setContext(HISTORY, history);
	const locationContext = getContext(LOCATION);
	const routerContext = getContext(ROUTER);
	const routes = writable([]);
	validate_store(routes, 'routes');
	component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
	const activeRoute = writable(null);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

	// If locationContext is not set, this is the topmost Router in the tree.
	// If the `url` prop is given we force the location to it.
	const location = locationContext || writable(url ? { pathname: url } : history.location);

	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(1, $location = value));

	// If routerContext is set, the routerBase of the parent Router
	// will be the base for this Router's descendants.
	// If routerContext is not set, the path and resolved uri will both
	// have the value of the basepath prop.
	const base = routerContext
	? routerContext.routerBase
	: writable({ path: basepath, uri: basepath });

	validate_store(base, 'base');
	component_subscribe($$self, base, value => $$invalidate(13, $base = value));

	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
		// If there is no activeRoute, the routerBase will be identical to the base.
		if (!activeRoute) return base;

		const { path: basepath } = base;
		const { route, uri } = activeRoute;

		// Remove the potential /* or /*splatname from
		// the end of the child Routes relative paths.
		const path = route.default
		? basepath
		: route.path.replace(/\*.*$/, "");

		return { path, uri };
	});

	const registerRoute = route => {
		const { path: basepath } = $base;
		let { path } = route;

		// We store the original path in the _path property so we can reuse
		// it when the basepath changes. The only thing that matters is that
		// the route reference is intact, so mutation is fine.
		route._path = path;

		route.path = combinePaths(basepath, path);

		if (typeof window === "undefined") {
			// In SSR we should set the activeRoute immediately if it is a match.
			// If there are more Routes being registered after a match is found,
			// we just skip them.
			if (hasActiveRoute) return;

			const matchingRoute = pick([route], $location.pathname);

			if (matchingRoute) {
				activeRoute.set(matchingRoute);
				hasActiveRoute = true;
			}
		} else {
			routes.update(rs => [...rs, route]);
		}
	};

	const unregisterRoute = route => {
		routes.update(rs => rs.filter(r => r !== route));
	};

	let preserveScroll = false;

	if (!locationContext) {
		// The topmost Router in the tree is responsible for updating
		// the location store and supplying it through context.
		onMount(() => {
			const unlisten = history.listen(event => {
				$$invalidate(11, preserveScroll = event.preserveScroll || false);
				location.set(event.location);
			});

			return unlisten;
		});

		setContext(LOCATION, location);
	}

	setContext(ROUTER, {
		activeRoute,
		base,
		routerBase,
		registerRoute,
		unregisterRoute
	});

	const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(9, url = $$props.url);
		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
		if ('history' in $$props) $$invalidate(10, history = $$props.history);
		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		onMount,
		setContext,
		derived,
		writable,
		HISTORY,
		LOCATION,
		ROUTER,
		globalHistory,
		combinePaths,
		pick,
		basepath,
		url,
		viewtransition,
		history,
		viewtransitionFn,
		locationContext,
		routerContext,
		routes,
		activeRoute,
		hasActiveRoute,
		location,
		base,
		routerBase,
		registerRoute,
		unregisterRoute,
		preserveScroll,
		$location,
		$routes,
		$base,
		$activeRoute
	});

	$$self.$inject_state = $$props => {
		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(9, url = $$props.url);
		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
		if ('history' in $$props) $$invalidate(10, history = $$props.history);
		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$base*/ 8192) {
			// This reactive statement will update all the Routes' path when
			// the basepath changes.
			{
				const { path: basepath } = $base;
				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
			}
		}

		if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
			// This reactive statement will be run when the Router is created
			// when there are no Routes and then again the following tick, so it
			// will not find an active Route in SSR and in the browser it will only
			// pick an active Route after all Routes have been registered.
			{
				const bestMatch = pick($routes, $location.pathname);
				activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
			}
		}
	};

	return [
		viewtransition,
		$location,
		$activeRoute,
		viewtransitionFn,
		routes,
		activeRoute,
		location,
		base,
		basepath,
		url,
		history,
		preserveScroll,
		$routes,
		$base,
		$$scope,
		slots
	];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			basepath: 8,
			url: 9,
			viewtransition: 0,
			history: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$3.name
		});
	}

	get basepath() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set basepath(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get url() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set url(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewtransition() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewtransition(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get history() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set history(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

// eventsStore.js


// Define and export the eventsStore
const eventsStore = writable([]);

// Export a function to access the events data
function getEvents() {
    return eventsStore;
}

/* src\routes\TodoPage.svelte generated by Svelte v3.59.2 */
const file$2 = "src\\routes\\TodoPage.svelte";

function create_fragment$2(ctx) {
	let html;
	let head;
	let meta0;
	let t0;
	let meta1;
	let t1;
	let title;
	let t3;
	let link0;
	let t4;
	let link1;
	let t5;
	let link2;
	let t6;
	let body;
	let header;
	let div3;
	let div0;
	let img;
	let img_src_value;
	let t7;
	let div1;
	let input;
	let t8;
	let div2;
	let button;
	let svg;
	let g;
	let path;
	let t9;
	let div4;
	let ul0;
	let t10;
	let ul1;
	let t11;
	let script;
	let script_src_value;

	const block = {
		c: function create() {
			html = element("html");
			head = element("head");
			meta0 = element("meta");
			t0 = space();
			meta1 = element("meta");
			t1 = space();
			title = element("title");
			title.textContent = "ZAPLAN";
			t3 = space();
			link0 = element("link");
			t4 = space();
			link1 = element("link");
			t5 = space();
			link2 = element("link");
			t6 = space();
			body = element("body");
			header = element("header");
			div3 = element("div");
			div0 = element("div");
			img = element("img");
			t7 = space();
			div1 = element("div");
			input = element("input");
			t8 = space();
			div2 = element("div");
			button = element("button");
			svg = svg_element("svg");
			g = svg_element("g");
			path = svg_element("path");
			t9 = space();
			div4 = element("div");
			ul0 = element("ul");
			t10 = space();
			ul1 = element("ul");
			t11 = space();
			script = element("script");
			attr_dev(meta0, "charset", "UTF-8");
			add_location(meta0, file$2, 23, 4, 372);
			attr_dev(meta1, "name", "viewport");
			attr_dev(meta1, "content", "width=device-width, initial-scale=1, user-scalable=no");
			add_location(meta1, file$2, 24, 4, 400);
			add_location(title, file$2, 25, 4, 492);
			attr_dev(link0, "href", "https://fonts.googleapis.com/css?family=Roboto:400,500,700");
			attr_dev(link0, "rel", "stylesheet");
			add_location(link0, file$2, 27, 4, 551);
			attr_dev(link1, "rel", "stylesheet");
			attr_dev(link1, "type", "text/css");
			attr_dev(link1, "href", "/css/reset.min.css");
			add_location(link1, file$2, 29, 4, 672);
			attr_dev(link2, "rel", "stylesheet");
			attr_dev(link2, "type", "text/css");
			attr_dev(link2, "href", "/css/style.css");
			add_location(link2, file$2, 30, 4, 743);
			add_location(head, file$2, 22, 0, 360);
			attr_dev(img, "class", "js-profile-element");
			attr_dev(img, "id", "pPicture");
			if (!src_url_equal(img.src, img_src_value = /*profilePicture*/ ctx[0])) attr_dev(img, "src", img_src_value);
			add_location(img, file$2, 36, 16, 902);
			add_location(div0, file$2, 35, 12, 879);
			attr_dev(input, "type", "text");
			attr_dev(input, "placeholder", "Enter an activity..");
			attr_dev(input, "id", "item");
			add_location(input, file$2, 39, 16, 1026);
			add_location(div1, file$2, 38, 12, 1003);
			attr_dev(path, "class", "fill");
			attr_dev(path, "d", "M16,8c0,0.5-0.5,1-1,1H9v6c0,0.5-0.5,1-1,1s-1-0.5-1-1V9H1C0.5,9,0,8.5,0,8s0.5-1,1-1h6V1c0-0.5,0.5-1,1-1s1,0.5,1,1v6h6C15.5,7,16,7.5,16,8z");
			add_location(path, file$2, 45, 28, 1463);
			add_location(g, file$2, 44, 24, 1430);
			attr_dev(svg, "version", "1.1");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			attr_dev(svg, "x", "0px");
			attr_dev(svg, "y", "0px");
			attr_dev(svg, "viewBox", "0 0 16 16");
			set_style(svg, "enable-background", "new 0 0 16 16");
			attr_dev(svg, "xml:space", "preserve");
			add_location(svg, file$2, 43, 20, 1209);
			attr_dev(button, "id", "add");
			attr_dev(button, "class", "add-todo-button");
			add_location(button, file$2, 42, 16, 1146);
			add_location(div2, file$2, 41, 12, 1123);
			attr_dev(div3, "class", "header");
			add_location(div3, file$2, 34, 8, 845);
			add_location(header, file$2, 33, 4, 827);
			attr_dev(ul0, "class", "todo");
			attr_dev(ul0, "id", "todo");
			add_location(ul0, file$2, 55, 8, 1837);
			attr_dev(ul1, "class", "todo");
			attr_dev(ul1, "id", "completed");
			add_location(ul1, file$2, 57, 8, 1913);
			attr_dev(div4, "class", "container");
			add_location(div4, file$2, 53, 4, 1768);
			attr_dev(script, "type", "module");
			if (!src_url_equal(script.src, script_src_value = "/js/main.js")) attr_dev(script, "src", script_src_value);
			add_location(script, file$2, 61, 4, 1996);
			add_location(body, file$2, 32, 0, 815);
			add_location(html, file$2, 21, 0, 352);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, html, anchor);
			append_dev(html, head);
			append_dev(head, meta0);
			append_dev(head, t0);
			append_dev(head, meta1);
			append_dev(head, t1);
			append_dev(head, title);
			append_dev(head, t3);
			append_dev(head, link0);
			append_dev(head, t4);
			append_dev(head, link1);
			append_dev(head, t5);
			append_dev(head, link2);
			append_dev(html, t6);
			append_dev(html, body);
			append_dev(body, header);
			append_dev(header, div3);
			append_dev(div3, div0);
			append_dev(div0, img);
			append_dev(div3, t7);
			append_dev(div3, div1);
			append_dev(div1, input);
			append_dev(div3, t8);
			append_dev(div3, div2);
			append_dev(div2, button);
			append_dev(button, svg);
			append_dev(svg, g);
			append_dev(g, path);
			append_dev(body, t9);
			append_dev(body, div4);
			append_dev(div4, ul0);
			append_dev(div4, t10);
			append_dev(div4, ul1);
			append_dev(body, t11);
			append_dev(body, script);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*profilePicture*/ 1 && !src_url_equal(img.src, img_src_value = /*profilePicture*/ ctx[0])) {
				attr_dev(img, "src", img_src_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(html);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TodoPage', slots, []);
	const eventsStore = getEvents();
	let profilePicture;

	let unsubscribe = eventsStore.subscribe(value => {
		if (value.length > 0) {
			const content = JSON.parse(value[0].content);
			$$invalidate(0, profilePicture = content.picture);
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TodoPage> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		getEvents,
		eventsStore,
		profilePicture,
		unsubscribe
	});

	$$self.$inject_state = $$props => {
		if ('profilePicture' in $$props) $$invalidate(0, profilePicture = $$props.profilePicture);
		if ('unsubscribe' in $$props) unsubscribe = $$props.unsubscribe;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [profilePicture];
}

class TodoPage extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TodoPage",
			options,
			id: create_fragment$2.name
		});
	}
}

/* src\App.svelte generated by Svelte v3.59.2 */
const file$1 = "src\\App.svelte";

// (11:0) <Router>
function create_default_slot(ctx) {
	let main;
	let route0;
	let t;
	let route1;
	let current;

	route0 = new Route({
			props: { path: "/", component: /*Login*/ ctx[0] },
			$$inline: true
		});

	route1 = new Route({
			props: { path: "/todoPage", component: TodoPage },
			$$inline: true
		});

	const block = {
		c: function create() {
			main = element("main");
			create_component(route0.$$.fragment);
			t = space();
			create_component(route1.$$.fragment);
			add_location(main, file$1, 12, 2, 290);
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			mount_component(route0, main, null);
			append_dev(main, t);
			mount_component(route1, main, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const route0_changes = {};
			if (dirty & /*Login*/ 1) route0_changes.component = /*Login*/ ctx[0];
			route0.$set(route0_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(route0.$$.fragment, local);
			transition_in(route1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(route0.$$.fragment, local);
			transition_out(route1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(route0);
			destroy_component(route1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(11:0) <Router>",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let router;
	let current;

	router = new Router({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const router_changes = {};

			if (dirty & /*$$scope, Login*/ 3) {
				router_changes.$$scope = { dirty, ctx };
			}

			router.$set(router_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(router.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	let { Login } = $$props;

	$$self.$$.on_mount.push(function () {
		if (Login === undefined && !('Login' in $$props || $$self.$$.bound[$$self.$$.props['Login']])) {
			console.warn("<App> was created without expected prop 'Login'");
		}
	});

	const writable_props = ['Login'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('Login' in $$props) $$invalidate(0, Login = $$props.Login);
	};

	$$self.$capture_state = () => ({ Router, Route, TodoPage, Login });

	$$self.$inject_state = $$props => {
		if ('Login' in $$props) $$invalidate(0, Login = $$props.Login);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [Login];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { Login: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$1.name
		});
	}

	get Login() {
		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set Login(value) {
		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function number$5(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function bool$3(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
function bytes$5(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash$5(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number$5(hash.outputLen);
    number$5(hash.blockLen);
}
function exists$5(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output$5(out, instance) {
    bytes$5(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
const assert$4 = {
    number: number$5,
    bool: bool$3,
    bytes: bytes$5,
    hash: hash$5,
    exists: exists$5,
    output: output$5,
};

const crypto$4 = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated, we can just drop the import.
const u8a$4 = (a) => a instanceof Uint8Array;
// Cast array to view
const createView$4 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr$4 = (word, shift) => (word << (32 - shift)) | (word >>> shift);
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
const isLE$4 = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE$4)
    throw new Error('Non little-endian hardware is not supported');
const hexes$5 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex$5(bytes) {
    if (!u8a$4(bytes))
        throw new Error('Uint8Array expected');
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes$5[bytes[i]];
    }
    return hex;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes$4(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const len = hex.length;
    if (len % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$8(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$5(data) {
    if (typeof data === 'string')
        data = utf8ToBytes$8(data);
    if (!u8a$4(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$6(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0; // walk through each item, ensure they have proper type
    arrays.forEach((a) => {
        if (!u8a$4(a))
            throw new Error('Uint8Array expected');
        r.set(a, pad);
        pad += a.length;
    });
    return r;
}
// For runtime check if class implements interface
let Hash$4 = class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
};
function wrapConstructor$4(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes$5(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes$3(bytesLength = 32) {
    if (crypto$4 && typeof crypto$4.getRandomValues === 'function') {
        return crypto$4.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}

// Polyfill for Safari 14
function setBigUint64$4(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
let SHA2$3 = class SHA2 extends Hash$4 {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView$4(this.buffer);
    }
    update(data) {
        assert$4.exists(this);
        const { view, buffer, blockLen } = this;
        data = toBytes$5(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView$4(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        assert$4.exists(this);
        assert$4.output(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64$4(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView$4(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
};

// Choice: a ? b : c
const Chi$4 = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj$4 = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K$4 = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV$3 = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W$4 = new Uint32Array(64);
let SHA256$4 = class SHA256 extends SHA2$3 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV$3[0] | 0;
        this.B = IV$3[1] | 0;
        this.C = IV$3[2] | 0;
        this.D = IV$3[3] | 0;
        this.E = IV$3[4] | 0;
        this.F = IV$3[5] | 0;
        this.G = IV$3[6] | 0;
        this.H = IV$3[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W$4[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W$4[i - 15];
            const W2 = SHA256_W$4[i - 2];
            const s0 = rotr$4(W15, 7) ^ rotr$4(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr$4(W2, 17) ^ rotr$4(W2, 19) ^ (W2 >>> 10);
            SHA256_W$4[i] = (s1 + SHA256_W$4[i - 7] + s0 + SHA256_W$4[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr$4(E, 6) ^ rotr$4(E, 11) ^ rotr$4(E, 25);
            const T1 = (H + sigma1 + Chi$4(E, F, G) + SHA256_K$4[i] + SHA256_W$4[i]) | 0;
            const sigma0 = rotr$4(A, 2) ^ rotr$4(A, 13) ^ rotr$4(A, 22);
            const T2 = (sigma0 + Maj$4(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W$4.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
};
// Constants from https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
let SHA224$1 = class SHA224 extends SHA256$4 {
    constructor() {
        super();
        this.A = 0xc1059ed8 | 0;
        this.B = 0x367cd507 | 0;
        this.C = 0x3070dd17 | 0;
        this.D = 0xf70e5939 | 0;
        this.E = 0xffc00b31 | 0;
        this.F = 0x68581511 | 0;
        this.G = 0x64f98fa7 | 0;
        this.H = 0xbefa4fa4 | 0;
        this.outputLen = 28;
    }
};
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$4 = wrapConstructor$4(() => new SHA256$4());
wrapConstructor$4(() => new SHA224$1());

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// 100 lines of code in the file are duplicated from noble-hashes (utils).
// This is OK: `abstract` directory does not use noble-hashes.
// User may opt-in into using different hashing library. This way, noble-hashes
// won't be included into their bundle.
const _0n$d = BigInt(0);
const _1n$e = BigInt(1);
const _2n$8 = BigInt(2);
const u8a$3 = (a) => a instanceof Uint8Array;
const hexes$4 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex$4(bytes) {
    if (!u8a$3(bytes))
        throw new Error('Uint8Array expected');
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes$4[bytes[i]];
    }
    return hex;
}
function numberToHexUnpadded$2(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber$2(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    // Big Endian
    return BigInt(hex === '' ? '0' : `0x${hex}`);
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes$3(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const len = hex.length;
    if (len % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
// BE: Big Endian, LE: Little Endian
function bytesToNumberBE$2(bytes) {
    return hexToNumber$2(bytesToHex$4(bytes));
}
function bytesToNumberLE$2(bytes) {
    if (!u8a$3(bytes))
        throw new Error('Uint8Array expected');
    return hexToNumber$2(bytesToHex$4(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE$2(n, len) {
    return hexToBytes$3(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE$2(n, len) {
    return numberToBytesBE$2(n, len).reverse();
}
// Unpadded, rarely used
function numberToVarBytesBE$2(n) {
    return hexToBytes$3(numberToHexUnpadded$2(n));
}
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
function ensureBytes$3(title, hex, expectedLength) {
    let res;
    if (typeof hex === 'string') {
        try {
            res = hexToBytes$3(hex);
        }
        catch (e) {
            throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
        }
    }
    else if (u8a$3(hex)) {
        // Uint8Array.from() instead of hash.slice() because node.js Buffer
        // is instance of Uint8Array, and its slice() creates **mutable** copy
        res = Uint8Array.from(hex);
    }
    else {
        throw new Error(`${title} must be hex string or Uint8Array`);
    }
    const len = res.length;
    if (typeof expectedLength === 'number' && len !== expectedLength)
        throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
    return res;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$5(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0; // walk through each item, ensure they have proper type
    arrays.forEach((a) => {
        if (!u8a$3(a))
            throw new Error('Uint8Array expected');
        r.set(a, pad);
        pad += a.length;
    });
    return r;
}
function equalBytes$3(b1, b2) {
    // We don't care about timing attacks here
    if (b1.length !== b2.length)
        return false;
    for (let i = 0; i < b1.length; i++)
        if (b1[i] !== b2[i])
            return false;
    return true;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$7(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
// Bit operations
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 */
function bitLen$2(n) {
    let len;
    for (len = 0; n > _0n$d; n >>= _1n$e, len += 1)
        ;
    return len;
}
/**
 * Gets single bit at position.
 * NOTE: first bit position is 0 (same as arrays)
 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
 */
function bitGet$2(n, pos) {
    return (n >> BigInt(pos)) & _1n$e;
}
/**
 * Sets single bit at position.
 */
const bitSet$2 = (n, pos, value) => {
    return n | ((value ? _1n$e : _0n$d) << BigInt(pos));
};
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask$2 = (n) => (_2n$8 << BigInt(n - 1)) - _1n$e;
// DRBG
const u8n$2 = (data) => new Uint8Array(data); // creates Uint8Array
const u8fr$2 = (arr) => Uint8Array.from(arr); // another shortcut
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg$2(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== 'number' || hashLen < 2)
        throw new Error('hashLen must be a number');
    if (typeof qByteLen !== 'number' || qByteLen < 2)
        throw new Error('qByteLen must be a number');
    if (typeof hmacFn !== 'function')
        throw new Error('hmacFn must be a function');
    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
    let v = u8n$2(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
    let k = u8n$2(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
    let i = 0; // Iterations counter, will throw when over 1000
    const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
    const reseed = (seed = u8n$2()) => {
        // HMAC-DRBG reseed() function. Steps D-G
        k = h(u8fr$2([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
        v = h(); // v = hmac(k || v)
        if (seed.length === 0)
            return;
        k = h(u8fr$2([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
        v = h(); // v = hmac(k || v)
    };
    const gen = () => {
        // HMAC-DRBG generate() function
        if (i++ >= 1000)
            throw new Error('drbg: tried 1000 values');
        let len = 0;
        const out = [];
        while (len < qByteLen) {
            v = h();
            const sl = v.slice();
            out.push(sl);
            len += v.length;
        }
        return concatBytes$5(...out);
    };
    const genUntil = (seed, pred) => {
        reset();
        reseed(seed); // Steps D-G
        let res = undefined; // Step H: grind until k is in [1..n-1]
        while (!(res = pred(gen())))
            reseed();
        reset();
        return res;
    };
    return genUntil;
}
// Validating curves and fields
const validatorFns$2 = {
    bigint: (val) => typeof val === 'bigint',
    function: (val) => typeof val === 'function',
    boolean: (val) => typeof val === 'boolean',
    string: (val) => typeof val === 'string',
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === 'function' && Number.isSafeInteger(val.outputLen),
};
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
function validateObject$2(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns$2[type];
        if (typeof checkVal !== 'function')
            throw new Error(`Invalid validator "${type}", expected function`);
        const val = object[fieldName];
        if (isOptional && val === undefined)
            return;
        if (!checkVal(val, object)) {
            throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
        }
    };
    for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
    return object;
}
// validate type tests
// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
// // Should fail type-check
// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });

var ut$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bitGet: bitGet$2,
    bitLen: bitLen$2,
    bitMask: bitMask$2,
    bitSet: bitSet$2,
    bytesToHex: bytesToHex$4,
    bytesToNumberBE: bytesToNumberBE$2,
    bytesToNumberLE: bytesToNumberLE$2,
    concatBytes: concatBytes$5,
    createHmacDrbg: createHmacDrbg$2,
    ensureBytes: ensureBytes$3,
    equalBytes: equalBytes$3,
    hexToBytes: hexToBytes$3,
    hexToNumber: hexToNumber$2,
    numberToBytesBE: numberToBytesBE$2,
    numberToBytesLE: numberToBytesLE$2,
    numberToHexUnpadded: numberToHexUnpadded$2,
    numberToVarBytesBE: numberToVarBytesBE$2,
    utf8ToBytes: utf8ToBytes$7,
    validateObject: validateObject$2
});

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Utilities for modular arithmetics and finite fields
// prettier-ignore
const _0n$c = BigInt(0), _1n$d = BigInt(1), _2n$7 = BigInt(2), _3n$5 = BigInt(3);
// prettier-ignore
const _4n$2 = BigInt(4), _5n$2 = BigInt(5), _8n$2 = BigInt(8);
// prettier-ignore
BigInt(9); BigInt(16);
// Calculates a modulo b
function mod$2(a, b) {
    const result = a % b;
    return result >= _0n$c ? result : b + result;
}
/**
 * Efficiently raise num to power and do modular division.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 * @example
 * pow(2n, 6n, 11n) // 64n % 11n == 9n
 */
// TODO: use field version && remove
function pow$2(num, power, modulo) {
    if (modulo <= _0n$c || power < _0n$c)
        throw new Error('Expected power/modulo > 0');
    if (modulo === _1n$d)
        return _0n$c;
    let res = _1n$d;
    while (power > _0n$c) {
        if (power & _1n$d)
            res = (res * num) % modulo;
        num = (num * num) % modulo;
        power >>= _1n$d;
    }
    return res;
}
// Does x ^ (2 ^ power) mod p. pow2(30, 4) == 30 ^ (2 ^ 4)
function pow2$2(x, power, modulo) {
    let res = x;
    while (power-- > _0n$c) {
        res *= res;
        res %= modulo;
    }
    return res;
}
// Inverses number over modulo
function invert$2(number, modulo) {
    if (number === _0n$c || modulo <= _0n$c) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    // Euclidean GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
    let a = mod$2(number, modulo);
    let b = modulo;
    // prettier-ignore
    let x = _0n$c, u = _1n$d;
    while (a !== _0n$c) {
        // JIT applies optimization if those two lines follow each other
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        // prettier-ignore
        b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n$d)
        throw new Error('invert: does not exist');
    return mod$2(x, modulo);
}
// Tonelli-Shanks algorithm
// Paper 1: https://eprint.iacr.org/2012/685.pdf (page 12)
// Paper 2: Square Roots from 1; 24, 51, 10 to Dan Shanks
function tonelliShanks$2(P) {
    // Legendre constant: used to calculate Legendre symbol (a | p),
    // which denotes the value of a^((p-1)/2) (mod p).
    // (a | p) ≡ 1    if a is a square (mod p)
    // (a | p) ≡ -1   if a is not a square (mod p)
    // (a | p) ≡ 0    if a ≡ 0 (mod p)
    const legendreC = (P - _1n$d) / _2n$7;
    let Q, S, Z;
    // Step 1: By factoring out powers of 2 from p - 1,
    // find q and s such that p - 1 = q*(2^s) with q odd
    for (Q = P - _1n$d, S = 0; Q % _2n$7 === _0n$c; Q /= _2n$7, S++)
        ;
    // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
    for (Z = _2n$7; Z < P && pow$2(Z, legendreC, P) !== P - _1n$d; Z++)
        ;
    // Fast-path
    if (S === 1) {
        const p1div4 = (P + _1n$d) / _4n$2;
        return function tonelliFast(Fp, n) {
            const root = Fp.pow(n, p1div4);
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Slow-path
    const Q1div2 = (Q + _1n$d) / _2n$7;
    return function tonelliSlow(Fp, n) {
        // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
        if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
            throw new Error('Cannot find square root');
        let r = S;
        // TODO: will fail at Fp2/etc
        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
        let x = Fp.pow(n, Q1div2); // first guess at the square root
        let b = Fp.pow(n, Q); // first guess at the fudge factor
        while (!Fp.eql(b, Fp.ONE)) {
            if (Fp.eql(b, Fp.ZERO))
                return Fp.ZERO; // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm (4. If t = 0, return r = 0)
            // Find m such b^(2^m)==1
            let m = 1;
            for (let t2 = Fp.sqr(b); m < r; m++) {
                if (Fp.eql(t2, Fp.ONE))
                    break;
                t2 = Fp.sqr(t2); // t2 *= t2
            }
            // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift, otherwise there will be overflow
            const ge = Fp.pow(g, _1n$d << BigInt(r - m - 1)); // ge = 2^(r-m-1)
            g = Fp.sqr(ge); // g = ge * ge
            x = Fp.mul(x, ge); // x *= ge
            b = Fp.mul(b, g); // b *= g
            r = m;
        }
        return x;
    };
}
function FpSqrt$2(P) {
    // NOTE: different algorithms can give different roots, it is up to user to decide which one they want.
    // For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
    // P ≡ 3 (mod 4)
    // √n = n^((P+1)/4)
    if (P % _4n$2 === _3n$5) {
        // Not all roots possible!
        // const ORDER =
        //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
        // const NUM = 72057594037927816n;
        const p1div4 = (P + _1n$d) / _4n$2;
        return function sqrt3mod4(Fp, n) {
            const root = Fp.pow(n, p1div4);
            // Throw if root**2 != n
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
    if (P % _8n$2 === _5n$2) {
        const c1 = (P - _5n$2) / _8n$2;
        return function sqrt5mod8(Fp, n) {
            const n2 = Fp.mul(n, _2n$7);
            const v = Fp.pow(n2, c1);
            const nv = Fp.mul(n, v);
            const i = Fp.mul(Fp.mul(nv, _2n$7), v);
            const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Other cases: Tonelli-Shanks algorithm
    return tonelliShanks$2(P);
}
// prettier-ignore
const FIELD_FIELDS$2 = [
    'create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr',
    'eql', 'add', 'sub', 'mul', 'pow', 'div',
    'addN', 'subN', 'mulN', 'sqrN'
];
function validateField$2(field) {
    const initial = {
        ORDER: 'bigint',
        MASK: 'bigint',
        BYTES: 'isSafeInteger',
        BITS: 'isSafeInteger',
    };
    const opts = FIELD_FIELDS$2.reduce((map, val) => {
        map[val] = 'function';
        return map;
    }, initial);
    return validateObject$2(field, opts);
}
// Generic field functions
function FpPow$2(f, num, power) {
    // Should have same speed as pow for bigints
    // TODO: benchmark!
    if (power < _0n$c)
        throw new Error('Expected power > 0');
    if (power === _0n$c)
        return f.ONE;
    if (power === _1n$d)
        return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n$c) {
        if (power & _1n$d)
            p = f.mul(p, d);
        d = f.sqr(d);
        power >>= _1n$d;
    }
    return p;
}
// 0 is non-invertible: non-batched version will throw on 0
function FpInvertBatch$2(f, nums) {
    const tmp = new Array(nums.length);
    // Walk from first to last, multiply them by each other MOD p
    const lastMultiplied = nums.reduce((acc, num, i) => {
        if (f.is0(num))
            return acc;
        tmp[i] = acc;
        return f.mul(acc, num);
    }, f.ONE);
    // Invert last element
    const inverted = f.inv(lastMultiplied);
    // Walk from last to first, multiply them by inverted each other MOD p
    nums.reduceRight((acc, num, i) => {
        if (f.is0(num))
            return acc;
        tmp[i] = f.mul(acc, tmp[i]);
        return f.mul(acc, num);
    }, inverted);
    return tmp;
}
// CURVE.n lengths
function nLength$2(n, nBitLength) {
    // Bit size, byte size of CURVE.n
    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
}
/**
 * Initializes a galois field over prime. Non-primes are not supported for now.
 * Do not init in loop: slow. Very fragile: always run a benchmark on change.
 * Major performance gains:
 * a) non-normalized operations like mulN instead of mul
 * b) `Object.freeze`
 * c) Same object shape: never add or remove keys
 * @param ORDER prime positive bigint
 * @param bitLen how many bits the field consumes
 * @param isLE (def: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field$2(ORDER, bitLen, isLE = false, redef = {}) {
    if (ORDER <= _0n$c)
        throw new Error(`Expected Fp ORDER > 0, got ${ORDER}`);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength$2(ORDER, bitLen);
    if (BYTES > 2048)
        throw new Error('Field lengths over 2048 bytes are not supported');
    const sqrtP = FpSqrt$2(ORDER);
    const f = Object.freeze({
        ORDER,
        BITS,
        BYTES,
        MASK: bitMask$2(BITS),
        ZERO: _0n$c,
        ONE: _1n$d,
        create: (num) => mod$2(num, ORDER),
        isValid: (num) => {
            if (typeof num !== 'bigint')
                throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
            return _0n$c <= num && num < ORDER; // 0 is valid element, but it's not invertible
        },
        is0: (num) => num === _0n$c,
        isOdd: (num) => (num & _1n$d) === _1n$d,
        neg: (num) => mod$2(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod$2(num * num, ORDER),
        add: (lhs, rhs) => mod$2(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod$2(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod$2(lhs * rhs, ORDER),
        pow: (num, power) => FpPow$2(f, num, power),
        div: (lhs, rhs) => mod$2(lhs * invert$2(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert$2(num, ORDER),
        sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
        invertBatch: (lst) => FpInvertBatch$2(f, lst),
        // TODO: do we really need constant cmov?
        // We don't have const-time bigints anyway, so probably will be not very useful
        cmov: (a, b, c) => (c ? b : a),
        toBytes: (num) => (isLE ? numberToBytesLE$2(num, BYTES) : numberToBytesBE$2(num, BYTES)),
        fromBytes: (bytes) => {
            if (bytes.length !== BYTES)
                throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
            return isLE ? bytesToNumberLE$2(bytes) : bytesToNumberBE$2(bytes);
        },
    });
    return Object.freeze(f);
}
/**
 * FIPS 186 B.4.1-compliant "constant-time" private key generation utility.
 * Can take (n+8) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 40 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. curveFn.CURVE.n)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function hashToPrivateScalar$1(hash, groupOrder, isLE = false) {
    hash = ensureBytes$3('privateHash', hash);
    const hashLen = hash.length;
    const minLen = nLength$2(groupOrder).nByteLength + 8;
    if (minLen < 24 || hashLen < minLen || hashLen > 1024)
        throw new Error(`hashToPrivateScalar: expected ${minLen}-1024 bytes of input, got ${hashLen}`);
    const num = isLE ? bytesToNumberLE$2(hash) : bytesToNumberBE$2(hash);
    return mod$2(num, groupOrder - _1n$d) + _1n$d;
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Abelian group utilities
const _0n$b = BigInt(0);
const _1n$c = BigInt(1);
// Elliptic curve multiplication of Point by scalar. Fragile.
// Scalars should always be less than curve order: this should be checked inside of a curve itself.
// Creates precomputation tables for fast multiplication:
// - private scalar is split by fixed size windows of W bits
// - every window point is collected from window's table & added to accumulator
// - since windows are different, same point inside tables won't be accessed more than once per calc
// - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
// - +1 window is neccessary for wNAF
// - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
// TODO: Research returning 2d JS array of windows, instead of a single window. This would allow
// windows to be in different memory locations
function wNAF$2(c, bits) {
    const constTimeNegate = (condition, item) => {
        const neg = item.negate();
        return condition ? neg : item;
    };
    const opts = (W) => {
        const windows = Math.ceil(bits / W) + 1; // +1, because
        const windowSize = 2 ** (W - 1); // -1 because we skip zero
        return { windows, windowSize };
    };
    return {
        constTimeNegate,
        // non-const time multiplication ladder
        unsafeLadder(elm, n) {
            let p = c.ZERO;
            let d = elm;
            while (n > _0n$b) {
                if (n & _1n$c)
                    p = p.add(d);
                d = d.double();
                n >>= _1n$c;
            }
            return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(elm, W) {
            const { windows, windowSize } = opts(W);
            const points = [];
            let p = elm;
            let base = p;
            for (let window = 0; window < windows; window++) {
                base = p;
                points.push(base);
                // =1, because we skip zero
                for (let i = 1; i < windowSize; i++) {
                    base = base.add(p);
                    points.push(base);
                }
                p = base.double();
            }
            return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
            // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
            // But need to carefully remove other checks before wNAF. ORDER == bits here
            const { windows, windowSize } = opts(W);
            let p = c.ZERO;
            let f = c.BASE;
            const mask = BigInt(2 ** W - 1); // Create mask with W ones: 0b1111 for W=4 etc.
            const maxNumber = 2 ** W;
            const shiftBy = BigInt(W);
            for (let window = 0; window < windows; window++) {
                const offset = window * windowSize;
                // Extract W bits.
                let wbits = Number(n & mask);
                // Shift number by W bits.
                n >>= shiftBy;
                // If the bits are bigger than max size, we'll split those.
                // +224 => 256 - 32
                if (wbits > windowSize) {
                    wbits -= maxNumber;
                    n += _1n$c;
                }
                // This code was first written with assumption that 'f' and 'p' will never be infinity point:
                // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
                // there is negate now: it is possible that negated element from low value
                // would be the same as high element, which will create carry into next window.
                // It's not obvious how this can fail, but still worth investigating later.
                // Check if we're onto Zero point.
                // Add random point inside current window to f.
                const offset1 = offset;
                const offset2 = offset + Math.abs(wbits) - 1; // -1 because we skip zero
                const cond1 = window % 2 !== 0;
                const cond2 = wbits < 0;
                if (wbits === 0) {
                    // The most important part for const-time getPublicKey
                    f = f.add(constTimeNegate(cond1, precomputes[offset1]));
                }
                else {
                    p = p.add(constTimeNegate(cond2, precomputes[offset2]));
                }
            }
            // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
            // Even if the variable is still unused, there are some checks which will
            // throw an exception, so compiler needs to prove they won't happen, which is hard.
            // At this point there is a way to F be infinity-point even if p is not,
            // which makes it less const-time: around 1 bigint multiply.
            return { p, f };
        },
        wNAFCached(P, precomputesMap, n, transform) {
            // @ts-ignore
            const W = P._WINDOW_SIZE || 1;
            // Calculate precomputes on a first run, reuse them after
            let comp = precomputesMap.get(P);
            if (!comp) {
                comp = this.precomputeWindow(P, W);
                if (W !== 1) {
                    precomputesMap.set(P, transform(comp));
                }
            }
            return this.wNAF(W, comp, n);
        },
    };
}
function validateBasic$2(curve) {
    validateField$2(curve.Fp);
    validateObject$2(curve, {
        n: 'bigint',
        h: 'bigint',
        Gx: 'field',
        Gy: 'field',
    }, {
        nBitLength: 'isSafeInteger',
        nByteLength: 'isSafeInteger',
    });
    // Set defaults
    return Object.freeze({
        ...nLength$2(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER },
    });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Short Weierstrass curve. The formula is: y² = x³ + ax + b
function validatePointOpts$2(curve) {
    const opts = validateBasic$2(curve);
    validateObject$2(opts, {
        a: 'field',
        b: 'field',
    }, {
        allowedPrivateKeyLengths: 'array',
        wrapPrivateKey: 'boolean',
        isTorsionFree: 'function',
        clearCofactor: 'function',
        allowInfinityPoint: 'boolean',
        fromBytes: 'function',
        toBytes: 'function',
    });
    const { endo, Fp, a } = opts;
    if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
            throw new Error('Endomorphism can only be defined for Koblitz curves that have a=0');
        }
        if (typeof endo !== 'object' ||
            typeof endo.beta !== 'bigint' ||
            typeof endo.splitScalar !== 'function') {
            throw new Error('Expected endomorphism with beta: bigint and splitScalar: function');
        }
    }
    return Object.freeze({ ...opts });
}
// ASN.1 DER encoding utilities
const { bytesToNumberBE: b2n$2, hexToBytes: h2b$2 } = ut$2;
const DER$2 = {
    // asn.1 DER encoding utils
    Err: class DERErr extends Error {
        constructor(m = '') {
            super(m);
        }
    },
    _parseInt(data) {
        const { Err: E } = DER$2;
        if (data.length < 2 || data[0] !== 0x02)
            throw new E('Invalid signature integer tag');
        const len = data[1];
        const res = data.subarray(2, len + 2);
        if (!len || res.length !== len)
            throw new E('Invalid signature integer: wrong length');
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        if (res[0] & 0b10000000)
            throw new E('Invalid signature integer: negative');
        if (res[0] === 0x00 && !(res[1] & 0b10000000))
            throw new E('Invalid signature integer: unnecessary leading zero');
        return { d: b2n$2(res), l: data.subarray(len + 2) }; // d is data, l is left
    },
    toSig(hex) {
        // parse DER signature
        const { Err: E } = DER$2;
        const data = typeof hex === 'string' ? h2b$2(hex) : hex;
        if (!(data instanceof Uint8Array))
            throw new Error('ui8a expected');
        let l = data.length;
        if (l < 2 || data[0] != 0x30)
            throw new E('Invalid signature tag');
        if (data[1] !== l - 2)
            throw new E('Invalid signature: incorrect length');
        const { d: r, l: sBytes } = DER$2._parseInt(data.subarray(2));
        const { d: s, l: rBytesLeft } = DER$2._parseInt(sBytes);
        if (rBytesLeft.length)
            throw new E('Invalid signature: left bytes after parsing');
        return { r, s };
    },
    hexFromSig(sig) {
        // Add leading zero if first byte has negative bit enabled. More details in '_parseInt'
        const slice = (s) => (Number.parseInt(s[0], 16) & 0b1000 ? '00' + s : s);
        const h = (num) => {
            const hex = num.toString(16);
            return hex.length & 1 ? `0${hex}` : hex;
        };
        const s = slice(h(sig.s));
        const r = slice(h(sig.r));
        const shl = s.length / 2;
        const rhl = r.length / 2;
        const sl = h(shl);
        const rl = h(rhl);
        return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
    },
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n$a = BigInt(0), _1n$b = BigInt(1); BigInt(2); const _3n$4 = BigInt(3); BigInt(4);
function weierstrassPoints$2(opts) {
    const CURVE = validatePointOpts$2(opts);
    const { Fp } = CURVE; // All curves has same field / group length as for now, but they can differ
    const toBytes = CURVE.toBytes ||
        ((c, point, isCompressed) => {
            const a = point.toAffine();
            return concatBytes$5(Uint8Array.from([0x04]), Fp.toBytes(a.x), Fp.toBytes(a.y));
        });
    const fromBytes = CURVE.fromBytes ||
        ((bytes) => {
            // const head = bytes[0];
            const tail = bytes.subarray(1);
            // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
        });
    /**
     * y² = x³ + ax + b: Short weierstrass curve formula
     * @returns y²
     */
    function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x); // x * x
        const x3 = Fp.mul(x2, x); // x2 * x
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
    }
    // Validate whether the passed curve params are valid.
    // We check if curve equation works for generator point.
    // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
    // ProjectivePoint class has not been initialized yet.
    if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error('bad generator point: equation left != right');
    // Valid group elements reside in range 1..n-1
    function isWithinCurveOrder(num) {
        return typeof num === 'bigint' && _0n$a < num && num < CURVE.n;
    }
    function assertGE(num) {
        if (!isWithinCurveOrder(num))
            throw new Error('Expected valid bigint: 0 < bigint < curve.n');
    }
    // Validates if priv key is valid and converts it to bigint.
    // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
    function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
        if (lengths && typeof key !== 'bigint') {
            if (key instanceof Uint8Array)
                key = bytesToHex$4(key);
            // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
            if (typeof key !== 'string' || !lengths.includes(key.length))
                throw new Error('Invalid key');
            key = key.padStart(nByteLength * 2, '0');
        }
        let num;
        try {
            num =
                typeof key === 'bigint'
                    ? key
                    : bytesToNumberBE$2(ensureBytes$3('private key', key, nByteLength));
        }
        catch (error) {
            throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
        }
        if (wrapPrivateKey)
            num = mod$2(num, n); // disabled by default, enabled for BLS
        assertGE(num); // num in range [1..N-1]
        return num;
    }
    const pointPrecomputes = new Map();
    function assertPrjPoint(other) {
        if (!(other instanceof Point))
            throw new Error('ProjectivePoint expected');
    }
    /**
     * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
     * Default Point works in 2d / affine coordinates: (x, y)
     * We're doing calculations in projective, because its operations don't require costly inversion.
     */
    class Point {
        constructor(px, py, pz) {
            this.px = px;
            this.py = py;
            this.pz = pz;
            if (px == null || !Fp.isValid(px))
                throw new Error('x required');
            if (py == null || !Fp.isValid(py))
                throw new Error('y required');
            if (pz == null || !Fp.isValid(pz))
                throw new Error('z required');
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
            const { x, y } = p || {};
            if (!p || !Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('invalid affine point');
            if (p instanceof Point)
                throw new Error('projective point not allowed');
            const is0 = (i) => Fp.eql(i, Fp.ZERO);
            // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
            if (is0(x) && is0(y))
                return Point.ZERO;
            return new Point(x, y, Fp.ONE);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
            const toInv = Fp.invertBatch(points.map((p) => p.pz));
            return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex) {
            const P = Point.fromAffine(fromBytes(ensureBytes$3('pointHex', hex)));
            P.assertValidity();
            return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
            return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
            this._WINDOW_SIZE = windowSize;
            pointPrecomputes.delete(this);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
            // Zero is valid point too!
            if (this.is0()) {
                if (CURVE.allowInfinityPoint)
                    return;
                throw new Error('bad point: ZERO');
            }
            // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
            const { x, y } = this.toAffine();
            // Check if x, y are valid field elements
            if (!Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('bad point: x or y not FE');
            const left = Fp.sqr(y); // y²
            const right = weierstrassEquation(x); // x³ + ax + b
            if (!Fp.eql(left, right))
                throw new Error('bad point: equation left != right');
            if (!this.isTorsionFree())
                throw new Error('bad point: not in prime-order subgroup');
        }
        hasEvenY() {
            const { y } = this.toAffine();
            if (Fp.isOdd)
                return !Fp.isOdd(y);
            throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
            assertPrjPoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
            return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
            return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
            const { a, b } = CURVE;
            const b3 = Fp.mul(b, _3n$4);
            const { px: X1, py: Y1, pz: Z1 } = this;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            let t0 = Fp.mul(X1, X1); // step 1
            let t1 = Fp.mul(Y1, Y1);
            let t2 = Fp.mul(Z1, Z1);
            let t3 = Fp.mul(X1, Y1);
            t3 = Fp.add(t3, t3); // step 5
            Z3 = Fp.mul(X1, Z1);
            Z3 = Fp.add(Z3, Z3);
            X3 = Fp.mul(a, Z3);
            Y3 = Fp.mul(b3, t2);
            Y3 = Fp.add(X3, Y3); // step 10
            X3 = Fp.sub(t1, Y3);
            Y3 = Fp.add(t1, Y3);
            Y3 = Fp.mul(X3, Y3);
            X3 = Fp.mul(t3, X3);
            Z3 = Fp.mul(b3, Z3); // step 15
            t2 = Fp.mul(a, t2);
            t3 = Fp.sub(t0, t2);
            t3 = Fp.mul(a, t3);
            t3 = Fp.add(t3, Z3);
            Z3 = Fp.add(t0, t0); // step 20
            t0 = Fp.add(Z3, t0);
            t0 = Fp.add(t0, t2);
            t0 = Fp.mul(t0, t3);
            Y3 = Fp.add(Y3, t0);
            t2 = Fp.mul(Y1, Z1); // step 25
            t2 = Fp.add(t2, t2);
            t0 = Fp.mul(t2, t3);
            X3 = Fp.sub(X3, t0);
            Z3 = Fp.mul(t2, t1);
            Z3 = Fp.add(Z3, Z3); // step 30
            Z3 = Fp.add(Z3, Z3);
            return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
            assertPrjPoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            const a = CURVE.a;
            const b3 = Fp.mul(CURVE.b, _3n$4);
            let t0 = Fp.mul(X1, X2); // step 1
            let t1 = Fp.mul(Y1, Y2);
            let t2 = Fp.mul(Z1, Z2);
            let t3 = Fp.add(X1, Y1);
            let t4 = Fp.add(X2, Y2); // step 5
            t3 = Fp.mul(t3, t4);
            t4 = Fp.add(t0, t1);
            t3 = Fp.sub(t3, t4);
            t4 = Fp.add(X1, Z1);
            let t5 = Fp.add(X2, Z2); // step 10
            t4 = Fp.mul(t4, t5);
            t5 = Fp.add(t0, t2);
            t4 = Fp.sub(t4, t5);
            t5 = Fp.add(Y1, Z1);
            X3 = Fp.add(Y2, Z2); // step 15
            t5 = Fp.mul(t5, X3);
            X3 = Fp.add(t1, t2);
            t5 = Fp.sub(t5, X3);
            Z3 = Fp.mul(a, t4);
            X3 = Fp.mul(b3, t2); // step 20
            Z3 = Fp.add(X3, Z3);
            X3 = Fp.sub(t1, Z3);
            Z3 = Fp.add(t1, Z3);
            Y3 = Fp.mul(X3, Z3);
            t1 = Fp.add(t0, t0); // step 25
            t1 = Fp.add(t1, t0);
            t2 = Fp.mul(a, t2);
            t4 = Fp.mul(b3, t4);
            t1 = Fp.add(t1, t2);
            t2 = Fp.sub(t0, t2); // step 30
            t2 = Fp.mul(a, t2);
            t4 = Fp.add(t4, t2);
            t0 = Fp.mul(t1, t4);
            Y3 = Fp.add(Y3, t0);
            t0 = Fp.mul(t5, t4); // step 35
            X3 = Fp.mul(t3, X3);
            X3 = Fp.sub(X3, t0);
            t0 = Fp.mul(t3, t1);
            Z3 = Fp.mul(t5, Z3);
            Z3 = Fp.add(Z3, t0); // step 40
            return new Point(X3, Y3, Z3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        wNAF(n) {
            return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
                const toInv = Fp.invertBatch(comp.map((p) => p.pz));
                return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
            });
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(n) {
            const I = Point.ZERO;
            if (n === _0n$a)
                return I;
            assertGE(n); // Will throw on 0
            if (n === _1n$b)
                return this;
            const { endo } = CURVE;
            if (!endo)
                return wnaf.unsafeLadder(this, n);
            // Apply endomorphism
            let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
            let k1p = I;
            let k2p = I;
            let d = this;
            while (k1 > _0n$a || k2 > _0n$a) {
                if (k1 & _1n$b)
                    k1p = k1p.add(d);
                if (k2 & _1n$b)
                    k2p = k2p.add(d);
                d = d.double();
                k1 >>= _1n$b;
                k2 >>= _1n$b;
            }
            if (k1neg)
                k1p = k1p.negate();
            if (k2neg)
                k2p = k2p.negate();
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
            assertGE(scalar);
            let n = scalar;
            let point, fake; // Fake point is used to const-time mult
            const { endo } = CURVE;
            if (endo) {
                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
                let { p: k1p, f: f1p } = this.wNAF(k1);
                let { p: k2p, f: f2p } = this.wNAF(k2);
                k1p = wnaf.constTimeNegate(k1neg, k1p);
                k2p = wnaf.constTimeNegate(k2neg, k2p);
                k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
                point = k1p.add(k2p);
                fake = f1p.add(f2p);
            }
            else {
                const { p, f } = this.wNAF(n);
                point = p;
                fake = f;
            }
            // Normalize `z` for both points, but return only real one
            return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
            const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
            const mul = (P, a // Select faster multiply() method
            ) => (a === _0n$a || a === _1n$b || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a));
            const sum = mul(this, a).add(mul(Q, b));
            return sum.is0() ? undefined : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
            const { px: x, py: y, pz: z } = this;
            const is0 = this.is0();
            // If invZ was 0, we return zero point. However we still want to execute
            // all operations, so we replace invZ with a random number, 1.
            if (iz == null)
                iz = is0 ? Fp.ONE : Fp.inv(z);
            const ax = Fp.mul(x, iz);
            const ay = Fp.mul(y, iz);
            const zz = Fp.mul(z, iz);
            if (is0)
                return { x: Fp.ZERO, y: Fp.ZERO };
            if (!Fp.eql(zz, Fp.ONE))
                throw new Error('invZ was invalid');
            return { x: ax, y: ay };
        }
        isTorsionFree() {
            const { h: cofactor, isTorsionFree } = CURVE;
            if (cofactor === _1n$b)
                return true; // No subgroups, always torsion-free
            if (isTorsionFree)
                return isTorsionFree(Point, this);
            throw new Error('isTorsionFree() has not been declared for the elliptic curve');
        }
        clearCofactor() {
            const { h: cofactor, clearCofactor } = CURVE;
            if (cofactor === _1n$b)
                return this; // Fast-path
            if (clearCofactor)
                return clearCofactor(Point, this);
            return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
            this.assertValidity();
            return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
            return bytesToHex$4(this.toRawBytes(isCompressed));
        }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const _bits = CURVE.nBitLength;
    const wnaf = wNAF$2(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
    // Validate if generator point is on curve
    return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder,
    };
}
function validateOpts$2(curve) {
    const opts = validateBasic$2(curve);
    validateObject$2(opts, {
        hash: 'hash',
        hmac: 'function',
        randomBytes: 'function',
    }, {
        bits2int: 'function',
        bits2int_modN: 'function',
        lowS: 'boolean',
    });
    return Object.freeze({ lowS: true, ...opts });
}
function weierstrass$2(curveDef) {
    const CURVE = validateOpts$2(curveDef);
    const { Fp, n: CURVE_ORDER } = CURVE;
    const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
    const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
    function isValidFieldElement(num) {
        return _0n$a < num && num < Fp.ORDER; // 0 is banned since it's not invertible FE
    }
    function modN(a) {
        return mod$2(a, CURVE_ORDER);
    }
    function invN(a) {
        return invert$2(a, CURVE_ORDER);
    }
    const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder, } = weierstrassPoints$2({
        ...CURVE,
        toBytes(c, point, isCompressed) {
            const a = point.toAffine();
            const x = Fp.toBytes(a.x);
            const cat = concatBytes$5;
            if (isCompressed) {
                return cat(Uint8Array.from([point.hasEvenY() ? 0x02 : 0x03]), x);
            }
            else {
                return cat(Uint8Array.from([0x04]), x, Fp.toBytes(a.y));
            }
        },
        fromBytes(bytes) {
            const len = bytes.length;
            const head = bytes[0];
            const tail = bytes.subarray(1);
            // this.assertValidity() is done inside of fromHex
            if (len === compressedLen && (head === 0x02 || head === 0x03)) {
                const x = bytesToNumberBE$2(tail);
                if (!isValidFieldElement(x))
                    throw new Error('Point is not on curve');
                const y2 = weierstrassEquation(x); // y² = x³ + ax + b
                let y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
                const isYOdd = (y & _1n$b) === _1n$b;
                // ECDSA
                const isHeadOdd = (head & 1) === 1;
                if (isHeadOdd !== isYOdd)
                    y = Fp.neg(y);
                return { x, y };
            }
            else if (len === uncompressedLen && head === 0x04) {
                const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
                const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
                return { x, y };
            }
            else {
                throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
            }
        },
    });
    const numToNByteStr = (num) => bytesToHex$4(numberToBytesBE$2(num, CURVE.nByteLength));
    function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n$b;
        return number > HALF;
    }
    function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    // slice bytes num
    const slcNum = (b, from, to) => bytesToNumberBE$2(b.slice(from, to));
    /**
     * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
     */
    class Signature {
        constructor(r, s, recovery) {
            this.r = r;
            this.s = s;
            this.recovery = recovery;
            this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
            const l = CURVE.nByteLength;
            hex = ensureBytes$3('compactSignature', hex, l * 2);
            return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
            const { r, s } = DER$2.toSig(ensureBytes$3('DER', hex));
            return new Signature(r, s);
        }
        assertValidity() {
            // can use assertGE here
            if (!isWithinCurveOrder(this.r))
                throw new Error('r must be 0 < r < CURVE.n');
            if (!isWithinCurveOrder(this.s))
                throw new Error('s must be 0 < s < CURVE.n');
        }
        addRecoveryBit(recovery) {
            return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
            const { r, s, recovery: rec } = this;
            const h = bits2int_modN(ensureBytes$3('msgHash', msgHash)); // Truncate hash
            if (rec == null || ![0, 1, 2, 3].includes(rec))
                throw new Error('recovery id invalid');
            const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
            if (radj >= Fp.ORDER)
                throw new Error('recovery id 2 or 3 invalid');
            const prefix = (rec & 1) === 0 ? '02' : '03';
            const R = Point.fromHex(prefix + numToNByteStr(radj));
            const ir = invN(radj); // r^-1
            const u1 = modN(-h * ir); // -hr^-1
            const u2 = modN(s * ir); // sr^-1
            const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
            if (!Q)
                throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
            Q.assertValidity();
            return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
            return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
            return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
            return hexToBytes$3(this.toDERHex());
        }
        toDERHex() {
            return DER$2.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
            return hexToBytes$3(this.toCompactHex());
        }
        toCompactHex() {
            return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
    }
    const utils = {
        isValidPrivateKey(privateKey) {
            try {
                normPrivateKeyToScalar(privateKey);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        normPrivateKeyToScalar: normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size (nBitLength+64)
         * as per FIPS 186 B.4.1 with modulo bias being neglible.
         */
        randomPrivateKey: () => {
            const rand = CURVE.randomBytes(Fp.BYTES + 8);
            const num = hashToPrivateScalar$1(rand, CURVE_ORDER);
            return numberToBytesBE$2(num, CURVE.nByteLength);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
            point._setWindowSize(windowSize);
            point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
            return point;
        },
    };
    /**
     * Computes public key for a private key. Checks for validity of the private key.
     * @param privateKey private key
     * @param isCompressed whether to return compact (default), or full key
     * @returns Public key, full when isCompressed=false; short when isCompressed=true
     */
    function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    /**
     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
     */
    function isProbPub(item) {
        const arr = item instanceof Uint8Array;
        const str = typeof item === 'string';
        const len = (arr || str) && item.length;
        if (arr)
            return len === compressedLen || len === uncompressedLen;
        if (str)
            return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
            return true;
        return false;
    }
    /**
     * ECDH (Elliptic Curve Diffie Hellman).
     * Computes shared public key from private key and public key.
     * Checks: 1) private key validity 2) shared key is on-curve.
     * Does NOT hash the result.
     * @param privateA private key
     * @param publicB different public key
     * @param isCompressed whether to return compact (default), or full key
     * @returns shared public key
     */
    function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
            throw new Error('first arg must be private key');
        if (!isProbPub(publicB))
            throw new Error('second arg must be public key');
        const b = Point.fromHex(publicB); // check for being on-curve
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
    const bits2int = CURVE.bits2int ||
        function (bytes) {
            // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
            // for some cases, since bytes.length * 8 is not actual bitLength.
            const num = bytesToNumberBE$2(bytes); // check for == u8 done here
            const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
            return delta > 0 ? num >> BigInt(delta) : num;
        };
    const bits2int_modN = CURVE.bits2int_modN ||
        function (bytes) {
            return modN(bits2int(bytes)); // can't use bytesToNumberBE here
        };
    // NOTE: pads output with zero as per spec
    const ORDER_MASK = bitMask$2(CURVE.nBitLength);
    /**
     * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
     */
    function int2octets(num) {
        if (typeof num !== 'bigint')
            throw new Error('bigint expected');
        if (!(_0n$a <= num && num < ORDER_MASK))
            throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
        // works with order, can have different size than numToField!
        return numberToBytesBE$2(num, CURVE.nByteLength);
    }
    // Steps A, D of RFC6979 3.2
    // Creates RFC6979 seed; converts msg/privKey to numbers.
    // Used only in sign, not in verify.
    // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order, this will be wrong at least for P521.
    // Also it can be bigger for P224 + SHA256
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (['recovered', 'canonical'].some((k) => k in opts))
            throw new Error('sign() legacy options not supported');
        const { hash, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts; // generates low-s sigs by default
        if (lowS == null)
            lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
        msgHash = ensureBytes$3('msgHash', msgHash);
        if (prehash)
            msgHash = ensureBytes$3('prehashed msgHash', hash(msgHash));
        // We can't later call bits2octets, since nested bits2int is broken for curves
        // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
        const seedArgs = [int2octets(d), int2octets(h1int)];
        // extraEntropy. RFC6979 3.6: additional k' (optional).
        if (ent != null) {
            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
            const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
            seedArgs.push(ensureBytes$3('extraEntropy', e, Fp.BYTES)); // check for being of size BYTES
        }
        const seed = concatBytes$5(...seedArgs); // Step D of RFC6979 3.2
        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
        // Converts signature params into point w r/s, checks result for validity.
        function k2sig(kBytes) {
            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
            const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
            if (!isWithinCurveOrder(k))
                return; // Important: all mod() calls here must be done over N
            const ik = invN(k); // k^-1 mod n
            const q = Point.BASE.multiply(k).toAffine(); // q = Gk
            const r = modN(q.x); // r = q.x mod n
            if (r === _0n$a)
                return;
            // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
            // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
            // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
            const s = modN(ik * modN(m + r * d)); // Not using blinding here
            if (s === _0n$a)
                return;
            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$b); // recovery bit (2 or 3, when q.x > n)
            let normS = s;
            if (lowS && isBiggerThanHalfOrder(s)) {
                normS = normalizeS(s); // if lowS was passed, ensure s is always
                recovery ^= 1; // // in the bottom half of N
            }
            return new Signature(r, normS, recovery); // use normS, not s
        }
        return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
    /**
     * Signs message hash with a private key.
     * ```
     * sign(m, d, k) where
     *   (x, y) = G × k
     *   r = x mod n
     *   s = (m + dr)/k mod n
     * ```
     * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
     * @param privKey private key
     * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
     * @returns signature with recovery param
     */
    function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
        const C = CURVE;
        const drbg = createHmacDrbg$2(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig); // Steps B, C, D, E, F, G
    }
    // Enable precomputes. Slows down first publicKey computation by 20ms.
    Point.BASE._setWindowSize(8);
    // utils.precompute(8, ProjectivePoint.BASE)
    /**
     * Verifies a signature against message hash and public key.
     * Rejects lowS signatures by default: to override,
     * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
     *
     * ```
     * verify(r, s, h, P) where
     *   U1 = hs^-1 mod n
     *   U2 = rs^-1 mod n
     *   R = U1⋅G - U2⋅P
     *   mod(R.x, n) == r
     * ```
     */
    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        const sg = signature;
        msgHash = ensureBytes$3('msgHash', msgHash);
        publicKey = ensureBytes$3('publicKey', publicKey);
        if ('strict' in opts)
            throw new Error('options.strict was renamed to lowS');
        const { lowS, prehash } = opts;
        let _sig = undefined;
        let P;
        try {
            if (typeof sg === 'string' || sg instanceof Uint8Array) {
                // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
                // Since DER can also be 2*nByteLength bytes, we check for it first.
                try {
                    _sig = Signature.fromDER(sg);
                }
                catch (derError) {
                    if (!(derError instanceof DER$2.Err))
                        throw derError;
                    _sig = Signature.fromCompact(sg);
                }
            }
            else if (typeof sg === 'object' && typeof sg.r === 'bigint' && typeof sg.s === 'bigint') {
                const { r, s } = sg;
                _sig = new Signature(r, s);
            }
            else {
                throw new Error('PARSE');
            }
            P = Point.fromHex(publicKey);
        }
        catch (error) {
            if (error.message === 'PARSE')
                throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
            return false;
        }
        if (lowS && _sig.hasHighS())
            return false;
        if (prehash)
            msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
        const is = invN(s); // s^-1
        const u1 = modN(h * is); // u1 = hs^-1 mod n
        const u2 = modN(r * is); // u2 = rs^-1 mod n
        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
        if (!R)
            return false;
        const v = modN(R.x);
        return v === r;
    }
    return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils,
    };
}

// HMAC (RFC 2104)
let HMAC$4 = class HMAC extends Hash$4 {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        assert$4.hash(hash);
        const key = toBytes$5(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        assert$4.exists(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        assert$4.exists(this);
        assert$4.bytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
};
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac$4 = (hash, key, message) => new HMAC$4(hash, key).update(message).digest();
hmac$4.create = (hash, key) => new HMAC$4(hash, key);

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// connects noble-curves to noble-hashes
function getHash$2(hash) {
    return {
        hash,
        hmac: (key, ...msgs) => hmac$4(hash, key, concatBytes$6(...msgs)),
        randomBytes: randomBytes$3,
    };
}
function createCurve$2(curveDef, defHash) {
    const create = (hash) => weierstrass$2({ ...curveDef, ...getHash$2(hash) });
    return Object.freeze({ ...create(defHash), create });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1P$2 = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const secp256k1N$2 = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const _1n$a = BigInt(1);
const _2n$6 = BigInt(2);
const divNearest$2 = (a, b) => (a + b / _2n$6) / b;
/**
 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
 */
function sqrtMod$2(y) {
    const P = secp256k1P$2;
    // prettier-ignore
    const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    // prettier-ignore
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = (y * y * y) % P; // x^3, 11
    const b3 = (b2 * b2 * y) % P; // x^7
    const b6 = (pow2$2(b3, _3n, P) * b3) % P;
    const b9 = (pow2$2(b6, _3n, P) * b3) % P;
    const b11 = (pow2$2(b9, _2n$6, P) * b2) % P;
    const b22 = (pow2$2(b11, _11n, P) * b11) % P;
    const b44 = (pow2$2(b22, _22n, P) * b22) % P;
    const b88 = (pow2$2(b44, _44n, P) * b44) % P;
    const b176 = (pow2$2(b88, _88n, P) * b88) % P;
    const b220 = (pow2$2(b176, _44n, P) * b44) % P;
    const b223 = (pow2$2(b220, _3n, P) * b3) % P;
    const t1 = (pow2$2(b223, _23n, P) * b22) % P;
    const t2 = (pow2$2(t1, _6n, P) * b2) % P;
    const root = pow2$2(t2, _2n$6, P);
    if (!Fp$2.eql(Fp$2.sqr(root), y))
        throw new Error('Cannot find square root');
    return root;
}
const Fp$2 = Field$2(secp256k1P$2, undefined, undefined, { sqrt: sqrtMod$2 });
const secp256k1$2 = createCurve$2({
    a: BigInt(0),
    b: BigInt(7),
    Fp: Fp$2,
    n: secp256k1N$2,
    // Base point (x, y) aka generator point
    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
    h: BigInt(1),
    lowS: true,
    /**
     * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
     * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
     * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
     * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
     */
    endo: {
        beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
        splitScalar: (k) => {
            const n = secp256k1N$2;
            const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
            const b1 = -_1n$a * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
            const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
            const b2 = a1;
            const POW_2_128 = BigInt('0x100000000000000000000000000000000'); // (2n**128n).toString(16)
            const c1 = divNearest$2(b2 * k, n);
            const c2 = divNearest$2(-b1 * k, n);
            let k1 = mod$2(k - c1 * a1 - c2 * a2, n);
            let k2 = mod$2(-c1 * b1 - c2 * b2, n);
            const k1neg = k1 > POW_2_128;
            const k2neg = k2 > POW_2_128;
            if (k1neg)
                k1 = n - k1;
            if (k2neg)
                k2 = n - k2;
            if (k1 > POW_2_128 || k2 > POW_2_128) {
                throw new Error('splitScalar: Endomorphism failed, k=' + k);
            }
            return { k1neg, k1, k2neg, k2 };
        },
    },
}, sha256$4);
// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
const _0n$9 = BigInt(0);
const fe$1 = (x) => typeof x === 'bigint' && _0n$9 < x && x < secp256k1P$2;
const ge$1 = (x) => typeof x === 'bigint' && _0n$9 < x && x < secp256k1N$2;
/** An object mapping tags to their tagged hash prefix of [SHA256(tag) | SHA256(tag)] */
const TAGGED_HASH_PREFIXES$1 = {};
function taggedHash$1(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES$1[tag];
    if (tagP === undefined) {
        const tagH = sha256$4(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = concatBytes$5(tagH, tagH);
        TAGGED_HASH_PREFIXES$1[tag] = tagP;
    }
    return sha256$4(concatBytes$5(tagP, ...messages));
}
// ECDSA compact points are 33-byte. Schnorr is 32: we strip first byte 0x02 or 0x03
const pointToBytes$1 = (point) => point.toRawBytes(true).slice(1);
const numTo32b$1 = (n) => numberToBytesBE$2(n, 32);
const modP$1 = (x) => mod$2(x, secp256k1P$2);
const modN$1 = (x) => mod$2(x, secp256k1N$2);
const Point$2 = secp256k1$2.ProjectivePoint;
const GmulAdd$1 = (Q, a, b) => Point$2.BASE.multiplyAndAddUnsafe(Q, a, b);
// Calculate point, scalar and bytes
function schnorrGetExtPubKey$1(priv) {
    let d_ = secp256k1$2.utils.normPrivateKeyToScalar(priv); // same method executed in fromPrivateKey
    let p = Point$2.fromPrivateKey(d_); // P = d'⋅G; 0 < d' < n check is done inside
    const scalar = p.hasEvenY() ? d_ : modN$1(-d_);
    return { scalar: scalar, bytes: pointToBytes$1(p) };
}
/**
 * lift_x from BIP340. Convert 32-byte x coordinate to elliptic curve point.
 * @returns valid point checked for being on-curve
 */
function lift_x$1(x) {
    if (!fe$1(x))
        throw new Error('bad x: need 0 < x < p'); // Fail if x ≥ p.
    const xx = modP$1(x * x);
    const c = modP$1(xx * x + BigInt(7)); // Let c = x³ + 7 mod p.
    let y = sqrtMod$2(c); // Let y = c^(p+1)/4 mod p.
    if (y % _2n$6 !== _0n$9)
        y = modP$1(-y); // Return the unique point P such that x(P) = x and
    const p = new Point$2(x, y, _1n$a); // y(P) = y if y mod 2 = 0 or y(P) = p-y otherwise.
    p.assertValidity();
    return p;
}
/**
 * Create tagged hash, convert it to bigint, reduce modulo-n.
 */
function challenge$1(...args) {
    return modN$1(bytesToNumberBE$2(taggedHash$1('BIP0340/challenge', ...args)));
}
/**
 * Schnorr public key is just `x` coordinate of Point as per BIP340.
 */
function schnorrGetPublicKey$1(privateKey) {
    return schnorrGetExtPubKey$1(privateKey).bytes; // d'=int(sk). Fail if d'=0 or d'≥n. Ret bytes(d'⋅G)
}
/**
 * Creates Schnorr signature as per BIP340. Verifies itself before returning anything.
 * auxRand is optional and is not the sole source of k generation: bad CSPRNG won't be dangerous.
 */
function schnorrSign$1(message, privateKey, auxRand = randomBytes$3(32)) {
    const m = ensureBytes$3('message', message);
    const { bytes: px, scalar: d } = schnorrGetExtPubKey$1(privateKey); // checks for isWithinCurveOrder
    const a = ensureBytes$3('auxRand', auxRand, 32); // Auxiliary random data a: a 32-byte array
    const t = numTo32b$1(d ^ bytesToNumberBE$2(taggedHash$1('BIP0340/aux', a))); // Let t be the byte-wise xor of bytes(d) and hash/aux(a)
    const rand = taggedHash$1('BIP0340/nonce', t, px, m); // Let rand = hash/nonce(t || bytes(P) || m)
    const k_ = modN$1(bytesToNumberBE$2(rand)); // Let k' = int(rand) mod n
    if (k_ === _0n$9)
        throw new Error('sign failed: k is zero'); // Fail if k' = 0.
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey$1(k_); // Let R = k'⋅G.
    const e = challenge$1(rx, px, m); // Let e = int(hash/challenge(bytes(R) || bytes(P) || m)) mod n.
    const sig = new Uint8Array(64); // Let sig = bytes(R) || bytes((k + ed) mod n).
    sig.set(rx, 0);
    sig.set(numTo32b$1(modN$1(k + e * d)), 32);
    // If Verify(bytes(P), m, sig) (see below) returns failure, abort
    if (!schnorrVerify$1(sig, m, px))
        throw new Error('sign: Invalid signature produced');
    return sig;
}
/**
 * Verifies Schnorr signature.
 * Will swallow errors & return false except for initial type validation of arguments.
 */
function schnorrVerify$1(signature, message, publicKey) {
    const sig = ensureBytes$3('signature', signature, 64);
    const m = ensureBytes$3('message', message);
    const pub = ensureBytes$3('publicKey', publicKey, 32);
    try {
        const P = lift_x$1(bytesToNumberBE$2(pub)); // P = lift_x(int(pk)); fail if that fails
        const r = bytesToNumberBE$2(sig.subarray(0, 32)); // Let r = int(sig[0:32]); fail if r ≥ p.
        if (!fe$1(r))
            return false;
        const s = bytesToNumberBE$2(sig.subarray(32, 64)); // Let s = int(sig[32:64]); fail if s ≥ n.
        if (!ge$1(s))
            return false;
        const e = challenge$1(numTo32b$1(r), pointToBytes$1(P), m); // int(challenge(bytes(r)||bytes(P)||m))%n
        const R = GmulAdd$1(P, s, modN$1(-e)); // R = s⋅G - e⋅P
        if (!R || !R.hasEvenY() || R.toAffine().x !== r)
            return false; // -eP == (n-e)P
        return true; // Fail if is_infinite(R) / not has_even_y(R) / x(R) ≠ r.
    }
    catch (error) {
        return false;
    }
}
const schnorr$1 = /* @__PURE__ */ (() => ({
    getPublicKey: schnorrGetPublicKey$1,
    sign: schnorrSign$1,
    verify: schnorrVerify$1,
    utils: {
        randomPrivateKey: secp256k1$2.utils.randomPrivateKey,
        lift_x: lift_x$1,
        pointToBytes: pointToBytes$1,
        numberToBytesBE: numberToBytesBE$2,
        bytesToNumberBE: bytesToNumberBE$2,
        taggedHash: taggedHash$1,
        mod: mod$2,
    },
}))();

/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function assertNumber(n) {
    if (!Number.isSafeInteger(n))
        throw new Error(`Wrong integer: ${n}`);
}
function chain$1(...args) {
    const wrap = (a, b) => (c) => a(b(c));
    const encode = Array.from(args)
        .reverse()
        .reduce((acc, i) => (acc ? wrap(acc, i.encode) : i.encode), undefined);
    const decode = args.reduce((acc, i) => (acc ? wrap(acc, i.decode) : i.decode), undefined);
    return { encode, decode };
}
function alphabet$1(alphabet) {
    return {
        encode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('alphabet.encode input should be an array of numbers');
            return digits.map((i) => {
                assertNumber(i);
                if (i < 0 || i >= alphabet.length)
                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
                return alphabet[i];
            });
        },
        decode: (input) => {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('alphabet.decode input should be array of strings');
            return input.map((letter) => {
                if (typeof letter !== 'string')
                    throw new Error(`alphabet.decode: not string element=${letter}`);
                const index = alphabet.indexOf(letter);
                if (index === -1)
                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
                return index;
            });
        },
    };
}
function join$1(separator = '') {
    if (typeof separator !== 'string')
        throw new Error('join separator should be string');
    return {
        encode: (from) => {
            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
                throw new Error('join.encode input should be array of strings');
            for (let i of from)
                if (typeof i !== 'string')
                    throw new Error(`join.encode: non-string input=${i}`);
            return from.join(separator);
        },
        decode: (to) => {
            if (typeof to !== 'string')
                throw new Error('join.decode input should be string');
            return to.split(separator);
        },
    };
}
function padding$1(bits, chr = '=') {
    assertNumber(bits);
    if (typeof chr !== 'string')
        throw new Error('padding chr should be string');
    return {
        encode(data) {
            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of data)
                if (typeof i !== 'string')
                    throw new Error(`padding.encode: non-string input=${i}`);
            while ((data.length * bits) % 8)
                data.push(chr);
            return data;
        },
        decode(input) {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of input)
                if (typeof i !== 'string')
                    throw new Error(`padding.decode: non-string input=${i}`);
            let end = input.length;
            if ((end * bits) % 8)
                throw new Error('Invalid padding: string should have whole number of bytes');
            for (; end > 0 && input[end - 1] === chr; end--) {
                if (!(((end - 1) * bits) % 8))
                    throw new Error('Invalid padding: string has too much padding');
            }
            return input.slice(0, end);
        },
    };
}
function normalize$2(fn) {
    if (typeof fn !== 'function')
        throw new Error('normalize fn should be function');
    return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix$1(data, from, to) {
    if (from < 2)
        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
    if (to < 2)
        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
    if (!Array.isArray(data))
        throw new Error('convertRadix: data should be array');
    if (!data.length)
        return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data);
    digits.forEach((d) => {
        assertNumber(d);
        if (d < 0 || d >= from)
            throw new Error(`Wrong integer: ${d}`);
    });
    while (true) {
        let carry = 0;
        let done = true;
        for (let i = pos; i < digits.length; i++) {
            const digit = digits[i];
            const digitBase = from * carry + digit;
            if (!Number.isSafeInteger(digitBase) ||
                (from * carry) / from !== carry ||
                digitBase - digit !== from * carry) {
                throw new Error('convertRadix: carry overflow');
            }
            carry = digitBase % to;
            digits[i] = Math.floor(digitBase / to);
            if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase)
                throw new Error('convertRadix: carry overflow');
            if (!done)
                continue;
            else if (!digits[i])
                pos = i;
            else
                done = false;
        }
        res.push(carry);
        if (done)
            break;
    }
    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
        res.push(0);
    return res.reverse();
}
const gcd$1 = (a, b) => (!b ? a : gcd$1(b, a % b));
const radix2carry$1 = (from, to) => from + (to - gcd$1(from, to));
function convertRadix2$1(data, from, to, padding) {
    if (!Array.isArray(data))
        throw new Error('convertRadix2: data should be array');
    if (from <= 0 || from > 32)
        throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
        throw new Error(`convertRadix2: wrong to=${to}`);
    if (radix2carry$1(from, to) > 32) {
        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry$1(from, to)}`);
    }
    let carry = 0;
    let pos = 0;
    const mask = 2 ** to - 1;
    const res = [];
    for (const n of data) {
        assertNumber(n);
        if (n >= 2 ** from)
            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
        carry = (carry << from) | n;
        if (pos + from > 32)
            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to)
            res.push(((carry >> (pos - to)) & mask) >>> 0);
        carry &= 2 ** pos - 1;
    }
    carry = (carry << (to - pos)) & mask;
    if (!padding && pos >= from)
        throw new Error('Excess padding');
    if (!padding && carry)
        throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
        res.push(carry >>> 0);
    return res;
}
function radix$1(num) {
    assertNumber(num);
    return {
        encode: (bytes) => {
            if (!(bytes instanceof Uint8Array))
                throw new Error('radix.encode input should be Uint8Array');
            return convertRadix$1(Array.from(bytes), 2 ** 8, num);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix.decode input should be array of strings');
            return Uint8Array.from(convertRadix$1(digits, num, 2 ** 8));
        },
    };
}
function radix2$1(bits, revPadding = false) {
    assertNumber(bits);
    if (bits <= 0 || bits > 32)
        throw new Error('radix2: bits should be in (0..32]');
    if (radix2carry$1(8, bits) > 32 || radix2carry$1(bits, 8) > 32)
        throw new Error('radix2: carry overflow');
    return {
        encode: (bytes) => {
            if (!(bytes instanceof Uint8Array))
                throw new Error('radix2.encode input should be Uint8Array');
            return convertRadix2$1(Array.from(bytes), 8, bits, !revPadding);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix2.decode input should be array of strings');
            return Uint8Array.from(convertRadix2$1(digits, bits, 8, revPadding));
        },
    };
}
function unsafeWrapper$1(fn) {
    if (typeof fn !== 'function')
        throw new Error('unsafeWrapper fn should be function');
    return function (...args) {
        try {
            return fn.apply(null, args);
        }
        catch (e) { }
    };
}
const base16 = chain$1(radix2$1(4), alphabet$1('0123456789ABCDEF'), join$1(''));
const base32 = chain$1(radix2$1(5), alphabet$1('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding$1(5), join$1(''));
chain$1(radix2$1(5), alphabet$1('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding$1(5), join$1(''));
chain$1(radix2$1(5), alphabet$1('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join$1(''), normalize$2((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
const base64 = chain$1(radix2$1(6), alphabet$1('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding$1(6), join$1(''));
const base64url = chain$1(radix2$1(6), alphabet$1('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding$1(6), join$1(''));
const genBase58$1 = (abc) => chain$1(radix$1(58), alphabet$1(abc), join$1(''));
const base58$1 = genBase58$1('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
genBase58$1('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
genBase58$1('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
const base58xmr = {
    encode(data) {
        let res = '';
        for (let i = 0; i < data.length; i += 8) {
            const block = data.subarray(i, i + 8);
            res += base58$1.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
        }
        return res;
    },
    decode(str) {
        let res = [];
        for (let i = 0; i < str.length; i += 11) {
            const slice = str.slice(i, i + 11);
            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
            const block = base58$1.decode(slice);
            for (let j = 0; j < block.length - blockLen; j++) {
                if (block[j] !== 0)
                    throw new Error('base58xmr: wrong padding');
            }
            res = res.concat(Array.from(block.slice(block.length - blockLen)));
        }
        return Uint8Array.from(res);
    },
};
const BECH_ALPHABET$1 = chain$1(alphabet$1('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join$1(''));
const POLYMOD_GENERATORS$1 = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function bech32Polymod$1(pre) {
    const b = pre >> 25;
    let chk = (pre & 0x1ffffff) << 5;
    for (let i = 0; i < POLYMOD_GENERATORS$1.length; i++) {
        if (((b >> i) & 1) === 1)
            chk ^= POLYMOD_GENERATORS$1[i];
    }
    return chk;
}
function bechChecksum$1(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i = 0; i < len; i++) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
            throw new Error(`Invalid prefix (${prefix})`);
        chk = bech32Polymod$1(chk) ^ (c >> 5);
    }
    chk = bech32Polymod$1(chk);
    for (let i = 0; i < len; i++)
        chk = bech32Polymod$1(chk) ^ (prefix.charCodeAt(i) & 0x1f);
    for (let v of words)
        chk = bech32Polymod$1(chk) ^ v;
    for (let i = 0; i < 6; i++)
        chk = bech32Polymod$1(chk);
    chk ^= encodingConst;
    return BECH_ALPHABET$1.encode(convertRadix2$1([chk % 2 ** 30], 30, 5, false));
}
function genBech32$1(encoding) {
    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
    const _words = radix2$1(5);
    const fromWords = _words.decode;
    const toWords = _words.encode;
    const fromWordsUnsafe = unsafeWrapper$1(fromWords);
    function encode(prefix, words, limit = 90) {
        if (typeof prefix !== 'string')
            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
        const actualLength = prefix.length + 7 + words.length;
        if (limit !== false && actualLength > limit)
            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
        prefix = prefix.toLowerCase();
        return `${prefix}1${BECH_ALPHABET$1.encode(words)}${bechChecksum$1(prefix, words, ENCODING_CONST)}`;
    }
    function decode(str, limit = 90) {
        if (typeof str !== 'string')
            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
        if (str.length < 8 || (limit !== false && str.length > limit))
            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
        const lowered = str.toLowerCase();
        if (str !== lowered && str !== str.toUpperCase())
            throw new Error(`String must be lowercase or uppercase`);
        str = lowered;
        const sepIndex = str.lastIndexOf('1');
        if (sepIndex === 0 || sepIndex === -1)
            throw new Error(`Letter "1" must be present between prefix and data only`);
        const prefix = str.slice(0, sepIndex);
        const _words = str.slice(sepIndex + 1);
        if (_words.length < 6)
            throw new Error('Data must be at least 6 characters long');
        const words = BECH_ALPHABET$1.decode(_words).slice(0, -6);
        const sum = bechChecksum$1(prefix, words, ENCODING_CONST);
        if (!_words.endsWith(sum))
            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper$1(decode);
    function decodeToBytes(str) {
        const { prefix, words } = decode(str, false);
        return { prefix, words, bytes: fromWords(words) };
    }
    return { encode, decode, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
}
const bech32$1 = genBech32$1('bech32');
genBech32$1('bech32m');
const utf8 = {
    encode: (data) => new TextDecoder().decode(data),
    decode: (str) => new TextEncoder().encode(str),
};
const hex = chain$1(radix2$1(4), alphabet$1('0123456789abcdef'), join$1(''), normalize$2((s) => {
    if (typeof s !== 'string' || s.length % 2)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
    return s.toLowerCase();
}));
const CODERS = {
    utf8, hex, base16, base32, base64, base64url, base58: base58$1, base58xmr
};
`Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;

const wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split('\n');

function number$4(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function bool$2(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
// copied from utils
function isBytes$6(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
function bytes$4(b, ...lengths) {
    if (!isBytes$6(b))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash$4(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number$4(hash.outputLen);
    number$4(hash.blockLen);
}
function exists$4(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output$4(out, instance) {
    bytes$4(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
const assert$2 = { number: number$4, bool: bool$2, bytes: bytes$4, hash: hash$4, exists: exists$4, output: output$4 };
var assert$3 = assert$2;

const crypto$3 = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
function isBytes$5(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
// Cast array to view
const createView$3 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr$3 = (word, shift) => (word << (32 - shift)) | (word >>> shift);
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
// Other libraries would silently corrupt the data instead of throwing an error,
// when they don't support it.
const isLE$3 = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE$3)
    throw new Error('Non little-endian hardware is not supported');
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$6(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$4(data) {
    if (typeof data === 'string')
        data = utf8ToBytes$6(data);
    if (!isBytes$5(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
// For runtime check if class implements interface
let Hash$3 = class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
};
const toStr = {}.toString;
function checkOpts$1(defaults, opts) {
    if (opts !== undefined && toStr.call(opts) !== '[object Object]')
        throw new Error('Options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
function wrapConstructor$3(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes$4(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes$2(bytesLength = 32) {
    if (crypto$3 && typeof crypto$3.getRandomValues === 'function') {
        return crypto$3.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}

// HMAC (RFC 2104)
let HMAC$3 = class HMAC extends Hash$3 {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        hash$4(hash);
        const key = toBytes$4(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        exists$4(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        exists$4(this);
        bytes$4(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
};
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac$3 = (hash, key, message) => new HMAC$3(hash, key).update(message).digest();
hmac$3.create = (hash, key) => new HMAC$3(hash, key);

// Common prologue and epilogue for sync/async functions
function pbkdf2Init(hash, _password, _salt, _opts) {
    hash$4(hash);
    const opts = checkOpts$1({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c, dkLen, asyncTick } = opts;
    number$4(c);
    number$4(dkLen);
    number$4(asyncTick);
    if (c < 1)
        throw new Error('PBKDF2: iterations (c) should be >= 1');
    const password = toBytes$4(_password);
    const salt = toBytes$4(_salt);
    // DK = PBKDF2(PRF, Password, Salt, c, dkLen);
    const DK = new Uint8Array(dkLen);
    // U1 = PRF(Password, Salt + INT_32_BE(i))
    const PRF = hmac$3.create(hash, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
        prfW.destroy();
    u.fill(0);
    return DK;
}
/**
 * PBKDF2-HMAC: RFC 2898 key derivation function
 * @param hash - hash function that would be used e.g. sha256
 * @param password - password from which a derived key is generated
 * @param salt - cryptographic salt
 * @param opts - {c, dkLen} where c is work factor and dkLen is output message size
 */
function pbkdf2(hash, password, salt, opts) {
    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW; // Working copy
    const arr = new Uint8Array(4);
    const view = createView$3(arr);
    const u = new Uint8Array(PRF.outputLen);
    // DK = T1 + T2 + ⋯ + Tdklen/hlen
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        // Ti = F(Password, Salt, c, i)
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        for (let ui = 1; ui < c; ui++) {
            // Uc = PRF(Password, Uc−1)
            PRF._cloneInto(prfW).update(u).digestInto(u);
            for (let i = 0; i < Ti.length; i++)
                Ti[i] ^= u[i];
        }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// Polyfill for Safari 14
function setBigUint64$3(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
let SHA2$2 = class SHA2 extends Hash$3 {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView$3(this.buffer);
    }
    update(data) {
        exists$4(this);
        const { view, buffer, blockLen } = this;
        data = toBytes$4(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView$3(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        exists$4(this);
        output$4(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64$3(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView$3(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
};

// SHA2-256 need to try 2^128 hashes to execute birthday attack.
// BTC network is doing 2^67 hashes/sec as per early 2023.
// Choice: a ? b : c
const Chi$3 = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj$3 = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K$3 = /* @__PURE__ */ new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV$2 = /* @__PURE__ */ new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W$3 = /* @__PURE__ */ new Uint32Array(64);
let SHA256$3 = class SHA256 extends SHA2$2 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV$2[0] | 0;
        this.B = IV$2[1] | 0;
        this.C = IV$2[2] | 0;
        this.D = IV$2[3] | 0;
        this.E = IV$2[4] | 0;
        this.F = IV$2[5] | 0;
        this.G = IV$2[6] | 0;
        this.H = IV$2[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W$3[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W$3[i - 15];
            const W2 = SHA256_W$3[i - 2];
            const s0 = rotr$3(W15, 7) ^ rotr$3(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr$3(W2, 17) ^ rotr$3(W2, 19) ^ (W2 >>> 10);
            SHA256_W$3[i] = (s1 + SHA256_W$3[i - 7] + s0 + SHA256_W$3[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr$3(E, 6) ^ rotr$3(E, 11) ^ rotr$3(E, 25);
            const T1 = (H + sigma1 + Chi$3(E, F, G) + SHA256_K$3[i] + SHA256_W$3[i]) | 0;
            const sigma0 = rotr$3(A, 2) ^ rotr$3(A, 13) ^ rotr$3(A, 22);
            const T2 = (sigma0 + Maj$3(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W$3.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
};
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$3 = /* @__PURE__ */ wrapConstructor$3(() => new SHA256$3());

const U32_MASK64$1 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n$1 = /* @__PURE__ */ BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig$1(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64$1), l: Number((n >> _32n$1) & U32_MASK64$1) };
    return { h: Number((n >> _32n$1) & U32_MASK64$1) | 0, l: Number(n & U32_MASK64$1) | 0 };
}
function split$1(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig$1(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
const toBig$1 = (h, l) => (BigInt(h >>> 0) << _32n$1) | BigInt(l >>> 0);
// for Shift in [0, 32)
const shrSH$1 = (h, _l, s) => h >>> s;
const shrSL$1 = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH$1 = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL$1 = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH$1 = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL$1 = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H$1 = (_h, l) => l;
const rotr32L$1 = (h, _l) => h;
// Left rotate for Shift in [1, 32)
const rotlSH$1 = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL$1 = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH$1 = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL$1 = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add$1(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
// Addition with more than 2 elements
const add3L$1 = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H$1 = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L$1 = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H$1 = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L$1 = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H$1 = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
// prettier-ignore
const u64$2 = {
    fromBig: fromBig$1, split: split$1, toBig: toBig$1,
    shrSH: shrSH$1, shrSL: shrSL$1,
    rotrSH: rotrSH$1, rotrSL: rotrSL$1, rotrBH: rotrBH$1, rotrBL: rotrBL$1,
    rotr32H: rotr32H$1, rotr32L: rotr32L$1,
    rotlSH: rotlSH$1, rotlSL: rotlSL$1, rotlBH: rotlBH$1, rotlBL: rotlBL$1,
    add: add$1, add3L: add3L$1, add3H: add3H$1, add4L: add4L$1, add4H: add4H$1, add5H: add5H$1, add5L: add5L$1,
};
var u64$3 = u64$2;

// Round contants (first 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409):
// prettier-ignore
const [SHA512_Kh$1, SHA512_Kl$1] = /* @__PURE__ */ (() => u64$3.split([
    '0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc',
    '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118',
    '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2',
    '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694',
    '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65',
    '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5',
    '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4',
    '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70',
    '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df',
    '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b',
    '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30',
    '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8',
    '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8',
    '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3',
    '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec',
    '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b',
    '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178',
    '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b',
    '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c',
    '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'
].map(n => BigInt(n))))();
// Temporary buffer, not used to store anything between runs
const SHA512_W_H$1 = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L$1 = /* @__PURE__ */ new Uint32Array(80);
let SHA512$1 = class SHA512 extends SHA2$2 {
    constructor() {
        super(128, 64, 16, false);
        // We cannot use array here since array allows indexing by variable which means optimizer/compiler cannot use registers.
        // Also looks cleaner and easier to verify with spec.
        // Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x6a09e667 | 0;
        this.Al = 0xf3bcc908 | 0;
        this.Bh = 0xbb67ae85 | 0;
        this.Bl = 0x84caa73b | 0;
        this.Ch = 0x3c6ef372 | 0;
        this.Cl = 0xfe94f82b | 0;
        this.Dh = 0xa54ff53a | 0;
        this.Dl = 0x5f1d36f1 | 0;
        this.Eh = 0x510e527f | 0;
        this.El = 0xade682d1 | 0;
        this.Fh = 0x9b05688c | 0;
        this.Fl = 0x2b3e6c1f | 0;
        this.Gh = 0x1f83d9ab | 0;
        this.Gl = 0xfb41bd6b | 0;
        this.Hh = 0x5be0cd19 | 0;
        this.Hl = 0x137e2179 | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H$1[i] = view.getUint32(offset);
            SHA512_W_L$1[i] = view.getUint32((offset += 4));
        }
        for (let i = 16; i < 80; i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H$1[i - 15] | 0;
            const W15l = SHA512_W_L$1[i - 15] | 0;
            const s0h = u64$3.rotrSH(W15h, W15l, 1) ^ u64$3.rotrSH(W15h, W15l, 8) ^ u64$3.shrSH(W15h, W15l, 7);
            const s0l = u64$3.rotrSL(W15h, W15l, 1) ^ u64$3.rotrSL(W15h, W15l, 8) ^ u64$3.shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H$1[i - 2] | 0;
            const W2l = SHA512_W_L$1[i - 2] | 0;
            const s1h = u64$3.rotrSH(W2h, W2l, 19) ^ u64$3.rotrBH(W2h, W2l, 61) ^ u64$3.shrSH(W2h, W2l, 6);
            const s1l = u64$3.rotrSL(W2h, W2l, 19) ^ u64$3.rotrBL(W2h, W2l, 61) ^ u64$3.shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = u64$3.add4L(s0l, s1l, SHA512_W_L$1[i - 7], SHA512_W_L$1[i - 16]);
            const SUMh = u64$3.add4H(SUMl, s0h, s1h, SHA512_W_H$1[i - 7], SHA512_W_H$1[i - 16]);
            SHA512_W_H$1[i] = SUMh | 0;
            SHA512_W_L$1[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for (let i = 0; i < 80; i++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = u64$3.rotrSH(Eh, El, 14) ^ u64$3.rotrSH(Eh, El, 18) ^ u64$3.rotrBH(Eh, El, 41);
            const sigma1l = u64$3.rotrSL(Eh, El, 14) ^ u64$3.rotrSL(Eh, El, 18) ^ u64$3.rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = (Eh & Fh) ^ (~Eh & Gh);
            const CHIl = (El & Fl) ^ (~El & Gl);
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = u64$3.add5L(Hl, sigma1l, CHIl, SHA512_Kl$1[i], SHA512_W_L$1[i]);
            const T1h = u64$3.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh$1[i], SHA512_W_H$1[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = u64$3.rotrSH(Ah, Al, 28) ^ u64$3.rotrBH(Ah, Al, 34) ^ u64$3.rotrBH(Ah, Al, 39);
            const sigma0l = u64$3.rotrSL(Ah, Al, 28) ^ u64$3.rotrBL(Ah, Al, 34) ^ u64$3.rotrBL(Ah, Al, 39);
            const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
            const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = u64$3.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = u64$3.add3L(T1l, sigma0l, MAJl);
            Ah = u64$3.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = u64$3.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = u64$3.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = u64$3.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = u64$3.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = u64$3.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = u64$3.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = u64$3.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = u64$3.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        SHA512_W_H$1.fill(0);
        SHA512_W_L$1.fill(0);
    }
    destroy() {
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
};
const sha512$1 = /* @__PURE__ */ wrapConstructor$3(() => new SHA512$1());

/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Utilities

function isBytes$4(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function chain(...args) {
    const id = (a) => a;
    // Wrap call in closure so JIT can inline calls
    const wrap = (a, b) => (c) => a(b(c));
    // Construct chain of args[-1].encode(args[-2].encode([...]))
    const encode = args.map((x) => x.encode).reduceRight(wrap, id);
    // Construct chain of args[0].decode(args[1].decode(...))
    const decode = args.map((x) => x.decode).reduce(wrap, id);
    return { encode, decode };
}
/**
 * Encodes integer radix representation to array of strings using alphabet and back
 * @__NO_SIDE_EFFECTS__
 */
function alphabet(alphabet) {
    return {
        encode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('alphabet.encode input should be an array of numbers');
            return digits.map((i) => {
                if (i < 0 || i >= alphabet.length)
                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
                return alphabet[i];
            });
        },
        decode: (input) => {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('alphabet.decode input should be array of strings');
            return input.map((letter) => {
                if (typeof letter !== 'string')
                    throw new Error(`alphabet.decode: not string element=${letter}`);
                const index = alphabet.indexOf(letter);
                if (index === -1)
                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
                return index;
            });
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function join(separator = '') {
    if (typeof separator !== 'string')
        throw new Error('join separator should be string');
    return {
        encode: (from) => {
            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
                throw new Error('join.encode input should be array of strings');
            for (let i of from)
                if (typeof i !== 'string')
                    throw new Error(`join.encode: non-string input=${i}`);
            return from.join(separator);
        },
        decode: (to) => {
            if (typeof to !== 'string')
                throw new Error('join.decode input should be string');
            return to.split(separator);
        },
    };
}
/**
 * Pad strings array so it has integer number of bits
 * @__NO_SIDE_EFFECTS__
 */
function padding(bits, chr = '=') {
    if (typeof chr !== 'string')
        throw new Error('padding chr should be string');
    return {
        encode(data) {
            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of data)
                if (typeof i !== 'string')
                    throw new Error(`padding.encode: non-string input=${i}`);
            while ((data.length * bits) % 8)
                data.push(chr);
            return data;
        },
        decode(input) {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of input)
                if (typeof i !== 'string')
                    throw new Error(`padding.decode: non-string input=${i}`);
            let end = input.length;
            if ((end * bits) % 8)
                throw new Error('Invalid padding: string should have whole number of bytes');
            for (; end > 0 && input[end - 1] === chr; end--) {
                if (!(((end - 1) * bits) % 8))
                    throw new Error('Invalid padding: string has too much padding');
            }
            return input.slice(0, end);
        },
    };
}
/**
 * Slow: O(n^2) time complexity
 * @__NO_SIDE_EFFECTS__
 */
function convertRadix(data, from, to) {
    // base 1 is impossible
    if (from < 2)
        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
    if (to < 2)
        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
    if (!Array.isArray(data))
        throw new Error('convertRadix: data should be array');
    if (!data.length)
        return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data);
    digits.forEach((d) => {
        if (d < 0 || d >= from)
            throw new Error(`Wrong integer: ${d}`);
    });
    while (true) {
        let carry = 0;
        let done = true;
        for (let i = pos; i < digits.length; i++) {
            const digit = digits[i];
            const digitBase = from * carry + digit;
            if (!Number.isSafeInteger(digitBase) ||
                (from * carry) / from !== carry ||
                digitBase - digit !== from * carry) {
                throw new Error('convertRadix: carry overflow');
            }
            carry = digitBase % to;
            const rounded = Math.floor(digitBase / to);
            digits[i] = rounded;
            if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
                throw new Error('convertRadix: carry overflow');
            if (!done)
                continue;
            else if (!rounded)
                pos = i;
            else
                done = false;
        }
        res.push(carry);
        if (done)
            break;
    }
    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
        res.push(0);
    return res.reverse();
}
const gcd = /* @__NO_SIDE_EFFECTS__ */ (a, b) => (!b ? a : gcd(b, a % b));
const radix2carry = /*@__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
/**
 * Implemented with numbers, because BigInt is 5x slower
 * @__NO_SIDE_EFFECTS__
 */
function convertRadix2(data, from, to, padding) {
    if (!Array.isArray(data))
        throw new Error('convertRadix2: data should be array');
    if (from <= 0 || from > 32)
        throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
        throw new Error(`convertRadix2: wrong to=${to}`);
    if (radix2carry(from, to) > 32) {
        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
    }
    let carry = 0;
    let pos = 0; // bitwise position in current element
    const mask = 2 ** to - 1;
    const res = [];
    for (const n of data) {
        if (n >= 2 ** from)
            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
        carry = (carry << from) | n;
        if (pos + from > 32)
            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to)
            res.push(((carry >> (pos - to)) & mask) >>> 0);
        carry &= 2 ** pos - 1; // clean carry, otherwise it will cause overflow
    }
    carry = (carry << (to - pos)) & mask;
    if (!padding && pos >= from)
        throw new Error('Excess padding');
    if (!padding && carry)
        throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
        res.push(carry >>> 0);
    return res;
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function radix(num) {
    return {
        encode: (bytes) => {
            if (!isBytes$4(bytes))
                throw new Error('radix.encode input should be Uint8Array');
            return convertRadix(Array.from(bytes), 2 ** 8, num);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix.decode input should be array of numbers');
            return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
        },
    };
}
/**
 * If both bases are power of same number (like `2**8 <-> 2**64`),
 * there is a linear algorithm. For now we have implementation for power-of-two bases only.
 * @__NO_SIDE_EFFECTS__
 */
function radix2(bits, revPadding = false) {
    if (bits <= 0 || bits > 32)
        throw new Error('radix2: bits should be in (0..32]');
    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
        throw new Error('radix2: carry overflow');
    return {
        encode: (bytes) => {
            if (!isBytes$4(bytes))
                throw new Error('radix2.encode input should be Uint8Array');
            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix2.decode input should be array of numbers');
            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function unsafeWrapper(fn) {
    if (typeof fn !== 'function')
        throw new Error('unsafeWrapper fn should be function');
    return function (...args) {
        try {
            return fn.apply(null, args);
        }
        catch (e) { }
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function checksum(len, fn) {
    if (typeof fn !== 'function')
        throw new Error('checksum fn should be function');
    return {
        encode(data) {
            if (!isBytes$4(data))
                throw new Error('checksum.encode: input should be Uint8Array');
            const checksum = fn(data).slice(0, len);
            const res = new Uint8Array(data.length + len);
            res.set(data);
            res.set(checksum, data.length);
            return res;
        },
        decode(data) {
            if (!isBytes$4(data))
                throw new Error('checksum.decode: input should be Uint8Array');
            const payload = data.slice(0, -len);
            const newChecksum = fn(payload).slice(0, len);
            const oldChecksum = data.slice(-len);
            for (let i = 0; i < len; i++)
                if (newChecksum[i] !== oldChecksum[i])
                    throw new Error('Invalid checksum');
            return payload;
        },
    };
}
// prettier-ignore
const utils$2 = {
    alphabet, chain, checksum, convertRadix, convertRadix2, radix, radix2, join, padding,
};
// base58 code
// -----------
const genBase58 = (abc) => chain(radix(58), alphabet(abc), join(''));
const base58 = /* @__PURE__ */ genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
const createBase58check = /* @__PURE__ */ (sha256) => chain(checksum(4, (data) => sha256(sha256(data))), base58);
// legacy export, bad name
const base58check$1 = createBase58check;
const BECH_ALPHABET = /* @__PURE__ */ chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
/**
 * @__NO_SIDE_EFFECTS__
 */
function bech32Polymod(pre) {
    const b = pre >> 25;
    let chk = (pre & 0x1ffffff) << 5;
    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
        if (((b >> i) & 1) === 1)
            chk ^= POLYMOD_GENERATORS[i];
    }
    return chk;
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function bechChecksum(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i = 0; i < len; i++) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
            throw new Error(`Invalid prefix (${prefix})`);
        chk = bech32Polymod(chk) ^ (c >> 5);
    }
    chk = bech32Polymod(chk);
    for (let i = 0; i < len; i++)
        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
    for (let v of words)
        chk = bech32Polymod(chk) ^ v;
    for (let i = 0; i < 6; i++)
        chk = bech32Polymod(chk);
    chk ^= encodingConst;
    return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function genBech32(encoding) {
    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
    const _words = radix2(5);
    const fromWords = _words.decode;
    const toWords = _words.encode;
    const fromWordsUnsafe = unsafeWrapper(fromWords);
    function encode(prefix, words, limit = 90) {
        if (typeof prefix !== 'string')
            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
        if (prefix.length === 0)
            throw new TypeError(`Invalid prefix length ${prefix.length}`);
        const actualLength = prefix.length + 7 + words.length;
        if (limit !== false && actualLength > limit)
            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
        const lowered = prefix.toLowerCase();
        const sum = bechChecksum(lowered, words, ENCODING_CONST);
        return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
    }
    function decode(str, limit = 90) {
        if (typeof str !== 'string')
            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
        if (str.length < 8 || (limit !== false && str.length > limit))
            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
        // don't allow mixed case
        const lowered = str.toLowerCase();
        if (str !== lowered && str !== str.toUpperCase())
            throw new Error(`String must be lowercase or uppercase`);
        const sepIndex = lowered.lastIndexOf('1');
        if (sepIndex === 0 || sepIndex === -1)
            throw new Error(`Letter "1" must be present between prefix and data only`);
        const prefix = lowered.slice(0, sepIndex);
        const data = lowered.slice(sepIndex + 1);
        if (data.length < 6)
            throw new Error('Data must be at least 6 characters long');
        const words = BECH_ALPHABET.decode(data).slice(0, -6);
        const sum = bechChecksum(prefix, words, ENCODING_CONST);
        if (!data.endsWith(sum))
            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper(decode);
    function decodeToBytes(str) {
        const { prefix, words } = decode(str, false);
        return { prefix, words, bytes: fromWords(words) };
    }
    return { encode, decode, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
}
const bech32 = /* @__PURE__ */ genBech32('bech32');

const isJapanese = (wordlist) => wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093';
function nfkd(str) {
    if (typeof str !== 'string')
        throw new TypeError(`Invalid mnemonic type: ${typeof str}`);
    return str.normalize('NFKD');
}
function normalize$1(str) {
    const norm = nfkd(str);
    const words = norm.split(' ');
    if (![12, 15, 18, 21, 24].includes(words.length))
        throw new Error('Invalid mnemonic');
    return { nfkd: norm, words };
}
function assertEntropy(entropy) {
    assert$3.bytes(entropy, 16, 20, 24, 28, 32);
}
function generateMnemonic(wordlist, strength = 128) {
    assert$3.number(strength);
    if (strength % 32 !== 0 || strength > 256)
        throw new TypeError('Invalid entropy');
    return entropyToMnemonic(randomBytes$2(strength / 8), wordlist);
}
const calcChecksum = (entropy) => {
    const bitsLeft = 8 - entropy.length / 4;
    return new Uint8Array([(sha256$3(entropy)[0] >> bitsLeft) << bitsLeft]);
};
function getCoder(wordlist) {
    if (!Array.isArray(wordlist) || wordlist.length !== 2048 || typeof wordlist[0] !== 'string')
        throw new Error('Worlist: expected array of 2048 strings');
    wordlist.forEach((i) => {
        if (typeof i !== 'string')
            throw new Error(`Wordlist: non-string element: ${i}`);
    });
    return utils$2.chain(utils$2.checksum(1, calcChecksum), utils$2.radix2(11, true), utils$2.alphabet(wordlist));
}
function mnemonicToEntropy(mnemonic, wordlist) {
    const { words } = normalize$1(mnemonic);
    const entropy = getCoder(wordlist).decode(words);
    assertEntropy(entropy);
    return entropy;
}
function entropyToMnemonic(entropy, wordlist) {
    assertEntropy(entropy);
    const words = getCoder(wordlist).encode(entropy);
    return words.join(isJapanese(wordlist) ? '\u3000' : ' ');
}
function validateMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    }
    catch (e) {
        return false;
    }
    return true;
}
const salt = (passphrase) => nfkd(`mnemonic${passphrase}`);
function mnemonicToSeedSync(mnemonic, passphrase = '') {
    return pbkdf2(sha512$1, normalize$1(mnemonic).nfkd, salt(passphrase), { c: 2048, dkLen: 64 });
}

function number$3(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
// copied from utils
function isBytes$3(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
function bytes$3(b, ...lengths) {
    if (!isBytes$3(b))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash$3(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number$3(hash.outputLen);
    number$3(hash.blockLen);
}
function exists$3(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output$3(out, instance) {
    bytes$3(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
function isBytes$2(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
// Cast array to view
const createView$2 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr$2 = (word, shift) => (word << (32 - shift)) | (word >>> shift);
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
// Other libraries would silently corrupt the data instead of throwing an error,
// when they don't support it.
const isLE$2 = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE$2)
    throw new Error('Non little-endian hardware is not supported');
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes$3 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex$3(bytes) {
    if (!isBytes$2(bytes))
        throw new Error('Uint8Array expected');
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes$3[bytes[i]];
    }
    return hex;
}
// We use optimized technique to convert hex string to byte array
const asciis$1 = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
function asciiToBase16$1(char) {
    if (char >= asciis$1._0 && char <= asciis$1._9)
        return char - asciis$1._0;
    if (char >= asciis$1._A && char <= asciis$1._F)
        return char - (asciis$1._A - 10);
    if (char >= asciis$1._a && char <= asciis$1._f)
        return char - (asciis$1._a - 10);
    return;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes$2(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16$1(hex.charCodeAt(hi));
        const n2 = asciiToBase16$1(hex.charCodeAt(hi + 1));
        if (n1 === undefined || n2 === undefined) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
    }
    return array;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$5(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$3(data) {
    if (typeof data === 'string')
        data = utf8ToBytes$5(data);
    if (!isBytes$2(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$4(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        if (!isBytes$2(a))
            throw new Error('Uint8Array expected');
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
// For runtime check if class implements interface
let Hash$2 = class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
};
function wrapConstructor$2(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes$3(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}

// HMAC (RFC 2104)
let HMAC$2 = class HMAC extends Hash$2 {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        hash$3(hash);
        const key = toBytes$3(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        exists$3(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        exists$3(this);
        bytes$3(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
};
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac$2 = (hash, key, message) => new HMAC$2(hash, key).update(message).digest();
hmac$2.create = (hash, key) => new HMAC$2(hash, key);

// Polyfill for Safari 14
function setBigUint64$2(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
let SHA2$1 = class SHA2 extends Hash$2 {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView$2(this.buffer);
    }
    update(data) {
        exists$3(this);
        const { view, buffer, blockLen } = this;
        data = toBytes$3(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView$2(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        exists$3(this);
        output$3(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64$2(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView$2(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
};

// https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
// https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
const Rho = /* @__PURE__ */ new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
const Id = /* @__PURE__ */ Uint8Array.from({ length: 16 }, (_, i) => i);
const Pi = /* @__PURE__ */ Id.map((i) => (9 * i + 5) % 16);
let idxL = [Id];
let idxR = [Pi];
for (let i = 0; i < 4; i++)
    for (let j of [idxL, idxR])
        j.push(j[i].map((k) => Rho[k]));
const shifts = /* @__PURE__ */ [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5],
].map((i) => new Uint8Array(i));
const shiftsL = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts[i][j]));
const shiftsR = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts[i][j]));
const Kl = /* @__PURE__ */ new Uint32Array([
    0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e,
]);
const Kr = /* @__PURE__ */ new Uint32Array([
    0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000,
]);
// The rotate left (circular left shift) operation for uint32
const rotl$1 = (word, shift) => (word << shift) | (word >>> (32 - shift));
// It's called f() in spec.
function f(group, x, y, z) {
    if (group === 0)
        return x ^ y ^ z;
    else if (group === 1)
        return (x & y) | (~x & z);
    else if (group === 2)
        return (x | ~y) ^ z;
    else if (group === 3)
        return (x & z) | (y & ~z);
    else
        return x ^ (y | ~z);
}
// Temporary buffer, not used to store anything between runs
const BUF = /* @__PURE__ */ new Uint32Array(16);
class RIPEMD160 extends SHA2$1 {
    constructor() {
        super(64, 20, 8, true);
        this.h0 = 0x67452301 | 0;
        this.h1 = 0xefcdab89 | 0;
        this.h2 = 0x98badcfe | 0;
        this.h3 = 0x10325476 | 0;
        this.h4 = 0xc3d2e1f0 | 0;
    }
    get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
    }
    set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
    }
    process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
            BUF[i] = view.getUint32(offset, true);
        // prettier-ignore
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        // Instead of iterating 0 to 80, we split it into 5 groups
        // And use the groups in constants, functions, etc. Much simpler
        for (let group = 0; group < 5; group++) {
            const rGroup = 4 - group;
            const hbl = Kl[group], hbr = Kr[group]; // prettier-ignore
            const rl = idxL[group], rr = idxR[group]; // prettier-ignore
            const sl = shiftsL[group], sr = shiftsR[group]; // prettier-ignore
            for (let i = 0; i < 16; i++) {
                const tl = (rotl$1(al + f(group, bl, cl, dl) + BUF[rl[i]] + hbl, sl[i]) + el) | 0;
                al = el, el = dl, dl = rotl$1(cl, 10) | 0, cl = bl, bl = tl; // prettier-ignore
            }
            // 2 loops are 10% faster
            for (let i = 0; i < 16; i++) {
                const tr = (rotl$1(ar + f(rGroup, br, cr, dr) + BUF[rr[i]] + hbr, sr[i]) + er) | 0;
                ar = er, er = dr, dr = rotl$1(cr, 10) | 0, cr = br, br = tr; // prettier-ignore
            }
        }
        // Add the compressed chunk to the current hash value
        this.set((this.h1 + cl + dr) | 0, (this.h2 + dl + er) | 0, (this.h3 + el + ar) | 0, (this.h4 + al + br) | 0, (this.h0 + bl + cr) | 0);
    }
    roundClean() {
        BUF.fill(0);
    }
    destroy() {
        this.destroyed = true;
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0);
    }
}
/**
 * RIPEMD-160 - a hash function from 1990s.
 * @param message - msg that would be hashed
 */
const ripemd160 = /* @__PURE__ */ wrapConstructor$2(() => new RIPEMD160());

// SHA2-256 need to try 2^128 hashes to execute birthday attack.
// BTC network is doing 2^67 hashes/sec as per early 2023.
// Choice: a ? b : c
const Chi$2 = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj$2 = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K$2 = /* @__PURE__ */ new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV$1 = /* @__PURE__ */ new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W$2 = /* @__PURE__ */ new Uint32Array(64);
let SHA256$2 = class SHA256 extends SHA2$1 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV$1[0] | 0;
        this.B = IV$1[1] | 0;
        this.C = IV$1[2] | 0;
        this.D = IV$1[3] | 0;
        this.E = IV$1[4] | 0;
        this.F = IV$1[5] | 0;
        this.G = IV$1[6] | 0;
        this.H = IV$1[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W$2[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W$2[i - 15];
            const W2 = SHA256_W$2[i - 2];
            const s0 = rotr$2(W15, 7) ^ rotr$2(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr$2(W2, 17) ^ rotr$2(W2, 19) ^ (W2 >>> 10);
            SHA256_W$2[i] = (s1 + SHA256_W$2[i - 7] + s0 + SHA256_W$2[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr$2(E, 6) ^ rotr$2(E, 11) ^ rotr$2(E, 25);
            const T1 = (H + sigma1 + Chi$2(E, F, G) + SHA256_K$2[i] + SHA256_W$2[i]) | 0;
            const sigma0 = rotr$2(A, 2) ^ rotr$2(A, 13) ^ rotr$2(A, 22);
            const T2 = (sigma0 + Maj$2(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W$2.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
};
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$2 = /* @__PURE__ */ wrapConstructor$2(() => new SHA256$2());

const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
const toBig = (h, l) => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
// for Shift in [0, 32)
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (_h, l) => l;
const rotr32L = (h, _l) => h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
// prettier-ignore
const u64 = {
    fromBig, split, toBig,
    shrSH, shrSL,
    rotrSH, rotrSL, rotrBH, rotrBL,
    rotr32H, rotr32L,
    rotlSH, rotlSL, rotlBH, rotlBL,
    add, add3L, add3H, add4L, add4H, add5H, add5L,
};
var u64$1 = u64;

// Round contants (first 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409):
// prettier-ignore
const [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64$1.split([
    '0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc',
    '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118',
    '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2',
    '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694',
    '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65',
    '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5',
    '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4',
    '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70',
    '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df',
    '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b',
    '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30',
    '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8',
    '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8',
    '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3',
    '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec',
    '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b',
    '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178',
    '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b',
    '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c',
    '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'
].map(n => BigInt(n))))();
// Temporary buffer, not used to store anything between runs
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
class SHA512 extends SHA2$1 {
    constructor() {
        super(128, 64, 16, false);
        // We cannot use array here since array allows indexing by variable which means optimizer/compiler cannot use registers.
        // Also looks cleaner and easier to verify with spec.
        // Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x6a09e667 | 0;
        this.Al = 0xf3bcc908 | 0;
        this.Bh = 0xbb67ae85 | 0;
        this.Bl = 0x84caa73b | 0;
        this.Ch = 0x3c6ef372 | 0;
        this.Cl = 0xfe94f82b | 0;
        this.Dh = 0xa54ff53a | 0;
        this.Dl = 0x5f1d36f1 | 0;
        this.Eh = 0x510e527f | 0;
        this.El = 0xade682d1 | 0;
        this.Fh = 0x9b05688c | 0;
        this.Fl = 0x2b3e6c1f | 0;
        this.Gh = 0x1f83d9ab | 0;
        this.Gl = 0xfb41bd6b | 0;
        this.Hh = 0x5be0cd19 | 0;
        this.Hl = 0x137e2179 | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32((offset += 4));
        }
        for (let i = 16; i < 80; i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = u64$1.rotrSH(W15h, W15l, 1) ^ u64$1.rotrSH(W15h, W15l, 8) ^ u64$1.shrSH(W15h, W15l, 7);
            const s0l = u64$1.rotrSL(W15h, W15l, 1) ^ u64$1.rotrSL(W15h, W15l, 8) ^ u64$1.shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = u64$1.rotrSH(W2h, W2l, 19) ^ u64$1.rotrBH(W2h, W2l, 61) ^ u64$1.shrSH(W2h, W2l, 6);
            const s1l = u64$1.rotrSL(W2h, W2l, 19) ^ u64$1.rotrBL(W2h, W2l, 61) ^ u64$1.shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = u64$1.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = u64$1.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for (let i = 0; i < 80; i++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = u64$1.rotrSH(Eh, El, 14) ^ u64$1.rotrSH(Eh, El, 18) ^ u64$1.rotrBH(Eh, El, 41);
            const sigma1l = u64$1.rotrSL(Eh, El, 14) ^ u64$1.rotrSL(Eh, El, 18) ^ u64$1.rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = (Eh & Fh) ^ (~Eh & Gh);
            const CHIl = (El & Fl) ^ (~El & Gl);
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = u64$1.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = u64$1.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = u64$1.rotrSH(Ah, Al, 28) ^ u64$1.rotrBH(Ah, Al, 34) ^ u64$1.rotrBH(Ah, Al, 39);
            const sigma0l = u64$1.rotrSL(Ah, Al, 28) ^ u64$1.rotrBL(Ah, Al, 34) ^ u64$1.rotrBL(Ah, Al, 39);
            const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
            const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = u64$1.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = u64$1.add3L(T1l, sigma0l, MAJl);
            Ah = u64$1.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = u64$1.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = u64$1.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = u64$1.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = u64$1.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = u64$1.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = u64$1.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = u64$1.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = u64$1.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        SHA512_W_H.fill(0);
        SHA512_W_L.fill(0);
    }
    destroy() {
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}
const sha512 = /* @__PURE__ */ wrapConstructor$2(() => new SHA512());

function number$2(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function bool$1(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
function bytes$2(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash$2(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number$2(hash.outputLen);
    number$2(hash.blockLen);
}
function exists$2(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output$2(out, instance) {
    bytes$2(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
const assert$1 = {
    number: number$2,
    bool: bool$1,
    bytes: bytes$2,
    hash: hash$2,
    exists: exists$2,
    output: output$2,
};

const crypto$2 = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated, we can just drop the import.
const u8a$2 = (a) => a instanceof Uint8Array;
// Cast array to view
const createView$1 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr$1 = (word, shift) => (word << (32 - shift)) | (word >>> shift);
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
const isLE$1 = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE$1)
    throw new Error('Non little-endian hardware is not supported');
Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$4(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$2(data) {
    if (typeof data === 'string')
        data = utf8ToBytes$4(data);
    if (!u8a$2(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$3(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0; // walk through each item, ensure they have proper type
    arrays.forEach((a) => {
        if (!u8a$2(a))
            throw new Error('Uint8Array expected');
        r.set(a, pad);
        pad += a.length;
    });
    return r;
}
// For runtime check if class implements interface
let Hash$1 = class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
};
function wrapConstructor$1(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes$2(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes$1(bytesLength = 32) {
    if (crypto$2 && typeof crypto$2.getRandomValues === 'function') {
        return crypto$2.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}

// Polyfill for Safari 14
function setBigUint64$1(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
class SHA2 extends Hash$1 {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView$1(this.buffer);
    }
    update(data) {
        assert$1.exists(this);
        const { view, buffer, blockLen } = this;
        data = toBytes$2(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView$1(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        assert$1.exists(this);
        assert$1.output(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64$1(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView$1(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}

// Choice: a ? b : c
const Chi$1 = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj$1 = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K$1 = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W$1 = new Uint32Array(64);
let SHA256$1 = class SHA256 extends SHA2 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W$1[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W$1[i - 15];
            const W2 = SHA256_W$1[i - 2];
            const s0 = rotr$1(W15, 7) ^ rotr$1(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr$1(W2, 17) ^ rotr$1(W2, 19) ^ (W2 >>> 10);
            SHA256_W$1[i] = (s1 + SHA256_W$1[i - 7] + s0 + SHA256_W$1[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr$1(E, 6) ^ rotr$1(E, 11) ^ rotr$1(E, 25);
            const T1 = (H + sigma1 + Chi$1(E, F, G) + SHA256_K$1[i] + SHA256_W$1[i]) | 0;
            const sigma0 = rotr$1(A, 2) ^ rotr$1(A, 13) ^ rotr$1(A, 22);
            const T2 = (sigma0 + Maj$1(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W$1.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
};
// Constants from https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
class SHA224 extends SHA256$1 {
    constructor() {
        super();
        this.A = 0xc1059ed8 | 0;
        this.B = 0x367cd507 | 0;
        this.C = 0x3070dd17 | 0;
        this.D = 0xf70e5939 | 0;
        this.E = 0xffc00b31 | 0;
        this.F = 0x68581511 | 0;
        this.G = 0x64f98fa7 | 0;
        this.H = 0xbefa4fa4 | 0;
        this.outputLen = 28;
    }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$1 = wrapConstructor$1(() => new SHA256$1());
wrapConstructor$1(() => new SHA224());

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// 100 lines of code in the file are duplicated from noble-hashes (utils).
// This is OK: `abstract` directory does not use noble-hashes.
// User may opt-in into using different hashing library. This way, noble-hashes
// won't be included into their bundle.
const _0n$8 = BigInt(0);
const _1n$9 = BigInt(1);
const _2n$5 = BigInt(2);
const u8a$1 = (a) => a instanceof Uint8Array;
const hexes$2 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex$2(bytes) {
    if (!u8a$1(bytes))
        throw new Error('Uint8Array expected');
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes$2[bytes[i]];
    }
    return hex;
}
function numberToHexUnpadded$1(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber$1(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    // Big Endian
    return BigInt(hex === '' ? '0' : `0x${hex}`);
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes$1(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const len = hex.length;
    if (len % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
// BE: Big Endian, LE: Little Endian
function bytesToNumberBE$1(bytes) {
    return hexToNumber$1(bytesToHex$2(bytes));
}
function bytesToNumberLE$1(bytes) {
    if (!u8a$1(bytes))
        throw new Error('Uint8Array expected');
    return hexToNumber$1(bytesToHex$2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE$1(n, len) {
    return hexToBytes$1(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE$1(n, len) {
    return numberToBytesBE$1(n, len).reverse();
}
// Unpadded, rarely used
function numberToVarBytesBE$1(n) {
    return hexToBytes$1(numberToHexUnpadded$1(n));
}
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
function ensureBytes$2(title, hex, expectedLength) {
    let res;
    if (typeof hex === 'string') {
        try {
            res = hexToBytes$1(hex);
        }
        catch (e) {
            throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
        }
    }
    else if (u8a$1(hex)) {
        // Uint8Array.from() instead of hash.slice() because node.js Buffer
        // is instance of Uint8Array, and its slice() creates **mutable** copy
        res = Uint8Array.from(hex);
    }
    else {
        throw new Error(`${title} must be hex string or Uint8Array`);
    }
    const len = res.length;
    if (typeof expectedLength === 'number' && len !== expectedLength)
        throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
    return res;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$2(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0; // walk through each item, ensure they have proper type
    arrays.forEach((a) => {
        if (!u8a$1(a))
            throw new Error('Uint8Array expected');
        r.set(a, pad);
        pad += a.length;
    });
    return r;
}
function equalBytes$2(b1, b2) {
    // We don't care about timing attacks here
    if (b1.length !== b2.length)
        return false;
    for (let i = 0; i < b1.length; i++)
        if (b1[i] !== b2[i])
            return false;
    return true;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$3(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
// Bit operations
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 */
function bitLen$1(n) {
    let len;
    for (len = 0; n > _0n$8; n >>= _1n$9, len += 1)
        ;
    return len;
}
/**
 * Gets single bit at position.
 * NOTE: first bit position is 0 (same as arrays)
 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
 */
function bitGet$1(n, pos) {
    return (n >> BigInt(pos)) & _1n$9;
}
/**
 * Sets single bit at position.
 */
const bitSet$1 = (n, pos, value) => {
    return n | ((value ? _1n$9 : _0n$8) << BigInt(pos));
};
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask$1 = (n) => (_2n$5 << BigInt(n - 1)) - _1n$9;
// DRBG
const u8n$1 = (data) => new Uint8Array(data); // creates Uint8Array
const u8fr$1 = (arr) => Uint8Array.from(arr); // another shortcut
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg$1(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== 'number' || hashLen < 2)
        throw new Error('hashLen must be a number');
    if (typeof qByteLen !== 'number' || qByteLen < 2)
        throw new Error('qByteLen must be a number');
    if (typeof hmacFn !== 'function')
        throw new Error('hmacFn must be a function');
    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
    let v = u8n$1(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
    let k = u8n$1(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
    let i = 0; // Iterations counter, will throw when over 1000
    const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
    const reseed = (seed = u8n$1()) => {
        // HMAC-DRBG reseed() function. Steps D-G
        k = h(u8fr$1([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
        v = h(); // v = hmac(k || v)
        if (seed.length === 0)
            return;
        k = h(u8fr$1([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
        v = h(); // v = hmac(k || v)
    };
    const gen = () => {
        // HMAC-DRBG generate() function
        if (i++ >= 1000)
            throw new Error('drbg: tried 1000 values');
        let len = 0;
        const out = [];
        while (len < qByteLen) {
            v = h();
            const sl = v.slice();
            out.push(sl);
            len += v.length;
        }
        return concatBytes$2(...out);
    };
    const genUntil = (seed, pred) => {
        reset();
        reseed(seed); // Steps D-G
        let res = undefined; // Step H: grind until k is in [1..n-1]
        while (!(res = pred(gen())))
            reseed();
        reset();
        return res;
    };
    return genUntil;
}
// Validating curves and fields
const validatorFns$1 = {
    bigint: (val) => typeof val === 'bigint',
    function: (val) => typeof val === 'function',
    boolean: (val) => typeof val === 'boolean',
    string: (val) => typeof val === 'string',
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === 'function' && Number.isSafeInteger(val.outputLen),
};
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
function validateObject$1(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns$1[type];
        if (typeof checkVal !== 'function')
            throw new Error(`Invalid validator "${type}", expected function`);
        const val = object[fieldName];
        if (isOptional && val === undefined)
            return;
        if (!checkVal(val, object)) {
            throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
        }
    };
    for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
    return object;
}
// validate type tests
// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
// // Should fail type-check
// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });

var ut$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bitGet: bitGet$1,
    bitLen: bitLen$1,
    bitMask: bitMask$1,
    bitSet: bitSet$1,
    bytesToHex: bytesToHex$2,
    bytesToNumberBE: bytesToNumberBE$1,
    bytesToNumberLE: bytesToNumberLE$1,
    concatBytes: concatBytes$2,
    createHmacDrbg: createHmacDrbg$1,
    ensureBytes: ensureBytes$2,
    equalBytes: equalBytes$2,
    hexToBytes: hexToBytes$1,
    hexToNumber: hexToNumber$1,
    numberToBytesBE: numberToBytesBE$1,
    numberToBytesLE: numberToBytesLE$1,
    numberToHexUnpadded: numberToHexUnpadded$1,
    numberToVarBytesBE: numberToVarBytesBE$1,
    utf8ToBytes: utf8ToBytes$3,
    validateObject: validateObject$1
});

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Utilities for modular arithmetics and finite fields
// prettier-ignore
const _0n$7 = BigInt(0), _1n$8 = BigInt(1), _2n$4 = BigInt(2), _3n$3 = BigInt(3);
// prettier-ignore
const _4n$1 = BigInt(4), _5n$1 = BigInt(5), _8n$1 = BigInt(8);
// prettier-ignore
BigInt(9); BigInt(16);
// Calculates a modulo b
function mod$1(a, b) {
    const result = a % b;
    return result >= _0n$7 ? result : b + result;
}
/**
 * Efficiently raise num to power and do modular division.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 * @example
 * pow(2n, 6n, 11n) // 64n % 11n == 9n
 */
// TODO: use field version && remove
function pow$1(num, power, modulo) {
    if (modulo <= _0n$7 || power < _0n$7)
        throw new Error('Expected power/modulo > 0');
    if (modulo === _1n$8)
        return _0n$7;
    let res = _1n$8;
    while (power > _0n$7) {
        if (power & _1n$8)
            res = (res * num) % modulo;
        num = (num * num) % modulo;
        power >>= _1n$8;
    }
    return res;
}
// Does x ^ (2 ^ power) mod p. pow2(30, 4) == 30 ^ (2 ^ 4)
function pow2$1(x, power, modulo) {
    let res = x;
    while (power-- > _0n$7) {
        res *= res;
        res %= modulo;
    }
    return res;
}
// Inverses number over modulo
function invert$1(number, modulo) {
    if (number === _0n$7 || modulo <= _0n$7) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    // Euclidean GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
    let a = mod$1(number, modulo);
    let b = modulo;
    // prettier-ignore
    let x = _0n$7, u = _1n$8;
    while (a !== _0n$7) {
        // JIT applies optimization if those two lines follow each other
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        // prettier-ignore
        b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n$8)
        throw new Error('invert: does not exist');
    return mod$1(x, modulo);
}
// Tonelli-Shanks algorithm
// Paper 1: https://eprint.iacr.org/2012/685.pdf (page 12)
// Paper 2: Square Roots from 1; 24, 51, 10 to Dan Shanks
function tonelliShanks$1(P) {
    // Legendre constant: used to calculate Legendre symbol (a | p),
    // which denotes the value of a^((p-1)/2) (mod p).
    // (a | p) ≡ 1    if a is a square (mod p)
    // (a | p) ≡ -1   if a is not a square (mod p)
    // (a | p) ≡ 0    if a ≡ 0 (mod p)
    const legendreC = (P - _1n$8) / _2n$4;
    let Q, S, Z;
    // Step 1: By factoring out powers of 2 from p - 1,
    // find q and s such that p - 1 = q*(2^s) with q odd
    for (Q = P - _1n$8, S = 0; Q % _2n$4 === _0n$7; Q /= _2n$4, S++)
        ;
    // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
    for (Z = _2n$4; Z < P && pow$1(Z, legendreC, P) !== P - _1n$8; Z++)
        ;
    // Fast-path
    if (S === 1) {
        const p1div4 = (P + _1n$8) / _4n$1;
        return function tonelliFast(Fp, n) {
            const root = Fp.pow(n, p1div4);
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Slow-path
    const Q1div2 = (Q + _1n$8) / _2n$4;
    return function tonelliSlow(Fp, n) {
        // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
        if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
            throw new Error('Cannot find square root');
        let r = S;
        // TODO: will fail at Fp2/etc
        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
        let x = Fp.pow(n, Q1div2); // first guess at the square root
        let b = Fp.pow(n, Q); // first guess at the fudge factor
        while (!Fp.eql(b, Fp.ONE)) {
            if (Fp.eql(b, Fp.ZERO))
                return Fp.ZERO; // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm (4. If t = 0, return r = 0)
            // Find m such b^(2^m)==1
            let m = 1;
            for (let t2 = Fp.sqr(b); m < r; m++) {
                if (Fp.eql(t2, Fp.ONE))
                    break;
                t2 = Fp.sqr(t2); // t2 *= t2
            }
            // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift, otherwise there will be overflow
            const ge = Fp.pow(g, _1n$8 << BigInt(r - m - 1)); // ge = 2^(r-m-1)
            g = Fp.sqr(ge); // g = ge * ge
            x = Fp.mul(x, ge); // x *= ge
            b = Fp.mul(b, g); // b *= g
            r = m;
        }
        return x;
    };
}
function FpSqrt$1(P) {
    // NOTE: different algorithms can give different roots, it is up to user to decide which one they want.
    // For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
    // P ≡ 3 (mod 4)
    // √n = n^((P+1)/4)
    if (P % _4n$1 === _3n$3) {
        // Not all roots possible!
        // const ORDER =
        //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
        // const NUM = 72057594037927816n;
        const p1div4 = (P + _1n$8) / _4n$1;
        return function sqrt3mod4(Fp, n) {
            const root = Fp.pow(n, p1div4);
            // Throw if root**2 != n
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
    if (P % _8n$1 === _5n$1) {
        const c1 = (P - _5n$1) / _8n$1;
        return function sqrt5mod8(Fp, n) {
            const n2 = Fp.mul(n, _2n$4);
            const v = Fp.pow(n2, c1);
            const nv = Fp.mul(n, v);
            const i = Fp.mul(Fp.mul(nv, _2n$4), v);
            const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Other cases: Tonelli-Shanks algorithm
    return tonelliShanks$1(P);
}
// prettier-ignore
const FIELD_FIELDS$1 = [
    'create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr',
    'eql', 'add', 'sub', 'mul', 'pow', 'div',
    'addN', 'subN', 'mulN', 'sqrN'
];
function validateField$1(field) {
    const initial = {
        ORDER: 'bigint',
        MASK: 'bigint',
        BYTES: 'isSafeInteger',
        BITS: 'isSafeInteger',
    };
    const opts = FIELD_FIELDS$1.reduce((map, val) => {
        map[val] = 'function';
        return map;
    }, initial);
    return validateObject$1(field, opts);
}
// Generic field functions
function FpPow$1(f, num, power) {
    // Should have same speed as pow for bigints
    // TODO: benchmark!
    if (power < _0n$7)
        throw new Error('Expected power > 0');
    if (power === _0n$7)
        return f.ONE;
    if (power === _1n$8)
        return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n$7) {
        if (power & _1n$8)
            p = f.mul(p, d);
        d = f.sqr(d);
        power >>= _1n$8;
    }
    return p;
}
// 0 is non-invertible: non-batched version will throw on 0
function FpInvertBatch$1(f, nums) {
    const tmp = new Array(nums.length);
    // Walk from first to last, multiply them by each other MOD p
    const lastMultiplied = nums.reduce((acc, num, i) => {
        if (f.is0(num))
            return acc;
        tmp[i] = acc;
        return f.mul(acc, num);
    }, f.ONE);
    // Invert last element
    const inverted = f.inv(lastMultiplied);
    // Walk from last to first, multiply them by inverted each other MOD p
    nums.reduceRight((acc, num, i) => {
        if (f.is0(num))
            return acc;
        tmp[i] = f.mul(acc, tmp[i]);
        return f.mul(acc, num);
    }, inverted);
    return tmp;
}
// CURVE.n lengths
function nLength$1(n, nBitLength) {
    // Bit size, byte size of CURVE.n
    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
}
/**
 * Initializes a galois field over prime. Non-primes are not supported for now.
 * Do not init in loop: slow. Very fragile: always run a benchmark on change.
 * Major performance gains:
 * a) non-normalized operations like mulN instead of mul
 * b) `Object.freeze`
 * c) Same object shape: never add or remove keys
 * @param ORDER prime positive bigint
 * @param bitLen how many bits the field consumes
 * @param isLE (def: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field$1(ORDER, bitLen, isLE = false, redef = {}) {
    if (ORDER <= _0n$7)
        throw new Error(`Expected Fp ORDER > 0, got ${ORDER}`);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength$1(ORDER, bitLen);
    if (BYTES > 2048)
        throw new Error('Field lengths over 2048 bytes are not supported');
    const sqrtP = FpSqrt$1(ORDER);
    const f = Object.freeze({
        ORDER,
        BITS,
        BYTES,
        MASK: bitMask$1(BITS),
        ZERO: _0n$7,
        ONE: _1n$8,
        create: (num) => mod$1(num, ORDER),
        isValid: (num) => {
            if (typeof num !== 'bigint')
                throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
            return _0n$7 <= num && num < ORDER; // 0 is valid element, but it's not invertible
        },
        is0: (num) => num === _0n$7,
        isOdd: (num) => (num & _1n$8) === _1n$8,
        neg: (num) => mod$1(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod$1(num * num, ORDER),
        add: (lhs, rhs) => mod$1(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod$1(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod$1(lhs * rhs, ORDER),
        pow: (num, power) => FpPow$1(f, num, power),
        div: (lhs, rhs) => mod$1(lhs * invert$1(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert$1(num, ORDER),
        sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
        invertBatch: (lst) => FpInvertBatch$1(f, lst),
        // TODO: do we really need constant cmov?
        // We don't have const-time bigints anyway, so probably will be not very useful
        cmov: (a, b, c) => (c ? b : a),
        toBytes: (num) => (isLE ? numberToBytesLE$1(num, BYTES) : numberToBytesBE$1(num, BYTES)),
        fromBytes: (bytes) => {
            if (bytes.length !== BYTES)
                throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
            return isLE ? bytesToNumberLE$1(bytes) : bytesToNumberBE$1(bytes);
        },
    });
    return Object.freeze(f);
}
/**
 * FIPS 186 B.4.1-compliant "constant-time" private key generation utility.
 * Can take (n+8) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 40 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. curveFn.CURVE.n)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function hashToPrivateScalar(hash, groupOrder, isLE = false) {
    hash = ensureBytes$2('privateHash', hash);
    const hashLen = hash.length;
    const minLen = nLength$1(groupOrder).nByteLength + 8;
    if (minLen < 24 || hashLen < minLen || hashLen > 1024)
        throw new Error(`hashToPrivateScalar: expected ${minLen}-1024 bytes of input, got ${hashLen}`);
    const num = isLE ? bytesToNumberLE$1(hash) : bytesToNumberBE$1(hash);
    return mod$1(num, groupOrder - _1n$8) + _1n$8;
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Abelian group utilities
const _0n$6 = BigInt(0);
const _1n$7 = BigInt(1);
// Elliptic curve multiplication of Point by scalar. Fragile.
// Scalars should always be less than curve order: this should be checked inside of a curve itself.
// Creates precomputation tables for fast multiplication:
// - private scalar is split by fixed size windows of W bits
// - every window point is collected from window's table & added to accumulator
// - since windows are different, same point inside tables won't be accessed more than once per calc
// - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
// - +1 window is neccessary for wNAF
// - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
// TODO: Research returning 2d JS array of windows, instead of a single window. This would allow
// windows to be in different memory locations
function wNAF$1(c, bits) {
    const constTimeNegate = (condition, item) => {
        const neg = item.negate();
        return condition ? neg : item;
    };
    const opts = (W) => {
        const windows = Math.ceil(bits / W) + 1; // +1, because
        const windowSize = 2 ** (W - 1); // -1 because we skip zero
        return { windows, windowSize };
    };
    return {
        constTimeNegate,
        // non-const time multiplication ladder
        unsafeLadder(elm, n) {
            let p = c.ZERO;
            let d = elm;
            while (n > _0n$6) {
                if (n & _1n$7)
                    p = p.add(d);
                d = d.double();
                n >>= _1n$7;
            }
            return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(elm, W) {
            const { windows, windowSize } = opts(W);
            const points = [];
            let p = elm;
            let base = p;
            for (let window = 0; window < windows; window++) {
                base = p;
                points.push(base);
                // =1, because we skip zero
                for (let i = 1; i < windowSize; i++) {
                    base = base.add(p);
                    points.push(base);
                }
                p = base.double();
            }
            return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
            // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
            // But need to carefully remove other checks before wNAF. ORDER == bits here
            const { windows, windowSize } = opts(W);
            let p = c.ZERO;
            let f = c.BASE;
            const mask = BigInt(2 ** W - 1); // Create mask with W ones: 0b1111 for W=4 etc.
            const maxNumber = 2 ** W;
            const shiftBy = BigInt(W);
            for (let window = 0; window < windows; window++) {
                const offset = window * windowSize;
                // Extract W bits.
                let wbits = Number(n & mask);
                // Shift number by W bits.
                n >>= shiftBy;
                // If the bits are bigger than max size, we'll split those.
                // +224 => 256 - 32
                if (wbits > windowSize) {
                    wbits -= maxNumber;
                    n += _1n$7;
                }
                // This code was first written with assumption that 'f' and 'p' will never be infinity point:
                // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
                // there is negate now: it is possible that negated element from low value
                // would be the same as high element, which will create carry into next window.
                // It's not obvious how this can fail, but still worth investigating later.
                // Check if we're onto Zero point.
                // Add random point inside current window to f.
                const offset1 = offset;
                const offset2 = offset + Math.abs(wbits) - 1; // -1 because we skip zero
                const cond1 = window % 2 !== 0;
                const cond2 = wbits < 0;
                if (wbits === 0) {
                    // The most important part for const-time getPublicKey
                    f = f.add(constTimeNegate(cond1, precomputes[offset1]));
                }
                else {
                    p = p.add(constTimeNegate(cond2, precomputes[offset2]));
                }
            }
            // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
            // Even if the variable is still unused, there are some checks which will
            // throw an exception, so compiler needs to prove they won't happen, which is hard.
            // At this point there is a way to F be infinity-point even if p is not,
            // which makes it less const-time: around 1 bigint multiply.
            return { p, f };
        },
        wNAFCached(P, precomputesMap, n, transform) {
            // @ts-ignore
            const W = P._WINDOW_SIZE || 1;
            // Calculate precomputes on a first run, reuse them after
            let comp = precomputesMap.get(P);
            if (!comp) {
                comp = this.precomputeWindow(P, W);
                if (W !== 1) {
                    precomputesMap.set(P, transform(comp));
                }
            }
            return this.wNAF(W, comp, n);
        },
    };
}
function validateBasic$1(curve) {
    validateField$1(curve.Fp);
    validateObject$1(curve, {
        n: 'bigint',
        h: 'bigint',
        Gx: 'field',
        Gy: 'field',
    }, {
        nBitLength: 'isSafeInteger',
        nByteLength: 'isSafeInteger',
    });
    // Set defaults
    return Object.freeze({
        ...nLength$1(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER },
    });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Short Weierstrass curve. The formula is: y² = x³ + ax + b
function validatePointOpts$1(curve) {
    const opts = validateBasic$1(curve);
    validateObject$1(opts, {
        a: 'field',
        b: 'field',
    }, {
        allowedPrivateKeyLengths: 'array',
        wrapPrivateKey: 'boolean',
        isTorsionFree: 'function',
        clearCofactor: 'function',
        allowInfinityPoint: 'boolean',
        fromBytes: 'function',
        toBytes: 'function',
    });
    const { endo, Fp, a } = opts;
    if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
            throw new Error('Endomorphism can only be defined for Koblitz curves that have a=0');
        }
        if (typeof endo !== 'object' ||
            typeof endo.beta !== 'bigint' ||
            typeof endo.splitScalar !== 'function') {
            throw new Error('Expected endomorphism with beta: bigint and splitScalar: function');
        }
    }
    return Object.freeze({ ...opts });
}
// ASN.1 DER encoding utilities
const { bytesToNumberBE: b2n$1, hexToBytes: h2b$1 } = ut$1;
const DER$1 = {
    // asn.1 DER encoding utils
    Err: class DERErr extends Error {
        constructor(m = '') {
            super(m);
        }
    },
    _parseInt(data) {
        const { Err: E } = DER$1;
        if (data.length < 2 || data[0] !== 0x02)
            throw new E('Invalid signature integer tag');
        const len = data[1];
        const res = data.subarray(2, len + 2);
        if (!len || res.length !== len)
            throw new E('Invalid signature integer: wrong length');
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        if (res[0] & 0b10000000)
            throw new E('Invalid signature integer: negative');
        if (res[0] === 0x00 && !(res[1] & 0b10000000))
            throw new E('Invalid signature integer: unnecessary leading zero');
        return { d: b2n$1(res), l: data.subarray(len + 2) }; // d is data, l is left
    },
    toSig(hex) {
        // parse DER signature
        const { Err: E } = DER$1;
        const data = typeof hex === 'string' ? h2b$1(hex) : hex;
        if (!(data instanceof Uint8Array))
            throw new Error('ui8a expected');
        let l = data.length;
        if (l < 2 || data[0] != 0x30)
            throw new E('Invalid signature tag');
        if (data[1] !== l - 2)
            throw new E('Invalid signature: incorrect length');
        const { d: r, l: sBytes } = DER$1._parseInt(data.subarray(2));
        const { d: s, l: rBytesLeft } = DER$1._parseInt(sBytes);
        if (rBytesLeft.length)
            throw new E('Invalid signature: left bytes after parsing');
        return { r, s };
    },
    hexFromSig(sig) {
        // Add leading zero if first byte has negative bit enabled. More details in '_parseInt'
        const slice = (s) => (Number.parseInt(s[0], 16) & 0b1000 ? '00' + s : s);
        const h = (num) => {
            const hex = num.toString(16);
            return hex.length & 1 ? `0${hex}` : hex;
        };
        const s = slice(h(sig.s));
        const r = slice(h(sig.r));
        const shl = s.length / 2;
        const rhl = r.length / 2;
        const sl = h(shl);
        const rl = h(rhl);
        return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
    },
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n$5 = BigInt(0), _1n$6 = BigInt(1); BigInt(2); const _3n$2 = BigInt(3); BigInt(4);
function weierstrassPoints$1(opts) {
    const CURVE = validatePointOpts$1(opts);
    const { Fp } = CURVE; // All curves has same field / group length as for now, but they can differ
    const toBytes = CURVE.toBytes ||
        ((c, point, isCompressed) => {
            const a = point.toAffine();
            return concatBytes$2(Uint8Array.from([0x04]), Fp.toBytes(a.x), Fp.toBytes(a.y));
        });
    const fromBytes = CURVE.fromBytes ||
        ((bytes) => {
            // const head = bytes[0];
            const tail = bytes.subarray(1);
            // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
        });
    /**
     * y² = x³ + ax + b: Short weierstrass curve formula
     * @returns y²
     */
    function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x); // x * x
        const x3 = Fp.mul(x2, x); // x2 * x
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
    }
    // Validate whether the passed curve params are valid.
    // We check if curve equation works for generator point.
    // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
    // ProjectivePoint class has not been initialized yet.
    if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error('bad generator point: equation left != right');
    // Valid group elements reside in range 1..n-1
    function isWithinCurveOrder(num) {
        return typeof num === 'bigint' && _0n$5 < num && num < CURVE.n;
    }
    function assertGE(num) {
        if (!isWithinCurveOrder(num))
            throw new Error('Expected valid bigint: 0 < bigint < curve.n');
    }
    // Validates if priv key is valid and converts it to bigint.
    // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
    function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
        if (lengths && typeof key !== 'bigint') {
            if (key instanceof Uint8Array)
                key = bytesToHex$2(key);
            // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
            if (typeof key !== 'string' || !lengths.includes(key.length))
                throw new Error('Invalid key');
            key = key.padStart(nByteLength * 2, '0');
        }
        let num;
        try {
            num =
                typeof key === 'bigint'
                    ? key
                    : bytesToNumberBE$1(ensureBytes$2('private key', key, nByteLength));
        }
        catch (error) {
            throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
        }
        if (wrapPrivateKey)
            num = mod$1(num, n); // disabled by default, enabled for BLS
        assertGE(num); // num in range [1..N-1]
        return num;
    }
    const pointPrecomputes = new Map();
    function assertPrjPoint(other) {
        if (!(other instanceof Point))
            throw new Error('ProjectivePoint expected');
    }
    /**
     * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
     * Default Point works in 2d / affine coordinates: (x, y)
     * We're doing calculations in projective, because its operations don't require costly inversion.
     */
    class Point {
        constructor(px, py, pz) {
            this.px = px;
            this.py = py;
            this.pz = pz;
            if (px == null || !Fp.isValid(px))
                throw new Error('x required');
            if (py == null || !Fp.isValid(py))
                throw new Error('y required');
            if (pz == null || !Fp.isValid(pz))
                throw new Error('z required');
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
            const { x, y } = p || {};
            if (!p || !Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('invalid affine point');
            if (p instanceof Point)
                throw new Error('projective point not allowed');
            const is0 = (i) => Fp.eql(i, Fp.ZERO);
            // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
            if (is0(x) && is0(y))
                return Point.ZERO;
            return new Point(x, y, Fp.ONE);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
            const toInv = Fp.invertBatch(points.map((p) => p.pz));
            return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex) {
            const P = Point.fromAffine(fromBytes(ensureBytes$2('pointHex', hex)));
            P.assertValidity();
            return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
            return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
            this._WINDOW_SIZE = windowSize;
            pointPrecomputes.delete(this);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
            // Zero is valid point too!
            if (this.is0()) {
                if (CURVE.allowInfinityPoint)
                    return;
                throw new Error('bad point: ZERO');
            }
            // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
            const { x, y } = this.toAffine();
            // Check if x, y are valid field elements
            if (!Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('bad point: x or y not FE');
            const left = Fp.sqr(y); // y²
            const right = weierstrassEquation(x); // x³ + ax + b
            if (!Fp.eql(left, right))
                throw new Error('bad point: equation left != right');
            if (!this.isTorsionFree())
                throw new Error('bad point: not in prime-order subgroup');
        }
        hasEvenY() {
            const { y } = this.toAffine();
            if (Fp.isOdd)
                return !Fp.isOdd(y);
            throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
            assertPrjPoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
            return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
            return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
            const { a, b } = CURVE;
            const b3 = Fp.mul(b, _3n$2);
            const { px: X1, py: Y1, pz: Z1 } = this;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            let t0 = Fp.mul(X1, X1); // step 1
            let t1 = Fp.mul(Y1, Y1);
            let t2 = Fp.mul(Z1, Z1);
            let t3 = Fp.mul(X1, Y1);
            t3 = Fp.add(t3, t3); // step 5
            Z3 = Fp.mul(X1, Z1);
            Z3 = Fp.add(Z3, Z3);
            X3 = Fp.mul(a, Z3);
            Y3 = Fp.mul(b3, t2);
            Y3 = Fp.add(X3, Y3); // step 10
            X3 = Fp.sub(t1, Y3);
            Y3 = Fp.add(t1, Y3);
            Y3 = Fp.mul(X3, Y3);
            X3 = Fp.mul(t3, X3);
            Z3 = Fp.mul(b3, Z3); // step 15
            t2 = Fp.mul(a, t2);
            t3 = Fp.sub(t0, t2);
            t3 = Fp.mul(a, t3);
            t3 = Fp.add(t3, Z3);
            Z3 = Fp.add(t0, t0); // step 20
            t0 = Fp.add(Z3, t0);
            t0 = Fp.add(t0, t2);
            t0 = Fp.mul(t0, t3);
            Y3 = Fp.add(Y3, t0);
            t2 = Fp.mul(Y1, Z1); // step 25
            t2 = Fp.add(t2, t2);
            t0 = Fp.mul(t2, t3);
            X3 = Fp.sub(X3, t0);
            Z3 = Fp.mul(t2, t1);
            Z3 = Fp.add(Z3, Z3); // step 30
            Z3 = Fp.add(Z3, Z3);
            return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
            assertPrjPoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            const a = CURVE.a;
            const b3 = Fp.mul(CURVE.b, _3n$2);
            let t0 = Fp.mul(X1, X2); // step 1
            let t1 = Fp.mul(Y1, Y2);
            let t2 = Fp.mul(Z1, Z2);
            let t3 = Fp.add(X1, Y1);
            let t4 = Fp.add(X2, Y2); // step 5
            t3 = Fp.mul(t3, t4);
            t4 = Fp.add(t0, t1);
            t3 = Fp.sub(t3, t4);
            t4 = Fp.add(X1, Z1);
            let t5 = Fp.add(X2, Z2); // step 10
            t4 = Fp.mul(t4, t5);
            t5 = Fp.add(t0, t2);
            t4 = Fp.sub(t4, t5);
            t5 = Fp.add(Y1, Z1);
            X3 = Fp.add(Y2, Z2); // step 15
            t5 = Fp.mul(t5, X3);
            X3 = Fp.add(t1, t2);
            t5 = Fp.sub(t5, X3);
            Z3 = Fp.mul(a, t4);
            X3 = Fp.mul(b3, t2); // step 20
            Z3 = Fp.add(X3, Z3);
            X3 = Fp.sub(t1, Z3);
            Z3 = Fp.add(t1, Z3);
            Y3 = Fp.mul(X3, Z3);
            t1 = Fp.add(t0, t0); // step 25
            t1 = Fp.add(t1, t0);
            t2 = Fp.mul(a, t2);
            t4 = Fp.mul(b3, t4);
            t1 = Fp.add(t1, t2);
            t2 = Fp.sub(t0, t2); // step 30
            t2 = Fp.mul(a, t2);
            t4 = Fp.add(t4, t2);
            t0 = Fp.mul(t1, t4);
            Y3 = Fp.add(Y3, t0);
            t0 = Fp.mul(t5, t4); // step 35
            X3 = Fp.mul(t3, X3);
            X3 = Fp.sub(X3, t0);
            t0 = Fp.mul(t3, t1);
            Z3 = Fp.mul(t5, Z3);
            Z3 = Fp.add(Z3, t0); // step 40
            return new Point(X3, Y3, Z3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        wNAF(n) {
            return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
                const toInv = Fp.invertBatch(comp.map((p) => p.pz));
                return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
            });
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(n) {
            const I = Point.ZERO;
            if (n === _0n$5)
                return I;
            assertGE(n); // Will throw on 0
            if (n === _1n$6)
                return this;
            const { endo } = CURVE;
            if (!endo)
                return wnaf.unsafeLadder(this, n);
            // Apply endomorphism
            let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
            let k1p = I;
            let k2p = I;
            let d = this;
            while (k1 > _0n$5 || k2 > _0n$5) {
                if (k1 & _1n$6)
                    k1p = k1p.add(d);
                if (k2 & _1n$6)
                    k2p = k2p.add(d);
                d = d.double();
                k1 >>= _1n$6;
                k2 >>= _1n$6;
            }
            if (k1neg)
                k1p = k1p.negate();
            if (k2neg)
                k2p = k2p.negate();
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
            assertGE(scalar);
            let n = scalar;
            let point, fake; // Fake point is used to const-time mult
            const { endo } = CURVE;
            if (endo) {
                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
                let { p: k1p, f: f1p } = this.wNAF(k1);
                let { p: k2p, f: f2p } = this.wNAF(k2);
                k1p = wnaf.constTimeNegate(k1neg, k1p);
                k2p = wnaf.constTimeNegate(k2neg, k2p);
                k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
                point = k1p.add(k2p);
                fake = f1p.add(f2p);
            }
            else {
                const { p, f } = this.wNAF(n);
                point = p;
                fake = f;
            }
            // Normalize `z` for both points, but return only real one
            return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
            const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
            const mul = (P, a // Select faster multiply() method
            ) => (a === _0n$5 || a === _1n$6 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a));
            const sum = mul(this, a).add(mul(Q, b));
            return sum.is0() ? undefined : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
            const { px: x, py: y, pz: z } = this;
            const is0 = this.is0();
            // If invZ was 0, we return zero point. However we still want to execute
            // all operations, so we replace invZ with a random number, 1.
            if (iz == null)
                iz = is0 ? Fp.ONE : Fp.inv(z);
            const ax = Fp.mul(x, iz);
            const ay = Fp.mul(y, iz);
            const zz = Fp.mul(z, iz);
            if (is0)
                return { x: Fp.ZERO, y: Fp.ZERO };
            if (!Fp.eql(zz, Fp.ONE))
                throw new Error('invZ was invalid');
            return { x: ax, y: ay };
        }
        isTorsionFree() {
            const { h: cofactor, isTorsionFree } = CURVE;
            if (cofactor === _1n$6)
                return true; // No subgroups, always torsion-free
            if (isTorsionFree)
                return isTorsionFree(Point, this);
            throw new Error('isTorsionFree() has not been declared for the elliptic curve');
        }
        clearCofactor() {
            const { h: cofactor, clearCofactor } = CURVE;
            if (cofactor === _1n$6)
                return this; // Fast-path
            if (clearCofactor)
                return clearCofactor(Point, this);
            return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
            this.assertValidity();
            return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
            return bytesToHex$2(this.toRawBytes(isCompressed));
        }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const _bits = CURVE.nBitLength;
    const wnaf = wNAF$1(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
    // Validate if generator point is on curve
    return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder,
    };
}
function validateOpts$1(curve) {
    const opts = validateBasic$1(curve);
    validateObject$1(opts, {
        hash: 'hash',
        hmac: 'function',
        randomBytes: 'function',
    }, {
        bits2int: 'function',
        bits2int_modN: 'function',
        lowS: 'boolean',
    });
    return Object.freeze({ lowS: true, ...opts });
}
function weierstrass$1(curveDef) {
    const CURVE = validateOpts$1(curveDef);
    const { Fp, n: CURVE_ORDER } = CURVE;
    const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
    const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
    function isValidFieldElement(num) {
        return _0n$5 < num && num < Fp.ORDER; // 0 is banned since it's not invertible FE
    }
    function modN(a) {
        return mod$1(a, CURVE_ORDER);
    }
    function invN(a) {
        return invert$1(a, CURVE_ORDER);
    }
    const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder, } = weierstrassPoints$1({
        ...CURVE,
        toBytes(c, point, isCompressed) {
            const a = point.toAffine();
            const x = Fp.toBytes(a.x);
            const cat = concatBytes$2;
            if (isCompressed) {
                return cat(Uint8Array.from([point.hasEvenY() ? 0x02 : 0x03]), x);
            }
            else {
                return cat(Uint8Array.from([0x04]), x, Fp.toBytes(a.y));
            }
        },
        fromBytes(bytes) {
            const len = bytes.length;
            const head = bytes[0];
            const tail = bytes.subarray(1);
            // this.assertValidity() is done inside of fromHex
            if (len === compressedLen && (head === 0x02 || head === 0x03)) {
                const x = bytesToNumberBE$1(tail);
                if (!isValidFieldElement(x))
                    throw new Error('Point is not on curve');
                const y2 = weierstrassEquation(x); // y² = x³ + ax + b
                let y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
                const isYOdd = (y & _1n$6) === _1n$6;
                // ECDSA
                const isHeadOdd = (head & 1) === 1;
                if (isHeadOdd !== isYOdd)
                    y = Fp.neg(y);
                return { x, y };
            }
            else if (len === uncompressedLen && head === 0x04) {
                const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
                const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
                return { x, y };
            }
            else {
                throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
            }
        },
    });
    const numToNByteStr = (num) => bytesToHex$2(numberToBytesBE$1(num, CURVE.nByteLength));
    function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n$6;
        return number > HALF;
    }
    function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    // slice bytes num
    const slcNum = (b, from, to) => bytesToNumberBE$1(b.slice(from, to));
    /**
     * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
     */
    class Signature {
        constructor(r, s, recovery) {
            this.r = r;
            this.s = s;
            this.recovery = recovery;
            this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
            const l = CURVE.nByteLength;
            hex = ensureBytes$2('compactSignature', hex, l * 2);
            return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
            const { r, s } = DER$1.toSig(ensureBytes$2('DER', hex));
            return new Signature(r, s);
        }
        assertValidity() {
            // can use assertGE here
            if (!isWithinCurveOrder(this.r))
                throw new Error('r must be 0 < r < CURVE.n');
            if (!isWithinCurveOrder(this.s))
                throw new Error('s must be 0 < s < CURVE.n');
        }
        addRecoveryBit(recovery) {
            return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
            const { r, s, recovery: rec } = this;
            const h = bits2int_modN(ensureBytes$2('msgHash', msgHash)); // Truncate hash
            if (rec == null || ![0, 1, 2, 3].includes(rec))
                throw new Error('recovery id invalid');
            const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
            if (radj >= Fp.ORDER)
                throw new Error('recovery id 2 or 3 invalid');
            const prefix = (rec & 1) === 0 ? '02' : '03';
            const R = Point.fromHex(prefix + numToNByteStr(radj));
            const ir = invN(radj); // r^-1
            const u1 = modN(-h * ir); // -hr^-1
            const u2 = modN(s * ir); // sr^-1
            const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
            if (!Q)
                throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
            Q.assertValidity();
            return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
            return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
            return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
            return hexToBytes$1(this.toDERHex());
        }
        toDERHex() {
            return DER$1.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
            return hexToBytes$1(this.toCompactHex());
        }
        toCompactHex() {
            return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
    }
    const utils = {
        isValidPrivateKey(privateKey) {
            try {
                normPrivateKeyToScalar(privateKey);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        normPrivateKeyToScalar: normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size (nBitLength+64)
         * as per FIPS 186 B.4.1 with modulo bias being neglible.
         */
        randomPrivateKey: () => {
            const rand = CURVE.randomBytes(Fp.BYTES + 8);
            const num = hashToPrivateScalar(rand, CURVE_ORDER);
            return numberToBytesBE$1(num, CURVE.nByteLength);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
            point._setWindowSize(windowSize);
            point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
            return point;
        },
    };
    /**
     * Computes public key for a private key. Checks for validity of the private key.
     * @param privateKey private key
     * @param isCompressed whether to return compact (default), or full key
     * @returns Public key, full when isCompressed=false; short when isCompressed=true
     */
    function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    /**
     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
     */
    function isProbPub(item) {
        const arr = item instanceof Uint8Array;
        const str = typeof item === 'string';
        const len = (arr || str) && item.length;
        if (arr)
            return len === compressedLen || len === uncompressedLen;
        if (str)
            return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
            return true;
        return false;
    }
    /**
     * ECDH (Elliptic Curve Diffie Hellman).
     * Computes shared public key from private key and public key.
     * Checks: 1) private key validity 2) shared key is on-curve.
     * Does NOT hash the result.
     * @param privateA private key
     * @param publicB different public key
     * @param isCompressed whether to return compact (default), or full key
     * @returns shared public key
     */
    function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
            throw new Error('first arg must be private key');
        if (!isProbPub(publicB))
            throw new Error('second arg must be public key');
        const b = Point.fromHex(publicB); // check for being on-curve
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
    const bits2int = CURVE.bits2int ||
        function (bytes) {
            // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
            // for some cases, since bytes.length * 8 is not actual bitLength.
            const num = bytesToNumberBE$1(bytes); // check for == u8 done here
            const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
            return delta > 0 ? num >> BigInt(delta) : num;
        };
    const bits2int_modN = CURVE.bits2int_modN ||
        function (bytes) {
            return modN(bits2int(bytes)); // can't use bytesToNumberBE here
        };
    // NOTE: pads output with zero as per spec
    const ORDER_MASK = bitMask$1(CURVE.nBitLength);
    /**
     * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
     */
    function int2octets(num) {
        if (typeof num !== 'bigint')
            throw new Error('bigint expected');
        if (!(_0n$5 <= num && num < ORDER_MASK))
            throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
        // works with order, can have different size than numToField!
        return numberToBytesBE$1(num, CURVE.nByteLength);
    }
    // Steps A, D of RFC6979 3.2
    // Creates RFC6979 seed; converts msg/privKey to numbers.
    // Used only in sign, not in verify.
    // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order, this will be wrong at least for P521.
    // Also it can be bigger for P224 + SHA256
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (['recovered', 'canonical'].some((k) => k in opts))
            throw new Error('sign() legacy options not supported');
        const { hash, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts; // generates low-s sigs by default
        if (lowS == null)
            lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
        msgHash = ensureBytes$2('msgHash', msgHash);
        if (prehash)
            msgHash = ensureBytes$2('prehashed msgHash', hash(msgHash));
        // We can't later call bits2octets, since nested bits2int is broken for curves
        // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
        const seedArgs = [int2octets(d), int2octets(h1int)];
        // extraEntropy. RFC6979 3.6: additional k' (optional).
        if (ent != null) {
            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
            const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
            seedArgs.push(ensureBytes$2('extraEntropy', e, Fp.BYTES)); // check for being of size BYTES
        }
        const seed = concatBytes$2(...seedArgs); // Step D of RFC6979 3.2
        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
        // Converts signature params into point w r/s, checks result for validity.
        function k2sig(kBytes) {
            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
            const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
            if (!isWithinCurveOrder(k))
                return; // Important: all mod() calls here must be done over N
            const ik = invN(k); // k^-1 mod n
            const q = Point.BASE.multiply(k).toAffine(); // q = Gk
            const r = modN(q.x); // r = q.x mod n
            if (r === _0n$5)
                return;
            // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
            // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
            // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
            const s = modN(ik * modN(m + r * d)); // Not using blinding here
            if (s === _0n$5)
                return;
            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$6); // recovery bit (2 or 3, when q.x > n)
            let normS = s;
            if (lowS && isBiggerThanHalfOrder(s)) {
                normS = normalizeS(s); // if lowS was passed, ensure s is always
                recovery ^= 1; // // in the bottom half of N
            }
            return new Signature(r, normS, recovery); // use normS, not s
        }
        return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
    /**
     * Signs message hash with a private key.
     * ```
     * sign(m, d, k) where
     *   (x, y) = G × k
     *   r = x mod n
     *   s = (m + dr)/k mod n
     * ```
     * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
     * @param privKey private key
     * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
     * @returns signature with recovery param
     */
    function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
        const C = CURVE;
        const drbg = createHmacDrbg$1(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig); // Steps B, C, D, E, F, G
    }
    // Enable precomputes. Slows down first publicKey computation by 20ms.
    Point.BASE._setWindowSize(8);
    // utils.precompute(8, ProjectivePoint.BASE)
    /**
     * Verifies a signature against message hash and public key.
     * Rejects lowS signatures by default: to override,
     * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
     *
     * ```
     * verify(r, s, h, P) where
     *   U1 = hs^-1 mod n
     *   U2 = rs^-1 mod n
     *   R = U1⋅G - U2⋅P
     *   mod(R.x, n) == r
     * ```
     */
    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        const sg = signature;
        msgHash = ensureBytes$2('msgHash', msgHash);
        publicKey = ensureBytes$2('publicKey', publicKey);
        if ('strict' in opts)
            throw new Error('options.strict was renamed to lowS');
        const { lowS, prehash } = opts;
        let _sig = undefined;
        let P;
        try {
            if (typeof sg === 'string' || sg instanceof Uint8Array) {
                // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
                // Since DER can also be 2*nByteLength bytes, we check for it first.
                try {
                    _sig = Signature.fromDER(sg);
                }
                catch (derError) {
                    if (!(derError instanceof DER$1.Err))
                        throw derError;
                    _sig = Signature.fromCompact(sg);
                }
            }
            else if (typeof sg === 'object' && typeof sg.r === 'bigint' && typeof sg.s === 'bigint') {
                const { r, s } = sg;
                _sig = new Signature(r, s);
            }
            else {
                throw new Error('PARSE');
            }
            P = Point.fromHex(publicKey);
        }
        catch (error) {
            if (error.message === 'PARSE')
                throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
            return false;
        }
        if (lowS && _sig.hasHighS())
            return false;
        if (prehash)
            msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
        const is = invN(s); // s^-1
        const u1 = modN(h * is); // u1 = hs^-1 mod n
        const u2 = modN(r * is); // u2 = rs^-1 mod n
        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
        if (!R)
            return false;
        const v = modN(R.x);
        return v === r;
    }
    return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils,
    };
}

// HMAC (RFC 2104)
let HMAC$1 = class HMAC extends Hash$1 {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        assert$1.hash(hash);
        const key = toBytes$2(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        assert$1.exists(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        assert$1.exists(this);
        assert$1.bytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
};
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac$1 = (hash, key, message) => new HMAC$1(hash, key).update(message).digest();
hmac$1.create = (hash, key) => new HMAC$1(hash, key);

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// connects noble-curves to noble-hashes
function getHash$1(hash) {
    return {
        hash,
        hmac: (key, ...msgs) => hmac$1(hash, key, concatBytes$3(...msgs)),
        randomBytes: randomBytes$1,
    };
}
function createCurve$1(curveDef, defHash) {
    const create = (hash) => weierstrass$1({ ...curveDef, ...getHash$1(hash) });
    return Object.freeze({ ...create(defHash), create });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1P$1 = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const secp256k1N$1 = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const _1n$5 = BigInt(1);
const _2n$3 = BigInt(2);
const divNearest$1 = (a, b) => (a + b / _2n$3) / b;
/**
 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
 */
function sqrtMod$1(y) {
    const P = secp256k1P$1;
    // prettier-ignore
    const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    // prettier-ignore
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = (y * y * y) % P; // x^3, 11
    const b3 = (b2 * b2 * y) % P; // x^7
    const b6 = (pow2$1(b3, _3n, P) * b3) % P;
    const b9 = (pow2$1(b6, _3n, P) * b3) % P;
    const b11 = (pow2$1(b9, _2n$3, P) * b2) % P;
    const b22 = (pow2$1(b11, _11n, P) * b11) % P;
    const b44 = (pow2$1(b22, _22n, P) * b22) % P;
    const b88 = (pow2$1(b44, _44n, P) * b44) % P;
    const b176 = (pow2$1(b88, _88n, P) * b88) % P;
    const b220 = (pow2$1(b176, _44n, P) * b44) % P;
    const b223 = (pow2$1(b220, _3n, P) * b3) % P;
    const t1 = (pow2$1(b223, _23n, P) * b22) % P;
    const t2 = (pow2$1(t1, _6n, P) * b2) % P;
    const root = pow2$1(t2, _2n$3, P);
    if (!Fp$1.eql(Fp$1.sqr(root), y))
        throw new Error('Cannot find square root');
    return root;
}
const Fp$1 = Field$1(secp256k1P$1, undefined, undefined, { sqrt: sqrtMod$1 });
const secp256k1$1 = createCurve$1({
    a: BigInt(0),
    b: BigInt(7),
    Fp: Fp$1,
    n: secp256k1N$1,
    // Base point (x, y) aka generator point
    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
    h: BigInt(1),
    lowS: true,
    /**
     * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
     * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
     * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
     * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
     */
    endo: {
        beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
        splitScalar: (k) => {
            const n = secp256k1N$1;
            const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
            const b1 = -_1n$5 * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
            const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
            const b2 = a1;
            const POW_2_128 = BigInt('0x100000000000000000000000000000000'); // (2n**128n).toString(16)
            const c1 = divNearest$1(b2 * k, n);
            const c2 = divNearest$1(-b1 * k, n);
            let k1 = mod$1(k - c1 * a1 - c2 * a2, n);
            let k2 = mod$1(-c1 * b1 - c2 * b2, n);
            const k1neg = k1 > POW_2_128;
            const k2neg = k2 > POW_2_128;
            if (k1neg)
                k1 = n - k1;
            if (k2neg)
                k2 = n - k2;
            if (k1 > POW_2_128 || k2 > POW_2_128) {
                throw new Error('splitScalar: Endomorphism failed, k=' + k);
            }
            return { k1neg, k1, k2neg, k2 };
        },
    },
}, sha256$1);
// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
BigInt(0);
secp256k1$1.ProjectivePoint;

const Point$1 = secp256k1$1.ProjectivePoint;
const base58check = base58check$1(sha256$2);
function bytesToNumber(bytes) {
    return BigInt(`0x${bytesToHex$3(bytes)}`);
}
function numberToBytes(num) {
    return hexToBytes$2(num.toString(16).padStart(64, '0'));
}
const MASTER_SECRET = utf8ToBytes$5('Bitcoin seed');
const BITCOIN_VERSIONS = { private: 0x0488ade4, public: 0x0488b21e };
const HARDENED_OFFSET = 0x80000000;
const hash160 = (data) => ripemd160(sha256$2(data));
const fromU32 = (data) => createView$2(data).getUint32(0, false);
const toU32 = (n) => {
    if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
        throw new Error(`Invalid number=${n}. Should be from 0 to 2 ** 32 - 1`);
    }
    const buf = new Uint8Array(4);
    createView$2(buf).setUint32(0, n, false);
    return buf;
};
class HDKey {
    get fingerprint() {
        if (!this.pubHash) {
            throw new Error('No publicKey set!');
        }
        return fromU32(this.pubHash);
    }
    get identifier() {
        return this.pubHash;
    }
    get pubKeyHash() {
        return this.pubHash;
    }
    get privateKey() {
        return this.privKeyBytes || null;
    }
    get publicKey() {
        return this.pubKey || null;
    }
    get privateExtendedKey() {
        const priv = this.privateKey;
        if (!priv) {
            throw new Error('No private key');
        }
        return base58check.encode(this.serialize(this.versions.private, concatBytes$4(new Uint8Array([0]), priv)));
    }
    get publicExtendedKey() {
        if (!this.pubKey) {
            throw new Error('No public key');
        }
        return base58check.encode(this.serialize(this.versions.public, this.pubKey));
    }
    static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
        bytes$3(seed);
        if (8 * seed.length < 128 || 8 * seed.length > 512) {
            throw new Error(`HDKey: wrong seed length=${seed.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
        }
        const I = hmac$2(sha512, MASTER_SECRET, seed);
        return new HDKey({
            versions,
            chainCode: I.slice(32),
            privateKey: I.slice(0, 32),
        });
    }
    static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
        const keyBuffer = base58check.decode(base58key);
        const keyView = createView$2(keyBuffer);
        const version = keyView.getUint32(0, false);
        const opt = {
            versions,
            depth: keyBuffer[4],
            parentFingerprint: keyView.getUint32(5, false),
            index: keyView.getUint32(9, false),
            chainCode: keyBuffer.slice(13, 45),
        };
        const key = keyBuffer.slice(45);
        const isPriv = key[0] === 0;
        if (version !== versions[isPriv ? 'private' : 'public']) {
            throw new Error('Version mismatch');
        }
        if (isPriv) {
            return new HDKey({ ...opt, privateKey: key.slice(1) });
        }
        else {
            return new HDKey({ ...opt, publicKey: key });
        }
    }
    static fromJSON(json) {
        return HDKey.fromExtendedKey(json.xpriv);
    }
    constructor(opt) {
        this.depth = 0;
        this.index = 0;
        this.chainCode = null;
        this.parentFingerprint = 0;
        if (!opt || typeof opt !== 'object') {
            throw new Error('HDKey.constructor must not be called directly');
        }
        this.versions = opt.versions || BITCOIN_VERSIONS;
        this.depth = opt.depth || 0;
        this.chainCode = opt.chainCode;
        this.index = opt.index || 0;
        this.parentFingerprint = opt.parentFingerprint || 0;
        if (!this.depth) {
            if (this.parentFingerprint || this.index) {
                throw new Error('HDKey: zero depth with non-zero index/parent fingerprint');
            }
        }
        if (opt.publicKey && opt.privateKey) {
            throw new Error('HDKey: publicKey and privateKey at same time.');
        }
        if (opt.privateKey) {
            if (!secp256k1$1.utils.isValidPrivateKey(opt.privateKey)) {
                throw new Error('Invalid private key');
            }
            this.privKey =
                typeof opt.privateKey === 'bigint' ? opt.privateKey : bytesToNumber(opt.privateKey);
            this.privKeyBytes = numberToBytes(this.privKey);
            this.pubKey = secp256k1$1.getPublicKey(opt.privateKey, true);
        }
        else if (opt.publicKey) {
            this.pubKey = Point$1.fromHex(opt.publicKey).toRawBytes(true);
        }
        else {
            throw new Error('HDKey: no public or private key provided');
        }
        this.pubHash = hash160(this.pubKey);
    }
    derive(path) {
        if (!/^[mM]'?/.test(path)) {
            throw new Error('Path must start with "m" or "M"');
        }
        if (/^[mM]'?$/.test(path)) {
            return this;
        }
        const parts = path.replace(/^[mM]'?\//, '').split('/');
        let child = this;
        for (const c of parts) {
            const m = /^(\d+)('?)$/.exec(c);
            if (!m || m.length !== 3) {
                throw new Error(`Invalid child index: ${c}`);
            }
            let idx = +m[1];
            if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
                throw new Error('Invalid index');
            }
            if (m[2] === "'") {
                idx += HARDENED_OFFSET;
            }
            child = child.deriveChild(idx);
        }
        return child;
    }
    deriveChild(index) {
        if (!this.pubKey || !this.chainCode) {
            throw new Error('No publicKey or chainCode set');
        }
        let data = toU32(index);
        if (index >= HARDENED_OFFSET) {
            const priv = this.privateKey;
            if (!priv) {
                throw new Error('Could not derive hardened child key');
            }
            data = concatBytes$4(new Uint8Array([0]), priv, data);
        }
        else {
            data = concatBytes$4(this.pubKey, data);
        }
        const I = hmac$2(sha512, this.chainCode, data);
        const childTweak = bytesToNumber(I.slice(0, 32));
        const chainCode = I.slice(32);
        if (!secp256k1$1.utils.isValidPrivateKey(childTweak)) {
            throw new Error('Tweak bigger than curve order');
        }
        const opt = {
            versions: this.versions,
            chainCode,
            depth: this.depth + 1,
            parentFingerprint: this.fingerprint,
            index,
        };
        try {
            if (this.privateKey) {
                const added = mod$1(this.privKey + childTweak, secp256k1$1.CURVE.n);
                if (!secp256k1$1.utils.isValidPrivateKey(added)) {
                    throw new Error('The tweak was out of range or the resulted private key is invalid');
                }
                opt.privateKey = added;
            }
            else {
                const added = Point$1.fromHex(this.pubKey).add(Point$1.fromPrivateKey(childTweak));
                if (added.equals(Point$1.ZERO)) {
                    throw new Error('The tweak was equal to negative P, which made the result key invalid');
                }
                opt.publicKey = added.toRawBytes(true);
            }
            return new HDKey(opt);
        }
        catch (err) {
            return this.deriveChild(index + 1);
        }
    }
    sign(hash) {
        if (!this.privateKey) {
            throw new Error('No privateKey set!');
        }
        bytes$3(hash, 32);
        return secp256k1$1.sign(hash, this.privKey).toCompactRawBytes();
    }
    verify(hash, signature) {
        bytes$3(hash, 32);
        bytes$3(signature, 64);
        if (!this.publicKey) {
            throw new Error('No publicKey set!');
        }
        let sig;
        try {
            sig = secp256k1$1.Signature.fromCompact(signature);
        }
        catch (error) {
            return false;
        }
        return secp256k1$1.verify(sig, hash, this.publicKey);
    }
    wipePrivateData() {
        this.privKey = undefined;
        if (this.privKeyBytes) {
            this.privKeyBytes.fill(0);
            this.privKeyBytes = undefined;
        }
        return this;
    }
    toJSON() {
        return {
            xpriv: this.privateExtendedKey,
            xpub: this.publicExtendedKey,
        };
    }
    serialize(version, key) {
        if (!this.chainCode) {
            throw new Error('No chainCode set');
        }
        bytes$3(key, 33);
        return concatBytes$4(toU32(version), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
    }
}

/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
const u8a = (a) => a instanceof Uint8Array;
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
// big-endian hardware is rare. Just in case someone still decides to run ciphers:
// early-throw an error because we don't support BE yet.
const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE)
    throw new Error('Non little-endian hardware is not supported');
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$2(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$1(data) {
    if (typeof data === 'string')
        data = utf8ToBytes$2(data);
    if (!u8a(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
// Check if object doens't have custom constructor (like Uint8Array/Array)
const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
function checkOpts(defaults, opts) {
    if (opts !== undefined && (typeof opts !== 'object' || !isPlainObject(opts)))
        throw new Error('options must be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
function ensureBytes$1(b, len) {
    if (!(b instanceof Uint8Array))
        throw new Error('Uint8Array expected');
    if (typeof len === 'number')
        if (b.length !== len)
            throw new Error(`Uint8Array length ${len} expected`);
}
// Constant-time equality
function equalBytes$1(a, b) {
    // Should not happen
    if (a.length !== b.length)
        throw new Error('equalBytes: Different size of Uint8Arrays');
    let isSame = true;
    for (let i = 0; i < a.length; i++)
        isSame && (isSame = a[i] === b[i]); // Lets hope JIT won't optimize away.
    return isSame;
}

function number$1(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function bool(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
function bytes$1(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash$1(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('hash must be wrapped by utils.wrapConstructor');
    number$1(hash.outputLen);
    number$1(hash.blockLen);
}
function exists$1(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output$1(out, instance) {
    bytes$1(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
const assert = { number: number$1, bool, bytes: bytes$1, hash: hash$1, exists: exists$1, output: output$1 };

// Poly1305 is a fast and parallel secret-key message-authentication code.
// https://cr.yp.to/mac.html, https://cr.yp.to/mac/poly1305-20050329.pdf
// https://datatracker.ietf.org/doc/html/rfc8439
// Based on Public Domain poly1305-donna https://github.com/floodyberry/poly1305-donna
const u8to16 = (a, i) => (a[i++] & 0xff) | ((a[i++] & 0xff) << 8);
class Poly1305 {
    constructor(key) {
        this.blockLen = 16;
        this.outputLen = 16;
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.pos = 0;
        this.finished = false;
        key = toBytes$1(key);
        ensureBytes$1(key, 32);
        const t0 = u8to16(key, 0);
        const t1 = u8to16(key, 2);
        const t2 = u8to16(key, 4);
        const t3 = u8to16(key, 6);
        const t4 = u8to16(key, 8);
        const t5 = u8to16(key, 10);
        const t6 = u8to16(key, 12);
        const t7 = u8to16(key, 14);
        // https://github.com/floodyberry/poly1305-donna/blob/e6ad6e091d30d7f4ec2d4f978be1fcfcbce72781/poly1305-donna-16.h#L47
        this.r[0] = t0 & 0x1fff;
        this.r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
        this.r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1f03;
        this.r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
        this.r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00ff;
        this.r[5] = (t4 >>> 1) & 0x1ffe;
        this.r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
        this.r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1f81;
        this.r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1fff;
        this.r[9] = (t7 >>> 5) & 0x007f;
        for (let i = 0; i < 8; i++)
            this.pad[i] = u8to16(key, 16 + 2 * i);
    }
    process(data, offset, isLast = false) {
        const hibit = isLast ? 0 : 1 << 11;
        const { h, r } = this;
        const r0 = r[0];
        const r1 = r[1];
        const r2 = r[2];
        const r3 = r[3];
        const r4 = r[4];
        const r5 = r[5];
        const r6 = r[6];
        const r7 = r[7];
        const r8 = r[8];
        const r9 = r[9];
        const t0 = u8to16(data, offset + 0);
        const t1 = u8to16(data, offset + 2);
        const t2 = u8to16(data, offset + 4);
        const t3 = u8to16(data, offset + 6);
        const t4 = u8to16(data, offset + 8);
        const t5 = u8to16(data, offset + 10);
        const t6 = u8to16(data, offset + 12);
        const t7 = u8to16(data, offset + 14);
        let h0 = h[0] + (t0 & 0x1fff);
        let h1 = h[1] + (((t0 >>> 13) | (t1 << 3)) & 0x1fff);
        let h2 = h[2] + (((t1 >>> 10) | (t2 << 6)) & 0x1fff);
        let h3 = h[3] + (((t2 >>> 7) | (t3 << 9)) & 0x1fff);
        let h4 = h[4] + (((t3 >>> 4) | (t4 << 12)) & 0x1fff);
        let h5 = h[5] + ((t4 >>> 1) & 0x1fff);
        let h6 = h[6] + (((t4 >>> 14) | (t5 << 2)) & 0x1fff);
        let h7 = h[7] + (((t5 >>> 11) | (t6 << 5)) & 0x1fff);
        let h8 = h[8] + (((t6 >>> 8) | (t7 << 8)) & 0x1fff);
        let h9 = h[9] + ((t7 >>> 5) | hibit);
        let c = 0;
        let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
        c = d0 >>> 13;
        d0 &= 0x1fff;
        d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
        c += d0 >>> 13;
        d0 &= 0x1fff;
        let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
        c = d1 >>> 13;
        d1 &= 0x1fff;
        d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
        c += d1 >>> 13;
        d1 &= 0x1fff;
        let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
        c = d2 >>> 13;
        d2 &= 0x1fff;
        d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
        c += d2 >>> 13;
        d2 &= 0x1fff;
        let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
        c = d3 >>> 13;
        d3 &= 0x1fff;
        d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
        c += d3 >>> 13;
        d3 &= 0x1fff;
        let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
        c = d4 >>> 13;
        d4 &= 0x1fff;
        d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
        c += d4 >>> 13;
        d4 &= 0x1fff;
        let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
        c = d5 >>> 13;
        d5 &= 0x1fff;
        d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
        c += d5 >>> 13;
        d5 &= 0x1fff;
        let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
        c = d6 >>> 13;
        d6 &= 0x1fff;
        d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
        c += d6 >>> 13;
        d6 &= 0x1fff;
        let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
        c = d7 >>> 13;
        d7 &= 0x1fff;
        d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
        c += d7 >>> 13;
        d7 &= 0x1fff;
        let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
        c = d8 >>> 13;
        d8 &= 0x1fff;
        d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
        c += d8 >>> 13;
        d8 &= 0x1fff;
        let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
        c = d9 >>> 13;
        d9 &= 0x1fff;
        d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
        c += d9 >>> 13;
        d9 &= 0x1fff;
        c = ((c << 2) + c) | 0;
        c = (c + d0) | 0;
        d0 = c & 0x1fff;
        c = c >>> 13;
        d1 += c;
        h[0] = d0;
        h[1] = d1;
        h[2] = d2;
        h[3] = d3;
        h[4] = d4;
        h[5] = d5;
        h[6] = d6;
        h[7] = d7;
        h[8] = d8;
        h[9] = d9;
    }
    finalize() {
        const { h, pad } = this;
        const g = new Uint16Array(10);
        let c = h[1] >>> 13;
        h[1] &= 0x1fff;
        for (let i = 2; i < 10; i++) {
            h[i] += c;
            c = h[i] >>> 13;
            h[i] &= 0x1fff;
        }
        h[0] += c * 5;
        c = h[0] >>> 13;
        h[0] &= 0x1fff;
        h[1] += c;
        c = h[1] >>> 13;
        h[1] &= 0x1fff;
        h[2] += c;
        g[0] = h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 0x1fff;
        for (let i = 1; i < 10; i++) {
            g[i] = h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 0x1fff;
        }
        g[9] -= 1 << 13;
        let mask = (c ^ 1) - 1;
        for (let i = 0; i < 10; i++)
            g[i] &= mask;
        mask = ~mask;
        for (let i = 0; i < 10; i++)
            h[i] = (h[i] & mask) | g[i];
        h[0] = (h[0] | (h[1] << 13)) & 0xffff;
        h[1] = ((h[1] >>> 3) | (h[2] << 10)) & 0xffff;
        h[2] = ((h[2] >>> 6) | (h[3] << 7)) & 0xffff;
        h[3] = ((h[3] >>> 9) | (h[4] << 4)) & 0xffff;
        h[4] = ((h[4] >>> 12) | (h[5] << 1) | (h[6] << 14)) & 0xffff;
        h[5] = ((h[6] >>> 2) | (h[7] << 11)) & 0xffff;
        h[6] = ((h[7] >>> 5) | (h[8] << 8)) & 0xffff;
        h[7] = ((h[8] >>> 8) | (h[9] << 5)) & 0xffff;
        let f = h[0] + pad[0];
        h[0] = f & 0xffff;
        for (let i = 1; i < 8; i++) {
            f = (((h[i] + pad[i]) | 0) + (f >>> 16)) | 0;
            h[i] = f & 0xffff;
        }
    }
    update(data) {
        assert.exists(this);
        const { buffer, blockLen } = this;
        data = toBytes$1(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input
            if (take === blockLen) {
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(data, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(buffer, 0, false);
                this.pos = 0;
            }
        }
        return this;
    }
    destroy() {
        this.h.fill(0);
        this.r.fill(0);
        this.buffer.fill(0);
        this.pad.fill(0);
    }
    digestInto(out) {
        assert.exists(this);
        assert.output(out, this);
        this.finished = true;
        const { buffer, h } = this;
        let { pos } = this;
        if (pos) {
            buffer[pos++] = 1;
            // buffer.subarray(pos).fill(0);
            for (; pos < 16; pos++)
                buffer[pos] = 0;
            this.process(buffer, 0, true);
        }
        this.finalize();
        let opos = 0;
        for (let i = 0; i < 8; i++) {
            out[opos++] = h[i] >>> 0;
            out[opos++] = h[i] >>> 8;
        }
        return out;
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
}
function wrapConstructorWithKey(hashCons) {
    const hashC = (msg, key) => hashCons(key).update(toBytes$1(msg)).digest();
    const tmp = hashCons(new Uint8Array(32));
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (key) => hashCons(key);
    return hashC;
}
wrapConstructorWithKey((key) => new Poly1305(key));

// Basic utils for salsa-like ciphers
// Check out _micro.ts for descriptive documentation.
/*
RFC8439 requires multi-step cipher stream, where
authKey starts with counter: 0, actual msg with counter: 1.

For this, we need a way to re-use nonce / counter:

    const counter = new Uint8Array(4);
    chacha(..., counter, ...); // counter is now 1
    chacha(..., counter, ...); // counter is now 2

This is complicated:

- Original papers don't allow mutating counters
- Counter overflow is undefined: https://mailarchive.ietf.org/arch/msg/cfrg/gsOnTJzcbgG6OqD8Sc0GO5aR_tU/
- 3rd-party library stablelib implementation uses an approach where you can provide
  nonce and counter instead of just nonce - and it will re-use it
- We could have did something similar, but ChaCha has different counter position
  (counter | nonce), which is not composable with XChaCha, because full counter
  is (nonce16 | counter | nonce16). Stablelib doesn't support in-place counter for XChaCha.
- We could separate nonce & counter and provide separate API for counter re-use, but
  there are different counter sizes depending on an algorithm.
- Salsa & ChaCha also differ in structures of key / sigma:

    salsa:     c0 | k(4) | c1 | nonce(2) | ctr(2) | c2 | k(4) | c4
    chacha:    c(4) | k(8) | ctr(1) | nonce(3)
    chachaDJB: c(4) | k(8) | ctr(2) | nonce(2)
- Creating function such as `setSalsaState(key, nonce, sigma, data)` won't work,
  because we can't re-use counter array
- 32-bit nonce is `2 ** 32 * 64` = 256GB with 32-bit counter
- JS does not allow UintArrays bigger than 4GB, so supporting 64-bit counters doesn't matter

Structure is as following:

key=16 -> sigma16, k=key|key
key=32 -> sigma32, k=key

nonces:
salsa20:      8   (8-byte counter)
chacha20djb:  8   (8-byte counter)
chacha20tls:  12  (4-byte counter)
xsalsa:       24  (16 -> hsalsa, 8 -> old nonce)
xchacha:      24  (16 -> hchacha, 8 -> old nonce)

https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha#appendix-A.2
Use the subkey and remaining 8 byte nonce with ChaCha20 as normal
(prefixed by 4 NUL bytes, since [RFC8439] specifies a 12-byte nonce).
*/
const sigma16 = utf8ToBytes$2('expand 16-byte k');
const sigma32 = utf8ToBytes$2('expand 32-byte k');
const sigma16_32 = u32(sigma16);
const sigma32_32 = u32(sigma32);
// Is byte array aligned to 4 byte offset (u32)?
const isAligned32 = (b) => !(b.byteOffset % 4);
const salsaBasic = (opts) => {
    const { core, rounds, counterRight, counterLen, allow128bitKeys, extendNonceFn, blockLen } = checkOpts({ rounds: 20, counterRight: false, counterLen: 8, allow128bitKeys: true, blockLen: 64 }, opts);
    assert.number(counterLen);
    assert.number(rounds);
    assert.number(blockLen);
    assert.bool(counterRight);
    assert.bool(allow128bitKeys);
    const blockLen32 = blockLen / 4;
    if (blockLen % 4 !== 0)
        throw new Error('Salsa/ChaCha: blockLen must be aligned to 4 bytes');
    return (key, nonce, data, output, counter = 0) => {
        assert.bytes(key);
        assert.bytes(nonce);
        assert.bytes(data);
        if (!output)
            output = new Uint8Array(data.length);
        assert.bytes(output);
        assert.number(counter);
        // > new Uint32Array([2**32])
        // Uint32Array(1) [ 0 ]
        // > new Uint32Array([2**32-1])
        // Uint32Array(1) [ 4294967295 ]
        if (counter < 0 || counter >= 2 ** 32 - 1)
            throw new Error('Salsa/ChaCha: counter overflow');
        if (output.length < data.length) {
            throw new Error(`Salsa/ChaCha: output (${output.length}) is shorter than data (${data.length})`);
        }
        const toClean = [];
        let k, sigma;
        // Handle 128 byte keys
        if (key.length === 32) {
            k = key;
            sigma = sigma32_32;
        }
        else if (key.length === 16 && allow128bitKeys) {
            k = new Uint8Array(32);
            k.set(key);
            k.set(key, 16);
            sigma = sigma16_32;
            toClean.push(k);
        }
        else
            throw new Error(`Salsa/ChaCha: invalid 32-byte key, got length=${key.length}`);
        // Handle extended nonce (HChaCha/HSalsa)
        if (extendNonceFn) {
            if (nonce.length <= 16)
                throw new Error(`Salsa/ChaCha: extended nonce must be bigger than 16 bytes`);
            k = extendNonceFn(sigma, k, nonce.subarray(0, 16), new Uint8Array(32));
            toClean.push(k);
            nonce = nonce.subarray(16);
        }
        // Handle nonce counter
        const nonceLen = 16 - counterLen;
        if (nonce.length !== nonceLen)
            throw new Error(`Salsa/ChaCha: nonce must be ${nonceLen} or 16 bytes`);
        // Pad counter when nonce is 64 bit
        if (nonceLen !== 12) {
            const nc = new Uint8Array(12);
            nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
            toClean.push((nonce = nc));
        }
        // Counter positions
        const block = new Uint8Array(blockLen);
        // Cast to Uint32Array for speed
        const b32 = u32(block);
        const k32 = u32(k);
        const n32 = u32(nonce);
        // Make sure that buffers aligned to 4 bytes
        const d32 = isAligned32(data) && u32(data);
        const o32 = isAligned32(output) && u32(output);
        toClean.push(b32);
        const len = data.length;
        for (let pos = 0, ctr = counter; pos < len; ctr++) {
            core(sigma, k32, n32, b32, ctr, rounds);
            if (ctr >= 2 ** 32 - 1)
                throw new Error('Salsa/ChaCha: counter overflow');
            const take = Math.min(blockLen, len - pos);
            // full block && aligned to 4 bytes
            if (take === blockLen && o32 && d32) {
                const pos32 = pos / 4;
                if (pos % 4 !== 0)
                    throw new Error('Salsa/ChaCha: invalid block position');
                for (let j = 0; j < blockLen32; j++)
                    o32[pos32 + j] = d32[pos32 + j] ^ b32[j];
                pos += blockLen;
                continue;
            }
            for (let j = 0; j < take; j++)
                output[pos + j] = data[pos + j] ^ block[j];
            pos += take;
        }
        for (let i = 0; i < toClean.length; i++)
            toClean[i].fill(0);
        return output;
    };
};

// ChaCha20 stream cipher was released in 2008. ChaCha aims to increase
// the diffusion per round, but had slightly less cryptanalysis.
// https://cr.yp.to/chacha.html, http://cr.yp.to/chacha/chacha-20080128.pdf
// Left rotate for uint32
const rotl = (a, b) => (a << b) | (a >>> (32 - b));
/**
 * ChaCha core function.
 */
// prettier-ignore
function chachaCore(c, k, n, out, cnt, rounds = 20) {
    let y00 = c[0], y01 = c[1], y02 = c[2], y03 = c[3]; // "expa"   "nd 3"  "2-by"  "te k"
    let y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3]; // Key      Key     Key     Key
    let y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7]; // Key      Key     Key     Key
    let y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2]; // Counter  Counter	Nonce   Nonce
    // Save state to temporary variables
    let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
    // Main loop
    for (let i = 0; i < rounds; i += 2) {
        x00 = (x00 + x04) | 0;
        x12 = rotl(x12 ^ x00, 16);
        x08 = (x08 + x12) | 0;
        x04 = rotl(x04 ^ x08, 12);
        x00 = (x00 + x04) | 0;
        x12 = rotl(x12 ^ x00, 8);
        x08 = (x08 + x12) | 0;
        x04 = rotl(x04 ^ x08, 7);
        x01 = (x01 + x05) | 0;
        x13 = rotl(x13 ^ x01, 16);
        x09 = (x09 + x13) | 0;
        x05 = rotl(x05 ^ x09, 12);
        x01 = (x01 + x05) | 0;
        x13 = rotl(x13 ^ x01, 8);
        x09 = (x09 + x13) | 0;
        x05 = rotl(x05 ^ x09, 7);
        x02 = (x02 + x06) | 0;
        x14 = rotl(x14 ^ x02, 16);
        x10 = (x10 + x14) | 0;
        x06 = rotl(x06 ^ x10, 12);
        x02 = (x02 + x06) | 0;
        x14 = rotl(x14 ^ x02, 8);
        x10 = (x10 + x14) | 0;
        x06 = rotl(x06 ^ x10, 7);
        x03 = (x03 + x07) | 0;
        x15 = rotl(x15 ^ x03, 16);
        x11 = (x11 + x15) | 0;
        x07 = rotl(x07 ^ x11, 12);
        x03 = (x03 + x07) | 0;
        x15 = rotl(x15 ^ x03, 8);
        x11 = (x11 + x15) | 0;
        x07 = rotl(x07 ^ x11, 7);
        x00 = (x00 + x05) | 0;
        x15 = rotl(x15 ^ x00, 16);
        x10 = (x10 + x15) | 0;
        x05 = rotl(x05 ^ x10, 12);
        x00 = (x00 + x05) | 0;
        x15 = rotl(x15 ^ x00, 8);
        x10 = (x10 + x15) | 0;
        x05 = rotl(x05 ^ x10, 7);
        x01 = (x01 + x06) | 0;
        x12 = rotl(x12 ^ x01, 16);
        x11 = (x11 + x12) | 0;
        x06 = rotl(x06 ^ x11, 12);
        x01 = (x01 + x06) | 0;
        x12 = rotl(x12 ^ x01, 8);
        x11 = (x11 + x12) | 0;
        x06 = rotl(x06 ^ x11, 7);
        x02 = (x02 + x07) | 0;
        x13 = rotl(x13 ^ x02, 16);
        x08 = (x08 + x13) | 0;
        x07 = rotl(x07 ^ x08, 12);
        x02 = (x02 + x07) | 0;
        x13 = rotl(x13 ^ x02, 8);
        x08 = (x08 + x13) | 0;
        x07 = rotl(x07 ^ x08, 7);
        x03 = (x03 + x04) | 0;
        x14 = rotl(x14 ^ x03, 16);
        x09 = (x09 + x14) | 0;
        x04 = rotl(x04 ^ x09, 12);
        x03 = (x03 + x04) | 0;
        x14 = rotl(x14 ^ x03, 8);
        x09 = (x09 + x14) | 0;
        x04 = rotl(x04 ^ x09, 7);
    }
    // Write output
    let oi = 0;
    out[oi++] = (y00 + x00) | 0;
    out[oi++] = (y01 + x01) | 0;
    out[oi++] = (y02 + x02) | 0;
    out[oi++] = (y03 + x03) | 0;
    out[oi++] = (y04 + x04) | 0;
    out[oi++] = (y05 + x05) | 0;
    out[oi++] = (y06 + x06) | 0;
    out[oi++] = (y07 + x07) | 0;
    out[oi++] = (y08 + x08) | 0;
    out[oi++] = (y09 + x09) | 0;
    out[oi++] = (y10 + x10) | 0;
    out[oi++] = (y11 + x11) | 0;
    out[oi++] = (y12 + x12) | 0;
    out[oi++] = (y13 + x13) | 0;
    out[oi++] = (y14 + x14) | 0;
    out[oi++] = (y15 + x15) | 0;
}
/**
 * ChaCha stream cipher. Conforms to RFC 8439 (IETF, TLS). 12-byte nonce, 4-byte counter.
 * With 12-byte nonce, it's not safe to use fill it with random (CSPRNG), due to collision chance.
 */
const chacha20 = /* @__PURE__ */ salsaBasic({
    core: chachaCore,
    counterRight: false,
    counterLen: 4,
    allow128bitKeys: false,
});

// HKDF (RFC 5869)
// https://soatok.blog/2021/11/17/understanding-hkdf/
/**
 * HKDF-Extract(IKM, salt) -> PRK
 * Arguments position differs from spec (IKM is first one, since it is not optional)
 * @param hash
 * @param ikm
 * @param salt
 * @returns
 */
function extract(hash, ikm, salt) {
    assert$4.hash(hash);
    // NOTE: some libraries treat zero-length array as 'not provided';
    // we don't, since we have undefined as 'not provided'
    // https://github.com/RustCrypto/KDFs/issues/15
    if (salt === undefined)
        salt = new Uint8Array(hash.outputLen); // if not provided, it is set to a string of HashLen zeros
    return hmac$4(hash, toBytes$5(salt), toBytes$5(ikm));
}
// HKDF-Expand(PRK, info, L) -> OKM
const HKDF_COUNTER = new Uint8Array([0]);
const EMPTY_BUFFER = new Uint8Array();
/**
 * HKDF-expand from the spec.
 * @param prk - a pseudorandom key of at least HashLen octets (usually, the output from the extract step)
 * @param info - optional context and application specific information (can be a zero-length string)
 * @param length - length of output keying material in octets
 */
function expand(hash, prk, info, length = 32) {
    assert$4.hash(hash);
    assert$4.number(length);
    if (length > 255 * hash.outputLen)
        throw new Error('Length should be <= 255*HashLen');
    const blocks = Math.ceil(length / hash.outputLen);
    if (info === undefined)
        info = EMPTY_BUFFER;
    // first L(ength) octets of T
    const okm = new Uint8Array(blocks * hash.outputLen);
    // Re-use HMAC instance between blocks
    const HMAC = hmac$4.create(hash, prk);
    const HMACTmp = HMAC._cloneInto();
    const T = new Uint8Array(HMAC.outputLen);
    for (let counter = 0; counter < blocks; counter++) {
        HKDF_COUNTER[0] = counter + 1;
        // T(0) = empty string (zero length)
        // T(N) = HMAC-Hash(PRK, T(N-1) | info | N)
        HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T)
            .update(info)
            .update(HKDF_COUNTER)
            .digestInto(T);
        okm.set(T, hash.outputLen * counter);
        HMAC._cloneInto(HMACTmp);
    }
    HMAC.destroy();
    HMACTmp.destroy();
    T.fill(0);
    HKDF_COUNTER.fill(0);
    return okm.slice(0, length);
}
/**
 * HKDF (RFC 5869): extract + expand in one step.
 * @param hash - hash function that would be used (e.g. sha256)
 * @param ikm - input keying material, the initial key
 * @param salt - optional salt value (a non-secret random value)
 * @param info - optional context and application specific information
 * @param length - length of output keying material in octets
 */
const hkdf = (hash, ikm, salt, info, length) => expand(hash, extract(hash, ikm, salt), info, length);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
function generatePrivateKey() {
  return bytesToHex$5(schnorr$1.utils.randomPrivateKey());
}
function getPublicKey(privateKey) {
  return bytesToHex$5(schnorr$1.getPublicKey(privateKey));
}

// utils.ts
var utils_exports = {};
__export(utils_exports, {
  MessageNode: () => MessageNode,
  MessageQueue: () => MessageQueue,
  insertEventIntoAscendingList: () => insertEventIntoAscendingList,
  insertEventIntoDescendingList: () => insertEventIntoDescendingList,
  normalizeURL: () => normalizeURL,
  utf8Decoder: () => utf8Decoder,
  utf8Encoder: () => utf8Encoder
});
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function normalizeURL(url) {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/"))
    p.pathname = p.pathname.slice(0, -1);
  if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}
function insertEventIntoDescendingList(sortedArray, event) {
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at < sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at >= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at > event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at < event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (sortedArray[position]?.id !== event.id) {
    return [...sortedArray.slice(0, position), event, ...sortedArray.slice(position)];
  }
  return sortedArray;
}
function insertEventIntoAscendingList(sortedArray, event) {
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at > sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at <= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at < event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at > event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (sortedArray[position]?.id !== event.id) {
    return [...sortedArray.slice(0, position), event, ...sortedArray.slice(position)];
  }
  return sortedArray;
}
var MessageNode = class {
  _value;
  _next;
  get value() {
    return this._value;
  }
  set value(message) {
    this._value = message;
  }
  get next() {
    return this._next;
  }
  set next(node) {
    this._next = node;
  }
  constructor(message) {
    this._value = message;
    this._next = null;
  }
};
var MessageQueue = class {
  _first;
  _last;
  get first() {
    return this._first;
  }
  set first(messageNode) {
    this._first = messageNode;
  }
  get last() {
    return this._last;
  }
  set last(messageNode) {
    this._last = messageNode;
  }
  _size;
  get size() {
    return this._size;
  }
  set size(v) {
    this._size = v;
  }
  constructor() {
    this._first = null;
    this._last = null;
    this._size = 0;
  }
  enqueue(message) {
    const newNode = new MessageNode(message);
    if (this._size === 0 || !this._last) {
      this._first = newNode;
      this._last = newNode;
    } else {
      this._last.next = newNode;
      this._last = newNode;
    }
    this._size++;
    return true;
  }
  dequeue() {
    if (this._size === 0 || !this._first)
      return null;
    let prev = this._first;
    this._first = prev.next;
    prev.next = null;
    this._size--;
    return prev.value;
  }
};

// event.ts
var verifiedSymbol = Symbol("verified");
function getBlankEvent(kind = 255 /* Blank */) {
  return {
    kind,
    content: "",
    tags: [],
    created_at: 0
  };
}
function finishEvent(t, privateKey) {
  const event = t;
  event.pubkey = getPublicKey(privateKey);
  event.id = getEventHash$1(event);
  event.sig = getSignature(event, privateKey);
  event[verifiedSymbol] = true;
  return event;
}
function serializeEvent(evt) {
  if (!validateEvent(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash$1(event) {
  let eventHash = sha256$4(utf8Encoder.encode(serializeEvent(event)));
  return bytesToHex$5(eventHash);
}
var isRecord = (obj) => obj instanceof Object;
function validateEvent(event) {
  if (!isRecord(event))
    return false;
  if (typeof event.kind !== "number")
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (typeof event.pubkey !== "string")
    return false;
  if (!event.pubkey.match(/^[a-f0-9]{64}$/))
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i = 0; i < event.tags.length; i++) {
    let tag = event.tags[i];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] === "object")
        return false;
    }
  }
  return true;
}
function verifySignature$1(event) {
  if (typeof event[verifiedSymbol] === "boolean")
    return event[verifiedSymbol];
  const hash = getEventHash$1(event);
  if (hash !== event.id) {
    return event[verifiedSymbol] = false;
  }
  try {
    return event[verifiedSymbol] = schnorr$1.verify(event.sig, hash, event.pubkey);
  } catch (err) {
    return event[verifiedSymbol] = false;
  }
}
function getSignature(event, key) {
  return bytesToHex$5(schnorr$1.sign(getEventHash$1(event), key));
}

// filter.ts
function matchFilter(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1) {
    if (!filter.ids.some((prefix) => event.id.startsWith(prefix))) {
      return false;
    }
  }
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1)
    return false;
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) {
    if (!filter.authors.some((prefix) => event.pubkey.startsWith(prefix))) {
      return false;
    }
  }
  for (let f in filter) {
    if (f[0] === "#") {
      let tagName = f.slice(1);
      let values = filter[`#${tagName}`];
      if (values && !event.tags.find(([t, v]) => t === f.slice(1) && values.indexOf(v) !== -1))
        return false;
    }
  }
  if (filter.since && event.created_at < filter.since)
    return false;
  if (filter.until && event.created_at > filter.until)
    return false;
  return true;
}
function matchFilters(filters, event) {
  for (let i = 0; i < filters.length; i++) {
    if (matchFilter(filters[i], event))
      return true;
  }
  return false;
}
function mergeFilters$1(...filters) {
  let result = {};
  for (let i = 0; i < filters.length; i++) {
    let filter = filters[i];
    Object.entries(filter).forEach(([property, values]) => {
      if (property === "kinds" || property === "ids" || property === "authors" || property[0] === "#") {
        result[property] = result[property] || [];
        for (let v = 0; v < values.length; v++) {
          let value = values[v];
          if (!result[property].includes(value))
            result[property].push(value);
        }
      }
    });
    if (filter.limit && (!result.limit || filter.limit > result.limit))
      result.limit = filter.limit;
    if (filter.until && (!result.until || filter.until > result.until))
      result.until = filter.until;
    if (filter.since && (!result.since || filter.since < result.since))
      result.since = filter.since;
  }
  return result;
}

// fakejson.ts
var fakejson_exports = {};
__export(fakejson_exports, {
  getHex64: () => getHex64,
  getInt: () => getInt,
  getSubscriptionId: () => getSubscriptionId,
  matchEventId: () => matchEventId,
  matchEventKind: () => matchEventKind,
  matchEventPubkey: () => matchEventPubkey
});
function getHex64(json, field) {
  let len = field.length + 3;
  let idx = json.indexOf(`"${field}":`) + len;
  let s = json.slice(idx).indexOf(`"`) + idx + 1;
  return json.slice(s, s + 64);
}
function getInt(json, field) {
  let len = field.length;
  let idx = json.indexOf(`"${field}":`) + len + 3;
  let sliced = json.slice(idx);
  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
  return parseInt(sliced.slice(0, end), 10);
}
function getSubscriptionId(json) {
  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
  if (idx === -1)
    return null;
  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
  if (pstart === -1)
    return null;
  let start = idx + 7 + 1 + pstart;
  let pend = json.slice(start + 1, 80).indexOf(`"`);
  if (pend === -1)
    return null;
  let end = start + 1 + pend;
  return json.slice(start + 1, end);
}
function matchEventId(json, id) {
  return id === getHex64(json, "id");
}
function matchEventPubkey(json, pubkey) {
  return pubkey === getHex64(json, "pubkey");
}
function matchEventKind(json, kind) {
  return kind === getInt(json, "kind");
}

// relay.ts
var newListeners = () => ({
  connect: [],
  disconnect: [],
  error: [],
  notice: [],
  auth: []
});
function relayInit(url, options = {}) {
  let { listTimeout = 3e3, getTimeout = 3e3, countTimeout = 3e3 } = options;
  var ws;
  var openSubs = {};
  var listeners = newListeners();
  var subListeners = {};
  var pubListeners = {};
  var connectionPromise;
  async function connectRelay() {
    if (connectionPromise)
      return connectionPromise;
    connectionPromise = new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(url);
      } catch (err) {
        reject(err);
      }
      ws.onopen = () => {
        listeners.connect.forEach((cb) => cb());
        resolve();
      };
      ws.onerror = () => {
        connectionPromise = void 0;
        listeners.error.forEach((cb) => cb());
        reject();
      };
      ws.onclose = async () => {
        connectionPromise = void 0;
        listeners.disconnect.forEach((cb) => cb());
      };
      let incomingMessageQueue = new MessageQueue();
      let handleNextInterval;
      ws.onmessage = (e) => {
        incomingMessageQueue.enqueue(e.data);
        if (!handleNextInterval) {
          handleNextInterval = setInterval(handleNext, 0);
        }
      };
      function handleNext() {
        if (incomingMessageQueue.size === 0) {
          clearInterval(handleNextInterval);
          handleNextInterval = null;
          return;
        }
        var json = incomingMessageQueue.dequeue();
        if (!json)
          return;
        let subid = getSubscriptionId(json);
        if (subid) {
          let so = openSubs[subid];
          if (so && so.alreadyHaveEvent && so.alreadyHaveEvent(getHex64(json, "id"), url)) {
            return;
          }
        }
        try {
          let data = JSON.parse(json);
          switch (data[0]) {
            case "EVENT": {
              let id2 = data[1];
              let event = data[2];
              if (validateEvent(event) && openSubs[id2] && (openSubs[id2].skipVerification || verifySignature$1(event)) && matchFilters(openSubs[id2].filters, event)) {
                openSubs[id2];
                (subListeners[id2]?.event || []).forEach((cb) => cb(event));
              }
              return;
            }
            case "COUNT":
              let id = data[1];
              let payload = data[2];
              if (openSubs[id]) {
                ;
                (subListeners[id]?.count || []).forEach((cb) => cb(payload));
              }
              return;
            case "EOSE": {
              let id2 = data[1];
              if (id2 in subListeners) {
                subListeners[id2].eose.forEach((cb) => cb());
                subListeners[id2].eose = [];
              }
              return;
            }
            case "OK": {
              let id2 = data[1];
              let ok = data[2];
              let reason = data[3] || "";
              if (id2 in pubListeners) {
                let { resolve: resolve2, reject: reject2 } = pubListeners[id2];
                if (ok)
                  resolve2(null);
                else
                  reject2(new Error(reason));
              }
              return;
            }
            case "NOTICE":
              let notice = data[1];
              listeners.notice.forEach((cb) => cb(notice));
              return;
            case "AUTH": {
              let challenge = data[1];
              listeners.auth?.forEach((cb) => cb(challenge));
              return;
            }
          }
        } catch (err) {
          return;
        }
      }
    });
    return connectionPromise;
  }
  function connected() {
    return ws?.readyState === 1;
  }
  async function connect() {
    if (connected())
      return;
    await connectRelay();
  }
  async function trySend(params) {
    let msg = JSON.stringify(params);
    if (!connected()) {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      if (!connected()) {
        return;
      }
    }
    try {
      ws.send(msg);
    } catch (err) {
      console.log(err);
    }
  }
  const sub = (filters, {
    verb = "REQ",
    skipVerification = false,
    alreadyHaveEvent = null,
    id = Math.random().toString().slice(2)
  } = {}) => {
    let subid = id;
    openSubs[subid] = {
      id: subid,
      filters,
      skipVerification,
      alreadyHaveEvent
    };
    trySend([verb, subid, ...filters]);
    let subscription = {
      sub: (newFilters, newOpts = {}) => sub(newFilters || filters, {
        skipVerification: newOpts.skipVerification || skipVerification,
        alreadyHaveEvent: newOpts.alreadyHaveEvent || alreadyHaveEvent,
        id: subid
      }),
      unsub: () => {
        delete openSubs[subid];
        delete subListeners[subid];
        trySend(["CLOSE", subid]);
      },
      on: (type, cb) => {
        subListeners[subid] = subListeners[subid] || {
          event: [],
          count: [],
          eose: []
        };
        subListeners[subid][type].push(cb);
      },
      off: (type, cb) => {
        let listeners2 = subListeners[subid];
        let idx = listeners2[type].indexOf(cb);
        if (idx >= 0)
          listeners2[type].splice(idx, 1);
      },
      get events() {
        return eventsGenerator(subscription);
      }
    };
    return subscription;
  };
  function _publishEvent(event, type) {
    return new Promise((resolve, reject) => {
      if (!event.id) {
        reject(new Error(`event ${event} has no id`));
        return;
      }
      let id = event.id;
      trySend([type, event]);
      pubListeners[id] = { resolve, reject };
    });
  }
  return {
    url,
    sub,
    on: (type, cb) => {
      listeners[type].push(cb);
      if (type === "connect" && ws?.readyState === 1) {
        cb();
      }
    },
    off: (type, cb) => {
      let index = listeners[type].indexOf(cb);
      if (index !== -1)
        listeners[type].splice(index, 1);
    },
    list: (filters, opts) => new Promise((resolve) => {
      let s = sub(filters, opts);
      let events = [];
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(events);
      }, listTimeout);
      s.on("eose", () => {
        s.unsub();
        clearTimeout(timeout);
        resolve(events);
      });
      s.on("event", (event) => {
        events.push(event);
      });
    }),
    get: (filter, opts) => new Promise((resolve) => {
      let s = sub([filter], opts);
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(null);
      }, getTimeout);
      s.on("event", (event) => {
        s.unsub();
        clearTimeout(timeout);
        resolve(event);
      });
    }),
    count: (filters) => new Promise((resolve) => {
      let s = sub(filters, { ...sub, verb: "COUNT" });
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(null);
      }, countTimeout);
      s.on("count", (event) => {
        s.unsub();
        clearTimeout(timeout);
        resolve(event);
      });
    }),
    async publish(event) {
      await _publishEvent(event, "EVENT");
    },
    async auth(event) {
      await _publishEvent(event, "AUTH");
    },
    connect,
    close() {
      listeners = newListeners();
      subListeners = {};
      pubListeners = {};
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }
    },
    get status() {
      return ws?.readyState ?? 3;
    }
  };
}
async function* eventsGenerator(sub) {
  let nextResolve;
  const eventQueue = [];
  const pushToQueue = (event) => {
    if (nextResolve) {
      nextResolve(event);
      nextResolve = void 0;
    } else {
      eventQueue.push(event);
    }
  };
  sub.on("event", pushToQueue);
  try {
    while (true) {
      if (eventQueue.length > 0) {
        yield eventQueue.shift();
      } else {
        const event = await new Promise((resolve) => {
          nextResolve = resolve;
        });
        yield event;
      }
    }
  } finally {
    sub.off("event", pushToQueue);
  }
}

// pool.ts
var SimplePool = class {
  _conn;
  _seenOn = {};
  batchedByKey = {};
  eoseSubTimeout;
  getTimeout;
  seenOnEnabled = true;
  batchInterval = 100;
  constructor(options = {}) {
    this._conn = {};
    this.eoseSubTimeout = options.eoseSubTimeout || 3400;
    this.getTimeout = options.getTimeout || 3400;
    this.seenOnEnabled = options.seenOnEnabled !== false;
    this.batchInterval = options.batchInterval || 100;
  }
  close(relays) {
    relays.forEach((url) => {
      let relay = this._conn[normalizeURL(url)];
      if (relay)
        relay.close();
    });
  }
  async ensureRelay(url) {
    const nm = normalizeURL(url);
    if (!this._conn[nm]) {
      this._conn[nm] = relayInit(nm, {
        getTimeout: this.getTimeout * 0.9,
        listTimeout: this.getTimeout * 0.9
      });
    }
    const relay = this._conn[nm];
    await relay.connect();
    return relay;
  }
  sub(relays, filters, opts) {
    let _knownIds = /* @__PURE__ */ new Set();
    let modifiedOpts = { ...opts || {} };
    modifiedOpts.alreadyHaveEvent = (id, url) => {
      if (opts?.alreadyHaveEvent?.(id, url)) {
        return true;
      }
      if (this.seenOnEnabled) {
        let set = this._seenOn[id] || /* @__PURE__ */ new Set();
        set.add(url);
        this._seenOn[id] = set;
      }
      return _knownIds.has(id);
    };
    let subs = [];
    let eventListeners = /* @__PURE__ */ new Set();
    let eoseListeners = /* @__PURE__ */ new Set();
    let eosesMissing = relays.length;
    let eoseSent = false;
    let eoseTimeout = setTimeout(
      () => {
        eoseSent = true;
        for (let cb of eoseListeners.values())
          cb();
      },
      opts?.eoseSubTimeout || this.eoseSubTimeout
    );
    relays.filter((r, i, a) => a.indexOf(r) === i).forEach(async (relay) => {
      let r;
      try {
        r = await this.ensureRelay(relay);
      } catch (err) {
        handleEose();
        return;
      }
      if (!r)
        return;
      let s = r.sub(filters, modifiedOpts);
      s.on("event", (event) => {
        _knownIds.add(event.id);
        for (let cb of eventListeners.values())
          cb(event);
      });
      s.on("eose", () => {
        if (eoseSent)
          return;
        handleEose();
      });
      subs.push(s);
      function handleEose() {
        eosesMissing--;
        if (eosesMissing === 0) {
          clearTimeout(eoseTimeout);
          for (let cb of eoseListeners.values())
            cb();
        }
      }
    });
    let greaterSub = {
      sub(filters2, opts2) {
        subs.forEach((sub) => sub.sub(filters2, opts2));
        return greaterSub;
      },
      unsub() {
        subs.forEach((sub) => sub.unsub());
      },
      on(type, cb) {
        if (type === "event") {
          eventListeners.add(cb);
        } else if (type === "eose") {
          eoseListeners.add(cb);
        }
      },
      off(type, cb) {
        if (type === "event") {
          eventListeners.delete(cb);
        } else if (type === "eose")
          eoseListeners.delete(cb);
      },
      get events() {
        return eventsGenerator(greaterSub);
      }
    };
    return greaterSub;
  }
  get(relays, filter, opts) {
    return new Promise((resolve) => {
      let sub = this.sub(relays, [filter], opts);
      let timeout = setTimeout(() => {
        sub.unsub();
        resolve(null);
      }, this.getTimeout);
      sub.on("event", (event) => {
        resolve(event);
        clearTimeout(timeout);
        sub.unsub();
      });
    });
  }
  list(relays, filters, opts) {
    return new Promise((resolve) => {
      let events = [];
      let sub = this.sub(relays, filters, opts);
      sub.on("event", (event) => {
        events.push(event);
      });
      sub.on("eose", () => {
        sub.unsub();
        resolve(events);
      });
    });
  }
  batchedList(batchKey, relays, filters) {
    return new Promise((resolve) => {
      if (!this.batchedByKey[batchKey]) {
        this.batchedByKey[batchKey] = [
          {
            filters,
            relays,
            resolve,
            events: []
          }
        ];
        setTimeout(() => {
          Object.keys(this.batchedByKey).forEach(async (batchKey2) => {
            const batchedRequests = this.batchedByKey[batchKey2];
            const filters2 = [];
            const relays2 = [];
            batchedRequests.forEach((br) => {
              filters2.push(...br.filters);
              relays2.push(...br.relays);
            });
            const sub = this.sub(relays2, [mergeFilters$1(...filters2)]);
            sub.on("event", (event) => {
              batchedRequests.forEach((br) => matchFilters(br.filters, event) && br.events.push(event));
            });
            sub.on("eose", () => {
              sub.unsub();
              batchedRequests.forEach((br) => br.resolve(br.events));
            });
            delete this.batchedByKey[batchKey2];
          });
        }, this.batchInterval);
      } else {
        this.batchedByKey[batchKey].push({
          filters,
          relays,
          resolve,
          events: []
        });
      }
    });
  }
  publish(relays, event) {
    return relays.map(async (relay) => {
      let r = await this.ensureRelay(relay);
      return r.publish(event);
    });
  }
  seenOn(id) {
    return Array.from(this._seenOn[id]?.values?.() || []);
  }
};

// nip19.ts
var nip19_exports = {};
__export(nip19_exports, {
  BECH32_REGEX: () => BECH32_REGEX,
  decode: () => decode,
  naddrEncode: () => naddrEncode,
  neventEncode: () => neventEncode,
  noteEncode: () => noteEncode,
  nprofileEncode: () => nprofileEncode,
  npubEncode: () => npubEncode,
  nrelayEncode: () => nrelayEncode,
  nsecEncode: () => nsecEncode
});
var Bech32MaxSize = 5e3;
var BECH32_REGEX = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array(number) {
  const uint8Array = new Uint8Array(4);
  uint8Array[0] = number >> 24 & 255;
  uint8Array[1] = number >> 16 & 255;
  uint8Array[2] = number >> 8 & 255;
  uint8Array[3] = number & 255;
  return uint8Array;
}
function decode(nip19) {
  let { prefix, words } = bech32$1.decode(nip19, Bech32MaxSize);
  let data = new Uint8Array(bech32$1.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex$5(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (tlv[3] && tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: bytesToHex$5(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
          author: tlv[2]?.[0] ? bytesToHex$5(tlv[2][0]) : void 0,
          kind: tlv[3]?.[0] ? parseInt(bytesToHex$5(tlv[3][0]), 16) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!tlv[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!tlv[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: bytesToHex$5(tlv[2][0]),
          kind: parseInt(bytesToHex$5(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nrelay": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nrelay");
      return {
        type: "nrelay",
        data: utf8Decoder.decode(tlv[0][0])
      };
    }
    case "nsec":
    case "npub":
    case "note":
      return { type: prefix, data: bytesToHex$5(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    let t = rest[0];
    let l = rest[1];
    if (!l)
      throw new Error(`malformed TLV ${t}`);
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l)
      throw new Error(`not enough data to read on TLV ${t}`);
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}
function nsecEncode(hex) {
  return encodeBytes("nsec", hex);
}
function npubEncode(hex) {
  return encodeBytes("npub", hex);
}
function noteEncode(hex) {
  return encodeBytes("note", hex);
}
function encodeBech32(prefix, data) {
  let words = bech32$1.toWords(data);
  return bech32$1.encode(prefix, words, Bech32MaxSize);
}
function encodeBytes(prefix, hex) {
  let data = hexToBytes$4(hex);
  return encodeBech32(prefix, data);
}
function nprofileEncode(profile) {
  let data = encodeTLV({
    0: [hexToBytes$4(profile.pubkey)],
    1: (profile.relays || []).map((url) => utf8Encoder.encode(url))
  });
  return encodeBech32("nprofile", data);
}
function neventEncode(event) {
  let kindArray;
  if (event.kind != void 0) {
    kindArray = integerToUint8Array(event.kind);
  }
  let data = encodeTLV({
    0: [hexToBytes$4(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder.encode(url)),
    2: event.author ? [hexToBytes$4(event.author)] : [],
    3: kindArray ? [new Uint8Array(kindArray)] : []
  });
  return encodeBech32("nevent", data);
}
function naddrEncode(addr) {
  let kind = new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  let data = encodeTLV({
    0: [utf8Encoder.encode(addr.identifier)],
    1: (addr.relays || []).map((url) => utf8Encoder.encode(url)),
    2: [hexToBytes$4(addr.pubkey)],
    3: [new Uint8Array(kind)]
  });
  return encodeBech32("naddr", data);
}
function nrelayEncode(url) {
  let data = encodeTLV({
    0: [utf8Encoder.encode(url)]
  });
  return encodeBech32("nrelay", data);
}
function encodeTLV(tlv) {
  let entries = [];
  Object.entries(tlv).forEach(([t, vs]) => {
    vs.forEach((v) => {
      let entry = new Uint8Array(v.length + 2);
      entry.set([parseInt(t)], 0);
      entry.set([v.length], 1);
      entry.set(v, 2);
      entries.push(entry);
    });
  });
  return concatBytes$6(...entries);
}

// nip04.ts
var nip04_exports = {};
__export(nip04_exports, {
  decrypt: () => decrypt$1,
  encrypt: () => encrypt$1
});
if (typeof crypto !== "undefined" && !crypto.subtle && crypto.webcrypto) {
  crypto.subtle = crypto.webcrypto.subtle;
}
async function encrypt$1(privkey, pubkey, text) {
  const key = secp256k1$2.getSharedSecret(privkey, "02" + pubkey);
  const normalizedKey = getNormalizedX(key);
  let iv = Uint8Array.from(randomBytes$3(16));
  let plaintext = utf8Encoder.encode(text);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["encrypt"]);
  let ciphertext = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, cryptoKey, plaintext);
  let ctb64 = base64.encode(new Uint8Array(ciphertext));
  let ivb64 = base64.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
async function decrypt$1(privkey, pubkey, data) {
  let [ctb64, ivb64] = data.split("?iv=");
  let key = secp256k1$2.getSharedSecret(privkey, "02" + pubkey);
  let normalizedKey = getNormalizedX(key);
  let cryptoKey = await crypto.subtle.importKey("raw", normalizedKey, { name: "AES-CBC" }, false, ["decrypt"]);
  let ciphertext = base64.decode(ctb64);
  let iv = base64.decode(ivb64);
  let plaintext = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, ciphertext);
  let text = utf8Decoder.decode(plaintext);
  return text;
}
function getNormalizedX(key) {
  return key.slice(1, 33);
}

// nip05.ts
var nip05_exports = {};
__export(nip05_exports, {
  NIP05_REGEX: () => NIP05_REGEX$1,
  queryProfile: () => queryProfile,
  searchDomain: () => searchDomain,
  useFetchImplementation: () => useFetchImplementation
});
var NIP05_REGEX$1 = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
var _fetch;
try {
  _fetch = fetch;
} catch {
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function searchDomain(domain, query = "") {
  try {
    let res = await (await _fetch(`https://${domain}/.well-known/nostr.json?name=${query}`)).json();
    return res.names;
  } catch (_) {
    return {};
  }
}
async function queryProfile(fullname) {
  const match = fullname.match(NIP05_REGEX$1);
  if (!match)
    return null;
  const [_, name = "_", domain] = match;
  try {
    const res = await _fetch(`https://${domain}/.well-known/nostr.json?name=${name}`);
    const { names, relays } = parseNIP05Result$1(await res.json());
    const pubkey = names[name];
    return pubkey ? { pubkey, relays: relays?.[pubkey] } : null;
  } catch (_e) {
    return null;
  }
}
function parseNIP05Result$1(json) {
  const result = {
    names: {}
  };
  for (const [name, pubkey] of Object.entries(json.names)) {
    if (typeof name === "string" && typeof pubkey === "string") {
      result.names[name] = pubkey;
    }
  }
  if (json.relays) {
    result.relays = {};
    for (const [pubkey, relays] of Object.entries(json.relays)) {
      if (typeof pubkey === "string" && Array.isArray(relays)) {
        result.relays[pubkey] = relays.filter((relay) => typeof relay === "string");
      }
    }
  }
  return result;
}

// nip06.ts
var nip06_exports = {};
__export(nip06_exports, {
  generateSeedWords: () => generateSeedWords,
  privateKeyFromSeedWords: () => privateKeyFromSeedWords,
  validateWords: () => validateWords
});
function privateKeyFromSeedWords(mnemonic, passphrase) {
  let root = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic, passphrase));
  let privateKey = root.derive(`m/44'/1237'/0'/0/0`).privateKey;
  if (!privateKey)
    throw new Error("could not derive private key");
  return bytesToHex$5(privateKey);
}
function generateSeedWords() {
  return generateMnemonic(wordlist);
}
function validateWords(words) {
  return validateMnemonic(words, wordlist);
}

// nip10.ts
var nip10_exports = {};
__export(nip10_exports, {
  parse: () => parse
});
function parse(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: []
  };
  const eTags = [];
  for (const tag of event.tags) {
    if (tag[0] === "e" && tag[1]) {
      eTags.push(tag);
    }
    if (tag[0] === "p" && tag[1]) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : []
      });
    }
  }
  for (let eTagIndex = 0; eTagIndex < eTags.length; eTagIndex++) {
    const eTag = eTags[eTagIndex];
    const [_, eTagEventId, eTagRelayUrl, eTagMarker] = eTag;
    const eventPointer = {
      id: eTagEventId,
      relays: eTagRelayUrl ? [eTagRelayUrl] : []
    };
    const isFirstETag = eTagIndex === 0;
    const isLastETag = eTagIndex === eTags.length - 1;
    if (eTagMarker === "root") {
      result.root = eventPointer;
      continue;
    }
    if (eTagMarker === "reply") {
      result.reply = eventPointer;
      continue;
    }
    if (eTagMarker === "mention") {
      result.mentions.push(eventPointer);
      continue;
    }
    if (isFirstETag) {
      result.root = eventPointer;
      continue;
    }
    if (isLastETag) {
      result.reply = eventPointer;
      continue;
    }
    result.mentions.push(eventPointer);
  }
  return result;
}

// nip13.ts
var nip13_exports = {};
__export(nip13_exports, {
  getPow: () => getPow,
  minePow: () => minePow
});
function getPow(hex) {
  let count = 0;
  for (let i = 0; i < hex.length; i++) {
    const nibble = parseInt(hex[i], 16);
    if (nibble === 0) {
      count += 4;
    } else {
      count += Math.clz32(nibble) - 28;
      break;
    }
  }
  return count;
}
function minePow(unsigned, difficulty) {
  let count = 0;
  const event = unsigned;
  const tag = ["nonce", count.toString(), difficulty.toString()];
  event.tags.push(tag);
  while (true) {
    const now = Math.floor(new Date().getTime() / 1e3);
    if (now !== event.created_at) {
      count = 0;
      event.created_at = now;
    }
    tag[1] = (++count).toString();
    event.id = getEventHash$1(event);
    if (getPow(event.id) >= difficulty) {
      break;
    }
  }
  return event;
}

// nip18.ts
var nip18_exports = {};
__export(nip18_exports, {
  finishRepostEvent: () => finishRepostEvent,
  getRepostedEvent: () => getRepostedEvent,
  getRepostedEventPointer: () => getRepostedEventPointer
});
function finishRepostEvent(t, reposted, relayUrl, privateKey) {
  return finishEvent(
    {
      kind: 6 /* Repost */,
      tags: [...t.tags ?? [], ["e", reposted.id, relayUrl], ["p", reposted.pubkey]],
      content: t.content === "" ? "" : JSON.stringify(reposted),
      created_at: t.created_at
    },
    privateKey
  );
}
function getRepostedEventPointer(event) {
  if (event.kind !== 6 /* Repost */) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i = event.tags.length - 1; i >= 0 && (lastETag === void 0 || lastPTag === void 0); i--) {
    const tag = event.tags[i];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag?.[2]].filter((x) => typeof x === "string"),
    author: lastPTag?.[1]
  };
}
function getRepostedEvent(event, { skipVerification } = {}) {
  const pointer = getRepostedEventPointer(event);
  if (pointer === void 0 || event.content === "") {
    return void 0;
  }
  let repostedEvent;
  try {
    repostedEvent = JSON.parse(event.content);
  } catch (error) {
    return void 0;
  }
  if (repostedEvent.id !== pointer.id) {
    return void 0;
  }
  if (!skipVerification && !verifySignature$1(repostedEvent)) {
    return void 0;
  }
  return repostedEvent;
}

// nip21.ts
var nip21_exports = {};
__export(nip21_exports, {
  NOSTR_URI_REGEX: () => NOSTR_URI_REGEX,
  parse: () => parse2,
  test: () => test
});
var NOSTR_URI_REGEX = new RegExp(`nostr:(${BECH32_REGEX.source})`);
function test(value) {
  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX.source}$`).test(value);
}
function parse2(uri) {
  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX.source}$`));
  if (!match)
    throw new Error(`Invalid Nostr URI: ${uri}`);
  return {
    uri: match[0],
    value: match[1],
    decoded: decode(match[1])
  };
}

// nip25.ts
var nip25_exports = {};
__export(nip25_exports, {
  finishReactionEvent: () => finishReactionEvent,
  getReactedEventPointer: () => getReactedEventPointer
});
function finishReactionEvent(t, reacted, privateKey) {
  const inheritedTags = reacted.tags.filter((tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
  return finishEvent(
    {
      ...t,
      kind: 7 /* Reaction */,
      tags: [...t.tags ?? [], ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
      content: t.content ?? "+"
    },
    privateKey
  );
}
function getReactedEventPointer(event) {
  if (event.kind !== 7 /* Reaction */) {
    return void 0;
  }
  let lastETag;
  let lastPTag;
  for (let i = event.tags.length - 1; i >= 0 && (lastETag === void 0 || lastPTag === void 0); i--) {
    const tag = event.tags[i];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) {
        lastETag = tag;
      } else if (tag[0] === "p" && lastPTag === void 0) {
        lastPTag = tag;
      }
    }
  }
  if (lastETag === void 0 || lastPTag === void 0) {
    return void 0;
  }
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag[2]].filter((x) => x !== void 0),
    author: lastPTag[1]
  };
}

// nip26.ts
var nip26_exports = {};
__export(nip26_exports, {
  createDelegation: () => createDelegation,
  getDelegator: () => getDelegator
});
function createDelegation(privateKey, parameters) {
  let conditions = [];
  if ((parameters.kind || -1) >= 0)
    conditions.push(`kind=${parameters.kind}`);
  if (parameters.until)
    conditions.push(`created_at<${parameters.until}`);
  if (parameters.since)
    conditions.push(`created_at>${parameters.since}`);
  let cond = conditions.join("&");
  if (cond === "")
    throw new Error("refusing to create a delegation without any conditions");
  let sighash = sha256$4(utf8Encoder.encode(`nostr:delegation:${parameters.pubkey}:${cond}`));
  let sig = bytesToHex$5(schnorr$1.sign(sighash, privateKey));
  return {
    from: getPublicKey(privateKey),
    to: parameters.pubkey,
    cond,
    sig
  };
}
function getDelegator(event) {
  let tag = event.tags.find((tag2) => tag2[0] === "delegation" && tag2.length >= 4);
  if (!tag)
    return null;
  let pubkey = tag[1];
  let cond = tag[2];
  let sig = tag[3];
  let conditions = cond.split("&");
  for (let i = 0; i < conditions.length; i++) {
    let [key, operator, value] = conditions[i].split(/\b/);
    if (key === "kind" && operator === "=" && event.kind === parseInt(value))
      continue;
    else if (key === "created_at" && operator === "<" && event.created_at < parseInt(value))
      continue;
    else if (key === "created_at" && operator === ">" && event.created_at > parseInt(value))
      continue;
    else
      return null;
  }
  let sighash = sha256$4(utf8Encoder.encode(`nostr:delegation:${event.pubkey}:${cond}`));
  if (!schnorr$1.verify(sig, sighash, pubkey))
    return null;
  return pubkey;
}

// nip27.ts
var nip27_exports = {};
__export(nip27_exports, {
  matchAll: () => matchAll,
  regex: () => regex,
  replaceAll: () => replaceAll
});
var regex = () => new RegExp(`\\b${NOSTR_URI_REGEX.source}\\b`, "g");
function* matchAll(content) {
  const matches = content.matchAll(regex());
  for (const match of matches) {
    try {
      const [uri, value] = match;
      yield {
        uri,
        value,
        decoded: decode(value),
        start: match.index,
        end: match.index + uri.length
      };
    } catch (_e) {
    }
  }
}
function replaceAll(content, replacer) {
  return content.replaceAll(regex(), (uri, value) => {
    return replacer({
      uri,
      value,
      decoded: decode(value)
    });
  });
}

// nip28.ts
var nip28_exports = {};
__export(nip28_exports, {
  channelCreateEvent: () => channelCreateEvent,
  channelHideMessageEvent: () => channelHideMessageEvent,
  channelMessageEvent: () => channelMessageEvent,
  channelMetadataEvent: () => channelMetadataEvent,
  channelMuteUserEvent: () => channelMuteUserEvent
});
var channelCreateEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 40 /* ChannelCreation */,
      tags: [...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMetadataEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 41 /* ChannelMetadata */,
      tags: [["e", t.channel_create_event_id], ...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMessageEvent = (t, privateKey) => {
  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
  if (t.reply_to_channel_message_event_id) {
    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
  }
  return finishEvent(
    {
      kind: 42 /* ChannelMessage */,
      tags: [...tags, ...t.tags ?? []],
      content: t.content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelHideMessageEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 43 /* ChannelHideMessage */,
      tags: [["e", t.channel_message_event_id], ...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};
var channelMuteUserEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") {
    content = JSON.stringify(t.content);
  } else if (typeof t.content === "string") {
    content = t.content;
  } else {
    return void 0;
  }
  return finishEvent(
    {
      kind: 44 /* ChannelMuteUser */,
      tags: [["p", t.pubkey_to_mute], ...t.tags ?? []],
      content,
      created_at: t.created_at
    },
    privateKey
  );
};

// nip39.ts
var nip39_exports = {};
__export(nip39_exports, {
  useFetchImplementation: () => useFetchImplementation2,
  validateGithub: () => validateGithub
});
var _fetch2;
try {
  _fetch2 = fetch;
} catch {
}
function useFetchImplementation2(fetchImplementation) {
  _fetch2 = fetchImplementation;
}
async function validateGithub(pubkey, username, proof) {
  try {
    let res = await (await _fetch2(`https://gist.github.com/${username}/${proof}/raw`)).text();
    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
  } catch (_) {
    return false;
  }
}

// nip42.ts
var nip42_exports = {};
__export(nip42_exports, {
  authenticate: () => authenticate
});
var authenticate = async ({
  challenge,
  relay,
  sign
}) => {
  const e = {
    kind: 22242 /* ClientAuth */,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", relay.url],
      ["challenge", challenge]
    ],
    content: ""
  };
  return relay.auth(await sign(e));
};

// nip44.ts
var nip44_exports = {};
__export(nip44_exports, {
  decrypt: () => decrypt2,
  encrypt: () => encrypt2,
  utils: () => utils$1
});
var utils$1 = {
  v2: {
    maxPlaintextSize: 65536 - 128,
    minCiphertextSize: 100,
    maxCiphertextSize: 102400,
    getConversationKey(privkeyA, pubkeyB) {
      const key = secp256k1$2.getSharedSecret(privkeyA, "02" + pubkeyB);
      return key.subarray(1, 33);
    },
    getMessageKeys(conversationKey, salt) {
      const keys = hkdf(sha256$4, conversationKey, salt, "nip44-v2", 76);
      return {
        encryption: keys.subarray(0, 32),
        nonce: keys.subarray(32, 44),
        auth: keys.subarray(44, 76)
      };
    },
    calcPadding(len) {
      if (!Number.isSafeInteger(len) || len < 0)
        throw new Error("expected positive integer");
      if (len <= 32)
        return 32;
      const nextpower = 1 << Math.floor(Math.log2(len - 1)) + 1;
      const chunk = nextpower <= 256 ? 32 : nextpower / 8;
      return chunk * (Math.floor((len - 1) / chunk) + 1);
    },
    pad(unpadded) {
      const unpaddedB = utf8Encoder.encode(unpadded);
      const len = unpaddedB.length;
      if (len < 1 || len >= utils$1.v2.maxPlaintextSize)
        throw new Error("invalid plaintext length: must be between 1b and 64KB");
      const paddedLen = utils$1.v2.calcPadding(len);
      const zeros = new Uint8Array(paddedLen - len);
      const lenBuf = new Uint8Array(2);
      new DataView(lenBuf.buffer).setUint16(0, len);
      return concatBytes$6(lenBuf, unpaddedB, zeros);
    },
    unpad(padded) {
      const unpaddedLen = new DataView(padded.buffer).getUint16(0);
      const unpadded = padded.subarray(2, 2 + unpaddedLen);
      if (unpaddedLen === 0 || unpadded.length !== unpaddedLen || padded.length !== 2 + utils$1.v2.calcPadding(unpaddedLen))
        throw new Error("invalid padding");
      return utf8Decoder.decode(unpadded);
    }
  }
};
function encrypt2(key, plaintext, options = {}) {
  const version = options.version ?? 2;
  if (version !== 2)
    throw new Error("unknown encryption version " + version);
  const salt = options.salt ?? randomBytes$3(32);
  ensureBytes$1(salt, 32);
  const keys = utils$1.v2.getMessageKeys(key, salt);
  const padded = utils$1.v2.pad(plaintext);
  const ciphertext = chacha20(keys.encryption, keys.nonce, padded);
  const mac = hmac$4(sha256$4, keys.auth, ciphertext);
  return base64.encode(concatBytes$6(new Uint8Array([version]), salt, ciphertext, mac));
}
function decrypt2(key, ciphertext) {
  const u = utils$1.v2;
  ensureBytes$1(key, 32);
  const clen = ciphertext.length;
  if (clen < u.minCiphertextSize || clen >= u.maxCiphertextSize)
    throw new Error("invalid ciphertext length: " + clen);
  if (ciphertext[0] === "#")
    throw new Error("unknown encryption version");
  let data;
  try {
    data = base64.decode(ciphertext);
  } catch (error) {
    throw new Error("invalid base64: " + error.message);
  }
  const vers = data.subarray(0, 1)[0];
  if (vers !== 2)
    throw new Error("unknown encryption version " + vers);
  const salt = data.subarray(1, 33);
  const ciphertext_ = data.subarray(33, -32);
  const mac = data.subarray(-32);
  const keys = u.getMessageKeys(key, salt);
  const calculatedMac = hmac$4(sha256$4, keys.auth, ciphertext_);
  if (!equalBytes$1(calculatedMac, mac))
    throw new Error("invalid MAC");
  const padded = chacha20(keys.encryption, keys.nonce, ciphertext_);
  return u.unpad(padded);
}

// nip47.ts
var nip47_exports = {};
__export(nip47_exports, {
  makeNwcRequestEvent: () => makeNwcRequestEvent,
  parseConnectionString: () => parseConnectionString
});
function parseConnectionString(connectionString) {
  const { pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname;
  const relay = searchParams.get("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || !relay || !secret) {
    throw new Error("invalid connection string");
  }
  return { pubkey, relay, secret };
}
async function makeNwcRequestEvent({
  pubkey,
  secret,
  invoice
}) {
  const content = {
    method: "pay_invoice",
    params: {
      invoice
    }
  };
  const encryptedContent = await encrypt$1(secret, pubkey, JSON.stringify(content));
  const eventTemplate = {
    kind: 23194 /* NwcRequest */,
    created_at: Math.round(Date.now() / 1e3),
    content: encryptedContent,
    tags: [["p", pubkey]]
  };
  return finishEvent(eventTemplate, secret);
}

// nip57.ts
var nip57_exports = {};
__export(nip57_exports, {
  getZapEndpoint: () => getZapEndpoint,
  makeZapReceipt: () => makeZapReceipt,
  makeZapRequest: () => makeZapRequest,
  useFetchImplementation: () => useFetchImplementation3,
  validateZapRequest: () => validateZapRequest
});
var _fetch3;
try {
  _fetch3 = fetch;
} catch {
}
function useFetchImplementation3(fetchImplementation) {
  _fetch3 = fetchImplementation;
}
async function getZapEndpoint(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud06) {
      let { words } = bech32$1.decode(lud06, 1e3);
      let data = bech32$1.fromWords(words);
      lnurl = utf8Decoder.decode(data);
    } else if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = `https://${domain}/.well-known/lnurlp/${name}`;
    } else {
      return null;
    }
    let res = await _fetch3(lnurl);
    let body = await res.json();
    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
  }
  return null;
}
function makeZapRequest({
  profile,
  event,
  amount,
  relays,
  comment = ""
}) {
  if (!amount)
    throw new Error("amount not given");
  if (!profile)
    throw new Error("profile not given");
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: comment,
    tags: [
      ["p", profile],
      ["amount", amount.toString()],
      ["relays", ...relays]
    ]
  };
  if (event) {
    zr.tags.push(["e", event]);
  }
  return zr;
}
function validateZapRequest(zapRequestString) {
  let zapRequest;
  try {
    zapRequest = JSON.parse(zapRequestString);
  } catch (err) {
    return "Invalid zap request JSON.";
  }
  if (!validateEvent(zapRequest))
    return "Zap request is not a valid Nostr event.";
  if (!verifySignature$1(zapRequest))
    return "Invalid signature on zap request.";
  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
  if (!p)
    return "Zap request doesn't have a 'p' tag.";
  if (!p[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
  if (e && !e[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'e' tag is not valid hex.";
  let relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
  if (!relays)
    return "Zap request doesn't have a 'relays' tag.";
  return null;
}
function makeZapReceipt({
  zapRequest,
  preimage,
  bolt11,
  paidAt
}) {
  let zr = JSON.parse(zapRequest);
  let tagsFromZapRequest = zr.tags.filter(([t]) => t === "e" || t === "p" || t === "a");
  let zap = {
    kind: 9735,
    created_at: Math.round(paidAt.getTime() / 1e3),
    content: "",
    tags: [...tagsFromZapRequest, ["bolt11", bolt11], ["description", zapRequest]]
  };
  if (preimage) {
    zap.tags.push(["preimage", preimage]);
  }
  return zap;
}

// nip98.ts
var nip98_exports = {};
__export(nip98_exports, {
  getToken: () => getToken,
  unpackEventFromToken: () => unpackEventFromToken,
  validateEvent: () => validateEvent2,
  validateToken: () => validateToken
});
var _authorizationScheme = "Nostr ";
async function getToken(loginUrl, httpMethod, sign, includeAuthorizationScheme = false) {
  if (!loginUrl || !httpMethod)
    throw new Error("Missing loginUrl or httpMethod");
  const event = getBlankEvent(27235 /* HttpAuth */);
  event.tags = [
    ["u", loginUrl],
    ["method", httpMethod]
  ];
  event.created_at = Math.round(new Date().getTime() / 1e3);
  const signedEvent = await sign(event);
  const authorizationScheme = includeAuthorizationScheme ? _authorizationScheme : "";
  return authorizationScheme + base64.encode(utf8Encoder.encode(JSON.stringify(signedEvent)));
}
async function validateToken(token, url, method) {
  const event = await unpackEventFromToken(token).catch((error) => {
    throw error;
  });
  const valid = await validateEvent2(event, url, method).catch((error) => {
    throw error;
  });
  return valid;
}
async function unpackEventFromToken(token) {
  if (!token) {
    throw new Error("Missing token");
  }
  token = token.replace(_authorizationScheme, "");
  const eventB64 = utf8Decoder.decode(base64.decode(token));
  if (!eventB64 || eventB64.length === 0 || !eventB64.startsWith("{")) {
    throw new Error("Invalid token");
  }
  const event = JSON.parse(eventB64);
  return event;
}
async function validateEvent2(event, url, method) {
  if (!event) {
    throw new Error("Invalid nostr event");
  }
  if (!verifySignature$1(event)) {
    throw new Error("Invalid nostr event, signature invalid");
  }
  if (event.kind !== 27235 /* HttpAuth */) {
    throw new Error("Invalid nostr event, kind invalid");
  }
  if (!event.created_at) {
    throw new Error("Invalid nostr event, created_at invalid");
  }
  if (Math.round(new Date().getTime() / 1e3) - event.created_at > 60) {
    throw new Error("Invalid nostr event, expired");
  }
  const urlTag = event.tags.find((t) => t[0] === "u");
  if (urlTag?.length !== 1 && urlTag?.[1] !== url) {
    throw new Error("Invalid nostr event, url tag invalid");
  }
  const methodTag = event.tags.find((t) => t[0] === "method");
  if (methodTag?.length !== 1 && methodTag?.[1].toLowerCase() !== method.toLowerCase()) {
    throw new Error("Invalid nostr event, method tag invalid");
  }
  return true;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var lib$1 = {};

var types = {};

Object.defineProperty(types, "__esModule", { value: true });

var ee = {};

var taskCollection$1 = {};

var taskCollection = {};

var bakeCollection = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bakeCollectionVariadic = exports.bakeCollectionAwait = exports.bakeCollection = exports.BAKED_EMPTY_FUNC = void 0;
	exports.BAKED_EMPTY_FUNC = (function () { });
	var FORLOOP_FALLBACK = 1500;
	function generateArgsDefCode(numArgs) {
	    var argsDefCode = '';
	    if (numArgs === 0)
	        return argsDefCode;
	    for (var i = 0; i < numArgs - 1; ++i) {
	        argsDefCode += ('arg' + String(i) + ', ');
	    }
	    argsDefCode += ('arg' + String(numArgs - 1));
	    return argsDefCode;
	}
	function generateBodyPartsCode(argsDefCode, collectionLength) {
	    var funcDefCode = '', funcCallCode = '';
	    for (var i = 0; i < collectionLength; ++i) {
	        funcDefCode += "var f".concat(i, " = collection[").concat(i, "];\n");
	        funcCallCode += "f".concat(i, "(").concat(argsDefCode, ")\n");
	    }
	    return { funcDefCode: funcDefCode, funcCallCode: funcCallCode };
	}
	function generateBodyPartsVariadicCode(collectionLength) {
	    var funcDefCode = '', funcCallCode = '';
	    for (var i = 0; i < collectionLength; ++i) {
	        funcDefCode += "var f".concat(i, " = collection[").concat(i, "];\n");
	        funcCallCode += "f".concat(i, ".apply(undefined, arguments)\n");
	    }
	    return { funcDefCode: funcDefCode, funcCallCode: funcCallCode };
	}
	function bakeCollection(collection, fixedArgsNum) {
	    if (collection.length === 0)
	        return exports.BAKED_EMPTY_FUNC;
	    else if (collection.length === 1)
	        return collection[0];
	    var funcFactoryCode;
	    if (collection.length < FORLOOP_FALLBACK) {
	        var argsDefCode = generateArgsDefCode(fixedArgsNum);
	        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
	        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                ").concat(funcCallCode, "\n            });\n        })");
	    }
	    else {
	        var argsDefCode = generateArgsDefCode(fixedArgsNum);
	        // loop unroll
	        if (collection.length % 10 === 0) {
	            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 10) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                        collection[i+4](").concat(argsDefCode, ");\n                        collection[i+5](").concat(argsDefCode, ");\n                        collection[i+6](").concat(argsDefCode, ");\n                        collection[i+7](").concat(argsDefCode, ");\n                        collection[i+8](").concat(argsDefCode, ");\n                        collection[i+9](").concat(argsDefCode, ");\n                    }\n                });\n            })");
	        }
	        else if (collection.length % 4 === 0) {
	            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 4) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                    }\n                });\n            })");
	        }
	        else if (collection.length % 3 === 0) {
	            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 3) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                    }\n                });\n            })");
	        }
	        else {
	            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; ++i) {\n                        collection[i](").concat(argsDefCode, ");\n                    }\n                });\n            })");
	        }
	    }
	    {
	        var funcFactory = eval(funcFactoryCode);
	        return funcFactory(collection);
	    }
	}
	exports.bakeCollection = bakeCollection;
	function bakeCollectionAwait(collection, fixedArgsNum) {
	    if (collection.length === 0)
	        return exports.BAKED_EMPTY_FUNC;
	    else if (collection.length === 1)
	        return collection[0];
	    var funcFactoryCode;
	    if (collection.length < FORLOOP_FALLBACK) {
	        var argsDefCode = generateArgsDefCode(fixedArgsNum);
	        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
	        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                return Promise.all([ ").concat(funcCallCode, " ]);\n            });\n        })");
	    }
	    else {
	        var argsDefCode = generateArgsDefCode(fixedArgsNum);
	        funcFactoryCode = "(function(collection) {\n            return (function(".concat(argsDefCode, ") {\n                var promises = Array(collection.length);\n                for (var i = 0; i < collection.length; ++i) {\n                    promises[i] = collection[i](").concat(argsDefCode, ");\n                }\n                return Promise.all(promises);\n            });\n        })");
	    }
	    {
	        var funcFactory = eval(funcFactoryCode);
	        return funcFactory(collection);
	    }
	}
	exports.bakeCollectionAwait = bakeCollectionAwait;
	function bakeCollectionVariadic(collection) {
	    if (collection.length === 0)
	        return exports.BAKED_EMPTY_FUNC;
	    else if (collection.length === 1)
	        return collection[0];
	    var funcFactoryCode;
	    if (collection.length < FORLOOP_FALLBACK) {
	        var _a = generateBodyPartsVariadicCode(collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
	        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function() {\n                ").concat(funcCallCode, "\n            });\n        })");
	    }
	    else {
	        funcFactoryCode = "(function(collection) {\n            return (function() {\n                for (var i = 0; i < collection.length; ++i) {\n                    collection[i].apply(undefined, arguments);\n                }\n            });\n        })";
	    }
	    {
	        var funcFactory = eval(funcFactoryCode);
	        return funcFactory(collection);
	    }
	}
	exports.bakeCollectionVariadic = bakeCollectionVariadic;
	
} (bakeCollection));

var __spreadArray$1 = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(taskCollection, "__esModule", { value: true });
taskCollection.TaskCollection = taskCollection._fast_remove_single = void 0;
var bake_collection_1 = bakeCollection;
function push_norebuild(a, b /*, ...func: Func[] */) {
    var len = this.length;
    if (len > 1) { // tasks is array
        if (b) { // if multiple args
            var _a;
            (_a = this._tasks).push.apply(_a, arguments);
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            this._tasks.push(a);
            this.length++;
        }
    }
    else { // tasks is (function or null)
        if (b) { // if multiple args
            if (len === 1) { // if this._tasks is function
                var newAr = Array(1 + arguments.length);
                newAr.push(newAr);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            else {
                var newAr = Array(arguments.length);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            if (len === 1)
                this._tasks = [this._tasks, a];
            else
                this._tasks = a;
            this.length++;
        }
    }
}
function push_rebuild(a, b /*, ...func: Func[] */) {
    var len = this.length;
    if (len > 1) { // tasks is array
        if (b) { // if multiple args
            var _a;
            (_a = this._tasks).push.apply(_a, arguments);
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            this._tasks.push(a);
            this.length++;
        }
    }
    else { // tasks is (function or null)
        if (b) { // if multiple args
            if (len === 1) { // if this._tasks is function
                var newAr = Array(1 + arguments.length);
                newAr.push(newAr);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            else {
                var newAr = Array(arguments.length);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            if (len === 1)
                this._tasks = [this._tasks, a];
            else
                this._tasks = a;
            this.length++;
        }
    }
    if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
    else
        this.rebuild();
}
function _fast_remove_single(arr, index) {
    if (index === -1)
        return;
    if (index === 0)
        arr.shift();
    else if (index === arr.length - 1)
        arr.length = arr.length - 1;
    else
        arr.splice(index, 1);
}
taskCollection._fast_remove_single = _fast_remove_single;
function removeLast_norebuild(a) {
    if (this.length === 0)
        return;
    if (this.length === 1) {
        if (this._tasks === a) {
            this.length = 0;
        }
    }
    else {
        _fast_remove_single(this._tasks, this._tasks.lastIndexOf(a));
        if (this._tasks.length === 1) {
            this._tasks = this._tasks[0];
            this.length = 1;
        }
        else
            this.length = this._tasks.length;
    }
}
function removeLast_rebuild(a) {
    if (this.length === 0)
        return;
    if (this.length === 1) {
        if (this._tasks === a) {
            this.length = 0;
        }
        if (this.firstEmitBuildStrategy) {
            this.call = bake_collection_1.BAKED_EMPTY_FUNC;
            return;
        }
        else {
            this.rebuild();
            return;
        }
    }
    else {
        _fast_remove_single(this._tasks, this._tasks.lastIndexOf(a));
        if (this._tasks.length === 1) {
            this._tasks = this._tasks[0];
            this.length = 1;
        }
        else
            this.length = this._tasks.length;
    }
    if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
    else
        this.rebuild();
}
function insert_norebuild(index) {
    var _b;
    var func = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        func[_i - 1] = arguments[_i];
    }
    if (this.length === 0) {
        this._tasks = func;
        this.length = 1;
    }
    else if (this.length === 1) {
        func.unshift(this._tasks);
        this._tasks = func;
        this.length = this._tasks.length;
    }
    else {
        (_b = this._tasks).splice.apply(_b, __spreadArray$1([index, 0], func, false));
        this.length = this._tasks.length;
    }
}
function insert_rebuild(index) {
    var _b;
    var func = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        func[_i - 1] = arguments[_i];
    }
    if (this.length === 0) {
        this._tasks = func;
        this.length = 1;
    }
    else if (this.length === 1) {
        func.unshift(this._tasks);
        this._tasks = func;
        this.length = this._tasks.length;
    }
    else {
        (_b = this._tasks).splice.apply(_b, __spreadArray$1([index, 0], func, false));
        this.length = this._tasks.length;
    }
    if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
    else
        this.rebuild();
}
function rebuild_noawait() {
    if (this.length === 0)
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    else if (this.length === 1)
        this.call = this._tasks;
    else
        this.call = (0, bake_collection_1.bakeCollection)(this._tasks, this.argsNum);
}
function rebuild_await() {
    if (this.length === 0)
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    else if (this.length === 1)
        this.call = this._tasks;
    else
        this.call = (0, bake_collection_1.bakeCollectionAwait)(this._tasks, this.argsNum);
}
function rebuild_on_first_call() {
    this.rebuild();
    this.call.apply(undefined, arguments);
}
var TaskCollection = /** @class */ (function () {
    function TaskCollection(argsNum, autoRebuild, initialTasks, awaitTasks) {
        if (autoRebuild === void 0) { autoRebuild = true; }
        if (initialTasks === void 0) { initialTasks = null; }
        if (awaitTasks === void 0) { awaitTasks = false; }
        this.awaitTasks = awaitTasks;
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
        this.argsNum = argsNum;
        this.firstEmitBuildStrategy = true;
        if (awaitTasks)
            this.rebuild = rebuild_await.bind(this);
        else
            this.rebuild = rebuild_noawait.bind(this);
        this.setAutoRebuild(autoRebuild);
        if (initialTasks) {
            if (typeof initialTasks === 'function') {
                this._tasks = initialTasks;
                this.length = 1;
            }
            else {
                this._tasks = initialTasks;
                this.length = initialTasks.length;
            }
        }
        else {
            this._tasks = null;
            this.length = 0;
        }
        if (autoRebuild)
            this.rebuild();
    }
    return TaskCollection;
}());
taskCollection.TaskCollection = TaskCollection;
function fastClear() {
    this._tasks = null;
    this.length = 0;
    this.call = bake_collection_1.BAKED_EMPTY_FUNC;
}
function clear() {
    this._tasks = null;
    this.length = 0;
    this.call = bake_collection_1.BAKED_EMPTY_FUNC;
}
function growArgsNum(argsNum) {
    if (this.argsNum < argsNum) {
        this.argsNum = argsNum;
        if (this.firstEmitBuildStrategy)
            this.call = rebuild_on_first_call;
        else
            this.rebuild();
    }
}
function setAutoRebuild(newVal) {
    if (newVal) {
        this.push = push_rebuild.bind(this);
        this.insert = insert_rebuild.bind(this);
        this.removeLast = removeLast_rebuild.bind(this);
    }
    else {
        this.push = push_norebuild.bind(this);
        this.insert = insert_norebuild.bind(this);
        this.removeLast = removeLast_norebuild.bind(this);
    }
}
function tasksAsArray() {
    if (this.length === 0)
        return [];
    if (this.length === 1)
        return [this._tasks];
    return this._tasks;
}
function setTasks(tasks) {
    if (tasks.length === 0) {
        this.length = 0;
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    }
    else if (tasks.length === 1) {
        this.length = 1;
        this.call = tasks[0];
        this._tasks = tasks[0];
    }
    else {
        this.length = tasks.length;
        this._tasks = tasks;
        if (this.firstEmitBuildStrategy)
            this.call = rebuild_on_first_call;
        else
            this.rebuild();
    }
}
TaskCollection.prototype.fastClear = fastClear;
TaskCollection.prototype.clear = clear;
TaskCollection.prototype.growArgsNum = growArgsNum;
TaskCollection.prototype.setAutoRebuild = setAutoRebuild;
TaskCollection.prototype.tasksAsArray = tasksAsArray;
TaskCollection.prototype.setTasks = setTasks;

(function (exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(taskCollection, exports);
	
} (taskCollection$1));

var utils = {};

Object.defineProperty(utils, "__esModule", { value: true });
utils.nullObj = void 0;
function nullObj() {
    var x = {};
    x.__proto__ = null;
    x.prototype = null;
    return x;
}
utils.nullObj = nullObj;

var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(ee, "__esModule", { value: true });
ee.EventEmitter = void 0;
var task_collection_1 = taskCollection$1;
var utils_1 = utils;
function emit(event, a, b, c, d, e) {
    var ev = this.events[event];
    if (ev) {
        if (ev.length === 0)
            return false;
        if (ev.argsNum < 6) {
            ev.call(a, b, c, d, e);
        }
        else {
            ev.call.apply(undefined, arguments);
        }
        return true;
    }
    return false;
}
function emitHasOnce(event, a, b, c, d, e) {
    var ev = this.events[event];
    if (ev) {
        if (ev.length === 0)
            return false;
        if (ev.argsNum < 6) {
            ev.call(a, b, c, d, e);
        }
        else {
            ev.call.apply(undefined, arguments);
        }
    }
    var oev = this.onceEvents[event];
    if (oev) {
        if (typeof oev === 'function') {
            this.onceEvents[event] = undefined;
            if (arguments.length < 6) {
                oev(a, b, c, d, e);
            }
            else {
                oev.apply(undefined, arguments);
            }
        }
        else {
            var fncs = oev;
            this.onceEvents[event] = undefined;
            if (arguments.length < 6) {
                for (var i = 0; i < fncs.length; ++i)
                    fncs[i](a, b, c, d, e);
            }
            else {
                for (var i = 0; i < fncs.length; ++i)
                    fncs[i].apply(undefined, arguments);
            }
        }
        return true;
    }
    return !!ev;
}
/** Implemented event emitter */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = (0, utils_1.nullObj)();
        this.onceEvents = (0, utils_1.nullObj)();
        this._symbolKeys = new Set;
        this.maxListeners = Infinity;
    }
    Object.defineProperty(EventEmitter.prototype, "_eventsCount", {
        get: function () {
            return this.eventNames().length;
        },
        enumerable: false,
        configurable: true
    });
    return EventEmitter;
}());
ee.EventEmitter = EventEmitter;
function once(event, listener) {
    if (this.emit === emit) {
        this.emit = emitHasOnce;
    }
    switch (typeof this.onceEvents[event]) {
        case 'undefined':
            this.onceEvents[event] = listener;
            if (typeof event === 'symbol')
                this._symbolKeys.add(event);
            break;
        case 'function':
            this.onceEvents[event] = [this.onceEvents[event], listener];
            break;
        case 'object':
            this.onceEvents[event].push(listener);
    }
    return this;
}
function addListener(event, listener, argsNum) {
    if (argsNum === void 0) { argsNum = listener.length; }
    if (typeof listener !== 'function')
        throw new TypeError('The listener must be a function');
    var evtmap = this.events[event];
    if (!evtmap) {
        this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else {
        evtmap.push(listener);
        evtmap.growArgsNum(argsNum);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
            console.warn("Maximum event listeners for \"".concat(String(event), "\" event!"));
    }
    return this;
}
function removeListener(event, listener) {
    var evt = this.events[event];
    if (evt) {
        evt.removeLast(listener);
    }
    var evto = this.onceEvents[event];
    if (evto) {
        if (typeof evto === 'function') {
            this.onceEvents[event] = undefined;
        }
        else if (typeof evto === 'object') {
            if (evto.length === 1 && evto[0] === listener) {
                this.onceEvents[event] = undefined;
            }
            else {
                (0, task_collection_1._fast_remove_single)(evto, evto.lastIndexOf(listener));
            }
        }
    }
    return this;
}
function addListenerBound(event, listener, bindTo, argsNum) {
    if (bindTo === void 0) { bindTo = this; }
    if (argsNum === void 0) { argsNum = listener.length; }
    if (!this.boundFuncs)
        this.boundFuncs = new Map;
    var bound = listener.bind(bindTo);
    this.boundFuncs.set(listener, bound);
    return this.addListener(event, bound, argsNum);
}
function removeListenerBound(event, listener) {
    var _a, _b;
    var bound = (_a = this.boundFuncs) === null || _a === void 0 ? void 0 : _a.get(listener);
    (_b = this.boundFuncs) === null || _b === void 0 ? void 0 : _b.delete(listener);
    return this.removeListener(event, bound);
}
function hasListeners(event) {
    return this.events[event] && !!this.events[event].length;
}
function prependListener(event, listener, argsNum) {
    if (argsNum === void 0) { argsNum = listener.length; }
    if (typeof listener !== 'function')
        throw new TypeError('The listener must be a function');
    var evtmap = this.events[event];
    if (!evtmap || !(evtmap instanceof task_collection_1.TaskCollection)) {
        evtmap = this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else {
        evtmap.insert(0, listener);
        evtmap.growArgsNum(argsNum);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
            console.warn("Maximum event listeners for \"".concat(String(event), "\" event!"));
    }
    return this;
}
function prependOnceListener(event, listener) {
    if (this.emit === emit) {
        this.emit = emitHasOnce;
    }
    var evtmap = this.onceEvents[event];
    if (!evtmap) {
        this.onceEvents[event] = [listener];
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else if (typeof evtmap !== 'object') {
        this.onceEvents[event] = [listener, evtmap];
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else {
        evtmap.unshift(listener);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length) {
            console.warn("Maximum event listeners for \"".concat(String(event), "\" once event!"));
        }
    }
    return this;
}
function removeAllListeners(event) {
    if (event === undefined) {
        this.events = (0, utils_1.nullObj)();
        this.onceEvents = (0, utils_1.nullObj)();
        this._symbolKeys = new Set;
    }
    else {
        this.events[event] = undefined;
        this.onceEvents[event] = undefined;
        if (typeof event === 'symbol')
            this._symbolKeys.delete(event);
    }
    return this;
}
function setMaxListeners(n) {
    this.maxListeners = n;
    return this;
}
function getMaxListeners() {
    return this.maxListeners;
}
function listeners(event) {
    if (this.emit === emit)
        return this.events[event] ? this.events[event].tasksAsArray().slice() : [];
    else {
        if (this.events[event] && this.onceEvents[event]) {
            return __spreadArray(__spreadArray([], this.events[event].tasksAsArray(), true), (typeof this.onceEvents[event] === 'function' ? [this.onceEvents[event]] : this.onceEvents[event]), true);
        }
        else if (this.events[event])
            return this.events[event].tasksAsArray();
        else if (this.onceEvents[event])
            return (typeof this.onceEvents[event] === 'function' ? [this.onceEvents[event]] : this.onceEvents[event]);
        else
            return [];
    }
}
function eventNames() {
    var _this = this;
    if (this.emit === emit) {
        var keys = Object.keys(this.events);
        return __spreadArray(__spreadArray([], keys, true), Array.from(this._symbolKeys), true).filter(function (x) { return (x in _this.events) && _this.events[x] && _this.events[x].length; });
    }
    else {
        var keys = Object.keys(this.events).filter(function (x) { return _this.events[x] && _this.events[x].length; });
        var keysO = Object.keys(this.onceEvents).filter(function (x) { return _this.onceEvents[x] && _this.onceEvents[x].length; });
        return __spreadArray(__spreadArray(__spreadArray([], keys, true), keysO, true), Array.from(this._symbolKeys).filter(function (x) { return (((x in _this.events) && _this.events[x] && _this.events[x].length) ||
            ((x in _this.onceEvents) && _this.onceEvents[x] && _this.onceEvents[x].length)); }), true);
    }
}
function listenerCount(type) {
    if (this.emit === emit)
        return this.events[type] && this.events[type].length || 0;
    else
        return (this.events[type] && this.events[type].length || 0) + (this.onceEvents[type] && this.onceEvents[type].length || 0);
}
EventEmitter.prototype.emit = emit;
EventEmitter.prototype.on = addListener;
EventEmitter.prototype.once = once;
EventEmitter.prototype.addListener = addListener;
EventEmitter.prototype.removeListener = removeListener;
EventEmitter.prototype.addListenerBound = addListenerBound;
EventEmitter.prototype.removeListenerBound = removeListenerBound;
EventEmitter.prototype.hasListeners = hasListeners;
EventEmitter.prototype.prependListener = prependListener;
EventEmitter.prototype.prependOnceListener = prependOnceListener;
EventEmitter.prototype.off = removeListener;
EventEmitter.prototype.removeAllListeners = removeAllListeners;
EventEmitter.prototype.setMaxListeners = setMaxListeners;
EventEmitter.prototype.getMaxListeners = getMaxListeners;
EventEmitter.prototype.listeners = listeners;
EventEmitter.prototype.eventNames = eventNames;
EventEmitter.prototype.listenerCount = listenerCount;

(function (exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(types, exports);
	__exportStar(ee, exports);
	
} (lib$1));

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = requireMs();
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

/* eslint-env browser */

(function (module, exports) {
	/**
	 * This is the web browser implementation of `debug()`.
	 */

	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;

		return () => {
			if (!warned) {
				warned = true;
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}
		};
	})();

	/**
	 * Colors.
	 */

	exports.colors = [
		'#0000CC',
		'#0000FF',
		'#0033CC',
		'#0033FF',
		'#0066CC',
		'#0066FF',
		'#0099CC',
		'#0099FF',
		'#00CC00',
		'#00CC33',
		'#00CC66',
		'#00CC99',
		'#00CCCC',
		'#00CCFF',
		'#3300CC',
		'#3300FF',
		'#3333CC',
		'#3333FF',
		'#3366CC',
		'#3366FF',
		'#3399CC',
		'#3399FF',
		'#33CC00',
		'#33CC33',
		'#33CC66',
		'#33CC99',
		'#33CCCC',
		'#33CCFF',
		'#6600CC',
		'#6600FF',
		'#6633CC',
		'#6633FF',
		'#66CC00',
		'#66CC33',
		'#9900CC',
		'#9900FF',
		'#9933CC',
		'#9933FF',
		'#99CC00',
		'#99CC33',
		'#CC0000',
		'#CC0033',
		'#CC0066',
		'#CC0099',
		'#CC00CC',
		'#CC00FF',
		'#CC3300',
		'#CC3333',
		'#CC3366',
		'#CC3399',
		'#CC33CC',
		'#CC33FF',
		'#CC6600',
		'#CC6633',
		'#CC9900',
		'#CC9933',
		'#CCCC00',
		'#CCCC33',
		'#FF0000',
		'#FF0033',
		'#FF0066',
		'#FF0099',
		'#FF00CC',
		'#FF00FF',
		'#FF3300',
		'#FF3333',
		'#FF3366',
		'#FF3399',
		'#FF33CC',
		'#FF33FF',
		'#FF6600',
		'#FF6633',
		'#FF9900',
		'#FF9933',
		'#FFCC00',
		'#FFCC33'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	// eslint-disable-next-line complexity
	function useColors() {
		// NB: In an Electron preload script, document will be defined but not fully
		// initialized. Since we know we're in Chrome, we'll just detect this case
		// explicitly
		if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
			return true;
		}

		// Internet Explorer and Edge do not support colors.
		if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
			return false;
		}

		// Is webkit? http://stackoverflow.com/a/16459606/376773
		// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
		return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
			// Is firebug? http://stackoverflow.com/a/398120/376773
			(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
			// Is firefox >= v31?
			// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
			// Double check webkit in userAgent just in case we are in a worker
			(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
		args[0] = (this.useColors ? '%c' : '') +
			this.namespace +
			(this.useColors ? ' %c' : ' ') +
			args[0] +
			(this.useColors ? '%c ' : ' ') +
			'+' + module.exports.humanize(this.diff);

		if (!this.useColors) {
			return;
		}

		const c = 'color: ' + this.color;
		args.splice(1, 0, c, 'color: inherit');

		// The final "%c" is somewhat tricky, because there could be other
		// arguments passed either before or after the %c, so we need to
		// figure out the correct index to insert the CSS into
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, match => {
			if (match === '%%') {
				return;
			}
			index++;
			if (match === '%c') {
				// We only are interested in the *last* %c
				// (the user may have provided their own)
				lastC = index;
			}
		});

		args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.debug()` when available.
	 * No-op when `console.debug` is not a "function".
	 * If `console.debug` is not available, falls back
	 * to `console.log`.
	 *
	 * @api public
	 */
	exports.log = console.debug || console.log || (() => {});

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	function save(namespaces) {
		try {
			if (namespaces) {
				exports.storage.setItem('debug', namespaces);
			} else {
				exports.storage.removeItem('debug');
			}
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	function load() {
		let r;
		try {
			r = exports.storage.getItem('debug');
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}

		// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
		if (!r && typeof process !== 'undefined' && 'env' in process) {
			r = process.env.DEBUG;
		}

		return r;
	}

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
		try {
			// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
			// The Browser also has localStorage in the global context.
			return localStorage;
		} catch (error) {
			// Swallow
			// XXX (@Qix-) should we be logging these?
		}
	}

	module.exports = common(exports);

	const {formatters} = module.exports;

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	formatters.j = function (v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return '[UnexpectedJSONParseError]: ' + error.message;
		}
	}; 
} (browser, browser.exports));

var browserExports = browser.exports;
var debug6 = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`positive integer expected, not ${n}`);
}
// copied from utils
function isBytes$1(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
function bytes(b, ...lengths) {
    if (!isBytes$1(b))
        throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash(h) {
    if (typeof h !== 'function' || typeof h.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number(h.outputLen);
    number(h.blockLen);
}
function exists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}

const crypto$1 = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes$1 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex$1(bytes$1) {
    bytes(bytes$1);
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes$1.length; i++) {
        hex += hexes$1[bytes$1[i]];
    }
    return hex;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes$1(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes$1(data);
    bytes(data);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$1(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        bytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes(bytesLength = 32) {
    if (crypto$1 && typeof crypto$1.getRandomValues === 'function') {
        return crypto$1.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}

// Polyfill for Safari 14
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Choice: a ? b : c
const Chi = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
/**
 * Merkle-Damgard hash construction base class.
 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
 */
class HashMD extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
    }
    update(data) {
        exists(this);
        const { view, buffer, blockLen } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        exists(this);
        output(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in
        // current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}

// SHA2-256 need to try 2^128 hashes to execute birthday attack.
// BTC network is doing 2^67 hashes/sec as per early 2023.
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K = /* @__PURE__ */ new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state:
// first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19
// prettier-ignore
const SHA256_IV = /* @__PURE__ */ new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends HashMD {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = (sigma0 + Maj(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// 100 lines of code in the file are duplicated from noble-hashes (utils).
// This is OK: `abstract` directory does not use noble-hashes.
// User may opt-in into using different hashing library. This way, noble-hashes
// won't be included into their bundle.
const _0n$4 = BigInt(0);
const _1n$4 = BigInt(1);
const _2n$2 = BigInt(2);
function isBytes(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
function abytes(item) {
    if (!isBytes(item))
        throw new Error('Uint8Array expected');
}
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
    abytes(bytes);
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
    }
    return hex;
}
function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    // Big Endian
    return BigInt(hex === '' ? '0' : `0x${hex}`);
}
// We use optimized technique to convert hex string to byte array
const asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
function asciiToBase16(char) {
    if (char >= asciis._0 && char <= asciis._9)
        return char - asciis._0;
    if (char >= asciis._A && char <= asciis._F)
        return char - (asciis._A - 10);
    if (char >= asciis._a && char <= asciis._f)
        return char - (asciis._a - 10);
    return;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === undefined || n2 === undefined) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
    }
    return array;
}
// BE: Big Endian, LE: Little Endian
function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
    abytes(bytes);
    return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
}
// Unpadded, rarely used
function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(n));
}
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === 'string') {
        try {
            res = hexToBytes(hex);
        }
        catch (e) {
            throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
        }
    }
    else if (isBytes(hex)) {
        // Uint8Array.from() instead of hash.slice() because node.js Buffer
        // is instance of Uint8Array, and its slice() creates **mutable** copy
        res = Uint8Array.from(hex);
    }
    else {
        throw new Error(`${title} must be hex string or Uint8Array`);
    }
    const len = res.length;
    if (typeof expectedLength === 'number' && len !== expectedLength)
        throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
    return res;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
// Compares 2 u8a-s in kinda constant time
function equalBytes(a, b) {
    if (a.length !== b.length)
        return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
    return diff === 0;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
// Bit operations
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 */
function bitLen(n) {
    let len;
    for (len = 0; n > _0n$4; n >>= _1n$4, len += 1)
        ;
    return len;
}
/**
 * Gets single bit at position.
 * NOTE: first bit position is 0 (same as arrays)
 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
 */
function bitGet(n, pos) {
    return (n >> BigInt(pos)) & _1n$4;
}
/**
 * Sets single bit at position.
 */
function bitSet(n, pos, value) {
    return n | ((value ? _1n$4 : _0n$4) << BigInt(pos));
}
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask = (n) => (_2n$2 << BigInt(n - 1)) - _1n$4;
// DRBG
const u8n = (data) => new Uint8Array(data); // creates Uint8Array
const u8fr = (arr) => Uint8Array.from(arr); // another shortcut
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== 'number' || hashLen < 2)
        throw new Error('hashLen must be a number');
    if (typeof qByteLen !== 'number' || qByteLen < 2)
        throw new Error('qByteLen must be a number');
    if (typeof hmacFn !== 'function')
        throw new Error('hmacFn must be a function');
    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
    let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
    let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
    let i = 0; // Iterations counter, will throw when over 1000
    const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
    const reseed = (seed = u8n()) => {
        // HMAC-DRBG reseed() function. Steps D-G
        k = h(u8fr([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
        v = h(); // v = hmac(k || v)
        if (seed.length === 0)
            return;
        k = h(u8fr([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
        v = h(); // v = hmac(k || v)
    };
    const gen = () => {
        // HMAC-DRBG generate() function
        if (i++ >= 1000)
            throw new Error('drbg: tried 1000 values');
        let len = 0;
        const out = [];
        while (len < qByteLen) {
            v = h();
            const sl = v.slice();
            out.push(sl);
            len += v.length;
        }
        return concatBytes(...out);
    };
    const genUntil = (seed, pred) => {
        reset();
        reseed(seed); // Steps D-G
        let res = undefined; // Step H: grind until k is in [1..n-1]
        while (!(res = pred(gen())))
            reseed();
        reset();
        return res;
    };
    return genUntil;
}
// Validating curves and fields
const validatorFns = {
    bigint: (val) => typeof val === 'bigint',
    function: (val) => typeof val === 'function',
    boolean: (val) => typeof val === 'boolean',
    string: (val) => typeof val === 'string',
    stringOrUint8Array: (val) => typeof val === 'string' || isBytes(val),
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === 'function' && Number.isSafeInteger(val.outputLen),
};
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns[type];
        if (typeof checkVal !== 'function')
            throw new Error(`Invalid validator "${type}", expected function`);
        const val = object[fieldName];
        if (isOptional && val === undefined)
            return;
        if (!checkVal(val, object)) {
            throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
        }
    };
    for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
    return object;
}
// validate type tests
// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
// // Should fail type-check
// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });

var ut = /*#__PURE__*/Object.freeze({
    __proto__: null,
    abytes: abytes,
    bitGet: bitGet,
    bitLen: bitLen,
    bitMask: bitMask,
    bitSet: bitSet,
    bytesToHex: bytesToHex,
    bytesToNumberBE: bytesToNumberBE,
    bytesToNumberLE: bytesToNumberLE,
    concatBytes: concatBytes,
    createHmacDrbg: createHmacDrbg,
    ensureBytes: ensureBytes,
    equalBytes: equalBytes,
    hexToBytes: hexToBytes,
    hexToNumber: hexToNumber,
    isBytes: isBytes,
    numberToBytesBE: numberToBytesBE,
    numberToBytesLE: numberToBytesLE,
    numberToHexUnpadded: numberToHexUnpadded,
    numberToVarBytesBE: numberToVarBytesBE,
    utf8ToBytes: utf8ToBytes,
    validateObject: validateObject
});

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Utilities for modular arithmetics and finite fields
// prettier-ignore
const _0n$3 = BigInt(0), _1n$3 = BigInt(1), _2n$1 = BigInt(2), _3n$1 = BigInt(3);
// prettier-ignore
const _4n = BigInt(4), _5n = BigInt(5), _8n = BigInt(8);
// prettier-ignore
BigInt(9); BigInt(16);
// Calculates a modulo b
function mod(a, b) {
    const result = a % b;
    return result >= _0n$3 ? result : b + result;
}
/**
 * Efficiently raise num to power and do modular division.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 * @example
 * pow(2n, 6n, 11n) // 64n % 11n == 9n
 */
// TODO: use field version && remove
function pow(num, power, modulo) {
    if (modulo <= _0n$3 || power < _0n$3)
        throw new Error('Expected power/modulo > 0');
    if (modulo === _1n$3)
        return _0n$3;
    let res = _1n$3;
    while (power > _0n$3) {
        if (power & _1n$3)
            res = (res * num) % modulo;
        num = (num * num) % modulo;
        power >>= _1n$3;
    }
    return res;
}
// Does x ^ (2 ^ power) mod p. pow2(30, 4) == 30 ^ (2 ^ 4)
function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n$3) {
        res *= res;
        res %= modulo;
    }
    return res;
}
// Inverses number over modulo
function invert(number, modulo) {
    if (number === _0n$3 || modulo <= _0n$3) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    // Euclidean GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
    let a = mod(number, modulo);
    let b = modulo;
    // prettier-ignore
    let x = _0n$3, u = _1n$3;
    while (a !== _0n$3) {
        // JIT applies optimization if those two lines follow each other
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        // prettier-ignore
        b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n$3)
        throw new Error('invert: does not exist');
    return mod(x, modulo);
}
/**
 * Tonelli-Shanks square root search algorithm.
 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
 * Will start an infinite loop if field order P is not prime.
 * @param P field order
 * @returns function that takes field Fp (created from P) and number n
 */
function tonelliShanks(P) {
    // Legendre constant: used to calculate Legendre symbol (a | p),
    // which denotes the value of a^((p-1)/2) (mod p).
    // (a | p) ≡ 1    if a is a square (mod p)
    // (a | p) ≡ -1   if a is not a square (mod p)
    // (a | p) ≡ 0    if a ≡ 0 (mod p)
    const legendreC = (P - _1n$3) / _2n$1;
    let Q, S, Z;
    // Step 1: By factoring out powers of 2 from p - 1,
    // find q and s such that p - 1 = q*(2^s) with q odd
    for (Q = P - _1n$3, S = 0; Q % _2n$1 === _0n$3; Q /= _2n$1, S++)
        ;
    // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
    for (Z = _2n$1; Z < P && pow(Z, legendreC, P) !== P - _1n$3; Z++)
        ;
    // Fast-path
    if (S === 1) {
        const p1div4 = (P + _1n$3) / _4n;
        return function tonelliFast(Fp, n) {
            const root = Fp.pow(n, p1div4);
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Slow-path
    const Q1div2 = (Q + _1n$3) / _2n$1;
    return function tonelliSlow(Fp, n) {
        // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
        if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
            throw new Error('Cannot find square root');
        let r = S;
        // TODO: will fail at Fp2/etc
        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
        let x = Fp.pow(n, Q1div2); // first guess at the square root
        let b = Fp.pow(n, Q); // first guess at the fudge factor
        while (!Fp.eql(b, Fp.ONE)) {
            if (Fp.eql(b, Fp.ZERO))
                return Fp.ZERO; // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm (4. If t = 0, return r = 0)
            // Find m such b^(2^m)==1
            let m = 1;
            for (let t2 = Fp.sqr(b); m < r; m++) {
                if (Fp.eql(t2, Fp.ONE))
                    break;
                t2 = Fp.sqr(t2); // t2 *= t2
            }
            // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift, otherwise there will be overflow
            const ge = Fp.pow(g, _1n$3 << BigInt(r - m - 1)); // ge = 2^(r-m-1)
            g = Fp.sqr(ge); // g = ge * ge
            x = Fp.mul(x, ge); // x *= ge
            b = Fp.mul(b, g); // b *= g
            r = m;
        }
        return x;
    };
}
function FpSqrt(P) {
    // NOTE: different algorithms can give different roots, it is up to user to decide which one they want.
    // For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
    // P ≡ 3 (mod 4)
    // √n = n^((P+1)/4)
    if (P % _4n === _3n$1) {
        // Not all roots possible!
        // const ORDER =
        //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
        // const NUM = 72057594037927816n;
        const p1div4 = (P + _1n$3) / _4n;
        return function sqrt3mod4(Fp, n) {
            const root = Fp.pow(n, p1div4);
            // Throw if root**2 != n
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
    if (P % _8n === _5n) {
        const c1 = (P - _5n) / _8n;
        return function sqrt5mod8(Fp, n) {
            const n2 = Fp.mul(n, _2n$1);
            const v = Fp.pow(n2, c1);
            const nv = Fp.mul(n, v);
            const i = Fp.mul(Fp.mul(nv, _2n$1), v);
            const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
            if (!Fp.eql(Fp.sqr(root), n))
                throw new Error('Cannot find square root');
            return root;
        };
    }
    // Other cases: Tonelli-Shanks algorithm
    return tonelliShanks(P);
}
// prettier-ignore
const FIELD_FIELDS = [
    'create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr',
    'eql', 'add', 'sub', 'mul', 'pow', 'div',
    'addN', 'subN', 'mulN', 'sqrN'
];
function validateField(field) {
    const initial = {
        ORDER: 'bigint',
        MASK: 'bigint',
        BYTES: 'isSafeInteger',
        BITS: 'isSafeInteger',
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
        map[val] = 'function';
        return map;
    }, initial);
    return validateObject(field, opts);
}
// Generic field functions
/**
 * Same as `pow` but for Fp: non-constant-time.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 */
function FpPow(f, num, power) {
    // Should have same speed as pow for bigints
    // TODO: benchmark!
    if (power < _0n$3)
        throw new Error('Expected power > 0');
    if (power === _0n$3)
        return f.ONE;
    if (power === _1n$3)
        return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n$3) {
        if (power & _1n$3)
            p = f.mul(p, d);
        d = f.sqr(d);
        power >>= _1n$3;
    }
    return p;
}
/**
 * Efficiently invert an array of Field elements.
 * `inv(0)` will return `undefined` here: make sure to throw an error.
 */
function FpInvertBatch(f, nums) {
    const tmp = new Array(nums.length);
    // Walk from first to last, multiply them by each other MOD p
    const lastMultiplied = nums.reduce((acc, num, i) => {
        if (f.is0(num))
            return acc;
        tmp[i] = acc;
        return f.mul(acc, num);
    }, f.ONE);
    // Invert last element
    const inverted = f.inv(lastMultiplied);
    // Walk from last to first, multiply them by inverted each other MOD p
    nums.reduceRight((acc, num, i) => {
        if (f.is0(num))
            return acc;
        tmp[i] = f.mul(acc, tmp[i]);
        return f.mul(acc, num);
    }, inverted);
    return tmp;
}
// CURVE.n lengths
function nLength(n, nBitLength) {
    // Bit size, byte size of CURVE.n
    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
}
/**
 * Initializes a finite field over prime. **Non-primes are not supported.**
 * Do not init in loop: slow. Very fragile: always run a benchmark on a change.
 * Major performance optimizations:
 * * a) denormalized operations like mulN instead of mul
 * * b) same object shape: never add or remove keys
 * * c) Object.freeze
 * @param ORDER prime positive bigint
 * @param bitLen how many bits the field consumes
 * @param isLE (def: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field(ORDER, bitLen, isLE = false, redef = {}) {
    if (ORDER <= _0n$3)
        throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
    if (BYTES > 2048)
        throw new Error('Field lengths over 2048 bytes are not supported');
    const sqrtP = FpSqrt(ORDER);
    const f = Object.freeze({
        ORDER,
        BITS,
        BYTES,
        MASK: bitMask(BITS),
        ZERO: _0n$3,
        ONE: _1n$3,
        create: (num) => mod(num, ORDER),
        isValid: (num) => {
            if (typeof num !== 'bigint')
                throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
            return _0n$3 <= num && num < ORDER; // 0 is valid element, but it's not invertible
        },
        is0: (num) => num === _0n$3,
        isOdd: (num) => (num & _1n$3) === _1n$3,
        neg: (num) => mod(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod(num * num, ORDER),
        add: (lhs, rhs) => mod(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
        pow: (num, power) => FpPow(f, num, power),
        div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert(num, ORDER),
        sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
        invertBatch: (lst) => FpInvertBatch(f, lst),
        // TODO: do we really need constant cmov?
        // We don't have const-time bigints anyway, so probably will be not very useful
        cmov: (a, b, c) => (c ? b : a),
        toBytes: (num) => (isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES)),
        fromBytes: (bytes) => {
            if (bytes.length !== BYTES)
                throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
            return isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
        },
    });
    return Object.freeze(f);
}
/**
 * Returns total number of bytes consumed by the field element.
 * For example, 32 bytes for usual 256-bit weierstrass curve.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of field
 */
function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== 'bigint')
        throw new Error('field order must be bigint');
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
}
/**
 * Returns minimal amount of bytes that can be safely reduced
 * by field order.
 * Should be 2^-128 for 128-bit curve such as P256.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of target hash
 */
function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
}
/**
 * "Constant-time" private key generation utility.
 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 48 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function mapHashToField(key, fieldOrder, isLE = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
    if (len < 16 || len < minLen || len > 1024)
        throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
    const num = isLE ? bytesToNumberBE(key) : bytesToNumberLE(key);
    // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
    const reduced = mod(num, fieldOrder - _1n$3) + _1n$3;
    return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Abelian group utilities
const _0n$2 = BigInt(0);
const _1n$2 = BigInt(1);
// Elliptic curve multiplication of Point by scalar. Fragile.
// Scalars should always be less than curve order: this should be checked inside of a curve itself.
// Creates precomputation tables for fast multiplication:
// - private scalar is split by fixed size windows of W bits
// - every window point is collected from window's table & added to accumulator
// - since windows are different, same point inside tables won't be accessed more than once per calc
// - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
// - +1 window is neccessary for wNAF
// - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
// TODO: Research returning 2d JS array of windows, instead of a single window. This would allow
// windows to be in different memory locations
function wNAF(c, bits) {
    const constTimeNegate = (condition, item) => {
        const neg = item.negate();
        return condition ? neg : item;
    };
    const opts = (W) => {
        const windows = Math.ceil(bits / W) + 1; // +1, because
        const windowSize = 2 ** (W - 1); // -1 because we skip zero
        return { windows, windowSize };
    };
    return {
        constTimeNegate,
        // non-const time multiplication ladder
        unsafeLadder(elm, n) {
            let p = c.ZERO;
            let d = elm;
            while (n > _0n$2) {
                if (n & _1n$2)
                    p = p.add(d);
                d = d.double();
                n >>= _1n$2;
            }
            return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(elm, W) {
            const { windows, windowSize } = opts(W);
            const points = [];
            let p = elm;
            let base = p;
            for (let window = 0; window < windows; window++) {
                base = p;
                points.push(base);
                // =1, because we skip zero
                for (let i = 1; i < windowSize; i++) {
                    base = base.add(p);
                    points.push(base);
                }
                p = base.double();
            }
            return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
            // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
            // But need to carefully remove other checks before wNAF. ORDER == bits here
            const { windows, windowSize } = opts(W);
            let p = c.ZERO;
            let f = c.BASE;
            const mask = BigInt(2 ** W - 1); // Create mask with W ones: 0b1111 for W=4 etc.
            const maxNumber = 2 ** W;
            const shiftBy = BigInt(W);
            for (let window = 0; window < windows; window++) {
                const offset = window * windowSize;
                // Extract W bits.
                let wbits = Number(n & mask);
                // Shift number by W bits.
                n >>= shiftBy;
                // If the bits are bigger than max size, we'll split those.
                // +224 => 256 - 32
                if (wbits > windowSize) {
                    wbits -= maxNumber;
                    n += _1n$2;
                }
                // This code was first written with assumption that 'f' and 'p' will never be infinity point:
                // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
                // there is negate now: it is possible that negated element from low value
                // would be the same as high element, which will create carry into next window.
                // It's not obvious how this can fail, but still worth investigating later.
                // Check if we're onto Zero point.
                // Add random point inside current window to f.
                const offset1 = offset;
                const offset2 = offset + Math.abs(wbits) - 1; // -1 because we skip zero
                const cond1 = window % 2 !== 0;
                const cond2 = wbits < 0;
                if (wbits === 0) {
                    // The most important part for const-time getPublicKey
                    f = f.add(constTimeNegate(cond1, precomputes[offset1]));
                }
                else {
                    p = p.add(constTimeNegate(cond2, precomputes[offset2]));
                }
            }
            // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
            // Even if the variable is still unused, there are some checks which will
            // throw an exception, so compiler needs to prove they won't happen, which is hard.
            // At this point there is a way to F be infinity-point even if p is not,
            // which makes it less const-time: around 1 bigint multiply.
            return { p, f };
        },
        wNAFCached(P, precomputesMap, n, transform) {
            // @ts-ignore
            const W = P._WINDOW_SIZE || 1;
            // Calculate precomputes on a first run, reuse them after
            let comp = precomputesMap.get(P);
            if (!comp) {
                comp = this.precomputeWindow(P, W);
                if (W !== 1) {
                    precomputesMap.set(P, transform(comp));
                }
            }
            return this.wNAF(W, comp, n);
        },
    };
}
function validateBasic(curve) {
    validateField(curve.Fp);
    validateObject(curve, {
        n: 'bigint',
        h: 'bigint',
        Gx: 'field',
        Gy: 'field',
    }, {
        nBitLength: 'isSafeInteger',
        nByteLength: 'isSafeInteger',
    });
    // Set defaults
    return Object.freeze({
        ...nLength(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER },
    });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Short Weierstrass curve. The formula is: y² = x³ + ax + b
function validatePointOpts(curve) {
    const opts = validateBasic(curve);
    validateObject(opts, {
        a: 'field',
        b: 'field',
    }, {
        allowedPrivateKeyLengths: 'array',
        wrapPrivateKey: 'boolean',
        isTorsionFree: 'function',
        clearCofactor: 'function',
        allowInfinityPoint: 'boolean',
        fromBytes: 'function',
        toBytes: 'function',
    });
    const { endo, Fp, a } = opts;
    if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
            throw new Error('Endomorphism can only be defined for Koblitz curves that have a=0');
        }
        if (typeof endo !== 'object' ||
            typeof endo.beta !== 'bigint' ||
            typeof endo.splitScalar !== 'function') {
            throw new Error('Expected endomorphism with beta: bigint and splitScalar: function');
        }
    }
    return Object.freeze({ ...opts });
}
// ASN.1 DER encoding utilities
const { bytesToNumberBE: b2n, hexToBytes: h2b } = ut;
const DER = {
    // asn.1 DER encoding utils
    Err: class DERErr extends Error {
        constructor(m = '') {
            super(m);
        }
    },
    _parseInt(data) {
        const { Err: E } = DER;
        if (data.length < 2 || data[0] !== 0x02)
            throw new E('Invalid signature integer tag');
        const len = data[1];
        const res = data.subarray(2, len + 2);
        if (!len || res.length !== len)
            throw new E('Invalid signature integer: wrong length');
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        if (res[0] & 0b10000000)
            throw new E('Invalid signature integer: negative');
        if (res[0] === 0x00 && !(res[1] & 0b10000000))
            throw new E('Invalid signature integer: unnecessary leading zero');
        return { d: b2n(res), l: data.subarray(len + 2) }; // d is data, l is left
    },
    toSig(hex) {
        // parse DER signature
        const { Err: E } = DER;
        const data = typeof hex === 'string' ? h2b(hex) : hex;
        abytes(data);
        let l = data.length;
        if (l < 2 || data[0] != 0x30)
            throw new E('Invalid signature tag');
        if (data[1] !== l - 2)
            throw new E('Invalid signature: incorrect length');
        const { d: r, l: sBytes } = DER._parseInt(data.subarray(2));
        const { d: s, l: rBytesLeft } = DER._parseInt(sBytes);
        if (rBytesLeft.length)
            throw new E('Invalid signature: left bytes after parsing');
        return { r, s };
    },
    hexFromSig(sig) {
        // Add leading zero if first byte has negative bit enabled. More details in '_parseInt'
        const slice = (s) => (Number.parseInt(s[0], 16) & 0b1000 ? '00' + s : s);
        const h = (num) => {
            const hex = num.toString(16);
            return hex.length & 1 ? `0${hex}` : hex;
        };
        const s = slice(h(sig.s));
        const r = slice(h(sig.r));
        const shl = s.length / 2;
        const rhl = r.length / 2;
        const sl = h(shl);
        const rl = h(rhl);
        return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
    },
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n$1 = BigInt(0), _1n$1 = BigInt(1); BigInt(2); const _3n = BigInt(3); BigInt(4);
function weierstrassPoints(opts) {
    const CURVE = validatePointOpts(opts);
    const { Fp } = CURVE; // All curves has same field / group length as for now, but they can differ
    const toBytes = CURVE.toBytes ||
        ((_c, point, _isCompressed) => {
            const a = point.toAffine();
            return concatBytes(Uint8Array.from([0x04]), Fp.toBytes(a.x), Fp.toBytes(a.y));
        });
    const fromBytes = CURVE.fromBytes ||
        ((bytes) => {
            // const head = bytes[0];
            const tail = bytes.subarray(1);
            // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
        });
    /**
     * y² = x³ + ax + b: Short weierstrass curve formula
     * @returns y²
     */
    function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x); // x * x
        const x3 = Fp.mul(x2, x); // x2 * x
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
    }
    // Validate whether the passed curve params are valid.
    // We check if curve equation works for generator point.
    // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
    // ProjectivePoint class has not been initialized yet.
    if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error('bad generator point: equation left != right');
    // Valid group elements reside in range 1..n-1
    function isWithinCurveOrder(num) {
        return typeof num === 'bigint' && _0n$1 < num && num < CURVE.n;
    }
    function assertGE(num) {
        if (!isWithinCurveOrder(num))
            throw new Error('Expected valid bigint: 0 < bigint < curve.n');
    }
    // Validates if priv key is valid and converts it to bigint.
    // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
    function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
        if (lengths && typeof key !== 'bigint') {
            if (isBytes(key))
                key = bytesToHex(key);
            // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
            if (typeof key !== 'string' || !lengths.includes(key.length))
                throw new Error('Invalid key');
            key = key.padStart(nByteLength * 2, '0');
        }
        let num;
        try {
            num =
                typeof key === 'bigint'
                    ? key
                    : bytesToNumberBE(ensureBytes('private key', key, nByteLength));
        }
        catch (error) {
            throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
        }
        if (wrapPrivateKey)
            num = mod(num, n); // disabled by default, enabled for BLS
        assertGE(num); // num in range [1..N-1]
        return num;
    }
    const pointPrecomputes = new Map();
    function assertPrjPoint(other) {
        if (!(other instanceof Point))
            throw new Error('ProjectivePoint expected');
    }
    /**
     * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
     * Default Point works in 2d / affine coordinates: (x, y)
     * We're doing calculations in projective, because its operations don't require costly inversion.
     */
    class Point {
        constructor(px, py, pz) {
            this.px = px;
            this.py = py;
            this.pz = pz;
            if (px == null || !Fp.isValid(px))
                throw new Error('x required');
            if (py == null || !Fp.isValid(py))
                throw new Error('y required');
            if (pz == null || !Fp.isValid(pz))
                throw new Error('z required');
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
            const { x, y } = p || {};
            if (!p || !Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('invalid affine point');
            if (p instanceof Point)
                throw new Error('projective point not allowed');
            const is0 = (i) => Fp.eql(i, Fp.ZERO);
            // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
            if (is0(x) && is0(y))
                return Point.ZERO;
            return new Point(x, y, Fp.ONE);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
            const toInv = Fp.invertBatch(points.map((p) => p.pz));
            return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex) {
            const P = Point.fromAffine(fromBytes(ensureBytes('pointHex', hex)));
            P.assertValidity();
            return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
            return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
            this._WINDOW_SIZE = windowSize;
            pointPrecomputes.delete(this);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
            if (this.is0()) {
                // (0, 1, 0) aka ZERO is invalid in most contexts.
                // In BLS, ZERO can be serialized, so we allow it.
                // (0, 0, 0) is wrong representation of ZERO and is always invalid.
                if (CURVE.allowInfinityPoint && !Fp.is0(this.py))
                    return;
                throw new Error('bad point: ZERO');
            }
            // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
            const { x, y } = this.toAffine();
            // Check if x, y are valid field elements
            if (!Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('bad point: x or y not FE');
            const left = Fp.sqr(y); // y²
            const right = weierstrassEquation(x); // x³ + ax + b
            if (!Fp.eql(left, right))
                throw new Error('bad point: equation left != right');
            if (!this.isTorsionFree())
                throw new Error('bad point: not in prime-order subgroup');
        }
        hasEvenY() {
            const { y } = this.toAffine();
            if (Fp.isOdd)
                return !Fp.isOdd(y);
            throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
            assertPrjPoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
            return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
            return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
            const { a, b } = CURVE;
            const b3 = Fp.mul(b, _3n);
            const { px: X1, py: Y1, pz: Z1 } = this;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            let t0 = Fp.mul(X1, X1); // step 1
            let t1 = Fp.mul(Y1, Y1);
            let t2 = Fp.mul(Z1, Z1);
            let t3 = Fp.mul(X1, Y1);
            t3 = Fp.add(t3, t3); // step 5
            Z3 = Fp.mul(X1, Z1);
            Z3 = Fp.add(Z3, Z3);
            X3 = Fp.mul(a, Z3);
            Y3 = Fp.mul(b3, t2);
            Y3 = Fp.add(X3, Y3); // step 10
            X3 = Fp.sub(t1, Y3);
            Y3 = Fp.add(t1, Y3);
            Y3 = Fp.mul(X3, Y3);
            X3 = Fp.mul(t3, X3);
            Z3 = Fp.mul(b3, Z3); // step 15
            t2 = Fp.mul(a, t2);
            t3 = Fp.sub(t0, t2);
            t3 = Fp.mul(a, t3);
            t3 = Fp.add(t3, Z3);
            Z3 = Fp.add(t0, t0); // step 20
            t0 = Fp.add(Z3, t0);
            t0 = Fp.add(t0, t2);
            t0 = Fp.mul(t0, t3);
            Y3 = Fp.add(Y3, t0);
            t2 = Fp.mul(Y1, Z1); // step 25
            t2 = Fp.add(t2, t2);
            t0 = Fp.mul(t2, t3);
            X3 = Fp.sub(X3, t0);
            Z3 = Fp.mul(t2, t1);
            Z3 = Fp.add(Z3, Z3); // step 30
            Z3 = Fp.add(Z3, Z3);
            return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
            assertPrjPoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            const a = CURVE.a;
            const b3 = Fp.mul(CURVE.b, _3n);
            let t0 = Fp.mul(X1, X2); // step 1
            let t1 = Fp.mul(Y1, Y2);
            let t2 = Fp.mul(Z1, Z2);
            let t3 = Fp.add(X1, Y1);
            let t4 = Fp.add(X2, Y2); // step 5
            t3 = Fp.mul(t3, t4);
            t4 = Fp.add(t0, t1);
            t3 = Fp.sub(t3, t4);
            t4 = Fp.add(X1, Z1);
            let t5 = Fp.add(X2, Z2); // step 10
            t4 = Fp.mul(t4, t5);
            t5 = Fp.add(t0, t2);
            t4 = Fp.sub(t4, t5);
            t5 = Fp.add(Y1, Z1);
            X3 = Fp.add(Y2, Z2); // step 15
            t5 = Fp.mul(t5, X3);
            X3 = Fp.add(t1, t2);
            t5 = Fp.sub(t5, X3);
            Z3 = Fp.mul(a, t4);
            X3 = Fp.mul(b3, t2); // step 20
            Z3 = Fp.add(X3, Z3);
            X3 = Fp.sub(t1, Z3);
            Z3 = Fp.add(t1, Z3);
            Y3 = Fp.mul(X3, Z3);
            t1 = Fp.add(t0, t0); // step 25
            t1 = Fp.add(t1, t0);
            t2 = Fp.mul(a, t2);
            t4 = Fp.mul(b3, t4);
            t1 = Fp.add(t1, t2);
            t2 = Fp.sub(t0, t2); // step 30
            t2 = Fp.mul(a, t2);
            t4 = Fp.add(t4, t2);
            t0 = Fp.mul(t1, t4);
            Y3 = Fp.add(Y3, t0);
            t0 = Fp.mul(t5, t4); // step 35
            X3 = Fp.mul(t3, X3);
            X3 = Fp.sub(X3, t0);
            t0 = Fp.mul(t3, t1);
            Z3 = Fp.mul(t5, Z3);
            Z3 = Fp.add(Z3, t0); // step 40
            return new Point(X3, Y3, Z3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        wNAF(n) {
            return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
                const toInv = Fp.invertBatch(comp.map((p) => p.pz));
                return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
            });
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(n) {
            const I = Point.ZERO;
            if (n === _0n$1)
                return I;
            assertGE(n); // Will throw on 0
            if (n === _1n$1)
                return this;
            const { endo } = CURVE;
            if (!endo)
                return wnaf.unsafeLadder(this, n);
            // Apply endomorphism
            let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
            let k1p = I;
            let k2p = I;
            let d = this;
            while (k1 > _0n$1 || k2 > _0n$1) {
                if (k1 & _1n$1)
                    k1p = k1p.add(d);
                if (k2 & _1n$1)
                    k2p = k2p.add(d);
                d = d.double();
                k1 >>= _1n$1;
                k2 >>= _1n$1;
            }
            if (k1neg)
                k1p = k1p.negate();
            if (k2neg)
                k2p = k2p.negate();
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
            assertGE(scalar);
            let n = scalar;
            let point, fake; // Fake point is used to const-time mult
            const { endo } = CURVE;
            if (endo) {
                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
                let { p: k1p, f: f1p } = this.wNAF(k1);
                let { p: k2p, f: f2p } = this.wNAF(k2);
                k1p = wnaf.constTimeNegate(k1neg, k1p);
                k2p = wnaf.constTimeNegate(k2neg, k2p);
                k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
                point = k1p.add(k2p);
                fake = f1p.add(f2p);
            }
            else {
                const { p, f } = this.wNAF(n);
                point = p;
                fake = f;
            }
            // Normalize `z` for both points, but return only real one
            return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
            const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
            const mul = (P, a // Select faster multiply() method
            ) => (a === _0n$1 || a === _1n$1 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a));
            const sum = mul(this, a).add(mul(Q, b));
            return sum.is0() ? undefined : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
            const { px: x, py: y, pz: z } = this;
            const is0 = this.is0();
            // If invZ was 0, we return zero point. However we still want to execute
            // all operations, so we replace invZ with a random number, 1.
            if (iz == null)
                iz = is0 ? Fp.ONE : Fp.inv(z);
            const ax = Fp.mul(x, iz);
            const ay = Fp.mul(y, iz);
            const zz = Fp.mul(z, iz);
            if (is0)
                return { x: Fp.ZERO, y: Fp.ZERO };
            if (!Fp.eql(zz, Fp.ONE))
                throw new Error('invZ was invalid');
            return { x: ax, y: ay };
        }
        isTorsionFree() {
            const { h: cofactor, isTorsionFree } = CURVE;
            if (cofactor === _1n$1)
                return true; // No subgroups, always torsion-free
            if (isTorsionFree)
                return isTorsionFree(Point, this);
            throw new Error('isTorsionFree() has not been declared for the elliptic curve');
        }
        clearCofactor() {
            const { h: cofactor, clearCofactor } = CURVE;
            if (cofactor === _1n$1)
                return this; // Fast-path
            if (clearCofactor)
                return clearCofactor(Point, this);
            return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
            this.assertValidity();
            return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
            return bytesToHex(this.toRawBytes(isCompressed));
        }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const _bits = CURVE.nBitLength;
    const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
    // Validate if generator point is on curve
    return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder,
    };
}
function validateOpts(curve) {
    const opts = validateBasic(curve);
    validateObject(opts, {
        hash: 'hash',
        hmac: 'function',
        randomBytes: 'function',
    }, {
        bits2int: 'function',
        bits2int_modN: 'function',
        lowS: 'boolean',
    });
    return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { Fp, n: CURVE_ORDER } = CURVE;
    const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
    const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
    function isValidFieldElement(num) {
        return _0n$1 < num && num < Fp.ORDER; // 0 is banned since it's not invertible FE
    }
    function modN(a) {
        return mod(a, CURVE_ORDER);
    }
    function invN(a) {
        return invert(a, CURVE_ORDER);
    }
    const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder, } = weierstrassPoints({
        ...CURVE,
        toBytes(_c, point, isCompressed) {
            const a = point.toAffine();
            const x = Fp.toBytes(a.x);
            const cat = concatBytes;
            if (isCompressed) {
                return cat(Uint8Array.from([point.hasEvenY() ? 0x02 : 0x03]), x);
            }
            else {
                return cat(Uint8Array.from([0x04]), x, Fp.toBytes(a.y));
            }
        },
        fromBytes(bytes) {
            const len = bytes.length;
            const head = bytes[0];
            const tail = bytes.subarray(1);
            // this.assertValidity() is done inside of fromHex
            if (len === compressedLen && (head === 0x02 || head === 0x03)) {
                const x = bytesToNumberBE(tail);
                if (!isValidFieldElement(x))
                    throw new Error('Point is not on curve');
                const y2 = weierstrassEquation(x); // y² = x³ + ax + b
                let y;
                try {
                    y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
                }
                catch (sqrtError) {
                    const suffix = sqrtError instanceof Error ? ': ' + sqrtError.message : '';
                    throw new Error('Point is not on curve' + suffix);
                }
                const isYOdd = (y & _1n$1) === _1n$1;
                // ECDSA
                const isHeadOdd = (head & 1) === 1;
                if (isHeadOdd !== isYOdd)
                    y = Fp.neg(y);
                return { x, y };
            }
            else if (len === uncompressedLen && head === 0x04) {
                const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
                const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
                return { x, y };
            }
            else {
                throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
            }
        },
    });
    const numToNByteStr = (num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
    function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n$1;
        return number > HALF;
    }
    function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    // slice bytes num
    const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
    /**
     * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
     */
    class Signature {
        constructor(r, s, recovery) {
            this.r = r;
            this.s = s;
            this.recovery = recovery;
            this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
            const l = CURVE.nByteLength;
            hex = ensureBytes('compactSignature', hex, l * 2);
            return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
            const { r, s } = DER.toSig(ensureBytes('DER', hex));
            return new Signature(r, s);
        }
        assertValidity() {
            // can use assertGE here
            if (!isWithinCurveOrder(this.r))
                throw new Error('r must be 0 < r < CURVE.n');
            if (!isWithinCurveOrder(this.s))
                throw new Error('s must be 0 < s < CURVE.n');
        }
        addRecoveryBit(recovery) {
            return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
            const { r, s, recovery: rec } = this;
            const h = bits2int_modN(ensureBytes('msgHash', msgHash)); // Truncate hash
            if (rec == null || ![0, 1, 2, 3].includes(rec))
                throw new Error('recovery id invalid');
            const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
            if (radj >= Fp.ORDER)
                throw new Error('recovery id 2 or 3 invalid');
            const prefix = (rec & 1) === 0 ? '02' : '03';
            const R = Point.fromHex(prefix + numToNByteStr(radj));
            const ir = invN(radj); // r^-1
            const u1 = modN(-h * ir); // -hr^-1
            const u2 = modN(s * ir); // sr^-1
            const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
            if (!Q)
                throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
            Q.assertValidity();
            return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
            return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
            return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
            return hexToBytes(this.toDERHex());
        }
        toDERHex() {
            return DER.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
            return hexToBytes(this.toCompactHex());
        }
        toCompactHex() {
            return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
    }
    const utils = {
        isValidPrivateKey(privateKey) {
            try {
                normPrivateKeyToScalar(privateKey);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        normPrivateKeyToScalar: normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */
        randomPrivateKey: () => {
            const length = getMinHashLength(CURVE.n);
            return mapHashToField(CURVE.randomBytes(length), CURVE.n);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
            point._setWindowSize(windowSize);
            point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
            return point;
        },
    };
    /**
     * Computes public key for a private key. Checks for validity of the private key.
     * @param privateKey private key
     * @param isCompressed whether to return compact (default), or full key
     * @returns Public key, full when isCompressed=false; short when isCompressed=true
     */
    function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    /**
     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
     */
    function isProbPub(item) {
        const arr = isBytes(item);
        const str = typeof item === 'string';
        const len = (arr || str) && item.length;
        if (arr)
            return len === compressedLen || len === uncompressedLen;
        if (str)
            return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
            return true;
        return false;
    }
    /**
     * ECDH (Elliptic Curve Diffie Hellman).
     * Computes shared public key from private key and public key.
     * Checks: 1) private key validity 2) shared key is on-curve.
     * Does NOT hash the result.
     * @param privateA private key
     * @param publicB different public key
     * @param isCompressed whether to return compact (default), or full key
     * @returns shared public key
     */
    function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
            throw new Error('first arg must be private key');
        if (!isProbPub(publicB))
            throw new Error('second arg must be public key');
        const b = Point.fromHex(publicB); // check for being on-curve
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
    const bits2int = CURVE.bits2int ||
        function (bytes) {
            // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
            // for some cases, since bytes.length * 8 is not actual bitLength.
            const num = bytesToNumberBE(bytes); // check for == u8 done here
            const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
            return delta > 0 ? num >> BigInt(delta) : num;
        };
    const bits2int_modN = CURVE.bits2int_modN ||
        function (bytes) {
            return modN(bits2int(bytes)); // can't use bytesToNumberBE here
        };
    // NOTE: pads output with zero as per spec
    const ORDER_MASK = bitMask(CURVE.nBitLength);
    /**
     * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
     */
    function int2octets(num) {
        if (typeof num !== 'bigint')
            throw new Error('bigint expected');
        if (!(_0n$1 <= num && num < ORDER_MASK))
            throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
        // works with order, can have different size than numToField!
        return numberToBytesBE(num, CURVE.nByteLength);
    }
    // Steps A, D of RFC6979 3.2
    // Creates RFC6979 seed; converts msg/privKey to numbers.
    // Used only in sign, not in verify.
    // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order, this will be wrong at least for P521.
    // Also it can be bigger for P224 + SHA256
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (['recovered', 'canonical'].some((k) => k in opts))
            throw new Error('sign() legacy options not supported');
        const { hash, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts; // generates low-s sigs by default
        if (lowS == null)
            lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
        msgHash = ensureBytes('msgHash', msgHash);
        if (prehash)
            msgHash = ensureBytes('prehashed msgHash', hash(msgHash));
        // We can't later call bits2octets, since nested bits2int is broken for curves
        // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
        const seedArgs = [int2octets(d), int2octets(h1int)];
        // extraEntropy. RFC6979 3.6: additional k' (optional).
        if (ent != null && ent !== false) {
            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
            const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
            seedArgs.push(ensureBytes('extraEntropy', e)); // check for being bytes
        }
        const seed = concatBytes(...seedArgs); // Step D of RFC6979 3.2
        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
        // Converts signature params into point w r/s, checks result for validity.
        function k2sig(kBytes) {
            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
            const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
            if (!isWithinCurveOrder(k))
                return; // Important: all mod() calls here must be done over N
            const ik = invN(k); // k^-1 mod n
            const q = Point.BASE.multiply(k).toAffine(); // q = Gk
            const r = modN(q.x); // r = q.x mod n
            if (r === _0n$1)
                return;
            // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
            // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
            // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
            const s = modN(ik * modN(m + r * d)); // Not using blinding here
            if (s === _0n$1)
                return;
            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$1); // recovery bit (2 or 3, when q.x > n)
            let normS = s;
            if (lowS && isBiggerThanHalfOrder(s)) {
                normS = normalizeS(s); // if lowS was passed, ensure s is always
                recovery ^= 1; // // in the bottom half of N
            }
            return new Signature(r, normS, recovery); // use normS, not s
        }
        return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
    /**
     * Signs message hash with a private key.
     * ```
     * sign(m, d, k) where
     *   (x, y) = G × k
     *   r = x mod n
     *   s = (m + dr)/k mod n
     * ```
     * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
     * @param privKey private key
     * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
     * @returns signature with recovery param
     */
    function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
        const C = CURVE;
        const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig); // Steps B, C, D, E, F, G
    }
    // Enable precomputes. Slows down first publicKey computation by 20ms.
    Point.BASE._setWindowSize(8);
    // utils.precompute(8, ProjectivePoint.BASE)
    /**
     * Verifies a signature against message hash and public key.
     * Rejects lowS signatures by default: to override,
     * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
     *
     * ```
     * verify(r, s, h, P) where
     *   U1 = hs^-1 mod n
     *   U2 = rs^-1 mod n
     *   R = U1⋅G - U2⋅P
     *   mod(R.x, n) == r
     * ```
     */
    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        const sg = signature;
        msgHash = ensureBytes('msgHash', msgHash);
        publicKey = ensureBytes('publicKey', publicKey);
        if ('strict' in opts)
            throw new Error('options.strict was renamed to lowS');
        const { lowS, prehash } = opts;
        let _sig = undefined;
        let P;
        try {
            if (typeof sg === 'string' || isBytes(sg)) {
                // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
                // Since DER can also be 2*nByteLength bytes, we check for it first.
                try {
                    _sig = Signature.fromDER(sg);
                }
                catch (derError) {
                    if (!(derError instanceof DER.Err))
                        throw derError;
                    _sig = Signature.fromCompact(sg);
                }
            }
            else if (typeof sg === 'object' && typeof sg.r === 'bigint' && typeof sg.s === 'bigint') {
                const { r, s } = sg;
                _sig = new Signature(r, s);
            }
            else {
                throw new Error('PARSE');
            }
            P = Point.fromHex(publicKey);
        }
        catch (error) {
            if (error.message === 'PARSE')
                throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
            return false;
        }
        if (lowS && _sig.hasHighS())
            return false;
        if (prehash)
            msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
        const is = invN(s); // s^-1
        const u1 = modN(h * is); // u1 = hs^-1 mod n
        const u2 = modN(r * is); // u2 = rs^-1 mod n
        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
        if (!R)
            return false;
        const v = modN(R.x);
        return v === r;
    }
    return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils,
    };
}

// HMAC (RFC 2104)
class HMAC extends Hash {
    constructor(hash$1, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        hash(hash$1);
        const key = toBytes(_key);
        this.iHash = hash$1.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash$1.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash$1.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        exists(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        exists(this);
        bytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// connects noble-curves to noble-hashes
function getHash(hash) {
    return {
        hash,
        hmac: (key, ...msgs) => hmac(hash, key, concatBytes$1(...msgs)),
        randomBytes,
    };
}
function createCurve(curveDef, defHash) {
    const create = (hash) => weierstrass({ ...curveDef, ...getHash(hash) });
    return Object.freeze({ ...create(defHash), create });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1P = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const secp256k1N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const _1n = BigInt(1);
const _2n = BigInt(2);
const divNearest = (a, b) => (a + b / _2n) / b;
/**
 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
 */
function sqrtMod(y) {
    const P = secp256k1P;
    // prettier-ignore
    const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    // prettier-ignore
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = (y * y * y) % P; // x^3, 11
    const b3 = (b2 * b2 * y) % P; // x^7
    const b6 = (pow2(b3, _3n, P) * b3) % P;
    const b9 = (pow2(b6, _3n, P) * b3) % P;
    const b11 = (pow2(b9, _2n, P) * b2) % P;
    const b22 = (pow2(b11, _11n, P) * b11) % P;
    const b44 = (pow2(b22, _22n, P) * b22) % P;
    const b88 = (pow2(b44, _44n, P) * b44) % P;
    const b176 = (pow2(b88, _88n, P) * b88) % P;
    const b220 = (pow2(b176, _44n, P) * b44) % P;
    const b223 = (pow2(b220, _3n, P) * b3) % P;
    const t1 = (pow2(b223, _23n, P) * b22) % P;
    const t2 = (pow2(t1, _6n, P) * b2) % P;
    const root = pow2(t2, _2n, P);
    if (!Fp.eql(Fp.sqr(root), y))
        throw new Error('Cannot find square root');
    return root;
}
const Fp = Field(secp256k1P, undefined, undefined, { sqrt: sqrtMod });
const secp256k1 = createCurve({
    a: BigInt(0), // equation params: a, b
    b: BigInt(7), // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
    Fp, // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
    n: secp256k1N, // Curve order, total count of valid points in the field
    // Base point (x, y) aka generator point
    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
    h: BigInt(1), // Cofactor
    lowS: true, // Allow only low-S signatures by default in sign() and verify()
    /**
     * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
     * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
     * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
     * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
     */
    endo: {
        beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
        splitScalar: (k) => {
            const n = secp256k1N;
            const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
            const b1 = -_1n * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
            const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
            const b2 = a1;
            const POW_2_128 = BigInt('0x100000000000000000000000000000000'); // (2n**128n).toString(16)
            const c1 = divNearest(b2 * k, n);
            const c2 = divNearest(-b1 * k, n);
            let k1 = mod(k - c1 * a1 - c2 * a2, n);
            let k2 = mod(-c1 * b1 - c2 * b2, n);
            const k1neg = k1 > POW_2_128;
            const k2neg = k2 > POW_2_128;
            if (k1neg)
                k1 = n - k1;
            if (k2neg)
                k2 = n - k2;
            if (k1 > POW_2_128 || k2 > POW_2_128) {
                throw new Error('splitScalar: Endomorphism failed, k=' + k);
            }
            return { k1neg, k1, k2neg, k2 };
        },
    },
}, sha256);
// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
const _0n = BigInt(0);
const fe = (x) => typeof x === 'bigint' && _0n < x && x < secp256k1P;
const ge = (x) => typeof x === 'bigint' && _0n < x && x < secp256k1N;
/** An object mapping tags to their tagged hash prefix of [SHA256(tag) | SHA256(tag)] */
const TAGGED_HASH_PREFIXES = {};
function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === undefined) {
        const tagH = sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = concatBytes(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes(tagP, ...messages));
}
// ECDSA compact points are 33-byte. Schnorr is 32: we strip first byte 0x02 or 0x03
const pointToBytes = (point) => point.toRawBytes(true).slice(1);
const numTo32b = (n) => numberToBytesBE(n, 32);
const modP = (x) => mod(x, secp256k1P);
const modN = (x) => mod(x, secp256k1N);
const Point = secp256k1.ProjectivePoint;
const GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
// Calculate point, scalar and bytes
function schnorrGetExtPubKey(priv) {
    let d_ = secp256k1.utils.normPrivateKeyToScalar(priv); // same method executed in fromPrivateKey
    let p = Point.fromPrivateKey(d_); // P = d'⋅G; 0 < d' < n check is done inside
    const scalar = p.hasEvenY() ? d_ : modN(-d_);
    return { scalar: scalar, bytes: pointToBytes(p) };
}
/**
 * lift_x from BIP340. Convert 32-byte x coordinate to elliptic curve point.
 * @returns valid point checked for being on-curve
 */
function lift_x(x) {
    if (!fe(x))
        throw new Error('bad x: need 0 < x < p'); // Fail if x ≥ p.
    const xx = modP(x * x);
    const c = modP(xx * x + BigInt(7)); // Let c = x³ + 7 mod p.
    let y = sqrtMod(c); // Let y = c^(p+1)/4 mod p.
    if (y % _2n !== _0n)
        y = modP(-y); // Return the unique point P such that x(P) = x and
    const p = new Point(x, y, _1n); // y(P) = y if y mod 2 = 0 or y(P) = p-y otherwise.
    p.assertValidity();
    return p;
}
/**
 * Create tagged hash, convert it to bigint, reduce modulo-n.
 */
function challenge(...args) {
    return modN(bytesToNumberBE(taggedHash('BIP0340/challenge', ...args)));
}
/**
 * Schnorr public key is just `x` coordinate of Point as per BIP340.
 */
function schnorrGetPublicKey(privateKey) {
    return schnorrGetExtPubKey(privateKey).bytes; // d'=int(sk). Fail if d'=0 or d'≥n. Ret bytes(d'⋅G)
}
/**
 * Creates Schnorr signature as per BIP340. Verifies itself before returning anything.
 * auxRand is optional and is not the sole source of k generation: bad CSPRNG won't be dangerous.
 */
function schnorrSign(message, privateKey, auxRand = randomBytes(32)) {
    const m = ensureBytes('message', message);
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey); // checks for isWithinCurveOrder
    const a = ensureBytes('auxRand', auxRand, 32); // Auxiliary random data a: a 32-byte array
    const t = numTo32b(d ^ bytesToNumberBE(taggedHash('BIP0340/aux', a))); // Let t be the byte-wise xor of bytes(d) and hash/aux(a)
    const rand = taggedHash('BIP0340/nonce', t, px, m); // Let rand = hash/nonce(t || bytes(P) || m)
    const k_ = modN(bytesToNumberBE(rand)); // Let k' = int(rand) mod n
    if (k_ === _0n)
        throw new Error('sign failed: k is zero'); // Fail if k' = 0.
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_); // Let R = k'⋅G.
    const e = challenge(rx, px, m); // Let e = int(hash/challenge(bytes(R) || bytes(P) || m)) mod n.
    const sig = new Uint8Array(64); // Let sig = bytes(R) || bytes((k + ed) mod n).
    sig.set(rx, 0);
    sig.set(numTo32b(modN(k + e * d)), 32);
    // If Verify(bytes(P), m, sig) (see below) returns failure, abort
    if (!schnorrVerify(sig, m, px))
        throw new Error('sign: Invalid signature produced');
    return sig;
}
/**
 * Verifies Schnorr signature.
 * Will swallow errors & return false except for initial type validation of arguments.
 */
function schnorrVerify(signature, message, publicKey) {
    const sig = ensureBytes('signature', signature, 64);
    const m = ensureBytes('message', message);
    const pub = ensureBytes('publicKey', publicKey, 32);
    try {
        const P = lift_x(bytesToNumberBE(pub)); // P = lift_x(int(pk)); fail if that fails
        const r = bytesToNumberBE(sig.subarray(0, 32)); // Let r = int(sig[0:32]); fail if r ≥ p.
        if (!fe(r))
            return false;
        const s = bytesToNumberBE(sig.subarray(32, 64)); // Let s = int(sig[32:64]); fail if s ≥ n.
        if (!ge(s))
            return false;
        const e = challenge(numTo32b(r), pointToBytes(P), m); // int(challenge(bytes(r)||bytes(P)||m))%n
        const R = GmulAdd(P, s, modN(-e)); // R = s⋅G - e⋅P
        if (!R || !R.hasEvenY() || R.toAffine().x !== r)
            return false; // -eP == (n-e)P
        return true; // Fail if is_infinite(R) / not has_even_y(R) / x(R) ≠ r.
    }
    catch (error) {
        return false;
    }
}
const schnorr = /* @__PURE__ */ (() => ({
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    utils: {
        randomPrivateKey: secp256k1.utils.randomPrivateKey,
        lift_x,
        pointToBytes,
        numberToBytesBE,
        bytesToNumberBE,
        taggedHash,
        mod,
    },
}))();

var dist = {};

var LRUCache$1 = {};

var LRUCacheNode$1 = {};

Object.defineProperty(LRUCacheNode$1, "__esModule", { value: true });
LRUCacheNode$1.LRUCacheNode = void 0;
class LRUCacheNode {
    constructor(key, value, options) {
        const { entryExpirationTimeInMS = null, next = null, prev = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, clone, cloneFn } = options !== null && options !== void 0 ? options : {};
        if (typeof entryExpirationTimeInMS === 'number' &&
            (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
            throw new Error('entryExpirationTimeInMS must either be null (no expiry) or greater than 0');
        }
        this.clone = clone !== null && clone !== void 0 ? clone : false;
        this.cloneFn = cloneFn !== null && cloneFn !== void 0 ? cloneFn : this.defaultClone;
        this.key = key;
        this.internalValue = this.clone ? this.cloneFn(value) : value;
        this.created = Date.now();
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.next = next;
        this.prev = prev;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
    }
    get value() {
        return this.clone ? this.cloneFn(this.internalValue) : this.internalValue;
    }
    get isExpired() {
        return typeof this.entryExpirationTimeInMS === 'number' && Date.now() - this.created > this.entryExpirationTimeInMS;
    }
    invokeOnEvicted() {
        if (this.onEntryEvicted) {
            const { key, value, isExpired } = this;
            this.onEntryEvicted({ key, value, isExpired });
        }
    }
    invokeOnEntryMarkedAsMostRecentlyUsed() {
        if (this.onEntryMarkedAsMostRecentlyUsed) {
            const { key, value } = this;
            this.onEntryMarkedAsMostRecentlyUsed({ key, value });
        }
    }
    defaultClone(value) {
        if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return JSON.parse(JSON.stringify(value));
    }
}
LRUCacheNode$1.LRUCacheNode = LRUCacheNode;

Object.defineProperty(LRUCache$1, "__esModule", { value: true });
LRUCache$1.LRUCache = void 0;
const LRUCacheNode_1 = LRUCacheNode$1;
/**
 * A key value cache that implements the LRU policy.
 *
 * @typeparam TKey The type of the keys in the cache. Defaults to `string`.
 * @typeparam TValue The type of the values in the cache. Defaults to `any`.
 *
 * @see {@link https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)}
 */
class LRUCache {
    /**
     * Creates a new instance of the LRUCache.
     *
     * @param options Additional configuration options for the LRUCache.
     *
     * @example
     * ```typescript
     * // No options.
     * const cache = new LRUCache();
     *
     * // With options.
     * const cache = new LRUCache({
     *  entryExpirationTimeInMS: 10000
     * });
     * ```
     */
    constructor(options) {
        this.lookupTable = new Map();
        this.head = null;
        this.tail = null;
        const { maxSize = 25, entryExpirationTimeInMS = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed, cloneFn, clone } = options !== null && options !== void 0 ? options : {};
        if (Number.isNaN(maxSize) || maxSize <= 0) {
            throw new Error('maxSize must be greater than 0.');
        }
        if (typeof entryExpirationTimeInMS === 'number' &&
            (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
            throw new Error('entryExpirationTimeInMS must either be null (no expiry) or greater than 0');
        }
        this.maxSizeInternal = maxSize;
        this.entryExpirationTimeInMS = entryExpirationTimeInMS;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
        this.clone = clone;
        this.cloneFn = cloneFn;
    }
    /**
     * Returns the number of entries in the LRUCache object.
     * If the cache has entryExpirationTimeInMS set, expired entries will be removed before the size is returned.
     *
     * @returns The number of entries in the cache.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * cache.set('testKey', 'testValue');
     *
     * const size = cache.size;
     *
     * // Will log 1
     * console.log(size);
     * ```
     */
    get size() {
        this.cleanCache();
        return this.lookupTable.size;
    }
    /**
     * Returns the number of entries that can still be added to the LRUCache without evicting existing entries.
     *
     * @returns The number of entries that can still be added without evicting existing entries.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache({ maxSize: 10 });
     *
     * cache.set('testKey', 'testValue');
     *
     * const remainingSize = cache.remainingSize;
     *
     * // Will log 9 due to 9 spots remaining before reaching maxSize of 10.
     * console.log(remainingSize);
     * ```
     */
    get remainingSize() {
        return this.maxSizeInternal - this.size;
    }
    /**
     * Returns the most recently used (newest) entry in the cache.
     * This will not mark the entry as recently used.
     * If the newest node is expired, it will be removed.
     *
     * @returns The most recently used (newest) entry in the cache.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache({ maxSize: 10 });
     *
     * cache.set('testKey', 'testValue');
     *
     * const newest = cache.newest;
     *
     * // Will log testValue
     * console.log(newest.value);
     *
     * // Will log testKey
     * console.log(newest.key);
     * ```
     */
    get newest() {
        if (!this.head) {
            return null;
        }
        if (this.head.isExpired) {
            this.removeNodeFromListAndLookupTable(this.head);
            return this.newest;
        }
        return this.mapNodeToEntry(this.head);
    }
    /**
     * Returns the least recently used (oldest) entry in the cache.
     * This will not mark the entry as recently used.
     * If the oldest node is expired, it will be removed.
     *
     * @returns The least recently used (oldest) entry in the cache.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache({ maxSize: 10 });
     *
     * cache.set('testKey', 'testValue');
     *
     * const oldest = cache.oldest;
     *
     * // Will log testValue
     * console.log(oldest.value);
     *
     * // Will log testKey
     * console.log(oldest.key);
     * ```
     */
    get oldest() {
        if (!this.tail) {
            return null;
        }
        if (this.tail.isExpired) {
            this.removeNodeFromListAndLookupTable(this.tail);
            return this.oldest;
        }
        return this.mapNodeToEntry(this.tail);
    }
    /**
     * Gets or sets the maxSize of the cache.
     * This will evict the least recently used entries if needed to reach new maxSize.
     *
     * @param value The new value for maxSize. Must be greater than 0.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache({ maxSize: 10 });
     *
     * cache.set('testKey', 'testValue');
     *
     * // Will be 10
     * const maxSize = cache.maxSize;
     *
     * // Set new maxSize to 5. If there are more than 5 items in the cache, the least recently used entries will be removed until cache size is 5.
     * cache.maxSize = 5;
     * ```
     */
    get maxSize() {
        return this.maxSizeInternal;
    }
    set maxSize(value) {
        if (Number.isNaN(value) || value <= 0) {
            throw new Error('maxSize must be greater than 0.');
        }
        this.maxSizeInternal = value;
        this.enforceSizeLimit();
    }
    /**
     * Sets the value for the key in the LRUCache object. Returns the LRUCache object.
     * This marks the newly added entry as the most recently used entry.
     * If adding the new entry makes the cache size go above maxSize,
     * this will evict the least recently used entries until size is equal to maxSize.
     *
     * @param key The key of the entry.
     * @param value The value to set for the key.
     * @param entryOptions Additional configuration options for the cache entry.
     *
     * @returns The LRUCache instance.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // Set the key key2 to value value2. Pass in optional options.
     * cache.set('key2', 'value2', { entryExpirationTimeInMS: 10 });
     * ```
     */
    set(key, value, entryOptions) {
        const currentNodeForKey = this.lookupTable.get(key);
        if (currentNodeForKey) {
            this.removeNodeFromListAndLookupTable(currentNodeForKey);
        }
        const node = new LRUCacheNode_1.LRUCacheNode(key, value, {
            entryExpirationTimeInMS: this.entryExpirationTimeInMS,
            onEntryEvicted: this.onEntryEvicted,
            onEntryMarkedAsMostRecentlyUsed: this.onEntryMarkedAsMostRecentlyUsed,
            clone: this.clone,
            cloneFn: this.cloneFn,
            ...entryOptions
        });
        this.setNodeAsHead(node);
        this.lookupTable.set(key, node);
        this.enforceSizeLimit();
        return this;
    }
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param key The key of the entry to get.
     *
     * @returns The cached value or null.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // Will be 'testValue'. Entry will now be most recently used.
     * const item1 = cache.get('testKey');
     *
     * // Will be null
     * const item2 = cache.get('keyNotInCache');
     * ```
     */
    get(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return null;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return null;
        }
        this.setNodeAsHead(node);
        return node.value;
    }
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this will not mark the entry as most recently accessed.
     * Useful if a value is needed but the order of the cache should not be changed.
     *
     * @param key The key of the entry to get.
     *
     * @returns The cached value or null.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // Will be 'testValue'
     * const item1 = cache.peek('testKey');
     *
     * // Will be null
     * const item2 = cache.peek('keyNotInCache');
     * ```
     */
    peek(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return null;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return null;
        }
        return node.value;
    }
    /**
     * Deletes the entry for the passed in key.
     *
     * @param key The key of the entry to delete
     *
     * @returns True if an element in the LRUCache object existed and has been removed,
     * or false if the element does not exist.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // Will be true
     * const wasDeleted = cache.delete('testKey');
     *
     * // Will be false
     * const wasDeleted2 = cache.delete('keyNotInCache');
     * ```
     */
    delete(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return false;
        }
        return this.removeNodeFromListAndLookupTable(node);
    }
    /**
     * Returns a boolean asserting whether a value has been associated to the key in the LRUCache object or not.
     * This does not mark the entry as recently used.
     * If the cache has a key but the entry is expired, it will be removed and false will be returned.
     *
     * @param key The key of the entry to check if exists
     *
     * @returns true if the cache contains the supplied key. False if not.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // Will be true
     * const wasDeleted = cache.has('testKey');
     *
     * // Will be false
     * const wasDeleted2 = cache.has('keyNotInCache');
     * ```
     */
    has(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return false;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return false;
        }
        return true;
    }
    /**
     * Removes all entries in the cache.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // Clear cache.
     * cache.clear();
     * ```
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.lookupTable.clear();
    }
    /**
     * Searches the cache for an entry matching the passed in condition.
     * Expired entries will be skipped (and removed).
     * If multiply entries in the cache match the condition, the most recently used entry will be returned.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param condition The condition to apply to each entry in the
     *
     * @returns The first cache entry to match the condition. Null if none match.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * // item will be { key: 'testKey', value: 'testValue }
     * const item = cache.find(entry => {
     *   const { key, value } = entry;
     *
     *   if (key === 'testKey' || value === 'something') {
     *     return true;
     *   }
     *
     *   return false;
     * });
     *
     * // item2 will be null
     * const item2 = cache.find(entry => entry.key === 'notInCache');
     * ```
     */
    find(condition) {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            const entry = this.mapNodeToEntry(node);
            if (condition(entry)) {
                this.setNodeAsHead(node);
                return entry;
            }
            node = node.next;
        }
        return null;
    }
    /**
     * Iterates over and applies the callback function to each entry in the cache.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as recently used.
     *
     * @param callback the callback function to apply to the entry
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * cache.forEach((key, value, index) => {
     *   // do something with key, value, and/or index
     * });
     * ```
     */
    forEach(callback) {
        let node = this.head;
        let index = 0;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            callback(node.value, node.key, index);
            node = node.next;
            index++;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache values.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache values.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * for (const value of cache.values()) {
     *   // do something with the value
     * }
     * ```
     */
    *values() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield node.value;
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache keys.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache keys.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * for (const key of cache.keys()) {
     *   // do something with the key
     * }
     * ```
     */
    *keys() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield node.key;
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * for (const entry of cache.entries()) {
     *   const { key, value } = entry;
     *   // do something with the entry
     * }
     * ```
     */
    *entries() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield this.mapNodeToEntry(node);
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     *
     * @example
     * ```typescript
     * const cache = new LRUCache();
     *
     * // Set the key testKey to value testValue
     * cache.set('testKey', 'testValue');
     *
     * for (const entry of cache) {
     *   const { key, value } = entry;
     *   // do something with the entry
     * }
     * ```
     */
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield this.mapNodeToEntry(node);
            node = node.next;
        }
    }
    enforceSizeLimit() {
        let node = this.tail;
        while (node !== null && this.size > this.maxSizeInternal) {
            const prev = node.prev;
            this.removeNodeFromListAndLookupTable(node);
            node = prev;
        }
    }
    mapNodeToEntry({ key, value }) {
        return {
            key,
            value
        };
    }
    setNodeAsHead(node) {
        this.removeNodeFromList(node);
        if (!this.head) {
            this.head = node;
            this.tail = node;
        }
        else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
        node.invokeOnEntryMarkedAsMostRecentlyUsed();
    }
    removeNodeFromList(node) {
        if (node.prev !== null) {
            node.prev.next = node.next;
        }
        if (node.next !== null) {
            node.next.prev = node.prev;
        }
        if (this.head === node) {
            this.head = node.next;
        }
        if (this.tail === node) {
            this.tail = node.prev;
        }
        node.next = null;
        node.prev = null;
    }
    removeNodeFromListAndLookupTable(node) {
        node.invokeOnEvicted();
        this.removeNodeFromList(node);
        return this.lookupTable.delete(node.key);
    }
    cleanCache() {
        // Don't spend time cleaning if entries don't expire.
        if (!this.entryExpirationTimeInMS) {
            return;
        }
        const expiredNodes = [];
        for (const node of this.lookupTable.values()) {
            if (node.isExpired) {
                expiredNodes.push(node);
            }
        }
        expiredNodes.forEach(node => this.removeNodeFromListAndLookupTable(node));
    }
}
LRUCache$1.LRUCache = LRUCache;

(function (exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(LRUCache$1, exports);
	
} (dist));

var lib = {};

(function (exports) {
	/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bytes = exports.stringToBytes = exports.str = exports.bytesToString = exports.hex = exports.utf8 = exports.bech32m = exports.bech32 = exports.base58check = exports.base58xmr = exports.base58xrp = exports.base58flickr = exports.base58 = exports.base64url = exports.base64 = exports.base32crockford = exports.base32hex = exports.base32 = exports.base16 = exports.utils = exports.assertNumber = void 0;
	function assertNumber(n) {
	    if (!Number.isSafeInteger(n))
	        throw new Error(`Wrong integer: ${n}`);
	}
	exports.assertNumber = assertNumber;
	function chain(...args) {
	    const wrap = (a, b) => (c) => a(b(c));
	    const encode = Array.from(args)
	        .reverse()
	        .reduce((acc, i) => (acc ? wrap(acc, i.encode) : i.encode), undefined);
	    const decode = args.reduce((acc, i) => (acc ? wrap(acc, i.decode) : i.decode), undefined);
	    return { encode, decode };
	}
	function alphabet(alphabet) {
	    return {
	        encode: (digits) => {
	            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
	                throw new Error('alphabet.encode input should be an array of numbers');
	            return digits.map((i) => {
	                assertNumber(i);
	                if (i < 0 || i >= alphabet.length)
	                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
	                return alphabet[i];
	            });
	        },
	        decode: (input) => {
	            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
	                throw new Error('alphabet.decode input should be array of strings');
	            return input.map((letter) => {
	                if (typeof letter !== 'string')
	                    throw new Error(`alphabet.decode: not string element=${letter}`);
	                const index = alphabet.indexOf(letter);
	                if (index === -1)
	                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
	                return index;
	            });
	        },
	    };
	}
	function join(separator = '') {
	    if (typeof separator !== 'string')
	        throw new Error('join separator should be string');
	    return {
	        encode: (from) => {
	            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
	                throw new Error('join.encode input should be array of strings');
	            for (let i of from)
	                if (typeof i !== 'string')
	                    throw new Error(`join.encode: non-string input=${i}`);
	            return from.join(separator);
	        },
	        decode: (to) => {
	            if (typeof to !== 'string')
	                throw new Error('join.decode input should be string');
	            return to.split(separator);
	        },
	    };
	}
	function padding(bits, chr = '=') {
	    assertNumber(bits);
	    if (typeof chr !== 'string')
	        throw new Error('padding chr should be string');
	    return {
	        encode(data) {
	            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
	                throw new Error('padding.encode input should be array of strings');
	            for (let i of data)
	                if (typeof i !== 'string')
	                    throw new Error(`padding.encode: non-string input=${i}`);
	            while ((data.length * bits) % 8)
	                data.push(chr);
	            return data;
	        },
	        decode(input) {
	            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
	                throw new Error('padding.encode input should be array of strings');
	            for (let i of input)
	                if (typeof i !== 'string')
	                    throw new Error(`padding.decode: non-string input=${i}`);
	            let end = input.length;
	            if ((end * bits) % 8)
	                throw new Error('Invalid padding: string should have whole number of bytes');
	            for (; end > 0 && input[end - 1] === chr; end--) {
	                if (!(((end - 1) * bits) % 8))
	                    throw new Error('Invalid padding: string has too much padding');
	            }
	            return input.slice(0, end);
	        },
	    };
	}
	function normalize(fn) {
	    if (typeof fn !== 'function')
	        throw new Error('normalize fn should be function');
	    return { encode: (from) => from, decode: (to) => fn(to) };
	}
	function convertRadix(data, from, to) {
	    if (from < 2)
	        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
	    if (to < 2)
	        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
	    if (!Array.isArray(data))
	        throw new Error('convertRadix: data should be array');
	    if (!data.length)
	        return [];
	    let pos = 0;
	    const res = [];
	    const digits = Array.from(data);
	    digits.forEach((d) => {
	        assertNumber(d);
	        if (d < 0 || d >= from)
	            throw new Error(`Wrong integer: ${d}`);
	    });
	    while (true) {
	        let carry = 0;
	        let done = true;
	        for (let i = pos; i < digits.length; i++) {
	            const digit = digits[i];
	            const digitBase = from * carry + digit;
	            if (!Number.isSafeInteger(digitBase) ||
	                (from * carry) / from !== carry ||
	                digitBase - digit !== from * carry) {
	                throw new Error('convertRadix: carry overflow');
	            }
	            carry = digitBase % to;
	            digits[i] = Math.floor(digitBase / to);
	            if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase)
	                throw new Error('convertRadix: carry overflow');
	            if (!done)
	                continue;
	            else if (!digits[i])
	                pos = i;
	            else
	                done = false;
	        }
	        res.push(carry);
	        if (done)
	            break;
	    }
	    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
	        res.push(0);
	    return res.reverse();
	}
	const gcd = (a, b) => (!b ? a : gcd(b, a % b));
	const radix2carry = (from, to) => from + (to - gcd(from, to));
	function convertRadix2(data, from, to, padding) {
	    if (!Array.isArray(data))
	        throw new Error('convertRadix2: data should be array');
	    if (from <= 0 || from > 32)
	        throw new Error(`convertRadix2: wrong from=${from}`);
	    if (to <= 0 || to > 32)
	        throw new Error(`convertRadix2: wrong to=${to}`);
	    if (radix2carry(from, to) > 32) {
	        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
	    }
	    let carry = 0;
	    let pos = 0;
	    const mask = 2 ** to - 1;
	    const res = [];
	    for (const n of data) {
	        assertNumber(n);
	        if (n >= 2 ** from)
	            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
	        carry = (carry << from) | n;
	        if (pos + from > 32)
	            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
	        pos += from;
	        for (; pos >= to; pos -= to)
	            res.push(((carry >> (pos - to)) & mask) >>> 0);
	        carry &= 2 ** pos - 1;
	    }
	    carry = (carry << (to - pos)) & mask;
	    if (!padding && pos >= from)
	        throw new Error('Excess padding');
	    if (!padding && carry)
	        throw new Error(`Non-zero padding: ${carry}`);
	    if (padding && pos > 0)
	        res.push(carry >>> 0);
	    return res;
	}
	function radix(num) {
	    assertNumber(num);
	    return {
	        encode: (bytes) => {
	            if (!(bytes instanceof Uint8Array))
	                throw new Error('radix.encode input should be Uint8Array');
	            return convertRadix(Array.from(bytes), 2 ** 8, num);
	        },
	        decode: (digits) => {
	            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
	                throw new Error('radix.decode input should be array of strings');
	            return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
	        },
	    };
	}
	function radix2(bits, revPadding = false) {
	    assertNumber(bits);
	    if (bits <= 0 || bits > 32)
	        throw new Error('radix2: bits should be in (0..32]');
	    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
	        throw new Error('radix2: carry overflow');
	    return {
	        encode: (bytes) => {
	            if (!(bytes instanceof Uint8Array))
	                throw new Error('radix2.encode input should be Uint8Array');
	            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
	        },
	        decode: (digits) => {
	            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
	                throw new Error('radix2.decode input should be array of strings');
	            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
	        },
	    };
	}
	function unsafeWrapper(fn) {
	    if (typeof fn !== 'function')
	        throw new Error('unsafeWrapper fn should be function');
	    return function (...args) {
	        try {
	            return fn.apply(null, args);
	        }
	        catch (e) { }
	    };
	}
	function checksum(len, fn) {
	    assertNumber(len);
	    if (typeof fn !== 'function')
	        throw new Error('checksum fn should be function');
	    return {
	        encode(data) {
	            if (!(data instanceof Uint8Array))
	                throw new Error('checksum.encode: input should be Uint8Array');
	            const checksum = fn(data).slice(0, len);
	            const res = new Uint8Array(data.length + len);
	            res.set(data);
	            res.set(checksum, data.length);
	            return res;
	        },
	        decode(data) {
	            if (!(data instanceof Uint8Array))
	                throw new Error('checksum.decode: input should be Uint8Array');
	            const payload = data.slice(0, -len);
	            const newChecksum = fn(payload).slice(0, len);
	            const oldChecksum = data.slice(-len);
	            for (let i = 0; i < len; i++)
	                if (newChecksum[i] !== oldChecksum[i])
	                    throw new Error('Invalid checksum');
	            return payload;
	        },
	    };
	}
	exports.utils = { alphabet, chain, checksum, radix, radix2, join, padding };
	exports.base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
	exports.base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
	exports.base32hex = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
	exports.base32crockford = chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
	exports.base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
	exports.base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
	const genBase58 = (abc) => chain(radix(58), alphabet(abc), join(''));
	exports.base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
	exports.base58flickr = genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
	exports.base58xrp = genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
	const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
	exports.base58xmr = {
	    encode(data) {
	        let res = '';
	        for (let i = 0; i < data.length; i += 8) {
	            const block = data.subarray(i, i + 8);
	            res += exports.base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
	        }
	        return res;
	    },
	    decode(str) {
	        let res = [];
	        for (let i = 0; i < str.length; i += 11) {
	            const slice = str.slice(i, i + 11);
	            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
	            const block = exports.base58.decode(slice);
	            for (let j = 0; j < block.length - blockLen; j++) {
	                if (block[j] !== 0)
	                    throw new Error('base58xmr: wrong padding');
	            }
	            res = res.concat(Array.from(block.slice(block.length - blockLen)));
	        }
	        return Uint8Array.from(res);
	    },
	};
	const base58check = (sha256) => chain(checksum(4, (data) => sha256(sha256(data))), exports.base58);
	exports.base58check = base58check;
	const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
	const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
	function bech32Polymod(pre) {
	    const b = pre >> 25;
	    let chk = (pre & 0x1ffffff) << 5;
	    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
	        if (((b >> i) & 1) === 1)
	            chk ^= POLYMOD_GENERATORS[i];
	    }
	    return chk;
	}
	function bechChecksum(prefix, words, encodingConst = 1) {
	    const len = prefix.length;
	    let chk = 1;
	    for (let i = 0; i < len; i++) {
	        const c = prefix.charCodeAt(i);
	        if (c < 33 || c > 126)
	            throw new Error(`Invalid prefix (${prefix})`);
	        chk = bech32Polymod(chk) ^ (c >> 5);
	    }
	    chk = bech32Polymod(chk);
	    for (let i = 0; i < len; i++)
	        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
	    for (let v of words)
	        chk = bech32Polymod(chk) ^ v;
	    for (let i = 0; i < 6; i++)
	        chk = bech32Polymod(chk);
	    chk ^= encodingConst;
	    return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
	}
	function genBech32(encoding) {
	    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
	    const _words = radix2(5);
	    const fromWords = _words.decode;
	    const toWords = _words.encode;
	    const fromWordsUnsafe = unsafeWrapper(fromWords);
	    function encode(prefix, words, limit = 90) {
	        if (typeof prefix !== 'string')
	            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
	        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
	            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
	        const actualLength = prefix.length + 7 + words.length;
	        if (limit !== false && actualLength > limit)
	            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
	        prefix = prefix.toLowerCase();
	        return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
	    }
	    function decode(str, limit = 90) {
	        if (typeof str !== 'string')
	            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
	        if (str.length < 8 || (limit !== false && str.length > limit))
	            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
	        const lowered = str.toLowerCase();
	        if (str !== lowered && str !== str.toUpperCase())
	            throw new Error(`String must be lowercase or uppercase`);
	        str = lowered;
	        const sepIndex = str.lastIndexOf('1');
	        if (sepIndex === 0 || sepIndex === -1)
	            throw new Error(`Letter "1" must be present between prefix and data only`);
	        const prefix = str.slice(0, sepIndex);
	        const _words = str.slice(sepIndex + 1);
	        if (_words.length < 6)
	            throw new Error('Data must be at least 6 characters long');
	        const words = BECH_ALPHABET.decode(_words).slice(0, -6);
	        const sum = bechChecksum(prefix, words, ENCODING_CONST);
	        if (!_words.endsWith(sum))
	            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
	        return { prefix, words };
	    }
	    const decodeUnsafe = unsafeWrapper(decode);
	    function decodeToBytes(str) {
	        const { prefix, words } = decode(str, false);
	        return { prefix, words, bytes: fromWords(words) };
	    }
	    return { encode, decode, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
	}
	exports.bech32 = genBech32('bech32');
	exports.bech32m = genBech32('bech32m');
	exports.utf8 = {
	    encode: (data) => new TextDecoder().decode(data),
	    decode: (str) => new TextEncoder().encode(str),
	};
	exports.hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize((s) => {
	    if (typeof s !== 'string' || s.length % 2)
	        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
	    return s.toLowerCase();
	}));
	const CODERS = {
	    utf8: exports.utf8, hex: exports.hex, base16: exports.base16, base32: exports.base32, base64: exports.base64, base64url: exports.base64url, base58: exports.base58, base58xmr: exports.base58xmr
	};
	const coderTypeError = `Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;
	const bytesToString = (type, bytes) => {
	    if (typeof type !== 'string' || !CODERS.hasOwnProperty(type))
	        throw new TypeError(coderTypeError);
	    if (!(bytes instanceof Uint8Array))
	        throw new TypeError('bytesToString() expects Uint8Array');
	    return CODERS[type].encode(bytes);
	};
	exports.bytesToString = bytesToString;
	exports.str = exports.bytesToString;
	const stringToBytes = (type, str) => {
	    if (!CODERS.hasOwnProperty(type))
	        throw new TypeError(coderTypeError);
	    if (typeof str !== 'string')
	        throw new TypeError('stringToBytes() expects string');
	    return CODERS[type].decode(str);
	};
	exports.stringToBytes = stringToBytes;
	exports.bytes = exports.stringToBytes; 
} (lib));

({
  m: BigInt(1e3),
  u: BigInt(1e6),
  n: BigInt(1e9),
  p: BigInt(1e12)
});

BigInt('2100000000000000000');

BigInt(1e11);

const TAGCODES = {
  payment_hash: 1,
  payment_secret: 16,
  description: 13,
  payee: 19,
  description_hash: 23, // commit to longer descriptions (used by lnurl-pay)
  expiry: 6, // default: 3600 (1 hour)
  min_final_cltv_expiry: 24, // default: 9
  fallback_address: 9,
  route_hint: 3, // for extra routing info (private etc.)
  feature_bits: 5,
  metadata: 27
};
for (let i = 0, keys = Object.keys(TAGCODES); i < keys.length; i++) {
  keys[i];
  TAGCODES[keys[i]].toString();
}

// src/user/index.ts

// src/outbox/relay-ranking.ts
function getTopRelaysForAuthors(ndk, authors) {
  const relaysWithCount = /* @__PURE__ */ new Map();
  authors.forEach((author) => {
    const writeRelays = getWriteRelaysFor(ndk, author);
    if (writeRelays) {
      writeRelays.forEach((relay) => {
        const count = relaysWithCount.get(relay) || 0;
        relaysWithCount.set(relay, count + 1);
      });
    }
  });
  let sortedRelays = Array.from(relaysWithCount.entries()).sort((a, b) => b[1] - a[1]);
  return sortedRelays.map((entry) => entry[0]);
}

// src/outbox/read/with-authors.ts
function getWriteRelaysFor(ndk, author) {
  if (!ndk.outboxTracker)
    return void 0;
  return ndk.outboxTracker.data.get(author)?.writeRelays;
}
function getAllRelaysForAllPubkeys(ndk, pubkeys) {
  const pubkeysToRelays = /* @__PURE__ */ new Map();
  const authorsMissingRelays = /* @__PURE__ */ new Set();
  pubkeys.forEach((author) => {
    const writeRelays = getWriteRelaysFor(ndk, author);
    if (writeRelays && writeRelays.size > 0) {
      writeRelays.forEach((relay) => {
        const pubkeysInRelay = pubkeysToRelays.get(relay) || /* @__PURE__ */ new Set();
        pubkeysInRelay.add(author);
        pubkeysToRelays.set(relay, pubkeysInRelay);
      });
      pubkeysToRelays.set(author, writeRelays);
    } else {
      authorsMissingRelays.add(author);
    }
  });
  return { pubkeysToRelays, authorsMissingRelays };
}
function getRelaysForFilterWithAuthors(ndk, authors, pool, relayGoalPerAuthor = 2) {
  const relayToAuthorsMap = /* @__PURE__ */ new Map();
  const { pubkeysToRelays, authorsMissingRelays } = getAllRelaysForAllPubkeys(ndk, authors);
  const sortedRelays = getTopRelaysForAuthors(ndk, authors);
  const addAuthorToRelay = (author, relay) => {
    const authorsInRelay = relayToAuthorsMap.get(relay) || [];
    authorsInRelay.push(author);
    relayToAuthorsMap.set(relay, authorsInRelay);
  };
  for (const [author, authorRelays] of pubkeysToRelays.entries()) {
    let missingRelaysForThisAuthor = relayGoalPerAuthor;
    for (const authorRelay of authorRelays) {
      if (relayToAuthorsMap.has(authorRelay)) {
        addAuthorToRelay(author, authorRelay);
        missingRelaysForThisAuthor--;
      }
    }
    if (missingRelaysForThisAuthor <= 0)
      continue;
    for (const relay of sortedRelays) {
      if (missingRelaysForThisAuthor <= 0)
        break;
      if (authorRelays.has(relay)) {
        addAuthorToRelay(author, relay);
        missingRelaysForThisAuthor--;
      }
    }
  }
  for (const author of authorsMissingRelays) {
    Array.from(pool.relays.keys()).forEach((relay) => {
      const authorsInRelay = relayToAuthorsMap.get(relay) || [];
      authorsInRelay.push(author);
      relayToAuthorsMap.set(relay, authorsInRelay);
    });
  }
  return relayToAuthorsMap;
}

// src/utils/timeout.ts
async function runWithTimeout(fn, timeoutMs, timeoutMessage) {
  if (!timeoutMs)
    return fn();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(timeoutMessage || `Timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    fn().then(resolve, reject).finally(() => clearTimeout(timeout));
  });
}

// src/relay/connectivity.ts
var NDKRelayConnectivity = class {
  ndkRelay;
  _status;
  relay;
  timeoutMs;
  connectedAt;
  _connectionStats = {
    attempts: 0,
    success: 0,
    durations: []
  };
  debug;
  reconnectTimeout;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
    this._status = 3 /* DISCONNECTED */;
    this.relay = relayInit(this.ndkRelay.url);
    this.debug = this.ndkRelay.debug.extend("connectivity");
    this.relay.on("notice", (notice) => this.handleNotice(notice));
  }
  async connect(timeoutMs) {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = void 0;
    }
    timeoutMs ??= this.timeoutMs;
    if (!this.timeoutMs && timeoutMs)
      this.timeoutMs = timeoutMs;
    const connectHandler = () => {
      this.updateConnectionStats.connected();
      this._status = 1 /* CONNECTED */;
      this.ndkRelay.emit("connect");
      this.ndkRelay.emit("ready");
    };
    const disconnectHandler = () => {
      this.updateConnectionStats.disconnected();
      if (this._status === 1 /* CONNECTED */) {
        this._status = 3 /* DISCONNECTED */;
        this.handleReconnection();
      }
      this.ndkRelay.emit("disconnect");
    };
    const authHandler = async (challenge) => {
      this.debug("Relay requested authentication", {
        havePolicy: !!this.ndkRelay.authPolicy
      });
      if (this.ndkRelay.authPolicy) {
        if (this._status !== 7 /* AUTHENTICATING */) {
          this._status = 7 /* AUTHENTICATING */;
          await this.ndkRelay.authPolicy(this.ndkRelay, challenge);
          if (this._status === 7 /* AUTHENTICATING */) {
            this.debug("Authentication policy finished");
            this._status = 1 /* CONNECTED */;
            this.ndkRelay.emit("authed");
          }
        }
      } else {
        await this.ndkRelay.emit("auth", challenge);
      }
    };
    try {
      this.updateConnectionStats.attempt();
      if (this._status === 3 /* DISCONNECTED */)
        this._status = 0 /* CONNECTING */;
      else
        this._status = 4 /* RECONNECTING */;
      this.relay.off("connect", connectHandler);
      this.relay.off("disconnect", disconnectHandler);
      this.relay.on("connect", connectHandler);
      this.relay.on("disconnect", disconnectHandler);
      this.relay.on("auth", authHandler);
      await runWithTimeout(this.relay.connect, timeoutMs, "Timed out while connecting");
    } catch (e) {
      this.debug("Failed to connect", e);
      this._status = 3 /* DISCONNECTED */;
      this.handleReconnection();
      throw e;
    }
  }
  disconnect() {
    this._status = 2 /* DISCONNECTING */;
    this.relay.close();
  }
  get status() {
    return this._status;
  }
  isAvailable() {
    return this._status === 1 /* CONNECTED */;
  }
  /**
   * Evaluates the connection stats to determine if the relay is flapping.
   */
  isFlapping() {
    const durations = this._connectionStats.durations;
    if (durations.length % 3 !== 0)
      return false;
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const variance = durations.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / durations.length;
    const stdDev = Math.sqrt(variance);
    const isFlapping = stdDev < 1e3;
    return isFlapping;
  }
  async handleNotice(notice) {
    if (notice.includes("oo many") || notice.includes("aximum")) {
      this.disconnect();
      setTimeout(() => this.connect(), 2e3);
      this.debug(this.relay.url, "Relay complaining?", notice);
    }
    this.ndkRelay.emit("notice", this.relay, notice);
  }
  /**
   * Called when the relay is unexpectedly disconnected.
   */
  handleReconnection(attempt = 0) {
    if (this.reconnectTimeout)
      return;
    this.debug("Attempting to reconnect", { attempt });
    if (this.isFlapping()) {
      this.ndkRelay.emit("flapping", this, this._connectionStats);
      this._status = 5 /* FLAPPING */;
      return;
    }
    const reconnectDelay = this.connectedAt ? Math.max(0, 6e4 - (Date.now() - this.connectedAt)) : 5e3 * (this._connectionStats.attempts + 1);
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = void 0;
      this._status = 4 /* RECONNECTING */;
      this.debug(`Reconnection attempt #${attempt}`);
      this.connect().then(() => {
        this.debug("Reconnected");
      }).catch((err) => {
        this.debug("Reconnect failed", err);
        if (attempt < 10) {
          setTimeout(() => {
            this.handleReconnection(attempt + 1);
          }, 1e3 * (attempt + 1) ^ 2);
        } else {
          this.debug("Reconnect failed after 10 attempts");
        }
      });
    }, reconnectDelay);
    this.debug("Reconnecting in", reconnectDelay);
    this._connectionStats.nextReconnectAt = Date.now() + reconnectDelay;
  }
  /**
   * Utility functions to update the connection stats.
   */
  updateConnectionStats = {
    connected: () => {
      this._connectionStats.success++;
      this._connectionStats.connectedAt = Date.now();
    },
    disconnected: () => {
      if (this._connectionStats.connectedAt) {
        this._connectionStats.durations.push(
          Date.now() - this._connectionStats.connectedAt
        );
        if (this._connectionStats.durations.length > 100) {
          this._connectionStats.durations.shift();
        }
      }
      this._connectionStats.connectedAt = void 0;
    },
    attempt: () => {
      this._connectionStats.attempts++;
    }
  };
  /**
   * Returns the connection stats.
   */
  get connectionStats() {
    return this._connectionStats;
  }
};

// src/relay/publisher.ts
var NDKRelayPublisher = class {
  ndkRelay;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
  }
  /**
   * Published an event to the relay; if the relay is not connected, it will
   * wait for the relay to connect before publishing the event.
   *
   * If the relay does not connect within the timeout, the publish operation
   * will fail.
   * @param event  The event to publish
   * @param timeoutMs  The timeout for the publish operation in milliseconds
   * @returns A promise that resolves when the event has been published or rejects if the operation times out
   */
  async publish(event, timeoutMs = 2500) {
    const publishWhenConnected = () => {
      return new Promise((resolve, reject) => {
        try {
          this.publishEvent(event, timeoutMs).then((result) => resolve(result)).catch((err) => reject(err));
        } catch (err) {
          reject(err);
        }
      });
    };
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout")), timeoutMs);
    });
    const onConnectHandler = () => {
      publishWhenConnected().then((result) => connectResolve(result)).catch((err) => connectReject(err));
    };
    let connectResolve;
    let connectReject;
    if (this.ndkRelay.status === 1 /* CONNECTED */) {
      return Promise.race([publishWhenConnected(), timeoutPromise]);
    } else {
      return Promise.race([
        new Promise((resolve, reject) => {
          connectResolve = resolve;
          connectReject = reject;
          this.ndkRelay.once("connect", onConnectHandler);
        }),
        timeoutPromise
      ]).finally(() => {
        this.ndkRelay.removeListener("connect", onConnectHandler);
      });
    }
  }
  async publishEvent(event, timeoutMs) {
    const nostrEvent = await event.toNostrEvent();
    const publish = this.ndkRelay.connectivity.relay.publish(nostrEvent);
    let publishTimeout;
    const publishPromise = new Promise((resolve, reject) => {
      publish.then(() => {
        clearTimeout(publishTimeout);
        this.ndkRelay.emit("published", event);
        resolve(true);
      }).catch((err) => {
        clearTimeout(publishTimeout);
        this.ndkRelay.debug("Publish failed", err, event.id);
        this.ndkRelay.emit("publish:failed", event, err);
        reject(err);
      });
    });
    if (!timeoutMs || event.isEphemeral()) {
      return publishPromise;
    }
    const timeoutPromise = new Promise((_, reject) => {
      publishTimeout = setTimeout(() => {
        this.ndkRelay.debug("Publish timed out", event.rawEvent());
        this.ndkRelay.emit("publish:failed", event, "Timeout");
        reject(new Error("Publish operation timed out"));
      }, timeoutMs);
    });
    return Promise.race([publishPromise, timeoutPromise]);
  }
  async auth(event) {
    return this.ndkRelay.connectivity.relay.auth(event.rawEvent());
  }
};

// src/subscription/grouping.ts
function calculateGroupableId(filters) {
  const elements = [];
  for (const filter of filters) {
    const hasTimeConstraints = filter.since || filter.until;
    if (hasTimeConstraints)
      return null;
    const keys = Object.keys(filter || {}).sort().join("-");
    elements.push(keys);
  }
  return elements.join("|");
}
function mergeFilters(filters) {
  const result = {};
  filters.forEach((filter) => {
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (result[key] === void 0) {
          result[key] = [...value];
        } else {
          result[key] = Array.from(/* @__PURE__ */ new Set([...result[key], ...value]));
        }
      } else {
        result[key] = value;
      }
    });
  });
  return result;
}
var MAX_SUBID_LENGTH = 20;
function queryFullyFilled(subscription) {
  if (filterIncludesIds(subscription.filter)) {
    if (resultHasAllRequestedIds(subscription)) {
      return true;
    }
  }
  return false;
}
function compareFilter(filter1, filter2) {
  if (Object.keys(filter1).length !== Object.keys(filter2).length)
    return false;
  for (const [key, value] of Object.entries(filter1)) {
    const valuesInFilter2 = filter2[key];
    if (!valuesInFilter2)
      return false;
    if (Array.isArray(value) && Array.isArray(valuesInFilter2)) {
      const v = value;
      for (const valueInFilter2 of valuesInFilter2) {
        const val = valueInFilter2;
        if (!v.includes(val)) {
          return false;
        }
      }
    } else {
      if (valuesInFilter2 !== value)
        return false;
    }
  }
  return true;
}
function filterIncludesIds(filter) {
  return !!filter["ids"];
}
function resultHasAllRequestedIds(subscription) {
  const ids = subscription.filter["ids"];
  return !!ids && ids.length === subscription.eventFirstSeen.size;
}
function generateSubId(subscriptions, filters) {
  const subIds = subscriptions.map((sub) => sub.subId).filter(Boolean);
  const subIdParts = [];
  const filterNonKindKeys = /* @__PURE__ */ new Set();
  const filterKinds = /* @__PURE__ */ new Set();
  if (subIds.length > 0) {
    subIdParts.push(Array.from(new Set(subIds)).join(","));
  } else {
    for (const filter of filters) {
      for (const key of Object.keys(filter)) {
        if (key === "kinds") {
          filter.kinds?.forEach((k) => filterKinds.add(k));
        } else {
          filterNonKindKeys.add(key);
        }
      }
    }
    if (filterKinds.size > 0) {
      subIdParts.push("kinds:" + Array.from(filterKinds).join(","));
    }
    if (filterNonKindKeys.size > 0) {
      subIdParts.push(Array.from(filterNonKindKeys).join(","));
    }
  }
  let subId = subIdParts.join("-");
  if (subId.length > MAX_SUBID_LENGTH)
    subId = subId.substring(0, MAX_SUBID_LENGTH);
  if (subIds.length !== 1) {
    subId += "-" + Math.floor(Math.random() * 999).toString();
  }
  return subId;
}
function filterFromId(id) {
  let decoded;
  if (id.match(NIP33_A_REGEX)) {
    const [kind, pubkey, identifier] = id.split(":");
    const filter = {
      authors: [pubkey],
      kinds: [parseInt(kind)]
    };
    if (identifier) {
      filter["#d"] = [identifier];
    }
    return filter;
  }
  try {
    decoded = nip19_exports.decode(id);
    switch (decoded.type) {
      case "nevent":
        return { ids: [decoded.data.id] };
      case "note":
        return { ids: [decoded.data] };
      case "naddr":
        return {
          authors: [decoded.data.pubkey],
          "#d": [decoded.data.identifier],
          kinds: [decoded.data.kind]
        };
    }
  } catch (e) {
  }
  return { ids: [id] };
}
function isNip33AValue(value) {
  return value.match(NIP33_A_REGEX) !== null;
}
var NIP33_A_REGEX = /^(\d+):([0-9A-Fa-f]+)(?::(.*))?$/;
function relaysFromBech32(bech322) {
  try {
    const decoded = nip19_exports.decode(bech322);
    if (["naddr", "nevent"].includes(decoded?.type)) {
      const data = decoded.data;
      if (data?.relays) {
        return data.relays.map((r) => new NDKRelay(r));
      }
    }
  } catch (e) {
  }
  return [];
}

// src/relay/subscriptions.ts
var NDKGroupedSubscriptions = class extends lib$1.EventEmitter {
  subscriptions;
  req;
  debug;
  constructor(subscriptions, debug7) {
    super();
    this.subscriptions = subscriptions;
    this.debug = debug7 || this.subscriptions[0].subscription.debug.extend("grouped");
    for (const subscription of subscriptions) {
      this.handleSubscriptionClosure(subscription);
    }
  }
  /**
   * Adds a subscription to this group.
   * @param subscription
   */
  addSubscription(subscription) {
    this.subscriptions.push(subscription);
    this.handleSubscriptionClosure(subscription);
  }
  eventReceived(event) {
    for (const subscription of this.subscriptions) {
      subscription.eventReceived(event);
    }
  }
  eoseReceived(relay) {
    const subscriptionsToInform = Array.from(this.subscriptions);
    subscriptionsToInform.forEach(async (subscription) => {
      subscription.subscription.eoseReceived(relay);
    });
  }
  handleSubscriptionClosure(subscription) {
    subscription.subscription.on("close", () => {
      const index = this.subscriptions.findIndex(
        (i) => i.subscription === subscription.subscription
      );
      this.subscriptions.splice(index, 1);
      if (this.subscriptions.length <= 0) {
        this.emit("close");
      }
    });
  }
  /**
   * Maps each subscription through a transformation function.
   * @param fn - The transformation function.
   * @returns A new array with each subscription transformed by fn.
   */
  map(fn) {
    return this.subscriptions.map(fn);
  }
  [Symbol.iterator]() {
    let index = 0;
    const subscriptions = this.subscriptions;
    return {
      next() {
        if (index < subscriptions.length) {
          return { value: subscriptions[index++], done: false };
        } else {
          return { value: null, done: true };
        }
      }
    };
  }
};
var NDKSubscriptionFilters = class {
  subscription;
  filters = [];
  ndkRelay;
  constructor(subscription, filters, ndkRelay) {
    this.subscription = subscription;
    this.filters = filters;
    this.ndkRelay = ndkRelay;
  }
  eventReceived(event) {
    if (!this.eventMatchesLocalFilter(event))
      return;
    this.subscription.eventReceived(event, this.ndkRelay, false);
  }
  eventMatchesLocalFilter(event) {
    const rawEvent = event.rawEvent();
    return this.filters.some((filter) => matchFilter(filter, rawEvent));
  }
};
function findMatchingActiveSubscriptions(activeSubscriptions, filters) {
  if (activeSubscriptions.length !== filters.length)
    return false;
  for (let i = 0; i < activeSubscriptions.length; i++) {
    if (!compareFilter(activeSubscriptions[i], filters[i])) {
      break;
    }
    return activeSubscriptions[i];
  }
  return void 0;
}
var NDKRelaySubscriptions = class {
  ndkRelay;
  delayedItems = /* @__PURE__ */ new Map();
  delayedTimers = /* @__PURE__ */ new Map();
  /**
   * Active subscriptions this relay is connected to
   */
  activeSubscriptions = /* @__PURE__ */ new Map();
  activeSubscriptionsByGroupId = /* @__PURE__ */ new Map();
  executionTimeoutsByGroupId = /* @__PURE__ */ new Map();
  debug;
  groupingDebug;
  conn;
  constructor(ndkRelay) {
    this.ndkRelay = ndkRelay;
    this.conn = ndkRelay.connectivity;
    this.debug = ndkRelay.debug.extend("subscriptions");
    this.groupingDebug = ndkRelay.debug.extend("grouping");
  }
  /**
   * Creates or queues a subscription to the relay.
   */
  subscribe(subscription, filters) {
    const groupableId = calculateGroupableId(filters);
    const subscriptionFilters = new NDKSubscriptionFilters(
      subscription,
      filters,
      this.ndkRelay
    );
    const isNotGroupable = !groupableId || !subscription.isGroupable();
    if (isNotGroupable) {
      this.executeSubscriptions(
        groupableId,
        // hacky
        new NDKGroupedSubscriptions([subscriptionFilters]),
        filters
      );
      return;
    }
    const activeSubscriptions = this.activeSubscriptionsByGroupId.get(groupableId);
    if (activeSubscriptions) {
      const matchingSubscription = findMatchingActiveSubscriptions(
        activeSubscriptions.filters,
        filters
      );
      if (matchingSubscription) {
        const activeSubscription = this.activeSubscriptions.get(activeSubscriptions.sub);
        activeSubscription?.addSubscription(
          new NDKSubscriptionFilters(subscription, filters, this.ndkRelay)
        );
        return;
      }
    }
    let delayedItem = this.delayedItems.get(groupableId);
    if (!delayedItem) {
      delayedItem = new NDKGroupedSubscriptions([subscriptionFilters]);
      this.delayedItems.set(groupableId, delayedItem);
      delayedItem.once("close", () => {
        const delayedItem2 = this.delayedItems.get(groupableId);
        if (!delayedItem2)
          return;
        this.delayedItems.delete(groupableId);
      });
    } else {
      delayedItem.addSubscription(subscriptionFilters);
    }
    let timeout = this.executionTimeoutsByGroupId.get(groupableId);
    if (!timeout || subscription.opts.groupableDelayType === "at-most") {
      timeout = setTimeout(() => {
        this.executeGroup(groupableId, subscription);
      }, subscription.opts.groupableDelay);
      this.executionTimeoutsByGroupId.set(groupableId, timeout);
    }
    if (this.delayedTimers.has(groupableId)) {
      this.delayedTimers.get(groupableId).push(timeout);
    } else {
      this.delayedTimers.set(groupableId, [timeout]);
    }
  }
  /**
   * Executes a delayed subscription via its groupable ID.
   * @param groupableId
   */
  executeGroup(groupableId, triggeredBy) {
    const delayedItem = this.delayedItems.get(groupableId);
    this.delayedItems.delete(groupableId);
    const timeouts = this.delayedTimers.get(groupableId);
    this.delayedTimers.delete(groupableId);
    if (timeouts) {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    }
    if (delayedItem) {
      const filterCount = delayedItem.subscriptions[0].filters.length;
      const mergedFilters = [];
      for (let i = 0; i < filterCount; i++) {
        const allFiltersAtIndex = delayedItem.map((di) => di.filters[i]);
        mergedFilters.push(mergeFilters(allFiltersAtIndex));
      }
      this.executeSubscriptions(groupableId, delayedItem, mergedFilters);
    }
  }
  executeSubscriptionsWhenConnected(groupableId, groupedSubscriptions, mergedFilters) {
    const readyListener = () => {
      this.debug("new relay coming online for active subscription", {
        relay: this.ndkRelay.url
        // mergedFilters: JSON.stringify(mergedFilters),
      });
      this.executeSubscriptionsConnected(groupableId, groupedSubscriptions, mergedFilters);
    };
    this.ndkRelay.once("ready", readyListener);
    groupedSubscriptions.once("close", () => {
      this.ndkRelay.removeListener("ready", readyListener);
    });
  }
  /**
   * Executes one or more subscriptions.
   *
   * If the relay is not connected, subscriptions will be queued
   * until the relay connects.
   *
   * @param groupableId
   * @param subscriptionFilters
   * @param mergedFilters
   */
  executeSubscriptions(groupableId, groupedSubscriptions, mergedFilters) {
    if (this.conn.isAvailable()) {
      this.executeSubscriptionsConnected(groupableId, groupedSubscriptions, mergedFilters);
    } else {
      this.executeSubscriptionsWhenConnected(
        groupableId,
        groupedSubscriptions,
        mergedFilters
      );
    }
  }
  /**
   * Executes one or more subscriptions.
   *
   * When there are more than one subscription, results
   * will be sent to the right subscription
   *
   * @param subscriptions
   * @param filters The filters as they should be sent to the relay
   */
  executeSubscriptionsConnected(groupableId, groupedSubscriptions, mergedFilters) {
    const subscriptions = [];
    for (const { subscription } of groupedSubscriptions) {
      subscriptions.push(subscription);
    }
    const subId = generateSubId(subscriptions, mergedFilters);
    groupedSubscriptions.req = mergedFilters;
    const subOptions = { id: subId };
    if (this.ndkRelay.trusted || subscriptions.every((sub2) => sub2.opts.skipVerification)) {
      subOptions.skipVerification = true;
    }
    const sub = this.conn.relay.sub(mergedFilters, subOptions);
    this.activeSubscriptions.set(sub, groupedSubscriptions);
    if (groupableId) {
      this.activeSubscriptionsByGroupId.set(groupableId, { filters: mergedFilters, sub });
    }
    sub.on("event", (event) => {
      const e = new NDKEvent(void 0, event);
      e.relay = this.ndkRelay;
      const subFilters = this.activeSubscriptions.get(sub);
      subFilters?.eventReceived(e);
    });
    sub.on("eose", () => {
      const subFilters = this.activeSubscriptions.get(sub);
      subFilters?.eoseReceived(this.ndkRelay);
    });
    groupedSubscriptions.once("close", () => {
      sub.unsub();
      this.activeSubscriptions.delete(sub);
      if (groupableId) {
        this.activeSubscriptionsByGroupId.delete(groupableId);
      }
    });
    this.executeSubscriptionsWhenConnected(groupableId, groupedSubscriptions, mergedFilters);
    return sub;
  }
  executedFilters() {
    const ret = /* @__PURE__ */ new Map();
    for (const [, groupedSubscriptions] of this.activeSubscriptions) {
      ret.set(
        groupedSubscriptions.req,
        groupedSubscriptions.map((sub) => sub.subscription)
      );
    }
    return ret;
  }
};
var NDKRelay = class extends lib$1.EventEmitter {
  url;
  scores;
  connectivity;
  subs;
  publisher;
  authPolicy;
  /**
   * Whether this relay is trusted.
   *
   * Trusted relay's events do not get their signature verified.
   */
  trusted = false;
  complaining = false;
  debug;
  constructor(url, authPolicy) {
    super();
    this.url = url;
    this.scores = /* @__PURE__ */ new Map();
    this.debug = debug6(`ndk:relay:${url}`);
    this.connectivity = new NDKRelayConnectivity(this);
    this.subs = new NDKRelaySubscriptions(this);
    this.publisher = new NDKRelayPublisher(this);
    this.authPolicy = authPolicy;
  }
  get status() {
    return this.connectivity.status;
  }
  get connectionStats() {
    return this.connectivity.connectionStats;
  }
  /**
   * Connects to the relay.
   */
  async connect(timeoutMs) {
    return this.connectivity.connect(timeoutMs);
  }
  /**
   * Disconnects from the relay.
   */
  disconnect() {
    if (this.status === 3 /* DISCONNECTED */) {
      return;
    }
    this.connectivity.disconnect();
  }
  /**
   * Queues or executes the subscription of a specific set of filters
   * within this relay.
   *
   * @param subscription NDKSubscription this filters belong to.
   * @param filters Filters to execute
   */
  subscribe(subscription, filters) {
    this.subs.subscribe(subscription, filters);
  }
  /**
   * Publishes an event to the relay with an optional timeout.
   *
   * If the relay is not connected, the event will be published when the relay connects,
   * unless the timeout is reached before the relay connects.
   *
   * @param event The event to publish
   * @param timeoutMs The timeout for the publish operation in milliseconds
   * @returns A promise that resolves when the event has been published or rejects if the operation times out
   */
  async publish(event, timeoutMs = 2500) {
    return this.publisher.publish(event, timeoutMs);
  }
  async auth(event) {
    return this.publisher.auth(event);
  }
  /**
   * Called when this relay has responded with an event but
   * wasn't the fastest one.
   * @param timeDiffInMs The time difference in ms between the fastest and this relay in milliseconds
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scoreSlowerEvent(timeDiffInMs) {
  }
  /** @deprecated Use referenceTags instead. */
  tagReference(marker) {
    const tag = ["r", this.url];
    if (marker) {
      tag.push(marker);
    }
    return tag;
  }
  referenceTags() {
    return [["r", this.url]];
  }
  activeSubscriptions() {
    return this.subs.executedFilters();
  }
};

// src/relay/sets/index.ts
var PublishError = class extends Error {
  errors;
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
  get relayErrors() {
    const errors = [];
    for (const [relay, err] of this.errors) {
      errors.push(`${relay.url}: ${err}`);
    }
    return errors.join("\n");
  }
};
var NDKRelaySet = class _NDKRelaySet {
  relays;
  debug;
  ndk;
  constructor(relays, ndk) {
    this.relays = relays;
    this.ndk = ndk;
    this.debug = ndk.debug.extend("relayset");
  }
  /**
   * Adds a relay to this set.
   */
  addRelay(relay) {
    this.relays.add(relay);
  }
  /**
   * Creates a relay set from a list of relay URLs.
   *
   * If no connection to the relay is found in the pool it will temporarily
   * connect to it.
   *
   * @param relayUrls - list of relay URLs to include in this set
   * @param ndk
   * @returns NDKRelaySet
   */
  static fromRelayUrls(relayUrls, ndk) {
    const relays = /* @__PURE__ */ new Set();
    for (const url of relayUrls) {
      const relay = ndk.pool.relays.get(url);
      if (relay) {
        relays.add(relay);
      } else {
        const temporaryRelay = new NDKRelay(url);
        ndk.pool.useTemporaryRelay(temporaryRelay);
        relays.add(temporaryRelay);
      }
    }
    return new _NDKRelaySet(new Set(relays), ndk);
  }
  /**
   * Publish an event to all relays in this set. Returns the number of relays that have received the event.
   * @param event
   * @param timeoutMs - timeout in milliseconds for each publish operation and connection operation
   * @returns A set where the event was successfully published to
   * @throws PublishError if no relay was able to receive the event
   * @example
   * ```typescript
   * const event = new NDKEvent(ndk, {kinds: [NDKKind.Message], "#d": ["123"]});
   * try {
   *    const publishedToRelays = await relaySet.publish(event);
   *    console.log(`published to ${publishedToRelays.size} relays`)
   * } catch (error) {
   *   console.error("error publishing to relays", error);
   *
   *   if (error instanceof PublishError) {
   *      for (const [relay, err] of error.errors) {
   *         console.error(`error publishing to relay ${relay.url}`, err);
   *       }
   *   }
   * }
   * ```
   */
  async publish(event, timeoutMs) {
    const publishedToRelays = /* @__PURE__ */ new Set();
    const errors = /* @__PURE__ */ new Map();
    const isEphemeral2 = event.isEphemeral();
    const promises = Array.from(this.relays).map((relay) => {
      return new Promise((resolve) => {
        relay.publish(event, timeoutMs).then((e) => {
          publishedToRelays.add(relay);
          resolve();
        }).catch((err) => {
          if (!isEphemeral2) {
            errors.set(relay, err);
            this.debug("error publishing to relay", {
              relay: relay.url,
              err
            });
          }
          resolve();
        });
      });
    });
    await Promise.all(promises);
    if (publishedToRelays.size === 0) {
      if (!isEphemeral2) {
        throw new PublishError("No relay was able to receive the event", errors);
      }
    }
    return publishedToRelays;
  }
  get size() {
    return this.relays.size;
  }
};

// src/relay/sets/calculate.ts
function calculateRelaySetFromEvent(ndk, event) {
  const relays = /* @__PURE__ */ new Set();
  ndk.pool?.relays.forEach((relay) => relays.add(relay));
  return new NDKRelaySet(relays, ndk);
}
function calculateRelaySetsFromFilter(ndk, filters, pool) {
  const result = /* @__PURE__ */ new Map();
  const authors = /* @__PURE__ */ new Set();
  filters.forEach((filter) => {
    if (filter.authors) {
      filter.authors.forEach((author) => authors.add(author));
    }
  });
  if (authors.size > 0) {
    const authorToRelaysMap = getRelaysForFilterWithAuthors(ndk, Array.from(authors), pool);
    for (const relayUrl of authorToRelaysMap.keys()) {
      result.set(relayUrl, []);
    }
    for (const filter of filters) {
      if (filter.authors) {
        for (const [relayUrl, authors2] of authorToRelaysMap.entries()) {
          const authorFilterAndRelayPubkeyIntersection = filter.authors.filter(
            (author) => authors2.includes(author)
          );
          result.set(relayUrl, [
            ...result.get(relayUrl),
            {
              ...filter,
              // Overwrite authors sent to this relay with the authors that were
              // present in the filter and are also present in the relay
              authors: authorFilterAndRelayPubkeyIntersection
            }
          ]);
        }
      } else {
        for (const relayUrl of authorToRelaysMap.keys()) {
          result.set(relayUrl, [...result.get(relayUrl), filter]);
        }
      }
    }
  } else {
    Array.from(pool.relays.keys()).forEach((relay) => {
      result.set(relay, filters);
    });
  }
  return result;
}
function calculateRelaySetsFromFilters(ndk, filters, pool) {
  return calculateRelaySetsFromFilter(ndk, filters, pool);
}
function mergeTags(tags1, tags2) {
  const tagMap = /* @__PURE__ */ new Map();
  const generateKey = (tag) => tag.join(",");
  const isContained = (smaller, larger) => {
    return smaller.every((value, index) => value === larger[index]);
  };
  const processTag = (tag) => {
    for (let [key, existingTag] of tagMap) {
      if (isContained(existingTag, tag) || isContained(tag, existingTag)) {
        if (tag.length >= existingTag.length) {
          tagMap.set(key, tag);
        }
        return;
      }
    }
    tagMap.set(generateKey(tag), tag);
  };
  tags1.concat(tags2).forEach(processTag);
  return Array.from(tagMap.values());
}
async function generateContentTags(content, tags = []) {
  const tagRegex = /(@|nostr:)(npub|nprofile|note|nevent|naddr)[a-zA-Z0-9]+/g;
  const hashtagRegex = /#(\w+)/g;
  let promises = [];
  const addTagIfNew = (t) => {
    if (!tags.find((t2) => t2[0] === t[0] && t2[1] === t[1])) {
      tags.push(t);
    }
  };
  content = content.replace(tagRegex, (tag) => {
    try {
      const entity = tag.split(/(@|nostr:)/)[2];
      const { type, data } = nip19_exports.decode(entity);
      let t;
      switch (type) {
        case "npub":
          t = ["p", data];
          break;
        case "nprofile":
          t = ["p", data.pubkey];
          break;
        case "note":
          promises.push(
            new Promise(async (resolve) => {
              addTagIfNew([
                "e",
                data,
                await maybeGetEventRelayUrl(entity),
                "mention"
              ]);
              resolve();
            })
          );
          break;
        case "nevent":
          promises.push(
            new Promise(async (resolve) => {
              let { id, relays, author } = data;
              if (!relays || relays.length === 0) {
                relays = [await maybeGetEventRelayUrl(entity)];
              }
              addTagIfNew(["e", id, relays[0], "mention"]);
              if (author)
                addTagIfNew(["p", author]);
              resolve();
            })
          );
          break;
        case "naddr":
          promises.push(
            new Promise(async (resolve) => {
              const id = [data.kind, data.pubkey, data.identifier].join(":");
              let relays = data.relays ?? [];
              if (relays.length === 0) {
                relays = [await maybeGetEventRelayUrl(entity)];
              }
              addTagIfNew(["a", id, relays[0], "mention"]);
              addTagIfNew(["p", data.pubkey]);
              resolve();
            })
          );
          break;
        default:
          return tag;
      }
      if (t)
        addTagIfNew(t);
      return `nostr:${entity}`;
    } catch (error) {
      return tag;
    }
  });
  await Promise.all(promises);
  content = content.replace(hashtagRegex, (tag, word) => {
    const t = ["t", word];
    if (!tags.find((t2) => t2[0] === t[0] && t2[1] === t[1])) {
      tags.push(t);
    }
    return tag;
  });
  return { content, tags };
}
async function maybeGetEventRelayUrl(nip19Id) {
  return "";
}

// src/events/kind.ts
function isReplaceable() {
  if (this.kind === void 0)
    throw new Error("Kind not set");
  return [0, 3].includes(this.kind) || this.kind >= 1e4 && this.kind < 2e4 || this.kind >= 3e4 && this.kind < 4e4;
}
function isEphemeral() {
  if (this.kind === void 0)
    throw new Error("Kind not set");
  return this.kind >= 2e4 && this.kind < 3e4;
}
function isParamReplaceable() {
  if (this.kind === void 0)
    throw new Error("Kind not set");
  return this.kind >= 3e4 && this.kind < 4e4;
}

// src/events/nip04.ts
async function encrypt(recipient, signer) {
  if (!this.ndk)
    throw new Error("No NDK instance found!");
  if (!signer) {
    await this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  if (!recipient) {
    const pTags = this.getMatchingTags("p");
    if (pTags.length !== 1) {
      throw new Error(
        "No recipient could be determined and no explicit recipient was provided"
      );
    }
    recipient = this.ndk.getUser({ hexpubkey: pTags[0][1] });
  }
  this.content = await signer?.encrypt(recipient, this.content);
}
async function decrypt(sender, signer) {
  if (!this.ndk)
    throw new Error("No NDK instance found!");
  if (!signer) {
    await this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  if (!sender) {
    sender = this.author;
  }
  this.content = await signer?.decrypt(sender, this.content);
}
function encode() {
  let relays = [];
  if (this.onRelays.length > 0) {
    relays = this.onRelays.map((relay) => relay.url);
  } else if (this.relay) {
    relays = [this.relay.url];
  }
  if (this.isParamReplaceable()) {
    return nip19_exports.naddrEncode({
      kind: this.kind,
      pubkey: this.pubkey,
      identifier: this.replaceableDTag(),
      relays
    });
  } else if (relays.length > 0) {
    return nip19_exports.neventEncode({
      id: this.tagId(),
      relays,
      author: this.pubkey
    });
  } else {
    return nip19_exports.noteEncode(this.tagId());
  }
}

// src/events/repost.ts
async function repost(publish = true, signer) {
  if (!signer && publish) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    signer = this.ndk.signer;
  }
  const e = new NDKEvent(this.ndk, {
    kind: getKind(this),
    content: ""
  });
  e.tag(this);
  if (e.kind === 16 /* GenericRepost */) {
    e.tags.push(["k", `${this.kind}`]);
  }
  if (signer)
    await e.sign(signer);
  if (publish)
    await e.publish();
  return e;
}
function getKind(event) {
  if (event.kind === 1) {
    return 6 /* Repost */;
  }
  return 16 /* GenericRepost */;
}

// src/events/serializer.ts
function serialize() {
  return JSON.stringify([0, this.pubkey, this.created_at, this.kind, this.tags, this.content]);
}
var PUBKEY_REGEX = /^[a-f0-9]{64}$/;
function validate() {
  if (typeof this.kind !== "number")
    return false;
  if (typeof this.content !== "string")
    return false;
  if (typeof this.created_at !== "number")
    return false;
  if (typeof this.pubkey !== "string")
    return false;
  if (!this.pubkey.match(PUBKEY_REGEX))
    return false;
  if (!Array.isArray(this.tags))
    return false;
  for (let i = 0; i < this.tags.length; i++) {
    const tag = this.tags[i];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] === "object")
        return false;
    }
  }
  return true;
}
function verifySignature(persist) {
  if (typeof this.signatureVerified === "boolean")
    return this.signatureVerified;
  const hash = this.getEventHash();
  if (hash !== this.id) {
    return persist ? this.signatureVerified = false : false;
  }
  try {
    return this.signatureVerified = schnorr.verify(this.sig, hash, this.pubkey);
  } catch (err) {
    return this.signatureVerified = false;
  }
}
function getEventHash() {
  const eventHash = sha256(new TextEncoder().encode(this.serialize()));
  return bytesToHex$1(eventHash);
}
var debug2 = debug6("ndk:zap");
var DEFAULT_RELAYS = [
  "wss://nos.lol",
  "wss://relay.nostr.band",
  "wss://relay.f7z.io",
  "wss://relay.damus.io",
  "wss://nostr.mom",
  "wss://no.str.cr"
];
var NDKZap = class _NDKZap extends lib$1.EventEmitter {
  ndk;
  zappedEvent;
  zappedUser;
  fetch = fetch;
  constructor(args) {
    super();
    this.ndk = args.ndk;
    this.zappedEvent = args.zappedEvent;
    this.fetch = args._fetch || fetch;
    this.zappedUser = args.zappedUser || this.ndk.getUser({ hexpubkey: this.zappedEvent?.pubkey });
  }
  /**
   * Fetches the zapper's pubkey for the zapped user
   */
  static async getZapperPubkey(ndk, forUser) {
    const zappedUser = ndk.getUser({ pubkey: forUser });
    const zap = new _NDKZap({ ndk, zappedUser });
    const lnurlspec = await zap.getZapSpec();
    return lnurlspec?.nostrPubkey;
  }
  async getZapSpec() {
    if (!this.zappedUser)
      throw new Error("No user to zap was provided");
    return this.zappedUser.getZapConfiguration(this.ndk);
  }
  async getZapSpecWithoutCache() {
    let lud06;
    let lud16;
    let zapEndpoint;
    let profile;
    if (this.zappedUser) {
      if (!this.zappedUser.profile) {
        await this.zappedUser.fetchProfile({ groupable: false });
      }
      profile = this.zappedUser.profile;
      lud06 = (this.zappedUser.profile || {}).lud06;
      lud16 = (this.zappedUser.profile || {}).lud16;
    }
    if (lud16 && !lud16.startsWith("LNURL")) {
      const [name, domain] = lud16.split("@");
      zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
    } else if (lud06) {
      const { words } = bech32.decode(lud06, 1e3);
      const data = bech32.fromWords(words);
      const utf8Decoder = new TextDecoder("utf-8");
      zapEndpoint = utf8Decoder.decode(data);
    }
    if (!zapEndpoint) {
      debug2("No zap endpoint found", profile, { lud06, lud16 });
      throw new Error("No zap endpoint found");
    }
    try {
      const _fetch = this.fetch || this.ndk.httpFetch;
      const response = await _fetch(zapEndpoint);
      if (response.status !== 200) {
        const text = await response.text();
        throw new Error(`Unable to fetch zap endpoint ${zapEndpoint}: ${text}`);
      }
      return await response.json();
    } catch (e) {
      throw new Error(`Unable to fetch zap endpoint ${zapEndpoint}: ${e}`);
    }
  }
  async getZapEndpoint() {
    const zapSpec = await this.getZapSpec();
    if (!zapSpec)
      return;
    let zapEndpointCallback;
    if (zapSpec?.allowsNostr && (zapSpec?.nostrPubkey || zapSpec?.nostrPubkey)) {
      zapEndpointCallback = zapSpec.callback;
    }
    return zapEndpointCallback;
  }
  /**
   * Generates a kind:9734 zap request and returns the payment request
   * @param amount amount to zap in millisatoshis
   * @param comment optional comment to include in the zap request
   * @param extraTags optional extra tags to include in the zap request
   * @param relays optional relays to ask zapper to publish the zap to
   * @returns the payment request
   */
  async createZapRequest(amount, comment, extraTags, relays, signer) {
    const res = await this.generateZapRequest(amount, comment, extraTags, relays);
    if (!res)
      return null;
    const { event, zapEndpoint } = res;
    if (!event) {
      throw new Error("No zap request event found");
    }
    await event.sign(signer);
    let invoice;
    try {
      debug2(`Getting invoice for zap request: ${zapEndpoint}`);
      invoice = await this.getInvoice(event, amount, zapEndpoint);
    } catch (e) {
      throw new Error("Failed to get invoice: " + e);
    }
    return invoice;
  }
  async getInvoice(event, amount, zapEndpoint) {
    debug2(
      `Fetching invoice from ${zapEndpoint}?` + new URLSearchParams({
        amount: amount.toString(),
        nostr: encodeURIComponent(JSON.stringify(event.rawEvent()))
      })
    );
    const url = new URL(zapEndpoint);
    url.searchParams.append("amount", amount.toString());
    url.searchParams.append("nostr", JSON.stringify(event.rawEvent()));
    debug2(`Fetching invoice from ${url.toString()}`);
    const response = await fetch(url.toString());
    debug2(`Got response from zap endpoint: ${zapEndpoint}`, { status: response.status });
    if (response.status !== 200) {
      debug2(`Received non-200 status from zap endpoint: ${zapEndpoint}`, {
        status: response.status,
        amount,
        nostr: JSON.stringify(event.rawEvent())
      });
      const text = await response.text();
      throw new Error(`Unable to fetch zap endpoint ${zapEndpoint}: ${text}`);
    }
    const body = await response.json();
    return body.pr;
  }
  async generateZapRequest(amount, comment, extraTags, relays, signer) {
    const zapEndpoint = await this.getZapEndpoint();
    if (!zapEndpoint) {
      throw new Error("No zap endpoint found");
    }
    if (!this.zappedEvent && !this.zappedUser)
      throw new Error("No zapped event or user found");
    const zapRequest = nip57_exports.makeZapRequest({
      profile: this.zappedUser.pubkey,
      // set the event to null since nostr-tools doesn't support nip-33 zaps
      event: null,
      amount,
      comment: comment || "",
      relays: relays ?? this.relays()
    });
    if (this.zappedEvent) {
      const tags = this.zappedEvent.referenceTags();
      const nonPTags = tags.filter((tag) => tag[0] !== "p");
      zapRequest.tags.push(...nonPTags);
    }
    zapRequest.tags.push(["lnurl", zapEndpoint]);
    const event = new NDKEvent(this.ndk, zapRequest);
    if (extraTags) {
      event.tags = event.tags.concat(extraTags);
    }
    return { event, zapEndpoint };
  }
  /**
   * @returns the relays to use for the zap request
   */
  relays() {
    let r = [];
    if (this.ndk?.pool?.relays) {
      r = this.ndk.pool.urls();
    }
    if (!r.length) {
      r = DEFAULT_RELAYS;
    }
    return r;
  }
};

// src/events/index.ts
var NDKEvent = class _NDKEvent extends lib$1.EventEmitter {
  ndk;
  created_at;
  content = "";
  tags = [];
  kind;
  id = "";
  sig;
  pubkey = "";
  signatureVerified;
  _author = void 0;
  /**
   * The relay that this event was first received from.
   */
  relay;
  /**
   * The relays that this event was received from and/or successfully published to.
   */
  onRelays = [];
  constructor(ndk, event) {
    super();
    this.ndk = ndk;
    this.created_at = event?.created_at;
    this.content = event?.content || "";
    this.tags = event?.tags || [];
    this.id = event?.id || "";
    this.sig = event?.sig;
    this.pubkey = event?.pubkey || "";
    this.kind = event?.kind;
  }
  /**
   * Returns the event as is.
   */
  rawEvent() {
    return {
      created_at: this.created_at,
      content: this.content,
      tags: this.tags,
      kind: this.kind,
      pubkey: this.pubkey,
      id: this.id,
      sig: this.sig
    };
  }
  set author(user) {
    this.pubkey = user.hexpubkey;
    this._author = void 0;
  }
  /**
   * Returns an NDKUser for the author of the event.
   */
  get author() {
    if (this._author)
      return this._author;
    if (!this.ndk)
      throw new Error("No NDK instance found");
    const user = this.ndk.getUser({ hexpubkey: this.pubkey });
    this._author = user;
    return user;
  }
  tag(userOrTagOrEvent, marker, skipAuthorTag) {
    let tags = [];
    const isNDKUser = userOrTagOrEvent.fetchProfile !== void 0;
    if (isNDKUser) {
      const tag = ["p", userOrTagOrEvent.pubkey];
      if (marker)
        tag.push(...["", marker]);
      tags.push(tag);
    } else if (userOrTagOrEvent instanceof _NDKEvent) {
      const event = userOrTagOrEvent;
      skipAuthorTag ??= event?.pubkey === this.pubkey;
      tags = event.referenceTags(marker, skipAuthorTag);
      for (const pTag of event.getMatchingTags("p")) {
        if (pTag[1] === this.pubkey)
          continue;
        if (this.tags.find((t) => t[0] === "p" && t[1] === pTag[1]))
          continue;
        this.tags.push(["p", pTag[1]]);
      }
    } else if (Array.isArray(userOrTagOrEvent)) {
      tags = [userOrTagOrEvent];
    } else {
      throw new Error("Invalid argument", userOrTagOrEvent);
    }
    this.tags = mergeTags(this.tags, tags);
  }
  /**
   * Return a NostrEvent object, trying to fill in missing fields
   * when possible, adding tags when necessary.
   * @param pubkey {string} The pubkey of the user who the event belongs to.
   * @returns {Promise<NostrEvent>} A promise that resolves to a NostrEvent.
   */
  async toNostrEvent(pubkey) {
    if (!pubkey && this.pubkey === "") {
      const user = await this.ndk?.signer?.user();
      this.pubkey = user?.hexpubkey || "";
    }
    if (!this.created_at)
      this.created_at = Math.floor(Date.now() / 1e3);
    const nostrEvent = this.rawEvent();
    const { content, tags } = await this.generateTags();
    nostrEvent.content = content || "";
    nostrEvent.tags = tags;
    try {
      this.id = this.getEventHash();
    } catch (e) {
    }
    if (this.id)
      nostrEvent.id = this.id;
    if (this.sig)
      nostrEvent.sig = this.sig;
    return nostrEvent;
  }
  serialize = serialize.bind(this);
  getEventHash = getEventHash.bind(this);
  validate = validate.bind(this);
  verifySignature = verifySignature.bind(this);
  isReplaceable = isReplaceable.bind(this);
  isEphemeral = isEphemeral.bind(this);
  isParamReplaceable = isParamReplaceable.bind(this);
  /**
   * Encodes a bech32 id.
   *
   * @param relays {string[]} The relays to encode in the id
   * @returns {string} - Encoded naddr, note or nevent.
   */
  encode = encode.bind(this);
  encrypt = encrypt.bind(this);
  decrypt = decrypt.bind(this);
  /**
   * Get all tags with the given name
   * @param tagName {string} The name of the tag to search for
   * @returns {NDKTag[]} An array of the matching tags
   */
  getMatchingTags(tagName) {
    return this.tags.filter((tag) => tag[0] === tagName);
  }
  /**
   * Get the first tag with the given name
   * @param tagName Tag name to search for
   * @returns The value of the first tag with the given name, or undefined if no such tag exists
   */
  tagValue(tagName) {
    const tags = this.getMatchingTags(tagName);
    if (tags.length === 0)
      return void 0;
    return tags[0][1];
  }
  /**
   * Gets the NIP-31 "alt" tag of the event.
   */
  get alt() {
    return this.tagValue("alt");
  }
  /**
   * Sets the NIP-31 "alt" tag of the event. Use this to set an alt tag so
   * clients that don't handle a particular event kind can display something
   * useful for users.
   */
  set alt(alt) {
    this.removeTag("alt");
    if (alt)
      this.tags.push(["alt", alt]);
  }
  /**
   * Gets the NIP-33 "d" tag of the event.
   */
  get dTag() {
    return this.tagValue("d");
  }
  /**
   * Sets the NIP-33 "d" tag of the event.
   */
  set dTag(value) {
    this.removeTag("d");
    if (value)
      this.tags.push(["d", value]);
  }
  /**
   * Remove all tags with the given name (e.g. "d", "a", "p")
   * @param tagName Tag name to search for and remove
   * @returns {void}
   */
  removeTag(tagName) {
    this.tags = this.tags.filter((tag) => tag[0] !== tagName);
  }
  /**
   * Sign the event if a signer is present.
   *
   * It will generate tags.
   * Repleacable events will have their created_at field set to the current time.
   * @param signer {NDKSigner} The NDKSigner to use to sign the event
   * @returns {Promise<string>} A Promise that resolves to the signature of the signed event.
   */
  async sign(signer) {
    if (!signer) {
      this.ndk?.assertSigner();
      signer = this.ndk.signer;
    } else {
      this.author = await signer.user();
    }
    await this.generateTags();
    if (this.isReplaceable()) {
      this.created_at = Math.floor(Date.now() / 1e3);
    }
    const nostrEvent = await this.toNostrEvent();
    this.sig = await signer.sign(nostrEvent);
    return this.sig;
  }
  /**
   * Attempt to sign and then publish an NDKEvent to a given relaySet.
   * If no relaySet is provided, the relaySet will be calculated by NDK.
   * @param relaySet {NDKRelaySet} The relaySet to publish the even to.
   * @returns A promise that resolves to the relays the event was published to.
   */
  async publish(relaySet, timeoutMs) {
    if (!this.sig)
      await this.sign();
    if (!this.ndk)
      throw new Error("NDKEvent must be associated with an NDK instance to publish");
    if (!relaySet) {
      relaySet = this.ndk.devWriteRelaySet || calculateRelaySetFromEvent(this.ndk);
    }
    this.ndk.debug(`publish to ${relaySet.size} relays`, this.rawEvent());
    if (this.kind === 5 /* EventDeletion */ && this.ndk.cacheAdapter?.deleteEvent) {
      this.ndk.cacheAdapter.deleteEvent(this);
    }
    const relays = await relaySet.publish(this, timeoutMs);
    this.onRelays = Array.from(relays);
    return relays;
  }
  /**
   * Generates tags for users, notes, and other events tagged in content.
   * Will also generate random "d" tag for parameterized replaceable events where needed.
   * @returns {ContentTag} The tags and content of the event.
   */
  async generateTags() {
    let tags = [];
    const g = await generateContentTags(this.content, this.tags);
    const content = g.content;
    tags = g.tags;
    if (this.kind && this.isParamReplaceable()) {
      const dTag = this.getMatchingTags("d")[0];
      if (!dTag) {
        const title = this.tagValue("title");
        const randLength = title ? 6 : 16;
        let str = [...Array(randLength)].map(() => Math.random().toString(36)[2]).join("");
        if (title && title.length > 0) {
          str = title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") + "-" + str;
        }
        tags.push(["d", str]);
      }
    }
    if ((this.ndk?.clientName || this.ndk?.clientNip89) && !this.tagValue("client")) {
      const clientTag = ["client", this.ndk.clientName ?? ""];
      if (this.ndk.clientNip89)
        clientTag.push(this.ndk.clientNip89);
      tags.push(clientTag);
    }
    return { content: content || "", tags };
  }
  muted() {
    const authorMutedEntry = this.ndk?.mutedIds.get(this.pubkey);
    if (authorMutedEntry && authorMutedEntry === "p")
      return "author";
    const eventTagReference = this.tagReference();
    const eventMutedEntry = this.ndk?.mutedIds.get(eventTagReference[1]);
    if (eventMutedEntry && eventMutedEntry === eventTagReference[0])
      return "event";
    return null;
  }
  /**
   * Returns the "d" tag of a parameterized replaceable event or throws an error if the event isn't
   * a parameterized replaceable event.
   * @returns {string} the "d" tag of the event.
   */
  replaceableDTag() {
    if (this.kind && this.kind >= 3e4 && this.kind <= 4e4) {
      const dTag = this.getMatchingTags("d")[0];
      const dTagId = dTag ? dTag[1] : "";
      return dTagId;
    }
    throw new Error("Event is not a parameterized replaceable event");
  }
  /**
   * Provides a deduplication key for the event.
   *
   * For kinds 0, 3, 10k-20k this will be the event <kind>:<pubkey>
   * For kinds 30k-40k this will be the event <kind>:<pubkey>:<d-tag>
   * For all other kinds this will be the event id
   */
  deduplicationKey() {
    if (this.kind === 0 || this.kind === 3 || this.kind && this.kind >= 1e4 && this.kind < 2e4) {
      return `${this.kind}:${this.pubkey}`;
    } else {
      return this.tagId();
    }
  }
  /**
   * Returns the id of the event or, if it's a parameterized event, the generated id of the event using "d" tag, pubkey, and kind.
   * @returns {string} The id
   */
  tagId() {
    if (this.isParamReplaceable()) {
      return this.tagAddress();
    }
    return this.id;
  }
  /**
   * Returns the "reference" value ("<kind>:<author-pubkey>:<d-tag>") for this replaceable event.
   * @returns {string} The id
   */
  tagAddress() {
    if (!this.isParamReplaceable()) {
      throw new Error("This must only be called on replaceable events");
    }
    const dTagId = this.replaceableDTag();
    return `${this.kind}:${this.pubkey}:${dTagId}`;
  }
  /**
   * Get the tag that can be used to reference this event from another event.
   *
   * Consider using referenceTags() instead (unless you have a good reason to use this)
   *
   * @example
   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *     event.tagReference(); // ["a", "30000:pubkey:d-code"]
   *
   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *     event.tagReference(); // ["e", "eventid"]
   * @returns {NDKTag} The NDKTag object referencing this event
   */
  tagReference(marker) {
    let tag;
    if (this.isParamReplaceable()) {
      tag = ["a", this.tagAddress()];
    } else {
      tag = ["e", this.tagId()];
    }
    if (this.relay) {
      tag.push(this.relay.url);
    } else {
      tag.push("");
    }
    if (marker) {
      tag.push(marker);
    }
    return tag;
  }
  /**
   * Get the tags that can be used to reference this event from another event
   * @param marker The marker to use in the tag
   * @example
   *     event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *     event.referenceTags(); // [["a", "30000:pubkey:d-code"], ["e", "parent-id"]]
   *
   *     event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *     event.referenceTags(); // [["e", "parent-id"]]
   * @returns {NDKTag} The NDKTag object referencing this event
   */
  referenceTags(marker, skipAuthorTag) {
    let tags = [];
    if (this.isParamReplaceable()) {
      tags = [
        ["a", this.tagAddress()],
        ["e", this.id]
      ];
    } else {
      tags = [["e", this.id]];
    }
    if (this.relay?.url) {
      tags = tags.map((tag) => {
        tag.push(this.relay?.url);
        return tag;
      });
    } else if (marker) {
      tags = tags.map((tag) => {
        tag.push("");
        return tag;
      });
    }
    if (marker) {
      tags.forEach((tag) => tag.push(marker));
    }
    if (!skipAuthorTag)
      tags.push(...this.author.referenceTags());
    return tags;
  }
  /**
   * Provides the filter that will return matching events for this event.
   *
   * @example
   *    event = new NDKEvent(ndk, { kind: 30000, pubkey: 'pubkey', tags: [ ["d", "d-code"] ] });
   *    event.filter(); // { "#a": ["30000:pubkey:d-code"] }
   * @example
   *    event = new NDKEvent(ndk, { kind: 1, pubkey: 'pubkey', id: "eventid" });
   *    event.filter(); // { "#e": ["eventid"] }
   *
   * @returns The filter that will return matching events for this event
   */
  filter() {
    if (this.isParamReplaceable()) {
      return { "#a": [this.tagId()] };
    } else {
      return { "#e": [this.tagId()] };
    }
  }
  /**
   * Create a zap request for an existing event
   *
   * @param amount The amount to zap in millisatoshis
   * @param comment A comment to add to the zap request
   * @param extraTags Extra tags to add to the zap request
   * @param recipient The zap recipient (optional for events)
   * @param signer The signer to use (will default to the NDK instance's signer)
   */
  async zap(amount, comment, extraTags, recipient, signer) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    if (!signer) {
      this.ndk.assertSigner();
    }
    const zap = new NDKZap({
      ndk: this.ndk,
      zappedEvent: this,
      zappedUser: recipient
    });
    const relays = Array.from(this.ndk.pool.relays.keys());
    const paymentRequest = await zap.createZapRequest(
      amount,
      comment,
      extraTags,
      relays,
      signer
    );
    return paymentRequest;
  }
  /**
   * Generates a deletion event of the current event
   *
   * @param reason The reason for the deletion
   * @param publish Whether to publish the deletion event automatically
   * @returns The deletion event
   */
  async delete(reason, publish = true) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    const e = new _NDKEvent(this.ndk, {
      kind: 5 /* EventDeletion */,
      content: reason || ""
    });
    e.tag(this);
    if (publish)
      await e.publish();
    return e;
  }
  /**
   * NIP-18 reposting event.
   *
   * @param publish Whether to publish the reposted event automatically
   * @param signer The signer to use for signing the reposted event
   * @returns The reposted event
   *
   * @function
   */
  repost = repost.bind(this);
  /**
   * React to an existing event
   *
   * @param content The content of the reaction
   */
  async react(content, publish = true) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    const e = new _NDKEvent(this.ndk, {
      kind: 7 /* Reaction */,
      content
    });
    e.tag(this);
    if (publish) {
      await e.publish();
    } else {
      await e.sign();
    }
    return e;
  }
  /**
   * Checks whether the event is valid per underlying NIPs.
   *
   * This method is meant to be overridden by subclasses that implement specific NIPs
   * to allow the enforcement of NIP-specific validation rules.
   *
   * Otherwise, it will only check for basic event properties.
   *
   */
  get isValid() {
    return this.validate();
  }
};
var defaultOpts = {
  closeOnEose: false,
  cacheUsage: "CACHE_FIRST" /* CACHE_FIRST */,
  groupable: true,
  groupableDelay: 100,
  groupableDelayType: "at-most"
};
var NDKSubscription = class extends lib$1.EventEmitter {
  subId;
  filters;
  opts;
  pool;
  skipVerification = false;
  skipValidation = false;
  /**
   * Tracks the filters as they are executed on each relay
   */
  relayFilters;
  relaySet;
  ndk;
  debug;
  eoseDebug;
  /**
   * Events that have been seen by the subscription, with the time they were first seen.
   */
  eventFirstSeen = /* @__PURE__ */ new Map();
  /**
   * Relays that have sent an EOSE.
   */
  eosesSeen = /* @__PURE__ */ new Set();
  /**
   * Events that have been seen by the subscription per relay.
   */
  eventsPerRelay = /* @__PURE__ */ new Map();
  /**
   * The time the last event was received by the subscription.
   * This is used to calculate when EOSE should be emitted.
   */
  lastEventReceivedAt;
  internalId;
  constructor(ndk, filters, opts, relaySet, subId) {
    super();
    this.ndk = ndk;
    this.pool = opts?.pool || ndk.pool;
    this.opts = { ...defaultOpts, ...opts || {} };
    this.filters = filters instanceof Array ? filters : [filters];
    this.subId = subId || opts?.subId;
    this.internalId = Math.random().toString(36).substring(7);
    this.relaySet = relaySet;
    this.debug = ndk.debug.extend(`subscription[${opts?.subId ?? this.internalId}]`);
    this.eoseDebug = this.debug.extend("eose");
    this.skipVerification = opts?.skipVerification || false;
    this.skipValidation = opts?.skipValidation || false;
    if (!this.opts.closeOnEose) {
      this.debug(
        `Creating a permanent subscription`,
        this.opts,
        JSON.stringify(this.filters)
      );
    }
    if (this.opts.cacheUsage === "ONLY_CACHE" /* ONLY_CACHE */ && !this.opts.closeOnEose) {
      throw new Error("Cannot use cache-only options with a persistent subscription");
    }
  }
  /**
   * Provides access to the first filter of the subscription for
   * backwards compatibility.
   */
  get filter() {
    return this.filters[0];
  }
  isGroupable() {
    return this.opts?.groupable || false;
  }
  shouldQueryCache() {
    return this.opts?.cacheUsage !== "ONLY_RELAY" /* ONLY_RELAY */;
  }
  shouldQueryRelays() {
    return this.opts?.cacheUsage !== "ONLY_CACHE" /* ONLY_CACHE */;
  }
  shouldWaitForCache() {
    return (
      // Must want to close on EOSE; subscriptions
      // that want to receive further updates must
      // always hit the relay
      this.opts.closeOnEose && // Cache adapter must claim to be fast
      !!this.ndk.cacheAdapter?.locking && // If explicitly told to run in parallel, then
      // we should not wait for the cache
      this.opts.cacheUsage !== "PARALLEL" /* PARALLEL */
    );
  }
  /**
   * Start the subscription. This is the main method that should be called
   * after creating a subscription.
   */
  async start() {
    let cachePromise;
    if (this.shouldQueryCache()) {
      cachePromise = this.startWithCache();
      if (this.shouldWaitForCache()) {
        await cachePromise;
        if (queryFullyFilled(this)) {
          this.emit("eose", this);
          return;
        }
      }
    }
    if (this.shouldQueryRelays()) {
      this.startWithRelays();
    } else {
      this.emit("eose", this);
    }
    return;
  }
  stop() {
    this.emit("close", this);
    this.removeAllListeners();
  }
  /**
   * @returns Whether the subscription has an authors filter.
   */
  hasAuthorsFilter() {
    return this.filters.some((f) => f.authors?.length);
  }
  async startWithCache() {
    if (this.ndk.cacheAdapter?.query) {
      const promise = this.ndk.cacheAdapter.query(this);
      if (this.ndk.cacheAdapter.locking) {
        await promise;
      }
    }
  }
  /**
   * Send REQ to relays
   */
  startWithRelays() {
    if (!this.relaySet) {
      this.relayFilters = calculateRelaySetsFromFilters(this.ndk, this.filters, this.pool);
    } else {
      this.relayFilters = /* @__PURE__ */ new Map();
      for (const relay of this.relaySet.relays) {
        this.relayFilters.set(relay.url, this.filters);
      }
    }
    if (!this.relayFilters || this.relayFilters.size === 0) {
      this.debug(`No relays to subscribe to`, this.pool.relays.size);
      return;
    }
    for (const [relayUrl, filters] of this.relayFilters) {
      const relay = this.pool.getRelay(relayUrl);
      relay.subscribe(this, filters);
    }
  }
  // EVENT handling
  /**
   * Called when an event is received from a relay or the cache
   * @param event
   * @param relay
   * @param fromCache Whether the event was received from the cache
   */
  eventReceived(event, relay, fromCache = false) {
    if (relay) {
      event.relay ??= relay;
      event.onRelays.push(relay);
    }
    if (!relay)
      relay = event.relay;
    if (!this.skipValidation) {
      if (!event.isValid) {
        this.debug(`Event failed validation`, event);
        return;
      }
    }
    if (!this.skipVerification) {
      if (!event.verifySignature(true)) {
        this.debug(`Event failed signature validation`, event);
        return;
      }
    }
    if (!fromCache && relay) {
      let events = this.eventsPerRelay.get(relay);
      if (!events) {
        events = /* @__PURE__ */ new Set();
        this.eventsPerRelay.set(relay, events);
      }
      events.add(event.id);
      const eventAlreadySeen = this.eventFirstSeen.has(event.id);
      if (eventAlreadySeen) {
        const timeSinceFirstSeen = Date.now() - (this.eventFirstSeen.get(event.id) || 0);
        relay.scoreSlowerEvent(timeSinceFirstSeen);
        this.emit("event:dup", event, relay, timeSinceFirstSeen, this);
        return;
      }
      if (this.ndk.cacheAdapter) {
        this.ndk.cacheAdapter.setEvent(event, this.filters, relay);
      }
      this.eventFirstSeen.set(event.id, Date.now());
    } else {
      this.eventFirstSeen.set(event.id, 0);
    }
    if (!event.ndk)
      event.ndk = this.ndk;
    this.emit("event", event, relay, this);
    this.lastEventReceivedAt = Date.now();
  }
  // EOSE handling
  eoseTimeout;
  eoseReceived(relay) {
    this.eosesSeen.add(relay);
    let lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
    const hasSeenAllEoses = this.eosesSeen.size === this.relayFilters?.size;
    const queryFilled = queryFullyFilled(this);
    if (queryFilled) {
      this.emit("eose");
      this.eoseDebug(`Query fully filled`);
      if (this.opts?.closeOnEose) {
        this.stop();
      }
    } else if (hasSeenAllEoses) {
      this.emit("eose");
      this.eoseDebug(`All EOSEs seen`);
      if (this.opts?.closeOnEose) {
        this.stop();
      }
    } else {
      let timeToWaitForNextEose = 1e3;
      const percentageOfRelaysThatHaveSentEose = this.eosesSeen.size / this.relayFilters.size;
      if (this.eosesSeen.size >= 2 && percentageOfRelaysThatHaveSentEose >= 0.5) {
        timeToWaitForNextEose = timeToWaitForNextEose * (1 - percentageOfRelaysThatHaveSentEose);
        if (this.eoseTimeout) {
          clearTimeout(this.eoseTimeout);
        }
        const sendEoseTimeout = () => {
          lastEventSeen = this.lastEventReceivedAt ? Date.now() - this.lastEventReceivedAt : void 0;
          if (lastEventSeen !== void 0 && lastEventSeen < 20) {
            this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
          } else {
            this.emit("eose");
            if (this.opts?.closeOnEose)
              this.stop();
          }
        };
        this.eoseTimeout = setTimeout(sendEoseTimeout, timeToWaitForNextEose);
      }
    }
  }
};

// src/user/follows.ts
async function follows(opts, outbox, kind = 3 /* Contacts */) {
  if (!this.ndk)
    throw new Error("NDK not set");
  const contactListEvent = await this.ndk.fetchEvent(
    { kinds: [kind], authors: [this.pubkey] },
    opts || { groupable: false }
  );
  if (contactListEvent) {
    const pubkeys = /* @__PURE__ */ new Set();
    contactListEvent.tags.forEach((tag) => {
      if (tag[0] === "p")
        pubkeys.add(tag[1]);
    });
    if (outbox) {
      this.ndk?.outboxTracker?.trackUsers(Array.from(pubkeys));
    }
    return [...pubkeys].reduce((acc, pubkey) => {
      const user = new NDKUser({ pubkey });
      user.ndk = this.ndk;
      acc.add(user);
      return acc;
    }, /* @__PURE__ */ new Set());
  }
  return /* @__PURE__ */ new Set();
}

// src/user/profile.ts
function profileFromEvent(event) {
  const profile = {};
  let payload;
  try {
    payload = JSON.parse(event.content);
  } catch (error) {
    throw new Error(`Failed to parse profile event: ${error}`);
  }
  Object.keys(payload).forEach((key) => {
    switch (key) {
      case "name":
        profile.name = payload.name;
        break;
      case "display_name":
        profile.displayName = payload.display_name;
        break;
      case "image":
      case "picture":
        profile.image = payload.picture || payload.image;
        break;
      case "banner":
        profile.banner = payload.banner;
        break;
      case "bio":
        profile.bio = payload.bio;
        break;
      case "nip05":
        profile.nip05 = payload.nip05;
        break;
      case "lud06":
        profile.lud06 = payload.lud06;
        break;
      case "lud16":
        profile.lud16 = payload.lud16;
        break;
      case "about":
        profile.about = payload.about;
        break;
      case "zapService":
        profile.zapService = payload.zapService;
        break;
      case "website":
        profile.website = payload.website;
        break;
      default:
        profile[key] = payload[key];
        break;
    }
  });
  return profile;
}
function serializeProfile(profile) {
  const payload = {};
  for (const [key, val] of Object.entries(profile)) {
    switch (key) {
      case "username":
      case "name":
        payload.name = val;
        break;
      case "displayName":
        payload.display_name = val;
        break;
      case "image":
      case "picture":
        payload.picture = val;
        break;
      case "bio":
      case "about":
        payload.about = val;
        break;
      default:
        payload[key] = val;
        break;
    }
  }
  return JSON.stringify(payload);
}

// src/user/nip05.ts
var NIP05_REGEX = /^(?:([\w.+-]+)@)?([\w.-]+)$/;
async function getNip05For(ndk, fullname, _fetch = fetch, fetchOpts = {}) {
  return await ndk.queuesNip05.add({
    id: fullname,
    func: async () => {
      if (ndk.cacheAdapter && ndk.cacheAdapter.loadNip05) {
        const profile = await ndk.cacheAdapter.loadNip05(fullname);
        if (profile !== "missing") {
          if (profile) {
            const user = new NDKUser({
              pubkey: profile.pubkey,
              relayUrls: profile.relays,
              nip46Urls: profile.nip46
            });
            user.ndk = ndk;
            return user;
          } else {
            return null;
          }
        }
      }
      const match = fullname.match(NIP05_REGEX);
      if (!match)
        return null;
      const [_, name = "_", domain] = match;
      try {
        const res = await _fetch(
          `https://${domain}/.well-known/nostr.json?name=${name}`,
          fetchOpts
        );
        const { names, relays, nip46 } = parseNIP05Result(await res.json());
        const pubkey = names[name.toLowerCase()];
        let profile = null;
        if (pubkey) {
          profile = { pubkey, relays: relays?.[pubkey], nip46: nip46?.[pubkey] };
        }
        if (ndk?.cacheAdapter && ndk.cacheAdapter.saveNip05) {
          ndk.cacheAdapter.saveNip05(fullname, profile);
        }
        return profile;
      } catch (_e) {
        if (ndk?.cacheAdapter && ndk.cacheAdapter.saveNip05) {
          ndk?.cacheAdapter.saveNip05(fullname, null);
        }
        console.error("Failed to fetch NIP05 for", fullname, _e);
        return null;
      }
    }
  });
}
function parseNIP05Result(json) {
  const result = {
    names: {}
  };
  for (const [name, pubkey] of Object.entries(json.names)) {
    if (typeof name === "string" && typeof pubkey === "string") {
      result.names[name.toLowerCase()] = pubkey;
    }
  }
  if (json.relays) {
    result.relays = {};
    for (const [pubkey, relays] of Object.entries(json.relays)) {
      if (typeof pubkey === "string" && Array.isArray(relays)) {
        result.relays[pubkey] = relays.filter(
          (relay) => typeof relay === "string"
        );
      }
    }
  }
  if (json.nip46) {
    result.nip46 = {};
    for (const [pubkey, nip46] of Object.entries(json.nip46)) {
      if (typeof pubkey === "string" && Array.isArray(nip46)) {
        result.nip46[pubkey] = nip46.filter((relay) => typeof relay === "string");
      }
    }
  }
  return result;
}

// src/user/index.ts
var NDKUser = class _NDKUser {
  ndk;
  profile;
  _npub;
  _pubkey;
  relayUrls = [];
  nip46Urls = [];
  constructor(opts) {
    if (opts.npub)
      this._npub = opts.npub;
    if (opts.hexpubkey)
      this._pubkey = opts.hexpubkey;
    if (opts.pubkey)
      this._pubkey = opts.pubkey;
    if (opts.relayUrls)
      this.relayUrls = opts.relayUrls;
    if (opts.nip46Urls)
      this.nip46Urls = opts.nip46Urls;
  }
  get npub() {
    if (!this._npub) {
      if (!this._pubkey)
        throw new Error("hexpubkey not set");
      this._npub = nip19_exports.npubEncode(this.pubkey);
    }
    return this._npub;
  }
  set npub(npub) {
    this._npub = npub;
  }
  /**
   * Get the user's hexpubkey
   * @returns {Hexpubkey} The user's hexpubkey
   *
   * @deprecated Use `pubkey` instead
   */
  get hexpubkey() {
    return this.pubkey;
  }
  /**
   * Set the user's hexpubkey
   * @param pubkey {Hexpubkey} The user's hexpubkey
   * @deprecated Use `pubkey` instead
   */
  set hexpubkey(pubkey) {
    this._pubkey = pubkey;
  }
  /**
   * Get the user's pubkey
   * @returns {string} The user's pubkey
   */
  get pubkey() {
    if (!this._pubkey) {
      if (!this._npub)
        throw new Error("npub not set");
      this._pubkey = nip19_exports.decode(this.npub).data;
    }
    return this._pubkey;
  }
  /**
   * Set the user's pubkey
   * @param pubkey {string} The user's pubkey
   */
  set pubkey(pubkey) {
    this._pubkey = pubkey;
  }
  /**
   * Retrieves the zapper this pubkey has designated as an issuer of zap receipts
   */
  async getZapConfiguration(ndk) {
    ndk ??= this.ndk;
    if (!ndk)
      throw new Error("No NDK instance found");
    const process = async () => {
      if (this.ndk?.cacheAdapter?.loadUsersLNURLDoc) {
        const doc = await this.ndk.cacheAdapter.loadUsersLNURLDoc(this.pubkey);
        if (doc !== "missing") {
          if (doc === null)
            return;
          if (doc)
            return doc;
        }
      }
      const zap = new NDKZap({ ndk, zappedUser: this });
      const lnurlspec = await zap.getZapSpecWithoutCache();
      if (this.ndk?.cacheAdapter?.saveUsersLNURLDoc) {
        this.ndk.cacheAdapter.saveUsersLNURLDoc(this.pubkey, lnurlspec || null);
      }
      if (!lnurlspec)
        return;
      return lnurlspec;
    };
    return await ndk.queuesZapConfig.add({
      id: this.pubkey,
      func: process
    });
  }
  /**
   * Fetches the zapper's pubkey for the zapped user
   * @returns The zapper's pubkey if one can be found
   */
  async getZapperPubkey() {
    const zapConfig = await this.getZapConfiguration();
    return zapConfig?.nostrPubkey;
  }
  /**
   * Instantiate an NDKUser from a NIP-05 string
   * @param nip05Id {string} The user's NIP-05
   * @param ndk {NDK} An NDK instance
   * @param skipCache {boolean} Whether to skip the cache or not
   * @returns {NDKUser | undefined} An NDKUser if one is found for the given NIP-05, undefined otherwise.
   */
  static async fromNip05(nip05Id, ndk, skipCache = false) {
    if (!ndk)
      throw new Error("No NDK instance found");
    let opts = {};
    if (skipCache)
      opts.cache = "no-cache";
    const profile = await getNip05For(ndk, nip05Id, ndk?.httpFetch, opts);
    if (profile) {
      const user = new _NDKUser({
        pubkey: profile.pubkey,
        relayUrls: profile.relays,
        nip46Urls: profile.nip46
      });
      user.ndk = ndk;
      return user;
    }
  }
  /**
   * Fetch a user's profile
   * @param opts {NDKSubscriptionOptions} A set of NDKSubscriptionOptions
   * @returns User Profile
   */
  async fetchProfile(opts) {
    if (!this.ndk)
      throw new Error("NDK not set");
    if (!this.profile)
      this.profile = {};
    let setMetadataEvents = null;
    if (this.ndk.cacheAdapter && this.ndk.cacheAdapter.fetchProfile && opts?.cacheUsage !== "ONLY_RELAY" /* ONLY_RELAY */) {
      const profile = await this.ndk.cacheAdapter.fetchProfile(this.pubkey);
      if (profile) {
        this.profile = profile;
        return profile;
      }
    }
    if (!opts && // if no options have been set
    this.ndk.cacheAdapter && // and we have a cache
    this.ndk.cacheAdapter.locking) {
      setMetadataEvents = await this.ndk.fetchEvents(
        {
          kinds: [0],
          authors: [this.pubkey]
        },
        {
          cacheUsage: "ONLY_CACHE" /* ONLY_CACHE */,
          closeOnEose: true,
          groupable: false
        }
      );
      opts = {
        cacheUsage: "ONLY_RELAY" /* ONLY_RELAY */,
        closeOnEose: true,
        groupable: true,
        groupableDelay: 250
      };
    }
    if (!setMetadataEvents || setMetadataEvents.size === 0) {
      setMetadataEvents = await this.ndk.fetchEvents(
        {
          kinds: [0],
          authors: [this.pubkey]
        },
        opts
      );
    }
    const sortedSetMetadataEvents = Array.from(setMetadataEvents).sort(
      (a, b) => a.created_at - b.created_at
    );
    if (sortedSetMetadataEvents.length === 0)
      return null;
    this.profile = profileFromEvent(sortedSetMetadataEvents[0]);
    if (this.profile && this.ndk.cacheAdapter && this.ndk.cacheAdapter.saveProfile) {
      this.ndk.cacheAdapter.saveProfile(this.pubkey, this.profile);
    }
    return this.profile;
  }
  /**
   * Returns a set of users that this user follows.
   */
  follows = follows.bind(this);
  /** @deprecated Use referenceTags instead. */
  /**
   * Get the tag that can be used to reference this user in an event
   * @returns {NDKTag} an NDKTag
   */
  tagReference() {
    return ["p", this.pubkey];
  }
  /**
   * Get the tags that can be used to reference this user in an event
   * @returns {NDKTag[]} an array of NDKTag
   */
  referenceTags(marker) {
    const tag = [["p", this.pubkey]];
    if (!marker)
      return tag;
    tag[0].push("", marker);
    return tag;
  }
  /**
   * Publishes the current profile.
   */
  async publish() {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    if (!this.profile)
      throw new Error("No profile available");
    this.ndk.assertSigner();
    const event = new NDKEvent(this.ndk, {
      kind: 0,
      content: serializeProfile(this.profile)
    });
    await event.publish();
  }
  /**
   * Add a follow to this user's contact list
   *
   * @param newFollow {NDKUser} The user to follow
   * @param currentFollowList {Set<NDKUser>} The current follow list
   * @param kind {NDKKind} The kind to use for this contact list (defaults to `3`)
   * @returns {Promise<boolean>} True if the follow was added, false if the follow already exists
   */
  async follow(newFollow, currentFollowList, kind = 3 /* Contacts */) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    if (!currentFollowList) {
      currentFollowList = await this.follows(void 0, void 0, kind);
    }
    if (currentFollowList.has(newFollow)) {
      return false;
    }
    currentFollowList.add(newFollow);
    const event = new NDKEvent(this.ndk, { kind });
    for (const follow of currentFollowList) {
      event.tag(follow);
    }
    await event.publish();
    return true;
  }
  /**
   * Remove a follow from this user's contact list
   *
   * @param user {NDKUser} The user to unfollow
   * @param currentFollowList {Set<NDKUser>} The current follow list
   * @param kind {NDKKind} The kind to use for this contact list (defaults to `3`)
   * @returns {Promise<boolean>} True if the follow was removed, false if the follow did not exist
   */
  async unfollow(user, currentFollowList, kind = 3 /* Contacts */) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    this.ndk.assertSigner();
    if (!currentFollowList) {
      currentFollowList = await this.follows(void 0, void 0, kind);
    }
    if (!currentFollowList.has(user)) {
      return false;
    }
    currentFollowList.delete(user);
    const event = new NDKEvent(this.ndk, { kind });
    for (const follow of currentFollowList) {
      event.tag(follow);
    }
    await event.publish();
    return true;
  }
  /**
   * Validate a user's NIP-05 identifier (usually fetched from their kind:0 profile data)
   *
   * @param nip05Id The NIP-05 string to validate
   * @returns {Promise<boolean | null>} True if the NIP-05 is found and matches this user's pubkey,
   * False if the NIP-05 is found but doesn't match this user's pubkey,
   * null if the NIP-05 isn't found on the domain or we're unable to verify (because of network issues, etc.)
   */
  async validateNip05(nip05Id) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    const profilePointer = await getNip05For(this.ndk, nip05Id);
    if (profilePointer === null)
      return null;
    return profilePointer.pubkey === this.pubkey;
  }
  /**
   * Zap a user
   *
   * @param amount The amount to zap in millisatoshis
   * @param comment A comment to add to the zap request
   * @param extraTags Extra tags to add to the zap request
   * @param signer The signer to use (will default to the NDK instance's signer)
   */
  async zap(amount, comment, extraTags, signer) {
    if (!this.ndk)
      throw new Error("No NDK instance found");
    if (!signer) {
      this.ndk.assertSigner();
    }
    const zap = new NDKZap({
      ndk: this.ndk,
      zappedUser: this
    });
    const relays = Array.from(this.ndk.pool.relays.keys());
    const paymentRequest = await zap.createZapRequest(
      amount,
      comment,
      extraTags,
      relays,
      signer
    );
    return paymentRequest;
  }
};

// src/events/kinds/lists/index.ts
var NDKList = class _NDKList extends NDKEvent {
  _encryptedTags;
  /**
   * Stores the number of bytes the content was before decryption
   * to expire the cache when the content changes.
   */
  encryptedTagsLength;
  constructor(ndk, rawEvent) {
    super(ndk, rawEvent);
    this.kind ??= 30001 /* CategorizedBookmarkList */;
  }
  /**
   * Wrap a NDKEvent into a NDKList
   */
  static from(ndkEvent) {
    return new _NDKList(ndkEvent.ndk, ndkEvent.rawEvent());
  }
  /**
   * Returns the title of the list. Falls back on fetching the name tag value.
   */
  get title() {
    const titleTag = this.tagValue("title") || this.tagValue("name");
    if (this.kind === 3 /* Contacts */ && !titleTag) {
      return "Contacts";
    } else if (this.kind === 1e4 /* MuteList */ && !titleTag) {
      return "Mute";
    } else if (this.kind === 10001 /* PinList */ && !titleTag) {
      return "Pinned Notes";
    } else if (this.kind === 10002 /* RelayList */ && !titleTag) {
      return "Relay Metadata";
    } else if (this.kind === 10003 /* BookmarkList */ && !titleTag) {
      return "Bookmarks";
    } else if (this.kind === 10004 /* CommunityList */ && !titleTag) {
      return "Communities";
    } else if (this.kind === 10005 /* PublicChatList */ && !titleTag) {
      return "Public Chats";
    } else if (this.kind === 10006 /* BlockRelayList */ && !titleTag) {
      return "Blocked Relays";
    } else if (this.kind === 10007 /* SearchRelayList */ && !titleTag) {
      return "Search Relays";
    } else if (this.kind === 10015 /* InterestList */ && !titleTag) {
      return "Interests";
    } else if (this.kind === 10030 /* EmojiList */ && !titleTag) {
      return "Emojis";
    } else {
      return titleTag ?? this.tagValue("d");
    }
  }
  /**
   * Sets the title of the list.
   */
  set title(title) {
    this.removeTag("title");
    this.removeTag("name");
    if (title) {
      this.tags.push(["title", title]);
    } else {
      throw new Error("Title cannot be empty");
    }
  }
  /**
   * Returns the name of the list.
   * @deprecated Please use "title" instead.
   */
  get name() {
    const nameTag = this.tagValue("name");
    if (this.kind === 3 /* Contacts */ && !nameTag) {
      return "Contacts";
    } else if (this.kind === 1e4 /* MuteList */ && !nameTag) {
      return "Mute";
    } else if (this.kind === 10001 /* PinList */ && !nameTag) {
      return "Pinned Notes";
    } else if (this.kind === 10002 /* RelayList */ && !nameTag) {
      return "Relay Metadata";
    } else if (this.kind === 10003 /* BookmarkList */ && !nameTag) {
      return "Bookmarks";
    } else if (this.kind === 10004 /* CommunityList */ && !nameTag) {
      return "Communities";
    } else if (this.kind === 10005 /* PublicChatList */ && !nameTag) {
      return "Public Chats";
    } else if (this.kind === 10006 /* BlockRelayList */ && !nameTag) {
      return "Blocked Relays";
    } else if (this.kind === 10007 /* SearchRelayList */ && !nameTag) {
      return "Search Relays";
    } else if (this.kind === 10015 /* InterestList */ && !nameTag) {
      return "Interests";
    } else if (this.kind === 10030 /* EmojiList */ && !nameTag) {
      return "Emojis";
    } else {
      return nameTag ?? this.tagValue("d");
    }
  }
  /**
   * Sets the name of the list.
   * @deprecated Please use "title" instead. This method will use the `title` tag instead.
   */
  set name(name) {
    this.removeTag("name");
    if (name) {
      this.tags.push(["title", name]);
    } else {
      throw new Error("Name cannot be empty");
    }
  }
  /**
   * Returns the description of the list.
   */
  get description() {
    return this.tagValue("description");
  }
  /**
   * Sets the description of the list.
   */
  set description(name) {
    if (name) {
      this.tags.push(["description", name]);
    } else {
      this.removeTag("description");
    }
  }
  isEncryptedTagsCacheValid() {
    return !!(this._encryptedTags && this.encryptedTagsLength === this.content.length);
  }
  /**
   * Returns the decrypted content of the list.
   */
  async encryptedTags(useCache = true) {
    if (useCache && this.isEncryptedTagsCacheValid())
      return this._encryptedTags;
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (!this.ndk.signer)
      throw new Error("NDK signer not set");
    const user = await this.ndk.signer.user();
    try {
      if (this.content.length > 0) {
        try {
          const decryptedContent = await this.ndk.signer.decrypt(user, this.content);
          const a = JSON.parse(decryptedContent);
          if (a && a[0]) {
            this.encryptedTagsLength = this.content.length;
            return this._encryptedTags = a;
          }
          this.encryptedTagsLength = this.content.length;
          return this._encryptedTags = [];
        } catch (e) {
          console.log(`error decrypting ${this.content}`);
        }
      }
    } catch (e) {
    }
    return [];
  }
  /**
   * This method can be overriden to validate that a tag is valid for this list.
   *
   * (i.e. the NDKPersonList can validate that items are NDKUser instances)
   */
  validateTag(tagValue) {
    return true;
  }
  /**
   * Returns the unecrypted items in this list.
   */
  get items() {
    return this.tags.filter((t) => {
      return ![
        "d",
        "L",
        "l",
        "title",
        "name",
        "description",
        "summary",
        "image",
        "thumb",
        "alt",
        "expiration",
        "subject",
        "client"
      ].includes(t[0]);
    });
  }
  /**
   * Adds a new item to the list.
   * @param relay Relay to add
   * @param mark Optional mark to add to the item
   * @param encrypted Whether to encrypt the item
   */
  async addItem(item, mark = void 0, encrypted = false) {
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (!this.ndk.signer)
      throw new Error("NDK signer not set");
    let tags;
    if (item instanceof NDKEvent) {
      tags = item.referenceTags();
    } else if (item instanceof NDKUser) {
      tags = item.referenceTags();
    } else if (item instanceof NDKRelay) {
      tags = item.referenceTags();
    } else if (Array.isArray(item)) {
      tags = [item];
    } else {
      throw new Error("Invalid object type");
    }
    if (mark)
      tags[0].push(mark);
    if (encrypted) {
      const user = await this.ndk.signer.user();
      const currentList = await this.encryptedTags();
      currentList.push(...tags);
      this._encryptedTags = currentList;
      this.encryptedTagsLength = this.content.length;
      this.content = JSON.stringify(currentList);
      await this.encrypt(user);
    } else {
      this.tags.push(...tags);
    }
    this.created_at = Math.floor(Date.now() / 1e3);
    this.emit("change");
  }
  /**
   * Removes an item from the list.
   *
   * @param index The index of the item to remove.
   * @param encrypted Whether to remove from the encrypted list or not.
   */
  async removeItem(index, encrypted) {
    if (!this.ndk)
      throw new Error("NDK instance not set");
    if (!this.ndk.signer)
      throw new Error("NDK signer not set");
    if (encrypted) {
      const user = await this.ndk.signer.user();
      const currentList = await this.encryptedTags();
      currentList.splice(index, 1);
      this._encryptedTags = currentList;
      this.encryptedTagsLength = this.content.length;
      this.content = JSON.stringify(currentList);
      await this.encrypt(user);
    } else {
      this.tags.splice(index, 1);
    }
    this.created_at = Math.floor(Date.now() / 1e3);
    this.emit("change");
    return this;
  }
  /**
   * Creates a filter that will result in fetching
   * the items of this list
   * @example
   * const list = new NDKList(...);
   * const filters = list.filterForItems();
   * const events = await ndk.fetchEvents(filters);
   */
  filterForItems() {
    const ids = /* @__PURE__ */ new Set();
    const nip33Queries = /* @__PURE__ */ new Map();
    const filters = [];
    for (const tag of this.items) {
      if (tag[0] === "e" && tag[1]) {
        ids.add(tag[1]);
      } else if (tag[0] === "a" && tag[1]) {
        const [kind, pubkey, dTag] = tag[1].split(":");
        if (!kind || !pubkey)
          continue;
        const key = `${kind}:${pubkey}`;
        const item = nip33Queries.get(key) || [];
        item.push(dTag || "");
        nip33Queries.set(key, item);
      }
    }
    if (ids.size > 0) {
      filters.push({ ids: Array.from(ids) });
    }
    if (nip33Queries.size > 0) {
      for (const [key, values] of nip33Queries.entries()) {
        const [kind, pubkey] = key.split(":");
        filters.push({
          kinds: [parseInt(kind)],
          authors: [pubkey],
          "#d": values
        });
      }
    }
    return filters;
  }
};
var lists_default = NDKList;

// ../node_modules/.pnpm/normalize-url@8.0.1/node_modules/normalize-url/index.js
var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
var DATA_URL_DEFAULT_CHARSET = "us-ascii";
var testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
var supportedProtocols = /* @__PURE__ */ new Set([
  "https:",
  "http:",
  "file:"
]);
var hasCustomProtocol = (urlString) => {
  try {
    const { protocol } = new URL(urlString);
    return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
  } catch {
    return false;
  }
};
var normalizeDataURL = (urlString, { stripHash }) => {
  const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
  if (!match) {
    throw new Error(`Invalid URL: ${urlString}`);
  }
  let { type, data, hash } = match.groups;
  const mediaType = type.split(";");
  hash = stripHash ? "" : hash;
  let isBase64 = false;
  if (mediaType[mediaType.length - 1] === "base64") {
    mediaType.pop();
    isBase64 = true;
  }
  const mimeType = mediaType.shift()?.toLowerCase() ?? "";
  const attributes = mediaType.map((attribute) => {
    let [key, value = ""] = attribute.split("=").map((string) => string.trim());
    if (key === "charset") {
      value = value.toLowerCase();
      if (value === DATA_URL_DEFAULT_CHARSET) {
        return "";
      }
    }
    return `${key}${value ? `=${value}` : ""}`;
  }).filter(Boolean);
  const normalizedMediaType = [
    ...attributes
  ];
  if (isBase64) {
    normalizedMediaType.push("base64");
  }
  if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
    normalizedMediaType.unshift(mimeType);
  }
  return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
};
function normalizeUrl(urlString, options) {
  options = {
    defaultProtocol: "http",
    normalizeProtocol: true,
    forceHttp: false,
    forceHttps: false,
    stripAuthentication: true,
    stripHash: false,
    stripTextFragment: true,
    stripWWW: true,
    removeQueryParameters: [/^utm_\w+/i],
    removeTrailingSlash: true,
    removeSingleSlash: true,
    removeDirectoryIndex: false,
    removeExplicitPort: false,
    sortQueryParameters: true,
    ...options
  };
  if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) {
    options.defaultProtocol = `${options.defaultProtocol}:`;
  }
  urlString = urlString.trim();
  if (/^data:/i.test(urlString)) {
    return normalizeDataURL(urlString, options);
  }
  if (hasCustomProtocol(urlString)) {
    return urlString;
  }
  const hasRelativeProtocol = urlString.startsWith("//");
  const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
  if (!isRelativeUrl) {
    urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
  }
  const urlObject = new URL(urlString);
  if (options.forceHttp && options.forceHttps) {
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  }
  if (options.forceHttp && urlObject.protocol === "https:") {
    urlObject.protocol = "http:";
  }
  if (options.forceHttps && urlObject.protocol === "http:") {
    urlObject.protocol = "https:";
  }
  if (options.stripAuthentication) {
    urlObject.username = "";
    urlObject.password = "";
  }
  if (options.stripHash) {
    urlObject.hash = "";
  } else if (options.stripTextFragment) {
    urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
  }
  if (urlObject.pathname) {
    const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let lastIndex = 0;
    let result = "";
    for (; ; ) {
      const match = protocolRegex.exec(urlObject.pathname);
      if (!match) {
        break;
      }
      const protocol = match[0];
      const protocolAtIndex = match.index;
      const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
      result += intermediate.replace(/\/{2,}/g, "/");
      result += protocol;
      lastIndex = protocolAtIndex + protocol.length;
    }
    const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
    result += remnant.replace(/\/{2,}/g, "/");
    urlObject.pathname = result;
  }
  if (urlObject.pathname) {
    try {
      urlObject.pathname = decodeURI(urlObject.pathname);
    } catch {
    }
  }
  if (options.removeDirectoryIndex === true) {
    options.removeDirectoryIndex = [/^index\.[a-z]+$/];
  }
  if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
    let pathComponents = urlObject.pathname.split("/");
    const lastComponent = pathComponents[pathComponents.length - 1];
    if (testParameter(lastComponent, options.removeDirectoryIndex)) {
      pathComponents = pathComponents.slice(0, -1);
      urlObject.pathname = pathComponents.slice(1).join("/") + "/";
    }
  }
  if (urlObject.hostname) {
    urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
    if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
      urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
    }
  }
  if (Array.isArray(options.removeQueryParameters)) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (testParameter(key, options.removeQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
    urlObject.search = "";
  }
  if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (!testParameter(key, options.keepQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (options.sortQueryParameters) {
    urlObject.searchParams.sort();
    try {
      urlObject.search = decodeURIComponent(urlObject.search);
    } catch {
    }
  }
  if (options.removeTrailingSlash) {
    urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
  }
  if (options.removeExplicitPort && urlObject.port) {
    urlObject.port = "";
  }
  const oldUrlString = urlString;
  urlString = urlObject.toString();
  if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
    urlString = urlString.replace(/\/$/, "");
  }
  if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
    urlString = urlString.replace(/\/$/, "");
  }
  if (hasRelativeProtocol && !options.normalizeProtocol) {
    urlString = urlString.replace(/^http:\/\//, "//");
  }
  if (options.stripProtocol) {
    urlString = urlString.replace(/^(?:https?:)?\/\//, "");
  }
  return urlString;
}

// src/utils/normalize-url.ts
function normalizeRelayUrl(url) {
  let r = normalizeUrl(url, {
    stripAuthentication: false,
    stripWWW: false,
    stripHash: true
  });
  if (!r.endsWith("/")) {
    r += "/";
  }
  return r;
}
function normalize(urls) {
  const normalized = /* @__PURE__ */ new Set();
  for (const url of urls) {
    try {
      normalized.add(normalizeRelayUrl(url));
    } catch {
    }
  }
  return Array.from(normalized);
}

// src/events/kinds/NDKRelayList.ts
var READ_MARKER = "read";
var WRITE_MARKER = "write";
var NDKRelayList = class _NDKRelayList extends NDKEvent {
  constructor(ndk, rawEvent) {
    super(ndk, rawEvent);
    this.kind ??= 10002 /* RelayList */;
  }
  static from(ndkEvent) {
    return new _NDKRelayList(ndkEvent.ndk, ndkEvent.rawEvent());
  }
  static async forUser(pubkey, ndk) {
    const result = await this.forUsers([pubkey], ndk);
    return result.get(pubkey);
  }
  /**
   * Gathers a set of relay list events for a given set of users.
   * @returns A map of pubkeys to relay list.
   */
  static async forUsers(pubkeys, ndk) {
    const pool = ndk.outboxPool || ndk.pool;
    const set = /* @__PURE__ */ new Set();
    for (const relay of pool.relays.values())
      set.add(relay);
    const relayLists = /* @__PURE__ */ new Map();
    const fromContactList = /* @__PURE__ */ new Map();
    const relaySet = new NDKRelaySet(set, ndk);
    await Promise.all([
      // Fetch all kind 10002 events
      new Promise(async (resolve) => {
        const lists = await ndk.fetchEvents(
          { kinds: [10002], authors: pubkeys },
          { closeOnEose: true, pool, groupable: false },
          relaySet
        );
        for (const relayList of lists) {
          relayLists.set(relayList.pubkey, _NDKRelayList.from(relayList));
        }
        resolve();
      }),
      // Also fetch all kind 3 events
      new Promise(async (resolve) => {
        const lists = await ndk.fetchEvents(
          { kinds: [3], authors: pubkeys },
          { closeOnEose: true, pool, groupable: false },
          relaySet
        );
        for (const relayList of lists) {
          const list = relayListFromKind3(ndk, relayList);
          if (list)
            fromContactList.set(relayList.pubkey, list);
        }
        resolve();
      })
    ]);
    const result = /* @__PURE__ */ new Map();
    for (const pubkey of pubkeys) {
      const relayList = relayLists.get(pubkey) ?? fromContactList.get(pubkey);
      if (relayList)
        result.set(pubkey, relayList);
    }
    return result;
  }
  get readRelayUrls() {
    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").filter((tag) => !tag[2] || tag[2] && tag[2] === READ_MARKER).map((tag) => tag[1]);
  }
  set readRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay, READ_MARKER]);
    }
  }
  get writeRelayUrls() {
    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").filter((tag) => !tag[2] || tag[2] && tag[2] === WRITE_MARKER).map((tag) => tag[1]);
  }
  set writeRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay, WRITE_MARKER]);
    }
  }
  get bothRelayUrls() {
    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").filter((tag) => !tag[2]).map((tag) => tag[1]);
  }
  set bothRelayUrls(relays) {
    for (const relay of relays) {
      this.tags.push(["r", relay]);
    }
  }
  get relays() {
    return this.tags.filter((tag) => tag[0] === "r" || tag[0] === "relay").map((tag) => tag[1]);
  }
};
function relayListFromKind3(ndk, contactList) {
  try {
    const content = JSON.parse(contactList.content);
    const relayList = new NDKRelayList(ndk);
    const readRelays = /* @__PURE__ */ new Set();
    const writeRelays = /* @__PURE__ */ new Set();
    for (let [key, config] of Object.entries(content)) {
      try {
        key = normalizeRelayUrl(key);
      } catch {
        continue;
      }
      if (!config) {
        readRelays.add(key);
        writeRelays.add(key);
      } else {
        const relayConfig = config;
        if (relayConfig.write)
          writeRelays.add(key);
        if (relayConfig.read)
          readRelays.add(key);
      }
    }
    relayList.readRelayUrls = Array.from(readRelays);
    relayList.writeRelayUrls = Array.from(writeRelays);
    return relayList;
  } catch {
  }
  return void 0;
}

// src/nwc/pay_invoice.ts
async function payInvoice(invoice) {
  const ret = await this.sendReq("pay_invoice", { invoice });
  return ret;
}
var NDKPrivateKeySigner = class _NDKPrivateKeySigner {
  _user;
  privateKey;
  constructor(privateKey) {
    if (privateKey) {
      this.privateKey = privateKey;
      this._user = new NDKUser({
        hexpubkey: getPublicKey(this.privateKey)
      });
    }
  }
  static generate() {
    const privateKey = generatePrivateKey();
    return new _NDKPrivateKeySigner(privateKey);
  }
  async blockUntilReady() {
    if (!this._user) {
      throw new Error("NDKUser not initialized");
    }
    return this._user;
  }
  async user() {
    await this.blockUntilReady();
    return this._user;
  }
  async sign(event) {
    if (!this.privateKey) {
      throw Error("Attempted to sign without a private key");
    }
    return getSignature(event, this.privateKey);
  }
  async encrypt(recipient, value) {
    if (!this.privateKey) {
      throw Error("Attempted to encrypt without a private key");
    }
    const recipientHexPubKey = recipient.hexpubkey;
    return await nip04_exports.encrypt(this.privateKey, recipientHexPubKey, value);
  }
  async decrypt(sender, value) {
    if (!this.privateKey) {
      throw Error("Attempted to decrypt without a private key");
    }
    const senderHexPubKey = sender.hexpubkey;
    return await nip04_exports.decrypt(this.privateKey, senderHexPubKey, value);
  }
};

// src/nwc/req.ts
async function sendReq(method, params) {
  const event = new NDKEvent(this.ndk, {
    kind: 23194 /* NostrWalletConnectReq */,
    tags: [["p", this.walletService.pubkey]],
    content: JSON.stringify({ method, params })
  });
  this.debug("Sending request", event.content);
  await event.encrypt(this.walletService, this.signer);
  await event.sign(this.signer);
  this.debug("Request encrypted and signed");
  return new Promise(async (resolve, reject) => {
    try {
      const eTag = event.tagId();
      if (!eTag)
        throw new Error("Failed to get e-tag");
      const processEvent = (payload) => {
        this.off(eTag, processEvent);
        this.off("event", processEvent);
        this.debug("Received response", payload);
        try {
          const content = JSON.parse(payload);
          if (content.error)
            reject(content);
          resolve(content);
        } catch (e) {
          this.debug("Failed to parse response", e);
          reject({
            result_type: "error",
            error: {
              code: "failed_to_parse_response",
              message: e.message
            }
          });
        }
      };
      const sub = this.ndk.subscribe(
        {
          kinds: [23195 /* NostrWalletConnectRes */],
          "#e": [eTag],
          limit: 1
        },
        { groupable: false, subId: `nwc-${method}` },
        this.relaySet
      );
      sub.on("event", async (event2) => {
        await event2.decrypt(event2.author, this.signer);
        processEvent(event2.content);
        sub.stop();
      });
      this.once(eTag, processEvent);
      this.once("event", processEvent);
      this.debug("Sending request to relay", event.rawEvent());
      await event.publish(this.relaySet);
    } catch (e) {
      this.debug("Failed to send request", e, e.relayErrors);
      reject({
        result_type: "error",
        error: {
          code: "failed_to_send_request",
          message: e.message
        }
      });
    }
  });
}

// src/nwc/get_balance.ts
async function getBalance() {
  const ret = await this.sendReq("get_balance", {});
  return ret;
}

// src/nwc/get_info.ts
async function getInfo() {
  const ret = await this.sendReq("get_info", {});
  return ret;
}

// src/nwc/index.ts
var NDKNwc = class _NDKNwc extends lib$1.EventEmitter {
  ndk;
  debug;
  /**
   * The Wallet Service's public key
   */
  walletService;
  relaySet;
  signer;
  active = false;
  /**
   *
   * @param opts: NostrWalletConnectOptions
   * @returns NDKNwc
   */
  constructor({
    ndk,
    pubkey,
    relayUrls,
    secret
  }) {
    super();
    this.ndk = ndk;
    this.walletService = ndk.getUser({ pubkey });
    this.relaySet = new NDKRelaySet(
      new Set(relayUrls.map((url) => ndk.pool.getRelay(url))),
      ndk
    );
    this.signer = new NDKPrivateKeySigner(secret);
    this.debug = ndk.debug.extend("nwc");
    this.debug(`Starting with wallet service ${this.walletService.npub}`);
  }
  static async fromURI(ndk, uri) {
    const u = new URL(uri);
    if (u.protocol !== "nostr+walletconnect:") {
      throw new Error("Invalid protocol");
    }
    const nwc = new _NDKNwc({
      ndk,
      pubkey: u.host ?? u.pathname,
      relayUrls: u.searchParams.getAll("relay") ?? [""],
      secret: u.searchParams.get("secret") ?? ""
    });
    return nwc;
  }
  /**
   * Blocks until we're subscribed to talk to the wallet service
   * @param msTimeout Timeout in ms to wait for the subscription to be ready
   * @returns
   */
  async blockUntilReady(msTimeout) {
    const signerUser = await this.signer.user();
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout"));
      }, msTimeout);
    });
    const subPromise = new Promise((resolve) => {
      const sub = this.ndk.subscribe(
        {
          kinds: [23195 /* NostrWalletConnectRes */],
          "#p": [signerUser.pubkey],
          limit: 1
        },
        { groupable: false, subId: "nwc" },
        this.relaySet
      );
      sub.on("event", async (event) => {
        this.debug("received response", event.rawEvent());
        const eTag = event.tagValue("e");
        if (!eTag) {
          this.debug("Received an event without an e-tag");
          return;
        }
        this.debug("received an event", eTag);
        try {
          await event.decrypt(event.author, this.signer);
          this.emit(eTag, event.content);
        } catch (e) {
          this.debug("Failed to decrypt event", e);
          return;
        }
      });
      sub.on("eose", () => {
        this.debug("Subscription ready");
        this.active = true;
        resolve();
      });
      sub.on("close", () => {
        this.debug("Subscription closed");
        this.active = false;
      });
    });
    const promises = [subPromise];
    if (msTimeout)
      promises.push(timeout);
    return await Promise.race(promises);
  }
  async sendReq(method, params) {
    return await sendReq.call(this, method, params);
  }
  async payInvoice(invoice) {
    return await payInvoice.call(this, invoice);
  }
  async getInfo() {
    return await getInfo.call(this);
  }
  getBalance = getBalance.bind(this);
};
var NDKNip07Signer = class {
  _userPromise;
  nip04Queue = [];
  nip04Processing = false;
  debug;
  waitTimeout;
  /**
   * @param waitTimeout - The timeout in milliseconds to wait for the NIP-07 to become available
   */
  constructor(waitTimeout = 1e3) {
    this.debug = debug6("ndk:nip07");
    this.waitTimeout = waitTimeout;
  }
  async blockUntilReady() {
    await this.waitForExtension();
    const pubkey = await window.nostr.getPublicKey();
    if (!pubkey) {
      throw new Error("User rejected access");
    }
    return new NDKUser({ hexpubkey: pubkey });
  }
  /**
   * Getter for the user property.
   * @returns The NDKUser instance.
   */
  async user() {
    if (!this._userPromise) {
      this._userPromise = this.blockUntilReady();
    }
    return this._userPromise;
  }
  /**
   * Signs the given Nostr event.
   * @param event - The Nostr event to be signed.
   * @returns The signature of the signed event.
   * @throws Error if the NIP-07 is not available on the window object.
   */
  async sign(event) {
    await this.waitForExtension();
    const signedEvent = await window.nostr.signEvent(event);
    return signedEvent.sig;
  }
  async relays() {
    await this.waitForExtension();
    const relays = await window.nostr.getRelays?.() || {};
    const activeRelays = [];
    for (const url of Object.keys(relays)) {
      if (relays[url].read && relays[url].write) {
        activeRelays.push(url);
      }
    }
    return activeRelays.map((url) => new NDKRelay(url));
  }
  async encrypt(recipient, value) {
    await this.waitForExtension();
    const recipientHexPubKey = recipient.hexpubkey;
    return this.queueNip04("encrypt", recipientHexPubKey, value);
  }
  async decrypt(sender, value) {
    await this.waitForExtension();
    const senderHexPubKey = sender.hexpubkey;
    return this.queueNip04("decrypt", senderHexPubKey, value);
  }
  async queueNip04(type, counterpartyHexpubkey, value) {
    return new Promise((resolve, reject) => {
      this.nip04Queue.push({
        type,
        counterpartyHexpubkey,
        value,
        resolve,
        reject
      });
      if (!this.nip04Processing) {
        this.processNip04Queue();
      }
    });
  }
  async processNip04Queue(item, retries = 0) {
    if (!item && this.nip04Queue.length === 0) {
      this.nip04Processing = false;
      return;
    }
    this.nip04Processing = true;
    const { type, counterpartyHexpubkey, value, resolve, reject } = item || this.nip04Queue.shift();
    this.debug("Processing encryption queue item", {
      type,
      counterpartyHexpubkey,
      value
    });
    try {
      let result;
      if (type === "encrypt") {
        result = await window.nostr.nip04.encrypt(counterpartyHexpubkey, value);
      } else {
        result = await window.nostr.nip04.decrypt(counterpartyHexpubkey, value);
      }
      resolve(result);
    } catch (error) {
      if (error.message && error.message.includes("call already executing")) {
        if (retries < 5) {
          this.debug("Retrying encryption queue item", {
            type,
            counterpartyHexpubkey,
            value,
            retries
          });
          setTimeout(() => {
            this.processNip04Queue(item, retries + 1);
          }, 50 * retries);
          return;
        }
      }
      reject(error);
    }
    this.processNip04Queue();
  }
  waitForExtension() {
    return new Promise((resolve, reject) => {
      if (window.nostr) {
        resolve();
        return;
      }
      let timerId;
      const intervalId = setInterval(() => {
        if (window.nostr) {
          clearTimeout(timerId);
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
      timerId = setTimeout(() => {
        clearInterval(intervalId);
        reject(new Error("NIP-07 extension not available"));
      }, this.waitTimeout);
    });
  }
};

// src/events/dedup.ts
function dedup(event1, event2) {
  if (event1.created_at > event2.created_at) {
    return event1;
  }
  return event2;
}
var OutboxItem = class {
  /**
   * Type of item
   */
  type;
  /**
   * The relay URLs that are of interest to this item
   */
  relayUrlScores;
  readRelays;
  writeRelays;
  constructor(type) {
    this.type = type;
    this.relayUrlScores = /* @__PURE__ */ new Map();
    this.readRelays = /* @__PURE__ */ new Set();
    this.writeRelays = /* @__PURE__ */ new Set();
  }
};
var OutboxTracker = class extends lib$1.EventEmitter {
  data;
  ndk;
  debug;
  constructor(ndk) {
    super();
    this.ndk = ndk;
    this.debug = ndk.debug.extend("outbox-tracker");
    this.data = new dist.LRUCache({
      maxSize: 1e5,
      entryExpirationTimeInMS: 5e3
    });
  }
  trackUsers(items) {
    for (let i = 0; i < items.length; i += 400) {
      const slice = items.slice(i, i + 400);
      let pubkeys = slice.map((item) => getKeyFromItem(item));
      pubkeys = pubkeys.filter((pubkey) => !this.data.has(pubkey));
      if (pubkeys.length === 0)
        continue;
      const outboxItems = /* @__PURE__ */ new Map();
      for (const pubkey of pubkeys) {
        outboxItems.set(pubkey, this.track(pubkey, "user"));
      }
      NDKRelayList.forUsers(pubkeys, this.ndk).then(
        (relayLists) => {
          for (const [pubkey, relayList] of relayLists) {
            const outboxItem = outboxItems.get(pubkey);
            const user = new NDKUser({ pubkey });
            user.ndk = this.ndk;
            if (relayList) {
              outboxItem.readRelays = new Set(normalize(relayList.readRelayUrls));
              outboxItem.writeRelays = new Set(normalize(relayList.writeRelayUrls));
              for (const relayUrl of outboxItem.readRelays) {
                if (this.ndk.pool.blacklistRelayUrls.has(relayUrl)) {
                  this.debug(
                    `removing blacklisted relay ${relayUrl} from read relays`
                  );
                  outboxItem.readRelays.delete(relayUrl);
                }
              }
              for (const relayUrl of outboxItem.writeRelays) {
                if (this.ndk.pool.blacklistRelayUrls.has(relayUrl)) {
                  this.debug(
                    `removing blacklisted relay ${relayUrl} from write relays`
                  );
                  outboxItem.writeRelays.delete(relayUrl);
                }
              }
              this.data.set(pubkey, outboxItem);
            }
          }
        }
      );
    }
  }
  /**
   *
   * @param key
   * @param score
   */
  track(item, type) {
    const key = getKeyFromItem(item);
    type ??= getTypeFromItem(item);
    let outboxItem = this.data.get(key);
    if (!outboxItem)
      outboxItem = new OutboxItem(type);
    this.data.set(key, outboxItem);
    return outboxItem;
  }
};
function getKeyFromItem(item) {
  if (item instanceof NDKUser) {
    return item.pubkey;
  } else {
    return item;
  }
}
function getTypeFromItem(item) {
  if (item instanceof NDKUser) {
    return "user";
  } else {
    return "kind";
  }
}
var NDKPool = class extends lib$1.EventEmitter {
  // TODO: This should probably be an LRU cache
  relays = /* @__PURE__ */ new Map();
  blacklistRelayUrls;
  debug;
  temporaryRelayTimers = /* @__PURE__ */ new Map();
  flappingRelays = /* @__PURE__ */ new Set();
  // A map to store timeouts for each flapping relay.
  backoffTimes = /* @__PURE__ */ new Map();
  constructor(relayUrls = [], blacklistedRelayUrls = [], ndk, debug7) {
    super();
    this.debug = debug7 ?? ndk.debug.extend("pool");
    for (const relayUrl of relayUrls) {
      const relay = new NDKRelay(relayUrl);
      this.addRelay(relay, false);
    }
    this.blacklistRelayUrls = new Set(blacklistedRelayUrls);
  }
  /**
   * Adds a relay to the pool, and sets a timer to remove it if it is not used within the specified time.
   * @param relay - The relay to add to the pool.
   * @param removeIfUnusedAfter - The time in milliseconds to wait before removing the relay from the pool after it is no longer used.
   */
  useTemporaryRelay(relay, removeIfUnusedAfter = 6e5) {
    const relayAlreadyInPool = this.relays.has(relay.url);
    if (!relayAlreadyInPool) {
      this.addRelay(relay);
    }
    const existingTimer = this.temporaryRelayTimers.get(relay.url);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    if (!relayAlreadyInPool || existingTimer) {
      const timer = setTimeout(() => {
        this.removeRelay(relay.url);
      }, removeIfUnusedAfter);
      this.temporaryRelayTimers.set(relay.url, timer);
    }
  }
  /**
   * Adds a relay to the pool.
   *
   * @param relay - The relay to add to the pool.
   * @param connect - Whether or not to connect to the relay.
   */
  addRelay(relay, connect = true) {
    const relayUrl = relay.url;
    if (this.blacklistRelayUrls?.has(relayUrl)) {
      this.debug(`Relay ${relayUrl} is blacklisted`);
      return;
    }
    relay.on("notice", async (relay2, notice) => this.emit("notice", relay2, notice));
    relay.on("connect", () => this.handleRelayConnect(relayUrl));
    relay.on("ready", () => this.handleRelayReady(relay));
    relay.on("disconnect", async () => this.emit("relay:disconnect", relay));
    relay.on("flapping", () => this.handleFlapping(relay));
    relay.on("auth", async (challenge) => this.emit("relay:auth", relay, challenge));
    relay.on("authed", async () => this.emit("relay:authed", relay));
    this.relays.set(relayUrl, relay);
    if (connect) {
      this.emit("relay:connecting", relay);
      relay.connect().catch((e) => {
        this.debug(`Failed to connect to relay ${relayUrl}`, e);
      });
    }
  }
  /**
   * Removes a relay from the pool.
   * @param relayUrl - The URL of the relay to remove.
   * @returns {boolean} True if the relay was removed, false if it was not found.
   */
  removeRelay(relayUrl) {
    const relay = this.relays.get(relayUrl);
    if (relay) {
      relay.disconnect();
      this.relays.delete(relayUrl);
      this.emit("relay:disconnect", relay);
      return true;
    }
    const existingTimer = this.temporaryRelayTimers.get(relayUrl);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.temporaryRelayTimers.delete(relayUrl);
    }
    return false;
  }
  /**
   * Fetches a relay from the pool, or creates a new one if it does not exist.
   *
   * New relays will be attempted to be connected.
   */
  getRelay(url, connect = true) {
    let relay = this.relays.get(url);
    if (!relay) {
      relay = new NDKRelay(url);
      this.addRelay(relay, connect);
    }
    return relay;
  }
  handleRelayConnect(relayUrl) {
    this.debug(`Relay ${relayUrl} connected`);
    this.emit("relay:connect", this.relays.get(relayUrl));
    if (this.stats().connected === this.relays.size) {
      this.emit("connect");
    }
  }
  handleRelayReady(relay) {
    this.debug(`Relay ${relay.url} ready`);
    this.emit("relay:ready", relay);
  }
  /**
   * Attempts to establish a connection to each relay in the pool.
   *
   * @async
   * @param {number} [timeoutMs] - Optional timeout in milliseconds for each connection attempt.
   * @returns {Promise<void>} A promise that resolves when all connection attempts have completed.
   * @throws {Error} If any of the connection attempts result in an error or timeout.
   */
  async connect(timeoutMs) {
    const promises = [];
    this.debug(
      `Connecting to ${this.relays.size} relays${timeoutMs ? `, timeout ${timeoutMs}...` : ""}`
    );
    for (const relay of this.relays.values()) {
      const connectPromise = new Promise((resolve, reject) => {
        this.emit("relay:connecting", relay);
        return relay.connect(timeoutMs).then(resolve).catch(reject);
      });
      if (timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(`Timed out after ${timeoutMs}ms`), timeoutMs);
        });
        promises.push(
          Promise.race([connectPromise, timeoutPromise]).catch((e) => {
            this.debug(
              `Failed to connect to relay ${relay.url}: ${e ?? "No reason specified"}`
            );
          })
        );
      } else {
        promises.push(connectPromise);
      }
    }
    if (timeoutMs) {
      setTimeout(() => {
        const allConnected = this.stats().connected === this.relays.size;
        const someConnected = this.stats().connected > 0;
        if (!allConnected && someConnected) {
          this.emit("connect");
        }
      }, timeoutMs);
    }
    await Promise.all(promises);
  }
  checkOnFlappingRelays() {
    const flappingRelaysCount = this.flappingRelays.size;
    const totalRelays = this.relays.size;
    if (flappingRelaysCount / totalRelays >= 0.8) {
      for (const relayUrl of this.flappingRelays) {
        this.backoffTimes.set(relayUrl, 0);
      }
    }
  }
  handleFlapping(relay) {
    this.debug(`Relay ${relay.url} is flapping`);
    let currentBackoff = this.backoffTimes.get(relay.url) || 5e3;
    currentBackoff = currentBackoff * 2;
    this.backoffTimes.set(relay.url, currentBackoff);
    this.debug(`Backoff time for ${relay.url} is ${currentBackoff}ms`);
    setTimeout(() => {
      this.debug(`Attempting to reconnect to ${relay.url}`);
      this.emit("relay:connecting", relay);
      relay.connect();
      this.checkOnFlappingRelays();
    }, currentBackoff);
    relay.disconnect();
    this.emit("flapping", relay);
  }
  size() {
    return this.relays.size;
  }
  /**
   * Returns the status of each relay in the pool.
   * @returns {NDKPoolStats} An object containing the number of relays in each status.
   */
  stats() {
    const stats = {
      total: 0,
      connected: 0,
      disconnected: 0,
      connecting: 0
    };
    for (const relay of this.relays.values()) {
      stats.total++;
      if (relay.status === 1 /* CONNECTED */) {
        stats.connected++;
      } else if (relay.status === 3 /* DISCONNECTED */) {
        stats.disconnected++;
      } else if (relay.status === 0 /* CONNECTING */) {
        stats.connecting++;
      }
    }
    return stats;
  }
  connectedRelays() {
    return Array.from(this.relays.values()).filter(
      (relay) => relay.status === 1 /* CONNECTED */
    );
  }
  /**
   * Get a list of all relay urls in the pool.
   */
  urls() {
    return Array.from(this.relays.keys());
  }
};

// src/relay/sets/utils.ts
function correctRelaySet(relaySet, pool) {
  const connectedRelays = pool.connectedRelays();
  const includesConnectedRelay = Array.from(relaySet.relays).some((relay) => {
    return connectedRelays.map((r) => r.url).includes(relay.url);
  });
  if (!includesConnectedRelay) {
    for (const relay of connectedRelays) {
      relaySet.addRelay(relay);
    }
  }
  if (connectedRelays.length === 0) {
    for (const relay of pool.relays.values()) {
      relaySet.addRelay(relay);
    }
  }
  return relaySet;
}

// src/media/index.ts
var SPEC_PATH = "/.well-known/nostr/nip96.json";
var Nip96 = class {
  ndk;
  spec;
  url;
  nip98Required = false;
  /**
   * @param domain domain of the NIP96 service
   */
  constructor(domain, ndk) {
    this.url = `https://${domain}${SPEC_PATH}`;
    this.ndk = ndk;
  }
  async prepareUpload(blob, httpVerb = "POST") {
    this.validateHttpFetch();
    if (!this.spec)
      await this.fetchSpec();
    if (!this.spec)
      throw new Error("Failed to fetch NIP96 spec");
    let headers = {};
    if (this.nip98Required) {
      const authorizationHeader = await this.generateNip98Header(
        this.spec.api_url,
        httpVerb,
        blob
      );
      headers = { Authorization: authorizationHeader };
    }
    return {
      url: this.spec.api_url,
      headers
    };
  }
  /**
   * Provides an XMLHttpRequest-based upload method for browsers.
   * @example
   * const xhr = new XMLHttpRequest();
   * xhr.upload.addEventListener("progress", function(e) {
   *    const percentComplete = e.loaded / e.total;
   *    console.log(percentComplete);
   * });
   * const nip96 = ndk.getNip96("nostrcheck.me");
   * const blob = new Blob(["Hello, world!"], { type: "text/plain" });
   * const response = await nip96.xhrUpload(xhr, blob);
   * console.log(response);
   * @returns Promise that resolves to the upload response
   */
  async xhrUpload(xhr, blob) {
    const httpVerb = "POST";
    const { url, headers } = await this.prepareUpload(blob, httpVerb);
    xhr.open(httpVerb, url, true);
    if (headers["Authorization"]) {
      xhr.setRequestHeader("Authorization", headers["Authorization"]);
    }
    const formData = new FormData();
    formData.append("file", blob);
    return new Promise((resolve, reject) => {
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(xhr.statusText));
        }
      };
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };
      xhr.send(formData);
    });
  }
  /**
   * Fetch-based upload method. Note that this will use NDK's httpFetch
   * @param blob
   * @returns Promise that resolves to the upload response
   *
   * @example
   * const nip96 = ndk.getNip96("nostrcheck.me");
   * const blob = new Blob(["Hello, world!"], { type: "text/plain" });
   * const response = await nip96.upload(blob);
   * console.log(response);
   */
  async upload(blob) {
    const httpVerb = "POST";
    const { url, headers } = await this.prepareUpload(blob, httpVerb);
    const formData = new FormData();
    formData.append("file", blob);
    const res = await this.ndk.httpFetch(this.spec.api_url, {
      method: httpVerb,
      headers,
      body: formData
    });
    if (res.status !== 200)
      throw new Error(`Failed to upload file to ${url}`);
    const json = await res.json();
    if (json.status !== "success")
      throw new Error(json.message);
    return json;
  }
  validateHttpFetch() {
    if (!this.ndk)
      throw new Error("NDK is required to fetch NIP96 spec");
    if (!this.ndk.httpFetch)
      throw new Error("NDK must have an httpFetch method to fetch NIP96 spec");
  }
  async fetchSpec() {
    this.validateHttpFetch();
    const res = await this.ndk.httpFetch(this.url);
    if (res.status !== 200)
      throw new Error(`Failed to fetch NIP96 spec from ${this.url}`);
    const spec = await res.json();
    if (!spec)
      throw new Error(`Failed to parse NIP96 spec from ${this.url}`);
    this.spec = spec;
    this.nip98Required = this.spec.plans.free.is_nip98_required;
  }
  async generateNip98Header(requestUrl, httpMethod, blob) {
    const event = new NDKEvent(this.ndk, {
      kind: 27235 /* HttpAuth */,
      tags: [
        ["u", requestUrl],
        ["method", httpMethod]
      ]
    });
    if (["POST", "PUT", "PATCH"].includes(httpMethod)) {
      const sha256Hash = await this.calculateSha256(blob);
      event.tags.push(["payload", sha256Hash]);
    }
    await event.sign();
    const encodedEvent = btoa(JSON.stringify(event.rawEvent()));
    return `Nostr ${encodedEvent}`;
  }
  async calculateSha256(blob) {
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
};

// src/ndk/queue/index.ts
var Queue = class {
  queue = [];
  maxConcurrency;
  processing = /* @__PURE__ */ new Set();
  promises = /* @__PURE__ */ new Map();
  constructor(name, maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
  }
  add(item) {
    if (this.promises.has(item.id)) {
      return this.promises.get(item.id);
    }
    const promise = new Promise((resolve, reject) => {
      this.queue.push({
        ...item,
        func: () => item.func().then(
          (result) => {
            resolve(result);
            return result;
          },
          (error) => {
            reject(error);
            throw error;
          }
        )
      });
      this.process();
    });
    this.promises.set(item.id, promise);
    promise.finally(() => {
      this.promises.delete(item.id);
      this.processing.delete(item.id);
    });
    return promise;
  }
  process() {
    if (this.processing.size >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }
    const item = this.queue.shift();
    if (!item || this.processing.has(item.id)) {
      return;
    }
    this.processing.add(item.id);
    item.func();
  }
  clear() {
    this.queue = [];
  }
  clearProcessing() {
    this.processing.clear();
  }
  clearAll() {
    this.clear();
    this.clearProcessing();
  }
  length() {
    return this.queue.length;
  }
};

// src/ndk/index.ts
var DEFAULT_OUTBOX_RELAYS = ["wss://purplepag.es/", "wss://profiles.nos.social/"];
var DEFAULT_BLACKLISTED_RELAYS = [
  "wss://brb.io/",
  // BRB
  "wss://nostr.mutinywallet.com/",
  // Don't try to read from this relay since it's a write-only relay
  "wss://purplepag.es/"
  // This is a hack, since this is a mostly read-only relay, but not fully. Once we have relay routing this can be removed so it only receives the supported kinds
];
var NDK = class extends lib$1.EventEmitter {
  explicitRelayUrls;
  pool;
  outboxPool;
  _signer;
  _activeUser;
  cacheAdapter;
  debug;
  devWriteRelaySet;
  outboxTracker;
  mutedIds;
  clientName;
  clientNip89;
  queuesZapConfig;
  queuesNip05;
  /**
   * Default relay-auth policy that will be used when a relay requests authentication,
   * if no other policy is specified for that relay.
   *
   * @example Disconnect from relays that request authentication:
   * ```typescript
   * ndk.relayAuthDefaultPolicy = NDKAuthPolicies.disconnect(ndk.pool);
   * ```
   *
   * @example Sign in to relays that request authentication:
   * ```typescript
   * ndk.relayAuthDefaultPolicy = NDKAuthPolicies.signIn({ndk})
   * ```
   *
   * @example Sign in to relays that request authentication, asking the user for confirmation:
   * ```typescript
   * ndk.relayAuthDefaultPolicy = (relay: NDKRelay) => {
   *     const signIn = NDKAuthPolicies.signIn({ndk});
   *     if (confirm(`Relay ${relay.url} is requesting authentication, do you want to sign in?`)) {
   *        signIn(relay);
   *     }
   * }
   * ```
   */
  relayAuthDefaultPolicy;
  /**
   * Fetch function to use for HTTP requests.
   *
   * @example
   * ```typescript
   * import fetch from "node-fetch";
   *
   * ndk.httpFetch = fetch;
   * ```
   */
  httpFetch;
  autoConnectUserRelays = true;
  autoFetchUserMutelist = true;
  constructor(opts = {}) {
    super();
    this.debug = opts.debug || debug6("ndk");
    this.explicitRelayUrls = opts.explicitRelayUrls || [];
    this.pool = new NDKPool(
      opts.explicitRelayUrls || [],
      opts.blacklistRelayUrls || DEFAULT_BLACKLISTED_RELAYS,
      this
    );
    this.debug(`Starting with explicit relays: ${JSON.stringify(this.explicitRelayUrls)}`);
    this.pool.on("relay:auth", async (relay, challenge) => {
      if (this.relayAuthDefaultPolicy) {
        await this.relayAuthDefaultPolicy(relay, challenge);
      }
    });
    this.autoConnectUserRelays = opts.autoConnectUserRelays ?? true;
    this.autoFetchUserMutelist = opts.autoFetchUserMutelist ?? true;
    this.clientName = opts.clientName;
    this.clientNip89 = opts.clientNip89;
    this.relayAuthDefaultPolicy = opts.relayAuthDefaultPolicy;
    if (opts.enableOutboxModel) {
      this.outboxPool = new NDKPool(
        opts.outboxRelayUrls || DEFAULT_OUTBOX_RELAYS,
        opts.blacklistRelayUrls || DEFAULT_BLACKLISTED_RELAYS,
        this,
        this.debug.extend("outbox-pool")
      );
      this.outboxTracker = new OutboxTracker(this);
    }
    this.signer = opts.signer;
    this.cacheAdapter = opts.cacheAdapter;
    this.mutedIds = opts.mutedIds || /* @__PURE__ */ new Map();
    if (opts.devWriteRelayUrls) {
      this.devWriteRelaySet = NDKRelaySet.fromRelayUrls(opts.devWriteRelayUrls, this);
    }
    this.queuesZapConfig = new Queue("zaps", 3);
    this.queuesNip05 = new Queue("nip05", 10);
    try {
      this.httpFetch = fetch;
    } catch {
    }
  }
  /**
   * Adds an explicit relay to the pool.
   * @param url
   * @param relayAuthPolicy Authentication policy to use if different from the default
   * @param connect Whether to connect to the relay automatically
   * @returns
   */
  addExplicitRelay(urlOrRelay, relayAuthPolicy, connect = true) {
    let relay;
    if (typeof urlOrRelay === "string") {
      relay = new NDKRelay(urlOrRelay, relayAuthPolicy);
    } else {
      relay = urlOrRelay;
    }
    this.pool.addRelay(relay, connect);
    this.explicitRelayUrls.push(relay.url);
    return relay;
  }
  toJSON() {
    return { relayCount: this.pool.relays.size }.toString();
  }
  get activeUser() {
    return this._activeUser;
  }
  /**
   * Sets the active user for this NDK instance, typically this will be
   * called when assigning a signer to the NDK instance.
   *
   * This function will automatically connect to the user's relays if
   * `autoConnectUserRelays` is set to true.
   *
   * It will also fetch the user's mutelist if `autoFetchUserMutelist` is set to true.
   */
  set activeUser(user) {
    const differentUser = this._activeUser?.pubkey !== user?.pubkey;
    this._activeUser = user;
    if (user && differentUser) {
      const connectToUserRelays = async (user2) => {
        const relayList = await NDKRelayList.forUser(user2.pubkey, this);
        if (!relayList) {
          this.debug("No relay list found for user", { npub: user2.npub });
          return;
        }
        this.debug("Connecting to user relays", {
          npub: user2.npub,
          relays: relayList.relays
        });
        for (const url of relayList.relays) {
          let relay = this.pool.relays.get(url);
          if (!relay) {
            relay = new NDKRelay(url);
            this.pool.addRelay(relay);
          }
        }
      };
      const fetchBlockedRelays = async (user2) => {
        const blockedRelays = await this.fetchEvent({
          kinds: [10006 /* BlockRelayList */],
          authors: [user2.pubkey]
        });
        if (blockedRelays) {
          const list = lists_default.from(blockedRelays);
          for (const item of list.items) {
            this.pool.blacklistRelayUrls.add(item[0]);
          }
        }
        this.debug("Blocked relays", { blockedRelays });
      };
      const fetchUserMuteList = async (user2) => {
        const muteList = await this.fetchEvent({
          kinds: [1e4 /* MuteList */],
          authors: [user2.pubkey]
        });
        if (muteList) {
          const list = lists_default.from(muteList);
          for (const item of list.items) {
            this.mutedIds.set(item[1], item[0]);
          }
        }
      };
      const userFunctions = [fetchBlockedRelays];
      if (this.autoConnectUserRelays)
        userFunctions.push(connectToUserRelays);
      if (this.autoFetchUserMutelist)
        userFunctions.push(fetchUserMuteList);
      const runUserFunctions = async (user2) => {
        for (const fn of userFunctions) {
          await fn(user2);
        }
      };
      const pool = this.outboxPool || this.pool;
      if (pool.connectedRelays.length > 0) {
        runUserFunctions(user);
      } else {
        this.debug("Waiting for connection to main relays");
        pool.once("connect", () => {
          runUserFunctions(user);
        });
      }
    } else if (!user) {
      this.mutedIds = /* @__PURE__ */ new Map();
    }
  }
  get signer() {
    return this._signer;
  }
  set signer(newSigner) {
    this._signer = newSigner;
    this.emit("signer:ready", newSigner);
    newSigner?.user().then((user) => {
      user.ndk = this;
      this.activeUser = user;
    });
  }
  /**
   * Connect to relays with optional timeout.
   * If the timeout is reached, the connection will be continued to be established in the background.
   */
  async connect(timeoutMs) {
    if (this._signer && this.autoConnectUserRelays) {
      this.debug("Attempting to connect to user relays specified by signer");
      if (this._signer.relays) {
        const relays = await this._signer.relays();
        relays.forEach((relay) => this.pool.addRelay(relay));
      }
    }
    const connections = [this.pool.connect(timeoutMs)];
    if (this.outboxPool) {
      connections.push(this.outboxPool.connect(timeoutMs));
    }
    this.debug("Connecting to relays", { timeoutMs });
    return Promise.allSettled(connections).then(() => {
    });
  }
  /**
   * Get a NDKUser object
   *
   * @param opts
   * @returns
   */
  getUser(opts) {
    const user = new NDKUser(opts);
    user.ndk = this;
    return user;
  }
  /**
   * Get a NDKUser from a NIP05
   * @param nip05 NIP-05 ID
   * @param skipCache Skip cache
   * @returns
   */
  async getUserFromNip05(nip05, skipCache = false) {
    return NDKUser.fromNip05(nip05, this, skipCache);
  }
  /**
   * Create a new subscription. Subscriptions automatically start, you can make them automatically close when all relays send back an EOSE by setting `opts.closeOnEose` to `true`)
   *
   * @param filters
   * @param opts
   * @param relaySet explicit relay set to use
   * @param autoStart automatically start the subscription
   * @returns NDKSubscription
   */
  subscribe(filters, opts, relaySet, autoStart = true) {
    const subscription = new NDKSubscription(this, filters, opts, relaySet);
    if (relaySet) {
      for (const relay of relaySet.relays) {
        this.pool.useTemporaryRelay(relay);
      }
    }
    if (this.outboxPool && subscription.hasAuthorsFilter()) {
      const authors = subscription.filters.filter((filter) => filter.authors && filter.authors?.length > 0).map((filter) => filter.authors).flat();
      this.outboxTracker?.trackUsers(authors);
    }
    if (autoStart)
      subscription.start();
    return subscription;
  }
  /**
   * Publish an event to a relay
   * @param event event to publish
   * @param relaySet explicit relay set to use
   * @param timeoutMs timeout in milliseconds to wait for the event to be published
   * @returns The relays the event was published to
   *
   * @deprecated Use `event.publish()` instead
   */
  async publish(event, relaySet, timeoutMs) {
    this.debug("Deprecated: Use `event.publish()` instead");
    return event.publish(relaySet, timeoutMs);
  }
  /**
   * Fetch a single event.
   *
   * @param idOrFilter event id in bech32 format or filter
   * @param opts subscription options
   * @param relaySetOrRelay explicit relay set to use
   */
  async fetchEvent(idOrFilter, opts, relaySetOrRelay) {
    let filter;
    let relaySet;
    if (relaySetOrRelay instanceof NDKRelay) {
      relaySet = new NDKRelaySet(/* @__PURE__ */ new Set([relaySetOrRelay]), this);
    } else if (relaySetOrRelay instanceof NDKRelaySet) {
      relaySet = relaySetOrRelay;
    }
    if (!relaySetOrRelay && typeof idOrFilter === "string") {
      if (!isNip33AValue(idOrFilter)) {
        const relays = relaysFromBech32(idOrFilter);
        if (relays.length > 0) {
          relaySet = new NDKRelaySet(new Set(relays), this);
          relaySet = correctRelaySet(relaySet, this.pool);
        }
      }
    }
    if (typeof idOrFilter === "string") {
      filter = filterFromId(idOrFilter);
    } else {
      filter = idOrFilter;
    }
    if (!filter) {
      throw new Error(`Invalid filter: ${JSON.stringify(idOrFilter)}`);
    }
    return new Promise((resolve) => {
      let fetchedEvent = null;
      const s = this.subscribe(
        filter,
        { ...opts || {}, closeOnEose: true },
        relaySet,
        false
      );
      s.on("event", (event) => {
        event.ndk = this;
        if (!event.isReplaceable()) {
          resolve(event);
        } else if (!fetchedEvent || fetchedEvent.created_at < event.created_at) {
          fetchedEvent = event;
        }
      });
      s.on("eose", () => {
        resolve(fetchedEvent);
      });
      s.start();
    });
  }
  /**
   * Fetch events
   */
  async fetchEvents(filters, opts, relaySet) {
    return new Promise((resolve) => {
      const events = /* @__PURE__ */ new Map();
      const relaySetSubscription = this.subscribe(
        filters,
        { ...opts || {}, closeOnEose: true },
        relaySet,
        false
      );
      const onEvent = (event) => {
        const dedupKey = event.deduplicationKey();
        const existingEvent = events.get(dedupKey);
        if (existingEvent) {
          event = dedup(existingEvent, event);
        }
        event.ndk = this;
        events.set(dedupKey, event);
      };
      relaySetSubscription.on("event", onEvent);
      relaySetSubscription.on("event:dup", onEvent);
      relaySetSubscription.on("eose", () => {
        resolve(new Set(events.values()));
      });
      relaySetSubscription.start();
    });
  }
  /**
   * Ensures that a signer is available to sign an event.
   */
  assertSigner() {
    if (!this.signer) {
      this.emit("signerRequired");
      throw new Error("Signer required");
    }
  }
  /**
   * Creates a new Nip96 instance for the given domain.
   * @param domain Domain to use for nip96 uploads
   * @example Upload a file to a NIP-96 enabled domain:
   *
   * ```typescript
   * const blob = new Blob(["Hello, world!"], { type: "text/plain" });
   * const nip96 = ndk.getNip96("nostrcheck.me");
   * await nip96.upload(blob);
   * ```
   */
  getNip96(domain) {
    return new Nip96(domain, this);
  }
  /**
   * Creates a new Nostr Wallet Connect instance for the given URI and waits for it to be ready.
   * @param uri WalletConnect URI
   * @param connectTimeout Timeout in milliseconds to wait for the NWC to be ready. Set to `false` to avoid connecting.
   * @example
   * const nwc = await ndk.nwc("nostr+walletconnect://....")
   * nwc.payInvoice("lnbc...")
   */
  async nwc(uri, connectTimeout = 2e3) {
    const nwc = await NDKNwc.fromURI(this, uri);
    if (connectTimeout !== false) {
      await nwc.blockUntilReady(connectTimeout);
    }
    return nwc;
  }
};

/* src\Login.svelte generated by Svelte v3.59.2 */

const { Error: Error_1, console: console_1 } = globals;
const file = "src\\Login.svelte";

function create_fragment(ctx) {
	let div0;
	let button;
	let t1;
	let div2;
	let div1;
	let p0;
	let t3;
	let p1;
	let t5;
	let ul;
	let li0;
	let t6;
	let a0;
	let t8;
	let li1;
	let t9;
	let a1;
	let t11;
	let li2;
	let t12;
	let a2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div0 = element("div");
			button = element("button");
			button.textContent = "Login With A Nostr Extension";
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			p0 = element("p");
			p0.textContent = "Don't have a nostr extension?";
			t3 = space();
			p1 = element("p");
			p1.textContent = "Check out these nostr extension options:";
			t5 = space();
			ul = element("ul");
			li0 = element("li");
			t6 = text("Chrome: ");
			a0 = element("a");
			a0.textContent = "Nostr Connect";
			t8 = space();
			li1 = element("li");
			t9 = text("FireFox: ");
			a1 = element("a");
			a1.textContent = "Nostr Connect";
			t11 = space();
			li2 = element("li");
			t12 = text("Safari (iOS): ");
			a2 = element("a");
			a2.textContent = "Nostore__";
			attr_dev(button, "class", "btn");
			add_location(button, file, 62, 4, 1962);
			attr_dev(div0, "class", "wrapper");
			add_location(div0, file, 61, 0, 1935);
			add_location(p0, file, 67, 8, 2115);
			add_location(p1, file, 68, 8, 2161);
			attr_dev(a0, "href", "https://chromewebstore.google.com/detail/ampjiinddmggbhpebhaegmjkbbeofoaj");
			add_location(a0, file, 71, 24, 2266);
			add_location(li0, file, 70, 12, 2236);
			attr_dev(a1, "href", "https://addons.mozilla.org/en-US/firefox/addon/nostr-connect/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search");
			add_location(a1, file, 74, 25, 2431);
			add_location(li1, file, 73, 12, 2400);
			attr_dev(a2, "href", "https://apps.apple.com/us/app/nostore/id1666553677");
			add_location(a2, file, 77, 30, 2658);
			add_location(li2, file, 76, 12, 2622);
			add_location(ul, file, 69, 8, 2218);
			attr_dev(div1, "class", "register-link");
			add_location(div1, file, 66, 4, 2078);
			attr_dev(div2, "class", "wrapper");
			add_location(div2, file, 65, 0, 2051);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			append_dev(div0, button);
			insert_dev(target, t1, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, p0);
			append_dev(div1, t3);
			append_dev(div1, p1);
			append_dev(div1, t5);
			append_dev(div1, ul);
			append_dev(ul, li0);
			append_dev(li0, t6);
			append_dev(li0, a0);
			append_dev(ul, t8);
			append_dev(ul, li1);
			append_dev(li1, t9);
			append_dev(li1, a1);
			append_dev(ul, t11);
			append_dev(ul, li2);
			append_dev(li2, t12);
			append_dev(li2, a2);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*extlogin*/ ctx[0], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div2);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Login', slots, []);
	const RELAYS_URL = ['wss://relay.snort.social', 'wss://relay.primal.net', 'wss://relay.damus.io'];
	const ndk = new NDK(); // Instantiating NDK here
	let pool;
	let events = [];

	onMount(async () => {
		pool = new SimplePool();

		return () => {
			pool.unsub();
		};
	});

	async function extlogin() {
		try {
			if (!window.nostr) {
				throw new Error('Nostr extension not found. Please install the extension.');
			}

			await ndk.connect(); // Using the previously instantiated NDK
			const nip07signer = new NDKNip07Signer();
			const publicKey = await nip07signer.user();

			if (!!publicKey.pubkey) {
				console.log("Permission granted to read their public key:", publicKey.pubkey);
			}

			// Create a subscription to listen for events related to the user's profile
			const subEvents = pool.sub(RELAYS_URL, [
				{
					kinds: [0], // Filter events by kind (assuming profile events have kind 0)
					limit: 1,
					authors: [publicKey.pubkey]
				}
			]);

			subEvents.on('event', event => {
				events = [...events, event];
				eventsStore.set(events);
			});

			// Navigate to the TodoPage component
			navigate('/todoPage');
		} catch(error) {
			console.error('Login failed:', error.message);
			alert(error.message); // Display the error message to the user
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Login> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		eventsStore,
		SimplePool,
		NDK,
		NDKNip07Signer,
		navigate,
		RELAYS_URL,
		ndk,
		pool,
		events,
		extlogin
	});

	$$self.$inject_state = $$props => {
		if ('pool' in $$props) pool = $$props.pool;
		if ('events' in $$props) events = $$props.events;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [extlogin];
}

class Login extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Login",
			options,
			id: create_fragment.name
		});
	}
}

// Import Svelte components

// Create the Svelte app instance
new App({
    target: document.body,
    props: {
        Login,
        TodoPage
          }
});
//# sourceMappingURL=bundle.js.map
