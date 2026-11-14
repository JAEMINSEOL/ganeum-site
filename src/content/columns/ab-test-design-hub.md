---
title: "A/B 테스트 설계 한 장 정리"
description: "가설, 표본 수, 판정 시점을 실험 전에 적는 법"
date: 2026-11-12T00:00:00+09:00
tags: ["A/B 테스트", "실험 설계", "표본 수", "판정 시점"]
draft: false
---
<blockquote><p><strong>실험을 시작하기 전에 설계서 한 장을 적어 두면, 결과를 본 뒤에 기준을 바꾸는 실수 대부분을 막을 수 있습니다. 이 글은 앞서 쓴 칼럼 열두 편을 설계서의 네 칸으로 묶습니다.</strong></p></blockquote>

## 들어가며

<p>새 온보딩 화면 B를 신규 유저 절반에게 배포했습니다. 2주 뒤 보고서에는 D1 리텐션은 차이가 없고, iOS 결제 전환이 유의하게 올랐으니 B를 채택하자고 적혀 있습니다. 실험을 시작할 때 정해 둔 것은 배포 비율 50% 하나뿐이었습니다.</p>
<p><strong>실험을 시작하기 전에 설계서에 무엇을 적어 두어야 할까요?</strong></p>
<p>이 글은 설계서를 가설, 표본 수, 판정 시점, 판정 규칙의 네 칸으로 나누고, 각 칸을 앞서 쓴 글의 결론으로 채웁니다. 자세한 계산과 근거는 각 글에 있고, 여기서는 설계서에 적을 문장과 숫자만 다룹니다. 마지막에 가상 앱의 설계서 한 장을 채워 보겠습니다.</p>

## 가설은 지표와 방향과 크기까지 적습니다

<p>설계서의 첫 칸은 가설입니다. 가설은 B가 더 좋을 것이다가 아니라, B는 A보다 어떤 지표를 어느 방향으로 얼마나 바꾼다는 문장이어야 합니다. 지표 하나, 방향 하나, 크기 하나가 들어가야 다음 칸의 표본 수와 판정 규칙이 정해집니다.</p>
<p>지표는 세 종류로 나눠 적습니다. <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>는 실험의 성패를 가르는 지표이고 하나만 둡니다. <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일 지표</a>는 좋아질 필요는 없지만 나빠지면 안 되는 지표입니다. 보조 지표는 결과를 해석할 때 참고하는 지표이고, 판정에는 쓰지 않습니다<sup class="fn"><a href="#ref-1" title="Kohavi, R., Tang, D., &amp; Xu, Y. (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[1]</a></sup>.</p>
<p><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>를 하나로 두는 이유는 다중 비교 때문입니다. 지표 10개를 각각 5% 기준으로 보면 효과가 전혀 없어도 하나쯤은 유의하게 나옵니다. 서두의 보고서처럼 iOS 결제 전환이 유의했다는 결과는 설계서에 그 지표와 그 세그먼트가 적혀 있지 않았다면 발견이 아니라 다음 실험의 후보입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>칸</th><th>적을 것</th><th>예시</th><th>근거가 되는 글</th></tr></thead>
<tbody>
<tr><td>가설</td><td>지표, 방향, 크기가 든 한 문장</td><td>B는 A보다 D7 리텐션을 +2%p 이상 올린다</td><td><a href="https://data-ganeum.com/columns/p-value-in-business/">1편</a></td></tr>
<tr><td><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a></td><td>하나. 정의와 분모까지</td><td>D7 리텐션 (설치 후 7일째 하루 접속 / 설치자)</td><td><a href="https://data-ganeum.com/columns/retention-definitions/">10편</a>, <a href="https://data-ganeum.com/columns/per-capita-denominator/">12편</a></td></tr>
<tr><td><a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일 지표</a></td><td>나빠지면 채택하지 않는 지표와 허용 폭</td><td>D1 리텐션 −1%p 이상 하락하면 채택 안 함</td><td><a href="https://data-ganeum.com/columns/confidence-interval-verdict/">4편</a></td></tr>
<tr><td>보조 지표</td><td>해석용. 판정에 쓰지 않음</td><td>온보딩 완료율, 첫 세션 길이</td><td><a href="https://data-ganeum.com/columns/multiple-comparisons/">5편</a></td></tr>
<tr><td>세그먼트</td><td>판정에 쓸 세그먼트를 미리 지정. 없으면 전체만</td><td>전체만. OS별은 참고</td><td><a href="https://data-ganeum.com/columns/multiple-comparisons/">5편</a></td></tr>
<tr><td>매출 지표의 처리</td><td>상위 값 처리 방법을 결과 보기 전에 고정</td><td>인당 매출은 99분위 윈저라이즈, 원본도 함께 보고</td><td><a href="https://data-ganeum.com/columns/outlier-and-whales/">13편</a></td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 1. 설계서의 가설 칸. 예시는 설명을 위해 만든 가상 앱의 값입니다.</p>
<blockquote><p><strong><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>는 하나이고 결과를 본 뒤에 바꾸지 않습니다. 설계서에 없던 지표와 세그먼트가 유의하게 나오면 발견이 아니라 다음 실험의 후보입니다.</strong></p></blockquote>

