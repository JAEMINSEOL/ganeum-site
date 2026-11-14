---
title: "95% 신뢰구간은 무슨 뜻일까?"
description: "95%의 의미에 대한 오해 정리"
date: 2026-11-19T00:00:00+09:00
tags: ["신뢰구간", "통계 기초", "표준오차", "표본 크기"]
draft: false
---
<blockquote><p><strong>95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>의 95%는 참값이 구간 안에 있을 확률이 아니라, 같은 방법으로 구간을 반복해서 만들었을 때 참값을 맞히는 구간의 비율입니다. 이 차이를 알면 결과표의 구간을 틀리지 않게 읽을 수 있습니다.</strong></p></blockquote>

## 들어가며

<p>보고서에 전환율 2.55%, 95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a> [2.51%, 2.60%]라고 적혀 있습니다. 이것을 읽고 참값이 2.51%와 2.60% 사이에 있을 확률이 95%라고 쓰면, 심사하는 사람이 고쳐 달라고 합니다. 틀린 문장인데 무엇이 틀렸는지 설명을 듣기는 어렵습니다.</p>
<p><strong>95%는 무엇의 95%일까요?</strong></p>
<p>이 글은 같은 모집단에서 표본을 1,000번 뽑아 구간을 1,000개 만들어 보고, 95%가 어디에 붙는 숫자인지 확인합니다. 그다음 자주 하는 오해 다섯 가지, 표본 수와 구간 폭의 관계, 두 구간이 겹칠 때 읽는 법을 정리하고, 공개된 광고 실험 데이터로 실제 구간을 읽어 보겠습니다.</p>

## 95%는 구간이 참값을 맞히는 비율입니다

<p>참값을 알고 있는 상황을 만들면 95%의 뜻이 보입니다. 전환율이 정확히 20%인 모집단에서 400명을 뽑아 전환율을 재고, 그 값에서 <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>의 1.96배를 더하고 뺀 구간을 만듭니다. 이것을 1,000번 반복합니다.</p>
<p>그림 1은 처음 20개 구간입니다. 표본마다 전환율이 15.2%에서 23.5%까지 다르게 나오고 구간도 다르게 잡히지만, 20개 중 19개는 참값 20%를 안에 두고 있습니다. 16번째 구간만 [11.7%, 18.8%]로 참값을 놓쳤습니다.</p>
<figure>
<svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="참값 20%인 모집단에서 뽑은 20개 표본의 95% 신뢰구간" style="max-width:100%;height:auto">
<line x1="330" y1="20" x2="330" y2="370" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
<text x="330" y="14" font-size="13" fill="currentColor" text-anchor="middle">참값 20%</text>
<g stroke="currentColor" stroke-width="2">
<line x1="200" y1="36" x2="405" y2="36"/><circle cx="303" cy="36" r="3" fill="currentColor"/>
<line x1="268" y1="52" x2="487" y2="52"/><circle cx="376" cy="52" r="3" fill="currentColor"/>
<line x1="217" y1="68" x2="430" y2="68"/><circle cx="325" cy="68" r="3" fill="currentColor"/>
<line x1="206" y1="84" x2="414" y2="84"/><circle cx="311" cy="84" r="3" fill="currentColor"/>
<line x1="311" y1="100" x2="538" y2="100"/><circle cx="425" cy="100" r="3" fill="currentColor"/>
<line x1="268" y1="116" x2="487" y2="116"/><circle cx="376" cy="116" r="3" fill="currentColor"/>
<line x1="249" y1="132" x2="465" y2="132"/><circle cx="357" cy="132" r="3" fill="currentColor"/>
<line x1="144" y1="148" x2="341" y2="148"/><circle cx="243" cy="148" r="3" fill="currentColor"/>
<line x1="211" y1="164" x2="422" y2="164"/><circle cx="317" cy="164" r="3" fill="currentColor"/>
<line x1="268" y1="180" x2="487" y2="180"/><circle cx="376" cy="180" r="3" fill="currentColor"/>
<line x1="206" y1="196" x2="414" y2="196"/><circle cx="311" cy="196" r="3" fill="currentColor"/>
<line x1="268" y1="212" x2="487" y2="212"/><circle cx="376" cy="212" r="3" fill="currentColor"/>
<line x1="187" y1="228" x2="392" y2="228"/><circle cx="290" cy="228" r="3" fill="currentColor"/>
<line x1="200" y1="244" x2="405" y2="244"/><circle cx="303" cy="244" r="3" fill="currentColor"/>
<line x1="162" y1="260" x2="362" y2="260"/><circle cx="262" cy="260" r="3" fill="currentColor"/>
<line x1="105" y1="276" x2="297" y2="276" stroke-width="5"/><circle cx="201" cy="276" r="4" fill="currentColor"/>
<line x1="206" y1="292" x2="414" y2="292"/><circle cx="311" cy="292" r="3" fill="currentColor"/>
<line x1="217" y1="308" x2="430" y2="308"/><circle cx="325" cy="308" r="3" fill="currentColor"/>
<line x1="168" y1="324" x2="370" y2="324"/><circle cx="268" cy="324" r="3" fill="currentColor"/>
<line x1="192" y1="340" x2="400" y2="340"/><circle cx="297" cy="340" r="3" fill="currentColor"/>
</g>
<text x="40" y="280" font-size="13" fill="currentColor" text-anchor="start">16번</text>
<line x1="60" y1="370" x2="600" y2="370" stroke="currentColor" stroke-width="1"/>
<text x="60" y="392" font-size="13" fill="currentColor" text-anchor="middle">10%</text>
<text x="195" y="392" font-size="13" fill="currentColor" text-anchor="middle">15%</text>
<text x="330" y="392" font-size="13" fill="currentColor" text-anchor="middle">20%</text>
<text x="465" y="392" font-size="13" fill="currentColor" text-anchor="middle">25%</text>
<text x="600" y="392" font-size="13" fill="currentColor" text-anchor="middle">30%</text>
<text x="330" y="414" font-size="13" fill="currentColor" text-anchor="middle">표본 전환율과 95% 신뢰구간</text>
</svg>
<figcaption>그림 1. 참값 20%인 모집단에서 400명씩 뽑은 처음 20개 표본의 95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>. 점은 표본 전환율, 굵은 선은 참값을 놓친 16번째 구간입니다. 1,000번 전체로는 944개(94.4%)가 참값을 포함했습니다.</figcaption>
</figure>
<details class="code"><summary>검증 코드 보기</summary>

