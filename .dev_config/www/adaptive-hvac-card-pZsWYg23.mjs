/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, W = M.ShadowRoot && (M.ShadyCSS === void 0 || M.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = Symbol(), K = /* @__PURE__ */ new WeakMap();
let nt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (r) => new nt(typeof r == "string" ? r : r + "", void 0, V), ut = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new nt(e, r, V);
}, _t = (r, t) => {
  if (W) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = M.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Y = W ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return pt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $t, defineProperty: ft, getOwnPropertyDescriptor: vt, getOwnPropertyNames: yt, getOwnPropertySymbols: gt, getPrototypeOf: mt } = Object, f = globalThis, G = f.trustedTypes, At = G ? G.emptyScript : "", j = f.reactiveElementPolyfillSupport, S = (r, t) => r, T = { toAttribute(r, t) {
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
} }, q = (r, t) => !$t(r, t), Q = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: q };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), f.litPropertyMetadata ?? (f.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
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
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = mt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
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
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : T).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const h = s.getPropertyOptions(i), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((o = h.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? h.converter : T;
      this._$Em = i;
      const l = a.fromAttribute(e, h.type);
      this[i] = l ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const o = this.constructor, n = this[t];
      if (s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? q)(n, e) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[S("elementProperties")] = /* @__PURE__ */ new Map(), A[S("finalized")] = /* @__PURE__ */ new Map(), j == null || j({ ReactiveElement: A }), (f.reactiveElementVersions ?? (f.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, N = C.trustedTypes, X = N ? N.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, at = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + $, bt = `<${ht}>`, m = document, x = () => m.createComment(""), O = (r) => r === null || typeof r != "object" && typeof r != "function", F = Array.isArray, Et = (r) => F(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, et = />/g, v = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, it = /"/g, ct = /^(?:script|style|textarea|title)$/i, wt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), H = wt(1), b = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), rt = /* @__PURE__ */ new WeakMap(), y = m.createTreeWalker(m, 129);
function lt(r, t) {
  if (!F(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(t) : t;
}
const St = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = w;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let l, p, c = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, p = n.exec(a), p !== null); ) u = n.lastIndex, n === w ? p[1] === "!--" ? n = tt : p[1] !== void 0 ? n = et : p[2] !== void 0 ? (ct.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = v) : p[3] !== void 0 && (n = v) : n === v ? p[0] === ">" ? (n = i ?? w, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, l = p[1], n = p[3] === void 0 ? v : p[3] === '"' ? it : st) : n === it || n === st ? n = v : n === tt || n === et ? n = w : (n = v, i = void 0);
    const _ = n === v && r[h + 1].startsWith("/>") ? " " : "";
    o += n === w ? a + bt : c >= 0 ? (s.push(l), a.slice(0, c) + at + a.slice(c) + $ + _) : a + $ + (c === -2 ? h : _);
  }
  return [lt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class z {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const h = t.length - 1, a = this.parts, [l, p] = St(t, e);
    if (this.el = z.createElement(l, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = y.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(at)) {
          const u = p[n++], _ = i.getAttribute(c).split($), U = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: U[2], strings: _, ctor: U[1] === "." ? Pt : U[1] === "?" ? xt : U[1] === "@" ? Ot : R }), i.removeAttribute(c);
        } else c.startsWith($) && (a.push({ type: 6, index: o }), i.removeAttribute(c));
        if (ct.test(i.tagName)) {
          const c = i.textContent.split($), u = c.length - 1;
          if (u > 0) {
            i.textContent = N ? N.emptyScript : "";
            for (let _ = 0; _ < u; _++) i.append(c[_], x()), y.nextNode(), a.push({ type: 2, index: ++o });
            i.append(c[u], x());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ht) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = i.data.indexOf($, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = m.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(r, t, e = r, s) {
  var n, h;
  if (t === b) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = O(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((h = i == null ? void 0 : i._$AO) == null || h.call(i, !1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = E(r, i._$AS(r, t.values), i, s)), t;
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
        let l;
        a.type === 2 ? l = new D(o, o.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (l = new zt(o, this, t)), this._$AV.push(l), a = s[++h];
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
class D {
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
    t = E(this, t, e), O(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== b && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(m.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = z.createElement(lt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const n = new Ct(i, this), h = n.u(this.options);
      n.p(e), this.T(h), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = rt.get(t.strings);
    return e === void 0 && rt.set(t.strings, e = new z(t)), e;
  }
  k(t) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new D(this.O(x()), this.O(x()), this, this.options)) : s = e[i], s._$AI(o), i++;
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
class R {
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
    if (o === void 0) t = E(this, t, e, 0), n = !O(t) || t !== this._$AH && t !== b, n && (this._$AH = t);
    else {
      const h = t;
      let a, l;
      for (t = o[0], a = 0; a < o.length - 1; a++) l = E(this, h[s + a], e, a), l === b && (l = this._$AH[a]), n || (n = !O(l) || l !== this._$AH[a]), l === d ? t = d : t !== d && (t += (l ?? "") + o[a + 1]), this._$AH[a] = l;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class xt extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Ot extends R {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? d) === b) return;
    const s = this._$AH, i = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const B = C.litHtmlPolyfillSupport;
B == null || B(z, D), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.1");
const Dt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new D(t.insertBefore(x(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const g = globalThis;
class P extends A {
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
    return b;
  }
}
var ot;
P._$litElement$ = !0, P.finalized = !0, (ot = g.litElementHydrateSupport) == null || ot.call(g, { LitElement: P });
const Z = g.litElementPolyfillSupport;
Z == null || Z({ LitElement: P });
(g.litElementVersions ?? (g.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: q }, Ut = (r = kt, t, e) => {
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
function J(r) {
  return dt({ ...r, state: !0, attribute: !1 });
}
var Ht = Object.defineProperty, I = (r, t, e, s) => {
  for (var i = void 0, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = n(t, e, i) || i);
  return i && Ht(t, e, i), i;
};
class k extends P {
  constructor() {
    super(...arguments), this._zoneData = {};
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
    var t, e, s;
    return this._zoneId ? H`
      <ha-card header="Adaptive HVAC - Zone: ${this._zoneId}">
        <div class="card-content">
          <div class="header-actions">
            <label>
              <input 
                type="checkbox" 
                .checked=${((t = this._zoneData) == null ? void 0 : t.active) ?? !0}
                @change=${this._toggleActive}
              >
              Zone Active
            </label>
          </div>

          <div class="section">
            <h3>Schedule Profiles</h3>
            ${(((e = this._zoneData) == null ? void 0 : e.week_profile) || []).map((i, o) => H`
              <div class="profile-item">
                <div>
                  <strong>${i.days.join(", ")}</strong>: 
                  ${i.start} - ${i.end} 
                  @ ${i.target.temp}°C
                </div>
                <button @click=${() => this._removeProfile(o)}>Delete</button>
              </div>
            `)}
            
            <div class="add-profile">
              <button @click=${this._addProfile}>Add Default Profile (Mon-Fri 9-5)</button>
            </div>
          </div>

          <div class="section">
            <h3>Overlays</h3>
            ${(((s = this._zoneData) == null ? void 0 : s.overlays) || []).map((i, o) => H`
              <div class="overlay-item">
                <div>
                  <strong>Trigger:</strong> ${i.trigger_entity} is ${i.state} <br>
                  <strong>Action:</strong> Set HVAC to ${i.action.hvac_mode || i.action.temp}°C 
                  (Type: ${i.type}, Priority: ${i.priority})
                </div>
                <button @click=${() => this._removeOverlay(o)}>Delete</button>
              </div>
            `)}
            <div class="add-overlay">
              <button @click=${this._addOverlay}>Add Default Overlay (Window Open -> OFF)</button>
            </div>
          </div>
          
          <h3>Raw Data</h3>
          <pre>${JSON.stringify(this._zoneData, null, 2)}</pre>
        </div>
      </ha-card>
    ` : H`<ha-card>Card not configured with a zone_id.</ha-card>`;
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
I([
  dt({ attribute: !1 })
], k.prototype, "hass");
I([
  J()
], k.prototype, "_config");
I([
  J()
], k.prototype, "_zoneId");
I([
  J()
], k.prototype, "_zoneData");
customElements.get("adaptive-hvac-card") || customElements.define("adaptive-hvac-card", k);
export {
  k as A,
  ut as a,
  P as i,
  dt as n,
  J as r,
  H as x
};
