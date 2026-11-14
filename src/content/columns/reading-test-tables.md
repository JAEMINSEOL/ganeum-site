---
title: "통계 결과표 읽는 법"
description: "t검정과 카이제곱 결과표에서 먼저 볼 세 곳"
date: 2026-11-26T00:00:00+09:00
tags: ["t검정", "카이제곱", "결과표", "효과 크기"]
draft: false
---
<blockquote><p><strong>검정 결과표는 p값부터 읽는 표가 아닙니다. 무엇을 몇 명으로 비교했는지, 차이가 얼마인지를 먼저 읽고 p값은 마지막에 봐야 결과를 거꾸로 읽지 않습니다.</strong></p></blockquote>

## 들어가며

<p>논문 결과표에 t(115.5) = 1.79, p = 0.076이라고 적혀 있습니다. 다른 표에는 χ²(1) = 54.3, p &lt; 0.001이 있습니다. 괄호 안의 숫자는 무엇이고, 두 결과 중 어느 쪽이 더 큰 차이인지 표만 보고는 알기 어렵습니다.</p>
<p><strong>검정 결과표에서 무엇을 먼저 봐야 할까요?</strong></p>
<p>이 글은 가장 자주 쓰는 두 검정, t검정과 카이제곱 검정의 결과표를 공개 데이터로 직접 만들어 항목마다 뜻을 적습니다. 그다음 세 곳을 어떤 순서로 읽는지, 순서를 바꾸면 어떤 실수가 생기는지 정리하겠습니다. 검정을 고르는 법이나 계산 과정은 다루지 않습니다.</p>

## t검정 결과표 읽기

<p>t검정은 두 그룹의 평균을 비교합니다. 결과표에는 보통 그룹별 표본 수와 평균과 표준편차, t값, <a class="term" href="#term-df" data-tip="자유도(degrees of freedom): 검정통계량의 분포 모양을 정하는 값. Welch t검정은 분산 비율까지 반영해 소수가 나온다.">자유도</a>, p값이 있고, 좋은 표에는 평균 차이와 그 신뢰구간이 함께 있습니다. 그림 1은 각 항목이 무엇을 말하는지 정리한 것입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>항목</th><th>뜻</th><th>읽을 때 보는 것</th></tr></thead>
<tbody>
<tr><td>n</td><td>각 그룹의 표본 수</td><td>두 그룹이 크게 다르면 작은 쪽이 결과를 좌우함</td></tr>
<tr><td>M, SD</td><td>각 그룹의 평균과 표준편차</td><td>SD가 M보다 훨씬 크면 분포가 한쪽으로 쏠린 것. 평균이 대표값이 아닐 수 있음</td></tr>
<tr><td>평균 차이, 95% CI</td><td>두 평균의 차이와 그 신뢰구간</td><td>차이가 실질적으로 얼마인지. 구간이 0을 포함하는지</td></tr>
<tr><td>t</td><td><a class="term" href="#term-stat" data-tip="검정통계량(test statistic): 데이터가 귀무가설에서 얼마나 떨어져 있는지를 하나의 숫자로 요약한 값. 표본이 커지면 같은 차이에서도 커진다.">검정통계량</a>. 평균 차이를 그 표준오차로 나눈 값</td><td>표본이 크면 작은 차이도 t가 커짐. <a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a>가 아님</td></tr>
<tr><td>df</td><td><a class="term" href="#term-df" data-tip="자유도(degrees of freedom): 검정통계량의 분포 모양을 정하는 값. Welch t검정은 분산 비율까지 반영해 소수가 나온다.">자유도</a>. t분포의 모양을 정하는 값</td><td><a class="term" href="#term-welch" data-tip="Welch t검정(Welch's t-test): 두 그룹의 분산이 같다고 가정하지 않는 t검정. 자유도가 소수로 나온다.">Welch t검정</a>이면 소수가 나옴. 표본 수와 분산 비율에서 계산됨</td></tr>
<tr><td>p</td><td>차이가 0일 때 이만큼 또는 더 극단적인 t가 나올 확률</td><td>마지막에 유의수준과 함께 봄</td></tr>
<tr><td>d</td><td><a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a>. 평균 차이를 표준편차 단위로 나타낸 값</td><td>0.2 작음, 0.5 중간, 0.8 큼이 관례</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. t검정 결과표의 항목과 뜻. 표에 평균 차이와 신뢰구간이 없으면 M과 SD와 n으로 직접 구할 수 있습니다.</p>
<p>실제 표를 하나 읽어 보겠습니다. 영국 온라인 소매점의 2011년 거래에서 영국 고객 3,767명과 독일 고객 92명의 고객당 구매액을 비교했습니다. 두 그룹의 분산이 다르므로 <a class="term" href="#term-welch" data-tip="Welch t검정(Welch's t-test): 두 그룹의 분산이 같다고 가정하지 않는 t검정. 자유도가 소수로 나온다.">Welch t검정</a>을 썼습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>항목</th><th>값</th><th>읽기</th></tr></thead>
<tbody>
<tr><td>n</td><td>영국 3,767명, 독일 92명</td><td>독일이 40분의 1이라 독일 쪽 변동이 결과를 좌우함</td></tr>
<tr><td>M (SD)</td><td>영국 1,674 (6,368), 독일 2,228 (2,797) 파운드</td><td>영국은 SD가 M의 3.8배. 분포가 심하게 쏠려 있음(중앙값 620)</td></tr>
<tr><td>평균 차이</td><td>독일 − 영국 = +554 파운드</td><td>독일 고객이 평균 554파운드 더 삼</td></tr>
<tr><td>95% CI</td><td>[−59, +1,167] 파운드</td><td>0을 포함. 차이가 없을 수도, 1,167파운드일 수도 있는 데이터</td></tr>
<tr><td>t (df)</td><td>1.79 (115.5)</td><td><a class="term" href="#term-df" data-tip="자유도(degrees of freedom): 검정통계량의 분포 모양을 정하는 값. Welch t검정은 분산 비율까지 반영해 소수가 나온다.">자유도</a>가 3,857(두 표본 수의 합 − 2)이 아니라 115.5인 것은 Welch 보정</td></tr>
<tr><td>p</td><td>0.076</td><td>유의수준 5%에서 유의하지 않음. 차이가 없다는 뜻은 아님</td></tr>
<tr><td>Cohen's d</td><td>0.09</td><td>표준편차 단위로는 매우 작은 차이</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 2011년 영국 대 독일 고객당 구매액의 <a class="term" href="#term-welch" data-tip="Welch t검정(Welch's t-test): 두 그룹의 분산이 같다고 가정하지 않는 t검정. 자유도가 소수로 나온다.">Welch t검정</a> 결과. 데이터는 UCI Online Retail II입니다.</p>
<details class="code"><summary>검증 코드 보기</summary>