```python
import numpy as np
from scipy.stats import norm

z = norm.ppf(0.975)                      # 1.96
rng = np.random.default_rng(seed=2026)
p_true, n, reps = 0.20, 400, 1000
hits = 0
for i in range(reps):
    x = rng.binomial(n, p_true)          # 400명 중 전환한 사람 수
    p = x / n
    se = np.sqrt(p * (1 - p) / n)        # 표준오차
    lo, hi = p - z * se, p + z * se
    hits += lo <= p_true <= hi
print(f"참값 {p_true}, n={n}, {reps}번 반복: 참값을 포함한 구간 {hits}개 ({hits/reps*100:.1f}%)")
# 참값 0.2, n=400, 1000번 반복: 참값을 포함한 구간 944개 (94.4%)
```

</details>
<p>1,000개 중 944개가 참값을 포함했습니다. 95%는 바로 이 비율이고, 이 비율을 <a class="term" href="#term-level" data-tip="신뢰수준(confidence level): 같은 방법으로 만든 구간 가운데 참값을 포함하는 구간의 비율. 95%가 관례.">신뢰수준</a>이라고 부릅니다. 같은 방법으로 구간을 계속 만들면 그중 95% 정도가 참값을 맞히도록 폭을 정한 것이 95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>입니다. 정확히 950이 아니라 944인 이유는 반복 횟수가 유한하고, 비율의 <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>를 정규분포로 근사했기 때문입니다.</p>
<p>실제 분석에서는 구간을 하나만 만듭니다. 그 하나가 944개 쪽인지 56개 쪽인지는 알 수 없습니다. 참값은 고정된 숫자이고 움직이는 쪽은 구간이라서, 참값이 이 구간 안에 있을 확률이라는 말은 성립하지 않습니다. 확률은 구간을 만드는 방법에 붙어 있습니다.</p>
<blockquote><p><strong>95%는 구간을 만드는 방법의 적중률입니다. 참값은 고정되어 있고 구간이 표본마다 움직이며, 그 구간들 가운데 95%가 참값을 포함합니다.</strong></p></blockquote>

## 자주 하는 오해 다섯 가지

