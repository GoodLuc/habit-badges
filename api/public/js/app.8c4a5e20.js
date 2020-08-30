(function(e){function t(t){for(var n,s,i=t[0],u=t[1],c=t[2],d=0,f=[];d<i.length;d++)s=i[d],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&f.push(r[s][0]),r[s]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);l&&l(t);while(f.length)f.shift()();return o.push.apply(o,c||[]),a()}function a(){for(var e,t=0;t<o.length;t++){for(var a=o[t],n=!0,s=1;s<a.length;s++){var u=a[s];0!==r[u]&&(n=!1)}n&&(o.splice(t--,1),e=i(i.s=a[0]))}return e}var n={},r={app:0},o=[];function s(e){return i.p+"js/"+({about:"about"}[e]||e)+"."+{about:"9fda824e"}[e]+".js"}function i(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.e=function(e){var t=[],a=r[e];if(0!==a)if(a)t.push(a[2]);else{var n=new Promise((function(t,n){a=r[e]=[t,n]}));t.push(a[2]=n);var o,u=document.createElement("script");u.charset="utf-8",u.timeout=120,i.nc&&u.setAttribute("nonce",i.nc),u.src=s(e);var c=new Error;o=function(t){u.onerror=u.onload=null,clearTimeout(d);var a=r[e];if(0!==a){if(a){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+n+": "+o+")",c.name="ChunkLoadError",c.type=n,c.request=o,a[1](c)}r[e]=void 0}};var d=setTimeout((function(){o({type:"timeout",target:u})}),12e4);u.onerror=u.onload=o,document.head.appendChild(u)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,a){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(a,n,function(t){return e[t]}.bind(null,n));return a},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],c=u.push.bind(u);u.push=t,u=u.slice();for(var d=0;d<u.length;d++)t(u[d]);var l=c;o.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"56d7":function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("2b0e"),r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[e.loggedIn?a("div",[a("div",{attrs:{id:"nav"}},[a("div",{staticClass:"container"},[e._m(0),a("router-link",{attrs:{to:"/"}},[e._v("Dashboard")]),e._v(" | "),a("router-link",{attrs:{to:"/today"}},[e._v("Today")]),e._v(" | "),a("router-link",{attrs:{to:"/habits"}},[e._v("Habits")])],1)]),a("router-view")],1):e._e()])},o=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("figure",{attrs:{id:"logo"}},[a("img",{attrs:{src:"/assets/badges/default/wings.svg",alt:"Habit Badges"}})])}],s={data:function(){return{loggedIn:!0}}},i=s,u=(a("5c0b"),a("2877")),c=Object(u["a"])(i,r,o,!1,null,null,null),d=c.exports,l=(a("d3b7"),a("8c4f")),f=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"container dash"},[a("div",{staticClass:"main"},[a("div",[a("h1",[e._v("Welcome "+e._s(e.user.name))]),a("p",[e._v("Today you earned "),a("strong",[e._v(e._s(e.today.points)+" improvement points.")]),e._v(" "),a("a",{attrs:{href:"#"},on:{click:function(t){return e.router.push("/history")}}},[e._v("See improvement history.")])])]),a("div",[a("div",{staticClass:"badge-add",on:{click:e.addBadge}},[e._m(0)])])]),a("hr"),a("Badges"),a("hr"),a("h2",[e._v("Last 7 days")]),a("div",{staticClass:"week"},e._l(e.week,(function(t){return a("div",{key:t},[a("h3",[e._v(e._s(t.name+" "+t.number))]),a("ul",e._l(t.badges,(function(t){return a("li",{key:t.id},["default"==t.figure.type?a("figure",{staticClass:"badge"},[a("img",{attrs:{src:"/assets/badges/default/"+t.figure.id+".svg",alt:t.name}}),a("figcaption",[e._v(e._s(t.name))])]):e._e()])})),0)])})),0)],1),e.badgeSelector?a("BadgeSelector",{on:{close:function(t){e.badgeSelector=!1}}}):e._e()],1)},g=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("figure",[a("img",{attrs:{src:"/assets/badges/default/add.svg",alt:"Add new"}})])}],p=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("h2",[e._v("Earned Badges for Today:")]),a("div",{staticClass:"badges"},e._l(e.today.badges,(function(t){return a("div",{key:t.id},["default"==t.figure.type?a("figure",{staticClass:"badge"},[a("img",{attrs:{src:"/assets/badges/default/"+t.figure.id+".svg",alt:t.name}}),a("figcaption",[e._v(e._s(t.name))])]):e._e()])})),0)])},v=[],b=a("2f62"),m={name:"Badges",data:function(){return{}},computed:Object(b["c"])(["today"]),props:{msg:String}},y=m,h=(a("eed9"),Object(u["a"])(y,p,v,!1,null,"3b6b9c94",null)),_=h.exports,w=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{class:["overlay",{show:e.status}],attrs:{id:"badgesSelector"}},[a("div",{staticClass:"container"},[a("h1",[e._v("What have you done to improve yourself today?")]),a("ul",e._l(e.badges,(function(t){return a("li",{key:t.id},["default"==t.figure.type?a("figure",{class:["badge",{added:e.today.badges.find((function(e){return t.name===e.name}))}],on:{click:function(a){return e.toggleBadge(t)}}},[a("img",{attrs:{src:"/assets/badges/default/"+t.figure.id+".svg",alt:t.name}}),a("figcaption",[e._v(e._s(t.name))])]):e._e()])})),0)]),a("figure",{staticClass:"close",on:{click:function(t){return e.$emit("close")}}},[a("img",{attrs:{src:"/assets/icons/close.svg",alt:"Close"}})])])},j=[],O=a("5530"),k={props:["status"],computed:Object(b["c"])(["badges","today"]),methods:Object(O["a"])({},Object(b["b"])(["toggleBadge"]))},S=k,B=(a("c2a6"),Object(u["a"])(S,w,j,!1,null,"87843c68",null)),C=B.exports,x={name:"Dashboard",data:function(){return{badgeSelector:!1,user:{name:"Lucas"}}},computed:Object(b["c"])(["today"]),methods:{addBadge:function(){this.badgeSelector=!0},closeBadgeSelector:function(){this.badgeSelector=!1}},components:{Badges:_,BadgeSelector:C}},E=x,P=(a("a320"),Object(u["a"])(E,f,g,!1,null,"cfa5f154",null)),T=P.exports;n["a"].use(l["a"]);var $=[{path:"/",name:"Dashboard",component:T},{path:"/about",name:"About",component:function(){return a.e("about").then(a.bind(null,"f820"))}}],H=new l["a"]({mode:"history",base:"/",routes:$}),M=H;a("4de4"),a("7db0"),a("b0c0");n["a"].use(b["a"]);var L=new b["a"].Store({state:{today:{points:13,badges:[{id:1,name:"Clean House",figure:{type:"default",id:"cleanHouse"}},{id:2,name:"Excercise",figure:{type:"default",id:"excercise"}}]},badges:[{id:1,name:"Clean House",figure:{type:"default",id:"cleanHouse"}},{id:2,name:"Excercise",figure:{type:"default",id:"excercise"}},{id:3,name:"Meditation",figure:{type:"default",id:"meditation"}}]},getters:{today:function(e){return e.today},badges:function(e){return e.badges}},mutations:{toggleBadge:function(e,t){e.today.badges.find((function(e){return e.name===t.name}))?e.today.badges=e.today.badges.filter((function(e){return e.name!==t.name})):e.today.badges.push(t)}},actions:{toggleBadge:function(e,t){var a=e.commit;a("toggleBadge",t)}},modules:{}});n["a"].config.productionTip=!1,new n["a"]({router:M,store:L,render:function(e){return e(d)}}).$mount("#app")},"5c0b":function(e,t,a){"use strict";var n=a("9c0c"),r=a.n(n);r.a},6520:function(e,t,a){},"8f19":function(e,t,a){},"9c0c":function(e,t,a){},a320:function(e,t,a){"use strict";var n=a("8f19"),r=a.n(n);r.a},c2a6:function(e,t,a){"use strict";var n=a("e175"),r=a.n(n);r.a},e175:function(e,t,a){},eed9:function(e,t,a){"use strict";var n=a("6520"),r=a.n(n);r.a}});
//# sourceMappingURL=app.8c4a5e20.js.map