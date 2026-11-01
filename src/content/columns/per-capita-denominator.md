---
title: "분모를 바꾸면 결론이 바뀝니다"
description: "인당 지표의 분모를 정하는 법"
date: 2026-11-05T05:00:00+09:00
tags: ["인당 지표", "분모", "ARPU"]
draft: false
---
<blockquote><p><strong>같은 매출을 네 가지 분모로 나누면 +5.0%, −24.4%, +2.4%, −1.7%가 나옵니다. 인당 지표의 결론은 분자가 아니라 분모가 정합니다.</strong></p></blockquote>

## 들어가며

<p>월간 보고서에 인당 매출이 전년 대비 24% 떨어졌다고 적혀 있습니다. 같은 달 다른 보고서에는 <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당 매출이 5% 올랐다고 적혀 있습니다. 두 보고서의 분자는 같은 매출입니다.</p>
<p><strong>인당 매출이 떨어졌다는 말에서, 인은 누구일까요?</strong></p>
<p>이번 글에서는 공개 거래 데이터의 같은 두 기간, 같은 매출을 네 가지 분모로 나눠 봅니다. 결과는 부호까지 갈립니다. 그다음 신규 고객이 섞일 때 평균이 어떻게 움직이는지, 같은 사람을 따라가면 무엇이 보이는지, 그리고 질문에 따라 어느 분모를 골라야 하는지 정리하겠습니다.</p>

## 분모 후보는 넷입니다

<p>인당 매출의 분자는 기간 매출로 분명합니다. 분모는 누구를 세느냐에 따라 적어도 네 가지가 됩니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>분모</th><th>누구를 세나</th><th>흔한 이름</th><th>움직이는 이유</th></tr></thead>
<tbody>
<tr><td><a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a></td><td>그 기간에 구매한 고객</td><td>활성 유저 <a class="term" href="#term-arpu" data-tip="ARPU(average revenue per user): 유저당 평균 매출. 분모가 활성인지 등록인지에 따라 값이 크게 다르다.">ARPU</a>, ARPPU</td><td>구성이 바뀌면 움직인다. 신규가 줄면 오른다</td></tr>
<tr><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a></td><td>그때까지 한 번이라도 구매한 누적 고객</td><td>가입자당 매출</td><td>분모가 계속 쌓여서 시간이 갈수록 내려간다</td></tr>
<tr><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a> × 달력일</td><td>누적 고객 수에 기간 일수를 곱한 것</td><td>인일당 매출</td><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당과 같은 비율로 움직인다. 안 온 날도 센다</td></tr>
<tr><td>활성일</td><td>고객이 실제로 구매한 날의 수</td><td>활성일당 매출</td><td>방문 빈도가 바뀌면 분자와 같이 움직여 둔하다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 인당 매출의 네 가지 분모. 같은 분자를 다른 분모로 나눈 것이라 서로 바꿔 쓸 수 없습니다.</p>
<blockquote><p><strong>인당 지표의 분모는 활성, 등록, 등록 × 달력일, 활성일 가운데 하나이고, 이름만 보고는 어느 것인지 알 수 없습니다.</strong></p></blockquote>

## 같은 매출을 네 분모로 나누면

<p>UCI에 CC BY 4.0으로 공개된 영국 온라인 소매점 데이터에서 2010년 9월부터 11월까지를 전, 2011년 같은 석 달을 후로 잡습니다. 같은 계절을 비교해 계절 효과를 피했습니다. 총 매출은 3,040,631에서 3,153,975로 3.7% 올랐습니다.</p>

