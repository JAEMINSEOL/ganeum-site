---
title: "고래가 평균을 바꿉니다"
description: "이상치를 자르면 결과의 부호가 바뀌는 경우"
date: 2026-11-10T05:00:00+09:00
tags: ["이상치", "고래", "중앙값", "A/B 테스트"]
draft: false
---
<blockquote><p><strong>고객 4,166명 가운데 1명이 전체 매출의 3.3%를 냅니다. 효과가 전혀 없는 실험에서도 이 한 명이 어느 그룹에 들어가느냐에 따라 평균 차이가 13% 움직입니다.</strong></p></blockquote>

## 들어가며

<p>A/B 테스트 보고서에 실험군 B의 인당 매출이 대조군보다 35% 높다고 적혀 있습니다. 검토한 동료가 상위 1%를 잘라 다시 계산하니 B가 오히려 2% 낮다고 합니다. 두 숫자는 같은 데이터에서 나왔습니다.</p>
<p><strong><a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>를 자른 결과와 자르지 않은 결과가 다를 때, 어느 쪽을 보고해야 할까요?</strong></p>
<p>이번 글에서는 공개 거래 데이터로 구매액이 소수 고객에게 얼마나 쏠려 있는지 재고, 효과가 전혀 없는 실험에서 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a> 한 명이 평균을 얼마나 움직이는지 1만 번 배정으로 확인합니다. 그다음 자르는 기준마다 결과의 부호가 어떻게 갈리는지 보고, 자를지 말지를 언제 정해야 하는지 정리하겠습니다.</p>

## 평균 위에 있는 고객은 20%뿐입니다

<p>UCI에 CC BY 4.0으로 공개된 영국 온라인 소매점 데이터에서 2011년 1월부터 11월까지 구매한 고객 4,166명의 구매액을 더했습니다<sup class="fn"><a href="#ref-1" title="Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository.">[1]</a></sup>. 평균은 1,867이고 <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>은 646으로, 평균이 <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>의 2.9배입니다. 평균보다 많이 쓴 고객은 20.3%뿐입니다.</p>
<p>쏠림은 꼭대기에서 급해집니다. 상위 10%인 417명이 매출의 60.2%, 상위 1%인 42명이 31.0%, 상위 0.1%인 4명이 10.3%를 냅니다. 1위 고객 한 명의 구매액 259,886은 평균의 139배이고 전체 매출의 3.3%입니다.</p>
<p>업계에서는 결제액 상위 극소수 유저를 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>라고 부릅니다. 어디까지를 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>로 볼지는 정해진 기준이 없고, 이 글에서는 상위 1%를 기준으로 씁니다. <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>를 <a class="term" href="#term-outlier" data-tip="이상치(outlier): 나머지 값들과 동떨어진 값. 오류일 수도, 고래의 구매액처럼 실제 값일 수도 있다.">이상치</a>로 볼지는 뒤에서 다시 다룹니다.</p>

```python
import numpy as np, pandas as pd

d = pd.read_csv("data/uci/retail_customers.csv", parse_dates=["date"])
y = d[(d.date >= "2011-01-01") & (d.date <= "2011-11-30")]
spend = y.groupby("Customer_ID").amount.sum().sort_values(ascending=False)  # 고객별 11개월 구매액
v = spend.to_numpy(); n = len(v); total = v.sum()

print(f"고객 {n:,}명  평균 {v.mean():,.0f}  중앙값 {np.median(v):,.0f}  최대 {v.max():,.0f}")
print(f"평균 이상인 고객 {(v >= v.mean()).mean() * 100:.1f}%")
for q in (0.001, 0.01, 0.05, 0.10):
    k = int(round(n * q))
    print(f"상위 {q * 100:>4g}% ({k:>3,}명)의 합 = 전체의 {v[:k].sum() / total * 100:.1f}%")
cap = np.percentile(v, 99)                     # 상위 1% 윈저라이즈 상한
w = np.minimum(v, cap)
print(f"윈저라이즈 상한 {cap:,.0f}  처리 후 평균 {w.mean():,.0f} ({(w.mean() / v.mean() - 1) * 100:+.1f}%)")
# 고객 4,166명  평균 1,867  중앙값 646  최대 259,886
# 평균 이상인 고객 20.3%
# 상위  0.1% (  4명)의 합 = 전체의 10.3%
# 상위    1% ( 42명)의 합 = 전체의 31.0%
# 상위    5% (208명)의 합 = 전체의 49.2%
# 상위   10% (417명)의 합 = 전체의 60.2%
# 윈저라이즈 상한 17,061  처리 후 평균 1,461 (-21.7%)
```

