/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, Z = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), F = /* @__PURE__ */ new WeakMap();
let at = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = F.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && F.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (r) => new at(typeof r == "string" ? r : r + "", void 0, q), ut = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new at(e, r, q);
}, _t = (r, t) => {
  if (Z) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = N.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, G = Z ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return pt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ft, defineProperty: $t, getOwnPropertyDescriptor: gt, getOwnPropertyNames: vt, getOwnPropertySymbols: mt, getPrototypeOf: yt } = Object, m = globalThis, Q = m.trustedTypes, bt = Q ? Q.emptyScript : "", L = m.reactiveElementPolyfillSupport, P = (r, t) => r, R = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? bt : null;
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
} }, Y = (r, t) => !ft(r, t), X = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = X) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && $t(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = gt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const c = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? X;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...vt(e), ...mt(e)];
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
      for (const i of s) e.unshift(G(i));
    } else t !== void 0 && e.push(G(t));
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
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : R).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const c = s.getPropertyOptions(i), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : R;
      this._$Em = i;
      const l = a.fromAttribute(e, c.type);
      this[i] = l ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const o = this.constructor, n = this[t];
      if (s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? Y)(n, e) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
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
        const { wrapped: c } = n, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[P("elementProperties")] = /* @__PURE__ */ new Map(), E[P("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: E }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, I = z.trustedTypes, tt = I ? I.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ct = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + v, At = `<${ht}>`, w = document, U = () => w.createComment(""), M = (r) => r === null || typeof r != "object" && typeof r != "function", J = Array.isArray, xt = (r) => J(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, st = />/g, b = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, rt = /"/g, lt = /^(?:script|style|textarea|title)$/i, wt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), u = wt(1), S = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), nt = /* @__PURE__ */ new WeakMap(), A = w.createTreeWalker(w, 129);
