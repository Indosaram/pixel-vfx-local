export const VS = `
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
}`;

export const COMMON_FS = `
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
}`;

export const SIMPLE_FS = `
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
}`;

export const STENCIL_FS = `
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
}`;

export const ADD_FS = `
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
}`;
