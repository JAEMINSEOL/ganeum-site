---
title: "몇 명이 모이면 실험을 끝낼 수 있을까?"
description: "실험 전에 정하는 표본 수와 MDE"
date: 2026-10-08T07:00:00+09:00
tags: ["표본 수", "MDE", "검출력"]
draft: false
---
<blockquote><p><strong>표본 수는 실험이 끝난 뒤에 세는 숫자가 아니라 시작 전에 정하는 숫자입니다. 이 숫자가 없으면 “유의하지 않다”가 무슨 뜻인지도 해석할 수 없습니다.</strong></p></blockquote>

## 들어가며

<p>지난 칼럼에서 결과를 매일 들여다보며 멈추면 아무 차이 없는 실험도 22.1%가 승리로 나온다고 했습니다. 대안은 “표본 수를 미리 정하고 그 시점에 한 번 판정한다”였습니다. 그러면 그 숫자는 어떻게 정할까요.</p>
<p>전환율 5%인 버튼을 5.5%로 올리는 개선이 있다고 해 보겠습니다. 이 개선을 확인하려면 각 그룹에 31,234명이 필요합니다. 이번 글에서는 이 숫자가 어디서 나오는지 보겠습니다. 트래픽이 정해져 있을 때 거꾸로 무엇을 계산하는지, 인원이 모자란 채로 끝낸 실험이 어떻게 비틀리는지도 다룹니다.</p>

## 표본 수는 네 개의 숫자가 함께 정합니다

<p>필요 인원은 통계가 혼자 정해 주지 않습니다. 아래 네 가지를 먼저 정해야 계산이 시작됩니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>정할 것</th><th>뜻</th><th>보통 쓰는 값</th><th>누가 정하나</th></tr></thead>
<tbody>
<tr><td>기저 전환율</td><td>지금 A안의 성적</td><td>최근 4주 실측값</td><td>데이터가 알려 준다</td></tr>
<tr><td>잡고 싶은 최소 차이</td><td>이만큼 좋아지면 채택하겠다는 선</td><td>상대 10~30%</td><td>사업 판단</td></tr>
<tr><td>유의수준 (α)</td><td>없는 차이를 있다고 할 확률의 상한</td><td>0.05 양측</td><td>관례, 결정의 무게에 맞춰 조정</td></tr>
<tr><td>검출력 (1−β)</td><td>진짜 차이가 있을 때 잡아낼 확률</td><td>0.80</td><td>관례</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 표본 수 계산에 들어가는 네 가지 입력.</p>
<p>두 번째 줄이 핵심입니다. “얼마나 좋아지면 채택할 것인가”는 통계 문제가 아니라 사업 판단입니다. 개발 비용과 되돌리는 비용을 생각해서 정하는 선이고, 이 선을 정하지 않으면 나머지 계산이 불가능합니다.</p>
<p>네 숫자가 정해지면 필요 인원이 따라 나옵니다<sup>[1]</sup>. 반대로 트래픽이 이미 정해져 있다면 거꾸로 계산해서 “이 인원으로 잡을 수 있는 가장 작은 차이”를 구합니다. 이 값을 <strong>MDE</strong>(최소 검출 가능 효과, minimum detectable effect)라고 부릅니다.</p>
<blockquote><p>표본 수는 통계가 정해 주는 숫자가 아니라, 무엇을 얼마나 확실하게 잡고 싶은지 먼저 정해야 나오는 숫자입니다.</p></blockquote>

## 5%를 5.5%로 올리는 개선, 몇 명이 필요할까요

<p>기저 전환율 5%, 유의수준 0.05 양측, 검출력 80%로 고정하고 잡고 싶은 차이만 바꿔 가며 계산해 보겠습니다.</p>

