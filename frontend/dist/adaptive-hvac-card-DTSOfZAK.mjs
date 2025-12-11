/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, W = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), K = /* @__PURE__ */ new WeakMap();
let nt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (o) => new nt(typeof o == "string" ? o : o + "", void 0, Z), ut = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, r) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[r + 1], o[0]);
  return new nt(e, o, Z);
}, vt = (o, t) => {
  if (W) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = H.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, G = W ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return pt(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: _t, getOwnPropertyDescriptor: gt, getOwnPropertyNames: mt, getOwnPropertySymbols: ft, getPrototypeOf: bt } = Object, b = globalThis, Q = b.trustedTypes, $t = Q ? Q.emptyScript : "", L = b.reactiveElementPolyfillSupport, z = (o, t) => o, N = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? $t : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (o, t) => !yt(o, t), X = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = X) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && _t(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = gt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: s, set(a) {
      const l = s == null ? void 0 : s.call(this);
      r == null || r.call(this, a), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? X;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, i = [...mt(e), ...ft(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(G(s));
    } else t !== void 0 && e.push(G(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return vt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : N).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, a;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : N;
      this._$Em = s;
      const d = n.fromAttribute(e, l.type);
      this[s] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i) {
    var s;
    if (t !== void 0) {
      const r = this.constructor, a = this[t];
      if (i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? F)(a, e) || i.useDefault && i.reflect && a === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, a] of s) {
        const { wrapped: l } = a, n = this[r];
        l !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, a, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[z("elementProperties")] = /* @__PURE__ */ new Map(), O[z("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: O }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, j = C.trustedTypes, tt = j ? j.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, lt = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + f, xt = `<${dt}>`, A = document, T = () => A.createComment(""), P = (o) => o === null || typeof o != "object" && typeof o != "function", J = Array.isArray, wt = (o) => J(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, it = />/g, $ = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, rt = /"/g, ct = /^(?:script|style|textarea|title)$/i, At = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), h = At(1), E = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function ht(o, t) {
  if (!J(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Ot = (o, t) => {
  const e = o.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = k;
  for (let l = 0; l < e; l++) {
    const n = o[l];
    let d, p, c = -1, _ = 0;
    for (; _ < n.length && (a.lastIndex = _, p = a.exec(n), p !== null); ) _ = a.lastIndex, a === k ? p[1] === "!--" ? a = et : p[1] !== void 0 ? a = it : p[2] !== void 0 ? (ct.test(p[2]) && (s = RegExp("</" + p[2], "g")), a = $) : p[3] !== void 0 && (a = $) : a === $ ? p[0] === ">" ? (a = s ?? k, c = -1) : p[1] === void 0 ? c = -2 : (c = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? $ : p[3] === '"' ? rt : st) : a === rt || a === st ? a = $ : a === et || a === it ? a = k : (a = $, s = void 0);
    const g = a === $ && o[l + 1].startsWith("/>") ? " " : "";
    r += a === k ? n + xt : c >= 0 ? (i.push(d), n.slice(0, c) + lt + n.slice(c) + f + g) : n + f + (c === -2 ? l : g);
  }
  return [ht(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class R {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, a = 0;
    const l = t.length - 1, n = this.parts, [d, p] = Ot(t, e);
    if (this.el = R.createElement(d, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = x.nextNode()) !== null && n.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(lt)) {
          const _ = p[a++], g = s.getAttribute(c).split(f), M = /([.?@])?(.*)/.exec(_);
          n.push({ type: 1, index: r, name: M[2], strings: g, ctor: M[1] === "." ? St : M[1] === "?" ? kt : M[1] === "@" ? zt : I }), s.removeAttribute(c);
        } else c.startsWith(f) && (n.push({ type: 6, index: r }), s.removeAttribute(c));
        if (ct.test(s.tagName)) {
          const c = s.textContent.split(f), _ = c.length - 1;
          if (_ > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let g = 0; g < _; g++) s.append(c[g], T()), x.nextNode(), n.push({ type: 2, index: ++r });
            s.append(c[_], T());
          }
        }
      } else if (s.nodeType === 8) if (s.data === dt) n.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(f, c + 1)) !== -1; ) n.push({ type: 7, index: r }), c += f.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function S(o, t, e = o, i) {
  var a, l;
  if (t === E) return t;
  let s = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const r = P(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), r === void 0 ? s = void 0 : (s = new r(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = S(o, s._$AS(o, t.values), s, i)), t;
}
class Et {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    x.currentNode = s;
    let r = x.nextNode(), a = 0, l = 0, n = i[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let d;
        n.type === 2 ? d = new U(r, r.nextSibling, this, t) : n.type === 1 ? d = new n.ctor(r, n.name, n.strings, this, t) : n.type === 6 && (d = new Ct(r, this, t)), this._$AV.push(d), n = i[++l];
      }
      a !== (n == null ? void 0 : n.index) && (r = x.nextNode(), a++);
    }
    return x.currentNode = A, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = S(this, t, e), P(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = R.createElement(ht(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const a = new Et(s, this), l = a.u(this.options);
      a.p(e), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new U(this.O(T()), this.O(T()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = t.nextSibling;
      t.remove(), t = s;
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
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = S(this, t, e, 0), a = !P(t) || t !== this._$AH && t !== E, a && (this._$AH = t);
    else {
      const l = t;
      let n, d;
      for (t = r[0], n = 0; n < r.length - 1; n++) d = S(this, l[i + n], e, n), d === E && (d = this._$AH[n]), a || (a = !P(d) || d !== this._$AH[n]), d === u ? t = u : t !== u && (t += (d ?? "") + r[n + 1]), this._$AH[n] = d;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class St extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class kt extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class zt extends I {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? u) === E) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ct {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const B = C.litHtmlPolyfillSupport;
B == null || B(R, U), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.1");
const Dt = (o, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new U(t.insertBefore(T(), r), r, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class D extends O {
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
var at;
D._$litElement$ = !0, D.finalized = !0, (at = w.litElementHydrateSupport) == null || at.call(w, { LitElement: D });
const V = w.litElementPolyfillSupport;
V == null || V({ LitElement: D });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: F }, Pt = (o = Tt, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(e.name, o), i === "accessor") {
    const { name: a } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, n, o);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, o, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = e;
    return function(l) {
      const n = this[a];
      t.call(this, l), this.requestUpdate(a, n, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Y(o) {
  return (t, e) => typeof e == "object" ? Pt(o, t, e) : ((i, s, r) => {
    const a = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), a ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function m(o) {
  return Y({ ...o, state: !0, attribute: !1 });
}
var Rt = Object.defineProperty, Ut = Object.getOwnPropertyDescriptor, y = (o, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Ut(t, e) : t, r = o.length - 1, a; r >= 0; r--)
    (a = o[r]) && (s = (i ? a(t, e, s) : a(s)) || s);
  return i && s && Rt(t, e, s), s;
};
class v extends D {
  constructor() {
    super(...arguments), this._zoneData = {
      active: !0,
      week_profile: [],
      overlays: []
    }, this._runtimeData = {}, this._viewMode = "mini", this._activeTab = "status", this._scheduleView = "weekly", this._editingDay = null, this._applyDays = [], this._editingOverlay = null, this._tempOverlay = null, this._tempRules = [];
  }
  // Lovelace API
  setConfig(t) {
    this.config = t;
  }
  set config(t) {
    if (!t || !t.zone_id)
      throw new Error("You need to define a zone_id in your card configuration.");
    this._config = t, this._zoneId = t.zone_id, this.isConnected && this._fetchZoneData();
  }
  get config() {
    return this._config;
  }
  connectedCallback() {
    super.connectedCallback(), this._fetchZoneData();
  }
  async _fetchZoneData() {
    if (!(!this.hass || !this._zoneId))
      try {
        const t = await this.hass.callWS({
          type: "adaptive_hvac/get_zone_data",
          entry_id: this._zoneId
        });
        this._zoneData = t;
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
        }), this._zoneData = t;
      } catch (e) {
        console.error("Error saving zone data:", e), await this._fetchZoneData();
      }
  }
  static get styles() {
    return ut`
      :host { display: block; width: 100%; position: relative; }
      .card {
          /* ha-card handles background, border, shadow */
          color: var(--primary-text-color);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
      }

      /* MINI CARD STYLES */
      .zone-mini-card {
          padding: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid transparent;
      }
      .zone-mini-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-color: var(--primary-color); }
      
      .mini-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .zone-name { font-weight: bold; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
      .mini-badge { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
      .mini-badge.heating { background: rgba(255, 152, 0, 0.15); color: var(--accent-color); }
      .mini-badge.idle { background: var(--secondary-background-color); color: var(--secondary-text-color); }
      
      .mini-body { text-align: center; }
      .temp-display { font-size: 1.5rem; font-weight: 300; margin: 4px 0; }
      .temp-display .target { font-size: 0.9rem; color: var(--secondary-text-color); }
      .next-event { font-size: 0.85rem; color: var(--secondary-text-color); display: flex; align-items: center; justify-content: center; gap: 4px; }

      /* DETAIL HEADER */
      .header { padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--divider-color); }
      .nav-cluster { display: flex; align-items: center; gap: 12px; }
      .zone-title { font-size: 1.2rem; font-weight: 500; }
      .nav-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; color: var(--secondary-text-color); display: flex; }
      .nav-btn:hover { background: rgba(0,0,0,0.05); color: var(--primary-color); }
      .badges .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
      .badge.heating { background: var(--accent-color); color: white; }
      .badge.idle { background: var(--secondary-background-color); color: var(--secondary-text-color); }

      /* TABS */
      .tabs { display: flex; background: var(--secondary-background-color); }
      .tabs button { flex: 1; background: none; border: none; padding: 12px; cursor: pointer; font-weight: 500; color: var(--secondary-text-color); border-bottom: 3px solid transparent; transition: 0.2s; }
      .tabs button.active { color: var(--primary-color); border-bottom-color: var(--primary-color); background: rgba(255,255,255,0.5); }

      .content-area { padding: 24px; min-height: 300px; }

      /* STATUS TAB */
      .thermostat-visual { display: flex; justify-content: center; margin-bottom: 32px; }
      .ring { width: 150px; height: 150px; border-radius: 50%; border: 8px solid var(--divider-color); display: flex; flex-direction: column; justify-content: center; align-items: center; }
      .ring.heating { border-color: var(--accent-color); }
      .ring .current { font-size: 3rem; font-weight: 300; }
      .ring .target { font-size: 0.9rem; color: var(--secondary-text-color); }
      
      /* ICONS */
      ha-icon { --mdc-icon-size: 20px; }

      .schedule-grid { margin-bottom: 16px; }
      .day-row { display: flex; align-items: center; gap: 12px; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; }
      .day-row.hoverable:hover { background: var(--secondary-background-color); cursor: pointer; }
      .day-label { width: 40px; font-weight: bold; font-size: 0.9rem; color: var(--secondary-text-color); text-align: right;}
      .timeline { flex: 1; height: 24px; background: #eee; border-radius: 4px; overflow: hidden; display: flex; }
      .slot.day { background: var(--accent-color); opacity: 0.8; }
      .slot.night { background: var(--primary-color); opacity: 0.2; }
      .hint-text { text-align: center; color: var(--secondary-text-color); font-size: 0.8rem; margin-bottom: 12px; opacity: 0.7; }
      
      .legend { margin-top: 16px; display: flex; gap: 16px; font-size: 0.9rem; justify-content: center; }
      .legend .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 4px; }
      .legend .dot.day { background: var(--accent-color); opacity: 0.8; }
      .legend .dot.night { background: var(--primary-color); opacity: 0.2; }
      
      input[type="time"] { font-family: inherit; font-size: 0.9rem; color: var(--primary-text-color); background: var(--secondary-background-color); }
    `;
  }
  render() {
    return this._zoneId ? h`
      <ha-card class="card">
        ${this._viewMode === "mini" ? this._renderMini() : this._renderDetail()}
      </ha-card>
    ` : h`<ha-card>No Zone ID</ha-card>`;
  }
  _renderMini() {
    const t = this._zoneData.hvac_action === "heating", e = this._zoneData.current_temp ?? "--", i = this._zoneData.target_temp ?? "--";
    return h`
        <div class="zone-mini-card" @click="${() => this._viewMode = "detail"}">
            <div class="mini-header">
                <span class="zone-name">${this._config.title || "Zone " + this._zoneId}</span>
                ${t ? h`<span class="mini-badge heating"><ha-icon icon="mdi:fire"></ha-icon></span>` : h`<span class="mini-badge idle"><ha-icon icon="mdi:power-sleep"></ha-icon></span>`}
            </div>
            <div class="mini-body">
                <div class="temp-display">
                    <span class="current">${e}°</span>
                    <span class="target">/ ${i}°</span>
                </div>
                <div class="next-event">
                    <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size: 16px;"></ha-icon> 22:00 -> 18°C
                </div>
            </div>
        </div>
    `;
  }
  _renderDetail() {
    const t = this._zoneData.active;
    return h`
        <div class="header">
            <div class="nav-cluster">
                <button class="nav-btn" @click="${() => this._viewMode = "mini"}">
                    <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
                <div class="zone-title">
                    ${this._config.title || "Zone " + this._zoneId}
                </div>
            </div>
            <div class="badges">
                ${t ? h`<span class="badge heating">Heating</span>` : h`<span class="badge idle">Idle</span>`}
            </div>
        </div>

        <div class="tabs">
            <button id="tab-status" class="${this._activeTab === "status" ? "active" : ""}" @click="${() => this._activeTab = "status"}">
                Status
            </button>
            <button id="tab-schedule" class="${this._activeTab === "schedule" ? "active" : ""}" @click="${() => this._activeTab = "schedule"}">
                Schedule
            </button>
            <button id="tab-overlays" class="${this._activeTab === "overlays" ? "active" : ""}" @click="${() => this._activeTab = "overlays"}">
                Overlays
            </button>
        </div>

        <div class="content-area">
            ${this._renderContent()}
        </div>
    `;
  }
  _renderContent() {
    switch (this._activeTab) {
      case "status":
        return this._renderStatus();
      case "overlays":
        return this._renderOverlays();
      case "schedule":
        return this._renderSchedule();
    }
  }
  _addOverlay() {
    this._editingOverlay = this._zoneData.overlays.length, this._tempOverlay = {
      id: `overlay_${Date.now()}`,
      name: "New Rule",
      trigger_entity: "",
      trigger_state: "on",
      type: "absolute",
      action: { hvac_mode: "off" },
      active: !0
    }, this.requestUpdate();
  }
  _editOverlay(t) {
    this._editingOverlay = t, this._tempOverlay = JSON.parse(JSON.stringify(this._zoneData.overlays[t])), this.requestUpdate();
  }
  async _deleteOverlay(t) {
    if (!confirm("Delete this overlay?")) return;
    const e = [...this._zoneData.overlays];
    e.splice(t, 1), await this._saveOverlaysToServer(e);
  }
  async _saveOverlay() {
    if (!this._tempOverlay || this._editingOverlay === null) return;
    const t = [...this._zoneData.overlays];
    this._editingOverlay >= t.length ? t.push(this._tempOverlay) : t[this._editingOverlay] = this._tempOverlay, await this._saveOverlaysToServer(t), this._cancelEditOverlay();
  }
  async _saveOverlaysToServer(t) {
    const e = { ...this._zoneData, overlays: t };
    this._zoneData = e, this.requestUpdate();
    try {
      await this.hass.callWS({
        type: "adaptive_hvac/update_zone_data",
        entry_id: this._zoneId,
        data: { overlays: t }
      });
    } catch (i) {
      console.error("Failed to save overlays:", i), this._fetchZoneData();
    }
  }
  _cancelEditOverlay() {
    this._editingOverlay = null, this._tempOverlay = null, this.requestUpdate();
  }
  _renderOverlayEditor() {
    if (!this._tempOverlay) return h``;
    const t = this._tempOverlay.type === "absolute";
    return h`
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 100; display: flex; align-items: center; justify-content: center;">
                <div style="background: var(--card-background-color, white); padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                    <h3 style="margin-top: 0;">${this._editingOverlay === this._zoneData.overlays.length ? "Add" : "Edit"} Overlay</h3>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px;">Name</label>
                        <input type="text" 
                            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);"
                            .value="${this._tempOverlay.name}"
                            @input="${(e) => {
      this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, name: e.target.value });
    }}"
                        >
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px;">Entity</label>
                        ${customElements.get("ha-entity-picker") ? h`
                        <ha-entity-picker
                            .hass=${this.hass}
                            .value="${this._tempOverlay.trigger_entity}"
                            @value-changed="${(e) => {
      this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, trigger_entity: e.detail.value }, this.requestUpdate());
    }}"
                            allow-custom-entity
                        ></ha-entity-picker>
                        ` : h`
                        <input type="text" placeholder="binary_sensor.window"
                            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);"
                            .value="${this._tempOverlay.trigger_entity}"
                            @input="${(e) => {
      this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, trigger_entity: e.target.value }, this.requestUpdate());
    }}"
                        >
                        <div style="font-size: 0.8em; color: var(--secondary-text-color); margin-top: 4px;">
                            (Entity picker not available in this view)
                        </div>
                        `}
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px;">State</label>
                        <input type="text" placeholder="on"
                            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);"
                            .value="${this._tempOverlay.trigger_state}"
                            @input="${(e) => {
      this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, trigger_state: e.target.value }, this.requestUpdate());
    }}"
                        >
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px;">Type</label>
                        <select 
                            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);"
                            .value="${this._tempOverlay.type}"
                            @change="${(e) => {
      const i = e.target.value;
      let s = {};
      i === "absolute" ? s = { hvac_mode: "off" } : s = { temp_offset: 2 }, this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, type: i, action: s }, this.requestUpdate());
    }}"
                        >
                            <option value="absolute">Absolute (Force Mode)</option>
                            <option value="relative">Relative (Offset Temp)</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px;">${t ? "Force HVAC Mode" : "Temperature Offset"}</label>
                        ${t ? h`
                            <select
                                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);"
                                .value="${this._tempOverlay.action.hvac_mode || "off"}"
                                @change="${(e) => {
      this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, action: { hvac_mode: e.target.value } }, this.requestUpdate());
    }}"
                            >
                                <option value="off">Off</option>
                                <option value="heat">Heat</option>
                                <option value="cool">Cool</option>
                            </select>
                        ` : h`
                            <input type="number" step="0.5"
                                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);"
                                .value="${this._tempOverlay.action.temp_offset || 0}"
                                @input="${(e) => {
      this._tempOverlay && (this._tempOverlay = { ...this._tempOverlay, action: { temp_offset: parseFloat(e.target.value) } }, this.requestUpdate());
    }}"
                            >
                        `}
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 12px;">
                        <button id="btn-cancel-overlay" @click="${this._cancelEditOverlay}" style="padding: 8px 16px; background: none; border: 1px solid var(--divider-color); border-radius: 4px; cursor: pointer;">Cancel</button>
                        <button id="btn-save-overlay" 
                                @click="${this._saveOverlay}" 
                                ?disabled="${!this._tempOverlay.name || !this._tempOverlay.trigger_entity}"
                                style="padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; opacity: ${!this._tempOverlay.name || !this._tempOverlay.trigger_entity ? "0.5" : "1"};">
                                Save
                        </button>
                    </div>
                </div>
            </div>
        `;
  }
  _renderOverlays() {
    return !this._zoneData || !this._zoneData.overlays ? h`
                <div class="content-area">
                    <button class="add-btn" @click="${this._addOverlay}" style="width: 100%; padding: 12px; border: 1px dashed var(--divider-color); background: none; cursor: pointer;">+ Add First Rule</button>
                    <!-- Render Editor Modal if active -->
                    ${this._editingOverlay !== null ? this._renderOverlayEditor() : ""}
                </div>
            ` : h`
            <div style="padding-top: 16px;">
                 <div class="hint-text" style="display: flex; align-items: center; gap: 4px; margin-bottom: 12px; color: var(--secondary-text-color);">
                    <ha-icon icon="mdi:information-outline" style="--mdc-icon-size: 16px;"></ha-icon> 
                    Rules that override the schedule
                </div>

                <div class="overlay-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                    ${this._zoneData.overlays.map((t, e) => {
      var r, a, l;
      const i = (a = (r = this._runtimeData) == null ? void 0 : r.active_overlays) == null ? void 0 : a.includes(t.name);
      let s = "";
      return t.type === "absolute" ? s = `Force ${(l = t.action.hvac_mode) == null ? void 0 : l.toUpperCase()}` : s = `${(t.action.temp_offset || 0) > 0 ? "+" : ""}${t.action.temp_offset}°C`, h`
                            <div class="overlay-row" 
                                 @click="${() => this._editOverlay(e)}"
                                 style="background: var(--secondary-background-color); padding: 12px; border-radius: 8px; border-left: 4px solid ${i ? "var(--accent-color)" : "transparent"}; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                <div class="overlay-info">
                                    <div class="overlay-name" style="font-weight: 500;">${t.name}</div>
                                    <div class="overlay-desc" style="font-size: 0.85rem; color: var(--secondary-text-color);">
                                        If ${t.trigger_entity} is ${t.trigger_state} → ${s}
                                    </div>
                                </div>
                                <div class="overlay-actions" style="display: flex; gap: 8px;">
                                    <ha-icon id="edit-overlay-${e}" icon="mdi:pencil" style="color: var(--secondary-text-color);"></ha-icon>
                                    <ha-icon id="delete-overlay-${e}" icon="mdi:delete" 
                                        @click="${(n) => {
        n.stopPropagation(), this._deleteOverlay(e);
      }}" 
                                        style="cursor: pointer; color: var(--secondary-text-color);">
                                    </ha-icon>
                                </div>
                            </div>
                        `;
    })}
                </div>
                
                <button id="btn-add-overlay" @click="${this._addOverlay}" style="width: 100%; padding: 12px; background: var(--secondary-background-color); border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 500;">
                    <ha-icon icon="mdi:plus"></ha-icon> Add Rule
                </button>

                <!-- Render Editor Modal if active -->
                ${this._editingOverlay !== null ? this._renderOverlayEditor() : ""}
            </div>
        `;
  }
  _formatOverlayDescription(t) {
    return t.type === "absolute" ? `When ${t.trigger_entity} is ${t.trigger_state} → Force ${t.action.hvac_mode}` : `When ${t.trigger_entity} is ${t.trigger_state} → Adjust ${t.action.temp_offset > 0 ? "+" : ""}${t.action.temp_offset}°C`;
  }
  _timeToPercent(t) {
    const [e, i] = t.split(":").map(Number);
    return (e * 60 + i) / 1440 * 100;
  }
  _computeVisualSchedule() {
    const t = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], e = {};
    return t.forEach((r) => {
      e[r] = new Array(1440).fill(0);
    }), (this._zoneData.week_profile || []).forEach((r) => {
      const [a, l] = r.start.split(":").map(Number), [n, d] = r.end.split(":").map(Number), p = a * 60 + l, c = n * 60 + d;
      r.days.forEach((_) => {
        if (e[_])
          for (let g = p; g < c; g++)
            e[_][g] = 1;
      });
    }), t.map((r) => {
      const a = [];
      let l = e[r][0] === 1 ? "day" : "night", n = 0;
      for (let d = 1; d < 1440; d++) {
        const p = e[r][d] === 1 ? "day" : "night";
        p !== l && (a.push({
          start: n / 1440 * 100,
          w: (d - n) / 1440 * 100,
          type: l
        }), l = p, n = d);
      }
      return a.push({
        start: n / 1440 * 100,
        w: (1440 - n) / 1440 * 100,
        type: l
      }), { day: r.charAt(0).toUpperCase() + r.slice(1), slots: a };
    });
  }
  _renderSchedule() {
    const t = this._computeVisualSchedule();
    return h`
        <div class="schedule-grid">
            <div class="hint-text"><ha-icon icon="mdi:gesture-tap" style="--mdc-icon-size: 16px;"></ha-icon> Tap a day to edit the schedule</div>
            ${t.map((e) => h`
                <div class="day-row hoverable" @click="${() => this._openEditor(e.day)}" data-testid="day-row-${e.day.toLowerCase()}">
                    <div class="day-label">${e.day}</div>
                    <div class="timeline">
                        ${e.slots.map((i) => h`
                            <div class="slot ${i.type}" style="width: ${i.w}%"></div>
                        `)}
                    </div>
                    <ha-icon icon="mdi:pencil" style="--mdc-icon-size: 16px; color: var(--secondary-text-color); margin-left: 8px;"></ha-icon>
                </div>
            `)}
        </div>
        <div class="legend">
            <span class="dot day"></span> Comfort
            <span class="dot night"></span> Eco
        </div>
        
        ${this._editingDay ? this._renderEditor() : ""}
    `;
  }
  _openEditor(t) {
    this._editingDay = t;
    const e = t.substring(0, 3).toLowerCase(), i = (this._zoneData.week_profile || []).filter((s) => s.days.includes(e)).map((s) => ({ ...s, days: [e] }));
    this._tempRules = JSON.parse(JSON.stringify(i));
  }
  _closeEditor() {
    this._editingDay = null, this._tempRules = [];
  }
  _addRule() {
    this._tempRules = [...this._tempRules, { start: "09:00", end: "17:00", days: [this._editingDay.substring(0, 3).toLowerCase()] }];
  }
  _removeRule(t) {
    this._tempRules = this._tempRules.filter((e, i) => i !== t);
  }
  _updateRule(t, e, i) {
    const s = [...this._tempRules];
    s[t] = { ...s[t], [e]: i }, this._tempRules = s;
  }
  async _saveSchedule() {
    if (!this._editingDay) return;
    const t = this._editingDay.substring(0, 3).toLowerCase();
    (this._zoneData.week_profile || []).filter((i) => !i.days.includes(t));
    let e = [];
    (this._zoneData.week_profile || []).forEach((i) => {
      const s = i.days.filter((r) => r !== t);
      s.length > 0 && e.push({ ...i, days: s });
    }), this._tempRules.forEach((i) => {
      e.push({ ...i, days: [t] });
    }), await this._saveZoneData({ ...this._zoneData, week_profile: e }), this._closeEditor();
  }
  _renderEditor() {
    return h`
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 100; display: flex; align-items: center; justify-content: center;">
            <div style="background: var(--card-background-color, white); padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <h3 style="margin-top: 0;">Edit ${this._editingDay}</h3>
                <p>Define "Comfort" periods. Rest is Eco.</p>
                
                <div style="max-height: 200px; overflow-y: auto; margin-bottom: 16px;">
                    ${this._tempRules.length === 0 ? h`<div style="text-align: center; padding: 20px; color: var(--secondary-text-color);">No Comfort Blocks (All Day Eco)</div>` : ""}
                    
                    ${this._tempRules.map((t, e) => h`
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;" data-testid="rule-row-${e}">
                            <input type="time" .value="${t.start}" @change="${(i) => this._updateRule(e, "start", i.target.value)}" style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);" data-testid="input-start-${e}">
                            <span>to</span>
                            <input type="time" .value="${t.end}" @change="${(i) => this._updateRule(e, "end", i.target.value)}" style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);" data-testid="input-end-${e}">
                            <ha-icon icon="mdi:delete" @click="${() => this._removeRule(e)}" style="cursor: pointer; color: var(--error-color, red);" data-testid="btn-delete-${e}"></ha-icon>
                        </div>
                    `)}
                </div>
                
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                    <button id="btn-add-rule" @click="${this._addRule}" style="flex: 1; padding: 12px; background: var(--accent-color); color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <ha-icon icon="mdi:plus"></ha-icon> Add Block
                    </button>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid var(--divider-color); padding-top: 16px;">
                    <button id="btn-cancel-editor" @click="${this._closeEditor}" style="padding: 8px 16px; background: none; border: 1px solid var(--divider-color); border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button id="btn-save-schedule" @click="${this._saveSchedule}" style="padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                </div>
            </div>
        </div>
      `;
  }
  _renderStatus() {
    const t = this._zoneData.current_temp ?? "--", e = this._zoneData.target_temp ?? "--", i = this._zoneData.hvac_action === "heating";
    return h`
        <div class="thermostat-visual">
            <div class="ring ${i ? "heating" : ""}">
                <div class="current">${t}°</div>
                <div class="target">Target: ${e}°</div>
            </div>
        </div>
        ${this._renderOverrideStatus()}
        <div>
            <h3>Logic Trace</h3>
            <p>HVAC Mode: ${this._zoneData.hvac_mode ?? "Unknown"}</p>
            <p>Action: ${this._zoneData.hvac_action ?? "Idle"}</p>
        </div>
    `;
  }
  _renderOverrideStatus() {
    if (!this._zoneData.override_end) return h``;
    const e = new Date(this._zoneData.override_end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return h`
      <div 
        @click="${this._clearOverride}"
        title="Click to cancel override"
        data-testid="status-bar-override"
        style="background: var(--warning-color, #ff9800); color: black; padding: 8px; border-radius: 8px; margin-top: 10px; text-align: center; font-weight: bold; cursor: pointer; user-select: none;">
        <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
        Manual Override (Ends ${e})
      </div>
    `;
  }
  async _clearOverride() {
    if (!(!this.hass || !this._zoneId))
      try {
        await this.hass.callWS({
          type: "adaptive_hvac/clear_manual_override",
          entry_id: this._zoneId
        });
      } catch (t) {
        console.error("Failed to clear override:", t);
      }
  }
}
y([
  Y({ attribute: !1 })
], v.prototype, "hass", 2);
y([
  m()
], v.prototype, "_config", 2);
y([
  m()
], v.prototype, "_zoneId", 2);
y([
  m()
], v.prototype, "_zoneData", 2);
y([
  m()
], v.prototype, "_runtimeData", 2);
y([
  m()
], v.prototype, "_viewMode", 2);
y([
  m()
], v.prototype, "_activeTab", 2);
y([
  m()
], v.prototype, "_scheduleView", 2);
y([
  m()
], v.prototype, "_editingDay", 2);
y([
  m()
], v.prototype, "_applyDays", 2);
y([
  m()
], v.prototype, "_editingOverlay", 2);
y([
  m()
], v.prototype, "_tempOverlay", 2);
y([
  Y({ attribute: !1 })
], v.prototype, "config", 1);
y([
  m()
], v.prototype, "_tempRules", 2);
customElements.get("adaptive-hvac-card") || customElements.define("adaptive-hvac-card", v);
export {
  v as A,
  ut as a,
  D as i,
  Y as n,
  m as r,
  h as x
};