```python
import pandas as pd

d = pd.read_csv("data/uci/retail_customers.csv", parse_dates=["date"])
d["m"] = d.date.dt.year * 12 + d.date.dt.month - 1
first = d.groupby("Customer_ID").m.min()                                    # 고객별 첫 구매 월
P1, P2 = (2010 * 12 + 8, 2010 * 12 + 10), (2011 * 12 + 8, 2011 * 12 + 10)  # 2010년 9~11월, 2011년 9~11월

def summary(p):
    x = d[(d.m >= p[0]) & (d.m <= p[1])]
    return dict(spend=x.amount.sum(), active=x.Customer_ID.nunique(),
                registered=(first <= p[1]).sum(),                            # 기간 끝까지 한 번이라도 구매한 누적 고객
                active_days=x.groupby(["Customer_ID", x.date.dt.date]).ngroups,   # 고객이 구매한 날의 수
                by_cust=x.groupby("Customer_ID").amount.sum())

a, b = summary(P1), summary(P2)
both = a["by_cust"].index.intersection(b["by_cust"].index)                   # 두 기간 모두 구매한 고객
for name, v1, v2 in (("총 매출", a["spend"], b["spend"]),
                     ("활성 고객당", a["spend"] / a["active"], b["spend"] / b["active"]),
                     ("등록 고객당", a["spend"] / a["registered"], b["spend"] / b["registered"]),
                     ("활성일당", a["spend"] / a["active_days"], b["spend"] / b["active_days"]),
                     ("같은 고객만", a["by_cust"][both].mean(), b["by_cust"][both].mean())):
    print(f"{name:<6} {v1:>12,.1f} → {v2:>12,.1f}  ({(v2 / v1 - 1) * 100:+.1f}%)")
# 총 매출    3,040,631.0 →  3,153,974.6  (+3.7%)
# 활성 고객당      1,053.2 →      1,106.3  (+5.0%)
# 등록 고객당        712.8 →        539.1  (-24.4%)
# 활성일당          541.1 →        554.3  (+2.4%)
# 같은 고객만      1,467.2 →      1,442.1  (-1.7%)
```

<div class="table-scroll">
<table>
<thead><tr><th>지표</th><th>분모 (전 → 후)</th><th>전</th><th>후</th><th>변화</th></tr></thead>
<tbody>
<tr><td>총 매출</td><td></td><td>3,040,631</td><td>3,153,975</td><td>+3.7%</td></tr>
<tr><td><a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당</td><td>2,887 → 2,851명</td><td>1,053</td><td>1,106</td><td>+5.0%</td></tr>
<tr><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당</td><td>4,266 → 5,850명</td><td>713</td><td>539</td><td>−24.4%</td></tr>
<tr><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a> × 달력일당</td><td>388,206 → 532,350인일</td><td>7.8</td><td>5.9</td><td>−24.4%</td></tr>
<tr><td>활성일당</td><td>5,619 → 5,690일</td><td>541</td><td>554</td><td>+2.4%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 같은 두 기간의 같은 매출. 단위는 파운드입니다. 출처는 UCI Online Retail II(CC BY 4.0)이고 집계는 이 글에서 직접 했습니다.</p>
<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="분모별 변화율 가로 막대. 활성 고객당 플러스 5퍼센트, 등록 고객당 마이너스 24.4퍼센트, 활성일당 플러스 2.4퍼센트, 같은 고객만 마이너스 1.7퍼센트" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<line x1="450" y1="30" x2="450" y2="180" stroke="currentColor" stroke-width="1.5"/>
<text x="130" y="48" text-anchor="end">총 매출</text>
<rect x="450" y="36" width="41" height="16" fill="none" stroke="currentColor"/><text x="497" y="49">+3.7%</text>
<text x="130" y="74" text-anchor="end">활성 고객당</text>
<rect x="450" y="62" width="55" height="16" fill="currentColor"/><text x="511" y="75">+5.0%</text>
<text x="130" y="100" text-anchor="end">등록 고객당</text>
<rect x="182" y="88" width="268" height="16" fill="currentColor"/><text x="456" y="101">−24.4%</text>
<text x="130" y="126" text-anchor="end">활성일당</text>
<rect x="450" y="114" width="26" height="16" fill="currentColor"/><text x="482" y="127">+2.4%</text>
<text x="130" y="152" text-anchor="end">같은 고객만</text>
<rect x="431" y="140" width="19" height="16" fill="currentColor"/><text x="456" y="153">−1.7%</text>
<text x="450" y="198" text-anchor="middle">0%</text>
<text x="325" y="212" text-anchor="middle">2010년 9~11월 대비 2011년 9~11월 변화율</text>
</g>
</svg>
<figcaption>그림 3. 분자는 전부 같은 매출입니다. 분모에 따라 부호가 갈립니다.</figcaption>
</figure>
<p>총 매출이 3.7% 오른 두 기간에서, <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당은 5.0% 오르고 <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당은 24.4% 내렸습니다. 서두의 두 보고서는 둘 다 틀리지 않았습니다. <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당이 크게 내린 이유는 분모가 4,266명에서 5,850명으로 37% 늘었기 때문입니다. 한 번 구매하고 다시 오지 않은 고객도 <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>에는 계속 남아 있어서, 이 분모는 시간이 갈수록 쌓이기만 합니다. <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>에 달력일을 곱한 분모는 같은 값에 91을 곱한 것이라 변화율이 똑같습니다.</p>
<blockquote><p><strong><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당 지표는 분모가 쌓이기만 하므로 서비스가 오래될수록 저절로 내려가고, 그 하락은 고객이 덜 쓴다는 뜻이 아닙니다.</strong></p></blockquote>