```python
import numpy as np
from scipy.stats import norm

def n_per_group(p1, p2, alpha=0.05, power=0.80):
    """두 비율을 비교할 때 그룹당 필요한 인원 (양측 검정)"""
    za, zb = norm.isf(alpha / 2), norm.isf(1 - power)
    pbar = (p1 + p2) / 2
    num = (za * np.sqrt(2 * pbar * (1 - pbar)) + zb * np.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2
    return num / (p2 - p1) ** 2

for rel in (0.05, 0.10, 0.20, 0.50):
    p2 = 0.05 * (1 + rel)
    print(f"상대 +{rel*100:>2.0f}% (5.00% -> {p2*100:.2f}%) : 그룹당 {np.ceil(n_per_group(0.05, p2)):>9,.0f}명")
# 상대 + 5% (5.00% -> 5.25%) : 그룹당   122,124명
# 상대 +10% (5.00% -> 5.50%) : 그룹당    31,234명
# 상대 +20% (5.00% -> 6.00%) : 그룹당     8,158명
# 상대 +50% (5.00% -> 7.50%) : 그룹당     1,471명
```

<div class="table-scroll">
<table>
<thead><tr><th>잡고 싶은 개선</th><th>전환율</th><th>차이</th><th>그룹당 필요 인원</th><th>하루 2,000명이면</th></tr></thead>
<tbody>
<tr><td>상대 +50%</td><td>5.00% → 7.50%</td><td>+2.50%p</td><td>1,471명</td><td>2일</td></tr>
<tr><td>상대 +30%</td><td>5.00% → 6.50%</td><td>+1.50%p</td><td>3,780명</td><td>4일</td></tr>
<tr><td>상대 +20%</td><td>5.00% → 6.00%</td><td>+1.00%p</td><td>8,158명</td><td>9일</td></tr>
<tr><td>상대 +10%</td><td>5.00% → 5.50%</td><td>+0.50%p</td><td>31,234명</td><td>32일</td></tr>
<tr><td>상대 +5%</td><td>5.00% → 5.25%</td><td>+0.25%p</td><td>122,124명</td><td>123일</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 기저 전환율 5%에서 잡고 싶은 차이별 필요 인원. 맨 오른쪽은 하루 방문자 2,000명을 두 그룹에 절반씩 나눌 때의 기간입니다.</p>
<p>표를 아래에서 위로 읽어 보십시오. 잡고 싶은 차이가 절반이 될 때마다 필요 인원은 약 4배가 됩니다. 상대 +20%에서 +10%로 목표를 낮추면 8,158명이 31,234명이 되고, 기간은 9일에서 32일로 늘어납니다. 필요 인원이 차이의 제곱에 반비례하기 때문입니다.</p>
<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="잡고 싶은 개선이 작아질수록 필요 인원이 급격히 늘어나는 곡선" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="80" y1="34" x2="80" y2="170" stroke="currentColor" stroke-width="1"/>
<line x1="80" y1="170" x2="580" y2="170" stroke="currentColor" stroke-width="1.5"/>
<text x="74" y="61" text-anchor="end">100,000</text>
<text x="74" y="118" text-anchor="end">10,000</text>
<text x="74" y="174" text-anchor="end">1,000</text>
<polyline points="124,52 167,86 255,118 342,137 516,161" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="124" cy="52" r="4" fill="currentColor"/>
<circle cx="167" cy="86" r="4" fill="currentColor"/>
<circle cx="255" cy="118" r="4" fill="currentColor"/>
<circle cx="342" cy="137" r="4" fill="currentColor"/>
<circle cx="516" cy="161" r="4" fill="currentColor"/>
<text x="132" y="47">122,124명</text>
<text x="175" y="81">31,234명</text>
<text x="263" y="113">8,158명</text>
<text x="350" y="132">3,780명</text>
<text x="524" y="156">1,471명</text>
<text x="124" y="190" text-anchor="middle">+5%</text>
<text x="167" y="190" text-anchor="middle">+10%</text>
<text x="255" y="190" text-anchor="middle">+20%</text>
<text x="342" y="190" text-anchor="middle">+30%</text>
<text x="516" y="190" text-anchor="middle">+50%</text>
<text x="330" y="210" text-anchor="middle">가로축은 잡고 싶은 상대 개선, 세로축은 그룹당 필요 인원(로그 눈금)</text>
</g>
</svg>
<figcaption>그림 3. 목표를 작게 잡을수록 필요 인원은 가파르게 올라갑니다. 기저 전환율 5% 기준입니다.</figcaption>
</figure>
<blockquote><p>작은 개선을 확인하는 비용은 선형이 아니라 제곱으로 늘어납니다.</p></blockquote>

