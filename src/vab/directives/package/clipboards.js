/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : VueClipboard
 * @document https://github.dev/zhuowenli/vue-clipboards/blob/master/src/vue-clipboards.js
 */

if (!Clipboard) {
  throw new Error('[vue-Clipboard] cannot locate Clipboard.');
}

function isDom (obj) {
  return typeof window.HTMLElement === 'object'
    ? obj instanceof window.HTMLElement
    : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

function doubleClickHandler (e) {
  const target = e.target;

  if (document.createRange) {
    const rng = document.createRange();
    const sel = window.getSelection();

    rng.selectNode(target);
    sel.removeAllRanges();
    sel.addRange(rng);
  } else {
    const rng = document.body.createTextRange();

    rng.moveToElementText(target);
    rng.select();
  }
}
const clipboards = {
  bind (el, { value: text, modifiers }, vnode) {
    const option = {};
    let $parent = null;

    if (text && typeof text === 'function') {
      text = text();
    }

    if (/(string|number)/.test(typeof text)) {
      option.text = () => `${text}`;
    } else {
      throw new Error('[vue-clipboards] Invalid value. Please use a valid value.');
    }

    if (vnode.data.attrs && vnode.data.attrs.model) {
      $parent = isDom(vnode.data.attrs.model)
        ? vnode.data.attrs.model
        : document.querySelector(vnode.data.attrs.model);
    }

    // 修复按钮脱离文档流时，clipboards监听失败问题
    if (vnode.elm.offsetParent) {
      option.container = vnode.elm.offsetParent;
    } else if (isDom($parent)) {
      option.container = $parent;
    } else {
      // if root element should use document.body
      option.container = el.parentElement || document.body;
    }

    vnode.elm.$clipboards = new Clipboard(el, option);

    const { componentOptions, data } = vnode;
    const listeners = componentOptions ? componentOptions.listeners : null;
    const on = data ? data.on : null;
    const events = (listeners && listeners) || (on && on);

    if (events && typeof events === 'object' && Object.keys(events).length) {
      // fixed with Vue 2.2.x, event object `fn` rename to `fns`
      Object.keys(events).map(
        cb => vnode.elm.$clipboards.on(cb, events[cb].fn || events[cb].fns)
      );
    }

    // add native user selection for dblclick
    const withNativeSelection = modifiers.nselect || false;

    if (withNativeSelection) {
      vnode.elm.addEventListener('dblclick', doubleClickHandler);
    }

    return vnode.elm.$clipboards;
  },
  unbind (vnode) {
    if (vnode.elm && vnode.elm.$clipboards && vnode.elm.$clipboards.destroy) {
      vnode.elm.$clipboards.destroy();
      vnode.elm.removeEventListener('dblclick', doubleClickHandler);
      delete vnode.elm.$clipboards;
    }
  },
  update (el, binding, vnode) {
    binding.def.unbind(vnode);
    vnode.elm.removeEventListener('dblclick', doubleClickHandler);
    binding.def.bind(el, binding, vnode);
  }
};
export default clipboards
