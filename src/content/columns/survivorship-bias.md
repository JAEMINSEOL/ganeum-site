---
title: "살아남은 유저만 보고 있습니다"
description: "생존자 편향과 선택 편향"
date: 2026-11-03T05:00:00+09:00
tags: ["생존자 편향", "선택 편향", "코호트"]
draft: false
---
<blockquote><p><strong>오래 남은 유저만 모아 공통점을 찾으면 그 공통점은 살아남은 이유가 아니라 살아남은 결과일 때가 많습니다. 분모에서 사라진 사람을 다시 넣어야 원인이 보입니다.</strong></p></blockquote>

## 들어가며

<p>1년 넘게 쓰는 유저들을 모아 봤더니 첫 주문이 컸습니다. 그래서 첫 주문을 키우는 쿠폰을 만들자는 제안이 올라옵니다. 비슷한 보고서는 매달 나옵니다. 오래 남은 유저는 첫 주에 친구를 초대했더라, 튜토리얼을 끝까지 봤더라, 알림을 켰더라.</p>
<p><strong>살아남은 유저의 공통점이 살아남은 이유일까요?</strong></p>
<p>이번 글에서는 공개 거래 데이터로 이 질문을 셋으로 나눠 봅니다. 살아남은 사람만 보면 <a class="term" href="#term-conditional" data-tip="조건부 확률(conditional probability): 어떤 조건이 성립할 때의 확률. P(A|B)와 P(B|A)는 다른 값이다.">조건부 확률</a>의 방향이 뒤집히는 문제, 활성 유저 평균이 아무도 변하지 않아도 저절로 오르는 문제, 그리고 데이터의 시작점 자체가 사람을 고르는 문제입니다.</p>

## 살아남은 사람만 보면 방향이 뒤집힙니다

<p>UCI에 CC BY 4.0으로 공개된 영국 온라인 소매점 데이터에서 2010년 1월부터 3월 사이에 첫 구매를 한 고객 1,200명을 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>로 잡겠습니다. 12개월 뒤에도 구매한 고객을 살아남은 고객으로 보면 746명, 62.2%입니다. 이들의 첫 주문액 중앙값은 328이고, 떠난 고객은 250입니다. 여기까지는 서두의 보고서와 같습니다.</p>

<details class="code"><summary>검증 코드 보기</summary>

```python
import pandas as pd

d = pd.read_csv("data/uci/retail_customers.csv", parse_dates=["date"])
d["m"] = d.date.dt.year * 12 + d.date.dt.month - 1
first = d.groupby("Customer_ID").agg(first_m=("m", "min"), first_date=("date", "min"))
d = d.merge(first, on="Customer_ID"); d["k"] = d.m - d.first_m                   # 첫 구매 후 몇 개월째

cohort = first[(first.first_m >= 2010 * 12) & (first.first_m <= 2010 * 12 + 2)].index   # 2010년 1~3월 첫 구매
c = d[d.Customer_ID.isin(cohort)]
first_amt = c[c.date.dt.normalize() == c.first_date.dt.normalize()].groupby("Customer_ID").amount.sum()   # 첫 주문액
survived = first_amt.index.isin(c[c.k >= 12].Customer_ID.unique())          # 12개월 이후에도 구매했으면 생존
big = first_amt >= 500                                                       # 첫 주문 500 이상

print(f"생존 비율 {survived.mean()*100:.1f}%")
print(f"P(첫 주문 500 이상 | 생존)   = {big[survived].mean()*100:.1f}%   P(첫 주문 500 이상 | 탈락) = {big[~survived].mean()*100:.1f}%")
print(f"P(생존 | 첫 주문 500 이상)   = {survived[big].mean()*100:.1f}%   P(생존 | 첫 주문 500 미만) = {survived[~big].mean()*100:.1f}%")
# 생존 비율 62.2%
# P(첫 주문 500 이상 | 생존)   = 26.7%   P(첫 주문 500 이상 | 탈락) = 16.3%
# P(생존 | 첫 주문 500 이상)   = 72.9%   P(생존 | 첫 주문 500 미만) = 59.0%
```

