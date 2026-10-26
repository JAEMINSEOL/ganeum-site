---
title: "실험 기간을 절반으로 줄이는 방법"
description: "CUPED, 실험 전 데이터로 분산 줄이기"
date: 2026-10-27T06:53:00+09:00
tags: ["CUPED", "분산 축소", "실험 설계"]
draft: false
---
<blockquote><p><strong>표본을 늘릴 수 없다면 <span class="term" data-tip="값들이 평균에서 얼마나 퍼져 있는지를 나타내는 양. 클수록 같은 차이를 가려내기 어렵다." tabindex="0">분산</span>을 줄이면 됩니다. 실험 전 데이터와 실험 지표의 <span class="term" data-tip="두 값이 함께 움직이는 정도(ρ). 0이면 따로 움직이고, 1에 가까울수록 같이 오르내린다." tabindex="0">상관</span>이 0.8이면 같은 <a class="term" href="#term-power" data-tip="검출력(statistical power): 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률. 보통 80%를 목표로 한다.">검출력</a>에 필요한 인원이 36%로 줄고, 2주짜리 실험이 5일로 끝납니다.</strong></p></blockquote>

## 들어가며

<p>전환율 5%에서 상대 +10% 개선을 <a class="term" href="#term-power" data-tip="검출력(statistical power): 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률. 보통 80%를 목표로 한다.">검출력</a> 80%로 확인하려면 그룹당 31,234명이 필요합니다. 하루 방문자 2,000명인 서비스라면 32일입니다. 한 달 동안 다른 실험은 돌리지 못합니다.</p>
<p><strong>인원을 늘리지 않고 실험을 더 빨리 끝낼 수는 없을까요?</strong></p>
<p>방법이 있습니다. 필요 인원을 정하는 것은 인원 자체가 아니라 지표의 분산이고, 분산의 상당 부분은 실험과 무관하게 유저가 원래 갖고 있던 차이입니다. 그 차이를 실험 전 데이터로 미리 빼면 남는 분산이 줄고, 필요 인원도 그만큼 줄어듭니다. 이 방법을 CUPED라고 부릅니다. 이번 글에서는 원리, 조정값을 구하는 방법, 실제 데이터에서의 효과, 그리고 되는 조건과 안 되는 조건을 보겠습니다.</p>

## 분산을 줄이면 인원이 줄어듭니다

<p>필요 인원은 지표의 분산에 비례합니다. 분산이 절반이 되면 인원도 절반이면 됩니다. 그런데 구매액 같은 지표의 분산은 대부분 실험 때문에 생기지 않습니다. 원래 많이 사는 고객과 적게 사는 고객이 섞여 있어서 생깁니다. 이 차이는 A안과 B안 어느 쪽에 배정되든 그대로이므로, 실험 효과를 재는 데는 <a class="term" href="#term-noise" data-tip="노이즈(noise): 실험 효과와 무관하게 측정값에 섞여 드는 변동. 유저마다 원래 다른 성향, 요일, 우연이 모두 노이즈가 된다.">노이즈</a>일 뿐입니다.</p>
<p>실험 전 기간의 같은 지표를 <a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a>으로 쓰면 이 <a class="term" href="#term-noise" data-tip="노이즈(noise): 실험 효과와 무관하게 측정값에 섞여 드는 변동. 유저마다 원래 다른 성향, 요일, 우연이 모두 노이즈가 된다.">노이즈</a>를 뺄 수 있습니다.
실험 전 구매액이 많았던 고객은 실험 중에도 많이 살 것이므로, 실험 중 구매액에서 실험 전 구매액으로 설명되는 부분을 빼고 남은 것만 비교합니다. 빼고 남는 분산의 비율은 두 값의 상관 ρ로 정해집니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>실험 전 값과 실험 값의 상관 ρ</th><th>남는 분산 (1 − ρ²)</th><th>같은 <a class="term" href="#term-power" data-tip="검출력(statistical power): 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률. 보통 80%를 목표로 한다.">검출력</a>에 필요한 인원</th><th>14일 실험이면</th></tr></thead>
<tbody>
<tr><td>0.3</td><td>91%</td><td>91%</td><td>12.7일</td></tr>
<tr><td>0.5</td><td>75%</td><td>75%</td><td>10.5일</td></tr>
<tr><td>0.7</td><td>51%</td><td>51%</td><td>7.1일</td></tr>
<tr><td>0.8</td><td>36%</td><td>36%</td><td>5.0일</td></tr>
<tr><td>0.9</td><td>19%</td><td>19%</td><td>2.7일</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 상관에 따른 분산 감소. 남는 분산의 비율이 곧 필요 인원의 비율입니다.</p>
<p>상관이 0.7을 넘어야 절반이 됩니다. 리텐션이나 구매액처럼 유저 성향이 강하게 남는 지표는 실험 전 2~4주 값과의 상관이 0.5에서 0.8 사이에 흔히 나옵니다. 반면 전환율처럼 한 번 일어나는 사건은 상관이 낮아 효과가 작습니다.</p>
<blockquote><p><strong>실험 전 데이터와 실험 지표의 상관이 ρ이면, 필요 인원은 1 − ρ² 배로 줄어듭니다.</strong></p></blockquote>