## 신규 고객이 섞이면 활성 평균이 움직입니다

<p>그러면 <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당 +5.0%는 고객이 더 쓴다는 뜻일까요. <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>의 구성을 보겠습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>전 (2010년 9~11월)</th><th>후 (2011년 9~11월)</th></tr></thead>
<tbody>
<tr><td><a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a></td><td>2,887명</td><td>2,851명</td></tr>
<tr><td>그중 기간 내 첫 구매(신규)</td><td>945명 (32.7%)</td><td>601명 (21.1%)</td></tr>
<tr><td>신규 고객 1인당 매출 (후 기간)</td><td></td><td>619</td></tr>
<tr><td>기존 고객 1인당 매출 (후 기간)</td><td></td><td>1,236</td></tr>
<tr><td>기존 고객만의 <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당</td><td>1,252</td><td>1,236 (−1.2%)</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>의 구성과, 신규를 뺀 <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당 매출.</p>
<p>신규 고객은 기존 고객의 절반(619 대 1,236)을 씁니다. 후 기간에는 신규 비중이 32.7%에서 21.1%로 줄었습니다. 적게 쓰는 집단의 비중이 줄었으니 전체 평균은 아무도 더 쓰지 않아도 오릅니다. 신규를 빼고 기존 고객만 보면 1,252에서 1,236으로 1.2% 내렸습니다. +5.0%는 고객이 더 쓴 것이 아니라 신규 유입이 줄어서 생긴 숫자입니다.</p>
<p>앱에서는 반대 방향이 더 흔합니다. 마케팅으로 신규가 늘면 활성 유저 <a class="term" href="#term-arpu" data-tip="ARPU(average revenue per user): 유저당 평균 매출. 분모가 활성인지 등록인지에 따라 값이 크게 다르다.">ARPU</a>가 내려가고, 보고서에는 수익성 악화로 적힙니다. 기존 유저는 그대로인데 분모의 구성이 바뀐 것입니다.</p>
<blockquote><p><strong><a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당 지표의 변화는 고객이 더 쓴 것과 분모의 구성이 바뀐 것을 합친 값이고, 신규 비중이 움직이면 후자가 먼저 의심됩니다.</strong></p></blockquote>

## 같은 사람을 따라가면

<p>구성 변화를 완전히 걷어내는 방법은 두 기간 모두 구매한 고객만 비교하는 것입니다. 이것을 <a class="term" href="#term-panel" data-tip="균형 패널(balanced panel): 비교하는 모든 기간에 빠짐없이 관측된 사람들만 모은 집단. 구성 변화를 없애는 대신 남은 사람만 보게 된다.">균형 패널</a>이라고 부릅니다. 1,570명이 두 기간 모두 구매했고, 이들의 1인당 매출은 1,467에서 1,442로 1.7% 내렸습니다. 중앙값은 681에서 620입니다.</p>
<p>그러니 이 두 기간의 사실은 이렇게 정리됩니다. 총 매출은 3.7% 올랐고, 그 상승은 고객 수와 구성에서 왔으며, 같은 고객이 쓰는 금액은 1~2% 내렸습니다. <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당 +5.0%와 <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당 −24.4%는 둘 다 이 사실을 가리고 있었습니다.</p>
<p><a class="term" href="#term-panel" data-tip="균형 패널(balanced panel): 비교하는 모든 기간에 빠짐없이 관측된 사람들만 모은 집단. 구성 변화를 없애는 대신 남은 사람만 보게 된다.">균형 패널</a>에도 한계가 있습니다. 두 기간 모두 남은 고객은 원래 충성도가 높은 집단이라, 이들의 변화를 전체 고객의 변화로 읽을 수는 없습니다. 생존자 편향이 여기서도 작동합니다. 그래서 <a class="term" href="#term-panel" data-tip="균형 패널(balanced panel): 비교하는 모든 기간에 빠짐없이 관측된 사람들만 모은 집단. 구성 변화를 없애는 대신 남은 사람만 보게 된다.">균형 패널</a>은 총 매출, <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당, 신규 비중과 나란히 놓고 읽는 지표이지 혼자 쓰는 지표가 아닙니다.</p>
<blockquote><p><strong>고객이 더 쓰는지는 같은 고객을 따라가야 보이고, 그 답은 총 매출이나 <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당과 반대 부호일 수 있습니다.</strong></p></blockquote>

## 질문에 맞는 분모