## 표본 수는 목표 효과가 정합니다

<p>두 번째 칸은 표본 수입니다. 표본 수는 네 가지 값에서 계산됩니다. 대조군의 현재 값, 잡고 싶은 최소 효과(<a class="term" href="#term-mde" data-tip="최소 검출 효과(MDE, minimum detectable effect): 이 실험으로 잡으려는 가장 작은 효과 크기. 표본 수 계산의 입력값.">MDE</a>), 유의수준, <a class="term" href="#term-power" data-tip="검정력(statistical power): 실제로 목표 효과만큼의 차이가 있을 때 검정이 그 차이를 유의하게 잡아낼 확률. 보통 80%.">검정력</a>입니다. 유의수준은 보통 양측 5%, <a class="term" href="#term-power" data-tip="검정력(statistical power): 실제로 목표 효과만큼의 차이가 있을 때 검정이 그 차이를 유의하게 잡아낼 확률. 보통 80%.">검정력</a>은 80%를 쓰고, 나머지 둘을 설계서에 적습니다<sup class="fn"><a href="#ref-2" title="Lakens, D. (2022). Sample Size Justification. Collabra: Psychology, 8(1), 33267.">[2]</a></sup>.</p>
<p>대조군 D7 리텐션이 20%인 앱에서 효과 크기에 따라 그룹당 몇 명이 필요한지 계산하면 그림 2와 같습니다. 잡으려는 효과가 절반으로 줄면 필요한 사람 수는 약 네 배로 늘어납니다. 하루 설치가 300명이면 +1%p를 잡는 데 171일이 걸리고, +2%p는 44일이 걸립니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>잡으려는 효과(<a class="term" href="#term-mde" data-tip="최소 검출 효과(MDE, minimum detectable effect): 이 실험으로 잡으려는 가장 작은 효과 크기. 표본 수 계산의 입력값.">MDE</a>)</th><th>그룹당 필요 인원</th><th>하루 300명 설치일 때 모집 기간</th></tr></thead>
<tbody>
<tr><td>+0.5%p (20% → 20.5%)</td><td>101,403명</td><td>677일</td></tr>
<tr><td>+1%p (20% → 21%)</td><td>25,583명</td><td>171일</td></tr>
<tr><td>+2%p (20% → 22%)</td><td>6,510명</td><td>44일</td></tr>
<tr><td>+3%p (20% → 23%)</td><td>2,943명</td><td>20일</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. 대조군 D7 리텐션 20%, 양측 유의수준 5%, <a class="term" href="#term-power" data-tip="검정력(statistical power): 실제로 목표 효과만큼의 차이가 있을 때 검정이 그 차이를 유의하게 잡아낼 확률. 보통 80%.">검정력</a> 80%일 때 그룹당 필요 인원. 두 비율 z검정 공식으로 계산했습니다.</p>

<details class="code"><summary>검증 코드 보기</summary>