```python
import numpy as np, pandas as pd
from scipy import stats

d = pd.read_csv("retail_customers.csv", parse_dates=["date"])
y = d[(d.date >= "2011-01-01") & (d.date <= "2011-11-30")]
per = y.groupby(["Country", "Customer_ID"]).amount.sum().reset_index()
uk = per[per.Country == "United Kingdom"].amount.to_numpy()
de = per[per.Country == "Germany"].amount.to_numpy()
t = stats.ttest_ind(de, uk, equal_var=False)          # Welch t검정
ci = t.confidence_interval(0.95)
print(f"독일 − 영국 = {de.mean()-uk.mean():,.0f}, 95% CI [{ci.low:,.0f}, {ci.high:,.0f}]")
print(f"t = {t.statistic:.2f}, df = {t.df:.1f}, p = {t.pvalue:.3f}")
# 독일 − 영국 = 554, 95% CI [-59, 1,167]
# t = 1.79, df = 115.5, p = 0.076
```

</details>
<p>이 표를 p값부터 읽으면 0.076이니 차이가 없다는 결론이 나옵니다. 신뢰구간부터 읽으면 다른 그림이 보입니다. 차이는 −59파운드에서 +1,167파운드 사이 어디든 데이터와 양립하고, 독일 표본이 92명뿐이라 구간이 넓은 것입니다. 유의하지 않다는 결과는 차이가 없다는 증거가 아니라 표본이 차이를 가릴 만큼 크지 않았다는 뜻에 가깝습니다.</p>
<p>표준편차도 봐야 합니다. 영국의 SD 6,368은 평균 1,674의 3.8배입니다. 소수의 고객이 평균을 끌어올린 분포라서, 평균 비교 자체가 이 데이터에 맞는 질문인지 먼저 물어야 합니다. 중앙값은 영국 620, 독일 1,041파운드로 평균보다 차이가 뚜렷합니다.</p>
<blockquote><p><strong>t검정 결과표는 표본 수와 표준편차, 평균 차이의 신뢰구간, p값 순서로 읽습니다. p = 0.076은 차이가 없다는 뜻이 아니라 −59에서 +1,167파운드가 모두 데이터와 양립한다는 뜻입니다.</strong></p></blockquote>

## 카이제곱 결과표 읽기