</details>

<div class="table-scroll">
<table>
<thead><tr><th>질문</th><th>식</th><th>값</th><th>읽는 법</th></tr></thead>
<tbody>
<tr><td>살아남은 고객 중 첫 주문이 큰 비율</td><td>P(첫 주문 500 이상 ∣ 생존)</td><td>26.7%</td><td>보고서가 본 숫자. 살아남은 4명 중 3명은 첫 주문이 작았다</td></tr>
<tr><td>떠난 고객 중 첫 주문이 큰 비율</td><td>P(첫 주문 500 이상 ∣ 탈락)</td><td>16.3%</td><td>보고서가 보지 않은 숫자</td></tr>
<tr><td>첫 주문이 크면 살아남는 비율</td><td>P(생존 ∣ 첫 주문 500 이상)</td><td>72.9%</td><td>결정에 필요한 숫자. 전체 62.2%보다 10.7%p 높다</td></tr>
<tr><td>첫 주문이 작아도 살아남는 비율</td><td>P(생존 ∣ 첫 주문 500 미만)</td><td>59.0%</td><td>작은 첫 주문의 10명 중 6명은 그래도 남는다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 같은 1,200명에서 조건의 방향만 바꾼 네 가지 확률. 출처는 UCI Online Retail II(CC BY 4.0)이고 집계는 이 글에서 직접 했습니다.</p>
<p>보고서는 첫 줄만 봤습니다. 살아남은 고객 가운데 첫 주문이 큰 비율은 26.7%이고 떠난 고객에서는 16.3%이니 차이가 있어 보입니다. 그런데 결정에 필요한 것은 세 번째 줄입니다. 첫 주문이 크면 72.9%가 남고 작으면 59.0%가 남습니다. 차이는 13.9%p이고, 첫 주문이 작은 고객도 10명 중 6명은 남습니다. 첫 주문을 키우는 쿠폰이 생존을 13.9%p 올려 줄지는 이 숫자로도 알 수 없습니다. 첫 주문이 큰 고객은 애초에 도매상처럼 다른 종류의 고객일 수 있기 때문입니다.</p>
<p>살아남은 사람만 모아 보는 순간 첫 줄의 확률을 셋째 줄로 착각하게 됩니다. 첫 칼럼의 p값과 같은 구조입니다. 세로선 앞뒤가 바뀌면 다른 질문입니다.</p>
<blockquote><p><strong>살아남은 유저의 공통점은 P(특징 ∣ 생존)이고, 결정에 필요한 것은 P(생존 ∣ 특징)입니다. 둘은 떠난 유저를 넣어야만 연결됩니다.</strong></p></blockquote>

## 활성 유저 평균은 아무도 변하지 않아도 오릅니다

