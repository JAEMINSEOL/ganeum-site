---
title: "대조군 하나를 여러 실험이 나눠 써도 될까?"
description: "공유 대조군과 실험군 간 비교"
date: 2026-10-22T07:30:00+09:00
tags: ["공유 대조군", "다중 실험", "실험 설계"]
draft: false
---
<blockquote><p><strong><span class="term" data-tip="아무것도 바꾸지 않은 기준 그룹. 실험군의 변화를 이 그룹과 비교해 잰다." tabindex="0">대조군</span> 하나를 실험 11개가 나눠 쓰면 트래픽은 아끼지만, 11개의 결과가 서로 묶입니다. 대조군이 우연히 낮게 나온 날에는 11개가 한꺼번에 이긴 것처럼 보이고, 그 결과는 서로 독립이 아닙니다.</strong></p></blockquote>

## 들어가며

<p>빌드 하나에 실험 11개를 같이 실었습니다. 각 실험은 한 가지 변경만 담고 있고, 비교 대상은 아무것도 바꾸지 않은 대조군 하나입니다. 대조군을 11개 두면 트래픽이 모자라기 때문입니다.</p>
<p>2주 뒤 보고서가 올라옵니다. 11개 중 6개가 대조군보다 <span class="term" data-tip="통계적으로 유의하다: 차이가 없다고 가정했을 때 이만큼 극단적인 결과가 나올 확률(p값)이 미리 정한 기준(보통 0.05)보다 작다는 뜻." tabindex="0">유의</span>하게 좋았습니다.</p>
<p><strong>유의한 여섯 개를 다 채택해도 될까요?</strong></p>
<p>이번 글에서는 대조군을 나눠 쓸 때 결과가 어떻게 묶이는지 세어 봅니다. 그리고 묶인 결과를 풀어 읽는 방법인 <span class="term" data-tip="변경을 적용한 그룹. 대조군과 비교해 효과를 잰다." tabindex="0">실험군</span> 간 비교와 대조군 크기 배분까지 정리하겠습니다.</p>

## 공유 대조군은 결과를 묶습니다

<p>실험군 11개가 전부 효과 0인 상황을 1만 번 시뮬레이션했습니다. 그룹당 1만 명, 전환율 5%입니다. 한 번은 대조군 하나를 11개가 나눠 쓰고, 다른 한 번은 실험군마다 독립 대조군을 둡니다.</p>

```python
import numpy as np
from scipy.stats import norm

K, N, P, T = 11, 10_000, 0.05, 10_000            # 실험군 11개, 그룹당 1만 명, 전환율 5%, 실험 1만 회
rng = np.random.default_rng(seed=2026)

def p_values(ctrl, arms, n_c, n_a):               # 각 실험군을 대조군과 비교한 양측 p값
    pc, pa = ctrl / n_c, arms / n_a
    pooled = (ctrl[:, None] + arms) / (n_c + n_a)
    se = np.sqrt(pooled * (1 - pooled) * (1 / n_c + 1 / n_a))
    return 2 * norm.sf(np.abs((pa - pc[:, None]) / se))

arms = rng.binomial(N, P, size=(T, K))             # 실험군 11개, 전부 효과 0
shared = rng.binomial(N, P, size=T)                # 공유 대조군 1개
p_shared = p_values(shared, arms, N, N)

indep = rng.binomial(N, P, size=(T, K))            # 실험군마다 독립 대조군
pooled = (indep + arms) / (2 * N)
p_indep = 2 * norm.sf(np.abs((arms / N - indep / N) / np.sqrt(pooled * (1 - pooled) * 2 / N)))

for name, p in (("공유 대조군", p_shared), ("독립 대조군", p_indep)):
    cnt = (p < 0.05).sum(axis=1)
    print(f"{name}: 하나라도 유의 {(cnt >= 1).mean()*100:.1f}%, 3개 이상 동시 유의 {(cnt >= 3).mean()*100:.1f}%")
# 공유 대조군: 하나라도 유의 29.6%, 3개 이상 동시 유의 5.8%
# 독립 대조군: 하나라도 유의 43.4%, 3개 이상 동시 유의 1.6%
```

