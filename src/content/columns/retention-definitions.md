---
title: "리텐션은 왜 회사마다 다르게 나올까?"
description: "정의와 관찰 창, 코호트 절단"
date: 2026-10-29T07:26:00+09:00
tags: ["리텐션", "코호트", "지표 정의"]
draft: false
---
<blockquote><p><strong>같은 고객 1,200명의 6개월 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>이 정의에 따라 23.3%, 66.1%, 76.5%로 나옵니다. 세 숫자 모두 맞습니다. 다른 질문에 답했을 뿐입니다.</strong></p></blockquote>

## 들어가며

<p>마케팅 대시보드에는 D7 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a> 35%가 떠 있고, 분석 도구에는 같은 주 같은 앱의 D7 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>이 18%로 나옵니다. 둘 다 같은 데이터를 읽고 있습니다.</p>
<p><strong>어느 숫자가 맞을까요?</strong></p>
<p>둘 다 맞습니다. <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>이라는 한 단어 뒤에 서로 다른 질문이 숨어 있고, 질문이 다르면 답도 다릅니다. 이번 글에서는 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a> 정의가 갈리는 지점 세 곳을 실제 데이터로 보고, 정의서에 무엇을 적어야 비교가 가능한지 정리하겠습니다.</p>

## 리텐션은 세 가지 질문입니다

<p><a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 처음 온 사람 가운데 나중에 다시 온 사람의 비율입니다. 문제는 다시 왔다를 언제로 볼 것인가입니다. 같은 데이터에 흔히 쓰는 세 가지 정의를 적용하면 전혀 다른 숫자가 나옵니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>정의</th><th>질문</th><th>D7이라면</th><th>어디에 맞나</th></tr></thead>
<tbody>
<tr><td>달력(N일째)</td><td>정확히 N일째 되는 날에 왔는가</td><td>7일째 당일 활동</td><td>매일 쓰는 앱. 가장 엄격하고 가장 낮게 나온다</td></tr>
<tr><td>범위(N일 안)</td><td>1일째부터 N일째 사이에 한 번이라도 왔는가</td><td>1~7일 중 활동</td><td>주 단위로 쓰는 앱. 날짜가 어긋나도 잡힌다</td></tr>
<tr><td>롤링(N일 이후)</td><td>N일째 또는 그 뒤에 한 번이라도 왔는가</td><td>7일째 이후 활동</td><td>아직 떠나지 않은 사람의 비율. 시간이 지나야 확정된다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>의 세 가지 정의. 같은 N에 대해 달력 ≤ 범위, 달력 ≤ 롤링이 항상 성립합니다.</p>
<p>공개 데이터로 세 정의를 같은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>에 적용해 보겠습니다. UCI에 CC BY 4.0으로 공개된 영국 온라인 소매점의 거래 기록을 씁니다. 2010년 1월부터 3월 사이에 첫 구매를 한 고객 1,200명을 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>로 잡고 이후 달에 구매했는지를 활동으로 봅니다. 앱의 일 단위 대신 월 단위이지만 구조는 같습니다.</p>

```python
import pandas as pd

d = pd.read_csv("data/uci/retail_customers.csv", parse_dates=["date"])
d["m"] = d.date.dt.year * 12 + d.date.dt.month - 1                 # 월 인덱스
first = d.groupby("Customer_ID")["m"].min()                          # 고객별 첫 구매 월
act = d.groupby(["Customer_ID", "m"]).size().reset_index()[["Customer_ID", "m"]]
act["k"] = act.m - act.Customer_ID.map(first)                        # 첫 구매 후 몇 개월째인가
cohort = first[(first >= 2010 * 12) & (first <= 2010 * 12 + 2)].index   # 2010년 1~3월 첫 구매 고객
a = act[act.Customer_ID.isin(cohort)]
for n in (1, 3, 6, 12):
    cal = a[a.k == n].Customer_ID.nunique() / len(cohort)            # 달력: n개월째 그 달에 구매
    bnd = a[(a.k >= 1) & (a.k <= n)].Customer_ID.nunique() / len(cohort)   # 범위: 1~n개월 안에 한 번이라도
    rol = a[a.k >= n].Customer_ID.nunique() / len(cohort)            # 롤링: n개월째 이후에 한 번이라도
    print(f"M{n:<2} 달력 {cal*100:5.1f}%  범위 {bnd*100:5.1f}%  롤링 {rol*100:5.1f}%")
# M1  달력  21.0%  범위  21.0%  롤링  83.8%
# M3  달력  27.8%  범위  49.8%  롤링  81.8%
# M6  달력  23.3%  범위  66.1%  롤링  76.5%
# M12 달력  19.2%  범위  80.0%  롤링  62.2%
```

