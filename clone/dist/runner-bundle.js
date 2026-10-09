var Io=Object.defineProperty;var Po=(t)=>t;function Lo(t,e){this[t]=Po.bind(null,e)}var Do=(t,e)=>{for(var n in e)Io(t,n,{get:e[n],enumerable:!0,configurable:!0,set:Lo.bind(e,n)})};var Uo=((t)=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,n)=>(typeof require<"u"?require:e)[n]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var Qr=0,jr=1,ta=2;var ea=5;var Di=201;var na=204,Ms=205;var ia=1000,sa=1001;var ra=1023;var aa="";var Ss=35048;class xn{addEventListener(t,e){if(this._listeners===void 0)this._listeners={};let n=this._listeners;if(n[t]===void 0)n[t]=[];if(n[t].indexOf(e)===-1)n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let s=i.indexOf(e);if(s!==-1)i.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,t);t.target=null}}}var de=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Wi=Math.PI/180,xs=180/Math.PI;function si(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(de[t&255]+de[t>>8&255]+de[t>>16&255]+de[t>>24&255]+"-"+de[e&255]+de[e>>8&255]+"-"+de[e>>16&15|64]+de[e>>24&255]+"-"+de[n&63|128]+de[n>>8&255]+"-"+de[n>>16&255]+de[n>>24&255]+de[i&255]+de[i>>8&255]+de[i>>16&255]+de[i>>24&255]).toLowerCase()}function xe(t,e,n){return Math.max(e,Math.min(n,t))}function No(t,e){return(t%e+e)%e}function Xi(t,e,n){return(1-n)*t+n*e}function Jn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw Error("Invalid component type.")}}function _e(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw Error("Invalid component type.")}}class Vt{constructor(t=0,e=0){Vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,r=this.y-t.y;return this.x=s*n-r*i+t.x,this.y=s*i+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ct{constructor(t,e,n,i,s,r,o,a,l){if(Ct.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0)this.set(t,e,n,i,s,r,o,a,l)}set(t,e,n,i,s,r,o,a,l){let c=this.elements;return c[0]=t,c[1]=i,c[2]=o,c[3]=e,c[4]=s,c[5]=a,c[6]=n,c[7]=r,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,r=n[0],o=n[3],a=n[6],l=n[1],c=n[4],u=n[7],h=n[2],f=n[5],m=n[8],_=i[0],g=i[3],p=i[6],d=i[1],y=i[4],x=i[7],w=i[2],A=i[5],E=i[8];return s[0]=r*_+o*d+a*w,s[3]=r*g+o*y+a*A,s[6]=r*p+o*x+a*E,s[1]=l*_+c*d+u*w,s[4]=l*g+c*y+u*A,s[7]=l*p+c*x+u*E,s[2]=h*_+f*d+m*w,s[5]=h*g+f*y+m*A,s[8]=h*p+f*x+m*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],r=t[4],o=t[5],a=t[6],l=t[7],c=t[8];return e*r*c-e*o*l-n*s*c+n*o*a+i*s*l-i*r*a}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],r=t[4],o=t[5],a=t[6],l=t[7],c=t[8],u=c*r-o*l,h=o*a-c*s,f=l*s-r*a,m=e*u+n*h+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return t[0]=u*_,t[1]=(i*l-c*n)*_,t[2]=(o*n-i*r)*_,t[3]=h*_,t[4]=(c*e-i*a)*_,t[5]=(i*s-o*e)*_,t[6]=f*_,t[7]=(n*a-l*e)*_,t[8]=(r*e-n*s)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,r,o){let a=Math.cos(s),l=Math.sin(s);return this.set(n*a,n*l,-n*(a*r+l*o)+r+t,-i*l,i*a,-i*(-l*r+a*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(qi.makeScale(t,e)),this}rotate(t){return this.premultiply(qi.makeRotation(-t)),this}translate(t,e){return this.premultiply(qi.makeTranslation(t,e)),this}makeTranslation(t,e){if(t.isVector2)this.set(1,0,t.x,0,1,t.y,0,0,1);else this.set(1,0,t,0,1,e,0,0,1);return this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}var qi=new Ct;function oa(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ii(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Fo(){let t=ii("canvas");return t.style.display="block",t}var or={};function ti(t){if(t in or)return;or[t]=!0,console.warn(t)}function Oo(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}function Bo(t){let e=t.elements;e[2]=0.5*e[2]+0.5*e[3],e[6]=0.5*e[6]+0.5*e[7],e[10]=0.5*e[10]+0.5*e[11],e[14]=0.5*e[14]+0.5*e[15]}function zo(t){let e=t.elements;if(e[11]===-1)e[10]=-e[10]-1,e[14]=-e[14];else e[10]=-e[10],e[14]=-e[14]+1}var kt={enabled:!0,workingColorSpace:"srgb-linear",spaces:{},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;if(this.spaces[e].transfer==="srgb")t.r=Je(t.r),t.g=Je(t.g),t.b=Je(t.b);if(this.spaces[e].primaries!==this.spaces[n].primaries)t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ);if(this.spaces[n].transfer==="srgb")t.r=On(t.r),t.g=On(t.g),t.b=On(t.b);return t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){if(t==="")return"linear";return this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function Je(t){return t<0.04045?t*0.0773993808:Math.pow(t*0.9478672986+0.0521327014,2.4)}function On(t){return t<0.0031308?t*12.92:1.055*Math.pow(t,0.41666)-0.055}var lr=[0.64,0.33,0.3,0.6,0.15,0.06],cr=[0.2126,0.7152,0.0722],hr=[0.3127,0.329],ur=new Ct().set(0.4123908,0.3575843,0.1804808,0.212639,0.7151687,0.0721923,0.0193308,0.1191948,0.9505322),dr=new Ct().set(3.2409699,-1.5373832,-0.4986108,-0.9692436,1.8759675,0.0415551,0.0556301,-0.203977,1.0569715);kt.define({["srgb-linear"]:{primaries:lr,whitePoint:hr,transfer:"linear",toXYZ:ur,fromXYZ:dr,luminanceCoefficients:cr,workingColorSpaceConfig:{unpackColorSpace:"srgb"},outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}},["srgb"]:{primaries:lr,whitePoint:hr,transfer:"srgb",toXYZ:ur,fromXYZ:dr,luminanceCoefficients:cr,outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}}});var bn;class la{static getDataURL(t){if(/^data:/i.test(t.src))return t.src;if(typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{if(bn===void 0)bn=ii("canvas");bn.width=t.width,bn.height=t.height;let n=bn.getContext("2d");if(t instanceof ImageData)n.putImageData(t,0,0);else n.drawImage(t,0,0,t.width,t.height);e=bn}if(e.width>2048||e.height>2048)return console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",0.6);else return e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ii("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Je(s[r]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)if(e instanceof Uint8Array||e instanceof Uint8ClampedArray)e[n]=Math.floor(Je(e[n]/255)*255);else e[n]=Je(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}var ko=0;class bs{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ko++}),this.uuid=si(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){if(t===!0)this.version++}toJSON(t){let e=t===void 0||typeof t==="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,o=i.length;r<o;r++)if(i[r].isDataTexture)s.push(Yi(i[r].image));else s.push(Yi(i[r]))}else s=Yi(i);n.url=s}if(!e)t.images[this.uuid]=n;return n}}function Yi(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap)return la.getDataURL(t);else if(t.data)return{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name};else return console.warn("THREE.Texture: Unable to serialize Texture."),{}}var Ho=0;class pe extends xn{constructor(t=pe.DEFAULT_IMAGE,e=pe.DEFAULT_MAPPING,n=1001,i=1001,s=1006,r=1008,o=1023,a=1009,l=pe.DEFAULT_ANISOTROPY,c=""){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:Ho++}),this.uuid=si(),this.name="",this.source=new bs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=a,this.offset=new Vt(0,0),this.repeat=new Vt(1,1),this.center=new Vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t==="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(Object.keys(this.userData).length>0)n.userData=this.userData;if(!e)t.textures[this.uuid]=n;return n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==300)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case 1000:t.x=t.x-Math.floor(t.x);break;case 1001:t.x=t.x<0?0:1;break;case 1002:if(Math.abs(Math.floor(t.x)%2)===1)t.x=Math.ceil(t.x)-t.x;else t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case 1000:t.y=t.y-Math.floor(t.y);break;case 1001:t.y=t.y<0?0:1;break;case 1002:if(Math.abs(Math.floor(t.y)%2)===1)t.y=Math.ceil(t.y)-t.y;else t.y=t.y-Math.floor(t.y);break}if(this.flipY)t.y=1-t.y;return t}set needsUpdate(t){if(t===!0)this.version++,this.source.needsUpdate=!0}set needsPMREMUpdate(t){if(t===!0)this.pmremVersion++}}pe.DEFAULT_IMAGE=null;pe.DEFAULT_MAPPING=300;pe.DEFAULT_ANISOTROPY=1;class Gt{constructor(t=0,e=0,n=0,i=1){Gt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*e+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*e+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*e+r[7]*n+r[11]*i+r[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);if(e<0.0001)this.x=1,this.y=0,this.z=0;else this.x=t.x/e,this.y=t.y/e,this.z=t.z/e;return this}setAxisAngleFromRotationMatrix(t){let e,n,i,s,r=0.01,o=0.1,a=t.elements,l=a[0],c=a[4],u=a[8],h=a[1],f=a[5],m=a[9],_=a[2],g=a[6],p=a[10];if(Math.abs(c-h)<0.01&&Math.abs(u-_)<0.01&&Math.abs(m-g)<0.01){if(Math.abs(c+h)<0.1&&Math.abs(u+_)<0.1&&Math.abs(m+g)<0.1&&Math.abs(l+f+p-3)<0.1)return this.set(1,0,0,0),this;e=Math.PI;let y=(l+1)/2,x=(f+1)/2,w=(p+1)/2,A=(c+h)/4,E=(u+_)/4,T=(m+g)/4;if(y>x&&y>w)if(y<0.01)n=0,i=0.707106781,s=0.707106781;else n=Math.sqrt(y),i=A/n,s=E/n;else if(x>w)if(x<0.01)n=0.707106781,i=0,s=0.707106781;else i=Math.sqrt(x),n=A/i,s=T/i;else if(w<0.01)n=0.707106781,i=0.707106781,s=0;else s=Math.sqrt(w),n=E/s,i=T/s;return this.set(n,i,s,e),this}let d=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(h-c)*(h-c));if(Math.abs(d)<0.001)d=1;return this.x=(g-m)/d,this.y=(u-_)/d,this.z=(h-c)/d,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ca extends xn{constructor(t=1,e=1,n={}){super();this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Gt(0,0,t,e),this.scissorTest=!1,this.viewport=new Gt(0,0,t,e);let i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new pe(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let r=n.count;for(let o=0;o<r;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);if(this.texture.source=new bs(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null)this.depthTexture=t.depthTexture.clone();return this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ln extends ca{constructor(t=1,e=1,n={}){super(t,e,n);this.isWebGLRenderTarget=!0}}class Es extends pe{constructor(t=null,e=1,n=1,i=1){super(null);this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ha extends pe{constructor(t=null,e=1,n=1,i=1){super(null);this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $e{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,r,o){let a=n[i+0],l=n[i+1],c=n[i+2],u=n[i+3],h=s[r+0],f=s[r+1],m=s[r+2],_=s[r+3];if(o===0){t[e+0]=a,t[e+1]=l,t[e+2]=c,t[e+3]=u;return}if(o===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=_;return}if(u!==_||a!==h||l!==f||c!==m){let g=1-o,p=a*h+l*f+c*m+u*_,d=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let w=Math.sqrt(y),A=Math.atan2(w,p*d);g=Math.sin(g*A)/w,o=Math.sin(o*A)/w}let x=o*d;if(a=a*g+h*x,l=l*g+f*x,c=c*g+m*x,u=u*g+_*x,g===1-o){let w=1/Math.sqrt(a*a+l*l+c*c+u*u);a*=w,l*=w,c*=w,u*=w}}t[e]=a,t[e+1]=l,t[e+2]=c,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,r){let o=n[i],a=n[i+1],l=n[i+2],c=n[i+3],u=s[r],h=s[r+1],f=s[r+2],m=s[r+3];return t[e]=o*m+c*u+a*f-l*h,t[e+1]=a*m+c*h+l*u-o*f,t[e+2]=l*m+c*f+o*h-a*u,t[e+3]=c*m-o*u-a*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let{_x:n,_y:i,_z:s,_order:r}=t,o=Math.cos,a=Math.sin,l=o(n/2),c=o(i/2),u=o(s/2),h=a(n/2),f=a(i/2),m=a(s/2);switch(r){case"XYZ":this._x=h*c*u+l*f*m,this._y=l*f*u-h*c*m,this._z=l*c*m+h*f*u,this._w=l*c*u-h*f*m;break;case"YXZ":this._x=h*c*u+l*f*m,this._y=l*f*u-h*c*m,this._z=l*c*m-h*f*u,this._w=l*c*u+h*f*m;break;case"ZXY":this._x=h*c*u-l*f*m,this._y=l*f*u+h*c*m,this._z=l*c*m+h*f*u,this._w=l*c*u-h*f*m;break;case"ZYX":this._x=h*c*u-l*f*m,this._y=l*f*u+h*c*m,this._z=l*c*m-h*f*u,this._w=l*c*u+h*f*m;break;case"YZX":this._x=h*c*u+l*f*m,this._y=l*f*u+h*c*m,this._z=l*c*m-h*f*u,this._w=l*c*u-h*f*m;break;case"XZY":this._x=h*c*u-l*f*m,this._y=l*f*u-h*c*m,this._z=l*c*m+h*f*u,this._w=l*c*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}if(e===!0)this._onChangeCallback();return this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10],h=n+o+u;if(h>0){let f=0.5/Math.sqrt(h+1);this._w=0.25/f,this._x=(c-a)*f,this._y=(s-l)*f,this._z=(r-i)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(c-a)/f,this._x=0.25*f,this._y=(i+r)/f,this._z=(s+l)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(s-l)/f,this._x=(i+r)/f,this._y=0.25*f,this._z=(a+c)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(r-i)/f,this._x=(s+l)/f,this._y=(a+c)/f,this._z=0.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;if(n<Number.EPSILON)if(n=0,Math.abs(t.x)>Math.abs(t.z))this._x=-t.y,this._y=t.x,this._z=0,this._w=n;else this._x=0,this._y=-t.z,this._z=t.y,this._w=n;else this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n;return this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();if(t===0)this._x=0,this._y=0,this._z=0,this._w=1;else t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t;return this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let{_x:n,_y:i,_z:s,_w:r}=t,o=e._x,a=e._y,l=e._z,c=e._w;return this._x=n*c+r*o+i*l-s*a,this._y=i*c+r*a+s*o-n*l,this._z=s*c+r*l+n*a-i*o,this._w=r*c-n*o-i*a-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,s=this._z,r=this._w,o=r*t._w+n*t._x+i*t._y+s*t._z;if(o<0)this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o;else this.copy(t);if(o>=1)return this._w=r,this._x=n,this._y=i,this._z=s,this;let a=1-o*o;if(a<=Number.EPSILON){let f=1-e;return this._w=f*r+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}let l=Math.sqrt(a),c=Math.atan2(l,o),u=Math.sin((1-e)*c)/l,h=Math.sin(e*c)/l;return this._w=r*u+this._w*h,this._x=n*u+this._x*h,this._y=i*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){if(n===void 0)n=this.z;return this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(fr.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(fr.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=t.elements,r=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,s=t.x,r=t.y,o=t.z,a=t.w,l=2*(r*i-o*n),c=2*(o*e-s*i),u=2*(s*n-r*e);return this.x=e+a*l+r*u-o*c,this.y=n+a*c+o*l-s*u,this.z=i+a*u+s*c-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let{x:n,y:i,z:s}=t,r=e.x,o=e.y,a=e.z;return this.x=i*a-s*o,this.y=s*r-n*a,this.z=n*o-i*r,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Zi.copy(this).projectOnVector(t),this.sub(Zi)}reflect(t){return this.sub(Zi.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}var Zi=new O,fr=new $e;class zn{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ie.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ie.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Ie.copy(e).multiplyScalar(0.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(0.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=s.count;r<o;r++){if(t.isMesh===!0)t.getVertexPosition(r,Ie);else Ie.fromBufferAttribute(s,r);Ie.applyMatrix4(t.matrixWorld),this.expandByPoint(Ie)}else{if(t.boundingBox!==void 0){if(t.boundingBox===null)t.computeBoundingBox();ui.copy(t.boundingBox)}else{if(n.boundingBox===null)n.computeBoundingBox();ui.copy(n.boundingBox)}ui.applyMatrix4(t.matrixWorld),this.union(ui)}}let i=t.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ie),Ie.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;if(t.normal.x>0)e=t.normal.x*this.min.x,n=t.normal.x*this.max.x;else e=t.normal.x*this.max.x,n=t.normal.x*this.min.x;if(t.normal.y>0)e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y;else e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y;if(t.normal.z>0)e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z;else e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z;return e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter($n),di.subVectors(this.max,$n),En.subVectors(t.a,$n),wn.subVectors(t.b,$n),Tn.subVectors(t.c,$n),tn.subVectors(wn,En),en.subVectors(Tn,wn),hn.subVectors(En,Tn);let e=[0,-tn.z,tn.y,0,-en.z,en.y,0,-hn.z,hn.y,tn.z,0,-tn.x,en.z,0,-en.x,hn.z,0,-hn.x,-tn.y,tn.x,0,-en.y,en.x,0,-hn.y,hn.x,0];if(!Ji(e,En,wn,Tn,di))return!1;if(e=[1,0,0,0,1,0,0,0,1],!Ji(e,En,wn,Tn,di))return!1;return fi.crossVectors(tn,en),e=[fi.x,fi.y,fi.z],Ji(e,En,wn,Tn,di)}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ie).distanceTo(t)}getBoundingSphere(t){if(this.isEmpty())t.makeEmpty();else this.getCenter(t.center),t.radius=this.getSize(Ie).length()*0.5;return t}intersect(t){if(this.min.max(t.min),this.max.min(t.max),this.isEmpty())this.makeEmpty();return this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){if(this.isEmpty())return this;return Ve[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ve[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ve[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ve[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ve[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ve[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ve[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ve[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ve),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}var Ve=[new O,new O,new O,new O,new O,new O,new O,new O],Ie=new O,ui=new zn,En=new O,wn=new O,Tn=new O,tn=new O,en=new O,hn=new O,$n=new O,di=new O,fi=new O,un=new O;function Ji(t,e,n,i,s){for(let r=0,o=t.length-3;r<=o;r+=3){un.fromArray(t,r);let a=s.x*Math.abs(un.x)+s.y*Math.abs(un.y)+s.z*Math.abs(un.z),l=e.dot(un),c=n.dot(un),u=i.dot(un);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Go=new zn,Kn=new O,$i=new O;class Ui{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;if(e!==void 0)n.copy(e);else Go.setFromPoints(t).getCenter(n);let i=0;for(let s=0,r=t.length;s<r;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);if(e.copy(t),n>this.radius*this.radius)e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center);return e}getBoundingBox(t){if(this.isEmpty())return t.makeEmpty(),t;return t.set(this.center,this.center),t.expandByScalar(this.radius),t}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Kn.subVectors(t,this.center);let e=Kn.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*0.5;this.center.addScaledVector(Kn,i/n),this.radius+=i}return this}union(t){if(t.isEmpty())return this;if(this.isEmpty())return this.copy(t),this;if(this.center.equals(t.center)===!0)this.radius=Math.max(this.radius,t.radius);else $i.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Kn.copy(t.center).add($i)),this.expandByPoint(Kn.copy(t.center).sub($i));return this}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}var We=new O,Ki=new O,pi=new O,nn=new O,Qi=new O,mi=new O,ji=new O;class ua{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,We)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);if(n<0)return e.copy(this.origin);return e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=We.subVectors(t,this.origin).dot(this.direction);if(e<0)return this.origin.distanceToSquared(t);return We.copy(this.origin).addScaledVector(this.direction,e),We.distanceToSquared(t)}distanceSqToSegment(t,e,n,i){Ki.copy(t).add(e).multiplyScalar(0.5),pi.copy(e).sub(t).normalize(),nn.copy(this.origin).sub(Ki);let s=t.distanceTo(e)*0.5,r=-this.direction.dot(pi),o=nn.dot(this.direction),a=-nn.dot(pi),l=nn.lengthSq(),c=Math.abs(1-r*r),u,h,f,m;if(c>0)if(u=r*a-o,h=r*o-a,m=s*c,u>=0)if(h>=-m)if(h<=m){let _=1/c;u*=_,h*=_,f=u*(u+r*h+2*o)+h*(r*u+h+2*a)+l}else h=s,u=Math.max(0,-(r*h+o)),f=-u*u+h*(h+2*a)+l;else h=-s,u=Math.max(0,-(r*h+o)),f=-u*u+h*(h+2*a)+l;else if(h<=-m)u=Math.max(0,-(-r*s+o)),h=u>0?-s:Math.min(Math.max(-s,-a),s),f=-u*u+h*(h+2*a)+l;else if(h<=m)u=0,h=Math.min(Math.max(-s,-a),s),f=h*(h+2*a)+l;else u=Math.max(0,-(r*s+o)),h=u>0?s:Math.min(Math.max(-s,-a),s),f=-u*u+h*(h+2*a)+l;else h=r>0?-s:s,u=Math.max(0,-(r*h+o)),f=-u*u+h*(h+2*a)+l;if(n)n.copy(this.origin).addScaledVector(this.direction,u);if(i)i.copy(Ki).addScaledVector(pi,h);return f}intersectSphere(t,e){We.subVectors(t.center,this.origin);let n=We.dot(this.direction),i=We.dot(We)-n*n,s=t.radius*t.radius;if(i>s)return null;let r=Math.sqrt(s-i),o=n-r,a=n+r;if(a<0)return null;if(o<0)return this.at(a,e);return this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0){if(t.distanceToPoint(this.origin)===0)return 0;return null}let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);if(n===null)return null;return this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);if(e===0)return!0;if(t.normal.dot(this.direction)*e<0)return!0;return!1}intersectBox(t,e){let n,i,s,r,o,a,l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,h=this.origin;if(l>=0)n=(t.min.x-h.x)*l,i=(t.max.x-h.x)*l;else n=(t.max.x-h.x)*l,i=(t.min.x-h.x)*l;if(c>=0)s=(t.min.y-h.y)*c,r=(t.max.y-h.y)*c;else s=(t.max.y-h.y)*c,r=(t.min.y-h.y)*c;if(n>r||s>i)return null;if(s>n||isNaN(n))n=s;if(r<i||isNaN(i))i=r;if(u>=0)o=(t.min.z-h.z)*u,a=(t.max.z-h.z)*u;else o=(t.max.z-h.z)*u,a=(t.min.z-h.z)*u;if(n>a||o>i)return null;if(o>n||n!==n)n=o;if(a<i||i!==i)i=a;if(i<0)return null;return this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,We)!==null}intersectTriangle(t,e,n,i,s){Qi.subVectors(e,t),mi.subVectors(n,t),ji.crossVectors(Qi,mi);let r=this.direction.dot(ji),o;if(r>0){if(i)return null;o=1}else if(r<0)o=-1,r=-r;else return null;nn.subVectors(this.origin,t);let a=o*this.direction.dot(mi.crossVectors(nn,mi));if(a<0)return null;let l=o*this.direction.dot(Qi.cross(nn));if(l<0)return null;if(a+l>r)return null;let c=-o*nn.dot(ji);if(c<0)return null;return this.at(c/r,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ee{constructor(t,e,n,i,s,r,o,a,l,c,u,h,f,m,_,g){if(ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0)this.set(t,e,n,i,s,r,o,a,l,c,u,h,f,m,_,g)}set(t,e,n,i,s,r,o,a,l,c,u,h,f,m,_,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=s,p[5]=r,p[9]=o,p[13]=a,p[2]=l,p[6]=c,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ee().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/An.setFromMatrixColumn(t,0).length(),s=1/An.setFromMatrixColumn(t,1).length(),r=1/An.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,s=t.z,r=Math.cos(n),o=Math.sin(n),a=Math.cos(i),l=Math.sin(i),c=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){let h=r*c,f=r*u,m=o*c,_=o*u;e[0]=a*c,e[4]=-a*u,e[8]=l,e[1]=f+m*l,e[5]=h-_*l,e[9]=-o*a,e[2]=_-h*l,e[6]=m+f*l,e[10]=r*a}else if(t.order==="YXZ"){let h=a*c,f=a*u,m=l*c,_=l*u;e[0]=h+_*o,e[4]=m*o-f,e[8]=r*l,e[1]=r*u,e[5]=r*c,e[9]=-o,e[2]=f*o-m,e[6]=_+h*o,e[10]=r*a}else if(t.order==="ZXY"){let h=a*c,f=a*u,m=l*c,_=l*u;e[0]=h-_*o,e[4]=-r*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=r*c,e[9]=_-h*o,e[2]=-r*l,e[6]=o,e[10]=r*a}else if(t.order==="ZYX"){let h=r*c,f=r*u,m=o*c,_=o*u;e[0]=a*c,e[4]=m*l-f,e[8]=h*l+_,e[1]=a*u,e[5]=_*l+h,e[9]=f*l-m,e[2]=-l,e[6]=o*a,e[10]=r*a}else if(t.order==="YZX"){let h=r*a,f=r*l,m=o*a,_=o*l;e[0]=a*c,e[4]=_-h*u,e[8]=m*u+f,e[1]=u,e[5]=r*c,e[9]=-o*c,e[2]=-l*c,e[6]=f*u+m,e[10]=h-_*u}else if(t.order==="XZY"){let h=r*a,f=r*l,m=o*a,_=o*l;e[0]=a*c,e[4]=-u,e[8]=l*c,e[1]=h*u+_,e[5]=r*c,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*c,e[10]=_*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vo,t,Wo)}lookAt(t,e,n){let i=this.elements;if(ye.subVectors(t,e),ye.lengthSq()===0)ye.z=1;if(ye.normalize(),sn.crossVectors(n,ye),sn.lengthSq()===0){if(Math.abs(n.z)===1)ye.x+=0.0001;else ye.z+=0.0001;ye.normalize(),sn.crossVectors(n,ye)}return sn.normalize(),gi.crossVectors(ye,sn),i[0]=sn.x,i[4]=gi.x,i[8]=ye.x,i[1]=sn.y,i[5]=gi.y,i[9]=ye.y,i[2]=sn.z,i[6]=gi.z,i[10]=ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,r=n[0],o=n[4],a=n[8],l=n[12],c=n[1],u=n[5],h=n[9],f=n[13],m=n[2],_=n[6],g=n[10],p=n[14],d=n[3],y=n[7],x=n[11],w=n[15],A=i[0],E=i[4],T=i[8],U=i[12],S=i[1],b=i[5],C=i[9],N=i[13],V=i[2],k=i[6],X=i[10],H=i[14],K=i[3],G=i[7],it=i[11],st=i[15];return s[0]=r*A+o*S+a*V+l*K,s[4]=r*E+o*b+a*k+l*G,s[8]=r*T+o*C+a*X+l*it,s[12]=r*U+o*N+a*H+l*st,s[1]=c*A+u*S+h*V+f*K,s[5]=c*E+u*b+h*k+f*G,s[9]=c*T+u*C+h*X+f*it,s[13]=c*U+u*N+h*H+f*st,s[2]=m*A+_*S+g*V+p*K,s[6]=m*E+_*b+g*k+p*G,s[10]=m*T+_*C+g*X+p*it,s[14]=m*U+_*N+g*H+p*st,s[3]=d*A+y*S+x*V+w*K,s[7]=d*E+y*b+x*k+w*G,s[11]=d*T+y*C+x*X+w*it,s[15]=d*U+y*N+x*H+w*st,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],r=t[1],o=t[5],a=t[9],l=t[13],c=t[2],u=t[6],h=t[10],f=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*a*u-i*l*u-s*o*h+n*l*h+i*o*f-n*a*f)+_*(+e*a*f-e*l*h+s*r*h-i*r*f+i*l*c-s*a*c)+g*(+e*l*u-e*o*f-s*r*u+n*r*f+s*o*c-n*l*c)+p*(-i*o*c-e*a*u+e*o*h+i*r*u-n*r*h+n*a*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;if(t.isVector3)i[12]=t.x,i[13]=t.y,i[14]=t.z;else i[12]=t,i[13]=e,i[14]=n;return this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],r=t[4],o=t[5],a=t[6],l=t[7],c=t[8],u=t[9],h=t[10],f=t[11],m=t[12],_=t[13],g=t[14],p=t[15],d=u*g*l-_*h*l+_*a*f-o*g*f-u*a*p+o*h*p,y=m*h*l-c*g*l-m*a*f+r*g*f+c*a*p-r*h*p,x=c*_*l-m*u*l+m*o*f-r*_*f-c*o*p+r*u*p,w=m*u*a-c*_*a-m*o*h+r*_*h+c*o*g-r*u*g,A=e*d+n*y+i*x+s*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/A;return t[0]=d*E,t[1]=(_*h*s-u*g*s-_*i*f+n*g*f+u*i*p-n*h*p)*E,t[2]=(o*g*s-_*a*s+_*i*l-n*g*l-o*i*p+n*a*p)*E,t[3]=(u*a*s-o*h*s-u*i*l+n*h*l+o*i*f-n*a*f)*E,t[4]=y*E,t[5]=(c*g*s-m*h*s+m*i*f-e*g*f-c*i*p+e*h*p)*E,t[6]=(m*a*s-r*g*s-m*i*l+e*g*l+r*i*p-e*a*p)*E,t[7]=(r*h*s-c*a*s+c*i*l-e*h*l-r*i*f+e*a*f)*E,t[8]=x*E,t[9]=(m*u*s-c*_*s-m*n*f+e*_*f+c*n*p-e*u*p)*E,t[10]=(r*_*s-m*o*s+m*n*l-e*_*l-r*n*p+e*o*p)*E,t[11]=(c*o*s-r*u*s-c*n*l+e*u*l+r*n*f-e*o*f)*E,t[12]=w*E,t[13]=(c*_*i-m*u*i+m*n*h-e*_*h-c*n*g+e*u*g)*E,t[14]=(m*o*i-r*_*i-m*n*a+e*_*a+r*n*g-e*o*g)*E,t[15]=(r*u*i-c*o*i+c*n*a-e*u*a-r*n*h+e*o*h)*E,this}scale(t){let e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){if(t.isVector3)this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1);else this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1);return this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),s=1-n,r=t.x,o=t.y,a=t.z,l=s*r,c=s*o;return this.set(l*r+n,l*o-i*a,l*a+i*o,0,l*o+i*a,c*o+n,c*a-i*r,0,l*a-i*o,c*a+i*r,s*a*a+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,r){return this.set(1,n,s,0,t,1,r,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,s=e._x,r=e._y,o=e._z,a=e._w,l=s+s,c=r+r,u=o+o,h=s*l,f=s*c,m=s*u,_=r*c,g=r*u,p=o*u,d=a*l,y=a*c,x=a*u,w=n.x,A=n.y,E=n.z;return i[0]=(1-(_+p))*w,i[1]=(f+x)*w,i[2]=(m-y)*w,i[3]=0,i[4]=(f-x)*A,i[5]=(1-(h+p))*A,i[6]=(g+d)*A,i[7]=0,i[8]=(m+y)*E,i[9]=(g-d)*E,i[10]=(1-(h+_))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,s=An.set(i[0],i[1],i[2]).length(),r=An.set(i[4],i[5],i[6]).length(),o=An.set(i[8],i[9],i[10]).length();if(this.determinant()<0)s=-s;t.x=i[12],t.y=i[13],t.z=i[14],Pe.copy(this);let l=1/s,c=1/r,u=1/o;return Pe.elements[0]*=l,Pe.elements[1]*=l,Pe.elements[2]*=l,Pe.elements[4]*=c,Pe.elements[5]*=c,Pe.elements[6]*=c,Pe.elements[8]*=u,Pe.elements[9]*=u,Pe.elements[10]*=u,e.setFromRotationMatrix(Pe),n.x=s,n.y=r,n.z=o,this}makePerspective(t,e,n,i,s,r,o=2000){let a=this.elements,l=2*s/(e-t),c=2*s/(n-i),u=(e+t)/(e-t),h=(n+i)/(n-i),f,m;if(o===2000)f=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(o===2001)f=-r/(r-s),m=-r*s/(r-s);else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return a[0]=l,a[4]=0,a[8]=u,a[12]=0,a[1]=0,a[5]=c,a[9]=h,a[13]=0,a[2]=0,a[6]=0,a[10]=f,a[14]=m,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(t,e,n,i,s,r,o=2000){let a=this.elements,l=1/(e-t),c=1/(n-i),u=1/(r-s),h=(e+t)*l,f=(n+i)*c,m,_;if(o===2000)m=(r+s)*u,_=-2*u;else if(o===2001)m=s*u,_=-1*u;else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return a[0]=2*l,a[4]=0,a[8]=0,a[12]=-h,a[1]=0,a[5]=2*c,a[9]=0,a[13]=-f,a[2]=0,a[6]=0,a[10]=_,a[14]=-m,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}var An=new O,Pe=new ee,Vo=new O(0,0,0),Wo=new O(1,1,1),sn=new O,gi=new O,ye=new O,pr=new ee,mr=new $e;class Ue{constructor(t=0,e=0,n=0,i=Ue.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,s=i[0],r=i[4],o=i[8],a=i[1],l=i[5],c=i[9],u=i[2],h=i[6],f=i[10];switch(e){case"XYZ":if(this._y=Math.asin(xe(o,-1,1)),Math.abs(o)<0.9999999)this._x=Math.atan2(-c,f),this._z=Math.atan2(-r,s);else this._x=Math.atan2(h,l),this._z=0;break;case"YXZ":if(this._x=Math.asin(-xe(c,-1,1)),Math.abs(c)<0.9999999)this._y=Math.atan2(o,f),this._z=Math.atan2(a,l);else this._y=Math.atan2(-u,s),this._z=0;break;case"ZXY":if(this._x=Math.asin(xe(h,-1,1)),Math.abs(h)<0.9999999)this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,l);else this._y=0,this._z=Math.atan2(a,s);break;case"ZYX":if(this._y=Math.asin(-xe(u,-1,1)),Math.abs(u)<0.9999999)this._x=Math.atan2(h,f),this._z=Math.atan2(a,s);else this._x=0,this._z=Math.atan2(-r,l);break;case"YZX":if(this._z=Math.asin(xe(a,-1,1)),Math.abs(a)<0.9999999)this._x=Math.atan2(-c,l),this._y=Math.atan2(-u,s);else this._x=0,this._y=Math.atan2(o,f);break;case"XZY":if(this._z=Math.asin(-xe(r,-1,1)),Math.abs(r)<0.9999999)this._x=Math.atan2(h,l),this._y=Math.atan2(o,s);else this._x=Math.atan2(-c,f),this._y=0;break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}if(this._order=e,n===!0)this._onChangeCallback();return this}setFromQuaternion(t,e,n){return pr.makeRotationFromQuaternion(t),this.setFromRotationMatrix(pr,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return mr.setFromEuler(this),this.setFromQuaternion(mr,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){if(this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0)this._order=t[3];return this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ue.DEFAULT_ORDER="XYZ";class ws{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}var Xo=0,gr=new O,Rn=new $e,Xe=new ee,_i=new O,Qn=new O,qo=new O,Yo=new $e,_r=new O(1,0,0),xr=new O(0,1,0),vr=new O(0,0,1),yr={type:"added"},Zo={type:"removed"},Cn={type:"childadded",child:null},ts={type:"childremoved",child:null};class be extends xn{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xo++}),this.uuid=si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();let t=new O,e=new Ue,n=new $e,i=new O(1,1,1);function s(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ee},normalMatrix:{value:new Ct}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ws,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){if(this.matrixAutoUpdate)this.updateMatrix();this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Rn.setFromAxisAngle(t,e),this.quaternion.multiply(Rn),this}rotateOnWorldAxis(t,e){return Rn.setFromAxisAngle(t,e),this.quaternion.premultiply(Rn),this}rotateX(t){return this.rotateOnAxis(_r,t)}rotateY(t){return this.rotateOnAxis(xr,t)}rotateZ(t){return this.rotateOnAxis(vr,t)}translateOnAxis(t,e){return gr.copy(t).applyQuaternion(this.quaternion),this.position.add(gr.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(_r,t)}translateY(t){return this.translateOnAxis(xr,t)}translateZ(t){return this.translateOnAxis(vr,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xe.copy(this.matrixWorld).invert())}lookAt(t,e,n){if(t.isVector3)_i.copy(t);else _i.set(t,e,n);let i=this.parent;if(this.updateWorldMatrix(!0,!1),Qn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight)Xe.lookAt(Qn,_i,this.up);else Xe.lookAt(_i,Qn,this.up);if(this.quaternion.setFromRotationMatrix(Xe),i)Xe.extractRotation(i.matrixWorld),Rn.setFromRotationMatrix(Xe),this.quaternion.premultiply(Rn.invert())}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}if(t===this)return console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this;if(t&&t.isObject3D)t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yr),Cn.child=t,this.dispatchEvent(Cn),Cn.child=null;else console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t);return this}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);if(e!==-1)t.parent=null,this.children.splice(e,1),t.dispatchEvent(Zo),ts.child=t,this.dispatchEvent(ts),ts.child=null;return this}removeFromParent(){let t=this.parent;if(t!==null)t.remove(this);return this}clear(){return this.remove(...this.children)}attach(t){if(this.updateWorldMatrix(!0,!1),Xe.copy(this.matrixWorld).invert(),t.parent!==null)t.parent.updateWorldMatrix(!0,!1),Xe.multiply(t.parent.matrixWorld);return t.applyMatrix4(Xe),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yr),Cn.child=t,this.dispatchEvent(Cn),Cn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}return}getObjectsByProperty(t,e,n=[]){if(this[t]===e)n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qn,t,qo),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qn,Yo,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;if(e!==null)t(e),e.traverseAncestors(t)}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||t){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,t=!0}let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null)n.updateWorldMatrix(!0,!1);if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);if(e===!0){let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t==="string",n={};if(e)t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"};let i={};if(i.uuid=this.uuid,i.type=this.type,this.name!=="")i.name=this.name;if(this.castShadow===!0)i.castShadow=!0;if(this.receiveShadow===!0)i.receiveShadow=!0;if(this.visible===!1)i.visible=!1;if(this.frustumCulled===!1)i.frustumCulled=!1;if(this.renderOrder!==0)i.renderOrder=this.renderOrder;if(Object.keys(this.userData).length>0)i.userData=this.userData;if(i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1)i.matrixAutoUpdate=!1;if(this.isInstancedMesh){if(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null)i.instanceColor=this.instanceColor.toJSON()}if(this.isBatchedMesh){if(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map((o)=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null)i.colorsTexture=this._colorsTexture.toJSON(t);if(this.boundingSphere!==null)i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius};if(this.boundingBox!==null)i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}}function s(o,a){if(o[a.uuid]===void 0)o[a.uuid]=a.toJSON(t);return a.uuid}if(this.isScene){if(this.background){if(this.background.isColor)i.background=this.background.toJSON();else if(this.background.isTexture)i.background=this.background.toJSON(t).uuid}if(this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0)i.environment=this.environment.toJSON(t).uuid}else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let a=o.shapes;if(Array.isArray(a))for(let l=0,c=a.length;l<c;l++){let u=a[l];s(t.shapes,u)}else s(t.shapes,a)}}if(this.isSkinnedMesh){if(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0)s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid}if(this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let a=0,l=this.material.length;a<l;a++)o.push(s(t.materials,this.material[a]));i.material=o}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let a=this.animations[o];i.animations.push(s(t.animations,a))}}if(e){let o=r(t.geometries),a=r(t.materials),l=r(t.textures),c=r(t.images),u=r(t.shapes),h=r(t.skeletons),f=r(t.animations),m=r(t.nodes);if(o.length>0)n.geometries=o;if(a.length>0)n.materials=a;if(l.length>0)n.textures=l;if(c.length>0)n.images=c;if(u.length>0)n.shapes=u;if(h.length>0)n.skeletons=h;if(f.length>0)n.animations=f;if(m.length>0)n.nodes=m}return n.object=i,n;function r(o){let a=[];for(let l in o){let c=o[l];delete c.metadata,a.push(c)}return a}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}}be.DEFAULT_UP=new O(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Le=new O,qe=new O,es=new O,Ye=new O,In=new O,Pn=new O,Mr=new O,ns=new O,is=new O,ss=new O,rs=new Gt,as=new Gt,os=new Gt;class De{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Le.subVectors(t,e),i.cross(Le);let s=i.lengthSq();if(s>0)return i.multiplyScalar(1/Math.sqrt(s));return i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Le.subVectors(i,e),qe.subVectors(n,e),es.subVectors(t,e);let r=Le.dot(Le),o=Le.dot(qe),a=Le.dot(es),l=qe.dot(qe),c=qe.dot(es),u=r*l-o*o;if(u===0)return s.set(0,0,0),null;let h=1/u,f=(l*a-o*c)*h,m=(r*c-o*a)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,n,i){if(this.getBarycoord(t,e,n,i,Ye)===null)return!1;return Ye.x>=0&&Ye.y>=0&&Ye.x+Ye.y<=1}static getInterpolation(t,e,n,i,s,r,o,a){if(this.getBarycoord(t,e,n,i,Ye)===null){if(a.x=0,a.y=0,"z"in a)a.z=0;if("w"in a)a.w=0;return null}return a.setScalar(0),a.addScaledVector(s,Ye.x),a.addScaledVector(r,Ye.y),a.addScaledVector(o,Ye.z),a}static getInterpolatedAttribute(t,e,n,i,s,r){return rs.setScalar(0),as.setScalar(0),os.setScalar(0),rs.fromBufferAttribute(t,e),as.fromBufferAttribute(t,n),os.fromBufferAttribute(t,i),r.setScalar(0),r.addScaledVector(rs,s.x),r.addScaledVector(as,s.y),r.addScaledVector(os,s.z),r}static isFrontFacing(t,e,n,i){return Le.subVectors(n,e),qe.subVectors(t,e),Le.cross(qe).dot(i)<0?!0:!1}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Le.subVectors(this.c,this.b),qe.subVectors(this.a,this.b),Le.cross(qe).length()*0.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(0.3333333333333333)}getNormal(t){return De.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return De.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return De.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return De.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return De.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,s=this.c,r,o;In.subVectors(i,n),Pn.subVectors(s,n),ns.subVectors(t,n);let a=In.dot(ns),l=Pn.dot(ns);if(a<=0&&l<=0)return e.copy(n);is.subVectors(t,i);let c=In.dot(is),u=Pn.dot(is);if(c>=0&&u<=c)return e.copy(i);let h=a*u-c*l;if(h<=0&&a>=0&&c<=0)return r=a/(a-c),e.copy(n).addScaledVector(In,r);ss.subVectors(t,s);let f=In.dot(ss),m=Pn.dot(ss);if(m>=0&&f<=m)return e.copy(s);let _=f*l-a*m;if(_<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(Pn,o);let g=c*m-f*u;if(g<=0&&u-c>=0&&f-m>=0)return Mr.subVectors(s,i),o=(u-c)/(u-c+(f-m)),e.copy(i).addScaledVector(Mr,o);let p=1/(g+_+h);return r=_*p,o=h*p,e.copy(n).addScaledVector(In,r).addScaledVector(Pn,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}var da={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rn={h:0,s:0,l:0},xi={h:0,s:0,l:0};function ls(t,e,n){if(n<0)n+=1;if(n>1)n-=1;if(n<0.16666666666666666)return t+(e-t)*6*n;if(n<0.5)return e;if(n<0.6666666666666666)return t+(e-t)*6*(0.6666666666666666-n);return t}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;if(i&&i.isColor)this.copy(i);else if(typeof i==="number")this.setHex(i);else if(typeof i==="string")this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e="srgb"){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,kt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=kt.workingColorSpace){if(t=No(t,1),e=xe(e,0,1),n=xe(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=0.5?n*(1+e):n+e-n*e,r=2*n-s;this.r=ls(r,s,t+0.3333333333333333),this.g=ls(r,s,t),this.b=ls(r,s,t-0.3333333333333333)}return kt.toWorkingColorSpace(this,i),this}setStyle(t,e="srgb"){function n(s){if(s===void 0)return;if(parseFloat(s)<1)console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,r=i[1],o=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);else if(r===6)return this.setHex(parseInt(s,16),e);else console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e="srgb"){let n=da[t.toLowerCase()];if(n!==void 0)this.setHex(n,e);else console.warn("THREE.Color: Unknown color "+t);return this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Je(t.r),this.g=Je(t.g),this.b=Je(t.b),this}copyLinearToSRGB(t){return this.r=On(t.r),this.g=On(t.g),this.b=On(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t="srgb"){return kt.fromWorkingColorSpace(fe.copy(this),t),Math.round(xe(fe.r*255,0,255))*65536+Math.round(xe(fe.g*255,0,255))*256+Math.round(xe(fe.b*255,0,255))}getHexString(t="srgb"){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=kt.workingColorSpace){kt.fromWorkingColorSpace(fe.copy(this),e);let{r:n,g:i,b:s}=fe,r=Math.max(n,i,s),o=Math.min(n,i,s),a,l,c=(o+r)/2;if(o===r)a=0,l=0;else{let u=r-o;switch(l=c<=0.5?u/(r+o):u/(2-r-o),r){case n:a=(i-s)/u+(i<s?6:0);break;case i:a=(s-n)/u+2;break;case s:a=(n-i)/u+4;break}a/=6}return t.h=a,t.s=l,t.l=c,t}getRGB(t,e=kt.workingColorSpace){return kt.fromWorkingColorSpace(fe.copy(this),e),t.r=fe.r,t.g=fe.g,t.b=fe.b,t}getStyle(t="srgb"){kt.fromWorkingColorSpace(fe.copy(this),t);let{r:e,g:n,b:i}=fe;if(t!=="srgb")return`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`;return`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(rn),this.setHSL(rn.h+t,rn.s+e,rn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(rn),t.getHSL(xi);let n=Xi(rn.h,xi.h,e),i=Xi(rn.s,xi.s,e),s=Xi(rn.l,xi.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}var fe=new Yt;Yt.NAMES=da;var Jo=0;class ri extends xn{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jo++}),this.uuid=si(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){if(this._alphaTest>0!==t>0)this.version++;this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t===void 0)return;for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}if(i&&i.isColor)i.set(n);else if(i&&i.isVector3&&(n&&n.isVector3))i.copy(n);else this[e]=n}}toJSON(t){let e=t===void 0||typeof t==="string";if(e)t={textures:{},images:{}};let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};if(n.uuid=this.uuid,n.type=this.type,this.name!=="")n.name=this.name;if(this.color&&this.color.isColor)n.color=this.color.getHex();if(this.roughness!==void 0)n.roughness=this.roughness;if(this.metalness!==void 0)n.metalness=this.metalness;if(this.sheen!==void 0)n.sheen=this.sheen;if(this.sheenColor&&this.sheenColor.isColor)n.sheenColor=this.sheenColor.getHex();if(this.sheenRoughness!==void 0)n.sheenRoughness=this.sheenRoughness;if(this.emissive&&this.emissive.isColor)n.emissive=this.emissive.getHex();if(this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1)n.emissiveIntensity=this.emissiveIntensity;if(this.specular&&this.specular.isColor)n.specular=this.specular.getHex();if(this.specularIntensity!==void 0)n.specularIntensity=this.specularIntensity;if(this.specularColor&&this.specularColor.isColor)n.specularColor=this.specularColor.getHex();if(this.shininess!==void 0)n.shininess=this.shininess;if(this.clearcoat!==void 0)n.clearcoat=this.clearcoat;if(this.clearcoatRoughness!==void 0)n.clearcoatRoughness=this.clearcoatRoughness;if(this.clearcoatMap&&this.clearcoatMap.isTexture)n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid;if(this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture)n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid;if(this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture)n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray();if(this.dispersion!==void 0)n.dispersion=this.dispersion;if(this.iridescence!==void 0)n.iridescence=this.iridescence;if(this.iridescenceIOR!==void 0)n.iridescenceIOR=this.iridescenceIOR;if(this.iridescenceThicknessRange!==void 0)n.iridescenceThicknessRange=this.iridescenceThicknessRange;if(this.iridescenceMap&&this.iridescenceMap.isTexture)n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid;if(this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture)n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid;if(this.anisotropy!==void 0)n.anisotropy=this.anisotropy;if(this.anisotropyRotation!==void 0)n.anisotropyRotation=this.anisotropyRotation;if(this.anisotropyMap&&this.anisotropyMap.isTexture)n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid;if(this.map&&this.map.isTexture)n.map=this.map.toJSON(t).uuid;if(this.matcap&&this.matcap.isTexture)n.matcap=this.matcap.toJSON(t).uuid;if(this.alphaMap&&this.alphaMap.isTexture)n.alphaMap=this.alphaMap.toJSON(t).uuid;if(this.lightMap&&this.lightMap.isTexture)n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity;if(this.aoMap&&this.aoMap.isTexture)n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity;if(this.bumpMap&&this.bumpMap.isTexture)n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale;if(this.normalMap&&this.normalMap.isTexture)n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray();if(this.displacementMap&&this.displacementMap.isTexture)n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias;if(this.roughnessMap&&this.roughnessMap.isTexture)n.roughnessMap=this.roughnessMap.toJSON(t).uuid;if(this.metalnessMap&&this.metalnessMap.isTexture)n.metalnessMap=this.metalnessMap.toJSON(t).uuid;if(this.emissiveMap&&this.emissiveMap.isTexture)n.emissiveMap=this.emissiveMap.toJSON(t).uuid;if(this.specularMap&&this.specularMap.isTexture)n.specularMap=this.specularMap.toJSON(t).uuid;if(this.specularIntensityMap&&this.specularIntensityMap.isTexture)n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid;if(this.specularColorMap&&this.specularColorMap.isTexture)n.specularColorMap=this.specularColorMap.toJSON(t).uuid;if(this.envMap&&this.envMap.isTexture){if(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0)n.combine=this.combine}if(this.envMapRotation!==void 0)n.envMapRotation=this.envMapRotation.toArray();if(this.envMapIntensity!==void 0)n.envMapIntensity=this.envMapIntensity;if(this.reflectivity!==void 0)n.reflectivity=this.reflectivity;if(this.refractionRatio!==void 0)n.refractionRatio=this.refractionRatio;if(this.gradientMap&&this.gradientMap.isTexture)n.gradientMap=this.gradientMap.toJSON(t).uuid;if(this.transmission!==void 0)n.transmission=this.transmission;if(this.transmissionMap&&this.transmissionMap.isTexture)n.transmissionMap=this.transmissionMap.toJSON(t).uuid;if(this.thickness!==void 0)n.thickness=this.thickness;if(this.thicknessMap&&this.thicknessMap.isTexture)n.thicknessMap=this.thicknessMap.toJSON(t).uuid;if(this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0)n.attenuationDistance=this.attenuationDistance;if(this.attenuationColor!==void 0)n.attenuationColor=this.attenuationColor.getHex();if(this.size!==void 0)n.size=this.size;if(this.shadowSide!==null)n.shadowSide=this.shadowSide;if(this.sizeAttenuation!==void 0)n.sizeAttenuation=this.sizeAttenuation;if(this.blending!==1)n.blending=this.blending;if(this.side!==0)n.side=this.side;if(this.vertexColors===!0)n.vertexColors=!0;if(this.opacity<1)n.opacity=this.opacity;if(this.transparent===!0)n.transparent=!0;if(this.blendSrc!==204)n.blendSrc=this.blendSrc;if(this.blendDst!==205)n.blendDst=this.blendDst;if(this.blendEquation!==100)n.blendEquation=this.blendEquation;if(this.blendSrcAlpha!==null)n.blendSrcAlpha=this.blendSrcAlpha;if(this.blendDstAlpha!==null)n.blendDstAlpha=this.blendDstAlpha;if(this.blendEquationAlpha!==null)n.blendEquationAlpha=this.blendEquationAlpha;if(this.blendColor&&this.blendColor.isColor)n.blendColor=this.blendColor.getHex();if(this.blendAlpha!==0)n.blendAlpha=this.blendAlpha;if(this.depthFunc!==3)n.depthFunc=this.depthFunc;if(this.depthTest===!1)n.depthTest=this.depthTest;if(this.depthWrite===!1)n.depthWrite=this.depthWrite;if(this.colorWrite===!1)n.colorWrite=this.colorWrite;if(this.stencilWriteMask!==255)n.stencilWriteMask=this.stencilWriteMask;if(this.stencilFunc!==519)n.stencilFunc=this.stencilFunc;if(this.stencilRef!==0)n.stencilRef=this.stencilRef;if(this.stencilFuncMask!==255)n.stencilFuncMask=this.stencilFuncMask;if(this.stencilFail!==7680)n.stencilFail=this.stencilFail;if(this.stencilZFail!==7680)n.stencilZFail=this.stencilZFail;if(this.stencilZPass!==7680)n.stencilZPass=this.stencilZPass;if(this.stencilWrite===!0)n.stencilWrite=this.stencilWrite;if(this.rotation!==void 0&&this.rotation!==0)n.rotation=this.rotation;if(this.polygonOffset===!0)n.polygonOffset=!0;if(this.polygonOffsetFactor!==0)n.polygonOffsetFactor=this.polygonOffsetFactor;if(this.polygonOffsetUnits!==0)n.polygonOffsetUnits=this.polygonOffsetUnits;if(this.linewidth!==void 0&&this.linewidth!==1)n.linewidth=this.linewidth;if(this.dashSize!==void 0)n.dashSize=this.dashSize;if(this.gapSize!==void 0)n.gapSize=this.gapSize;if(this.scale!==void 0)n.scale=this.scale;if(this.dithering===!0)n.dithering=!0;if(this.alphaTest>0)n.alphaTest=this.alphaTest;if(this.alphaHash===!0)n.alphaHash=!0;if(this.alphaToCoverage===!0)n.alphaToCoverage=!0;if(this.premultipliedAlpha===!0)n.premultipliedAlpha=!0;if(this.forceSinglePass===!0)n.forceSinglePass=!0;if(this.wireframe===!0)n.wireframe=!0;if(this.wireframeLinewidth>1)n.wireframeLinewidth=this.wireframeLinewidth;if(this.wireframeLinecap!=="round")n.wireframeLinecap=this.wireframeLinecap;if(this.wireframeLinejoin!=="round")n.wireframeLinejoin=this.wireframeLinejoin;if(this.flatShading===!0)n.flatShading=!0;if(this.visible===!1)n.visible=!1;if(this.toneMapped===!1)n.toneMapped=!1;if(this.fog===!1)n.fog=!1;if(Object.keys(this.userData).length>0)n.userData=this.userData;function i(s){let r=[];for(let o in s){let a=s[o];delete a.metadata,r.push(a)}return r}if(e){let s=i(t.textures),r=i(t.images);if(s.length>0)n.textures=s;if(r.length>0)n.images=r}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){if(t===!0)this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ts extends ri{static get type(){return"MeshBasicMaterial"}constructor(t){super();this.isMeshBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ue,this.combine=0,this.reflectivity=1,this.refractionRatio=0.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}var re=new O,vi=new Vt;class Ae{constructor(t,e,n=!1){if(Array.isArray(t))throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(t){if(t===!0)this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)vi.fromBufferAttribute(this,e),vi.applyMatrix3(t),this.setXY(e,vi.x,vi.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)re.fromBufferAttribute(this,e),re.applyMatrix3(t),this.setXYZ(e,re.x,re.y,re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)re.fromBufferAttribute(this,e),re.applyMatrix4(t),this.setXYZ(e,re.x,re.y,re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)re.fromBufferAttribute(this,e),re.applyNormalMatrix(t),this.setXYZ(e,re.x,re.y,re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)re.fromBufferAttribute(this,e),re.transformDirection(t),this.setXYZ(e,re.x,re.y,re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];if(this.normalized)n=Jn(n,this.array);return n}setComponent(t,e,n){if(this.normalized)n=_e(n,this.array);return this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];if(this.normalized)e=Jn(e,this.array);return e}setX(t,e){if(this.normalized)e=_e(e,this.array);return this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];if(this.normalized)e=Jn(e,this.array);return e}setY(t,e){if(this.normalized)e=_e(e,this.array);return this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];if(this.normalized)e=Jn(e,this.array);return e}setZ(t,e){if(this.normalized)e=_e(e,this.array);return this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];if(this.normalized)e=Jn(e,this.array);return e}setW(t,e){if(this.normalized)e=_e(e,this.array);return this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){if(t*=this.itemSize,this.normalized)e=_e(e,this.array),n=_e(n,this.array);return this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){if(t*=this.itemSize,this.normalized)e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array);return this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){if(t*=this.itemSize,this.normalized)e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array),s=_e(s,this.array);return this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};if(this.name!=="")t.name=this.name;if(this.usage!==35044)t.usage=this.usage;return t}}class As extends Ae{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Rs extends Ae{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Re extends Ae{constructor(t,e,n){super(new Float32Array(t),e,n)}}var $o=0,we=new ee,cs=new be,Ln=new O,Me=new zn,jn=new zn,le=new O;class ze extends xn{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$o++}),this.uuid=si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){if(Array.isArray(t))this.index=new((oa(t))?Rs:As)(t,1);else this.index=t;return this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;if(e!==void 0)e.applyMatrix4(t),e.needsUpdate=!0;let n=this.attributes.normal;if(n!==void 0){let s=new Ct().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;if(i!==void 0)i.transformDirection(t),i.needsUpdate=!0;if(this.boundingBox!==null)this.computeBoundingBox();if(this.boundingSphere!==null)this.computeBoundingSphere();return this}applyQuaternion(t){return we.makeRotationFromQuaternion(t),this.applyMatrix4(we),this}rotateX(t){return we.makeRotationX(t),this.applyMatrix4(we),this}rotateY(t){return we.makeRotationY(t),this.applyMatrix4(we),this}rotateZ(t){return we.makeRotationZ(t),this.applyMatrix4(we),this}translate(t,e,n){return we.makeTranslation(t,e,n),this.applyMatrix4(we),this}scale(t,e,n){return we.makeScale(t,e,n),this.applyMatrix4(we),this}lookAt(t){return cs.lookAt(t),cs.updateMatrix(),this.applyMatrix4(cs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ln).negate(),this.translate(Ln.x,Ln.y,Ln.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,s=t.length;i<s;i++){let r=t[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Re(n,3))}else{for(let n=0,i=e.count;n<i;n++){let s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}if(t.length>e.count)console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.");e.needsUpdate=!0}return this}computeBoundingBox(){if(this.boundingBox===null)this.boundingBox=new zn;let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let s=e[n];if(Me.setFromBufferAttribute(s),this.morphTargetsRelative)le.addVectors(this.boundingBox.min,Me.min),this.boundingBox.expandByPoint(le),le.addVectors(this.boundingBox.max,Me.max),this.boundingBox.expandByPoint(le);else this.boundingBox.expandByPoint(Me.min),this.boundingBox.expandByPoint(Me.max)}}else this.boundingBox.makeEmpty();if(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){if(this.boundingSphere===null)this.boundingSphere=new Ui;let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){let n=this.boundingSphere.center;if(Me.setFromBufferAttribute(t),e)for(let s=0,r=e.length;s<r;s++){let o=e[s];if(jn.setFromBufferAttribute(o),this.morphTargetsRelative)le.addVectors(Me.min,jn.min),Me.expandByPoint(le),le.addVectors(Me.max,jn.max),Me.expandByPoint(le);else Me.expandByPoint(jn.min),Me.expandByPoint(jn.max)}Me.getCenter(n);let i=0;for(let s=0,r=t.count;s<r;s++)le.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(le));if(e)for(let s=0,r=e.length;s<r;s++){let o=e[s],a=this.morphTargetsRelative;for(let l=0,c=o.count;l<c;l++){if(le.fromBufferAttribute(o,l),a)Ln.fromBufferAttribute(t,l),le.add(Ln);i=Math.max(i,n.distanceToSquared(le))}}if(this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius))console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let{position:n,normal:i,uv:s}=e;if(this.hasAttribute("tangent")===!1)this.setAttribute("tangent",new Ae(new Float32Array(4*n.count),4));let r=this.getAttribute("tangent"),o=[],a=[];for(let T=0;T<n.count;T++)o[T]=new O,a[T]=new O;let l=new O,c=new O,u=new O,h=new Vt,f=new Vt,m=new Vt,_=new O,g=new O;function p(T,U,S){l.fromBufferAttribute(n,T),c.fromBufferAttribute(n,U),u.fromBufferAttribute(n,S),h.fromBufferAttribute(s,T),f.fromBufferAttribute(s,U),m.fromBufferAttribute(s,S),c.sub(l),u.sub(l),f.sub(h),m.sub(h);let b=1/(f.x*m.y-m.x*f.y);if(!isFinite(b))return;_.copy(c).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(b),g.copy(u).multiplyScalar(f.x).addScaledVector(c,-m.x).multiplyScalar(b),o[T].add(_),o[U].add(_),o[S].add(_),a[T].add(g),a[U].add(g),a[S].add(g)}let d=this.groups;if(d.length===0)d=[{start:0,count:t.count}];for(let T=0,U=d.length;T<U;++T){let S=d[T],b=S.start,C=S.count;for(let N=b,V=b+C;N<V;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let y=new O,x=new O,w=new O,A=new O;function E(T){w.fromBufferAttribute(i,T),A.copy(w);let U=o[T];y.copy(U),y.sub(w.multiplyScalar(w.dot(U))).normalize(),x.crossVectors(A,U);let b=x.dot(a[T])<0?-1:1;r.setXYZW(T,y.x,y.y,y.z,b)}for(let T=0,U=d.length;T<U;++T){let S=d[T],b=S.start,C=S.count;for(let N=b,V=b+C;N<V;N+=3)E(t.getX(N+0)),E(t.getX(N+1)),E(t.getX(N+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ae(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let i=new O,s=new O,r=new O,o=new O,a=new O,l=new O,c=new O,u=new O;if(t)for(let h=0,f=t.count;h<f;h+=3){let m=t.getX(h+0),_=t.getX(h+1),g=t.getX(h+2);i.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),c.subVectors(r,s),u.subVectors(i,s),c.cross(u),o.fromBufferAttribute(n,m),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),o.add(c),a.add(c),l.add(c),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)i.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),r.fromBufferAttribute(e,h+2),c.subVectors(r,s),u.subVectors(i,s),c.cross(u),n.setXYZ(h+0,c.x,c.y,c.z),n.setXYZ(h+1,c.x,c.y,c.z),n.setXYZ(h+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)le.fromBufferAttribute(t,e),le.normalize(),t.setXYZ(e,le.x,le.y,le.z)}toNonIndexed(){function t(o,a){let{array:l,itemSize:c,normalized:u}=o,h=new l.constructor(a.length*c),f=0,m=0;for(let _=0,g=a.length;_<g;_++){if(o.isInterleavedBufferAttribute)f=a[_]*o.data.stride+o.offset;else f=a[_]*c;for(let p=0;p<c;p++)h[m++]=l[f++]}return new Ae(h,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new ze,n=this.index.array,i=this.attributes;for(let o in i){let a=i[o],l=t(a,n);e.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let a=[],l=s[o];for(let c=0,u=l.length;c<u;c++){let h=l[c],f=t(h,n);a.push(f)}e.morphAttributes[o]=a}e.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,a=r.length;o<a;o++){let l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!=="")t.name=this.name;if(Object.keys(this.userData).length>0)t.userData=this.userData;if(this.parameters!==void 0){let a=this.parameters;for(let l in a)if(a[l]!==void 0)t[l]=a[l];return t}t.data={attributes:{}};let e=this.index;if(e!==null)t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)};let n=this.attributes;for(let a in n){let l=n[a];t.data.attributes[a]=l.toJSON(t.data)}let i={},s=!1;for(let a in this.morphAttributes){let l=this.morphAttributes[a],c=[];for(let u=0,h=l.length;u<h;u++){let f=l[u];c.push(f.toJSON(t.data))}if(c.length>0)i[a]=c,s=!0}if(s)t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;if(r.length>0)t.data.groups=JSON.parse(JSON.stringify(r));let o=this.boundingSphere;if(o!==null)t.data.boundingSphere={center:o.center.toArray(),radius:o.radius};return t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;if(n!==null)this.setIndex(n.clone(e));let i=t.attributes;for(let l in i){let c=i[l];this.setAttribute(l,c.clone(e))}let s=t.morphAttributes;for(let l in s){let c=[],u=s[l];for(let h=0,f=u.length;h<f;h++)c.push(u[h].clone(e));this.morphAttributes[l]=c}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let l=0,c=r.length;l<c;l++){let u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;if(o!==null)this.boundingBox=o.clone();let a=t.boundingSphere;if(a!==null)this.boundingSphere=a.clone();return this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}var Sr=new ee,dn=new ua,yi=new Ui,br=new O,Mi=new O,Si=new O,bi=new O,hs=new O,Ei=new O,Er=new O,wi=new O;class Se extends be{constructor(t=new ze,e=new Ts){super();this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){if(super.copy(t,e),t.morphTargetInfluences!==void 0)this.morphTargetInfluences=t.morphTargetInfluences.slice();if(t.morphTargetDictionary!==void 0)this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary);return this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let o=this.morphTargetInfluences;if(s&&o){Ei.set(0,0,0);for(let a=0,l=s.length;a<l;a++){let c=o[a],u=s[a];if(c===0)continue;if(hs.fromBufferAttribute(u,t),r)Ei.addScaledVector(hs,c);else Ei.addScaledVector(hs.sub(e),c)}e.add(Ei)}return e}raycast(t,e){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0)return;if(n.boundingSphere===null)n.computeBoundingSphere();if(yi.copy(n.boundingSphere),yi.applyMatrix4(s),dn.copy(t.ray).recast(t.near),yi.containsPoint(dn.origin)===!1){if(dn.intersectSphere(yi,br)===null)return;if(dn.origin.distanceToSquared(br)>(t.far-t.near)**2)return}if(Sr.copy(s).invert(),dn.copy(t.ray).applyMatrix4(Sr),n.boundingBox!==null){if(dn.intersectsBox(n.boundingBox)===!1)return}this._computeIntersections(t,e,dn)}_computeIntersections(t,e,n){let i,s=this.geometry,r=this.material,o=s.index,a=s.attributes.position,l=s.attributes.uv,c=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,_=h.length;m<_;m++){let g=h[m],p=r[g.materialIndex],d=Math.max(g.start,f.start),y=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let x=d,w=y;x<w;x+=3){let A=o.getX(x),E=o.getX(x+1),T=o.getX(x+2);if(i=Ti(this,p,t,n,l,c,u,A,E,T),i)i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,e.push(i)}}else{let m=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){let d=o.getX(g),y=o.getX(g+1),x=o.getX(g+2);if(i=Ti(this,r,t,n,l,c,u,d,y,x),i)i.faceIndex=Math.floor(g/3),e.push(i)}}else if(a!==void 0)if(Array.isArray(r))for(let m=0,_=h.length;m<_;m++){let g=h[m],p=r[g.materialIndex],d=Math.max(g.start,f.start),y=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=d,w=y;x<w;x+=3){let A=x,E=x+1,T=x+2;if(i=Ti(this,p,t,n,l,c,u,A,E,T),i)i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,e.push(i)}}else{let m=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){let d=g,y=g+1,x=g+2;if(i=Ti(this,r,t,n,l,c,u,d,y,x),i)i.faceIndex=Math.floor(g/3),e.push(i)}}}}function Ko(t,e,n,i,s,r,o,a){let l;if(e.side===1)l=i.intersectTriangle(o,r,s,!0,a);else l=i.intersectTriangle(s,r,o,e.side===0,a);if(l===null)return null;wi.copy(a),wi.applyMatrix4(t.matrixWorld);let c=n.ray.origin.distanceTo(wi);if(c<n.near||c>n.far)return null;return{distance:c,point:wi.clone(),object:t}}function Ti(t,e,n,i,s,r,o,a,l,c){t.getVertexPosition(a,Mi),t.getVertexPosition(l,Si),t.getVertexPosition(c,bi);let u=Ko(t,e,n,i,Mi,Si,bi,Er);if(u){let h=new O;if(De.getBarycoord(Er,Mi,Si,bi,h),s)u.uv=De.getInterpolatedAttribute(s,a,l,c,h,new Vt);if(r)u.uv1=De.getInterpolatedAttribute(r,a,l,c,h,new Vt);if(o){if(u.normal=De.getInterpolatedAttribute(o,a,l,c,h,new O),u.normal.dot(i.direction)>0)u.normal.multiplyScalar(-1)}let f={a,b:l,c,normal:new O,materialIndex:0};De.getNormal(Mi,Si,bi,f.normal),u.face=f,u.barycoord=h}return u}class ai extends ze{constructor(t=1,e=1,n=1,i=1,s=1,r=1){super();this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let o=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let a=[],l=[],c=[],u=[],h=0,f=0;m("z","y","x",-1,-1,n,e,t,r,s,0),m("z","y","x",1,-1,n,e,-t,r,s,1),m("x","z","y",1,1,t,n,e,i,r,2),m("x","z","y",1,-1,t,n,-e,i,r,3),m("x","y","z",1,-1,t,e,n,i,s,4),m("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(a),this.setAttribute("position",new Re(l,3)),this.setAttribute("normal",new Re(c,3)),this.setAttribute("uv",new Re(u,2));function m(_,g,p,d,y,x,w,A,E,T,U){let S=x/E,b=w/T,C=x/2,N=w/2,V=A/2,k=E+1,X=T+1,H=0,K=0,G=new O;for(let it=0;it<X;it++){let st=it*b-N;for(let xt=0;xt<k;xt++){let wt=xt*S-C;G[_]=wt*d,G[g]=st*y,G[p]=V,l.push(G.x,G.y,G.z),G[_]=0,G[g]=0,G[p]=A>0?1:-1,c.push(G.x,G.y,G.z),u.push(xt/E),u.push(1-it/T),H+=1}}for(let it=0;it<T;it++)for(let st=0;st<E;st++){let xt=h+st+k*it,wt=h+st+k*(it+1),Y=h+(st+1)+k*(it+1),tt=h+(st+1)+k*it;a.push(xt,wt,tt),a.push(wt,Y,tt),K+=6}o.addGroup(f,K,U),f+=K,h+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Bn(t){let e={};for(let n in t){e[n]={};for(let i in t[n]){let s=t[n][i];if(s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion))if(s.isRenderTargetTexture)console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null;else e[n][i]=s.clone();else if(Array.isArray(s))e[n][i]=s.slice();else e[n][i]=s}}return e}function me(t){let e={};for(let n=0;n<t.length;n++){let i=Bn(t[n]);for(let s in i)e[s]=i[s]}return e}function Qo(t){let e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function fa(t){let e=t.getRenderTarget();if(e===null)return t.outputColorSpace;if(e.isXRRenderTarget===!0)return e.texture.colorSpace;return kt.workingColorSpace}var jo={clone:Bn,merge:me},tl=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,el=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ne extends ri{static get type(){return"ShaderMaterial"}constructor(t){super();if(this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tl,this.fragmentShader=el,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0)this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Bn(t.uniforms),this.uniformsGroups=Qo(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;if(r&&r.isTexture)e.uniforms[i]={type:"t",value:r.toJSON(t).uuid};else if(r&&r.isColor)e.uniforms[i]={type:"c",value:r.getHex()};else if(r&&r.isVector2)e.uniforms[i]={type:"v2",value:r.toArray()};else if(r&&r.isVector3)e.uniforms[i]={type:"v3",value:r.toArray()};else if(r&&r.isVector4)e.uniforms[i]={type:"v4",value:r.toArray()};else if(r&&r.isMatrix3)e.uniforms[i]={type:"m3",value:r.toArray()};else if(r&&r.isMatrix4)e.uniforms[i]={type:"m4",value:r.toArray()};else e.uniforms[i]={value:r}}if(Object.keys(this.defines).length>0)e.defines=this.defines;e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)if(this.extensions[i]===!0)n[i]=!0;if(Object.keys(n).length>0)e.extensions=n;return e}}class Cs extends be{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=2000}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}var an=new O,wr=new Vt,Tr=new Vt;class Te extends Cs{constructor(t=50,e=1,n=0.1,i=2000){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=0.5*this.getFilmHeight()/t;this.fov=xs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Wi*0.5*this.fov);return 0.5*this.getFilmHeight()/t}getEffectiveFOV(){return xs*2*Math.atan(Math.tan(Wi*0.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){an.set(-1,-1,0.5).applyMatrix4(this.projectionMatrixInverse),e.set(an.x,an.y).multiplyScalar(-t/an.z),an.set(1,1,0.5).applyMatrix4(this.projectionMatrixInverse),n.set(an.x,an.y).multiplyScalar(-t/an.z)}getViewSize(t,e){return this.getViewBounds(t,wr,Tr),e.subVectors(Tr,wr)}setViewOffset(t,e,n,i,s,r){if(this.aspect=t/e,this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Wi*0.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-0.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let{fullWidth:a,fullHeight:l}=r;s+=r.offsetX*i/a,e-=r.offsetY*n/l,i*=r.width/a,n*=r.height/l}let o=this.filmOffset;if(o!==0)s+=t*o/this.getFilmWidth();this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);if(e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null)e.object.view=Object.assign({},this.view);return e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}var Dn=-90,Un=1;class pa extends be{constructor(t,e,n){super();this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Te(Dn,Un,t,e);i.layers=this.layers,this.add(i);let s=new Te(Dn,Un,t,e);s.layers=this.layers,this.add(s);let r=new Te(Dn,Un,t,e);r.layers=this.layers,this.add(r);let o=new Te(Dn,Un,t,e);o.layers=this.layers,this.add(o);let a=new Te(Dn,Un,t,e);a.layers=this.layers,this.add(a);let l=new Te(Dn,Un,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,s,r,o,a]=e;for(let l of e)this.remove(l);if(t===2000)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),a.up.set(0,1,0),a.lookAt(0,0,-1);else if(t===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),a.up.set(0,-1,0),a.lookAt(0,0,-1);else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){if(this.parent===null)this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;if(this.coordinateSystem!==t.coordinateSystem)this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem();let[s,r,o,a,l,c]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,r),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,a),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,c),t.setRenderTarget(u,h,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Is extends pe{constructor(t,e,n,i,s,r,o,a,l,c){t=t!==void 0?t:[],e=e!==void 0?e:301;super(t,e,n,i,s,r,o,a,l,c);this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ma extends ln{constructor(t=1,e={}){super(t,t,e);this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Is(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:1006}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ai(5,5,5),s=new Ne({name:"CubemapFromEquirect",uniforms:Bn(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=e;let r=new Se(i,s),o=e.minFilter;if(e.minFilter===1008)e.minFilter=1006;return new pa(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,i){let s=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,i);t.setRenderTarget(s)}}var us=new O,nl=new O,il=new Ct;class on{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=us.subVectors(n,e).cross(nl.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(us),i=this.normal.dot(n);if(i===0){if(this.distanceToPoint(t.start)===0)return e.copy(t.start);return null}let s=-(t.start.dot(this.normal)+this.constant)/i;if(s<0||s>1)return null;return e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||il.getNormalMatrix(t),i=this.coplanarPoint(us).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}var fn=new Ui,Ai=new O;class Ps{constructor(t=new on,e=new on,n=new on,i=new on,s=new on,r=new on){this.planes=[t,e,n,i,s,r]}set(t,e,n,i,s,r){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(r),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=2000){let n=this.planes,i=t.elements,s=i[0],r=i[1],o=i[2],a=i[3],l=i[4],c=i[5],u=i[6],h=i[7],f=i[8],m=i[9],_=i[10],g=i[11],p=i[12],d=i[13],y=i[14],x=i[15];if(n[0].setComponents(a-s,h-l,g-f,x-p).normalize(),n[1].setComponents(a+s,h+l,g+f,x+p).normalize(),n[2].setComponents(a+r,h+c,g+m,x+d).normalize(),n[3].setComponents(a-r,h-c,g-m,x-d).normalize(),n[4].setComponents(a-o,h-u,g-_,x-y).normalize(),e===2000)n[5].setComponents(a+o,h+u,g+_,x+y).normalize();else if(e===2001)n[5].setComponents(o,u,_,y).normalize();else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0){if(t.boundingSphere===null)t.computeBoundingSphere();fn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld)}else{let e=t.geometry;if(e.boundingSphere===null)e.computeBoundingSphere();fn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fn)}intersectsSprite(t){return fn.center.set(0,0,0),fn.radius=0.7071067811865476,fn.applyMatrix4(t.matrixWorld),this.intersectsSphere(fn)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Ai.x=i.normal.x>0?t.max.x:t.min.x,Ai.y=i.normal.y>0?t.max.y:t.min.y,Ai.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ai)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ga(){let t=null,e=!1,n=null,i=null;function s(r,o){n(r,o),i=t.requestAnimationFrame(s)}return{start:function(){if(e===!0)return;if(n===null)return;i=t.requestAnimationFrame(s),e=!0},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function sl(t){let e=new WeakMap;function n(a,l){let{array:c,usage:u}=a,h=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,u),a.onUploadCallback();let m;if(c instanceof Float32Array)m=t.FLOAT;else if(c instanceof Uint16Array)if(a.isFloat16BufferAttribute)m=t.HALF_FLOAT;else m=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=t.SHORT;else if(c instanceof Uint32Array)m=t.UNSIGNED_INT;else if(c instanceof Int32Array)m=t.INT;else if(c instanceof Int8Array)m=t.BYTE;else if(c instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){let{array:u,updateRanges:h}=l;if(t.bindBuffer(c,a),h.length===0)t.bufferSubData(c,0,u);else{h.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<h.length;m++){let _=h[f],g=h[m];if(g.start<=_.start+_.count+1)_.count=Math.max(_.count,g.start+g.count-_.start);else++f,h[f]=g}h.length=f+1;for(let m=0,_=h.length;m<_;m++){let g=h[m];t.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){if(a.isInterleavedBufferAttribute)a=a.data;return e.get(a)}function r(a){if(a.isInterleavedBufferAttribute)a=a.data;let l=e.get(a);if(l)t.deleteBuffer(l.buffer),e.delete(a)}function o(a,l){if(a.isInterleavedBufferAttribute)a=a.data;if(a.isGLBufferAttribute){let u=e.get(a);if(!u||u.version<a.version)e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class kn extends ze{constructor(t=1,e=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let s=t/2,r=e/2,o=Math.floor(n),a=Math.floor(i),l=o+1,c=a+1,u=t/o,h=e/a,f=[],m=[],_=[],g=[];for(let p=0;p<c;p++){let d=p*h-r;for(let y=0;y<l;y++){let x=y*u-s;m.push(x,-d,0),_.push(0,0,1),g.push(y/o),g.push(1-p/a)}}for(let p=0;p<a;p++)for(let d=0;d<o;d++){let y=d+l*p,x=d+l*(p+1),w=d+1+l*(p+1),A=d+1+l*p;f.push(y,x,A),f.push(x,w,A)}this.setIndex(f),this.setAttribute("position",new Re(m,3)),this.setAttribute("normal",new Re(_,3)),this.setAttribute("uv",new Re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kn(t.width,t.height,t.widthSegments,t.heightSegments)}}var rl=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,al=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ol=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ll=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cl=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hl=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ul=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dl=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fl=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,pl=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ml=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gl=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_l=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,xl=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vl=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,yl=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ml=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bl=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,El=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Tl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Al=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Rl=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Cl=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Il=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Pl=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ll=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dl=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ul=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Nl="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fl=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ol=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Bl=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif

#endif`,zl=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,kl=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gl=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vl=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wl=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xl=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ql=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yl=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zl=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jl=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$l=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Kl=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ql=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jl=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ec=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nc=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ic=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sc=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,rc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ac=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,oc=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,lc=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cc=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hc=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,uc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,pc=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mc=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gc=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_c=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xc=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vc=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yc=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Mc=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sc=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,bc=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ec=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tc=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ac=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Rc=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cc=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ic=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pc=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Lc=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dc=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Uc=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Nc=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fc=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Oc=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bc=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zc=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;

		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Hc=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Gc=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Vc=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Wc=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Xc=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,qc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Yc=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zc=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$c=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qc=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,jc=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;

				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;

				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;

		#else

			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );

		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,th=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,eh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,nh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ih=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,sh=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rh=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ah=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oh=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ch=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hh=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,uh=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,dh=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,fh=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ph=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gh=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_h=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xh=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,vh=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yh=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mh=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sh=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,bh=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eh=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,wh=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Th=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ah=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rh=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ch=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ih=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ph=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lh=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Dh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Uh=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nh=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Fh=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Oh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:rl,alphahash_pars_fragment:al,alphamap_fragment:ol,alphamap_pars_fragment:ll,alphatest_fragment:cl,alphatest_pars_fragment:hl,aomap_fragment:ul,aomap_pars_fragment:dl,batching_pars_vertex:fl,batching_vertex:pl,begin_vertex:ml,beginnormal_vertex:gl,bsdfs:_l,iridescence_fragment:xl,bumpmap_pars_fragment:vl,clipping_planes_fragment:yl,clipping_planes_pars_fragment:Ml,clipping_planes_pars_vertex:Sl,clipping_planes_vertex:bl,color_fragment:El,color_pars_fragment:wl,color_pars_vertex:Tl,color_vertex:Al,common:Rl,cube_uv_reflection_fragment:Cl,defaultnormal_vertex:Il,displacementmap_pars_vertex:Pl,displacementmap_vertex:Ll,emissivemap_fragment:Dl,emissivemap_pars_fragment:Ul,colorspace_fragment:Nl,colorspace_pars_fragment:Fl,envmap_fragment:Ol,envmap_common_pars_fragment:Bl,envmap_pars_fragment:zl,envmap_pars_vertex:kl,envmap_physical_pars_fragment:Kl,envmap_vertex:Hl,fog_vertex:Gl,fog_pars_vertex:Vl,fog_fragment:Wl,fog_pars_fragment:Xl,gradientmap_pars_fragment:ql,lightmap_pars_fragment:Yl,lights_lambert_fragment:Zl,lights_lambert_pars_fragment:Jl,lights_pars_begin:$l,lights_toon_fragment:Ql,lights_toon_pars_fragment:jl,lights_phong_fragment:tc,lights_phong_pars_fragment:ec,lights_physical_fragment:nc,lights_physical_pars_fragment:ic,lights_fragment_begin:sc,lights_fragment_maps:rc,lights_fragment_end:ac,logdepthbuf_fragment:oc,logdepthbuf_pars_fragment:lc,logdepthbuf_pars_vertex:cc,logdepthbuf_vertex:hc,map_fragment:uc,map_pars_fragment:dc,map_particle_fragment:fc,map_particle_pars_fragment:pc,metalnessmap_fragment:mc,metalnessmap_pars_fragment:gc,morphinstance_vertex:_c,morphcolor_vertex:xc,morphnormal_vertex:vc,morphtarget_pars_vertex:yc,morphtarget_vertex:Mc,normal_fragment_begin:Sc,normal_fragment_maps:bc,normal_pars_fragment:Ec,normal_pars_vertex:wc,normal_vertex:Tc,normalmap_pars_fragment:Ac,clearcoat_normal_fragment_begin:Rc,clearcoat_normal_fragment_maps:Cc,clearcoat_pars_fragment:Ic,iridescence_pars_fragment:Pc,opaque_fragment:Lc,packing:Dc,premultiplied_alpha_fragment:Uc,project_vertex:Nc,dithering_fragment:Fc,dithering_pars_fragment:Oc,roughnessmap_fragment:Bc,roughnessmap_pars_fragment:zc,shadowmap_pars_fragment:kc,shadowmap_pars_vertex:Hc,shadowmap_vertex:Gc,shadowmask_pars_fragment:Vc,skinbase_vertex:Wc,skinning_pars_vertex:Xc,skinning_vertex:qc,skinnormal_vertex:Yc,specularmap_fragment:Zc,specularmap_pars_fragment:Jc,tonemapping_fragment:$c,tonemapping_pars_fragment:Kc,transmission_fragment:Qc,transmission_pars_fragment:jc,uv_pars_fragment:th,uv_pars_vertex:eh,uv_vertex:nh,worldpos_vertex:ih,background_vert:sh,background_frag:rh,backgroundCube_vert:ah,backgroundCube_frag:oh,cube_vert:lh,cube_frag:ch,depth_vert:hh,depth_frag:uh,distanceRGBA_vert:dh,distanceRGBA_frag:fh,equirect_vert:ph,equirect_frag:mh,linedashed_vert:gh,linedashed_frag:_h,meshbasic_vert:xh,meshbasic_frag:vh,meshlambert_vert:yh,meshlambert_frag:Mh,meshmatcap_vert:Sh,meshmatcap_frag:bh,meshnormal_vert:Eh,meshnormal_frag:wh,meshphong_vert:Th,meshphong_frag:Ah,meshphysical_vert:Rh,meshphysical_frag:Ch,meshtoon_vert:Ih,meshtoon_frag:Ph,points_vert:Lh,points_frag:Dh,shadow_vert:Uh,shadow_frag:Nh,sprite_vert:Fh,sprite_frag:Oh},rt={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ct},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ct}},envmap:{envMap:{value:null},envMapRotation:{value:new Ct},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:0.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ct},normalScale:{value:new Vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:0.00025},fogNear:{value:1},fogFar:{value:2000},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0},uvTransform:{value:new Ct}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new Vt(0.5,0.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ct},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0}}},Be={basic:{uniforms:me([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:me([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:me([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:me([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:me([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:me([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:me([rt.points,rt.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:me([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:me([rt.common,rt.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:me([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:me([rt.sprite,rt.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ct}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:me([rt.common,rt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1000}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:me([rt.lights,rt.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};Be.physical={uniforms:me([Be.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ct},clearcoatNormalScale:{value:new Vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ct},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ct},transmissionSamplerSize:{value:new Vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ct},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ct},anisotropyVector:{value:new Vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ct}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};var Ri={r:0,b:0,g:0},pn=new Ue,Bh=new ee;function zh(t,e,n,i,s,r,o){let a=new Yt(0),l=r===!0?0:1,c,u,h=null,f=0,m=null;function _(y){let x=y.isScene===!0?y.background:null;if(x&&x.isTexture)x=(y.backgroundBlurriness>0?n:e).get(x);return x}function g(y){let x=!1,w=_(y);if(w===null)d(a,l);else if(w&&w.isColor)d(w,1),x=!0;let A=t.xr.getEnvironmentBlendMode();if(A==="additive")i.buffers.color.setClear(0,0,0,1,o);else if(A==="alpha-blend")i.buffers.color.setClear(0,0,0,0,o);if(t.autoClear||x)i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil)}function p(y,x){let w=_(x);if(w&&(w.isCubeTexture||w.mapping===306)){if(u===void 0)u=new Se(new ai(1,1,1),new Ne({name:"BackgroundCubeMaterial",uniforms:Bn(Be.backgroundCube.uniforms),vertexShader:Be.backgroundCube.vertexShader,fragmentShader:Be.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,E,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u);if(pn.copy(x.backgroundRotation),pn.x*=-1,pn.y*=-1,pn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1)pn.y*=-1,pn.z*=-1;if(u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Bh.makeRotationFromEuler(pn)),u.material.toneMapped=kt.getTransfer(w.colorSpace)!=="srgb",h!==w||f!==w.version||m!==t.toneMapping)u.material.needsUpdate=!0,h=w,f=w.version,m=t.toneMapping;u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)}else if(w&&w.isTexture){if(c===void 0)c=new Se(new kn(2,2),new Ne({name:"BackgroundMaterial",uniforms:Bn(Be.background.uniforms),vertexShader:Be.background.vertexShader,fragmentShader:Be.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c);if(c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=kt.getTransfer(w.colorSpace)!=="srgb",w.matrixAutoUpdate===!0)w.updateMatrix();if(c.material.uniforms.uvTransform.value.copy(w.matrix),h!==w||f!==w.version||m!==t.toneMapping)c.material.needsUpdate=!0,h=w,f=w.version,m=t.toneMapping;c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)}}function d(y,x){y.getRGB(Ri,fa(t)),i.buffers.color.setClear(Ri.r,Ri.g,Ri.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(y,x=1){a.set(y),l=x,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,d(a,l)},render:g,addToRenderList:p}}function kh(t,e){let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(b,C,N,V,k){let X=!1,H=h(V,N,C);if(r!==H)r=H,c(r.object);if(X=m(b,V,N,k),X)_(b,V,N,k);if(k!==null)e.update(k,t.ELEMENT_ARRAY_BUFFER);if(X||o){if(o=!1,w(b,C,N,V),k!==null)t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(k).buffer)}}function l(){return t.createVertexArray()}function c(b){return t.bindVertexArray(b)}function u(b){return t.deleteVertexArray(b)}function h(b,C,N){let V=N.wireframe===!0,k=i[b.id];if(k===void 0)k={},i[b.id]=k;let X=k[C.id];if(X===void 0)X={},k[C.id]=X;let H=X[V];if(H===void 0)H=f(l()),X[V]=H;return H}function f(b){let C=[],N=[],V=[];for(let k=0;k<n;k++)C[k]=0,N[k]=0,V[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:N,attributeDivisors:V,object:b,attributes:{},index:null}}function m(b,C,N,V){let k=r.attributes,X=C.attributes,H=0,K=N.getAttributes();for(let G in K)if(K[G].location>=0){let st=k[G],xt=X[G];if(xt===void 0){if(G==="instanceMatrix"&&b.instanceMatrix)xt=b.instanceMatrix;if(G==="instanceColor"&&b.instanceColor)xt=b.instanceColor}if(st===void 0)return!0;if(st.attribute!==xt)return!0;if(xt&&st.data!==xt.data)return!0;H++}if(r.attributesNum!==H)return!0;if(r.index!==V)return!0;return!1}function _(b,C,N,V){let k={},X=C.attributes,H=0,K=N.getAttributes();for(let G in K)if(K[G].location>=0){let st=X[G];if(st===void 0){if(G==="instanceMatrix"&&b.instanceMatrix)st=b.instanceMatrix;if(G==="instanceColor"&&b.instanceColor)st=b.instanceColor}let xt={};if(xt.attribute=st,st&&st.data)xt.data=st.data;k[G]=xt,H++}r.attributes=k,r.attributesNum=H,r.index=V}function g(){let b=r.newAttributes;for(let C=0,N=b.length;C<N;C++)b[C]=0}function p(b){d(b,0)}function d(b,C){let{newAttributes:N,enabledAttributes:V,attributeDivisors:k}=r;if(N[b]=1,V[b]===0)t.enableVertexAttribArray(b),V[b]=1;if(k[b]!==C)t.vertexAttribDivisor(b,C),k[b]=C}function y(){let{newAttributes:b,enabledAttributes:C}=r;for(let N=0,V=C.length;N<V;N++)if(C[N]!==b[N])t.disableVertexAttribArray(N),C[N]=0}function x(b,C,N,V,k,X,H){if(H===!0)t.vertexAttribIPointer(b,C,N,k,X);else t.vertexAttribPointer(b,C,N,V,k,X)}function w(b,C,N,V){g();let k=V.attributes,X=N.getAttributes(),H=C.defaultAttributeValues;for(let K in X){let G=X[K];if(G.location>=0){let it=k[K];if(it===void 0){if(K==="instanceMatrix"&&b.instanceMatrix)it=b.instanceMatrix;if(K==="instanceColor"&&b.instanceColor)it=b.instanceColor}if(it!==void 0){let{normalized:st,itemSize:xt}=it,wt=e.get(it);if(wt===void 0)continue;let{buffer:Y,type:tt,bytesPerElement:yt}=wt,Mt=tt===t.INT||tt===t.UNSIGNED_INT||it.gpuType===1013;if(it.isInterleavedBufferAttribute){let at=it.data,Tt=at.stride,Zt=it.offset;if(at.isInstancedInterleavedBuffer){for(let Bt=0;Bt<G.locationSize;Bt++)d(G.location+Bt,at.meshPerAttribute);if(b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0)V._maxInstanceCount=at.meshPerAttribute*at.count}else for(let Bt=0;Bt<G.locationSize;Bt++)p(G.location+Bt);t.bindBuffer(t.ARRAY_BUFFER,Y);for(let Bt=0;Bt<G.locationSize;Bt++)x(G.location+Bt,xt/G.locationSize,tt,st,Tt*yt,(Zt+xt/G.locationSize*Bt)*yt,Mt)}else{if(it.isInstancedBufferAttribute){for(let at=0;at<G.locationSize;at++)d(G.location+at,it.meshPerAttribute);if(b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0)V._maxInstanceCount=it.meshPerAttribute*it.count}else for(let at=0;at<G.locationSize;at++)p(G.location+at);t.bindBuffer(t.ARRAY_BUFFER,Y);for(let at=0;at<G.locationSize;at++)x(G.location+at,xt/G.locationSize,tt,st,xt*yt,xt/G.locationSize*at*yt,Mt)}}else if(H!==void 0){let st=H[K];if(st!==void 0)switch(st.length){case 2:t.vertexAttrib2fv(G.location,st);break;case 3:t.vertexAttrib3fv(G.location,st);break;case 4:t.vertexAttrib4fv(G.location,st);break;default:t.vertexAttrib1fv(G.location,st)}}}}y()}function A(){U();for(let b in i){let C=i[b];for(let N in C){let V=C[N];for(let k in V)u(V[k].object),delete V[k];delete C[N]}delete i[b]}}function E(b){if(i[b.id]===void 0)return;let C=i[b.id];for(let N in C){let V=C[N];for(let k in V)u(V[k].object),delete V[k];delete C[N]}delete i[b.id]}function T(b){for(let C in i){let N=i[C];if(N[b.id]===void 0)continue;let V=N[b.id];for(let k in V)u(V[k].object),delete V[k];delete N[b.id]}}function U(){if(S(),o=!0,r===s)return;r=s,c(r.object)}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:U,resetDefaultState:S,dispose:A,releaseStatesOfGeometry:E,releaseStatesOfProgram:T,initAttributes:g,enableAttribute:p,disableUnusedAttributes:y}}function Hh(t,e,n){let i;function s(c){i=c}function r(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,h){if(h===0)return;t.drawArraysInstanced(i,c,u,h),n.update(u,i,h)}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let m=0;for(let _=0;_<h;_++)m+=u[_];n.update(m,i,1)}function l(c,u,h,f){if(h===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)o(c[_],u[_],f[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,h);let _=0;for(let g=0;g<h;g++)_+=u[g]*f[g];n.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Gh(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){if(T!==1023&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))return!1;return!0}function a(T){let U=T===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));if(T!==1009&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==1015&&!U)return!1;return!0}function l(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}if(T==="mediump"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0)return"mediump"}return"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);if(u!==c)console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u;let h=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_TEXTURE_SIZE),p=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),y=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),x=t.getParameter(t.MAX_VARYING_VECTORS),w=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),A=_>0,E=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:w,vertexTextures:A,maxSamples:E}}function Vh(t){let e=this,n=null,i=0,s=!1,r=!1,o=new on,a=new Ct,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let m=h.length!==0||f||i!==0||s;return s=f,i=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){n=u(h,f,0)},this.setState=function(h,f,m){let{clippingPlanes:_,clipIntersection:g,clipShadows:p}=h,d=t.get(h);if(!s||_===null||_.length===0||r&&!p)if(r)u(null);else c();else{let y=r?0:i,x=y*4,w=d.clippingState||null;l.value=w,w=u(_,f,x,m);for(let A=0;A!==x;++A)w[A]=n[A];d.clippingState=w,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}};function c(){if(l.value!==n)l.value=n,l.needsUpdate=i>0;e.numPlanes=i,e.numIntersection=0}function u(h,f,m,_){let g=h!==null?h.length:0,p=null;if(g!==0){if(p=l.value,_!==!0||p===null){let d=m+g*4,y=f.matrixWorldInverse;if(a.getNormalMatrix(y),p===null||p.length<d)p=new Float32Array(d);for(let x=0,w=m;x!==g;++x,w+=4)o.copy(h[x]).applyMatrix4(y,a),o.normal.toArray(p,w),p[w+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,p}}function Wh(t){let e=new WeakMap;function n(o,a){if(a===303)o.mapping=301;else if(a===304)o.mapping=302;return o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===303||a===304)if(e.has(o)){let l=e.get(o).texture;return n(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new ma(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",s),n(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);if(l!==void 0)e.delete(a),l.dispose()}function r(){e=new WeakMap}return{get:i,dispose:r}}class Ni extends Cs{constructor(t=-1,e=1,n=1,i=-1,s=0.1,r=2000){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,r){if(this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-t,r=n+t,o=i+e,a=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,o-=c*this.view.offsetY,a=o-c*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,a,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);if(e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null)e.object.view=Object.assign({},this.view);return e}}var Fn=4,Ar=[0.125,0.215,0.35,0.446,0.526,0.582],_n=20,ds=new Ni,Rr=new Yt,fs=null,ps=0,ms=0,gs=!1,gn=(1+Math.sqrt(5))/2,Nn=1/gn,Cr=[new O(-gn,Nn,0),new O(gn,Nn,0),new O(-Nn,0,gn),new O(Nn,0,gn),new O(0,gn,-Nn),new O(0,gn,Nn),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class vs{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=0.1,i=100){fs=this._renderer.getRenderTarget(),ps=this._renderer.getActiveCubeFace(),ms=this._renderer.getActiveMipmapLevel(),gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();if(s.depthBuffer=!0,this._sceneToCubeUV(t,n,i,s),e>0)this._blur(s,0,0,e);return this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){if(this._cubemapMaterial===null)this._cubemapMaterial=Lr(),this._compileMaterial(this._cubemapMaterial)}compileEquirectangularShader(){if(this._equirectMaterial===null)this._equirectMaterial=Pr(),this._compileMaterial(this._equirectMaterial)}dispose(){if(this._dispose(),this._cubemapMaterial!==null)this._cubemapMaterial.dispose();if(this._equirectMaterial!==null)this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){if(this._blurMaterial!==null)this._blurMaterial.dispose();if(this._pingPongRenderTarget!==null)this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(fs,ps,ms),this._renderer.xr.enabled=gs,t.scissorTest=!1,Ci(t,0,0,t.width,t.height)}_fromTexture(t,e){if(t.mapping===301||t.mapping===302)this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width);else this._setSize(t.image.width/4);fs=this._renderer.getRenderTarget(),ps=this._renderer.getActiveCubeFace(),ms=this._renderer.getActiveMipmapLevel(),gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:"srgb-linear",depthBuffer:!1},i=Ir(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){if(this._pingPongRenderTarget!==null)this._dispose();this._pingPongRenderTarget=Ir(t,e,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Xh(s)),this._blurMaterial=qh(s,t,e)}return i}_compileMaterial(t){let e=new Se(this._lodPlanes[0],t);this._renderer.compile(e,ds)}_sceneToCubeUV(t,e,n,i){let o=new Te(90,1,e,n),a=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,h=c.toneMapping;c.getClearColor(Rr),c.toneMapping=0,c.autoClear=!1;let f=new Ts({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),m=new Se(new ai,f),_=!1,g=t.background;if(g){if(g.isColor)f.color.copy(g),t.background=null,_=!0}else f.color.copy(Rr),_=!0;for(let p=0;p<6;p++){let d=p%3;if(d===0)o.up.set(0,a[p],0),o.lookAt(l[p],0,0);else if(d===1)o.up.set(0,0,a[p]),o.lookAt(0,l[p],0);else o.up.set(0,a[p],0),o.lookAt(0,0,l[p]);let y=this._cubeSize;if(Ci(i,d*y,p>2?y:0,y,y),c.setRenderTarget(i),_)c.render(m,o);c.render(t,o)}m.geometry.dispose(),m.material.dispose(),c.toneMapping=h,c.autoClear=u,t.background=g}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===301||t.mapping===302;if(i){if(this._cubemapMaterial===null)this._cubemapMaterial=Lr();this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1}else if(this._equirectMaterial===null)this._equirectMaterial=Pr();let s=i?this._cubemapMaterial:this._equirectMaterial,r=new Se(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;let a=this._cubeSize;Ci(e,0,0,3*a,2*a),n.setRenderTarget(e),n.render(r,ds)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let s=1;s<i;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Cr[(i-s-1)%Cr.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,i,s){let r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,i,"latitudinal",s),this._halfBlur(r,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,r,o){let a=this._renderer,l=this._blurMaterial;if(r!=="latitudinal"&&r!=="longitudinal")console.error("blur direction must be either latitudinal or longitudinal!");let c=3,u=new Se(this._lodPlanes[i],l),h=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*_n-1),_=s/m,g=isFinite(s)?1+Math.floor(c*_):_n;if(g>_n)console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${_n}`);let p=[],d=0;for(let E=0;E<_n;++E){let T=E/_,U=Math.exp(-T*T/2);if(p.push(U),E===0)d+=U;else if(E<g)d+=2*U}for(let E=0;E<p.length;E++)p[E]=p[E]/d;if(h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=r==="latitudinal",o)h.poleAxis.value=o;let{_lodMax:y}=this;h.dTheta.value=m,h.mipInt.value=y-n;let x=this._sizeLods[i],w=3*x*(i>y-Fn?i-y+Fn:0),A=4*(this._cubeSize-x);Ci(e,w,A,3*x,2*x),a.setRenderTarget(e),a.render(u,ds)}}function Xh(t){let e=[],n=[],i=[],s=t,r=t-Fn+1+Ar.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);n.push(a);let l=1/a;if(o>t-Fn)l=Ar[o-t+Fn-1];else if(o===0)l=0;i.push(l);let c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,_=6,g=3,p=2,d=1,y=new Float32Array(g*_*m),x=new Float32Array(p*_*m),w=new Float32Array(d*_*m);for(let E=0;E<m;E++){let T=E%3*2/3-1,U=E>2?0:-1,S=[T,U,0,T+0.6666666666666666,U,0,T+0.6666666666666666,U+1,0,T,U,0,T+0.6666666666666666,U+1,0,T,U+1,0];y.set(S,g*_*E),x.set(f,p*_*E);let b=[E,E,E,E,E,E];w.set(b,d*_*E)}let A=new ze;if(A.setAttribute("position",new Ae(y,g)),A.setAttribute("uv",new Ae(x,p)),A.setAttribute("faceIndex",new Ae(w,d)),e.push(A),s>Fn)s--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Ir(t,e,n){let i=new ln(t,e,n);return i.texture.mapping=306,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ci(t,e,n,i,s){t.viewport.set(e,n,i,s),t.scissor.set(e,n,i,s)}function qh(t,e,n){let i=new Float32Array(_n),s=new O(0,1,0);return new Ne({name:"SphericalGaussianBlur",defines:{n:_n,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Pr(){return new Ne({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Lr(){return new Ne({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ls(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Yh(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){let l=a.mapping,c=l===303||l===304,u=l===301||l===302;if(c||u){let h=e.get(a),f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f){if(n===null)n=new vs(t);return h=c?n.fromEquirectangular(a,h):n.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture}else if(h!==void 0)return h.texture;else{let m=a.image;if(c&&m&&m.height>0||u&&m&&s(m)){if(n===null)n=new vs(t);return h=c?n.fromEquirectangular(a):n.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)if(a[u]!==void 0)l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);if(c!==void 0)e.delete(l),c.dispose()}function o(){if(e=new WeakMap,n!==null)n.dispose(),n=null}return{get:i,dispose:o}}function Zh(t){let e={};function n(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=t.getExtension(i)}return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);if(s===null)ti("THREE.WebGLRenderer: "+i+" extension not supported.");return s}}}function Jh(t,e,n,i){let s={},r=new WeakMap;function o(h){let f=h.target;if(f.index!==null)e.remove(f.index);for(let _ in f.attributes)e.remove(f.attributes[_]);for(let _ in f.morphAttributes){let g=f.morphAttributes[_];for(let p=0,d=g.length;p<d;p++)e.remove(g[p])}f.removeEventListener("dispose",o),delete s[f.id];let m=r.get(f);if(m)e.remove(m),r.delete(f);if(i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0)delete f._maxInstanceCount;n.memory.geometries--}function a(h,f){if(s[f.id]===!0)return f;return f.addEventListener("dispose",o),s[f.id]=!0,n.memory.geometries++,f}function l(h){let f=h.attributes;for(let _ in f)e.update(f[_],t.ARRAY_BUFFER);let m=h.morphAttributes;for(let _ in m){let g=m[_];for(let p=0,d=g.length;p<d;p++)e.update(g[p],t.ARRAY_BUFFER)}}function c(h){let f=[],m=h.index,_=h.attributes.position,g=0;if(m!==null){let y=m.array;g=m.version;for(let x=0,w=y.length;x<w;x+=3){let A=y[x+0],E=y[x+1],T=y[x+2];f.push(A,E,E,T,T,A)}}else if(_!==void 0){let y=_.array;g=_.version;for(let x=0,w=y.length/3-1;x<w;x+=3){let A=x+0,E=x+1,T=x+2;f.push(A,E,E,T,T,A)}}else return;let p=new((oa(f))?Rs:As)(f,1);p.version=g;let d=r.get(h);if(d)e.remove(d);r.set(h,p)}function u(h){let f=r.get(h);if(f){let m=h.index;if(m!==null){if(f.version<m.version)c(h)}}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function $h(t,e,n){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,m){t.drawElements(i,m,r,f*o),n.update(m,i,1)}function c(f,m,_){if(_===0)return;t.drawElementsInstanced(i,m,r,f*o,_),n.update(m,i,_)}function u(f,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,f,0,_);let p=0;for(let d=0;d<_;d++)p+=m[d];n.update(p,i,1)}function h(f,m,_,g){if(_===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/o,m[d],g[d]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,f,0,g,0,_);let d=0;for(let y=0;y<_;y++)d+=m[y]*g[y];n.update(d,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Kh(t){let e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(r/3);break;case t.LINES:n.lines+=a*(r/2);break;case t.LINE_STRIP:n.lines+=a*(r-1);break;case t.LINE_LOOP:n.lines+=a*r;break;case t.POINTS:n.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function Qh(t,e,n){let i=new WeakMap,s=new Gt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,f=i.get(a);if(f===void 0||f.count!==h){let S=function(){T.dispose(),i.delete(a),a.removeEventListener("dispose",S)};if(f!==void 0)f.texture.dispose();let m=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],x=0;if(m===!0)x=1;if(_===!0)x=2;if(g===!0)x=3;let w=a.attributes.position.count*x,A=1;if(w>e.maxTextureSize)A=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize;let E=new Float32Array(w*A*4*h),T=new Es(E,w,A,h);T.type=1015,T.needsUpdate=!0;let U=x*4;for(let b=0;b<h;b++){let C=p[b],N=d[b],V=y[b],k=w*A*4*b;for(let X=0;X<C.count;X++){let H=X*U;if(m===!0)s.fromBufferAttribute(C,X),E[k+H+0]=s.x,E[k+H+1]=s.y,E[k+H+2]=s.z,E[k+H+3]=0;if(_===!0)s.fromBufferAttribute(N,X),E[k+H+4]=s.x,E[k+H+5]=s.y,E[k+H+6]=s.z,E[k+H+7]=0;if(g===!0)s.fromBufferAttribute(V,X),E[k+H+8]=s.x,E[k+H+9]=s.y,E[k+H+10]=s.z,E[k+H+11]=V.itemSize===4?s.w:1}}f={count:h,texture:T,size:new Vt(w,A)},i.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];let _=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(t,"morphTargetBaseInfluence",_),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:r}}function jh(t,e,n,i){let s=new WeakMap;function r(l){let c=i.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c)e.update(h),s.set(h,c);if(l.isInstancedMesh){if(l.hasEventListener("dispose",a)===!1)l.addEventListener("dispose",a);if(s.get(l)!==c){if(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null)n.update(l.instanceColor,t.ARRAY_BUFFER);s.set(l,c)}}if(l.isSkinnedMesh){let f=l.skeleton;if(s.get(f)!==c)f.update(),s.set(f,c)}return h}function o(){s=new WeakMap}function a(l){let c=l.target;if(c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null)n.remove(c.instanceColor)}return{update:r,dispose:o}}class Ds extends pe{constructor(t,e,n,i,s,r,o,a,l,c=1026){if(c!==1026&&c!==1027)throw Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");if(n===void 0&&c===1026)n=1014;if(n===void 0&&c===1027)n=1020;super(null,i,s,r,o,a,c,n,l);this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:1003,this.minFilter=a!==void 0?a:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);if(this.compareFunction!==null)e.compareFunction=this.compareFunction;return e}}var _a=new pe,Dr=new Ds(1,1),xa=new Es,va=new ha,ya=new Is,Ur=[],Nr=[],Fr=new Float32Array(16),Or=new Float32Array(9),Br=new Float32Array(4);function Hn(t,e,n){let i=t[0];if(i<=0||i>0)return t;let s=e*n,r=Ur[s];if(r===void 0)r=new Float32Array(s),Ur[s]=r;if(e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(r,a)}return r}function ae(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function oe(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Fi(t,e){let n=Nr[e];if(n===void 0)n=new Int32Array(e),Nr[e]=n;for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function tu(t,e){let n=this.cache;if(n[0]===e)return;t.uniform1f(this.addr,e),n[0]=e}function eu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y)t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y}else{if(ae(n,e))return;t.uniform2fv(this.addr,e),oe(n,e)}}function nu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z}else if(e.r!==void 0){if(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b}else{if(ae(n,e))return;t.uniform3fv(this.addr,e),oe(n,e)}}function iu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w}else{if(ae(n,e))return;t.uniform4fv(this.addr,e),oe(n,e)}}function su(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(ae(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),oe(n,e)}else{if(ae(n,i))return;Br.set(i),t.uniformMatrix2fv(this.addr,!1,Br),oe(n,i)}}function ru(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(ae(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),oe(n,e)}else{if(ae(n,i))return;Or.set(i),t.uniformMatrix3fv(this.addr,!1,Or),oe(n,i)}}function au(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(ae(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),oe(n,e)}else{if(ae(n,i))return;Fr.set(i),t.uniformMatrix4fv(this.addr,!1,Fr),oe(n,i)}}function ou(t,e){let n=this.cache;if(n[0]===e)return;t.uniform1i(this.addr,e),n[0]=e}function lu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y)t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y}else{if(ae(n,e))return;t.uniform2iv(this.addr,e),oe(n,e)}}function cu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z}else{if(ae(n,e))return;t.uniform3iv(this.addr,e),oe(n,e)}}function hu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w}else{if(ae(n,e))return;t.uniform4iv(this.addr,e),oe(n,e)}}function uu(t,e){let n=this.cache;if(n[0]===e)return;t.uniform1ui(this.addr,e),n[0]=e}function du(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y)t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y}else{if(ae(n,e))return;t.uniform2uiv(this.addr,e),oe(n,e)}}function fu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z}else{if(ae(n,e))return;t.uniform3uiv(this.addr,e),oe(n,e)}}function pu(t,e){let n=this.cache;if(e.x!==void 0){if(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w}else{if(ae(n,e))return;t.uniform4uiv(this.addr,e),oe(n,e)}}function mu(t,e,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)t.uniform1i(this.addr,s),i[0]=s;let r;if(this.type===t.SAMPLER_2D_SHADOW)Dr.compareFunction=515,r=Dr;else r=_a;n.setTexture2D(e||r,s)}function gu(t,e,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)t.uniform1i(this.addr,s),i[0]=s;n.setTexture3D(e||va,s)}function _u(t,e,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)t.uniform1i(this.addr,s),i[0]=s;n.setTextureCube(e||ya,s)}function xu(t,e,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)t.uniform1i(this.addr,s),i[0]=s;n.setTexture2DArray(e||xa,s)}function vu(t){switch(t){case 5126:return tu;case 35664:return eu;case 35665:return nu;case 35666:return iu;case 35674:return su;case 35675:return ru;case 35676:return au;case 5124:case 35670:return ou;case 35667:case 35671:return lu;case 35668:case 35672:return cu;case 35669:case 35673:return hu;case 5125:return uu;case 36294:return du;case 36295:return fu;case 36296:return pu;case 35678:case 36198:case 36298:case 36306:case 35682:return mu;case 35679:case 36299:case 36307:return gu;case 35680:case 36300:case 36308:case 36293:return _u;case 36289:case 36303:case 36311:case 36292:return xu}}function yu(t,e){t.uniform1fv(this.addr,e)}function Mu(t,e){let n=Hn(e,this.size,2);t.uniform2fv(this.addr,n)}function Su(t,e){let n=Hn(e,this.size,3);t.uniform3fv(this.addr,n)}function bu(t,e){let n=Hn(e,this.size,4);t.uniform4fv(this.addr,n)}function Eu(t,e){let n=Hn(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function wu(t,e){let n=Hn(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Tu(t,e){let n=Hn(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Au(t,e){t.uniform1iv(this.addr,e)}function Ru(t,e){t.uniform2iv(this.addr,e)}function Cu(t,e){t.uniform3iv(this.addr,e)}function Iu(t,e){t.uniform4iv(this.addr,e)}function Pu(t,e){t.uniform1uiv(this.addr,e)}function Lu(t,e){t.uniform2uiv(this.addr,e)}function Du(t,e){t.uniform3uiv(this.addr,e)}function Uu(t,e){t.uniform4uiv(this.addr,e)}function Nu(t,e,n){let i=this.cache,s=e.length,r=Fi(n,s);if(!ae(i,r))t.uniform1iv(this.addr,r),oe(i,r);for(let o=0;o!==s;++o)n.setTexture2D(e[o]||_a,r[o])}function Fu(t,e,n){let i=this.cache,s=e.length,r=Fi(n,s);if(!ae(i,r))t.uniform1iv(this.addr,r),oe(i,r);for(let o=0;o!==s;++o)n.setTexture3D(e[o]||va,r[o])}function Ou(t,e,n){let i=this.cache,s=e.length,r=Fi(n,s);if(!ae(i,r))t.uniform1iv(this.addr,r),oe(i,r);for(let o=0;o!==s;++o)n.setTextureCube(e[o]||ya,r[o])}function Bu(t,e,n){let i=this.cache,s=e.length,r=Fi(n,s);if(!ae(i,r))t.uniform1iv(this.addr,r),oe(i,r);for(let o=0;o!==s;++o)n.setTexture2DArray(e[o]||xa,r[o])}function zu(t){switch(t){case 5126:return yu;case 35664:return Mu;case 35665:return Su;case 35666:return bu;case 35674:return Eu;case 35675:return wu;case 35676:return Tu;case 5124:case 35670:return Au;case 35667:case 35671:return Ru;case 35668:case 35672:return Cu;case 35669:case 35673:return Iu;case 5125:return Pu;case 36294:return Lu;case 36295:return Du;case 36296:return Uu;case 35678:case 36198:case 36298:case 36306:case 35682:return Nu;case 35679:case 36299:case 36307:return Fu;case 35680:case 36300:case 36308:case 36293:return Ou;case 36289:case 36303:case 36311:case 36292:return Bu}}class Ma{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=vu(e.type)}}class Sa{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=zu(e.type)}}class ba{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let s=0,r=i.length;s!==r;++s){let o=i[s];o.setValue(t,e[o.id],n)}}}var _s=/(\w+)(\])?(\[|\.)?/g;function zr(t,e){t.seq.push(e),t.map[e.id]=e}function ku(t,e,n){let i=t.name,s=i.length;_s.lastIndex=0;while(!0){let r=_s.exec(i),o=_s.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l)a=a|0;if(c===void 0||c==="["&&o+2===s){zr(n,c===void 0?new Ma(a,t,e):new Sa(a,t,e));break}else{let h=n.map[a];if(h===void 0)h=new ba(a),zr(n,h);n=h}}}class ni{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let s=t.getActiveUniform(e,i),r=t.getUniformLocation(e,s.name);ku(s,r,this)}}setValue(t,e,n,i){let s=this.map[e];if(s!==void 0)s.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];if(i!==void 0)this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,r=e.length;s!==r;++s){let o=e[s],a=n[o.id];if(a.needsUpdate!==!1)o.setValue(t,a.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,s=t.length;i!==s;++i){let r=t[i];if(r.id in e)n.push(r)}return n}}function kr(t,e,n){let i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}var Hu=37297,Gu=0;function Vu(t,e){let n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}var Hr=new Ct;function Wu(t){kt._getMatrix(Hr,kt.workingColorSpace,t);let e=`mat3( ${Hr.elements.map((n)=>n.toFixed(4))} )`;switch(kt.getTransfer(t)){case"linear":return[e,"LinearTransferOETF"];case"srgb":return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Gr(t,e,n){let i=t.getShaderParameter(e,t.COMPILE_STATUS),s=t.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return n.toUpperCase()+`

`+s+`

`+Vu(t.getShaderSource(e),o)}else return s}function Xu(t,e){let n=Wu(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function qu(t,e){let n;switch(e){case 1:n="Linear";break;case 2:n="Reinhard";break;case 3:n="Cineon";break;case 4:n="ACESFilmic";break;case 6:n="AgX";break;case 7:n="Neutral";break;case 5:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Ii=new O;function Yu(){kt.getLuminanceCoefficients(Ii);let t=Ii.x.toFixed(4),e=Ii.y.toFixed(4),n=Ii.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"\treturn dot( weights, rgb );","}"].join(`
`)}function Zu(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ei).join(`
`)}function Ju(t){let e=[];for(let n in t){let i=t[n];if(i===!1)continue;e.push("#define "+n+" "+i)}return e.join(`
`)}function $u(t,e){let n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=t.getActiveAttrib(e,s),o=r.name,a=1;if(r.type===t.FLOAT_MAT2)a=2;if(r.type===t.FLOAT_MAT3)a=3;if(r.type===t.FLOAT_MAT4)a=4;n[o]={type:r.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function ei(t){return t!==""}function Vr(t,e){let n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wr(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ku=/^[ \t]*#include +<([\w\d./]+)>/gm;function ys(t){return t.replace(Ku,ju)}var Qu=new Map;function ju(t,e){let n=Nt[e];if(n===void 0){let i=Qu.get(e);if(i!==void 0)n=Nt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw Error("Can not resolve #include <"+e+">")}return ys(n)}var td=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xr(t){return t.replace(td,ed)}function ed(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function qr(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;if(t.precision==="highp")e+=`
#define HIGH_PRECISION`;else if(t.precision==="mediump")e+=`
#define MEDIUM_PRECISION`;else if(t.precision==="lowp")e+=`
#define LOW_PRECISION`;return e}function nd(t){let e="SHADOWMAP_TYPE_BASIC";if(t.shadowMapType===1)e="SHADOWMAP_TYPE_PCF";else if(t.shadowMapType===2)e="SHADOWMAP_TYPE_PCF_SOFT";else if(t.shadowMapType===3)e="SHADOWMAP_TYPE_VSM";return e}function id(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function sd(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function rd(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function ad(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function od(t,e,n,i){let s=t.getContext(),r=n.defines,o=n.vertexShader,a=n.fragmentShader,l=nd(n),c=id(n),u=sd(n),h=rd(n),f=ad(n),m=Zu(n),_=Ju(r),g=s.createProgram(),p,d,y=n.glslVersion?"#version "+n.glslVersion+`
`:"";if(n.isRawShaderMaterial){if(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ei).join(`
`),p.length>0)p+=`
`;if(d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ei).join(`
`),d.length>0)d+=`
`}else p=[qr(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","\tattribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","\tattribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","\tuniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","\tattribute vec2 uv1;","#endif","#ifdef USE_UV2","\tattribute vec2 uv2;","#endif","#ifdef USE_UV3","\tattribute vec2 uv3;","#endif","#ifdef USE_TANGENT","\tattribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","\tattribute vec4 color;","#elif defined( USE_COLOR )","\tattribute vec3 color;","#endif","#ifdef USE_SKINNING","\tattribute vec4 skinIndex;","\tattribute vec4 skinWeight;","#endif",`
`].filter(ei).join(`
`),d=[qr(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==0?"#define TONE_MAPPING":"",n.toneMapping!==0?Nt.tonemapping_pars_fragment:"",n.toneMapping!==0?qu("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,Xu("linearToOutputTexel",n.outputColorSpace),Yu(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ei).join(`
`);if(o=ys(o),o=Vr(o,n),o=Wr(o,n),a=ys(a),a=Vr(a,n),a=Wr(a,n),o=Xr(o),a=Xr(a),n.isRawShaderMaterial!==!0)y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",n.glslVersion==="300 es"?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion==="300 es"?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d;let x=y+p+o,w=y+d+a,A=kr(s,s.VERTEX_SHADER,x),E=kr(s,s.FRAGMENT_SHADER,w);if(s.attachShader(g,A),s.attachShader(g,E),n.index0AttributeName!==void 0)s.bindAttribLocation(g,0,n.index0AttributeName);else if(n.morphTargets===!0)s.bindAttribLocation(g,0,"position");s.linkProgram(g);function T(C){if(t.debug.checkShaderErrors){let N=s.getProgramInfoLog(g).trim(),V=s.getShaderInfoLog(A).trim(),k=s.getShaderInfoLog(E).trim(),X=!0,H=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(X=!1,typeof t.debug.onShaderError==="function")t.debug.onShaderError(s,g,A,E);else{let K=Gr(s,A,"vertex"),G=Gr(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+N+`
`+K+`
`+G)}else if(N!=="")console.warn("THREE.WebGLProgram: Program Info Log:",N);else if(V===""||k==="")H=!1;if(H)C.diagnostics={runnable:X,programLog:N,vertexShader:{log:V,prefix:p},fragmentShader:{log:k,prefix:d}}}s.deleteShader(A),s.deleteShader(E),U=new ni(s,g),S=$u(s,g)}let U;this.getUniforms=function(){if(U===void 0)T(this);return U};let S;this.getAttributes=function(){if(S===void 0)T(this);return S};let b=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){if(b===!1)b=s.getProgramParameter(g,Hu);return b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Gu++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=A,this.fragmentShader=E,this}var ld=0;class Ea{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let{vertexShader:e,fragmentShader:n}=t,i=this._getShaderStage(e),s=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);if(r.has(i)===!1)r.add(i),i.usedTimes++;if(r.has(s)===!1)r.add(s),s.usedTimes++;return this}remove(t){let e=this.materialCache.get(t);for(let n of e)if(n.usedTimes--,n.usedTimes===0)this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);if(n===void 0)n=new Set,e.set(t,n);return n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);if(n===void 0)n=new wa(t),e.set(t,n);return n}}class wa{constructor(t){this.id=ld++,this.code=t,this.usedTimes=0}}function cd(t,e,n,i,s,r,o){let a=new ws,l=new Ea,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures,m=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){if(c.add(S),S===0)return"uv";return`uv${S}`}function p(S,b,C,N,V){let k=N.fog,X=V.geometry,H=S.isMeshStandardMaterial?N.environment:null,K=(S.isMeshStandardMaterial?n:e).get(S.envMap||H),G=!!K&&K.mapping===306?K.image.height:null,it=_[S.type];if(S.precision!==null){if(m=s.getMaxPrecision(S.precision),m!==S.precision)console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead.")}let st=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,xt=st!==void 0?st.length:0,wt=0;if(X.morphAttributes.position!==void 0)wt=1;if(X.morphAttributes.normal!==void 0)wt=2;if(X.morphAttributes.color!==void 0)wt=3;let Y,tt,yt,Mt;if(it){let Wt=Be[it];Y=Wt.vertexShader,tt=Wt.fragmentShader}else Y=S.vertexShader,tt=S.fragmentShader,l.update(S),yt=l.getVertexShaderID(S),Mt=l.getFragmentShaderID(S);let at=t.getRenderTarget(),Tt=t.state.buffers.depth.getReversed(),Zt=V.isInstancedMesh===!0,Bt=V.isBatchedMesh===!0,zt=!!S.map,ce=!!S.matcap,D=!!K,he=!!S.aoMap,Jt=!!S.lightMap,$t=!!S.bumpMap,pt=!!S.normalMap,ie=!!S.displacementMap,St=!!S.emissiveMap,It=!!S.metalnessMap,R=!!S.roughnessMap,v=S.anisotropy>0,F=S.clearcoat>0,J=S.dispersion>0,Q=S.iridescence>0,W=S.sheen>0,bt=S.transmission>0,ot=v&&!!S.anisotropyMap,dt=F&&!!S.clearcoatMap,Pt=F&&!!S.clearcoatNormalMap,et=F&&!!S.clearcoatRoughnessMap,ut=Q&&!!S.iridescenceMap,Ot=Q&&!!S.iridescenceThicknessMap,At=W&&!!S.sheenColorMap,ft=W&&!!S.sheenRoughnessMap,Lt=!!S.specularMap,Ft=!!S.specularColorMap,ne=!!S.specularIntensityMap,I=bt&&!!S.transmissionMap,j=bt&&!!S.thicknessMap,q=!!S.gradientMap,Z=!!S.alphaMap,ht=S.alphaTest>0,lt=!!S.alphaHash,Ut=!!S.extensions,se=0;if(S.toneMapped){if(at===null||at.isXRRenderTarget===!0)se=t.toneMapping}let ue={shaderID:it,shaderType:S.type,shaderName:S.name,vertexShader:Y,fragmentShader:tt,defines:S.defines,customVertexShaderID:yt,customFragmentShaderID:Mt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Bt,batchingColor:Bt&&V._colorsTexture!==null,instancing:Zt,instancingColor:Zt&&V.instanceColor!==null,instancingMorph:Zt&&V.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:at===null?t.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:"srgb-linear",alphaToCoverage:!!S.alphaToCoverage,map:zt,matcap:ce,envMap:D,envMapMode:D&&K.mapping,envMapCubeUVHeight:G,aoMap:he,lightMap:Jt,bumpMap:$t,normalMap:pt,displacementMap:f&&ie,emissiveMap:St,normalMapObjectSpace:pt&&S.normalMapType===1,normalMapTangentSpace:pt&&S.normalMapType===0,metalnessMap:It,roughnessMap:R,anisotropy:v,anisotropyMap:ot,clearcoat:F,clearcoatMap:dt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:et,dispersion:J,iridescence:Q,iridescenceMap:ut,iridescenceThicknessMap:Ot,sheen:W,sheenColorMap:At,sheenRoughnessMap:ft,specularMap:Lt,specularColorMap:Ft,specularIntensityMap:ne,transmission:bt,transmissionMap:I,thicknessMap:j,gradientMap:q,opaque:S.transparent===!1&&S.blending===1&&S.alphaToCoverage===!1,alphaMap:Z,alphaTest:ht,alphaHash:lt,combine:S.combine,mapUv:zt&&g(S.map.channel),aoMapUv:he&&g(S.aoMap.channel),lightMapUv:Jt&&g(S.lightMap.channel),bumpMapUv:$t&&g(S.bumpMap.channel),normalMapUv:pt&&g(S.normalMap.channel),displacementMapUv:ie&&g(S.displacementMap.channel),emissiveMapUv:St&&g(S.emissiveMap.channel),metalnessMapUv:It&&g(S.metalnessMap.channel),roughnessMapUv:R&&g(S.roughnessMap.channel),anisotropyMapUv:ot&&g(S.anisotropyMap.channel),clearcoatMapUv:dt&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ut&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ot&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:At&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:ft&&g(S.sheenRoughnessMap.channel),specularMapUv:Lt&&g(S.specularMap.channel),specularColorMapUv:Ft&&g(S.specularColorMap.channel),specularIntensityMapUv:ne&&g(S.specularIntensityMap.channel),transmissionMapUv:I&&g(S.transmissionMap.channel),thicknessMapUv:j&&g(S.thicknessMap.channel),alphaMapUv:Z&&g(S.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(pt||v),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!X.attributes.uv&&(zt||Z),fog:!!k,useFog:S.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Tt,skinning:V.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:wt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:t.shadowMap.enabled&&C.length>0,shadowMapType:t.shadowMap.type,toneMapping:se,decodeVideoTexture:zt&&S.map.isVideoTexture===!0&&kt.getTransfer(S.map.colorSpace)==="srgb",decodeVideoTextureEmissive:St&&S.emissiveMap.isVideoTexture===!0&&kt.getTransfer(S.emissiveMap.colorSpace)==="srgb",premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===2,flipSided:S.side===1,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ut&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ut&&S.extensions.multiDraw===!0||Bt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ue.vertexUv1s=c.has(1),ue.vertexUv2s=c.has(2),ue.vertexUv3s=c.has(3),c.clear(),ue}function d(S){let b=[];if(S.shaderID)b.push(S.shaderID);else b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID);if(S.defines!==void 0)for(let C in S.defines)b.push(C),b.push(S.defines[C]);if(S.isRawShaderMaterial===!1)y(b,S),x(b,S),b.push(t.outputColorSpace);return b.push(S.customProgramCacheKey),b.join()}function y(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function x(S,b){if(a.disableAll(),b.supportsVertexTextures)a.enable(0);if(b.instancing)a.enable(1);if(b.instancingColor)a.enable(2);if(b.instancingMorph)a.enable(3);if(b.matcap)a.enable(4);if(b.envMap)a.enable(5);if(b.normalMapObjectSpace)a.enable(6);if(b.normalMapTangentSpace)a.enable(7);if(b.clearcoat)a.enable(8);if(b.iridescence)a.enable(9);if(b.alphaTest)a.enable(10);if(b.vertexColors)a.enable(11);if(b.vertexAlphas)a.enable(12);if(b.vertexUv1s)a.enable(13);if(b.vertexUv2s)a.enable(14);if(b.vertexUv3s)a.enable(15);if(b.vertexTangents)a.enable(16);if(b.anisotropy)a.enable(17);if(b.alphaHash)a.enable(18);if(b.batching)a.enable(19);if(b.dispersion)a.enable(20);if(b.batchingColor)a.enable(21);if(S.push(a.mask),a.disableAll(),b.fog)a.enable(0);if(b.useFog)a.enable(1);if(b.flatShading)a.enable(2);if(b.logarithmicDepthBuffer)a.enable(3);if(b.reverseDepthBuffer)a.enable(4);if(b.skinning)a.enable(5);if(b.morphTargets)a.enable(6);if(b.morphNormals)a.enable(7);if(b.morphColors)a.enable(8);if(b.premultipliedAlpha)a.enable(9);if(b.shadowMapEnabled)a.enable(10);if(b.doubleSided)a.enable(11);if(b.flipSided)a.enable(12);if(b.useDepthPacking)a.enable(13);if(b.dithering)a.enable(14);if(b.transmission)a.enable(15);if(b.sheen)a.enable(16);if(b.opaque)a.enable(17);if(b.pointsUvs)a.enable(18);if(b.decodeVideoTexture)a.enable(19);if(b.decodeVideoTextureEmissive)a.enable(20);if(b.alphaToCoverage)a.enable(21);S.push(a.mask)}function w(S){let b=_[S.type],C;if(b){let N=Be[b];C=jo.clone(N.uniforms)}else C=S.uniforms;return C}function A(S,b){let C;for(let N=0,V=u.length;N<V;N++){let k=u[N];if(k.cacheKey===b){C=k,++C.usedTimes;break}}if(C===void 0)C=new od(t,b,S,r),u.push(C);return C}function E(S){if(--S.usedTimes===0){let b=u.indexOf(S);u[b]=u[u.length-1],u.pop(),S.destroy()}}function T(S){l.remove(S)}function U(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:w,acquireProgram:A,releaseProgram:E,releaseShaderCache:T,programs:u,dispose:U}}function hd(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);if(a===void 0)a={},t.set(o,a);return a}function i(o){t.delete(o)}function s(o,a,l){t.get(o)[a]=l}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function ud(t,e){if(t.groupOrder!==e.groupOrder)return t.groupOrder-e.groupOrder;else if(t.renderOrder!==e.renderOrder)return t.renderOrder-e.renderOrder;else if(t.material.id!==e.material.id)return t.material.id-e.material.id;else if(t.z!==e.z)return t.z-e.z;else return t.id-e.id}function Yr(t,e){if(t.groupOrder!==e.groupOrder)return t.groupOrder-e.groupOrder;else if(t.renderOrder!==e.renderOrder)return t.renderOrder-e.renderOrder;else if(t.z!==e.z)return e.z-t.z;else return t.id-e.id}function Zr(){let t=[],e=0,n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function o(h,f,m,_,g,p){let d=t[e];if(d===void 0)d={id:h.id,object:h,geometry:f,material:m,groupOrder:_,renderOrder:h.renderOrder,z:g,group:p},t[e]=d;else d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=_,d.renderOrder=h.renderOrder,d.z=g,d.group=p;return e++,d}function a(h,f,m,_,g,p){let d=o(h,f,m,_,g,p);if(m.transmission>0)i.push(d);else if(m.transparent===!0)s.push(d);else n.push(d)}function l(h,f,m,_,g,p){let d=o(h,f,m,_,g,p);if(m.transmission>0)i.unshift(d);else if(m.transparent===!0)s.unshift(d);else n.unshift(d)}function c(h,f){if(n.length>1)n.sort(h||ud);if(i.length>1)i.sort(f||Yr);if(s.length>1)s.sort(f||Yr)}function u(){for(let h=e,f=t.length;h<f;h++){let m=t[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function dd(){let t=new WeakMap;function e(i,s){let r=t.get(i),o;if(r===void 0)o=new Zr,t.set(i,[o]);else if(s>=r.length)o=new Zr,r.push(o);else o=r[s];return o}function n(){t=new WeakMap}return{get:e,dispose:n}}function fd(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new O,color:new Yt};break;case"SpotLight":n={position:new O,direction:new O,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new O,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new O,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":n={color:new Yt,position:new O,halfWidth:new O,halfHeight:new O};break}return t[e.id]=n,n}}}function pd(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt,shadowCameraNear:1,shadowCameraFar:1000};break}return t[e.id]=n,n}}}var md=0;function gd(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function _d(t){let e=new fd,n=pd(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);let s=new O,r=new ee,o=new ee;function a(c){let u=0,h=0,f=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let m=0,_=0,g=0,p=0,d=0,y=0,x=0,w=0,A=0,E=0,T=0;c.sort(gd);for(let S=0,b=c.length;S<b;S++){let C=c[S],N=C.color,V=C.intensity,k=C.distance,X=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=N.r*V,h+=N.g*V,f+=N.b*V;else if(C.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(C.sh.coefficients[H],V);T++}else if(C.isDirectionalLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let K=C.shadow,G=n.get(C);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,i.directionalShadow[m]=G,i.directionalShadowMap[m]=X,i.directionalShadowMatrix[m]=C.shadow.matrix,y++}i.directional[m]=H,m++}else if(C.isSpotLight){let H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(N).multiplyScalar(V),H.distance=k,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,i.spot[g]=H;let K=C.shadow;if(C.map){if(i.spotLightMap[A]=C.map,A++,K.updateMatrices(C),C.castShadow)E++}if(i.spotLightMatrix[g]=K.matrix,C.castShadow){let G=n.get(C);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,i.spotShadow[g]=G,i.spotShadowMap[g]=X,w++}g++}else if(C.isRectAreaLight){let H=e.get(C);H.color.copy(N).multiplyScalar(V),H.halfWidth.set(C.width*0.5,0,0),H.halfHeight.set(0,C.height*0.5,0),i.rectArea[p]=H,p++}else if(C.isPointLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){let K=C.shadow,G=n.get(C);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,G.shadowCameraNear=K.camera.near,G.shadowCameraFar=K.camera.far,i.pointShadow[_]=G,i.pointShadowMap[_]=X,i.pointShadowMatrix[_]=C.shadow.matrix,x++}i.point[_]=H,_++}else if(C.isHemisphereLight){let H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(V),H.groundColor.copy(C.groundColor).multiplyScalar(V),i.hemi[d]=H,d++}}if(p>0)if(t.has("OES_texture_float_linear")===!0)i.rectAreaLTC1=rt.LTC_FLOAT_1,i.rectAreaLTC2=rt.LTC_FLOAT_2;else i.rectAreaLTC1=rt.LTC_HALF_1,i.rectAreaLTC2=rt.LTC_HALF_2;i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;let U=i.hash;if(U.directionalLength!==m||U.pointLength!==_||U.spotLength!==g||U.rectAreaLength!==p||U.hemiLength!==d||U.numDirectionalShadows!==y||U.numPointShadows!==x||U.numSpotShadows!==w||U.numSpotMaps!==A||U.numLightProbes!==T)i.directional.length=m,i.spot.length=g,i.rectArea.length=p,i.point.length=_,i.hemi.length=d,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=w+A-E,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=T,U.directionalLength=m,U.pointLength=_,U.spotLength=g,U.rectAreaLength=p,U.hemiLength=d,U.numDirectionalShadows=y,U.numPointShadows=x,U.numSpotShadows=w,U.numSpotMaps=A,U.numLightProbes=T,i.version=md++}function l(c,u){let h=0,f=0,m=0,_=0,g=0,p=u.matrixWorldInverse;for(let d=0,y=c.length;d<y;d++){let x=c[d];if(x.isDirectionalLight){let w=i.directional[h];w.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),h++}else if(x.isSpotLight){let w=i.spot[m];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),m++}else if(x.isRectAreaLight){let w=i.rectArea[_];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),o.identity(),r.copy(x.matrixWorld),r.premultiply(p),o.extractRotation(r),w.halfWidth.set(x.width*0.5,0,0),w.halfHeight.set(0,x.height*0.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){let w=i.point[f];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){let w=i.hemi[g];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:i}}function Jr(t){let e=new _d(t),n=[],i=[];function s(u){c.camera=u,n.length=0,i.length=0}function r(u){n.push(u)}function o(u){i.push(u)}function a(){e.setup(n)}function l(u){e.setupView(n,u)}let c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function xd(t){let e=new WeakMap;function n(s,r=0){let o=e.get(s),a;if(o===void 0)a=new Jr(t),e.set(s,[a]);else if(r>=o.length)a=new Jr(t),o.push(a);else a=o[r];return a}function i(){e=new WeakMap}return{get:n,dispose:i}}class Ta extends ri{static get type(){return"MeshDepthMaterial"}constructor(t){super();this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Aa extends ri{static get type(){return"MeshDistanceMaterial"}constructor(t){super();this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}var vd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yd=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Md(t,e,n){let i=new Ps,s=new Vt,r=new Vt,o=new Gt,a=new Ta({depthPacking:3201}),l=new Aa,c={},u=n.maxTextureSize,h={[0]:1,[1]:0,[2]:2},f=new Ne({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vt},radius:{value:4}},vertexShader:vd,fragmentShader:yd}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let _=new ze;_.setAttribute("position",new Ae(new Float32Array([-1,-1,0.5,3,-1,0.5,-1,3,0.5]),3));let g=new Se(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let d=this.type;this.render=function(E,T,U){if(p.enabled===!1)return;if(p.autoUpdate===!1&&p.needsUpdate===!1)return;if(E.length===0)return;let S=t.getRenderTarget(),b=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),N=t.state;N.setBlending(0),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let V=d!==3&&this.type===3,k=d===3&&this.type!==3;for(let X=0,H=E.length;X<H;X++){let K=E[X],G=K.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let it=G.getFrameExtents();if(s.multiply(it),r.copy(G.mapSize),s.x>u||s.y>u){if(s.x>u)r.x=Math.floor(u/it.x),s.x=r.x*it.x,G.mapSize.x=r.x;if(s.y>u)r.y=Math.floor(u/it.y),s.y=r.y*it.y,G.mapSize.y=r.y}if(G.map===null||V===!0||k===!0){let xt=this.type!==3?{minFilter:1003,magFilter:1003}:{};if(G.map!==null)G.map.dispose();G.map=new ln(s.x,s.y,xt),G.map.texture.name=K.name+".shadowMap",G.camera.updateProjectionMatrix()}t.setRenderTarget(G.map),t.clear();let st=G.getViewportCount();for(let xt=0;xt<st;xt++){let wt=G.getViewport(xt);o.set(r.x*wt.x,r.y*wt.y,r.x*wt.z,r.y*wt.w),N.viewport(o),G.updateMatrices(K,xt),i=G.getFrustum(),w(T,U,G.camera,K,this.type)}if(G.isPointLightShadow!==!0&&this.type===3)y(G,U);G.needsUpdate=!1}d=this.type,p.needsUpdate=!1,t.setRenderTarget(S,b,C)};function y(E,T){let U=e.update(g);if(f.defines.VSM_SAMPLES!==E.blurSamples)f.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0;if(E.mapPass===null)E.mapPass=new ln(s.x,s.y);f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,t.setRenderTarget(E.mapPass),t.clear(),t.renderBufferDirect(T,null,U,f,g,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,t.setRenderTarget(E.map),t.clear(),t.renderBufferDirect(T,null,U,m,g,null)}function x(E,T,U,S){let b=null,C=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)b=C;else if(b=U.isPointLight===!0?l:a,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let N=b.uuid,V=T.uuid,k=c[N];if(k===void 0)k={},c[N]=k;let X=k[V];if(X===void 0)X=b.clone(),k[V]=X,T.addEventListener("dispose",A);b=X}if(b.visible=T.visible,b.wireframe=T.wireframe,S===3)b.side=T.shadowSide!==null?T.shadowSide:T.side;else b.side=T.shadowSide!==null?T.shadowSide:h[T.side];if(b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let N=t.properties.get(b);N.light=U}return b}function w(E,T,U,S,b){if(E.visible===!1)return;if(E.layers.test(T.layers)&&(E.isMesh||E.isLine||E.isPoints)){if((E.castShadow||E.receiveShadow&&b===3)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);let V=e.update(E),k=E.material;if(Array.isArray(k)){let X=V.groups;for(let H=0,K=X.length;H<K;H++){let G=X[H],it=k[G.materialIndex];if(it&&it.visible){let st=x(E,it,S,b);E.onBeforeShadow(t,E,T,U,V,st,G),t.renderBufferDirect(U,null,V,st,E,G),E.onAfterShadow(t,E,T,U,V,st,G)}}}else if(k.visible){let X=x(E,k,S,b);E.onBeforeShadow(t,E,T,U,V,X,null),t.renderBufferDirect(U,null,V,X,E,null),E.onAfterShadow(t,E,T,U,V,X,null)}}}let N=E.children;for(let V=0,k=N.length;V<k;V++)w(N[V],T,U,S,b)}function A(E){E.target.removeEventListener("dispose",A);for(let U in c){let S=c[U],b=E.target.uuid;if(b in S)S[b].dispose(),delete S[b]}}}var Sd={[0]:1,[2]:6,[4]:7,[3]:5,[1]:0,[6]:2,[7]:4,[5]:3};function bd(t,e){function n(){let I=!1,j=new Gt,q=null,Z=new Gt(0,0,0,0);return{setMask:function(ht){if(q!==ht&&!I)t.colorMask(ht,ht,ht,ht),q=ht},setLocked:function(ht){I=ht},setClear:function(ht,lt,Ut,se,ue){if(ue===!0)ht*=se,lt*=se,Ut*=se;if(j.set(ht,lt,Ut,se),Z.equals(j)===!1)t.clearColor(ht,lt,Ut,se),Z.copy(j)},reset:function(){I=!1,q=null,Z.set(-1,0,0,0)}}}function i(){let I=!1,j=!1,q=null,Z=null,ht=null;return{setReversed:function(lt){if(j!==lt){let Ut=e.get("EXT_clip_control");if(j)Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.ZERO_TO_ONE_EXT);else Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.NEGATIVE_ONE_TO_ONE_EXT);let se=ht;ht=null,this.setClear(se)}j=lt},getReversed:function(){return j},setTest:function(lt){if(lt)at(t.DEPTH_TEST);else Tt(t.DEPTH_TEST)},setMask:function(lt){if(q!==lt&&!I)t.depthMask(lt),q=lt},setFunc:function(lt){if(j)lt=Sd[lt];if(Z!==lt){switch(lt){case 0:t.depthFunc(t.NEVER);break;case 1:t.depthFunc(t.ALWAYS);break;case 2:t.depthFunc(t.LESS);break;case 3:t.depthFunc(t.LEQUAL);break;case 4:t.depthFunc(t.EQUAL);break;case 5:t.depthFunc(t.GEQUAL);break;case 6:t.depthFunc(t.GREATER);break;case 7:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Z=lt}},setLocked:function(lt){I=lt},setClear:function(lt){if(ht!==lt){if(j)lt=1-lt;t.clearDepth(lt),ht=lt}},reset:function(){I=!1,q=null,Z=null,ht=null,j=!1}}}function s(){let I=!1,j=null,q=null,Z=null,ht=null,lt=null,Ut=null,se=null,ue=null;return{setTest:function(Wt){if(!I)if(Wt)at(t.STENCIL_TEST);else Tt(t.STENCIL_TEST)},setMask:function(Wt){if(j!==Wt&&!I)t.stencilMask(Wt),j=Wt},setFunc:function(Wt,He,Fe){if(q!==Wt||Z!==He||ht!==Fe)t.stencilFunc(Wt,He,Fe),q=Wt,Z=He,ht=Fe},setOp:function(Wt,He,Fe){if(lt!==Wt||Ut!==He||se!==Fe)t.stencilOp(Wt,He,Fe),lt=Wt,Ut=He,se=Fe},setLocked:function(Wt){I=Wt},setClear:function(Wt){if(ue!==Wt)t.clearStencil(Wt),ue=Wt},reset:function(){I=!1,j=null,q=null,Z=null,ht=null,lt=null,Ut=null,se=null,ue=null}}}let r=new n,o=new i,a=new s,l=new WeakMap,c=new WeakMap,u={},h={},f=new WeakMap,m=[],_=null,g=!1,p=null,d=null,y=null,x=null,w=null,A=null,E=null,T=new Yt(0,0,0),U=0,S=!1,b=null,C=null,N=null,V=null,k=null,X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,K=0,G=t.getParameter(t.VERSION);if(G.indexOf("WebGL")!==-1)K=parseFloat(/^WebGL (\d)/.exec(G)[1]),H=K>=1;else if(G.indexOf("OpenGL ES")!==-1)K=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),H=K>=2;let it=null,st={},xt=t.getParameter(t.SCISSOR_BOX),wt=t.getParameter(t.VIEWPORT),Y=new Gt().fromArray(xt),tt=new Gt().fromArray(wt);function yt(I,j,q,Z){let ht=new Uint8Array(4),lt=t.createTexture();t.bindTexture(I,lt),t.texParameteri(I,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(I,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ut=0;Ut<q;Ut++)if(I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY)t.texImage3D(j,0,t.RGBA,1,1,Z,0,t.RGBA,t.UNSIGNED_BYTE,ht);else t.texImage2D(j+Ut,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ht);return lt}let Mt={};Mt[t.TEXTURE_2D]=yt(t.TEXTURE_2D,t.TEXTURE_2D,1),Mt[t.TEXTURE_CUBE_MAP]=yt(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Mt[t.TEXTURE_2D_ARRAY]=yt(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Mt[t.TEXTURE_3D]=yt(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(t.DEPTH_TEST),o.setFunc(3),$t(!1),pt(1),at(t.CULL_FACE),he(0);function at(I){if(u[I]!==!0)t.enable(I),u[I]=!0}function Tt(I){if(u[I]!==!1)t.disable(I),u[I]=!1}function Zt(I,j){if(h[I]!==j){if(t.bindFramebuffer(I,j),h[I]=j,I===t.DRAW_FRAMEBUFFER)h[t.FRAMEBUFFER]=j;if(I===t.FRAMEBUFFER)h[t.DRAW_FRAMEBUFFER]=j;return!0}return!1}function Bt(I,j){let q=m,Z=!1;if(I){if(q=f.get(j),q===void 0)q=[],f.set(j,q);let ht=I.textures;if(q.length!==ht.length||q[0]!==t.COLOR_ATTACHMENT0){for(let lt=0,Ut=ht.length;lt<Ut;lt++)q[lt]=t.COLOR_ATTACHMENT0+lt;q.length=ht.length,Z=!0}}else if(q[0]!==t.BACK)q[0]=t.BACK,Z=!0;if(Z)t.drawBuffers(q)}function zt(I){if(_!==I)return t.useProgram(I),_=I,!0;return!1}let ce={[100]:t.FUNC_ADD,[101]:t.FUNC_SUBTRACT,[102]:t.FUNC_REVERSE_SUBTRACT};ce[103]=t.MIN,ce[104]=t.MAX;let D={[200]:t.ZERO,[201]:t.ONE,[202]:t.SRC_COLOR,[204]:t.SRC_ALPHA,[210]:t.SRC_ALPHA_SATURATE,[208]:t.DST_COLOR,[206]:t.DST_ALPHA,[203]:t.ONE_MINUS_SRC_COLOR,[205]:t.ONE_MINUS_SRC_ALPHA,[209]:t.ONE_MINUS_DST_COLOR,[207]:t.ONE_MINUS_DST_ALPHA,[211]:t.CONSTANT_COLOR,[212]:t.ONE_MINUS_CONSTANT_COLOR,[213]:t.CONSTANT_ALPHA,[214]:t.ONE_MINUS_CONSTANT_ALPHA};function he(I,j,q,Z,ht,lt,Ut,se,ue,Wt){if(I===0){if(g===!0)Tt(t.BLEND),g=!1;return}if(g===!1)at(t.BLEND),g=!0;if(I!==5){if(I!==p||Wt!==S){if(d!==100||w!==100)t.blendEquation(t.FUNC_ADD),d=100,w=100;if(Wt)switch(I){case 1:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case 2:t.blendFunc(t.ONE,t.ONE);break;case 3:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case 4:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case 1:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case 2:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case 3:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case 4:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}y=null,x=null,A=null,E=null,T.set(0,0,0),U=0,p=I,S=Wt}return}if(ht=ht||j,lt=lt||q,Ut=Ut||Z,j!==d||ht!==w)t.blendEquationSeparate(ce[j],ce[ht]),d=j,w=ht;if(q!==y||Z!==x||lt!==A||Ut!==E)t.blendFuncSeparate(D[q],D[Z],D[lt],D[Ut]),y=q,x=Z,A=lt,E=Ut;if(se.equals(T)===!1||ue!==U)t.blendColor(se.r,se.g,se.b,ue),T.copy(se),U=ue;p=I,S=!1}function Jt(I,j){I.side===2?Tt(t.CULL_FACE):at(t.CULL_FACE);let q=I.side===1;if(j)q=!q;$t(q),I.blending===1&&I.transparent===!1?he(0):he(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);let Z=I.stencilWrite;if(a.setTest(Z),Z)a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass);St(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?at(t.SAMPLE_ALPHA_TO_COVERAGE):Tt(t.SAMPLE_ALPHA_TO_COVERAGE)}function $t(I){if(b!==I){if(I)t.frontFace(t.CW);else t.frontFace(t.CCW);b=I}}function pt(I){if(I!==0){if(at(t.CULL_FACE),I!==C)if(I===1)t.cullFace(t.BACK);else if(I===2)t.cullFace(t.FRONT);else t.cullFace(t.FRONT_AND_BACK)}else Tt(t.CULL_FACE);C=I}function ie(I){if(I!==N){if(H)t.lineWidth(I);N=I}}function St(I,j,q){if(I){if(at(t.POLYGON_OFFSET_FILL),V!==j||k!==q)t.polygonOffset(j,q),V=j,k=q}else Tt(t.POLYGON_OFFSET_FILL)}function It(I){if(I)at(t.SCISSOR_TEST);else Tt(t.SCISSOR_TEST)}function R(I){if(I===void 0)I=t.TEXTURE0+X-1;if(it!==I)t.activeTexture(I),it=I}function v(I,j,q){if(q===void 0)if(it===null)q=t.TEXTURE0+X-1;else q=it;let Z=st[q];if(Z===void 0)Z={type:void 0,texture:void 0},st[q]=Z;if(Z.type!==I||Z.texture!==j){if(it!==q)t.activeTexture(q),it=q;t.bindTexture(I,j||Mt[I]),Z.type=I,Z.texture=j}}function F(){let I=st[it];if(I!==void 0&&I.type!==void 0)t.bindTexture(I.type,null),I.type=void 0,I.texture=void 0}function J(){try{t.compressedTexImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{t.compressedTexImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function W(){try{t.texSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function bt(){try{t.texSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function dt(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pt(){try{t.texStorage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function et(){try{t.texStorage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ut(){try{t.texImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ot(){try{t.texImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(I){if(Y.equals(I)===!1)t.scissor(I.x,I.y,I.z,I.w),Y.copy(I)}function ft(I){if(tt.equals(I)===!1)t.viewport(I.x,I.y,I.z,I.w),tt.copy(I)}function Lt(I,j){let q=c.get(j);if(q===void 0)q=new WeakMap,c.set(j,q);let Z=q.get(I);if(Z===void 0)Z=t.getUniformBlockIndex(j,I.name),q.set(I,Z)}function Ft(I,j){let Z=c.get(j).get(I);if(l.get(j)!==Z)t.uniformBlockBinding(j,Z,I.__bindingPointIndex),l.set(j,Z)}function ne(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},it=null,st={},h={},f=new WeakMap,m=[],_=null,g=!1,p=null,d=null,y=null,x=null,w=null,A=null,E=null,T=new Yt(0,0,0),U=0,S=!1,b=null,C=null,N=null,V=null,k=null,Y.set(0,0,t.canvas.width,t.canvas.height),tt.set(0,0,t.canvas.width,t.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:at,disable:Tt,bindFramebuffer:Zt,drawBuffers:Bt,useProgram:zt,setBlending:he,setMaterial:Jt,setFlipSided:$t,setCullFace:pt,setLineWidth:ie,setPolygonOffset:St,setScissorTest:It,activeTexture:R,bindTexture:v,unbindTexture:F,compressedTexImage2D:J,compressedTexImage3D:Q,texImage2D:ut,texImage3D:Ot,updateUBOMapping:Lt,uniformBlockBinding:Ft,texStorage2D:Pt,texStorage3D:et,texSubImage2D:W,texSubImage3D:bt,compressedTexSubImage2D:ot,compressedTexSubImage3D:dt,scissor:At,viewport:ft,reset:ne}}function $r(t,e,n,i){let s=Ed(i);switch(n){case 1021:return t*e;case 1024:return t*e;case 1025:return t*e*2;case 1028:return t*e/s.components*s.byteLength;case 1029:return t*e/s.components*s.byteLength;case 1030:return t*e*2/s.components*s.byteLength;case 1031:return t*e*2/s.components*s.byteLength;case 1022:return t*e*3/s.components*s.byteLength;case 1023:return t*e*4/s.components*s.byteLength;case 1033:return t*e*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(t,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(t,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(t/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(t/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ed(t){switch(t){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${t}.`)}function wd(t,e,n,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Vt,u=new WeakMap,h,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(R){}function _(R,v){return m?new OffscreenCanvas(R,v):ii("canvas")}function g(R,v,F){let J=1,Q=It(R);if(Q.width>F||Q.height>F)J=F/Math.max(Q.width,Q.height);if(J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let W=Math.floor(J*Q.width),bt=Math.floor(J*Q.height);if(h===void 0)h=_(W,bt);let ot=v?_(W,bt):h;return ot.width=W,ot.height=bt,ot.getContext("2d").drawImage(R,0,0,W,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+W+"x"+bt+")."),ot}else{if("data"in R)console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+").");return R}return R}function p(R){return R.generateMipmaps}function d(R){t.generateMipmap(R)}function y(R){if(R.isWebGLCubeRenderTarget)return t.TEXTURE_CUBE_MAP;if(R.isWebGL3DRenderTarget)return t.TEXTURE_3D;if(R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture)return t.TEXTURE_2D_ARRAY;return t.TEXTURE_2D}function x(R,v,F,J,Q=!1){if(R!==null){if(t[R]!==void 0)return t[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let W=v;if(v===t.RED){if(F===t.FLOAT)W=t.R32F;if(F===t.HALF_FLOAT)W=t.R16F;if(F===t.UNSIGNED_BYTE)W=t.R8}if(v===t.RED_INTEGER){if(F===t.UNSIGNED_BYTE)W=t.R8UI;if(F===t.UNSIGNED_SHORT)W=t.R16UI;if(F===t.UNSIGNED_INT)W=t.R32UI;if(F===t.BYTE)W=t.R8I;if(F===t.SHORT)W=t.R16I;if(F===t.INT)W=t.R32I}if(v===t.RG){if(F===t.FLOAT)W=t.RG32F;if(F===t.HALF_FLOAT)W=t.RG16F;if(F===t.UNSIGNED_BYTE)W=t.RG8}if(v===t.RG_INTEGER){if(F===t.UNSIGNED_BYTE)W=t.RG8UI;if(F===t.UNSIGNED_SHORT)W=t.RG16UI;if(F===t.UNSIGNED_INT)W=t.RG32UI;if(F===t.BYTE)W=t.RG8I;if(F===t.SHORT)W=t.RG16I;if(F===t.INT)W=t.RG32I}if(v===t.RGB_INTEGER){if(F===t.UNSIGNED_BYTE)W=t.RGB8UI;if(F===t.UNSIGNED_SHORT)W=t.RGB16UI;if(F===t.UNSIGNED_INT)W=t.RGB32UI;if(F===t.BYTE)W=t.RGB8I;if(F===t.SHORT)W=t.RGB16I;if(F===t.INT)W=t.RGB32I}if(v===t.RGBA_INTEGER){if(F===t.UNSIGNED_BYTE)W=t.RGBA8UI;if(F===t.UNSIGNED_SHORT)W=t.RGBA16UI;if(F===t.UNSIGNED_INT)W=t.RGBA32UI;if(F===t.BYTE)W=t.RGBA8I;if(F===t.SHORT)W=t.RGBA16I;if(F===t.INT)W=t.RGBA32I}if(v===t.RGB){if(F===t.UNSIGNED_INT_5_9_9_9_REV)W=t.RGB9_E5}if(v===t.RGBA){let bt=Q?"linear":kt.getTransfer(J);if(F===t.FLOAT)W=t.RGBA32F;if(F===t.HALF_FLOAT)W=t.RGBA16F;if(F===t.UNSIGNED_BYTE)W=bt==="srgb"?t.SRGB8_ALPHA8:t.RGBA8;if(F===t.UNSIGNED_SHORT_4_4_4_4)W=t.RGBA4;if(F===t.UNSIGNED_SHORT_5_5_5_1)W=t.RGB5_A1}if(W===t.R16F||W===t.R32F||W===t.RG16F||W===t.RG32F||W===t.RGBA16F||W===t.RGBA32F)e.get("EXT_color_buffer_float");return W}function w(R,v){let F;if(R){if(v===null||v===1014||v===1020)F=t.DEPTH24_STENCIL8;else if(v===1015)F=t.DEPTH32F_STENCIL8;else if(v===1012)F=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")}else if(v===null||v===1014||v===1020)F=t.DEPTH_COMPONENT24;else if(v===1015)F=t.DEPTH_COMPONENT32F;else if(v===1012)F=t.DEPTH_COMPONENT16;return F}function A(R,v){if(p(R)===!0||R.isFramebufferTexture&&R.minFilter!==1003&&R.minFilter!==1006)return Math.log2(Math.max(v.width,v.height))+1;else if(R.mipmaps!==void 0&&R.mipmaps.length>0)return R.mipmaps.length;else if(R.isCompressedTexture&&Array.isArray(R.image))return v.mipmaps.length;else return 1}function E(R){let v=R.target;if(v.removeEventListener("dispose",E),U(v),v.isVideoTexture)u.delete(v)}function T(R){let v=R.target;v.removeEventListener("dispose",T),b(v)}function U(R){let v=i.get(R);if(v.__webglInit===void 0)return;let F=R.source,J=f.get(F);if(J){let Q=J[v.__cacheKey];if(Q.usedTimes--,Q.usedTimes===0)S(R);if(Object.keys(J).length===0)f.delete(F)}i.remove(R)}function S(R){let v=i.get(R);t.deleteTexture(v.__webglTexture);let F=R.source,J=f.get(F);delete J[v.__cacheKey],o.memory.textures--}function b(R){let v=i.get(R);if(R.depthTexture)R.depthTexture.dispose(),i.remove(R.depthTexture);if(R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(v.__webglFramebuffer[J]))for(let Q=0;Q<v.__webglFramebuffer[J].length;Q++)t.deleteFramebuffer(v.__webglFramebuffer[J][Q]);else t.deleteFramebuffer(v.__webglFramebuffer[J]);if(v.__webglDepthbuffer)t.deleteRenderbuffer(v.__webglDepthbuffer[J])}else{if(Array.isArray(v.__webglFramebuffer))for(let J=0;J<v.__webglFramebuffer.length;J++)t.deleteFramebuffer(v.__webglFramebuffer[J]);else t.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer)t.deleteRenderbuffer(v.__webglDepthbuffer);if(v.__webglMultisampledFramebuffer)t.deleteFramebuffer(v.__webglMultisampledFramebuffer);if(v.__webglColorRenderbuffer){for(let J=0;J<v.__webglColorRenderbuffer.length;J++)if(v.__webglColorRenderbuffer[J])t.deleteRenderbuffer(v.__webglColorRenderbuffer[J])}if(v.__webglDepthRenderbuffer)t.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let F=R.textures;for(let J=0,Q=F.length;J<Q;J++){let W=i.get(F[J]);if(W.__webglTexture)t.deleteTexture(W.__webglTexture),o.memory.textures--;i.remove(F[J])}i.remove(R)}let C=0;function N(){C=0}function V(){let R=C;if(R>=s.maxTextures)console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures);return C+=1,R}function k(R){let v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function X(R,v){let F=i.get(R);if(R.isVideoTexture)ie(R);if(R.isRenderTargetTexture===!1&&R.version>0&&F.__version!==R.version){let J=R.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{tt(F,R,v);return}}n.bindTexture(t.TEXTURE_2D,F.__webglTexture,t.TEXTURE0+v)}function H(R,v){let F=i.get(R);if(R.version>0&&F.__version!==R.version){tt(F,R,v);return}n.bindTexture(t.TEXTURE_2D_ARRAY,F.__webglTexture,t.TEXTURE0+v)}function K(R,v){let F=i.get(R);if(R.version>0&&F.__version!==R.version){tt(F,R,v);return}n.bindTexture(t.TEXTURE_3D,F.__webglTexture,t.TEXTURE0+v)}function G(R,v){let F=i.get(R);if(R.version>0&&F.__version!==R.version){yt(F,R,v);return}n.bindTexture(t.TEXTURE_CUBE_MAP,F.__webglTexture,t.TEXTURE0+v)}let it={[1000]:t.REPEAT,[1001]:t.CLAMP_TO_EDGE,[1002]:t.MIRRORED_REPEAT},st={[1003]:t.NEAREST,[1004]:t.NEAREST_MIPMAP_NEAREST,[1005]:t.NEAREST_MIPMAP_LINEAR,[1006]:t.LINEAR,[1007]:t.LINEAR_MIPMAP_NEAREST,[1008]:t.LINEAR_MIPMAP_LINEAR},xt={[512]:t.NEVER,[519]:t.ALWAYS,[513]:t.LESS,[515]:t.LEQUAL,[514]:t.EQUAL,[518]:t.GEQUAL,[516]:t.GREATER,[517]:t.NOTEQUAL};function wt(R,v){if(v.type===1015&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===1006||v.magFilter===1007||v.magFilter===1005||v.magFilter===1008||v.minFilter===1006||v.minFilter===1007||v.minFilter===1005||v.minFilter===1008))console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.");if(t.texParameteri(R,t.TEXTURE_WRAP_S,it[v.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,it[v.wrapT]),R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)t.texParameteri(R,t.TEXTURE_WRAP_R,it[v.wrapR]);if(t.texParameteri(R,t.TEXTURE_MAG_FILTER,st[v.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,st[v.minFilter]),v.compareFunction)t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,xt[v.compareFunction]);if(e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===1003)return;if(v.minFilter!==1005&&v.minFilter!==1008)return;if(v.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Y(R,v){let F=!1;if(R.__webglInit===void 0)R.__webglInit=!0,v.addEventListener("dispose",E);let J=v.source,Q=f.get(J);if(Q===void 0)Q={},f.set(J,Q);let W=k(v);if(W!==R.__cacheKey){if(Q[W]===void 0)Q[W]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,F=!0;Q[W].usedTimes++;let bt=Q[R.__cacheKey];if(bt!==void 0){if(Q[R.__cacheKey].usedTimes--,bt.usedTimes===0)S(v)}R.__cacheKey=W,R.__webglTexture=Q[W].texture}return F}function tt(R,v,F){let J=t.TEXTURE_2D;if(v.isDataArrayTexture||v.isCompressedArrayTexture)J=t.TEXTURE_2D_ARRAY;if(v.isData3DTexture)J=t.TEXTURE_3D;let Q=Y(R,v),W=v.source;n.bindTexture(J,R.__webglTexture,t.TEXTURE0+F);let bt=i.get(W);if(W.version!==bt.__version||Q===!0){n.activeTexture(t.TEXTURE0+F);let ot=kt.getPrimaries(kt.workingColorSpace),dt=v.colorSpace===""?null:kt.getPrimaries(v.colorSpace),Pt=v.colorSpace===""||ot===dt?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);let et=g(v.image,!1,s.maxTextureSize);et=St(v,et);let ut=r.convert(v.format,v.colorSpace),Ot=r.convert(v.type),At=x(v.internalFormat,ut,Ot,v.colorSpace,v.isVideoTexture);wt(J,v);let ft,Lt=v.mipmaps,Ft=v.isVideoTexture!==!0,ne=bt.__version===void 0||Q===!0,I=W.dataReady,j=A(v,et);if(v.isDepthTexture){if(At=w(v.format===1027,v.type),ne)if(Ft)n.texStorage2D(t.TEXTURE_2D,1,At,et.width,et.height);else n.texImage2D(t.TEXTURE_2D,0,At,et.width,et.height,0,ut,Ot,null)}else if(v.isDataTexture)if(Lt.length>0){if(Ft&&ne)n.texStorage2D(t.TEXTURE_2D,j,At,Lt[0].width,Lt[0].height);for(let q=0,Z=Lt.length;q<Z;q++)if(ft=Lt[q],Ft){if(I)n.texSubImage2D(t.TEXTURE_2D,q,0,0,ft.width,ft.height,ut,Ot,ft.data)}else n.texImage2D(t.TEXTURE_2D,q,At,ft.width,ft.height,0,ut,Ot,ft.data);v.generateMipmaps=!1}else if(Ft){if(ne)n.texStorage2D(t.TEXTURE_2D,j,At,et.width,et.height);if(I)n.texSubImage2D(t.TEXTURE_2D,0,0,0,et.width,et.height,ut,Ot,et.data)}else n.texImage2D(t.TEXTURE_2D,0,At,et.width,et.height,0,ut,Ot,et.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){if(Ft&&ne)n.texStorage3D(t.TEXTURE_2D_ARRAY,j,At,Lt[0].width,Lt[0].height,et.depth);for(let q=0,Z=Lt.length;q<Z;q++)if(ft=Lt[q],v.format!==1023)if(ut!==null)if(Ft){if(I)if(v.layerUpdates.size>0){let ht=$r(ft.width,ft.height,v.format,v.type);for(let lt of v.layerUpdates){let Ut=ft.data.subarray(lt*ht/ft.data.BYTES_PER_ELEMENT,(lt+1)*ht/ft.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,lt,ft.width,ft.height,1,ut,Ut)}v.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,ft.width,ft.height,et.depth,ut,ft.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,q,At,ft.width,ft.height,et.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(Ft){if(I)n.texSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,ft.width,ft.height,et.depth,ut,Ot,ft.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,q,At,ft.width,ft.height,et.depth,0,ut,Ot,ft.data)}else{if(Ft&&ne)n.texStorage2D(t.TEXTURE_2D,j,At,Lt[0].width,Lt[0].height);for(let q=0,Z=Lt.length;q<Z;q++)if(ft=Lt[q],v.format!==1023)if(ut!==null)if(Ft){if(I)n.compressedTexSubImage2D(t.TEXTURE_2D,q,0,0,ft.width,ft.height,ut,ft.data)}else n.compressedTexImage2D(t.TEXTURE_2D,q,At,ft.width,ft.height,0,ft.data);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(Ft){if(I)n.texSubImage2D(t.TEXTURE_2D,q,0,0,ft.width,ft.height,ut,Ot,ft.data)}else n.texImage2D(t.TEXTURE_2D,q,At,ft.width,ft.height,0,ut,Ot,ft.data)}else if(v.isDataArrayTexture)if(Ft){if(ne)n.texStorage3D(t.TEXTURE_2D_ARRAY,j,At,et.width,et.height,et.depth);if(I)if(v.layerUpdates.size>0){let q=$r(et.width,et.height,v.format,v.type);for(let Z of v.layerUpdates){let ht=et.data.subarray(Z*q/et.data.BYTES_PER_ELEMENT,(Z+1)*q/et.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Z,et.width,et.height,1,ut,Ot,ht)}v.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,ut,Ot,et.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,At,et.width,et.height,et.depth,0,ut,Ot,et.data);else if(v.isData3DTexture)if(Ft){if(ne)n.texStorage3D(t.TEXTURE_3D,j,At,et.width,et.height,et.depth);if(I)n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,ut,Ot,et.data)}else n.texImage3D(t.TEXTURE_3D,0,At,et.width,et.height,et.depth,0,ut,Ot,et.data);else if(v.isFramebufferTexture){if(ne)if(Ft)n.texStorage2D(t.TEXTURE_2D,j,At,et.width,et.height);else{let{width:q,height:Z}=et;for(let ht=0;ht<j;ht++)n.texImage2D(t.TEXTURE_2D,ht,At,q,Z,0,ut,Ot,null),q>>=1,Z>>=1}}else if(Lt.length>0){if(Ft&&ne){let q=It(Lt[0]);n.texStorage2D(t.TEXTURE_2D,j,At,q.width,q.height)}for(let q=0,Z=Lt.length;q<Z;q++)if(ft=Lt[q],Ft){if(I)n.texSubImage2D(t.TEXTURE_2D,q,0,0,ut,Ot,ft)}else n.texImage2D(t.TEXTURE_2D,q,At,ut,Ot,ft);v.generateMipmaps=!1}else if(Ft){if(ne){let q=It(et);n.texStorage2D(t.TEXTURE_2D,j,At,q.width,q.height)}if(I)n.texSubImage2D(t.TEXTURE_2D,0,0,0,ut,Ot,et)}else n.texImage2D(t.TEXTURE_2D,0,At,ut,Ot,et);if(p(v))d(J);if(bt.__version=W.version,v.onUpdate)v.onUpdate(v)}R.__version=v.version}function yt(R,v,F){if(v.image.length!==6)return;let J=Y(R,v),Q=v.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+F);let W=i.get(Q);if(Q.version!==W.__version||J===!0){n.activeTexture(t.TEXTURE0+F);let bt=kt.getPrimaries(kt.workingColorSpace),ot=v.colorSpace===""?null:kt.getPrimaries(v.colorSpace),dt=v.colorSpace===""||bt===ot?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);let Pt=v.isCompressedTexture||v.image[0].isCompressedTexture,et=v.image[0]&&v.image[0].isDataTexture,ut=[];for(let Z=0;Z<6;Z++){if(!Pt&&!et)ut[Z]=g(v.image[Z],!0,s.maxCubemapSize);else ut[Z]=et?v.image[Z].image:v.image[Z];ut[Z]=St(v,ut[Z])}let Ot=ut[0],At=r.convert(v.format,v.colorSpace),ft=r.convert(v.type),Lt=x(v.internalFormat,At,ft,v.colorSpace),Ft=v.isVideoTexture!==!0,ne=W.__version===void 0||J===!0,I=Q.dataReady,j=A(v,Ot);wt(t.TEXTURE_CUBE_MAP,v);let q;if(Pt){if(Ft&&ne)n.texStorage2D(t.TEXTURE_CUBE_MAP,j,Lt,Ot.width,Ot.height);for(let Z=0;Z<6;Z++){q=ut[Z].mipmaps;for(let ht=0;ht<q.length;ht++){let lt=q[ht];if(v.format!==1023)if(At!==null)if(Ft){if(I)n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht,0,0,lt.width,lt.height,At,lt.data)}else n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht,Lt,lt.width,lt.height,0,lt.data);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()");else if(Ft){if(I)n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht,0,0,lt.width,lt.height,At,ft,lt.data)}else n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht,Lt,lt.width,lt.height,0,At,ft,lt.data)}}}else{if(q=v.mipmaps,Ft&&ne){if(q.length>0)j++;let Z=It(ut[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,j,Lt,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(et){if(Ft){if(I)n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ut[Z].width,ut[Z].height,At,ft,ut[Z].data)}else n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Lt,ut[Z].width,ut[Z].height,0,At,ft,ut[Z].data);for(let ht=0;ht<q.length;ht++){let Ut=q[ht].image[Z].image;if(Ft){if(I)n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht+1,0,0,Ut.width,Ut.height,At,ft,Ut.data)}else n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht+1,Lt,Ut.width,Ut.height,0,At,ft,Ut.data)}}else{if(Ft){if(I)n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,At,ft,ut[Z])}else n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Lt,At,ft,ut[Z]);for(let ht=0;ht<q.length;ht++){let lt=q[ht];if(Ft){if(I)n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht+1,0,0,At,ft,lt.image[Z])}else n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ht+1,Lt,At,ft,lt.image[Z])}}}if(p(v))d(t.TEXTURE_CUBE_MAP);if(W.__version=Q.version,v.onUpdate)v.onUpdate(v)}R.__version=v.version}function Mt(R,v,F,J,Q,W){let bt=r.convert(F.format,F.colorSpace),ot=r.convert(F.type),dt=x(F.internalFormat,bt,ot,F.colorSpace),Pt=i.get(v),et=i.get(F);if(et.__renderTarget=v,!Pt.__hasExternalTextures){let ut=Math.max(1,v.width>>W),Ot=Math.max(1,v.height>>W);if(Q===t.TEXTURE_3D||Q===t.TEXTURE_2D_ARRAY)n.texImage3D(Q,W,dt,ut,Ot,v.depth,0,bt,ot,null);else n.texImage2D(Q,W,dt,ut,Ot,0,bt,ot,null)}if(n.bindFramebuffer(t.FRAMEBUFFER,R),pt(v))a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,J,Q,et.__webglTexture,0,$t(v));else if(Q===t.TEXTURE_2D||Q>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)t.framebufferTexture2D(t.FRAMEBUFFER,J,Q,et.__webglTexture,W);n.bindFramebuffer(t.FRAMEBUFFER,null)}function at(R,v,F){if(t.bindRenderbuffer(t.RENDERBUFFER,R),v.depthBuffer){let J=v.depthTexture,Q=J&&J.isDepthTexture?J.type:null,W=w(v.stencilBuffer,Q),bt=v.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ot=$t(v);if(pt(v))a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ot,W,v.width,v.height);else if(F)t.renderbufferStorageMultisample(t.RENDERBUFFER,ot,W,v.width,v.height);else t.renderbufferStorage(t.RENDERBUFFER,W,v.width,v.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,bt,t.RENDERBUFFER,R)}else{let J=v.textures;for(let Q=0;Q<J.length;Q++){let W=J[Q],bt=r.convert(W.format,W.colorSpace),ot=r.convert(W.type),dt=x(W.internalFormat,bt,ot,W.colorSpace),Pt=$t(v);if(F&&pt(v)===!1)t.renderbufferStorageMultisample(t.RENDERBUFFER,Pt,dt,v.width,v.height);else if(pt(v))a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Pt,dt,v.width,v.height);else t.renderbufferStorage(t.RENDERBUFFER,dt,v.width,v.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Tt(R,v){if(v&&v.isWebGLCubeRenderTarget)throw Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=i.get(v.depthTexture);if(J.__renderTarget=v,!J.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0;X(v.depthTexture,0);let Q=J.__webglTexture,W=$t(v);if(v.depthTexture.format===1026)if(pt(v))a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0,W);else t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0);else if(v.depthTexture.format===1027)if(pt(v))a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0,W);else t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0);else throw Error("Unknown depthTexture format")}function Zt(R){let v=i.get(R),F=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){let J=R.depthTexture;if(v.__depthDisposeCallback)v.__depthDisposeCallback();if(J){let Q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,J.removeEventListener("dispose",Q)};J.addEventListener("dispose",Q),v.__depthDisposeCallback=Q}v.__boundDepthTexture=J}if(R.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw Error("target.depthTexture not supported in Cube render targets");Tt(v.__webglFramebuffer,R)}else if(F){v.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[J]),v.__webglDepthbuffer[J]===void 0)v.__webglDepthbuffer[J]=t.createRenderbuffer(),at(v.__webglDepthbuffer[J],R,!1);else{let Q=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,W=v.__webglDepthbuffer[J];t.bindRenderbuffer(t.RENDERBUFFER,W),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,W)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=t.createRenderbuffer(),at(v.__webglDepthbuffer,R,!1);else{let J=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Q=v.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Q),t.framebufferRenderbuffer(t.FRAMEBUFFER,J,t.RENDERBUFFER,Q)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Bt(R,v,F){let J=i.get(R);if(v!==void 0)Mt(J.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0);if(F!==void 0)Zt(R)}function zt(R){let v=R.texture,F=i.get(R),J=i.get(v);R.addEventListener("dispose",T);let Q=R.textures,W=R.isWebGLCubeRenderTarget===!0,bt=Q.length>1;if(!bt){if(J.__webglTexture===void 0)J.__webglTexture=t.createTexture();J.__version=v.version,o.memory.textures++}if(W){F.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[ot]=[];for(let dt=0;dt<v.mipmaps.length;dt++)F.__webglFramebuffer[ot][dt]=t.createFramebuffer()}else F.__webglFramebuffer[ot]=t.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let ot=0;ot<v.mipmaps.length;ot++)F.__webglFramebuffer[ot]=t.createFramebuffer()}else F.__webglFramebuffer=t.createFramebuffer();if(bt)for(let ot=0,dt=Q.length;ot<dt;ot++){let Pt=i.get(Q[ot]);if(Pt.__webglTexture===void 0)Pt.__webglTexture=t.createTexture(),o.memory.textures++}if(R.samples>0&&pt(R)===!1){F.__webglMultisampledFramebuffer=t.createFramebuffer(),F.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ot=0;ot<Q.length;ot++){let dt=Q[ot];F.__webglColorRenderbuffer[ot]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,F.__webglColorRenderbuffer[ot]);let Pt=r.convert(dt.format,dt.colorSpace),et=r.convert(dt.type),ut=x(dt.internalFormat,Pt,et,dt.colorSpace,R.isXRRenderTarget===!0),Ot=$t(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ot,ut,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ot,t.RENDERBUFFER,F.__webglColorRenderbuffer[ot])}if(t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer)F.__webglDepthRenderbuffer=t.createRenderbuffer(),at(F.__webglDepthRenderbuffer,R,!0);n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(W){n.bindTexture(t.TEXTURE_CUBE_MAP,J.__webglTexture),wt(t.TEXTURE_CUBE_MAP,v);for(let ot=0;ot<6;ot++)if(v.mipmaps&&v.mipmaps.length>0)for(let dt=0;dt<v.mipmaps.length;dt++)Mt(F.__webglFramebuffer[ot][dt],R,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ot,dt);else Mt(F.__webglFramebuffer[ot],R,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);if(p(v))d(t.TEXTURE_CUBE_MAP);n.unbindTexture()}else if(bt){for(let ot=0,dt=Q.length;ot<dt;ot++){let Pt=Q[ot],et=i.get(Pt);if(n.bindTexture(t.TEXTURE_2D,et.__webglTexture),wt(t.TEXTURE_2D,Pt),Mt(F.__webglFramebuffer,R,Pt,t.COLOR_ATTACHMENT0+ot,t.TEXTURE_2D,0),p(Pt))d(t.TEXTURE_2D)}n.unbindTexture()}else{let ot=t.TEXTURE_2D;if(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)ot=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY;if(n.bindTexture(ot,J.__webglTexture),wt(ot,v),v.mipmaps&&v.mipmaps.length>0)for(let dt=0;dt<v.mipmaps.length;dt++)Mt(F.__webglFramebuffer[dt],R,v,t.COLOR_ATTACHMENT0,ot,dt);else Mt(F.__webglFramebuffer,R,v,t.COLOR_ATTACHMENT0,ot,0);if(p(v))d(ot);n.unbindTexture()}if(R.depthBuffer)Zt(R)}function ce(R){let v=R.textures;for(let F=0,J=v.length;F<J;F++){let Q=v[F];if(p(Q)){let W=y(R),bt=i.get(Q).__webglTexture;n.bindTexture(W,bt),d(W),n.unbindTexture()}}}let D=[],he=[];function Jt(R){if(R.samples>0){if(pt(R)===!1){let{textures:v,width:F,height:J}=R,Q=t.COLOR_BUFFER_BIT,W=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,bt=i.get(R),ot=v.length>1;if(ot)for(let dt=0;dt<v.length;dt++)n.bindFramebuffer(t.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+dt,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,bt.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+dt,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let dt=0;dt<v.length;dt++){if(R.resolveDepthBuffer){if(R.depthBuffer)Q|=t.DEPTH_BUFFER_BIT;if(R.stencilBuffer&&R.resolveStencilBuffer)Q|=t.STENCIL_BUFFER_BIT}if(ot){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,bt.__webglColorRenderbuffer[dt]);let Pt=i.get(v[dt]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Pt,0)}if(t.blitFramebuffer(0,0,F,J,0,0,F,J,Q,t.NEAREST),l===!0){if(D.length=0,he.length=0,D.push(t.COLOR_ATTACHMENT0+dt),R.depthBuffer&&R.resolveDepthBuffer===!1)D.push(W),he.push(W),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,he);t.invalidateFramebuffer(t.READ_FRAMEBUFFER,D)}}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ot)for(let dt=0;dt<v.length;dt++){n.bindFramebuffer(t.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+dt,t.RENDERBUFFER,bt.__webglColorRenderbuffer[dt]);let Pt=i.get(v[dt]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,bt.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+dt,t.TEXTURE_2D,Pt,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let v=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[v])}}}function $t(R){return Math.min(s.maxSamples,R.samples)}function pt(R){let v=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function ie(R){let v=o.render.frame;if(u.get(R)!==v)u.set(R,v),R.update()}function St(R,v){let{colorSpace:F,format:J,type:Q}=R;if(R.isCompressedTexture===!0||R.isVideoTexture===!0)return v;if(F!=="srgb-linear"&&F!=="")if(kt.getTransfer(F)==="srgb"){if(J!==1023||Q!==1009)console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.")}else console.error("THREE.WebGLTextures: Unsupported texture color space:",F);return v}function It(R){if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement)c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height;else if(typeof VideoFrame<"u"&&R instanceof VideoFrame)c.width=R.displayWidth,c.height=R.displayHeight;else c.width=R.width,c.height=R.height;return c}this.allocateTextureUnit=V,this.resetTextureUnits=N,this.setTexture2D=X,this.setTexture2DArray=H,this.setTexture3D=K,this.setTextureCube=G,this.rebindTextures=Bt,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=pt}function Td(t,e){function n(i,s=""){let r,o=kt.getTransfer(s);if(i===1009)return t.UNSIGNED_BYTE;if(i===1017)return t.UNSIGNED_SHORT_4_4_4_4;if(i===1018)return t.UNSIGNED_SHORT_5_5_5_1;if(i===35902)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===1010)return t.BYTE;if(i===1011)return t.SHORT;if(i===1012)return t.UNSIGNED_SHORT;if(i===1013)return t.INT;if(i===1014)return t.UNSIGNED_INT;if(i===1015)return t.FLOAT;if(i===1016)return t.HALF_FLOAT;if(i===1021)return t.ALPHA;if(i===1022)return t.RGB;if(i===1023)return t.RGBA;if(i===1024)return t.LUMINANCE;if(i===1025)return t.LUMINANCE_ALPHA;if(i===1026)return t.DEPTH_COMPONENT;if(i===1027)return t.DEPTH_STENCIL;if(i===1028)return t.RED;if(i===1029)return t.RED_INTEGER;if(i===1030)return t.RG;if(i===1031)return t.RG_INTEGER;if(i===1033)return t.RGBA_INTEGER;if(i===33776||i===33777||i===33778||i===33779)if(o==="srgb")if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===35840||i===35841||i===35842||i===35843)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===36196||i===37492||i===37496)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===36196||i===37492)return o==="srgb"?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===37496)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===37808||i===37809||i===37810||i===37811||i===37812||i===37813||i===37814||i===37815||i===37816||i===37817||i===37818||i===37819||i===37820||i===37821)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===37808)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===37809)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===37810)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===37811)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===37812)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===37813)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===37814)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===37815)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===37816)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===37817)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===37818)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===37819)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===37820)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===37821)return o==="srgb"?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===36492||i===36494||i===36495)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===36492)return o==="srgb"?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===36283||i===36284||i===36285||i===36286)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===36492)return r.COMPRESSED_RED_RGTC1_EXT;if(i===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;if(i===1020)return t.UNSIGNED_INT_24_8;return t[i]!==void 0?t[i]:null}return{convert:n}}class Ra extends Te{constructor(t=[]){super();this.isArrayCamera=!0,this.cameras=t}}class Ze extends be{constructor(){super();this.isGroup=!0,this.type="Group"}}var Ad={type:"move"};class Li{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){if(this._hand===null)this._hand=new Ze,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1};return this._hand}getTargetRaySpace(){if(this._targetRay===null)this._targetRay=new Ze,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O;return this._targetRay}getGripSpace(){if(this._grip===null)this._grip=new Ze,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O;return this._grip}dispatchEvent(t){if(this._targetRay!==null)this._targetRay.dispatchEvent(t);if(this._grip!==null)this._grip.dispatchEvent(t);if(this._hand!==null)this._hand.dispatchEvent(t);return this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){if(this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null)this._targetRay.visible=!1;if(this._grip!==null)this._grip.visible=!1;if(this._hand!==null)this._hand.visible=!1;return this}update(t,e,n){let i=null,s=null,r=null,o=this._targetRay,a=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(let _ of t.hand.values()){let g=e.getJointPose(_,n),p=this._getHandJoint(l,_);if(g!==null)p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius;p.visible=g!==null}let c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=c.position.distanceTo(u.position),f=0.02,m=0.005;if(l.inputState.pinching&&h>f+m)l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this});else if(!l.inputState.pinching&&h<=f-m)l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this})}else if(a!==null&&t.gripSpace){if(s=e.getPose(t.gripSpace,n),s!==null){if(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity)a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity);else a.hasLinearVelocity=!1;if(s.angularVelocity)a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity);else a.hasAngularVelocity=!1}}if(o!==null){if(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null)i=s;if(i!==null){if(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity)o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity);else o.hasLinearVelocity=!1;if(i.angularVelocity)o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity);else o.hasAngularVelocity=!1;this.dispatchEvent(Ad)}}}if(o!==null)o.visible=i!==null;if(a!==null)a.visible=s!==null;if(l!==null)l.visible=r!==null;return this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ze;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}var Rd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Cd=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ca{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let i=new pe,s=t.properties.get(i);if(s.__webglTexture=e.texture,e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)this.depthNear=e.depthNear,this.depthFar=e.depthFar;this.texture=i}}getMesh(t){if(this.texture!==null){if(this.mesh===null){let e=t.cameras[0].viewport,n=new Ne({vertexShader:Rd,fragmentShader:Cd,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Se(new kn(20,20),n)}}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ia extends xn{constructor(t,e){super();let n=this,i=null,s=1,r=null,o="local-floor",a=1,l=null,c=null,u=null,h=null,f=null,m=null,_=new Ca,g=e.getContextAttributes(),p=null,d=null,y=[],x=[],w=new Vt,A=null,E=new Te;E.viewport=new Gt;let T=new Te;T.viewport=new Gt;let U=[E,T],S=new Ra,b=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=y[Y];if(tt===void 0)tt=new Li,y[Y]=tt;return tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=y[Y];if(tt===void 0)tt=new Li,y[Y]=tt;return tt.getGripSpace()},this.getHand=function(Y){let tt=y[Y];if(tt===void 0)tt=new Li,y[Y]=tt;return tt.getHandSpace()};function N(Y){let tt=x.indexOf(Y.inputSource);if(tt===-1)return;let yt=y[tt];if(yt!==void 0)yt.update(Y.inputSource,Y.frame,l||r),yt.dispatchEvent({type:Y.type,data:Y.inputSource})}function V(){i.removeEventListener("select",N),i.removeEventListener("selectstart",N),i.removeEventListener("selectend",N),i.removeEventListener("squeeze",N),i.removeEventListener("squeezestart",N),i.removeEventListener("squeezeend",N),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",k);for(let Y=0;Y<y.length;Y++){let tt=x[Y];if(tt===null)continue;x[Y]=null,y[Y].disconnect(tt)}b=null,C=null,_.reset(),t.setRenderTarget(p),f=null,h=null,u=null,i=null,d=null,wt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){if(s=Y,n.isPresenting===!0)console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){if(o=Y,n.isPresenting===!0)console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",N),i.addEventListener("selectstart",N),i.addEventListener("selectend",N),i.addEventListener("squeeze",N),i.addEventListener("squeezestart",N),i.addEventListener("squeezeend",N),i.addEventListener("end",V),i.addEventListener("inputsourceschange",k),g.xrCompatible!==!0)await e.makeXRCompatible();if(A=t.getPixelRatio(),t.getSize(w),i.renderState.layers===void 0){let tt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,e,tt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),d=new ln(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let tt=null,yt=null,Mt=null;if(g.depth)Mt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=g.stencil?1027:1026,yt=g.stencil?1020:1014;let at={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:s};u=new XRWebGLBinding(i,e),h=u.createProjectionLayer(at),i.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),d=new ln(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new Ds(h.textureWidth,h.textureHeight,yt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}d.isXRRenderTarget=!0,this.setFoveation(a),l=null,r=await i.requestReferenceSpace(o),wt.setContext(i),wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(Y){for(let tt=0;tt<Y.removed.length;tt++){let yt=Y.removed[tt],Mt=x.indexOf(yt);if(Mt>=0)x[Mt]=null,y[Mt].disconnect(yt)}for(let tt=0;tt<Y.added.length;tt++){let yt=Y.added[tt],Mt=x.indexOf(yt);if(Mt===-1){for(let Tt=0;Tt<y.length;Tt++)if(Tt>=x.length){x.push(yt),Mt=Tt;break}else if(x[Tt]===null){x[Tt]=yt,Mt=Tt;break}if(Mt===-1)break}let at=y[Mt];if(at)at.connect(yt)}}let X=new O,H=new O;function K(Y,tt,yt){X.setFromMatrixPosition(tt.matrixWorld),H.setFromMatrixPosition(yt.matrixWorld);let Mt=X.distanceTo(H),at=tt.projectionMatrix.elements,Tt=yt.projectionMatrix.elements,Zt=at[14]/(at[10]-1),Bt=at[14]/(at[10]+1),zt=(at[9]+1)/at[5],ce=(at[9]-1)/at[5],D=(at[8]-1)/at[0],he=(Tt[8]+1)/Tt[0],Jt=Zt*D,$t=Zt*he,pt=Mt/(-D+he),ie=pt*-D;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ie),Y.translateZ(pt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),at[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let St=Zt+pt,It=Bt+pt,R=Jt-ie,v=$t+(Mt-ie),F=zt*Bt/It*St,J=ce*Bt/It*St;Y.projectionMatrix.makePerspective(R,v,F,J,St,It),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function G(Y,tt){if(tt===null)Y.matrixWorld.copy(Y.matrix);else Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix);Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let{near:tt,far:yt}=Y;if(_.texture!==null){if(_.depthNear>0)tt=_.depthNear;if(_.depthFar>0)yt=_.depthFar}if(S.near=T.near=E.near=tt,S.far=T.far=E.far=yt,b!==S.near||C!==S.far)i.updateRenderState({depthNear:S.near,depthFar:S.far}),b=S.near,C=S.far;E.layers.mask=Y.layers.mask|2,T.layers.mask=Y.layers.mask|4,S.layers.mask=E.layers.mask|T.layers.mask;let Mt=Y.parent,at=S.cameras;G(S,Mt);for(let Tt=0;Tt<at.length;Tt++)G(at[Tt],Mt);if(at.length===2)K(S,E,T);else S.projectionMatrix.copy(E.projectionMatrix);it(Y,S,Mt)};function it(Y,tt,yt){if(yt===null)Y.matrix.copy(tt.matrixWorld);else Y.matrix.copy(yt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld);if(Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera)Y.fov=xs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1}this.getCamera=function(){return S},this.getFoveation=function(){if(h===null&&f===null)return;return a},this.setFoveation=function(Y){if(a=Y,h!==null)h.fixedFoveation=Y;if(f!==null&&f.fixedFoveation!==void 0)f.fixedFoveation=Y},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let st=null;function xt(Y,tt){if(c=tt.getViewerPose(l||r),m=tt,c!==null){let yt=c.views;if(f!==null)t.setRenderTargetFramebuffer(d,f.framebuffer),t.setRenderTarget(d);let Mt=!1;if(yt.length!==S.cameras.length)S.cameras.length=0,Mt=!0;for(let Tt=0;Tt<yt.length;Tt++){let Zt=yt[Tt],Bt=null;if(f!==null)Bt=f.getViewport(Zt);else{let ce=u.getViewSubImage(h,Zt);if(Bt=ce.viewport,Tt===0)t.setRenderTargetTextures(d,ce.colorTexture,h.ignoreDepthValues?void 0:ce.depthStencilTexture),t.setRenderTarget(d)}let zt=U[Tt];if(zt===void 0)zt=new Te,zt.layers.enable(Tt),zt.viewport=new Gt,U[Tt]=zt;if(zt.matrix.fromArray(Zt.transform.matrix),zt.matrix.decompose(zt.position,zt.quaternion,zt.scale),zt.projectionMatrix.fromArray(Zt.projectionMatrix),zt.projectionMatrixInverse.copy(zt.projectionMatrix).invert(),zt.viewport.set(Bt.x,Bt.y,Bt.width,Bt.height),Tt===0)S.matrix.copy(zt.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale);if(Mt===!0)S.cameras.push(zt)}let at=i.enabledFeatures;if(at&&at.includes("depth-sensing")){let Tt=u.getDepthInformation(yt[0]);if(Tt&&Tt.isValid&&Tt.texture)_.init(t,Tt,i.renderState)}}for(let yt=0;yt<y.length;yt++){let Mt=x[yt],at=y[yt];if(Mt!==null&&at!==void 0)at.update(Mt,tt,l||r)}if(st)st(Y,tt);if(tt.detectedPlanes)n.dispatchEvent({type:"planesdetected",data:tt});m=null}let wt=new ga;wt.setAnimationLoop(xt),this.setAnimationLoop=function(Y){st=Y},this.dispose=function(){}}}var mn=new Ue,Id=new ee;function Pd(t,e){function n(p,d){if(p.matrixAutoUpdate===!0)p.updateMatrix();d.value.copy(p.matrix)}function i(p,d){if(d.color.getRGB(p.fogColor.value,fa(t)),d.isFog)p.fogNear.value=d.near,p.fogFar.value=d.far;else if(d.isFogExp2)p.fogDensity.value=d.density}function s(p,d,y,x,w){if(d.isMeshBasicMaterial)r(p,d);else if(d.isMeshLambertMaterial)r(p,d);else if(d.isMeshToonMaterial)r(p,d),h(p,d);else if(d.isMeshPhongMaterial)r(p,d),u(p,d);else if(d.isMeshStandardMaterial){if(r(p,d),f(p,d),d.isMeshPhysicalMaterial)m(p,d,w)}else if(d.isMeshMatcapMaterial)r(p,d),_(p,d);else if(d.isMeshDepthMaterial)r(p,d);else if(d.isMeshDistanceMaterial)r(p,d),g(p,d);else if(d.isMeshNormalMaterial)r(p,d);else if(d.isLineBasicMaterial){if(o(p,d),d.isLineDashedMaterial)a(p,d)}else if(d.isPointsMaterial)l(p,d,y,x);else if(d.isSpriteMaterial)c(p,d);else if(d.isShadowMaterial)p.color.value.copy(d.color),p.opacity.value=d.opacity;else if(d.isShaderMaterial)d.uniformsNeedUpdate=!1}function r(p,d){if(p.opacity.value=d.opacity,d.color)p.diffuse.value.copy(d.color);if(d.emissive)p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity);if(d.map)p.map.value=d.map,n(d.map,p.mapTransform);if(d.alphaMap)p.alphaMap.value=d.alphaMap,n(d.alphaMap,p.alphaMapTransform);if(d.bumpMap){if(p.bumpMap.value=d.bumpMap,n(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===1)p.bumpScale.value*=-1}if(d.normalMap){if(p.normalMap.value=d.normalMap,n(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===1)p.normalScale.value.negate()}if(d.displacementMap)p.displacementMap.value=d.displacementMap,n(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias;if(d.emissiveMap)p.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,p.emissiveMapTransform);if(d.specularMap)p.specularMap.value=d.specularMap,n(d.specularMap,p.specularMapTransform);if(d.alphaTest>0)p.alphaTest.value=d.alphaTest;let y=e.get(d),x=y.envMap,w=y.envMapRotation;if(x){if(p.envMap.value=x,mn.copy(w),mn.x*=-1,mn.y*=-1,mn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1)mn.y*=-1,mn.z*=-1;p.envMapRotation.value.setFromMatrix4(Id.makeRotationFromEuler(mn)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio}if(d.lightMap)p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,p.lightMapTransform);if(d.aoMap)p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,p.aoMapTransform)}function o(p,d){if(p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map)p.map.value=d.map,n(d.map,p.mapTransform)}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,y,x){if(p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*y,p.scale.value=x*0.5,d.map)p.map.value=d.map,n(d.map,p.uvTransform);if(d.alphaMap)p.alphaMap.value=d.alphaMap,n(d.alphaMap,p.alphaMapTransform);if(d.alphaTest>0)p.alphaTest.value=d.alphaTest}function c(p,d){if(p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map)p.map.value=d.map,n(d.map,p.mapTransform);if(d.alphaMap)p.alphaMap.value=d.alphaMap,n(d.alphaMap,p.alphaMapTransform);if(d.alphaTest>0)p.alphaTest.value=d.alphaTest}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,0.0001)}function h(p,d){if(d.gradientMap)p.gradientMap.value=d.gradientMap}function f(p,d){if(p.metalness.value=d.metalness,d.metalnessMap)p.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,p.metalnessMapTransform);if(p.roughness.value=d.roughness,d.roughnessMap)p.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,p.roughnessMapTransform);if(d.envMap)p.envMapIntensity.value=d.envMapIntensity}function m(p,d,y){if(p.ior.value=d.ior,d.sheen>0){if(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap)p.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,p.sheenColorMapTransform);if(d.sheenRoughnessMap)p.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,p.sheenRoughnessMapTransform)}if(d.clearcoat>0){if(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap)p.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,p.clearcoatMapTransform);if(d.clearcoatRoughnessMap)p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform);if(d.clearcoatNormalMap){if(p.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===1)p.clearcoatNormalScale.value.negate()}}if(d.dispersion>0)p.dispersion.value=d.dispersion;if(d.iridescence>0){if(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap)p.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,p.iridescenceMapTransform);if(d.iridescenceThicknessMap)p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform)}if(d.transmission>0){if(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap)p.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,p.transmissionMapTransform);if(p.thickness.value=d.thickness,d.thicknessMap)p.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,p.thicknessMapTransform);p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)}if(d.anisotropy>0){if(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap)p.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,p.anisotropyMapTransform)}if(p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap)p.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,p.specularColorMapTransform);if(d.specularIntensityMap)p.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,p.specularIntensityMapTransform)}function _(p,d){if(d.matcap)p.matcap.value=d.matcap}function g(p,d){let y=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ld(t,e,n,i){let s={},r={},o=[],a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){let w=x.program;i.uniformBlockBinding(y,w)}function c(y,x){let w=s[y.id];if(w===void 0)_(y),w=u(y),s[y.id]=w,y.addEventListener("dispose",p);let A=x.program;i.updateUBOMapping(y,A);let E=e.render.frame;if(r[y.id]!==E)f(y),r[y.id]=E}function u(y){let x=h();y.__bindingPointIndex=x;let w=t.createBuffer(),A=y.__size,E=y.usage;return t.bindBuffer(t.UNIFORM_BUFFER,w),t.bufferData(t.UNIFORM_BUFFER,A,E),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,w),w}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){let x=s[y.id],w=y.uniforms,A=y.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let E=0,T=w.length;E<T;E++){let U=Array.isArray(w[E])?w[E]:[w[E]];for(let S=0,b=U.length;S<b;S++){let C=U[S];if(m(C,E,S,A)===!0){let N=C.__offset,V=Array.isArray(C.value)?C.value:[C.value],k=0;for(let X=0;X<V.length;X++){let H=V[X],K=g(H);if(typeof H==="number"||typeof H==="boolean")C.__data[0]=H,t.bufferSubData(t.UNIFORM_BUFFER,N+k,C.__data);else if(H.isMatrix3)C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0;else H.toArray(C.__data,k),k+=K.storage/Float32Array.BYTES_PER_ELEMENT}t.bufferSubData(t.UNIFORM_BUFFER,N,C.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(y,x,w,A){let E=y.value,T=x+"_"+w;if(A[T]===void 0){if(typeof E==="number"||typeof E==="boolean")A[T]=E;else A[T]=E.clone();return!0}else{let U=A[T];if(typeof E==="number"||typeof E==="boolean"){if(U!==E)return A[T]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function _(y){let x=y.uniforms,w=0,A=16;for(let T=0,U=x.length;T<U;T++){let S=Array.isArray(x[T])?x[T]:[x[T]];for(let b=0,C=S.length;b<C;b++){let N=S[b],V=Array.isArray(N.value)?N.value:[N.value];for(let k=0,X=V.length;k<X;k++){let H=V[k],K=g(H),G=w%A,it=G%K.boundary,st=G+it;if(w+=it,st!==0&&A-st<K.storage)w+=A-st;N.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=w,w+=K.storage}}}let E=w%A;if(E>0)w+=A-E;return y.__size=w,y.__cache={},this}function g(y){let x={boundary:0,storage:0};if(typeof y==="number"||typeof y==="boolean")x.boundary=4,x.storage=4;else if(y.isVector2)x.boundary=8,x.storage=8;else if(y.isVector3||y.isColor)x.boundary=16,x.storage=12;else if(y.isVector4)x.boundary=16,x.storage=16;else if(y.isMatrix3)x.boundary=48,x.storage=48;else if(y.isMatrix4)x.boundary=64,x.storage=64;else if(y.isTexture)console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.");else console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y);return x}function p(y){let x=y.target;x.removeEventListener("dispose",p);let w=o.indexOf(x.__bindingPointIndex);o.splice(w,1),t.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function d(){for(let y in s)t.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}class Us{constructor(t={}){let{canvas:e=Fo(),context:n=null,depth:i=!0,stencil:s=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:a=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=r;let m=new Uint32Array(4),_=new Int32Array(4),g=null,p=null,d=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace="srgb",this.toneMapping=0,this.toneMappingExposure=1;let x=this,w=!1,A=0,E=0,T=null,U=-1,S=null,b=new Gt,C=new Gt,N=null,V=new Yt(0),k=0,X=e.width,H=e.height,K=1,G=null,it=null,st=new Gt(0,0,X,H),xt=new Gt(0,0,X,H),wt=!1,Y=new Ps,tt=!1,yt=!1,Mt=new ee,at=new ee,Tt=new O,Zt=new Gt,Bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},zt=!1;function ce(){return T===null?K:1}let D=n;function he(M,L){return e.getContext(M,L)}try{let M={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:a,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in e)e.setAttribute("data-engine","three.js r170");if(e.addEventListener("webglcontextlost",q,!1),e.addEventListener("webglcontextrestored",Z,!1),e.addEventListener("webglcontextcreationerror",ht,!1),D===null){if(D=he("webgl2",M),D===null)if(he("webgl2"))throw Error("Error creating WebGL context with your selected attributes.");else throw Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Jt,$t,pt,ie,St,It,R,v,F,J,Q,W,bt,ot,dt,Pt,et,ut,Ot,At,ft,Lt,Ft,ne;function I(){if(Jt=new Zh(D),Jt.init(),Lt=new Td(D,Jt),$t=new Gh(D,Jt,t,Lt),pt=new bd(D,Jt),$t.reverseDepthBuffer&&h)pt.buffers.depth.setReversed(!0);ie=new Kh(D),St=new hd,It=new wd(D,Jt,pt,St,$t,Lt,ie),R=new Wh(x),v=new Yh(x),F=new sl(D),Ft=new kh(D,F),J=new Jh(D,F,ie,Ft),Q=new jh(D,J,F,ie),Ot=new Qh(D,$t,It),Pt=new Vh(St),W=new cd(x,R,v,Jt,$t,Ft,Pt),bt=new Pd(x,St),ot=new dd,dt=new xd(Jt),ut=new zh(x,R,v,pt,Q,f,a),et=new Md(x,Q,$t),ne=new Ld(D,ie,$t,pt),At=new Hh(D,Jt,ie),ft=new $h(D,Jt,ie),ie.programs=W.programs,x.capabilities=$t,x.extensions=Jt,x.properties=St,x.renderLists=ot,x.shadowMap=et,x.state=pt,x.info=ie}I();let j=new Ia(x,D);this.xr=j,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let M=Jt.get("WEBGL_lose_context");if(M)M.loseContext()},this.forceContextRestore=function(){let M=Jt.get("WEBGL_lose_context");if(M)M.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(M){if(M===void 0)return;K=M,this.setSize(X,H,!1)},this.getSize=function(M){return M.set(X,H)},this.setSize=function(M,L,B=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}if(X=M,H=L,e.width=Math.floor(M*K),e.height=Math.floor(L*K),B===!0)e.style.width=M+"px",e.style.height=L+"px";this.setViewport(0,0,M,L)},this.getDrawingBufferSize=function(M){return M.set(X*K,H*K).floor()},this.setDrawingBufferSize=function(M,L,B){X=M,H=L,K=B,e.width=Math.floor(M*B),e.height=Math.floor(L*B),this.setViewport(0,0,M,L)},this.getCurrentViewport=function(M){return M.copy(b)},this.getViewport=function(M){return M.copy(st)},this.setViewport=function(M,L,B,z){if(M.isVector4)st.set(M.x,M.y,M.z,M.w);else st.set(M,L,B,z);pt.viewport(b.copy(st).multiplyScalar(K).round())},this.getScissor=function(M){return M.copy(xt)},this.setScissor=function(M,L,B,z){if(M.isVector4)xt.set(M.x,M.y,M.z,M.w);else xt.set(M,L,B,z);pt.scissor(C.copy(xt).multiplyScalar(K).round())},this.getScissorTest=function(){return wt},this.setScissorTest=function(M){pt.setScissorTest(wt=M)},this.setOpaqueSort=function(M){G=M},this.setTransparentSort=function(M){it=M},this.getClearColor=function(M){return M.copy(ut.getClearColor())},this.setClearColor=function(){ut.setClearColor.apply(ut,arguments)},this.getClearAlpha=function(){return ut.getClearAlpha()},this.setClearAlpha=function(){ut.setClearAlpha.apply(ut,arguments)},this.clear=function(M=!0,L=!0,B=!0){let z=0;if(M){let P=!1;if(T!==null){let nt=T.texture.format;P=nt===1033||nt===1031||nt===1029}if(P){let nt=T.texture.type,ct=nt===1009||nt===1014||nt===1012||nt===1020||nt===1017||nt===1018,mt=ut.getClearColor(),gt=ut.getClearAlpha(),Rt=mt.r,Dt=mt.g,_t=mt.b;if(ct)m[0]=Rt,m[1]=Dt,m[2]=_t,m[3]=gt,D.clearBufferuiv(D.COLOR,0,m);else _[0]=Rt,_[1]=Dt,_[2]=_t,_[3]=gt,D.clearBufferiv(D.COLOR,0,_)}else z|=D.COLOR_BUFFER_BIT}if(L)z|=D.DEPTH_BUFFER_BIT;if(B)z|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295);D.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",q,!1),e.removeEventListener("webglcontextrestored",Z,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),ot.dispose(),dt.dispose(),St.dispose(),R.dispose(),v.dispose(),Q.dispose(),Ft.dispose(),ne.dispose(),W.dispose(),j.dispose(),j.removeEventListener("sessionstart",Fe),j.removeEventListener("sessionend",tr),cn.stop()};function q(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Z(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let M=ie.autoReset,L=et.enabled,B=et.autoUpdate,z=et.needsUpdate,P=et.type;I(),ie.autoReset=M,et.enabled=L,et.autoUpdate=B,et.needsUpdate=z,et.type=P}function ht(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function lt(M){let L=M.target;L.removeEventListener("dispose",lt),Ut(L)}function Ut(M){se(M),St.remove(M)}function se(M){let L=St.get(M).programs;if(L!==void 0){if(L.forEach(function(B){W.releaseProgram(B)}),M.isShaderMaterial)W.releaseShaderCache(M)}}this.renderBufferDirect=function(M,L,B,z,P,nt){if(L===null)L=Bt;let ct=P.isMesh&&P.matrixWorld.determinant()<0,mt=Ao(M,L,B,z,P);pt.setMaterial(z,ct);let gt=B.index,Rt=1;if(z.wireframe===!0){if(gt=J.getWireframeAttribute(B),gt===void 0)return;Rt=2}let Dt=B.drawRange,_t=B.attributes.position,Ht=Dt.start*Rt,Qt=(Dt.start+Dt.count)*Rt;if(nt!==null)Ht=Math.max(Ht,nt.start*Rt),Qt=Math.min(Qt,(nt.start+nt.count)*Rt);if(gt!==null)Ht=Math.max(Ht,0),Qt=Math.min(Qt,gt.count);else if(_t!==void 0&&_t!==null)Ht=Math.max(Ht,0),Qt=Math.min(Qt,_t.count);let jt=Qt-Ht;if(jt<0||jt===1/0)return;Ft.setup(P,z,mt,B,gt);let ge,Xt=At;if(gt!==null)ge=F.get(gt),Xt=ft,Xt.setIndex(ge);if(P.isMesh)if(z.wireframe===!0)pt.setLineWidth(z.wireframeLinewidth*ce()),Xt.setMode(D.LINES);else Xt.setMode(D.TRIANGLES);else if(P.isLine){let vt=z.linewidth;if(vt===void 0)vt=1;if(pt.setLineWidth(vt*ce()),P.isLineSegments)Xt.setMode(D.LINES);else if(P.isLineLoop)Xt.setMode(D.LINE_LOOP);else Xt.setMode(D.LINE_STRIP)}else if(P.isPoints)Xt.setMode(D.POINTS);else if(P.isSprite)Xt.setMode(D.TRIANGLES);if(P.isBatchedMesh)if(P._multiDrawInstances!==null)Xt.renderMultiDrawInstances(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount,P._multiDrawInstances);else if(!Jt.get("WEBGL_multi_draw")){let{_multiDrawStarts:vt,_multiDrawCounts:Ge,_multiDrawCount:qt}=P,Ce=gt?F.get(gt).bytesPerElement:1,Sn=St.get(z).currentProgram.getUniforms();for(let ve=0;ve<qt;ve++)Sn.setValue(D,"_gl_DrawID",ve),Xt.render(vt[ve]/Ce,Ge[ve])}else Xt.renderMultiDraw(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount);else if(P.isInstancedMesh)Xt.renderInstances(Ht,jt,P.count);else if(B.isInstancedBufferGeometry){let vt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Ge=Math.min(B.instanceCount,vt);Xt.renderInstances(Ht,jt,Ge)}else Xt.render(Ht,jt)};function ue(M,L,B){if(M.transparent===!0&&M.side===2&&M.forceSinglePass===!1)M.side=1,M.needsUpdate=!0,hi(M,L,B),M.side=0,M.needsUpdate=!0,hi(M,L,B),M.side=2;else hi(M,L,B)}this.compile=function(M,L,B=null){if(B===null)B=M;if(p=dt.get(B),p.init(L),y.push(p),B.traverseVisible(function(P){if(P.isLight&&P.layers.test(L.layers)){if(p.pushLight(P),P.castShadow)p.pushShadow(P)}}),M!==B)M.traverseVisible(function(P){if(P.isLight&&P.layers.test(L.layers)){if(p.pushLight(P),P.castShadow)p.pushShadow(P)}});p.setupLights();let z=new Set;return M.traverse(function(P){if(!(P.isMesh||P.isPoints||P.isLine||P.isSprite))return;let nt=P.material;if(nt)if(Array.isArray(nt))for(let ct=0;ct<nt.length;ct++){let mt=nt[ct];ue(mt,B,P),z.add(mt)}else ue(nt,B,P),z.add(nt)}),y.pop(),p=null,z},this.compileAsync=function(M,L,B=null){let z=this.compile(M,L,B);return new Promise((P)=>{function nt(){if(z.forEach(function(ct){if(St.get(ct).currentProgram.isReady())z.delete(ct)}),z.size===0){P(M);return}setTimeout(nt,10)}if(Jt.get("KHR_parallel_shader_compile")!==null)nt();else setTimeout(nt,10)})};let Wt=null;function He(M){if(Wt)Wt(M)}function Fe(){cn.stop()}function tr(){cn.start()}let cn=new ga;if(cn.setAnimationLoop(He),typeof self<"u")cn.setContext(self);this.setAnimationLoop=function(M){Wt=M,j.setAnimationLoop(M),M===null?cn.stop():cn.start()},j.addEventListener("sessionstart",Fe),j.addEventListener("sessionend",tr),this.render=function(M,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(M.matrixWorldAutoUpdate===!0)M.updateMatrixWorld();if(L.parent===null&&L.matrixWorldAutoUpdate===!0)L.updateMatrixWorld();if(j.enabled===!0&&j.isPresenting===!0){if(j.cameraAutoUpdate===!0)j.updateCamera(L);L=j.getCamera()}if(M.isScene===!0)M.onBeforeRender(x,M,L,T);if(p=dt.get(M,y.length),p.init(L),y.push(p),at.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Y.setFromProjectionMatrix(at),yt=this.localClippingEnabled,tt=Pt.init(this.clippingPlanes,yt),g=ot.get(M,d.length),g.init(),d.push(g),j.enabled===!0&&j.isPresenting===!0){let nt=x.xr.getDepthSensingMesh();if(nt!==null)Vi(nt,L,-1/0,x.sortObjects)}if(Vi(M,L,0,x.sortObjects),g.finish(),x.sortObjects===!0)g.sort(G,it);if(zt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,zt)ut.addToRenderList(g,M);if(this.info.render.frame++,tt===!0)Pt.beginShadows();let B=p.state.shadowsArray;if(et.render(B,M,L),tt===!0)Pt.endShadows();if(this.info.autoReset===!0)this.info.reset();let{opaque:z,transmissive:P}=g;if(p.setupLights(),L.isArrayCamera){let nt=L.cameras;if(P.length>0)for(let ct=0,mt=nt.length;ct<mt;ct++){let gt=nt[ct];nr(z,P,M,gt)}if(zt)ut.render(M);for(let ct=0,mt=nt.length;ct<mt;ct++){let gt=nt[ct];er(g,M,gt,gt.viewport)}}else{if(P.length>0)nr(z,P,M,L);if(zt)ut.render(M);er(g,M,L)}if(T!==null)It.updateMultisampleRenderTarget(T),It.updateRenderTargetMipmap(T);if(M.isScene===!0)M.onAfterRender(x,M,L);if(Ft.resetDefaultState(),U=-1,S=null,y.pop(),y.length>0){if(p=y[y.length-1],tt===!0)Pt.setGlobalState(x.clippingPlanes,p.state.camera)}else p=null;if(d.pop(),d.length>0)g=d[d.length-1];else g=null};function Vi(M,L,B,z){if(M.visible===!1)return;if(M.layers.test(L.layers)){if(M.isGroup)B=M.renderOrder;else if(M.isLOD){if(M.autoUpdate===!0)M.update(L)}else if(M.isLight){if(p.pushLight(M),M.castShadow)p.pushShadow(M)}else if(M.isSprite){if(!M.frustumCulled||Y.intersectsSprite(M)){if(z)Zt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(at);let ct=Q.update(M),mt=M.material;if(mt.visible)g.push(M,ct,mt,B,Zt.z,null)}}else if(M.isMesh||M.isLine||M.isPoints){if(!M.frustumCulled||Y.intersectsObject(M)){let ct=Q.update(M),mt=M.material;if(z){if(M.boundingSphere!==void 0){if(M.boundingSphere===null)M.computeBoundingSphere();Zt.copy(M.boundingSphere.center)}else{if(ct.boundingSphere===null)ct.computeBoundingSphere();Zt.copy(ct.boundingSphere.center)}Zt.applyMatrix4(M.matrixWorld).applyMatrix4(at)}if(Array.isArray(mt)){let gt=ct.groups;for(let Rt=0,Dt=gt.length;Rt<Dt;Rt++){let _t=gt[Rt],Ht=mt[_t.materialIndex];if(Ht&&Ht.visible)g.push(M,ct,Ht,B,Zt.z,_t)}}else if(mt.visible)g.push(M,ct,mt,B,Zt.z,null)}}}let nt=M.children;for(let ct=0,mt=nt.length;ct<mt;ct++)Vi(nt[ct],L,B,z)}function er(M,L,B,z){let{opaque:P,transmissive:nt,transparent:ct}=M;if(p.setupLightsView(B),tt===!0)Pt.setGlobalState(x.clippingPlanes,B);if(z)pt.viewport(b.copy(z));if(P.length>0)ci(P,L,B);if(nt.length>0)ci(nt,L,B);if(ct.length>0)ci(ct,L,B);pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function nr(M,L,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;if(p.state.transmissionRenderTarget[z.id]===void 0)p.state.transmissionRenderTarget[z.id]=new ln(1,1,{generateMipmaps:!0,type:Jt.has("EXT_color_buffer_half_float")||Jt.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:kt.workingColorSpace});let nt=p.state.transmissionRenderTarget[z.id],ct=z.viewport||b;nt.setSize(ct.z,ct.w);let mt=x.getRenderTarget();if(x.setRenderTarget(nt),x.getClearColor(V),k=x.getClearAlpha(),k<1)x.setClearColor(16777215,0.5);if(x.clear(),zt)ut.render(B);let gt=x.toneMapping;x.toneMapping=0;let Rt=z.viewport;if(z.viewport!==void 0)z.viewport=void 0;if(p.setupLightsView(z),tt===!0)Pt.setGlobalState(x.clippingPlanes,z);if(ci(M,B,z),It.updateMultisampleRenderTarget(nt),It.updateRenderTargetMipmap(nt),Jt.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let _t=0,Ht=L.length;_t<Ht;_t++){let Qt=L[_t],jt=Qt.object,ge=Qt.geometry,Xt=Qt.material,vt=Qt.group;if(Xt.side===2&&jt.layers.test(z.layers)){let Ge=Xt.side;Xt.side=1,Xt.needsUpdate=!0,ir(jt,B,z,ge,Xt,vt),Xt.side=Ge,Xt.needsUpdate=!0,Dt=!0}}if(Dt===!0)It.updateMultisampleRenderTarget(nt),It.updateRenderTargetMipmap(nt)}if(x.setRenderTarget(mt),x.setClearColor(V,k),Rt!==void 0)z.viewport=Rt;x.toneMapping=gt}function ci(M,L,B){let z=L.isScene===!0?L.overrideMaterial:null;for(let P=0,nt=M.length;P<nt;P++){let ct=M[P],mt=ct.object,gt=ct.geometry,Rt=z===null?ct.material:z,Dt=ct.group;if(mt.layers.test(B.layers))ir(mt,L,B,gt,Rt,Dt)}}function ir(M,L,B,z,P,nt){if(M.onBeforeRender(x,L,B,z,P,nt),M.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),P.onBeforeRender(x,L,B,z,M,nt),P.transparent===!0&&P.side===2&&P.forceSinglePass===!1)P.side=1,P.needsUpdate=!0,x.renderBufferDirect(B,L,z,P,M,nt),P.side=0,P.needsUpdate=!0,x.renderBufferDirect(B,L,z,P,M,nt),P.side=2;else x.renderBufferDirect(B,L,z,P,M,nt);M.onAfterRender(x,L,B,z,P,nt)}function hi(M,L,B){if(L.isScene!==!0)L=Bt;let z=St.get(M),P=p.state.lights,nt=p.state.shadowsArray,ct=P.state.version,mt=W.getParameters(M,P.state,nt,L,B),gt=W.getProgramCacheKey(mt),Rt=z.programs;if(z.environment=M.isMeshStandardMaterial?L.environment:null,z.fog=L.fog,z.envMap=(M.isMeshStandardMaterial?v:R).get(M.envMap||z.environment),z.envMapRotation=z.environment!==null&&M.envMap===null?L.environmentRotation:M.envMapRotation,Rt===void 0)M.addEventListener("dispose",lt),Rt=new Map,z.programs=Rt;let Dt=Rt.get(gt);if(Dt!==void 0){if(z.currentProgram===Dt&&z.lightsStateVersion===ct)return rr(M,mt),Dt}else mt.uniforms=W.getUniforms(M),M.onBeforeCompile(mt,x),Dt=W.acquireProgram(mt,gt),Rt.set(gt,Dt),z.uniforms=mt.uniforms;let _t=z.uniforms;if(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)_t.clippingPlanes=Pt.uniform;if(rr(M,mt),z.needsLights=Co(M),z.lightsStateVersion=ct,z.needsLights)_t.ambientLightColor.value=P.state.ambient,_t.lightProbe.value=P.state.probe,_t.directionalLights.value=P.state.directional,_t.directionalLightShadows.value=P.state.directionalShadow,_t.spotLights.value=P.state.spot,_t.spotLightShadows.value=P.state.spotShadow,_t.rectAreaLights.value=P.state.rectArea,_t.ltc_1.value=P.state.rectAreaLTC1,_t.ltc_2.value=P.state.rectAreaLTC2,_t.pointLights.value=P.state.point,_t.pointLightShadows.value=P.state.pointShadow,_t.hemisphereLights.value=P.state.hemi,_t.directionalShadowMap.value=P.state.directionalShadowMap,_t.directionalShadowMatrix.value=P.state.directionalShadowMatrix,_t.spotShadowMap.value=P.state.spotShadowMap,_t.spotLightMatrix.value=P.state.spotLightMatrix,_t.spotLightMap.value=P.state.spotLightMap,_t.pointShadowMap.value=P.state.pointShadowMap,_t.pointShadowMatrix.value=P.state.pointShadowMatrix;return z.currentProgram=Dt,z.uniformsList=null,Dt}function sr(M){if(M.uniformsList===null){let L=M.currentProgram.getUniforms();M.uniformsList=ni.seqWithValue(L.seq,M.uniforms)}return M.uniformsList}function rr(M,L){let B=St.get(M);B.outputColorSpace=L.outputColorSpace,B.batching=L.batching,B.batchingColor=L.batchingColor,B.instancing=L.instancing,B.instancingColor=L.instancingColor,B.instancingMorph=L.instancingMorph,B.skinning=L.skinning,B.morphTargets=L.morphTargets,B.morphNormals=L.morphNormals,B.morphColors=L.morphColors,B.morphTargetsCount=L.morphTargetsCount,B.numClippingPlanes=L.numClippingPlanes,B.numIntersection=L.numClipIntersection,B.vertexAlphas=L.vertexAlphas,B.vertexTangents=L.vertexTangents,B.toneMapping=L.toneMapping}function Ao(M,L,B,z,P){if(L.isScene!==!0)L=Bt;It.resetTextureUnits();let nt=L.fog,ct=z.isMeshStandardMaterial?L.environment:null,mt=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:"srgb-linear",gt=(z.isMeshStandardMaterial?v:R).get(z.envMap||ct),Rt=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Dt=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),_t=!!B.morphAttributes.position,Ht=!!B.morphAttributes.normal,Qt=!!B.morphAttributes.color,jt=0;if(z.toneMapped){if(T===null||T.isXRRenderTarget===!0)jt=x.toneMapping}let ge=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Xt=ge!==void 0?ge.length:0,vt=St.get(z),Ge=p.state.lights;if(tt===!0){if(yt===!0||M!==S){let Ee=M===S&&z.id===U;Pt.setState(z,M,Ee)}}let qt=!1;if(z.version===vt.__version){if(vt.needsLights&&vt.lightsStateVersion!==Ge.state.version)qt=!0;else if(vt.outputColorSpace!==mt)qt=!0;else if(P.isBatchedMesh&&vt.batching===!1)qt=!0;else if(!P.isBatchedMesh&&vt.batching===!0)qt=!0;else if(P.isBatchedMesh&&vt.batchingColor===!0&&P.colorTexture===null)qt=!0;else if(P.isBatchedMesh&&vt.batchingColor===!1&&P.colorTexture!==null)qt=!0;else if(P.isInstancedMesh&&vt.instancing===!1)qt=!0;else if(!P.isInstancedMesh&&vt.instancing===!0)qt=!0;else if(P.isSkinnedMesh&&vt.skinning===!1)qt=!0;else if(!P.isSkinnedMesh&&vt.skinning===!0)qt=!0;else if(P.isInstancedMesh&&vt.instancingColor===!0&&P.instanceColor===null)qt=!0;else if(P.isInstancedMesh&&vt.instancingColor===!1&&P.instanceColor!==null)qt=!0;else if(P.isInstancedMesh&&vt.instancingMorph===!0&&P.morphTexture===null)qt=!0;else if(P.isInstancedMesh&&vt.instancingMorph===!1&&P.morphTexture!==null)qt=!0;else if(vt.envMap!==gt)qt=!0;else if(z.fog===!0&&vt.fog!==nt)qt=!0;else if(vt.numClippingPlanes!==void 0&&(vt.numClippingPlanes!==Pt.numPlanes||vt.numIntersection!==Pt.numIntersection))qt=!0;else if(vt.vertexAlphas!==Rt)qt=!0;else if(vt.vertexTangents!==Dt)qt=!0;else if(vt.morphTargets!==_t)qt=!0;else if(vt.morphNormals!==Ht)qt=!0;else if(vt.morphColors!==Qt)qt=!0;else if(vt.toneMapping!==jt)qt=!0;else if(vt.morphTargetsCount!==Xt)qt=!0}else qt=!0,vt.__version=z.version;let Ce=vt.currentProgram;if(qt===!0)Ce=hi(z,L,P);let Sn=!1,ve=!1,Yn=!1,te=Ce.getUniforms(),Oe=vt.uniforms;if(pt.useProgram(Ce.program))Sn=!0,ve=!0,Yn=!0;if(z.id!==U)U=z.id,ve=!0;if(Sn||S!==M){if(pt.buffers.depth.getReversed())Mt.copy(M.projectionMatrix),Bo(Mt),zo(Mt),te.setValue(D,"projectionMatrix",Mt);else te.setValue(D,"projectionMatrix",M.projectionMatrix);te.setValue(D,"viewMatrix",M.matrixWorldInverse);let Qe=te.map.cameraPosition;if(Qe!==void 0)Qe.setValue(D,Tt.setFromMatrixPosition(M.matrixWorld));if($t.logarithmicDepthBuffer)te.setValue(D,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2));if(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)te.setValue(D,"isOrthographic",M.isOrthographicCamera===!0);if(S!==M)S=M,ve=!0,Yn=!0}if(P.isSkinnedMesh){te.setOptional(D,P,"bindMatrix"),te.setOptional(D,P,"bindMatrixInverse");let Ee=P.skeleton;if(Ee){if(Ee.boneTexture===null)Ee.computeBoneTexture();te.setValue(D,"boneTexture",Ee.boneTexture,It)}}if(P.isBatchedMesh){if(te.setOptional(D,P,"batchingTexture"),te.setValue(D,"batchingTexture",P._matricesTexture,It),te.setOptional(D,P,"batchingIdTexture"),te.setValue(D,"batchingIdTexture",P._indirectTexture,It),te.setOptional(D,P,"batchingColorTexture"),P._colorsTexture!==null)te.setValue(D,"batchingColorTexture",P._colorsTexture,It)}let Zn=B.morphAttributes;if(Zn.position!==void 0||Zn.normal!==void 0||Zn.color!==void 0)Ot.update(P,B,Ce);if(ve||vt.receiveShadow!==P.receiveShadow)vt.receiveShadow=P.receiveShadow,te.setValue(D,"receiveShadow",P.receiveShadow);if(z.isMeshGouraudMaterial&&z.envMap!==null)Oe.envMap.value=gt,Oe.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1;if(z.isMeshStandardMaterial&&z.envMap===null&&L.environment!==null)Oe.envMapIntensity.value=L.environmentIntensity;if(ve){if(te.setValue(D,"toneMappingExposure",x.toneMappingExposure),vt.needsLights)Ro(Oe,Yn);if(nt&&z.fog===!0)bt.refreshFogUniforms(Oe,nt);bt.refreshMaterialUniforms(Oe,z,K,H,p.state.transmissionRenderTarget[M.id]),ni.upload(D,sr(vt),Oe,It)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0)ni.upload(D,sr(vt),Oe,It),z.uniformsNeedUpdate=!1;if(z.isSpriteMaterial)te.setValue(D,"center",P.center);if(te.setValue(D,"modelViewMatrix",P.modelViewMatrix),te.setValue(D,"normalMatrix",P.normalMatrix),te.setValue(D,"modelMatrix",P.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){let Ee=z.uniformsGroups;for(let Qe=0,je=Ee.length;Qe<je;Qe++){let ar=Ee[Qe];ne.update(ar,Ce),ne.bind(ar,Ce)}}return Ce}function Ro(M,L){M.ambientLightColor.needsUpdate=L,M.lightProbe.needsUpdate=L,M.directionalLights.needsUpdate=L,M.directionalLightShadows.needsUpdate=L,M.pointLights.needsUpdate=L,M.pointLightShadows.needsUpdate=L,M.spotLights.needsUpdate=L,M.spotLightShadows.needsUpdate=L,M.rectAreaLights.needsUpdate=L,M.hemisphereLights.needsUpdate=L}function Co(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}if(this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(M,L,B){St.get(M.texture).__webglTexture=L,St.get(M.depthTexture).__webglTexture=B;let z=St.get(M);if(z.__hasExternalTextures=!0,z.__autoAllocateDepthBuffer=B===void 0,!z.__autoAllocateDepthBuffer){if(Jt.has("WEBGL_multisampled_render_to_texture")===!0)console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1}},this.setRenderTargetFramebuffer=function(M,L){let B=St.get(M);B.__webglFramebuffer=L,B.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(M,L=0,B=0){T=M,A=L,E=B;let z=!0,P=null,nt=!1,ct=!1;if(M){let gt=St.get(M);if(gt.__useDefaultFramebuffer!==void 0)pt.bindFramebuffer(D.FRAMEBUFFER,null),z=!1;else if(gt.__webglFramebuffer===void 0)It.setupRenderTarget(M);else if(gt.__hasExternalTextures)It.rebindTextures(M,St.get(M.texture).__webglTexture,St.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let _t=M.depthTexture;if(gt.__boundDepthTexture!==_t){if(_t!==null&&St.has(_t)&&(M.width!==_t.image.width||M.height!==_t.image.height))throw Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");It.setupDepthRenderbuffer(M)}}let Rt=M.texture;if(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)ct=!0;let Dt=St.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget){if(Array.isArray(Dt[L]))P=Dt[L][B];else P=Dt[L];nt=!0}else if(M.samples>0&&It.useMultisampledRTT(M)===!1)P=St.get(M).__webglMultisampledFramebuffer;else if(Array.isArray(Dt))P=Dt[B];else P=Dt;b.copy(M.viewport),C.copy(M.scissor),N=M.scissorTest}else b.copy(st).multiplyScalar(K).floor(),C.copy(xt).multiplyScalar(K).floor(),N=wt;if(pt.bindFramebuffer(D.FRAMEBUFFER,P)&&z)pt.drawBuffers(M,P);if(pt.viewport(b),pt.scissor(C),pt.setScissorTest(N),nt){let gt=St.get(M.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+L,gt.__webglTexture,B)}else if(ct){let gt=St.get(M.texture),Rt=L||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,gt.__webglTexture,B||0,Rt)}U=-1},this.readRenderTargetPixels=function(M,L,B,z,P,nt,ct){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=St.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0)mt=mt[ct];if(mt){pt.bindFramebuffer(D.FRAMEBUFFER,mt);try{let gt=M.texture,Rt=gt.format,Dt=gt.type;if(!$t.textureFormatReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$t.textureTypeReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}if(L>=0&&L<=M.width-z&&(B>=0&&B<=M.height-P))D.readPixels(L,B,z,P,Lt.convert(Rt),Lt.convert(Dt),nt)}finally{let gt=T!==null?St.get(T).__webglFramebuffer:null;pt.bindFramebuffer(D.FRAMEBUFFER,gt)}}},this.readRenderTargetPixelsAsync=async function(M,L,B,z,P,nt,ct){if(!(M&&M.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let mt=St.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0)mt=mt[ct];if(mt){let gt=M.texture,Rt=gt.format,Dt=gt.type;if(!$t.textureFormatReadable(Rt))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$t.textureTypeReadable(Dt))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=M.width-z&&(B>=0&&B<=M.height-P)){pt.bindFramebuffer(D.FRAMEBUFFER,mt);let _t=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,_t),D.bufferData(D.PIXEL_PACK_BUFFER,nt.byteLength,D.STREAM_READ),D.readPixels(L,B,z,P,Lt.convert(Rt),Lt.convert(Dt),0);let Ht=T!==null?St.get(T).__webglFramebuffer:null;pt.bindFramebuffer(D.FRAMEBUFFER,Ht);let Qt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Oo(D,Qt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,_t),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,nt),D.deleteBuffer(_t),D.deleteSync(Qt),nt}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,L=null,B=0){if(M.isTexture!==!0)ti("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,M=arguments[1];let z=Math.pow(2,-B),P=Math.floor(M.image.width*z),nt=Math.floor(M.image.height*z),ct=L!==null?L.x:0,mt=L!==null?L.y:0;It.setTexture2D(M,0),D.copyTexSubImage2D(D.TEXTURE_2D,B,0,0,ct,mt,P,nt),pt.unbindTexture()},this.copyTextureToTexture=function(M,L,B=null,z=null,P=0){if(M.isTexture!==!0)ti("WebGLRenderer: copyTextureToTexture function signature has changed."),z=arguments[0]||null,M=arguments[1],L=arguments[2],P=arguments[3]||0,B=null;let nt,ct,mt,gt,Rt,Dt,_t,Ht,Qt,jt=M.isCompressedTexture?M.mipmaps[P]:M.image;if(B!==null)nt=B.max.x-B.min.x,ct=B.max.y-B.min.y,mt=B.isBox3?B.max.z-B.min.z:1,gt=B.min.x,Rt=B.min.y,Dt=B.isBox3?B.min.z:0;else nt=jt.width,ct=jt.height,mt=jt.depth||1,gt=0,Rt=0,Dt=0;if(z!==null)_t=z.x,Ht=z.y,Qt=z.z;else _t=0,Ht=0,Qt=0;let ge=Lt.convert(L.format),Xt=Lt.convert(L.type),vt;if(L.isData3DTexture)It.setTexture3D(L,0),vt=D.TEXTURE_3D;else if(L.isDataArrayTexture||L.isCompressedArrayTexture)It.setTexture2DArray(L,0),vt=D.TEXTURE_2D_ARRAY;else It.setTexture2D(L,0),vt=D.TEXTURE_2D;D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,L.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,L.unpackAlignment);let Ge=D.getParameter(D.UNPACK_ROW_LENGTH),qt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Ce=D.getParameter(D.UNPACK_SKIP_PIXELS),Sn=D.getParameter(D.UNPACK_SKIP_ROWS),ve=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,jt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,jt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,gt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Rt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Dt);let Yn=M.isDataArrayTexture||M.isData3DTexture,te=L.isDataArrayTexture||L.isData3DTexture;if(M.isRenderTargetTexture||M.isDepthTexture){let Oe=St.get(M),Zn=St.get(L),Ee=St.get(Oe.__renderTarget),Qe=St.get(Zn.__renderTarget);pt.bindFramebuffer(D.READ_FRAMEBUFFER,Ee.__webglFramebuffer),pt.bindFramebuffer(D.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer);for(let je=0;je<mt;je++){if(Yn)D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,St.get(M).__webglTexture,P,Dt+je);if(M.isDepthTexture){if(te)D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,St.get(L).__webglTexture,P,Qt+je);D.blitFramebuffer(gt,Rt,nt,ct,_t,Ht,nt,ct,D.DEPTH_BUFFER_BIT,D.NEAREST)}else if(te)D.copyTexSubImage3D(vt,P,_t,Ht,Qt+je,gt,Rt,nt,ct);else D.copyTexSubImage2D(vt,P,_t,Ht,Qt+je,gt,Rt,nt,ct)}pt.bindFramebuffer(D.READ_FRAMEBUFFER,null),pt.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(te)if(M.isDataTexture||M.isData3DTexture)D.texSubImage3D(vt,P,_t,Ht,Qt,nt,ct,mt,ge,Xt,jt.data);else if(L.isCompressedArrayTexture)D.compressedTexSubImage3D(vt,P,_t,Ht,Qt,nt,ct,mt,ge,jt.data);else D.texSubImage3D(vt,P,_t,Ht,Qt,nt,ct,mt,ge,Xt,jt);else if(M.isDataTexture)D.texSubImage2D(D.TEXTURE_2D,P,_t,Ht,nt,ct,ge,Xt,jt.data);else if(M.isCompressedTexture)D.compressedTexSubImage2D(D.TEXTURE_2D,P,_t,Ht,jt.width,jt.height,ge,jt.data);else D.texSubImage2D(D.TEXTURE_2D,P,_t,Ht,nt,ct,ge,Xt,jt);if(D.pixelStorei(D.UNPACK_ROW_LENGTH,Ge),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,qt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ce),D.pixelStorei(D.UNPACK_SKIP_ROWS,Sn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ve),P===0&&L.generateMipmaps)D.generateMipmap(vt);pt.unbindTexture()},this.copyTextureToTexture3D=function(M,L,B=null,z=null,P=0){if(M.isTexture!==!0)ti("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,z=arguments[1]||null,M=arguments[2],L=arguments[3],P=arguments[4]||0;return ti('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,L,B,z,P)},this.initRenderTarget=function(M){if(St.get(M).__webglFramebuffer===void 0)It.setupRenderTarget(M)},this.initTexture=function(M){if(M.isCubeTexture)It.setTextureCube(M,0);else if(M.isData3DTexture)It.setTexture3D(M,0);else if(M.isDataArrayTexture||M.isCompressedArrayTexture)It.setTexture2DArray(M,0);else It.setTexture2D(M,0);pt.unbindTexture()},this.resetState=function(){A=0,E=0,T=null,pt.reset(),Ft.reset()},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2000}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorspace=kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=kt._getUnpackColorSpace()}}class Ns extends be{constructor(){super();if(this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ue,this.environmentIntensity=1,this.environmentRotation=new Ue,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){if(super.copy(t,e),t.background!==null)this.background=t.background.clone();if(t.environment!==null)this.environment=t.environment.clone();if(t.fog!==null)this.fog=t.fog.clone();if(this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null)this.overrideMaterial=t.overrideMaterial.clone();return this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);if(this.fog!==null)e.object.fog=this.fog.toJSON();if(this.backgroundBlurriness>0)e.object.backgroundBlurriness=this.backgroundBlurriness;if(this.backgroundIntensity!==1)e.object.backgroundIntensity=this.backgroundIntensity;if(e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1)e.object.environmentIntensity=this.environmentIntensity;return e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Fs extends pe{constructor(t=null,e=1,n=1,i,s,r,o,a,l=1003,c=1003,u,h){super(null,r,o,a,l,c,i,s,u,h);this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oi extends Ae{constructor(t,e,n,i=1){super(t,e,n);this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}function Pi(t,e,n){if(!t||!n&&t.constructor===e)return t;if(typeof e.BYTES_PER_ELEMENT==="number")return new e(t);return Array.prototype.slice.call(t)}function Dd(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}class oi{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],s=e[n-1];n:{t:{let r;e:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=e[++n],t<i)break t}r=e.length;break e}if(!(t>=s)){let o=e[1];if(t<o)n=2,s=o;for(let a=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(i=s,s=e[--n-1],t>=s)break t}r=n,n=0;break e}break n}while(n<r){let o=n+r>>>1;if(t<e[o])r=o;else n=o+1}if(i=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=t*i;for(let r=0;r!==i;++r)e[r]=n[s+r];return e}interpolate_(){throw Error("call to abstract method")}intervalChanged_(){}}class Pa extends oi{constructor(t,e,n,i){super(t,e,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(t,e,n){let i=this.parameterPositions,s=t-2,r=t+1,o=i[s],a=i[r];if(o===void 0)switch(this.getSettings_().endingStart){case 2401:s=t,o=2*e-n;break;case 2402:s=i.length-2,o=e+i[s]-i[s+1];break;default:s=t,o=n}if(a===void 0)switch(this.getSettings_().endingEnd){case 2401:r=t,a=2*n-e;break;case 2402:r=1,a=n+i[1]-i[0];break;default:r=t-1,a=e}let l=(n-e)*0.5,c=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(a-n),this._offsetPrev=s*c,this._offsetNext=r*c}interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=t*o,l=a-o,c=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,f=this._weightNext,m=(n-e)/(i-e),_=m*m,g=_*m,p=-h*g+2*h*_-h*m,d=(1+h)*g+(-1.5-2*h)*_+(-0.5+h)*m+1,y=(-1-f)*g+(1.5+f)*_+0.5*m,x=f*g-f*_;for(let w=0;w!==o;++w)s[w]=p*r[c+w]+d*r[l+w]+y*r[a+w]+x*r[u+w];return s}}class La extends oi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=t*o,l=a-o,c=(n-e)/(i-e),u=1-c;for(let h=0;h!==o;++h)s[h]=r[l+h]*u+r[a+h]*c;return s}}class Da extends oi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}}class ke{constructor(t,e,n,i){if(t===void 0)throw Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Pi(e,this.TimeBufferType),this.values=Pi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Pi(t.times,Array),values:Pi(t.values,Array)};let i=t.getInterpolation();if(i!==t.DefaultInterpolation)n.interpolation=i}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Da(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new La(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Pa(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case 2300:e=this.InterpolantFactoryMethodDiscrete;break;case 2301:e=this.InterpolantFactoryMethodLinear;break;case 2302:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,s=0,r=i-1;while(s!==i&&n[s]<t)++s;while(r!==-1&&n[r]>e)--r;if(++r,s!==0||r!==i){if(s>=r)r=Math.max(r,1),s=r-1;let o=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*o,r*o)}return this}validate(){let t=!0,e=this.getValueSize();if(e-Math.floor(e)!==0)console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1;let n=this.times,i=this.values,s=n.length;if(s===0)console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1;let r=null;for(let o=0;o!==s;o++){let a=n[o];if(typeof a==="number"&&isNaN(a)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,a),t=!1;break}if(r!==null&&r>a){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,a,r),t=!1;break}r=a}if(i!==void 0){if(Dd(i))for(let o=0,a=i.length;o!==a;++o){let l=i[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,s=t.length-1,r=1;for(let o=1;o<s;++o){let a=!1,l=t[o],c=t[o+1];if(l!==c&&(o!==1||l!==t[0]))if(!i){let u=o*n,h=u-n,f=u+n;for(let m=0;m!==n;++m){let _=e[u+m];if(_!==e[h+m]||_!==e[f+m]){a=!0;break}}}else a=!0;if(a){if(o!==r){t[r]=t[o];let u=o*n,h=r*n;for(let f=0;f!==n;++f)e[h+f]=e[u+f]}++r}}if(s>0){t[r]=t[s];for(let o=s*n,a=r*n,l=0;l!==n;++l)e[a+l]=e[o+l];++r}if(r!==t.length)this.times=t.slice(0,r),this.values=e.slice(0,r*n);else this.times=t,this.values=e;return this}clone(){let t=this.times.slice(),e=this.values.slice(),i=new this.constructor(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}}ke.prototype.TimeBufferType=Float32Array;ke.prototype.ValueBufferType=Float32Array;ke.prototype.DefaultInterpolation=2301;class Gn extends ke{constructor(t,e,n){super(t,e,n)}}Gn.prototype.ValueTypeName="bool";Gn.prototype.ValueBufferType=Array;Gn.prototype.DefaultInterpolation=2300;Gn.prototype.InterpolantFactoryMethodLinear=void 0;Gn.prototype.InterpolantFactoryMethodSmooth=void 0;class Ua extends ke{}Ua.prototype.ValueTypeName="color";class Na extends ke{}Na.prototype.ValueTypeName="number";class Fa extends oi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=(n-e)/(i-e),l=t*o;for(let c=l+o;l!==c;l+=4)$e.slerpFlat(s,0,r,l-o,r,l,a);return s}}class Os extends ke{InterpolantFactoryMethodLinear(t){return new Fa(this.times,this.values,this.getValueSize(),t)}}Os.prototype.ValueTypeName="quaternion";Os.prototype.InterpolantFactoryMethodSmooth=void 0;class Vn extends ke{constructor(t,e,n){super(t,e,n)}}Vn.prototype.ValueTypeName="string";Vn.prototype.ValueBufferType=Array;Vn.prototype.DefaultInterpolation=2300;Vn.prototype.InterpolantFactoryMethodLinear=void 0;Vn.prototype.InterpolantFactoryMethodSmooth=void 0;class Oa extends ke{}Oa.prototype.ValueTypeName="vector";var Kr={enabled:!1,files:{},add:function(t,e){if(this.enabled===!1)return;this.files[t]=e},get:function(t){if(this.enabled===!1)return;return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class Ba{constructor(t,e,n){let i=this,s=!1,r=0,o=0,a=void 0,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(c){if(o++,s===!1){if(i.onStart!==void 0)i.onStart(c,r,o)}s=!0},this.itemEnd=function(c){if(r++,i.onProgress!==void 0)i.onProgress(c,r,o);if(r===o){if(s=!1,i.onLoad!==void 0)i.onLoad()}},this.itemError=function(c){if(i.onError!==void 0)i.onError(c)},this.resolveURL=function(c){if(a)return a(c);return c},this.setURLModifier=function(c){return a=c,this},this.addHandler=function(c,u){return l.push(c,u),this},this.removeHandler=function(c){let u=l.indexOf(c);if(u!==-1)l.splice(u,2);return this},this.getHandler=function(c){for(let u=0,h=l.length;u<h;u+=2){let f=l[u],m=l[u+1];if(f.global)f.lastIndex=0;if(f.test(c))return m}return null}}}var Ud=new Ba;class Bi{constructor(t){this.manager=t!==void 0?t:Ud,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,s){n.load(t,i,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}Bi.DEFAULT_MATERIAL_NAME="__DEFAULT";class za extends Bi{constructor(t){super(t)}load(t,e,n,i){if(this.path!==void 0)t=this.path+t;t=this.manager.resolveURL(t);let s=this,r=Kr.get(t);if(r!==void 0)return s.manager.itemStart(t),setTimeout(function(){if(e)e(r);s.manager.itemEnd(t)},0),r;let o=ii("img");function a(){if(c(),Kr.add(t,this),e)e(this);s.manager.itemEnd(t)}function l(u){if(c(),i)i(u);s.manager.itemError(t),s.manager.itemEnd(t)}function c(){o.removeEventListener("load",a,!1),o.removeEventListener("error",l,!1)}if(o.addEventListener("load",a,!1),o.addEventListener("error",l,!1),t.slice(0,5)!=="data:"){if(this.crossOrigin!==void 0)o.crossOrigin=this.crossOrigin}return s.manager.itemStart(t),o.src=t,o}}class Bs extends Bi{constructor(t){super(t)}load(t,e,n,i){let s=new pe,r=new za(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(t,function(o){if(s.image=o,s.needsUpdate=!0,e!==void 0)e(s)},n,i),s}}class zi extends ze{constructor(){super();this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}var zs="\\[\\]\\.:\\/",Nd=new RegExp("["+zs+"]","g"),ks="[^"+zs+"]",Fd="[^"+zs.replace("\\.","")+"]",Od=/((?:WC+[\/:])*)/.source.replace("WC",ks),Bd=/(WCOD+)?/.source.replace("WCOD",Fd),zd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ks),kd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ks),Hd=new RegExp("^"+Od+Bd+zd+kd+"$"),Gd=["material","materials","bones","map"];class ka{constructor(t,e,n){let i=n||Kt.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];if(i!==void 0)i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class Kt{constructor(t,e,n){this.path=e,this.parsedPath=n||Kt.parseTrackName(e),this.node=Kt.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){if(!(t&&t.isAnimationObjectGroup))return new Kt(t,e,n);else return new Kt.Composite(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Nd,"")}static parseTrackName(t){let e=Hd.exec(t);if(e===null)throw Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);if(Gd.indexOf(s)!==-1)n.nodeName=n.nodeName.substring(0,i),n.objectName=s}if(n.propertyName===null||n.propertyName.length===0)throw Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let r=0;r<s.length;r++){let o=s[r];if(o.name===e||o.uuid===e)return o;let a=n(o.children);if(a)return a}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,s=e.propertyIndex;if(!t)t=Kt.findNode(this.rootNode,e.nodeName),this.node=t;if(this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let c=0;c<t.length;c++)if(t[c].name===l){l=c;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let r=t[i];if(r===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;if(this.targetObject=t,t.needsUpdate!==void 0)o=this.Versioning.NeedsUpdate;else if(t.matrixWorldNeedsUpdate!==void 0)o=this.Versioning.MatrixWorldNeedsUpdate;let a=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}if(t.morphTargetDictionary[s]!==void 0)s=t.morphTargetDictionary[s]}a=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else if(r.fromArray!==void 0&&r.toArray!==void 0)a=this.BindingType.HasFromToArray,this.resolvedProperty=r;else if(Array.isArray(r))a=this.BindingType.EntireArray,this.resolvedProperty=r;else this.propertyName=i;this.getValue=this.GetterByBindingType[a],this.setValue=this.SetterByBindingTypeAndVersioning[a][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Kt.Composite=ka;Kt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Kt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Kt.prototype.GetterByBindingType=[Kt.prototype._getValue_direct,Kt.prototype._getValue_array,Kt.prototype._getValue_arrayElement,Kt.prototype._getValue_toArray];Kt.prototype.SetterByBindingTypeAndVersioning=[[Kt.prototype._setValue_direct,Kt.prototype._setValue_direct_setNeedsUpdate,Kt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Kt.prototype._setValue_array,Kt.prototype._setValue_array_setNeedsUpdate,Kt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Kt.prototype._setValue_arrayElement,Kt.prototype._setValue_arrayElement_setNeedsUpdate,Kt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Kt.prototype._setValue_fromArray,Kt.prototype._setValue_fromArray_setNeedsUpdate,Kt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ff=new Float32Array(1);if(typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));if(typeof window<"u")if(window.__THREE__)console.warn("WARNING: Multiple instances of Three.js being imported.");else window.__THREE__="170";function Vd(t){let e=2166136261;for(let n of new TextEncoder().encode(t))e=Math.imul(e^n,16777619)>>>0;return e}function Wd(t){let e=(t^1798369701)>>>0||2654435769,n=new Uint32Array(1024);for(let i=0;i<1024;i++)e^=e<<13,e>>>=0,e^=e>>>17,e^=e<<5,e>>>=0,n[i]=e;return new Uint8Array(n.buffer)}function Ha(t,e){let n=Wd(Vd(e)),i=new Uint8Array(t.length);for(let s=0;s<t.length;s++)i[s]=t[s]^n[s&4095]^s>>12&255;return i}async function Ga(t){let e=new Blob([t]).stream().pipeThrough(new DecompressionStream("deflate"));return new Uint8Array(await new Response(e).arrayBuffer())}async function Xd(t){if(typeof window<"u"&&window.require){let n=window.require("fs");return new Uint8Array(n.readFileSync(t))}if(typeof fetch<"u"){let n=await fetch(t);if(!n.ok)throw Error(`Pack fetch failed: HTTP ${n.status}`);return new Uint8Array(await n.arrayBuffer())}let e=await import("node:fs");return new Uint8Array(e.readFileSync(t))}async function ki(t){let e=t instanceof Uint8Array?t:await Xd(t);if(e.length<12)throw Error("Truncated PAK header");if(String.fromCharCode(...e.subarray(0,4))!=="H0PK")throw Error("Bad PAK magic");let i=new DataView(e.buffer,e.byteOffset,e.byteLength).getUint32(8,!0),s=12+i;if(!i||s>e.length)throw Error("Invalid PAK index length");let r=await Ga(Ha(e.subarray(12,s),"__index__")),o=JSON.parse(new TextDecoder().decode(r));if(!Array.isArray(o)||o.length>1e4)throw Error("Invalid PAK index");let a=new Map;for(let u of o){if(typeof u.p!=="string"||!u.p||u.p.includes("..")||u.p.startsWith("/")||u.p.includes("\\")||a.has(u.p)||!Number.isSafeInteger(u.o)||u.o<0||!Number.isSafeInteger(u.n)||u.n<0||s+u.o+u.n>e.length||!Number.isInteger(u.f))throw Error("Invalid PAK entry");a.set(u.p,u)}async function l(u){let h=a.get(u);if(!h&&!u.includes("/"))h=a.get("textures/"+u)||a.get("meshes/"+u)||a.get("fx/"+u)||a.get("sprites/"+u);if(!h)throw Error("File not found in PAK: "+u);let f=Ha(e.subarray(s+h.o,s+h.o+h.n),h.p);return h.f&1?await Ga(f):f}async function c(u){let h=await l(u);return JSON.parse(new TextDecoder().decode(h))}return{index:o,files:a,readFile:l,readJson:c}}function Va(t){let e=new Bs;return async(n)=>{let i=await t(n),s=URL.createObjectURL(new Blob([i]));try{return await e.loadAsync(s)}finally{URL.revokeObjectURL(s)}}}var Hi=(t)=>({t:"c",v:t}),Wa=["Original Burst","Original Ring","Original Fountain"];function Xa(){let t=(i,s)=>({name:i,max:80,dur:1,delay:Hi(0),loop:!1,bursts:i==="Original Fountain"?[]:[[0,Hi(36),1,0.01]],rate:Hi(i==="Original Fountain"?36:0),life:{t:"r",a:0.45,b:0.95},speed:{t:"r",a:1,b:3},size:{t:"r",a:0.12,b:0.35},rotZ:Hi(0),color:{t:"col",v:s},shape:{type:i==="Original Ring"?10:i==="Original Fountain"?4:0,radius:0.08,thick:1,arc:360,angle:18,scale:{x:1,y:1,z:1},rot:{x:i==="Original Fountain"?-90:0,y:0,z:0},pos:{x:0,y:0,z:0}},render:{mat:{shader:"SH_HunFX_simple",kw:["_USECOLOR_ON"]},mode:0,align:0,len:1},pos:{x:0,y:0,z:0},rot:{x:0,y:0,z:0,w:1},scale:{x:1,y:1,z:1}}),e=[[1,0.25,0.03,1],[0.12,0.7,1,1],[0.55,0.3,1,1]],n=new Map([["manifest.json",{textures:{},meshes:{},effects:Wa.map((i,s)=>({id:i,file:`fx/sample-${s}.json`}))}]]);return Wa.forEach((i,s)=>n.set(`fx/sample-${s}.json`,{textures:[],meshes:[],emitters:[t(i,e[s])]})),{async readJson(i){if(!n.has(i))throw Error(`Unknown sample resource: ${i}`);return structuredClone(n.get(i))},async readFile(i){throw Error(`No binary resource in original samples: ${i}`)}}}function qa({effectId:t,size:e,fps:n,duration:i,colors:s,seed:r,elevation:o=35,facing:a=0}){if(typeof t!=="string"||!t.trim()||t.length>120)throw Error("Effect ID must be a nonempty string (max 120 characters)");for(let[l,c,u,h]of[["size",e,8,256],["fps",n,1,50],["colors",s,2,255],["seed",r,1,2147483646]])if(!Number.isInteger(c)||c<u||c>h)throw Error(`${l} must be an integer in [${u},${h}]`);if(!Number.isFinite(o)||Math.abs(o)>90||!Number.isFinite(a)||Math.abs(a)>360)throw Error("Camera angles out of range: elevation [-90,90], facing [-360,360]");if(!Number.isFinite(i)||i<=0||i>10)throw Error("duration must be in (0,10] seconds")}function Ya(t,e){return{...t,...e.top,emitters:t.emitters.map((n,i)=>e.emitters[i]?{...n,...e.emitters[i]}:n)}}function Za(t,e,n){let i={...t,emitters:[...t.emitters],roles:[...t.roles||t.emitters.map(()=>null)],textures:[...t.textures],meshes:[...t.meshes]};return e.emitters.forEach((s,r)=>{if(n.layers&&!n.layers.includes(s.name))return;let o=structuredClone(s);if(n.delay){let a=o.delay||{t:"c",v:0};o.delay=a.t==="r"?{...a,a:a.a+n.delay,b:a.b+n.delay}:{t:"c",v:(a.v||0)+n.delay}}if(n.scale&&n.scale!==1){let a=n.scale;o.scale={x:o.scale.x*a,y:o.scale.y*a,z:o.scale.z*a},o.pos={x:o.pos.x*a,y:o.pos.y*a,z:o.pos.z*a}}if(n.pos)o.pos={x:o.pos.x+n.pos[0],y:o.pos.y+n.pos[1],z:o.pos.z+n.pos[2]};if(n.loop!==void 0)o.loop=!!n.loop;i.emitters.push(o),i.roles.push((e.roles||[])[r]||null);for(let a of Object.values(o.render?.mat?.tex||{}))if(a&&!i.textures.includes(a))i.textures.push(a);if(o.render?.mode===4&&o.render.mesh&&!i.meshes.includes(o.render.mesh))i.meshes.push(o.render.mesh)}),i}function Ja({readJson:t,loadTexture:e,loadMesh:n}){let i=null,s=null,r=new Map,o=new Map,a=(m)=>i?.effects?.find((_)=>_.id===m)||null;async function l(){if(!i)i=t("manifest.json");return i=await i,f}function c(m={}){if(!i||i instanceof Promise)throw Error("call await init() or load() first");return i.effects.filter((_)=>Object.entries(m).every(([g,p])=>_[g]===p)).map((_)=>_.id)}function u(m){if(r.has(m))return Promise.resolve(r.get(m));if(o.has(m))return o.get(m);let _=a(m);if(!_)return Promise.reject(Error(`unknown effect "${m}"`));let g=(async()=>{let p;if(_.base){s??=t(_.file);let[d,y]=await Promise.all([s,t(a(_.base).file)]);p=Ya(y,d[m])}else p=await t(_.file);if(_.mix){p={...p,emitters:[...p.emitters],roles:[...p.roles||p.emitters.map(()=>null)],textures:[...p.textures],meshes:[...p.meshes]};for(let d of _.mix){let y=a(d.from),x=y.base?await u(d.from):await t(y.file);p=Za(p,x,d)}}return await Promise.all([...p.textures.map((d)=>e(d)),...p.meshes.map((d)=>n(d))]),r.set(m,p),o.delete(m),p})();return o.set(m,g),g}async function h(m){await l();let _=Array.isArray(m)?m:[m];return await Promise.all(_.map((g)=>u(g))),f}let f={init:l,load:h,info:a,list:c,getDefinition:(m)=>r.get(m)};return f}function $a({textures:t,meshes:e,readJson:n,loadTexture:i,anisotropy:s=4}){let r=new Map,o=new Map,a=new Fs(new Uint8Array([255,255,255,255]),1,1,ra);a.needsUpdate=!0;let l=new kn(1,1),c={value:0},u=!1;function h(d){if(r.has(d))return r.get(d).promise;let y=t[d],x={tex:null,promise:null};return x.promise=i(y.file).then((w)=>{if(w.wrapS=w.wrapT=y.clamp?sa:ia,w.anisotropy=s,w.colorSpace=aa,x.tex=w,u)w.dispose();return w}),r.set(d,x),x.promise}async function f(d){if(o.has(d))return o.get(d);let y=n(e[d].file).then((x)=>{let w=new ze;if(w.setAttribute("position",new Re(x.pos,3)),w.setAttribute("uv",new Re(x.uv,2)),w.setIndex(x.idx),x.nrm)w.setAttribute("normal",new Re(x.nrm,3));else w.computeVertexNormals();if(o.set(d,w),u)w.dispose();return w});return o.set(d,y),y}return{loadTexture:h,loadMesh:f,texture:(d)=>r.get(d)?.tex||null,srgb:(d)=>!!t[d]?.srgb,geometry:(d)=>o.get(d),white:a,quad:l,timeU:c,dispose:()=>{if(u)return;u=!0;for(let d of r.values())if(d.tex)d.tex.dispose();for(let d of o.values())if(d.isBufferGeometry)d.dispose();l.dispose(),a.dispose()}}}function Ka(t){let e=t>>>0;if(e===0)e=1;return()=>(e=e*16807%2147483647,e)}function Qa(t){let e=Ka(t),n=0;return{next(){return n++,(e()-1)/2147483646},reset(i=t){t=i,e=Ka(t),n=0},get draws(){return n}}}function Et(t,e,n){if(!t)return 0;switch(t.t){case"c":return t.v;case"r":return t.a+(t.b-t.a)*n;case"k":return t.s*Hs(t.k,e);case"rk":{let i=Hs(t.a,e),s=Hs(t.b,e);return t.s*(i+(s-i)*n)}default:return 0}}function Hs(t,e){if(!t.length)return 0;if(e<=t[0][0])return t[0][1];if(e>=t.at(-1)[0])return t.at(-1)[1];for(let n=1;n<t.length;n++){let i=t[n-1],s=t[n];if(e>s[0])continue;let r=s[0]-i[0];if(r<=0)return s[1];let o=(e-i[0])/r,a=o*o,l=a*o;return(2*l-3*a+1)*i[1]+(l-2*a+o)*i[3]*r+(-2*l+3*a)*s[1]+(l-a)*s[2]*r}}function ja(t,e,n,i,s,r){let o=t.dur,a=i-e.delay;if(!(!e.stopped&&a>=0&&(t.loop||a<=o)))return;let l=t.loop?a%o:a,c=t.loop?Math.floor(a/o):0;if(e.cycle!==c)e.cycle=c,e.burstDone=t.bursts.map(()=>0);t.bursts.forEach(([h,f,m,_],g)=>{let p=Math.max(1,m||1),d=_||0.01;while(e.burstDone[g]<p&&l>=h+e.burstDone[g]*d)e.burstDone[g]++,r(Math.round(Et(f,0,s())),l)});let u=Et(t.rate,l/o,s());if(u>0){e.rateAcc+=u*n;let h=Math.floor(e.rateAcc);if(h>0)e.rateAcc-=h,r(h,l)}}function vn(t,e,n,i){if(!t)return i[0]=i[1]=i[2]=i[3]=1,i;let s=t.t;if(s==="col"){let r=t.v;for(let o=0;o<4;o++)i[o]=r[o];return i}if(s==="rcol"){let{a:r,b:o}=t,a=n;for(let l=0;l<4;l++)i[l]=r[l]+(o[l]-r[l])*a;return i}if(s==="grad")return Gs(t.g,e,i);if(s==="rgrad"){let r=Gs(t.a,e,[0,0,0,0]),o=Gs(t.b,e,[0,0,0,0]);for(let a=0;a<4;a++)i[a]=r[a]+(o[a]-r[a])*n;return i}return i}function to(t,e,n){let i=t[0];if(t.length===1||e<=i[0])return[i,i,0];let s=t[t.length-1];if(e>=s[0])return[s,s,0];for(let r=0;r+1<t.length;r++){let o=t[r],a=t[r+1];if(e<=a[0]){let l=n===1?1:(e-o[0])/Math.max(0.000001,a[0]-o[0]);return[o,a,l]}}return[s,s,0]}function Gs(t,e,n){let{m:i,c:s}=t;if(s.length===0)n[0]=1,n[1]=1,n[2]=1;else{let o=to(s,e,i);for(let a=0;a<3;a++)n[a]=o[0][a+1]+(o[1][a+1]-o[0][a+1])*o[2]}let r=t.a;if(r.length===0)n[3]=1;else{let o=to(r,e,i);n[3]=o[0][1]+(o[1][1]-o[0][1])*o[2]}return n}var yn=Math.PI/180;function eo(t,e){let[n,i,s]=t,r=e.z*yn,o=Math.cos(r),a=Math.sin(r);return[n,i]=[n*o-i*a,n*a+i*o],r=e.x*yn,o=Math.cos(r),a=Math.sin(r),[i,s]=[i*o-s*a,i*a+s*o],r=e.y*yn,o=Math.cos(r),a=Math.sin(r),[n,s]=[n*o+s*a,-n*a+s*o],[n,i,s]}function no(t,e){let n=[0,0,0],i=[0,0,1];if(t){let s=t.type;if(s===0||s===1||s===2||s===3){let r=e()*2-1,o=e()*Math.PI*2,a=Math.sqrt(1-r*r);if(i=[a*Math.cos(o),r,a*Math.sin(o)],s>=2&&i[2]<0)i[2]=-i[2];let l=t.radius*(1-t.thick*(1-Math.cbrt(e())));n=[i[0]*l,i[1]*l,i[2]*l]}else if(s===4||s===7||s===8||s===9){let r=e()*t.arc*yn,o=1-t.thick*(1-Math.sqrt(e())),a=Math.cos(r)*o,l=Math.sin(r)*o,c=Math.sin(t.angle*yn);n=[a*t.radius,l*t.radius,0],i=[a*c,l*c,Math.cos(t.angle*yn)];let u=Math.hypot(i[0],i[1],i[2]);if(i=[i[0]/u,i[1]/u,i[2]/u],s===8||s===9){let h=e()*(t.len||0)/Math.max(0.0001,i[2]);n=[n[0]+i[0]*h,n[1]+i[1]*h,n[2]+i[2]*h]}}else if(s===10||s===11){let r=e()*t.arc*yn,o=s===11?1:1-t.thick*(1-Math.sqrt(e()));i=[Math.cos(r),Math.sin(r),0],n=[i[0]*o*t.radius,i[1]*o*t.radius,0]}else if(s===5)n=[e()-0.5,e()-0.5,e()-0.5],i=[0,0,1];n=[n[0]*t.scale.x,n[1]*t.scale.y,n[2]*t.scale.z],n=eo(n,t.rot),i=eo(i,t.rot),n=[n[0]+t.pos.x,n[1]+t.pos.y,n[2]+t.pos.z]}return{pos:n,dir:i}}function io(t,e,n,i,s,r=null){let o=Math.min(t.max||1000,256),a=Math.min(1,i/Math.max(0.0001,t.dur)),l=t.space===1&&r,c=t.trail;for(let u=0;u<n&&e.length<o;u++){let h=t.shape,{pos:f,dir:m}=no(h,s),_=Math.max(0.01,Et(t.life,a,s())),g=Et(t.speed,a,s()),p=Et(t.size,a,s()),d=t.size3D?[p,Et(t.sizeY,a,s()),Et(t.sizeZ,a,s())]:[p,p,p],y=Et(t.rotZ,a,s());if(t.flipRot&&s()<t.flipRot)y=-y;let x=t.rot3D?[Et(t.rotX,a,s()),Et(t.rotY,a,s()),y]:[0,0,y];if(h&&h.align){let U=Math.atan2(m[0],m[2]),S=-Math.asin(Math.max(-1,Math.min(1,m[1])));x=[x[0]+S,x[1]+U,x[2]]}let w=vn(t.color,a,s(),[1,1,1,1]),A=t.render.flip||{x:0,y:0},E=[m[0]*g,m[1]*g,m[2]*g];if(l){let U=r;f=[U[0]*f[0]+U[1]*f[1]+U[2]*f[2]+U[3],U[4]*f[0]+U[5]*f[1]+U[6]*f[2]+U[7],U[8]*f[0]+U[9]*f[1]+U[10]*f[2]+U[11]],E=[U[0]*E[0]+U[1]*E[1]+U[2]*E[2],U[4]*E[0]+U[5]*E[1]+U[6]*E[2],U[8]*E[0]+U[9]*E[1]+U[10]*E[2]]}let T={age:0,life:_,pos:f,vel:E,sz:d,rot:x,col:w,r:[s(),s(),s(),s(),s(),s(),s(),s()],flip:[s()<A.x?1:0,s()<A.y?1:0],seed:s()*100,rowR:s()};if(c&&s()<=(c.ratio??1))T.trail=[];e.push(T)}}function so(t,e,n,i,s){let r=-9.81*Et(t.grav,0,0);for(let o=e.length-1;o>=0;o--){let a=e[o];if(a.age+=n,a.age>=a.life){e.splice(o,1);continue}let l=a.age/a.life,c=a.vel;if(c[1]+=r*n,t.forceOL)c[0]+=Et(t.forceOL.x,l,a.r[3])*n,c[1]+=Et(t.forceOL.y,l,a.r[3])*n,c[2]+=Et(t.forceOL.z,l,a.r[3])*n;if(t.clamp){let y=Math.hypot(c[0],c[1],c[2]);if(y>0.000001){let x=y,w=Et(t.clamp.mag,l,a.r[4]);if(x>w)x=w+(x-w)*Math.pow(1-t.clamp.dampen,n*30);let A=Et(t.clamp.drag,l,a.r[4]);if(A>0)x*=Math.exp(-A*n);let E=x/y;c[0]*=E,c[1]*=E,c[2]*=E}}let u=a.pos[0],h=a.pos[1],f=a.pos[2],m=0,_=0,g=0,p=1,d=t.velOL;if(d)m=Et(d.x,l,a.r[5]),_=Et(d.y,l,a.r[5]),g=Et(d.z,l,a.r[5]),p=Et(d.speedModifier,l,a.r[5]);if(a.pos[0]+=(c[0]+m)*p*n,a.pos[1]+=(c[1]+_)*p*n,a.pos[2]+=(c[2]+g)*p*n,d){let y=Et(d.orbitalX,l,a.r[5]),x=Et(d.orbitalY,l,a.r[5]),w=Et(d.orbitalZ,l,a.r[5]),A=Et(d.radial,l,a.r[5]),E=Et(d.orbitalOffsetX,l,0),T=Et(d.orbitalOffsetY,l,0),U=Et(d.orbitalOffsetZ,l,0);if(y||x||w||A){let S=a.pos[0]-E,b=a.pos[1]-T,C=a.pos[2]-U,N,V,k;if(y)N=y*p*n,V=Math.cos(N),k=Math.sin(N),[b,C]=[b*V-C*k,b*k+C*V];if(x)N=x*p*n,V=Math.cos(N),k=Math.sin(N),[S,C]=[S*V+C*k,-S*k+C*V];if(w)N=w*p*n,V=Math.cos(N),k=Math.sin(N),[S,b]=[S*V-b*k,S*k+b*V];if(A){let X=Math.hypot(S,b,C);if(X>0.00001){let H=1+A*p*n/X;S*=H,b*=H,C*=H}}a.pos[0]=S+E,a.pos[1]=b+T,a.pos[2]=C+U}}if(t.noise){let y=Et(t.noise.str,l,a.r[6]),x=t.noise.freq,w=a.pos,A=a.seed,E=a.age*2;a.pos[0]+=Math.sin(w[1]*x*3.1+A+E*1.7)*y*n,a.pos[1]+=Math.sin(w[2]*x*2.7+A*1.3+E*1.3)*y*n,a.pos[2]+=Math.sin(w[0]*x*2.9+A*1.7+E*1.9)*y*n}if(n>0.000001){let y=a.tv||(a.tv=[0,0,0]);y[0]=(a.pos[0]-u)/n,y[1]=(a.pos[1]-h)/n,y[2]=(a.pos[2]-f)/n}if(a.trail){let y=s(a),x=a.trail,w=x[x.length-1];if(!w||Math.hypot(y[0]-w[0],y[1]-w[1],y[2]-w[2])>=(t.trail.minDist||0.01))x.push([y[0],y[1],y[2],i]);let A=Et(t.trail.life,l,a.r[3])*a.life;while(x.length&&i-x[0][3]>A)x.shift()}}}function ro(t,e){return[t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3],t[4]*e[0]+t[5]*e[1]+t[6]*e[2]+t[7],t[8]*e[0]+t[9]*e[1]+t[10]*e[2]+t[11]]}class Vs{constructor(t,e){this.d=t,this.rng=e,this.p=[],this.world=t.space===1,this.wm=null,this.wmInv=null,this.tr=t.trail||null}play(){let t=this.d;if(this.p.length=0,this.t=0,this.delay=Et(t.delay,0,this.rng()),this.rateAcc=0,this.burstDone=t.bursts.map(()=>0),this.cycle=-1,this.stopped=!1,t.loop&&t.prewarm){let n=0,i=this.delay;this.delay=0;while(n<t.dur)n+=0.016666666666666666,this.update(0.016666666666666666,n);this.preT=t.dur,this.delay=i-t.dur}else this.preT=0}update(t,e){ja(this.d,this,t,e,this.rng,(n,i)=>{io(this.d,this.p,n,i,this.rng,this.wm)}),so(this.d,this.p,t,e,(n)=>this._trailPos(n))}_trailPos(t){let e=this.tr.world,n=this.world;if(e===1&&!n&&this.wm)return ro(this.wm,t.pos);if(e!==1&&n&&this.wmInv)return ro(this.wmInv,t.pos);return[t.pos[0],t.pos[1],t.pos[2]]}emitting(t){if(this.stopped)return!1;return this.d.loop?!0:t-this.delay<=this.d.dur}stop(){this.stopped=!0}}var Ws=0.008333333333333333,qd=0.25;class Xs{constructor(t,e){this.hooks=e,this.rng=Qa(1),this.parts=t.map((n)=>new Vs(n,()=>this.rng.next())),this.seed=1,this.t=0,this.clock=0,this.playing=!1,this.finished=!1,this.tempo=1}play(t){this.seed=t??1+Math.floor(Math.random()*2147483645),this.rng.reset(this.seed),this.t=0,this.clock=0,this.playing=!0,this.finished=!1,this.hooks.syncWorld(this);for(let e of this.parts)e.play();return this.hooks.write(this,null),this}stop(){for(let t of this.parts)t.stop();return this}seek(t,e=null){if(t<this.t-0.000000001)this.play(this.seed);return this.clock=t,this.hooks.syncWorld(this),this._advance(),this.hooks.write(this,e),this}update(t,e=null){if(!this.playing)return;if(this.clock+=Math.min(t,qd)*this.tempo,this.hooks.syncWorld(this),this._advance(),this.hooks.write(this,e),!this.finished&&this._isDone())this.finished=!0,this.playing=!1,this.hooks.finished(this)}_advance(){while(this.t+Ws<=this.clock+0.000000001){this.t+=Ws;for(let t of this.parts)t.update(Ws,this.t)}}_isDone(){for(let t of this.parts)if(t.p.length||t.emitting(this.t))return!1;return!0}}var Yd=1024,ao=[["iPos",3],["iVel",3],["iSize",3],["iRot",4],["iColor",4],["iUV",4],["iCustom",4],["iFlip",2]];function oo(t,e,n,i,s,r){let o=[];return t.emitters.forEach((a,l)=>{let c=a.render;if(!c.mat)return;let u=c.mode===0&&(c.align===1||c.align===2),h=c.mode===4||u?4:c.mode===1?1:0,f=c.mode===4&&c.mesh?n.geometry(c.mesh):n.quad,m=new zi;m.index=f.index;for(let A in f.attributes)m.setAttribute(A,f.attributes[A]);let _=Math.min(a.max||1000,256),g={};for(let[A,E]of ao){let T=new Oi(new Float32Array(_*E),E);T.setUsage(Ss),m.setAttribute(A,T),g[A]=T}m.instanceCount=0;let p=s(c.mat,h,{viewAlign:c.mode===4&&c.align===0,gradeU:i.gradeU,intU:i.intU,timeU:n.timeU},n);p.uniforms.uLen.value=c.len,p.uniforms.uVelScale.value=c.vel||0;let d=c.pivot||{x:0,y:0,z:0};if(c.mode===4&&c.mesh){if(!f.boundingBox)f.computeBoundingBox();let A=f.boundingBox.getSize(new O);p.uniforms.uPivot.value.set(d.x*A.x,d.y*A.y,-d.z*A.z)}else p.uniforms.uPivot.value.set(d.x,d.y,d.z);let y=new Se(m,p);y.frustumCulled=!1,y.renderOrder=l+-(c.fudge||0)*10,y.name=a.name;let x=new Ze;x.position.set(a.pos.x,a.pos.y,-a.pos.z),x.quaternion.set(-a.rot.x,-a.rot.y,a.rot.z,a.rot.w),x.scale.set(a.scale.x,a.scale.y,a.scale.z),x.add(y),r.add(x);let w={sim:e[l],mesh:y,geo:m,A:g,mode:h,mat:p,idx:l,holder:x,name:a.name,role:(t.roles||[])[l]||null,sort:c.sort===1||c.sort===4};if(a.trail&&a.trail.mat){let A=new zi;A.index=n.quad.index;for(let S in n.quad.attributes)A.setAttribute(S,n.quad.attributes[S]);let E={};for(let[S,b]of ao){let C=new Oi(new Float32Array(Yd*b),b);C.setUsage(Ss),A.setAttribute(S,C),E[S]=C}A.instanceCount=0;let T=s(a.trail.mat,1,{gradeU:i.gradeU,intU:i.intU,timeU:n.timeU},n);T.uniforms.uLen.value=1,T.uniforms.uVelScale.value=0;let U=new Se(A,T);U.frustumCulled=!1,U.renderOrder=y.renderOrder-0.5,U.name=a.name+" (trail)",x.add(U),w.trail={mesh:U,geo:A,A:E,mat:T,d:a.trail}}o.push(w)}),o}var qs=new ee,lo=new ee;function co(t,e){let n=t.elements;return e=e||Array(12),e[0]=n[0],e[1]=n[4],e[2]=-n[8],e[3]=n[12],e[4]=n[1],e[5]=n[5],e[6]=-n[9],e[7]=n[13],e[8]=-n[2],e[9]=-n[6],e[10]=n[10],e[11]=-n[14],e}function ho(t,e){let n=!1;for(let i of e)if(i.sim.world||i.trail){n=!0;break}if(!n)return;t.updateWorldMatrix(!0,!0);for(let i of e){if(!(i.sim.world||i.trail))continue;qs.copy(i.holder.matrixWorld),lo.copy(qs).invert(),i.sim.wm=co(qs,i.sim.wm),i.sim.wmInv=co(lo,i.sim.wmInv)}}var Ys=(t)=>t<=0.04045?t/12.92:t<=1?Math.pow((t+0.055)/1.055,2.4):Math.pow(t,2.2);function Gi(t,e,n){let i=t,s=e,r=s.age/s.life,o=1,a=1,l=1;if(i.sizeOL){let g=i.sizeOL,p=s.r[0];if(g.sep)o=Et(g.x,r,p),a=Et(g.y,r,p),l=Et(g.z,r,p);else o=a=l=Et(g.x,r,p)}n.size[0]=s.sz[0]*o,n.size[1]=s.sz[1]*a,n.size[2]=s.sz[2]*l;let c=s.rot[0],u=s.rot[1],h=s.rot[2];if(i.rotOL){let g=s.r[1];if(h+=Et(i.rotOL.z,r,g)*s.age,i.rotOL.sep)c+=Et(i.rotOL.x,r,g)*s.age,u+=Et(i.rotOL.y,r,g)*s.age}n.rot[0]=c,n.rot[1]=u,n.rot[2]=h;let f=n.color;if(f[0]=s.col[0],f[1]=s.col[1],f[2]=s.col[2],f[3]=s.col[3],i.colorOL){let g=vn(i.colorOL,r,s.r[2],[1,1,1,1]);f[0]*=g[0],f[1]*=g[1],f[2]*=g[2],f[3]*=g[3]}f[0]=Ys(f[0]),f[1]=Ys(f[1]),f[2]=Ys(f[2]);let m=n.uv;if(m[0]=0,m[1]=0,m[2]=1,m[3]=1,i.uv){let g=i.uv.tx,p=i.uv.ty,d=i.uv.type===1,y=d?g:g*p,x=i.uv.fps?s.age*i.uv.fps/y%1:r,w=Et(i.uv.fot,x,s.r[7])*(i.uv.fps?1:i.uv.cycles)+Et(i.uv.start,0,s.r[7])/y,A=Math.floor((w%1+1)%1*y);if(A>=y)A=y-1;let E,T;if(d)T=i.uv.rowMode===1?Math.min(p-1,Math.floor(s.rowR*p)):Math.min(p-1,i.uv.row||0),E=A;else E=A%g,T=Math.floor(A/g);m[0]=E/g,m[1]=1-(T+1)/p,m[2]=1/g,m[3]=1/p}let _=n.custom;if(_[0]=_[1]=_[2]=_[3]=0,i.custom)for(let g=0;g<4;g++)_[g]=Et(i.custom[g],r,s.r[3]);return n}var uo=new O,Zd=new O,fo=new ee,po=new Ue,li=new $e,Ke={size:[0,0,0],rot:[0,0,0],color:[0,0,0,0],uv:[0,0,0,0],custom:[0,0,0,0]},Jd=(t,e)=>[t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3],t[4]*e[0]+t[5]*e[1]+t[6]*e[2]+t[7],t[8]*e[0]+t[9]*e[1]+t[10]*e[2]+t[11]],$d=(t,e)=>[t[0]*e[0]+t[1]*e[1]+t[2]*e[2],t[4]*e[0]+t[5]*e[1]+t[6]*e[2],t[8]*e[0]+t[9]*e[1]+t[10]*e[2]];function mo(t,e=null){let n=t;n.mesh.getWorldScale(uo),n.mat.uniforms.uScale.value=uo.x;let i=n.sim.p,s=n.A,r=i.length;if(e&&n.sort&&r>1)n.mesh.updateMatrixWorld(),fo.multiplyMatrices(e.matrixWorldInverse,n.mesh.matrixWorld),i=i.map((a)=>[a,Zd.set(a.pos[0],a.pos[1],-a.pos[2]).applyMatrix4(fo).z]).sort((a,l)=>a[1]-l[1]).map((a)=>a[0]);let o=n.sim.world&&n.sim.wmInv?n.sim.wmInv:null;for(let a=0;a<r;a++){let l=i[a];Gi(n.sim.d,l,Ke);let c=o?Jd(o,l.pos):l.pos;s.iPos.array.set([c[0],c[1],-c[2]],a*3);{let u=l.tv||l.vel;if(o)u=$d(o,u);s.iVel.array.set([u[0],u[1],-u[2]],a*3)}if(s.iSize.array.set(Ke.size,a*3),n.mode===4)po.set(-Ke.rot[0],-Ke.rot[1],Ke.rot[2],"YXZ"),li.setFromEuler(po),s.iRot.array.set([li.x,li.y,li.z,li.w],a*4);else s.iRot.array.set([0,0,-Ke.rot[2],0],a*4);s.iColor.array.set(Ke.color,a*4),s.iUV.array.set(Ke.uv,a*4),s.iCustom.array.set(Ke.custom,a*4),s.iFlip.array.set(l.flip,a*2)}for(let a in s)s[a].needsUpdate=!0;n.geo.instanceCount=r}var Kd=1024,Zs=(t)=>t<=0.04045?t/12.92:t<=1?Math.pow((t+0.055)/1.055,2.4):Math.pow(t,2.2);function Qd(t,e){return[t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3],t[4]*e[0]+t[5]*e[1]+t[6]*e[2]+t[7],t[8]*e[0]+t[9]*e[1]+t[10]*e[2]+t[11]]}function go(t){let e=t.sim,n=t.trail.d,i=t.trail.A,s=n.world===1?e.wmInv:null;t.trail.mat.uniforms.uScale.value=t.mat.uniforms.uScale.value;let r={size:[0,0,0],rot:[0,0,0],color:[0,0,0,0],uv:[0,0,0,0],custom:[0,0,0,0]},o=0;for(let a of e.p){if(!a.trail||!a.trail.length)continue;Gi(e.d,a,r);let l=a.age/a.life,u=[e._trailPos(a)];for(let d=a.trail.length-1;d>=0;d--)u.push(a.trail[d]);let h=u.map((d)=>s?Qd(s,d):d),f=0,m=[0];for(let d=1;d<h.length;d++)f+=Math.hypot(h[d][0]-h[d-1][0],h[d][1]-h[d-1][1],h[d][2]-h[d-1][2]),m.push(f);if(f<0.00001)continue;let _=n.inherit?r.color:[1,1,1,1],g=n.colLife?vn(n.colLife,l,a.r[2],[1,1,1,1]):[1,1,1,1],p=n.sizeW?r.size[0]:1;for(let d=0;d+1<h.length&&o<Kd;d++){let y=h[d],x=h[d+1],w=m[d+1]-m[d];if(w<0.000001)continue;let A=m[d]/f,E=m[d+1]/f,T=(A+E)/2,U=n.colTrail?vn(n.colTrail,T,a.r[2],[1,1,1,1]):[1,1,1,1],S=p*(Et(n.width,A,a.r[4])+Et(n.width,E,a.r[4]))/2;i.iPos.array.set([(y[0]+x[0])/2,(y[1]+x[1])/2,-(y[2]+x[2])/2],o*3),i.iVel.array.set([x[0]-y[0],x[1]-y[1],-(x[2]-y[2])],o*3),i.iSize.array.set([S,w,1],o*3),i.iRot.array.set([0,0,0,0],o*4),i.iColor.array.set([_[0]*Zs(U[0]*g[0]),_[1]*Zs(U[1]*g[1]),_[2]*Zs(U[2]*g[2]),_[3]*U[3]*g[3]],o*4),i.iUV.array.set([E,0,A-E,1],o*4),i.iCustom.array.set([0,0,0,0],o*4),i.iFlip.array.set([0,0],o*2),o++}}for(let a in i)i[a].needsUpdate=!0;t.trail.geo.instanceCount=o}function _o(t,e,n,i,s){let r=new Ze,o=[],a=(m)=>m.render.mat,l=t.emitters.filter(a),c=new Xs(l,{syncWorld:()=>ho(r,o),write:(m,_)=>{for(let g of o)if(mo(g,_),g.trail)go(g)},finished:()=>s(f)}),u=[],h=0;t.emitters.forEach((m,_)=>{if(a(m))u[_]=c.parts[h++]}),o=oo(t,u,e,n,i,r);let f={group:r,clock:c,parts:o};return f}var Js=(t)=>t<=0.04045?t/12.92:t<=1?Math.pow((t+0.055)/1.055,2.4):Math.pow(t,2.2),Xn=(t)=>new Gt(Js(t[0]),Js(t[1]),Js(t[2]),t[3]),Mn=(t,e=[0,0])=>new Vt(...(t||e).slice(0,2)),qn=(t,e=[0,0,1,1])=>new Gt(...t||e);function xo(t,e,n,i,s){let{VS:r,COMMON_FS:o,SIMPLE_FS:a,STENCIL_FS:l,ADD_FS:c}=s,u=t.kw||[],h=t.f||{},f=t.c||{},m=t.tex||{},_=t.st||{},g=(T)=>({value:T&&i.texture(T)||i.white}),p=(T)=>T&&i.srgb(T)?1:0,d={MODE:e};if(n.viewAlign)d.VIEWALIGN="";let y,x=ta,w=!1,A={uTime:n.timeU,uLen:{value:2},uVelScale:{value:0},uScale:{value:1},uPivot:{value:new O},uGrade:n.gradeU,uInt:n.intU},E=(T)=>new Gt(..._[T]||[1,1,0,0]);if(e===4&&m._VOTex&&(h._VOintensity||0)!==0)d.VO="",Object.assign(A,{tVO:g(m._VOTex),uVOuv:{value:qn(f._VOTex_uv)},uVOspd:{value:Mn(f._VOTex_speed)},uVOI:{value:h._VOintensity}});if(t.shader==="SH_HunFX_simple"){if(y=a,u.includes("_USECOLOR_ON"))d.USECOLOR="";if(u.includes("_USEGASALPHA_ON"))d.GASALPHA="";Object.assign(A,{tMain:g(m._MainTexture),sR:{value:new Gt(p(m._MainTexture),0,0,0)},uTint:{value:Xn(f._Color_tint||[1,1,1,1])},uUVs:{value:qn(f._uv,[1,1,0,0])},uPan:{value:Mn(f._Panner)}})}else if(t.shader==="SH_HunFX_Stencil")y=l,Object.assign(A,{tMain:g(m._Main_Tex),sR:{value:new Gt(p(m._Main_Tex),0,0,0)},uST:{value:E("_Main_Tex")},uMainC:{value:Xn(f._Main_Color||[1,1,1,1])},uBGC:{value:Xn(f._BG_Color||[0,0,0,0])},uSharp:{value:h._Sharpness??1}});else if(t.shader.startsWith("builtin_")){y=c,w=!0;let T=m._MainTex;Object.assign(A,{tMain:g(T),sR:{value:new Gt(p(T),0,0,0)},uST:{value:E("_MainTex")},uTint:{value:Xn(f._TintColor||[0.5,0.5,0.5,0.5])}})}else{y=o;let T=t.shader==="SH_HunFX_common_back"||t.shader==="SH_HunFX_common_front";if(T)d.LEGACY="",d.USECOLOR="",x=t.shader.endsWith("back")?jr:Qr;if(u.includes("_USECOLOR_ON"))d.USECOLOR="";if(!T&&u.includes("_USEDISSOLVECOLOR_ON"))d.DISSCOL="";if(u.includes("_USEPOSXSCROLL_ON"))d.POSX="";if(u.includes("_USEFRESNEL_ON"))d.FRESNEL="";if(!T&&u.includes("_USEDEPTHFADE_ON"))d.DEPTHFADE="";let U=T?_._Mask||[1,1,0,0]:[...(f._MaskTex_tile||[1,1]).slice(0,2),...(f._MaskTex_offset||[0,0]).slice(0,2)];Object.assign(A,{tMain:g(m._MainTexture),tDiss:g(m._DissolveTex),tMask:g(m._Mask),tDist:g(m._DistTex),tSub:g(m._SubDissolveTex),sR:{value:new Gt(p(m._MainTexture),p(m._DissolveTex),p(m._Mask),p(m._DistTex))},uMainUV:{value:qn(f._MainTex_uv)},uDissUV:{value:qn(f._DissolveTex_uv)},uDistUVS:{value:qn(f._DistTex_uv_speed,[1,1,0,0])},uCol1:{value:Xn(f._color1||[1,1,1,1])},uCol2:{value:Xn(f._color2||[0,0,0,1])},uUDRL:{value:qn(f._Mask_udrl,[0,0,0,0])},uFlags:{value:new Gt(h._MainTex_UV_invert||0,h._DissTex_UV_invert||0,h._MaskTex_UV_invert||0,h._InvertFresnel||0)},uSub:{value:new Gt(h._UseSubDissTex||0,h._SubDissolveTex_multi??1,h._SubDissolveTex_add||0,0)},uMainSpd:{value:Mn(f._MainTex_speed)},uDissSpd:{value:Mn(f._DissolveTex_speed)},uSS:{value:Mn(f._Smoothstep,[0,1])},uDCS:{value:Mn(f._DissolveColor_step,[0,1])},uMaskTile:{value:new Vt(U[0],U[1])},uMaskOff:{value:new Vt(U[2],U[3])},uMaskSpd:{value:Mn(f._MaskTex_speed)},uCI:{value:h._ColorIntensity??1},uMaskMult:{value:h._MaskMult??1},uDistI:{value:T?0:h._Distort_intensity||0},uFresPow:{value:T?5:h._Fresnel_pow??5},uDFD:{value:h._DepthFade_Distance??1}})}return new Ne({vertexShader:r,fragmentShader:y,uniforms:A,defines:d,transparent:!0,depthWrite:!1,depthTest:!0,side:x,blending:ea,blendSrc:w?Di:na,blendDst:w?Di:Ms,blendSrcAlpha:Di,blendDstAlpha:Ms})}var $s={};Do($s,{ADD_FS:()=>sf,COMMON_FS:()=>tf,SIMPLE_FS:()=>ef,STENCIL_FS:()=>nf,VS:()=>jd});var jd=`
attribute vec3 iPos; attribute vec3 iVel; attribute vec3 iSize; attribute vec4 iRot;
attribute vec4 iColor; attribute vec4 iUV; attribute vec4 iCustom; attribute vec2 iFlip;
uniform float uLen, uVelScale, uScale, uTime; uniform vec3 uPivot;
#ifdef VO
uniform sampler2D tVO; uniform vec4 uVOuv; uniform vec2 uVOspd; uniform float uVOI;
#endif
varying vec2 vUv; varying vec4 vColor; varying vec4 vCustom; varying vec3 vN; varying vec3 vV;
varying vec3 vWorld; varying float vEye;
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
void main() {
  vec2 luv = uv;
#if MODE == 4
  vec3 flip = vec3(iFlip.x > 0.5 ? -1.0 : 1.0, iFlip.y > 0.5 ? -1.0 : 1.0, 1.0);
  vec3 qpos = qrot(iRot, (position * flip + uPivot) * iSize);
  vec3 qnrm = qrot(iRot, normal * flip);
#ifdef VO
  vec2 voUv = (uv + uVOuv.xy) * uVOuv.zw + uTime * uVOspd;
  qpos += normalize(qnrm) * texture2D(tVO, voUv).r * uVOI / max(uScale, 1e-4);
#endif
#ifdef VIEWALIGN
  vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
  mv.xyz += vec3(qpos.x, qpos.y, -qpos.z) * uScale;
  vN = normalize(vec3(qnrm.x, qnrm.y, -qnrm.z));
#else
  vec4 mv = modelViewMatrix * vec4(iPos + qpos, 1.0);
  vN = normalize(normalMatrix * qnrm);
#endif
  vV = normalize(-mv.xyz);
#elif MODE == 1
  vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
  vec3 velView = (modelViewMatrix * vec4(iVel, 0.0)).xyz;
  vec3 axis = length(velView) > 1e-6 ? normalize(velView) : vec3(0.0, 1.0, 0.0);
  vec3 across = cross(normalize(-mv.xyz), axis);
  float alen = length(across);
  across = alen > 1e-4 ? across / alen : vec3(1.0, 0.0, 0.0);
  float streak = (iSize.y * uLen + length(iVel) * uVelScale) * uScale;
  float width = iSize.x * uScale;
  float shift = uPivot.y * iSize.y * uScale;
  mv.xyz += axis * (position.y * streak + shift) + across * (position.x * width);
  luv = vec2(0.5 - position.y, position.x + 0.5);
  vN = vec3(0.0, 0.0, 1.0); vV = vN;
#else
  vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
  vec2 quad = (position.xy + uPivot.xy) * iSize.xy * uScale;
  float cs = cos(iRot.z), sn = sin(iRot.z);
  mv.xy += vec2(quad.x * cs - quad.y * sn, quad.x * sn + quad.y * cs);
  vN = vec3(0.0, 0.0, 1.0); vV = vN;
#endif
#if MODE != 4
  if (iFlip.x > 0.5) luv.x = 1.0 - luv.x;
  if (iFlip.y > 0.5) luv.y = 1.0 - luv.y;
#endif
  vUv = iUV.xy + luv * iUV.zw;
  vColor = iColor; vCustom = iCustom;
  vWorld = (inverse(viewMatrix) * mv).xyz;
  vEye = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,tf=`
uniform mat3 uGrade; uniform float uInt;
uniform sampler2D tMain, tDiss, tMask, tDist, tSub; uniform vec4 sR; uniform float uTime;
uniform vec4 uMainUV, uDissUV, uDistUVS, uCol1, uCol2, uUDRL, uFlags, uSub;
uniform vec2 uMainSpd, uDissSpd, uSS, uDCS, uMaskTile, uMaskOff, uMaskSpd;
uniform float uCI, uMaskMult, uDistI, uFresPow, uDFD;
varying vec2 vUv; varying vec4 vColor; varying vec4 vCustom; varying vec3 vN; varying vec3 vV;
varying vec3 vWorld; varying float vEye;
float toLinear(float x) { return x <= 0.04045 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4); }
vec3 toLinear3(vec3 c) { return vec3(toLinear(c.r), toLinear(c.g), toLinear(c.b)); }
float smoothEdge(float a, float b, float x) {
  float d = b - a;
  if (abs(d) < 1e-6) return x > a ? 1.0 : 0.0;
  float t = clamp((x - a) / d, 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
float groundFade(float span) {
  vec3 ray = vWorld - cameraPosition;
  float travel = length(ray);
  if (ray.y > -1e-5 || cameraPosition.y <= 0.0) return 1.0;
  float hit = -cameraPosition.y / (ray.y / travel);
  return clamp(abs(vEye * hit / travel - vEye) / max(span, 1e-4), 0.0, 1.0);
}
void main() {
  float warp = texture2D(tDist, vUv * uDistUVS.xy + uTime * uDistUVS.zw).r;
  if (sR.w > 0.5) warp = toLinear(warp);
  warp *= uDistI;
#ifdef POSX
  vec2 drift = vec2(vCustom.y, 0.0);
#else
  vec2 drift = vec2(0.0, vCustom.y);
#endif
  vec2 mUv = ((vUv + warp + drift) + uMainUV.xy) * uMainUV.zw + uTime * uMainSpd;
  if (uFlags.x > 0.5) mUv = mUv.yx;
  vec4 base = texture2D(tMain, mUv);
  if (sR.x > 0.5) base.rgb = toLinear3(base.rgb);
  vec2 dUv = ((drift + vUv + warp) + uDissUV.xy) * uDissUV.zw + uTime * uDissSpd;
  if (uFlags.y > 0.5) dUv = dUv.yx;
  float dissolve = texture2D(tDiss, dUv).g;
  if (sR.y > 0.5) dissolve = toLinear(dissolve);
  if (uSub.x > 0.5) dissolve -= texture2D(tSub, vUv).r * uSub.y + uSub.z;
#if defined(LEGACY)
  float ramp = base.r;
#elif defined(DISSCOL)
  float ramp = smoothEdge(uDCS.x, uDCS.y, dissolve);
#else
  float ramp = smoothEdge(uDCS.x, uDCS.y, base.r);
#endif
#ifdef USECOLOR
  vec4 tint = mix(uCol2, uCol1, ramp);
#else
  vec4 tint = base;
#endif
  vec3 rgb = tint.rgb * (uCI + vCustom.z) * vColor.rgb;
  float alpha = base.a * vColor.a * smoothEdge(uSS.x, uSS.y, dissolve - vCustom.x);
#ifdef FRESNEL
  float fres = clamp(pow(max(0.0, 1.0 - dot(normalize(vN), normalize(vV))), uFresPow), 0.0, 1.0);
  if (uFlags.w > 0.5) fres = 1.0 - fres;
  alpha *= fres;
#endif
#ifdef LEGACY
  float mask = texture2D(tMask, vUv * uMaskTile + uMaskOff).r;
  if (sR.z > 0.5) mask = toLinear(mask);
  alpha *= mask;
#else
  vec2 maskUv = vUv * uMaskTile + uMaskOff + uTime * uMaskSpd + warp;
  if (uFlags.z > 0.5) maskUv = maskUv.yx;
  float mask = texture2D(tMask, maskUv).b;
  if (sR.z > 0.5) mask = toLinear(mask);
  alpha *= clamp(mask * uMaskMult, 0.0, 1.0);
#endif
#ifdef DEPTHFADE
  alpha *= groundFade(uDFD);
#endif
  alpha *= smoothEdge(0.0, uUDRL.y, vUv.y) * smoothEdge(0.0, uUDRL.x, 1.0 - vUv.y)
         * smoothEdge(0.0, uUDRL.w, vUv.x) * smoothEdge(0.0, uUDRL.z, 1.0 - vUv.x);
  gl_FragColor = vec4(uGrade * rgb * uInt, clamp(alpha, 0.0, 1.0));
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,ef=`
uniform mat3 uGrade; uniform float uInt;
uniform sampler2D tMain; uniform vec4 sR; uniform vec4 uTint; uniform vec4 uUVs; uniform vec2 uPan; uniform float uTime;
varying vec2 vUv; varying vec4 vColor; varying vec4 vCustom; varying vec3 vN; varying vec3 vV;
float toLinear(float x) { return x <= 0.04045 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4); }
void main() {
  vec4 m = texture2D(tMain, vUv * uUVs.xy + uUVs.zw + uTime * uPan);
  if (sR.x > 0.5) m.rgb = vec3(toLinear(m.r), toLinear(m.g), toLinear(m.b));
#ifdef USECOLOR
  vec4 c = m * vColor;
#else
  vec4 c = vColor;
#endif
#ifdef GASALPHA
  float al = m.g;
#else
  float al = m.a;
#endif
  gl_FragColor = vec4(uGrade * (uTint.rgb * c.rgb) * uInt, clamp(al * vColor.a, 0.0, 1.0));
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,nf=`
uniform mat3 uGrade; uniform float uInt;
uniform sampler2D tMain; uniform vec4 sR, uST, uMainC, uBGC; uniform float uSharp;
varying vec2 vUv; varying vec4 vColor; varying vec4 vCustom; varying vec3 vN; varying vec3 vV;
float toLinear(float x) { return x <= 0.04045 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4); }
void main() {
  vec4 m = texture2D(tMain, vUv * uST.xy + uST.zw);
  if (sR.x > 0.5) m.rgb = vec3(toLinear(m.r), toLinear(m.g), toLinear(m.b));
  float d = uSharp;
  float t = d > 1e-5 ? clamp((m.r - vCustom.x) / d, 0.0, 1.0) : (m.r > vCustom.x ? 1.0 : 0.0);
  float a = t * t * (3.0 - 2.0 * t);
  gl_FragColor = vec4(uGrade * mix(uBGC.rgb, uMainC.rgb, m.rgb) * uInt, a);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,sf=`
uniform mat3 uGrade; uniform float uInt;
uniform sampler2D tMain; uniform vec4 sR, uST, uTint;
varying vec2 vUv; varying vec4 vColor; varying vec4 vCustom; varying vec3 vN; varying vec3 vV;
float toLinear(float x) { return x <= 0.04045 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4); }
void main() {
  vec4 m = texture2D(tMain, vUv * uST.xy + uST.zw);
  if (sR.x > 0.5) m.rgb = vec3(toLinear(m.r), toLinear(m.g), toLinear(m.b));
  vec4 c = 2.0 * uTint * vColor * m;
  gl_FragColor = vec4(uGrade * c.rgb * c.a * uInt, 1.0);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;var vo=Math.PI/180;function yo(t,e,n,i){let s=new Ns,r=null,o=()=>{if(!r)return;s.remove(r.group);for(let _ of r.parts)if(_.geo.dispose(),_.mat.dispose(),_.trail)_.trail.geo.dispose(),_.trail.mat.dispose();r=null},a=async()=>{},l=(_,g,p)=>{let d=g[0],y=g[2],x=0,w=d*d+y*y;if(w>0.0000000001){let A=Math.sqrt(w);d/=A,y/=A,x=Math.atan2(-d,-y)}_.rotation.set(0,x,(p||0)*vo,"YXZ")};return{load:a,start:(_={})=>{o(),r=_o(t,e,n,(y,x,w,A)=>xo(y,x,w,A,$s),()=>{}),s.add(r.group);let g=(_.facing||0)*vo,p=_.nativeX?[-Math.sin(g),0,-Math.cos(g)]:[Math.cos(g),0,-Math.sin(g)];l(r.group,p,_.roll);let d=new Set(_.hidden||[]);if(_.hideGlow){for(let y of r.parts)if(/glow/i.test(y.role||"")||/^Glow/i.test(y.name||""))d.add(y.idx)}for(let y of r.parts)if(d.has(y.idx)||d.has(y.name)||y.role&&d.has(y.role)){if(y.mesh.visible=!1,y.trail)y.trail.mesh.visible=!1}return r.clock.tempo=_.speed||1,r.clock.play(_.seed>>>0||1),r},update:(_,g)=>{if(e.timeU.value+=_,r)r.clock.update(_,g)},resize:(_,g)=>i.setSize(_,g,!1),read:(_,g,p,d)=>{i.setClearColor(p,1),i.render(s,d);let y=i.getContext(),x=new Uint8Array(_*g*4);return y.readPixels(0,0,_,g,y.RGBA,y.UNSIGNED_BYTE,x),x},setIntensity:(_)=>{n.intU.value=_},dispose:o}}function Mo(t,e,n,i,s){let r=new Uint8ClampedArray(t*e*4);for(let o=0;o<e;o++){let a=(e-1-o)*t;for(let l=0;l<t;l++){let c=(a+l)*4,u=(o*t+l)*4,h=Math.max(255-(i[c]-n[c]),255-(i[c+1]-n[c+1]),255-(i[c+2]-n[c+2]));if(h=h<0?0:h>255?255:h,r[u+3]=h,h>0)r[u]=s[c]*255/h,r[u+1]=s[c+1]*255/h,r[u+2]=s[c+2]*255/h}}return{w:t,h:e,data:r}}function So(t,e,n){for(let s=0,r=0;r<65536;r++,s+=4)if(Math.max(255-(n[s]-e[s]),255-(n[s+1]-e[s+1]),255-(n[s+2]-e[s+2]))>30){let a=r%256,l=r/256|0;if(a<t.x0)t.x0=a;if(a>t.x1)t.x1=a;if(l<t.y0)t.y0=l;if(l>t.y1)t.y1=l}return t}function bo(t,e){if(t.x1<t.x0)return null;let n=e.searchHalf||16,i=256,s=2*n/i,r=-n+(t.x0-1)*s,o=-n+(t.x1+2)*s,a=-n+(t.y0-1)*s,l=-n+(t.y1+2)*s,c=[1,1];if(e.aspect==="auto"){let d=(o-r)/(l-a);c=d>1.7?[2,1]:d<0.5882352941176471?[1,2]:[1,1]}let u=1+2*(e.padding??0.06),h;if(e.framing==="fixed")h=e.size*e.worldPerPx;else h=Math.max((o-r)/c[0],(l-a)/c[1])*u;let f=(r+o)/2,m=(a+l)/2;if(e.center==="origin")f=0,m=0;r=f-h*c[0]/2,o=f+h*c[0]/2,a=m-h*c[1]/2,l=m+h*c[1]/2;let _=Math.max(2,Math.min(8,Math.round((e.srcRes||384)/e.size))),g=e.size*_*c[0],p=e.size*_*c[1];return{left:r,right:o,bottom:a,top:l,shape:c,k:_,width:g,height:p,origin:[(0-r)/(o-r),(l-0)/(l-a)],worldPerPx:h/e.size}}function Ks(t,e,n,i,s){let r=new Ni(e,n,s,i,-300,300),o=Math.max(0.01,Math.min(89.99,t.elevation))*Math.PI/180;return r.position.set(0,Math.sin(o),Math.cos(o)),r.up.set(0,1,0),r.lookAt(0,0,0),r.updateMatrixWorld(),r}async function Eo(t,e,n=()=>{},i=()=>new Promise((s)=>setTimeout(s))){await t.load();let s=e.fps,r=1/s,o=Math.max(1,Math.round(e.duration*s)),a=(e.loop?e.warmup||0:0)+(e.start||0),l=e.searchHalf||16,c=256;t.resize(c,c);let u=Ks(e,-l,l,-l,l),h=(g)=>{let p=Math.round(g*60);for(let d=0;d<p;d++)t.update(0.016666666666666666,u)};t.start(e),h(a);let f={x0:1e9,x1:-1e9,y0:1e9,y1:-1e9};for(let g=0;g<o;g++)if(h(r),So(f,t.read(c,c,0,u),t.read(c,c,16777215,u)),g%4===0)n(0.4*g/o),await i();let m=bo(f,e);if(!m)return{frames:[],empty:!0};t.resize(m.width,m.height),u=Ks(e,m.left,m.right,m.bottom,m.top),t.start(e),h(a);let _=[];for(let g=0;g<o;g++){h(r);let p=t.read(m.width,m.height,0,u),d=t.read(m.width,m.height,16777215,u);t.setIntensity(0.5);let y=t.read(m.width,m.height,0,u);if(t.setIntensity(1),_.push(Mo(m.width,m.height,p,d,y)),g%2===0)n(0.4+0.6*g/o),await i()}return n(1),{frames:_,origin:m.origin,shape:m.shape,k:m.k,fps:s,worldPerPx:m.worldPerPx}}function rf(t,e,n,i,s,r=!1){let o=n*i;if(!Number.isInteger(n)||n<1||!Number.isInteger(i)||i<1||t.length!==o||e.length!==o*3)throw{code:"INVALID_PIXELS",stage:"pixel",message:"Invalid mask dimensions",context:{width:n,height:i}};if(!(s>1))return;function a(l,c,u){let h=new Uint8Array(o);for(let f=0;f<o;f++){if(h[f]||t[f]>0!==l)continue;let m=[f],_=[],g=!1;h[f]=1;for(let p=0;p<m.length;p++){let d=m[p],y=d%n,x=Math.floor(d/n);if(y===0||x===0||y===n-1||x===i-1)g=!0;for(let w=-1;w<=1;w++)for(let A=-1;A<=1;A++){if(!A&&!w||!c&&A&&w)continue;let E=y+A,T=x+w;if(E<0||E>=n||T<0||T>=i)continue;let U=T*n+E;if(t[U]>0!==l){_.push(U);continue}if(!h[U])h[U]=1,m.push(U)}}u(m,_,g)}}if(a(!0,!0,(l)=>{if(l.length<s)for(let c of l)t[c]=0}),r)a(!1,!1,(l,c,u)=>{if(u||l.length>=s||!c.length)return;let h=[0,0,0],f=0;for(let m of c){f+=t[m];for(let _=0;_<3;_++)h[_]+=e[m*3+_]}for(let m of l){t[m]=f/c.length;for(let _=0;_<3;_++)e[m*3+_]=h[_]/c.length}})}function af(t,e){if(!Number.isInteger(e)||e<1||e>256)throw{code:"INVALID_PALETTE_SIZE",stage:"pixel",message:"Expected palette size in [1,256]",context:{count:e}};let n=[];for(let s=0;s<t.length;s+=4){if(t[s+3]===0)continue;n.push([t[s]/255,t[s+1]/255,t[s+2]/255])}if(!n.length)return[[0,0,0]];let i=[n];while(i.length<e){let s=-1,r=-1,o=0;for(let c=0;c<i.length;c++){if(i[c].length<2)continue;for(let u=0;u<3;u++){let h=1/0,f=-1/0;for(let _ of i[c])h=Math.min(h,_[u]),f=Math.max(f,_[u]);let m=(f-h)*(u===1?1.2:1);if(m>r)s=c,r=m,o=u}}if(s<0||r<=0.0001)break;let a=i[s].sort((c,u)=>c[o]-u[o]),l=Math.floor(a.length/2);i.splice(s,1,a.slice(0,l),a.slice(l))}return i.map((s)=>[0,1,2].map((r)=>s.reduce((o,a)=>o+a[r],0)/s.length))}var Qs={alphaThreshold:0.28,alphaLevels:1,colors:16,paletteMode:"auto",palette:null,autoBright:!0,brightness:1,whiteHot:0.4,edgeDark:0.3,hue:0,saturation:1,dither:"none",ditherStrength:0.5,outline:"none",outlineColor:"auto",outlineCorners:!1,cleanup:0,fillHoles:!0,gradient:{on:!1,preset:"Fire",stops:["#2a0a12","#a8231a","#ff7a1a","#ffe68a"],pos:[0,0.3333,0.6667,1],mix:1,reverse:!1}},of=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map((t)=>(t+0.5)/16),lf=[0,2,3,1].map((t)=>(t+0.5)/4);function cf(t,e,n,i,s){if(!i&&s===1)return[t,e,n];let r=i*Math.PI/180,o=Math.cos(r),a=Math.sin(r),l=t*(0.213+o*0.787-a*0.213)+e*(0.715-o*0.715-a*0.715)+n*(0.072-o*0.072+a*0.928),c=t*(0.213-o*0.213+a*0.143)+e*(0.715+o*0.285+a*0.14)+n*(0.072-o*0.072-a*0.283),u=t*(0.213-o*0.213-a*0.787)+e*(0.715-o*0.715+a*0.715)+n*(0.072+o*0.928+a*0.072),h=0.213*l+0.715*c+0.072*u;return[h+(l-h)*s,h+(c-h)*s,h+(u-h)*s]}function hf(t,e,n,i){let s=0,r=1/0;for(let o=0;o<t.length;o++){let a=t[o],l=a[0]-e,c=a[1]-n,u=a[2]-i,h=l*l+c*c+u*u;if(h<r)r=h,s=o}return s}function wo(t,e,n){n={...Qs,...n};let[i,s]=t.shape||[1,1],r=Math.round(t.outW||e*i),o=Math.round(t.outH||e*s);if(!(r>=1&&o>=1)||!t.frames?.length)throw Error(`nothing to pixelate (size ${r}x${o}, ${t.frames?.length??0} frames)`);let a=[];for(let A of t.frames){let E=A.w/r,T=new Float32Array(r*o*3),U=new Float32Array(r*o),S=A.data,b=E*E;for(let C=0;C<o;C++)for(let N=0;N<r;N++){let V=0,k=0,X=0,H=0;for(let it=0;it<E;it++){let st=((C*E+it)*A.w+N*E)*4;for(let xt=0;xt<E;xt++,st+=4){let wt=S[st+3];H+=wt,V+=S[st]*wt,k+=S[st+1]*wt,X+=S[st+2]*wt}}let K=C*r+N,G=H/b/255;if(U[K]=G,H>0){let it=2*V/H/255,st=2*k/H/255,xt=2*X/H/255,wt=Math.max(0,Math.max(it,st,xt)-1)*n.whiteHot;it=Math.min(1,it+wt),st=Math.min(1,st+wt),xt=Math.min(1,xt+wt),T[K*3]=it,T[K*3+1]=st,T[K*3+2]=xt}}a.push({col:T,al:U})}for(let A of a)for(let E=0;E<r*o;E++){let T=A.al[E];if(!(T>0))continue;let[U,S,b]=cf(A.col[E*3],A.col[E*3+1],A.col[E*3+2],n.hue,n.saturation),C=1-n.edgeDark+n.edgeDark*Math.sqrt(T);A.col[E*3]=U*C,A.col[E*3+1]=S*C,A.col[E*3+2]=b*C}let l=n.alphaThreshold,c=Math.max(1,n.alphaLevels|0),u=(A)=>A<=l?0:c===1?1:Math.ceil((A-l)/(1-l)*c)/c,h=n.brightness,f=[];for(let A of a)for(let E=0;E<r*o;E++)if(u(A.al[E])>0){if(f.length<40000||Math.random()<0.1)f.push([A.col[E*3],A.col[E*3+1],A.col[E*3+2]])}if(n.autoBright&&f.length){let A=f.map((E)=>0.3*E[0]+0.59*E[1]+0.11*E[2]).sort((E,T)=>E-T);h*=Math.min(1.8,Math.max(1,0.62/Math.max(0.001,A[A.length*0.9|0])))}for(let A of f)A[0]=Math.min(1,A[0]*h),A[1]=Math.min(1,A[1]*h),A[2]=Math.min(1,A[2]*h);let m=f.length>30000?f.filter((A,E)=>E%Math.ceil(f.length/30000)===0):f,_=new Uint8ClampedArray(m.length*4);for(let A=0;A<m.length;A++)_[A*4]=Math.round(m[A][0]*255),_[A*4+1]=Math.round(m[A][1]*255),_[A*4+2]=Math.round(m[A][2]*255),_[A*4+3]=255;let g=n.paletteMode==="custom"&&n.palette&&n.palette.length?n.palette:af(_,Math.max(2,n.colors|0)),p=null;if(n.outline!=="none")if(Array.isArray(n.outlineColor))p=n.outlineColor;else{let A=g[0],E=9;for(let T of g){let U=0.3*T[0]+0.59*T[1]+0.11*T[2];if(U<E)E=U,A=T}p=A.map((T)=>T*0.45)}let d=n.dither==="bayer4"?[of,4]:n.dither==="bayer2"?[lf,2]:null,y=n.ditherStrength/Math.max(2,Math.cbrt(g.length)),x=[];for(let A of a){let E=new ImageData(r,o),T=E.data,U=new Uint8Array(r*o),S=new Float32Array(r*o);for(let b=0;b<r*o;b++)S[b]=u(A.al[b]);if(n.cleanup>1)rf(S,A.col,r,o,n.cleanup|0,n.fillHoles);for(let b=0;b<o;b++)for(let C=0;C<r;C++){let N=b*r+C,V=S[N];if(!V)continue;let k=Math.min(1,A.col[N*3]*h),X=Math.min(1,A.col[N*3+1]*h),H=Math.min(1,A.col[N*3+2]*h);if(d){let it=(d[0][b%d[1]*d[1]+C%d[1]]-0.5)*y;k+=it,X+=it,H+=it}let K=g[hf(g,k,X,H)],G=N*4;T[G]=K[0]*255+0.5,T[G+1]=K[1]*255+0.5,T[G+2]=K[2]*255+0.5,T[G+3]=V*255+0.5,U[N]=1}if(p){let b=[[1,0],[-1,0],[0,1],[0,-1]],C=b.concat([[1,1],[1,-1],[-1,1],[-1,-1]]),N=n.outlineCorners?C:b,V=[];for(let k=0;k<o;k++)for(let X=0;X<r;X++){let H=k*r+X,K=U[H];if(n.outline==="outer"===!!K)continue;for(let[G,it]of N){let st=X+G,xt=k+it;if((st>=0&&xt>=0&&st<r&&xt<o?U[xt*r+st]:0)!==K){V.push(H);break}}}for(let k of V){let X=k*4;T[X]=p[0]*255,T[X+1]=p[1]*255,T[X+2]=p[2]*255,T[X+3]=255}}x.push(E)}let w=g.map((A)=>A.map((E)=>Math.round(E*255)));return{frames:x,w:r,h:o,palette:w,outline:p&&p.map((A)=>Math.round(A*255)),gain:h}}function uf(t,e){let n=[],i=1<<e,s=i+1,r=e+1,o=s+1,a=new Map,l=0,c=0,u=(f)=>{l|=f<<c,c+=r;while(c>=8)n.push(l&255),l>>>=8,c-=8};u(i);let h=t[0];for(let f=1;f<t.length;f++){let m=t[f],_=h*4096+m;if(a.has(_)){h=a.get(_);continue}if(u(h),o<4096){if(a.set(_,o++),o>1<<r&&r<12)r++}else u(i),a=new Map,r=e+1,o=s+1;h=m}if(u(h),u(s),c>0)n.push(l&255);return n}function js(t,e={}){if(!Array.isArray(t)||!t.length)throw Error("GIF: no frames");if(t.some((p)=>p.width!==t[0].width||p.height!==t[0].height||p.data?.length!==p.width*p.height*4))throw Error("GIF: inconsistent frames");let n=Math.max(1,e.scale|0||1),i=t[0].width*n,s=t[0].height*n,r=e.background,o=new Map,a=[];if(!r)a.push([0,0,0]);let l=(p,d,y)=>{let x=p<<16|d<<8|y,w=o.get(x);if(w===void 0)w=a.length,o.set(x,w),a.push([p,d,y]);return w};if(r)l(r[0],r[1],r[2]);let c=t.map((p)=>{let d=p.data,y=new Uint8Array(i*s);for(let x=0;x<s;x++)for(let w=0;w<i;w++){let A=(Math.floor(x/n)*p.width+Math.floor(w/n))*4;if(d[A+3]<128)y[x*i+w]=r?l(r[0],r[1],r[2]):0;else y[x*i+w]=r&&d[A+3]<255?l(...[0,1,2].map((E)=>Math.round(d[A+E]*d[A+3]/255+r[E]*(1-d[A+3]/255)))):l(d[A],d[A+1],d[A+2])}return y});if(a.length>256)throw Error("GIF: more than 256 colours");let u=1;while(1<<u<a.length)u++;let h=[],f=(p)=>h.push(p&255,p>>8&255);h.push(...[..."GIF89a"].map((p)=>p.charCodeAt(0))),f(i),f(s),h.push(128|u-1,0,0);for(let p=0;p<1<<u;p++){let d=a[p]||[0,0,0];h.push(d[0],d[1],d[2])}h.push(33,255,11,...[..."NETSCAPE2.0"].map((p)=>p.charCodeAt(0)),3,1),f(e.loop===!1?1:0),h.push(0);let m=e.fps||15,_=e.holds||c.map(()=>1),g=0;for(let[p,d]of c.entries()){let y=_[p]??1;if(y<=0)continue;g+=100*y/m;let x=Math.round(g);g-=x,h.push(33,249,4,r?0:9),f(Math.max(1,x)),h.push(r?0:0,0),h.push(44),f(0),f(0),f(i),f(s),h.push(0);let w=Math.max(2,u);h.push(w);let A=uf(d,w);for(let E=0;E<A.length;E+=254){let T=A.slice(E,E+254);h.push(T.length,...T)}h.push(0)}return h.push(59),new Uint8Array(h)}async function To({pakPath:t,effectId:e,size:n=64,fps:i=15,duration:s=0.77,elevation:r=35,facing:o=0,colors:a=16,renderer:l,pack:c,seed:u=1}){qa({effectId:e,size:n,fps:i,duration:s,colors:a,seed:u,elevation:r,facing:o});let h=c||(t?await ki(t):Xa()),f=await h.readJson("manifest.json"),m=Va((p)=>h.readFile(p)),_=$a({textures:f.textures||{},meshes:f.meshes||{},readJson:(p)=>h.readJson(p),loadTexture:m}),g;try{let p=Ja({readJson:(T)=>h.readJson(T),loadTexture:_.loadTexture,loadMesh:_.loadMesh});await p.load(e);let d=p.getDefinition(e),y={gradeU:{value:new Ct},intU:{value:1}};g=yo(d,_,y,l);let w=await Eo(g,{elevation:r,facing:o,seed:u,roll:0,nativeX:!1,speed:1,fps:i,duration:s,size:n,framing:"auto",aspect:"square",padding:0.06}),A=wo(w,n,{...Qs,colors:a,autoBright:!0});return{gifBytes:js(A.frames,{fps:i,scale:1}),frameCount:A.frames.length,captured:w,frames:A.frames,palette:A.palette}}finally{g?.dispose(),_?.dispose()}}window.run=async(t,e,n)=>{let i=new Us({canvas:document.querySelector("canvas"),alpha:!0,antialias:!0,preserveDrawingBuffer:!0});try{let s=n?await ki(Uint8Array.from(atob(n),(a)=>a.charCodeAt(0))):void 0,r=await To({effectId:t,size:e,duration:1.2,renderer:i,pack:s}),o="";for(let a of r.gifBytes)o+=String.fromCharCode(a);return{ok:!0,b64:btoa(o),frames:r.frameCount}}finally{i.dispose()}};