## 거꾸로 묻기, 우리 트래픽으로는 무엇을 잡을 수 있나

<p>현실에서는 인원을 마음대로 늘릴 수 없습니다. 이럴 때는 질문을 뒤집습니다. “이 인원으로 잡을 수 있는 가장 작은 차이는 얼마인가”, 즉 MDE를 구합니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>그룹당 인원</th><th>MDE (상대)</th><th>전환율로 보면</th><th>차이</th></tr></thead>
<tbody>
<tr><td>1,000명</td><td>62.0%</td><td>5.00% → 8.10%</td><td>+3.10%p</td></tr>
<tr><td>5,000명</td><td>25.9%</td><td>5.00% → 6.29%</td><td>+1.29%p</td></tr>
<tr><td>20,000명</td><td>12.6%</td><td>5.00% → 5.63%</td><td>+0.63%p</td></tr>
<tr><td>50,000명</td><td>7.9%</td><td>5.00% → 5.39%</td><td>+0.39%p</td></tr>
<tr><td>100,000명</td><td>5.5%</td><td>5.00% → 5.28%</td><td>+0.28%p</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 그룹당 인원별 MDE. 기저 전환율 5%, 유의수준 0.05 양측, 검출력 80% 기준입니다.</p>
<p>그룹당 5,000명을 모을 수 있다면 이 실험의 MDE는 상대 25.9%입니다. 버튼 색을 바꿔서 전환율이 26% 오를 가능성은 높지 않습니다. 그렇다면 이 실험은 돌리기 전에 결과가 거의 정해져 있습니다. 유의하게 나오지 않을 것이고, 그때 보고서에 “차이가 없었다”고 적으면 사실이 아닙니다. 정확한 문장은 “이 인원으로는 확인할 수 없었다”입니다.</p>
<p>MDE를 먼저 계산하면 세 가지 선택지가 보입니다. 기간을 늘리거나, 더 큰 변화를 시도하거나, 실험 대신 다른 방법으로 판단하는 것입니다. 어느 쪽이든 돌려 보고 나서 아는 것보다 낫습니다.</p>
<blockquote><p>MDE보다 작은 효과를 노리는 실험은 시작하기 전에 이미 결론을 내지 못하는 실험입니다.</p></blockquote>

## 인원이 모자란 채 유의하게 나오면 생기는 일