<div class="table-scroll">
<table>
<thead><tr><th>효과 0인 실험군 11개, 실험 1만 회</th><th>공유 대조군</th><th>독립 대조군</th></tr></thead>
<tbody>
<tr><td>하나라도 유의한 실험</td><td>29.6%</td><td>43.4%</td></tr>
<tr><td>3개 이상 동시에 유의</td><td>5.8%</td><td>1.6%</td></tr>
<tr><td>5개 이상 동시에 유의</td><td>1.5%</td><td>0.0%</td></tr>
<tr><td>11개 전부 같은 방향</td><td>15.6%</td><td>0.1%</td></tr>
<tr><td>실험군 두 개의 <span class="term" data-tip="두 그룹의 차이를 그 차이의 표준오차로 나눈 값. 0에서 멀수록 우연으로 보기 어렵다." tabindex="0">z값</span> <span class="term" data-tip="두 값이 함께 움직이는 정도. 0이면 따로 움직이고, 1에 가까울수록 같이 오르내린다." tabindex="0">상관</span></td><td>0.49</td><td>0.00</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 대조군을 나눠 쓸 때와 따로 둘 때의 차이. 설명을 위해 만든 가상 실험입니다.</p>
<p>첫 줄만 보면 공유 대조군이 더 안전해 보입니다. 하나라도 유의한 실험이 29.6%로 독립 대조군의 43.4%보다 적습니다. 그런데 나머지 줄은 반대입니다. 3개 이상이 동시에 유의한 실험은 공유 쪽이 3.6배 많고, 11개가 전부 같은 방향으로 움직인 실험은 15.6%로 독립 쪽의 150배입니다.</p>
<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="유의한 실험군 개수의 분포. 공유 대조군은 0개와 3개 이상이 많고 독립 대조군은 1개가 많다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor" text-anchor="middle">
<line x1="60" y1="172" x2="580" y2="172" stroke="currentColor" stroke-width="1.5"/>
<rect x="110" y="51" width="40" height="121" fill="currentColor"/>
<rect x="156" y="75" width="40" height="97" fill="none" stroke="currentColor"/>
<text x="130" y="45">70%</text><text x="176" y="69">57%</text><text x="153" y="190">0개</text>
<rect x="230" y="142" width="40" height="30" fill="currentColor"/>
<rect x="276" y="115" width="40" height="57" fill="none" stroke="currentColor"/>
<text x="250" y="136">18%</text><text x="296" y="109">33%</text><text x="273" y="190">1개</text>
<rect x="350" y="162" width="40" height="10" fill="currentColor"/>
<rect x="396" y="157" width="40" height="15" fill="none" stroke="currentColor"/>
<text x="370" y="156">6%</text><text x="416" y="151">9%</text><text x="393" y="190">2개</text>
<rect x="470" y="162" width="40" height="10" fill="currentColor"/>
<rect x="516" y="169" width="40" height="3" fill="none" stroke="currentColor"/>
<text x="490" y="156">6%</text><text x="536" y="163">2%</text><text x="513" y="190">3개 이상</text>
<rect x="452" y="30" width="12" height="10" fill="currentColor"/><text x="470" y="39" text-anchor="start">공유 대조군</text>
<rect x="452" y="48" width="12" height="10" fill="none" stroke="currentColor"/><text x="470" y="57" text-anchor="start">독립 대조군</text>
<text x="320" y="210">한 실험에서 대조군보다 유의하게 좋거나 나쁘게 나온 실험군의 수</text>
</g>
</svg>
<figcaption>그림 2. 유의한 실험군 개수의 분포. 공유 대조군은 0개 아니면 여러 개로 갈리고, 독립 대조군은 1개가 대부분입니다. 설명을 위해 만든 가상 실험입니다.</figcaption>
</figure>
<p>이유는 대조군이 하나이기 때문입니다. 각 실험군의 결과는 실험군 자신의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>과 대조군의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>을 합친 값인데, 대조군 쪽 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>이 11개 실험군에 똑같이 들어갑니다. 그래서 실험군 두 개의 결과 사이에 상관 0.49가 생깁니다. 독립 대조군이면 0입니다.</p>
<blockquote><p><strong>공유 대조군에서는 실험군 11개의 결과가 독립된 증거 11개가 아니라, 대조군 하나의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>을 공유하는 증거 11개입니다.</strong></p></blockquote>

## 대조군이 우연히 낮으면 전부 이긴 것처럼 보입니다

<p>묶임이 실제로 문제가 되는 순간은 대조군이 우연히 한쪽으로 치우친 날입니다. 1만 번 가운데 대조군 전환율이 하위 2.5%에 든 실험 213건만 따로 보면, 효과가 하나도 없는데도 평균 3.6개 실험군이 대조군보다 유의하게 좋았고, 5%의 실험에서는 11개 중 8개 이상이 유의했습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>대조군 상태</th><th>실험 수</th><th>유의한 실험군 평균</th><th>8개 이상 유의</th></tr></thead>
<tbody>
<tr><td>전체</td><td>10,000건</td><td>0.6개</td><td>0.2%</td></tr>
<tr><td>대조군이 하위 2.5%로 낮게 나온 경우</td><td>213건</td><td>3.6개</td><td>5%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 효과 0인 실험군 11개에서 대조군이 우연히 낮게 나왔을 때. 설명을 위해 만든 가상 실험입니다.</p>
<p>서두에서 예시로 든 보고서가 이런 경우일 수 있습니다. 11개 중 6개 승리는 6개가 각각 좋아서가 아니라 대조군 하나가 그 기간에 낮게 나와서 생긴 결과일 수 있습니다. 대조군 대비 수치만으로는 둘을 구분할 수 없습니다.</p>
<blockquote><p><strong>여러 실험군이 한꺼번에 이겼다는 보고는 실험군들이 좋아서가 아닌, 대조군이 낮았다는 뜻일 수 있습니다.</strong></p></blockquote>

