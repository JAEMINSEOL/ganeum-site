---
title: "지표를 10개 보면 열 번 중 네 번은 유의한 숫자가 뜬다"
description: "다중 비교와 세그먼트 파헤치기"
date: 2026-10-13T06:47:00+09:00
tags: ["다중 비교", "세그먼트", "가짜 양성"]
draft: false
---
<blockquote><p><strong>아무 차이 없는 실험도 지표를 10개 보면 10번 중 4번은 어딘가 유의한 숫자가 뜹니다. 세그먼트까지 쪼개면 거의 매번 뜹니다. 그 숫자는 발견이 아니라 확률입니다.</strong></p></blockquote>

## 들어가며

<p>실험 보고서에 이런 문장이 올라옵니다. 전체 전환율은 유의하지 않았지만, iOS 신규 유저 세그먼트에서는 B안이 12% 높았고 p = 0.03으로 유의했습니다. 그래서 iOS 신규 유저에게만 B안을 적용하자는 제안이 붙습니다.</p>
<p>이 제안은 거의 항상 틀립니다. 이번 글에서는 지표와 세그먼트를 여러 개 들여다보는 것만으로 가짜 유의가 얼마나 쉽게 생기는지 직접 세어 봅니다. 그리고 보고서에서 어떤 숫자를 믿고 어떤 숫자를 가설로 돌려보낼지 정리하겠습니다.</p>

## 지표가 10개면 열 번 중 네 번은 유의한 숫자가 뜹니다

<p>유의수준 0.05는 지표 하나를 볼 때의 약속입니다. 차이가 전혀 없어도 그 지표가 우연히 유의할 확률을 5%까지 허용한다는 뜻입니다. 지표를 두 개 보면 문이 두 번 열립니다. 10개면 10번입니다.</p>
<p>A안과 B안이 완전히 같은 실험을 1만 번 돌리면서, 서로 독립인 지표를 20개까지 늘려 가며 세어 보겠습니다.</p>

```python
import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(seed=2026)
N, TRIALS = 10_000, 10_000                      # 그룹당 1만 명, 실험 1만 회
rates = [0.05, 0.12, 0.30, 0.08, 0.20, 0.45, 0.03, 0.15, 0.25, 0.10,
         0.06, 0.18, 0.35, 0.09, 0.22, 0.40, 0.04, 0.14, 0.28, 0.11]   # 지표 20개의 기저율

a = rng.binomial(N, rates, size=(TRIALS, 20))   # A안: 지표별 성공 수
b = rng.binomial(N, rates, size=(TRIALS, 20))   # B안: A와 완전히 같은 분포
pooled = (a + b) / (2 * N)
z = (b / N - a / N) / np.sqrt(pooled * (1 - pooled) * 2 / N)
p = 2 * norm.sf(np.abs(z))                      # 지표별 양측 p값 (실험 × 지표)

for k in (1, 3, 5, 10, 20):
    print(f"지표 {k:>2}개를 볼 때 하나라도 p < 0.05 : {(p[:, :k] < 0.05).any(axis=1).mean()*100:.1f}%")
# 지표  1개를 볼 때 하나라도 p < 0.05 : 4.9%
# 지표  3개를 볼 때 하나라도 p < 0.05 : 14.0%
# 지표  5개를 볼 때 하나라도 p < 0.05 : 22.0%
# 지표 10개를 볼 때 하나라도 p < 0.05 : 39.4%
# 지표 20개를 볼 때 하나라도 p < 0.05 : 64.3%
```