<div class="table-scroll">
<table>
<thead><tr><th>첫 구매 후</th><th>달력 (그 달에 구매)</th><th>범위 (그때까지 한 번이라도)</th><th>롤링 (그 이후 한 번이라도)</th></tr></thead>
<tbody>
<tr><td>1개월째</td><td>21.0%</td><td>21.0%</td><td>83.8%</td></tr>
<tr><td>3개월째</td><td>27.8%</td><td>49.8%</td><td>81.8%</td></tr>
<tr><td>6개월째</td><td>23.3%</td><td>66.1%</td><td>76.5%</td></tr>
<tr><td>12개월째</td><td>19.2%</td><td>80.0%</td><td>62.2%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 2010년 1~3월 첫 구매 고객 1,200명의 월 단위 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>. 출처는 UCI Online Retail II(CC BY 4.0)이고 집계는 이 글에서 직접 했습니다.</p>
<p>6개월째 한 줄만 봐도 23.3%, 66.1%, 76.5%입니다. 달력 정의는 6개월째 그 달에 산 사람만 세고, 범위 정의는 그 사이 언제든 한 번 산 사람을 세고, 롤링 정의는 6개월 뒤에도 여전히 사는 사람을 셉니다. 세 숫자는 서로 바꿔 쓸 수 없고, 움직이는 방향도 다릅니다. 롤링은 시간이 갈수록 내려가고 범위는 올라갑니다. 달력은 3개월째에 가장 높았다가 내려갑니다.</p>
<p>서두에서 예시로 든 35%와 18%는 이 차이일 가능성이 큽니다. 도구마다 기본 정의가 다르고, 화면에 그 정의가 잘 드러나지 않습니다.</p>
<blockquote><p><strong><a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a> 숫자 앞에는 달력인지, 범위인지, 롤링인지가 먼저 적혀 있어야 하고, 그 표시가 없는 두 숫자는 비교할 수 없습니다.</strong></p></blockquote>

## 분모가 바뀌면 다른 사람을 셉니다

<p>정의를 맞춰도 숫자가 다를 수 있습니다. 누구를 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>에 넣는가, 즉 분모가 다르기 때문입니다. 같은 2010년 1~3월 첫 구매 고객에서 조건만 바꿔 보겠습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th><a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 조건</th><th>분모</th><th>M3 (달력)</th><th>M6 (달력)</th></tr></thead>
<tbody>
<tr><td>전체</td><td>1,200명</td><td>27.8%</td><td>23.3%</td></tr>
<tr><td>첫 구매액 100 이상</td><td>1,115명</td><td>28.7%</td><td>23.9%</td></tr>
<tr><td>첫 구매액 500 이상</td><td>273명</td><td>31.5%</td><td>28.2%</td></tr>
<tr><td>영국 외 고객</td><td>100명</td><td>19.0%</td><td>26.0%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 같은 기간, 같은 정의에서 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 조건만 바꿨을 때. 설명을 위해 조건을 임의로 골랐습니다.</p>
<p>첫 구매액 500 이상으로 자르면 M6가 23.3%에서 28.2%로 오릅니다. 큰 고객이 더 오래 남는다는 사실 자체는 맞지만, 이 숫자를 전체 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>과 나란히 두면 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>이 올랐다는 착각이 생깁니다. 앱에서는 이 조건이 설치 기준인지, 첫 세션 기준인지, 튜토리얼 완료 기준인지로 나타납니다. 튜토리얼을 마친 사람만 세면 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 반드시 올라가고, 그것은 제품이 좋아진 것이 아니라 분모가 줄어든 것입니다.</p>
<blockquote><p><strong><a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>의 분모는 누구를 처음 온 사람으로 치는가이고, 그 기준이 바뀌면 같은 정의에서도 숫자가 바뀝니다.</strong></p></blockquote>