<div class="table-scroll">
<table>
<thead><tr><th>구분</th><th>값</th></tr></thead>
<tbody>
<tr><td>고객 수</td><td>4,166명</td></tr>
<tr><td>평균</td><td>1,867</td></tr>
<tr><td><a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a></td><td>646</td></tr>
<tr><td>최대</td><td>259,886 (평균의 139배)</td></tr>
<tr><td>평균 이상인 고객</td><td>20.3%</td></tr>
<tr><td>상위 1%(42명) 평균</td><td>57,329</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 2011년 1월부터 11월까지 고객별 구매액의 요약. 단위는 파운드입니다. 출처는 UCI Online Retail II(CC BY 4.0)이고 집계는 이 글에서 직접 했습니다.</p>
<figure>
<svg viewBox="0 0 620 230" role="img" aria-label="상위 고객 비율별 매출 점유율 가로 막대. 상위 0.1퍼센트가 10.3퍼센트, 상위 1퍼센트가 31.0퍼센트, 상위 5퍼센트가 49.2퍼센트, 상위 10퍼센트가 60.2퍼센트" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="190" y1="30" x2="190" y2="180" stroke="currentColor" stroke-width="1.5"/>
<text x="180" y="52" text-anchor="end">상위 0.1% (4명)</text>
<rect x="190" y="40" width="62" height="18" fill="none" stroke="currentColor"/><text x="258" y="54">10.3%</text>
<text x="180" y="86" text-anchor="end">상위 1% (42명)</text>
<rect x="190" y="74" width="186" height="18" fill="currentColor"/><text x="382" y="88">31.0%</text>
<text x="180" y="120" text-anchor="end">상위 5% (208명)</text>
<rect x="190" y="108" width="295" height="18" fill="none" stroke="currentColor"/><text x="491" y="122">49.2%</text>
<text x="180" y="154" text-anchor="end">상위 10% (417명)</text>
<rect x="190" y="142" width="361" height="18" fill="none" stroke="currentColor"/><text x="557" y="156">60.2%</text>
<text x="190" y="200" text-anchor="middle">0%</text>
<text x="370" y="200" text-anchor="middle">30%</text>
<text x="550" y="200" text-anchor="middle">60%</text>
<text x="370" y="224" text-anchor="middle">전체 매출에서 차지하는 비율</text>
</g>
</svg>
<figcaption>그림 2. 상위 고객이 차지하는 매출 비율. 상위 1%(검은 막대)가 전체의 31.0%를 냅니다.</figcaption>
</figure>
<blockquote><p><strong>구매액 분포에서 평균은 고객 대부분을 대표하지 않습니다. 평균 위에 있는 고객은 20%이고, 상위 1%가 매출의 31%를 냅니다.</strong></p></blockquote>

## 고래 한 명이 그룹 평균을 13% 움직입니다