<p>여기까지는 “유의하게 안 나온다”는 이야기였습니다. 더 성가신 문제는 그 반대쪽에 있습니다. 인원이 모자라도 가끔은 유의하게 나오는데, <strong>그렇게 나온 결과는 효과를 부풀립니다.</strong></p>
<p>진짜로 상대 +10% 개선이 존재하는 상황을 가정하고, 인원만 바꿔 가며 4만 번씩 실험해 보았습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>그룹당 인원</th><th>검출력 (실측)</th><th>유의하게 이긴 실험의 평균 추정 개선</th><th>실제의 몇 배</th></tr></thead>
<tbody>
<tr><td>3,000명</td><td>14.1%</td><td>31.4%</td><td>3.1배</td></tr>
<tr><td>8,000명</td><td>29.8%</td><td>19.0%</td><td>1.9배</td></tr>
<tr><td>31,000명</td><td>79.9%</td><td>11.4%</td><td>1.1배</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 진짜 효과가 상대 +10%일 때, 인원별로 4만 번 실험한 결과. 설명을 위해 만든 가상 실험입니다.</p>
<p>그룹당 3,000명짜리 실험에서 유의하게 이긴 경우, 평균 추정 개선은 31.4%였습니다. 실제 효과의 3.1배입니다. 분포를 그려 보면 이유가 보입니다.</p>
<figure>
<svg viewBox="0 0 620 220" role="img" aria-label="추정 개선의 분포. 유의하게 이긴 실험은 모두 분포의 오른쪽 끝에 몰려 있다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="70" y1="168" x2="580" y2="168" stroke="currentColor" stroke-width="1.5"/>
<rect x="71" y="167" width="43" height="1" fill="none" stroke="currentColor"/>
<rect x="116" y="155" width="43" height="13" fill="none" stroke="currentColor"/>
<rect x="162" y="107" width="43" height="61" fill="none" stroke="currentColor"/>
<rect x="207" y="46" width="43" height="122" fill="none" stroke="currentColor"/>
<rect x="253" y="56" width="43" height="112" fill="none" stroke="currentColor"/>
<rect x="298" y="109" width="43" height="59" fill="none" stroke="currentColor"/>
<rect x="344" y="148" width="43" height="20" fill="none" stroke="currentColor"/>
<rect x="389" y="163" width="43" height="5" fill="none" stroke="currentColor"/>
<rect x="435" y="167" width="43" height="1" fill="none" stroke="currentColor"/>
<rect x="298" y="140" width="43" height="28" fill="currentColor"/>
<rect x="344" y="148" width="43" height="20" fill="currentColor"/>
<rect x="389" y="163" width="43" height="5" fill="currentColor"/>
<rect x="435" y="167" width="43" height="1" fill="currentColor"/>
<line x1="252" y1="36" x2="252" y2="168" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<text x="258" y="34">진짜 효과 +10%</text>
<rect x="452" y="60" width="12" height="10" fill="none" stroke="currentColor"/>
<text x="470" y="69">실험 4만 회 전체</text>
<rect x="452" y="78" width="12" height="10" fill="currentColor"/>
<text x="470" y="87">유의하게 이긴 실험</text>
<text x="70" y="188" text-anchor="middle">−30%</text>
<text x="207" y="188" text-anchor="middle">0%</text>
<text x="298" y="188" text-anchor="middle">+20%</text>
<text x="389" y="188" text-anchor="middle">+40%</text>
<text x="480" y="188" text-anchor="middle">+60%</text>
<text x="325" y="212" text-anchor="middle">가로축은 그 실험이 추정한 상대 개선</text>
</g>
</svg>
<figcaption>그림 6. 그룹당 3,000명으로 4만 번 돌린 실험의 추정 개선 분포. 진짜 효과는 +10%인데, 유의하게 이긴 실험은 전부 +20%보다 오른쪽에 있습니다. 설명을 위해 만든 가상 실험입니다.</figcaption>
</figure>
<p>인원이 적으면 추정치가 넓게 흩어집니다. 그 넓은 분포에서 유의 기준을 넘는 것은 오른쪽 끝뿐입니다. 유의한 결과만 모아 보고하면 그 끝만 골라 보는 셈이 됩니다. 같은 실험에서 유의하게 나온 것의 1.8%는 방향까지 반대였습니다. B가 사실 더 좋은데 A가 유의하게 이긴 것입니다.</p>
<p>실무에서 이 문제는 숫자를 곱할 때 드러납니다. 작은 실험에서 나온 “+31% 개선”을 연간 매출에 그대로 곱하면, 실제로는 세 배 부풀린 계획을 세우게 됩니다. 이런 과대추정은 검출력이 낮을수록 커집니다<sup>[2]</sup>.</p>
<blockquote><p>인원이 모자란 실험은 틀린 답만 주는 것이 아니라, 맞힐 때조차 효과를 부풀려 줍니다.</p></blockquote>