## 덜 찬 코호트가 평균을 끌어내립니다

<p>세 번째 지점은 시간입니다. 6개월째 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>가 생기고 6개월이 지나야 계산할 수 있습니다. 그런데 대시보드는 <a class="term" href="#term-window" data-tip="관찰 창(observation window): 데이터가 있는 기간. 창의 끝에 가까운 코호트는 아직 지나지 않은 날의 값이 없다.">관찰 창</a>의 끝, 즉 오늘까지의 데이터로 모든 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>를 한 번에 그립니다. 최근 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>는 아직 6개월이 안 됐으니 칸이 비어 있어야 하는데, 비어 있는 칸을 0으로 채우거나 일부만 찬 달을 완전한 달로 치는 일이 자주 생깁니다.</p>
<figure>
<svg viewBox="0 0 620 262" role="img" aria-label="월별 코호트와 경과 개월의 격자. 최근 코호트일수록 오른쪽 칸이 비어 있고, 2011년 6월 코호트의 6개월째 칸은 일부만 차 있다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<text x="170" y="30" text-anchor="middle">M1</text><text x="236" y="30" text-anchor="middle">M2</text><text x="302" y="30" text-anchor="middle">M3</text><text x="368" y="30" text-anchor="middle">M4</text><text x="434" y="30" text-anchor="middle">M5</text><text x="500" y="30" text-anchor="middle">M6</text>
<text x="128" y="56" text-anchor="end">2011-04</text>
<rect x="140" y="40" width="60" height="22" fill="currentColor"/><rect x="206" y="40" width="60" height="22" fill="currentColor"/><rect x="272" y="40" width="60" height="22" fill="currentColor"/><rect x="338" y="40" width="60" height="22" fill="currentColor"/><rect x="404" y="40" width="60" height="22" fill="currentColor"/><rect x="470" y="40" width="60" height="22" fill="currentColor"/>
<text x="128" y="82" text-anchor="end">2011-05</text>
<rect x="140" y="66" width="60" height="22" fill="currentColor"/><rect x="206" y="66" width="60" height="22" fill="currentColor"/><rect x="272" y="66" width="60" height="22" fill="currentColor"/><rect x="338" y="66" width="60" height="22" fill="currentColor"/><rect x="404" y="66" width="60" height="22" fill="currentColor"/><rect x="470" y="66" width="60" height="22" fill="currentColor"/>
<text x="128" y="108" text-anchor="end">2011-06</text>
<rect x="140" y="92" width="60" height="22" fill="currentColor"/><rect x="206" y="92" width="60" height="22" fill="currentColor"/><rect x="272" y="92" width="60" height="22" fill="currentColor"/><rect x="338" y="92" width="60" height="22" fill="currentColor"/><rect x="404" y="92" width="60" height="22" fill="currentColor"/><rect x="470" y="92" width="60" height="22" fill="none" stroke="currentColor"/><rect x="470" y="92" width="18" height="22" fill="currentColor"/>
<text x="128" y="134" text-anchor="end">2011-07</text>
<rect x="140" y="118" width="60" height="22" fill="currentColor"/><rect x="206" y="118" width="60" height="22" fill="currentColor"/><rect x="272" y="118" width="60" height="22" fill="currentColor"/><rect x="338" y="118" width="60" height="22" fill="currentColor"/><rect x="404" y="118" width="60" height="22" fill="none" stroke="currentColor"/><rect x="404" y="118" width="18" height="22" fill="currentColor"/><rect x="470" y="118" width="60" height="22" fill="none" stroke="currentColor"/>
<text x="128" y="160" text-anchor="end">2011-08</text>
<rect x="140" y="144" width="60" height="22" fill="currentColor"/><rect x="206" y="144" width="60" height="22" fill="currentColor"/><rect x="272" y="144" width="60" height="22" fill="currentColor"/><rect x="338" y="144" width="60" height="22" fill="none" stroke="currentColor"/><rect x="338" y="144" width="18" height="22" fill="currentColor"/><rect x="404" y="144" width="60" height="22" fill="none" stroke="currentColor"/><rect x="470" y="144" width="60" height="22" fill="none" stroke="currentColor"/>
<text x="128" y="186" text-anchor="end">2011-09</text>
<rect x="140" y="170" width="60" height="22" fill="currentColor"/><rect x="206" y="170" width="60" height="22" fill="currentColor"/><rect x="272" y="170" width="60" height="22" fill="none" stroke="currentColor"/><rect x="272" y="170" width="18" height="22" fill="currentColor"/><rect x="338" y="170" width="60" height="22" fill="none" stroke="currentColor"/><rect x="404" y="170" width="60" height="22" fill="none" stroke="currentColor"/><rect x="470" y="170" width="60" height="22" fill="none" stroke="currentColor"/>
<text x="128" y="212" text-anchor="end">2011-10</text>
<rect x="140" y="196" width="60" height="22" fill="currentColor"/><rect x="206" y="196" width="60" height="22" fill="none" stroke="currentColor"/><rect x="206" y="196" width="18" height="22" fill="currentColor"/><rect x="272" y="196" width="60" height="22" fill="none" stroke="currentColor"/><rect x="338" y="196" width="60" height="22" fill="none" stroke="currentColor"/><rect x="404" y="196" width="60" height="22" fill="none" stroke="currentColor"/><rect x="470" y="196" width="60" height="22" fill="none" stroke="currentColor"/>
<text x="128" y="238" text-anchor="end">2011-11</text>
<rect x="140" y="222" width="60" height="22" fill="none" stroke="currentColor"/><rect x="140" y="222" width="18" height="22" fill="currentColor"/><rect x="206" y="222" width="60" height="22" fill="none" stroke="currentColor"/><rect x="272" y="222" width="60" height="22" fill="none" stroke="currentColor"/><rect x="338" y="222" width="60" height="22" fill="none" stroke="currentColor"/><rect x="404" y="222" width="60" height="22" fill="none" stroke="currentColor"/><rect x="470" y="222" width="60" height="22" fill="none" stroke="currentColor"/>
<text x="545" y="108">← 9일치</text>
</g>
</svg>
<figcaption>그림 4. 데이터가 2011년 12월 9일에 끝날 때의 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 격자. 검은 칸은 완전한 달이 찬 값, 빈 칸은 아직 오지 않은 달의 값입니다. 일부만 칠한 칸은 2011년 12월에 해당하는 값으로 1일부터 9일까지만 들어 있고, 2011-06 의 M6가 그중 하나입니다.</figcaption>
</figure>
<p>이 데이터의 마지막 달인 2011년 12월은 9일치뿐입니다. 2011년 6월 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>의 6개월째는 바로 그 12월이라서, 그대로 계산하면 8.3%가 나옵니다. 앞 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>들의 17%에서 26% 사이와 비교하면 절반 아래입니다. <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>이 무너진 것이 아니라 달이 덜 찬 것입니다.</p>
<p>빈 칸을 0으로 채우는 실수는 더 큽니다. 2010년 1월부터 2011년 11월까지 월별 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 23개의 M6 평균을 두 가지로 내 보겠습니다. 6개월이 지난 17개 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>만으로 내면 17.2%입니다. 아직 6개월이 안 된 6개 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>를 0으로 넣고 평균 내면 12.7%입니다. 같은 데이터에서 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>이 4.5%p 떨어진 것처럼 보입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>M6 평균을 내는 방법</th><th><a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 수</th><th>M6 평균</th></tr></thead>
<tbody>
<tr><td>6개월이 완전히 지난 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>만</td><td>17개 (2010-01 ~ 2011-05)</td><td>17.2%</td></tr>
<tr><td>아직 안 지난 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>를 0으로 넣고 전체</td><td>23개</td><td>12.7%</td></tr>
<tr><td>12월 9일치를 완전한 달로 치고 2011-06 포함</td><td>18개</td><td>2011-06만 8.3%로 들어감</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 미성숙 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>를 다루는 방법에 따른 M6 평균. 출처는 UCI Online Retail II이고 집계는 이 글에서 직접 했습니다.</p>
<p>기준은 하나입니다. N개월째 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 시작 월에 N을 더한 달이 완전히 지나야 표시합니다. 일 단위라면 설치일에 N일을 더한 날짜가 어제 이전이어야 하고, 로그 적재가 하루 늦는 서비스라면 그저께 이전이어야 합니다. 그 전까지는 빈 칸으로 둡니다. 0도, 부분값도 아닙니다.</p>
<blockquote><p><strong>N일째 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 설치일에 N일을 더한 날이 지난 뒤에만 숫자이고, 그 전에는 빈 칸입니다.</strong></p></blockquote>