<p>카이제곱 검정은 두 범주형 변수가 서로 관련이 있는지를 봅니다. 결과표의 바탕은 <a class="term" href="#term-contingency" data-tip="분할표(contingency table): 두 범주형 변수의 조합마다 빈도를 센 표.">분할표</a>입니다. 그림 3은 광고를 본 그룹과 공익광고를 본 그룹의 구매 전환 여부를 2×2로 센 것입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>그룹</th><th>전환 안 함</th><th>전환</th><th>합계</th><th>전환율</th></tr></thead>
<tbody>
<tr><td>광고 (ad)</td><td>550,154</td><td>14,423</td><td>564,577</td><td>2.55%</td></tr>
<tr><td>공익광고 (psa)</td><td>23,104</td><td>420</td><td>23,524</td><td>1.79%</td></tr>
<tr><td>합계</td><td>573,258</td><td>14,843</td><td>588,101</td><td>2.52%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. Kaggle Marketing A/B Testing 데이터의 2×2 <a class="term" href="#term-contingency" data-tip="분할표(contingency table): 두 범주형 변수의 조합마다 빈도를 센 표.">분할표</a>. 카이제곱 검정은 이 표의 칸마다 관측 빈도와 <a class="term" href="#term-expected" data-tip="기대 빈도(expected count): 두 변수가 관련 없다고 가정했을 때 각 칸에 들어갈 빈도. 행 합계 × 열 합계 / 전체.">기대 빈도</a>를 비교합니다.</p>
<p>검정은 두 그룹의 전환율이 같다고 가정했을 때 각 칸에 들어갈 <a class="term" href="#term-expected" data-tip="기대 빈도(expected count): 두 변수가 관련 없다고 가정했을 때 각 칸에 들어갈 빈도. 행 합계 × 열 합계 / 전체.">기대 빈도</a>를 구하고, 관측 빈도와의 차이를 더합니다. 공익광고 그룹의 전환 칸은 <a class="term" href="#term-expected" data-tip="기대 빈도(expected count): 두 변수가 관련 없다고 가정했을 때 각 칸에 들어갈 빈도. 행 합계 × 열 합계 / 전체.">기대 빈도</a> 593.7명인데 관측은 420명입니다. 그림 4가 결과표입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>항목</th><th>값</th><th>읽기</th></tr></thead>
<tbody>
<tr><td>n</td><td>588,101명 (ad 564,577, psa 23,524)</td><td>두 그룹이 24배 차이. 작은 psa 쪽이 구간 폭을 정함</td></tr>
<tr><td>전환율</td><td>ad 2.55%, psa 1.79%</td><td>비교하려는 값 그 자체</td></tr>
<tr><td>차이, 95% CI</td><td>+0.77%p [+0.60, +0.94]%p</td><td>0을 포함하지 않음. 상대로는 1.43배</td></tr>
<tr><td>χ² (df)</td><td>54.3 (1)</td><td>2×2 표의 <a class="term" href="#term-df" data-tip="자유도(degrees of freedom): 검정통계량의 분포 모양을 정하는 값. Welch t검정은 분산 비율까지 반영해 소수가 나온다.">자유도</a>는 (행 − 1) × (열 − 1) = 1</td></tr>
<tr><td>p</td><td>1.7 × 10⁻¹³</td><td>두 전환율이 같다는 가설은 이 데이터와 맞지 않음</td></tr>
<tr><td>φ</td><td>0.0096</td><td><a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a>. 관련의 세기는 매우 약함</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 그림 3 <a class="term" href="#term-contingency" data-tip="분할표(contingency table): 두 범주형 변수의 조합마다 빈도를 센 표.">분할표</a>의 카이제곱 검정 결과. 연속성 보정 없이 계산했습니다.</p>
<details class="code"><summary>검증 코드 보기</summary>

```python
import pandas as pd
from scipy import stats

m = pd.read_csv("marketing_AB.csv")
tab = pd.crosstab(m["test group"], m["converted"])
chi2, p, dof, expected = stats.chi2_contingency(tab, correction=False)
print(f"카이제곱 = {chi2:.1f}, df = {dof}, p = {p:.2e}")
print(f"효과 크기 φ = {(chi2 / len(m)) ** 0.5:.4f}")
# 카이제곱 = 54.3, df = 1, p = 1.71e-13
# 효과 크기 φ = 0.0096
```

