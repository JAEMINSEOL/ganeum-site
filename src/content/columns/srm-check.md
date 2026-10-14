---
title: "두 그룹 인원이 안 맞습니다"
description: "SRM, 배정이 틀어졌다는 증거"
date: 2026-10-15T06:55:00+09:00
tags: ["SRM", "배정", "데이터 품질"]
draft: false
---
<blockquote><p><strong>50:50으로 설계한 실험에서 A안 50,600명, B안 49,400명이 나왔다면 1.2%p 차이가 아니라 우연으로는 1만 번에 한두 번 나올 결과입니다. 전환율 비교는 뒤로 미루고 배정부터 확인해야 합니다.</strong></p></blockquote>

## 들어가며

<p>실험 대시보드의 첫 줄은 보통 그룹별 인원입니다. 대부분 눈길을 주지 않고 바로 아래 전환율로 내려갑니다. A안 50,600명, B안 49,400명. 그리고 B안 전환율이 5% 높고 유의합니다. 채택해도 될까요.</p>
<p>첫 줄을 건너뛰면 안 되는 이유가 이번 글의 내용입니다. 인원 차이가 우연으로 얼마나 벌어질 수 있는지 먼저 세어 봅니다. 이어서 한 줄로 검정하는 법, 배정이 틀어지는 원인, 틀어진 배정이 전환율 비교를 어떻게 기울이는지를 봅니다.</p>

## 인원 차이는 우연으로 얼마나 벌어지나

<p>유저를 동전 던지듯 50:50으로 나누면 두 그룹 인원이 정확히 같을 수는 없습니다. 그러나 벌어질 수 있는 폭은 정해져 있습니다. 총 인원이 n명이면 한 그룹 인원의 표준편차는 √(n × 0.25)입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>총 인원</th><th>표준편차</th><th>우연으로 나올 수 있는 범위 (±2SD)</th><th>비율로 보면</th></tr></thead>
<tbody>
<tr><td>2,000명</td><td>22명</td><td>955 ~ 1,045명</td><td>47.76% ~ 52.24%</td></tr>
<tr><td>20,000명</td><td>71명</td><td>9,859 ~ 10,141명</td><td>49.29% ~ 50.71%</td></tr>
<tr><td>100,000명</td><td>158명</td><td>49,684 ~ 50,316명</td><td>49.68% ~ 50.32%</td></tr>
<tr><td>200,000명</td><td>224명</td><td>99,553 ~ 100,447명</td><td>49.78% ~ 50.22%</td></tr>
<tr><td>2,000,000명</td><td>707명</td><td>998,586 ~ 1,001,414명</td><td>49.93% ~ 50.07%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 50:50 배정에서 한 그룹의 인원이 우연으로 흔들리는 폭. 범위 밖은 100번에 5번 미만으로 나옵니다.</p>
<p>총 100,000명이면 한 그룹은 49,684명에서 50,316명 사이에 들어와야 정상입니다. 50,600명은 상한보다 284명 많고, 표준편차로 재면 3.8배 떨어져 있습니다. 비율로는 50.6%라 사소해 보이지만, 인원이 많을수록 허용되는 폭이 좁아지기 때문에 1.2%p는 이미 큰 차이입니다.</p>
<blockquote><p>인원 차이의 크기는 퍼센트가 아니라 표준편차 몇 배인지로 읽어야 합니다.</p></blockquote>

## 한 줄로 검정합니다

<p>관측 인원이 설계 비율과 맞는지는 카이제곱 적합도 검정으로 봅니다. 이 검정에서 p값이 작으면 배정이 설계와 다르다는 뜻이고, 이 현상을 SRM(sample ratio mismatch, 표본 비율 불일치)이라고 부릅니다.</p>

```python
from scipy.stats import chisquare

observed = [50_600, 49_400]          # A안, B안에 배정된 유저 수
stat, p = chisquare(observed)        # 기대값은 50:50
print(f"카이제곱 {stat:.2f}, p = {p:.5f}")
# 카이제곱 14.40, p = 0.00015
```

<div class="table-scroll">
<table>
<thead><tr><th>A안 / B안</th><th>차이</th><th>표준편차 배수</th><th>p값</th><th>판정</th></tr></thead>
<tbody>
<tr><td>50,120 / 49,880</td><td>240명</td><td>0.8</td><td>0.45</td><td>정상</td></tr>
<tr><td>50,300 / 49,700</td><td>600명</td><td>1.9</td><td>0.058</td><td>정상이지만 다음 날 다시 본다</td></tr>
<tr><td>50,600 / 49,400</td><td>1,200명</td><td>3.8</td><td>0.00015</td><td>SRM. 결과를 쓰지 않는다</td></tr>
<tr><td>52,000 / 48,000</td><td>4,000명</td><td>12.6</td><td>10<sup>−36</sup></td><td>SRM. 배정 로직 자체를 의심한다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 총 100,000명, 설계 50:50일 때 사례별 검정 결과. 설명을 위해 만든 가상 예시입니다.</p>
<p>기준은 보통의 0.05가 아니라 <strong>0.001</strong>을 씁니다<sup class="fn"><a href="#ref-2" title="Kohavi, Tang & Xu (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[2]</a></sup>. 인원은 실험 기간 내내 매일 확인하고, 한 조직이 돌리는 실험은 수십 개라서 0.05를 쓰면 가짜 경보가 잦아집니다. 0.001이면 정상 실험 1,000개 중 1개꼴로만 잘못 울립니다. 반대로 두 번째 줄처럼 0.058이 나왔다면 당장 멈출 일은 아니지만, 다음 날 인원이 더 쌓였을 때 한 번 더 봅니다.</p>
<blockquote><p>SRM 검정은 코드 두 줄이고, 기준은 0.05가 아니라 0.001입니다.</p></blockquote>