## 정의서에 적을 것

<p>세 지점을 정의서 한 장으로 고정하면 대시보드마다 다른 숫자가 나오는 일이 사라집니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>항목</th><th>예시</th><th>정하지 않으면</th></tr></thead>
<tbody>
<tr><td>활동의 정의</td><td>앱 실행 (세션 시작 이벤트)</td><td>로그인만 센 숫자와 실행을 센 숫자가 섞인다</td></tr>
<tr><td><a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 기준일</td><td>설치일 (첫 세션 시작일)</td><td>설치 기준과 첫 구매 기준의 분모가 다르다</td></tr>
<tr><td>정의 종류</td><td>달력 (N일째 당일)</td><td>달력과 범위가 2~3배 차이 난다</td></tr>
<tr><td>날짜 경계</td><td>UTC 자정 기준 달력일</td><td>시간대가 다른 두 도구가 D1을 다르게 센다</td></tr>
<tr><td><a class="term" href="#term-maturity" data-tip="성숙(maturity): 기준일에 N을 더한 날이 지나 N일째 값을 계산할 수 있게 된 상태. 그 전의 값은 빈 칸.">성숙</a> 기준</td><td>설치일 + N일 ≤ 어제, 적재 지연 1일이면 그저께</td><td>덜 찬 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>가 평균을 끌어내린다</td></tr>
<tr><td>최소 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 크기</td><td>100명 미만은 표시하지 않음</td><td>작은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>의 <a class="term" href="#term-fluctuation" data-tip="변동(표집 변동, fluctuation): 같은 조건에서도 표본마다 우연히 달라지는 값의 흔들림. 코호트가 작을수록 크다.">변동</a>이 추세처럼 보인다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 6. <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a> 정의서의 최소 항목. 보고서의 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a> 숫자 옆에는 이 가운데 정의 종류와 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 기준일이 함께 적혀 있어야 합니다.</p>
<p>보고서를 읽을 때도 같습니다. <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a> 숫자 옆에 정의 종류와 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a> 기준일이 없으면, 그 숫자는 다른 보고서의 숫자와 비교하지 않습니다. 비교하려면 두 보고서의 정의서를 먼저 맞춥니다<sup class="fn"><a href="#ref-1" title="Croll & Yoskovitz (2013). Lean Analytics. O'Reilly Media.">[1]</a></sup>.</p>
<blockquote><p><strong><a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 정의서가 같을 때만 같은 지표이고, 정의서 없이 적힌 <a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>은 비교 대상이 아닙니다.</strong></p></blockquote>