```python
from scipy.stats import norm
import math

def n_per_group(p1, p2, alpha=0.05, power=0.8):
    za, zb = norm.ppf(1 - alpha / 2), norm.ppf(power)
    pbar = (p1 + p2) / 2
    num = za * math.sqrt(2 * pbar * (1 - pbar)) + zb * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
    return math.ceil(num ** 2 / (p2 - p1) ** 2)

base = 0.20                       # 대조군 D7 리텐션
for mde in (0.005, 0.01, 0.02, 0.03):
    n = n_per_group(base, base + mde)
    print(f"MDE +{mde*100:g}%p: 그룹당 {n:,}명, 하루 300명 설치(그룹당 150명)면 {math.ceil(n/150)}일")
# MDE +0.5%p: 그룹당 101,403명, 하루 300명 설치(그룹당 150명)면 677일
# MDE +1%p: 그룹당 25,583명, 하루 300명 설치(그룹당 150명)면 171일
# MDE +2%p: 그룹당 6,510명, 하루 300명 설치(그룹당 150명)면 44일
# MDE +3%p: 그룹당 2,943명, 하루 300명 설치(그룹당 150명)면 20일
```

</details>

<p>필요 인원을 채울 수 없을 때 할 수 있는 일은 세 가지입니다.</p>
<p>첫째, 잡으려는 효과를 키워 적습니다. 하루 300명인 앱이 두 달 안에 끝내야 한다면 +2%p보다 작은 효과는 이 실험으로 못 잡는다고 설계서에 씁니다.</p>
<p>둘째, 실험 전 데이터로 분산을 줄입니다. <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>가 매출이나 플레이 시간처럼 실험 전 값이 있는 지표라면 CUPED로 필요 인원을 줄일 수 있습니다. 자세한 방법은 <a href="https://data-ganeum.com/columns/cuped-variance-reduction/">9편</a>에 있습니다.</p>
<p>셋째, 결과를 본 뒤 관측된 효과로 필요 인원을 다시 계산하는 일은 하지 않습니다. 관측된 효과는 노이즈를 포함하고 있어서, 그 값으로 다시 계산한 필요 인원은 p값을 다른 말로 바꾼 것에 지나지 않습니다. 이 계산의 문제는 <a href="https://data-ganeum.com/columns/sample-size-mde/">3편</a>에서 다뤘습니다.</p>
<blockquote><p><strong>표본 수는 결과가 아니라 실험 전에 정한 목표 효과에서 나옵니다. 채울 수 없으면 사람을 더 모으는 대신, 이 실험으로 잡을 수 있는 효과 크기를 설계서에 고쳐 적습니다.</strong></p></blockquote>

## 판정 시점은 날짜로 적습니다

<p>세 번째 칸은 판정 시점입니다. 표본 수가 정해지면 모집 종료일이 나오지만, 판정일은 그보다 뒤입니다. <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>가 D7 리텐션이면 마지막으로 배정된 사람의 7일째 값이 들어와야 코호트가 다 찹니다. 덜 찬 코호트로 판정하면 뒤에 들어온 사람의 값이 빠진 채 비교하게 됩니다.</p>
<p>모집 기간은 7일의 배수로 맞춥니다. 요일마다 유입되는 유저의 구성이 달라서, 월요일에 시작해 수요일에 끝내면 두 그룹 모두 특정 요일이 더 많이 들어간 상태로 비교하게 됩니다. 그림 2의 +2%p 예시라면 44일을 49일로 늘려 적습니다.</p>
<figure>
<svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="배정 시작부터 판정일까지의 시간표" style="max-width:100%;height:auto">
<line x1="40" y1="95" x2="600" y2="95" stroke="currentColor" stroke-width="2"/>
<rect x="40" y="80" width="400" height="30" fill="none" stroke="currentColor" stroke-width="1.5"/>
<rect x="440" y="80" width="80" height="30" fill="currentColor"/>
<line x1="40" y1="60" x2="40" y2="130" stroke="currentColor" stroke-width="2"/>
<line x1="440" y1="60" x2="440" y2="130" stroke="currentColor" stroke-width="2"/>
<line x1="520" y1="60" x2="520" y2="130" stroke="currentColor" stroke-width="2"/>
<text x="240" y="150" font-size="14" fill="currentColor" text-anchor="middle" font-family="sans-serif">모집 49일 (7일 × 7주)</text>
<text x="480" y="150" font-size="13" fill="currentColor" text-anchor="middle" font-family="sans-serif">성숙 7일</text>
<text x="40" y="48" font-size="14" fill="currentColor" text-anchor="start" font-family="sans-serif">배정 시작</text>
<text x="40" y="30" font-size="13" fill="currentColor" text-anchor="start" font-family="sans-serif">0일</text>
<text x="440" y="48" font-size="14" fill="currentColor" text-anchor="middle" font-family="sans-serif">모집 종료</text>
<text x="440" y="30" font-size="13" fill="currentColor" text-anchor="middle" font-family="sans-serif">49일</text>
<text x="560" y="48" font-size="14" fill="currentColor" text-anchor="middle" font-family="sans-serif">판정일</text>
<text x="560" y="30" font-size="13" fill="currentColor" text-anchor="middle" font-family="sans-serif">56일</text>
<text x="320" y="175" font-size="13" fill="currentColor" text-anchor="middle" font-family="sans-serif">중간에 본 숫자는 판정에 쓰지 않음</text>
</svg>
<figcaption>그림 3. <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>가 D7 리텐션일 때의 시간표. 판정일은 모집 종료일에 지표의 <a class="term" href="#term-maturity" data-tip="코호트 성숙(cohort maturity): 코호트의 모든 사람이 지표의 관찰 기간을 다 채운 상태. D7 지표면 마지막 배정자의 7일째가 지나야 성숙한다.">성숙</a> 기간 7일을 더한 날입니다.</figcaption>
</figure>
<p>판정일 전에 매일 결과를 들여다보고 유의해진 날 멈추면, 효과가 없는 실험도 설계한 5%보다 훨씬 자주 유의하게 끝납니다. 중간에 꼭 봐야 한다면 몇 번 볼지와 그때의 기준을 설계서에 미리 적습니다. 그 방법은 <a href="https://data-ganeum.com/columns/peeking-early-stopping/">2편</a>에서 다뤘습니다.</p>
<blockquote><p><strong>판정일은 모집 종료일에 지표의 <a class="term" href="#term-maturity" data-tip="코호트 성숙(cohort maturity): 코호트의 모든 사람이 지표의 관찰 기간을 다 채운 상태. D7 지표면 마지막 배정자의 7일째가 지나야 성숙한다.">성숙</a> 기간을 더해 날짜로 적고, 그 전에 본 숫자는 판정에 쓰지 않습니다.</strong></p></blockquote>