<p>95%를 확률로 읽는 오해 말고도, <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>을 읽을 때 자주 틀리는 문장이 있습니다. 그림 2는 틀린 문장과 고친 문장을 나란히 둔 것입니다. 틀린 문장이 모두 자연스럽게 읽힌다는 점이 문제입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>틀린 문장</th><th>왜 틀렸나</th><th>고친 문장</th></tr></thead>
<tbody>
<tr><td>참값이 이 구간 안에 있을 확률이 95%다</td><td>참값은 고정되어 있고 구간이 움직인다. 확률은 방법에 붙는다</td><td>같은 방법으로 만든 구간의 95%가 참값을 포함한다</td></tr>
<tr><td>데이터의 95%가 이 구간 안에 있다</td><td><a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>은 평균이나 비율 같은 요약값의 범위이지 개별 값의 범위가 아니다</td><td>모집단 전환율의 추정 범위가 이 구간이다</td></tr>
<tr><td>구간 안의 값은 어느 것이든 똑같이 그럴듯하다</td><td>표본값에 가까운 값이 더 그럴듯하고 양 끝은 덜 그럴듯하다</td><td>표본값이 가장 그럴듯하고 구간 끝으로 갈수록 덜 그럴듯하다</td></tr>
<tr><td>두 그룹의 구간이 겹치니 차이가 없다</td><td>겹쳐도 차이의 구간은 0을 빼놓을 수 있다. 그림 4</td><td>차이의 <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>을 따로 구해서 0이 들어 있는지 본다</td></tr>
<tr><td>구간이 좁으니 결과가 정확하다</td><td>폭은 표본 수와 분산만 반영한다. 표본이 치우쳤으면 좁아도 빗나간다</td><td>구간 폭은 표집 변동만 말하고 표본의 대표성은 따로 본다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>을 읽을 때 자주 틀리는 문장 다섯 가지. 넷째 행은 그림 4에서 숫자로 확인합니다.</p>
<p>다섯째 행은 특히 설문과 관찰 연구에서 중요합니다. 구간은 같은 모집단에서 무작위로 뽑았다는 가정 아래 계산됩니다. 응답한 사람만 모였거나 특정 집단이 빠졌다면, 구간이 아무리 좁아도 그 폭은 치우침을 전혀 반영하지 않습니다.</p>
<blockquote><p><strong><a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>은 요약값의 범위이고, 구간 안의 값이 모두 같은 무게는 아니며, 폭은 표집 변동만 반영합니다. 표본이 치우쳤으면 좁은 구간도 빗나갑니다.</strong></p></blockquote>

## 구간 폭은 표본 수의 제곱근으로 줄어듭니다

<p>구간의 폭은 <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>의 1.96배를 양쪽에 더한 것이고, <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>는 표본 수의 제곱근에 반비례합니다. 표본을 4배로 늘리면 폭이 절반이 되고, 16배로 늘려야 4분의 1이 됩니다. 그림 3은 전환율 20%를 기준으로 표본 수에 따른 폭입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>표본 수</th><th><a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a></th><th>95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a></th><th>폭</th></tr></thead>
<tbody>
<tr><td>100명</td><td>4.0%p</td><td>20% ± 7.8%p</td><td>15.7%p</td></tr>
<tr><td>400명</td><td>2.0%p</td><td>20% ± 3.9%p</td><td>7.8%p</td></tr>
<tr><td>1,600명</td><td>1.0%p</td><td>20% ± 2.0%p</td><td>3.9%p</td></tr>
<tr><td>6,400명</td><td>0.5%p</td><td>20% ± 1.0%p</td><td>2.0%p</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 표본 전환율 20%일 때 표본 수와 95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>의 폭. 표본 수가 4배가 될 때마다 폭이 절반이 됩니다.</p>
<p>이 관계는 표본 수를 정할 때 거꾸로 씁니다. 전환율을 ±1%p 안에서 알고 싶다면 6,400명이 필요하고, ±2%p면 1,600명으로 됩니다. 원하는 정밀도를 먼저 정하고 표본 수를 역산하는 방식이며, 결과를 본 뒤에 표본을 더 모으는 것과는 다릅니다.</p>
<blockquote><p><strong><a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>의 폭은 표본 수의 제곱근에 반비례합니다. 폭을 절반으로 줄이려면 표본이 4배 필요합니다.</strong></p></blockquote>

## 두 구간이 겹쳐도 차이는 유의할 수 있습니다