<figure>
<svg viewBox="0 0 620 215" role="img" aria-label="보는 지표 수가 늘수록 하나라도 유의할 확률이 5퍼센트에서 64퍼센트까지 오르는 막대그래프" style="max-width:100%;height:auto">
<g font-family="Noto Sans KR, sans-serif" font-size="13" fill="currentColor" text-anchor="middle">
<line x1="60" y1="172" x2="560" y2="172" stroke="currentColor" stroke-width="1.5"/>
<line x1="60" y1="163" x2="560" y2="163" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
<text x="608" y="167" text-anchor="end">약속한 5%</text>
<rect x="90" y="163" width="56" height="9" fill="none" stroke="currentColor"/>
<text x="118" y="157">4.9%</text><text x="118" y="190">1개</text>
<rect x="186" y="146" width="56" height="26" fill="none" stroke="currentColor"/>
<text x="214" y="140">14.0%</text><text x="214" y="190">3개</text>
<rect x="282" y="131" width="56" height="41" fill="none" stroke="currentColor"/>
<text x="310" y="125">22.0%</text><text x="310" y="190">5개</text>
<rect x="378" y="98" width="56" height="74" fill="none" stroke="currentColor"/>
<text x="406" y="92">39.4%</text><text x="406" y="190">10개</text>
<rect x="474" y="51" width="56" height="121" fill="currentColor"/>
<text x="502" y="45">64.3%</text><text x="502" y="190">20개</text>
<text x="310" y="210">한 실험에서 들여다본 지표의 수</text>
</g>
</svg>
<figcaption>그림 1. A와 B가 똑같은 실험 1만 번에서, 본 지표 가운데 하나라도 p &lt; 0.05가 뜬 비율. 공식으로는 1 − 0.95<sup>k</sup>이고, 시뮬레이션과 소수점 한 자리 안에서 맞습니다. 설명을 위해 만든 가상 실험입니다.</figcaption>
</figure>
<p>지표 10개면 10번 중 4번, 20개면 세 번 중 두 번은 어딘가에서 유의한 숫자가 나옵니다. 실험이 잘못된 것이 아닙니다. 5%짜리 문을 스무 번 두드렸을 뿐입니다.</p>
<p>현실의 지표들은 서로 얽혀 있어서(전환율이 오르면 매출도 오릅니다) 완전히 독립인 경우보다 확률이 조금 낮습니다. 하지만 방향은 같고, 지표 수가 늘수록 가짜 유의는 확실히 늘어납니다.</p>
<blockquote><p>지표 하나에서 5%였던 약속은 지표 10개에서 40%가 되고, 그 사실은 어느 지표의 p값에도 적혀 있지 않습니다.</p></blockquote>

## 세그먼트는 검정 수를 곱합니다

<p>지표를 늘리지 않아도 검정 수는 늘어납니다. 결과를 OS별, 국가별, 신규와 기존별로 쪼개 보는 순간입니다. 세그먼트 20개를 만들고, 지표는 하나만 보되 세그먼트마다 따로 검정해 보겠습니다. 그룹당 2만 명을 큰 세그먼트부터 작은 세그먼트까지 불균등하게 나눴습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>어떻게 봤나</th><th>검정 수</th><th>하나라도 유의한 실험</th><th>유의 개수 평균</th></tr></thead>
<tbody>
<tr><td>전체, 지표 1개</td><td>1</td><td>4.9%</td><td>0.05개</td></tr>
<tr><td>세그먼트 20개, 지표 1개</td><td>20</td><td>63.6%</td><td>0.99개</td></tr>
<tr><td>세그먼트 20개, 지표 3개</td><td>60</td><td>95.3%</td><td>3.01개</td></tr>
<tr><td>위와 같되 기준을 0.05 / 60으로</td><td>60</td><td>4.4%</td><td></td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 2. A와 B가 똑같은 실험 1만 번. 세그먼트 인원은 3,600명부터 100명까지. 설명을 위해 만든 가상 실험입니다.</p>
<p>세그먼트 20개에 지표 세 개를 보면 검정이 60개가 되고, <strong>95.3%의 실험에서 유의한 칸이 적어도 하나 나옵니다.</strong> 평균 세 개입니다. 서두에서 예시로 든 보고서가 이와 같은 상황이라고 볼 수 있습니다. 전체에서 아무것도 없는 실험을 60칸으로 쪼개면, 평균 세 칸이 유의하게 나옵니다.</p>
<p>어느 칸이 유의하게 나오는지도 정해져 있습니다. 유의하게 나온 세그먼트의 절반 이상(54.3%)이 1,000명 미만의 작은 세그먼트였습니다. 그 세그먼트들이 보여 준 상대 차이의 중앙값은 51.6%였습니다. 실제 차이는 0입니다. 인원이 적을수록 출렁임이 크고, 큰 출렁임은 큰 효과처럼 보입니다.</p>
<blockquote><p>세그먼트 분석은 검정 수를 곱하고, 가장 작은 세그먼트가 가장 큰 가짜 효과를 만들어 냅니다.</p></blockquote>

## 지표에 역할을 미리 줍니다