## 나가며

<ol>
<li><a class="term" href="#term-retention" data-tip="리텐션(retention): 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율. 달력, 범위, 롤링 세 정의가 있다.">리텐션</a>에는 달력, 범위, 롤링 세 가지 정의가 있고 같은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>의 6개월째 값이 23.3%, 66.1%, 76.5%로 갈렸습니다. 정의 표시 없는 숫자는 비교하지 않습니다.</li>
<li>분모를 바꾸면 같은 정의에서도 숫자가 바뀝니다. 첫 구매액 500 이상으로 자르자 M6가 23.3%에서 28.2%가 됐습니다.</li>
<li>N개월째 값은 그 달이 완전히 지난 뒤에만 표시합니다. 덜 찬 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>를 0으로 넣으면 M6 평균이 17.2%에서 12.7%로 보였고, 9일치 달을 완전한 달로 치면 8.3%가 나왔습니다<sup class="fn"><a href="#ref-2" title="Kohavi, Tang & Xu (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[2]</a></sup>.</li>
</ol>

## 용어

<ul>
<li id="term-retention"><strong>리텐션(retention)</strong>: 처음 온 사람 가운데 정해진 시점에 다시 온 사람의 비율입니다. 다시 왔다를 언제로 보는가에 따라 달력, 범위, 롤링 세 정의로 갈립니다.</li>
<li id="term-cohort"><strong>코호트(cohort)</strong>: 같은 기준일에 시작한 사람들의 묶음입니다. 설치일, 첫 세션일, 첫 구매일 가운데 무엇을 기준으로 삼느냐가 분모를 정합니다.</li>
<li id="term-window"><strong>관찰 창(observation window)</strong>: 데이터가 있는 기간입니다. 창의 끝에 가까운 코호트는 아직 지나지 않은 날의 값이 없습니다.</li>
<li id="term-maturity"><strong>성숙(maturity)</strong>: 코호트 기준일에 N을 더한 날이 지나 N일째 값을 계산할 수 있게 된 상태입니다. 성숙 전의 값은 빈 칸으로 둡니다.</li>
<li id="term-fluctuation"><strong>변동(fluctuation)</strong>: 같은 조건에서도 표본마다 우연히 달라지는 값의 흔들림입니다. 코호트가 작을수록 큽니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Croll, A., &amp; Yoskovitz, B. (2013). <em>Lean Analytics: Use Data to Build a Better Startup Faster</em>. O’Reilly Media.</li>
<li id="ref-2">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
</ol>
<p class="refs">그림 2, 3, 5의 데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)이며, 고객 ID가 있고 수량과 단가가 양수인 거래 805,549건을 썼습니다. 데이터는 2009년 12월 1일부터 2011년 12월 9일까지이고, 첫 구매일은 이 기간 안의 첫 거래로 정했으므로 2009년 12월 이전부터 거래하던 고객은 첫 구매가 실제보다 늦게 잡힐 수 있습니다. 활동은 해당 월에 거래가 1건 이상 있는 것이고, <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 기준일에 시작한 사람들의 묶음. 기준일이 분모를 정한다.">코호트</a>는 첫 구매 월 기준입니다. 그림 5의 <a class="term" href="#term-maturity" data-tip="성숙(maturity): 기준일에 N을 더한 날이 지나 N일째 값을 계산할 수 있게 된 상태. 그 전의 값은 빈 칸.">성숙</a> 판정은 마지막 완전한 달인 2011년 11월을 기준으로 했습니다. 서두 예시의 35%와 18%는 설명을 위해 만든 가상 숫자입니다. 고객 단위 원본은 싣지 않았습니다. 코드 실행 환경은 Python 3.12, pandas 3.0.6입니다.</p>
