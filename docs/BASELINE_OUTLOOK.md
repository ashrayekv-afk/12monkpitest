# NKPI score outlook — 8.5

## Current release

The primary baseline supplement now shows projected **NKPI points**, replacing percentage cards. The displayed ridge trajectory and underlying frozen NKPI formula are numerically identical to v8.4. No new outcome labels, forced increases, probability floors, clinician-assumed anchors or calibration claims were added.

The graph starts at the calculated score for the selected single visit and ends at a projected score at 12 months. Intermediate 3-, 6- and 9-month markers are interpolation, not observed visits. Each eye has a separate line and current/projected score card. The score view spans 0–100. The magnified view shows change relative to that eye’s current score on a symmetric scale, with zero marking the unchanged-score reference.

## Formula

Let `z0` be the frozen baseline NKPI logit. The fitted measurement drift is:

`r = b0 + bN * (NKPI0 - mean_N) / scale_N + bA * (age0 - mean_A) / scale_A`

At elapsed time `t = months / 12`:

`NKPI(t) = 100 * sigmoid(z0 + t * (r + beta_age))`

`beta_age` is the frozen baseline NKPI coefficient per year of age. Month zero uses the exact current score. The estimated drift assumes no corneal treatment and a constant conditional average rate. The same single-visit formula scores baseline and follow-up; a longitudinal two-visit score must not be connected to this curve.

The decomposition shown below each eye is exact on the point scale:

- Age component = age-only score at 12 months minus current score.
- Measurement component = full projected score minus age-only score at 12 months.
- Their sum = full projected score minus current score.

This ordering is an arithmetic decomposition of a nonlinear model, not a causal biological attribution. Future measurements are not observed. A lower projected NKPI can reflect the age term or regression toward the cohort mean and does not establish stability or improvement.

## Dataset and actual results

The existing trajectory was fitted on 232 adult eye pairs / 130 patients, selected from 262 complete pairs. Source inventory historically called 426 eyes yielded 425 numeric candidates under the conservative reconstruction. Only two selected measurements per eye were available. No new clinic patient outcomes were supplied for this release.

The trajectory fit used five patient-grouped outer folds, three inner tuning folds, three fixed repeated splits, and ridge penalties 0.1, 1, 10, 100, 1000. Both eyes stay together. The previously developed NKPI transformation stayed fixed and used overlapping source records. Consequently this is conditional internal evaluation, not independent end-to-end clinical validation.

| Assessment | Score trajectory RMSE | Unchanged-score RMSE | Score trajectory MAE | Unchanged-score MAE |
|---|---:|---:|---:|---:|
| 232 eyes, variable intervals | 3.188 | 3.531 | 1.771 | 2.193 |
| 45 eyes / 25 patients, 9–15 months | 3.869 | 3.862 | 1.954 | 1.908 |

All errors are in NKPI points. The near-year assessment did not demonstrate better accuracy than an unchanged score. These are aggregate errors, not patient confidence limits. The interface reports this comparison and includes the unchanged-score reference. Replacing a percentage with a line improves the distinction between score and probability; it does not improve prediction accuracy.

There is only one eligible development eye with baseline NKPI >=65. High-score trajectories and inputs outside individual training ranges are flagged. The overall error cannot be assumed to apply to that sparsely sampled range.

## Clinic clarification

The user clarified that high NKPI scores were found in eyes already judged to be progressing and scheduled for CXL in the next one or two months. That information concerns current clinical classification and treatment planning. It is not a measured untreated future score or a prospective one-year event. No 75% anchor or artificial upward score drift was derived from that observation. A trajectory assuming no treatment does not predict an eye’s response to planned CXL.

## Working synthetic example

| Eye | Current NKPI | Projected at 12 months | Change |
|---|---:|---:|---:|
| OD | 26.92 | 26.41 | -0.51 points |
| OS | 57.02 | 54.63 | -2.39 points |

These example inputs were constructed for software demonstration; they are not clinical outcomes. Open BASELINE_OUTLOOK_PREVIEW.html to inspect both chart views and the exact quarterly scores. The live calculator computes from the patient inputs, not from these fixed example numbers.

## Scope and reproduction

The frozen NKPI files, extraction, observed evidence, fitted forecast artifact and numerical output are unchanged from v8.4. The former probability response remains in the research artifact/audited JSON for compatibility; it is absent from the displayed score outlook. The original internal assessment and reproduction instructions below remain as historical documentation for that separate probability experiment.

The existing `build_nkpi_aware_demo` function in `research/train_domain_outlook.py` contains the trajectory fitting recipe. A researcher can reproduce it with the authorized private paired table using `--nkpi-aware`, in a separate output folder, with pandas and scikit-learn installed. Do not overwrite the shipped combined artifact using that historical command: it also regenerates the earlier probability model. Do not commit private inputs or OOF predictions.

---