<p>가장 효과적인 방어는 통계가 아니라 설계서입니다. 실험을 시작하기 전에 지표마다 역할을 적습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>역할</th><th>개수</th><th>하는 일</th><th>유의하면</th></tr></thead>
<tbody>
<tr><td>주요 지표</td><td>1개</td><td>채택과 기각을 정한다</td><td>결론에 쓴다</td></tr>
<tr><td>보조 지표</td><td>2~4개</td><td>주요 지표의 움직임을 설명한다</td><td>해석에 쓰되 결론을 뒤집지 않는다</td></tr>
<tr><td>가드레일 지표</td><td>2~3개</td><td>나빠지면 안 되는 것(오류율, 이탈)</td><td>나빠졌을 때만 본다. 좋아진 것은 세지 않는다</td></tr>
<tr><td>탐색 지표</td><td>나머지 전부</td><td>다음 실험의 아이디어</td><td>가설로 적는다. 결론에 쓰지 않는다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 3. 지표의 네 가지 역할. 실험 설계서에 지표 이름과 함께 적는다.</p>
<p>이렇게 나누면 결론을 정하는 검정은 하나가 되고, 5%라는 약속이 그대로 지켜집니다. 주요 지표가 아닌 지표가 유의하게 나오면 결론에 쓰지 않고 <strong>다음 실험의 가설</strong>로 적습니다. 결과를 본 뒤에 주요 지표를 바꾸면 검정 하나라는 약속이 깨지므로, 주요 지표는 실험 설계서에 먼저 적어 둡니다.</p>
<blockquote><p>결론을 정하는 지표가 하나면 다중 비교 문제는 생기지 않습니다. 문제는 지표 수가 아니라 결론을 정하는 지표 수입니다.</p></blockquote>

## 그래도 여러 개를 봐야 한다면 기준을 나눕니다

<p>주요 지표를 하나로 못 줄일 때가 있습니다. 두 지표 모두 좋아져야 채택하는 경우가 그렇습니다. 이때는 유의수준을 검정 수로 나눠 씁니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>방법</th><th>기준</th><th>검정 10개면</th><th>성격</th></tr></thead>
<tbody>
<tr><td>Bonferroni</td><td>0.05를 검정 수로 나눈다</td><td>각각 0.005</td><td>가장 단순하고 가장 보수적. 하나라도 가짜일 확률을 5%로 묶는다</td></tr>
<tr><td>Holm</td><td>p값을 작은 순으로 세워 단계마다 기준을 완화한다</td><td>0.005, 0.0056, 0.00625 …</td><td>Bonferroni와 같은 보장, 조금 덜 보수적</td></tr>
<tr><td>Benjamini-Hochberg</td><td>유의로 선언한 것 가운데 가짜 비율을 5%로 묶는다<sup class="fn"><a href="#ref-1" title="Benjamini & Hochberg (1995). Controlling the false discovery rate. JRSS B, 57(1), 289–300.">[1]</a></sup></td><td>가장 작은 p값부터 0.005, 0.010, 0.015 …</td><td>탐색 단계에 적합. 결론 하나를 지키는 용도는 아니다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 4. 자주 쓰는 보정 방법. 검정 10개 기준입니다.</p>
<p>앞의 시뮬레이션에서 60개 검정에 Bonferroni를 적용하면 하나라도 유의한 실험이 95.3%에서 4.4%로 내려옵니다. 약속한 5%로 돌아온 것입니다. 대신 기준이 0.0008까지 내려가니, 진짜 효과를 잡으려면 인원이 훨씬 많이 필요해집니다. 보정은 공짜가 아니고, 그래서 애초에 검정 수를 줄이는 쪽이 낫습니다.</p>
<blockquote><p>보정은 가짜 유의를 줄이는 대신 진짜 효과를 잡을 힘을 깎습니다. 검정 수를 줄이는 것이 먼저입니다.</p></blockquote>

## 유의한 세그먼트를 발견했을 때