<p>이 쏠림이 실험 결과에 어떻게 들어오는지 보려고 효과가 0인 실험을 만들었습니다. 같은 고객 4,166명을 무작위로 반씩 A와 B에 배정하고 아무 처리도 하지 않은 채 B의 평균에서 A의 평균을 뺍니다. 진짜 차이는 0이므로 나오는 차이는 전부 배정에서 생긴 <a class="term" href="#term-noise" data-tip="노이즈(noise): 효과와 무관하게 배정이나 표본 때문에 생기는 값의 변동. 효과가 0일 때 나오는 차이는 전부 노이즈다.">노이즈</a>입니다. 배정을 1만 번 반복했습니다.</p>
<p>원본 평균의 차이는 표준편차가 249.9로 평균의 13.4%입니다. 배정 1만 번 가운데 71.8%에서 차이가 5%를 넘었습니다. 1위 고객이 들어간 그룹이 평균에서 이긴 배정은 72.0%입니다.</p>
<p>1위 고객 한 명이 A에서 B로 옮겨 가면 B의 합은 259,886 늘고 A의 합은 그만큼 줄어, 그룹당 2,083명 기준으로 B와 A의 평균 차이가 약 250 벌어집니다. 평균의 13.4%에 해당하는 크기가 고객 한 명의 배정에 달려 있습니다.</p>
<p>상위 1% 값을 99분위 상한인 17,061로 눌러 두는 <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a>를 거치면 차이의 표준편차는 76.2로 평균의 4.1%가 되고, <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>으로 비교하면 27.9로 1.5%가 됩니다. 표준편차가 3.3배 크면 같은 차이를 같은 확률로 잡는 데 필요한 표본은 3.3의 제곱인 약 11배가 됩니다.</p>

```python
rng = np.random.default_rng(seed=2026)
T = 10_000; half = n // 2
diff = {"원본 평균": [], "윈저라이즈 평균": [], "중앙값": []}
top_wins = 0; flips = 0; worst = None
for t in range(T):
    idx = rng.permutation(n); a, b = idx[:half], idx[half:]
    da = v[b].mean() - v[a].mean(); dw = w[b].mean() - w[a].mean(); dm = np.median(v[b]) - np.median(v[a])
    diff["원본 평균"].append(da); diff["윈저라이즈 평균"].append(dw); diff["중앙값"].append(dm)
    top_wins += (da > 0) == bool(np.isin(0, b))              # 1위 고객(인덱스 0)이 든 쪽이 이겼나
    if np.sign(da) != np.sign(dw):
        flips += 1
        if worst is None or abs(da) > abs(worst[1]):
            worst = (t, da, v[a].mean(), v[b].mean(), w[a].mean(), w[b].mean(),
                     np.median(v[a]), np.median(v[b]), np.sort(v[a])[-3:], np.sort(v[b])[-3:])
for name, arr in diff.items():
    arr = np.array(arr)
    print(f"{name:<8} B−A 표준편차 {arr.std():>6,.1f} (평균의 {arr.std() / v.mean() * 100:>4.1f}%)  |차이|>5%: {(np.abs(arr) > 0.05 * v.mean()).mean() * 100:.1f}%")
print(f"1위 고객이 든 그룹이 원본 평균에서 이김 {top_wins / T * 100:.1f}%")
print(f"원본과 윈저라이즈의 부호가 다름 {flips / T * 100:.1f}%")
t, da, ma, mb, wa, wb, qa, qb, top_a, top_b = worst
print(f"배정 #{t}: 원본 A {ma:,.0f} B {mb:,.0f} ({(mb / ma - 1) * 100:+.1f}%) | 윈저 A {wa:,.0f} B {wb:,.0f} ({(wb / wa - 1) * 100:+.1f}%) | 중앙값 A {qa:,.0f} B {qb:,.0f} ({(qb / qa - 1) * 100:+.1f}%)")
print(f"  A의 상위 3명: {', '.join(f'{x:,.0f}' for x in top_a[::-1])}  |  B의 상위 3명: {', '.join(f'{x:,.0f}' for x in top_b[::-1])}")
# 원본 평균    B−A 표준편차  249.9 (평균의 13.4%)  |차이|>5%: 71.8%
# 윈저라이즈 평균 B−A 표준편차   76.2 (평균의  4.1%)  |차이|>5%: 21.8%
# 중앙값      B−A 표준편차   27.9 (평균의  1.5%)  |차이|>5%: 0.1%
# 1위 고객이 든 그룹이 원본 평균에서 이김 72.0%
# 원본과 윈저라이즈의 부호가 다름 28.8%
# 배정 #3883: 원본 A 1,588 B 2,147 (+35.2%) | 윈저 A 1,479 B 1,444 (-2.4%) | 중앙값 A 660 B 627 (-5.0%)
#   A의 상위 3명: 59,011, 56,915, 46,200  |  B의 상위 3명: 259,886, 220,337, 190,960
```