## 판정은 정해진 순서로 합니다

<p>네 번째 칸은 판정 규칙입니다. 판정일에 보고서를 열면 숫자가 한꺼번에 보이지만, 보는 순서가 정해져 있어야 유리한 숫자부터 읽는 일을 막을 수 있습니다. 순서는 배정 확인, <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>, <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a>, 나머지입니다.</p>
<p>배정 확인이 먼저인 이유는 배정이 틀어진 실험의 결과는 어느 지표든 믿을 수 없기 때문입니다. 두 그룹의 인원이 설계한 비율과 다르면(<a class="term" href="#term-srm" data-tip="표본 비율 불일치(SRM, sample ratio mismatch): 두 그룹의 인원 비율이 설계한 비율과 통계적으로 다른 상태. 결과를 읽기 전에 확인한다.">SRM</a>) 효과를 읽기 전에 원인을 찾습니다. 기준은 카이제곱 검정 p값 0.001입니다.</p>
<p><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>는 p값이 아니라 신뢰구간으로 읽습니다. 신뢰구간이 설계서의 목표 효과 위에 있으면 채택, 미리 정한 무시해도 되는 범위 안에 있으면 차이 없음, 둘 다 아니면 판정 불가입니다. 유의하지 않다는 결과를 차이가 없다고 쓰지 않습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>순서</th><th>확인할 것</th><th>어긋나면</th><th>근거가 되는 글</th></tr></thead>
<tbody>
<tr><td>1</td><td>두 그룹 인원이 설계 비율과 맞는가 (<a class="term" href="#term-srm" data-tip="표본 비율 불일치(SRM, sample ratio mismatch): 두 그룹의 인원 비율이 설계한 비율과 통계적으로 다른 상태. 결과를 읽기 전에 확인한다.">SRM</a>, 카이제곱 p ≥ 0.001)</td><td>결과를 읽지 않고 배정 원인부터 찾음</td><td><a href="https://data-ganeum.com/columns/srm-check/">6편</a></td></tr>
<tr><td>2</td><td><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>의 신뢰구간이 목표 효과 위에 있는가</td><td>무시 범위 안이면 차이 없음, 둘 다 아니면 판정 불가</td><td><a href="https://data-ganeum.com/columns/confidence-interval-verdict/">4편</a></td></tr>
<tr><td>3</td><td><a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일 지표</a>가 허용 폭 안에 있는가</td><td><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>가 이겨도 채택하지 않음</td><td><a href="https://data-ganeum.com/columns/confidence-interval-verdict/">4편</a></td></tr>
<tr><td>4</td><td>공유 대조군이면 다른 실험군과도 비교했는가</td><td>대조군 대비로만 이긴 실험군은 보류</td><td><a href="https://data-ganeum.com/columns/shared-control-arms/">8편</a></td></tr>
<tr><td>5</td><td>보조 지표와 세그먼트에서 유의한 것이 있는가</td><td>채택 근거로 쓰지 않고 다음 실험 후보로 기록</td><td><a href="https://data-ganeum.com/columns/multiple-comparisons/">5편</a></td></tr>
<tr><td>6</td><td>B가 이길 확률 같은 방향 확률을 함께 쓰는가</td><td>p값과 섞어 읽지 않고 어느 쪽 기준인지 명시</td><td><a href="https://data-ganeum.com/columns/bayesian-ab-probability/">7편</a></td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 판정일에 보는 순서. 1번이 어긋나면 2번 이후를 보지 않습니다.</p>
<blockquote><p><strong>판정은 배정 확인, <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>의 신뢰구간, <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a> 순서로 하고, 그 밖에 유의하게 나온 숫자는 채택 근거가 아니라 다음 실험의 후보입니다.</strong></p></blockquote>