</details>
<p>이 표는 앞의 t검정 표와 반대 방향의 주의가 필요합니다. p값은 10⁻¹³으로 매우 작지만, <a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a> φ는 0.0096으로 관련의 세기가 매우 약합니다. 58만 명이면 0.77%p 차이도 p값이 극단적으로 작아지기 때문입니다. p값이 작다는 것은 차이가 0이 아니라는 뜻이지 차이가 크다는 뜻이 아닙니다.</p>
<p>차이가 실질적으로 얼마인지는 전환율 차이 +0.77%p와 그 신뢰구간이 말해 줍니다. 광고 그룹의 전환율은 공익광고 그룹보다 0.60%p에서 0.94%p 높습니다. 이 숫자가 의미 있는 크기인지는 통계가 아니라 전환 한 건의 가치가 정합니다.</p>
<blockquote><p><strong>카이제곱 결과표는 <a class="term" href="#term-contingency" data-tip="분할표(contingency table): 두 범주형 변수의 조합마다 빈도를 센 표.">분할표</a>의 비율 차이와 신뢰구간을 먼저 읽습니다. p = 10⁻¹³은 차이가 0이 아니라는 뜻이고, 차이의 크기 0.77%p는 신뢰구간이 말해 줍니다.</strong></p></blockquote>

## 세 곳을 읽는 순서

<p>두 표를 읽은 순서는 같았습니다. 첫째, 무엇을 몇 명으로 비교했는지 봅니다. 표본 수, 각 그룹의 요약값, 표준편차나 <a class="term" href="#term-contingency" data-tip="분할표(contingency table): 두 범주형 변수의 조합마다 빈도를 센 표.">분할표</a>가 여기 해당합니다. 이 단계에서 평균 비교가 맞는 데이터인지, 한 그룹이 너무 작지 않은지가 보입니다.</p>
<p>둘째, 차이가 얼마인지 봅니다. 평균 차이나 비율 차이와 그 신뢰구간, <a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a>입니다. 결론 문장에 들어갈 숫자는 여기서 나옵니다.</p>
<p>셋째, p값을 유의수준과 함께 봅니다. p값은 차이가 0이라는 가설과 데이터가 얼마나 맞지 않는지를 말할 뿐이고, 차이의 크기나 중요성은 말하지 않습니다. 그림 5는 순서를 바꿨을 때 생기는 실수입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>틀린 읽기</th><th>어디서 생기나</th><th>고친 읽기</th></tr></thead>
<tbody>
<tr><td>p &lt; 0.05이니 효과가 크다</td><td>p값을 먼저 보고 끝냄. 그림 4의 10⁻¹³</td><td><a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a> φ 0.0096, 차이 0.77%p를 함께 적는다</td></tr>
<tr><td>p = 0.076이니 차이가 없다</td><td>유의하지 않음을 무효과로 읽음. 그림 2</td><td>신뢰구간 [−59, +1,167]이 0을 포함하므로 판정 불가</td></tr>
<tr><td>t = 1.79보다 χ² = 54.3이 더 큰 효과다</td><td><a class="term" href="#term-stat" data-tip="검정통계량(test statistic): 데이터가 귀무가설에서 얼마나 떨어져 있는지를 하나의 숫자로 요약한 값. 표본이 커지면 같은 차이에서도 커진다.">검정통계량</a>을 <a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a>로 읽음</td><td>통계량은 표본 수에 따라 커진다. d와 φ로 비교한다</td></tr>
<tr><td>df가 115.5인 것은 계산 오류다</td><td>Welch 보정을 모름</td><td>분산이 다른 두 그룹의 <a class="term" href="#term-df" data-tip="자유도(degrees of freedom): 검정통계량의 분포 모양을 정하는 값. Welch t검정은 분산 비율까지 반영해 소수가 나온다.">자유도</a>는 소수가 나온다</td></tr>
<tr><td>평균이 2,228 대 1,674이니 독일이 33% 더 산다</td><td>SD와 n을 안 봄. 그림 2</td><td>영국 SD가 평균의 3.8배. 중앙값 비교와 신뢰구간을 함께 본다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 읽는 순서를 바꿨을 때 생기는 실수 다섯 가지. 왼쪽 열은 모두 이 글의 두 표에서 실제로 나올 수 있는 문장입니다.</p>
<p>결론 문장은 둘째 단계의 숫자로 씁니다. 독일 고객의 평균 구매액은 영국보다 554파운드 높았으나 신뢰구간이 0을 포함한다, 광고 그룹의 전환율은 공익광고 그룹보다 0.77%p 높고 구간은 0.60%p에서 0.94%p다, 이런 문장입니다. 신뢰구간으로 결론을 쓰는 방법은 <a href="https://data-ganeum.com/columns/confidence-interval-verdict/">4편</a>에, 구간의 뜻은 <a href="https://data-ganeum.com/columns/ci-meaning/">16편</a>에 있습니다.</p>
<blockquote><p><strong>결과표는 비교 대상과 표본 수, 차이의 크기와 신뢰구간, p값의 순서로 읽습니다. 결론 문장에 들어갈 숫자는 둘째 단계에 있고, p값은 그 숫자가 0과 구분되는지만 말합니다.</strong></p></blockquote>