<p>설계서에 없던 세그먼트에서 유의한 숫자가 나왔습니다. 서두에서 예시로 든 iOS 신규 유저 세그먼트가 여기에 해당합니다. 버리라는 것이 아닙니다. 다르게 다루라는 것입니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>순서</th><th>할 일</th><th>이유</th></tr></thead>
<tbody>
<tr><td>1</td><td>설계서에 미리 적힌 세그먼트인지 확인한다</td><td>적혀 있었다면 결론에 쓸 수 있다. 아니면 다음 단계로</td></tr>
<tr><td>2</td><td>그 세그먼트에서 본 검정 수를 센다</td><td>60칸 중 하나라면 기대값만으로 세 개가 유의하다</td></tr>
<tr><td>3</td><td>세그먼트 인원과 신뢰구간을 적는다</td><td>작은 칸의 큰 효과는 출렁임일 가능성이 높다</td></tr>
<tr><td>4</td><td>보고서에 <strong>가설</strong>이라고 표기한다</td><td>발견과 가설을 같은 칸에 적으면 읽는 사람이 구분하지 못한다</td></tr>
<tr><td>5</td><td>확인하려면 그 세그먼트만 대상으로 새 실험을 설계한다</td><td>같은 데이터로는 확인할 수 없다. 가설을 만든 데이터로 가설을 검증하는 꼴이 된다</td></tr>
</tbody>
</table>
</div>
<p class="caption">그림 5. 사후에 발견한 세그먼트 효과를 다루는 절차.</p>
<p>다섯 번째가 핵심입니다. 가설을 만든 데이터로 그 가설을 검증할 수는 없습니다. 이미 그 데이터에서 가장 극적인 칸을 골라냈기 때문입니다. 연구 분야에서는 이렇게 결과를 본 뒤 분석 방법을 고르는 일이 거짓 발견의 주된 통로로 지목되었습니다<sup class="fn"><a href="#ref-2" title="Simmons, Nelson & Simonsohn (2011). False-positive psychology. Psychological Science, 22(11), 1359–1366.">[2]</a></sup>. 온라인 실험에서도 같은 일이 세그먼트 탭 하나로 일어납니다<sup class="fn"><a href="#ref-3" title="Kohavi, Tang & Xu (2020). Trustworthy Online Controlled Experiments. Cambridge University Press.">[3]</a></sup>.</p>
<blockquote><p>사후에 찾은 세그먼트는 발견이 아니라 다음 실험의 가설이고, 가설은 새 데이터로만 확인됩니다.</p></blockquote>

## 나가며

<ol>
<li>아무 차이 없는 실험도 지표 10개를 보면 39.4%, 20개를 보면 64.3%에서 유의한 숫자가 하나는 나옵니다. 세그먼트 20개에 지표 세 개를 곱하면 95.3%입니다.</li>
<li>가장 극적인 숫자는 가장 작은 세그먼트에서 나옵니다. 유의한 세그먼트의 절반이 1,000명 미만이었고 그 상대 차이 중앙값은 51.6%였습니다. 실제 차이는 0이었습니다.</li>
<li>결론을 정하는 지표를 하나로 미리 정하면 문제가 사라집니다. 사후에 찾은 세그먼트는 가설로 표기하고 새 실험으로만 확인합니다.</li>
</ol>

## 참고

<ol>
<li id="ref-1">Benjamini, Y., &amp; Hochberg, Y. (1995). Controlling the false discovery rate: A practical and powerful approach to multiple testing. <em>Journal of the Royal Statistical Society. Series B</em>, 57(1), 289–300. https://doi.org/10.1111/j.2517-6161.1995.tb02031.x</li>
<li id="ref-2">Simmons, J. P., Nelson, L. D., &amp; Simonsohn, U. (2011). False-positive psychology: Undisclosed flexibility in data collection and analysis allows presenting anything as significant. <em>Psychological Science</em>, 22(11), 1359–1366. https://doi.org/10.1177/0956797611417632</li>
<li id="ref-3">Kohavi, R., Tang, D., &amp; Xu, Y. (2020). <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em>. Cambridge University Press.</li>
</ol>
<p class="refs">본문의 모든 수치는 설명을 위해 만든 가상 실험을 직접 시뮬레이션한 값입니다. 검정은 두 비율 z검정(양측, α = 0.05)이고, 지표 시뮬레이션은 그룹당 1만 명과 실험 1만 회(시드 2026), 세그먼트 시뮬레이션은 그룹당 2만 명을 20개 세그먼트에 나눈 뒤 실험 1만 회(시드 20261) 기준입니다. 지표들은 서로 독립으로 생성했으므로 실제 서비스보다 가짜 유의 확률이 다소 높게 나옵니다. 코드 실행 환경은 Python 3.12, NumPy 2.5.3, SciPy 1.18.1입니다.</p>