## 설계서 한 장을 채워 보면

<p>서두의 온보딩 실험을 네 칸으로 다시 적으면 그림 5와 같습니다. 설계서가 이렇게 있었다면 iOS 결제 전환은 보조 결과로 기록되고, D1 리텐션은 <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a>로 확인되며, 판정은 D7 리텐션의 신뢰구간 하나로 끝납니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>칸</th><th>적은 내용</th></tr></thead>
<tbody>
<tr><td>가설</td><td>새 온보딩 B는 기존 A보다 D7 리텐션을 +2%p 이상 올린다</td></tr>
<tr><td><a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a></td><td>D7 리텐션 = 설치 후 7일째 하루 접속한 사람 / 설치자. 대조군 현재 값 20%</td></tr>
<tr><td><a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a></td><td>D1 리텐션 −1%p 이상 하락 시 채택 안 함</td></tr>
<tr><td>보조 지표와 세그먼트</td><td>온보딩 완료율, 첫 세션 길이, OS별 값. 판정에 쓰지 않음</td></tr>
<tr><td>표본 수</td><td>그룹당 6,510명 (양측 5%, <a class="term" href="#term-power" data-tip="검정력(statistical power): 실제로 목표 효과만큼의 차이가 있을 때 검정이 그 차이를 유의하게 잡아낼 확률. 보통 80%.">검정력</a> 80%). 하루 300명 설치, 50:50 배정</td></tr>
<tr><td>모집 기간</td><td>49일 (44일을 7일 배수로 올림)</td></tr>
<tr><td>판정일</td><td>배정 시작 56일째 (모집 종료 + <a class="term" href="#term-maturity" data-tip="코호트 성숙(cohort maturity): 코호트의 모든 사람이 지표의 관찰 기간을 다 채운 상태. D7 지표면 마지막 배정자의 7일째가 지나야 성숙한다.">성숙</a> 7일). 중간 확인 없음</td></tr>
<tr><td>판정 규칙</td><td><a class="term" href="#term-srm" data-tip="표본 비율 불일치(SRM, sample ratio mismatch): 두 그룹의 인원 비율이 설계한 비율과 통계적으로 다른 상태. 결과를 읽기 전에 확인한다.">SRM</a> 확인 → D7 리텐션 차이의 95% 신뢰구간 → <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a>. 무시 범위 ±0.5%p</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 가상 앱의 설계서 한 장. 숫자는 그림 2의 계산 결과입니다.</p>
<p>설계서는 길 필요가 없습니다. 네 칸이 채워져 있고, 결과를 본 뒤에 고치지 않는다는 약속이 지켜지면 됩니다. 고친다면 고친 날짜와 이유를 같은 문서에 남깁니다.</p>
<blockquote><p><strong>설계서의 네 칸은 가설, 표본 수, 판정 시점, 판정 규칙이고, 전부 결과를 보기 전에 적습니다.</strong></p></blockquote>