## 나가며

<ol>
<li>결과표는 p값이 아니라 표본 수와 요약값부터 읽습니다. 영국 고객의 표준편차는 평균의 3.8배이고 독일 표본은 92명이라, 평균 비교의 결과를 그대로 믿기 어렵습니다.</li>
<li>차이의 크기는 평균 차이나 비율 차이와 신뢰구간, <a class="term" href="#term-effect" data-tip="효과 크기(effect size): 차이의 크기를 표본 수와 무관한 단위로 나타낸 값. Cohen's d, φ 등.">효과 크기</a>가 말합니다. χ² = 54.3, p = 10⁻¹³이어도 φ = 0.0096이고 차이는 0.77%p입니다.</li>
<li>p값은 마지막에 유의수준과 함께 봅니다. p = 0.076은 차이가 없다는 뜻이 아니고, p = 10⁻¹³은 차이가 크다는 뜻이 아닙니다.</li>
</ol>

## 용어

<ul>
<li id="term-stat"><strong>검정통계량(test statistic)</strong>: 데이터가 귀무가설에서 얼마나 떨어져 있는지를 하나의 숫자로 요약한 값입니다. t값과 χ²값이 여기 해당하고, 표본이 커지면 같은 차이에서도 커집니다.</li>
<li id="term-df"><strong>자유도(degrees of freedom)</strong>: 검정통계량의 분포 모양을 정하는 값입니다. t검정은 표본 수에서, 카이제곱은 표의 행과 열 수에서 나오고, Welch t검정은 두 그룹의 분산 비율까지 반영해 소수가 나옵니다.</li>
<li id="term-effect"><strong>효과 크기(effect size)</strong>: 차이의 크기를 표본 수와 무관한 단위로 나타낸 값입니다. 평균 비교는 Cohen's d(표준편차 단위), 2×2 분할표는 φ(0에서 1)를 씁니다.</li>
<li id="term-contingency"><strong>분할표(contingency table)</strong>: 두 범주형 변수의 조합마다 빈도를 센 표입니다. 카이제곱 검정은 이 표의 관측 빈도와 기대 빈도를 비교합니다.</li>
<li id="term-expected"><strong>기대 빈도(expected count)</strong>: 두 변수가 관련 없다고 가정했을 때 분할표의 각 칸에 들어갈 빈도입니다. 행 합계와 열 합계의 곱을 전체 수로 나눠 구합니다.</li>
<li id="term-welch"><strong>Welch t검정(Welch's t-test)</strong>: 두 그룹의 분산이 같다고 가정하지 않는 t검정입니다. 분산과 표본 수가 다른 그룹을 비교할 때 기본으로 쓰며, 자유도가 소수로 나옵니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Welch, B. L. (1947). The generalization of 'Student's' problem when several different population variances are involved. <em>Biometrika</em>, 34(1/2), 28-35.</li>
<li id="ref-2">Cohen, J. (1988). <em>Statistical Power Analysis for the Behavioral Sciences</em> (2nd ed.). Lawrence Erlbaum Associates.</li>
<li id="ref-3">Chen, D. (2012). <em>Online Retail II</em> [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5CG6D</li>
<li id="ref-4">Vaz, F. Marketing A/B Testing [Dataset]. Kaggle. https://www.kaggle.com/datasets/faviovaz/marketing-ab-testing (CC0)</li>
</ol>
<p class="refs">그림 2의 데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)이며, 고객 ID가 있고 수량과 단가가 양수인 거래에서 2011년 1월 1일부터 11월 30일까지 국가별 고객당 구매액 합을 썼습니다. 단위는 파운드입니다. t검정은 scipy의 ttest_ind(equal_var=False), 양측, 유의수준 5%이고, Cohen's d는 합동 표준편차로 계산했습니다. 그림 3과 4의 데이터는 Kaggle의 Marketing A/B Testing(faviovaz, CC0, 588,101행)이며, 카이제곱은 chi2_contingency(correction=False), φ는 χ²를 전체 수로 나눈 값의 제곱근입니다. 비율 차이의 신뢰구간은 정규 근사입니다. 코드 실행 환경은 Python 3.12, scipy 1.18.1, pandas 3.1.1, numpy 2.5.4입니다.</p>