## 실험 지표에서 실험 전 값의 몫을 뺍니다

<p>실험 지표를 Y, 실험 전 <a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a>을 X라고 하면 조정값은 다음과 같이 구합니다.</p>
<p>Y<sub>조정</sub> = Y − θ(X − X̄), 여기서 θ = cov(X, Y) / var(X)</p>
<p>θ는 X로 Y를 설명하는 <span class="term" data-tip="X가 1 늘 때 Y가 평균적으로 얼마나 느는지를 나타내는 값. 여기서는 실험 전 구매액 1원당 실험 중 구매액이 늘어나는 정도." tabindex="0">회귀 기울기</span>이고, A안과 B안을 합친 전체에서 한 번 구합니다. 조정값의 평균은 원래 Y의 평균과 같고(X − X̄의 평균이 0이므로) 분산만 줄어듭니다. 그다음은 평소처럼 두 그룹의 조정값 평균을 비교하면 됩니다. 실제 데이터로 돌리면 이렇습니다.</p>

```python
import numpy as np, pandas as pd

pop = pd.read_csv("data/uci/retail_pre_post.csv")   # 고객별 실험 전 6개월 구매액 x, 실험 3개월 구매액 y
x, y = pop["x"].to_numpy(), pop["y"].to_numpy()

theta = np.cov(x, y, ddof=1)[0, 1] / np.var(x, ddof=1)   # y를 x로 설명하는 기울기
y_adj = y - theta * (x - x.mean())                        # CUPED 조정값. 평균은 그대로, 분산만 줄어든다

rng = np.random.default_rng(seed=7)
idx = rng.permutation(len(x)); a, b = idx[: len(x) // 2], idx[len(x) // 2 :]   # 무작위 A/B 배정, 효과 0
for name, v in (("조정 전", y), ("CUPED 조정 후", y_adj)):
    diff = v[b].mean() - v[a].mean()
    se = np.sqrt(v[a].var(ddof=1) / len(a) + v[b].var(ddof=1) / len(b))
    print(f"{name:<9}: 표준편차 {v.std(ddof=1):,.0f}, B−A 차이 {diff:+,.1f}, 표준오차 {se:,.1f}")
print(f"θ = {theta:.3f}, 상관 ρ = {np.corrcoef(x, y)[0, 1]:.3f}, 분산 비 = {y_adj.var(ddof=1) / y.var(ddof=1):.3f}")
# 조정 전     : 표준편차 2,748, B−A 차이 -7.2, 표준오차 105.6
# CUPED 조정 후: 표준편차 1,604, B−A 차이 -3.8, 표준오차 61.6
# θ = 0.499, 상관 ρ = 0.812, 분산 비 = 0.341
```

<blockquote><p><strong>CUPED는 회귀 기울기 하나를 구해 실험 지표에서 실험 전 값의 몫을 빼는 계산이고, 비교 방법은 바뀌지 않습니다.</strong></p></blockquote>

## 실제 데이터에서는 얼마나 줄어드나

