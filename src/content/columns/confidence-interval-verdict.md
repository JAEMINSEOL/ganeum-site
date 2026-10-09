---
title: "유의하지 않으면 차이가 없는 걸까?"
description: "신뢰구간으로 결론을 쓰는 법"
date: 2026-10-09T07:00:00+09:00
tags: ["신뢰구간", "판정", "동등성"]
draft: false
---
<blockquote><p><strong>유의하지 않다는 결과는 결론이 아니라 질문입니다. 차이가 없어서인지, 아직 모르는 것인지는 p값이 아니라 신뢰구간이 알려 줍니다.</strong></p></blockquote>

## 들어가며

<p>실험이 끝났고 p = 0.210이 나왔습니다. 흔히 쓰는 기준 0.05보다 큽니다. 보고서에 <strong>두 안 사이에 차이가 없었다</strong>라고 적어도 될까요.</p>
<p>적으면 안 됩니다. 그런데 그렇다고 <strong>모르겠다</strong>로 끝낼 수도 없습니다. 이번 글에서는 겉보기에 똑같이 유의하지 않은 두 실험이 전혀 다른 결론으로 이어지는 과정을 봅니다. 그리고 신뢰구간으로 결론 문장을 쓰는 법을 정리하겠습니다.</p>

## 유의하지 않음에는 두 종류가 있습니다

<p>전환율 5%짜리 버튼 실험 두 건을 나란히 놓아 보겠습니다. 둘 다 유의하지 않습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>사례 C</th><th>사례 D</th></tr></thead>
<tbody>
<tr><td>그룹당 인원</td><td>100,000명</td><td>2,000명</td></tr>
<tr><td>A안 / B안</td><td>5.00% / 5.04%</td><td>5.00% / 5.90%</td></tr>
<tr><td>차이</td><td>+0.04%p</td><td>+0.90%p</td></tr>
<tr><td>p값</td><td>0.682</td><td>0.210</td></tr>
<tr><td>95% 신뢰구간</td><td>−0.15%p ~ +0.23%p</td><td>−0.51%p ~ +2.31%p</td></tr>
<tr><td>구간 폭</td><td>0.38%p</td><td>2.81%p</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 둘 다 유의하지 않지만 알려 주는 것이 다른 두 실험. 설명을 위해 만든 가상 예시입니다.</p>
<p>p값만 보면 둘 다 <strong>유의하지 않음</strong>입니다. 신뢰구간을 보면 이야기가 달라집니다.</p>
<p>사례 C의 구간은 −0.15%p에서 +0.23%p 사이에 갇혀 있습니다. 가장 좋게 봐도 0.23%p, 가장 나쁘게 봐도 −0.15%p라는 뜻입니다. 이 정도 폭이면 사업적으로 같다고 말해도 무리가 없습니다. 반면 사례 D의 구간은 −0.51%p에서 +2.31%p까지 벌어져 있습니다. B안이 조금 나쁠 수도 있고 전환율을 절반 가까이 끌어올릴 수도 있습니다. 이건 <strong>차이가 없다</strong>가 아니라 <strong>이 데이터로는 아무것도 못 말한다</strong>입니다.</p>
<p>참고로 신뢰구간은 참값이 그 안에 있을 확률이 95%라는 뜻이 아닙니다. 같은 방식으로 실험을 100번 하면 그렇게 만든 구간 가운데 약 95개가 참값을 품도록 설계된 구간입니다.</p>
<blockquote><p>p값은 두 실험을 똑같이 유의하지 않음으로 묶지만, 신뢰구간은 하나를 결론으로, 다른 하나를 재실험으로 보냅니다.</p></blockquote>

## 신뢰구간이 가리키는 네 가지 결론