<div class="table-scroll">
<table>
<thead><tr><th>비교 방법</th><th>B−A 차이의 표준편차</th><th>평균 대비</th><th>차이가 5%를 넘은 배정</th></tr></thead>
<tbody>
<tr><td>원본 평균</td><td>249.9</td><td>13.4%</td><td>71.8%</td></tr>
<tr><td><a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균 (상위 1%)</td><td>76.2</td><td>4.1%</td><td>21.8%</td></tr>
<tr><td><a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a></td><td>27.9</td><td>1.5%</td><td>0.1%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 효과가 0인 실험을 1만 번 배정했을 때 B−A 차이의 퍼짐. 평균 대비는 원본 평균 1,867을 기준으로 했습니다.</p>
<blockquote><p><strong>효과가 0인 실험에서도 원본 평균의 그룹 차이는 표준편차가 평균의 13%이고, 그 방향은 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a> 한 명이 어느 그룹에 들어갔는지가 72% 정합니다.</strong></p></blockquote>

## 자르는 기준마다 부호가 다릅니다

<p>배정 1만 번 가운데 28.8%는 원본 평균과 <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균의 부호가 달랐습니다. 효과가 0이므로 두 숫자 가운데 어느 쪽도 효과를 재고 있지 않습니다. 둘 다 배정을 재고 있을 뿐입니다.</p>
<p>원본 차이가 가장 컸던 3,883번째 배정이 서두의 보고서와 같은 모양입니다. 원본 평균은 B가 35.2% 높고, <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균은 B가 2.4% 낮고, <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>은 B가 5.0% 낮습니다. 상위 3명인 259,886과 220,337과 190,960이 모두 B에 들어간 배정이었습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>비교 방법</th><th>A</th><th>B</th><th>B의 상대 차이</th></tr></thead>
<tbody>
<tr><td>원본 평균</td><td>1,588</td><td>2,147</td><td>+35.2%</td></tr>
<tr><td><a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균 (상위 1%)</td><td>1,479</td><td>1,444</td><td>−2.4%</td></tr>
<tr><td><a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a></td><td>660</td><td>627</td><td>−5.0%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 3,883번째 배정의 세 가지 비교. 진짜 효과는 0이고 A와 B의 상위 3명은 59,011과 56,915와 46,200 대 259,886과 220,337과 190,960입니다.</p>
<p>실험이 아닌 월별 비교에서도 같은 일이 생깁니다. 2010년 12월부터 2011년 11월까지 활성 고객당 구매액의 전월 대비 변화를 원본 평균, 상위 1% <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균, <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>으로 각각 계산하면 11쌍 가운데 4쌍에서 부호가 갈립니다. 2011년 6월은 원본 평균이 +3.8%인데 <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a>는 −7.9%, <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>은 −9.6%이고, 7월은 그 반대입니다.</p>
<p>자른 뒤가 정답이라는 뜻은 아닙니다. <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>의 구매액도 실제 매출이고, 질문이 총 매출이 늘었느냐라면 원본 평균이 답에 가깝습니다. 질문이 보통 고객이 더 쓰게 되었느냐라면 <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>이나 <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a>가 답에 가깝습니다. 부호가 갈린다는 사실은 두 질문의 답이 다르다는 뜻이고, 어느 질문인지는 결과가 아니라 설계가 정합니다.</p>

