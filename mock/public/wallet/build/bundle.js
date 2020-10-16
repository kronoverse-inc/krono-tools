function _loadWasmModule(sync,filepath,src,imports){function _instantiateOrCompile(e,t,n){var s=n?WebAssembly.instantiateStreaming:WebAssembly.instantiate,l=n?WebAssembly.compileStreaming:WebAssembly.compile;return t?s(e,t):l(e)}var buf=null,isNode="undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node;if(filepath&&isNode){var fs=eval('require("fs")'),path=eval('require("path")');return new Promise(((e,t)=>{fs.readFile(path.resolve(__dirname,filepath),((n,s)=>{null!=n&&t(n),e(_instantiateOrCompile(s,imports,!1))}))}))}if(filepath)return _instantiateOrCompile(fetch(filepath),imports,!0);if(isNode)buf=Buffer.from(src,"base64");else{var raw=globalThis.atob(src),rawLength=raw.length;buf=new Uint8Array(new ArrayBuffer(rawLength));for(var i=0;i<rawLength;i++)buf[i]=raw.charCodeAt(i)}if(sync){var mod=new WebAssembly.Module(buf);return imports?new WebAssembly.Instance(mod,imports):mod}return _instantiateOrCompile(buf,imports,!1)}var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function s(e){e.forEach(t)}function l(e){return"function"==typeof e}function o(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(e,t){e.appendChild(t)}function i(e,t,n){e.insertBefore(t,n||null)}function a(e){e.parentNode.removeChild(e)}function c(e){return document.createElement(e)}function u(e){return document.createTextNode(e)}function d(){return u(" ")}function f(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function p(e){return function(t){return t.preventDefault(),e.call(this,t)}}function h(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function m(e,t){e.value=null==t?"":t}let b;function v(e){b=e}function g(){const e=function(){if(!b)throw new Error("Function called outside component initialization");return b}();return(t,n)=>{const s=e.$$.callbacks[t];if(s){const l=function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(t,n);s.slice().forEach((t=>{t.call(e,l)}))}}}const w=[],$=[],y=[],_=[],x=Promise.resolve();let L=!1;function E(e){y.push(e)}let A=!1;const C=new Set;function M(){if(!A){A=!0;do{for(let e=0;e<w.length;e+=1){const t=w[e];v(t),k(t.$$)}for(v(null),w.length=0;$.length;)$.pop()();for(let e=0;e<y.length;e+=1){const t=y[e];C.has(t)||(C.add(t),t())}y.length=0}while(w.length);for(;_.length;)_.pop()();L=!1,A=!1,C.clear()}}function k(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const T=new Set;function H(e,t){e&&e.i&&(T.delete(e),e.i(t))}function N(e,n,o){const{fragment:r,on_mount:i,on_destroy:a,after_update:c}=e.$$;r&&r.m(n,o),E((()=>{const n=i.map(t).filter(l);a?a.push(...n):s(n),e.$$.on_mount=[]})),c.forEach(E)}function O(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function W(e,t){-1===e.$$.dirty[0]&&(w.push(e),L||(L=!0,x.then(M)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function I(t,l,o,r,i,c,u=[-1]){const d=b;v(t);const f=l.props||{},p=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:i,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:u,skip_bound:!1};let h=!1;if(p.ctx=o?o(t,f,((e,n,...s)=>{const l=s.length?s[0]:n;return p.ctx&&i(p.ctx[e],p.ctx[e]=l)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](l),h&&W(t,e)),n})):[],p.update(),h=!0,s(p.before_update),p.fragment=!!r&&r(p.ctx),l.target){if(l.hydrate){const e=function(e){return Array.from(e.childNodes)}(l.target);p.fragment&&p.fragment.l(e),e.forEach(a)}else p.fragment&&p.fragment.c();l.intro&&H(t.$$.fragment),N(t,l.target,l.anchor),M()}v(d)}class P{$destroy(){O(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}class S{get wallet(){return walletService}}function D(e){let t,n,l,o,u,b,v,g,w,$,y,_,x,L,E,A,C,M,k,T,H,N,O,W,I,P,S,D,R,j,q,B,G,F,z,U,Y,J,K,Q,V,X,Z,ee,te;return{c(){t=c("section"),n=c("h2"),n.textContent="Register",l=d(),o=c("form"),u=c("div"),b=c("label"),b.innerHTML='<span class="field-label svelte-1b5hwl4">Gamer Handle</span> \n                    <span class="field-hint svelte-1b5hwl4">Must contain 4+ characters.</span>',v=d(),g=c("input"),w=d(),$=c("div"),y=c("label"),y.innerHTML='<span class="field-label svelte-1b5hwl4">Password</span> \n                    <span class="field-hint svelte-1b5hwl4">Must contain 8+ characters with at\n                        least 1 number and 1 uppercase letter.</span>',_=d(),x=c("input"),L=d(),E=c("div"),A=c("label"),A.innerHTML='<span class="field-label svelte-1b5hwl4">Email</span> \n                    <span class="field-hint svelte-1b5hwl4"></span>',C=d(),M=c("input"),k=d(),T=c("div"),T.innerHTML='<button class="action svelte-1b5hwl4" type="submit">Register</button>',H=d(),N=c("p"),O=c("a"),O.textContent="Login",I=d(),P=c("section"),S=c("h2"),S.textContent="Login",D=d(),R=c("form"),j=c("div"),q=c("label"),q.innerHTML='<span class="field-label svelte-1b5hwl4">Gamer Handle</span> \n                    <span class="field-hint svelte-1b5hwl4">Must contain 4+ characters.</span>',B=d(),G=c("input"),F=d(),z=c("div"),U=c("label"),U.innerHTML='<span class="field-label svelte-1b5hwl4">Password</span> \n                    <span class="field-hint svelte-1b5hwl4">Must contain 8+ characters with at\n                        least 1 number and 1 uppercase letter.</span>',Y=d(),J=c("input"),K=d(),Q=c("div"),Q.innerHTML='<button class="action svelte-1b5hwl4" type="submit">Login</button>',V=d(),X=c("p"),Z=c("a"),Z.textContent="Register",h(b,"for","rhandle"),h(g,"id","rhandle"),h(g,"class","field-cntrl svelte-1b5hwl4"),h(g,"placeholder","enter your gamer handle"),h(u,"class","field svelte-1b5hwl4"),h(y,"for","rpassword"),h(x,"id","rpassword"),h(x,"class","field svelte-1b5hwl4"),h(x,"placeholder","enter your password"),h(x,"type","password"),h($,"class","field svelte-1b5hwl4"),h(A,"for","remail"),h(M,"id","remail"),h(M,"class","field svelte-1b5hwl4"),h(M,"placeholder","enter your email"),h(M,"type","email"),h(E,"class","field svelte-1b5hwl4"),h(T,"class","actions"),h(O,"href","/"),t.hidden=W=!e[1],h(q,"for","handle"),h(G,"id","handle"),h(G,"class","field-cntrl svelte-1b5hwl4"),h(G,"placeholder","enter your gamer handle"),h(j,"class","field svelte-1b5hwl4"),h(U,"for","password"),h(J,"id","password"),h(J,"class","field svelte-1b5hwl4"),h(J,"placeholder","enter your password"),h(J,"type","password"),h(z,"class","field svelte-1b5hwl4"),h(Q,"class","actions"),h(Z,"href","/"),P.hidden=e[1]},m(s,a){i(s,t,a),r(t,n),r(t,l),r(t,o),r(o,u),r(u,b),r(u,v),r(u,g),m(g,e[2]),r(o,w),r(o,$),r($,y),r($,_),r($,x),m(x,e[3]),r(o,L),r(o,E),r(E,A),r(E,C),r(E,M),m(M,e[4]),r(o,k),r(o,T),r(t,H),r(t,N),r(N,O),i(s,I,a),i(s,P,a),r(P,S),r(P,D),r(P,R),r(R,j),r(j,q),r(j,B),r(j,G),m(G,e[2]),r(R,F),r(R,z),r(z,U),r(z,Y),r(z,J),m(J,e[3]),r(R,K),r(R,Q),r(P,V),r(P,X),r(X,Z),ee||(te=[f(g,"input",e[8]),f(x,"input",e[9]),f(M,"input",e[10]),f(o,"submit",p(e[5])),f(O,"click",p(e[11])),f(G,"input",e[12]),f(J,"input",e[13]),f(R,"submit",p(e[6])),f(Z,"click",p(e[14]))],ee=!0)},p(e,n){4&n&&g.value!==e[2]&&m(g,e[2]),8&n&&x.value!==e[3]&&m(x,e[3]),16&n&&M.value!==e[4]&&m(M,e[4]),2&n&&W!==(W=!e[1])&&(t.hidden=W),4&n&&G.value!==e[2]&&m(G,e[2]),8&n&&J.value!==e[3]&&m(J,e[3]),2&n&&(P.hidden=e[1])},d(e){e&&a(t),e&&a(I),e&&a(P),ee=!1,s(te)}}}function R(t){let n,s,l,o,u;return{c(){n=c("section"),s=c("div"),l=c("button"),l.textContent="Logout",h(s,"class","actions")},m(e,a){i(e,n,a),r(n,s),r(s,l),o||(u=f(l,"click",t[7]),o=!0)},p:e,d(e){e&&a(n),o=!1,u()}}}function j(t){let n;function s(e,t){return e[0]?R:D}let l=s(t),o=l(t);return{c(){o.c(),n=u("")},m(e,t){o.m(e,t),i(e,n,t)},p(e,[t]){l===(l=s(e))&&o?o.p(e,t):(o.d(1),o=l(e),o&&(o.c(),o.m(n.parentNode,n)))},i:e,o:e,d(e){o.d(e),e&&a(n)}}}function q(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){return new(n||(n=Promise))((function(l,o){function r(e){try{a(s.next(e))}catch(e){o(e)}}function i(e){try{a(s.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?l(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,i)}a((s=s.apply(e,t||[])).next())}))};const l=new S,o=g();let r,i,a,{loggedIn:c}=t,u=!1;const d=()=>{o("statusChanged",{loggedIn:c})};return e.$$set=e=>{"loggedIn"in e&&n(0,c=e.loggedIn)},[c,u,r,i,a,()=>s(void 0,void 0,void 0,(function*(){console.log("register"),yield l.wallet.register(r,i,a),n(0,c=!0),d()})),()=>s(void 0,void 0,void 0,(function*(){console.log("login"),yield l.wallet.login(r,i),n(0,c=!0),d()})),()=>{console.log("logout"),l.wallet.logout(),n(0,c=!1),d()},function(){r=this.value,n(2,r)},function(){i=this.value,n(3,i)},function(){a=this.value,n(4,a)},()=>n(1,u=!1),function(){r=this.value,n(2,r)},function(){i=this.value,n(3,i)},()=>n(1,u=!0)]}class B extends P{constructor(e){super(),I(this,e,q,j,o,{loggedIn:0})}}function G(e){let t,n,s,l,o,f,p,m;return p=new B({props:{loggedIn:e[1]}}),p.$on("statusChanged:{changed}",e[2]),{c(){var r;t=c("main"),n=c("h1"),s=u("Hello "),l=u(e[0]),o=u("!"),f=d(),(r=p.$$.fragment)&&r.c(),h(n,"class","svelte-1ykrvfv"),h(t,"class","svelte-1ykrvfv")},m(e,a){i(e,t,a),r(t,n),r(n,s),r(n,l),r(n,o),r(t,f),N(p,t,null),m=!0},p(e,[t]){(!m||1&t)&&function(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}(l,e[0])},i(e){m||(H(p.$$.fragment,e),m=!0)},o(e){!function(e,t,n,s){if(e&&e.o){if(T.has(e))return;T.add(e),(void 0).c.push((()=>{T.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}}(p.$$.fragment,e),m=!1},d(e){e&&a(t),O(p)}}}function F(e,t,n){const s=document.referrer;setTimeout((()=>{window.parent.postMessage({name:"WALLET_READY",success:!0},s),window.parent.postMessage({name:"AGENT_LOADED",success:!0},s)}),1e3);let{name:l}=t;return e.$$set=e=>{"name"in e&&n(0,l=e.name)},[l,undefined,function(t){!function(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e(t)))}(e,t)}]}return new class extends P{constructor(e){super(),I(this,e,F,G,o,{name:0})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