<p>두 번째 문제는 대시보드의 평균 지표에 숨어 있습니다. 같은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>의 월별 평균 구매액을 두 가지로 계산해 보겠습니다. 하나는 그 달에 구매한 고객만의 평균, 다른 하나는 떠난 고객을 0으로 넣은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 전체 평균입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>첫 구매 후</th><th>그 달 구매 고객</th><th>구매 고객만의 평균</th><th><a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 전체 평균 (떠난 고객 0)</th></tr></thead>
<tbody>
<tr><td>1개월째</td><td>252명</td><td>486</td><td>102</td></tr>
<tr><td>3개월째</td><td>333명</td><td>528</td><td>147</td></tr>
<tr><td>6개월째</td><td>280명</td><td>564</td><td>132</td></tr>
<tr><td>9개월째</td><td>273명</td><td>604</td><td>137</td></tr>
<tr><td>10개월째</td><td>210명</td><td>659</td><td>115</td></tr>
<tr><td>12개월째</td><td>231명</td><td>495</td><td>95</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 2010년 1~3월 첫 구매 고객 1,200명의 월별 평균 구매액. 단위는 파운드입니다.</p>
<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="구매 고객만의 평균은 오르고 코호트 전체 평균은 내려가는 두 선" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="70" y1="40" x2="70" y2="170" stroke="currentColor" stroke-width="1"/>
<line x1="70" y1="170" x2="580" y2="170" stroke="currentColor" stroke-width="1.5"/>
<text x="64" y="44" text-anchor="end">700</text>
<text x="64" y="109" text-anchor="end">350</text>
<text x="64" y="174" text-anchor="end">0</text>
<polyline points="80,80 124,74 168,72 212,74 256,66 300,65 344,68 388,61 432,58 476,48 520,53 564,78" fill="none" stroke="currentColor" stroke-width="2.5"/>
<polyline points="80,151 124,146 168,143 212,146 256,146 300,145 344,142 388,140 432,145 476,149 520,153 564,152" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/>
<text x="300" y="52" text-anchor="middle">그 달 구매한 고객만의 평균</text>
<text x="300" y="132" text-anchor="middle">코호트 전체 평균 (떠난 고객을 0으로)</text>
<text x="80" y="190" text-anchor="middle">M1</text>
<text x="212" y="190" text-anchor="middle">M4</text>
<text x="344" y="190" text-anchor="middle">M7</text>
<text x="476" y="190" text-anchor="middle">M10</text>
<text x="564" y="190" text-anchor="middle">M12</text>
<text x="325" y="210" text-anchor="middle">가로축은 첫 구매 후 경과 개월, 세로축은 평균 구매액(파운드)</text>
</g>
</svg>
<figcaption>그림 3. 같은 고객들의 같은 구매를 두 분모로 나눈 결과. 위 선은 오르는 것처럼 보이고 아래 선은 서서히 내려갑니다.</figcaption>
</figure>
<p>구매 고객만의 평균은 1개월째 486에서 10개월째 659로 36% 올랐습니다. 대시보드에서 활성 유저 ARPU가 오르고 있다고 읽히는 모양입니다. 그런데 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 전체 평균은 102에서 115로 거의 그대로이고, 12개월째에는 95로 내려갑니다.</p>
<p>위 선이 오른 이유의 대부분은 구성 변화입니다. 적게 사던 고객이 먼저 떠나고 많이 사던 고객이 남으니, 남은 사람의 평균은 아무도 더 쓰지 않아도 오릅니다. 실제로 1개월째와 12개월째에 모두 구매한 68명만 따로 보면 평균이 514에서 593으로 15% 올랐습니다. 같은 기간 활성 평균은 486에서 495로 2% 오르는 데 그쳤습니다. 같은 사람의 변화와 활성 평균의 변화가 이렇게 따로 노는 것은, 그달 누가 남았느냐가 평균을 흔들기 때문입니다.</p>
<p>활성 유저 기준 지표는 분모가 매달 바뀌는 지표입니다. 그 지표가 오르면 두 가지를 같이 봅니다. 분모가 줄었는가, 그리고 같은 사람을 따라갔을 때도 올랐는가.</p>
<blockquote><p><strong>활성 유저 평균이 오르는 것과 유저가 더 쓰는 것은 다른 일이고, 둘을 가르려면 떠난 유저를 0으로 넣은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 평균이 옆에 있어야 합니다.</strong></p></blockquote>

## 데이터의 시작점도 사람을 고릅니다