# Historical v8.4 probability model — no probability card in v8.5

# Selected NKPI-linked forecast — 8.4

## What was selected

The final fitted family is **nkpi_logit_time**, L2 logistic regression C=1.0. Only baseline NKPI logit and log elapsed years have nonzero coefficients. Existing age and six tomography inputs influence the forecast through NKPI. The other seven slots in the artifact remain present for audited input effects and range checks but their direct coefficients are zero.

Let `q = current baseline NKPI / 100`. The forecast is:

`z = intercept + beta_N * (logit(q) - mean_N) / scale_N + beta_T * (log(years) - mean_T) / scale_T`

`p = sigmoid(z)`

At runtime `years = 1`, so `log(years) = 0`. The logit is computed directly from the existing score's coefficients, avoiding loss of precision for extreme scores. Age is age at the baseline scan. It is not added again or advanced in the probability calculation. Median-substitution explanations change one underlying input and recompute the whole NKPI logit.

The fitted response increases with NKPI. This sign was learned, not forced. No probabilities were boosted, blended with NKPI, rounded up to a risk band, or trained on a reported clinic detection rate.

| Baseline NKPI | Fitted 12-month numerical-endpoint estimate |
|---|---:|
| 20 | 26.2% |
| 35 | 31.7% |
| 50 | 36.6% |
| 55 | 38.2% |
| 65 | 41.7% |
| 75 | 45.8% |
| 85 | 51.4% |

These are exact-model demonstrations, not validated patient risks. High-score estimates have very sparse support. Recalibration to a different outcome cannot be assessed by how similar its percentage looks to NKPI.

## Available records and target

The conservative source parser reconstructed 425 numeric candidate eyes / 234 patients from the workbook historically called the 426-eye cohort. This count discrepancy is retained. It yielded 301 eligible complete baseline eyes / 166 patients and 262 complete dated pairs / 148 patients. The forecast uses the same 232 eligible adult paired eyes / 130 patients as v8.3, with 59 positive and 173 negative endpoints, interval 90 days to five years. The near-year subset is 45 eyes / 25 patients / 11 positive endpoints, interval 9–15 months.

The outcome is at least two strict numerical domain crossings at the later scan relative to baseline:

1. Anterior: ARC decrease >0.106 mm OR Kmax increase >1 D.
2. Posterior: PRC decrease >0.085 mm.
3. Pachymetric: thinnest decrease >2% OR ARTmax decrease >44.24.
4. Composite: BAD-D increase >0.42.

Each group counts once; equality does not cross. These overlapping numerical domains are not independently adjudicated clinical progression and do not replace the separate current observed-evidence module.

**Timing audit:** only the selected baseline/later measurements are available. There are no third-visit time points or known first-crossing dates in this reconstructed source. A positive observation at three years is not labelled a known one-year event. Variable-interval models estimate threshold state conditional on elapsed time; the direct model uses only the near-year observations. A first-event survival model and temporal external validation could not be built from these records. Dates of treatment and scan quality remain incompletely audited.

## Prespecified comparison

`research/protocol.json` records the v8.4 comparison before fitting:

- NKPI logit + log interval.
- NKPI logit + baseline age + log interval.
- Seven raw baseline inputs + log interval.
- NKPI logit alone, trained only on 9–15-month observations.

For each family C was chosen from 0.01, 0.1, 1.0. Three inner patient-grouped folds evaluate Brier error on their near-year validation rows. Among candidates within 0.002 of the lowest pooled error, choose the lowest dimensional one, then the lowest C. Five outer patient-grouped folds and three fixed repeats (2718, 3141, 1618) evaluate the entire selection process. The near-year subset was the declared primary assessment; full variable-interval results are secondary. Both eyes remain together. Near-year training prevalence and interval-only predictions are benchmarks, not patient-specific deployment candidates.

## Refitting NKPI inside the folds

The original baseline NKPI is a standardized ridge logistic CXL-phenotype model with C=0.1 followed by a positive affine calibration on the logit. We verified exact recovery of that ridge core from the 301-row baseline table. For every inner and outer split, the ridge core is refitted after excluding **all** held-out patients, including any of their baseline-only records. Its logit supplies the candidate forecast. All forecast scalers and coefficients are fitted only on the corresponding development split.

The original positive affine logit calibration cancels mathematically under downstream logit standardization. Therefore it need not be reused or estimated from held-out labels. The final public forecast uses the existing frozen NKPI logit, and numerical checks confirm equivalence to using the uncalibrated full-data ridge logit after standardization. Original NKPI scores do not change.

This process prevents held-out labels entering the fitted score basis or forecast during this comparison. It does **not** erase earlier exploratory development on this same cohort or reconstruct every historical tuning decision. It is an internal evaluation of the newly fixed fitting recipe, not independent external or prospective validation.

## Actual results

Primary 9–15-month observations, averaged repeated out-of-fold predictions:

