---
title: "결과를 매일 들여다보면 무슨 일이 생길까?"
description: "훔쳐보기(peeking)와 실험을 멈추는 시점"
date: 2026-10-06T09:00:00+09:00
tags: ["peeking", "A/B 테스트", "조기 중단"]
draft: false
---
안만 발행된다 ===== -->
<article>

<blockquote><p><strong>실험 결과를 매일 확인하고 유의해지면 멈추는 습관은, 아무 차이가 없는 실험도 다섯 중 하나꼴로 “승리”로 바꿉니다.</strong></p></blockquote>

## 들어가며

<p>지난 칼럼에서 p값을 “아무 차이가 없다면 지금만큼, 또는 그보다 더 극단적인 결과가 나올 비율”이라고 정리했습니다. 그런데 실제로 A/B 테스트를 돌려 보면 결과를 하루에도 몇 번씩 들여다보게 됩니다. 실험 3일차, 대시보드에 p = 0.04가 떴습니다. 여기서 멈추고 B를 배포해도 될까요?</p>
<p>이번 글에서는 <strong>A와 B가 완전히 같은</strong> 실험을 2주 동안 매일 들여다보는 상황을 직접 시뮬레이션해 봅니다. 그다음 왜 가짜 승리가 늘어나는지, 그러면 언제 멈춰야 하는지, 그래도 중간에 봐야 한다면 어떤 방법이 있는지까지 정리해 보겠습니다.</p>

## 차이가 없는 실험도 다섯 중 하나는 “승리”합니다

<p>이런 실험을 상상해 보겠습니다. 버튼 A와 B는 사실 완전히 같아서 둘 다 전환율이 정확히 5%입니다. 각 그룹에 하루 500명씩 2주 동안 들어옵니다. 이 실험을 2만 번 반복하면서 두 가지 습관을 비교합니다.</p>
<ul>
<li><strong>습관 가</strong>: 2주가 끝난 마지막 날에 딱 한 번 확인한다.</li>
<li><strong>습관 나</strong>: 매일 확인하고, p값이 0.05보다 작아지는 날 바로 멈추고 “B 승리”라고 선언한다.</li>
</ul>

```python
import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(seed=2026)
DAILY, DAYS, TRIALS, P = 500, 14, 20000, 0.05   # 그룹당 하루 500명, 2주, A와 B 모두 전환율 5%

a = rng.binomial(DAILY, P, size=(TRIALS, DAYS)).cumsum(axis=1)   # A안 누적 전환 수
b = rng.binomial(DAILY, P, size=(TRIALS, DAYS)).cumsum(axis=1)   # B안 누적 전환 수
n = np.arange(1, DAYS + 1) * DAILY                               # 그룹별 누적 방문자
pooled = (a + b) / (2 * n)
z = (b / n - a / n) / np.sqrt(pooled * (1 - pooled) * 2 / n)
p = 2 * norm.sf(np.abs(z))                                       # 날마다 계산한 양측 p값

print(f"마지막 날 한 번만 확인      : {(p[:, -1] < 0.05).mean():.3f}")
print(f"매일 확인하고 유의하면 중단 : {(p < 0.05).any(axis=1).mean():.3f}")
# 마지막 날 한 번만 확인      : 0.051
# 매일 확인하고 유의하면 중단 : 0.221
```