## 배정이 틀어지는 원인

<p>SRM은 통계 현상이 아니라 시스템 어딘가가 고장 났다는 결과입니다. 원인은 배정 단계와 기록 단계 둘 중 하나에 있습니다<sup class="fn"><a href="#ref-1" title="Fabijan et al. (2019). Diagnosing sample ratio mismatch in online controlled experiments. KDD '19, 2156–2164.">[1]</a></sup>.</p>
<div class="table-scroll">
<table>
<thead><tr><th>단계</th><th>원인</th><th>어떻게 드러나나</th></tr></thead>
<tbody>
<tr><td>배정</td><td>해시 함수가 특정 ID 패턴에 치우친다</td><td>실험 첫날부터 비율이 어긋난다</td></tr>
<tr><td>배정</td><td>봇이나 크롤러가 한쪽으로만 들어간다</td><td>특정 국가나 기기에서만 비율이 어긋난다</td></tr>
<tr><td>배정</td><td>리다이렉트가 한쪽만 느려 유저가 이탈한다</td><td>느린 쪽 인원이 적고, 남은 유저의 성과는 좋아 보인다</td></tr>
<tr><td>기록</td><td>한쪽에서만 앱이 더 자주 죽어 로그가 안 남는다</td><td>크래시율이 높은 기기에서 비율이 어긋난다</td></tr>
<tr><td>기록</td><td>데이터 파이프라인 필터가 한쪽 이벤트를 더 걸러 낸다</td><td>원천 로그와 마트 인원이 다르다</td></tr>
<tr><td>기록</td><td>실험 도중 배정 규칙을 바꿔 일부 유저가 양쪽에 다 찍힌다</td><td>규칙을 바꾼 날부터 비율이 변한다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 자주 나오는 SRM 원인. 어느 세그먼트에서 비율이 어긋나는지가 원인을 좁히는 단서입니다.</p>
<p>원인을 찾는 순서는 세그먼트별 인원 비율입니다. 전체에서는 50.6:49.4인데 iOS에서만 55:45라면 iOS 쪽 배정이나 로그를 봅니다. 날짜별로 잘라서 어느 날부터 어긋났는지 보면 배포 이력과 맞춰 볼 수 있습니다.</p>
<blockquote><p>SRM은 고칠 통계가 아니라 찾아야 할 고장이고, 세그먼트별 인원 비율이 고장의 위치를 알려 줍니다.</p></blockquote>

## 인원이 빠지면 결과가 기웁니다

<p>SRM이 있을 때 전환율 비교를 왜 쓸 수 없는지 숫자로 보겠습니다. 유저의 30%는 저활동 유저(전환율 1%), 70%는 일반 유저(전환율 6.71%)이고, 전체 전환율은 5.00%입니다. A안과 B안의 실제 효과는 같습니다. 다만 B안에서 앱이 더 자주 죽어서 <strong>저활동 유저의 로그 20%가 기록되지 않는다</strong>고 해 보겠습니다.</p>
<figure>
<svg viewBox="0 0 620 175" role="img" aria-label="A안과 B안의 유저 구성. B안에서 저활동 유저가 줄어 전환율이 높아 보인다" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor">
<text x="100" y="70" text-anchor="end">A안</text>
<rect x="110" y="50" width="238" height="30" fill="none" stroke="currentColor"/>
<rect x="348" y="50" width="102" height="30" fill="currentColor"/>
<text x="460" y="70">100,000명 / 전환율 5.00%</text>
<text x="100" y="120" text-anchor="end">B안</text>
<rect x="110" y="100" width="238" height="30" fill="none" stroke="currentColor"/>
<rect x="348" y="100" width="82" height="30" fill="currentColor"/>
<text x="440" y="120">94,000명 / 전환율 5.25%</text>
<rect x="110" y="150" width="14" height="12" fill="none" stroke="currentColor"/>
<text x="130" y="161">일반 유저 (전환율 6.71%)</text>
<rect x="320" y="150" width="14" height="12" fill="currentColor"/>
<text x="340" y="161">저활동 유저 (전환율 1%)</text>
</g>
</svg>
<figcaption>그림 4. B안에서 저활동 유저 로그 20%가 빠지면 인원은 94,000명이 되고 전환율은 5.25%로 올라갑니다. 실제 효과는 0입니다. 설명을 위해 만든 가상 예시입니다.</figcaption>
</figure>
<p>B안에 남은 유저는 94,000명이고 전환율은 5.25%입니다. A안 5.00%보다 0.26%p, 상대로 5.1% 높습니다. 효과가 없는데 효과가 보입니다. 전환율이 낮은 유저가 B안에서만 빠졌기 때문입니다. 이 상황을 그룹당 50,000명으로 1만 번 시뮬레이션하면 SRM 검정은 100%에서 p &lt; 0.001로 잡아냅니다. 전환율 차이는 43.8%의 실험에서 B안이 유의하게 높게 나옵니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>저활동 유저 로그 유실</th><th>배정 비율 (A : B)</th><th>B안 전환율</th><th>가짜 상대 효과</th></tr></thead>
<tbody>
<tr><td>5%</td><td>100 : 98.5</td><td>5.06%</td><td>+1.2%</td></tr>
<tr><td>10%</td><td>100 : 97</td><td>5.12%</td><td>+2.5%</td></tr>
<tr><td>20%</td><td>100 : 94</td><td>5.25%</td><td>+5.1%</td></tr>
<tr><td>30%</td><td>100 : 91</td><td>5.39%</td><td>+7.9%</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 유실 비율에 따른 가짜 효과. 유실이 어느 집단에 몰리느냐에 따라 방향은 반대가 될 수도 있습니다.</p>
<p>유실이 저활동 유저에 몰리면 B안이 좋아 보이고, 고활동 유저에 몰리면 나빠 보입니다. 어느 쪽인지 모르는 채로는 보정도 못 합니다. 그래서 SRM이 있는 실험의 전환율 비교는 방향도 크기도 믿을 수 없고, 보고서에 싣지 않습니다.</p>
<blockquote><p>빠진 유저가 무작위가 아니면 남은 유저의 비교는 실험이 아니라 선택된 표본의 비교입니다.</p></blockquote>