| Procedure / family | AUROC | Brier error | Mean predicted fraction |
|---|---:|---:|---:|
| selected | 0.660 | 0.1775 | 0.263 |
| nkpi_logit_time | 0.684 | 0.1743 | 0.260 |
| nkpi_logit_age_time | 0.580 | 0.1817 | 0.254 |
| raw_baseline_time | 0.591 | 0.1825 | 0.257 |
| direct_near12_nkpi_logit | 0.529 | 0.1873 | 0.243 |
| prevalence | 0.159 | 0.1960 | 0.251 |
| interval_only | 0.488 | 0.1851 | 0.255 |

The primary reported result is the **entire selection procedure**: AUROC 0.660, Brier 0.1775. The fixed NKPI/time family is reported separately; its higher AUROC is not substituted for the selection-procedure estimate. Calibration intercept was 0.037, slope 1.138; observed endpoint frequency was 11/45 (24.4%). These small-sample diagnostics are not proof of calibration in clinical use.

Patient-cluster bootstrap of fixed averaged OOF predictions gave AUROC interval **0.422–0.850** and Brier improvement over training-fold prevalence interval **-0.0093–0.0491**. The latter includes zero. This bootstrap does not refit the full pipeline, so it omits some development uncertainty. A consistent clinical benefit is not established.

The prevalence benchmark's pooled AUC is not meaningful discrimination: its prediction is constant within each fold, and fold prevalence varies. Its Brier error is the relevant comparator.

Secondary all-interval selected-procedure AUROC: 0.593; Brier: 0.1867. The historical v8.3 results used a reused fixed NKPI transformation and a different selection target; they are preserved as history and should not be presented as a clean head-to-head improvement claim. Descriptive smooth-logistic calibration diagnostics and grouped counts are stored in the artifact. No diagnostic curve was applied back to the same held-out predictions as a correction.

## Do NKPI 50+ and 65+ correspond to more observed crossings?

| Frozen baseline NKPI | Positive / total, all recorded intervals | Positive / total, 9–15 months |
|---|---:|---:|
| Below 50 | 53 / 218 | 8 / 39 |
| 50 to below 65 | 5 / 13 | 2 / 5 |
| 65 and above | 1 / 1 | 1 / 1 |

These are descriptive full-development frequencies using the existing NKPI, not held-out calibration bins or representative clinic risk. Only one eligible development eye has NKPI >=65. It is not possible to infer a 98%, 65%, or other precise one-year risk from that observation. The app displays sparse-support context for this range.

The user reports approximately 98% clinic detection and a threshold of 65 for progressed eyes. The case-level clinic data, denominator, reference standard, scan mode, specificity and follow-up horizon were not supplied to this fit. This information was not converted into pseudo-labels, weights, or a progression-probability floor. Baseline and two-visit NKPI are different formulas; the mode of that clinic result must be confirmed before evaluating transportability.

A next independent validation table should include a pseudonymous patient/eye key, baseline date and NKPI mode/score, verified measurements, later visit dates and measurements, treatment dates, scan quality, and an independently defined progression outcome. Both detection-positive and detection-negative cases are needed. Keep those rows private.

## Interface and scope preservation

- Current NKPI formula, numerical bands, extraction, interval-half two-visit model and observed-evidence section are unchanged.
- Verified valid measurements still receive a score with a visible quality caution. Missing/unverified values and known-treatment holds remain.
- Forecast cards lead the baseline dropdown; the previous score trajectory is a separate collapsed detail. Its coefficients and limited v8.3 performance remain unchanged.
- Forecast, support-band counts, both eyes and input effects are checked against the same input snapshot. Edits invalidate only the affected result. The audited JSON contains the model identity and numerical results.
- NKPI score decline is not biological improvement. The optional old score trajectory can decline because of the score's age term or regression toward the development cohort.

## Reproduce

Runtime uses the supplied aggregate artifact. No patient data or training service are needed.

For offline research, install pandas, scikit-learn and scipy in addition to numpy. Use the authorized conservative reconstructed files:

```bash
python research/train_domain_outlook.py --paired /private/private_paired.csv --baseline /private/private_baseline.csv --out /private/v84_artifacts --private-out /private/v84_rows --select-forecast
```

Public outputs are the aggregate artifact/checksum. Private outputs contain patient-level predictions and must not be uploaded to GitHub. Source hashes, seeds, selections and audit counts are included in the artifact/protocol. The historical source workbook SHA-256 is `60bd4895f669fa55bd4e7e37266c66a52497f250847869185dfa1424bfa882be`.

Method references: [BMJ prediction-model development guide](https://doi.org/10.1136/bmj-2023-078276) and [BMJ external-validation guide](https://doi.org/10.1136/bmj-2023-074820). These provide methodological guidance, not validation of NKPI. This remains a research demo and cannot establish an individual's clinical progression risk or treatment decision.
