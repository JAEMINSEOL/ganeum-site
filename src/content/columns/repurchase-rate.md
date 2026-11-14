---
title: "재구매율은 어떻게 세야 할까?"
description: "기간, 고객 단위, 환불 처리에 따라 달라지는 값"
date: 2026-11-24T00:00:00+09:00
tags: ["재구매율", "코호트", "지표 정의", "리텐션"]
draft: false
---
<blockquote><p><strong>같은 거래 데이터에서 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 15.0%부터 64.4%까지 나옵니다. 숫자가 틀린 것이 아니라 기간, 고객 범위, 구매 한 번의 단위, 환불 처리가 다를 뿐입니다. 이 네 가지를 먼저 정하면 비교할 수 있는 숫자가 됩니다.</strong></p></blockquote>

## 들어가며

<p>마케팅팀 보고서에는 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>이 64%라고 적혀 있고, 대표가 다른 회사 발표에서 들은 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 35%입니다. 우리가 두 배 가까이 잘하고 있다는 말이 나옵니다. 두 숫자가 같은 것을 센 것인지는 아무도 확인하지 않았습니다.</p>
<p><strong><a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>을 셀 때 먼저 정해야 하는 것은 무엇일까요?</strong></p>
<p>이 글은 공개된 소매 거래 데이터 하나를 놓고, 기간과 고객 범위와 구매 한 번의 단위와 환불 처리를 바꿔 가며 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>이 얼마나 달라지는지 셉니다. 그다음 덜 찬 <a class="term" href="#term-window" data-tip="관찰 창(observation window): 첫 구매 뒤 재구매를 세는 기간. 창이 다 차지 않은 고객은 아직 셀 수 없다.">관찰 창</a>이 만드는 착시를 보고, 비교할 수 있는 정의 문장을 어떻게 적는지 정리하겠습니다.</p>

## 기간을 정하지 않으면 숫자가 없습니다

<p>영국 온라인 소매점의 2009년 12월부터 2011년 12월까지 거래에서, 2010년 12월부터 2011년 5월 사이에 처음 산 고객 667명을 따라가 보겠습니다. 이 고객들이 첫 구매 뒤 며칠 안에 두 번째 주문을 했는지 세면 그림 1이 됩니다.</p>
<p><a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 기간을 길게 잡을수록 올라갑니다. 30일 안에는 15.0%, 90일 안에는 35.5%, 180일 안에는 50.4%, 1년 안에는 적어도 60.0%입니다. 기간이 적혀 있지 않은 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 이 가운데 어느 값인지 알 수 없습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>첫 구매 뒤 <a class="term" href="#term-window" data-tip="관찰 창(observation window): 첫 구매 뒤 재구매를 세는 기간. 창이 다 차지 않은 고객은 아직 셀 수 없다.">관찰 창</a></th><th>재구매 고객</th><th><a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a></th></tr></thead>
<tbody>
<tr><td>30일</td><td>100명</td><td>15.0%</td></tr>
<tr><td>60일</td><td>183명</td><td>27.4%</td></tr>
<tr><td>90일</td><td>237명</td><td>35.5%</td></tr>
<tr><td>180일</td><td>336명</td><td>50.4%</td></tr>
<tr><td>365일</td><td>400명</td><td>60.0%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 2010년 12월부터 2011년 5월 사이 첫 구매 고객 667명의 <a class="term" href="#term-window" data-tip="관찰 창(observation window): 첫 구매 뒤 재구매를 세는 기간. 창이 다 차지 않은 고객은 아직 셀 수 없다.">관찰 창</a>별 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>. 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>은 제외하고 구매 일자 기준으로 셌습니다. 데이터가 2011년 12월 9일에 끝나므로 2010년 12월 10일 이후 첫 구매 고객은 365일 창이 다 차지 않았고, 365일 값은 하한입니다.</p>
<details class="code"><summary>검증 코드 보기</summary>