## 나가며

<ol>
<li>가설에는 지표, 방향, 크기가 들어갑니다. <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>는 하나이고, <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a>과 보조 지표는 역할이 다릅니다.</li>
<li>표본 수는 대조군 현재 값과 목표 효과에서 계산합니다. 대조군 20%에서 +2%p를 잡으려면 그룹당 6,510명이고, +1%p면 25,583명입니다.</li>
<li>판정일은 모집 종료일에 <a class="term" href="#term-maturity" data-tip="코호트 성숙(cohort maturity): 코호트의 모든 사람이 지표의 관찰 기간을 다 채운 상태. D7 지표면 마지막 배정자의 7일째가 지나야 성숙한다.">성숙</a> 기간을 더한 날짜로 적고, 판정은 배정 확인, <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a> 신뢰구간, <a class="term" href="#term-guardrail" data-tip="가드레일 지표(guardrail metric): 나빠지면 실험군을 채택하지 않는 지표. 허용 폭을 함께 적는다.">가드레일</a> 순서로 합니다.</li>
</ol>

## 용어

<ul>
<li id="term-primary"><strong>주요 지표(primary metric)</strong>: 실험의 성패를 판정하는 단 하나의 지표입니다. 실험 전에 정의와 분모까지 적어 둡니다.</li>
<li id="term-guardrail"><strong>가드레일 지표(guardrail metric)</strong>: 좋아질 필요는 없지만 나빠지면 실험군을 채택하지 않는 지표입니다. 허용 폭을 함께 적습니다.</li>
<li id="term-mde"><strong>최소 검출 효과(MDE, minimum detectable effect)</strong>: 이 실험으로 잡으려는 가장 작은 효과 크기입니다. 표본 수 계산의 입력값이고, 결과를 본 뒤에 바꾸지 않습니다.</li>
<li id="term-power"><strong>검정력(statistical power)</strong>: 실제로 목표 효과만큼의 차이가 있을 때 검정이 그 차이를 유의하게 잡아낼 확률입니다. 보통 80%를 씁니다.</li>
<li id="term-srm"><strong>표본 비율 불일치(SRM, sample ratio mismatch)</strong>: 두 그룹의 인원 비율이 설계한 비율과 통계적으로 다른 상태입니다. 배정이나 로깅에 문제가 있다는 뜻이라 결과를 읽기 전에 확인합니다.</li>
<li id="term-maturity"><strong>코호트 성숙(cohort maturity)</strong>: 코호트의 모든 사람이 지표의 관찰 기간을 다 채운 상태입니다. D7 지표면 마지막 배정자의 7일째가 지나야 성숙합니다.</li>
</ul>

## 참고

<ol>
<li id="ref-1">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
<li id="ref-2">Lakens, D. (2022). Sample Size Justification. <em>Collabra: Psychology</em>, 8(1), 33267. https://doi.org/10.1525/collabra.33267</li>
</ol>
<p class="refs">이 글의 앱과 수치는 설명을 위해 만든 가상 예시입니다. 그림 2와 5의 필요 인원은 두 비율 z검정의 표본 수 공식(양측 유의수준 5%, <a class="term" href="#term-power" data-tip="검정력(statistical power): 실제로 목표 효과만큼의 차이가 있을 때 검정이 그 차이를 유의하게 잡아낼 확률. 보통 80%.">검정력</a> 80%)으로 계산했고, 코드 실행 환경은 Python 3.12, scipy 1.18.1입니다. 그림 3의 <a class="term" href="#term-maturity" data-tip="코호트 성숙(cohort maturity): 코호트의 모든 사람이 지표의 관찰 기간을 다 채운 상태. D7 지표면 마지막 배정자의 7일째가 지나야 성숙한다.">성숙</a> 기간 7일은 <a class="term" href="#term-primary" data-tip="주요 지표(primary metric): 실험의 성패를 판정하는 단 하나의 지표. 실험 전에 정의와 분모까지 적어 둔다.">주요 지표</a>가 D7 리텐션일 때의 값이며, 지표가 바뀌면 그 지표의 관찰 기간으로 바꿔 적습니다. 본문에서 가리킨 1편부터 13편은 모두 이 사이트의 글입니다.</p>