<p>그룹 A의 전환율이 20%, 그룹 B가 24%이고 각각 1,000명이라고 하겠습니다. A의 구간은 [17.5%, 22.5%], B의 구간은 [21.4%, 26.6%]로 21.4%에서 22.5% 사이가 겹칩니다. 겹치니 차이가 없다고 읽기 쉽습니다.</p>
<p>차이의 <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>을 따로 구하면 다르게 보입니다. B에서 A를 뺀 차이는 4.0%p이고 구간은 [0.4%p, 7.6%p]로 0을 포함하지 않습니다. 두 구간이 겹치는지와 차이의 구간이 0을 포함하는지는 다른 질문이고, 비교할 때 답해야 하는 쪽은 후자입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>전환율</th><th>95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a></th><th>읽는 법</th></tr></thead>
<tbody>
<tr><td>그룹 A (1,000명)</td><td>20.0%</td><td>[17.5%, 22.5%]</td><td>B의 구간과 21.4~22.5%에서 겹침</td></tr>
<tr><td>그룹 B (1,000명)</td><td>24.0%</td><td>[21.4%, 26.6%]</td><td></td></tr>
<tr><td>차이 B − A</td><td>+4.0%p</td><td>[+0.4%p, +7.6%p]</td><td>0을 포함하지 않음. 유의수준 5%에서 유의</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 각 그룹의 구간은 겹치지만 차이의 구간은 0을 포함하지 않는 예. 설명을 위해 만든 수치입니다.</p>
<p>두 구간이 겹치지 않으면 차이는 유의합니다. 그러나 겹친다고 해서 유의하지 않은 것은 아닙니다. 차이의 <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>는 두 <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>를 제곱해서 더한 뒤 제곱근을 취한 값이라 각 <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>의 합보다 작고, 그만큼 차이의 구간은 두 구간을 겹쳐 본 것보다 좁습니다. 차이의 구간으로 결론을 쓰는 방법은 <a href="https://data-ganeum.com/columns/confidence-interval-verdict/">4편</a>에 있습니다.</p>
<blockquote><p><strong>두 그룹을 비교할 때는 각 그룹의 구간이 겹치는지가 아니라 차이의 <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>이 0을 포함하는지를 봅니다. 겹쳐도 차이는 유의할 수 있습니다.</strong></p></blockquote>

## 실제 데이터로 읽어 보면

<p>공개된 광고 실험 데이터로 구간을 읽어 보겠습니다. 광고를 본 그룹 564,577명과 공익광고를 본 그룹 23,524명의 구매 전환율입니다. 그림 5의 구간은 그림 1과 같은 방법으로 구했습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>그룹</th><th>인원</th><th>전환</th><th>전환율</th><th>95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a></th></tr></thead>
<tbody>
<tr><td>광고 (ad)</td><td>564,577명</td><td>14,423명</td><td>2.55%</td><td>[2.51%, 2.60%]</td></tr>
<tr><td>공익광고 (psa)</td><td>23,524명</td><td>420명</td><td>1.79%</td><td>[1.62%, 1.95%]</td></tr>
<tr><td>차이 ad − psa</td><td></td><td></td><td>+0.77%p</td><td>[+0.60%p, +0.94%p]</td></tr>
<tr><td>광고 그룹에서 2,000명만 뽑으면</td><td>2,000명</td><td>58명</td><td>2.90%</td><td>[2.16%, 3.64%]</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. Kaggle Marketing A/B Testing 데이터의 전환율과 95% <a class="term" href="#term-ci" data-tip="신뢰구간(confidence interval): 표본 요약값에 표준오차의 일정 배수를 더하고 뺀 범위. 같은 방법으로 반복하면 정해진 비율만큼 참값을 포함한다.">신뢰구간</a>. 마지막 행은 광고 그룹에서 무작위로 2,000명만 뽑아 같은 계산을 한 것입니다.</p>
<p>광고 그룹은 56만 명이라 구간 폭이 0.08%p로 매우 좁고, 공익광고 그룹은 2만 명이라 0.34%p입니다. 차이의 구간 [+0.60%p, +0.94%p]는 0을 포함하지 않으므로, 전환율 차이가 0이라는 가설은 이 데이터와 맞지 않습니다. 구간을 읽는 문장은 광고 그룹의 전환율이 공익광고 그룹보다 0.60%p에서 0.94%p 높다는 것과 양립하는 데이터라고 쓰면 됩니다.</p>
<p>마지막 행은 표본 수가 구간에 어떻게 드러나는지 보여 줍니다. 같은 그룹에서 2,000명만 뽑으니 전환율은 2.90%로 전체의 2.55%와 다르게 나왔고 구간 폭은 1.47%p로 약 18배 넓어졌습니다. 전체 값 2.55%는 이 구간 안에 들어 있습니다. 작은 표본의 <a class="term" href="#term-point" data-tip="점추정치(point estimate): 표본에서 계산한 하나의 값. 표본이 바뀌면 함께 바뀐다.">점추정치</a>를 그대로 믿는 대신 구간을 함께 적어야 하는 이유입니다.</p>
<blockquote><p><strong>구간을 읽는 문장은 참값이 어디 있을 확률이 아니라, 이 데이터와 양립하는 값의 범위입니다. 표본이 작을수록 그 범위는 넓어지고, <a class="term" href="#term-point" data-tip="점추정치(point estimate): 표본에서 계산한 하나의 값. 표본이 바뀌면 함께 바뀐다.">점추정치</a> 하나만으로는 그 사실이 보이지 않습니다.</strong></p></blockquote>