<p>위 코드의 데이터는 UCI에 CC BY 4.0으로 공개된 기록입니다. 영국 온라인 소매점의 2년치 거래입니다. 2010년 12월부터 2011년 5월까지 구매한 고객 2,708명을 모집단으로 두고, 그 6개월 구매액을 X, 이어지는 3개월(2011년 6월부터 8월) 구매액을 Y로 잡았습니다. 3개월 동안 구매가 없으면 Y는 0입니다. 실제 실험은 없었으므로 고객을 무작위로 반씩 나눠 효과 0인 실험을 1만 번 만들었습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>조정 전</th><th>CUPED 조정 후</th></tr></thead>
<tbody>
<tr><td>지표의 <span class="term" data-tip="값이 평균에서 떨어진 정도의 대표값. 분산의 제곱근." tabindex="0">표준편차</span></td><td>2,748</td><td>1,604</td></tr>
<tr><td>B − A 차이의 <a class="term" href="#term-se" data-tip="표준오차(standard error): 같은 실험을 반복했을 때 추정값(두 그룹의 차이)이 흔들리는 폭. 작을수록 작은 차이를 가려낼 수 있다.">표준오차</a> (1만 회 평균)</td><td>105.6</td><td>61.6</td></tr>
<tr><td>효과 0에서 p &lt; 0.05 비율 (<span class="term" data-tip="실제로는 효과가 없는데 검정이 유의하다고 판정하는 일. 유의수준 0.05면 약 5%가 기대값이다." tabindex="0">가짜 양성</span>)</td><td>4.7%</td><td>5.2%</td></tr>
<tr><td>효과 +10%일 때 <a class="term" href="#term-power" data-tip="검출력(statistical power): 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률. 보통 80%를 목표로 한다.">검출력</a></td><td>7.5%</td><td>14.1%</td></tr>
<tr><td>효과 +20%일 때 <a class="term" href="#term-power" data-tip="검출력(statistical power): 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률. 보통 80%를 목표로 한다.">검출력</a></td><td>16.3%</td><td>36.7%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 고객 2,708명을 무작위로 나눈 가상 실험 1만 회. 효과는 B안 구매액에 곱해 넣었습니다. 출처는 UCI Online Retail II(CC BY 4.0)이고 집계는 이 글에서 직접 했습니다.</p>
<p>실험 전 구매액과 실험 구매액의 상관은 0.812였습니다. 남는 분산은 34.1%로 이론값 1 − 0.812²와 같고, 차이의 <a class="term" href="#term-se" data-tip="표준오차(standard error): 같은 실험을 반복했을 때 추정값(두 그룹의 차이)이 흔들리는 폭. 작을수록 작은 차이를 가려낼 수 있다.">표준오차</a>는 105.6에서 61.6으로 줄었습니다. 효과가 0일 때 유의하게 나오는 비율은 4.7%와 5.2%로 둘 다 약속한 5% 근처입니다. 분산을 줄였다고 가짜 양성이 늘지 않습니다.</p>
<p><a class="term" href="#term-power" data-tip="검출력(statistical power): 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률. 보통 80%를 목표로 한다.">검출력</a>은 그대로 올라갑니다. +20% 효과를 잡아낼 확률이 16.3%에서 36.7%로 2.3배가 됐습니다. 그룹당 1,354명밖에 안 되는 작은 실험이라 절대 수치는 낮지만, 같은 인원으로 두 배 넘게 민감해진 것입니다.</p>
<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="상관이 높아질수록 남는 분산이 줄어드는 곡선. 실제 데이터의 상관 0.812에서 남는 분산 34퍼센트가 표시되어 있다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="80" y1="40" x2="80" y2="170" stroke="currentColor" stroke-width="1"/>
<line x1="80" y1="170" x2="580" y2="170" stroke="currentColor" stroke-width="1.5"/>
<text x="74" y="44" text-anchor="end">100%</text>
<text x="74" y="109" text-anchor="end">50%</text>
<text x="74" y="174" text-anchor="end">0%</text>
<polyline points="80,40 128,41 176,45 224,52 272,61 320,73 368,87 416,104 464,123 512,145 560,170" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="486" y1="126" x2="486" y2="170" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<line x1="80" y1="126" x2="486" y2="126" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<circle cx="486" cy="126" r="5" fill="currentColor"/>
<text x="478" y="118" text-anchor="end">실제 데이터 ρ = 0.81, 남는 분산 34%</text>
<text x="80" y="190" text-anchor="middle">0</text>
<text x="200" y="190" text-anchor="middle">0.25</text>
<text x="320" y="190" text-anchor="middle">0.5</text>
<text x="440" y="190" text-anchor="middle">0.75</text>
<text x="560" y="190" text-anchor="middle">1</text>
<text x="330" y="210" text-anchor="middle">가로축은 실험 전 값과 실험 값의 상관 ρ, 세로축은 남는 분산 1 − ρ²</text>
</g>
</svg>
<figcaption>그림 3. 상관과 남는 분산의 관계. 상관 0.7까지는 완만하다가 그 뒤로 빠르게 줄어듭니다. 검은 점이 Online Retail II 데이터입니다.</figcaption>
</figure>
<blockquote><p><strong>실제 구매 데이터에서 실험 전 6개월 구매액 하나로 필요 인원이 34%로 줄었고, 가짜 양성은 늘지 않았습니다.</strong></p></blockquote>