```python
import pandas as pd

d = pd.concat(pd.read_excel("online_retail_II.xlsx", sheet_name=None).values(), ignore_index=True)
d = d.dropna(subset=["Customer ID"]).copy()
d["cid"] = d["Customer ID"].astype(int)
d["day"] = d.InvoiceDate.dt.normalize()
d["cancel"] = d.Invoice.astype(str).str.startswith("C")
inv = d.groupby(["cid", "Invoice", "day", "cancel"], as_index=False).size()
buy = inv[~inv.cancel]                                   # 취소 송장 제외
first = buy.groupby("cid").day.min().rename("first")
cohort = first[(first >= "2010-12-01") & (first <= "2011-05-31")]
b = buy[buy.cid.isin(cohort.index)].merge(cohort, on="cid")
b["gap"] = (b.day - b["first"]).dt.days
n = len(cohort)
for w in (30, 60, 90, 180, 365):
    rep = b[(b.gap > 0) & (b.gap <= w)].cid.nunique()
    print(f"{w:>3}일 안 재구매 {rep:,}명 = {rep/n*100:.1f}%")
# 신규 고객 667명
#  30일 안 재구매 100명 = 15.0%
#  60일 안 재구매 183명 = 27.4%
#  90일 안 재구매 237명 = 35.5%
# 180일 안 재구매 336명 = 50.4%
# 365일 안 재구매 400명 = 60.0%
```

</details>
<blockquote><p><strong><a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 첫 구매 뒤 며칠 안인지가 붙어야 숫자가 됩니다. 같은 고객 667명이 30일이면 15.0%, 1년이면 60.0% 이상입니다.</strong></p></blockquote>

## 누구의 재구매율인지에 따라 다릅니다

<p>서두의 64%는 다른 방식으로 센 값입니다. 2011년에 한 번이라도 산 고객 4,220명 가운데 2011년 안에 두 번 이상 산 고객의 비율이 64.4%입니다. 첫 구매를 기준으로 따라간 것이 아니라 달력 1년을 잘라서 센 것입니다.</p>
<p>이 방식은 오래된 고객과 새 고객을 섞습니다. 4,220명 가운데 63.6%는 2010년이나 그 전에 처음 산 고객이고, 이들의 2회 이상 구매 비율은 70.6%입니다. 2011년에 처음 산 고객만 보면 53.5%입니다. 단골이 많은 해일수록 달력 방식의 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 올라가고, 신규 유입이 많은 해일수록 내려갑니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>세는 방식</th><th>분모</th><th>재구매 기준</th><th><a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a></th></tr></thead>
<tbody>
<tr><td>달력 1년</td><td>2011년 구매 고객 4,220명</td><td>2011년 안에 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 2건 이상</td><td>64.4%</td></tr>
<tr><td>달력 1년, 기존 고객만</td><td>그중 2010년 이전 첫 구매 2,684명</td><td>같음</td><td>70.6%</td></tr>
<tr><td>달력 1년, 신규 고객만</td><td>그중 2011년 첫 구매 1,536명</td><td>같음</td><td>53.5%</td></tr>
<tr><td>첫 구매 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a></td><td>2010년 12월부터 2011년 5월 첫 구매 667명</td><td>첫 구매 뒤 180일 안 재구매</td><td>50.4%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 같은 데이터에서 분모를 바꿨을 때의 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>. 달력 방식은 기존 고객의 비중에 따라 움직입니다.</p>
<p>달력 방식이 틀린 것은 아닙니다. 올해 고객 기반이 얼마나 반복 구매로 이루어졌는지를 보는 데는 맞는 숫자입니다. 다만 신규 고객이 다시 오는지를 묻는 질문에는 첫 구매 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 방식이 답이고, 두 방식의 숫자를 서로 비교하면 안 됩니다.</p>
<blockquote><p><strong>달력 방식의 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 기존 고객의 비중을 함께 재고, <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 방식은 신규 고객이 다시 오는지만 잽니다. 질문에 맞는 쪽을 고르고, 둘을 서로 비교하지 않습니다.</strong></p></blockquote>

## 구매 한 번의 단위를 정합니다

<p>재구매는 두 번째 구매가 있다는 뜻인데, 무엇이 한 번인지가 파일마다 다릅니다. 예시 파일은 한 행이 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 안의 품목 한 줄입니다. 행 수를 구매 횟수로 세면 품목을 두 가지 산 고객이 전부 재구매 고객이 되고, 180일 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 96.1%가 됩니다.</p>
<p><a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 단위로 세면 51.6%, 구매 일자 단위로 세면 50.4%입니다. 두 값의 차이는 같은 날 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>을 두 장 끊은 고객 8명입니다. 장바구니를 나눠 결제한 것을 재구매로 볼지는 사업마다 다르므로, 어느 쪽인지 정의에 적습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>한 번의 단위</th><th>180일 안 2회 이상</th><th>비고</th></tr></thead>
<tbody>
<tr><td>품목 행</td><td>96.1%</td><td>품목 두 가지를 한 번에 사도 재구매로 셈. 잘못 센 값</td></tr>
<tr><td><a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a></td><td>51.6%</td><td>같은 날 두 장 끊은 고객 8명 포함</td></tr>
<tr><td>구매 일자</td><td>50.4%</td><td>같은 날 주문은 한 번으로 셈</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 구매 한 번의 단위에 따른 180일 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>. 첫 구매 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 667명, 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 제외.</p>
<blockquote><p><strong>구매 한 번은 품목 행이 아니라 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>이나 구매 일자입니다. 행 수로 세면 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>이 96.1%로 나옵니다.</strong></p></blockquote>