<div class="table-scroll">
<table>
<thead><tr><th>묻고 싶은 것</th><th>맞는 분모</th><th>틀린 분모를 쓰면</th></tr></thead>
<tbody>
<tr><td>고객 한 명이 더 쓰게 됐나</td><td><a class="term" href="#term-panel" data-tip="균형 패널(balanced panel): 비교하는 모든 기간에 빠짐없이 관측된 사람들만 모은 집단. 구성 변화를 없애는 대신 남은 사람만 보게 된다.">균형 패널</a> (같은 고객)</td><td><a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당은 구성 변화를 섞는다</td></tr>
<tr><td>이번 달 온 고객의 평균 가치는</td><td><a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a></td><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당은 안 온 사람을 센다</td></tr>
<tr><td>가입자 한 명을 모으면 얼마가 되나</td><td><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>, 단 가입 코호트별로</td><td>전체 누적으로 나누면 오래된 서비스일수록 낮게 나온다</td></tr>
<tr><td>방문 한 번의 가치는</td><td>활성일 또는 세션</td><td>고객당으로 나누면 방문 빈도 변화를 못 본다</td></tr>
<tr><td>실험군과 대조군의 차이는</td><td>배정된 유저 전체 (안 온 유저 0 포함)</td><td>활성 유저만 비교하면 실험이 유입에 영향을 줄 때 편향된다<sup class="fn"><a href="#ref-1" title="Kohavi, Tang & Xu (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[1]</a></sup></td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 질문에 따라 맞는 분모가 다릅니다. 한 보고서에 인당 지표가 있으면 분모 이름이 옆에 적혀 있어야 합니다<sup class="fn"><a href="#ref-2" title="Croll &amp; Yoskovitz (2013). Lean Analytics. O’Reilly Media.">[2]</a></sup>.</p>
<p>마지막 줄은 실험 보고서에서 가장 자주 틀리는 자리입니다. 실험 효과를 활성 유저당으로 재면, 실험 자체가 활성 여부를 바꿀 때 분모가 그룹마다 달라집니다. 실험 지표의 분모는 배정된 유저 전체이고, 안 온 유저는 0으로 들어갑니다.</p>
<p>같은 원리가 <a class="term" href="#term-aarrr" data-tip="AARRR: 획득(Acquisition), 활성화(Activation), 리텐션(Retention), 매출(Revenue), 추천(Referral) 다섯 단계로 유저 흐름을 나누는 퍼널 틀. 2007년 Dave McClure가 제안.">AARRR</a> 퍼널에도 그대로 적용됩니다. 다섯 단계의 지표는 전부 비율이고, 각 단계의 분모는 바로 앞 단계입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th><a class="term" href="#term-aarrr" data-tip="AARRR: 획득(Acquisition), 활성화(Activation), 리텐션(Retention), 매출(Revenue), 추천(Referral) 다섯 단계로 유저 흐름을 나누는 퍼널 틀. 2007년 Dave McClure가 제안.">AARRR</a> 단계</th><th>비율</th><th>분모</th><th>이 글의 문제가 걸리는 자리</th></tr></thead>
<tbody>
<tr><td>활성화</td><td>활성화 유저 ÷ 획득 유저</td><td>획득 (설치)</td><td>설치 기준을 바꾸면 활성화율이 움직인다</td></tr>
<tr><td>리텐션</td><td>재방문 유저 ÷ 활성화 유저</td><td>활성화 코호트</td><td>정의와 분모가 다르면 비교할 수 없다</td></tr>
<tr><td>매출</td><td>결제 유저 ÷ 활성 유저</td><td>활성 유저</td><td>신규 비중이 바뀌면 결제율이 움직인다</td></tr>
<tr><td>추천</td><td>초대한 유저 ÷ 활성 유저</td><td>활성 유저</td><td>같은 구성 문제</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 6. <a class="term" href="#term-aarrr" data-tip="AARRR: 획득(Acquisition), 활성화(Activation), 리텐션(Retention), 매출(Revenue), 추천(Referral) 다섯 단계로 유저 흐름을 나누는 퍼널 틀. 2007년 Dave McClure가 제안.">AARRR</a> 각 단계의 분모. 단계마다 분모가 앞 단계로 좁아집니다<sup class="fn"><a href="#ref-3" title="McClure (2007). Startup Metrics for Pirates: AARRR! 슬라이드 자료.">[3]</a></sup>.</p>
<p><a class="term" href="#term-aarrr" data-tip="AARRR: 획득(Acquisition), 활성화(Activation), 리텐션(Retention), 매출(Revenue), 추천(Referral) 다섯 단계로 유저 흐름을 나누는 퍼널 틀. 2007년 Dave McClure가 제안.">AARRR</a> 퍼널은 분모를 한 단계씩 좁혀 가는 사다리이고, 각 단계의 비율을 비교할 때는 그 단계의 분모가 같은 기준인지부터 봅니다. 지난달 결제율 8%와 이번 달 결제율 7%를 비교하기 전에, 두 달의 활성 유저가 같은 정의로 세어졌는지와 신규 비중이 같은지를 먼저 확인하는 것입니다.</p>
<blockquote><p><strong>인당 지표를 쓸 때는 분모 이름을 지표 이름에 붙이고, 전후 비교에는 같은 고객을 따라간 숫자를 나란히 둡니다.</strong></p></blockquote>