<p>세 번째는 눈에 잘 띄지 않습니다. 이 데이터는 2009년 12월 1일에 시작합니다. 그래서 2009년 12월에 처음 보이는 고객을 첫 구매 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>로 잡으면, 그 안에는 진짜 신규 고객과 그전부터 거래하던 기존 고객이 섞입니다. 데이터가 그날 시작했을 뿐 고객은 그날 시작하지 않았습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>첫 구매 월 (데이터 기준)</th><th><a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 크기</th><th>M6 리텐션</th><th>M12 리텐션</th></tr></thead>
<tbody>
<tr><td>2009-12 (데이터 시작 달)</td><td>955명</td><td>37.7%</td><td>37.6%</td></tr>
<tr><td>2010-01</td><td>383명</td><td>25.8%</td><td>22.2%</td></tr>
<tr><td>2010-02</td><td>374명</td><td>19.3%</td><td>15.2%</td></tr>
<tr><td>2010-03</td><td>443명</td><td>24.6%</td><td>20.1%</td></tr>
<tr><td>2010-04</td><td>294명</td><td>27.6%</td><td>13.9%</td></tr>
<tr><td>2010-05</td><td>254명</td><td>21.3%</td><td>15.4%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 데이터 시작 달의 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>는 크기가 2.5배이고 리텐션이 1.5배 이상입니다. 신규가 아니라 기존 고객이 섞였기 때문입니다.</p>
<p>2009년 12월 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>는 955명으로 다음 달의 2.5배이고, M12 리텐션은 37.6%로 다른 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>의 1.5배를 넘습니다. 이 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>를 신규 고객으로 보고 리텐션이 떨어지는 추세라고 읽으면 틀립니다. 떨어진 것이 아니라 첫 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>가 신규가 아니었던 것입니다. 로그를 새로 붙인 앱, 데이터를 이관한 서비스에서 같은 일이 생깁니다. 첫 달 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>는 제외하거나 따로 표시합니다.</p>
<blockquote><p><strong>데이터의 시작 달에 처음 보이는 유저는 신규가 아니라 그때 처음 기록된 유저이고, 그 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>는 다른 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>와 비교하지 않습니다.</strong></p></blockquote>

## 편향을 찾아내는 질문

<p>세 가지는 모두 같은 구조입니다. 분모에서 누군가가 빠져 있고, 빠진 방식이 결과와 관련이 있습니다. 이런 편향을 통틀어 <a class="term" href="#term-selection" data-tip="선택 편향(selection bias): 분모에 누가 들어가는지가 결과와 관련 있을 때 생기는 편향 전체. 생존자 편향은 그중 하나.">선택 편향</a>이라고 부르고, 결과를 보고 난 뒤에 남은 사람만 보는 경우를 특히 <a class="term" href="#term-survivorship" data-tip="생존자 편향(survivorship bias): 결과를 통과한 사람만 보고 결론을 내릴 때 생기는 편향. 통과하지 못한 사람이 분모에서 빠져 있다.">생존자 편향</a>이라고 부릅니다<sup class="fn"><a href="#ref-1" title="Wald (1943, 1980 재발간). A Method of Estimating Plane Vulnerability Based on Damage of Survivors. Statistical Research Group, Columbia University.">[1]</a></sup>.</p>
<div class="table-scroll">
<table>
<thead><tr><th>상황</th><th>빠진 사람</th><th>확인하는 질문</th><th>고치는 법</th></tr></thead>
<tbody>
<tr><td>오래 남은 유저의 공통점</td><td>떠난 유저</td><td>떠난 유저에게도 그 특징이 있는가</td><td>P(생존 ∣ 특징)으로 방향을 바꿔 다시 센다</td></tr>
<tr><td>활성 유저 평균의 상승</td><td>이번 달에 안 온 유저</td><td>분모가 줄었는가</td><td><a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 전체 평균과 같은 사람 추적을 나란히 둔다</td></tr>
<tr><td>데이터 시작 달의 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a></td><td>그전부터 있던 유저의 과거</td><td>첫 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 크기가 다른 달과 다른가</td><td>첫 달을 제외하거나 따로 표시한다</td></tr>
<tr><td>설문과 리뷰</td><td>응답하지 않은 유저</td><td>응답률이 얼마이고 누가 응답했는가</td><td>응답자의 행동 지표를 비응답자와 비교한다</td></tr>
<tr><td>결제 유저 분석</td><td>결제하지 않은 유저</td><td>결제 유저의 특징이 비결제 유저에도 있는가</td><td>분모를 전체 설치로 되돌린다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. <a class="term" href="#term-selection" data-tip="선택 편향(selection bias): 분모에 누가 들어가는지가 결과와 관련 있을 때 생기는 편향 전체. 생존자 편향은 그중 하나.">선택 편향</a>이 들어오는 자리와 확인하는 질문. 계량경제학에서는 이 문제를 표본 <a class="term" href="#term-selection" data-tip="선택 편향(selection bias): 분모에 누가 들어가는지가 결과와 관련 있을 때 생기는 편향 전체. 생존자 편향은 그중 하나.">선택 편향</a>으로 다룹니다<sup class="fn"><a href="#ref-2" title="Heckman (1979). Sample selection bias as a specification error. Econometrica, 47(1), 153-161.">[2]</a></sup>.</p>
<p>확인하는 질문은 결국 하나입니다. 이 숫자의 분모에서 누가 빠졌고, 빠진 사람은 남은 사람과 어떻게 다른가. 빠진 사람이 결과와 무관하게 빠졌다면 괜찮고, 결과 때문에 빠졌다면 그 숫자는 결과를 설명하지 못합니다.</p>
<blockquote><p><strong>분모에서 빠진 사람이 결과 때문에 빠졌다면, 남은 사람의 숫자는 원인이 아니라 결과를 다시 쓴 것입니다.</strong></p></blockquote>