## 환불을 어떻게 다루는지도 정합니다

<p>예시 파일에는 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>이 따로 있습니다. <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 번호가 C로 시작하고 수량이 음수입니다. <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 667명 가운데 189명(28.3%)이 180일 안에 취소를 한 번 이상 했습니다. 이 취소를 어떻게 다루느냐에 따라 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>이 셋으로 갈립니다.</p>
<p>취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>을 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 수에 그대로 넣으면 57.7%입니다. 취소가 구매로 세어진 잘못된 값입니다. 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>을 빼면 51.6%이고, 취소 금액만큼 원래 주문을 지워 환불로 사라진 구매까지 빼면 50.8%입니다. 마지막 방식이 가장 보수적이고, 환불이 잦은 사업일수록 둘째와 셋째의 차이가 커집니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>환불 처리</th><th>180일 안 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 2건 이상</th><th>비고</th></tr></thead>
<tbody>
<tr><td>취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>을 구매로 셈</td><td>57.7%</td><td>잘못 센 값. 취소가 많은 고객일수록 재구매 고객이 됨</td></tr>
<tr><td>취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 제외</td><td>51.6%</td><td>환불된 원래 주문은 구매로 남음</td></tr>
<tr><td>환불로 상쇄된 주문까지 제외</td><td>50.8%</td><td>취소 금액만큼 큰 주문부터 지움. 가장 보수적</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 처리에 따른 180일 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>. 첫 구매 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 667명, <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 단위. 셋째 행은 취소와 원래 주문을 잇는 정보가 없어 금액으로 상쇄한 근사값입니다.</p>
<blockquote><p><strong>취소나 환불은 구매 횟수에서 빼야 하고, 환불로 사라진 원래 주문을 어디까지 뺄지도 정의에 적습니다. 처리에 따라 57.7%, 51.6%, 50.8%가 됩니다.</strong></p></blockquote>

## 덜 찬 창은 최근 고객을 나쁘게 보이게 합니다

<p><a class="term" href="#term-window" data-tip="관찰 창(observation window): 첫 구매 뒤 재구매를 세는 기간. 창이 다 차지 않은 고객은 아직 셀 수 없다.">관찰 창</a>을 180일로 정했다면, 첫 구매 뒤 180일이 지나지 않은 고객은 아직 셀 수 없습니다. 그림 5는 첫 구매 월별 180일 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>입니다. 2011년 6월 이후 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>는 데이터가 2011년 12월 9일에 끝나서 창이 덜 찼고, 10월 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>는 41.6%, 11월 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>는 25.5%로 보입니다.</p>
<p>이 하락은 최근 고객이 나빠서가 아니라 아직 180일을 기다리지 않았기 때문입니다. 11월 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>의 마지막 고객은 9일밖에 관찰되지 않았습니다. 월별 추이를 보고할 때는 창이 다 찬 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>까지만 싣고, 덜 찬 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>는 창을 짧게 바꿔 따로 봅니다. 리텐션에서 같은 문제를 다룬 글이 <a href="https://data-ganeum.com/columns/retention-definitions/">10편</a>입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>첫 구매 월</th><th>신규 고객</th><th>180일 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a></th><th>창 상태</th></tr></thead>
<tbody>
<tr><td>2011-03</td><td>179명</td><td>53.6%</td><td>다 참</td></tr>
<tr><td>2011-04</td><td>106명</td><td>54.7%</td><td>다 참</td></tr>
<tr><td>2011-05</td><td>111명</td><td>55.9%</td><td>다 참</td></tr>
<tr><td>2011-06</td><td>108명</td><td>60.2%</td><td>덜 참 (마지막 고객 162일 관찰)</td></tr>
<tr><td>2011-07</td><td>102명</td><td>69.6%</td><td>덜 참 (131일)</td></tr>
<tr><td>2011-08</td><td>106명</td><td>58.5%</td><td>덜 참 (100일)</td></tr>
<tr><td>2011-09</td><td>189명</td><td>54.0%</td><td>덜 참 (70일)</td></tr>
<tr><td>2011-10</td><td>221명</td><td>41.6%</td><td>덜 참 (39일)</td></tr>
<tr><td>2011-11</td><td>192명</td><td>25.5%</td><td>덜 참 (9일)</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 첫 구매 월별 180일 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>. 데이터가 2011년 12월 9일에 끝나므로 6월 이후 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>는 창이 덜 찼습니다. 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 제외, 구매 일자 기준.</p>
<p>이제 비교할 수 있는 정의 문장을 적을 수 있습니다. 첫 구매 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>, 180일 창, 구매 일자 단위, 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a> 제외로 정하면 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a> 50.4%입니다. 이 문장이 붙어 있으면 다른 회사의 35%가 같은 것을 센 것인지, 아니면 30일 창의 값인지 물을 수 있습니다.</p>
<blockquote><p><strong><a class="term" href="#term-window" data-tip="관찰 창(observation window): 첫 구매 뒤 재구매를 세는 기간. 창이 다 차지 않은 고객은 아직 셀 수 없다.">관찰 창</a>이 덜 찬 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>의 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 낮게 보일 뿐 낮은 것이 아닙니다. 정의 문장에는 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 범위, 창 길이, 구매 한 번의 단위, 환불 처리 네 가지를 적습니다.</strong></p></blockquote>