<p>사례 두 개를 더해 네 가지를 한 그림에 올려 보겠습니다. 가로축은 B안에서 A안을 뺀 전환율 차이입니다.</p>
<figure>
<svg viewBox="0 0 620 230" role="img" aria-label="네 사례의 신뢰구간을 한 축에 비교한 그림" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="290" y1="40" x2="290" y2="182" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="342" y1="40" x2="342" y2="182" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="316" y1="40" x2="316" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="575" y="34" text-anchor="end">점선 사이는 무시해도 되는 차이 (±0.25%p)</text>
<text x="150" y="58" text-anchor="end">사례 A</text>
<line x1="353" y1="54" x2="445" y2="54" stroke="currentColor" stroke-width="2"/>
<line x1="353" y1="48" x2="353" y2="60" stroke="currentColor" stroke-width="2"/>
<line x1="445" y1="48" x2="445" y2="60" stroke="currentColor" stroke-width="2"/>
<circle cx="399" cy="54" r="4.5" fill="currentColor"/>
<text x="455" y="58">채택</text>
<text x="150" y="90" text-anchor="end">사례 B</text>
<line x1="200" y1="86" x2="286" y2="86" stroke="currentColor" stroke-width="2"/>
<line x1="200" y1="80" x2="200" y2="92" stroke="currentColor" stroke-width="2"/>
<line x1="286" y1="80" x2="286" y2="92" stroke="currentColor" stroke-width="2"/>
<circle cx="243" cy="86" r="4.5" fill="currentColor"/>
<text x="296" y="90">기각</text>
<text x="150" y="122" text-anchor="end">사례 C</text>
<line x1="300" y1="118" x2="340" y2="118" stroke="currentColor" stroke-width="2"/>
<line x1="300" y1="112" x2="300" y2="124" stroke="currentColor" stroke-width="2"/>
<line x1="340" y1="112" x2="340" y2="124" stroke="currentColor" stroke-width="2"/>
<circle cx="320" cy="118" r="4.5" fill="currentColor"/>
<text x="350" y="122">실질적 차이 없음</text>
<text x="150" y="154" text-anchor="end">사례 D</text>
<line x1="263" y1="150" x2="555" y2="150" stroke="currentColor" stroke-width="2"/>
<line x1="263" y1="144" x2="263" y2="156" stroke="currentColor" stroke-width="2"/>
<line x1="555" y1="144" x2="555" y2="156" stroke="currentColor" stroke-width="2"/>
<circle cx="409" cy="150" r="4.5" fill="currentColor"/>
<text x="470" y="142" text-anchor="middle">판정 불가</text>
<line x1="160" y1="182" x2="575" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="212" y="200" text-anchor="middle">−1.0</text>
<text x="316" y="200" text-anchor="middle">0</text>
<text x="419" y="200" text-anchor="middle">+1.0</text>
<text x="523" y="200" text-anchor="middle">+2.0</text>
<text x="367" y="222" text-anchor="middle">B안에서 A안을 뺀 전환율 차이 (%p)</text>
</g>
</svg>
<figcaption>그림 2. 같은 축에 올린 네 사례의 95% 신뢰구간. 가운데 점은 측정된 차이입니다. 설명을 위해 만든 가상 예시입니다.</figcaption>
</figure>
<div class="table-scroll">
<table>
<thead><tr><th>사례</th><th>그룹당</th><th>차이</th><th>p값</th><th>95% 신뢰구간</th><th>결론</th></tr></thead>
<tbody>
<tr><td>A</td><td>20,000명</td><td>+0.80%p</td><td>&lt;0.001</td><td>+0.36%p ~ +1.24%p</td><td>채택</td></tr>
<tr><td>B</td><td>20,000명</td><td>−0.70%p</td><td>0.001</td><td>−1.11%p ~ −0.29%p</td><td>기각</td></tr>
<tr><td>C</td><td>100,000명</td><td>+0.04%p</td><td>0.682</td><td>−0.15%p ~ +0.23%p</td><td>실질적 차이 없음</td></tr>
<tr><td>D</td><td>2,000명</td><td>+0.90%p</td><td>0.210</td><td>−0.51%p ~ +2.31%p</td><td>판정 불가</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 네 사례의 숫자. 두 비율 z검정(양측, α = 0.05) 기준입니다.</p>
<p>읽는 순서는 간단합니다. 구간 전체가 0보다 오른쪽이면 채택, 전체가 왼쪽이면 기각입니다. 0을 품고 있다면 폭을 봅니다. 폭이 무시해도 되는 범위 안에 들어가면 실질적 차이 없음, 그 범위를 넘어 벌어져 있으면 판정 불가입니다.</p>
<blockquote><p>0을 포함했는지만 보면 C와 D가 같아 보이고, 폭까지 보면 둘은 반대 결론이 됩니다.</p></blockquote>