## 다른 실험군과 비교해 가려냅니다

<p>대조군 하나의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>을 걷어내는 가장 간단한 방법은 같은 대조군을 쓴 다른 실험군들과 비교하는 것입니다. 대조군이 낮아서 전부 이긴 것처럼 보이는 상황이라면 실험군끼리는 차이가 없습니다.</p>
<blockquote><p><strong>진짜 효과가 있는 실험군이라면 나머지 실험군의 평균보다도 높아야 합니다.</strong></p></blockquote>
<p>진짜 효과 +10%인 실험군 하나와 효과 0인 실험군 10개를 섞어 1만 번 돌리고, 두 가지 조건을 걸어 봤습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>조건</th><th>진짜 효과 실험군이 통과</th><th>효과 0 실험군이 통과 (실험군당)</th></tr></thead>
<tbody>
<tr><td>대조군 대비 유의</td><td>34.6%</td><td>2.3%</td></tr>
<tr><td>나머지 실험군 평균 대비 유의</td><td>58.2%</td><td>1.5%</td></tr>
<tr><td>두 조건 모두</td><td>29.9%</td><td>0.5%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 실험군 간 비교를 추가 조건으로 걸었을 때. 그룹당 1만 명, 기저 전환율 5%, 효과 +10%는 <span class="term" data-tip="진짜 효과가 있을 때 실험이 그 효과를 유의하게 잡아낼 확률." tabindex="0">검출력</span> 80% 설계에 못 미치는 인원입니다. 설명을 위해 만든 가상 실험입니다.</p>
<p>두 조건을 모두 요구하면 효과 0인 실험군이 가짜로 통과하는 비율은 2.3%에서 0.5%로 4.6배 줄어듭니다. 진짜 효과 실험군의 통과율은 34.6%에서 29.9%로 조금 줄어듭니다. 가짜 승리를 줄이는 비용으로 진짜 승리를 일부 잃는 교환이고, 실험 11개를 동시에 돌리는 상황에서는 남는 교환입니다.</p>
<p>실험군 간 비교에는 전제가 하나 있습니다. 다른 실험군 대부분이 효과 없다는 가정입니다. 11개가 전부 진짜로 좋은 변경이라면 실험군 평균이 같이 올라가서 진짜 효과를 가립니다. 그래서 실험군 간 비교는 대조군 대비를 대체하는 것이 아니라 뒤에 붙이는 두 번째 관문입니다.</p>
<blockquote><p><strong>공유 대조군 실험의 채택 조건은 대조군보다 좋고, 다른 실험군보다도 좋을 때입니다.</strong></p></blockquote>

## 대조군은 더 크게 잡습니다

<p>대조군이 11번 비교에 쓰이는데 크기는 실험군 하나와 같다면, 대조군의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>이 11개 비교 전부에 같은 크기로 들어갑니다. 대조군을 키우면 그 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>이 줄어들고, 같은 총 인원으로 검출력이 올라갑니다. 실험군이 k개일 때 대조군을 실험군의 √k배로 두는 것이 알려진 배분입니다<sup class="fn"><a href="#ref-1" title="Dunnett (1955). A multiple comparison procedure for comparing several treatments with a control. JASA, 50(272), 1096–1121.">[1]</a></sup>.</p>
<div class="table-scroll">
<table>
<thead><tr><th>배분 (총 120,000명, 실험군 11개)</th><th>대조군</th><th>실험군당</th><th>+10% 효과의 검출력</th></tr></thead>
<tbody>
<tr><td>12등분</td><td>10,000명</td><td>10,000명</td><td>35.4%</td></tr>
<tr><td>대조군을 실험군의 2배로</td><td>18,462명</td><td>9,231명</td><td>41.5%</td></tr>
<tr><td>대조군을 실험군의 √11 ≈ 3.3배로</td><td>27,799명</td><td>8,382명</td><td>42.8%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 같은 총 인원에서 대조군 크기만 바꿨을 때. 기저 전환율 5%, <span class="term" data-tip="유의수준. 차이가 없는데 있다고 잘못 판정할 확률의 상한. 양측은 좋아진 쪽과 나빠진 쪽을 모두 센다는 뜻." tabindex="0">양측 α</span> = 0.05 기준입니다.</p>
<p>총 인원은 그대로인데 대조군을 키우는 것만으로 검출력이 35.4%에서 42.8%로 올라갑니다. 실험군당 인원은 줄어드는데도 그렇습니다. 대조군의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>이 모든 비교에 공통으로 들어가기 때문에, 그 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>을 줄이는 투자가 실험군 하나를 키우는 투자보다 효율이 높습니다.</p>
<blockquote><p><strong>공유 대조군은 비교에 쓰이는 횟수만큼 크게 잡아야 하고, 기준은 실험군 크기의 √k배입니다.</strong></p></blockquote>