## 발견했을 때

<div class="table-scroll">
<table>
<thead><tr><th>순서</th><th>할 일</th><th>하지 않을 일</th></tr></thead>
<tbody>
<tr><td>1</td><td>실험을 멈추고 결과 공유를 보류한다</td><td>전환율이 유리하니 일단 공유하기</td></tr>
<tr><td>2</td><td>세그먼트별(OS, 국가, 신규와 기존, 날짜) 인원 비율을 본다</td><td>전체 비율만 보고 원인을 추측하기</td></tr>
<tr><td>3</td><td>원천 로그와 분석 마트의 인원을 대조한다</td><td>마트 숫자만으로 판단하기</td></tr>
<tr><td>4</td><td>배포 이력과 어긋나기 시작한 날짜를 맞춰 본다</td><td>통계적 보정으로 넘어가기</td></tr>
<tr><td>5</td><td>원인을 고친 뒤 새로 배정해 다시 돌린다</td><td>어긋난 데이터에서 일부만 잘라 쓰기</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 6. SRM을 발견했을 때의 절차.</p>
<p>다섯 번째가 자주 생략됩니다. 원인을 찾았으니 어긋난 기간만 빼고 분석하자는 제안이 나옵니다. 그러나 유실이 언제부터 어느 집단에서 있었는지 완전히 알 수 없다면, 잘라 낸 데이터도 같은 편향을 품고 있습니다. 배정을 새로 하는 것이 가장 싼 방법입니다.</p>
<blockquote><p>SRM이 확인된 실험의 결론은 보류가 아니라 폐기이고, 다음 실험이 그 결론을 대신합니다.</p></blockquote>

## 나가며

<ol>
<li>50:50 배정에서 총 100,000명이면 한 그룹 인원은 49,684명에서 50,316명 사이에 들어와야 합니다. 50,600명은 표준편차의 3.8배 밖이고, 카이제곱 검정 p = 0.00015입니다.</li>
<li>SRM 검정은 코드 두 줄이고 기준은 0.001입니다. 매일 확인하고, 어긋나면 세그먼트별 비율로 고장 위치를 찾습니다.</li>
<li>B안에서 저활동 유저 로그 20%만 빠져도 효과가 없는 실험에서 상대 +5.1%가 나오고, 시뮬레이션의 43.8%에서 유의하게 나왔습니다. SRM이 있는 실험의 전환율 비교는 보고서에 싣지 않습니다.</li>
</ol>

## 참고

<ol>
<li id="ref-1">Fabijan, A., Gupchup, J., Gupta, S., Omhover, J., Qin, W., Vermeer, L., &amp; Dmitriev, P. (2019). Diagnosing sample ratio mismatch in online controlled experiments: A taxonomy and rules of thumb for practitioners. <em>KDD ’19</em>, 2156–2164. https://doi.org/10.1145/3292500.3330722</li>
<li id="ref-2">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
</ol>
<p class="refs">본문의 모든 수치는 설명을 위해 만든 가상 예시를 직접 계산한 값입니다. 인원의 표준편차는 이항분포 √(n × 0.5 × 0.5)로, SRM 검정은 카이제곱 적합도 검정(자유도 1)으로 구했습니다. 로그 유실 시뮬레이션은 그룹당 50,000명, 1만 회, 시드 2026 기준이며 전환율 비교는 두 비율 z검정(양측, α = 0.05)입니다. 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1입니다.</p>