## 실험을 시작하기 전에 적어 둘 것

<p>계산 자체는 함수 하나입니다. 중요한 것은 결과를 보기 전에 적어 두는 일입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>적을 것</th><th>예시</th><th>이유</th></tr></thead>
<tbody>
<tr><td>기저 전환율</td><td>최근 4주 5.0%</td><td>계산의 출발점</td></tr>
<tr><td>잡고 싶은 최소 차이</td><td>상대 +20% (5.0% → 6.0%)</td><td>채택 기준을 미리 못 박는다</td></tr>
<tr><td>유의수준과 검출력</td><td>0.05 양측, 80%</td><td>결과를 보고 바꾸지 않기 위해</td></tr>
<tr><td>그룹당 필요 인원</td><td>8,158명</td><td>언제 끝낼지가 여기서 정해진다</td></tr>
<tr><td>예상 기간</td><td>하루 2,000명 기준 9일</td><td>일정 합의</td></tr>
<tr><td>판정 시점</td><td>9일차에 한 번</td><td>훔쳐보기를 막는다</td></tr>
<tr><td>중단 규칙</td><td>배정 비율 이상, 오류율 급등일 때만</td><td>멈추는 기준을 유불리에 두지 않는다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 7. 실험 설계서에 들어갈 최소 항목.</p>
<p>이 표를 실험 시작 전에 채우면 지난 칼럼의 훔쳐보기와 이번 칼럼의 과대추정을 한 번에 막습니다. 채우다가 막히는 칸이 있다면, 그 칸이 바로 아직 합의되지 않은 부분입니다.</p>
<blockquote><p>실험 설계서는 통계 문서가 아니라 결과를 보기 전에 맺는 합의문입니다.</p></blockquote>

## 나가며

<ol>
<li>전환율 5%에서 상대 +10% 개선을 검출력 80%로 확인하려면 그룹당 31,234명이 필요합니다. 잡고 싶은 차이를 절반으로 낮추면 인원은 약 4배가 됩니다.</li>
<li>트래픽이 정해져 있다면 거꾸로 MDE를 구하십시오. 그룹당 5,000명의 MDE는 상대 25.9%입니다. 그보다 작은 효과를 노리는 실험은 시작 전에 이미 답을 내지 못합니다.</li>
<li>인원이 모자라면 유의하게 나온 결과조차 효과를 부풀립니다. 그룹당 3,000명 실험에서 유의하게 이긴 경우의 평균 추정 개선은 실제의 3.1배였습니다.</li>
</ol>

## 참고

<ol>
<li>Cohen, J. (1988). <em>Statistical Power Analysis for the Behavioral Sciences</em> (2nd ed.). Lawrence Erlbaum Associates.</li>
<li>Gelman, A., &amp; Carlin, J. (2014). Beyond power calculations: Assessing Type S (sign) and Type M (magnitude) errors. <em>Perspectives on Psychological Science</em>, 9(6), 641–651. https://doi.org/10.1177/1745691614551642</li>
</ol>
<p class="refs">본문의 모든 수치는 설명을 위해 만든 가상 실험을 직접 계산하고 시뮬레이션한 값입니다. 필요 인원은 두 비율 비교의 합동분산 공식 n = (z<sub>α/2</sub>√(2p̄(1−p̄)) + z<sub>β</sub>√(p₁(1−p₁)+p₂(1−p₂)))² / (p₂−p₁)² 으로 계산했고, 유의수준 0.05 양측과 검출력 80%를 썼습니다. MDE는 같은 식을 이분법으로 역산한 값입니다. 그림 5와 그림 6의 시뮬레이션은 조건당 4만 회, 시드 2026 기준입니다. 소수점 자리에서 반올림했으므로 계산기마다 한두 명 차이가 날 수 있습니다. 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1입니다.</p>