<p>유의수준 0.05는 “아무 차이가 없는데도 있다고 잘못 말할 확률을 5%까지만 허용하겠다”는 약속입니다. 이 실수를 1종 오류(없는 것을 있다고 하는 실수)라고 부릅니다. 마지막에 한 번만 보는 습관 가는 실제로 5.1%가 나왔습니다. 약속대로입니다.</p>
<p>매일 보고 멈추는 습관 나는 <strong>22.1%</strong>입니다. 차이가 전혀 없는 실험인데도 다섯 번에 한 번 이상 승리로 판정됩니다. 쌓이는 데이터에 검정을 되풀이하면 오류가 늘어난다는 점은 1969년 연구에서 이미 확인됐습니다<sup>[1]</sup>. 확인 횟수를 바꿔 가며 세어 보면 이렇습니다.</p>
<figure>
<svg viewBox="0 0 640 215" role="img" aria-label="확인 횟수가 늘수록 가짜 승리율이 5퍼센트에서 22퍼센트까지 오르는 막대그래프" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor" text-anchor="middle">
<line x1="50" y1="172" x2="566" y2="172" stroke="currentColor" stroke-width="1.5"/>
<line x1="50" y1="146" x2="566" y2="146" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<text x="638" y="150" font-size="13" text-anchor="end">설계한 5%</text>
<rect x="70" y="145" width="52" height="27" fill="none" stroke="currentColor"/>
<text x="96" y="139">5.1%</text><text x="96" y="190">1회</text>
<rect x="154" y="128" width="52" height="44" fill="none" stroke="currentColor"/>
<text x="180" y="122">8.4%</text><text x="180" y="190">2회</text>
<rect x="238" y="116.5" width="52" height="55.5" fill="none" stroke="currentColor"/>
<text x="264" y="110">10.5%</text><text x="264" y="190">3회</text>
<rect x="322" y="98" width="52" height="74" fill="none" stroke="currentColor"/>
<text x="348" y="92">14.0%</text><text x="348" y="190">5회</text>
<rect x="406" y="84" width="52" height="88" fill="none" stroke="currentColor"/>
<text x="432" y="78">16.7%</text><text x="432" y="190">7회</text>
<rect x="490" y="55" width="52" height="117" fill="currentColor"/>
<text x="516" y="49">22.1%</text><text x="516" y="190">14회</text>
<text x="310" y="210" font-size="13">2주 동안 결과를 확인한 횟수</text>
</g>
</svg>
<figcaption>그림 1. A와 B가 똑같은 실험 2만 번에서, 한 번이라도 p &lt; 0.05가 떠서 “승리”로 판정된 비율. 확인한 날은 2회 7·14일, 3회 5·9·14일, 5회 3·6·8·11·14일, 7회 격일, 14회 매일입니다. 설명을 위해 만든 가상 실험입니다.</figcaption>
</figure>
<blockquote><p>같은 실험 기간을 여러 번 나누어 들여다볼수록, 아무 차이 없는 실험이 승리로 판정될 확률은 설계한 5%에서 점점 멀어집니다.</p></blockquote>

## 왜 볼 때마다 기회가 늘어날까요?

<p>p값은 “지금까지 쌓인 데이터”에 대한 답이고, 데이터는 날마다 바뀝니다. 매일 검정하는 것은 같은 질문을 14번 새로 던지는 일입니다. 던질 때마다 “우연히 유의해질” 문이 새로 한 번 열립니다.</p>
<p>그림 2는 <strong>차이가 전혀 없는</strong> 실험 다섯 개의 p값이 2주 동안 어떻게 움직였는지 보여 줍니다.</p>
<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="차이가 없는 실험 다섯 개의 p값 궤적. 두 개는 중간에 0.05 아래로 내려갔다가 다시 올라온다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="62" y1="176" x2="62" y2="28" stroke="currentColor" stroke-width="1"/>
<line x1="62" y1="176" x2="596" y2="176" stroke="currentColor" stroke-width="1.5"/>
<line x1="62" y1="143" x2="596" y2="143" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<text x="56" y="38" text-anchor="end">1.0</text>
<text x="56" y="96" text-anchor="end">0.2</text>
<text x="56" y="147" text-anchor="end">0.05</text>
<text x="56" y="180" text-anchor="end">0.02</text>
<polyline points="62,51 102,49 143,49 183,53 224,59 264,71 305,79 345,52 386,37 426,40 467,51 507,61 548,80 588,82" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
<polyline points="62,56 102,52 143,48 183,38 224,42 264,55 305,45 345,54 386,47 426,67 467,67 507,63 548,74 588,77" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
<polyline points="62,43 102,66 143,77 183,36 224,50 264,77 305,73 345,74 386,61 426,64 467,73 507,63 548,52 588,45" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
<polyline points="62,89 102,48 143,148 183,94 224,58 264,53 305,39 345,44 386,40 426,72 467,51 507,42 548,43 588,35" fill="none" stroke="currentColor" stroke-width="2"/>
<polyline points="62,43 102,37 143,59 183,118 224,134 264,146 305,105 345,104 386,66 426,50 467,56 507,50 548,65 588,43" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="143" cy="148" r="4.5" fill="currentColor"/>
<circle cx="264" cy="146" r="4.5" fill="currentColor"/>
<text x="62" y="196" text-anchor="middle">1일</text>
<text x="305" y="196" text-anchor="middle">7일</text>
<text x="588" y="196" text-anchor="middle">14일</text>
<text x="310" y="212" text-anchor="middle" font-size="13">세로축은 p값(로그 눈금), 가로축은 실험 경과일</text>
</g>
</svg>
<figcaption>그림 2. 차이가 없는 실험 다섯 개의 p값 궤적. 굵은 선 두 개는 중간에 0.05 아래(검은 점)로 내려갔다가 다시 올라왔습니다. 여기서 멈췄다면 “승리”로 기록됐을 것입니다. 설명을 위해 만든 가상 실험입니다.</figcaption>
</figure>
<p>굵은 선 하나는 3일차에 p = 0.043까지 내려갔다가 마지막 날 0.969로 올라갔습니다. 다른 하나는 6일차에 0.046을 찍고 다시 0.786이 되었습니다. 둘 다 <strong>실제 차이는 0</strong>인 실험입니다. 앞의 시뮬레이션 2만 건 가운데 이렇게 중간에 한 번이라도 유의했지만 마지막에는 유의하지 않은 실험이 17.0%였습니다.</p>
<blockquote><p>매일 계산하는 p값은 오르내리고, 그 바닥을 골라 멈추면 우연히 낮았던 순간을 결론으로 삼게 됩니다.</p></blockquote>