```python
m = d[(d.date >= "2010-12-01") & (d.date <= "2011-11-30")].copy()
m["ym"] = m.date.dt.to_period("M")
pc = m.groupby(["ym", "Customer_ID"]).amount.sum()
months = sorted(pc.index.get_level_values(0).unique())
print("월      원본평균  윈저1%   중앙값")
for p, q in zip(months[:-1], months[1:]):
    a, b = pc.loc[p].to_numpy(), pc.loc[q].to_numpy()
    c = np.percentile(np.concatenate([a, b]), 99)
    r = (b.mean() / a.mean() - 1) * 100
    wz = (np.minimum(b, c).mean() / np.minimum(a, c).mean() - 1) * 100
    md = (np.median(b) / np.median(a) - 1) * 100
    flag = "  부호 불일치" if len({np.sign(r), np.sign(wz), np.sign(md)}) > 1 else ""
    print(f"{q}  {r:+6.1f}%  {wz:+6.1f}%  {md:+6.1f}%{flag}")
# 월      원본평균  윈저1%   중앙값
# 2011-01   -23.1%   -31.8%   -35.4%
# 2011-02   -23.2%    -7.2%    -1.4%
# 2011-03    +3.6%    +2.0%    +0.0%
# 2011-04   -10.3%    -5.0%    -1.9%
# 2011-05   +17.2%    +9.7%    +9.2%
# 2011-06    +3.8%    -7.9%    -9.6%  부호 불일치
# 2011-07    -5.2%    +6.6%    +7.8%  부호 불일치
# 2011-08    +9.2%    +2.5%    -4.2%  부호 불일치
# 2011-09    +9.0%    +6.0%   +14.3%
# 2011-10    +1.2%    +3.0%    -0.6%  부호 불일치
# 2011-11    -9.3%    -3.9%    -2.6%
```

<div class="table-scroll">
<table>
<thead><tr><th>월</th><th>원본 평균</th><th><a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균</th><th><a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a></th><th>부호</th></tr></thead>
<tbody>
<tr><td>2011-01</td><td>−23.1%</td><td>−31.8%</td><td>−35.4%</td><td>일치</td></tr>
<tr><td>2011-02</td><td>−23.2%</td><td>−7.2%</td><td>−1.4%</td><td>일치</td></tr>
<tr><td>2011-03</td><td>+3.6%</td><td>+2.0%</td><td>+0.0%</td><td>일치</td></tr>
<tr><td>2011-04</td><td>−10.3%</td><td>−5.0%</td><td>−1.9%</td><td>일치</td></tr>
<tr><td>2011-05</td><td>+17.2%</td><td>+9.7%</td><td>+9.2%</td><td>일치</td></tr>
<tr><td><strong>2011-06</strong></td><td><strong>+3.8%</strong></td><td><strong>−7.9%</strong></td><td><strong>−9.6%</strong></td><td><strong>갈림</strong></td></tr>
<tr><td><strong>2011-07</strong></td><td><strong>−5.2%</strong></td><td><strong>+6.6%</strong></td><td><strong>+7.8%</strong></td><td><strong>갈림</strong></td></tr>
<tr><td><strong>2011-08</strong></td><td><strong>+9.2%</strong></td><td><strong>+2.5%</strong></td><td><strong>−4.2%</strong></td><td><strong>갈림</strong></td></tr>
<tr><td>2011-09</td><td>+9.0%</td><td>+6.0%</td><td>+14.3%</td><td>일치</td></tr>
<tr><td><strong>2011-10</strong></td><td><strong>+1.2%</strong></td><td><strong>+3.0%</strong></td><td><strong>−0.6%</strong></td><td><strong>갈림</strong></td></tr>
<tr><td>2011-11</td><td>−9.3%</td><td>−3.9%</td><td>−2.6%</td><td>일치</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 활성 고객당 구매액의 전월 대비 변화. <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 상한은 비교하는 두 달을 합친 99분위입니다. 11쌍 가운데 4쌍에서 세 방법의 부호가 다릅니다.</p>
<blockquote><p><strong>자르기 전과 후의 부호가 다르면 어느 한쪽이 틀린 것이 아니라, 결과가 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a> 몇 명의 배정이나 방문에 달려 있다는 뜻입니다.</strong></p></blockquote>

## 자를지 말지는 결과를 보기 전에 정합니다