## 나가며

<ol>
<li>총 매출 +3.7%인 같은 두 기간이 <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당 +5.0%, <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당 −24.4%, 활성일당 +2.4%, 같은 고객만 −1.7%로 읽혔습니다. 결론은 분모가 정합니다.</li>
<li><a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>당은 분모가 쌓이기만 해서 저절로 내려가고, <a class="term" href="#term-active" data-tip="활성 고객(active customer): 정해진 기간 안에 활동이 한 번이라도 있었던 고객. 기간이 바뀌면 사람도 바뀐다.">활성 고객</a>당은 신규 비중(32.7% → 21.1%)이 바뀌면 아무도 더 쓰지 않아도 움직입니다.</li>
<li>고객이 더 쓰는지는 두 기간 모두 구매한 1,570명을 따라가야 보였고, 답은 −1.7%였습니다. 실험 지표의 분모는 배정된 유저 전체입니다.</li>
</ol>

## 용어

<ul>
<li id="term-active"><strong>활성 고객(active customer)</strong>: 정해진 기간 안에 구매나 방문 같은 활동이 한 번이라도 있었던 고객입니다. 기간이 바뀌면 사람도 바뀝니다.</li>
<li id="term-registered"><strong>등록 고객(registered customer)</strong>: 그때까지 한 번이라도 활동한 누적 고객입니다. 떠난 고객도 빠지지 않으므로 시간이 갈수록 늘기만 합니다.</li>
<li id="term-panel"><strong>균형 패널(balanced panel)</strong>: 비교하는 모든 기간에 빠짐없이 관측된 사람들만 모은 집단입니다. 구성 변화를 없애는 대신 남은 사람만 보게 됩니다.</li>
<li id="term-aarrr"><strong>AARRR</strong>: 획득(Acquisition), 활성화(Activation), 리텐션(Retention), 매출(Revenue), 추천(Referral) 다섯 단계로 유저 흐름을 나누는 퍼널 틀입니다. 각 단계의 지표는 앞 단계를 분모로 하는 비율입니다.</li>
<li id="term-arpu"><strong>ARPU(average revenue per user)</strong>: 유저당 평균 매출입니다. 분모를 활성으로 두는지 등록으로 두는지에 따라 값이 크게 다르므로 이름만으로는 알 수 없습니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
<li id="ref-2">Croll, A., &amp; Yoskovitz, B. (2013). <em>Lean Analytics: Use Data to Build a Better Startup Faster</em>. O’Reilly Media.</li>
<li id="ref-3">McClure, D. (2007). <em>Startup Metrics for Pirates: AARRR!</em> [슬라이드 자료]. https://www.slideshare.net/dmc500hats/startup-metrics-for-pirates-long-version</li>
</ol>
<p class="refs">그림 2부터 4의 데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)이며, 고객 ID가 있고 수량과 단가가 양수인 거래 805,549건을 썼습니다. 전 기간은 2010년 9월 1일부터 11월 30일, 후 기간은 2011년 같은 날짜입니다. <a class="term" href="#term-registered" data-tip="등록 고객(registered customer): 그때까지 한 번이라도 활동한 누적 고객. 떠난 고객도 빠지지 않아 늘기만 한다.">등록 고객</a>은 그 기간 끝까지 데이터 안에서 첫 구매가 있었던 고객이고, 데이터가 2009년 12월에 시작하므로 그 이전 고객의 첫 구매는 실제보다 늦게 잡힙니다. 활성일은 고객과 날짜의 조합 수입니다. 서두의 두 보고서는 설명을 위해 만든 가상 예시입니다. 고객 단위 원본은 싣지 않았습니다. 코드 실행 환경은 Python 3.12, pandas 3.0.6입니다.</p>