## 빨리 이긴 실험일수록 의심스럽습니다

<p>매일 확인해 멈춘 실험들이 언제 멈췄는지 세어 보면 한쪽으로 쏠려 있습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>세어 본 것</th><th>값</th></tr></thead>
<tbody>
<tr><td>실험 횟수 (A와 B가 똑같음)</td><td>20,000건</td></tr>
<tr><td>매일 확인해서 중단하고 승리를 선언한 건수</td><td>4,426건 (22.1%)</td></tr>
<tr><td>중단 시점의 중앙값</td><td>4일차</td></tr>
<tr><td>7일차까지(첫 주) 중단된 비율</td><td>74.9%</td></tr>
<tr><td>중간에 유의했지만 마지막 날에는 유의하지 않음</td><td>17.0%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 매일 확인하는 습관이 만들어 내는 결과. 설명을 위해 만든 가상 실험입니다.</p>
<p>중단의 4분의 3이 첫 주에 몰립니다. 이유는 간단합니다. 표본이 적을수록 하루하루의 출렁임이 크고, 큰 출렁임은 큰 차이처럼 보이기 때문입니다. 초반에 벌어진 격차는 효과보다 우연일 가능성이 높은데, 매일 보는 습관은 <strong>바로 그 순간에 멈추도록</strong> 설계되어 있습니다.</p>
<blockquote><p>실험 초반의 큰 차이는 효과의 증거가 아니라, 표본이 적어서 생긴 출렁임일 가능성이 높습니다.</p></blockquote>

## 그래도 중간에 확인해야 한다면?

<p>기본은 단순합니다. 실험을 시작하기 전에 필요한 표본 수와 기간을 정하고, 그 시점에 한 번 판정합니다. 표본 수를 어떻게 정하는지는 다음 칼럼에서 다루겠습니다.</p>
<p>하지만 현실에서는 중간에 봐야 할 이유가 있습니다. 나쁜 안을 오래 노출하면 손해가 쌓이니까요. 이럴 때 쓰라고 만들어진 방법이 있습니다. 핵심은 <strong>몇 번 볼지 미리 정하고, 이른 확인일수록 더 엄격한 기준을 쓰는 것</strong>입니다. 임상시험에서 오래 쓰인 O’Brien-Fleming 경계<sup>[2]</sup>가 대표적입니다.</p>
<figure>
<svg viewBox="0 0 600 215" role="img" aria-label="확인 회차별 임계 p값. 고정 0.05 선과 달리 순차 경계는 초반에 훨씬 낮다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="90" y1="178" x2="90" y2="34" stroke="currentColor" stroke-width="1"/>
<line x1="90" y1="178" x2="566" y2="178" stroke="currentColor" stroke-width="1.5"/>
<line x1="90" y1="58" x2="540" y2="58" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<text x="566" y="46" text-anchor="end">매번 0.05를 쓰면</text>
<text x="84" y="62" text-anchor="end">0.05</text>
<text x="84" y="79" text-anchor="end">0.01</text>
<text x="84" y="103" text-anchor="end">0.001</text>
<text x="84" y="152" text-anchor="end">0.00001</text>
<polyline points="90,155 202,97 315,77 428,66 540,60" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="90" cy="155" r="4" fill="currentColor"/>
<circle cx="202" cy="97" r="4" fill="currentColor"/>
<circle cx="315" cy="77" r="4" fill="currentColor"/>
<circle cx="428" cy="66" r="4" fill="currentColor"/>
<circle cx="540" cy="60" r="4" fill="currentColor"/>
<text x="90" y="196" text-anchor="middle">1회</text>
<text x="202" y="196" text-anchor="middle">2회</text>
<text x="315" y="196" text-anchor="middle">3회</text>
<text x="428" y="196" text-anchor="middle">4회</text>
<text x="540" y="196" text-anchor="middle">5회</text>
<text x="315" y="212" text-anchor="middle">다섯 번 나누어 볼 때의 확인 회차 (세로축은 임계 p값, 로그 눈금)</text>
</g>
</svg>
<figcaption>그림 4. 다섯 번 나누어 보기로 미리 정했을 때의 회차별 임계 p값(굵은 선). 1회차에는 0.000005보다 작아야 멈출 수 있고, 이후 0.0013, 0.0085, 0.023을 거쳐 마지막 5회차도 0.05가 아니라 0.041입니다. 여러 번 본 대가로 마지막 기준도 조금 엄격해집니다.</figcaption>
</figure>
<p>즉 첫 확인에서 “p = 0.04니까 이겼다”고 말할 수 없습니다. 그 시점의 기준은 0.000005입니다. 대신 이렇게 하면 다섯 번을 보고도 전체 1종 오류가 5%로 유지됩니다. 온라인 실험에서는 언제 멈춰도 유효하도록 만든 <em>always-valid</em> p값과 신뢰구간도 쓰입니다<sup>[3]</sup>. 쓰는 도구가 이런 방법을 지원하는지 확인해 보시길 권합니다.</p>
<blockquote><p>중간에 보는 것 자체가 문제가 아니라, 볼 때마다 같은 0.05를 쓰는 것이 문제입니다.</p></blockquote>