## 나가며

<ol>
<li>같은 데이터에서 <a class="term" href="#term-repurchase" data-tip="재구매율(repurchase rate): 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율. 범위, 기간, 단위가 정의에 들어가야 한다.">재구매율</a>은 30일 창 15.0%부터 달력 1년 방식 64.4%까지 나옵니다. 기간과 고객 범위가 다를 뿐 어느 쪽도 틀리지 않았고, 서로 비교할 수 없을 뿐입니다.</li>
<li>구매 한 번은 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>이나 구매 일자로 세고, 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>은 구매 횟수에서 뺍니다. 품목 행으로 세면 96.1%, 취소를 구매로 세면 57.7%가 나옵니다.</li>
<li><a class="term" href="#term-window" data-tip="관찰 창(observation window): 첫 구매 뒤 재구매를 세는 기간. 창이 다 차지 않은 고객은 아직 셀 수 없다.">관찰 창</a>이 덜 찬 최근 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a>는 보고에서 빼거나 창을 짧게 바꿔 따로 봅니다. 정의 문장은 <a class="term" href="#term-cohort" data-tip="코호트(cohort): 같은 시기에 같은 일을 처음 한 고객의 묶음. 이 글에서는 같은 달에 처음 구매한 고객.">코호트</a> 범위, 창 길이, 단위, 환불 처리 네 가지로 적습니다.</li>
</ol>

## 용어

<ul>
<li id="term-repurchase"><strong>재구매율(repurchase rate)</strong>: 정한 범위의 고객 가운데 정한 기간 안에 두 번 이상 구매한 고객의 비율입니다. 범위와 기간과 구매 한 번의 단위가 정의에 들어가야 합니다.</li>
<li id="term-cohort"><strong>코호트(cohort)</strong>: 같은 시기에 같은 일을 처음 한 고객의 묶음입니다. 이 글에서는 같은 달에 처음 구매한 고객입니다.</li>
<li id="term-window"><strong>관찰 창(observation window)</strong>: 첫 구매 뒤 재구매를 세는 기간입니다. 창이 다 차지 않은 고객은 아직 셀 수 없습니다.</li>
<li id="term-invoice"><strong>송장(invoice)</strong>: 한 번의 주문에 붙는 번호입니다. 예시 파일에서는 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소입니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Chen, D. (2012). <em>Online Retail II</em> [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5CG6D</li>
</ol>
<p class="refs">데이터는 Chen, D. (2012). Online Retail II [Dataset]. UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D (CC BY 4.0)의 원본 파일 두 시트를 합쳐 고객 ID가 있는 행만 썼습니다. 첫 구매는 취소가 아닌 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>의 가장 이른 날짜이고, 데이터가 2009년 12월 1일에 시작하므로 2010년 12월 이후 첫 구매는 최소 12개월 동안 구매 기록이 없던 고객입니다. 그림 4 셋째 행은 취소 <a class="term" href="#term-invoice" data-tip="송장(invoice): 한 번의 주문에 붙는 번호. 품목 여러 줄이 송장 하나에 묶이고, C로 시작하면 취소.">송장</a>이 원래 주문과 연결되지 않아, 고객별 취소 금액 합만큼 큰 주문부터 지우는 방식으로 근사했습니다. 서두의 두 보고서는 가상 예시입니다. 코드 실행 환경은 Python 3.12, pandas 3.1.1, openpyxl 3.1.5입니다.</p>