## 나가며

<ol>
<li>95%는 구간을 만드는 방법의 적중률입니다. 참값 20%인 모집단에서 400명씩 1,000번 뽑으면 944개 구간이 참값을 포함합니다. 하나의 구간에 참값이 있을 확률이라는 말은 성립하지 않습니다.</li>
<li>구간 폭은 표본 수의 제곱근에 반비례하고, 폭을 절반으로 줄이려면 표본이 4배 필요합니다. 폭은 표집 변동만 반영하므로 치우친 표본은 좁은 구간도 빗나갑니다.</li>
<li>두 그룹을 비교할 때는 각 구간이 겹치는지가 아니라 차이의 구간이 0을 포함하는지를 봅니다. 20% 대 24%, 각 1,000명이면 구간은 겹치지만 차이의 구간 [+0.4%p, +7.6%p]는 0을 포함하지 않습니다.</li>
</ol>

## 용어

<ul>
<li id="term-ci"><strong>신뢰구간(confidence interval)</strong>: 표본에서 계산한 요약값에 표준오차의 일정 배수를 더하고 뺀 범위입니다. 같은 방법으로 반복해서 만들면 정해진 비율만큼 참값을 포함하도록 폭을 정합니다.</li>
<li id="term-level"><strong>신뢰수준(confidence level)</strong>: 같은 방법으로 만든 구간 가운데 참값을 포함하는 구간의 비율입니다. 95%가 관례이고, 99%로 올리면 구간이 넓어집니다.</li>
<li id="term-se"><strong>표준오차(standard error)</strong>: 표본을 다시 뽑을 때 요약값이 얼마나 흔들리는지를 나타내는 값입니다. 비율의 표준오차는 p(1−p)/n의 제곱근이고, 표본 수의 제곱근에 반비례합니다.</li>
<li id="term-point"><strong>점추정치(point estimate)</strong>: 표본에서 계산한 하나의 값입니다. 전환율 2.55%처럼 구간 없이 적은 숫자이며, 표본이 바뀌면 함께 바뀝니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Greenland, S., Senn, S. J., Rothman, K. J., Carlin, J. B., Poole, C., Goodman, S. N., &amp; Altman, D. G. (2016). Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations. <em>European Journal of Epidemiology</em>, 31(4), 337–350. https://doi.org/10.1007/s10654-016-0149-3</li>
<li id="ref-2">Vaz, F. Marketing A/B Testing [Dataset]. Kaggle. https://www.kaggle.com/datasets/faviovaz/marketing-ab-testing (CC0)</li>
</ol>
<p class="refs">그림 1과 3, 4의 구간은 비율의 정규 근사(표본 비율 ± 1.96 × <a class="term" href="#term-se" data-tip="표준오차(standard error): 표본을 다시 뽑을 때 요약값이 흔들리는 정도. 비율은 p(1−p)/n의 제곱근.">표준오차</a>)로 계산했습니다. 그림 1의 모집단은 설명을 위해 만든 것이고, 표본 추출은 numpy의 default_rng(seed=2026)으로 400명씩 1,000번 뽑았습니다. 그림 4의 수치는 설명을 위해 만든 예시입니다. 그림 5는 Kaggle의 Marketing A/B Testing 데이터(faviovaz, CC0, 588,101행)에서 test group별 converted 비율을 계산한 것이고, 마지막 행의 2,000명은 pandas의 sample(random_state=2026)로 뽑았습니다. 코드 실행 환경은 Python 3.12, numpy 2.5.4, scipy 1.18.1, pandas 3.1.1입니다.</p>