## 판정 규칙

<div class="table-scroll">
<table>
<thead><tr><th>단계</th><th>할 일</th><th>이유</th></tr></thead>
<tbody>
<tr><td>설계</td><td>대조군을 실험군의 √k배로 배분한다</td><td>공통 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>을 줄인다</td></tr>
<tr><td>설계</td><td>실험군마다 주요 지표 하나를 미리 적는다</td><td>11개 실험군 × 지표 여러 개는 <span class="term" data-tip="검정을 여러 번 하면 그중 하나가 우연히 유의하게 나올 확률이 커지는 문제." tabindex="0">다중 비교</span>가 된다</td></tr>
<tr><td>판정</td><td>대조군 대비 유의한 실험군을 고른다</td><td>첫 번째 관문</td></tr>
<tr><td>판정</td><td>그 실험군을 나머지 실험군의 평균과 비교한다</td><td>대조군 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림. 영어로 fluctuation, sampling variation.">변동</a>을 걷어내는 두 번째 관문</td></tr>
<tr><td>판정</td><td>유의한 실험군이 절반을 넘으면 대조군부터 의심한다</td><td>효과 0에서도 대조군이 낮으면 평균 3.6개가 유의하다</td></tr>
<tr><td>보고</td><td>승리한 실험군 수가 아니라 대조군 수치와 실험군 간 차이를 같이 적는다</td><td>읽는 사람이 묶임을 볼 수 있어야 한다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 6. 공유 대조군 실험의 설계와 판정 절차.</p>
<p>다섯 번째 줄이 실무에서 가장 자주 빠집니다. 11개 중 6개가 이겼다는 보고가 오면 6개를 축하하기 전에 대조군의 전환율이 평소 수준인지부터 봅니다. 대조군이 최근 4주 평균보다 눈에 띄게 낮다면, 그 6개는 실험군의 성과가 아니라 대조군이 낮게 나온 결과일 가능성이 큽니다<sup class="fn"><a href="#ref-2" title="Kohavi, Tang & Xu (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[2]</a></sup>.</p>
<blockquote><p><strong>공유 대조군 보고서는 실험군이 몇 개 이겼는지가 아니라, 대조군이 어디에 있었고 실험군들이 서로 얼마나 다른지로 읽습니다.</strong></p></blockquote>

## 나가며

<ol>
<li>대조군 하나를 11개 실험군이 나눠 쓰면 결과 사이에 상관 0.49가 생깁니다. 효과가 하나도 없어도 11개가 전부 같은 방향인 실험이 15.6%이고, 독립 대조군이면 0.1%입니다.</li>
<li>대조군이 우연히 낮게 나온 날에는 효과 0인 실험군이 평균 3.6개 유의하게 이깁니다. 나머지 실험군의 평균과도 비교하는 조건을 추가하면 가짜 통과율이 2.3%에서 0.5%로 줄어듭니다.</li>
<li>같은 총 인원에서 대조군을 실험군의 √k배로 키우면 검출력이 35.4%에서 42.8%로 오릅니다. 공유 대조군은 비교 횟수만큼 커야 합니다.</li>
</ol>

## 용어

<ul>
<li id="term-fluctuation"><strong>변동</strong>(표집 변동, fluctuation): 같은 조건에서 실험을 반복해도 표본마다 우연히 달라지는 값의 흔들림입니다. 통계에서는 표집 변동(sampling variation)이라고 부릅니다. 전환율 5%인 집단에서 1만 명을 뽑아도 매번 5%가 나오지 않고 4.6%에서 5.4% 사이에서 움직이는데, 그 움직임이 변동입니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Dunnett, C. W. (1955). A multiple comparison procedure for comparing several treatments with a control. <em>Journal of the American Statistical Association</em>, 50(272), 1096–1121. https://doi.org/10.1080/01621459.1955.10501294</li>
<li id="ref-2">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
</ol>
<p class="refs">본문의 모든 수치는 설명을 위해 만든 가상 실험을 직접 시뮬레이션한 값입니다. 검정은 두 비율 z검정(양측, α = 0.05)이고, 실험 1만 회, 시드 2026 기준입니다. 실험군 간 비교는 해당 실험군을 나머지 10개 실험군을 합친 집단과 두 비율 z검정으로 비교했습니다. 검출력은 정규 근사로 계산했습니다. 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1입니다.</p>