## 무시해도 되는 선을 미리 정합니다

<p>앞의 판정은 <strong>±0.25%p까지는 같다고 본다</strong>는 선이 있어서 가능했습니다. 이 선이 없으면 0을 품은 구간은 전부 판정 불가가 됩니다. 영원히 <strong>더 봐야 한다</strong>만 반복하게 됩니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>정하는 방법</th><th>예시</th><th>주의</th></tr></thead>
<tbody>
<tr><td>비용으로 정한다</td><td>월 500만원 미만이면 대응하지 않는다</td><td>금액을 지표 단위로 환산해 둔다</td></tr>
<tr><td>기존 변동폭으로 정한다</td><td>최근 1년 주간 전환율 흔들림의 절반</td><td>계절성이 큰 지표면 구간을 길게 본다</td></tr>
<tr><td>의사결정 기준으로 정한다</td><td>이 정도면 개발 공수를 쓰지 않는다</td><td>팀 합의가 필요하다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 무시 가능한 차이의 선을 정하는 방법.</p>
<p>중요한 것은 <strong>결과를 보기 전에 정하는 것</strong>입니다. 결과를 본 뒤에 선을 옮기면, 원하는 결론에 맞춰 기준을 조정하는 일이 됩니다. 실험 설계서에 목표 효과를 적을 때 이 선도 같이 적어 두면 됩니다. 두 숫자는 보통 짝으로 움직입니다. 잡고 싶은 최소 차이가 상대 +20%라면, 무시 가능한 선은 그보다 훨씬 작은 상대 ±5% 근처에서 정해집니다.</p>
<p>이 선을 놓고 구간을 비교하는 절차는 동등성 검정이라는 이름으로 정리되어 있습니다<sup class="fn"><a href="#ref-2" title="Lakens, Scheel & Isager (2018). Equivalence testing for psychological research: A tutorial. AMPPS, 1(2), 259–269.">[2]</a></sup>. 도구를 따로 쓰지 않더라도, 신뢰구간과 선을 겹쳐 보는 것만으로 대부분의 판단은 끝납니다.</p>
<blockquote><p>차이가 없다고 말하려면, 없다고 볼 기준을 먼저 정해야 합니다.</p></blockquote>

## 결론 문장 쓰기

<p>네 가지 패턴에 대응하는 문장은 이렇게 쓸 수 있습니다. 숫자만 바꿔 넣으면 됩니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>패턴</th><th>이렇게 씁니다</th><th>이렇게 쓰지 않습니다</th></tr></thead>
<tbody>
<tr><td>채택</td><td>B안이 A안보다 0.80%p 높았습니다(95% 신뢰구간 +0.36%p ~ +1.24%p). 최소 0.36%p의 개선은 기대할 수 있습니다.</td><td>B안이 16% 더 좋습니다</td></tr>
<tr><td>기각</td><td>B안이 0.70%p 낮았습니다(−1.11%p ~ −0.29%p). 적용하면 손해입니다.</td><td>B안은 효과가 없었습니다</td></tr>
<tr><td>실질적 차이 없음</td><td>차이는 +0.04%p였고 구간이 −0.15%p ~ +0.23%p로, 미리 정한 무시 가능 범위 안에 들어갑니다. 전환율 기준으로는 같다고 보고 다른 기준으로 결정하면 됩니다.</td><td>두 안은 차이가 없습니다</td></tr>
<tr><td>판정 불가</td><td>구간이 −0.51%p ~ +2.31%p로 넓어 방향조차 말할 수 없습니다. 상대 +20% 차이를 잡으려면 그룹당 8,158명이 필요하니, 판단하려면 그룹당 약 6,200명이 더 필요합니다.</td><td>유의하지 않으므로 효과가 없습니다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 패턴별 결론 문장. 오른쪽 칸은 같은 데이터로 자주 쓰이는 틀린 문장입니다.</p>
<p>네 문장의 공통점은 숫자 두 개, 즉 측정값과 구간을 함께 적는다는 것입니다. 구간을 적는 순간 읽는 사람이 스스로 판단할 수 있게 됩니다. 판정 불가일 때 필요한 추가 인원까지 적어 주면, 보고가 끝이 아니라 다음 행동으로 이어집니다.</p>
<blockquote><p>결론 문장에 측정값과 구간을 함께 적으면, 읽는 사람이 다시 묻지 않아도 됩니다.</p></blockquote>