<p>결과를 본 뒤에 원본, <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a>, <a class="term" href="#term-trimming" data-tip="절사(trimming): 정한 기준을 넘는 값을 집계에서 빼는 처리. 사람 수가 줄어든다.">절사</a>, <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a> 가운데 유리한 것을 고르면 여러 기준 가운데 하나를 고른 셈이 되어, 다중 비교와 같은 이유로 원하는 부호가 나올 확률이 올라갑니다. 그래서 <a class="term" href="#term-outlier" data-tip="이상치(outlier): 나머지 값들과 동떨어진 값. 오류일 수도, 고래의 구매액처럼 실제 값일 수도 있다.">이상치</a> 처리 방법은 실험 설계서에 지표 정의와 함께 적습니다<sup class="fn"><a href="#ref-2" title="Kohavi, R., Tang, D., &amp; Xu, Y. (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[2]</a></sup>. 선택지마다 답하는 질문이 다릅니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>방법</th><th>하는 일</th><th>답하는 질문</th><th>조심할 점</th></tr></thead>
<tbody>
<tr><td>원본 평균</td><td>그대로 평균을 낸다</td><td>총 매출이 늘었나</td><td><a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a> 한 명의 배정에 결과가 좌우된다</td></tr>
<tr><td><a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a></td><td>상한을 넘는 값을 상한으로 바꾼다<sup class="fn"><a href="#ref-3" title="Tukey, J. W. (1962). The Future of Data Analysis. The Annals of Mathematical Statistics, 33(1), 1–67.">[3]</a></sup></td><td><a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>의 영향을 줄인 평균이 늘었나</td><td>상한(몇 분위인지)을 미리 정한다. 상한 위의 변화는 보이지 않는다</td></tr>
<tr><td><a class="term" href="#term-trimming" data-tip="절사(trimming): 정한 기준을 넘는 값을 집계에서 빼는 처리. 사람 수가 줄어든다.">절사</a></td><td>상한을 넘는 고객을 뺀다</td><td><a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>를 뺀 고객의 평균이 늘었나</td><td>매출이 실제보다 작게 집계되고, 빠지는 사람이 그룹마다 다를 수 있다</td></tr>
<tr><td><a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a></td><td>가운데 값을 비교한다</td><td>보통 고객이 더 쓰나</td><td>총 매출과 연결이 끊긴다. 절반 이상이 0인 지표에는 쓸 수 없다</td></tr>
<tr><td>비율과 금액으로 분해</td><td>구매자 비율과 구매자당 금액을 따로 본다</td><td>더 많은 사람이 샀나, 산 사람이 더 썼나</td><td>비율은 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>와 무관하지만 구매자당 금액은 여전히 쏠려 있다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 6. <a class="term" href="#term-outlier" data-tip="이상치(outlier): 나머지 값들과 동떨어진 값. 오류일 수도, 고래의 구매액처럼 실제 값일 수도 있다.">이상치</a> 처리 선택지. 어느 것이 옳은지가 아니라 어느 질문에 답하는지가 다릅니다.</p>
<p>어느 방법을 골랐든 보고서에는 원본과 처리본을 나란히 둡니다. 둘의 부호가 같으면 결론이 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>에 기대지 않는다는 근거가 되고, 다르면 그 사실 자체가 보고할 내용입니다.</p>
<p>부호가 다를 때는 상위 몇 명을 빼면 부호가 바뀌는지를 셉니다. 한 명이면 결과는 그 한 명의 배정이고, 수십 명이면 상위 고객층 전체의 행동입니다. <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a> 자체가 관심이라면 <a class="term" href="#term-whale" data-tip="고래(whale): 결제액 상위 극소수 유저를 가리키는 업계 용어. 보통 상위 1% 안팎이며, 이 글에서는 상위 1%를 기준으로 썼다.">고래</a>만 따로 세는 분석이 필요하고, 그 분석은 평균 비교와 다른 글이 됩니다.</p>
<blockquote><p><strong><a class="term" href="#term-outlier" data-tip="이상치(outlier): 나머지 값들과 동떨어진 값. 오류일 수도, 고래의 구매액처럼 실제 값일 수도 있다.">이상치</a> 처리 방법은 결과를 보기 전에 설계서에 적고, 보고서에는 원본과 처리본을 나란히 두고 몇 명이 차이를 만들었는지 적습니다.</strong></p></blockquote>