## 되는 조건과 안 되는 조건

<div class="table-scroll">
<table>
<thead><tr><th>조건</th><th>왜</th><th>이 데이터에서는</th></tr></thead>
<tbody>
<tr><td><a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a>은 실험 시작 전 값이어야 한다</td><td>실험 중 값을 쓰면 실험 효과까지 빼 버린다</td><td>실험 전 6개월 구매액</td></tr>
<tr><td><a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a>과 지표의 상관이 높아야 한다</td><td>ρ 0.3이면 9%밖에 못 줄인다</td><td>ρ 0.812</td></tr>
<tr><td>신규 유저에게는 <a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a>이 없다</td><td>실험 전 값이 없으면 조정할 것이 없다. 신규 전용 실험에는 무력하다</td><td>실험 전 활성 고객만 모집단</td></tr>
<tr><td>θ는 두 그룹을 합쳐 한 번만 구한다</td><td>그룹별로 따로 구하면 편향이 생길 수 있다</td><td>전체 2,708명으로 θ = 0.499</td></tr>
<tr><td>이상치가 상관을 흔든다</td><td>구매액이 아주 큰 고객 몇 명이 ρ를 올리거나 내린다</td><td>상위 1%를 상한에 묶으면 ρ 0.743으로 내려감</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. CUPED가 작동하는 조건. 세 번째 줄이 모바일 앱 실험에서 가장 자주 걸립니다.</p>
<p>세 번째 줄은 설치 직후 유저를 대상으로 하는 실험 대부분에 해당합니다. 온보딩 실험, 첫 구매 유도 실험에는 실험 전 데이터 자체가 없으므로 CUPED를 쓸 수 없습니다. 이런 실험은 다른 방법 없이 인원으로 해결해야 합니다. 반대로 기존 유저 대상 실험, 특히 구매액이나 플레이 시간처럼 유저 성향이 강한 지표에서는 효과가 큽니다.</p>
<p>다섯 번째 줄은 이 데이터의 특성입니다. 도매 고객이 섞여 있어 구매액 분포의 꼬리가 길고, 상위 1%를 상한에 묶으면 상관이 0.812에서 0.743으로 내려갑니다. 그래도 남는 분산은 45%로 효과는 충분합니다. 다만 상관이 구매액이 큰 소수 고객에 의존한다면 실험마다 ρ가 크게 달라질 수 있다는 뜻이므로, 설계 단계에서 과거 데이터로 ρ를 몇 번 재어 보는 편이 안전합니다.</p>
<blockquote><p><strong>CUPED는 실험 전 값이 있는 기존 유저와 성향이 강한 지표에서 효과가 크고, 신규 유저 실험에는 쓸 수 없습니다.</strong></p></blockquote>

## 설계서에 적을 것

<div class="table-scroll">
<table>
<thead><tr><th>항목</th><th>예시</th><th>이유</th></tr></thead>
<tbody>
<tr><td><a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a></td><td>실험 전 28일 구매액</td><td>지표와 같은 종류의 실험 전 값이 가장 상관이 높다</td></tr>
<tr><td>예상 상관 ρ</td><td>과거 두 기간으로 미리 계산, 0.6</td><td>필요 인원을 설계 단계에서 다시 계산하기 위해</td></tr>
<tr><td>조정 후 필요 인원</td><td>31,234명 × (1 − 0.6²) = 19,990명</td><td>실험 기간이 여기서 정해진다</td></tr>
<tr><td>신규 유저 처리</td><td><a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a> 0으로 두고 별도 세그먼트로 본다</td><td>조정 효과가 없는 집단을 섞어 ρ를 낮추지 않기 위해</td></tr>
<tr><td>보고 형식</td><td>조정 전 차이와 조정 후 차이를 같이 적는다</td><td>읽는 사람이 조정이 결론을 바꿨는지 볼 수 있어야 한다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. CUPED를 쓰는 실험의 설계서 추가 항목.</p>
<p>마지막 줄이 중요합니다. 조정 전과 후의 차이가 크게 다르면, 그것은 CUPED가 잘못된 것이 아니라 두 그룹의 실험 전 값이 우연히 달랐다는 뜻입니다. 조정 후 값이 그 우연을 걷어낸 값이고, 두 숫자를 같이 적어야 읽는 사람이 그 사실을 알 수 있습니다<sup class="fn"><a href="#ref-1" title="Deng, Xu, Kohavi & Walker (2013). Improving the sensitivity of online controlled experiments by utilizing pre-experiment data. WSDM '13, 123–132.">[1]</a></sup>.</p>
<blockquote><p><strong>CUPED를 쓰는 실험은 <a class="term" href="#term-covariate" data-tip="공변량(covariate): 실험 결과를 설명하는 보조 변수. CUPED에서는 실험 시작 전에 측정한 같은 지표.">공변량</a>과 예상 상관을 설계서에 먼저 적고, 결과에는 조정 전과 후를 나란히 적습니다.</strong></p></blockquote>