## 신뢰구간을 잘못 읽는 방법

<div class="table-scroll">
<table>
<thead><tr><th>흔한 오독</th><th>왜 틀렸나</th></tr></thead>
<tbody>
<tr><td>참값이 이 구간에 있을 확률이 95%다</td><td>구간은 데이터마다 달라지는 값이다. 같은 방식으로 반복했을 때 약 95%가 참값을 품는다는 뜻이다</td></tr>
<tr><td>0을 포함하니 효과가 0이다</td><td>구간 안의 모든 값이 데이터와 어긋나지 않는다. 0도 그중 하나일 뿐이다</td></tr>
<tr><td>두 그룹의 구간이 겹치니 차이가 없다</td><td>각 그룹의 구간이 아니라 차이의 구간을 봐야 한다. 겹쳐도 차이가 유의할 수 있다</td></tr>
<tr><td>구간이 좁으니 결과가 정확하다</td><td>좁다는 것은 정밀하다는 뜻이지 편향이 없다는 뜻이 아니다. 배정이 틀어졌다면 좁고 정확히 틀린 답이 나온다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 6. 신뢰구간을 읽을 때 자주 나오는 오해.</p>
<p>마지막 줄은 특히 데이터가 많은 팀에서 자주 걸립니다. 모수가 크면 구간은 저절로 좁아집니다. 좁은 구간은 믿을 만해 보이지만, 그룹 배정이나 로그 수집에 문제가 있었다면 그 문제까지 정밀하게 재어 보여 줄 뿐입니다<sup class="fn"><a href="#ref-1" title="Amrhein, Greenland & McShane (2019). Scientists rise up against statistical significance. Nature, 567, 305–307.">[1]</a></sup>.</p>
<blockquote><p>구간의 폭은 정밀도를 말할 뿐, 측정이 옳았는지는 말해 주지 않습니다.</p></blockquote>

## 나가며

<ol>
<li><strong>유의하지 않다</strong>는 두 가지로 갈립니다. 사례 C는 구간이 ±0.25%p 안에 들어와 실질적 차이 없음이고, 사례 D는 −0.51%p에서 +2.31%p까지 벌어져 판정 불가입니다. p값은 둘을 구분하지 못합니다.</li>
<li>구간이 0의 어느 쪽에 있는지로 채택과 기각을 가르고, 0을 품었다면 폭으로 나머지 둘을 가릅니다. 그러려면 무시해도 되는 차이의 선을 결과를 보기 전에 정해 두어야 합니다.</li>
<li>결론 문장에는 측정값과 구간을 함께 적습니다. 판정 불가라면 얼마나 더 모아야 하는지까지 적습니다.</li>
</ol>

## 참고

<ol>
<li id="ref-1">Amrhein, V., Greenland, S., &amp; McShane, B. (2019). Scientists rise up against statistical significance. <em>Nature</em>, 567, 305–307. https://doi.org/10.1038/d41586-019-00857-9</li>
<li id="ref-2">Lakens, D., Scheel, A. M., &amp; Isager, P. M. (2018). Equivalence testing for psychological research: A tutorial. <em>Advances in Methods and Practices in Psychological Science</em>, 1(2), 259–269. https://doi.org/10.1177/2515245918770963</li>
</ol>
<p class="refs">본문의 모든 수치는 설명을 위해 만든 가상 실험을 직접 계산한 값입니다. 차이의 신뢰구간은 두 비율의 표준오차를 합쳐 구했고(양측, α = 0.05), p값은 합동분산을 쓰는 두 비율 z검정으로 계산했습니다. 무시 가능한 차이의 선 ±0.25%p는 기저 전환율 5%의 상대 ±5%로 잡은 가정값입니다. 사례 D의 추가 인원은 관측된 차이가 아니라 상대 +20%(5.0% → 6.0%)를 검출력 80%로 잡는 필요 인원 8,158명에서 현재 2,000명을 뺀 값입니다. 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1입니다.</p>