## 그럼 대시보드를 매일 보지 말아야 할까요?

<p>봐야 합니다. 다만 <strong>보는 목적을 둘로 나눕니다.</strong> 실험이 고장 났는지 확인하는 일과, 어느 쪽이 이겼는지 정하는 일은 다른 일입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>모니터링 (매일)</th><th>판정 (정해진 시점에 한 번)</th></tr></thead>
<tbody>
<tr><td>보는 이유</td><td>실험이 제대로 굴러가는지</td><td>어느 쪽을 택할지</td></tr>
<tr><td>보는 것</td><td>그룹별 인원 비율, 로그 누락, 오류율, 심각한 지표 급락</td><td>미리 정한 주요 지표 하나</td></tr>
<tr><td>해도 되는 행동</td><td>실험을 멈추고 원인 조사 (안전 정지)</td><td>채택, 기각, 판단 보류</td></tr>
<tr><td>하면 안 되는 행동</td><td>유리해 보인다고 승리 선언</td><td>결과를 보고 기준을 바꾸기</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 같은 대시보드를 봐도 목적이 다르면 할 수 있는 행동이 다릅니다.</p>
<p>그룹별 인원이 5,000명 대 7,000명처럼 어긋나 있다면 그것은 승패의 신호가 아니라 배정이 고장 났다는 신호입니다. 이런 이유로 실험을 멈추는 것은 훔쳐보기가 아닙니다. 멈추는 기준이 <strong>결과의 유불리가 아니기</strong> 때문입니다.</p>
<blockquote><p>매일 보는 것은 실험이 고장 났는지 확인하기 위해서지, 이겼는지 정하기 위해서가 아닙니다.</p></blockquote>

## 나가며

<ol>
<li>A와 B가 완전히 같은 실험도 매일 들여다보며 유의할 때 멈추면 22.1%가 “승리”로 판정됩니다. 마지막에 한 번만 보면 5.1%입니다.</li>
<li>p값은 데이터가 쌓이는 동안 오르내립니다. 그 바닥을 골라 멈추는 것이 훔쳐보기(peeking)이고, 중간에 유의했다가 되돌아오는 실험이 17.0%였습니다.</li>
<li>중간 확인이 필요하면 볼 횟수를 미리 정하고 이른 확인일수록 엄격한 기준을 쓰는 방법이 있습니다. 매일 보되 멈추는 기준을 결과의 유불리에 두지 않는 것도 방법입니다.</li>
</ol>
<p>다음 칼럼에서는 그 “미리 정하는” 숫자, 즉 실험을 시작하기 전에 표본 수를 어떻게 정하는지를 다루겠습니다.</p>

## 참고

<ol>
<li>Armitage, P., McPherson, C. K., &amp; Rowe, B. C. (1969). Repeated significance tests on accumulating data. <em>Journal of the Royal Statistical Society. Series A</em>, 132(2), 235–244. https://doi.org/10.2307/2343787</li>
<li>O’Brien, P. C., &amp; Fleming, T. R. (1979). A multiple testing procedure for clinical trials. <em>Biometrics</em>, 35(3), 549–556. https://doi.org/10.2307/2530245</li>
<li>Johari, R., Koomen, P., Pekelis, L., &amp; Walsh, D. (2017). Peeking at A/B tests: Why it matters, and what to do about it. <em>KDD ’17</em>, 1517–1525. https://doi.org/10.1145/3097983.3097992</li>
</ol>
<p class="refs">본문의 모든 수치는 설명을 위해 만든 가상 실험을 직접 시뮬레이션한 값입니다. 검정은 두 비율 z검정(양측, α = 0.05)이고, 실험 2만 회를 반복했고 시드는 2026입니다. 그림 2의 궤적은 같은 시뮬레이션에서 뽑은 다섯 건입니다. 그림 4의 경계는 O’Brien-Fleming 방식(k번째 확인의 임계값 z = c × √(K/k), K = 5)으로, 다섯 번 확인한 전체 1종 오류가 5%가 되도록 정한 상수 c ≈ 2.040을 썼습니다(시뮬레이션 100만 회로 확인). 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1입니다.</p>