function dt(r, t) {
  if (!J(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Et = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = T;
  for (let c = 0; c < e; c++) {
    const a = r[c];
    let l, p, h = -1, $ = 0;
    for (; $ < a.length && (n.lastIndex = $, p = n.exec(a), p !== null); ) $ = n.lastIndex, n === T ? p[1] === "!--" ? n = et : p[1] !== void 0 ? n = st : p[2] !== void 0 ? (lt.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = b) : p[3] !== void 0 && (n = b) : n === b ? p[0] === ">" ? (n = i ?? T, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, l = p[1], n = p[3] === void 0 ? b : p[3] === '"' ? rt : it) : n === rt || n === it ? n = b : n === et || n === st ? n = T : (n = b, i = void 0);
    const g = n === b && r[c + 1].startsWith("/>") ? " " : "";
    o += n === T ? a + At : h >= 0 ? (s.push(l), a.slice(0, h) + ct + a.slice(h) + v + g) : a + v + (h === -2 ? c : g);
  }
  return [dt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const c = t.length - 1, a = this.parts, [l, p] = Et(t, e);
    if (this.el = H.createElement(l, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ct)) {
          const $ = p[n++], g = i.getAttribute(h).split(v), D = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: o, name: D[2], strings: g, ctor: D[1] === "." ? Ct : D[1] === "?" ? Tt : D[1] === "@" ? Pt : j }), i.removeAttribute(h);
        } else h.startsWith(v) && (a.push({ type: 6, index: o }), i.removeAttribute(h));
        if (lt.test(i.tagName)) {
          const h = i.textContent.split(v), $ = h.length - 1;
          if ($ > 0) {
            i.textContent = I ? I.emptyScript : "";
            for (let g = 0; g < $; g++) i.append(h[g], U()), A.nextNode(), a.push({ type: 2, index: ++o });
            i.append(h[$], U());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ht) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(v, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = w.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(r, t, e = r, s) {
  var n, c;
  if (t === S) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = C(r, i._$AS(r, t.values), i, s)), t;
}
class St {
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
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? w).importNode(e, !0);
    A.currentNode = i;
    let o = A.nextNode(), n = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let l;
        a.type === 2 ? l = new k(o, o.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (l = new zt(o, this, t)), this._$AV.push(l), a = s[++c];
      }
      n !== (a == null ? void 0 : a.index) && (o = A.nextNode(), n++);
    }
    return A.currentNode = w, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class k {
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
    t = C(this, t, e), M(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : xt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(dt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const n = new St(i, this), c = n.u(this.options);
      n.p(e), this.T(c), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = nt.get(t.strings);
    return e === void 0 && nt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new k(this.O(U()), this.O(U()), this, this.options)) : s = e[i], s._$AI(o), i++;
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
class j {
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
    if (o === void 0) t = C(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = o[0], a = 0; a < o.length - 1; a++) l = C(this, c[s + a], e, a), l === S && (l = this._$AH[a]), n || (n = !M(l) || l !== this._$AH[a]), l === d ? t = d : t !== d && (t += (l ?? "") + o[a + 1]), this._$AH[a] = l;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ct extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Tt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Pt extends j {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? d) === S) return;
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
    C(this, t);
  }
}
const V = z.litHtmlPolyfillSupport;
V == null || V(H, k), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.1");
const Ot = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new k(t.insertBefore(U(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class O extends E {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
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
    return S;
  }
}
var ot;
O._$litElement$ = !0, O.finalized = !0, (ot = x.litElementHydrateSupport) == null || ot.call(x, { LitElement: O });
const W = x.litElementPolyfillSupport;
W == null || W({ LitElement: O });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: Y }, Mt = (r = Ut, t, e) => {
  const { kind: s, metadata: i } = e;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, r);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, r, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function K(r) {
  return (t, e) => typeof e == "object" ? Mt(r, t, e) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(r) {
  return K({ ...r, state: !0, attribute: !1 });
}
var Ht = Object.defineProperty, kt = Object.getOwnPropertyDescriptor, f = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? kt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && Ht(t, e, i), i;
};
class _ extends O {
  constructor() {
    super(...arguments), this._zoneData = {}, this._viewMode = "mini", this._activeTab = "status", this._scheduleView = "weekly", this._editingDay = null, this._applyDays = [];
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
  async connectedCallback() {
    super.connectedCallback(), this.hass && this._zoneId && await this._fetchZoneData();
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
          background: var(--ha-card-background, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
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
    `;
  }
  render() {
    return this._zoneId ? u`
      <div class="card">
        ${this._viewMode === "mini" ? this._renderMini() : this._renderDetail()}
      </div>
    ` : u`<ha-card>No Zone ID</ha-card>`;
  }
  _renderMini() {
    const t = this._zoneData.active;
    return u`
        <div class="zone-mini-card" @click="${() => this._viewMode = "detail"}">
            <div class="mini-header">
                <span class="zone-name">${this._config.title || "Zone " + this._zoneId}</span>
                ${t ? u`<span class="mini-badge heating"><ha-icon icon="mdi:fire"></ha-icon></span>` : u`<span class="mini-badge idle"><ha-icon icon="mdi:power-sleep"></ha-icon></span>`}
            </div>
            <div class="mini-body">
                <div class="temp-display">
                    <span class="current">${20.5}°</span>
                    <span class="target">/ ${21}°</span>
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
    return u`
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
                ${t ? u`<span class="badge heating">Heating</span>` : u`<span class="badge idle">Idle</span>`}
            </div>
        </div>

        <div class="tabs">
            <button class="${this._activeTab === "status" ? "active" : ""}" @click="${() => this._activeTab = "status"}">
                Status
            </button>
            <button class="${this._activeTab === "schedule" ? "active" : ""}" @click="${() => this._activeTab = "schedule"}">
                Schedule
            </button>
            <button class="${this._activeTab === "overlays" ? "active" : ""}" @click="${() => this._activeTab = "overlays"}">
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
      case "schedule":
        return u`<p>Schedule View (Coming Soon)</p>`;
      case "overlays":
        return u`<p>Overlay View (Coming Soon)</p>`;
    }
  }
  _renderStatus() {
    const s = this._zoneData.active;
    return u`
        <div class="thermostat-visual">
            <div class="ring ${s ? "heating" : ""}">
                <div class="current">${20.5}°</div>
                <div class="target">Target: ${21}°</div>
            </div>
        </div>
        <div>
            <h3>Logic Trace</h3>
            <p>Trace data visualization coming here...</p>
        </div>
    `;
  }
}
f([
  K({ attribute: !1 })
], _.prototype, "hass", 2);
f([
  y()
], _.prototype, "_config", 2);
f([
  y()
], _.prototype, "_zoneId", 2);
f([
  y()
], _.prototype, "_zoneData", 2);
f([
  y()
], _.prototype, "_viewMode", 2);
f([
  y()
], _.prototype, "_activeTab", 2);
f([
  y()
], _.prototype, "_scheduleView", 2);
f([
  y()
], _.prototype, "_editingDay", 2);
f([
  y()
], _.prototype, "_applyDays", 2);
f([
  K({ attribute: !1 })
], _.prototype, "config", 1);
customElements.get("adaptive-hvac-card") || customElements.define("adaptive-hvac-card", _);
export {
  _ as A,
  ut as a,
  O as i,
  K as n,
  y as r,
  u as x
};
