/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, V = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), K = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (V && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (r) => new ot(typeof r == "string" ? r : r + "", void 0, q), ut = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new ot(e, r, q);
}, _t = (r, t) => {
  if (V) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = T.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Y = V ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return pt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $t, defineProperty: ft, getOwnPropertyDescriptor: vt, getOwnPropertyNames: yt, getOwnPropertySymbols: gt, getPrototypeOf: mt } = Object, f = globalThis, G = f.trustedTypes, At = G ? G.emptyScript : "", L = f.reactiveElementPolyfillSupport, x = (r, t) => r, N = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? At : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (r, t) => !$t(r, t), Q = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), f.litPropertyMetadata ?? (f.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && ft(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const h = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const t = mt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const e = this.properties, s = [...yt(e), ...gt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(Y(i));
    } else t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : N).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const h = s.getPropertyOptions(i), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((o = h.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? h.converter : N;
      this._$Em = i;
      const c = a.fromAttribute(e, h.type);
      this[i] = c ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const o = this.constructor, n = this[t];
      if (s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? F)(n, e) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: h } = n, a = this[o];
        h !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[x("elementProperties")] = /* @__PURE__ */ new Map(), b[x("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: b }), (f.reactiveElementVersions ?? (f.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, R = P.trustedTypes, X = R ? R.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, at = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + $, bt = `<${ht}>`, m = document, O = () => m.createComment(""), D = (r) => r === null || typeof r != "object" && typeof r != "function", J = Array.isArray, Et = (r) => J(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, et = />/g, v = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, it = /"/g, ct = /^(?:script|style|textarea|title)$/i, wt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), A = wt(1), E = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), rt = /* @__PURE__ */ new WeakMap(), y = m.createTreeWalker(m, 129);
function lt(r, t) {
  if (!J(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(t) : t;
}
const St = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = C;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let c, p, l = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, p = n.exec(a), p !== null); ) u = n.lastIndex, n === C ? p[1] === "!--" ? n = tt : p[1] !== void 0 ? n = et : p[2] !== void 0 ? (ct.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = v) : p[3] !== void 0 && (n = v) : n === v ? p[0] === ">" ? (n = i ?? C, l = -1) : p[1] === void 0 ? l = -2 : (l = n.lastIndex - p[2].length, c = p[1], n = p[3] === void 0 ? v : p[3] === '"' ? it : st) : n === it || n === st ? n = v : n === tt || n === et ? n = C : (n = v, i = void 0);
    const _ = n === v && r[h + 1].startsWith("/>") ? " " : "";
    o += n === C ? a + bt : l >= 0 ? (s.push(c), a.slice(0, l) + at + a.slice(l) + $ + _) : a + $ + (l === -2 ? h : _);
  }
  return [lt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const h = t.length - 1, a = this.parts, [c, p] = St(t, e);
    if (this.el = k.createElement(c, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = y.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(at)) {
          const u = p[n++], _ = i.getAttribute(l).split($), M = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: M[2], strings: _, ctor: M[1] === "." ? xt : M[1] === "?" ? Pt : M[1] === "@" ? zt : I }), i.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: o }), i.removeAttribute(l));
        if (ct.test(i.tagName)) {
          const l = i.textContent.split($), u = l.length - 1;
          if (u > 0) {
            i.textContent = R ? R.emptyScript : "";
            for (let _ = 0; _ < u; _++) i.append(l[_], O()), y.nextNode(), a.push({ type: 2, index: ++o });
            i.append(l[u], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ht) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = i.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = m.createElement("template");
    return s.innerHTML = t, s;
  }
}
function w(r, t, e = r, s) {
  var n, h;
  if (t === E) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = D(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((h = i == null ? void 0 : i._$AO) == null || h.call(i, !1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = w(r, i._$AS(r, t.values), i, s)), t;
}
class Ct {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? m).importNode(e, !0);
    y.currentNode = i;
    let o = y.nextNode(), n = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new U(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new Ot(o, this, t)), this._$AV.push(c), a = s[++h];
      }
      n !== (a == null ? void 0 : a.index) && (o = y.nextNode(), n++);
    }
    return y.currentNode = m, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = w(this, t, e), D(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(m.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = k.createElement(lt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const n = new Ct(i, this), h = n.u(this.options);
      n.p(e), this.T(h), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = rt.get(t.strings);
    return e === void 0 && rt.set(t.strings, e = new k(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new U(this.O(O()), this.O(O()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = w(this, t, e, 0), n = !D(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const h = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = w(this, h[s + a], e, a), c === E && (c = this._$AH[a]), n || (n = !D(c) || c !== this._$AH[a]), c === d ? t = d : t !== d && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class xt extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Pt extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class zt extends I {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? d) === E) return;
    const s = this._$AH, i = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ot {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const Z = P.litHtmlPolyfillSupport;
Z == null || Z(k, U), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.1");
const Dt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new U(t.insertBefore(O(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const g = globalThis;
class z extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Dt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
}
var nt;
z._$litElement$ = !0, z.finalized = !0, (nt = g.litElementHydrateSupport) == null || nt.call(g, { LitElement: z });
const W = g.litElementPolyfillSupport;
W == null || W({ LitElement: z });
(g.litElementVersions ?? (g.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: F }, Ut = (r = kt, t, e) => {
  const { kind: s, metadata: i } = e;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(n, a, r);
    }, init(h) {
      return h !== void 0 && this.C(n, void 0, r, h), h;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(h) {
      const a = this[n];
      t.call(this, h), this.requestUpdate(n, a, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function dt(r) {
  return (t, e) => typeof e == "object" ? Ut(r, t, e) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function j(r) {
  return dt({ ...r, state: !0, attribute: !1 });
}
var Ht = Object.defineProperty, H = (r, t, e, s) => {
  for (var i = void 0, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = n(t, e, i) || i);
  return i && Ht(t, e, i), i;
};
class S extends z {
  constructor() {
    super(...arguments), this._zoneData = {}, this._expanded = !1;
  }
  setConfig(t) {
    if (!t.zone_id)
      throw new Error("You need to define a zone_id in your card configuration.");
    this._config = t, this._zoneId = t.zone_id;
  }
  async connectedCallback() {
    super.connectedCallback(), this.hass && this._zoneId && await this._fetchZoneData();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  async _fetchZoneData() {
    if (!(!this.hass || !this._zoneId))
      try {
        const t = await this.hass.callWS({
          type: "adaptive_hvac/get_zone_data",
          entry_id: this._zoneId
        });
        this._zoneData = t, console.log("Fetched zone data:", this._zoneData);
      } catch (t) {
        console.error("Error fetching zone data:", t);
      }
  }
  async _saveZoneData(t) {
    if (!(!this.hass || !this._zoneId))
      try {
        await this.hass.callWS({
          type: "adaptive_hvac/update_zone_data",
          entry_id: this._zoneId,
          data: t
        }), this._zoneData = t, console.log("Saved zone data:", t);
      } catch (e) {
        console.error("Error saving zone data:", e), await this._fetchZoneData();
      }
  }
  static get styles() {
    return ut`
      :host {
        display: block;
        padding: 16px;
        border: 1px solid var(--primary-text-color);
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .card-content {
        padding: 16px;
      }
      .section {
        margin-top: 16px;
        border-top: 1px solid var(--divider-color);
        padding-top: 16px;
      }
      .profile-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--secondary-background-color);
        padding: 8px;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      .overlay-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--secondary-background-color);
        padding: 8px;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      button {
        cursor: pointer;
      }
      pre {
        white-space: pre-wrap;
        word-break: break-all;
      }
    `;
  }
  render() {
    var t, e, s, i, o, n, h;
    return this._zoneId ? A`
      <ha-card header="Adaptive HVAC - Zone: ${this._zoneId}">
        <div class="card-content">
          <div class="header-actions" style="display: flex; justify-content: space-between; align-items: center;">
            <label>
              <input 
                type="checkbox" 
                .checked=${((t = this._zoneData) == null ? void 0 : t.active) ?? !0}
                @change=${this._toggleActive}
              >
              Zone Active
            </label>
            <button @click=${() => this._expanded = !this._expanded}>
              ${this._expanded ? "Collapse" : "Edit Schedule"}
            </button>
          </div>

          ${this._expanded ? A`
            <div class="section">
              <h3>Schedule Profiles</h3>
              ${(((n = this._zoneData) == null ? void 0 : n.week_profile) || []).map((a, c) => A`
                <div class="profile-item">
                  <div>
                    <strong>${a.days.join(", ")}</strong>: 
                    ${a.start} - ${a.end} 
                    @ ${a.target.temp}°C
                  </div>
                  <button @click=${() => this._removeProfile(c)}>Delete</button>
                </div>
              `)}
              
              <div class="add-profile">
                <button @click=${this._addProfile}>Add Default Profile (Mon-Fri 9-5)</button>
              </div>
            </div>

            <div class="section">
              <h3>Overlays</h3>
              ${(((h = this._zoneData) == null ? void 0 : h.overlays) || []).map((a, c) => A`
                <div class="overlay-item">
                  <div>
                    <strong>Trigger:</strong> ${a.trigger_entity} is ${a.state} <br>
                    <strong>Action:</strong> Set HVAC to ${a.action.hvac_mode || a.action.temp}°C 
                    (Type: ${a.type}, Priority: ${a.priority})
                  </div>
                  <button @click=${() => this._removeOverlay(c)}>Delete</button>
                </div>
              `)}
              <div class="add-overlay">
                <button @click=${this._addOverlay}>Add Default Overlay (Window Open -> OFF)</button>
              </div>
            </div>
            
            <h3>Raw Data</h3>
            <pre>${JSON.stringify(this._zoneData, null, 2)}</pre>
          ` : A`
            <div class="summary">
              <p>Profiles: ${((s = (e = this._zoneData) == null ? void 0 : e.week_profile) == null ? void 0 : s.length) || 0}</p>
              <p>Overlays: ${((o = (i = this._zoneData) == null ? void 0 : i.overlays) == null ? void 0 : o.length) || 0}</p>
            </div>
          `}
        </div>
      </ha-card>
    ` : A`<ha-card>Card not configured with a zone_id.</ha-card>`;
  }
  _toggleActive(t) {
    const e = t.target.checked, s = { ...this._zoneData, active: e };
    this._saveZoneData(s);
  }
  _addProfile() {
    const t = {
      days: ["mon", "tue", "wed", "thu", "fri"],
      start: "09:00",
      end: "17:00",
      target: { temp: 21 }
    }, e = this._zoneData.week_profile || [], s = { ...this._zoneData, week_profile: [...e, t] };
    this._saveZoneData(s);
  }
  _removeProfile(t) {
    const e = [...this._zoneData.week_profile || []];
    e.splice(t, 1);
    const s = { ...this._zoneData, week_profile: e };
    this._saveZoneData(s);
  }
  _addOverlay() {
    const t = {
      trigger_entity: "binary_sensor.window_open",
      // Example entity
      state: "on",
      type: "absolute",
      action: { hvac_mode: "off" },
      priority: 10
    }, e = this._zoneData.overlays || [], s = { ...this._zoneData, overlays: [...e, t] };
    this._saveZoneData(s);
  }
  _removeOverlay(t) {
    const e = [...this._zoneData.overlays || []];
    e.splice(t, 1);
    const s = { ...this._zoneData, overlays: e };
    this._saveZoneData(s);
  }
  getCardSize() {
    return 3;
  }
}
H([
  dt({ attribute: !1 })
], S.prototype, "hass");
H([
  j()
], S.prototype, "_config");
H([
  j()
], S.prototype, "_zoneId");
H([
  j()
], S.prototype, "_zoneData");
H([
  j()
], S.prototype, "_expanded");
customElements.get("adaptive-hvac-card") || customElements.define("adaptive-hvac-card", S);
export {
  S as A,
  ut as a,
  z as i,
  dt as n,
  j as r,
  A as x
};