## 나가며

<ol>
<li>고객 4,166명 가운데 평균보다 많이 쓴 고객은 20.3%이고 상위 1%가 매출의 31.0%를 냅니다. 구매액 분포에서 평균은 고객 대부분을 대표하지 않습니다.</li>
<li>효과가 0인 실험을 1만 번 배정하면 원본 평균 차이의 표준편차는 평균의 13.4%, <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a>는 4.1%, <a class="term" href="#term-median" data-tip="중앙값(median): 값을 크기순으로 늘어놓았을 때 한가운데 오는 값. 가장 큰 값이 아무리 커져도 움직이지 않는다.">중앙값</a>은 1.5%입니다. 1위 고객이 든 그룹이 72.0% 이기고, 28.8%는 자르기 전후의 부호가 다릅니다.</li>
<li>처리 방법은 결과를 보기 전에 설계서에 고정합니다. 보고서에는 원본과 처리본을 나란히 두고, 상위 몇 명을 빼면 부호가 바뀌는지 적습니다.</li>
</ol>

## 용어

<ul>
<li id="term-whale"><strong>고래(whale)</strong>: 결제액 상위 극소수 유저를 가리키는 업계 용어입니다. 보통 상위 1% 안팎을 말하며 정해진 기준은 없습니다. 이 글에서는 상위 1%를 기준으로 썼습니다.</li>
<li id="term-outlier"><strong>이상치(outlier)</strong>: 나머지 값들과 동떨어진 값입니다. 오류일 수도 있고 실제 값일 수도 있어서, 고래의 구매액처럼 실제인 이상치는 지우는 대신 처리 방법을 미리 정합니다.</li>
<li id="term-median"><strong>중앙값(median)</strong>: 값을 크기순으로 늘어놓았을 때 한가운데 오는 값입니다. 가장 큰 값이 얼마나 커지든 움직이지 않습니다.</li>
<li id="term-winsorize"><strong>윈저라이즈(winsorizing)</strong>: 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리입니다. 값을 버리지 않고 눌러 둡니다.</li>
<li id="term-trimming"><strong>절사(trimming)</strong>: 정한 기준을 넘는 값을 집계에서 빼는 처리입니다. 윈저라이즈와 달리 사람 수가 줄어듭니다.</li>
<li id="term-noise"><strong>노이즈(noise)</strong>: 효과와 무관하게 배정이나 표본 때문에 생기는 값의 변동입니다. 효과가 0일 때 나오는 차이는 전부 노이즈입니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Chen, D. (2012). <em>Online Retail II</em> [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5CG6D</li>
<li id="ref-2">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
<li id="ref-3">Tukey, J. W. (1962). The Future of Data Analysis. <em>The Annals of Mathematical Statistics</em>, 33(1), 1–67.</li>
</ol>
<p class="refs">그림 1부터 5의 데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)이며, 고객 ID가 있고 수량과 단가가 양수인 거래 805,549건을 썼습니다. 단위는 파운드입니다. 그림 1부터 4는 2011년 1월 1일부터 11월 30일까지 고객별 구매액 합이고, 그림 5는 2010년 12월부터 2011년 11월까지 월별 활성 고객당 구매액입니다. <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 상한은 그림 3과 4에서는 11개월 전체의 99분위, 그림 5에서는 비교하는 두 달을 합친 99분위입니다. 무작위 배정은 numpy의 default_rng(seed=2026)로 1만 번 돌렸고, 그림 4의 배정은 그 가운데 원본 평균과 <a class="term" href="#term-winsorize" data-tip="윈저라이즈(winsorizing): 정한 상한(예: 99분위)을 넘는 값을 상한 값으로 바꾸는 처리. 값을 버리지 않고 눌러 둔다.">윈저라이즈</a> 평균의 부호가 다르면서 원본 차이가 가장 큰 것입니다. 서두의 보고서는 그 배정을 바탕으로 만든 가상 예시입니다. 고객 단위 원본은 싣지 않았습니다. 코드 실행 환경은 Python 3.12, numpy 2.5.4, pandas 3.1.1입니다.</p>