## 나가며

<ol>
<li>필요 인원은 지표의 분산에 비례하고, 실험 전 값과의 상관이 ρ이면 분산은 1 − ρ² 배로 줄어듭니다. 상관 0.7이면 절반, 0.8이면 36%입니다.</li>
<li>계산은 회귀 기울기 θ 하나를 구해 Y − θ(X − X̄)를 비교하는 것입니다. 실제 소매 데이터에서 상관 0.812로 <a class="term" href="#term-se" data-tip="표준오차(standard error): 같은 실험을 반복했을 때 추정값(두 그룹의 차이)이 흔들리는 폭. 작을수록 작은 차이를 가려낼 수 있다.">표준오차</a>가 105.6에서 61.6으로 줄었고, 가짜 양성은 4.7%와 5.2%로 그대로였습니다.</li>
<li>실험 전 값이 있어야 쓸 수 있습니다. 신규 유저 실험에는 무력하고, 기존 유저의 구매액이나 플레이 시간처럼 성향이 강한 지표에서 효과가 큽니다<sup class="fn"><a href="#ref-2" title="Kohavi, Tang & Xu (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[2]</a></sup>.</li>
</ol>

## 용어

<ul>
<li id="term-covariate"><strong>공변량(covariate)</strong>: 실험 결과를 설명하는 데 쓰는 보조 변수입니다. CUPED에서는 실험 시작 전에 측정한 같은 지표를 씁니다.</li>
<li id="term-se"><strong>표준오차(standard error)</strong>: 같은 실험을 반복했을 때 추정값(여기서는 두 그룹의 차이)이 흔들리는 폭입니다. 작을수록 같은 인원으로 더 작은 차이를 가려낼 수 있습니다.</li>
<li id="term-power"><strong>검출력(statistical power)</strong>: 진짜 효과가 있을 때 실험이 그것을 유의하게 잡아낼 확률입니다. 보통 80%를 목표로 설계합니다.</li>
<li id="term-noise"><strong>노이즈(noise)</strong>: 실험 효과와 무관하게 측정값에 섞여 드는 변동입니다. 유저마다 원래 다른 성향, 요일, 우연이 모두 노이즈가 됩니다. CUPED는 이 가운데 실험 전 값으로 설명되는 부분을 걷어냅니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Deng, A., Xu, Y., Kohavi, R., &amp; Walker, T. (2013). Improving the sensitivity of online controlled experiments by utilizing pre-experiment data. <em>Proceedings of the Sixth ACM International Conference on Web Search and Data Mining (WSDM ’13)</em>, 123–132. https://doi.org/10.1145/2433396.2433413</li>
<li id="ref-2">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
</ol>
<p class="refs">그림 1과 그림 3의 곡선은 공식 1 − ρ²입니다. 그림 2의 데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)이며, 고객 ID가 있고 수량과 단가가 양수인 거래 805,549건에서 금액을 수량 × 단가로 계산했습니다. 실험 전 기간은 2010-12-01부터 2011-05-31, 실험 기간은 2011-06-01부터 2011-08-31이고, 실험 전 기간에 구매한 고객 2,708명이 모집단입니다. 실제 실험은 없었으므로 무작위 50:50 배정을 1만 회 반복했고(시드 2026, 코드 블록은 시드 7의 한 번), 효과는 B안 구매액에 비율을 곱해 넣었습니다. 검정은 두 평균의 z검정(양측, α = 0.05)입니다. 고객 단위 원본은 싣지 않았습니다. 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1, pandas 3.0.6입니다.</p>