## 나가며

<ol>
<li>살아남은 고객 중 첫 주문이 큰 비율(26.7%)과 첫 주문이 크면 살아남는 비율(72.9%)은 다른 숫자입니다. 결정에는 후자가 필요하고, 후자는 떠난 고객을 넣어야 계산됩니다.</li>
<li>활성 고객만의 평균 구매액은 1개월째 486에서 10개월째 659로 36% 올랐지만, <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a> 전체 평균은 102에서 115로 거의 그대로였고 같은 사람을 따라가면 12개월째까지 15% 올랐습니다. 활성 평균의 출렁임에는 그달 누가 남았는지가 섞여 있습니다.</li>
<li>데이터 시작 달의 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>는 크기 2.5배, 리텐션 1.5배로 신규가 아닙니다. 첫 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 떠난 사람도 코호트에 남아 있어야 분모가 유지된다.">코호트</a>는 비교에서 뺍니다.</li>
</ol>

## 용어

<ul>
<li id="term-survivorship"><strong>생존자 편향(survivorship bias)</strong>: 결과를 통과한 사람만 보고 결론을 내릴 때 생기는 편향입니다. 통과하지 못한 사람이 분모에서 빠져 있습니다.</li>
<li id="term-selection"><strong>선택 편향(selection bias)</strong>: 분모에 누가 들어가는지가 결과와 관련 있을 때 생기는 편향 전체를 가리킵니다. 생존자 편향은 그중 하나입니다.</li>
<li id="term-conditional"><strong>조건부 확률(conditional probability)</strong>: 어떤 조건이 성립할 때의 확률입니다. P(A ∣ B)와 P(B ∣ A)는 다른 값이고, 둘을 바꿔 읽는 것이 생존자 편향의 핵심입니다.</li>
<li id="term-cohort"><strong>코호트(cohort)</strong>: 같은 기준일에 시작한 사람들의 묶음입니다. 떠난 사람도 코호트에 그대로 남아 있어야 분모가 유지됩니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Wald, A. (1943, 1980년 재발간). <em>A Method of Estimating Plane Vulnerability Based on Damage of Survivors</em>. Statistical Research Group, Columbia University; Center for Naval Analyses CRC 432.</li>
<li id="ref-2">Heckman, J. J. (1979). Sample selection bias as a specification error. <em>Econometrica</em>, 47(1), 153-161. https://doi.org/10.2307/1912352</li>
</ol>
<p class="refs">그림 1부터 4의 데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)이며, 고객 ID가 있고 수량과 단가가 양수인 거래 805,549건을 썼습니다. 첫 주문액은 첫 구매일 하루의 합계이고, 생존은 첫 구매 월로부터 12개월째 이후에 구매가 있는 것입니다. 첫 주문 500 이상이라는 기준은 설명을 위해 임의로 골랐습니다. 서두의 쿠폰 제안과 친구 초대 예시는 가상입니다. 고객 단위 원본은 싣지 않았습니다. 코드 실행 환경은 Python 3.12, pandas 3.0.6입니다.</p>
