;(this['webpackJsonplinc-front-end'] = this['webpackJsonplinc-front-end'] || []).push([
  [0],
  {
    102: function(e, t, n) {
      e.exports = n.p + 'static/media/logo_outline.0824eb70.svg'
    },
    106: function(e, t, n) {
      e.exports = n.p + 'static/media/extension.ab2c457c.webp'
    },
    107: function(e, t, n) {
      e.exports = n.p + 'static/media/linc_heading_1.740d4c46.svg'
    },
    108: function(e, t, n) {
      e.exports = n.p + 'static/media/logo_default.e925f90a.svg'
    },
    109: function(e, t, n) {
      e.exports = n.p + 'static/media/linc_screenshot_2.58856de2.webp'
    },
    118: function(e, t, n) {
      e.exports = n(148)
    },
    123: function(e, t, n) {},
    147: function(e, t, n) {
      e.exports = n.p + 'static/media/screenshot_header.68cddab1.svg'
    },
    148: function(e, t, n) {
      'use strict'
      n.r(t)
      var a = n(0),
        r = n.n(a),
        i = n(38),
        l = n.n(i)
      Boolean(
        'localhost' === window.location.hostname ||
          '[::1]' === window.location.hostname ||
          window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
          )
      )
      n(123)
      var o = n(17),
        c = n(41),
        s = n(1),
        u = n(80),
        m = n(40),
        d = n(112),
        p = n(93),
        g = n(9),
        f = n(48),
        h = n(111),
        b = n(95),
        v = function(e) {
          if ('object' === typeof window.FAB_SETTINGS) return window.FAB_SETTINGS[e]
        },
        E = {
          GRAPHQL_ENDPOINT: window.location.host.match(/127\.0\.0\.1/)
            ? 'http://localhost:3001/graphql'
            : v('GRAPHQL_ENDPOINT') || 'https://graphql.linc.sh/graphql',
          SUBSCRIPTION_ENDPOINT:
            v('SUBSCRIPTION_ENDPOINT') || 'wss://subserver.linc.sh/graphql',
          NO_CREDENTIALS_NEEDED: v('NO_CREDENTIALS_NEEDED') || !1,
          DEMO_MODE: v('DEMO_MODE'),
          ADMIN_MODE: v('ADMIN_MODE'),
        },
        y = n(20),
        w = Object(y.m)({ loggedIn: !0 }),
        _ = new d.a({
          uri: E.GRAPHQL_ENDPOINT,
          credentials: !E.NO_CREDENTIALS_NEEDED && 'include',
        }),
        x = new p.a({ uri: E.SUBSCRIPTION_ENDPOINT, options: { reconnect: !0 } }),
        j = Object(m.d)(
          function(e) {
            var t = e.query,
              n = Object(g.l)(t),
              a = n.kind,
              r = n.operation
            return 'OperationDefinition' === a && 'subscription' === r
          },
          x,
          _
        ),
        k = Object(b.a)(function(e) {
          var t,
            n = e.networkError
          n && 401 === n.statusCode && ((t = !1), (w.loggedIn = t))
        }),
        O = new f.a({ link: k.concat(j), cache: new h.a() }),
        C = {
          bg: {
            default: '#FFFFFF',
            reverse: '#151618',
            wash: '#F4F7FC',
            border: '#D3DCE9',
            hairline: '#A2ADBE',
            inactive: '#E1E7F0',
          },
          brand: {
            default: '#713DFF',
            alt: '#6C63FF',
            wash: '#DBD8FF',
            border: '#BA73B1',
            dark: '#5B2366',
          },
          generic: { default: '#E6ECF7', alt: '#F6FBFC', border: '#C4C4C4' },
          text: {
            default: '#364863',
            alt: '#828C99',
            reverse: '#FFFFFF',
            placeholder: '#A3AFBF',
            secondary: '#647896',
            notice: '#6C63FF',
          },
          space: {
            default: '#0062D6',
            alt: '#1CD2F2',
            wash: '#E5F0FF',
            border: '#BDD8FF',
            dark: '#0e448e',
          },
          success: {
            default: '#00B88B',
            alt: '#00D5BD',
            dark: '#00663C',
            wash: '#D9FFF2',
            border: '#9FF5D9',
          },
          special: {
            default: '#E58306',
            alt: '#F1C742',
            dark: '#7D4A00',
            wash: '#FFF5E5',
            border: '#FFE6BF',
          },
          warn: {
            default: '#C21F3A',
            alt: '#E2197A',
            dark: '#85000C',
            wash: '#FFEDF6',
            border: '#f9b8c1',
          },
          social: { github: '#24292E' },
        },
        S = C,
        I = n(10),
        N = n(96),
        F = n.n(N),
        L = n(27),
        A = n(28),
        P = function(e) {
          var t = (function() {
            function e(t) {
              Object(L.a)(this, e), (this.rules = t)
            }
            return (
              Object(A.a)(e, [
                {
                  key: 'toString',
                  value: function() {
                    return this.rules
                  },
                },
              ]),
              e
            )
          })()
          return (
            Object.keys(e).forEach(function(n) {
              Object.defineProperty(t.prototype, n, {
                get: function() {
                  return new t(this.rules.concat(e[n]))
                },
              })
            }),
            new t([e.default])
          )
        },
        D =
          (P({
            d1: 'transition-duration: 100ms;',
            d2: 'transition-duration: 200ms;',
            d3: 'transition-duration: 300ms;',
            d4: 'transition-duration: 400ms;',
            d5: 'transition-duration: 500ms;',
            d6: 'transition-duration: 600ms;',
            bezier: 'transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);',
            ease: 'transition-timing-function: ease;',
            ease_in: 'transition-timing-function: ease-in;',
            ease_out: 'transition-timing-function: ease-out;',
            ease_in_out: 'transition-timing-function: ease-in-out;',
          }),
          '@media only screen and (max-width: 1170px)'),
        B = '@media only screen and (max-width: 992px)',
        $ = '@media only screen and (max-width: 768px)',
        q = '@media only screen and (max-width: 376px)',
        R = P({
          baseFontSize: 16,
          f1: 'font-size: 3rem;',
          f2: 'font-size: 2.25rem;',
          f3: 'font-size: 1.5rem;',
          f4: 'font-size: 1.25rem;',
          f5: 'font-size: 1rem;',
          f6: 'font-size: .875rem;',
          f7: 'font-size: .75rem;',
          regular: 'font-weight: 400;',
          medium: 'font-weight: 500;',
          bold: 'font-weight: 700;',
          black: 'font-weight: 900;',
          normal: 'font-style: normal;',
          italic: 'font-style: italic;',
          lh16: 'line-height: 1.6;',
          lh14: 'line-height: 1.4;',
          lh12: 'line-height: 1.2;',
          uppercase: 'text-transform: uppercase;',
          interui: "font-family: 'Inter UI', sans-serif;",
          right: 'text-align: right;',
          left: 'text-align: left;',
          center: 'text-align: center;',
          capitalise: 'text-transform: capitalize;',
          pre_line: 'white-space: pre-line;',
          nowrap: 'white-space: nowrap;',
          no_underline: 'text-decoration: none;',
          truncate:
            '\n    white-space: nowrap;\n    overflow-x: hidden;\n    text-overflow: ellipsis;\n    max-width: 100%;\n  ',
          mono:
            'font-family: "Input Mono", "Menlo", "Inconsolata", "Roboto Mono", "Consolas", monospace;',
        }),
        T = P({
          solid: 'border-style: solid;',
          dotted: 'border-style: dotted;',
          ba: 'border-style: solid; border-width: 1px;',
          bt: 'border-top-style: solid; border-top-width: 1px;',
          br: 'border-right-style: solid; border-right-width: 1px;',
          bb: 'border-bottom-style: solid; border-bottom-width: 1px;',
          bl: 'border-left-style: solid; border-left-width: 1px;',
          bn: 'border-style: none; border-width: 0;',
          br0: 'border-radius: 0;',
          br1: 'border-radius: .125rem;',
          br2: 'border-radius: .25rem;',
          br3: 'border-radius: .5rem;',
          br4: 'border-radius: 1rem;',
          br5: 'border-radius: 2rem;',
          bw0: 'border-width: 0;',
          bw1: 'border-width: .125rem;',
          bw2: 'border-width: .25rem;',
          bw3: 'border-width: .5rem;',
          bw4: 'border-width: 1rem;',
          bw5: 'border-width: 2rem;',
        }),
        z = P({
          default: 'display: flex;',
          inline: 'display: inline-flex;',
          vertical: 'flex-direction: column;',
          align_center: 'align-items: center;',
          align_start: 'align-items: flex-start;',
          align_end: 'align-items: flex-end;',
          align_baseline: 'align-items: baseline;',
          align_stretch: 'align-items: stretch;',
          center: 'justify-content: center;',
          center_both: 'justify-content: center; align-items: center;',
          justify_start: 'justify-content: flex-start;',
          justify_end: 'justify-content: flex-end;',
          justify_space_btw: 'justify-content: space-between;',
          justify_space_around: 'justify-content: space-around;',
          wrap: 'flex-wrap: wrap;',
          fg0: 'flex-grow: 0;',
          fg1: 'flex-grow: 1;',
          fg2: 'flex-grow: 2;',
        }),
        M = P({
          default: 'display: grid;',
          auto_cols:
            'grid-auto-columns: minmax(min-content, max-content); grid-auto-flow: column;',
          justify_start: 'justify-items: start;',
          align_center: 'align-items: center;',
          auto_rows: 'grid-template-rows: auto;',
          g0: 'grid-gap: 0;',
          g025: 'grid-gap: 0.25rem;',
          g05: 'grid-gap: 0.5rem;',
          g1: 'grid-gap: 1rem;',
          g15: 'grid-gap: 1.5rem;',
          g2: 'grid-gap: 2rem;',
          g3: 'grid-gap: 3rem;',
          g4: 'grid-gap: 4rem;',
        }),
        H =
          (P({
            h0: 'height: 0;',
            h1: 'height: 1rem;',
            h2: 'height: 2rem;',
            h3: 'height: 4rem;',
            h4: 'height: 8rem;',
            h5: 'height: 16rem;',
            mh1: 'min-height: 1rem;',
            mh2: 'min-height: 2rem;',
            mh3: 'min-height: 4rem;',
            mh4: 'min-height: 8rem;',
            mh5: 'min-height: 16rem;',
            h_25: 'height: 25%;',
            h_50: 'height: 50%;',
            h_75: 'height: 75%;',
            h_100: 'height: 100%;',
            vh_25: 'height: 25vh;',
            vh_50: 'height: 50vh;',
            vh_75: 'height: 75vh;',
            vh_100: 'height: 100vh;',
          }),
          P({
            w1: 'width: 1rem',
            w2: 'width: 2rem',
            w3: 'width: 4rem',
            w4: 'width: 8rem',
            w5: 'width: 16rem',
            mw1: 'min-width: 1rem',
            mw2: 'min-width: 2rem',
            mw3: 'min-width: 4rem',
            mw4: 'min-width: 8rem',
            mw5: 'min-width: 16rem',
          }),
          P({
            ma: 'margin: auto;',
            mta: 'margin-top: auto;',
            mba: 'margin-bottom: auto;',
            mla: 'margin-left: auto;',
            mra: 'margin-right: auto;',
            mva: 'margin-top: auto; margin-bottom: auto;',
            mha: 'margin-left: auto; margin-right: auto;',
            pa: 'padding: auto;',
            pta: 'padding-top: auto;',
            pba: 'padding-bottom: auto;',
            pla: 'padding-left: auto;',
            pra: 'padding-right: auto;',
            pva: 'padding-top: auto; padding-bottom: auto;',
            pha: 'padding-left: auto; padding-right: auto;',
            m0: 'margin: 0;',
            mt0: 'margin-top: 0;',
            mb0: 'margin-bottom: 0;',
            ml0: 'margin-left: 0;',
            mr0: 'margin-right: 0;',
            mv0: 'margin-top: 0; margin-bottom: 0;',
            mh0: 'margin-left: 0; margin-right: 0;',
            p0: 'padding: 0;',
            pt0: 'padding-top: 0;',
            pb0: 'padding-bottom: 0;',
            pl0: 'padding-left: 0;',
            pr0: 'padding-right: 0;',
            pv0: 'padding-top: 0; padding-bottom: 0;',
            ph0: 'padding-left: 0; padding-right: 0;',
            m025: 'margin: 0.25rem;',
            mt025: 'margin-top: 0.25rem;',
            mb025: 'margin-bottom: 0.25rem;',
            ml025: 'margin-left: 0.25rem;',
            mr025: 'margin-right: 0.25rem;',
            mv025: 'margin-top: 0.25rem; margin-bottom: 0.25rem;',
            mh025: 'margin-left: 0.25rem; margin-right: 0.25rem;',
            p025: 'padding: 0.25rem;',
            pt025: 'padding-top: 0.25rem;',
            pb025: 'padding-bottom: 0.25rem;',
            pl025: 'padding-left: 0.25rem;',
            pr025: 'padding-right: 0.25rem;',
            pv025: 'padding-top: 0.25rem; padding-bottom: 0.25rem;',
            ph025: 'padding-left: 0.25rem; padding-right: 0.25rem;',
            m05: 'margin: 0.5rem;',
            mt05: 'margin-top: 0.5rem;',
            mb05: 'margin-bottom: 0.5rem;',
            ml05: 'margin-left: 0.5rem;',
            mr05: 'margin-right: 0.5rem;',
            mv05: 'margin-top: 0.5rem; margin-bottom: 0.5rem;',
            mh05: 'margin-left: 0.5rem; margin-right: 0.5rem;',
            p05: 'padding: 0.5rem;',
            pt05: 'padding-top: 0.5rem;',
            pb05: 'padding-bottom: 0.5rem;',
            pl05: 'padding-left: 0.5rem;',
            pr05: 'padding-right: 0.5rem;',
            pv05: 'padding-top: 0.5rem; padding-bottom: 0.5rem;',
            ph05: 'padding-left: 0.5rem; padding-right: 0.5rem;',
            m066: 'margin: 0.667rem;',
            mt066: 'margin-top: 0.667rem;',
            mb066: 'margin-bottom: 0.667rem;',
            ml066: 'margin-left: 0.667rem;',
            mr066: 'margin-right: 0.667rem;',
            mv066: 'margin-top: 0.667rem; margin-bottom: 0.667rem;',
            mh066: 'margin-left: 0.667rem; margin-right: 0.667rem;',
            p066: 'padding: 0.667rem;',
            pt066: 'padding-top: 0.667rem;',
            pb066: 'padding-bottom: 0.667rem;',
            pl066: 'padding-left: 0.667rem;',
            pr066: 'padding-right: 0.667rem;',
            pv066: 'padding-top: 0.667rem; padding-bottom: 0.667rem;',
            ph066: 'padding-left: 0.667rem; padding-right: 0.667rem;',
            m1: 'margin: 1rem;',
            mt1: 'margin-top: 1rem;',
            mb1: 'margin-bottom: 1rem;',
            ml1: 'margin-left: 1rem;',
            mr1: 'margin-right: 1rem;',
            mv1: 'margin-top: 1rem; margin-bottom: 1rem;',
            mh1: 'margin-left: 1rem; margin-right: 1rem;',
            p1: 'padding: 1rem;',
            pt1: 'padding-top: 1rem;',
            pb1: 'padding-bottom: 1rem;',
            pl1: 'padding-left: 1rem;',
            pr1: 'padding-right: 1rem;',
            pv1: 'padding-top: 1rem; padding-bottom: 1rem;',
            ph1: 'padding-left: 1rem; padding-right: 1rem;',
            m15: 'margin: 1.5rem;',
            mt15: 'margin-top: 1.5rem;',
            mb15: 'margin-bottom: 1.5rem;',
            ml15: 'margin-left: 1.5rem;',
            mr15: 'margin-right: 1.5rem;',
            mv15: 'margin-top: 1.5rem; margin-bottom: 1.5rem;',
            mh15: 'margin-left: 1.5rem; margin-right: 1.5rem;',
            p15: 'padding: 1.5rem;',
            pt15: 'padding-top: 1.5rem;',
            pb15: 'padding-bottom: 1.5rem;',
            pl15: 'padding-left: 1.5rem;',
            pr15: 'padding-right: 1.5rem;',
            pv15: 'padding-top: 1.5rem; padding-bottom: 1.5rem;',
            ph15: 'padding-left: 1.5rem; padding-right: 1.5rem;',
            m2: 'margin: 2rem;',
            mt2: 'margin-top: 2rem;',
            mb2: 'margin-bottom: 2rem;',
            ml2: 'margin-left: 2rem;',
            mr2: 'margin-right: 2rem;',
            mv2: 'margin-top: 2rem; margin-bottom: 2rem;',
            mh2: 'margin-left: 2rem; margin-right: 2rem;',
            p2: 'padding: 2rem;',
            pt2: 'padding-top: 2rem;',
            pb2: 'padding-bottom: 2rem;',
            pl2: 'padding-left: 2rem;',
            pr2: 'padding-right: 2rem;',
            pv2: 'padding-top: 2rem; padding-bottom: 2rem;',
            ph2: 'padding-left: 2rem; padding-right: 2rem;',
            m3: 'margin: 3rem;',
            mt3: 'margin-top: 3rem;',
            mb3: 'margin-bottom: 3rem;',
            ml3: 'margin-left: 3rem;',
            mr3: 'margin-right: 3rem;',
            mv3: 'margin-top: 3rem; margin-bottom: 3rem;',
            mh3: 'margin-left: 3rem; margin-right: 3rem;',
            p3: 'padding: 3rem;',
            pt3: 'padding-top: 3rem;',
            pb3: 'padding-bottom: 3rem;',
            pl3: 'padding-left: 3rem;',
            pr3: 'padding-right: 3rem;',
            pv3: 'padding-top: 3rem; padding-bottom: 3rem;',
            ph3: 'padding-left: 3rem; padding-right: 3rem;',
            m4: 'margin: 4rem;',
            mt4: 'margin-top: 4rem;',
            mb4: 'margin-bottom: 4rem;',
            ml4: 'margin-left: 4rem;',
            mr4: 'margin-right: 4rem;',
            mv4: 'margin-top: 4rem; margin-bottom: 4rem;',
            mh4: 'margin-left: 4rem; margin-right: 4rem;',
            p4: 'padding: 4rem;',
            pt4: 'padding-top: 4rem;',
            pb4: 'padding-bottom: 4rem;',
            pl4: 'padding-left: 4rem;',
            pr4: 'padding-right: 4rem;',
            pv4: 'padding-top: 4rem; padding-bottom: 4rem;',
            ph4: 'padding-left: 4rem; padding-right: 4rem;',
            mt15_within: '> * + * {\n    margin-top: 1.5rem;\n  }',
          }))
      function V() {
        var e = Object(I.a)([
          '\n  ',
          ';\n  html {\n    color: ',
          ';\n    background-color: hsl(220,35%,99%);    \n    ',
          ' {\n      font-size: 16px;\n    }\n    ',
          ' {\n      font-size: 14px;\n    }\n    ',
          ' {\n      font-size: 12px;\n    }\n  }\n  button {\n    font: inherit;\n  }\n',
        ])
        return (
          (V = function() {
            return e
          }),
          e
        )
      }
      var W = { on: 'all 200ms ease-in', off: 'all 200ms ease-out' },
        U = { low: '0 2px 3px', mid: '0 4px 6px', high: '0 8px 12px' },
        G = Object(s.css)([
          "&:before{pointer-events:none;content:'';width:100%;height:100%;position:absolute;left:0;top:0;background:linear-gradient(to left,white 0%,rgba(255,255,255,0) 10%);}mix-blend-mode:multiply;",
        ]),
        Q = function(e, t) {
          var n = parseInt(e.slice(1, 3), 16),
            a = parseInt(e.slice(3, 5), 16),
            r = parseInt(e.slice(5, 7), 16)
          return t >= 0
            ? 'rgba('
                .concat(n, ', ')
                .concat(a, ', ')
                .concat(r, ', ')
                .concat(t, ')')
            : 'rgb('
                .concat(n, ', ')
                .concat(a, ', ')
                .concat(r, ')')
        },
        Y =
          (C.bg.reverse,
          ''.concat(U.low, ' ').concat(Q(C.bg.reverse, 0.2)),
          C.text.reverse,
          C.bg.reverse,
          Object(s.createGlobalStyle)(
            V(),
            F.a,
            function(e) {
              return e.theme.text.default
            },
            B,
            $,
            q
          )),
        K = n(15)
      function X(e) {
        var t = e.children,
          n = Object(K.l)().pathname
        return (
          Object(a.useEffect)(
            function() {
              window.scrollTo(0, 0)
            },
            [n]
          ),
          t
        )
      }
      var Z = Object(s.css)([
          "min-height:100vh;display:grid;grid-template-columns:16rem auto;grid-template-rows:4rem auto;grid-template-areas:'header header' 'sidebar content';",
        ]),
        J = Object(s.css)([
          "min-height:100vh;display:grid;grid-template-columns:4rem auto;grid-template-rows:4rem auto;grid-template-areas:'header header' 'sidebar content';",
        ]),
        ee = Object(s.css)([
          "min-height:100vh;display:grid;grid-template-columns:auto;grid-template-rows:4rem auto;grid-template-areas:'header' 'content';",
        ]),
        te = s.default.div.withConfig({
          displayName: 'AppLayouts__AppContainer',
          componentId: 'rg6jvb-0',
        })(['', ';', '{', ';}', '{', ';}'], Z, D, J, B, ee),
        ne = n(5)
      var ae = n(2),
        re = n.n(ae),
        ie = {
          0: '0',
          0.25: '025',
          0.5: '05',
          1: '1',
          1.5: '15',
          2: '2',
          3: '3',
          4: '4',
        },
        le = {
          padding: re.a.oneOf([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]),
          internalSpacing: re.a.oneOf([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]),
        },
        oe = { padding: 0, internalSpacing: 1 },
        ce = s.default.div.withConfig({
          displayName: 'FlexSections__FlexRow',
          componentId: 'sc-18p2tsg-0',
        })(
          [
            'display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;',
            ';> * + *{',
            '}',
          ],
          function(e) {
            var t = e.padding
            return H['p'.concat(ie[t])]
          },
          function(e) {
            var t = e.internalSpacing
            return H['ml'.concat(ie[t])]
          }
        )
      ;(ce.propTypes = le), (ce.defaultProps = oe)
      var se = s.default.div.withConfig({
        displayName: 'FlexSections__FlexCol',
        componentId: 'sc-18p2tsg-1',
      })(
        [
          'display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;',
          ';> * + *{',
          '}',
        ],
        function(e) {
          var t = e.padding
          return H['p'.concat(ie[t])]
        },
        function(e) {
          var t = e.internalSpacing
          return H['mt'.concat(ie[t])]
        }
      )
      ;(se.propTypes = le), (se.defaultProps = oe)
      var ue = s.default.header.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'm17gus-0',
        })([
          'grid-area:header;display:grid;grid-template-columns:1fr 1fr 1fr;position:sticky;top:0%;z-index:99;background:hsl(218,22%,22%);box-shadow:0 2px 4px -1px rgba(0,0,0,0.06),0 4px 5px 0 rgba(0,0,0,0.06),0 1px 10px 0 rgba(0,0,0,0.08);',
        ]),
        me = Object(s.default)(ce).withConfig({
          displayName: 'style__StyledSection',
          componentId: 'm17gus-1',
        })(['align-items:center;']),
        de = n(151),
        pe = s.default.button.withConfig({
          displayName: 'Toggle__ButtonStyle',
          componentId: 'sc-1y9cpch-0',
        })([
          'display:none;color:white;background:none;border:none;cursor:pointer;@media only screen and (max-width:992px){display:block;margin-left:1rem;}',
        ])
      function ge(e) {
        var t = e.toggleSideBar
        return r.a.createElement(
          pe,
          { onClick: t, title: 'menu' },
          r.a.createElement(de.a, null)
        )
      }
      var fe = n(102),
        he = n.n(fe),
        be = Object(s.default)(o.Link).withConfig({
          displayName: 'Brand__Container',
          componentId: 'jbjfz3-0',
        })(['', ';> * + *{', ';}text-decoration:none;'], z.align_center, H.ml1),
        ve = s.default.img.withConfig({
          displayName: 'Brand__Logo',
          componentId: 'jbjfz3-1',
        })(['height:2.6rem;margin-top:-0.2rem;', '{height:1.6rem;}'], $),
        Ee = s.default.h1.withConfig({
          displayName: 'Brand__BrandName',
          componentId: 'jbjfz3-2',
        })(
          [
            '',
            ';letter-spacing:0.1rem;text-transform:uppercase;color:',
            ';transform:scale(1.05,0.9);',
            '{display:none;}',
          ],
          R.black.f4,
          function(e) {
            return e.theme.text.reverse
          },
          $
        ),
        ye = function() {
          return r.a.createElement(
            be,
            { to: '/' },
            r.a.createElement(ve, { alt: 'Linc logo', src: he.a }),
            r.a.createElement(Ee, null, 'Linc')
          )
        },
        we =
          (s.default.a.withConfig({ displayName: 'Anchor', componentId: 'sc-1y2lymm-0' })(
            ['text-decoration:none;color:inherit;&:hover{', ';}'],
            function(e) {
              return (
                e.styleHover &&
                Object(s.css)(['color:', ';text-decoration:underline;'], function(e) {
                  return e.theme.brand.default
                })
              )
            }
          ),
          n(114)),
        _e = Object(s.default)(we.a).withConfig({
          displayName: 'Tooltip',
          componentId: 'sc-1y6sqq0-0',
        })([
          "background:#151618;color:white;&[x-placement^='right']{.tippy-arrow{border-right-color:#151618;}}&[x-placement^='left']{.tippy-arrow{border-left-color:#151618;}}&[x-placement^='top']{.tippy-arrow{border-top-color:#151618;}}&[x-placement^='bottom']{.tippy-arrow{border-bottom-color:#151618;}}",
        ]),
        xe = function(e) {
          var t = (function(e) {
            var t = (16777215 & e).toString(16).toUpperCase()
            return '00000'.substring(0, 6 - t.length) + t
          })(
            (function(e) {
              for (var t = 0, n = 0; n < e.length; n++)
                t = e.charCodeAt(n) + ((t << 5) - t)
              return t
            })(e)
          )
          return '#'.concat(t)
        },
        je = s.default.div.withConfig({
          displayName: 'SiteLogo__Container',
          componentId: 'sc-1tl75w9-0',
        })(
          ['', ';', ';min-height:2rem;min-width:2rem;background:', ';span{color:', ';}'],
          z.center_both,
          T.br2,
          function(e) {
            return e.color
          },
          function(e) {
            return e.theme.text.reverse
          }
        ),
        ke = function(e) {
          var t = e.name,
            n = 'linc-front-end' === t ? '#6C63FF' : xe(t),
            a = (function(e) {
              var t,
                n = e.split('-').filter(function(e) {
                  return '' !== e
                })
              n.length > 1
                ? (t = n[0].slice(0, 1) + n[1].slice(0, 1))
                : (t = e.slice(0, 1) + e.slice(-1))
              return t.toUpperCase()
            })(t)
          return r.a.createElement(
            je,
            { color: n },
            r.a.createElement(Xe, { weight: 'bold', tone: 'reverse' }, a)
          )
        }
      function Oe(e) {
        Object(a.useEffect)(
          function() {
            document.title = e
          },
          [e]
        )
      }
      var Ce = []
      function Se() {
        var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
          t = Object(a.useState)(e),
          n = Object(ne.a)(t, 2),
          r = n[0],
          i = n[1],
          l = function() {
            return i(function(e) {
              return !e
            })
          }
        return [r, l]
      }
      var Ie = Object(s.css)(
          [
            'min-height:1.3rem;max-height:1.3rem;min-width:1.3rem;max-width:1.3rem;border-radius:50%;',
            '{height:1.2rem;width:1.2rem;}',
            '{height:1rem;width:1rem;}',
          ],
          B,
          $
        ),
        Ne = s.default.div.withConfig({
          displayName: 'Avatar__Container',
          componentId: 'sc-1ynxsd4-0',
        })(
          ['', ';background:', ';span{color:', ';}text-decoration:none;', ''],
          z.center_both,
          function(e) {
            return e.color
          },
          function(e) {
            return e.theme.text.reverse
          },
          Ie
        ),
        Fe = s.default.img.withConfig({
          displayName: 'Avatar__StyledImage',
          componentId: 'sc-1ynxsd4-1',
        })(['position:absolute;', ''], Ie),
        Le = function(e) {
          var t = Se(!1),
            n = Object(ne.a)(t, 2),
            a = n[0],
            i = n[1],
            l = e.username,
            o = e.name,
            c = xe(o || 'unkown'),
            s = 'https://avatars2.githubusercontent.com/'.concat(l, '?v=4&s=96')
          return r.a.createElement(
            Ne,
            { color: c },
            r.a.createElement(
              Xe,
              { weight: 'bold', tone: 'reverse' },
              o ? o.slice(0, 1) : '?'
            ),
            !1 === a &&
              null !== l &&
              r.a.createElement(Fe, { alt: '', onError: i, src: s })
          )
        },
        Ae = s.default.a.withConfig({
          displayName: 'style__Container',
          componentId: 'e7r7a5-0',
        })(
          [
            '',
            ';',
            ';',
            ';border-left-width:4px;border-color:',
            ';border-left-color:',
            ';padding:0.2rem 0.4rem;transition:',
            ';svg{width:1rem;padding-right:0.5rem;color:',
            ';transition:',
            ';}background:',
            ';color:',
            ';&:hover{box-shadow:',
            ' ',
            ';color:',
            ';svg{color:',
            ';}}',
          ],
          z.align_center,
          R.no_underline.bold.f6,
          T.ba.br2,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.color
          },
          W.on,
          function(e) {
            return e.theme.text.default
          },
          W.on,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.text.default
          },
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          }
        ),
        Pe = n(152),
        De = function(e) {
          var t = e.color,
            n = e.url,
            a = e.children
          return r.a.createElement(
            Ae,
            { href: n, target: '_blank', color: t },
            r.a.createElement(Pe.a, null),
            ' ',
            a
          )
        }
      De.defaultProps = { color: '#713DFF', url: '', children: '' }
      var Be = s.default.div.withConfig({
        displayName: 'Badge',
        componentId: 'sc-1hl25ww-0',
      })(
        [
          '',
          ';',
          ';',
          ';color:white;text-decoration:none;padding:4px 6px;margin-left:1rem;text-transform:uppercase;font-weight:bold;max-height:1rem;',
          '{padding:4px 6px;font-size:.7rem;}',
          ' ',
          ' ',
          ' ',
          '',
        ],
        z.align_center,
        R.f6.bold,
        T.br2,
        $,
        function(e) {
          return (
            'red' === e.color && Object(s.css)(['background:', ';'], e.theme.warn.default)
          )
        },
        function(e) {
          return (
            'yellow' === e.color &&
            Object(s.css)(['color:black;background:', ';'], e.theme.special.alt)
          )
        },
        function(e) {
          return (
            'green' === e.color &&
            Object(s.css)(['color:black;background:', ';'], e.theme.success.default)
          )
        },
        function(e) {
          return (
            'blue' === e.color &&
            Object(s.css)(['background:', ';'], e.theme.space.default)
          )
        }
      )
      ;(Be.defaultProps = { color: 'blue' }),
        (Be.propTypes = { color: re.a.oneOf(['red', 'yellow', 'green', 'blue']) })
      var $e = Be,
        qe = Object(s.keyframes)([
          'from{transform:rotate(45deg);}to{transform:rotate(405deg);}',
        ]),
        Re = Object(s.css)(
          ['border-color:', ';border-top-color:', ';'],
          Q(C.bg.reverse, 0.25),
          Q(C.bg.default, 0.75)
        ),
        Te = Object(s.css)(
          ['border-color:', ';border-top-color:', ';'],
          Q(C.bg.reverse, 0.1),
          Q(C.brand.alt, 0.75)
        ),
        ze = s.default.div.withConfig({
          displayName: 'style__SpinnerStyle',
          componentId: 'sc-13367hs-0',
        })(
          [
            'height:',
            'rem;width:',
            'rem;background:none;border-style:solid;border-width:0.2rem;border-radius:50%;transition:all 0.2s ease 0s;animation:',
            ' 0.7s cubic-bezier(0.56,0.11,0.22,0.865) 0s infinite;',
            ';',
            ';',
          ],
          function(e) {
            return e.size
          },
          function(e) {
            return e.size
          },
          qe,
          function(e) {
            return 'monochrome' === e.color && Re
          },
          function(e) {
            return 'brand' === e.color && Te
          }
        ),
        Me = function(e) {
          var t = e.color,
            n = e.size
          return r.a.createElement(ze, { color: t, size: n })
        }
      Me.defaultProps = { size: 1, color: 'brand' }
      var He = Me,
        Ve = n(36),
        We = n(35),
        Ue = n(37),
        Ge = s.default.div.withConfig({
          displayName: 'FullPageLoader__Container',
          componentId: 'sc-1ihxe1h-0',
        })(['', ';height:calc(100vh - 20rem);'], z.vertical.fg1.center_both),
        Qe = (function(e) {
          function t() {
            return (
              Object(L.a)(this, t),
              Object(Ve.a)(this, Object(We.a)(t).apply(this, arguments))
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  return r.a.createElement(Ge, null, r.a.createElement(He, null))
                },
              },
            ]),
            t
          )
        })(a.Component),
        Ye = Object(s.css)(['display:block;margin-top:-0.17em;margin-bottom:-0.18em;']),
        Ke = s.default.span.withConfig({ displayName: 'Text', componentId: 'huszxt-0' })(
          [
            '',
            ";font-variant:tabular-nums slashed-zero;font-feature-settings:'calt','ss01','liga';color:",
            ';line-height:',
            ';',
            ';',
            ';',
            ';',
            ' code{',
            ';}strong{',
            ';}a{text-decoration:none;color:',
            ';&:hover{text-decoration:underline;}}',
            ';',
          ],
          Ye,
          function(e) {
            var t = e.theme,
              n = e.tone
            return t.text[n]
          },
          function(e) {
            return e.lineHeight
          },
          function(e) {
            var t = e.scale
            return R['f'.concat(t)]
          },
          function(e) {
            var t = e.weight
            return R[t]
          },
          function(e) {
            var t = e.fontStyle
            return R[t]
          },
          function(e) {
            return (
              e.truncate &&
              Object(s.css)([
                'white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;',
              ])
            )
          },
          R.mono.bold.normal,
          R.bold.normal,
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e['hide-below-desktop'] && Object(s.css)(['', '{display:none;}'], $)
          }
        )
      ;(Ke.propTypes = {
        scale: re.a.oneOf([1, 2, 3, 4, 5, 6]),
        weight: re.a.oneOf(['regular', 'medium', 'bold', 'black']),
        fontStyle: re.a.oneOf(['normal', 'italic']),
        lineHeight: re.a.oneOfType([re.a.string, re.a.number]),
        tone: re.a.oneOf([
          'default',
          'alt',
          'reverse',
          'placeholder',
          'secondary',
          'warn',
        ]),
        children: re.a.node,
      }),
        (Ke.defaultProps = {
          scale: 5,
          weight: 'regular',
          fontStyle: 'normal',
          lineHeight: 1.1,
          tone: 'default',
        })
      var Xe = Ke
      Ke.P = Object(s.default)(Ke.withComponent('p')).withConfig({
        displayName: 'Text__P',
        componentId: 'huszxt-1',
      })(['', ';', ''], R.lh16, function(e) {
        var t = e.lineHeight
        return t && 'line-height: '.concat(t, ';')
      })
      var Ze = s.default.div.withConfig({ displayName: 'Box', componentId: 'boave0-0' })(
        ['margin:', 'rem;padding:', 'rem;'],
        function(e) {
          return e.margin || 0
        },
        function(e) {
          return e.padding || 0
        }
      )
      ;(Ze.defaultProps = { margin: 0, padding: 0 }),
        (Ze.propTypes = {
          margin: re.a.oneOf([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]),
          padding: re.a.oneOf([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]),
        })
      var Je = Ze,
        et = Object(s.css)(
          [
            'border-style:solid;border-radius:3px;overflow-x:auto;box-shadow:',
            ' ',
            ';',
            ';a{',
            ';}background-color:',
            ';border-left-color:',
            ';border-left-width:',
            'rem;',
          ],
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          },
          function(e) {
            return e.status && Object(s.css)(['span,i,p,h2,h3,h4,a{color:inherit;}'])
          },
          R.medium,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.brand.alt
          },
          function(e) {
            return e.leftBorder
          }
        ),
        tt = Object(s.default)(Je).withConfig({
          displayName: 'StatusMessage',
          componentId: 'sc-12ngq25-0',
        })(
          ['', ';', ';', ';', ';', ';'],
          et,
          function(e) {
            return (
              'positive' === e.status &&
              Object(s.css)(
                ['background:', ';border-left-color:', ';color:', ';'],
                function(e) {
                  return e.theme.success.wash
                },
                function(e) {
                  return e.theme.success.border
                },
                function(e) {
                  return e.theme.success.dark
                }
              )
            )
          },
          function(e) {
            return (
              'critical' === e.status &&
              Object(s.css)(
                ['background:', ';border-left-color:', ';color:', ';'],
                function(e) {
                  return e.theme.warn.wash
                },
                function(e) {
                  return e.theme.warn.border
                },
                function(e) {
                  return e.theme.warn.dark
                }
              )
            )
          },
          function(e) {
            return (
              'info' === e.status &&
              Object(s.css)(
                ['background:', ';border-left-color:', ';color:', ';'],
                function(e) {
                  return e.theme.space.wash
                },
                function(e) {
                  return e.theme.space.border
                },
                function(e) {
                  return e.theme.space.dark
                }
              )
            )
          },
          function(e) {
            return (
              'warning' === e.status &&
              Object(s.css)(
                ['background:', ';border-color:', ';color:', ';'],
                function(e) {
                  return e.theme.special.wash
                },
                function(e) {
                  return e.theme.special.border
                },
                function(e) {
                  return e.theme.special.dark
                }
              )
            )
          }
        )
      ;(tt.defaultProps = { padding: 1, leftBorder: 0.5 }),
        (tt.propTypes = {
          status: re.a.oneOf(['positive', 'critical', 'warning', 'info']),
          leftBorder: re.a.oneOf([0, 0.125, 0.25, 0.5, 1]),
          children: re.a.oneOfType([re.a.object, re.a.array]).isRequired,
        }),
        (tt.ErrorMessageFromServer = Object(s.default)(Xe)
          .attrs({
            children: function(e) {
              return r.a.createElement('code', null, e.message)
            },
          })
          .withConfig({
            displayName: 'StatusMessage__ErrorMessageFromServer',
            componentId: 'sc-12ngq25-1',
          })(['', ';code{font-weight:normal;line-height:1.2;}'], H.mh2))
      var nt = tt,
        at = n(153),
        rt = n(154),
        it = n(155),
        lt = n(156),
        ot = n(157),
        ct = Object(s.keyframes)([
          '0%{transform:rotate(0);}100%{transform:rotate(360deg);}',
        ]),
        st = s.default.div.withConfig({
          displayName: 'StatusIcon__Container',
          componentId: 'sc-1ew4mc4-0',
        })(
          ['', ';svg{color:', ';', ';}', ';'],
          z.center_both,
          function(e) {
            return (function(e, t) {
              return {
                positive: t.success.default,
                critical: t.warn.default,
                warning: t.special.default,
                info: t.space.default,
                loading: t.text.default,
              }[e]
            })(e.status, e.theme)
          },
          function(e) {
            return (
              'loading' === e.status &&
              Object(s.css)(
                [
                  'animation-name:',
                  ';animation-duration:600ms;animation-iteration-count:infinite;animation-timing-function:linear;',
                ],
                ct
              )
            )
          },
          function(e) {
            return e.customCss
          }
        ),
        ut = function(e) {
          var t = e.status,
            n = e.scale,
            a = e.customCss,
            i = {
              positive: r.a.createElement(at.a, null),
              critical: r.a.createElement(rt.a, null),
              warning: r.a.createElement(it.a, null),
              info: r.a.createElement(lt.a, null),
              loading: r.a.createElement(ot.a, null),
            }
          return r.a.createElement(st, { status: t, scale: n, customCss: a }, i[t])
        },
        mt = Object(s.default)(Je).withConfig({
          displayName: 'Card',
          componentId: 'sc-191uutj-0',
        })(
          [
            'background:',
            ';border:solid 1px ',
            ';border-radius:',
            'rem;box-shadow:',
            ';',
          ],
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.borderRadius
          },
          function(e) {
            var t = e.boxShadow,
              n = e.theme
            return 'none' === t
              ? 'none'
              : ''.concat(U[t], ' ').concat(Q(n.bg.reverse, 0.2))
          }
        )
      ;(mt.defaultProps = { padding: 1, boxShadow: 'low', borderRadius: 0.25 }),
        (mt.propTypes = {
          boxShadow: re.a.oneOf(['none', 'low', 'mid', 'high']),
          borderRadius: re.a.oneOf([0, 0.125, 0.25, 0.5, 1, 2]),
        })
      var dt = mt,
        pt = n(24),
        gt = s.default.div.withConfig({
          displayName: 'style__Container',
          componentId: 'lxp2uq-0',
        })(
          ['flex-grow:', ';', ';'],
          function(e) {
            return e.size || 1
          },
          function(e) {
            var t = e.size
            return t && 'max-width: '.concat(t, 'rem;')
          }
        ),
        ft = s.default.div.withConfig({
          displayName: 'style__InnerContainer',
          componentId: 'lxp2uq-1',
        })(['position:relative;display:inline-block;min-width:100%;']),
        ht = Object(s.css)(['position:absolute;right:0.5rem;top:0;bottom:0;']),
        bt = s.default.input.withConfig({
          displayName: 'style__StyledInput',
          componentId: 'lxp2uq-2',
        })(
          [
            '',
            ';',
            ';',
            ';box-shadow:0px 1px 2px inset hsl(0,0%,90%);text-align:left;text-indent:0.5rem;min-width:100%;box-sizing:border-box;color:',
            ';border-color:',
            ';background:',
            ';&::placeholder{color:',
            ';}&:read-only{color:',
            ';background:',
            ';}&:focus{box-shadow:',
            ' 0px 0px 0px 1px;border-color:',
            ';}',
          ],
          T.ba.br2,
          H.pt05.pb05,
          R.f5,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.text.placeholder
          },
          function(e) {
            return e.theme.text.placeholder
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.default
          }
        ),
        vt = s.default.span.withConfig({
          displayName: 'style__Message',
          componentId: 'lxp2uq-3',
        })(
          [
            '',
            ';',
            ';align-self:auto;border-color:',
            ';background-color:',
            ';span{color:',
            ';}',
          ],
          H.mt05.p05,
          T.ba,
          function(e) {
            var t = e.status
            return e.theme[''.concat(t, 'Border')]
          },
          function(e) {
            var t = e.status
            return e.theme[''.concat(t, 'Message')]
          },
          function(e) {
            var t = e.status
            return e.theme[''.concat(t, 'Text')]
          }
        ),
        Et = s.default.button.withConfig({
          displayName: 'style__MaskToggle',
          componentId: 'lxp2uq-4',
        })(
          [
            '',
            ';',
            ';position:absolute;right:0;top:0;bottom:0;background:none;cursor:pointer;color:',
            ';svg{width:1rem;}&:hover{svg{color:',
            ';}}',
          ],
          T.bn.br1,
          H.ph1,
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.space.default
          }
        ),
        yt = n(158),
        wt = n(159),
        _t = (function(e) {
          function t() {
            var e, n
            Object(L.a)(this, t)
            for (var a = arguments.length, r = new Array(a), i = 0; i < a; i++)
              r[i] = arguments[i]
            return (
              ((n = Object(Ve.a)(
                this,
                (e = Object(We.a)(t)).call.apply(e, [this].concat(r))
              )).state = { revealed: !1 }),
              (n.toggleMask = function() {
                return n.setState({ revealed: !n.state.revealed })
              }),
              n
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  var e = this.props,
                    t = e.valid,
                    n = e.canBeRevealed,
                    a = e.masked,
                    i = e.message,
                    l = e.status,
                    o = e.inputProps,
                    c = e.size,
                    s = this.state.revealed,
                    u = Object(pt.a)({}, o, {
                      type: 'password',
                      value:
                        '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
                    })
                  return r.a.createElement(
                    gt,
                    { size: c },
                    r.a.createElement(
                      ft,
                      null,
                      r.a.createElement(bt, Object.assign({ valid: t }, a && !s ? u : o)),
                      l &&
                        'none' !== l &&
                        r.a.createElement(ut, { customCss: ht, status: l }),
                      a &&
                        n &&
                        r.a.createElement(
                          Et,
                          { type: 'button', onClick: this.toggleMask },
                          s
                            ? r.a.createElement(yt.a, null)
                            : r.a.createElement(wt.a, null)
                        )
                    ),
                    i && r.a.createElement(vt, { status: l }, i)
                  )
                },
              },
            ]),
            t
          )
        })(r.a.Component),
        xt =
          (s.default.label.withConfig({
            displayName: 'Toggle__Switch',
            componentId: 'sc-1tbzhwy-0',
          })([
            'position:relative;display:inline-block;width:4rem;height:2rem;input{display:none;}',
          ]),
          s.default.span.withConfig({
            displayName: 'Toggle__Slider',
            componentId: 'sc-1tbzhwy-1',
          })(
            [
              'position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;border-radius:2rem;background-color:',
              ";transition:300ms transform ease,300ms background ease;&::before{position:absolute;content:'';height:1.5rem;width:1.5rem;left:4px;bottom:4px;border-radius:50%;background-color:",
              ';transition:300ms transform ease,300ms background ease;}',
            ],
            function(e) {
              return e.theme.bg.inactive
            },
            function(e) {
              return e.theme.bg.default
            }
          )),
        jt =
          (s.default.input.withConfig({
            displayName: 'Toggle__StyledInput',
            componentId: 'sc-1tbzhwy-2',
          })(
            [
              '&:checked + ',
              '{background-color:',
              ";box-shadow:inset 0 2px 6px 0 hsla(0,0%,0%,0.2);}&:checked[type='checkbox']:disabled + ",
              "{cursor:not-allowed;}&:checked[type='checkbox']:disabled + ",
              '{box-shadow:inset 0 2px 6px 0 hsla(0,0%,0%,0.05);background-color:',
              ';}&:focus + ',
              '{box-shadow:inset 0 2px 6px 0 hsla(0,0%,0%,0.2);box-shadow:0 0 1px ',
              ';}&:checked + ',
              ':before{-webkit-transform:translateX(2rem);-ms-transform:translateX(2rem);transform:translateX(2rem);}',
            ],
            xt,
            function(e) {
              return e.theme.success.default
            },
            xt,
            xt,
            function(e) {
              return e.theme.success.border
            },
            xt,
            function(e) {
              return e.theme.space.default
            },
            xt
          ),
          function() {
            return r.a.createElement(
              $e,
              { text: 'admin mode', color: 'green', id: 'adminBadge' },
              'ADMIN MODE'
            )
          }),
        kt = function() {
          return r.a.createElement(
            _e,
            {
              content: 'See an issue? Got a feature request? Click here!',
              arrow: !0,
              placement: 'bottom',
              animation: 'fade',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(
              $e,
              {
                text: 'beta',
                color: 'red',
                as: 'a',
                href: 'https://github.com/bitgenics/linc/issues',
                target: '_blank',
                rel: 'noopener noreferrer',
                id: 'betaBadge',
              },
              'BETA'
            )
          )
        },
        Ot = function() {
          return r.a.createElement(
            _e,
            {
              content: 'You are currently viewing a demo version of Linc',
              arrow: !0,
              placement: 'bottom',
              animation: 'fade',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(
              $e,
              { text: 'demo', color: 'yellow', id: 'demoBadge' },
              'DEMO'
            )
          )
        },
        Ct = s.default.header.withConfig({
          displayName: 'Links__Container',
          componentId: 'ezghom-0',
        })(['', ';', ';> * + *{', ';}'], H.ml1, z.align_center, H.ml2),
        St = Object(s.css)(
          ['color:', ';text-decoration:none;&:hover{text-decoration:underline;}'],
          function(e) {
            return e.theme.text.reverse
          }
        ),
        It = s.default.a.withConfig({
          displayName: 'Links__Anchor',
          componentId: 'ezghom-1',
        })(['', ';', ''], R.medium, St),
        Nt = Object(s.default)(o.NavLink)
          .attrs({ activeClassName: 'active-header-link' })
          .withConfig({ displayName: 'Links__StyledNavLink', componentId: 'ezghom-2' })(
          ['', ';', ';&.', '{}'],
          St,
          R.medium.no_underline,
          'active-header-link'
        ),
        Ft = function() {
          return r.a.createElement(
            Ct,
            null,
            r.a.createElement(Nt, { to: '/sites' }, 'Sites'),
            r.a.createElement(
              It,
              {
                href: 'https://linc.sh/docs',
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              'Docs'
            )
          )
        },
        Lt = n(160),
        At = n(161),
        Pt = n(7),
        Dt = n(11),
        Bt = n.n(Dt),
        $t = Object(s.css)(
          ['background:hsla(210,40%,95%,0.75);transition:all 0.5s;', ';'],
          T.br2
        ),
        qt = Object(s.keyframes)([
          '0%{background-position:100% 0%}100%{background-position:15% 100%}',
        ]),
        Rt = s.default.div.withConfig({
          displayName: 'style__TextPlaceholderStyle',
          componentId: 'sc-16c27xp-0',
        })(
          [
            '',
            ';background:hsla(210,40%,95%,0.75);background:linear-gradient( 45deg,hsla(210,40%,95%,0.75) 0%,hsla(220,29%,90%,0.75) 33%,hsla(210,40%,95%,0.75) 66%,hsla(220,29%,90%,0.75) 100% );background-size:400% 400%;line-height:1;height:0.5rem;width:',
            'rem;animation:',
            ' ',
            'ms linear infinite;',
          ],
          $t,
          function(e) {
            return e.width
          },
          qt,
          750
        ),
        Tt = s.default.div.withConfig({
          displayName: 'style__ImagePlaceholderStyle',
          componentId: 'sc-16c27xp-1',
        })(
          [
            '',
            ';background:hsla(210,40%,95%,0.75);background:linear-gradient( 45deg,hsla(210,40%,95%,0.75) 0%,hsla(220,29%,90%,0.75) 33%,hsla(210,40%,95%,0.75) 66%,hsla(220,29%,90%,0.75) 100% );background-size:400% 400%;height:',
            'rem;width:',
            'rem;animation:',
            ' ',
            'ms linear infinite;',
          ],
          $t,
          function(e) {
            return e.height
          },
          function(e) {
            return e.width
          },
          qt,
          750
        ),
        zt = function(e, t) {
          return Math.floor(Math.random() * (t - e + 1)) + e
        },
        Mt = function(e) {
          var t = e.minWidth,
            n = e.maxWidth,
            a = zt(t, n),
            i = zt(1, 5)
          return r.a.createElement(Rt, { width: a, duration: i })
        }
      Mt.defaultProps = { maxWidth: 6, minWidth: 2 }
      var Ht = function(e) {
        var t = e.width,
          n = e.height,
          a = zt(1, 5)
        return r.a.createElement(Tt, { width: t, height: n, duration: a })
      }
      function Vt() {
        var e = Object(I.a)([
          '\n  {\n    view {\n      details {\n        is_admin\n        login\n      }\n    }\n  }\n',
        ])
        return (
          (Vt = function() {
            return e
          }),
          e
        )
      }
      Ht.defaultProps = { width: 2, height: 2 }
      var Wt = s.default.div.withConfig({
          displayName: 'UserControls__Wrapper',
          componentId: 'pr3w58-0',
        })(['position:relative;', ';'], H.ph1.ml2),
        Ut = s.default.div.withConfig({
          displayName: 'UserControls__Header',
          componentId: 'pr3w58-1',
        })([
          'display:flex;align-items:center;cursor:pointer;position:relative;svg{width:1rem;color:white;}',
        ]),
        Gt = s.default.img.withConfig({
          displayName: 'UserControls__Avatar',
          componentId: 'pr3w58-2',
        })(['', ';height:2rem;width:2rem;border-radius:50%;'], H.mr05),
        Qt = s.default.div.withConfig({
          displayName: 'UserControls__List',
          componentId: 'pr3w58-3',
        })(
          [
            '',
            ';',
            ';z-index:10;position:absolute;width:15rem;margin-top:1.5rem;right:0.5rem;border-color:',
            ';background:',
            ';box-shadow:',
            ' ',
            ';> * + *{',
            ' border-color:',
            ';&:hover{cursor:pointer;background:',
            ';span{color:white;}}}&:after,&:before{bottom:100%;left:80%;border:solid transparent;content:" ";height:0;width:0;position:absolute;pointer-events:none;}&:after{border-color:rgba(255,255,255,0);border-bottom-color:#ffffff;border-width:15px;margin-left:-15px;}&:before{border-color:rgba(211,220,233,0);border-bottom-color:#D3DCE9;border-width:16px;margin-left:-16px;}',
          ],
          T.ba.br2,
          z.vertical,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.default
          },
          U.high,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          },
          T.bt,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.space.default
          }
        ),
        Yt = s.default.div.withConfig({
          displayName: 'UserControls__ListItem',
          componentId: 'pr3w58-4',
        })(
          [
            '',
            ';cursor:default;white-space:nowrap;text-overflow:ellipsis;text-decoration:none;',
          ],
          H.p1
        ),
        Kt = Bt()(Vt())
      function Xt() {
        var e = Object(K.k)(),
          t = Object(a.useState)(!1),
          n = Object(ne.a)(t, 2),
          i = n[0],
          l = n[1],
          o = Object(Pt.c)(Kt),
          c = o.loading,
          s = o.error,
          u = o.data,
          m = E.DEMO_MODE,
          d = Object(a.useRef)(),
          p = function(e) {
            ;(d && d.current && d.current.contains(e.target)) || l(!1)
          }
        Object(a.useEffect)(function() {
          return (
            document.addEventListener('mousedown', p),
            function() {
              document.removeEventListener('mousedown', p)
            }
          )
        }, [])
        var g = function(e) {
            e(), l(!1)
          },
          f = function() {
            return e.push('/billing')
          }
        if (c)
          return r.a.createElement(
            Wt,
            null,
            r.a.createElement(Ht, { height: 2, width: 2 })
          )
        if (s) return 'error'
        if (u) {
          var h = u.view.details,
            b = h.login,
            v = h.admin
          return r.a.createElement(
            Wt,
            { ref: d },
            r.a.createElement(
              Ut,
              {
                onClick: function() {
                  return l(!i)
                },
              },
              r.a.createElement(Gt, {
                id: 'usercontrols',
                src: 'https://avatars2.githubusercontent.com/'.concat(b, '?v=4&s=96'),
                alt: 'avatar',
              }),
              i ? r.a.createElement(Lt.a, null) : r.a.createElement(At.a, null)
            ),
            i &&
              r.a.createElement(
                Qt,
                {
                  onClick: function(e) {
                    return e.stopPropagation()
                  },
                },
                r.a.createElement(
                  Yt,
                  { onClick: g },
                  r.a.createElement(
                    Xe,
                    null,
                    'Logged in as ',
                    r.a.createElement('strong', null, b)
                  )
                ),
                !m &&
                  r.a.createElement(
                    r.a.Fragment,
                    null,
                    r.a.createElement(
                      Yt,
                      {
                        onClick: function() {
                          return g(f)
                        },
                      },
                      r.a.createElement(Xe, null, 'Billing')
                    ),
                    r.a.createElement(
                      Yt,
                      { as: 'a', href: 'https://graphql.linc.sh/logout' },
                      r.a.createElement(Xe, null, 'Sign Out')
                    ),
                    v &&
                      r.a.createElement(
                        Yt,
                        {
                          onClick: function() {
                            var e = 'https://linc-front-end--'
                                .concat('admin', '--')
                                .concat('master', '.branch.linc-preview.sh'),
                              t = window.location.pathname
                            window.location = e + t
                          },
                        },
                        r.a.createElement(
                          Xe,
                          { weight: 'bold', tone: 'warn' },
                          'Switch to Admin Mode'
                        )
                      )
                  )
              )
          )
        }
      }
      function Zt(e) {
        var t = e.toggleSideBar,
          n = E.DEMO_MODE,
          a = E.ADMIN_MODE
        return r.a.createElement(
          ue,
          null,
          r.a.createElement(
            me,
            { direction: 'row' },
            r.a.createElement(ge, { toggleSideBar: t }),
            r.a.createElement(ye, null),
            n
              ? r.a.createElement(Ot, null)
              : a
              ? r.a.createElement(jt, null)
              : r.a.createElement(kt, null)
          ),
          r.a.createElement(me, null),
          r.a.createElement(
            me,
            { style: { justifyContent: 'flex-end' }, direction: 'row' },
            r.a.createElement(Ft, null),
            r.a.createElement(Xt, null)
          )
        )
      }
      var Jt = n(162),
        en = n(163),
        tn = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'sc-1syeg05-0',
        })(
          [
            'grid-area:sidebar;position:sticky;max-height:calc(100vh - ',
            ');top:',
            ';display:grid;grid-template-rows:',
            ' auto;@media only screen and (min-width:993px) and (max-width:1170px){grid-template-rows:',
            " auto;}grid-template-areas:'side-bar-header' 'side-bar-content';",
            ';box-sizing:border-box;background:',
            ';border-color:',
            ';overflow:hidden;@media only screen and (max-width:992px){transform:translateX(',
            'rem);position:absolute;z-index:99;width:16rem;height:100vh;transition:500ms ease all;box-shadow:0 0 ',
            'rem 0 black;}',
          ],
          '4rem',
          '4rem',
          '4rem',
          '4.5rem',
          T.br,
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.show ? 0 : -16
          },
          function(e) {
            return e.show ? 2 : 0
          }
        ),
        nn = s.default.div.withConfig({
          displayName: 'style__Body',
          componentId: 'sc-1syeg05-1',
        })(['grid-area:side-bar-content;']),
        an = s.default.div.withConfig({
          displayName: 'style__ClickOutside',
          componentId: 'sc-1syeg05-2',
        })(
          [
            'pointer-events:none;position:absolute;z-index:98;height:100vh;width:100%;background:none;transition:500ms ease all;@media only screen and (max-width:992px){',
            ';}',
          ],
          function(e) {
            return (
              e.show &&
              Object(s.css)([
                'display:block;pointer-events:auto;background:black;opacity:0.5;',
              ])
            )
          }
        ),
        rn = s.default.div.withConfig({
          displayName: 'Header__Wrapper',
          componentId: 'sc-4x0d8o-0',
        })(
          [
            'grid-area:side-bar-header;',
            ';',
            ';height:',
            ';@media only screen and (min-width:993px) and (max-width:1170px){height:',
            ';}',
          ],
          H.ph1,
          z.justify_space_btw.align_center,
          '4rem',
          '4.5rem'
        ),
        ln = Object(s.default)(o.Link).withConfig({
          displayName: 'Header__StyledLink',
          componentId: 'sc-4x0d8o-1',
        })(
          [
            'text-decoration:none;color:',
            ';&:hover{color:',
            ';span{color:',
            ';}}color:',
            ';svg{width:1.2rem;}',
            '',
          ],
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.text.hairline
          },
          function(e) {
            return (
              e.hiddenOnTablet &&
              Object(s.css)([
                '@media only screen and (max-width:1170px){display:none;}@media only screen and (max-width:992px){display:flex;}',
              ])
            )
          }
        ),
        on = s.default.div.withConfig({
          displayName: 'Header__VisibleTabletOnly',
          componentId: 'sc-4x0d8o-2',
        })(
          [
            'display:none;color:',
            ';svg{color:',
            ';height:1.2rem;}@media only screen and (min-width:993px) and (max-width:1170px){display:flex;flex-direction:column;align-items:center;justify-content:flex-end;width:100%;padding-top:0.5rem;> * + *{margin-top:0.6667rem;}}',
          ],
          function(e) {
            return e.theme.text.hairline
          },
          function(e) {
            return e.theme.text.hairline
          }
        ),
        cn = Object(a.forwardRef)(function(e, t) {
          return r.a.createElement(
            ln,
            Object.assign({ innerRef: t, to: '/sites' }, e),
            r.a.createElement(Xe, { weight: 'medium' }, 'Sites')
          )
        })
      cn.displayName = 'SitesLink'
      var sn = Object(a.forwardRef)(function(e, t) {
        return r.a.createElement(
          ln,
          Object.assign({ innerRef: t, to: '/sites' }, e),
          r.a.createElement(Jt.a, null)
        )
      })
      sn.displayName = 'AltAllSitesLink'
      var un = Object(a.forwardRef)(function(e, t) {
        return r.a.createElement(
          ln,
          Object.assign({ innerRef: t, to: '/create' }, e),
          r.a.createElement(en.a, null)
        )
      })
      un.displayName = 'CreateNewSiteLink'
      var mn = function() {
        return r.a.createElement(
          on,
          null,
          r.a.createElement(
            _e,
            {
              arrow: !0,
              content: 'View all sites',
              placement: 'right',
              animation: 'scale',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(sn, null)
          ),
          r.a.createElement(
            _e,
            {
              arrow: !0,
              content: 'Create a site',
              placement: 'right',
              animation: 'scale',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(un, null)
          )
        )
      }
      function dn() {
        return r.a.createElement(
          rn,
          null,
          r.a.createElement(
            _e,
            {
              content: 'View all sites',
              arrow: !0,
              placement: 'right',
              animation: 'scale',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(cn, { hiddenOnTablet: !0 })
          ),
          r.a.createElement(
            _e,
            {
              arrow: !0,
              content: 'Create a site',
              placement: 'right',
              animation: 'scale',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(un, { hiddenOnTablet: !0 })
          ),
          r.a.createElement(mn, null)
        )
      }
      var pn = n(57),
        gn = n(115),
        fn = Object(s.css)(
          [
            '',
            ';',
            ';text-decoration:none;box-sizing:border-box;max-width:16rem;> * + *{',
            ';}section{> span{color:hsl(214,10%,55%);}}',
          ],
          z.align_center,
          H.pv1.ph1,
          H.ml1
        ),
        hn = Object(s.css)(
          [
            '&.',
            '{background:',
            ';box-shadow:',
            ' 0px -1px 0px inset,',
            ' 0px -1px 0px;section{span{color:',
            ';}}}',
          ],
          'active-link',
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.text.default
          }
        ),
        bn = Object(s.css)(
          [
            '&:hover{background:',
            ';box-shadow:',
            ' 0px -1px 0px inset,',
            ' 0px -1px 0px;section{span{color:',
            ';}}}',
          ],
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.text.default
          }
        ),
        vn = s.default.div.withConfig({
          displayName: 'Link__ExpandedContainerPlaceholder',
          componentId: 'ajiir6-0',
        })(
          [
            '',
            ';',
            ';@media only screen and (max-width:1170px){display:none;}@media only screen and (max-width:992px){display:flex;}',
          ],
          fn,
          bn
        ),
        En = Object(s.default)(function(e) {
          var t = Object.assign({}, e)
          return r.a.createElement(o.NavLink, t)
        })
          .attrs({ activeClassName: 'active-link' })
          .withConfig({
            displayName: 'Link__ExpandedContainer',
            componentId: 'ajiir6-1',
          })(
          [
            '',
            ';',
            ';',
            ';@media only screen and (max-width:1170px){display:none;}@media only screen and (max-width:992px){display:flex;}',
          ],
          fn,
          hn,
          bn
        ),
        yn = s.default.div.withConfig({
          displayName: 'Link__ContractedContainerPlaceholder',
          componentId: 'ajiir6-2',
        })(
          [
            '',
            ';',
            ';display:none;@media only screen and (max-width:1170px){display:flex;}@media only screen and (max-width:992px){display:none;}',
          ],
          fn,
          bn
        ),
        wn = Object(s.default)(function(e) {
          var t = Object.assign({}, e)
          return r.a.createElement(o.NavLink, t)
        })
          .attrs({ activeClassName: 'active-link' })
          .withConfig({
            displayName: 'Link__ContractedContainer',
            componentId: 'ajiir6-3',
          })(
          [
            '',
            ';',
            ';',
            ';display:none;@media only screen and (max-width:1170px){display:flex;}@media only screen and (max-width:992px){display:none;}',
          ],
          fn,
          hn,
          bn
        ),
        _n = s.default.div.withConfig({
          displayName: 'Link__Left',
          componentId: 'ajiir6-4',
        })(['']),
        xn = s.default.section.withConfig({
          displayName: 'Link__Right',
          componentId: 'ajiir6-5',
        })(
          ['', ';white-space:nowrap;min-width:0;max-width:15rem;> * + *{', ';}'],
          z.vertical,
          H.mt025
        ),
        jn = (function(e) {
          function t() {
            return (
              Object(L.a)(this, t),
              Object(Ve.a)(this, Object(We.a)(t).apply(this, arguments))
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  var e = this.props,
                    t = e.loading,
                    n = e.setShow,
                    a = e.sitename,
                    i = e.repositoryName,
                    l = Object(gn.a)(e, [
                      'loading',
                      'setShow',
                      'sitename',
                      'repositoryName',
                    ])
                  return t
                    ? r.a.createElement(
                        r.a.Fragment,
                        null,
                        r.a.createElement(
                          vn,
                          null,
                          r.a.createElement(_n, null, r.a.createElement(Ht, null)),
                          r.a.createElement(
                            xn,
                            null,
                            r.a.createElement(Mt, null),
                            r.a.createElement(Mt, null)
                          )
                        ),
                        r.a.createElement(yn, null, r.a.createElement(Ht, null))
                      )
                    : r.a.createElement(
                        r.a.Fragment,
                        null,
                        r.a.createElement(
                          En,
                          Object.assign({}, l, {
                            title: a,
                            onClick: function() {
                              return n(!1)
                            },
                          }),
                          r.a.createElement(_n, null, r.a.createElement(ke, { name: a })),
                          r.a.createElement(
                            xn,
                            null,
                            r.a.createElement(
                              Xe,
                              { weight: 'medium', truncate: !0, lineHeight: 1.2 },
                              a
                            ),
                            r.a.createElement(
                              Xe,
                              {
                                scale: 6,
                                tone: 'secondary',
                                truncate: !0,
                                lineHeight: 1.2,
                              },
                              i
                            )
                          )
                        ),
                        r.a.createElement(
                          wn,
                          Object.assign({}, l, {
                            title: a,
                            onClick: function() {
                              return n(!1)
                            },
                          }),
                          r.a.createElement(ke, { name: a })
                        )
                      )
                },
              },
            ]),
            t
          )
        })(a.Component),
        kn = Object(a.createContext)({
          isExpanded: !1,
          setIsExpanded: function() {
            return null
          },
        }),
        On = Object(s.css)(
          [
            'overflow-y:auto;height:',
            ';@media only screen and (min-width:993px) and (max-width:1170px){height:',
            ';}padding-top:1px;',
          ],
          'calc(100vh - '.concat('4rem', ' - ').concat('4rem', ')'),
          'calc(100vh - '.concat('4rem', ' - ').concat('4.5rem', ')')
        ),
        Cn = s.default.div.withConfig({
          displayName: 'SiteLinks__LoadingContainer',
          componentId: 'dfl21f-0',
        })(['', ';'], On),
        Sn = Object(s.default)(pn.a).withConfig({
          displayName: 'SiteLinks__StyledFlipMove',
          componentId: 'dfl21f-1',
        })(['', ';'], On),
        In = function(e, t) {
          var n = function(e) {
              var t, n
              return null === e || void 0 === e
                ? void 0
                : null === (t = e.commitsFeed) || void 0 === t
                ? void 0
                : null === (n = t.commits[0]) || void 0 === n
                ? void 0
                : n.timestamp
            },
            a = n(e) || 0
          return (n(t) || 0) - a
        },
        Nn = function(e) {
          var t = e.loading,
            n = e.setShow,
            i = e.sites,
            l = Object(a.useContext)(kn).isExpanded
          return t
            ? r.a.createElement(
                Cn,
                null,
                r.a.createElement(jn, { loading: !0 }),
                r.a.createElement(jn, { loading: !0 }),
                r.a.createElement(jn, { loading: !0 })
              )
            : r.a.createElement(
                Sn,
                {
                  duration: 200,
                  easing: 'ease-out',
                  staggerDelayBy: 40,
                  appearAnimation: 'fade',
                  enterAnimation: 'elevator',
                  leaveAnimation: 'elevator',
                },
                i.sort(In).map(function(e) {
                  return (function(e, t, n) {
                    return e
                      ? r.a.createElement(jn, {
                          key: e.name,
                          setShow: n,
                          sitename: e.name,
                          isExpanded: t,
                          to: '/sites/'.concat(e.name),
                          repositoryName: e.repository_name,
                        })
                      : null
                  })(e, l, n)
                })
              )
        },
        Fn = s.default.div.withConfig({
          displayName: 'NoSites__Container',
          componentId: 'sc-1t4eea0-0',
        })(
          ['', ';', ';text-align:center;', '{background:red;display:none;}'],
          z.vertical.fg1,
          H.p2.pt4.mt15_within,
          D
        ),
        Ln = function() {
          return r.a.createElement(
            Fn,
            null,
            r.a.createElement(Xe, { tone: 'placeholder' }, 'No starred sites')
          )
        }
      function An() {
        var e = Object(I.a)([
          '\n  fragment Environments on Site {\n    environments {\n      auto_deploy\n      sitename\n      env_name\n      created_at\n      settings {\n        name\n        value\n      }\n    }\n  }\n',
        ])
        return (
          (An = function() {
            return e
          }),
          e
        )
      }
      function Pn() {
        var e = Object(I.a)([
          '\n  fragment ReleaseStatus on Site {\n    releaseStatusV2 {\n      modified_at\n      release_branch\n      current_release {\n        bundle_id\n        deployed_at\n      }\n      commit {\n        repo_url\n        timestamp\n        author {\n          email\n          name\n          username\n        }\n        commit_sha\n        branch\n        message\n      }\n      deployment_statuses {\n        deploy_target_name\n        message\n        status\n        timestamp\n      }\n    }\n  }\n',
        ])
        return (
          (Pn = function() {
            return e
          }),
          e
        )
      }
      function Dn() {
        var e = Object(I.a)([
          '\n  fragment Tests on Commit {\n    tests {\n      sitename\n      started_at\n      tree_id\n      test_results {\n        command\n        description\n        started_at\n        status\n        type\n        logs {\n          err\n          cmd\n          log\n          time\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Dn = function() {
            return e
          }),
          e
        )
      }
      function Bn() {
        var e = Object(I.a)([
          '\n  fragment Build on Commit {\n    build {\n      sitename\n      bundle_id\n      finished_at\n      started_at\n      status\n      tree_id\n      logs {\n        cmd\n        log\n        time\n      }\n    }\n  }\n',
        ])
        return (
          (Bn = function() {
            return e
          }),
          e
        )
      }
      function $n() {
        var e = Object(I.a)([
          '\n  fragment HeadCommit on Commit {\n    head_commit {\n      author {\n        name\n        username\n      }\n      message\n      timestamp\n      url\n      id\n    }\n  }\n',
        ])
        return (
          ($n = function() {
            return e
          }),
          e
        )
      }
      var qn = Bt()($n()),
        Rn = Bt()(Bn()),
        Tn = Bt()(Dn()),
        zn = (Bt()(Pn()), Bt()(An()))
      function Mn() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        starred\n        repository_name\n      }\n    }\n  }\n',
        ])
        return (
          (Mn = function() {
            return e
          }),
          e
        )
      }
      function Hn() {
        var e = Object(I.a)([
          '\n  {\n    view {\n      sites {\n        commitsFeed(limit: 1) {\n          commits {\n            timestamp\n          }\n        }\n        repository_name\n        name\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        starred\n        created_at\n      }\n    }\n  }\n',
        ])
        return (
          (Hn = function() {
            return e
          }),
          e
        )
      }
      function Vn() {
        var e = Object(I.a)([
          '\n  {\n    view {\n      allSites {\n        name\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        starred\n        created_at\n        commitsFeed(limit: 1) {\n          commits {\n            timestamp\n          }\n        }\n        repository_name\n      }\n    }\n  }\n',
        ])
        return (
          (Vn = function() {
            return e
          }),
          e
        )
      }
      function Wn() {
        var e = Object(I.a)([
          '\n  {\n    view {\n      github {\n        installations {\n          account {\n            avatar_url\n            login\n          }\n          id\n          repositories {\n            id\n            owner {\n              id\n              login\n              avatar_url\n            }\n            name\n            default_branch\n            full_name\n            private\n            fork\n            pushed_at\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Wn = function() {
            return e
          }),
          e
        )
      }
      function Un() {
        var e = Object(I.a)([
          '\n  query getSite($name: String!) {\n    view {\n      site(name: $name) {\n        name\n      }\n    }\n  }\n',
        ])
        return (
          (Un = function() {
            return e
          }),
          e
        )
      }
      function Gn() {
        var e = Object(I.a)([
          '\n  ',
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        ...Environments\n      }\n    }\n  }\n',
        ])
        return (
          (Gn = function() {
            return e
          }),
          e
        )
      }
      function Qn() {
        var e = Object(I.a)([
          '\n  ',
          '\n  query($name: String!, $limit: Int!) {\n    view {\n      site(name: $name) {\n        settings {\n          external_ci_settings {\n            external_ci_enabled\n            fab_upload_api_key\n          }\n        }\n        environments {\n          env_name\n        }\n        commitsFeed(limit: $limit) {\n          commits {\n            branch\n            commit_sha\n            tree_id\n            ...HeadCommit\n            build {\n              bundle_id\n              sitename\n              finished_at\n              started_at\n              status\n            }\n            tests {\n              started_at\n              test_results {\n                status\n                type\n              }\n            }\n            pull_request {\n              url\n              number\n              pr_created_at\n            }\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Qn = function() {
            return e
          }),
          e
        )
      }
      function Yn() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        releaseStatusV2 {\n          is_configured\n          sitename\n          modified_at\n          release_branch\n          current_release {\n            bundle_id\n            deployed_at\n          }\n          commit {\n            repo_url\n            timestamp\n            author {\n              name\n              username\n            }\n            commit_sha\n            branch\n            message\n          }\n          deployment_statuses {\n            deploy_target_name\n            message\n            status\n            timestamp\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Yn = function() {
            return e
          }),
          e
        )
      }
      function Kn() {
        var e = Object(I.a)([
          '\n  ',
          '\n  ',
          '\n  ',
          '\n  query($sitename: String!, $limit: Int!, $cursor: String, $branch: String) {\n    view {\n      site(name: $sitename) {\n        environments {\n          env_name\n        }\n        commitsFeed(limit: $limit, cursor: $cursor, branch: $branch) {\n          cursor\n          hasNextPage\n          commits {\n            branch\n            commit_sha\n            tree_id\n            timestamp\n            ...HeadCommit\n            ...Build\n            ...Tests\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Kn = function() {
            return e
          }),
          e
        )
      }
      function Xn() {
        var e = Object(I.a)([
          '\n  ',
          '\n  ',
          '\n  ',
          '\n  query($sitename: String!, $commit_sha: String!) {\n    view {\n      site(name: $sitename) {\n        environments {\n          env_name\n        }\n        commit(commit_sha: $commit_sha) {\n          tree_id\n          branch\n          commit_sha\n          repository\n          bundle {\n            allBundleFeedback {\n              author_name\n              bundle_id\n              comment\n              created_at\n              current_url\n              screenshot_url\n              sitename\n              uuid\n              associated_commits\n              associated_branches\n              browser_metadata {\n                height\n                innerHeight\n                innerWidth\n                scrollX\n                scrollY\n                userAgent\n                width\n              }\n            }\n          }\n          ...Tests\n          ...HeadCommit\n          ...Build\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Xn = function() {
            return e
          }),
          e
        )
      }
      function Zn() {
        var e = Object(I.a)([
          '\n  query checkUniqueness($name: String) {\n    siteExists(name: $name)\n  }\n',
        ])
        return (
          (Zn = function() {
            return e
          }),
          e
        )
      }
      Bt()(Zn())
      var Jn = Bt()(Xn(), qn, Rn, Tn),
        ea = Bt()(Kn(), qn, Rn, Tn),
        ta = Bt()(Yn()),
        na = Bt()(Qn(), qn),
        aa = Bt()(Gn(), zn),
        ra = (Bt()(Un()), Bt()(Wn())),
        ia = Bt()(Vn()),
        la = Bt()(Hn()),
        oa = Bt()(Mn())
      function ca(e) {
        var t = e.show,
          n = e.setShow,
          a = e.node,
          i = Object(Pt.c)(la, { fetchPolicy: 'cache-first' }),
          l = i.loading,
          o = i.error,
          c = i.data
        if (l)
          return r.a.createElement(
            tn,
            { show: t, ref: a },
            r.a.createElement(dn, null),
            r.a.createElement(Nn, { loading: !0 })
          )
        if (o)
          return r.a.createElement(
            tn,
            { show: t, ref: a },
            r.a.createElement(dn, null),
            r.a.createElement(nn, null, o.message)
          )
        if (c) {
          var s = c.view.sites
          return r.a.createElement(
            r.a.Fragment,
            null,
            r.a.createElement(
              tn,
              { show: t, ref: a },
              r.a.createElement(dn, null),
              s.length > 0
                ? r.a.createElement(Nn, { setShow: n, sites: s })
                : r.a.createElement(Ln, null)
            ),
            r.a.createElement(an, { show: t })
          )
        }
      }
      function sa() {
        var e = Object(K.l)().search
        return e.includes('setup_action=update')
          ? r.a.createElement(K.c, { to: '/create' })
          : e.includes('setup_action=install')
          ? r.a.createElement(K.c, { to: '/create' })
          : r.a.createElement(K.c, { to: '/' })
      }
      var ua = Object(s.default)(Je).withConfig({
        displayName: 'Stack',
        componentId: 'sc-1ey8t2e-0',
      })(
        ['display:grid;grid-template-columns:auto;grid-gap:', 'rem;align-items:', ';'],
        function(e) {
          return e.gap
        },
        function(e) {
          var t = e.align
          return t || 'start'
        }
      )
      ;(ua.defaultProps = { gap: 1 }),
        (ua.propTypes = { gap: re.a.oneOf([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]) })
      var ma = ua,
        da = n(164),
        pa = n(165),
        ga = s.default.div.withConfig({
          displayName: 'Providers__Wrapper',
          componentId: 'x8x27-0',
        })(['display:grid;grid-template-columns:repeat(2,10rem);grid-gap:1rem;']),
        fa = Object(s.default)(o.Link).withConfig({
          displayName: 'Providers__ProviderButton',
          componentId: 'x8x27-1',
        })(
          [
            '',
            ';',
            ';',
            ';border-color:',
            ';background:',
            ';cursor:pointer;transition:200ms ease all;color:',
            ';text-decoration:none;svg{height:1rem;width:1rem;}span{color:inherit;}> * + *{',
            ';}&:active{transform:translateY(0.1rem);background:',
            ';box-shadow:none;}&:hover{color:',
            ';border-color:',
            ';}box-shadow:',
            ' ',
            ';',
          ],
          z.center_both,
          T.ba.br2,
          H.pv1,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.text.default
          },
          H.ml05,
          function(e) {
            return e.theme.brand.wash
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.default
          },
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          }
        )
      function ha() {
        var e = {
          arrow: !0,
          placement: 'bottom',
          animation: 'fade',
          animateFill: !1,
          duration: [250, 175],
          delay: [150, 0],
          distance: 8,
        }
        return r.a.createElement(
          ma,
          { gap: 1 },
          r.a.createElement(
            Xe,
            { weight: 'medium' },
            'Select where your frontend code is hosted:'
          ),
          r.a.createElement(
            ga,
            null,
            r.a.createElement(
              _e,
              Object.assign(
                {
                  content:
                    'When you push to GitHub, we will build your commits and deploy the results.',
                },
                e
              ),
              r.a.createElement(
                fa,
                { to: '/create/github' },
                r.a.createElement(da.a, null),
                r.a.createElement(Xe, null, 'GitHub')
              )
            ),
            r.a.createElement(
              _e,
              Object.assign(
                {
                  content:
                    'Build your commits on aother CI platform, then upload the result to Linc.',
                },
                e
              ),
              r.a.createElement(
                fa,
                { to: '/create/other' },
                r.a.createElement(pa.a, null),
                r.a.createElement(Xe, null, 'Other')
              )
            )
          )
        )
      }
      var ba = 'missing_extension'
      function va(e) {
        var t = Object(a.useState)(e + 'package.json'),
          n = Object(ne.a)(t, 2),
          r = n[0],
          i = n[1],
          l = Object(a.useState)(!0),
          o = Object(ne.a)(l, 2),
          c = o[0],
          s = o[1],
          u = Object(a.useState)([]),
          m = Object(ne.a)(u, 2),
          d = m[0],
          p = m[1]
        Object(a.useEffect)(
          function() {
            var e = []
            r.includes('/package.json') || (s(!1), e.push(ba)),
              r.length > 0 && r.includes('/package.json') && s(!0),
              p(e)
          },
          [r]
        )
        return {
          value: r,
          setPath: i,
          errors: d,
          isValid: c,
          legalPathName: function() {
            if (r.length > 0)
              return r[0].includes('/')
                ? r.replace('package.json', '')
                : '/' + r.replace('package.json', '')
          },
        }
      }
      var Ea = n(166)
      function ya(e) {
        return e
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '')
          .replace(/^[^a-zA-Z0-9]+/g, '')
          .replace(/-+$/, '')
          .replace(/--+/g, '-')
          .toLowerCase()
      }
      function wa() {
        var e = Object(I.a)([
          '\n  query checkUniqueness($name: String) {\n    siteExists(name: $name)\n  }\n',
        ])
        return (
          (wa = function() {
            return e
          }),
          e
        )
      }
      var _a = Bt()(wa()),
        xa = 'loading',
        ja = 'positive',
        ka = 'critical'
      function Oa(e) {
        var t = Object(Pt.a)(),
          n = Object(a.useState)(e),
          r = Object(ne.a)(n, 2),
          i = r[0],
          l = r[1],
          o = Object(a.useState)(),
          c = Object(ne.a)(o, 2),
          s = c[0],
          u = c[1],
          m = Object(a.useState)(!1),
          d = Object(ne.a)(m, 2),
          p = d[0],
          g = d[1],
          f = Object(Ea.a)(function(e) {
            return l(e)
          }, 500),
          h = Object(ne.a)(f, 1)[0]
        Object(a.useEffect)(
          function() {
            i.length > 0 &&
              (g(!0),
              t.query({ query: _a, variables: { name: ya(i) } }).then(function(e) {
                var t = e.data
                g(!1), !0 === t.siteExists && u(!1), !1 === t.siteExists && u(!0)
              }))
          },
          [i, t]
        )
        var b = ya(i),
          v = (function(e, t, n) {
            if (e.length > 0) {
              if (!0 === t) return xa
              if (!0 === n) return ja
              if (!1 === n) return ka
            }
          })(i, p, s),
          E = b.length > 0 && !0 === s && !1 === p
        return {
          unique: s,
          status: v,
          legalValue: b,
          setValue: h,
          loading: p,
          value: i,
          isValid: E,
        }
      }
      function Ca() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: FeedbackSettingsInput!) {\n    updateFeedbackSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Ca = function() {
            return e
          }),
          e
        )
      }
      function Sa() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $tree_id: String!) {\n    rebuildCommit(sitename: $sitename, tree_id: $tree_id)\n  }\n',
        ])
        return (
          (Sa = function() {
            return e
          }),
          e
        )
      }
      function Ia() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: BuildConfigInput!) {\n    updateBuildConfig(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Ia = function() {
            return e
          }),
          e
        )
      }
      function Na() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: SlackSettingsInput!) {\n    updateSlackSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Na = function() {
            return e
          }),
          e
        )
      }
      function Fa() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: GeneralSiteSettingsInput!) {\n    updateGeneralSiteSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Fa = function() {
            return e
          }),
          e
        )
      }
      function La() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: GithubSettingsInput!) {\n    updateGithubSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (La = function() {
            return e
          }),
          e
        )
      }
      function Aa() {
        var e = Object(I.a)([
          '\n  mutation deleteEnvironment($sitename: String!, $env_name: String!) {\n    deleteEnvironment(sitename: $sitename, env_name: $env_name)\n  }\n',
        ])
        return (
          (Aa = function() {
            return e
          }),
          e
        )
      }
      function Pa() {
        var e = Object(I.a)([
          '\n  mutation updateEnvironment($input: EnvironmentInput) {\n    updateEnvironment(input: $input)\n  }\n',
        ])
        return (
          (Pa = function() {
            return e
          }),
          e
        )
      }
      function Da() {
        var e = Object(I.a)([
          '\n  mutation createNewEnvironment($input: EnvironmentInput) {\n    createNewEnvironment(input: $input)\n  }\n',
        ])
        return (
          (Da = function() {
            return e
          }),
          e
        )
      }
      function Ba() {
        var e = Object(I.a)([
          '\n  mutation removeSiteFromUser($name: String!) {\n    removeSiteFromUser(name: $name) {\n      newSites\n    }\n  }\n',
        ])
        return (
          (Ba = function() {
            return e
          }),
          e
        )
      }
      function $a() {
        var e = Object(I.a)([
          '\n  mutation addSiteToUser($name: String!) {\n    addSiteToUser(name: $name) {\n      newSites\n    }\n  }\n',
        ])
        return (
          ($a = function() {
            return e
          }),
          e
        )
      }
      function qa() {
        var e = Object(I.a)([
          '\n  mutation createNewSite($input: SiteInput!) {\n    createNewSite(input: $input)\n  }\n',
        ])
        return (
          (qa = function() {
            return e
          }),
          e
        )
      }
      function Ra() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $deploy_target_name: String!) {\n    deleteDeployConfig(\n      sitename: $sitename\n      deploy_target_name: $deploy_target_name\n    )\n  }\n',
        ])
        return (
          (Ra = function() {
            return e
          }),
          e
        )
      }
      function Ta() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: CloudflareInput!) {\n    updateCloudflareConfig(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Ta = function() {
            return e
          }),
          e
        )
      }
      function za() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: LambdaInput!) {\n    updateLambdaConfig(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (za = function() {
            return e
          }),
          e
        )
      }
      Bt()(za()), Bt()(Ta()), Bt()(Ra())
      var Ma = Bt()(qa()),
        Ha = Bt()($a()),
        Va = Bt()(Ba()),
        Wa = Bt()(Da()),
        Ua = Bt()(Pa()),
        Ga = Bt()(Aa()),
        Qa = (Bt()(La()), Bt()(Fa()), Bt()(Na()), Bt()(Ia()), Bt()(Sa())),
        Ya = Bt()(Ca()),
        Ka = Object(s.css)(
          [
            '',
            ';',
            ';',
            ';',
            ';',
            ';transition:',
            ';flex:none;align-self:center;white-space:nowrap;word-break:keep-all;cursor:pointer;line-height:1;position:relative;text-align:center;',
            ';padding:',
            ';&:hover{transition:',
            ';box-shadow:',
            ';opacity:',
            ';}',
          ],
          R.bold,
          z.center_both,
          T.br1,
          H.pv05.ph1,
          T.bn,
          W.off,
          function(e) {
            return e.large ? R.f4 : R.f5
          },
          function(e) {
            return e.large ? '.66rem 1.5rem' : '0.5rem 1rem'
          },
          W.on,
          function(e) {
            return e.disabled
              ? 'none'
              : ''.concat(U.high, ' ').concat(Q(e.theme.bg.reverse, 0.15))
          },
          function(e) {
            return e.disabled ? '0.5' : '1'
          }
        ),
        Xa = s.default.span.withConfig({
          displayName: 'style__Label',
          componentId: 'jy5cnz-0',
        })(
          [
            'display:block;flex:0 0 auto;line-height:inherit;color:inherit;',
            ';align-self:center;margin:auto;',
          ],
          function(e) {
            return e.loading ? 'opacity: 0;' : 'opacity: 1;'
          }
        ),
        Za = s.default.button.withConfig({
          displayName: 'style__StyledSolidButton',
          componentId: 'jy5cnz-1',
        })(
          [
            '',
            ';background-color:',
            ';background-image:',
            ';',
            ';color:',
            ';&:hover{background-color:',
            ';}&:active{box-shadow:',
            ';}',
          ],
          Ka,
          function(e) {
            return e.disabled ? e.theme.bg.inactive : e.theme.brand.alt
          },
          function(e) {
            return e.disabled
              ? 'none'
              : ((t = e.theme.brand.alt),
                (n = e.theme.brand.default),
                Object(s.css)(
                  [
                    'radial-gradient(ellipse farthest-corner at top left,',
                    ' 0%,',
                    ' 100%)',
                  ],
                  t,
                  n
                ))
            var t, n
          },
          function(e) {
            var t = e.color
            return t && Object(s.css)(['background:', ';'], t)
          },
          function(e) {
            return e.theme.text.reverse
          },
          function(e) {
            return e.disabled ? e.theme.bg.inactive : e.theme.brand.alt
          },
          function(e) {
            return e.disabled
              ? 'none'
              : ''.concat(U.low, ' ').concat(Q(e.theme.bg.reverse, 0.15))
          }
        ),
        Ja = Object(s.default)(Za).withConfig({
          displayName: 'style__StyledTextButton',
          componentId: 'jy5cnz-2',
        })(
          [
            'background:transparent;background-image:none;color:',
            ';transition:color 0.1s ease-out,box-shadow 0.2s ease-out 0.1s,border-radius 0.2s ease-out,padding:0.2s ease-out;',
            ' &:hover{background-color:transparent;box-shadow:none;color:',
            ';transition:color 0.1s ease-in,box-shadow 0.2s ease-in 0.1s,padding 0.2s ease-in;}',
          ],
          function(e) {
            return e.disabled ? e.theme.bg.inactive : e.theme.text.alt
          },
          function(e) {
            return e.loading
              ? Object(s.css)(['justify-content:center;'])
              : Object(s.css)(['justify-content:flex-start;'])
          },
          function(e) {
            return e.disabled ? e.theme.bg.inactive : e.theme.brand.alt
          }
        ),
        er = Object(s.default)(Ja).withConfig({
          displayName: 'style__StyledOutlineButton',
          componentId: 'jy5cnz-3',
        })(
          [
            'box-shadow:',
            ';background:transparent;background-image:none;color:',
            ';transition:color 0.1s ease-out,box-shadow 0.2s ease-out 0.1s,border-radius 0.2s ease-out,padding:0.2s ease-out;',
            ' &:hover{box-shadow:',
            ';background-color:transparent;color:',
            ';transition:color 0.1s ease-in,box-shadow 0.2s ease-in 0.1s,padding 0.2s ease-in;}',
            ';',
          ],
          function(e) {
            return e.large ? 'inset 0 0 0 .15rem' : 'inset 0 0 0 .1rem'
          },
          function(e) {
            return e.disabled ? e.theme.bg.inactive : e.theme.text.alt
          },
          function(e) {
            return e.loading
              ? Object(s.css)(['justify-content:center;'])
              : Object(s.css)(['justify-content:flex-start;'])
          },
          function(e) {
            return e.large ? 'inset 0 0 0 .15rem' : 'inset 0 0 0 .1rem'
          },
          function(e) {
            return e.disabled ? e.theme.bg.inactive : e.theme.brand.alt
          },
          function(e) {
            var t = e.color
            return t && Object(s.css)(['color:', ';'], t)
          }
        ),
        tr = function(e) {
          return r.a.createElement(
            Za,
            Object.assign({ disabled: e.loading }, e),
            e.loading &&
              r.a.createElement(He, { color: 'monochrome', size: e.large ? 2 : 0.6 }),
            !e.loading && r.a.createElement(Xa, null, e.children)
          )
        },
        nr = function(e) {
          return r.a.createElement(
            Ja,
            Object.assign({ disabled: e.loading }, e),
            e.loading && r.a.createElement(He, { size: e.large ? '18' : 0.6 }),
            !e.loading && r.a.createElement(Xa, null, e.children)
          )
        },
        ar = function(e) {
          return r.a.createElement(
            er,
            Object.assign({ disabled: e.loading }, e),
            e.loading &&
              r.a.createElement(He, { color: 'monochrome', size: e.large ? 2 : 0.6 }),
            !e.loading && r.a.createElement(Xa, null, e.children)
          )
        },
        rr = Object(s.default)(Je).withConfig({
          displayName: 'Inline',
          componentId: 'sc-1tup2n9-0',
        })(
          [
            'display:grid;grid-auto-columns:minmax(min-content,max-content);grid-auto-flow:column;justify-items:start;align-items:center;grid-gap:',
            'rem;',
          ],
          function(e) {
            return e.gap
          }
        )
      ;(rr.defaultProps = { gap: 1 }),
        (rr.propTypes = { gap: re.a.oneOf([0, 0.25, 0.5, 1, 1.5, 2, 3, 4]) })
      var ir = rr,
        lr = Object(s.default)(ce).withConfig({
          displayName: 'SiteField__CenteredFlexRow',
          componentId: 'sc-7uihrp-0',
        })(['', ';svg{margin-bottom:-3px;height:1rem;width:1rem;}'], z.align_center),
        or = Object(s.default)(nt).withConfig({
          displayName: 'SiteField__CompactStatusMessage',
          componentId: 'sc-7uihrp-1',
        })(['padding:1rem;']),
        cr = function(e) {
          var t = e.value
          return r.a.createElement(
            or,
            { status: 'critical' },
            r.a.createElement(
              Xe,
              { scale: 6 },
              'Site name ',
              r.a.createElement('code', null, t),
              ' unavailable'
            )
          )
        },
        sr = function(e) {
          var t = e.value
          return r.a.createElement(
            or,
            { status: 'warning' },
            r.a.createElement(
              Xe,
              { scale: 6 },
              'Your new site will be created as ',
              r.a.createElement('code', null, t)
            )
          )
        },
        ur = function(e) {
          var t = e.sitename,
            n = t.value,
            a = t.legalValue,
            i = t.loading,
            l = t.unique,
            o = []
          return (
            n.length > 0 &&
              (n !== a && o.push(r.a.createElement(sr, { value: a })),
              !1 === i && !1 === l && o.push(r.a.createElement(cr, { value: a }))),
            o
          )
        },
        mr = function(e) {
          var t = e.sitenameSlug
          return r.a.createElement(
            ma,
            { gap: 0.5 },
            r.a.createElement(
              Xe,
              { scale: 6, tone: 'secondary' },
              'https://',
              r.a.createElement('strong', null, t),
              '-xyz-production.linc-preview.sh'
            ),
            r.a.createElement(
              Xe,
              { scale: 6, tone: 'secondary' },
              'https://',
              r.a.createElement('strong', null, t),
              '-production.release.linc-preview.sh'
            ),
            r.a.createElement(
              Xe,
              { scale: 6, tone: 'secondary' },
              'https://',
              r.a.createElement('strong', null, t),
              '.linc-trial.sh'
            )
          )
        }
      function dr(e) {
        var t = e.sitename,
          n = e.initialValue
        return r.a.createElement(
          ma,
          { gap: 0.5 },
          r.a.createElement(
            lr,
            { internalSpacing: 0.5 },
            r.a.createElement(Xe, { weight: 'bold' }, 'Site name'),
            r.a.createElement(
              _e,
              {
                content:
                  'This name will be used to generate preview URLs, so choose something short and unique',
                arrow: !0,
                placement: 'top',
                animation: 'scale',
                animateFill: !1,
                duration: [250, 175],
                delay: [150, 0],
                distance: 8,
              },
              r.a.createElement('div', null, r.a.createElement(lt.a, null))
            )
          ),
          r.a.createElement(_t, {
            inputProps: {
              onChange: function(e) {
                return t.setValue(e.target.value)
              },
              defaultValue: n,
              required: !0,
              maxLength: 20,
              minLength: 2,
              type: 'text',
            },
            status: t.status,
          }),
          r.a.createElement(ur, { sitename: t }),
          t.legalValue &&
            t.legalValue.length > 0 &&
            r.a.createElement(mr, { sitenameSlug: t.legalValue })
        )
      }
      var pr = Object(s.default)(ce).withConfig({
          displayName: 'GitHubConf__CenteredFlexRow',
          componentId: 'sc-1k46xlo-0',
        })(['', ';svg{height:1rem;width:1rem;}'], z.align_center),
        gr = /(.*?)\/(.*)/
      function fr() {
        var e = Object(K.k)(),
          t = Object(K.m)(),
          n = decodeURIComponent(t.repositorySlug),
          a = decodeURIComponent(t.branchSlug),
          i = (function(e) {
            var t = e.match(gr)
            return { owner: t[1], repo: t[2] }
          })(n).repo.substring(0, 20),
          l = va('/'),
          o = Oa(i),
          c = function() {
            return {
              input: {
                name: o.legalValue,
                repository: n,
                path: l.legalPathName(),
                release_branch: a,
              },
            }
          },
          s = o.isValid && n.length && l.isValid,
          u = Object(Pt.b)(Ma, {
            variables: c(),
            onCompleted: function() {
              return e.push('/sites/'.concat(o.legalValue))
            },
            refetchQueries: [{ query: la }],
          }),
          m = Object(ne.a)(u, 2),
          d = m[0],
          p = m[1],
          g = p.loading,
          f = p.error
        return r.a.createElement(
          ma,
          {
            gap: 2,
            as: 'form',
            onSubmit: function(e) {
              d(c()), e.preventDefault()
            },
          },
          r.a.createElement(dr, { sitename: o, initialValue: i }),
          r.a.createElement(
            ma,
            { gap: 0.5 },
            r.a.createElement(
              pr,
              { internalSpacing: 0.5 },
              r.a.createElement(Xe, { weight: 'bold' }, 'Path to package.json'),
              r.a.createElement(
                _e,
                {
                  content: "The file path to your repository's package.json",
                  arrow: !0,
                  placement: 'top',
                  animation: 'scale',
                  animateFill: !1,
                  duration: [250, 175],
                  delay: [150, 0],
                  distance: 8,
                },
                r.a.createElement('div', null, r.a.createElement(lt.a, null))
              )
            ),
            r.a.createElement(_t, {
              inputProps: {
                value: l.value,
                placeholder: '/package.json',
                onChange: function(e) {
                  return l.setPath(e.target.value)
                },
                type: 'text',
                required: !0,
                maxLength: 120,
              },
              status: l.status,
            }),
            l.errors &&
              l.errors.map(function(e) {
                return e === ba
                  ? r.a.createElement(
                      nt,
                      { key: e, status: 'critical' },
                      r.a.createElement(
                        Xe,
                        null,
                        'Path must end in ',
                        r.a.createElement('code', null, '/package.json')
                      )
                    )
                  : null
              })
          ),
          f &&
            r.a.createElement(
              nt,
              { status: 'critical' },
              r.a.createElement(Xe, null, f.message)
            ),
          r.a.createElement(
            ir,
            { style: { justifyContent: 'flex-end' } },
            r.a.createElement(
              nr,
              {
                type: 'button',
                onClick: function() {
                  return e.push('/create/github')
                },
              },
              'Go back'
            ),
            r.a.createElement(
              tr,
              { type: 'submit', disabled: !s, loading: g },
              'Create site'
            )
          )
        )
      }
      var hr = s.default.li.withConfig({
          displayName: 'OtherConf__LI',
          componentId: 'sc-1ysmaps-0',
        })(['list-style-type:disc;text-indent:1rem;']),
        br = function() {
          return r.a.createElement(
            r.a.Fragment,
            null,
            r.a.createElement(
              ma,
              { as: 'ul', gap: 0.5 },
              ['CircleCI', 'Travis CI', 'Buildkite', 'GitLab'].map(function(e) {
                return r.a.createElement(
                  hr,
                  { key: e },
                  r.a.createElement(Xe, { scale: 6 }, e)
                )
              })
            )
          )
        },
        vr = function() {
          return r.a.createElement(
            nt,
            { status: 'info' },
            r.a.createElement(
              ma,
              null,
              r.a.createElement(
                Xe.P,
                { scale: 6, weight: 'medium', lineHeight: 1.3 },
                r.a.createElement('strong', null, 'NOTE:'),
                ' We do not currently have native support for your Git provider.'
              ),
              r.a.createElement(
                Xe.P,
                { scale: 6, lineHeight: 1.3 },
                'But you can still use Linc by using our CI/CD integration tool. It has been tested in:'
              ),
              r.a.createElement(br, null),
              r.a.createElement(
                Xe.P,
                { scale: 6, lineHeight: 1.3 },
                'If you are using another CI platform, please get in touch with us at',
                ' ',
                r.a.createElement(
                  'a',
                  { href: 'mailto:support@linc.sh' },
                  'support@linc.sh'
                )
              )
            )
          )
        }
      function Er() {
        var e = Object(K.k)(),
          t = Oa(''),
          n = Object(Pt.b)(Ma, {
            variables: {
              input: { release_branch: 'master', name: t.legalValue, path: '/' },
            },
            onCompleted: function() {
              return e.push('/sites/'.concat(t.legalValue))
            },
            refetchQueries: [{ query: la }],
          }),
          a = Object(ne.a)(n, 2),
          i = a[0],
          l = a[1].loading
        return r.a.createElement(
          ma,
          {
            as: 'form',
            onSubmit: function(e) {
              i(), e.preventDefault()
            },
          },
          r.a.createElement(vr, null),
          r.a.createElement(dr, { sitename: t }),
          r.a.createElement(
            ir,
            { style: { justifyContent: 'flex-end' } },
            r.a.createElement(
              nr,
              {
                type: 'button',
                onClick: function() {
                  return e.push('/create')
                },
              },
              'Go back'
            ),
            r.a.createElement(
              tr,
              { disabled: !t.isValid || l, loading: l, type: 'submit' },
              'Create site'
            )
          )
        )
      }
      var yr = s.default.div.withConfig({
          displayName: 'Steps__StepStripe',
          componentId: 'sc-11lnmt4-0',
        })(
          ['color:', ';background:', ';height:0.5rem;width:12rem;'],
          function(e) {
            var t = e.active,
              n = e.theme
            return t ? n.text.default : n.text.placeholder
          },
          function(e) {
            var t = e.theme,
              n = e.complete,
              a = e.active
            return n || a ? t.brand.default : t.brand.wash
          }
        ),
        wr = Object(s.default)(o.Link).withConfig({
          displayName: 'Steps__StyledLink',
          componentId: 'sc-11lnmt4-1',
        })(['text-decoration:none;']),
        _r = function(e) {
          var t = e.active,
            n = e.complete,
            a = e.text
          return r.a.createElement(
            ma,
            { gap: 0.5 },
            r.a.createElement(yr, { complete: n, active: t }),
            r.a.createElement(
              Xe,
              {
                scale: 6,
                tone: t ? 'default' : 'placeholder',
                weight: t ? 'medium' : 'regular',
              },
              a
            )
          )
        }
      function xr(e) {
        var t = e.location.pathname,
          n = '/create/github' === t,
          a = t.includes('/create/github/')
        return r.a.createElement(
          ir,
          { gap: 0.5 },
          r.a.createElement(
            wr,
            { to: '/create' },
            r.a.createElement(_r, {
              complete: !0,
              active: !1,
              text: '1: Select Git Provider',
            })
          ),
          n
            ? r.a.createElement(_r, { complete: !1, active: !0, text: '2: Select Repo' })
            : r.a.createElement(
                wr,
                { to: '/create/github' },
                r.a.createElement(_r, {
                  complete: !0,
                  active: !1,
                  text: '2: Select Repo',
                })
              ),
          r.a.createElement(_r, { complete: !n, active: a, text: '3: Configure' })
        )
      }
      var jr = n(54),
        kr = s.default.ul.withConfig({
          displayName: 'style__RepoListStyle',
          componentId: 'sc-1szgrul-0',
        })(['', ';'], z.vertical),
        Or = Object(s.default)(jr.a).withConfig({
          displayName: 'style__StyledSelect',
          componentId: 'sc-1szgrul-1',
        })(
          ['width:12rem;> div{border-color:', ';background:', ';}span{color:', ';}'],
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.text.default
          }
        ),
        Cr = s.default.img.withConfig({
          displayName: 'style__Avatar',
          componentId: 'sc-1szgrul-2',
        })(['border-radius:0.25rem;height:1.5rem;box-shadow:', ' ', ';'], U.low, function(
          e
        ) {
          var t = e.theme
          return Q(t.bg.reverse, 0.2)
        }),
        Sr = Object(s.css)(
          [
            'background-color:',
            ';',
            ';border-radius:0.25rem;text-decoration:none;',
            ';&:hover{background:',
            ';}&:nth-child(even){background:',
            ';&:hover{background:',
            ';}}',
          ],
          function(e) {
            return e.theme.bg.default
          },
          z.align_center.justify_space_btw,
          H.p1,
          function(e) {
            return e.theme.brand.wash
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.brand.wash
          }
        ),
        Ir = Object(s.default)(o.Link).withConfig({
          displayName: 'style__ListItem',
          componentId: 'sc-1szgrul-3',
        })(['', ';'], Sr),
        Nr = s.default.div.withConfig({
          displayName: 'style__PlaceholderListItem',
          componentId: 'sc-1szgrul-4',
        })(['', ';'], Sr),
        Fr = Object(s.default)(ce).withConfig({
          displayName: 'style__CenteredFlexRow',
          componentId: 'sc-1szgrul-5',
        })(['', ';'], z.align_center.fg1),
        Lr = n(44),
        Ar = n.n(Lr)
      function Pr(e) {
        var t,
          n,
          a = e.repository
        if (a) {
          var i = a.full_name,
            l = a.avatar_url,
            o = a.pushed_at,
            c = a.default_branch
          return r.a.createElement(
            Ir,
            {
              key: i,
              to:
                ((t = i),
                (n = c),
                '/create/github/'
                  .concat(encodeURIComponent(t), '/')
                  .concat(encodeURIComponent(n))),
            },
            r.a.createElement(
              ir,
              null,
              r.a.createElement(
                ma,
                { gap: 0.5 },
                r.a.createElement(
                  Fr,
                  { internalSpacing: 0.5 },
                  r.a.createElement(Cr, { src: l, alt: 'avatar' }),
                  r.a.createElement(Xe, { weight: 'bold' }, i)
                ),
                r.a.createElement(
                  Xe,
                  { tone: 'secondary', scale: 6 },
                  'Last pushed ',
                  Ar()(new Date(o))
                )
              )
            ),
            r.a.createElement(nr, null, 'Select')
          )
        }
        return r.a.createElement(
          Nr,
          null,
          r.a.createElement(
            ir,
            null,
            r.a.createElement(
              ma,
              { gap: 0.5 },
              r.a.createElement(
                Fr,
                { internalSpacing: 0.5 },
                r.a.createElement(Ht, { height: 1.5, width: 1.5 }),
                r.a.createElement(Mt, null)
              ),
              r.a.createElement(Mt, { minWidth: 6, maxWidth: 11 })
            )
          ),
          r.a.createElement(nr, null, r.a.createElement(Mt, null))
        )
      }
      var Dr = n(21),
        Br = function(e) {
          var t = (function(e) {
              var t = [],
                n = !0,
                a = !1,
                r = void 0
              try {
                for (
                  var i,
                    l = function() {
                      var e = i.value,
                        n = e.account,
                        a = e.repositories.map(function(e) {
                          return Object(pt.a)({}, e, { avatar_url: n.avatar_url })
                        })
                      t.push.apply(t, Object(Dr.a)(a))
                    },
                    o = e[Symbol.iterator]();
                  !(n = (i = o.next()).done);
                  n = !0
                )
                  l()
              } catch (c) {
                ;(a = !0), (r = c)
              } finally {
                try {
                  n || null == o.return || o.return()
                } finally {
                  if (a) throw r
                }
              }
              return t
            })(e),
            n = Object(a.useState)(''),
            r = Object(ne.a)(n, 2),
            i = r[0],
            l = r[1],
            o = Object(a.useState)(''),
            c = Object(ne.a)(o, 2),
            s = c[0],
            u = c[1],
            m = Object(a.useState)(''),
            d = Object(ne.a)(m, 2),
            p = d[0],
            g = d[1]
          return {
            repoFilter: i,
            repositories: t
              .sort(function(e, t) {
                return 'name' === p
                  ? e.name.toLowerCase() > t.name.toLowerCase()
                    ? 1
                    : -1
                  : new Date(e.pushed_at) > new Date(t.pushed_at)
                  ? -1
                  : 1
              })
              .filter(function(e) {
                var t = e.full_name
                return t.toLowerCase().includes(i) && t.toLowerCase().includes(s)
              }),
            setOrgFilter: function(e) {
              return u(e.value.toLowerCase())
            },
            setRepoFilter: function(e) {
              return l(e.target.value.toLowerCase())
            },
            setSortBy: function(e) {
              return g(e.value)
            },
          }
        },
        $r = function() {
          var e = encodeURIComponent(window.location.href)
          window.location = 'https://github.com/apps/linc/installations/new?redirect=' + e
        },
        qr = s.default.div.withConfig({
          displayName: 'NoRepos__Wrapper',
          componentId: 'sc-9msn0d-0',
        })(
          [
            'background:',
            ';',
            ';',
            ';border-style:dashed;border-width:0.13rem;border-color:',
            ';',
          ],
          function(e) {
            return e.theme.bg.wash
          },
          H.p2,
          T.br3.ba,
          function(e) {
            return e.theme.bg.border
          }
        ),
        Rr = s.default.button.withConfig({
          displayName: 'NoRepos__Button',
          componentId: 'sc-9msn0d-1',
        })(
          [
            '',
            ';',
            ';',
            ';background:',
            ';border-color:',
            ';cursor:pointer;box-shadow:',
            ';&:hover{transition:',
            ';box-shadow:',
            ';opacity:',
            ';}> svg{height:1.2rem;width:1.2rem;margin-right:0.66rem;}',
          ],
          H.ph2.pv1,
          T.br2.ba,
          z.center_both,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return ''.concat(U.low, ' ').concat(Q(e.theme.bg.reverse, 0.15))
          },
          W.on,
          function(e) {
            return e.disabled
              ? 'none'
              : ''.concat(U.high, ' ').concat(Q(e.theme.bg.reverse, 0.15))
          },
          function(e) {
            return e.disabled ? '0.5' : '1'
          }
        )
      function Tr(e) {
        var t = e.message,
          n = e.buttonText
        return r.a.createElement(
          qr,
          null,
          r.a.createElement(
            ma,
            null,
            r.a.createElement(Xe, { scale: 5, weight: 'bold', tone: 'secondary' }, t),
            r.a.createElement(
              Rr,
              {
                onClick: function() {
                  var e = encodeURIComponent(window.location.href + '/createsite')
                  window.location =
                    'https://github.com/apps/linc/installations/new?redirect=' + e
                },
              },
              r.a.createElement(da.a, null),
              ' ',
              r.a.createElement(Xe, { weight: 'medium' }, n)
            )
          )
        )
      }
      function zr(e) {
        var t,
          n,
          a = e.view,
          i = Br(a.github.installations),
          l = i.repoFilter,
          o = i.repositories,
          c = i.setOrgFilter,
          s = i.setRepoFilter,
          u = [
            ((t = ''),
            (n = 'All orgs'),
            {
              value: t,
              label: r.a.createElement(
                ir,
                { style: { height: '1rem' } },
                r.a.createElement(Xe, null, n)
              ),
            }),
          ].concat(
            Object(Dr.a)(
              a.github.installations.map(function(e) {
                var t,
                  n,
                  a = e.account
                return (
                  (t = a.login),
                  (n = a.avatar_url),
                  {
                    value: t,
                    label: r.a.createElement(
                      Fr,
                      null,
                      r.a.createElement(Cr, { src: n, alt: 'avatar' }),
                      r.a.createElement(Xe, null, t)
                    ),
                  }
                )
              })
            )
          )
        return r.a.createElement(
          ma,
          { gap: 1 },
          r.a.createElement(
            ir,
            null,
            r.a.createElement(Or, {
              name: 'select-org',
              options: u,
              onChange: c,
              defaultValue: u[0],
            }),
            r.a.createElement(_t, {
              inputProps: { onChange: s, placeholder: 'Filter repositories' },
            })
          ),
          r.a.createElement(
            kr,
            null,
            o.length > 0 &&
              o.map(function(e, t) {
                return r.a.createElement(Pr, { key: t, repository: e })
              })
          ),
          o.length > 0 &&
            r.a.createElement(
              nr,
              { onClick: $r },
              'Can',
              "'",
              't find a repository? Click here to configure your Linc installation(s)'
            ),
          0 === o.length &&
            r.a.createElement(Tr, {
              message: "No repostories found matching '".concat(l, "'"),
              buttonText: 'Configure GitHub repositories',
            })
        )
      }
      function Mr() {
        var e,
          t,
          n = Object(Pt.c)(ra),
          a = n.loading,
          i = n.error,
          l = n.data
        if (a)
          return r.a.createElement(
            kr,
            null,
            r.a.createElement(Pr, null),
            r.a.createElement(Pr, null),
            r.a.createElement(Pr, null),
            r.a.createElement(Pr, null)
          )
        if (i)
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(Xe, { tone: 'reverse' }, i.message)
          )
        var o =
          null === l || void 0 === l
            ? void 0
            : null === (e = l.view) || void 0 === e
            ? void 0
            : null === (t = e.github) || void 0 === t
            ? void 0
            : t.installations
        return o && o.length > 0
          ? r.a.createElement(zr, { view: l.view })
          : r.a.createElement(Tr, {
              message: 'No connected repositories',
              buttonText: 'Connect GitHub repositories',
            })
      }
      var Hr = s.default.div.withConfig({
          displayName: 'Creator__Container',
          componentId: 'po3bz1-0',
        })([
          "display:grid;margin-top:4rem;grid-template-columns:auto 48rem auto;grid-template-areas:'left-gutter content right-gutter';@media only screen and (max-width:992px){margin-top:2rem;grid-template-columns:2rem auto 2rem;}margin-bottom:16rem;",
        ]),
        Vr = Object(s.default)(dt).withConfig({
          displayName: 'Creator__StyledCard',
          componentId: 'po3bz1-1',
        })(['grid-area:content;', ';'], M.auto_rows.g2)
      function Wr() {
        return r.a.createElement(
          Hr,
          null,
          r.a.createElement(
            Vr,
            { padding: 2 },
            r.a.createElement(
              ma,
              null,
              r.a.createElement(Xe, { scale: 3, weight: 'bold' }, 'Create new site'),
              r.a.createElement(K.d, { path: '/create/github', component: xr })
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/create' },
              r.a.createElement(ha, null)
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/create/github' },
              r.a.createElement(Mr, null)
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/create/github/:repositorySlug/:branchSlug' },
              r.a.createElement(fr, null)
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/create/other' },
              r.a.createElement(Er, null)
            )
          )
        )
      }
      var Ur = Object(s.default)(ma).withConfig({
          displayName: 'style__Container',
          componentId: 'sc-9kwmta-0',
        })(
          ['max-width:70rem;', ';', '{', ';}', '{', ';}', '{', ';}'],
          H.p4.mb4,
          B,
          H.p3,
          $,
          H.p1,
          q,
          H.p05
        ),
        Gr = s.default.div.withConfig({
          displayName: 'style__NoSites',
          componentId: 'sc-9kwmta-1',
        })(
          [
            'background:',
            ';',
            ';',
            ';border-style:dashed;border-width:0.13rem;border-color:',
            ';',
          ],
          function(e) {
            return e.theme.bg.wash
          },
          H.p2,
          T.br3.ba,
          function(e) {
            return e.theme.bg.border
          }
        ),
        Qr = Object(s.css)(
          ['', ';', ';', ';', ';min-width:100%;border-color:', ';'],
          z.fg1,
          T.br3,
          T.ba,
          R.f6,
          function(e) {
            return e.theme.bg.border
          }
        ),
        Yr =
          (Object(s.default)(tr).withConfig({
            displayName: 'style__JoinButton',
            componentId: 'sc-153376c-0',
          })(['', ';', ''], Qr, function(e) {
            var t = e.theme
            return (
              e.starred &&
              Object(s.css)(
                ['background:', ';color:', ';&:hover{box-shadow:none;background:', ';}'],
                t.bg.wash,
                t.text.default,
                t.bg.wash
              )
            )
          }),
          Object(s.default)(o.Link).withConfig({
            displayName: 'style__ViewButton',
            componentId: 'sc-153376c-1',
          })(
            [
              '',
              ';',
              ';',
              ';',
              ';',
              ';border-color:',
              ';text-decoration:none;color:',
              ';background:',
              ';&:hover{border-color:',
              ';}min-height:0.8rem;',
            ],
            T.br3,
            T.ba,
            R.f6.bold,
            z.center_both,
            H.pv05.ph1,
            function(e) {
              return e.theme.bg.border
            },
            function(e) {
              return e.theme.text.default
            },
            function(e) {
              return e.theme.bg.wash
            },
            function(e) {
              return e.theme.space.default
            }
          )),
        Kr = s.default.div.withConfig({
          displayName: 'style__Header',
          componentId: 'sc-153376c-2',
        })(['', ';> * + *{', ';}'], z.align_center.justify_space_btw, H.ml1),
        Xr = Object(s.default)(o.Link).withConfig({
          displayName: 'style__CardTitle',
          componentId: 'sc-153376c-3',
        })(
          [
            '',
            ';text-decoration:none;position:relative;line-height:1.5;min-width:16rem;max-width:16rem;white-space:nowrap;overflow:hidden;> span{',
            '}> * + *{',
            ';}',
          ],
          z.align_center,
          G,
          H.ml1
        ),
        Zr = s.default.a.withConfig({
          displayName: 'style__RepoLink',
          componentId: 'sc-153376c-4',
        })(
          [
            'color:',
            ';',
            ';text-decoration:none;svg{width:0.8rem;}> * + *{',
            ';}&:hover{span{color:',
            ';}svg{color:',
            ';}}span{line-height:1.5;max-width:15rem;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}',
          ],
          function(e) {
            return e.theme.text.default
          },
          z.align_center,
          H.ml05,
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          }
        ),
        Jr = s.default.div.withConfig({
          displayName: 'style__Row',
          componentId: 'sc-153376c-5',
        })(['', ';'], z.justify_space_btw.align_center),
        ei = s.default.button.withConfig({
          displayName: 'style__StarButton',
          componentId: 'sc-153376c-6',
        })(
          [
            '',
            ' margin:none;padding:none;background:none;border:none;cursor:pointer;svg{fill:',
            ';color:',
            ';}&:hover{svg{fill:',
            ';color:',
            ';}}',
          ],
          z.center_both,
          function(e) {
            var t = e.theme
            return e.starred ? t.special.alt : 'none'
          },
          function(e) {
            var t = e.theme
            return e.starred ? t.special.alt : t.special.border
          },
          function(e) {
            var t = e.theme
            return e.starred ? t.special.default : 'none'
          },
          function(e) {
            return e.theme.special.default
          }
        ),
        ti = Object(s.default)(ce).withConfig({
          displayName: 'style__CenteredFlexRow',
          componentId: 'sc-153376c-7',
        })(['', ';> * + *{', ';}'], z.align_center, H.ml1),
        ni = n(167),
        ai = n(43),
        ri = n.n(ai),
        ii = new Map()
      var li = function(e, t, n) {
          try {
            var a,
              r,
              i = t.readQuery({ query: ta, variables: { name: e } }),
              l = n.data.deploymentStatusEvents,
              o = l.bundle_id,
              c = l.deployment_status,
              s = c.deploy_target_name
            if (
              o !==
              ((null === (a = i.view.site.releaseStatusV2) || void 0 === a
                ? void 0
                : null === (r = a.current_release) || void 0 === r
                ? void 0
                : r.bundle_id) || {})
            )
              return void (function(e, t, n) {
                ii.has(e) || ii.set(e, {}), (ii.get(e)[t] = n)
              })(o, s, c)
            var u = i.view.site.releaseStatusV2.deployment_statuses
              .map(function(e) {
                return e.deploy_target_name
              })
              .indexOf(s)
            if (-1 === u)
              return void console.warn(
                'Unexpected deployment status for bundle_id '
                  .concat(o, ' and target ')
                  .concat(s)
              )
            t.writeQuery({
              query: ta,
              variables: { name: e },
              data: ri.a.set(
                i,
                'view.site.releaseStatusV2.deployment_statuses.'.concat(u),
                c
              ),
            })
          } catch (m) {
            return
          }
        },
        oi = function(e, t) {
          return e.findIndex(function(e) {
            return e.name === t
          })
        },
        ci = 'add',
        si = 'remove',
        ui = function(e) {
          var t = e.sitename,
            n = e.starred,
            a = n ? si : ci,
            i = n ? Va : Ha,
            l = Object(Pt.b)(i, {
              update: function(e) {
                return (function(e, t, n) {
                  var a = e.readQuery({ query: ia }),
                    r = oi(a.view.allSites, t),
                    i = Object(pt.a)({}, a.view.allSites[r])
                  if (
                    ((i.starred = !i.starred),
                    e.writeQuery({
                      query: ia,
                      data: Object(pt.a)({}, a, {
                        view: {
                          allSites: [].concat(
                            Object(Dr.a)(a.view.allSites.slice(0, r)),
                            [i],
                            Object(Dr.a)(a.view.allSites.splice(r + 1))
                          ),
                          __typename: 'View',
                        },
                      }),
                    }),
                    'add' === n)
                  ) {
                    var l = e.readQuery({ query: la })
                    e.writeQuery({
                      query: la,
                      data: Object(pt.a)({}, l, {
                        view: {
                          sites: [].concat(Object(Dr.a)(l.view.sites), [i]),
                          __typename: 'View',
                        },
                      }),
                    })
                  }
                  if ('remove' === n) {
                    var o = e.readQuery({ query: la }),
                      c = oi(o.view.sites, t),
                      s = Object(Dr.a)(o.view.sites)
                    s.splice(c, 1),
                      e.writeQuery({
                        query: la,
                        data: Object(pt.a)({}, o, {
                          view: { sites: Object(Dr.a)(s), __typename: 'View' },
                        }),
                      })
                  }
                })(e, t, a)
              },
              variables: { name: t },
            }),
            o = Object(ne.a)(l, 2),
            c = o[0],
            s = o[1],
            u = s.loading,
            m = s.error
          return (
            m && console.log(m),
            r.a.createElement(
              ei,
              { starred: n, onClick: c },
              u ? r.a.createElement(He, null) : r.a.createElement(ni.a, null)
            )
          )
        },
        mi = function(e) {
          var t = e.loading,
            n = e.starred,
            a = e.sitename,
            i = e.siteCreated,
            l = e.lastCommit,
            o = e.repositoryName
          if (t)
            return r.a.createElement(
              dt,
              { boxShadow: 'none' },
              r.a.createElement(
                ma,
                { gap: 1 },
                r.a.createElement(
                  Kr,
                  { as: 'div' },
                  r.a.createElement(
                    ti,
                    null,
                    r.a.createElement(Ht, null),
                    r.a.createElement(Mt, null)
                  )
                ),
                r.a.createElement(
                  ma,
                  { gap: 2 },
                  r.a.createElement(
                    Zr,
                    { as: 'div' },
                    r.a.createElement(Mt, { maxWidth: 9 })
                  ),
                  r.a.createElement(
                    ma,
                    { gap: 0.5 },
                    r.a.createElement(
                      Jr,
                      null,
                      r.a.createElement(Mt, { maxWidth: 4 }),
                      r.a.createElement(Mt, { maxWidth: 4 })
                    ),
                    r.a.createElement(
                      Jr,
                      null,
                      r.a.createElement(Mt, { maxWidth: 4 }),
                      r.a.createElement(Mt, { maxWidth: 4 })
                    )
                  )
                ),
                r.a.createElement(Yr, { to: '', as: 'div' })
              )
            )
          var c = ''.concat(n ? 'Remove' : 'Add', ' ').concat(a, ' to Sites list')
          return r.a.createElement(
            dt,
            { boxShadow: 'none', borderRadius: 0.25 },
            r.a.createElement(
              ma,
              { gap: 1 },
              r.a.createElement(
                Kr,
                null,
                r.a.createElement(
                  Xr,
                  { to: '/sites/'.concat(a) },
                  r.a.createElement(ke, { name: a }),
                  r.a.createElement(Xe, { scale: 4, weight: 'bold' }, a)
                ),
                r.a.createElement(
                  _e,
                  {
                    content: c,
                    arrow: !0,
                    placement: 'top',
                    animation: 'scale',
                    animateFill: !1,
                    duration: [250, 175],
                    delay: [150, 0],
                    distance: 8,
                  },
                  r.a.createElement(
                    'div',
                    null,
                    r.a.createElement(ui, { sitename: a, starred: n })
                  )
                )
              ),
              r.a.createElement(
                Zr,
                {
                  href: 'https://github.com/'.concat(o),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                r.a.createElement(Xe, { scale: 6 }, o)
              ),
              r.a.createElement(
                ma,
                { gap: 0.5 },
                r.a.createElement(
                  Jr,
                  null,
                  r.a.createElement(Xe, { tone: 'secondary', scale: 6 }, 'Last Commit'),
                  r.a.createElement(
                    Xe,
                    { tone: 'secondary', scale: 6 },
                    l ? Ar()(l) : 'No commits'
                  )
                ),
                r.a.createElement(
                  Jr,
                  null,
                  r.a.createElement(Xe, { tone: 'secondary', scale: 6 }, 'Site created'),
                  r.a.createElement(
                    Xe,
                    { tone: 'secondary', scale: 6 },
                    i ? Ar()(i) : 'Unknown'
                  )
                )
              ),
              r.a.createElement(Yr, { to: '/sites/'.concat(a) }, 'View')
            )
          )
        },
        di = s.default.div.withConfig({
          displayName: 'SitesList__Grid',
          componentId: 'sc-1jfojpp-0',
        })([
          'display:grid;grid-template-columns:1fr 1fr 1fr;grid-gap:1rem;@media only screen and (max-width:1459px){grid-template-columns:1fr 1fr;}@media only screen and (max-width:811px){grid-gap:0.5rem;grid-template-columns:1fr;}',
        ]),
        pi = function(e, t) {
          var n = function(e) {
              var t, n
              return null === e || void 0 === e
                ? void 0
                : null === (t = e.commitsFeed) || void 0 === t
                ? void 0
                : null === (n = t.commits[0]) || void 0 === n
                ? void 0
                : n.timestamp
            },
            a = n(e) || 0,
            r = n(t) || 0
          return parseInt(r) - parseInt(a)
        },
        gi = function(e, t) {
          var n,
            a,
            i = e.repository_name,
            l = e.created_at,
            o = e.name,
            c = e.starred,
            s =
              null === e || void 0 === e
                ? void 0
                : null === (n = e.commitsFeed) || void 0 === n
                ? void 0
                : null === (a = n.commits[0]) || void 0 === a
                ? void 0
                : a.timestamp
          return r.a.createElement(mi, {
            key: t,
            mode: 'link',
            starred: c,
            sitename: o,
            repositoryName: i,
            lastCommit: s,
            siteCreated: l,
          })
        }
      function fi(e) {
        var t = e.loading,
          n = e.sites
        return t
          ? r.a.createElement(
              di,
              null,
              r.a.createElement(mi, { loading: !0 }),
              r.a.createElement(mi, { loading: !0 }),
              r.a.createElement(mi, { loading: !0 }),
              r.a.createElement(mi, { loading: !0 })
            )
          : r.a.createElement(di, null, n.sort(pi).map(gi))
      }
      var hi = s.default.div.withConfig({
          displayName: 'Header__Wrapper',
          componentId: 'sc-189q2mu-0',
        })(['', ' a{margin-left:1rem;}'], z.justify_space_btw),
        bi = Object(s.default)(o.Link).withConfig({
          displayName: 'Header__StyledLink',
          componentId: 'sc-189q2mu-1',
        })(['text-decoration:none;'])
      function vi(e) {
        var t = e.loading,
          n = e.setFilter
        return r.a.createElement(
          hi,
          null,
          r.a.createElement(_t, {
            size: 32,
            inputProps: {
              disabled: t,
              placeholder: 'Search sites',
              onChange: function(e) {
                return n(e.target.value)
              },
            },
          }),
          r.a.createElement(
            bi,
            { to: '/create' },
            r.a.createElement(tr, null, 'Create new Site')
          )
        )
      }
      function Ei() {
        var e
        Oe('Sites | Linc')
        var t = Object(a.useState)(''),
          n = Object(ne.a)(t, 2),
          i = n[0],
          l = n[1],
          o = Object(Pt.c)(ia, { fetchPolicy: 'cache-first' }),
          c = o.loading,
          s = o.error,
          u = o.data
        if (c)
          return r.a.createElement(
            Ur,
            { gap: 2 },
            r.a.createElement(vi, { loading: !0 }),
            r.a.createElement(fi, { loading: !0 })
          )
        if (s)
          return r.a.createElement(
            Ur,
            { gap: 2 },
            r.a.createElement(vi, { loading: !0 }),
            r.a.createElement(
              nt,
              null,
              r.a.createElement(Xe, null, 'No sites found for user')
            )
          )
        var m =
          null === u || void 0 === u
            ? void 0
            : null === (e = u.view) || void 0 === e
            ? void 0
            : e.allSites
        if (m && m.length > 0) {
          var d = (function(e) {
            var t = i.toLocaleLowerCase()
            return e.filter(function(e) {
              return [e.name, e.repository_name || ''].some(function(e) {
                return e.toLowerCase().includes(t)
              })
            })
          })(m)
          return r.a.createElement(
            Ur,
            { gap: 2 },
            r.a.createElement(vi, { setFilter: l }),
            0 === d.length
              ? r.a.createElement(
                  Gr,
                  null,
                  r.a.createElement(
                    Xe,
                    { tone: 'placeholder', weight: 'bold' },
                    'No sites found matching ',
                    "'".concat(i, "'")
                  )
                )
              : r.a.createElement(fi, { sites: d })
          )
        }
        return r.a.createElement(
          Ur,
          { gap: 2 },
          r.a.createElement(vi, { setFilter: l }),
          r.a.createElement(
            Gr,
            null,
            r.a.createElement(
              Xe,
              { tone: 'placeholder', weight: 'bold' },
              'You currently have no sites'
            )
          )
        )
      }
      var yi = s.default.div.withConfig({
          displayName: 'style__Container',
          componentId: 'sc-1osymaf-0',
        })(['', ';', ';'], z.align_center.vertical.fg1, H.p4.mb4),
        wi = Object(s.default)(dt).withConfig({
          displayName: 'style__StyledCard',
          componentId: 'sc-1osymaf-1',
        })(['width:45rem;min-width:45rem;']),
        _i = s.default.button.withConfig({
          displayName: 'SiteItem__Wrapper',
          componentId: 'sc-1v8179q-0',
        })(
          [
            '',
            ';',
            ';',
            ';background:',
            ';&:hover{background:',
            ';}&:nth-child(even){background:',
            ';&:hover{background:',
            ';}}cursor:pointer;',
          ],
          z.justify_space_btw.align_center,
          H.p1,
          T.bn.br2,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.brand.wash
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.brand.wash
          }
        ),
        xi = s.default.div.withConfig({
          displayName: 'SiteItem__Header',
          componentId: 'sc-1v8179q-1',
        })(['', ';> * + *{', ';}'], z.align_center, H.ml1)
      function ji(e) {
        var t = e.select,
          n = e.sitename,
          a = e.repositoryName,
          i = e.createdAt,
          l = e.creator
        return r.a.createElement(
          _i,
          { onClick: t },
          r.a.createElement(
            ma,
            null,
            r.a.createElement(
              xi,
              null,
              r.a.createElement(ke, { name: n }),
              r.a.createElement(
                ma,
                { style: { alignItems: 'flex-start' }, gap: 0.5 },
                r.a.createElement(
                  Xe,
                  { scale: 5, weight: 'medium', tone: 'secondary' },
                  n
                ),
                r.a.createElement(Xe, { scale: 6, tone: 'secondary' }, a)
              )
            ),
            r.a.createElement(
              ir,
              null,
              r.a.createElement(
                Xe,
                { tone: 'secondary', scale: 6 },
                'Created ',
                Ar()(i),
                ' by ',
                l
              )
            )
          ),
          r.a.createElement(nr, { onClick: t }, 'Select')
        )
      }
      var ki = n(59),
        Oi = n(89),
        Ci = n.n(Oi),
        Si = n(104),
        Ii = s.default.form.withConfig({
          displayName: 'FormElements__Form',
          componentId: 'sc-1rdnt0k-0',
        })(
          ['', ';border-radius:0.25rem;box-shadow:', ' ', ';min-width:16rem;'],
          z.vertical,
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          }
        ),
        Ni = s.default.div.withConfig({
          displayName: 'FormElements__FormHeader',
          componentId: 'sc-1rdnt0k-1',
        })(
          [
            '',
            ';',
            ';',
            ';border-radius:0.25rem 0.25rem 0 0;border-color:',
            ';background:',
            ';',
          ],
          z.align_center,
          H.p1,
          T.ba,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.wash
          }
        ),
        Fi = Object(s.default)(ma).withConfig({
          displayName: 'FormElements__FormBody',
          componentId: 'sc-1rdnt0k-2',
        })(
          ['background:', ';border-color:', ';', ';', ';'],
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.border
          },
          H.pv15.ph1,
          T.bl.br
        )
      Fi.defaultProps = { gap: 1 }
      var Li = Object(s.default)(ir).withConfig({
        displayName: 'FormElements__FormFooter',
        componentId: 'sc-1rdnt0k-3',
      })(
        [
          '',
          ';',
          ';border-radius:0 0 0.25rem 0.25rem;border-color:',
          ';background:',
          ';',
          ';',
        ],
        z.align_center.justify_end,
        H.p1,
        function(e) {
          return e.theme.bg.border
        },
        function(e) {
          return e.theme.bg.default
        },
        T.ba
      )
      Li.defaultProps = { gap: 2 }
      var Ai = s.default.button.withConfig({
        displayName: 'FormElements__CheckboxRowStyle',
        componentId: 'sc-1rdnt0k-4',
      })(
        [
          'padding-left:0;padding-right:0;background:none;border:none;line-height:1;cursor:pointer;color:',
          ';span{color:',
          ';}}&:hover{color:',
          ';span{color:',
          ';}}&:disabled{cursor:default;color:',
          ';span{color:',
          ';}}',
          ';> * + *{',
          ';}',
        ],
        function(e) {
          return e.theme.text.secondary
        },
        function(e) {
          return e.theme.text.secondary
        },
        function(e) {
          return e.theme.brand.default
        },
        function(e) {
          return e.theme.brand.default
        },
        function(e) {
          return e.theme.text.placeholder
        },
        function(e) {
          return e.theme.text.placeholder
        },
        z.align_center,
        H.ml1
      )
      function Pi() {
        var e = Object(I.a)([
          '\n  mutation($input: SitePaymentInput!) {\n    updateSitePaymentInfo(input: $input)\n  }\n',
        ])
        return (
          (Pi = function() {
            return e
          }),
          e
        )
      }
      var Di = Bt()(Pi()),
        Bi = Object(ki.injectStripe)(function(e) {
          var t = Object(Pt.a)(),
            n = Object(a.useState)(!1),
            i = Object(ne.a)(n, 2),
            l = i[0],
            o = i[1],
            c = Object(a.useState)(!1),
            s = Object(ne.a)(c, 2),
            u = s[0],
            m = s[1],
            d = Object(a.useState)(''),
            p = Object(ne.a)(d, 2),
            g = p[0],
            f = p[1],
            h = Object(a.useState)(null),
            b = Object(ne.a)(h, 2),
            v = b[0],
            E = b[1],
            y = (function() {
              var n = Object(Si.a)(
                Ci.a.mark(function n(a) {
                  var r, i, l, c
                  return Ci.a.wrap(function(n) {
                    for (;;)
                      switch ((n.prev = n.next)) {
                        case 0:
                          return (
                            a.preventDefault(),
                            (r = e.stripe),
                            (i = e.sitename),
                            (n.next = 4),
                            r.createSource({ type: 'card', owner: { email: g } })
                          )
                        case 4:
                          if (((l = n.sent), void 0 !== (c = l.source))) {
                            n.next = 8
                            break
                          }
                          return n.abrupt('return')
                        case 8:
                          c.error && E(c.error),
                            c.id &&
                              (m(!0),
                              t
                                .mutate({
                                  mutation: Di,
                                  variables: {
                                    input: { email: g, token: c.id, sitename: i },
                                  },
                                })
                                .then(function() {
                                  o(!0), m(!1)
                                })
                                .catch(function(e) {
                                  E(e), m(!1)
                                }))
                        case 10:
                        case 'end':
                          return n.stop()
                      }
                  }, n)
                })
              )
              return function(e) {
                return n.apply(this, arguments)
              }
            })()
          return r.a.createElement(
            Ii,
            { onSubmit: y },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(Xe, { weight: 'bold', scale: 4 }, 'Checkout')
            ),
            r.a.createElement(
              Fi,
              { gap: 1 },
              r.a.createElement(Xe, { weight: 'medium' }, 'Email Address'),
              r.a.createElement(_t, {
                inputProps: {
                  type: 'email',
                  required: !0,
                  placeholder: 'Email',
                  value: g,
                  onChange: function(e) {
                    return f(e.target.value)
                  },
                },
              }),
              r.a.createElement(Xe, { weight: 'medium' }, 'Payment'),
              r.a.createElement(ki.CardElement, null),
              v &&
                r.a.createElement(
                  nt,
                  { status: 'critical' },
                  r.a.createElement(Xe, null, v.message)
                )
            ),
            r.a.createElement(
              Li,
              null,
              l &&
                r.a.createElement(
                  nt,
                  { status: 'positive' },
                  r.a.createElement(
                    Xe,
                    { tone: 'reverse' },
                    'Billing information updated!'
                  )
                ),
              !l &&
                r.a.createElement(tr, { loading: u, disabled: u, type: 'submit' }, 'Save')
            )
          )
        }),
        $i = { stripeApiKey: 'pk_live_eUFV3Z8mMnKhV5FyPWrd6X17' }
      function qi(e) {
        var t = e.sitename,
          n = (function(e) {
            var t = Object(a.useState)({ loaded: !1, error: !1 }),
              n = Object(ne.a)(t, 2),
              r = n[0],
              i = n[1]
            return (
              Object(a.useEffect)(
                function() {
                  if (!Ce.includes(e)) {
                    Ce.push(e)
                    var t = document.createElement('script')
                    ;(t.src = e), (t.async = !0)
                    var n = function() {
                        i({ loaded: !0, error: !1 })
                      },
                      a = function() {
                        var n = Ce.indexOf(e)
                        n >= 0 && Ce.splice(n, 1),
                          t.remove(),
                          i({ loaded: !0, error: !0 })
                      }
                    return (
                      t.addEventListener('load', n),
                      t.addEventListener('error', a),
                      document.body.appendChild(t),
                      function() {
                        t.removeEventListener('load', n),
                          t.removeEventListener('error', a)
                      }
                    )
                  }
                  i({ loaded: !0, error: !1 })
                },
                [e]
              ),
              [r.loaded, r.error]
            )
          })('https://js.stripe.com/v3/'),
          i = Object(ne.a)(n, 2),
          l = i[0],
          o = i[1]
        return l
          ? r.a.createElement(
              ki.StripeProvider,
              { apiKey: $i.stripeApiKey },
              r.a.createElement(ki.Elements, null, r.a.createElement(Bi, { sitename: t }))
            )
          : o
          ? r.a.createElement(
              ma,
              { gap: 2 },
              r.a.createElement(
                nt,
                { status: 'critical' },
                r.a.createElement(Xe, null, 'An error occured')
              )
            )
          : r.a.createElement(ma, { gap: 2 }, r.a.createElement(He, null))
      }
      var Ri = Object(s.default)(Je).withConfig({
        displayName: 'NullState',
        componentId: 'sc-120ci6y-0',
      })(
        [
          '',
          ';border-style:dashed;border-width:0.13rem;border-color:',
          ';background:',
          ';',
        ],
        T.br3.ba,
        function(e) {
          return e.theme.bg.border
        },
        function(e) {
          return e.theme.bg.wash
        }
      )
      Ri.defaultProps = { padding: 2 }
      var Ti = Ri
      function zi() {
        var e = Object(I.a)([
          '\n  {\n    view {\n      allSites {\n        name\n        repository_name\n        created_at\n        createdBy {\n          name\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (zi = function() {
            return e
          }),
          e
        )
      }
      var Mi = Bt()(zi()),
        Hi = function() {
          var e
          Oe('Billing | Linc')
          var t = Object(a.useState)(null),
            n = Object(ne.a)(t, 2),
            i = n[0],
            l = n[1],
            o = Object(Pt.c)(Mi),
            c = o.loading,
            s = o.error,
            u = o.data
          if (c) return r.a.createElement(ma, { padding: 4 }, r.a.createElement(Qe, null))
          if (s)
            return r.a.createElement(
              ma,
              { padding: 4 },
              r.a.createElement(nt, null, r.a.createElement(Xe, null, 'An error occured'))
            )
          var m =
            null === u || void 0 === u
              ? void 0
              : null === (e = u.view) || void 0 === e
              ? void 0
              : e.allSites
          return m && m.length > 0
            ? i
              ? r.a.createElement(
                  yi,
                  null,
                  r.a.createElement(
                    ma,
                    { gap: 2 },
                    r.a.createElement(
                      Xe,
                      { weight: 'bold', scale: 3 },
                      'Billing details'
                    ),
                    r.a.createElement(
                      ma,
                      { style: { minWidth: '32rem' } },
                      r.a.createElement(
                        ir,
                        { style: { alignItems: 'center' } },
                        r.a.createElement(ke, { name: i }),
                        r.a.createElement(
                          Xe,
                          { scale: 4 },
                          r.a.createElement('strong', null, i)
                        ),
                        r.a.createElement(
                          nr,
                          {
                            style: { alignSelf: 'flex-start' },
                            onClick: function() {
                              return l(null)
                            },
                          },
                          'Go back'
                        )
                      ),
                      r.a.createElement(qi, { sitename: i })
                    )
                  )
                )
              : r.a.createElement(
                  yi,
                  null,
                  r.a.createElement(
                    ma,
                    { gap: 2 },
                    r.a.createElement(
                      Xe,
                      { weight: 'bold', scale: 3 },
                      'Billing details'
                    ),
                    r.a.createElement(
                      wi,
                      { padding: 2, borderRadius: 0.25 },
                      r.a.createElement(
                        ma,
                        null,
                        r.a.createElement(
                          Xe,
                          { weight: 'bold', scale: 4 },
                          'Select site'
                        ),
                        r.a.createElement(
                          Xe,
                          { scale: 5 },
                          'Setup payment for a site by selecting it from the list below:'
                        ),
                        r.a.createElement(
                          ma,
                          { gap: 0 },
                          m.map(function(e) {
                            var t = e.repository_name,
                              n = e.name,
                              a = e.created_at,
                              i = e.createdBy
                            return r.a.createElement(ji, {
                              key: n,
                              sitename: n,
                              createdAt: a,
                              creator: i.name,
                              repositoryName: t,
                              select: function() {
                                return l(n)
                              },
                            })
                          })
                        )
                      )
                    )
                  )
                )
            : r.a.createElement(
                yi,
                null,
                r.a.createElement(
                  ma,
                  { gap: 2 },
                  r.a.createElement(Xe, { weight: 'bold', scale: 3 }, 'Billing details'),
                  r.a.createElement(
                    wi,
                    { padding: 2, borderRadius: 0.25 },
                    r.a.createElement(
                      ma,
                      null,
                      r.a.createElement(Xe, { weight: 'bold', scale: 4 }, 'Select site'),
                      r.a.createElement(
                        Xe,
                        { scale: 5 },
                        'Setup payment for a site by selecting it from the list below:'
                      ),
                      r.a.createElement(
                        Ti,
                        null,
                        r.a.createElement(Xe, { tone: 'secondary' }, 'No sites found')
                      )
                    )
                  )
                )
              )
        },
        Vi = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'sc-1w3es5m-0',
        })([
          'display:grid;grid-template-columns:auto;grid-gap:2rem;padding:4rem;@media only screen and (max-width:1170px){padding:2rem;}@media only screen and (max-width:992px){padding:1rem;}',
        ]),
        Wi = s.default.button.withConfig({
          displayName: 'AddRemoveSite__AddRemoveButton',
          componentId: 'pajyyj-0',
        })(
          [
            '',
            ';margin:0 0 0 0.5rem;padding:none;background:none;border:none;cursor:pointer;svg{fill:',
            ';color:',
            ';}&:hover{svg{fill:',
            ';color:',
            ';}}',
          ],
          z.center_both,
          function(e) {
            var t = e.theme
            return e.starred ? t.special.alt : 'none'
          },
          function(e) {
            return e.theme.special.alt
          },
          function(e) {
            var t = e.theme
            return e.starred ? t.special.default : 'none'
          },
          function(e) {
            return e.theme.special.default
          }
        )
      function Ui(e) {
        var t = e.sitename,
          n = e.starred,
          i = Object(Pt.a)(),
          l = Object(a.useState)(!1),
          o = Object(ne.a)(l, 2),
          c = o[0],
          s = o[1],
          u = n
            ? 'Remove '.concat(t, ' from Sites list')
            : 'Add '.concat(t, ' to Sites list'),
          m = n
            ? function() {
                s(!0),
                  i
                    .mutate({
                      mutation: Va,
                      variables: { name: t },
                      refetchQueries: [
                        { query: oa, variables: { name: t } },
                        { query: la },
                      ],
                    })
                    .then(function() {
                      s(!1)
                    })
              }
            : function() {
                s(!0),
                  i
                    .mutate({
                      mutation: Ha,
                      variables: { name: t },
                      refetchQueries: [
                        { query: oa, variables: { name: t } },
                        { query: la },
                      ],
                    })
                    .then(function() {
                      s(!1)
                    })
              }
        return r.a.createElement(
          _e,
          {
            content: u,
            arrow: !0,
            placement: 'top',
            animation: 'scale',
            animateFill: !1,
            duration: [250, 175],
            delay: [150, 0],
            distance: 8,
          },
          r.a.createElement(
            Wi,
            { starred: n, onClick: m },
            c ? r.a.createElement(He, null) : r.a.createElement(ni.a, null)
          )
        )
      }
      var Gi = s.default.div.withConfig({
          displayName: 'Nav__Wrapper',
          componentId: 'sc-15mm81y-0',
        })([
          'display:grid;grid-template-columns:auto auto;@media only screen and (max-width:1170px){grid-template-columns:auto;grid-template-rows:auto auto;grid-gap:2rem;}',
        ]),
        Qi = Object(s.default)(o.Link).withConfig({
          displayName: 'Nav__StyledLink',
          componentId: 'sc-15mm81y-1',
        })(
          [
            'text-decoration:none;color:inherit;&:hover{text-decoration:underline;color:',
            ';> span{color:',
            ';}}',
          ],
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          }
        ),
        Yi = s.default.a.withConfig({
          displayName: 'Nav__StyledAnchor',
          componentId: 'sc-15mm81y-2',
        })(['color:inherit;&:hover{color:', ';}'], function(e) {
          return e.theme.space.default
        }),
        Ki = Object(s.default)(o.NavLink)
          .attrs({ activeClassName: 'active-header-link' })
          .withConfig({ displayName: 'Nav__SitePageLink', componentId: 'sc-15mm81y-3' })(
          [
            'text-decoration:none;color:inherit;&:hover{text-decoration:underline;color:',
            ';> span{color:',
            ';}}&.',
            '{text-decoration:underline;}',
          ],
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          },
          'active-header-link'
        ),
        Xi = s.default.div.withConfig({
          displayName: 'Nav__Links',
          componentId: 'sc-15mm81y-4',
        })(
          [
            'display:flex;align-items:center;justify-content:flex-end;> * + *{',
            ';}@media only screen and (max-width:1170px){justify-content:flex-start;}',
          ],
          H.ml1
        ),
        Zi = s.default.div.withConfig({
          displayName: 'Nav__Middot',
          componentId: 'sc-15mm81y-5',
        })(['', ';', ';'], z, R.f3),
        Ji = s.default.span.withConfig({
          displayName: 'Nav__GithubLink',
          componentId: 'sc-15mm81y-6',
        })(['', ';', ';svg{margin-top:2px;width:1.2rem;}'], z.center_both, H.ml1),
        el = s.default.div.withConfig({
          displayName: 'Nav__Left',
          componentId: 'sc-15mm81y-7',
        })(['display:flex;align-items:center;'])
      function tl(e) {
        var t,
          n = e.sitename,
          i = Object(Pt.c)(oa, { variables: { name: n }, fetchPolicy: 'cache-first' }),
          l = i.loading,
          o = (i.error, i.data)
        if (l) return ''
        var c =
          null === o || void 0 === o
            ? void 0
            : null === (t = o.view) || void 0 === t
            ? void 0
            : t.site
        if (c) {
          var s = c.repository_name,
            u = c.starred
          return r.a.createElement(
            a.Fragment,
            null,
            r.a.createElement(Ui, { sitename: n, starred: u }),
            r.a.createElement(
              Yi,
              {
                href: 'https://github.com/'.concat(s),
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              r.a.createElement(Ji, null, r.a.createElement(da.a, null))
            )
          )
        }
        return ''
      }
      function nl() {
        var e = Object(K.m)().sitenameSlug,
          t = '/sites/'.concat(e),
          n = ''.concat(t, '/feedback'),
          a = ''.concat(t, '/environments'),
          i = ''.concat(t, '/settings')
        return r.a.createElement(
          Gi,
          null,
          r.a.createElement(
            el,
            { internalSpacing: 0.5 },
            r.a.createElement(
              Qi,
              { to: t },
              r.a.createElement(Xe, { scale: 2, weight: 'bold' }, e)
            ),
            r.a.createElement(tl, { sitename: e })
          ),
          r.a.createElement(
            Xi,
            null,
            r.a.createElement(
              Ki,
              { exact: !0, to: t },
              r.a.createElement(Xe, { weight: 'medium' }, 'Overview')
            ),
            r.a.createElement(Zi, null, '\xb7'),
            r.a.createElement(
              Ki,
              { exact: !0, to: n },
              r.a.createElement(Xe, { weight: 'medium' }, 'Feedback')
            ),
            r.a.createElement(Zi, null, '\xb7'),
            r.a.createElement(
              Ki,
              { exact: !0, to: a },
              r.a.createElement(Xe, { weight: 'medium' }, 'Environments')
            ),
            r.a.createElement(Zi, null, '\xb7'),
            r.a.createElement(
              Ki,
              { exact: !0, to: i },
              r.a.createElement(Xe, { weight: 'medium' }, 'Settings')
            )
          )
        )
      }
      var al = Object(s.css)(
          [
            "position:relative;&::before{content:'';position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;box-shadow:",
            ' ',
            ';}',
          ],
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          }
        ),
        rl = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'sc-1lvp3jj-0',
        })(
          [
            'border-style:solid;border-width:0 0 0 0.5rem;border-radius:0.25rem 0 0 0.25rem;border-color:',
            ';',
          ],
          'hsl(345, 59%, 53%)'
        ),
        il = n(168),
        ll = s.default.header.withConfig({
          displayName: 'Header__Wrapper',
          componentId: 'sc-1ujpkhx-0',
        })(['', ';'], z.justify_space_btw),
        ol = s.default.div.withConfig({
          displayName: 'Header__Tab',
          componentId: 'sc-1ujpkhx-1',
        })(
          [
            '',
            ';',
            ';',
            ';border-color:',
            ';border-radius:0 0.25rem 0 0;background:',
            ';span{color:',
            ';}z-index:1;',
            ';> * + *{',
            ';}',
            '{> span{display:none;}> * + *{',
            ';}}',
          ],
          z.center_both,
          H.p05,
          T.bt.br,
          'hsl(345, 59%, 53%)',
          function(e) {
            return e.theme.bg.default
          },
          'hsl(345, 59%, 53%)',
          al,
          H.ml066,
          $,
          H.ml0
        ),
        cl = s.default.div.withConfig({
          displayName: 'Header__TimeStamp',
          componentId: 'sc-1ujpkhx-2',
        })(['', ';'], H.p05),
        sl = s.default.div.withConfig({
          displayName: 'Header__BranchContainer',
          componentId: 'sc-1ujpkhx-3',
        })(['', ';svg{color:', ';height:1rem;}'], z.align_center, 'hsl(345, 59%, 53%)')
      function ul(e) {
        var t = e.loading,
          n = e.release_status
        if (t)
          return r.a.createElement(
            ll,
            null,
            r.a.createElement(
              ol,
              null,
              r.a.createElement(Xe, { scale: 6, weight: 'bold' }, 'CURRENT RELEASE')
            ),
            r.a.createElement(cl, null, r.a.createElement(Mt, null))
          )
        var a = n.release_branch,
          i = n.modified_at
        return r.a.createElement(
          ll,
          null,
          r.a.createElement(
            ol,
            { title: 'Release branch: '.concat(a) },
            r.a.createElement(Xe, { scale: 6, weight: 'bold' }, 'CURRENT RELEASE'),
            r.a.createElement(Xe, null, '~'),
            r.a.createElement(
              sl,
              null,
              r.a.createElement(il.a, null),
              r.a.createElement(Xe, { weight: 'medium' }, a)
            )
          ),
          r.a.createElement(Xe, { scale: 6, tone: 'secondary' }),
          r.a.createElement(
            cl,
            null,
            r.a.createElement(Xe, { scale: 6, tone: 'secondary' }, 'Released ', Ar()(i))
          )
        )
      }
      var ml = n(172),
        dl = n(173),
        pl = n(174),
        gl = n(169),
        fl = n(170),
        hl = n(171),
        bl = n(77),
        vl = s.default.div.withConfig({
          displayName: 'StatusSquare__Middot',
          componentId: 'sc-136u70-0',
        })(
          ['', ';text-decoration:none;', ';color:hsl(0,0%,85%);'],
          z.fg1.align_center,
          R.f2
        ),
        El = {
          available: 'hsl(213, 0%, 52%)',
          success: 'hsl(120, 52%, 41%)',
          ignored: 'hsl(0, 70%, 56%)',
          failed: 'hsl(0, 70%, 56%)',
          pending: 'hsl(46, 89%, 40%)',
          running: 'hsl(46, 89%, 40%)',
          empty: 'hsl(0, 0%, 85%)',
          queued: 'hsl(0, 0%, 85%)',
        },
        yl = Object(s.keyframes)([
          '0%{transform:rotate(0);}100%{transform:rotate(360deg);}',
        ]),
        wl = Object(s.css)(
          [
            '',
            ';svg{height:2rem;',
            ';',
            ';color:',
            ';}@media only screen and (max-width:768px){svg{height:1.2rem;}}',
          ],
          z.center_both,
          function(e) {
            var t = e.status
            return (
              ('pending' === t || 'running' === t) &&
              Object(s.css)(
                [
                  'animation-name:',
                  ';animation-duration:2000ms;animation-iteration-count:infinite;animation-timing-function:linear;',
                ],
                yl
              )
            )
          },
          function(e) {
            return (
              'available' === e.status &&
              Object(s.css)([
                'transform:translateY(-1.2px);svg{path{stroke-width:1.6px;}}',
              ])
            )
          },
          function(e) {
            var t = e.status
            return El[t]
          }
        ),
        _l = s.default.a.withConfig({
          displayName: 'StatusSquare__Anchor',
          componentId: 'sc-136u70-1',
        })(
          [
            '',
            ";&::after{content:'';position:absolute;width:0.5rem;height:0.5rem;background:",
            ';border-radius:50%;margin-left:-0.5rem;margin-top:0.4rem;border-style:solid;border-width:0.25rem;border-color:white;}',
          ],
          wl,
          function(e) {
            return e.color
          }
        ),
        xl = Object(s.default)(bl.HashLink).withConfig({
          displayName: 'StatusSquare__StyledLink',
          componentId: 'sc-136u70-2',
        })(['', ';'], wl),
        jl = s.default.div.withConfig({
          displayName: 'StatusSquare__DefaultWrapper',
          componentId: 'sc-136u70-3',
        })(['', ';'], wl),
        kl = {
          none: r.a.createElement(vl, null, '\xb7'),
          unknown: r.a.createElement(it.a, null),
          ignored: r.a.createElement(it.a, null),
          empty: r.a.createElement(gl.a, null),
          queued: r.a.createElement(gl.a, null),
          pending: r.a.createElement(ot.a, null),
          running: r.a.createElement(ot.a, null),
          failed: r.a.createElement(fl.a, null),
          success: r.a.createElement(hl.a, null),
          available: r.a.createElement(Pe.a, null),
        },
        Ol = Object(a.forwardRef)(function(e, t) {
          return r.a.createElement(
            xl,
            { innerRef: t, smooth: !0, status: e.status, to: e.to },
            e.statusIcon
          )
        }),
        Cl = function(e) {
          var t = e.color,
            n = e.status,
            a = e.title,
            i = e.href,
            l = e.to,
            o = kl[n]
          return i
            ? r.a.createElement(
                _e,
                {
                  content: a,
                  arrow: !0,
                  placement: 'top',
                  animation: 'fade',
                  animateFill: !1,
                  duration: [250, 175],
                  delay: [150, 0],
                  distance: 8,
                },
                r.a.createElement(
                  _l,
                  {
                    color: t,
                    rel: 'noopener noreferrer',
                    onClick: function(e) {
                      return e.stopPropagation()
                    },
                    target: '_blank',
                    status: n,
                    href: i,
                  },
                  o
                )
              )
            : l
            ? r.a.createElement(
                _e,
                {
                  content: a,
                  arrow: !0,
                  placement: 'top',
                  animation: 'fade',
                  animateFill: !1,
                  duration: [250, 175],
                  delay: [150, 0],
                  distance: 8,
                },
                r.a.createElement(Ol, { statusIcon: o, status: n, to: l })
              )
            : r.a.createElement(
                _e,
                {
                  content: a,
                  arrow: !0,
                  placement: 'top',
                  animation: 'fade',
                  animateFill: !1,
                  duration: [250, 175],
                  delay: [150, 0],
                  distance: 8,
                },
                r.a.createElement(jl, { status: n }, o)
              )
        }
      Cl.defaultProps = { status: 'empty' }
      var Sl = Cl,
        Il = { LAMBDA_EDGE: 'Lambda@Edge', CF_WORKERS: 'Cloudflare Workers' },
        Nl = { lambda_edge: 'LAMBDA_EDGE', cloudflare: 'CF_WORKERS' }
      function Fl(e) {
        return Il[Nl[e]]
      }
      var Ll = ['none', 'queued', 'success', 'failed', 'running']
      function Al(e) {
        var t = e.release_status,
          n = (function(e, t) {
            if (!e || 0 === e.length)
              return [
                'none',
                'You must configure a production Release Config to trigger releases',
              ]
            var n = e.map(function(e) {
                var t = e.deploy_target_name,
                  n = e.status,
                  a = (e.timestamp, Fl(t))
                switch (n) {
                  case 'pending':
                    return ['queued', ''.concat(a, ' awaiting deployment.')]
                  case 'deploying':
                    return ['running', ''.concat(a, ' currently deploying.')]
                  case 'success':
                    return ['success', ''.concat(a, ' deployed successfully.')]
                  case 'failed':
                    return ['failed', ''.concat(a, ' failed to deploy.')]
                  default:
                    return ['none', 'An unknown error occurred with '.concat(a, '.')]
                }
              }),
              a = Math.max.apply(
                Math,
                Object(Dr.a)(
                  n.map(function(e) {
                    return Ll.indexOf(e[0])
                  })
                )
              )
            return [
              Ll[a],
              n
                .map(function(e) {
                  return e[1]
                })
                .join('\n'),
            ]
          })(t.deployment_statuses, t.current_release.deployed_at),
          a = Object(ne.a)(n, 2),
          i = a[0],
          l = a[1]
        return r.a.createElement(Sl, { title: l, status: i })
      }
      var Pl = s.default.a.withConfig({
          displayName: 'Content__Anchor',
          componentId: 'sc-1yecs0y-0',
        })(
          [
            '',
            ';> * + *{',
            ';}text-decoration:none;&:hover{span{color:',
            ';text-decoration:underline;}svg{color:',
            ';}}',
          ],
          z.align_center,
          H.ml05,
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          }
        ),
        Dl = Object(s.css)(
          [
            'display:grid;z-index:1;border-radius:0 0.25rem 0.25rem 0;border-color:',
            ';background:',
            ';background:',
            ';background:var(--row-bg);--row-bg:',
            ';overflow:hidden;',
            ';box-shadow:0 2px 3px 0 ',
            ';',
            ';svg{color:',
            ';max-width:1rem;min-width:1rem;}',
          ],
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.default
          },
          al,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          },
          T.bt.br.bb,
          function(e) {
            return e.theme.text.secondary
          }
        ),
        Bl = Object(s.css)([
          "height:3.5rem;grid-template-columns:1fr 1fr 2fr 1fr minmax(15rem,24%);grid-template-areas:'commit-sha author message timestamp deployment-status';",
        ]),
        $l = Object(s.css)([
          "height:auto;grid-template-columns:1fr 2fr minmax(15rem,24%);grid-template-areas:'commit-sha timestamp deployment-status' 'author message deployment-status';",
        ]),
        ql = Object(s.css)([
          "grid-template-columns:1fr 1fr 1fr;grid-template-rows:3rem auto 3rem;grid-template-areas:'author timestamp commit-sha' 'message message message' 'deployment-status deployment-status deployment-status';",
        ]),
        Rl = s.default.div.withConfig({
          displayName: 'Content__Wrapper',
          componentId: 'sc-1yecs0y-1',
        })(['', ';', ';', '{', ';}', '{', ';}'], Dl, Bl, D, $l, $, ql),
        Tl = s.default.div.withConfig({
          displayName: 'Content__Cell',
          componentId: 'sc-1yecs0y-2',
        })(
          [
            'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding:0.5rem;',
            ';position:relative;> * + *{',
            ';}',
            '{svg{max-height:0.8rem;min-height:0.8rem;}}@media only screen and (max-width:768px){white-space:normal;}@media only screen and (min-width:768px){',
            ';}',
            ';',
          ],
          z.align_center,
          H.ml05,
          B,
          G,
          function(e) {
            var t = e.gridArea
            return t && 'grid-area: '.concat(t, ';')
          }
        ),
        zl = Object(s.default)(Tl).withConfig({
          displayName: 'Content__DeploymentCell',
          componentId: 'sc-1yecs0y-3',
        })([
          '@media only screen and (max-width:768px){display:flex;flex-direction:row;align-items:center;}',
        ])
      function Ml(e) {
        var t = e.loading,
          n = e.release_status
        if (t)
          return r.a.createElement(
            Rl,
            null,
            r.a.createElement(
              Tl,
              { gridArea: 'commit-sha' },
              r.a.createElement(Mt, null)
            ),
            r.a.createElement(Tl, { gridArea: 'author' }, r.a.createElement(Mt, null)),
            r.a.createElement(Tl, { gridArea: 'message' }, r.a.createElement(Mt, null)),
            r.a.createElement(Tl, { gridArea: 'timestamp' }, r.a.createElement(Mt, null)),
            r.a.createElement(
              Tl,
              { gridArea: 'deployment-status' },
              r.a.createElement(Mt, null)
            )
          )
        var a = n.commit,
          i = a.message,
          l = a.commit_sha,
          o = a.author,
          c = a.timestamp,
          s = a.repo_url,
          u = ''.concat(s, '/commit/').concat(l)
        return r.a.createElement(
          Rl,
          null,
          r.a.createElement(
            Tl,
            { gridArea: 'commit-sha' },
            l &&
              r.a.createElement(
                Pl,
                { target: '_blank', rel: 'noopener noreferrer', href: u },
                r.a.createElement(ml.a, null),
                r.a.createElement(Xe, { scale: 6 }, l.slice(0, 9))
              )
          ),
          r.a.createElement(
            Tl,
            { gridArea: 'author' },
            o &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(Le, { name: o.name, username: o.username }),
                r.a.createElement(Xe, { scale: 6 }, o.name || o.username)
              )
          ),
          r.a.createElement(
            Tl,
            { gridArea: 'message' },
            i &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(dl.a, null),
                r.a.createElement(Xe, { weight: 'medium', scale: 6 }, i)
              )
          ),
          r.a.createElement(
            Tl,
            { gridArea: 'timestamp' },
            c &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(pl.a, null),
                r.a.createElement(Xe, { scale: 6 }, Ar()(c))
              )
          ),
          r.a.createElement(
            zl,
            { gridArea: 'deployment-status' },
            r.a.createElement(Xe, { scale: 6 }, 'Deployment Status:'),
            r.a.createElement(Al, { release_status: n })
          )
        )
      }
      var Hl = (function(e) {
        function t() {
          return (
            Object(L.a)(this, t),
            Object(Ve.a)(this, Object(We.a)(t).apply(this, arguments))
          )
        }
        return (
          Object(Ue.a)(t, e),
          Object(A.a)(t, [
            {
              key: 'render',
              value: function() {
                var e = this.props,
                  t = e.loading,
                  n = e.release_status
                return t
                  ? r.a.createElement(
                      rl,
                      null,
                      r.a.createElement(ul, { loading: t }),
                      r.a.createElement(Ml, { loading: t })
                    )
                  : r.a.createElement(
                      rl,
                      null,
                      r.a.createElement(ul, { release_status: n }),
                      r.a.createElement(Ml, { release_status: n })
                    )
              },
            },
          ]),
          t
        )
      })(r.a.Component)
      function Vl(e) {
        var t = e.sitename,
          n = e.item
        return r.a.createElement(
          nt,
          { status: 'critical' },
          r.a.createElement(
            Xe.P,
            null,
            'We had some trouble retrieving ',
            n && ''.concat(n, ' for '),
            r.a.createElement('code', null, t),
            '.',
            r.a.createElement('br', null),
            'This could mean that the site does not exist or that you do not have sufficient access to the underlying repository.'
          )
        )
      }
      var Wl = function(e) {
          var t = e.sitenameSlug,
            n = e.bundleIdSlug,
            a = e.environmentSlug
          return 'https://'
            .concat(t, '--')
            .concat(n.substr(0, 9), '--')
            .concat(a || 'production', '.linc-preview.sh')
        },
        Ul = function(e) {
          var t = e.sitenameSlug,
            n = e.environmentSlug
          return 'https://'.concat(t, '--').concat(n, '.release.linc-preview.sh/')
        },
        Gl = s.default.a
          .attrs({ target: '_blank', rel: 'noreferrer noopener' })
          .withConfig({
            displayName: 'DeploymentStatusMessages__ExternalLink',
            componentId: 'sc-4nfyra-0',
          })(['display:inline-block;']),
        Ql = Object(s.default)(it.a).withConfig({
          displayName: 'DeploymentStatusMessages__AlertIcon',
          componentId: 'sc-4nfyra-1',
        })(
          [
            'margin-top:-4px;margin-bottom:-6px;padding-right:4px;path{fill:',
            ';stroke:',
            ';}line{stroke:white;stroke-width:2.5px;}',
          ],
          function(e) {
            return e.theme.warn.default
          },
          function(e) {
            return e.theme.warn.default
          }
        ),
        Yl = function(e) {
          var t = e.deployment_status,
            n = e.current_release,
            a = e.sitename,
            i = Wl({ sitenameSlug: a, bundleIdSlug: n.bundle_id }),
            l = Fl(t.deploy_target_name)
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(
              ma,
              null,
              r.a.createElement(
                Xe,
                { weight: 'bold', as: 'h3' },
                r.a.createElement(Ql, null),
                ' Error releasing to ',
                l
              ),
              r.a.createElement(
                Xe.P,
                null,
                'There was an error releasing bundle',
                ' ',
                r.a.createElement('code', null, n.bundle_id.substr(0, 9)),
                ' to',
                ' ',
                l,
                '. We received the following error:'
              ),
              r.a.createElement(
                Xe,
                { scale: 6 },
                r.a.createElement('code', null, t.message)
              ),
              r.a.createElement(
                Xe.P,
                null,
                'To help diagnose the problem, first confirm that this FAB is working at its preview url:',
                ' ',
                r.a.createElement(Gl, { href: i }, i),
                '.'
              ),
              r.a.createElement(
                Xe.P,
                null,
                'If your FAB appears valid, check your',
                ' ',
                r.a.createElement(
                  o.Link,
                  { to: '/sites/'.concat(a, '/settings') },
                  l,
                  ' Release Config'
                ),
                ' ',
                'against our guides for',
                ' ',
                r.a.createElement(
                  Gl,
                  { href: 'https://linc.sh/knowledge-base/releasing' },
                  'Releasing in Linc'
                ),
                '.'
              ),
              r.a.createElement(
                Xe.P,
                null,
                'Feel free to get in touch at',
                ' ',
                r.a.createElement(Gl, { href: 'mailto:help@linc.sh' }, 'help@linc.sh'),
                ' ',
                'or by',
                ' ',
                r.a.createElement(
                  Gl,
                  { href: 'https://github.com/bitgenics/linc/issues' },
                  'raising an issue'
                ),
                ' ',
                'if you',
                "'",
                're still having trouble.'
              )
            )
          )
        },
        Kl = function(e) {
          var t = e.sitename,
            n = (function(e) {
              var t = e.sitenameSlug
              return 'https://'.concat(t, '.linc-trial.sh')
            })({ sitenameSlug: t })
          return r.a.createElement(
            nt,
            null,
            r.a.createElement(
              ma,
              null,
              r.a.createElement(
                Xe,
                { weight: 'bold', as: 'h3' },
                'No production release config'
              ),
              r.a.createElement(
                Xe.P,
                null,
                'Your commit has been deployed and successfully released on Linc',
                "'",
                's demonstration infrastructure at',
                ' ',
                r.a.createElement(Gl, { href: n }, n),
                '.'
              ),
              r.a.createElement(
                Xe.P,
                null,
                'To host on your own infrastructure using your own URL, read our',
                ' ',
                r.a.createElement(
                  Gl,
                  { href: 'https://linc.sh/knowledge-base/releasing' },
                  'Releasing Documentation'
                ),
                ' ',
                'then head to the',
                ' ',
                r.a.createElement(
                  o.Link,
                  { to: '/sites/'.concat(t, '/settings') },
                  'Settings'
                ),
                ' to set things up.'
              )
            )
          )
        }
      function Xl(e) {
        var t = e.release_status,
          n = t.deployment_statuses,
          a = t.current_release,
          i = t.sitename
        return 0 === n.length
          ? r.a.createElement(Kl, { sitename: i })
          : n
              .filter(function(e) {
                return 'failed' === e.status
              })
              .map(function(e) {
                return r.a.createElement(
                  Yl,
                  Object.assign(
                    { key: e.deploy_target_name },
                    { deployment_status: e, current_release: a, sitename: i }
                  )
                )
              })
      }
      var Zl,
        Jl = { showDeploymentConfigPrompt: !0 },
        eo =
          ((Zl = 'LincAppFlags'),
          JSON.parse(localStorage.getItem(Zl)) || {
            name: 'LincAppFlags',
            version: '0.0.1',
            sites: {},
          }),
        to = Object(y.m)(eo),
        no = function() {
          !(function(e, t) {
            localStorage.setItem(e, JSON.stringify(t))
          })('LincAppFlags', Object(y.p)(to))
        },
        ao = function(e) {
          var t = to.sites[e]
          return (
            t ||
            ((function(e, t) {
              ;(to.sites[e] = t), no()
            })(e, Jl),
            to.sites[e])
          )
        },
        ro = s.default.button.withConfig({
          displayName: 'DeploymentConfigPrompt__DismissButton',
          componentId: 'uol2c8-0',
        })(
          [
            '',
            ';',
            ';',
            ';background:none;color:',
            ';cursor:pointer;&:hover{background:',
            ';}svg{height:1.5rem;width:1.5rem;}',
          ],
          z.center_both,
          H.p1,
          T.bn.br2,
          function(e) {
            return e.theme.bg.hairline
          },
          function(e) {
            return e.theme.bg.wash
          }
        ),
        io = s.default.div.withConfig({
          displayName: 'DeploymentConfigPrompt__Inner',
          componentId: 'uol2c8-1',
        })(['', ';'], z.justify_space_btw)
      function lo(e) {
        var t = e.sitename,
          n = e.releaseBranch
        return r.a.createElement(
          nt,
          null,
          r.a.createElement(
            io,
            null,
            r.a.createElement(
              ma,
              { gap: 0.5 },
              r.a.createElement(
                Xe.P,
                null,
                'You\u2019ve got a successful build on your release branch',
                ' ',
                r.a.createElement('code', null, n),
                ', but your app is not configured for automatic releases'
              ),
              r.a.createElement(
                Xe.P,
                null,
                r.a.createElement(
                  'a',
                  {
                    href: 'https://linc.sh/knowledge-base/releasing',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  'Read more'
                ),
                ' ',
                'about enabling Continuous Delivery or head to',
                ' ',
                r.a.createElement(
                  o.Link,
                  { to: '/sites/'.concat(t, '/settings#deploy_config') },
                  'deployment configuration'
                ),
                ' ',
                'to set things up'
              )
            ),
            r.a.createElement(
              ro,
              {
                onClick: function() {
                  !(function(e, t, n) {
                    ;(to.sites[e][t] = n), no()
                  })(t, 'showDeploymentConfigPrompt', !1)
                },
              },
              r.a.createElement(rt.a, null)
            )
          )
        )
      }
      var oo = {
          from: { opacity: 0, transform: 'translateY(-75%)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        co = {
          from: { opacity: 1, transform: 'translateY(0)' },
          to: { opacity: 0, transform: 'translateY(75%)' },
        },
        so = Object(u.a)(function(e) {
          var t = e.site,
            n = e.sitename,
            a = ao(n),
            i = null === t || void 0 === t ? void 0 : t.releaseStatusV2
          if (!i) return null
          var l,
            o =
              null === i || void 0 === i
                ? void 0
                : null === (l = i.current_release) || void 0 === l
                ? void 0
                : l.bundle_id,
            c = i.is_configured
          return o && c
            ? r.a.createElement(
                ma,
                { gap: 2 },
                r.a.createElement(
                  pn.a,
                  { duration: 1e3, enterAnimation: oo, leaveAnimation: co },
                  r.a.createElement(Hl, { key: i.modified_at, release_status: i })
                ),
                r.a.createElement(Xl, { release_status: i })
              )
            : a && !1 === a.showDeploymentConfigPrompt
            ? null
            : a && !0 === a.showDeploymentConfigPrompt
            ? r.a.createElement(lo, { sitename: n, releaseBranch: i.release_branch })
            : void 0
        })
      function uo(e) {
        var t,
          n = e.fetchPolicy,
          a = Object(K.m)().sitenameSlug,
          i = Object(Pt.c)(ta, { variables: { name: a }, fetchPolicy: n }),
          l = i.loading,
          o = i.error,
          c = i.data
        if (l)
          return r.a.createElement(ma, { gap: 2 }, r.a.createElement(Hl, { loading: !0 }))
        if (o) return r.a.createElement(Vl, { sitename: a, item: 'active releases' })
        var s =
          null === c || void 0 === c
            ? void 0
            : null === (t = c.view) || void 0 === t
            ? void 0
            : t.site
        return s
          ? r.a.createElement(so, { site: s, sitename: a })
          : r.a.createElement(Vl, { sitename: a, item: 'active releases' })
      }
      var mo = n(55),
        po = Object(s.css)([
          "display:grid;grid-template-columns:1fr minmax(8%,auto) minmax(8%,auto) minmax(8%,auto);grid-template-areas:'branch build-header tests-header preview-header' 'commit build tests preview';",
        ]),
        go = Object(s.css)(['display:grid;grid-template-columns:1fr 1fr 1fr;']),
        fo = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'sc-1205gom-0',
        })(
          [
            'border-radius:0.25rem;box-shadow:',
            ' ',
            ';border-style:solid;border-color:',
            ';border-width:1px 1px 1px 0;overflow:hidden;',
            ';background:white;position:relative;z-index:0;@media only screen and (max-width:768px){',
            ';}',
          ],
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          },
          function(e) {
            return e.theme.bg.border
          },
          po,
          go
        ),
        ho = n(175),
        bo = n(110),
        vo =
          (n(116),
          function(e) {
            var t = e.started_at,
              n = e.finished_at
            return !t || (null !== n && void 0 !== n)
              ? t && n
                ? Object(bo.a)(parseInt(n), parseInt(t))
                : 'Build duration unavailable'
              : Object(ho.a)(parseInt(t))
          }),
        Eo = ['#B500B5', '#7023B7', '#3455DB', '#007A7C', '#008000', '#8D6708', '#BC3E31']
      function yo(e, t) {
        return t > Eo.length - 1 ? xe(e) : Eo[t]
      }
      var wo = Object(s.css)(
          [
            'width:1.125rem;height:1.125rem;border-radius:0.25rem;border-style:solid;border-width:2px;margin-left:0.5rem;text-decoration:none;&:first-of-type{margin-left:0;}',
            '{height:0.9rem;width:1rem;margin:0 0 0 0.5rem;&:first-of-type{margin-left:0.5rem;}}',
          ],
          $
        ),
        _o = s.default.a.withConfig({
          displayName: 'EnvLink__Wrapper',
          componentId: 'sc-1a04qac-0',
        })(
          [
            '',
            ';',
            ';',
            ';color:',
            ';border-color:',
            ';text-transform:capitalize;font-size:10px;',
            '{border-width:2px;font-size:8px;}',
          ],
          wo,
          z.center_both,
          R.black,
          function(e) {
            return e.color
          },
          function(e) {
            return e.color
          },
          $
        ),
        xo = s.default.div.withConfig({
          displayName: 'EnvLink__NullStateWrapper',
          componentId: 'sc-1a04qac-1',
        })(['', ';border-color:hsl(0,0%,85%);'], wo),
        jo = s.default.em.withConfig({
          displayName: 'EnvLink__EmEnv',
          componentId: 'sc-1a04qac-2',
        })(
          [
            'background:',
            ';padding:0.1rem 0.15rem;border-radius:0.25rem;color:white;',
            ';',
          ],
          function(e) {
            return e.color
          },
          R.f6.bold
        )
      function ko(e) {
        if (e.nullState) {
          var t = r.a.createElement(
            Xe,
            { tone: 'reverse' },
            'Preview in ',
            r.a.createElement('em', { style: { color: e.color } }, e.env_name),
            ' ',
            'environment unavailable'
          )
          return r.a.createElement(
            _e,
            {
              content: t,
              arrow: !0,
              placement: 'top',
              animation: 'fade',
              animateFill: !1,
              duration: [250, 175],
              delay: [150, 0],
              distance: 8,
            },
            r.a.createElement(xo, null)
          )
        }
        var n = r.a.createElement(
          ma,
          { padding: 0.25 },
          r.a.createElement(
            Xe,
            { tone: 'reverse' },
            'Preview change in ',
            r.a.createElement(jo, { color: e.color }, e.env_name),
            ' ',
            'environment'
          )
        )
        return r.a.createElement(
          _e,
          {
            content: n,
            arrow: !0,
            placement: 'top',
            animation: 'fade',
            animateFill: !1,
            duration: [250, 175],
            delay: [150, 0],
            distance: 8,
          },
          r.a.createElement(
            _o,
            { target: '_blank', href: e.url, color: e.color, rel: 'noopener noreferrer' },
            e.env_name.slice(0, 2)
          )
        )
      }
      var Oo = s.default.div.withConfig({
          displayName: 'MetaCell',
          componentId: 'r1hrq-0',
        })(
          [
            'grid-area:',
            ';display:flex;align-items:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;position:relative;padding:0.5rem;svg{color:',
            ';max-width:1rem;min-width:1rem;}> * + *{',
            ';}',
            '{svg{max-height:0.8rem;min-height:0.8rem;}}',
            '{white-space:normal;}@media only screen and (min-width:768px){',
            '}',
          ],
          function(e) {
            return e.gridArea
          },
          function(e) {
            return e.theme.text.secondary
          },
          H.ml05,
          B,
          $,
          G
        ),
        Co = function() {
          return r.a.createElement(
            So,
            null,
            r.a.createElement(Oo, null, r.a.createElement(Mt, null)),
            r.a.createElement(
              Oo,
              null,
              r.a.createElement(Ht, { height: 1.3, width: 1.3 }),
              r.a.createElement(Mt, { maxWidth: 3 })
            ),
            r.a.createElement(Oo, null, r.a.createElement(Mt, { minWidth: 6 })),
            r.a.createElement(Oo, null, r.a.createElement(Mt, null))
          )
        },
        So = s.default.div.withConfig({
          displayName: 'CommitMetaData__Wrapper',
          componentId: 'sc-1r3xscl-0',
        })(
          [
            "min-height:3.5rem;display:grid;position:relative;cursor:pointer;grid-template-columns:1fr 1fr 2fr 1fr;grid-template-areas:'commit-sha author message timestamp';&:hover::before{content:'';position:absolute;top:0;left:-100vw;right:-100vw;bottom:0;background:",
            ';z-index:-1;}border-style:solid;border-width:1px 0 0 1px;border-color:',
            ";&:first-of-type{background:red;border-width:none;}&:last-of-type{background:red;border-width:none;}@media only screen and (max-width:1450px){display:grid;grid-template-columns:1fr 2fr;grid-template-areas:'commit-sha timestamp' 'author message';}@media only screen and (max-width:768px){grid-column-start:1;grid-column-end:4;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:3rem auto;grid-template-areas:'author timestamp commit-sha' 'message message message';}span{white-space:nowrap;text-overflow:ellipsis;}",
          ],
          function(e) {
            return e.theme.space.wash
          },
          function(e) {
            return e.theme.bg.border
          }
        ),
        Io = s.default.a.withConfig({
          displayName: 'CommitMetaData__Anchor',
          componentId: 'sc-1r3xscl-1',
        })(
          [
            '',
            ';> * + *{',
            ';}text-decoration:none;&:hover{span{color:',
            ';text-decoration:underline;}svg{color:',
            ';}}',
          ],
          z.align_center,
          H.ml05,
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          }
        )
      function No(e) {
        var t = e.loading,
          n = e.author,
          a = e.timestamp,
          i = e.commit_sha,
          l = e.message,
          o = e.url,
          c = Object(K.m)().sitenameSlug,
          s = Object(K.k)()
        if (t) return r.a.createElement(Co, null)
        return r.a.createElement(
          So,
          {
            onClick: function() {
              var e = '/sites/'.concat(c, '/commit/').concat(i)
              s.push(e)
            },
          },
          r.a.createElement(
            Oo,
            { gridArea: 'author' },
            n &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(Le, { name: n.name, username: n.username }),
                r.a.createElement(Xe, { scale: 6 }, n.name || n.username)
              )
          ),
          r.a.createElement(
            Oo,
            { gridArea: 'timestamp' },
            a &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(pl.a, null),
                r.a.createElement(Xe, { tone: 'secondary', scale: 6 }, Ar()(new Date(a)))
              )
          ),
          r.a.createElement(
            Oo,
            { gridArea: 'commit-sha' },
            i &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(
                  Io,
                  {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    onClick: function(e) {
                      e.stopPropagation()
                    },
                    href: o,
                  },
                  r.a.createElement(ml.a, null),
                  r.a.createElement(Xe, { scale: 6 }, i.slice(0, 9))
                )
              )
          ),
          r.a.createElement(
            Oo,
            { gridArea: 'message' },
            r.a.createElement(
              r.a.Fragment,
              null,
              r.a.createElement(dl.a, null),
              r.a.createElement(Xe.P, { scale: 6, weight: 'medium' }, l.slice(0, 50))
            )
          )
        )
      }
      var Fo = s.default.div.withConfig({
          displayName: 'StatusCell',
          componentId: 'sc-16vdmfy-0',
        })(
          [
            'border-style:solid;border-color:',
            ";border-width:1px 0 0 1px;padding:0.5rem;position:relative;display:flex;flex-direction:row;align-items:center;&:hover::before{content:'';position:absolute;top:0;left:-100vw;right:-100vw;bottom:0;z-index:-1;background:",
            ';}> span{display:none;}> * + *{margin-left:0.5rem;}@media only screen and (max-width:768px){min-height:3rem;flex-direction:row;align-items:center;border:none;span{display:block;}> * + *{margin-left:0.5rem;}',
            ';',
            ';',
            ';}',
          ],
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.space.wash
          },
          function(e) {
            return (
              'build' === e.gridArea &&
              Object(s.css)(['grid-column-start:1;grid-column-end:2;'])
            )
          },
          function(e) {
            return (
              'tests' === e.gridArea &&
              Object(s.css)(['grid-column-start:2;grid-column-end:3;'])
            )
          },
          function(e) {
            return (
              'preview' === e.gridArea &&
              Object(s.css)(['grid-column-start:3;grid-column-end:4;'])
            )
          }
        ),
        Lo = s.default.div.withConfig({
          displayName: 'HeaderCell',
          componentId: 'sc-13txh8-0',
        })(
          [
            'height:3.5rem;background:rgb(244,247,252);padding:1rem;grid-area:',
            ';border-style:solid;border-width:0 0 0 1px;border-color:',
            ';display:flex;align-items:center;padding:0 1rem;> * + *{margin-left:0.5rem;}@media only screen and (max-width:768px){min-height:3rem;display:',
            ';',
            ';}',
          ],
          function(e) {
            return e.gridArea
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return 'branch' !== e.gridArea ? 'none' : 'flex'
          },
          function(e) {
            return (
              'branch' === e.gridArea &&
              Object(s.css)(['grid-column-start:1;grid-column-end:4;'])
            )
          }
        )
      function Ao() {
        return r.a.createElement(
          fo,
          null,
          r.a.createElement(Lo, null, r.a.createElement(Mt, null)),
          r.a.createElement(Lo, null, r.a.createElement(Mt, { maxWidth: 0.5 })),
          r.a.createElement(Lo, null, r.a.createElement(Mt, { maxWidth: 0.5 })),
          r.a.createElement(Lo, null, r.a.createElement(Mt, { maxWidth: 0.5 })),
          r.a.createElement(No, { loading: !0 }),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(No, { loading: !0 }),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(No, { loading: !0 }),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(No, { loading: !0 }),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(No, { loading: !0 }),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null),
          r.a.createElement(Fo, null)
        )
      }
      var Po = s.default.a.withConfig({
          displayName: 'PullRequestBadge__Wrapper',
          componentId: 'g8j5nf-0',
        })(
          [
            '',
            ';',
            ';color:',
            ';svg{height:1.2rem;}&[href]:hover{color:',
            ';}> span{',
            ';position:relative;top:1px;left:1px;small{font-size:0.9em;}}',
          ],
          z.center_both,
          R.f6.medium.no_underline,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.space.default
          },
          H.pr025
        ),
        Do = function(e) {
          var t = e.pullRequest
          return t
            ? r.a.createElement(
                Po,
                {
                  href: t.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: 'View latest Pull Request on branch',
                },
                r.a.createElement(il.a, null),
                r.a.createElement(
                  'span',
                  null,
                  r.a.createElement('small', null, '#'),
                  t.number
                )
              )
            : r.a.createElement(Po, { as: 'div' }, r.a.createElement(il.a, null))
        },
        Bo = document.getElementById('modal'),
        $o = (function(e) {
          function t(e) {
            var n
            return (
              Object(L.a)(this, t),
              ((n = Object(Ve.a)(
                this,
                Object(We.a)(t).call(this, e)
              )).element = document.createElement('div')),
              n
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'componentDidMount',
                value: function() {
                  Bo.appendChild(this.element)
                },
              },
              {
                key: 'componentWillUnmount',
                value: function() {
                  Bo.removeChild(this.element)
                },
              },
              {
                key: 'render',
                value: function() {
                  return Object(i.createPortal)(this.props.children, this.element)
                },
              },
            ]),
            t
          )
        })(r.a.Component),
        qo = s.default.div.withConfig({
          displayName: 'style__ModalContainer',
          componentId: 'kry8tl-0',
        })([
          'height:100vh;width:100%;background:hsla(200,10%,30%,0.6);position:fixed;left:0;right:0;top:0;bottom:0;margin:auto;box-shadow:0 5px 10px 2px rgba(195,192,192,0.5);text-align:center;z-index:999999;display:flex;justify-content:center;align-items:center;',
        ]),
        Ro = n(58),
        To = n(176),
        zo = /[^a-zA-Z0-9\-]/g,
        Mo = s.default.div.withConfig({
          displayName: 'BranchLink__BranchLinkWrapper',
          componentId: 'sc-1kodzgz-0',
        })(
          ['background:', ';', ';', ';', ';transition:', ';'],
          function(e) {
            var t = e.theme
            return e.copied ? t.space.border : t.bg.wash
          },
          z.fg1.justify_space_btw.align_center,
          H.p025,
          T.br1,
          function(e) {
            return e.copied ? 'all 100ms ease' : 'all 600ms ease'
          }
        ),
        Ho = s.default.em.withConfig({
          displayName: 'BranchLink__EnvName',
          componentId: 'sc-1kodzgz-1',
        })(['font-weight:bold;color:', ';'], function(e) {
          return e.color
        }),
        Vo = s.default.a.withConfig({
          displayName: 'BranchLink__Anchor',
          componentId: 'sc-1kodzgz-2',
        })(['text-decoration:none;&:hover{text-decoration:underline;}']),
        Wo = s.default.div.withConfig({
          displayName: 'BranchLink__IconWrapper',
          componentId: 'sc-1kodzgz-3',
        })(
          [
            'cursor:',
            ';svg{height:1.2rem;margin-bottom:-0.1rem;}',
            ';&:hover{svg{color:',
            ';}}&:active{transform:scale(0.95,0.95);}',
          ],
          function(e) {
            return e.copied ? 'auto' : 'pointer'
          },
          H.ml1,
          function(e) {
            return e.theme.space.default
          }
        )
      function Uo(e) {
        var t = e.sitename,
          n = e.environment,
          i = e.branch,
          l = e.color,
          o = Object(a.useState)(!1),
          c = Object(ne.a)(o, 2),
          s = c[0],
          u = c[1],
          m = i.replace(zo, '').toLowerCase(),
          d = 'https://'
            .concat(t, '--')
            .concat(n, '--')
            .concat(m, '.branch.linc-preview.sh/')
        return r.a.createElement(
          Mo,
          { copied: s },
          r.a.createElement(
            Vo,
            { key: n + i, rel: 'noopener noreferrer', target: '_blank', href: d },
            r.a.createElement(
              Xe,
              { scale: 6 },
              'https://',
              t,
              '--',
              r.a.createElement(Ho, { color: l }, n),
              '--',
              i,
              '.branch.linc-preview.sh/'
            )
          ),
          r.a.createElement(
            Ro.CopyToClipboard,
            {
              text: d,
              onCopy: function() {
                u(!0),
                  setTimeout(function() {
                    u(!1)
                  }, 750)
              },
            },
            s
              ? r.a.createElement(Wo, { copied: s }, r.a.createElement(at.a, null))
              : r.a.createElement(
                  Wo,
                  { copied: s, title: 'copy to clipboard' },
                  r.a.createElement(To.a, null)
                )
          )
        )
      }
      var Go = s.default.button.withConfig({
          displayName: 'style__OpenButton',
          componentId: 'sc-1n3yu49-0',
        })(
          [
            '',
            ';svg{height:0.8rem;width:0.8rem;color:',
            ';}background:',
            ';',
            ';',
            ';cursor:pointer;&:hover{border-color:',
            ';span{color:',
            ';}svg{color:',
            ';}}> * + *{',
            ';}',
          ],
          z.align_center,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.bg.default
          },
          T.br2.ba,
          H.pv025.ph05,
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          },
          H.pl025
        ),
        Qo = s.default.div.withConfig({
          displayName: 'style__ModalBox',
          componentId: 'sc-1n3yu49-1',
        })(['', ';'], z.vertical),
        Yo = s.default.div.withConfig({
          displayName: 'style__ModalHeader',
          componentId: 'sc-1n3yu49-2',
        })(
          [
            '',
            ';',
            ';background:',
            ';border-radius:0.25rem 0.25rem 0 0;border-color:',
            ';border-width:0 0 1px 0;border-style:solid;',
          ],
          z.justify_space_btw.align_center,
          H.p05.pl1,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.border
          }
        ),
        Ko = s.default.div.withConfig({
          displayName: 'style__ModalBody',
          componentId: 'sc-1n3yu49-3',
        })(['', ';background:', ';border-radius:0 0 0.25rem 0.25rem;'], H.p066, function(
          e
        ) {
          return e.theme.bg.default
        }),
        Xo = s.default.button.withConfig({
          displayName: 'style__CloseButton',
          componentId: 'sc-1n3yu49-4',
        })(
          [
            '',
            ';',
            ';background:none;',
            ';cursor:pointer;svg{height:1.2rem;}&:hover{background:',
            ';color:',
            ';}',
          ],
          z.center_both,
          H.p05,
          T.bn.br2,
          function(e) {
            return e.theme.warn.wash
          },
          function(e) {
            return e.theme.warn.default
          }
        ),
        Zo = function(e) {
          var t = e.environments,
            n = e.sitename,
            a = e.branch
          return t.map(function(e, t) {
            var i = yo(e.env_name, t)
            return r.a.createElement(Uo, {
              key: t,
              sitename: n,
              environment: e.env_name,
              branch: a,
              color: i,
            })
          })
        }
      function Jo(e) {
        var t = e.branch,
          n = e.environments,
          i = e.sitename,
          l = e.closeModal,
          o = Object(a.useRef)(),
          c = function(e) {
            ;(o && o.current && o.current.contains(e.target)) || l()
          },
          s = function(e) {
            27 === e.keyCode && l()
          }
        return (
          Object(a.useEffect)(function() {
            return (
              document.addEventListener('mousedown', c),
              document.addEventListener('keydown', s),
              function() {
                document.removeEventListener('mousedown', c),
                  document.removeEventListener('keydown', s)
              }
            )
          }),
          r.a.createElement(
            Qo,
            { ref: o },
            r.a.createElement(
              Yo,
              null,
              r.a.createElement(
                Xe,
                null,
                'Latest on ',
                r.a.createElement('strong', null, t),
                ' branch'
              ),
              r.a.createElement(Xo, { onClick: l }, r.a.createElement(rt.a, null))
            ),
            r.a.createElement(
              Ko,
              null,
              r.a.createElement(
                ma,
                { gap: 0.5 },
                r.a.createElement(Zo, { environments: n, sitename: i, branch: t })
              )
            )
          )
        )
      }
      var ec = function(e) {
          var t = e.sitename,
            n = e.environments,
            i = e.branch,
            l = Object(a.useState)(!1),
            o = Object(ne.a)(l, 2),
            c = o[0],
            s = o[1]
          return r.a.createElement(
            a.Fragment,
            null,
            r.a.createElement(
              Go,
              {
                onClick: function() {
                  return s(!0)
                },
              },
              r.a.createElement(Xe, { scale: 6 }, 'Latest'),
              ' ',
              r.a.createElement(Pe.a, null)
            ),
            c &&
              r.a.createElement(
                $o,
                null,
                r.a.createElement(
                  qo,
                  null,
                  r.a.createElement(Jo, {
                    branch: i,
                    sitename: t,
                    closeModal: function() {
                      return s(!1)
                    },
                    environments: n,
                  })
                )
              )
          )
        },
        tc = s.default.div.withConfig({
          displayName: 'CommitsTable__Middot',
          componentId: 'sc-7nrsdw-0',
        })(
          ['', ';', ';text-decoration:none;', ';color:hsl(0,0%,85%);'],
          z.fg1.align_center,
          H.pl05,
          R.f2
        ),
        nc = Object(s.default)(o.Link).withConfig({
          displayName: 'CommitsTable__StyledLink',
          componentId: 'sc-7nrsdw-1',
        })(['text-decoration:none;&:hover{span{color:', ';}}'], function(e) {
          return e.theme.space.default
        }),
        ac = (function(e) {
          function t() {
            return (
              Object(L.a)(this, t),
              Object(Ve.a)(this, Object(We.a)(t).apply(this, arguments))
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  var e = this.props,
                    t = e.limit,
                    n = e.loading,
                    i = e.branch,
                    l = e.commits,
                    o = e.sitename,
                    c = e.pullRequest,
                    s = e.environments
                  if (n) return r.a.createElement(Ao, null)
                  var u = l.some(function(e) {
                    var t
                    return !!(
                      'success' ===
                      (null === e || void 0 === e
                        ? void 0
                        : null === (t = e.build) || void 0 === t
                        ? void 0
                        : t.status)
                    )
                  })
                  return r.a.createElement(
                    fo,
                    null,
                    r.a.createElement(
                      Lo,
                      { gridArea: 'branch' },
                      n
                        ? r.a.createElement(Mt, null)
                        : r.a.createElement(
                            a.Fragment,
                            null,
                            r.a.createElement(Do, { pullRequest: c }),
                            r.a.createElement(
                              nc,
                              {
                                to: '/sites/'
                                  .concat(o, '/commits/')
                                  .concat(encodeURIComponent(i)),
                              },
                              r.a.createElement(Xe, { weight: 'bold' }, i)
                            ),
                            u &&
                              r.a.createElement(ec, {
                                sitename: o,
                                environments: s,
                                branch: i,
                              })
                          )
                    ),
                    r.a.createElement(
                      Lo,
                      { gridArea: 'build-header' },
                      r.a.createElement(Xe, { scale: 6, weight: 'bold' }, 'builds')
                    ),
                    r.a.createElement(
                      Lo,
                      { gridArea: 'tests-header' },
                      r.a.createElement(Xe, { scale: 6, weight: 'bold' }, 'tests')
                    ),
                    r.a.createElement(
                      Lo,
                      { gridArea: 'preview-header' },
                      r.a.createElement(Xe, { scale: 6, weight: 'bold' }, 'preview')
                    ),
                    l.slice(0, t).map(function(e) {
                      var t = e.commit_sha,
                        n = e.head_commit,
                        i = n.author,
                        l = n.message,
                        c = n.timestamp,
                        u = n.url,
                        m = e.build,
                        d = e.tests
                      return r.a.createElement(
                        a.Fragment,
                        { key: t },
                        r.a.createElement(No, {
                          author: i,
                          timestamp: c,
                          commit_sha: t,
                          message: l,
                          url: u,
                        }),
                        r.a.createElement(
                          Fo,
                          { gridArea: 'build' },
                          m
                            ? r.a.createElement(
                                r.a.Fragment,
                                null,
                                r.a.createElement(
                                  Xe,
                                  { scale: 6, tone: 'secondary' },
                                  'build'
                                ),
                                m.status
                                  ? r.a.createElement(Sl, {
                                      title:
                                        'ignored' === m.status
                                          ? 'Ignored - missing "build:fab" script.'
                                          : 'Build '.concat(m.status, ' - ').concat(
                                              vo({
                                                started_at: m.started_at,
                                                finished_at: m.finished_at,
                                              })
                                            ),
                                      status: m.status,
                                      to: '/sites/'
                                        .concat(o, '/commit/')
                                        .concat(t, '/#build_log'),
                                    })
                                  : r.a.createElement(tc, null, '\xb7')
                              )
                            : r.a.createElement(
                                r.a.Fragment,
                                null,
                                r.a.createElement(
                                  Xe,
                                  { scale: 6, tone: 'secondary' },
                                  'build'
                                ),
                                r.a.createElement(tc, null, '\xb7')
                              )
                        ),
                        r.a.createElement(
                          Fo,
                          { gridArea: 'tests' },
                          d &&
                            r.a.createElement(
                              r.a.Fragment,
                              null,
                              r.a.createElement(
                                Xe,
                                { scale: 6, tone: 'secondary' },
                                'tests'
                              ),
                              d.test_results && 0 !== d.test_results.length
                                ? d.test_results.map(function(e, n) {
                                    return r.a.createElement(Sl, {
                                      title: ''.concat(e.type, ' - ').concat(e.status),
                                      key: n,
                                      status: e.status,
                                      to: '/sites/'
                                        .concat(o, '/commit/')
                                        .concat(t, '/#test_log'),
                                    })
                                  })
                                : r.a.createElement(tc, null, '\xb7')
                            )
                        ),
                        r.a.createElement(
                          Fo,
                          { gridArea: 'preview' },
                          m && m.bundle_id
                            ? r.a.createElement(
                                r.a.Fragment,
                                null,
                                r.a.createElement(
                                  Xe,
                                  { scale: 6, tone: 'secondary' },
                                  'preview'
                                ),
                                s.map(function(e, t) {
                                  var n = e.env_name
                                  return r.a.createElement(ko, {
                                    key: n,
                                    color: yo(n, t),
                                    env_name: n,
                                    url: Wl({
                                      sitenameSlug: o,
                                      bundleIdSlug: m.bundle_id,
                                      environmentSlug: n,
                                    }),
                                  })
                                })
                              )
                            : r.a.createElement(
                                r.a.Fragment,
                                null,
                                r.a.createElement(
                                  Xe,
                                  { scale: 6, tone: 'secondary' },
                                  'preview'
                                ),
                                s.map(function(e, t) {
                                  var n = e.env_name
                                  return r.a.createElement(ko, {
                                    key: n,
                                    nullState: !0,
                                    env_name: n,
                                    color: yo(n, t),
                                  })
                                })
                              )
                        )
                      )
                    })
                  )
                },
              },
            ]),
            t
          )
        })(r.a.Component)
      ac.defaultProps = { limit: 5 }
      var rc = (function(e) {
          function t() {
            return (
              Object(L.a)(this, t),
              Object(Ve.a)(this, Object(We.a)(t).apply(this, arguments))
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  return r.a.createElement(
                    nt,
                    null,
                    r.a.createElement(
                      ma,
                      null,
                      r.a.createElement(
                        Xe.P,
                        null,
                        'Linc is successfully connected to your repository and is watching for new commits but so far no commits with a ',
                        r.a.createElement('code', null, 'build:fab'),
                        ' ',
                        'script in the package.json have been detected.'
                      ),
                      r.a.createElement(
                        Xe.P,
                        null,
                        'Linc is powered by the open-source standard FAB (',
                        r.a.createElement(
                          'a',
                          {
                            href: 'https://github.com/fab-spec',
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          'Frontend Application Bundles'
                        ),
                        ') to instantly deploy & release any commit.'
                      ),
                      r.a.createElement(
                        Xe,
                        null,
                        r.a.createElement(
                          'a',
                          {
                            href: 'https://linc.sh/knowledge-base/getting-started',
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          'Read more about how to configure your project to generate FABs here'
                        )
                      )
                    )
                  )
                },
              },
            ]),
            t
          )
        })(r.a.Component),
        ic = (function(e) {
          function t() {
            return (
              Object(L.a)(this, t),
              Object(Ve.a)(this, Object(We.a)(t).apply(this, arguments))
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  var e = this.props.sitename
                  return r.a.createElement(
                    nt,
                    null,
                    r.a.createElement(
                      ma,
                      null,
                      r.a.createElement(
                        Xe,
                        { weight: 'bold', as: 'h3' },
                        'No FABs generated'
                      ),
                      r.a.createElement(
                        Xe.P,
                        null,
                        'It looks like your recent commits are failing at their',
                        ' ',
                        r.a.createElement('code', null, 'build:fab'),
                        ' step. Check your recent build logs to inspect the failure.'
                      ),
                      r.a.createElement(
                        Xe.P,
                        null,
                        'If ',
                        r.a.createElement('code', null, 'build:fab'),
                        ' runs successfully on your local machine but fails in Linc, you might have an issue with your',
                        ' ',
                        r.a.createElement(
                          o.Link,
                          { to: '/sites/'.concat(e, '/settings') },
                          'Settings'
                        ),
                        '. If you have an existing CI service, you can generate FABs there and',
                        ' ',
                        r.a.createElement(
                          'a',
                          { href: 'https://linc.sh/docs/using-external-ci-with-linc' },
                          'upload them to Linc'
                        ),
                        '. If you',
                        "'",
                        're still having trouble,',
                        ' ',
                        r.a.createElement(
                          'a',
                          {
                            href: 'https://github.com/bitgenics/linc/issues',
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          'get in touch'
                        ),
                        ' ',
                        'and we',
                        "'",
                        'll help you through it.'
                      ),
                      r.a.createElement(
                        Xe.P,
                        null,
                        'Commits that successfully build produce Frontend Application Bundles (',
                        r.a.createElement(
                          'a',
                          {
                            href: 'https://fab.dev/',
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          'FABs'
                        ),
                        '). FABs are then deployed to shareable preview links, and if they pass testing and get merged to your release branch, will be deployed to production.'
                      ),
                      r.a.createElement(
                        Xe,
                        null,
                        r.a.createElement(
                          'a',
                          {
                            href: 'https://linc.sh/knowledge-base/getting-started',
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          'Read more about how to configure your project to generate FABs here'
                        )
                      )
                    )
                  )
                },
              },
            ]),
            t
          )
        })(r.a.Component),
        lc = {
          from: { opacity: 0, transform: 'scale(.85)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        oc = {
          from: { opacity: 1, transform: 'scale(1)' },
          to: { opacity: 0, transform: 'scale(.85)' },
        },
        cc = Object(s.default)(pn.a).withConfig({
          displayName: 'style__StyledFlipMove',
          componentId: 'sc-1wj50qr-0',
        })(['display:grid;grid-template-rows:auto;grid-gap:3rem;']),
        sc = Object(s.default)(ce).withConfig({
          displayName: 'style__StyledFlexRow',
          componentId: 'sc-1wj50qr-1',
        })(['', ';'], z.align_center),
        uc = function() {
          return r.a.createElement(
            Ti,
            null,
            r.a.createElement(
              ma,
              null,
              r.a.createElement(
                Xe,
                { weight: 'bold', as: 'h3', tone: 'secondary' },
                'No commits detected'
              ),
              r.a.createElement(
                ma,
                null,
                r.a.createElement(
                  Xe.P,
                  { tone: 'secondary' },
                  'New commits will appear here, and are automatically built & tested with Linc by default.',
                  r.a.createElement('br', null),
                  'Try making a new branch ',
                  r.a.createElement('code', null, 'linc-setup'),
                  ' and pushing it.'
                ),
                r.a.createElement(
                  Xe,
                  { tone: 'secondary' },
                  'You can also use an external CI service to build and upload FABs to Linc. See the',
                  ' ',
                  r.a.createElement(
                    'a',
                    {
                      href: 'https://linc.sh/docs/using-external-ci-with-linc',
                      rel: 'noopener noreferrer',
                      target: '_blank',
                    },
                    'docs'
                  ),
                  ' ',
                  'for more info.'
                )
              )
            )
          )
        },
        mc = s.default.div.withConfig({
          displayName: 'ExternalCIMessage__KeyBoxStyle',
          componentId: 'sc-162g3s3-0',
        })(
          ['', ';', ';', ';background:', ';color:', ';max-width:32rem;'],
          z.justify_space_btw.align_center,
          T.br2,
          H.p066,
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.text.default
          }
        ),
        dc = s.default.div.withConfig({
          displayName: 'ExternalCIMessage__IconWrapper',
          componentId: 'sc-162g3s3-1',
        })(['cursor:', ';svg{height:1.2rem;}'], function(e) {
          return e.copied ? 'auto' : 'pointer'
        }),
        pc = function(e) {
          var t = e.apiKey,
            n = Object(a.useState)(!1),
            i = Object(ne.a)(n, 2),
            l = i[0],
            o = i[1]
          return r.a.createElement(
            mc,
            null,
            r.a.createElement(Xe, { scale: 6 }, t),
            r.a.createElement(
              Ro.CopyToClipboard,
              {
                text: t,
                onCopy: function() {
                  return o(!0)
                },
              },
              l
                ? r.a.createElement(dc, { copied: l }, r.a.createElement(at.a, null))
                : r.a.createElement(
                    dc,
                    { copied: l, title: 'copy to clipboard' },
                    r.a.createElement(To.a, null)
                  )
            )
          )
        },
        gc = Object(s.default)(gl.a).withConfig({
          displayName: 'ExternalCIMessage__StyledSquare',
          componentId: 'sc-162g3s3-2',
        })(['margin:-5px 0 -5px 0;']),
        fc = function(e) {
          var t = e.children
          return r.a.createElement(ir, { gap: 0.5 }, r.a.createElement(gc, null), t)
        },
        hc = function(e) {
          var t = e.apiKey
          return r.a.createElement(
            nt,
            null,
            r.a.createElement(
              ma,
              { gap: 2 },
              r.a.createElement(
                Xe,
                { scale: 3, weight: 'bold' },
                'You',
                "'",
                're almost done!'
              ),
              r.a.createElement(
                ma,
                null,
                r.a.createElement(
                  Xe,
                  { weight: 'bold' },
                  'Before you can start generating previews, you',
                  "'",
                  'll need to:'
                ),
                r.a.createElement(
                  fc,
                  null,
                  r.a.createElement(
                    Xe,
                    null,
                    r.a.createElement(
                      'a',
                      {
                        rel: 'noopener noreferrer',
                        href: 'https://fab.dev/',
                        target: '_blank',
                      },
                      'Configure the build step of your frontend repository'
                    ),
                    '.'
                  )
                ),
                r.a.createElement(
                  fc,
                  null,
                  r.a.createElement(
                    Xe,
                    null,
                    r.a.createElement(
                      'a',
                      {
                        rel: 'noopener noreferrer',
                        href: 'https://linc.sh/docs/using-external-ci-with-linc',
                        target: '_blank',
                      },
                      'Configure your frontend repository to upload build artifacts to Linc'
                    ),
                    '.'
                  )
                )
              ),
              r.a.createElement(
                ma,
                { gap: 0.5 },
                r.a.createElement(
                  Xe,
                  { weight: 'medium' },
                  'API key to upload build artifacts to Linc:'
                ),
                r.a.createElement(pc, { apiKey: t })
              )
            )
          )
        }
      function bc(e) {
        var t,
          n = Object(K.m)().sitenameSlug,
          a = Object(Pt.c)(na, {
            variables: { name: n, limit: 20 },
            fetchPolicy: e.fetchPolicy,
          }),
          i = a.loading,
          l = a.error,
          o = a.data
        if (i)
          return r.a.createElement(
            ma,
            { gap: 2 },
            r.a.createElement(Xe, { scale: 4, weight: 'bold' }, 'Recent Commits'),
            r.a.createElement(ma, { gap: 3 }, r.a.createElement(ac, { loading: !0 }))
          )
        if (l)
          return r.a.createElement(
            ma,
            { gap: 2 },
            r.a.createElement(Xe, { scale: 4, weight: 'bold' }, 'Recent Commits'),
            r.a.createElement(Vl, { sitename: n, item: 'recent commits' })
          )
        var c =
          null === o || void 0 === o
            ? void 0
            : null === (t = o.view) || void 0 === t
            ? void 0
            : t.site
        if (c) {
          var s,
            u,
            m,
            d =
              null === c || void 0 === c
                ? void 0
                : null === (s = c.settings) || void 0 === s
                ? void 0
                : s.external_ci_settings,
            p = null === d || void 0 === d ? void 0 : d.external_ci_enabled,
            g = null === d || void 0 === d ? void 0 : d.fab_upload_api_key,
            f = null === c || void 0 === c ? void 0 : c.environments,
            h =
              (null === c || void 0 === c
                ? void 0
                : null === (u = c.commitsFeed) || void 0 === u
                ? void 0
                : u.commits) || [],
            b = (function(e) {
              if (0 === e.length) return 'NO_COMMITS'
              var t = !1,
                n = !0,
                a = !1,
                r = void 0
              try {
                for (
                  var i, l = e[Symbol.iterator]();
                  !(n = (i = l.next()).done);
                  n = !0
                ) {
                  var o,
                    c = null === (o = i.value.build) || void 0 === o ? void 0 : o.status
                  if ('success' === c) return 'SUCCESSFUL_BUILD'
                  'ignored' !== c && (t = !0)
                }
              } catch (s) {
                ;(a = !0), (r = s)
              } finally {
                try {
                  n || null == l.return || l.return()
                } finally {
                  if (a) throw r
                }
              }
              return t ? 'ATTEMPTED_BUILD' : 'NO_BUILDS'
            })(h),
            v = !(function(e) {
              return e.some(function(e) {
                var t = e.build
                return (
                  !!t &&
                  (null === t.status ||
                    'queued' === t.status ||
                    'pending' === t.status ||
                    'running' === t.status)
                )
              })
            })(h),
            E =
              ((m = {}),
              Object(mo.a)(m, 'NO_BUILDS', r.a.createElement(rc, { id: 'nobuilds' })),
              Object(mo.a)(
                m,
                'ATTEMPTED_BUILD',
                r.a.createElement(ic, { id: 'attemptedbuild', sitename: n })
              ),
              m),
            y = (function(e) {
              var t = [],
                n = !0,
                a = !1,
                r = void 0
              try {
                for (
                  var i,
                    l = function() {
                      var e = i.value,
                        n = t.find(function(t) {
                          return t.branch === e.branch
                        })
                      n
                        ? (n.commits.push(e),
                          !n.pullRequest && e.pull_request && (n.pullRequest = !0))
                        : t.push({
                            branch: e.branch,
                            commits: [e],
                            pullRequest: e.pull_request,
                          })
                    },
                    o = e[Symbol.iterator]();
                  !(n = (i = o.next()).done);
                  n = !0
                )
                  l()
              } catch (c) {
                ;(a = !0), (r = c)
              } finally {
                try {
                  n || null == o.return || o.return()
                } finally {
                  if (a) throw r
                }
              }
              return t
            })(h)
          return r.a.createElement(
            ma,
            { gap: 2 },
            p && 0 === h.length
              ? r.a.createElement(hc, { apiKey: g })
              : r.a.createElement(
                  sc,
                  null,
                  r.a.createElement(Xe, { scale: 4, weight: 'bold' }, 'Recent Commits'),
                  p && r.a.createElement($e, { color: 'blue' }, 'External CI enabled')
                ),
            (h.length > 0 && v && E[b]) || null,
            !p && 0 === h.length && r.a.createElement(uc, null),
            r.a.createElement(
              cc,
              {
                enterAnimation: lc,
                leaveAnimation: oc,
                easing: 'cubic-bezier(.24,.7,.13,1.08)',
                duration: 900,
              },
              h.length > 0 &&
                y.map(function(e) {
                  var t = e.branch,
                    a = e.pullRequest,
                    i = e.commits
                  return r.a.createElement(ac, {
                    key: t,
                    branch: t,
                    commits: i,
                    sitename: n,
                    pullRequest: a,
                    environments: f,
                  })
                })
            )
          )
        }
        return r.a.createElement(
          ma,
          { gap: 2 },
          r.a.createElement(Xe, { scale: 4, weight: 'bold' }, 'Recent Commits'),
          r.a.createElement(Vl, { sitename: n, item: 'recent commits' })
        )
      }
      function vc(e) {
        var t = e.fetchPolicy,
          n = Object(K.m)().sitenameSlug
        return (
          Oe('Overview | '.concat(n)),
          r.a.createElement(
            r.a.Fragment,
            null,
            r.a.createElement(uo, { fetchPolicy: t }),
            r.a.createElement(bc, { fetchPolicy: t })
          )
        )
      }
      var Ec = s.default.div.withConfig({
          displayName: 'ColorDot',
          componentId: 'fbatp7-0',
        })(['background:', ';height:0.75rem;width:0.75rem;border-radius:4px;'], function(
          e
        ) {
          return e.color
        }),
        yc = s.default.form.withConfig({
          displayName: 'NewEnvironment__Form',
          componentId: 'sc-188zgsd-0',
        })(
          [
            '',
            ';',
            ';max-width:640px;border-color:',
            ';background:',
            ';box-shadow:',
            ' ',
            ';',
          ],
          z.vertical,
          T.ba.br2,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.default
          },
          U.low,
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          }
        ),
        wc = Object(s.default)(ce).withConfig({
          displayName: 'NewEnvironment__CenteredFlexRow',
          componentId: 'sc-188zgsd-1',
        })(['', ';'], z.center_both),
        _c = s.default.button.withConfig({
          displayName: 'NewEnvironment__NewFormButton',
          componentId: 'sc-188zgsd-2',
        })(
          [
            '',
            ' ',
            ';',
            ';width:640px;background:none;cursor:pointer;color:',
            ';svg{height:1rem;}&:hover{background:',
            ';}',
          ],
          T.bn.br2,
          z.center_both,
          H.ph2.pv1,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.bg.wash
          }
        ),
        xc = function(e) {
          var t = Se(!1),
            n = Object(ne.a)(t, 2),
            i = n[0],
            l = n[1],
            o = (function() {
              var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
                t = Object(a.useState)(e),
                n = Object(ne.a)(t, 2),
                r = n[0],
                i = n[1],
                l = function(e) {
                  if (e.length < 40) {
                    var t = e
                      .replace(/\W+/g, '')
                      .replace(/_/, '')
                      .toUpperCase()
                    i(t)
                  }
                }
              return [r, l]
            })(''),
            c = Object(ne.a)(o, 2),
            s = c[0],
            u = c[1],
            m = e.sitename,
            d = function() {
              return { input: { env_name: s, sitename: e.sitename, settings: [] } }
            },
            p = function() {
              l(!1), u('')
            },
            g = e.environments.some(function(e) {
              return e.env_name === s.toLowerCase()
            }),
            f = !g && s.length > 0,
            h = Object(Pt.b)(Wa, {
              variables: d(),
              onCompleted: p,
              refetchQueries: [{ query: aa, variables: { name: m } }],
            }),
            b = Object(ne.a)(h, 2),
            v = b[0],
            E = b[1],
            y = E.loading,
            w = E.error
          return i
            ? r.a.createElement(
                yc,
                {
                  onSubmit: function(e) {
                    v(d()), e.preventDefault()
                  },
                },
                r.a.createElement(
                  ma,
                  { padding: 1 },
                  r.a.createElement(
                    wc,
                    { internalSpacing: 2 },
                    r.a.createElement(Xe, null, 'Environment name'),
                    r.a.createElement(_t, {
                      inputProps: {
                        maxLength: 10,
                        value: s,
                        type: 'text',
                        isRequired: !0,
                        onChange: function(e) {
                          return u(e.target.value)
                        },
                      },
                    }),
                    r.a.createElement(
                      nr,
                      { onClick: p, type: 'button', disabled: y },
                      'Cancel'
                    ),
                    r.a.createElement(
                      tr,
                      { type: 'submit', disabled: !f, loading: y },
                      'Create'
                    )
                  ),
                  w && r.a.createElement(nt, null, w.message),
                  !1 === !g &&
                    r.a.createElement(
                      nt,
                      { status: 'critical' },
                      r.a.createElement(
                        Xe,
                        null,
                        "Environment with name: '"
                          .concat(s, "' already exists on '")
                          .concat(m, "'")
                      )
                    )
                )
              )
            : r.a.createElement(
                _c,
                { onClick: l },
                r.a.createElement(en.a, null),
                ' ',
                r.a.createElement(Xe, null, 'Add new environment')
              )
        },
        jc = function(e, t, n, a) {
          return {
            input: {
              sitename: e,
              env_name: t.toLowerCase(),
              auto_deploy: n,
              settings: a,
            },
          }
        },
        kc = Object(s.css)(
          ['', ';', ';border:none;background:none;', ';cursor:pointer;svg{height:1rem;}'],
          z.center_both,
          H.ph2.pv1,
          T.br2
        ),
        Oc = s.default.button.withConfig({
          displayName: 'style__DeleteSettingButton',
          componentId: 'sc-1stt926-0',
        })(
          [
            'border:none;background:none;',
            ';color:',
            ';cursor:pointer;&:hover{background:',
            ';}',
          ],
          T.br2,
          function(e) {
            return e.theme.warn.default
          },
          function(e) {
            return e.theme.warn.wash
          }
        ),
        Cc = s.default.button.withConfig({
          displayName: 'style__AddSettingButton',
          componentId: 'sc-1stt926-1',
        })(
          ['', ';color:', ';&:hover{color:', ';background:', ';}'],
          kc,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.bg.wash
          }
        ),
        Sc = s.default.div.withConfig({
          displayName: 'style__RowGrid',
          componentId: 'sc-1stt926-2',
        })(['display:grid;grid-template-columns:auto 1fr auto;grid-gap:0.5rem;']),
        Ic = function(e) {
          var t = Object(Pt.a)(),
            n = e.environment,
            i = Object(a.useState)(null),
            l = Object(ne.a)(i, 2),
            o = l[0],
            c = l[1],
            s = Object(a.useState)(!1),
            u = Object(ne.a)(s, 2),
            m = u[0],
            d = u[1],
            p = Object(a.useState)(!1),
            g = Object(ne.a)(p, 2),
            f = g[0],
            h = g[1],
            b = Object(a.useState)('boolean' !== typeof n.auto_deploy || n.auto_deploy),
            v = Object(ne.a)(b, 2),
            E = v[0],
            y = v[1],
            w = (function(e) {
              var t = Object(a.useState)(e),
                n = Object(ne.a)(t, 2),
                r = n[0],
                i = n[1],
                l = Object(a.useState)(!1),
                o = Object(ne.a)(l, 2),
                c = o[0],
                s = o[1]
              return (
                Object(a.useEffect)(
                  function() {
                    r.every(function(e) {
                      var t = e.name,
                        n = e.value
                      return t.length > 0 && n.length > 0
                    })
                      ? s(!0)
                      : s(!1)
                  },
                  [r]
                ),
                {
                  add: function() {
                    i([].concat(Object(Dr.a)(r), [{ name: '', value: '' }]))
                  },
                  reset: function() {
                    i(e)
                  },
                  delete: function(e) {
                    var t = [].concat(r)
                    t.splice(e, 1), i(t)
                  },
                  getAll: function() {
                    return r.map(function(e) {
                      return { name: e.name, value: e.value }
                    })
                  },
                  setSettingName: function(e, t) {
                    var n = [].concat(r),
                      a = e.replace(/[^a-zA-Z0-9\\_\-\s]/g, '').replace(/\s+/g, '_')
                    ;(n[t].name = a), i(n)
                  },
                  setSettingValue: function(e, t) {
                    var n = [].concat(r)
                    ;(n[t].value = e), i(n)
                  },
                  isValid: c,
                }
              )
            })(n.settings || []),
            _ = Object(a.useState)(!1),
            x = Object(ne.a)(_, 2),
            j = x[0],
            k = x[1],
            O = e.siteAccess.write
          return r.a.createElement(
            Ii,
            {
              onSubmit: function(n) {
                !(function() {
                  d(!0)
                  var n = e.environment
                  t.mutate({
                    mutation: Ua,
                    variables: jc(n.sitename, n.env_name, E, w.getAll()),
                    refetchQueries: [{ query: aa, variables: { name: n.sitename } }],
                  })
                    .then(function() {
                      d(!1), k(!1)
                    })
                    .catch(function(e) {
                      d(!1), c(e)
                    })
                })(),
                  n.preventDefault()
              },
            },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(
                ir,
                { gap: 0.5 },
                r.a.createElement(Ec, { color: e.color }),
                r.a.createElement(
                  Xe,
                  { weight: 'medium', scale: 4 },
                  e.environment.env_name.toUpperCase()
                )
              )
            ),
            r.a.createElement(
              Fi,
              null,
              r.a.createElement(Xe, { weight: 'medium' }, 'Environment variables'),
              r.a.createElement(
                Xe,
                { scale: 6, tone: 'secondary' },
                'These values override the production settings specified in your bundle'
              ),
              0 === w.getAll().length &&
                r.a.createElement(
                  Xe,
                  { scale: 6, tone: 'secondary' },
                  'No environment variables set'
                ),
              r.a.createElement(
                Sc,
                null,
                w.getAll().length > 0 &&
                  w.getAll().map(function(e, t) {
                    return r.a.createElement(
                      a.Fragment,
                      { key: t },
                      r.a.createElement(_t, {
                        size: 16,
                        inputProps: {
                          required: !0,
                          placeholder: 'name',
                          value: e.name,
                          readOnly: !O,
                          onChange: function(e) {
                            w.setSettingName(e.target.value, t), k(!0)
                          },
                        },
                      }),
                      r.a.createElement(_t, {
                        inputProps: {
                          required: !0,
                          placeholder: 'value',
                          value: e.value,
                          readOnly: !O,
                          onChange: function(e) {
                            w.setSettingValue(e.target.value, t), k(!0)
                          },
                        },
                      }),
                      O &&
                        r.a.createElement(
                          Oc,
                          {
                            onClick: function() {
                              w.delete(t), k(!0)
                            },
                            type: 'button',
                          },
                          r.a.createElement(rt.a, null)
                        )
                    )
                  })
              ),
              O &&
                r.a.createElement(
                  Cc,
                  {
                    onClick: function() {
                      w.add(), k(!0)
                    },
                    type: 'button',
                  },
                  r.a.createElement(en.a, null),
                  ' ',
                  r.a.createElement(Xe, null, 'Add settings')
                ),
              r.a.createElement(
                ma,
                { gap: 0.5 },
                r.a.createElement(Xe, { weight: 'medium' }, 'Auto deployments'),
                r.a.createElement(
                  'div',
                  null,
                  r.a.createElement(
                    Ai,
                    {
                      type: 'button',
                      onClick: function() {
                        y(!E), k(!0)
                      },
                      disabled: !O,
                    },
                    !0 === E && r.a.createElement(hl.a, null),
                    !1 === E && r.a.createElement(gl.a, null),
                    r.a.createElement(
                      Xe,
                      null,
                      'Generate deployments from this environment automatically'
                    )
                  )
                )
              ),
              o &&
                r.a.createElement(
                  nt,
                  { status: 'critical' },
                  r.a.createElement(Xe, null, o.message)
                )
            ),
            O &&
              r.a.createElement(
                Li,
                null,
                r.a.createElement(
                  ir,
                  { gap: 1 },
                  j &&
                    r.a.createElement(
                      nr,
                      {
                        type: 'button',
                        onClick: function() {
                          var t = e.environment.auto_deploy
                          w.reset(), y('boolean' !== typeof t || t), c(null), k(!1)
                        },
                        disabled: m || f,
                      },
                      'Cancel'
                    ),
                  r.a.createElement(
                    nr,
                    {
                      disabled: m || f,
                      loading: f,
                      type: 'button',
                      onClick: function() {
                        h(!0)
                        var n,
                          a,
                          r = e.environment
                        t.mutate({
                          mutation: Ga,
                          variables:
                            ((n = r.sitename),
                            (a = r.env_name),
                            { sitename: n, env_name: a.toLowerCase() }),
                          refetchQueries: [
                            { query: aa, variables: { name: r.sitename } },
                          ],
                        }).catch(function(e) {
                          h(!1), c(e)
                        })
                      },
                    },
                    'Delete'
                  ),
                  r.a.createElement(
                    tr,
                    { loading: m, type: 'submit', disabled: m || f || !w.isValid || !j },
                    'Save'
                  )
                )
              )
          )
        },
        Nc = Object(s.default)(ma).withConfig({
          displayName: 'style__Container',
          componentId: 'sc-1xabkdm-0',
        })(['width:640px;']),
        Fc = s.default.a.withConfig({
          displayName: 'style__EnvLink',
          componentId: 'sc-1xabkdm-1',
        })(
          [
            'color:',
            ';span{color:',
            ';}&:hover{color:',
            ';span{color:',
            ';}}',
            ';> * + *{',
            '}',
          ],
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          },
          z.align_center,
          H.ml05
        )
      function Lc() {
        var e = Object(K.m)().sitenameSlug
        Oe('Environments | '.concat(e))
        var t = Object(Pt.c)(aa, { variables: { name: e } }),
          n = t.loading,
          a = t.error,
          i = t.data
        if (n) return r.a.createElement(Qe, null)
        if (a)
          return r.a.createElement(
            Nc,
            { gap: 2 },
            r.a.createElement(Xe, { scale: 3, weight: 'bold' }, 'Environments'),
            r.a.createElement(Vl, { sitename: e, item: 'environments' })
          )
        if (i && i.view && i.view.site) {
          var l = i.view.site.environments,
            o = i.view.site.access,
            c = o.write
          return r.a.createElement(
            Nc,
            { gap: 2 },
            r.a.createElement(Xe, { scale: 3, weight: 'bold' }, 'Environments'),
            r.a.createElement(
              ma,
              { gap: 2 },
              l.length - 1 === 0 &&
                r.a.createElement(
                  nt,
                  null,
                  r.a.createElement(
                    ma,
                    null,
                    r.a.createElement(
                      Xe.P,
                      null,
                      'Welcome to the Environments page for',
                      ' ',
                      r.a.createElement('strong', null, e),
                      '. Here you can define one or more Environments.'
                    ),
                    r.a.createElement(
                      Xe.P,
                      null,
                      'An Environment is a set of custom variables that can be injected into your code at runtime. These variables may be used to override settings defined in your',
                      ' ',
                      r.a.createElement('code', null, 'production-settings.json'),
                      ' file located in the same directory as your ',
                      r.a.createElement('code', null, 'package.json'),
                      '.'
                    ),
                    r.a.createElement(
                      Xe.P,
                      null,
                      'You can run any version of your code in any environment defined here.'
                    ),
                    r.a.createElement(
                      Xe.P,
                      null,
                      'See the',
                      ' ',
                      r.a.createElement(
                        'a',
                        { href: 'https://linc.sh/docs/environments' },
                        'environments documentation'
                      ),
                      ' ',
                      'to learn more.'
                    )
                  )
                ),
              r.a.createElement(
                nt,
                null,
                r.a.createElement(
                  ma,
                  null,
                  r.a.createElement(
                    Xe.P,
                    { weight: 'medium' },
                    'The latest release from your ',
                    r.a.createElement('code', null, 'master'),
                    ' branch is available in each environment using these URL aliases:'
                  ),
                  l.slice(1, l.length).map(function(t, n) {
                    var a = t.env_name,
                      i = yo(a, n + 1),
                      l = Ul({ sitenameSlug: e, environmentSlug: a })
                    return r.a.createElement(
                      Fc,
                      { href: l, key: a },
                      r.a.createElement(Ec, { color: i }),
                      r.a.createElement(
                        Xe,
                        null,
                        'https://',
                        e,
                        '--',
                        r.a.createElement('strong', null, a),
                        '.release.linc-preview.sh'
                      )
                    )
                  }),
                  r.a.createElement(
                    Fc,
                    { href: Ul({ sitenameSlug: e, environmentSlug: 'production' }) },
                    r.a.createElement(Ec, { color: yo('production', 0) }),
                    r.a.createElement(
                      Xe,
                      null,
                      'https://',
                      e,
                      '--',
                      r.a.createElement('strong', null, 'production'),
                      '.release.linc-preview.sh'
                    )
                  ),
                  r.a.createElement(
                    Xe.P,
                    { tone: 'secondary' },
                    r.a.createElement('strong', null, 'Note:'),
                    ' Changes to your environments do not require you to rebuild your code.'
                  )
                )
              ),
              l.slice(1, l.length).map(function(e, t) {
                return r.a.createElement(Ic, {
                  siteAccess: o,
                  color: yo(e.env_name, t + 1),
                  environment: e,
                  key: e.env_name,
                })
              }),
              r.a.createElement(
                nt,
                null,
                r.a.createElement(
                  ma,
                  null,
                  r.a.createElement(
                    ir,
                    { style: { alignItems: 'center' }, internalSpacing: 0.5 },
                    r.a.createElement(Ec, { color: yo('production', 0) }),
                    r.a.createElement(
                      Xe,
                      { weight: 'medium', tone: 'secondary', scale: 4 },
                      'PRODUCTION'
                    )
                  ),
                  r.a.createElement(
                    Xe.P,
                    { tone: 'secondary' },
                    'You can configure your production environment variables in the',
                    ' ',
                    r.a.createElement('code', null, 'production-settings.json'),
                    ' file located in your repository'
                  )
                )
              )
            ),
            c
              ? r.a.createElement(xc, { sitename: e, environments: l })
              : r.a.createElement(
                  Xe.P,
                  { fontStyle: 'italic', tone: 'notice' },
                  'To add or edit environments, you must have ',
                  r.a.createElement('strong', null, 'write'),
                  ' ',
                  'permissions on the repository.'
                )
          )
        }
        return r.a.createElement(
          Nc,
          { gap: 2 },
          r.a.createElement(Xe, { scale: 3, weight: 'bold' }, 'Environments'),
          r.a.createElement(Vl, { sitename: e, item: 'environments' })
        )
      }
      var Ac = n(178),
        Pc = n(177),
        Dc = Object(s.keyframes)([
          'from{transform:rotate(0deg);}to{transform:rotate(360deg);}',
        ]),
        Bc = s.default.button.withConfig({
          displayName: 'RebuildButton__Wrapper',
          componentId: 'x1foxb-0',
        })(
          [
            'background:',
            ';border-color:',
            ';',
            ';',
            ';',
            ';> * + *{',
            ';}svg{color:',
            ';height:1rem;width:1rem;',
            '}cursor:pointer;&:hover{border-color:',
            ';svg{color:',
            ';}span{color:',
            ';}}&:disabled{cursor:not-allowed;border-color:',
            ';svg{color:',
            ';}span{color:',
            ';}}',
          ],
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.bg.border
          },
          z.center_both,
          T.ba.br2,
          H.ph1.pv05,
          H.ml05,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return (
              e.loading && Object(s.css)(['animation:', ' 0.7s linear 0s infinite;'], Dc)
            )
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.bg.hairline
          },
          function(e) {
            return e.theme.bg.hairline
          },
          function(e) {
            return e.theme.bg.hairline
          }
        )
      function $c(e) {
        var t = e.sitename,
          n = e.tree_id,
          a = e.buildStatus,
          i = E.ADMIN_MODE,
          l = Object(Pt.b)(Qa, { variables: { sitename: t, tree_id: n } }),
          o = Object(ne.a)(l, 2),
          c = o[0],
          s = o[1],
          u = s.loading,
          m = s.error
        m && console.log(m)
        var d = 'pending' === a || 'running' === a || 'queued' === a || u,
          p =
            'success' === a || 'pending' === a || 'running' === a || 'queued' === a || u,
          g = d ? 'Build in progress...' : 'Rebuild commit',
          f = p ? 'You can only rebuild failed builds' : 'Rebuild commit'
        return r.a.createElement(
          _e,
          {
            content: i ? g : f,
            arrow: !0,
            placement: 'top',
            animation: 'fade',
            animateFill: !1,
            duration: [250, 175],
            delay: [150, 0],
            distance: 8,
          },
          r.a.createElement(
            'div',
            null,
            r.a.createElement(
              Bc,
              {
                disabled: i ? d : p,
                loading: u,
                onClick: function() {
                  c()
                },
              },
              r.a.createElement(Pc.a, null),
              r.a.createElement(Xe, null, u ? 'Restarting...' : 'Rebuild')
            )
          )
        )
      }
      var qc = s.default.div.withConfig({
          displayName: 'Header__Inner',
          componentId: 'sc-16f2tnr-0',
        })(
          ['', ';@media only screen and (max-width:490px){', ';> * + *{', ';}}'],
          z.justify_space_btw,
          z.vertical,
          H.mt1
        ),
        Rc = s.default.a.withConfig({
          displayName: 'Header__Anchor',
          componentId: 'sc-16f2tnr-1',
        })(
          [
            '',
            ';text-decoration:none;color:inherit;&:hover{span{color:',
            ';}svg{color:',
            ';}}> * + *{',
            ';}cursor:pointer;',
          ],
          z.align_center,
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.space.default
          },
          H.ml05
        ),
        Tc = s.default.div.withConfig({
          displayName: 'Header__MessageContainer',
          componentId: 'sc-16f2tnr-2',
        })(['', ';', ';max-width:50rem;'], M.auto_cols.g1.align_center, function(e) {
          return Object(s.css)([
            'text-overflow:ellipsis;overflow:hidden;white-space:nowrap;min-width:0;',
          ])
        }),
        zc = Object(s.default)(ce).withConfig({
          displayName: 'Header__PreviewLinkContainer',
          componentId: 'sc-16f2tnr-3',
        })(['', ';flex-wrap:wrap;'], z.align_center),
        Mc = s.default.a.withConfig({
          displayName: 'Header__PreviewLinkStyle',
          componentId: 'sc-16f2tnr-4',
        })(
          [
            'display:flex;flex-direction:row;justify-content:center;align-items:center;border-style:solid;border-width:2px;border-color:',
            ';color:',
            ';border-radius:0.25rem;',
            ';text-decoration:none;transition:',
            ';svg{width:1rem;height:1rem;}span{',
            ';color:inherit;}&:hover{background:',
            ';color:white;}> * + *{',
            ';}',
          ],
          function(e) {
            return e.color
          },
          function(e) {
            return e.color
          },
          H.ph05.pv025,
          W.on,
          R.f6,
          function(e) {
            return e.color
          },
          H.ml05
        ),
        Hc = function(e) {
          var t = e.sitename,
            n = e.bundle_id,
            a = e.environments
          return r.a.createElement(
            zc,
            { internalSpacing: 0.5 },
            r.a.createElement(Xe, { weight: 'medium' }, 'Preview Links:'),
            a.map(function(e, a) {
              var i = Wl({
                sitenameSlug: t,
                bundleIdSlug: n,
                environmentSlug: e.env_name,
              })
              return r.a.createElement(
                Mc,
                {
                  key: a,
                  rel: 'noopener noreferrer',
                  href: i,
                  color: yo(e.env_name, a),
                  target: '_blank',
                },
                r.a.createElement(Xe, { weight: 'bold' }, e.env_name),
                r.a.createElement(Pe.a, null)
              )
            })
          )
        },
        Vc = s.default.div.withConfig({
          displayName: 'Header__IconAndText',
          componentId: 'sc-16f2tnr-5',
        })(
          ['', ';', ';color:', ';svg{color:', ';width:1.1rem;padding-right:0.5rem;}'],
          R.no_underline.bold.f5,
          z.align_center,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.text.default
          }
        )
      function Wc(e) {
        var t = e.tree_id,
          n = e.environments,
          a = e.branch,
          i = e.head_commit,
          l = e.build,
          o = e.repository,
          c = Object(K.m)(),
          s = c.sitenameSlug,
          u = c.commitShaSlug,
          m = i.message,
          d = i.author,
          p = null === l || void 0 === l ? void 0 : l.bundle_id,
          g = d.username ? 'https://github.com/'.concat(d.username) : '',
          f = ''.concat(o, '/tree/').concat(a),
          h = ''.concat(o, '/commit/').concat(u)
        return r.a.createElement(
          dt,
          null,
          r.a.createElement(
            qc,
            null,
            r.a.createElement(
              ma,
              null,
              r.a.createElement(
                ir,
                { gap: 1 },
                r.a.createElement(
                  Vc,
                  { title: 'Commit SHA', as: 'a', href: h, target: '_blank' },
                  r.a.createElement(ml.a, null),
                  ' ',
                  u.slice(0, 9)
                ),
                r.a.createElement(
                  Vc,
                  { title: 'Branch', as: 'a', href: f, target: '_blank' },
                  r.a.createElement(il.a, null),
                  ' ',
                  a
                ),
                r.a.createElement(
                  Vc,
                  { title: 'Tree ID' },
                  r.a.createElement(Ac.a, null),
                  ' ',
                  t.slice(0, 9)
                )
              ),
              r.a.createElement(
                Tc,
                null,
                d.name &&
                  r.a.createElement(
                    Rc,
                    { href: g, target: '_blank' },
                    r.a.createElement(Le, { name: d.name, username: d.username }),
                    r.a.createElement(Xe, { weight: 'bold' }, d.name)
                  ),
                m && r.a.createElement(Xe, { weight: 'medium', fontStyle: 'italic' }, m)
              ),
              s &&
                n &&
                p &&
                r.a.createElement(Hc, { sitename: s, environments: n, bundle_id: p })
            ),
            l &&
              r.a.createElement(
                'div',
                null,
                r.a.createElement($c, { sitename: s, tree_id: t, buildStatus: l.status })
              )
          )
        )
      }
      var Uc = s.default.div.withConfig({
          displayName: 'style__Container',
          componentId: 'inbigt-0',
        })(['', ';overflow-x:auto;box-shadow:', ' ', ';'], z.vertical, U.low, function(
          e
        ) {
          var t = e.theme
          return Q(t.bg.reverse, 0.2)
        }),
        Gc = s.default.ul.withConfig({
          displayName: 'style__Content',
          componentId: 'inbigt-1',
        })(
          [
            '',
            ';padding:0.75rem 0 0.75rem 0;background:',
            ';color:',
            ';border-radius:0 0 0.25rem 0.25rem;overflow-x:auto;',
            ' > li{white-space:nowrap;}',
          ],
          z.vertical,
          function(e) {
            return e.theme.bg.reverse
          },
          function(e) {
            return e.theme.text.reverse
          },
          function(e) {
            return !1 === e.expanded && Object(s.css)(['display:none;'])
          }
        ),
        Qc = s.default.li.withConfig({
          displayName: 'style__Placeholder',
          componentId: 'inbigt-2',
        })(
          ['', ';', ';', ';height:1.2rem;font-family:monospace;color:hsl(0,0%,90%);'],
          R.f6,
          z.align_center,
          H.ph1
        ),
        Yc = n(179),
        Kc = n(180),
        Xc = Object(s.keyframes)([
          '0%{transform:rotate(0);}100%{transform:rotate(360deg);}',
        ]),
        Zc = Object(s.css)(
          [
            'animation-name:',
            ';animation-duration:2000ms;animation-iteration-count:infinite;animation-timing-function:linear;transform-origin:12px 12px;',
          ],
          Xc
        ),
        Jc = {
          null: r.a.createElement(Yc.a, null),
          undefined: r.a.createElement(Yc.a, null),
          queued: r.a.createElement(Kc.a, null),
          pending: r.a.createElement(ot.a, null),
          running: r.a.createElement(ot.a, null),
          success: r.a.createElement(at.a, null),
          failed: r.a.createElement(rt.a, null),
        },
        es = s.default.header.withConfig({
          displayName: 'Header__Container',
          componentId: 'lr6b8q-0',
        })(
          [
            'cursor:pointer;overflow-x:hidden;',
            ';',
            ';border-radius:0.25rem 0.25rem 0 0;span{color:',
            ';}background:hsl(221,15%,39%);',
            ';',
            ';',
            ';transition:',
            ';> * + *{',
            ';}',
          ],
          z.justify_space_btw,
          H.p1,
          function(e) {
            return e.theme.text.reverse
          },
          function(e) {
            return (
              'success' === e.status &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.success.default
              })
            )
          },
          function(e) {
            return (
              ('pending' === e.status || 'running' === e.status) &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.special.default
              })
            )
          },
          function(e) {
            return (
              'failed' === e.status &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.warn.default
              })
            )
          },
          W.off,
          H.ml1
        ),
        ts = s.default.div.withConfig({
          displayName: 'Header__Content',
          componentId: 'lr6b8q-1',
        })(['', ';> * + *{', ';}'], z.align_center, H.ml05),
        ns = s.default.div.withConfig({
          displayName: 'Header__IconContainer',
          componentId: 'lr6b8q-2',
        })(
          ['', ';', ';svg{color:', ';}'],
          function(e) {
            return 'pending' === e.status && Zc
          },
          function(e) {
            return 'running' === e.status && Zc
          },
          function(e) {
            return e.theme.text.reverse
          }
        ),
        as = Object(s.default)(Xe).withConfig({
          displayName: 'Header__CommitMessage',
          componentId: 'lr6b8q-3',
        })([
          'white-space:nowrap;min-width:0;max-width:30rem;overflow:hidden;text-overflow:ellipsis;',
        ]),
        rs = s.default.button.withConfig({
          displayName: 'Header__ToggleButton',
          componentId: 'lr6b8q-4',
        })(['background:none;border:none;cursor:pointer;']),
        is = function(e) {
          var t = e.status,
            n = e.commit_sha,
            i = e.message,
            l = e.author,
            o = e.logVisible,
            c = e.toggleLogVisibility,
            s = null === l || void 0 === l ? void 0 : l.username
          return r.a.createElement(
            es,
            { status: t, onClick: c },
            r.a.createElement(
              ts,
              null,
              r.a.createElement(ns, { status: t }, Jc[t]),
              t &&
                r.a.createElement(
                  a.Fragment,
                  null,
                  r.a.createElement(Xe, { weight: 'bold' }, ' - '),
                  r.a.createElement(Xe, { weight: 'bold' }, t)
                ),
              n &&
                r.a.createElement(
                  a.Fragment,
                  null,
                  r.a.createElement(Xe, { weight: 'bold' }, ' - '),
                  r.a.createElement(Xe, null, n.slice(0, 9))
                )
            ),
            r.a.createElement(
              ts,
              null,
              i && r.a.createElement(as, { weight: 'medium' }, i.slice(0, 50)),
              s &&
                r.a.createElement(
                  a.Fragment,
                  null,
                  r.a.createElement(Xe, { weight: 'bold' }, ' ~ '),
                  r.a.createElement(Xe, null, s)
                ),
              r.a.createElement(
                rs,
                null,
                r.a.createElement(
                  ns,
                  null,
                  !0 === o && r.a.createElement(Lt.a, null),
                  !1 === o && r.a.createElement(At.a, null)
                )
              )
            )
          )
        },
        ls = s.default.li.withConfig({
          displayName: 'Block__Line',
          componentId: 'y0lmd2-0',
        })(
          [
            '',
            ';',
            ';',
            ';height:1.2rem;font-family:monospace;color:hsl(0,0%,90%);&:hover{background:hsl(216,8%,16%);}',
            ';',
            ';',
            ';',
          ],
          R.f6,
          z.align_center,
          H.ph1,
          function(e) {
            return (
              'cmd' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.special.default
              })
            )
          },
          function(e) {
            return (
              'log' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.text.reverse
              })
            )
          },
          function(e) {
            return (
              'time' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.success.default
              })
            )
          }
        ),
        os = function(e) {
          var t = e.block,
            n = t.cmd,
            i = t.log,
            l = t.time,
            o = l && ''.concat(Math.round((l / 1e3) * 100) / 100, ' sec')
          return r.a.createElement(
            a.Fragment,
            null,
            n && r.a.createElement(ls, { type: 'cmd' }, n),
            i &&
              i.split('\n').map(function(e, t) {
                return r.a.createElement(
                  ls,
                  { type: 'log', key: ''.concat(e, '-').concat(t) },
                  e
                )
              }),
            l && r.a.createElement(ls, { type: 'time' }, o)
          )
        },
        cs = function(e) {
          var t = Se(!0),
            n = Object(ne.a)(t, 2),
            a = n[0],
            i = n[1],
            l = e.commit_sha,
            o = e.message,
            c = e.author,
            s = e.build,
            u = s.status,
            m = s.logs
          return r.a.createElement(
            Uc,
            { id: 'build_log' },
            r.a.createElement(is, {
              status: u,
              commit_sha: l,
              message: o,
              author: c,
              toggle: i,
              logVisible: a,
              toggleLogVisibility: i,
            }),
            r.a.createElement(
              Gc,
              { expanded: a },
              !m && r.a.createElement(Qc, null, 'No build log'),
              m &&
                m.map(function(e, t) {
                  return r.a.createElement(os, { key: t, block: e })
                })
            )
          )
        },
        ss = Object(s.keyframes)([
          '0%{transform:rotate(0);}100%{transform:rotate(360deg);}',
        ]),
        us = {
          queued: r.a.createElement(Kc.a, null),
          pending: r.a.createElement(ot.a, null),
          success: r.a.createElement(at.a, null),
          failed: r.a.createElement(rt.a, null),
        },
        ms = s.default.header.withConfig({
          displayName: 'Header__Container',
          componentId: 'vgn0xj-0',
        })(
          [
            'cursor:pointer;',
            ';',
            ';border-radius:0.25rem 0.25rem 0 0;span{color:',
            ';}',
            ';',
            ';',
            ';',
            ';transition:',
            ';> * + *{',
            ';}',
          ],
          z.justify_space_btw,
          H.p1,
          function(e) {
            return e.theme.text.reverse
          },
          function(e) {
            return (
              'queued' === e.status &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.special.default
              })
            )
          },
          function(e) {
            return (
              'success' === e.status &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.success.default
              })
            )
          },
          function(e) {
            return (
              'pending' === e.status &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.special.default
              })
            )
          },
          function(e) {
            return (
              'failed' === e.status &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.warn.default
              })
            )
          },
          W.off,
          H.ml1
        ),
        ds = s.default.div.withConfig({
          displayName: 'Header__IconContainer',
          componentId: 'vgn0xj-1',
        })(
          ['', ';svg{color:', ';}'],
          function(e) {
            return (
              'pending' === e.status &&
              Object(s.css)(
                [
                  'animation-name:',
                  ';animation-duration:2000ms;animation-iteration-count:infinite;animation-timing-function:linear;transform-origin:12px 12px;',
                ],
                ss
              )
            )
          },
          function(e) {
            return e.theme.text.reverse
          }
        ),
        ps = s.default.div.withConfig({
          displayName: 'Header__Content',
          componentId: 'vgn0xj-2',
        })(['', ';> * + *{', ';}'], z.align_center, H.ml05),
        gs = s.default.button.withConfig({
          displayName: 'Header__ToggleButton',
          componentId: 'vgn0xj-3',
        })(['background:none;border:none;cursor:pointer;']),
        fs = function(e) {
          var t = e.expanded,
            n = e.status,
            a = e.description,
            i = e.toggleExpanded
          return r.a.createElement(
            ms,
            { status: n, onClick: i },
            r.a.createElement(
              ps,
              null,
              r.a.createElement(ds, { status: n }, us[n]),
              r.a.createElement(Xe, { weight: 'bold' }, ' - '),
              r.a.createElement(Xe, { weight: 'bold' }, n),
              r.a.createElement(Xe, { weight: 'bold' }, ' - '),
              r.a.createElement(Xe, { weight: 'bold' }, a)
            ),
            r.a.createElement(
              ps,
              null,
              r.a.createElement(
                gs,
                null,
                r.a.createElement(
                  ds,
                  null,
                  t ? r.a.createElement(Lt.a, null) : r.a.createElement(At.a, null)
                )
              )
            )
          )
        },
        hs = s.default.li.withConfig({
          displayName: 'Block__Line',
          componentId: 'yq8dk4-0',
        })(
          [
            '',
            ';',
            ';',
            ';height:1.2rem;font-family:monospace;color:hsl(0,0%,90%);&:hover{background:hsl(216,8%,16%);}',
            ';',
            ';',
            ';',
            ';',
          ],
          R.f6,
          z.align_center,
          H.ph1,
          function(e) {
            return (
              'err' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.warn.default
              })
            )
          },
          function(e) {
            return (
              'cmd' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.special.default
              })
            )
          },
          function(e) {
            return (
              'log' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.text.reverse
              })
            )
          },
          function(e) {
            return (
              'time' === e.type &&
              Object(s.css)(['color:', ';'], function(e) {
                return e.theme.success.default
              })
            )
          }
        ),
        bs = function(e) {
          var t = e.block,
            n = t.err,
            i = t.cmd,
            l = t.log,
            o = t.time,
            c = o && ''.concat(Math.round((o / 1e3) * 100) / 100, ' sec')
          return r.a.createElement(
            a.Fragment,
            null,
            n && r.a.createElement(hs, { type: 'err' }, n),
            i && r.a.createElement(hs, { type: 'cmd' }, i),
            l &&
              l.split('\n').map(function(e, t) {
                return r.a.createElement(
                  hs,
                  { type: 'log', key: ''.concat(e, '-').concat(t) },
                  e
                )
              }),
            o && r.a.createElement(hs, { type: 'time' }, c)
          )
        },
        vs = s.default.div.withConfig({
          displayName: 'style__Container',
          componentId: 'sc-134shvn-0',
        })(['', ';box-shadow:', ' ', ';'], z.vertical, U.low, function(e) {
          var t = e.theme
          return Q(t.bg.reverse, 0.2)
        }),
        Es = s.default.ul.withConfig({
          displayName: 'style__Content',
          componentId: 'sc-134shvn-1',
        })(
          [
            '',
            ';padding:0.75rem 0 0.75rem 0;background:',
            ';color:',
            ';border-radius:0 0 0.25rem 0.25rem;',
            ' overflow-x:auto;> li{white-space:nowrap;}',
          ],
          z.vertical,
          function(e) {
            return e.theme.bg.reverse
          },
          function(e) {
            return e.theme.text.reverse
          },
          function(e) {
            return !1 === e.expanded && Object(s.css)(['display:none;'])
          }
        ),
        ys = function(e) {
          var t = Se(!0),
            n = Object(ne.a)(t, 2),
            a = n[0],
            i = n[1],
            l = e.result,
            o = l.description,
            c = l.logs,
            s = l.status
          return r.a.createElement(
            vs,
            { id: 'test_log' },
            r.a.createElement(fs, {
              expanded: a,
              status: s,
              description: o,
              toggleExpanded: i,
            }),
            r.a.createElement(
              Es,
              { expanded: a },
              c &&
                c.map(function(e, t) {
                  return r.a.createElement(bs, { key: t, block: e })
                }),
              c &&
                0 === c.length &&
                r.a.createElement(bs, { block: { log: 'No test log' } })
            )
          )
        }
      function ws() {
        var e = Object(I.a)([
          '\n  subscription($sitename: String!) {\n    deploymentStatusEvents(sitename: $sitename) {\n      sitename\n      bundle_id\n      deployment_status {\n        deploy_target_name\n        timestamp\n        message\n        status\n      }\n    }\n  }\n',
        ])
        return (
          (ws = function() {
            return e
          }),
          e
        )
      }
      function _s() {
        var e = Object(I.a)([
          '\n  subscription($sitename: String!) {\n    releaseStatusV2Updated(sitename: $sitename) {\n      is_configured\n      sitename\n      modified_at\n      release_branch\n      current_release {\n        bundle_id\n        deployed_at\n      }\n      commit {\n        repo_url\n        timestamp\n        author {\n          name\n          username\n        }\n        commit_sha\n        branch\n        message\n      }\n      deployment_statuses {\n        deploy_target_name\n        message\n        status\n        timestamp\n      }\n    }\n  }\n',
        ])
        return (
          (_s = function() {
            return e
          }),
          e
        )
      }
      function xs() {
        var e = Object(I.a)([
          '\n  ',
          '\n  ',
          '\n  ',
          '\n  subscription($sitename: String!, $tree_id: String) {\n    commit_events(sitename: $sitename, tree_id: $tree_id) {\n      tree_id\n      branch\n      commit_sha\n      repository\n      ...Tests\n      ...HeadCommit\n      ...Build\n    }\n  }\n',
        ])
        return (
          (xs = function() {
            return e
          }),
          e
        )
      }
      var js = Bt()(xs(), qn, Rn, Tn),
        ks = Bt()(_s()),
        Os = Bt()(ws()),
        Cs = n(181),
        Ss = Object(s.css)(
          [
            '',
            ';',
            ';',
            ';cursor:pointer;background:none;transition:200ms ease all;border-color:',
            ';',
          ],
          z.align_center,
          T.ba.br2,
          H.p05,
          function(e) {
            return e.theme.bg.hairline
          }
        ),
        Is = Object(s.css)(
          ['border-color:', ';span{color:', ';}'],
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.default
          }
        ),
        Ns = Object(s.css)(
          ['border-color:', ';span{color:', ';}background:', ';'],
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return e.theme.brand.wash
          }
        ),
        Fs = s.default.a.withConfig({
          displayName: 'BranchTag',
          componentId: 'sc-1l699p5-0',
        })(['', ';&:hover{', ';}', ';'], Ss, Is, function(e) {
          return e.selected && Ns
        }),
        Ls = Object(s.default)(ma).withConfig({
          displayName: 'MetaData__Wrapper',
          componentId: 'goeoj4-0',
        })(['', ';background:', ';'], T.br2, function(e) {
          return e.theme.bg.wash
        })
      function As(e) {
        var t = e.metaData,
          n = t.parsedUserAgent,
          a = t.height,
          i = t.width,
          l = t.innerHeight,
          o = t.innerWidth,
          c = t.scrollX,
          s = t.scrollY
        return r.a.createElement(
          Ls,
          { padding: 1, gap: 0.5 },
          n &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'userAgent: ', n)
            ),
          a &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'height: ', a)
            ),
          i &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'width: ', i)
            ),
          l &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'innerHeight: ', l)
            ),
          o &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'innerWidth: ', o)
            ),
          c &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'scrollX: ', c)
            ),
          s &&
            r.a.createElement(
              Xe,
              { tone: 'secondary', scale: 6 },
              r.a.createElement('code', null, 'scrollY: ', s)
            )
        )
      }
      var Ps = s.default.div.withConfig({
          displayName: 'style__Header',
          componentId: 'sc-15030eb-0',
        })(['', ';'], z.justify_space_btw.align_center),
        Ds = s.default.div.withConfig({
          displayName: 'style__BaselineFlexRow',
          componentId: 'sc-15030eb-1',
        })(['', ';> * + *{', ';}'], z.align_baseline, H.ml05),
        Bs = s.default.div.withConfig({
          displayName: 'style__CenteredFlexRow',
          componentId: 'sc-15030eb-2',
        })(['', ';> * + *{', ';}'], z.align_center, H.ml05),
        $s = s.default.div.withConfig({
          displayName: 'style__Content',
          componentId: 'sc-15030eb-3',
        })(
          [
            '',
            ';> * + *{',
            ';}@media only screen and (max-width:600px){',
            ';> * + *{',
            ';}}',
          ],
          z,
          H.ml1,
          z.vertical,
          H.ml0.mt1
        ),
        qs = s.default.pre.withConfig({
          displayName: 'style__Comment',
          componentId: 'sc-15030eb-4',
        })(['max-width:30rem;', ';white-space:pre-wrap;'], R.f6),
        Rs = s.default.img.withConfig({
          displayName: 'style__Image',
          componentId: 'sc-15030eb-5',
        })(
          [
            'max-width:20rem;min-width:10rem;max-height:10rem;min-height:10rem;',
            ';border-color:',
            ';',
          ],
          T.ba.br2,
          function(e) {
            return e.theme.bg.border
          }
        ),
        Ts = s.default.div.withConfig({
          displayName: 'style__Footer',
          componentId: 'sc-15030eb-6',
        })(
          [
            '',
            ';button{padding:none;margin:none;background:none;border:none;cursor:pointer;color:',
            ';}',
          ],
          z.center_both,
          function(e) {
            return e.theme.text.alt
          }
        ),
        zs = s.default.div.withConfig({
          displayName: 'style__NoImage',
          componentId: 'sc-15030eb-7',
        })(
          ['', ';', ';background:', ';height:10rem;width:10rem;> * + *{', ';}'],
          z.vertical.center_both,
          T.br2,
          function(e) {
            return e.theme.bg.wash
          },
          H.mt025
        ),
        Ms = function() {
          return r.a.createElement(
            dt,
            null,
            r.a.createElement(
              ma,
              { gap: 0.5 },
              r.a.createElement(
                Ps,
                null,
                r.a.createElement(
                  Bs,
                  null,
                  r.a.createElement(Mt, null),
                  r.a.createElement(Mt, null)
                ),
                r.a.createElement(Bs, null, r.a.createElement(Mt, null))
              ),
              r.a.createElement(
                $s,
                null,
                r.a.createElement(Ht, { height: 10, width: 20 }),
                r.a.createElement(
                  ma,
                  null,
                  r.a.createElement(Mt, null),
                  r.a.createElement(
                    ma,
                    null,
                    r.a.createElement(Mt, null),
                    r.a.createElement(Mt, null)
                  )
                )
              ),
              r.a.createElement(
                Ts,
                null,
                r.a.createElement(
                  'button',
                  { disabled: !0 },
                  r.a.createElement(Cs.a, null)
                )
              )
            )
          )
        }
      function Hs(e) {
        var t = e.loading,
          n = e.feedback,
          i = e.branchTags,
          l = Object(a.useState)(!1),
          o = Object(ne.a)(l, 2),
          c = o[0],
          s = o[1]
        if (t) return r.a.createElement(Ms, null)
        var u = n.author_name,
          m = n.comment,
          d = n.created_at,
          p = n.current_url,
          g = n.screenshot_url,
          f = n.associated_branches,
          h = n.browser_metadata
        return r.a.createElement(
          dt,
          null,
          r.a.createElement(
            ma,
            { gap: 0.5 },
            r.a.createElement(
              Ps,
              null,
              r.a.createElement(
                Ds,
                null,
                r.a.createElement(Xe, null, u),
                r.a.createElement(
                  Xe,
                  { scale: 6, tone: 'secondary' },
                  Object(ho.a)(parseInt(d)),
                  ' ago'
                )
              ),
              r.a.createElement(
                Bs,
                null,
                f.map(function(e) {
                  return r.a.createElement(
                    Fs,
                    { key: e, selected: i && i.includes(e) },
                    r.a.createElement(Xe, { tone: 'secondary', scale: 6 }, e)
                  )
                })
              )
            ),
            r.a.createElement(
              $s,
              null,
              g
                ? r.a.createElement(
                    'a',
                    { href: g, target: '_blank', rel: 'noreferrer noopener' },
                    r.a.createElement(Rs, { src: g })
                  )
                : r.a.createElement(
                    zs,
                    null,
                    r.a.createElement(Xe, { tone: 'placeholder' }, 'No image'),
                    r.a.createElement(Xe, { tone: 'placeholder' }, 'attached')
                  ),
              r.a.createElement(
                ma,
                { style: { alignSelf: 'flex-start' } },
                r.a.createElement(
                  Xe,
                  { scale: 6 },
                  r.a.createElement(
                    'a',
                    { href: p, target: '_blank', rel: 'noreferrer noopener' },
                    p
                  )
                ),
                r.a.createElement(qs, null, m)
              )
            ),
            c && r.a.createElement(As, { metaData: h }),
            r.a.createElement(
              Ts,
              null,
              r.a.createElement(
                'button',
                {
                  onClick: function() {
                    return s(!c)
                  },
                },
                r.a.createElement(Cs.a, null)
              )
            )
          )
        )
      }
      var Vs = (function(e) {
        function t() {
          var e, n
          Object(L.a)(this, t)
          for (var a = arguments.length, r = new Array(a), i = 0; i < a; i++)
            r[i] = arguments[i]
          return (
            ((n = Object(Ve.a)(
              this,
              (e = Object(We.a)(t)).call.apply(e, [this].concat(r))
            )).subscribe = function() {
              var e = n.props,
                t = e.commit,
                a = e.sitename,
                r = e.subscribeToMore,
                i = null === t || void 0 === t ? void 0 : t.tree_id
              if (i && a)
                return r({
                  document: js,
                  variables: { sitename: a, tree_id: i },
                  updateQuery: function(e, t) {
                    var n = t.subscriptionData
                    if (!n.data) return e
                    var a = n.data.commit_events
                    return ri.a.set(e, 'view.site.commit', a)
                  },
                })
            }),
            n
          )
        }
        return (
          Object(Ue.a)(t, e),
          Object(A.a)(t, [
            {
              key: 'componentDidMount',
              value: function() {
                this.unsubscribe = this.subscribe()
              },
            },
            {
              key: 'componentWillUnmount',
              value: function() {
                this.unsubscribe && this.unsubscribe()
              },
            },
            {
              key: 'render',
              value: function() {
                var e,
                  t,
                  n = this.props,
                  i = n.environments,
                  l = n.commit,
                  o = l.tree_id,
                  c = l.branch,
                  s = l.commit_sha,
                  u = l.head_commit,
                  m = l.repository,
                  d = u.message,
                  p = u.author,
                  g =
                    null === l || void 0 === l
                      ? void 0
                      : null === (e = l.bundle) || void 0 === e
                      ? void 0
                      : e.allBundleFeedback,
                  f = null === l || void 0 === l ? void 0 : l.build,
                  h =
                    null === l || void 0 === l
                      ? void 0
                      : null === (t = l.tests) || void 0 === t
                      ? void 0
                      : t.test_results
                return r.a.createElement(
                  a.Fragment,
                  null,
                  r.a.createElement(Wc, {
                    tree_id: o,
                    environments: i,
                    branch: c,
                    commit_sha: s,
                    head_commit: u,
                    build: f,
                    repository: m,
                  }),
                  r.a.createElement(
                    ma,
                    { gap: 2 },
                    g &&
                      g.length > 0 &&
                      r.a.createElement(
                        ma,
                        null,
                        r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Feedback'),
                        g.map(function(e, t) {
                          return r.a.createElement(Hs, { key: t, feedback: e })
                        })
                      ),
                    r.a.createElement(
                      ma,
                      { gap: 1 },
                      r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Build log'),
                      f
                        ? r.a.createElement(cs, {
                            commit_sha: s,
                            message: d,
                            author: p,
                            build: f,
                          })
                        : r.a.createElement(
                            Xe,
                            { tone: 'secondary' },
                            'No build log to display'
                          )
                    )
                  ),
                  r.a.createElement(
                    ma,
                    { gap: 1 },
                    r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Test logs'),
                    h
                      ? h.map(function(e, t) {
                          return r.a.createElement(ys, { key: t, result: e })
                        })
                      : r.a.createElement(
                          Xe,
                          { tone: 'secondary' },
                          'No test results to display'
                        )
                  )
                )
              },
            },
          ]),
          t
        )
      })(r.a.Component)
      function Ws() {
        var e,
          t,
          n,
          a,
          i = Object(K.m)(),
          l = i.sitenameSlug,
          o = i.commitShaSlug,
          c = Object(Pt.c)(Jn, { variables: { sitename: l, commit_sha: o } }),
          s = c.loading,
          u = c.error,
          m = c.data,
          d = c.subscribeToMore
        if (s) return r.a.createElement(Qe, null)
        if (u) return ''.concat(u.message)
        var p =
            null === m || void 0 === m
              ? void 0
              : null === (e = m.view) || void 0 === e
              ? void 0
              : null === (t = e.site) || void 0 === t
              ? void 0
              : t.commit,
          g =
            null === m || void 0 === m
              ? void 0
              : null === (n = m.view) || void 0 === n
              ? void 0
              : null === (a = n.site) || void 0 === a
              ? void 0
              : a.environments
        return p && g
          ? r.a.createElement(Vs, {
              subscribeToMore: d,
              environments: g,
              sitename: l,
              commit: p,
            })
          : r.a.createElement(
              nt,
              { status: 'critical' },
              r.a.createElement(Xe, null, 'ERROR: Unable to render Commit page')
            )
      }
      var Us = Object(s.css)(
          ['', ';', ';border:none;background:none;', ';cursor:pointer;svg{height:1rem;}'],
          z.center_both,
          H.ph2.pv1,
          T.br2
        ),
        Gs = s.default.button.withConfig({
          displayName: 'style__FetchMoreButton',
          componentId: 'sc-1qgiouz-0',
        })(
          [
            '',
            ';color:',
            ';&:hover{color:',
            ';background:',
            ';}&[disabled]{color:',
            ';span{color:',
            ';}cursor:progress;}',
          ],
          Us,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.text.secondary
          }
        ),
        Qs = {
          noCommitsFound: function(e) {
            var t = e.branch,
              n = e.sitename
            return "0 commits found for branch '".concat(t, "' on site '").concat(n, "'")
          },
          noMatchesFound: function(e) {
            var t = e.filter
            return "No matches found for '".concat(t, "'")
          },
          noOlderCommitsFound: function(e) {
            var t = e.branch,
              n = e.sitename
            return "No older commits found for branch '"
              .concat(t, "' on site '")
              .concat(n, "'")
          },
        },
        Ys = (function(e) {
          function t() {
            var e, n
            Object(L.a)(this, t)
            for (var a = arguments.length, r = new Array(a), i = 0; i < a; i++)
              r[i] = arguments[i]
            return (
              ((n = Object(Ve.a)(
                this,
                (e = Object(We.a)(t)).call.apply(e, [this].concat(r))
              )).state = { filter: '' }),
              (n.setFilter = function(e) {
                n.setState({ filter: e })
              }),
              n
            )
          }
          return (
            Object(Ue.a)(t, e),
            Object(A.a)(t, [
              {
                key: 'render',
                value: function() {
                  var e = this,
                    t = this.state.filter,
                    n = this.props,
                    i = n.loading,
                    l = n.onLoadMore,
                    o = n.branch,
                    c = n.sitename,
                    s = n.environments,
                    u = n.hasNextPage
                  return r.a.createElement(
                    ma,
                    { gap: 1 },
                    r.a.createElement(_t, {
                      inputProps: {
                        placeholder: 'Filter commits',
                        onChange: function(t) {
                          return e.setFilter(t.target.value)
                        },
                      },
                    }),
                    0 === this.filtered.length &&
                      r.a.createElement(Xe, null, Qs.noMatchesFound({ filter: t })),
                    this.filtered.length > 0 &&
                      r.a.createElement(
                        a.Fragment,
                        null,
                        r.a.createElement(ac, {
                          commits: this.filtered,
                          branch: o,
                          environments: s,
                          sitename: c,
                          limit: 1e3,
                        }),
                        !0 === u &&
                          r.a.createElement(
                            Gs,
                            { onClick: l, disabled: i },
                            !0 === i &&
                              r.a.createElement(
                                ir,
                                { gap: 1 },
                                r.a.createElement(Xe, null, 'Load more'),
                                r.a.createElement(He, null)
                              ),
                            !1 === i && r.a.createElement(Xe, null, 'Load More')
                          ),
                        !1 === u &&
                          r.a.createElement(
                            Xe,
                            { tone: 'secondary' },
                            Qs.noOlderCommitsFound({ branch: o, sitename: c })
                          )
                      )
                  )
                },
              },
              {
                key: 'filtered',
                get: function() {
                  var e = this.state.filter,
                    t = this.props.commits
                  return e.length > 0
                    ? t.filter(function(t) {
                        var n = t.head_commit,
                          a = n.message,
                          r = n.author
                        return [a, r.name, r.username].some(function(t) {
                          return t.toLowerCase().includes(e.toLowerCase())
                        })
                      })
                    : t
                },
              },
            ]),
            t
          )
        })(a.Component)
      function Ks() {
        var e = Object(K.m)(),
          t = e.sitenameSlug,
          n = e.branchSlug,
          a = decodeURIComponent(n),
          i = { sitename: t, limit: 20, branch: a },
          l = Object(Pt.c)(ea, { variables: i, notifyOnNetworkStatusChange: !0 }),
          o = l.data,
          c = l.error,
          s = l.fetchMore,
          u = l.networkStatus
        if (c)
          return r.a.createElement(
            ma,
            { gap: 3 },
            r.a.createElement(Xe, { weight: 'bold', scale: 3 }, 'Commits by branch'),
            r.a.createElement(nt, null, c.message)
          )
        if (u === f.c.loading)
          return r.a.createElement(
            ma,
            { gap: 3 },
            r.a.createElement(Xe, { weight: 'bold', scale: 3 }, 'Commits by branch'),
            r.a.createElement(He, null)
          )
        var m = o.view.site,
          d = m.environments,
          p = m.commitsFeed,
          g = p.commits,
          h = p.cursor,
          b = p.hasNextPage
        return 0 === g.length
          ? r.a.createElement(
              ma,
              { gap: 3 },
              r.a.createElement(Xe, { weight: 'bold', scale: 3 }, 'Commits by branch'),
              r.a.createElement(
                nt,
                { status: 'warning' },
                r.a.createElement(
                  Xe,
                  null,
                  Qs.noCommitsFound({ branchName: a, sitename: t })
                )
              )
            )
          : r.a.createElement(
              ma,
              { gap: 3 },
              r.a.createElement(Xe, { weight: 'bold', scale: 3 }, 'Commits by branch'),
              r.a.createElement(Ys, {
                branch: a,
                loading: u === f.c.fetchMore,
                commits: g || [],
                environments: d,
                sitename: t,
                onLoadMore: function() {
                  s({
                    query: ea,
                    variables: Object(pt.a)({}, i, { cursor: h }),
                    updateQuery: function(e, t) {
                      return (function(e, t) {
                        var n = e.view.site.commitsFeed.commits,
                          a = t.view.site.commitsFeed.commits,
                          r = {
                            cursor: t.view.site.commitsFeed.cursor,
                            hasNextPage: t.view.site.commitsFeed.hasNextPage,
                            commits: [].concat(Object(Dr.a)(n), Object(Dr.a)(a)),
                          }
                        return ri.a.assign(e, 'view.site.commitsFeed', r)
                      })(e, t.fetchMoreResult)
                    },
                  })
                },
                hasNextPage: b,
              })
            )
      }
      var Xs = s.default.ul.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'hz9f8b-0',
        })(
          [
            '',
            ';flex-basis:14rem;overflow:hidden;',
            ';border-color:',
            ';> * + *{border-style:solid;border-color:',
            ';border-width:1px 0 0 0;}@media only screen and (min-width:930px){top:8rem;position:sticky;}@media only screen and (max-width:930px){width:100%;}',
          ],
          z.vertical,
          T.br2.ba,
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.theme.bg.border
          }
        ),
        Zs = Object(s.default)(bl.HashLink).withConfig({
          displayName: 'Section__SectionContainer',
          componentId: 'sc-1nc7uyq-0',
        })(
          [
            '',
            ';border-width:1px 0 0 0;border-style:solid;text-decoration:none;color:',
            ';background:',
            ';border-color:',
            ';',
            ';&:hover{color:',
            ';}',
          ],
          H.pv066.ph15,
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return e.isActive ? R.f6.bold : R.f6
          },
          function(e) {
            return e.theme.text.default
          }
        )
      function Js(e) {
        var t = e.title,
          n = e.hashlink,
          a = Object(K.l)().hash === n
        return r.a.createElement(Zs, { smooth: !0, to: n, isActive: a }, t)
      }
      var eu = s.default.li.withConfig({
          displayName: 'Category__CategoryContainer',
          componentId: 'sc-1iwzml8-0',
        })(['', ' cursor:pointer;'], z.vertical),
        tu = Object(s.default)(o.Link).withConfig({
          displayName: 'Category__Title',
          componentId: 'sc-1iwzml8-1',
        })(
          [
            '',
            ';',
            ';text-decoration:none;background:',
            ';color:',
            ';&:hover{background:',
            ';color:',
            ';}',
            '',
          ],
          H.pv066.ph1,
          R.regular,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return (
              e.selected &&
              Object(s.css)(
                [
                  'color:',
                  ';',
                  ';border-width:0 0 0 2px;border-color:',
                  ';border-style:solid;',
                ],
                function(e) {
                  return e.theme.text.default
                },
                R.bold,
                function(e) {
                  return e.theme.brand.default
                }
              )
            )
          }
        ),
        nu = s.default.ul.withConfig({
          displayName: 'Category__SectionsContainer',
          componentId: 'sc-1iwzml8-2',
        })(['', ';'], z.vertical)
      function au(e) {
        var t = e.category,
          n = e.to,
          a = e.selected,
          i = e.sections
        return r.a.createElement(
          eu,
          { key: t },
          r.a.createElement(tu, { to: n, selected: a }, t),
          a &&
            r.a.createElement(
              nu,
              null,
              i.map(function(e) {
                var t = e.title,
                  n = e.hashlink
                return r.a.createElement(Js, { key: t, title: t, hashlink: n })
              })
            )
        )
      }
      function ru(e) {
        var t = e.categories,
          n = e.basePath,
          a = Object(K.l)().pathname
        return r.a.createElement(
          Xs,
          null,
          t.map(function(e) {
            var t = e.category,
              i = e.path,
              l = e.sections,
              o = ''.concat(n).concat(i),
              c = a === o
            return r.a.createElement(au, {
              key: t,
              category: t,
              sections: l,
              selected: c,
              to: o,
            })
          })
        )
      }
      var iu = [
          {
            category: 'Build',
            path: '/build',
            sections: [
              { title: 'Build Settings', hashlink: '#build-settings' },
              { title: 'Environment Variables', hashlink: '#environment-variables' },
              { title: 'External CI', hashlink: '#external-ci' },
            ],
          },
          {
            category: 'Deploy',
            path: '/deploy',
            sections: [{ title: 'Deploy Config', hashlink: '#deploy-config' }],
          },
          {
            category: 'Integrations',
            path: '/integrations',
            sections: [
              { title: 'GitHub', hashlink: '#github' },
              { title: 'Slack', hashlink: '#slack' },
              { title: 'BugHerd', hashlink: '#bugherd' },
            ],
          },
          {
            category: 'Feedback',
            path: '/feedback',
            sections: [{ title: 'Beta Feedback program', hashlink: '#beta-feedback' }],
          },
          {
            category: 'Access Control',
            path: '/access',
            sections: [{ title: 'Site Collaborators', hashlink: '#collaborators' }],
          },
        ],
        lu = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'sc-15fworz-0',
        })([
          'display:flex;flex-direction:row;align-items:flex-start;> * + *{margin:0 0 10rem 2rem;}@media only screen and (max-width:930px){display:block;> * + *{margin:2rem 0 10rem 0;}}@media only screen and (max-width:541px){> * + *{margin:1rem 0 10rem 0;}}',
        ]),
        ou = s.default.div.withConfig({
          displayName: 'style__FormsContainer',
          componentId: 'sc-15fworz-1',
        })([
          'max-width:40rem;flex-grow:1;> * + *{margin-top:2rem;}@media only screen and (max-width:930px){max-width:100%;width:100%;}',
        ])
      function cu() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $external_ci: Boolean!) {\n    updateExternalCISettings(sitename: $sitename, external_ci: $external_ci)\n  }\n',
        ])
        return (
          (cu = function() {
            return e
          }),
          e
        )
      }
      function su() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: BuildConfigInput!) {\n    updateBuildConfig(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (su = function() {
            return e
          }),
          e
        )
      }
      function uu() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: GeneralSiteSettingsInput!) {\n    updateGeneralSiteSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (uu = function() {
            return e
          }),
          e
        )
      }
      function mu() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        settings {\n          general_settings {\n            release_branch\n            path\n            fab_path\n          }\n          build_config {\n            variables {\n              name\n              value\n            }\n          }\n          external_ci_settings {\n            external_ci_enabled\n            fab_upload_api_key\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (mu = function() {
            return e
          }),
          e
        )
      }
      var du = Bt()(mu()),
        pu = Bt()(uu()),
        gu = Bt()(su()),
        fu = Bt()(cu())
      function hu(e) {
        var t = e.heading,
          n = e.subHeading,
          a = e.inputProps,
          i = e.errors
        return r.a.createElement(
          r.a.Fragment,
          null,
          r.a.createElement(Xe, { weight: 'medium' }, t),
          n && r.a.createElement(Xe, { scale: 6, tone: 'secondary' }, n),
          r.a.createElement(_t, { inputProps: a }),
          i &&
            i.map(function(e) {
              return e === ba
                ? r.a.createElement(
                    nt,
                    { key: e, status: 'critical' },
                    r.a.createElement(
                      Xe,
                      null,
                      'Path must end in ',
                      r.a.createElement('code', null, '/package.json')
                    )
                  )
                : null
            })
        )
      }
      function bu(e) {
        var t = e.sitename,
          n = e.settings,
          i = Object(a.useState)(n.release_branch),
          l = Object(ne.a)(i, 2),
          o = l[0],
          c = l[1],
          s = Object(a.useState)(n.fab_path),
          u = Object(ne.a)(s, 2),
          m = u[0],
          d = u[1],
          p = va(n.path),
          g = Object(a.useState)(!1),
          f = Object(ne.a)(g, 2),
          h = f[0],
          b = f[1],
          v = e.siteAccess.admin,
          E = o.length > 0 && m.length > 0 && p.isValid,
          y = (function(e, t, n, a) {
            return { sitename: e, input: { release_branch: t, path: n, fab_path: a } }
          })(t, o, p.legalPathName(), m),
          w = Object(Pt.b)(pu, {
            variables: y,
            refetchQueries: [{ query: du, variables: { name: t } }],
            onCompleted: function() {
              return b(!1)
            },
          }),
          _ = Object(ne.a)(w, 2),
          x = _[0],
          j = _[1],
          k = j.loading,
          O = j.error
        return r.a.createElement(
          Ii,
          {
            onSubmit: function(e) {
              x(y), e.preventDefault()
            },
          },
          r.a.createElement(
            Ni,
            null,
            r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Build Settings')
          ),
          r.a.createElement(
            Fi,
            null,
            r.a.createElement(hu, {
              heading: 'Release Branch',
              subHeading: 'Your designated repository release branch',
              inputProps: {
                required: !0,
                value: o,
                readOnly: !v,
                onChange: function(e) {
                  b(!0), c(e.target.value)
                },
              },
            }),
            r.a.createElement(hu, {
              heading: 'package.json path',
              subHeading: 'We look for your package.json at this path',
              inputProps: {
                value: p.value,
                placeholder: '/package.json',
                readOnly: !v,
                onChange: function(e) {
                  b(!0), p.setPath(e.target.value)
                },
                type: 'text',
                required: !0,
                maxLength: 120,
              },
              errors: p.errors,
            }),
            r.a.createElement(hu, {
              heading: 'FAB path',
              subHeading: 'This is where npm run build:fab outputs',
              inputProps: {
                required: !0,
                value: m,
                readOnly: !v,
                onChange: function(e) {
                  b(!0), d(e.target.value)
                },
              },
            }),
            O &&
              r.a.createElement(
                nt,
                { status: 'critical' },
                r.a.createElement(Xe, null, O.message)
              )
          ),
          v &&
            r.a.createElement(
              Li,
              null,
              r.a.createElement(
                ir,
                { gap: 1 },
                h &&
                  r.a.createElement(
                    nr,
                    {
                      type: 'button',
                      onClick: function() {
                        c(n.release_branch), d(n.fab_path), p.setPath(n.path), b(!1)
                      },
                      disabled: k,
                    },
                    'Cancel'
                  ),
                r.a.createElement(
                  tr,
                  { type: 'submit', disabled: !E || !h, loading: k },
                  'Save'
                )
              )
            )
        )
      }
      var vu = s.default.button.withConfig({
          displayName: 'style__DeleteVariableButton',
          componentId: 'bonzge-0',
        })(
          [
            'border:none;background:none;',
            ';color:',
            ';cursor:pointer;&:hover{background:',
            ';}',
          ],
          T.br2,
          function(e) {
            return e.theme.warn.default
          },
          function(e) {
            return e.theme.warn.wash
          }
        ),
        Eu = Object(s.css)(
          ['', ';', ';border:none;background:none;', ';cursor:pointer;svg{height:1rem;}'],
          z.center_both,
          H.ph2.pv1,
          T.br2
        ),
        yu = s.default.button.withConfig({
          displayName: 'style__AddVariableButton',
          componentId: 'bonzge-1',
        })(
          ['', ';color:', ';&:hover{color:', ';background:', ';}'],
          Eu,
          function(e) {
            return e.theme.text.default
          },
          function(e) {
            return e.theme.space.default
          },
          function(e) {
            return e.theme.bg.wash
          }
        ),
        wu = function(e, t, n, a) {
          var r = Object(Dr.a)(e)
          return (r[t][n] = a), r
        }
      function _u(e) {
        var t = e.sitename,
          n = (function(e) {
            var t = Object(a.useState)(e),
              n = Object(ne.a)(t, 2),
              r = n[0],
              i = n[1],
              l = r.every(function(e) {
                return e.name.length > 0 && e.value.length > 0
              })
            return {
              all: r,
              addVariable: function() {
                return i([].concat(Object(Dr.a)(r), [{ name: '', value: '' }]))
              },
              deleteVariable: function(e) {
                var t = Object(Dr.a)(r)
                t.splice(e, 1), i(t)
              },
              setVariableName: function(e, t) {
                var n = wu(r, t, 'name', e)
                i(n)
              },
              setVariableValue: function(e, t) {
                var n = wu(r, t, 'value', e)
                i(n)
              },
              reset: function() {
                return i(e)
              },
              isValid: l,
            }
          })(
            (function(e) {
              return e.map(function(e) {
                return { name: e.name, value: e.value }
              })
            })(e.variables)
          ),
          i = Object(a.useState)(!0),
          l = Object(ne.a)(i, 2),
          o = l[0],
          c = l[1],
          s = Object(a.useState)(!1),
          u = Object(ne.a)(s, 2),
          m = u[0],
          d = u[1],
          p = e.siteAccess.admin,
          g = Object(Pt.b)(gu, {
            variables: { sitename: t, input: { variables: n.all } },
            refetchQueries: [{ query: du, variables: { name: t } }],
            onCompleted: function() {
              c(!0), d(!1)
            },
          }),
          f = Object(ne.a)(g, 2),
          h = f[0],
          b = f[1],
          v = b.loading,
          E = b.error
        return r.a.createElement(
          Ii,
          {
            onSubmit: function(e) {
              h(), e.preventDefault()
            },
          },
          r.a.createElement(
            Ni,
            null,
            r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Environment Variables')
          ),
          r.a.createElement(
            Fi,
            null,
            r.a.createElement(
              Xe,
              { scale: 6, tone: 'secondary' },
              'These variables are used during build time'
            ),
            0 === n.all.length &&
              r.a.createElement(
                Xe,
                { scale: 6, tone: 'secondary' },
                'No build environment variables are set'
              ),
            n.all.length > 0 &&
              n.all.map(function(e, t) {
                return r.a.createElement(
                  ir,
                  { key: t, internalSpacing: 0.5 },
                  r.a.createElement(_t, {
                    size: 16,
                    inputProps: {
                      required: !0,
                      placeholder: 'name',
                      value: e.name,
                      readOnly: o || !p,
                      onChange: function(e) {
                        n.setVariableName(e.target.value, t), d(!0)
                      },
                    },
                  }),
                  r.a.createElement(_t, {
                    masked: o,
                    canBeRevealed: p,
                    inputProps: {
                      required: !0,
                      placeholder: 'value',
                      value: e.value,
                      readOnly: o || !p,
                      onChange: function(e) {
                        n.setVariableValue(e.target.value, t), d(!0)
                      },
                    },
                  }),
                  !o &&
                    p &&
                    r.a.createElement(
                      vu,
                      {
                        onClick: function() {
                          n.deleteVariable(t), d(!0)
                        },
                        type: 'button',
                      },
                      r.a.createElement(rt.a, null)
                    )
                )
              }),
            !o &&
              p &&
              r.a.createElement(
                yu,
                {
                  onClick: function() {
                    n.addVariable(), d(!0)
                  },
                  type: 'button',
                },
                r.a.createElement(en.a, null),
                ' ',
                r.a.createElement(Xe, null, 'Add variables')
              ),
            E &&
              r.a.createElement(
                nt,
                { status: 'critical' },
                r.a.createElement(Xe, null, E.message)
              )
          ),
          p &&
            r.a.createElement(
              Li,
              null,
              o
                ? r.a.createElement(
                    tr,
                    {
                      onClick: function() {
                        return c(!1)
                      },
                    },
                    'Edit'
                  )
                : r.a.createElement(
                    ir,
                    { gap: 1 },
                    m &&
                      r.a.createElement(
                        nr,
                        {
                          type: 'button',
                          onClick: function() {
                            c(!0), n.reset(), d(!1)
                          },
                          disabled: v,
                        },
                        'Cancel'
                      ),
                    r.a.createElement(
                      tr,
                      { loading: v, type: 'submit', disabled: v || !n.isValid || !m },
                      'Save'
                    )
                  )
            )
        )
      }
      var xu = Object(s.keyframes)([
          'from{transform:rotate(0deg);}to{transform:rotate(360deg);}',
        ]),
        ju = s.default.div.withConfig({
          displayName: 'KeyBox__GridRow',
          componentId: 'sc-12dt7ka-0',
        })(['display:grid;grid-template-columns:1fr auto auto;gap:0.25rem;']),
        ku = s.default.button.withConfig({
          displayName: 'KeyBox__IconWrapper',
          componentId: 'sc-12dt7ka-1',
        })(
          [
            'margin:0;background:none;border:none;color:',
            ';cursor:',
            ';border-radius:0.25rem;svg{height:1.2rem;width:1.2rem;}&:hover{background:',
            ';color:',
            ';}',
            '',
          ],
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.copied ? 'auto' : 'pointer'
          },
          function(e) {
            return e.theme.bg.wash
          },
          function(e) {
            return e.theme.brand.default
          },
          function(e) {
            return (
              e.loading &&
              Object(s.css)(
                ['cursor:disabled;svg{animation:', ' 0.7s linear infinite;}'],
                xu
              )
            )
          }
        ),
        Ou = function(e) {
          var t = e.apiKey,
            n = e.sitename,
            i = Object(a.useState)(!1),
            l = Object(ne.a)(i, 2),
            o = l[0],
            c = l[1],
            s = Object(Pt.b)(fu, {
              variables: { sitename: n, external_ci: !0 },
              update: function(e, t) {
                var a = t.data.updateExternalCISettings
                !(function(e, t, n) {
                  var a = e.readQuery({ query: du, variables: { name: t } }),
                    r = a.view.site.settings.external_ci_settings,
                    i = Object(pt.a)({}, r)
                  i.fab_upload_api_key = n
                  var l = ri.a.set(a, 'view.site.settings.external_ci_settings', i)
                  e.writeQuery({
                    query: du,
                    variables: { name: t },
                    data: Object(pt.a)({}, l),
                  })
                })(e, n, a)
              },
            }),
            u = Object(ne.a)(s, 2),
            m = u[0],
            d = u[1],
            p = d.loading,
            g = d.error
          return r.a.createElement(
            ma,
            null,
            r.a.createElement(Xe, { weight: 'bold' }, 'API Key'),
            r.a.createElement(
              Xe,
              { scale: 6, tone: 'secondary' },
              'The',
              ' ',
              r.a.createElement(
                'a',
                {
                  href: 'https://github.com/bitgenics/fab-upload-cli',
                  rel: 'noopener noreferrer',
                  target: '_blank',
                },
                'fab-upload'
              ),
              ' ',
              'package uses this key to upload FABs to Linc from an external CI service.'
            ),
            r.a.createElement(
              ju,
              null,
              r.a.createElement(_t, {
                inputProps: { value: t, disabled: !0, readOnly: p },
              }),
              r.a.createElement(
                Ro.CopyToClipboard,
                {
                  text: t,
                  onCopy: function() {
                    c(!0),
                      setTimeout(function() {
                        c(!1)
                      }, 750)
                  },
                },
                o
                  ? r.a.createElement(ku, { copied: o }, r.a.createElement(at.a, null))
                  : r.a.createElement(
                      ku,
                      { copied: o, title: 'copy to clipboard' },
                      r.a.createElement(To.a, null)
                    )
              ),
              r.a.createElement(
                ku,
                { onClick: m, title: 'Regenerate token', loading: p, disabled: p },
                r.a.createElement(Pc.a, null)
              )
            ),
            g && r.a.createElement(nt, null, r.a.createElement(Xe, null, g))
          )
        },
        Cu = function(e) {
          var t = e.subHeading,
            n = e.value,
            a = e.setValue,
            i = e.disabled
          return r.a.createElement(
            'div',
            null,
            r.a.createElement(
              Ai,
              { type: 'button', onClick: a, disabled: i },
              !0 === n && r.a.createElement(hl.a, null),
              !1 === n && r.a.createElement(gl.a, null),
              r.a.createElement(Xe, null, t)
            )
          )
        }
      function Su(e) {
        var t = e.sitename,
          n = e.settings,
          i = n.external_ci_enabled,
          l = n.fab_upload_api_key,
          o = Object(a.useState)(!1),
          c = Object(ne.a)(o, 2),
          s = c[0],
          u = c[1],
          m = Object(a.useState)(i),
          d = Object(ne.a)(m, 2),
          p = d[0],
          g = d[1],
          f = e.siteAccess.admin,
          h = { sitename: t, external_ci: p },
          b = Object(Pt.b)(fu, {
            variables: h,
            refetchQueries: [{ query: du, variables: { name: t } }],
            onCompleted: function() {
              return u(!1)
            },
          }),
          v = Object(ne.a)(b, 2),
          E = v[0],
          y = v[1].loading
        return r.a.createElement(
          Ii,
          {
            onSubmit: function(e) {
              E(h), e.preventDefault()
            },
          },
          r.a.createElement(
            Ni,
            null,
            r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'External CI settings')
          ),
          r.a.createElement(
            Fi,
            null,
            r.a.createElement(Cu, {
              heading: 'Toggle External CI',
              subHeading: 'Use external CI service',
              disabled: !f || y,
              setValue: function() {
                g(!p), u(!0)
              },
              value: p,
            }),
            i && l && r.a.createElement(Ou, { sitename: t, apiKey: l })
          ),
          f &&
            r.a.createElement(
              Li,
              null,
              r.a.createElement(
                ir,
                { gap: 1 },
                s &&
                  r.a.createElement(
                    nr,
                    {
                      type: 'button',
                      onClick: function() {
                        g(i), u(!1)
                      },
                      disabled: y,
                    },
                    'Cancel'
                  ),
                r.a.createElement(
                  tr,
                  { disabled: y || !s, loading: y, type: 'submit' },
                  'Save'
                )
              )
            )
        )
      }
      function Iu(e) {
        var t = e.sitename,
          n = e.siteAccess,
          a = e.settings
        return n.write
          ? r.a.createElement(Su, { sitename: t, settings: a, siteAccess: n })
          : r.a.createElement(
              Ii,
              null,
              r.a.createElement(
                Ni,
                null,
                r.a.createElement(
                  Xe,
                  { scale: 4, weight: 'medium' },
                  'External CI settings'
                )
              ),
              r.a.createElement(
                Fi,
                null,
                r.a.createElement(
                  Xe.P,
                  null,
                  'You must have repository write access to view or edit',
                  ' ',
                  r.a.createElement('code', null, t),
                  ' External CI settings'
                )
              )
            )
      }
      function Nu() {
        return r.a.createElement(
          ma,
          null,
          r.a.createElement(Ht, { width: 12 }),
          r.a.createElement(Mt, { minWidth: 9 }),
          r.a.createElement(
            Ii,
            null,
            r.a.createElement(Ni, null, r.a.createElement(Mt, { minWidth: 7 })),
            r.a.createElement(
              Fi,
              null,
              r.a.createElement(
                ma,
                null,
                r.a.createElement(Mt, null),
                r.a.createElement(Ht, { width: 16 })
              ),
              r.a.createElement(
                ma,
                null,
                r.a.createElement(Mt, null),
                r.a.createElement(Ht, { width: 16 })
              )
            ),
            r.a.createElement(Li, null, r.a.createElement(Ht, { width: 6 }))
          )
        )
      }
      var Fu = s.default.a.withConfig({
        displayName: 'HashAnchor__Anchor',
        componentId: 'axjmcn-0',
      })(['display:block;position:relative;top:-4rem;visibility:hidden;'])
      function Lu(e) {
        var t = e.id,
          n = Object(K.l)().hash
        return (
          Object(a.useEffect)(function() {
            n.includes(t) && document.getElementById(t).scrollIntoView()
          }),
          r.a.createElement(Fu, { id: t })
        )
      }
      var Au = n(182),
        Pu = s.default.a.withConfig({
          displayName: 'HashLink__Wrapper',
          componentId: 'sc-12d640t-0',
        })(
          ['color:', ';&:hover{color:', ';}', ';svg{height:1rem;}'],
          function(e) {
            return e.theme.text.secondary
          },
          function(e) {
            return e.theme.space.default
          },
          z.center_both
        )
      function Du(e) {
        var t = e.href
        return r.a.createElement(Pu, { href: t }, r.a.createElement(Au.a, null))
      }
      var Bu = function(e) {
          var t = e.blockId,
            n = e.blockTitle,
            a = e.blockSubtitle,
            i = e.blockForm
          return r.a.createElement(
            ma,
            null,
            n &&
              r.a.createElement(
                ir,
                null,
                r.a.createElement(Xe, { weight: 'bold', scale: 3 }, n),
                t &&
                  r.a.createElement(
                    r.a.Fragment,
                    null,
                    r.a.createElement(Du, { href: '#'.concat(t) }),
                    r.a.createElement(Lu, { id: t })
                  )
              ),
            a && r.a.createElement(Xe.P, { scale: 6, tone: 'secondary' }, a),
            i
          )
        },
        $u = function() {
          return r.a.createElement(
            a.Fragment,
            null,
            'You can use an external CI service to compile FABs then upload them to Linc! To learn more, checkout our',
            ' ',
            r.a.createElement(
              'a',
              {
                href: 'https://linc.sh/docs/using-external-ci-with-linc',
                rel: 'noopener noreferrer',
                target: '_blank',
              },
              'Using external CI with Linc'
            ),
            ' ',
            'docs.'
          )
        }
      function qu(e) {
        var t,
          n = e.sitename
        Oe('Build settings')
        var i = Object(Pt.c)(du, { variables: { name: n }, errorPolicy: 'all' }),
          l = i.loading,
          o = i.error,
          c = i.data
        if (l) return r.a.createElement(Nu, null)
        if (o)
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(Xe, null, 'An error occured while retrieving settings data')
          )
        var s =
          null === c || void 0 === c
            ? void 0
            : null === (t = c.view) || void 0 === t
            ? void 0
            : t.site
        if (s) {
          var u,
            m,
            d =
              (null === c || void 0 === c
                ? void 0
                : null === (u = c.view) || void 0 === u
                ? void 0
                : null === (m = u.site) || void 0 === m
                ? void 0
                : m.settings) || {},
            p = d.general_settings,
            g = d.build_config,
            f = d.external_ci_settings,
            h = null === s || void 0 === s ? void 0 : s.access
          return r.a.createElement(
            a.Fragment,
            null,
            r.a.createElement(Bu, {
              blockId: 'build-settings',
              blockTitle: 'General build config',
              blockSubtitle: 'General build settings for your site',
              blockForm: r.a.createElement(bu, {
                sitename: n,
                siteAccess: h,
                settings: p,
              }),
            }),
            r.a.createElement(Bu, {
              blockId: 'environment-variables',
              blockTitle: 'Environment',
              blockSubtitle: 'Build environment config',
              blockForm: r.a.createElement(_u, {
                sitename: n,
                siteAccess: h,
                variables: g.variables || [],
              }),
            }),
            r.a.createElement(Bu, {
              blockId: 'external-ci',
              blockTitle: 'External Ci',
              blockSubtitle: r.a.createElement($u, null),
              blockForm: r.a.createElement(Iu, {
                sitename: n,
                siteAccess: h,
                settings: f,
              }),
            })
          )
        }
        return r.a.createElement(
          nt,
          { status: 'critical' },
          r.a.createElement(Xe, null, 'Error: unable to retrieve site settings data')
        )
      }
      function Ru() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $deploy_target_name: String!) {\n    deleteDeployConfig(\n      sitename: $sitename\n      deploy_target_name: $deploy_target_name\n    )\n  }\n',
        ])
        return (
          (Ru = function() {
            return e
          }),
          e
        )
      }
      function Tu() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: CloudflareInput!) {\n    updateCloudflareConfig(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Tu = function() {
            return e
          }),
          e
        )
      }
      function zu() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: LambdaInput!) {\n    updateLambdaConfig(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (zu = function() {
            return e
          }),
          e
        )
      }
      function Mu() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        settings {\n          release_config {\n            sitename\n            release_branch\n            deploy_config {\n              lambda_edge {\n                access_key_id\n                cf_distribution_id\n                lambda_arn\n                secret_access_key\n              }\n              cloudflare {\n                api_key\n                email\n                zone_id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Mu = function() {
            return e
          }),
          e
        )
      }
      var Hu,
        Vu = Bt()(Mu()),
        Wu = Bt()(zu()),
        Uu = Bt()(Tu()),
        Gu = Bt()(Ru()),
        Qu = function(e) {
          var t = e.heading,
            n = e.subHeading,
            a = e.value,
            i = e.readOnly,
            l = e.onChange,
            o = e.masked,
            c = e.canBeRevealed
          return r.a.createElement(
            ma,
            { gap: 0.5 },
            r.a.createElement(Xe, { weight: 'medium' }, t),
            n && r.a.createElement(Xe, { scale: 6, tone: 'secondary' }, n),
            r.a.createElement(_t, {
              masked: o,
              canBeRevealed: c,
              inputProps: { readOnly: i, isRequired: !0, value: a, onChange: l },
            })
          )
        },
        Yu = function(e) {
          var t = e.sitename,
            n = Object(a.useState)(!1),
            i = Object(ne.a)(n, 2),
            l = i[0],
            o = i[1],
            c = Object(a.useState)(!1),
            s = Object(ne.a)(c, 2),
            u = s[0],
            m = s[1],
            d = Object(a.useState)(null),
            p = Object(ne.a)(d, 2),
            g = p[0],
            f = p[1],
            h = Object(a.useState)(e.initialState),
            b = Object(ne.a)(h, 2),
            v = b[0],
            E = b[1],
            y = Object(a.useState)(!1),
            w = Object(ne.a)(y, 2),
            _ = w[0],
            x = w[1],
            j = Object(a.useState)(!0),
            k = Object(ne.a)(j, 2),
            O = k[0],
            C = k[1],
            S = e.siteAccess.admin
          Object(a.useEffect)(
            function() {
              E(e.initialState)
            },
            [e.initialState]
          )
          var I = function() {
              o(!1), m(!1), x(!1), C(!0)
            },
            N = Object.values(v).every(function(e) {
              return e.length > 0
            }),
            F = Object.values(v).every(function(e) {
              return 0 === e.length
            }),
            L = [
              { query: Vu, variables: { name: t } },
              { query: ta, variables: { name: t } },
            ],
            A = Object(Pt.b)(e.updateMutation, {
              refetchQueries: L,
              onCompleted: I,
              onError: function(e) {
                o(!1), f(e)
              },
            }),
            P = Object(ne.a)(A, 1)[0],
            D = Object(Pt.b)(e.deleteMutation, {
              refetchQueries: L,
              onCompleted: I,
              onError: function(e) {
                m(!1), f(e)
              },
            }),
            B = Object(ne.a)(D, 1)[0]
          return r.a.createElement(
            Ii,
            {
              onSubmit: function(e) {
                !(function() {
                  o(!0)
                  var e = { sitename: t, input: Object(pt.a)({}, v) }
                  P({ variables: e })
                })(),
                  e.preventDefault()
              },
            },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(Xe, { scale: 4, weight: 'medium' }, e.heading)
            ),
            r.a.createElement(
              Fi,
              null,
              F && O
                ? r.a.createElement(Xe, null, e.nullStateMessage)
                : Object.keys(v).map(function(t, n) {
                    return r.a.createElement(Qu, {
                      key: n,
                      heading: e.fieldDefs[t].label,
                      value: v[t],
                      readOnly: O,
                      masked: O && !e.fieldDefs[t].public,
                      canBeRevealed: S,
                      onChange: function(e) {
                        x(!0),
                          (function(e, t) {
                            var n = Object(pt.a)({}, v)
                            ;(n[e] = t), E(n)
                          })(t, e.target.value)
                      },
                    })
                  }),
              g &&
                r.a.createElement(
                  nt,
                  { status: 'critical' },
                  r.a.createElement(Xe, null, g.message)
                )
            ),
            S &&
              r.a.createElement(
                Li,
                null,
                r.a.createElement(
                  ir,
                  { gap: 1 },
                  O
                    ? r.a.createElement(
                        tr,
                        {
                          type: 'button',
                          onClick: function() {
                            return C(!1)
                          },
                        },
                        F ? 'Create '.concat(e.heading, ' config') : 'Edit'
                      )
                    : r.a.createElement(
                        r.a.Fragment,
                        null,
                        r.a.createElement(
                          nr,
                          {
                            type: 'button',
                            onClick: function() {
                              m(!0)
                              var n = {
                                sitename: t,
                                deploy_target_name: e.deploy_target_name,
                              }
                              B({ variables: n })
                            },
                            disabled: l || u,
                            loading: u,
                          },
                          'Delete'
                        ),
                        r.a.createElement(
                          nr,
                          { type: 'button', onClick: I, disabled: l || u },
                          'Cancel'
                        ),
                        r.a.createElement(
                          tr,
                          { type: 'submit', disabled: !N || !_ || l || u, loading: l },
                          'Save'
                        )
                      )
                )
              )
          )
        },
        Ku =
          ((Hu = {}),
          Object(mo.a)(Hu, Il.LAMBDA_EDGE, {
            access_key_id: { label: 'Access Key Id', initial_value: '', public: !0 },
            cf_distribution_id: {
              label: 'CF Distribution ID',
              initial_value: '',
              public: !0,
            },
            lambda_arn: { label: 'Lambda Arn', initial_value: '', public: !0 },
            secret_access_key: { label: 'Secret Access Key', initial_value: '' },
          }),
          Object(mo.a)(Hu, Il.CF_WORKERS, {
            api_key: { label: 'API Key', initial_value: '' },
            email: { label: 'Email', initial_value: '', public: !0 },
            zone_id: { label: 'Zone ID', initial_value: '', public: !0 },
          }),
          Hu),
        Xu = function(e, t) {
          if (null === e) {
            var n = {}
            return (
              Object.keys(t).forEach(function(e) {
                return (n[e] = t[e].initial_value)
              }),
              n
            )
          }
          return delete e.__typename, e
        },
        Zu = function(e) {
          var t,
            n = e.sitename
          Oe('Deploy settings')
          var a = Object(Pt.c)(Vu, { variables: { name: n }, errorPolicy: 'all' }),
            i = a.loading,
            l = a.error,
            o = a.data
          if (i) return r.a.createElement(Nu, null)
          if (l)
            return r.a.createElement(
              nt,
              { status: 'critical' },
              r.a.createElement(
                Xe,
                null,
                'An error occured while retrieving settings data'
              )
            )
          var c =
            null === o || void 0 === o
              ? void 0
              : null === (t = o.view) || void 0 === t
              ? void 0
              : t.site
          if (c) {
            var s,
              u = null === c || void 0 === c ? void 0 : c.access,
              m =
                null === c || void 0 === c
                  ? void 0
                  : null === (s = c.settings) || void 0 === s
                  ? void 0
                  : s.release_config,
              d = (null === m || void 0 === m ? void 0 : m.deploy_config) || {},
              p = d.lambda_edge,
              g = d.cloudflare,
              f = Ku[Il.LAMBDA_EDGE],
              h = Ku[Il.CF_WORKERS],
              b = Xu(p, f),
              v = Xu(g, h)
            return r.a.createElement(
              ma,
              { gap: 2, id: 'deploy_config' },
              r.a.createElement(
                ma,
                null,
                r.a.createElement(Xe, { scale: 4, weight: 'bold' }, 'Deploy Config'),
                r.a.createElement(
                  Xe,
                  { scale: 6 },
                  'Visit the',
                  ' ',
                  r.a.createElement(
                    'a',
                    {
                      href: 'https://linc.sh/knowledge-base/releasing',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                    'Docs'
                  ),
                  ' ',
                  'to learn more about enabling Continuous Delivery'
                )
              ),
              r.a.createElement(Yu, {
                sitename: n,
                siteAccess: u,
                heading: Il.LAMBDA_EDGE,
                nullStateMessage: ''.concat(Il.LAMBDA_EDGE, ' configuration not set'),
                fieldDefs: f,
                initialState: b,
                updateMutation: Wu,
                deleteMutation: Gu,
                deploy_target_name: 'lambda_edge',
              }),
              r.a.createElement(Yu, {
                sitename: n,
                siteAccess: u,
                heading: Il.CF_WORKERS,
                nullStateMessage: ''.concat(Il.CF_WORKERS, ' configuration not set'),
                fieldDefs: h,
                initialState: v,
                updateMutation: Uu,
                deleteMutation: Gu,
                deploy_target_name: 'cloudflare',
              })
            )
          }
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(Xe, null, 'Error: unable to retrieve site settings data')
          )
        }
      function Ju() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: BugHerdSettingsInput!) {\n    updateBugHerdSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (Ju = function() {
            return e
          }),
          e
        )
      }
      function em() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: SlackSettingsInput!) {\n    updateSlackSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (em = function() {
            return e
          }),
          e
        )
      }
      function tm() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: GithubSettingsInput!) {\n    updateGithubSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (tm = function() {
            return e
          }),
          e
        )
      }
      function nm() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        settings {\n          github_settings {\n            pr_comments\n            commit_statuses\n            deployments\n          }\n          slack_settings {\n            slack_app_is_installed\n            messages_disabled\n            selected_channel {\n              id\n              name\n            }\n            channels {\n              id\n              name\n            }\n          }\n          bugherd_settings {\n            authentication_token\n            projects {\n              name\n              id\n            }\n            selected_project {\n              name\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (nm = function() {
            return e
          }),
          e
        )
      }
      var am = Bt()(nm()),
        rm = Bt()(tm()),
        im = Bt()(em()),
        lm = Bt()(Ju()),
        om = function(e) {
          var t = e.subHeading,
            n = e.value,
            a = e.setValue,
            i = e.setDirty,
            l = e.readOnly
          return r.a.createElement(
            'div',
            null,
            r.a.createElement(
              Ai,
              {
                type: 'button',
                disabled: l,
                onClick: function() {
                  i(!0), a(!n)
                },
              },
              !0 === n && r.a.createElement(hl.a, null),
              !1 === n && r.a.createElement(gl.a, null),
              r.a.createElement(Xe, null, t)
            )
          )
        },
        cm = function(e) {
          var t = e.sitename,
            n = e.settings,
            i = Object(a.useState)(n.pr_comments),
            l = Object(ne.a)(i, 2),
            o = l[0],
            c = l[1],
            s = Object(a.useState)(n.commit_statuses),
            u = Object(ne.a)(s, 2),
            m = u[0],
            d = u[1],
            p = Object(a.useState)(n.deployments),
            g = Object(ne.a)(p, 2),
            f = g[0],
            h = g[1],
            b = Object(a.useState)(!1),
            v = Object(ne.a)(b, 2),
            E = v[0],
            y = v[1],
            w = e.siteAccess.admin,
            _ = [{ query: am, variables: { name: t } }],
            x = (function(e, t, n, a) {
              return {
                sitename: e,
                input: { pr_comments: t, commit_statuses: n, deployments: a },
              }
            })(t, o, m, f),
            j = Object(Pt.b)(rm, {
              variables: x,
              refetchQueries: _,
              onCompleted: function() {
                return y(!1)
              },
            }),
            k = Object(ne.a)(j, 2),
            O = k[0],
            C = k[1],
            S = C.loading,
            I = C.error
          return r.a.createElement(
            Ii,
            {
              onSubmit: function(e) {
                O(x), e.preventDefault()
              },
            },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Github Preferences')
            ),
            r.a.createElement(
              Fi,
              { gap: 2 },
              r.a.createElement(om, {
                heading: 'PR Comments',
                subHeading: 'Allow Linc bot to comment on pull requests',
                value: o,
                setValue: c,
                setDirty: y,
                readOnly: !w,
              }),
              r.a.createElement(om, {
                heading: 'Linc Commit Status',
                subHeading: 'Allow Linc to apply a Linc status to your commits',
                value: m,
                setValue: d,
                setDirty: y,
                readOnly: !w,
              }),
              r.a.createElement(om, {
                heading: 'Deployments',
                subHeading: 'Enable Linc preview deployment urls in pull requests',
                value: f,
                setValue: h,
                setDirty: y,
                readOnly: !w,
              }),
              I &&
                r.a.createElement(
                  nt,
                  { status: 'critical' },
                  r.a.createElement(Xe, null, I.message)
                )
            ),
            w &&
              r.a.createElement(
                Li,
                null,
                r.a.createElement(
                  ir,
                  { gap: 1 },
                  E &&
                    r.a.createElement(
                      nr,
                      {
                        type: 'button',
                        onClick: function() {
                          var t = e.github_settings
                          c(t.pr_comments), d(t.commit_statuses), h(t.deployments), y(!1)
                        },
                        disabled: S,
                      },
                      'Cancel'
                    ),
                  r.a.createElement(
                    tr,
                    { type: 'submit', loading: S, disabled: !E },
                    'Save'
                  )
                )
              )
          )
        },
        sm = function() {
          return r.a.createElement(
            nt,
            { status: 'positive' },
            r.a.createElement(
              ma,
              null,
              r.a.createElement(Xe, { weight: 'bold' }, 'Linc Slack app added!'),
              r.a.createElement(
                ma,
                { gap: 0 },
                r.a.createElement(
                  Xe.P,
                  null,
                  'You can now select a channel from the Slack channels list below.'
                ),
                r.a.createElement(
                  Xe.P,
                  null,
                  'Linc will send preview links along with build status info to this channel.'
                )
              )
            )
          )
        },
        um = function(e, t) {
          return e
            ? t.find(function(t) {
                return t.value.id === e.id
              })
            : null
        }
      function mm(e) {
        var t = e.sitename,
          n = e.channels,
          i = e.selected_channel,
          l = (function(e) {
            return e.map(function(e) {
              return { value: e, label: e.name }
            })
          })(n),
          o = Object(a.useState)(!1),
          c = Object(ne.a)(o, 2),
          s = c[0],
          u = c[1],
          m = Object(a.useState)(um(i, l)),
          d = Object(ne.a)(m, 2),
          p = d[0],
          g = d[1],
          f = Object(a.useState)(e.messages_disabled || !1),
          h = Object(ne.a)(f, 2),
          b = h[0],
          v = h[1],
          E = [{ query: am, variables: { name: t } }],
          y = function() {
            if (p)
              return {
                sitename: t,
                input: {
                  selected_channel: { id: p.value.id, name: p.value.name },
                  messages_disabled: b,
                },
              }
          },
          w = Object(K.l)().search,
          _ = new URLSearchParams(w),
          x = 1 === parseInt(_.get('oauth_success')),
          j = e.siteAccess.admin,
          k = Object(Pt.b)(im, {
            variables: y(),
            refetchQueries: E,
            onCompleted: function() {
              return u(!1)
            },
          }),
          O = Object(ne.a)(k, 2),
          C = O[0],
          S = O[1],
          I = S.loading,
          N = S.error
        return r.a.createElement(
          r.a.Fragment,
          null,
          x && r.a.createElement(sm, null),
          r.a.createElement(
            Ii,
            {
              id: 'slack',
              onSubmit: function(e) {
                C(y()), e.preventDefault()
              },
            },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Slack integration')
            ),
            r.a.createElement(
              Fi,
              null,
              r.a.createElement(Xe, { weight: 'medium' }, 'Slack channel'),
              r.a.createElement(
                Xe.P,
                { scale: 6, tone: 'secondary' },
                'We send build status events plus preview links for',
                ' ',
                r.a.createElement('code', null, t),
                ' to this Slack channel:'
              ),
              r.a.createElement(jr.a, {
                isDisabled: !j || I,
                name: 'select-org',
                value: p,
                options: l,
                onChange: function(e) {
                  u(!0), g(e)
                },
              }),
              r.a.createElement(
                Ai,
                {
                  type: 'button',
                  disabled: !j || null === i || void 0 === i || I,
                  onClick: function() {
                    u(!0), v(!b)
                  },
                },
                b ? r.a.createElement(hl.a, null) : r.a.createElement(gl.a, null),
                r.a.createElement(Xe, null, 'Disable Linc Slack messages')
              ),
              N &&
                r.a.createElement(
                  nt,
                  { status: 'critical' },
                  r.a.createElement(Xe, null, N.message)
                )
            ),
            j &&
              r.a.createElement(
                Li,
                null,
                r.a.createElement(
                  ir,
                  { gap: 1 },
                  s &&
                    r.a.createElement(
                      nr,
                      {
                        type: 'button',
                        onClick: function() {
                          var t = um(i, l)
                          g(t), v(e.messages_disabled), u(!1)
                        },
                        disabled: I,
                      },
                      'Cancel'
                    ),
                  r.a.createElement(
                    tr,
                    { type: 'submit', loading: I, disabled: !s },
                    'Save'
                  )
                )
              )
          )
        )
      }
      function dm(e) {
        var t = e.sitename,
          n = e.siteAccess.admin,
          i = 'https://slack.com/oauth/authorize?scope='
            .concat('chat:write:bot,channels:read', '&client_id=')
            .concat('123528931698.665028345747', '&state=')
            .concat(t)
        return r.a.createElement(
          Ii,
          { id: 'slack' },
          r.a.createElement(
            Ni,
            null,
            r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Slack integration')
          ),
          r.a.createElement(
            Fi,
            null,
            n
              ? r.a.createElement(
                  a.Fragment,
                  null,
                  r.a.createElement(
                    Xe,
                    null,
                    'Click the button below to install the Linc Slack app on your Slack workspace:'
                  ),
                  r.a.createElement(
                    'a',
                    { href: i },
                    r.a.createElement('img', {
                      alt: 'Add to Slack',
                      height: '40',
                      width: '139',
                      src: 'https://platform.slack-edge.com/img/add_to_slack.png',
                      srcSet:
                        'https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x',
                    })
                  )
                )
              : r.a.createElement(
                  Xe.P,
                  null,
                  'You must be an admin of ',
                  r.a.createElement('code', null, t),
                  ' to view or edit Slack integration settings'
                )
          )
        )
      }
      function pm(e) {
        var t = e.sitename,
          n = e.siteAccess,
          a = e.settings
        if (!a.slack_app_is_installed)
          return r.a.createElement(dm, { sitename: t, siteAccess: n })
        var i = a.channels,
          l = a.selected_channel,
          o = a.messages_disabled
        return i
          ? r.a.createElement(mm, {
              sitename: t,
              siteAccess: n,
              channels: i,
              selected_channel: l,
              messages_disabled: o,
            })
          : void 0
      }
      function gm() {
        var e = Object(I.a)([
          '\n  query($authentication_token: String!) {\n    view {\n      bugherd(authentication_token: $authentication_token) {\n        projects {\n          name\n          id\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (gm = function() {
            return e
          }),
          e
        )
      }
      var fm = Bt()(gm()),
        hm = function(e) {
          var t,
            n,
            a = e.authToken,
            i = e.selectProject,
            l = Object(Pt.c)(fm, { variables: { authentication_token: a } }),
            o = l.loading,
            c = l.error,
            s = l.data
          if (o) return 'Loading projects...'
          if (c)
            return r.a.createElement(
              nt,
              { status: 'critical' },
              r.a.createElement(Xe, null, c.message)
            )
          var u = (function(e) {
            return e.map(function(e) {
              return { value: e.id, label: e.name }
            })
          })(
            (null === s || void 0 === s
              ? void 0
              : null === (t = s.view) || void 0 === t
              ? void 0
              : null === (n = t.bugherd) || void 0 === n
              ? void 0
              : n.projects) || []
          )
          return r.a.createElement(
            ma,
            null,
            r.a.createElement(Xe, { weight: 'bold' }, 'Project'),
            r.a.createElement(Xe, null, 'Your BugHerd project'),
            r.a.createElement(jr.a, { options: u, onChange: i })
          )
        },
        bm = function(e) {
          var t = e.sitename,
            n = e.settings,
            i = n.authentication_token,
            l = n.selected_project,
            o = n.projects,
            c = Object(a.useState)(!1),
            s = Object(ne.a)(c, 2),
            u = s[0],
            m = s[1],
            d = Object(a.useState)(i),
            p = Object(ne.a)(d, 2),
            g = p[0],
            f = p[1],
            h = Object(a.useState)(l.id),
            b = Object(ne.a)(h, 2),
            v = b[0],
            E = b[1],
            y = e.siteAccess.admin,
            w = [{ query: am, variables: { name: t } }],
            _ = Object(Pt.b)(lm, {
              variables: {
                sitename: t,
                input: { authentication_token: g, project_id: v },
              },
              refetchQueries: w,
              onCompleted: function() {
                return m(!1)
              },
            }),
            x = Object(ne.a)(_, 2),
            j = x[0],
            k = x[1],
            O = k.loading,
            C = k.error,
            S = function(e) {
              m(!0), E(e.value)
            },
            I = (function(e) {
              return e.map(function(e) {
                return { value: e.id, label: e.name }
              })
            })(o),
            N = I.find(function(e) {
              return e.value === l.id
            }),
            F = i !== g,
            L = 22 === g.length && v
          return r.a.createElement(
            Ii,
            {
              onSubmit: function(e) {
                j(), e.preventDefault()
              },
            },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'BugHerd')
            ),
            r.a.createElement(
              Fi,
              null,
              r.a.createElement(
                ma,
                null,
                r.a.createElement(Xe, { weight: 'bold' }, 'Authentication Token'),
                r.a.createElement(
                  Xe,
                  { scale: 6 },
                  'Find this token in your BugHerd organization settings'
                ),
                r.a.createElement(_t, {
                  inputProps: {
                    readOnly: !y || O,
                    value: g,
                    onChange: function(e) {
                      m(!0), f(e.target.value)
                    },
                  },
                }),
                F
                  ? r.a.createElement(hm, { authToken: g, selectProject: S })
                  : r.a.createElement(
                      a.Fragment,
                      null,
                      r.a.createElement(Xe, { weight: 'bold' }, 'Selected Project'),
                      r.a.createElement(jr.a, {
                        options: I,
                        onChange: S,
                        defaultValue: N,
                      })
                    ),
                C &&
                  r.a.createElement(
                    nt,
                    { status: 'critical' },
                    r.a.createElement(Xe, null, C.message)
                  )
              )
            ),
            y &&
              r.a.createElement(
                Li,
                null,
                r.a.createElement(
                  ir,
                  { gap: 1 },
                  u &&
                    r.a.createElement(
                      nr,
                      {
                        type: 'button',
                        onClick: function() {
                          f(i), E(l.id), m(!1)
                        },
                        disabled: O,
                      },
                      'Cancel'
                    ),
                  r.a.createElement(
                    tr,
                    { type: 'submit', loading: O, disabled: !u || !L },
                    'Save'
                  )
                )
              )
          )
        },
        vm = function(e) {
          var t = e.sitename,
            n = e.siteAccess,
            i = Object(a.useState)(!1),
            l = Object(ne.a)(i, 2),
            o = l[0],
            c = l[1],
            s = Object(a.useState)(''),
            u = Object(ne.a)(s, 2),
            m = u[0],
            d = u[1],
            p = Object(a.useState)(''),
            g = Object(ne.a)(p, 2),
            f = g[0],
            h = g[1],
            b = n.admin,
            v = [{ query: am, variables: { name: t } }],
            E = Object(Pt.b)(lm, {
              variables: {
                sitename: t,
                input: { authentication_token: m, project_id: f },
              },
              refetchQueries: v,
              onCompleted: function() {
                return c(!1)
              },
            }),
            y = Object(ne.a)(E, 2),
            w = y[0],
            _ = y[1],
            x = _.loading,
            j = _.error,
            k = 22 === m.length,
            O = m && f
          return r.a.createElement(
            Ii,
            {
              onSubmit: function(e) {
                w(), e.preventDefault()
              },
            },
            r.a.createElement(
              Ni,
              null,
              r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'BugHerd')
            ),
            r.a.createElement(
              Fi,
              null,
              r.a.createElement(
                ma,
                null,
                r.a.createElement(Xe, { weight: 'bold' }, 'Authentication Token'),
                r.a.createElement(
                  Xe,
                  { scale: 6 },
                  'Find this token in your BugHerd organization settings'
                ),
                r.a.createElement(_t, {
                  inputProps: {
                    readOnly: !b || x,
                    value: m,
                    onChange: function(e) {
                      c(!0), d(e.target.value)
                    },
                  },
                }),
                k &&
                  r.a.createElement(hm, {
                    authToken: m,
                    selectProject: function(e) {
                      c(!0), h(e.value)
                    },
                  })
              ),
              j &&
                r.a.createElement(
                  nt,
                  { status: 'critical' },
                  r.a.createElement(Xe, null, j.message)
                )
            ),
            b &&
              r.a.createElement(
                Li,
                null,
                r.a.createElement(
                  ir,
                  { gap: 1 },
                  o &&
                    r.a.createElement(
                      nr,
                      {
                        type: 'button',
                        onClick: function() {
                          c(!1), d(''), h('')
                        },
                        disabled: x,
                      },
                      'Cancel'
                    ),
                  r.a.createElement(
                    tr,
                    { type: 'submit', loading: x, disabled: !o || !O },
                    'Save'
                  )
                )
              )
          )
        },
        Em = function(e) {
          var t = e.sitename,
            n = e.settings
          return n
            ? r.a.createElement(bm, {
                siteAccess: e.siteAccess,
                sitename: t,
                settings: n,
              })
            : r.a.createElement(vm, { siteAccess: e.siteAccess, sitename: t })
        }
      function ym(e) {
        var t,
          n = e.sitename
        Oe('Integrations')
        var a = Object(Pt.c)(am, { variables: { name: n }, errorPolicy: 'all' }),
          i = a.loading,
          l = a.error,
          o = a.data
        if (i) return r.a.createElement(Nu, null)
        if (l)
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(Xe, null, 'An error occured while retrieving settings data')
          )
        var c =
          null === o || void 0 === o
            ? void 0
            : null === (t = o.view) || void 0 === t
            ? void 0
            : t.site
        if (c) {
          var s = null === c || void 0 === c ? void 0 : c.access,
            u = (null === c || void 0 === c ? void 0 : c.settings) || {},
            m = u.github_settings,
            d = u.slack_settings,
            p = u.bugherd_settings
          return r.a.createElement(
            r.a.Fragment,
            null,
            r.a.createElement(Bu, {
              blockId: 'github',
              blockTitle: 'GitHub',
              blockSubtitle: 'Configure GitHub Integration',
              blockForm: r.a.createElement(cm, {
                sitename: n,
                siteAccess: s,
                settings: m,
              }),
            }),
            r.a.createElement(Bu, {
              blockId: 'slack',
              blockTitle: 'Slack',
              blockSubtitle: 'Send preview URLs + build status info to a Slack channel',
              blockForm: r.a.createElement(pm, {
                sitename: n,
                siteAccess: s,
                settings: d,
              }),
            }),
            r.a.createElement(Bu, {
              blockId: 'bugherd',
              blockTitle: 'BugHerd',
              blockSubtitle: 'Linc + BugHerd integration',
              blockForm: r.a.createElement(Em, {
                sitename: n,
                siteAccess: s,
                settings: p,
              }),
            })
          )
        }
        return r.a.createElement(
          nt,
          { status: 'critical' },
          r.a.createElement(Xe, null, 'Error: unable to retrieve site settings data')
        )
      }
      function wm() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $input: FeedbackSettingsInput!) {\n    updateFeedbackSettings(sitename: $sitename, input: $input)\n  }\n',
        ])
        return (
          (wm = function() {
            return e
          }),
          e
        )
      }
      function _m() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n          write\n          read\n          no_access\n        }\n        settings {\n          feedback_settings {\n            feedback_enabled\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (_m = function() {
            return e
          }),
          e
        )
      }
      var xm = Bt()(_m()),
        jm = Bt()(wm()),
        km = function(e) {
          var t = e.subHeading,
            n = e.value,
            a = e.setValue,
            i = e.setDirty,
            l = e.readOnly
          return r.a.createElement(
            'div',
            null,
            r.a.createElement(
              Ai,
              {
                type: 'button',
                disabled: l,
                onClick: function() {
                  i(!0), a(!n)
                },
              },
              !0 === n && r.a.createElement(hl.a, null),
              !1 === n && r.a.createElement(gl.a, null),
              r.a.createElement(Xe, null, t)
            )
          )
        }
      function Om(e) {
        var t = e.sitename,
          n = e.settings,
          i = Object(a.useState)(n.feedback_enabled),
          l = Object(ne.a)(i, 2),
          o = l[0],
          c = l[1],
          s = Object(a.useState)(!1),
          u = Object(ne.a)(s, 2),
          m = u[0],
          d = u[1],
          p = e.siteAccess.admin,
          g = { sitename: t, input: { feedback_enabled: o } },
          f = Object(Pt.b)(jm, {
            variables: g,
            refetchQueries: [{ query: xm, variables: { name: t } }],
            onCompleted: function() {
              return d(!1)
            },
          }),
          h = Object(ne.a)(f, 2),
          b = h[0],
          v = h[1],
          E = v.loading,
          y = v.error
        return r.a.createElement(
          Ii,
          {
            id: 'feedback_settings',
            onSubmit: function(e) {
              b(g), e.preventDefault()
            },
          },
          r.a.createElement(
            Ni,
            null,
            r.a.createElement(Xe, { scale: 4, weight: 'medium' }, 'Beta Feedback program')
          ),
          r.a.createElement(
            Fi,
            { gap: 2 },
            r.a.createElement(km, {
              heading: 'Feedback',
              subHeading: 'Enable feedback beta on site',
              value: o,
              setValue: c,
              setDirty: d,
              readOnly: !p,
            }),
            r.a.createElement(
              Xe,
              { scale: 6 },
              'Get the',
              ' ',
              r.a.createElement(
                'a',
                {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  href:
                    'https://chrome.google.com/webstore/detail/linc-feedback/hepgmgeaphkfkocdjbanggnnldlbaakm',
                },
                'Linc Feedback Chrome extension'
              )
            ),
            y &&
              r.a.createElement(
                nt,
                { status: 'critical' },
                r.a.createElement(Xe, null, y.message)
              )
          ),
          p &&
            r.a.createElement(
              Li,
              null,
              r.a.createElement(
                ir,
                { gap: 1 },
                m &&
                  r.a.createElement(
                    nr,
                    {
                      type: 'button',
                      onClick: function() {
                        c(n.feedback_enabled), d(!1)
                      },
                      disabled: E,
                    },
                    'Cancel'
                  ),
                r.a.createElement(
                  tr,
                  { type: 'submit', disabled: !m, loading: E },
                  'Save'
                )
              )
            )
        )
      }
      function Cm(e) {
        var t,
          n = e.sitename
        Oe('Build settings')
        var a = Object(Pt.c)(xm, { variables: { name: n }, errorPolicy: 'all' }),
          i = a.loading,
          l = a.error,
          o = a.data
        if (i) return r.a.createElement(Nu, null)
        if (l)
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(Xe, null, 'An error occured while retrieving settings data')
          )
        var c =
          null === o || void 0 === o
            ? void 0
            : null === (t = o.view) || void 0 === t
            ? void 0
            : t.site
        if (c) {
          var s,
            u,
            m = (
              (null === o || void 0 === o
                ? void 0
                : null === (s = o.view) || void 0 === s
                ? void 0
                : null === (u = s.site) || void 0 === u
                ? void 0
                : u.settings) || {}
            ).feedback_settings,
            d = null === c || void 0 === c ? void 0 : c.access
          return r.a.createElement(Bu, {
            blockTitle: 'Linc Feedback',
            blockSubtitle: 'Settings for preview URLs',
            blockForm: r.a.createElement(Om, { sitename: n, siteAccess: d, settings: m }),
          })
        }
        return r.a.createElement(
          nt,
          { status: 'critical' },
          r.a.createElement(Xe, null, 'Error: unable to retrieve site settings data')
        )
      }
      function Sm() {
        var e = Object(I.a)([
          '\n  mutation($sitename: String!, $user_id: String!) {\n    removeSiteCollaborator(sitename: $sitename, user_id: $user_id)\n  }\n',
        ])
        return (
          (Sm = function() {
            return e
          }),
          e
        )
      }
      function Im() {
        var e = Object(I.a)([
          '\n  mutation(\n    $sitename: String!\n    $user_id: String!\n    $access_level: SiteAccessEnum!\n  ) {\n    updateSiteCollaborator(\n      sitename: $sitename\n      user_id: $user_id\n      access_level: $access_level\n    )\n  }\n',
        ])
        return (
          (Im = function() {
            return e
          }),
          e
        )
      }
      function Nm() {
        var e = Object(I.a)([
          '\n  mutation(\n    $sitename: String!\n    $user_id: String!\n    $access_level: SiteAccessEnum!\n  ) {\n    addSiteCollaborator(\n      sitename: $sitename\n      user_id: $user_id\n      access_level: $access_level\n    )\n  }\n',
        ])
        return (
          (Nm = function() {
            return e
          }),
          e
        )
      }
      function Fm() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n        }\n        settings {\n          access_control {\n            collaborators {\n              name\n              login\n              user_id\n              avatar_url\n              access_level\n              is_current_user\n            }\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (Fm = function() {
            return e
          }),
          e
        )
      }
      var Lm = Bt()(Fm()),
        Am = Bt()(Nm()),
        Pm = Bt()(Im()),
        Dm = Bt()(Sm()),
        Bm = n(105),
        $m = s.default.div.withConfig({
          displayName: 'AddCollaborator__RowGrid',
          componentId: 'sc-17iagoi-0',
        })(['display:grid;grid-template-columns:1fr auto;grid-gap:1rem;']),
        qm = function(e) {
          var t = e.login,
            n = e.avatar_url
          return r.a.createElement(
            ir,
            { gap: 0.5 },
            r.a.createElement('img', { alt: '', style: { height: '1rem' }, src: n }),
            r.a.createElement(Xe, null, t)
          )
        },
        Rm = function(e) {
          return {
            value: e.id,
            label: r.a.createElement(qm, { login: e.login, avatar_url: e.avatar_url }),
          }
        }
      function Tm(e) {
        var t = e.sitename,
          n = Object(a.useState)(),
          i = Object(ne.a)(n, 2),
          l = i[0],
          o = i[1],
          c = Object(Pt.b)(Am, {
            refetchQueries: [{ query: Lm, variables: { name: t } }],
          }),
          s = Object(ne.a)(c, 2),
          u = s[0],
          m = s[1].loading,
          d = Object(Ea.a)(function(e, t) {
            e
              ? fetch('https://api.github.com/search/users?q=' + e)
                  .then(function(e) {
                    return e.json()
                  })
                  .then(function(e) {
                    var n = e.items
                    return t(
                      (function(e) {
                        return e.map(Rm)
                      })(n)
                    )
                  })
                  .catch(function(e) {
                    return console.log(e)
                  })
              : t([])
          }, 500),
          p = Object(ne.a)(d, 1)[0]
        return r.a.createElement(
          $m,
          null,
          r.a.createElement(Bm.a, {
            cacheOptions: !0,
            placeholder: 'Search...',
            loadOptions: p,
            onChange: function(e) {
              var t = e.value
              return o(t)
            },
          }),
          r.a.createElement(
            tr,
            {
              onClick: function() {
                return u({
                  variables: {
                    sitename: t,
                    user_id: 'github:'.concat(l),
                    access_level: 'read',
                  },
                })
              },
              disabled: !!m || !l,
              loading: m,
            },
            'Add Collaborator'
          )
        )
      }
      var zm = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'blrmp7-0',
        })(['', ';'], z),
        Mm = Object(s.css)(
          ['color:', ';background:', ';&:hover{cursor:default;background:', ';}'],
          function(e) {
            var t = e.theme
            return e.active ? t.text.reverse : t.text.placeholder
          },
          function(e) {
            var t = e.theme
            return e.active ? t.brand.wash : t.bg.default
          },
          function(e) {
            var t = e.theme
            return e.active ? t.brand.wash : t.bg.default
          }
        ),
        Hm = Object(s.css)(
          [
            '',
            ';',
            ';',
            ';cursor:pointer;text-transform:capitalize;transition:200ms ease all;background:',
            ';color:',
            ';border-style:solid;border-width:1px 0 1px 0;border-color:',
            ';&:first-of-type{border-radius:0.25rem 0 0 0.25rem;border-width:1px 1px 1px 1px;}&:last-of-type{border-radius:0 0.25rem 0.25rem 0;border-width:1px 1px 1px 1px;}&:hover{',
            '}',
          ],
          z.center_both,
          H.pv05.ph1,
          R.f6,
          function(e) {
            var t = e.theme
            return e.active ? t.brand.default : t.bg.default
          },
          function(e) {
            var t = e.theme
            return e.active ? t.text.reverse : t.text.default
          },
          function(e) {
            return e.theme.bg.border
          },
          function(e) {
            return (
              !1 === e.active &&
              Object(s.css)(['background:', ';'], function(e) {
                return e.theme.brand.wash
              })
            )
          }
        ),
        Vm = s.default.button.withConfig({
          displayName: 'style__OptionStyle',
          componentId: 'blrmp7-1',
        })(['', ';', ';'], Hm, function(e) {
          return e.isDisabled && Mm
        }),
        Wm = function(e) {
          var t = e.sitename,
            n = e.user_id,
            a = e.current_access,
            i = e.new_access,
            l = e.isDisabled,
            o = Object(Pt.b)(Pm, {
              variables: { sitename: t, user_id: n, access_level: i },
              update: function(e) {
                return (function(e, t, n, a) {
                  var r = e.readQuery({ query: Lm, variables: { name: t } }),
                    i = r.view.site.settings.access_control.collaborators,
                    l = i.findIndex(function(e) {
                      return e.user_id === n
                    }),
                    o = Object(pt.a)({}, i[l])
                  o.access_level = a
                  var c = 'view.site.settings.access_control.collaborators.'.concat(l),
                    s = ri.a.set(r, c, o)
                  e.writeQuery({
                    query: Lm,
                    variables: { name: t },
                    data: Object(pt.a)({}, s),
                  })
                })(e, t, n, i)
              },
            }),
            c = Object(ne.a)(o, 2),
            s = c[0],
            u = c[1].loading,
            m = l || u || a === i
          return r.a.createElement(
            Vm,
            { loading: u, isDisabled: l, disabled: m, onClick: s, active: a === i },
            i
          )
        },
        Um = function(e) {
          var t = e.sitename,
            n = e.user_id,
            a = e.access_level,
            i = e.isDisabled
          return r.a.createElement(
            zm,
            null,
            ['read', 'write', 'admin'].map(function(e) {
              return r.a.createElement(Wm, {
                current_access: a,
                isDisabled: i,
                new_access: e,
                sitename: t,
                user_id: n,
                key: e,
              })
            })
          )
        },
        Gm = s.default.div.withConfig({
          displayName: 'RemoveCollaborator__SpinnerContainer',
          componentId: 'sc-1v963pu-0',
        })(['', ';', ';'], z.center_both, H.p05),
        Qm = s.default.div.withConfig({
          displayName: 'RemoveCollaborator__RemoveButtonStyle',
          componentId: 'sc-1v963pu-1',
        })(
          [
            '',
            ';',
            ';',
            ';color:',
            ';cursor:pointer;svg{height:1rem;width:1rem;}&:hover{background:',
            ';}',
          ],
          z.center_both,
          T.br2,
          H.p05,
          function(e) {
            return e.theme.warn.default
          },
          function(e) {
            return e.theme.warn.wash
          }
        )
      function Ym(e) {
        var t = e.sitename,
          n = e.user_id,
          a = Object(Pt.b)(Dm, {
            update: function(e) {
              return (function(e, t, n) {
                var a = e.readQuery({ query: Lm, variables: { name: t } }),
                  r = a.view.site.settings.access_control.collaborators,
                  i = r.findIndex(function(e) {
                    return e.user_id === n
                  }),
                  l = Object(Dr.a)(r)
                l.splice(i, 1)
                var o = ri.a.set(a, 'view.site.settings.access_control.collaborators', l)
                e.writeQuery({
                  query: Lm,
                  variables: { name: t },
                  data: Object(pt.a)({}, o),
                })
              })(e, t, n)
            },
            variables: { sitename: t, user_id: n },
          }),
          i = Object(ne.a)(a, 2),
          l = i[0],
          o = i[1].loading
        return o
          ? r.a.createElement(Gm, null, r.a.createElement(He, { size: 0.5 }))
          : r.a.createElement(
              Qm,
              { onClick: l, disabled: o },
              r.a.createElement(rt.a, null)
            )
      }
      var Km = s.default.div.withConfig({
          displayName: 'Collaborator__Wrapper',
          componentId: 'sc-1fhzfyv-0',
        })(
          [
            '',
            ';display:grid;grid-template-columns:10rem auto;',
            ';background:',
            ';&:nth-child(even){background:',
            ';}',
          ],
          R.f6,
          H.p05,
          function(e) {
            return e.theme.bg.default
          },
          function(e) {
            return e.theme.bg.wash
          }
        ),
        Xm = s.default.div.withConfig({
          displayName: 'Collaborator__Left',
          componentId: 'sc-1fhzfyv-1',
        })(
          [
            '',
            ';> img{',
            ';height:2rem;',
            ';}> span{white-space:nowrap;overflow:hidden;}',
          ],
          z.align_center,
          T.br2,
          H.mr05
        ),
        Zm = s.default.div.withConfig({
          displayName: 'Collaborator__Right',
          componentId: 'sc-1fhzfyv-2',
        })(
          ['display:flex;align-content:center;justify-content:flex-end;> * + *{', ';}'],
          H.ml05
        )
      function Jm(e) {
        var t = e.sitename,
          n = e.collaborator,
          a = e.isDisabled,
          i = n.login,
          l = n.user_id,
          o = n.avatar_url,
          c = n.access_level,
          s = n.is_current_user
        return r.a.createElement(
          Km,
          { foo: s },
          r.a.createElement(
            Xm,
            null,
            r.a.createElement('img', { alt: '', src: o }),
            r.a.createElement(Xe, { scale: 6 }, i)
          ),
          r.a.createElement(
            Zm,
            null,
            r.a.createElement(Um, {
              isDisabled: a,
              access_level: c,
              sitename: t,
              user_id: l,
            }),
            !a && r.a.createElement(Ym, { sitename: t, user_id: l })
          )
        )
      }
      var ed = Object(s.default)(Ti).withConfig({
          displayName: 'AccessControl__StyledNullState',
          componentId: 'sc-1u289uz-0',
        })(['padding:1rem;']),
        td = function(e) {
          var t = e.collaborators,
            n = e.sitename,
            a = e.isDisabled
          return t.map(function(e) {
            return r.a.createElement(Jm, {
              key: e.user_id,
              sitename: n,
              collaborator: e,
              isDisabled: a,
            })
          })
        }
      function nd(e) {
        var t,
          n = e.sitename
        Oe('Access control')
        var a = Object(Pt.c)(Lm, { variables: { name: n } }),
          i = a.loading,
          l = a.error,
          o = a.data
        if (l)
          return r.a.createElement(
            nt,
            { status: 'critical' },
            r.a.createElement(Xe, null, l)
          )
        if (i) return r.a.createElement(Nu, null)
        var c =
          null === o || void 0 === o
            ? void 0
            : null === (t = o.view) || void 0 === t
            ? void 0
            : t.site
        if (c) {
          var s,
            u,
            m,
            d =
              null === o || void 0 === o
                ? void 0
                : null === (s = o.view) || void 0 === s
                ? void 0
                : null === (u = s.site) || void 0 === u
                ? void 0
                : null === (m = u.settings) || void 0 === m
                ? void 0
                : m.access_control,
            p = ((null === d || void 0 === d ? void 0 : d.collaborators) || []).filter(
              function(e) {
                return !1 === e.is_current_user
              }
            ),
            g = !c.access.admin
          return r.a.createElement(Bu, {
            blockTitle: 'Access Control',
            blockSubtitle: 'Grant other users access to your site',
            blockForm: r.a.createElement(
              Ii,
              null,
              r.a.createElement(Ni, null, r.a.createElement(Xe, null, 'Collaborators')),
              r.a.createElement(
                Fi,
                null,
                !g && r.a.createElement(Tm, { sitename: n }),
                p.length > 0
                  ? r.a.createElement(
                      ma,
                      { gap: 0 },
                      r.a.createElement(td, {
                        collaborators: p,
                        isDisabled: g,
                        sitename: n,
                      })
                    )
                  : r.a.createElement(
                      ed,
                      null,
                      r.a.createElement(
                        Xe,
                        { tone: 'secondary' },
                        'This site does not have any collaborators yet'
                      )
                    )
              )
            ),
          })
        }
        return r.a.createElement(
          nt,
          { status: 'critical' },
          r.a.createElement(Xe, null, 'Error: unable to retrieve site settings data')
        )
      }
      function ad() {
        var e = Object(K.m)().sitenameSlug,
          t = '/sites/'.concat(e, '/settings')
        return r.a.createElement(
          lu,
          null,
          r.a.createElement(
            K.d,
            { path: t },
            r.a.createElement(ru, { categories: iu, basePath: t })
          ),
          r.a.createElement(
            ou,
            null,
            r.a.createElement(
              K.d,
              { exact: !0, path: t + '/' },
              r.a.createElement(K.c, { to: t + '/build' })
            ),
            r.a.createElement(
              K.d,
              { path: t + '/build' },
              r.a.createElement(qu, { sitename: e })
            ),
            r.a.createElement(
              K.d,
              { path: t + '/deploy' },
              r.a.createElement(Zu, { sitename: e })
            ),
            r.a.createElement(
              K.d,
              { path: t + '/integrations' },
              r.a.createElement(ym, { sitename: e })
            ),
            r.a.createElement(
              K.d,
              { path: t + '/feedback' },
              r.a.createElement(Cm, { sitename: e })
            ),
            r.a.createElement(
              K.d,
              { path: t + '/access' },
              r.a.createElement(nd, { sitename: e })
            )
          )
        )
      }
      function rd() {
        return r.a.createElement(
          ma,
          null,
          r.a.createElement(
            ir,
            null,
            r.a.createElement(Ht, { height: 1, width: 4 }),
            r.a.createElement(Ht, { height: 1, width: 5 }),
            r.a.createElement(Ht, { height: 1, width: 4 }),
            r.a.createElement(Ht, { height: 1, width: 6 })
          ),
          r.a.createElement(Mt, null),
          r.a.createElement(Hs, { loading: !0 }),
          r.a.createElement(Hs, { loading: !0 }),
          r.a.createElement(Hs, { loading: !0 })
        )
      }
      function id() {
        var e = Object(I.a)([
          '\n  query($name: String!) {\n    view {\n      site(name: $name) {\n        access {\n          admin\n          read\n          write\n          no_access\n        }\n        settings {\n          feedback_settings {\n            feedback_enabled\n          }\n        }\n        allSiteFeedback {\n          author_name\n          bundle_id\n          comment\n          created_at\n          current_url\n          screenshot_url\n          sitename\n          uuid\n          associated_commits\n          associated_branches\n          browser_metadata {\n            height\n            innerHeight\n            innerWidth\n            scrollX\n            scrollY\n            userAgent\n            parsedUserAgent\n            width\n          }\n        }\n      }\n    }\n  }\n',
        ])
        return (
          (id = function() {
            return e
          }),
          e
        )
      }
      var ld = Bt()(id()),
        od = n(106),
        cd = n.n(od),
        sd = s.default.img.withConfig({
          displayName: 'Welcome__Img',
          componentId: 'sc-1yjx9tq-0',
        })(
          ['max-width:70%;box-shadow:0 1px 20px 1px ', ';border-radius:0.25rem;'],
          function(e) {
            var t = e.theme
            return Q(t.bg.reverse, 0.2)
          }
        )
      function ud(e) {
        var t = Object(K.m)().sitenameSlug,
          n = e.siteAccess.admin,
          a = { sitename: t, input: { feedback_enabled: !0 } },
          i = Object(Pt.b)(Ya, {
            variables: a,
            refetchQueries: [{ query: ld, variables: { name: t } }],
            onCompleted: function() {
              return console.log('completed!')
            },
          }),
          l = Object(ne.a)(i, 2),
          o = l[0],
          c = l[1],
          s = c.loading,
          u = c.error
        return r.a.createElement(
          ma,
          { gap: 2 },
          r.a.createElement(
            ma,
            null,
            r.a.createElement(
              Xe.P,
              { scale: 4, weight: 'medium' },
              'Linc Feedback is a new tool that lets you leave feedback directly on preview URLs.'
            ),
            r.a.createElement(sd, { style: { width: '80%' }, src: cd.a })
          ),
          r.a.createElement(
            ma,
            { gap: 0.5 },
            r.a.createElement(
              Xe.P,
              { scale: 4, weight: 'medium' },
              'Feedback left on preview URLs goes to three places:'
            ),
            r.a.createElement(
              Xe.P,
              null,
              '1. ',
              r.a.createElement('strong', null, 'GitHub Pull Requests'),
              ' - if the preview URL is part of a GitHub Pull Request, Linc will post your feedback into the Pull Request.'
            ),
            r.a.createElement(
              Xe.P,
              null,
              '2. ',
              r.a.createElement('strong', null, 'Linc Feedback Overview'),
              ' - all feedback left on preview URLs for ',
              r.a.createElement('code', null, t),
              ' can be found on this page.'
            ),
            r.a.createElement(
              Xe.P,
              null,
              '3. ',
              r.a.createElement('strong', null, 'Linc Commit Overview'),
              ' - feedback left on a preview URL that matches a given commit can be found on the commit overview page in Linc.'
            )
          ),
          r.a.createElement(
            ma,
            null,
            r.a.createElement(
              Xe.P,
              { scale: 4, weight: 'medium' },
              'To get started, first add the',
              ' ',
              r.a.createElement(
                'a',
                {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  href:
                    'https://chrome.google.com/webstore/detail/linc-feedback/hepgmgeaphkfkocdjbanggnnldlbaakm',
                },
                'Linc Feedback browser extension'
              ),
              ' ',
              'to Chrome.'
            ),
            r.a.createElement(
              Xe.P,
              { scale: 4, weight: 'medium' },
              'Then, enable Linc Feedback on ',
              r.a.createElement('code', null, t),
              ' by clicking the ',
              r.a.createElement('strong', null, 'Enable Feedback'),
              ' button below.'
            )
          ),
          r.a.createElement(
            'div',
            {
              title: n
                ? 'Enable feedback on '.concat(t)
                : 'You must be an administrator of '.concat(t, ' to enable feedback'),
            },
            r.a.createElement(
              tr,
              {
                large: !0,
                loading: s,
                onClick: function() {
                  o(a)
                },
                disabled: s || !n,
              },
              'Enable Feedback'
            )
          ),
          u &&
            r.a.createElement(
              nt,
              { status: 'critical' },
              r.a.createElement(Xe, null, u.message)
            )
        )
      }
      function md(e) {
        var t = e.sitename
        return r.a.createElement(
          Ti,
          null,
          r.a.createElement(
            ma,
            null,
            r.a.createElement(
              Xe,
              { weight: 'bold', as: 'h3', tone: 'secondary' },
              'No feedback found'
            ),
            r.a.createElement(
              Xe,
              { tone: 'secondary' },
              'All new Feedback left on preview URLs for ',
              r.a.createElement('code', null, t),
              ' will appear here.'
            ),
            r.a.createElement(
              Xe,
              { tone: 'secondary' },
              'You can leave feedback on preview URLs by using the',
              ' ',
              r.a.createElement('strong', null, 'Feedback browser extension'),
              '.'
            ),
            r.a.createElement(
              'a',
              {
                href:
                  'https://chrome.google.com/webstore/detail/linc-feedback/hepgmgeaphkfkocdjbanggnnldlbaakm',
              },
              'Download the Feedback browser extension here'
            )
          )
        )
      }
      var dd = n(183),
        pd = n(185),
        gd = n(184),
        fd = s.default.div.withConfig({
          displayName: 'Divider__Wrapper',
          componentId: 'jkqw52-0',
        })(['', ' align-items:center;'], z.vertical),
        hd = s.default.hr.withConfig({
          displayName: 'Divider__HR',
          componentId: 'jkqw52-1',
        })(['width:100%;border-top:1px solid ', ';'], function(e) {
          return e.theme.bg.border
        }),
        bd = s.default.div.withConfig({
          displayName: 'Divider__TimeStamp',
          componentId: 'jkqw52-2',
        })(['z-index:2;margin-bottom:-1rem;', ';background:rgb(252,252,253);'], H.ph05)
      function vd(e) {
        var t = e.date.split('-'),
          n = Object(ne.a)(t, 3),
          a = n[0],
          i = n[1],
          l = n[2],
          o = new Date(a, i - 1, l),
          c = Object(dd.a)(o),
          s = Object(pd.a)(o),
          u = Object(gd.a)(o, 'PPPP')
        return r.a.createElement(
          fd,
          null,
          r.a.createElement(
            bd,
            null,
            r.a.createElement(Xe, { weight: 'bold' }, c ? 'Today' : s ? 'Yesterday' : u)
          ),
          r.a.createElement(hd, null)
        )
      }
      function Ed(e) {
        var t = e.group,
          n = e.branchTags,
          a = t.date,
          i = t.items
        return r.a.createElement(
          ma,
          null,
          r.a.createElement(vd, { date: a }),
          i.map(function(e) {
            return r.a.createElement(Hs, { key: e.uuid, feedback: e, branchTags: n })
          })
        )
      }
      var yd = s.default.div.withConfig({
        displayName: 'List__TagsContainer',
        componentId: 'wn76lk-0',
      })([
        'display:flex;flex-wrap:wrap;button{margin-right:0.25rem;margin-bottom:0.25rem;}',
      ])
      function wd(e) {
        var t = Object(a.useState)([]),
          n = Object(ne.a)(t, 2),
          i = n[0],
          l = n[1],
          o = (function(e) {
            var t = []
            return (
              e.forEach(function(e) {
                var n = e.associated_branches,
                  a = [].concat(Object(Dr.a)(t), Object(Dr.a)(n))
                t = a
              }),
              Object(Dr.a)(new Set(t))
            )
          })(e.allSiteFeedback),
          c = (function() {
            var t = e.allSiteFeedback
            return i.length > 0
              ? t.filter(function(e) {
                  return e.associated_branches.some(function(e) {
                    return i.includes(e)
                  })
                })
              : t
          })(),
          s = (function(e) {
            var t = e.reduce(function(e, t) {
              var n = 6e4 * new Date().getTimezoneOffset(),
                a = new Date(parseInt(t.created_at) - n)
                  .toISOString()
                  .slice(0, -1)
                  .split('T')[0]
              return e[a] || (e[a] = []), e[a].push(t), e
            }, {})
            return Object.keys(t).map(function(e) {
              return { date: e, items: t[e] }
            })
          })(c)
        return r.a.createElement(
          ma,
          null,
          r.a.createElement(
            yd,
            { internalSpacing: 0.5 },
            r.a.createElement(
              Fs,
              {
                as: 'button',
                onClick: function() {
                  return l([])
                },
              },
              r.a.createElement(Xe, { tone: 'secondary', scale: 6 }, 'Show All')
            ),
            o.map(function(e) {
              return r.a.createElement(
                Fs,
                {
                  as: 'button',
                  onClick: function() {
                    return (function(e) {
                      if (i.includes(e)) {
                        var t = i.indexOf(e),
                          n = Object(Dr.a)(i)
                        n.splice(t, 1), l(n)
                      } else {
                        var a = [].concat(Object(Dr.a)(i), [e])
                        l(a)
                      }
                    })(e)
                  },
                  key: e,
                  selected: i.includes(e),
                },
                r.a.createElement(Xe, { tone: 'secondary', scale: 6 }, e)
              )
            })
          ),
          r.a.createElement(
            Xe,
            { tone: 'secondary', scale: 6 },
            'Showing ',
            c.length,
            ' ',
            c.length > 1 ? 'cards' : 'card'
          ),
          r.a.createElement(
            ma,
            { gap: 2 },
            s.map(function(e) {
              return r.a.createElement(Ed, { key: e.date, group: e, branchTags: i })
            })
          )
        )
      }
      function _d() {
        var e = Object(K.m)().sitenameSlug,
          t = Object(Pt.c)(ld, { variables: { name: e } }),
          n = t.loading,
          a = t.error,
          i = t.data
        if (n) return r.a.createElement(rd, null)
        if (a)
          return r.a.createElement(
            nt,
            null,
            r.a.createElement(Xe, null, 'Error retrieving Feedback page')
          )
        if (i) {
          var l,
            o,
            c,
            s,
            u =
              null === i || void 0 === i
                ? void 0
                : null === (l = i.view) || void 0 === l
                ? void 0
                : l.site,
            m =
              null === u || void 0 === u
                ? void 0
                : null === (o = u.settings) || void 0 === o
                ? void 0
                : o.feedback_settings,
            d =
              null === i || void 0 === i
                ? void 0
                : null === (c = i.view) || void 0 === c
                ? void 0
                : null === (s = c.site) || void 0 === s
                ? void 0
                : s.access
          if (m && m.feedback_enabled) {
            var p,
              g,
              f =
                null === i || void 0 === i
                  ? void 0
                  : null === (p = i.view) || void 0 === p
                  ? void 0
                  : null === (g = p.site) || void 0 === g
                  ? void 0
                  : g.allSiteFeedback
            return f.length > 0
              ? r.a.createElement(wd, { allSiteFeedback: f })
              : r.a.createElement(md, { sitename: e })
          }
          return r.a.createElement(ud, { siteAccess: d, feedback_settings: m })
        }
      }
      function xd(e) {
        var t = e.sitename
        Object(Pt.d)(ks, {
          variables: { sitename: t },
          onSubscriptionData: function(e) {
            var n = e.client,
              a = e.subscriptionData
            return (function(e, t, n) {
              try {
                var a,
                  r = n.data.releaseStatusV2Updated,
                  i =
                    null === r || void 0 === r
                      ? void 0
                      : null === (a = r.current_release) || void 0 === a
                      ? void 0
                      : a.bundle_id,
                  l = ii.get(i)
                l &&
                  (r.deployment_statuses = r.deployment_statuses.map(function(e) {
                    return l[e.deploy_target_name] || e
                  })),
                  ii.clear()
                var o = t.readQuery({ query: ta, variables: { name: e } })
                t.writeQuery({
                  query: ta,
                  variables: { name: e },
                  data: ri.a.set(o, 'view.site.releaseStatusV2', r),
                })
              } catch (c) {
                return
              }
            })(t, n, a)
          },
        }),
          Object(Pt.d)(Os, {
            variables: { sitename: t },
            onSubscriptionData: function(e) {
              var n = e.client,
                a = e.subscriptionData
              return li(t, n, a)
            },
          }),
          Object(Pt.d)(js, {
            variables: { sitename: t },
            onSubscriptionData: function(e) {
              var n = e.client,
                a = e.subscriptionData
              return (function(e, t, n) {
                try {
                  var a = t.readQuery({ query: na, variables: { name: e, limit: 20 } }),
                    r = n.data.commit_events
                  if (
                    ((r.pull_request = void 0 === r.pull_request ? null : r.pull_request),
                    a)
                  ) {
                    var i = a.view.site.commitsFeed.commits.findIndex(function(e) {
                      return e.commit_sha === r.commit_sha
                    })
                    ;-1 !== i
                      ? t.writeQuery({
                          query: na,
                          variables: { name: e, limit: 20 },
                          data: ri.a.set(
                            a,
                            'view.site.commitsFeed.commits.'.concat(i),
                            r
                          ),
                        })
                      : t.writeQuery({
                          query: na,
                          variables: { name: e, limit: 20 },
                          data: ri.a.insert(a, 'view.site.commitsFeed.commits', r, 0),
                        })
                  }
                } catch (l) {
                  return
                }
              })(t, n, a)
            },
          })
      }
      var jd = null
      function kd() {
        var e = Object(K.m)().sitenameSlug,
          t = E.DEMO_MODE
        xd({ sitename: e })
        var n = e === jd ? 'cache-first' : 'network-only'
        return (
          (jd = e),
          r.a.createElement(
            Vi,
            null,
            r.a.createElement(nl, { isDemo: t }),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/sites/:sitenameSlug' },
              r.a.createElement(vc, { fetchPolicy: n })
            ),
            r.a.createElement(
              K.d,
              { path: '/sites/:sitenameSlug/settings' },
              r.a.createElement(ad, null)
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/sites/:sitenameSlug/environments' },
              r.a.createElement(Lc, null)
            ),
            r.a.createElement(
              K.d,
              { path: '/sites/:sitenameSlug/commits/:branchSlug' },
              r.a.createElement(Ks, null)
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/sites/:sitenameSlug/commit/:commitShaSlug' },
              r.a.createElement(Ws, null)
            ),
            r.a.createElement(
              K.d,
              { exact: !0, path: '/sites/:sitenameSlug/feedback' },
              r.a.createElement(_d, null)
            )
          )
        )
      }
      function Od() {
        return r.a.createElement(
          K.g,
          null,
          r.a.createElement(K.d, { path: '/create' }, r.a.createElement(Wr, null)),
          r.a.createElement(K.d, { path: '/post_install' }, r.a.createElement(sa, null)),
          r.a.createElement(
            K.d,
            { exact: !0, path: '/billing' },
            r.a.createElement(Hi, null)
          ),
          r.a.createElement(
            K.d,
            { exact: !0, path: '/sites' },
            r.a.createElement(Ei, null)
          ),
          r.a.createElement(
            K.d,
            { path: '/sites/:sitenameSlug' },
            r.a.createElement(kd, null)
          ),
          r.a.createElement(
            K.d,
            { exact: !0, path: '/' },
            r.a.createElement(K.c, { to: '/sites' })
          ),
          r.a.createElement(
            K.d,
            { path: '/new' },
            r.a.createElement(K.c, { to: '/create' })
          ),
          r.a.createElement(
            K.d,
            { path: '/new/site' },
            r.a.createElement(K.c, { to: '/create' })
          ),
          r.a.createElement(K.d, {
            path: '/site/:sitenameSlug',
            render: function(e) {
              var t = e.match.params.sitenameSlug
              return r.a.createElement(K.c, { to: '/sites/'.concat(t) })
            },
          }),
          r.a.createElement(
            K.d,
            { path: '/add' },
            r.a.createElement(K.c, { to: '/sites' })
          ),
          r.a.createElement(
            K.d,
            { path: '/add/site' },
            r.a.createElement(K.c, { to: '/sites' })
          )
        )
      }
      var Cd = n(107),
        Sd = n.n(Cd),
        Id = n(108),
        Nd = n.n(Id),
        Fd = n(109),
        Ld = n.n(Fd),
        Ad = s.default.div.withConfig({
          displayName: 'Screenshot__Frame',
          componentId: 'x6zit6-0',
        })(
          [
            'max-width:640px;margin:2rem auto;color:',
            ';',
            ';overflow:hidden;box-shadow:0 12px 48px 0 rgba(0,0,0,0.25);position:relative;> img:first-child{position:absolute;top:-1px;left:-1px;width:calc(100% + 2px);height:4.68%;}> img:nth-child(2){margin:-1px;width:calc(100% + 2px);}',
            ';',
          ],
          function(e) {
            return e.theme.generic.border
          },
          T.ba.br2,
          function(e) {
            return e.customCss
          }
        ),
        Pd = function(e) {
          var t = e.image,
            a = e.alt,
            i = e.customCss
          return r.a.createElement(
            Ad,
            { customCss: i },
            r.a.createElement('img', { src: n(147), alt: a }),
            r.a.createElement('img', { src: t, alt: '' })
          )
        },
        Dd = s.default.div.withConfig({
          displayName: 'style__Wrapper',
          componentId: 'sc-1mox3jh-0',
        })(
          [
            "width:100%;display:grid;grid-template-columns:minmax(1rem,1fr) 800px minmax(1rem,1fr);grid-template-areas:'a a a' '. b .';",
            '{grid-template-columns:4rem 1fr 4rem;}',
            '{grid-template-columns:2rem 1fr 2rem;}',
          ],
          B,
          $
        ),
        Bd = s.default.header.withConfig({
          displayName: 'style__Header',
          componentId: 'sc-1mox3jh-1',
        })(['grid-area:a;', ';', ';'], z.align_center.justify_space_btw.fg1, H.ph2.pv1),
        $d = s.default.div.withConfig({
          displayName: 'style__SubHeader',
          componentId: 'sc-1mox3jh-2',
        })(
          ['', ';', '{', ';> * + *{', ';}}'],
          z.align_center.justify_space_btw,
          $,
          z.align_start.vertical,
          H.mt1
        ),
        qd =
          (s.default.div.withConfig({
            displayName: 'style__FlexRow',
            componentId: 'sc-1mox3jh-3',
          })(['', ';> * + *{', ';}'], z.center_both, H.ml1),
          s.default.img.withConfig({
            displayName: 'style__LincLogo',
            componentId: 'sc-1mox3jh-4',
          })(['height:4rem;margin-top:-0.4rem;'])),
        Rd = s.default.img.withConfig({
          displayName: 'style__LincHeading',
          componentId: 'sc-1mox3jh-5',
        })(['height:1.3rem;']),
        Td = s.default.div.withConfig({
          displayName: 'style__Content',
          componentId: 'sc-1mox3jh-6',
        })(['grid-area:b;', ';padding-top:6rem;> * + *{', ';}'], z.vertical.fg1, H.mt4),
        zd = Object(s.css)(['max-width:800px;'])
      function Md() {
        var e = function() {
          window.location = 'https://graphql.linc.sh/login/github'
        }
        return r.a.createElement(
          Dd,
          null,
          r.a.createElement(
            Bd,
            null,
            r.a.createElement(
              'a',
              { href: 'https://linc.sh/' },
              r.a.createElement(
                ir,
                null,
                r.a.createElement(qd, { src: Nd.a, alt: 'Linc head logo svg' }),
                r.a.createElement(Rd, { src: Sd.a, alt: 'Linc heading svg' })
              )
            ),
            r.a.createElement(
              ar,
              { color: S.brand.dark, large: !0, onClick: e },
              'Log in'
            )
          ),
          r.a.createElement(
            Td,
            null,
            r.a.createElement(
              $d,
              null,
              r.a.createElement(
                ma,
                null,
                r.a.createElement(Xe, { scale: 1, weight: 'bold' }, 'Test.'),
                r.a.createElement(Xe, { scale: 1, weight: 'bold' }, 'Collaborate.'),
                r.a.createElement(Xe, { scale: 1, weight: 'bold' }, 'Release.')
              ),
              r.a.createElement(
                tr,
                { color: S.brand.dark, large: !0, onClick: e },
                'Create an account'
              )
            ),
            r.a.createElement(Pd, {
              image: Ld.a,
              alt: 'Screen shot of typical Linc site overview',
              customCss: zd,
            })
          )
        )
      }
      var Hd = s.default.div.withConfig({
        displayName: 'App__Content',
        componentId: 'sc-1n7l6hu-0',
      })(['grid-area:content;', ';'], function(e) {
        return e.show && 'height: calc(100vh - 4rem)'
      })
      function Vd() {
        var e = (function() {
            var e = Object(a.useState)(!1),
              t = Object(ne.a)(e, 2),
              n = t[0],
              r = t[1],
              i = Object(a.useRef)()
            Object(a.useEffect)(function() {
              return (
                document.addEventListener('mousedown', l),
                function() {
                  document.removeEventListener('mousedown', l)
                }
              )
            }, [])
            var l = function(e) {
              i.current.contains(e.target) || r(!1)
            }
            return {
              show: n,
              setShow: r,
              toggleSideBar: function() {
                return r(!n)
              },
              node: i,
            }
          })(),
          t = e.show,
          n = e.setShow,
          i = e.toggleSideBar,
          l = e.node
        return r.a.createElement(
          te,
          null,
          r.a.createElement(Zt, { toggleSideBar: i }),
          r.a.createElement(ca, { node: l, show: t, setShow: n }),
          r.a.createElement(Hd, { show: t }, r.a.createElement(Od, null))
        )
      }
      var Wd = Object(u.a)(function() {
        var e = w.loggedIn
        return r.a.createElement(
          o.BrowserRouter,
          null,
          r.a.createElement(
            X,
            null,
            r.a.createElement(
              c.a,
              { client: O },
              r.a.createElement(
                s.ThemeProvider,
                { theme: C },
                r.a.createElement(
                  a.Fragment,
                  null,
                  r.a.createElement(Y, null),
                  e ? r.a.createElement(Vd, null) : r.a.createElement(Md, null)
                )
              )
            )
          )
        )
      })
      'serviceWorker' in navigator &&
        navigator.serviceWorker.ready.then(function(e) {
          e.unregister()
        })
      var Ud
      ;(Ud = Wd), l.a.render(r.a.createElement(Ud, null), document.getElementById('root'))
    },
  },
  [[118, 1, 2]],
])
//# sourceMappingURL=main.a5e68ffe.chunk.js.map
