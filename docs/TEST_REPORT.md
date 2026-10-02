# 8.5 verification — 2 October 2026

This release changes presentation and interpretation. It does not change fitted coefficients or claim improved clinical forecasting.

- All 13 bundled Python/Node test entrypoints passed. The baseline Python suite now has 24 tests, including exact age/measurement decomposition and the unchanged-score benchmark.
- The score/trajectory contract independently checks the exact month-zero anchor, quarterly points, both eyes, model identity, source edits, numeric integrity and treatment/quality metadata. The new UI shows exact current and projected scores, point changes, synthetic-input labels, and no probability hero.
- Chromium exercised the actual component with the Python service: bilateral and mixed modes, score/change chart switches, quality advisory scores, independent eye invalidation, recalculation, disclosures, numeric downloads and clear/reset. Zero JavaScript errors.
- Preview widths 1200, 760, 390 and 320 pixels passed overflow checks in score and magnified-change views, including expanded tables. Desktop and mobile images were visually reviewed.
- Streamlit 1.50 startup passed with zero exceptions and app errors.
- 80 deterministic synthetic baseline/two-visit cases preserved all numeric output, including the full forecast and trajectory, after excluding version labels. The frozen NKPI model files, forecast artifact, extraction, and observed-evidence implementation are unchanged. Bilateral PDFs generated successfully.
- Standard Windows-compatible DEFLATE ZIP: 99 files, no encryption, no ZIP64 requirement. CRC, fresh extraction/byte comparison, manifest verification, and baseline Python/Node checks on the extracted package are the distribution checks.

The reused trajectory’s existing conditional internal RMSE was 3.188 NKPI points over variable intervals and 3.869 near one year, compared with 3.531 and 3.862 for unchanged scores. The near-year model has not demonstrated superior accuracy. No new clinic outcome dataset, new OCR accuracy estimate, or external clinical validation was introduced.

---

# 8.4 verification — 2 October 2026

These are software checks and internal modeling assessments, not clinical validation.

- All 13 bundled Python/Node test entrypoints passed. The baseline suite includes 22 tests covering exact score preservation, forecast arithmetic, quality advisories, eye isolation, input holds, trajectory consistency, high-score support counts and no artificial probability floors.
- Training checks passed for strict domain boundaries, grouping, source-date limitations, the excluded clinic claim, and held-out patient-label/feature perturbation. Modifying excluded patients cannot change the fitted NKPI basis (within 1e-12 numerical tolerance).
- An independent complete training run reproduced the selected family, coefficients, fold selections and counts. Maximum difference across all numeric artifact fields was 5.92e-15, attributable to floating-point operation order after factoring the helper. Reproducibility is numerical, not a byte-identical JSON claim.
- Chromium exercised the real component with the Python calculation service: bilateral and mixed modes, quality warning scores, per-eye invalidation, recalculation, chart opening, downloads, sensitivity disclosure and reset. No JavaScript errors.
- Preview widths 1200, 760, 390 and 320 pixels passed horizontal-overflow checks. Desktop and mobile output were visually reviewed. The optional trajectory is collapsed initially and follows the forecast cards.
- Streamlit 1.50 AppTest startup completed with zero exceptions and zero app errors.
- 80 deterministic synthetic baseline/two-visit cases preserved every existing numeric result outside the updated baseline supplement. Frozen NKPI artifacts, source extractor and observed-evidence files are byte-identical to v8.3. Bilateral PDFs generated.

No new real-report OCR accuracy estimate, prospective clinical validation, or independent clinic cohort validation was performed. The reported approximately 98% clinic detection result was not treated as a forecast-validation dataset.

# Engineering verification — 8.3.0-nkpi-trajectory

Completed 2026-10-01. These are engineering checks and conditional internal model assessments, not evidence of clinical safety or accuracy.

## Model development and reproducibility

The eligible sample remains 232 eyes / 130 patients / 59 numerical endpoints. The updated probability model includes frozen baseline NKPI and was compared with the unaugmented feature set on identical nested patient-grouped folds. The separate ridge score trajectory uses baseline NKPI and age, is anchored at the current score, and adds the frozen score's age effect explicitly. The recorded recipe preceded fitting. A second fit into a fresh output directory reproduced the exact artifact bytes and hash.

Conditional internal AUROC was 0.5846 with NKPI versus 0.5775 without it. Frozen NKPI coefficients were previously developed using overlapping records, so this is not leakage-free end-to-end validation. Trajectory RMSE was 3.188 points at variable observed intervals, versus 3.531 for persistence and 3.269 for age-only rescoring. Near 12 months (45 eyes), trajectory RMSE 3.869 did not beat persistence 3.862. These limitations are documented in the UI, artifact and methods.

## Passed engineering checks

All **13** bundled test entry points passed. Python baseline tests now include **19** tests.

- Reported quality warnings preserve source metadata and warnings, produce exactly the same numerical NKPI as otherwise identical acceptable-quality inputs, and do not bypass missing, unverified, invalid or treated-case holds.
- Both-eye screenshot regression reproduces a calculable OD and OS, including the flagged OD, with numeric report generation.
- Independent forecast logit arithmetic includes the derived NKPI. One-input changes recalculate NKPI consistently rather than treating it as independent of its source variables.
- Independent trajectory arithmetic checks all five points, exact month-zero anchoring, age advancement, age-only comparator, finite 0–100 values, separate-eye snapshots, and invalidation after edits.
- Browser contracts reject a changed eye, snapshot, model hash, score, trajectory rate, point/month, research flag or quality metadata.
- Existing extractor, bilateral import/review, second-reader, source integrity, map identification, score band, longitudinal evidence and interval-model tests pass.

## Preservation

All frozen NKPI files, extractor code, observed-evidence implementation/renderer and fitted evidence artifact are byte-identical to 8.2. Eighty deterministic synthetic cases (40 baseline, 40 two-visit) reproduce identical existing numerical content after excluding the interface version and changed baseline supplement. Advisory quality behavior is the intentional scoring-policy change. Existing evidence quality eligibility remains unchanged.

## Browser and startup

Chromium inspected the complete preview at 1200, 760, 390 and 320 pixels, including expanded tables, with no horizontal page overflow. Desktop/mobile screenshots were visually reviewed. The real production component was connected to the actual Python service and passed mixed-mode/bilateral cases, responsive inputs, original evidence display, quality-warning score display, curve invalidation and recalculation, correct JSON export and clearing. Zero JavaScript runtime errors were observed. Streamlit 1.50 AppTest startup passed with no app exception or error.

Browser checks blocked CDN resources and did not re-run OCR on clinical reports. No new claim of OCR accuracy or complete extraction yield is made.

## Distribution

The standard DEFLATE ZIP contains 99 files, no encryption or ZIP64 requirement. CRC, complete extraction, byte comparisons, manifest checks and forecast/trajectory tests on a fresh extracted copy passed. No patient workbooks, reports, private training/OOF rows, credentials or local QA files are included.

---

## Historical 8.2 record — superseded forecast/quality behavior

# Engineering verification — 8.2.0-baseline-forecast-demo

Completed 2026-10-01. Software verification and internal model evaluation are reported separately; neither establishes clinical suitability.

## Active forecast

The new all-adult model was actually fitted on 232 eligible paired eyes / 130 patients / 59 numerical endpoints. Five outer patient-grouped folds, three inner grouped tuning folds and three repeat seeds preserve patient separation and fold-local scaling. The final model and aggregate validation are shipped with a checksum. Internal variable-interval AUROC 0.578 and Brier 0.1883 (training-fold average 0.1897) remain weak. See BASELINE_OUTLOOK.md for the full methods and 9–15-month audit. Live output is explicitly an experimental selected-cohort model estimate.

## Passed software checks

All 13 bundled test entry points passed.

- Python baseline tests: 15 tests, including fitted numerical fixture, independent logistic arithmetic, response to all seven baseline inputs, separate forecast contributions, flagged extrapolation without clipping, artifact integrity, bilateral isolation, stale snapshots and preserved input holds.
- JavaScript contracts independently reconstruct the Python percentage and contributions. Wrong eye, altered inputs, snapshot, artifact, coefficients/results, endpoint/horizon, research flags and stale results are rejected. Mixed baseline/two-visit mode preserves the appropriate section for each eye.
- Model-artifact checks cover the adult cohort accounting, aggregate weak validation, research-only status and the unchanged inactive historical candidates.
- All extraction, source-review, bilateral-import, second-reader, map-identification, score-band, observed-evidence and interval-model regression tests pass.

## Preservation

The frozen NKPI artifacts, bilateral extractor, observed-evidence implementation, renderer and fitted evidence artifact are byte-for-byte identical to 8.1. Eighty deterministic synthetic cases (40 baseline and 40 two-visit) produce exactly equal existing numeric response content after excluding the interface version and changed baseline supplement. Both-eye NKPI PDFs generate; only their interface version label changes. The JSON export now includes the forecast and its research flags.

## Browser and startup

Headless Chromium rendered the synthetic preview at 1200, 760, 390 and 320 pixels without horizontal page overflow, including expanded audit tables. Desktop, mobile and live-card screenshots were visually inspected. The offline preview's 29.5% and 36.4% figures are computed by the fitted model for the explicitly synthetic inputs.

The production calculator component was connected to the actual Python service. Checks passed for mixed mode, both baseline eyes, input-edit invalidation, changed forecasts after recalculation, preserved disclosure state, source holds, JSON export and reset. No JavaScript runtime errors were observed. Streamlit 1.50 AppTest startup passed with no exceptions or error elements.

Browser QA blocked CDN resources; it did not repeat real report OCR inference. These tests do not establish extraction accuracy or clinical forecast performance.

## Distribution

Standard DEFLATE ZIP, 99 ordinary files, no encryption or ZIP64 requirement. CRC, complete extraction, byte comparison, package manifest, and calculation/contract tests on the extracted copy passed. No patient spreadsheet, reports, private fitting rows, out-of-fold patient predictions, credentials or QA output is distributed. Aggregate coefficients and validation are included.

---

## Historical version 8.1 record — superseded forecast behavior

# Engineering verification — 8.1.0-baseline-outlook

Completed 2026-09-29. These are software checks, not validation of clinical forecasts or repeatability coverage.

## Baseline calculation and contracts

- `test_baseline_outlook.py`: 10 tests. Independent logit arithmetic; exact envelope versus all 64 input corners; bilateral isolation; incomplete/unverified/treated/poor-quality and two-visit cases; unknown context; bounded perturbations; Kmax reference boundaries; snapshot invalidation; no future-data/identifier leakage; zero coefficient behavior.
- `test_baseline_outlook.cjs`: real Python service responses checked by independent JavaScript arithmetic. Wrong eye, snapshot, version, score, envelope, input, perturbation size, rank, contributor, quality, age and forecast fields are rejected. The forecast probability is always null in patient results.
- Existing app-event test updated only to load the new baseline renderer. It continues checking stale responses, edits, source changes, resets, observed evidence and NKPI layout.

## Regression checks

All **13** bundled test entry points passed: the 11 preserved tests below plus the two new baseline tests. Extraction files are byte-for-byte identical to version 8.0. All frozen model files and the observed-evidence implementation, renderer and artifact are also byte-identical.

An additional 80 deterministic synthetic cases (40 single-visit, 40 two-visit) were evaluated in both releases. After removing the new baseline field and interface version, all existing numeric response content was exactly equal, including NKPI predictions, explanations and longitudinal evidence. Bilateral one-page PDFs generated successfully; only the interface-version label changed.

## Browser and startup

Headless Chromium inspected the standalone synthetic preview at 1200, 760, 390 and 320 pixels. Cards, expanded tables and the separate fictional forecast displayed without horizontal page overflow. Desktop and mobile screenshots were visually reviewed.

The real calculator component was connected to the actual Python service and checked for single-visit / two-visit mixed mode, both baseline eyes, sensitivity disclosures, unchanged-input rerenders, input-edit invalidation, recalculation, separate fictional preview, audited JSON download and clearing. Zero JavaScript runtime errors were observed. Streamlit AppTest startup passed with no app exception or error.

The browser checks blocked CDN resources and did not repeat real OCR inference. Existing extraction logic passed controlled regression tests; no new real-world OCR accuracy claim is made.

## Distribution

The complete ZIP is verified with CRC checking, full extraction and SHA-256 manifest checks. Standard DEFLATE, no encryption or ZIP64 dependency, ordinary short paths, and 97 distributed files. No patient spreadsheets, reports, private fitting rows, API credentials or local QA output are included. Preview cases and forecast design numbers are explicitly fictional.

## Forecast limitation

No new forecasting model was trained or released in 8.1. Prior baseline candidate validation remains weak (variable-interval AUROC 0.574, minimal Brier improvement); it does not establish a calibrated fixed 12-month risk. The production calculation returns no patient progression probability. A working input-sensitivity analysis does not remedy that scientific limitation.

---

## Retained version 8.0 verification

Completed 2026-09-29. These checks verify implementation behavior; they do not establish clinical accuracy, sensitivity, specificity or progression calibration.

## New evidence checks

`tests/test_evidence.py`: 15 tests cover unchanged measurements, analytic two-visit slope/Z, interval invariance of evidence, severity-band boundaries, pooled raw-measure references, opposite directions, BAD-D exclusion from structural count, Holm adjustment, recovery of known irregularly timed slopes, duplicate suppression, within-day scatter, nonlinear trend inflation, eligibility, privacy allowlists, unchanged NKPI with added history, exact historical thresholds, artifact integrity and recovery of a simulated multivariate slope population.

`tests/test_progression_summary.cjs`: real Python service to production JavaScript contract; OD/OS displays, 0–3 structural count plus supporting BAD-D, actual-interval ordering, no future count, source/eye/artifact mismatch rejection, rate/evidence consistency, history canonicalization, stale responses, source edits, clearing and preservation of score layout.

`tests/test_bilateral_review.cjs`: existing review tests plus automatic inclusion of a resolved same-eye intermediate scan; rejection of unresolved, manually ambiguous or quality-unknown extra scans; rejection after interval editing; numeric-only history with dates/identifiers excluded.

## Preserved workflow regressions

All included test entry points passed:

- `test_model_interval.py`
- `test_evidence.py`
- `test_domain_training.py` (historical inactive research candidates)
- `test_progression_summary.cjs`
- `test_bilateral_review.cjs`
- `test_bilateral_import.cjs`
- `test_auto_import_merge.cjs`
- `test_extraction_integrity.cjs`
- `test_second_reader.cjs`
- `test_score_band.cjs`
- `test_map_identification.cjs`

The original wrong ARTmax 236/296 regression still blocks silent confirmation. Bilateral discovery, incomplete source handling, numeric extraction checks, OCR reader decision logic and source-edit invalidation still pass. These are controlled tests, not a new real-world OCR accuracy benchmark or a promise of 6/6 extraction on every report.

## Score preservation

All three files in `models/` are byte-identical to 7.9.1. An additional 80 deterministic synthetic baseline/two-visit cases produced exactly identical NKPI predictions and explanations between releases. Both-eye PDF generation succeeded. The PDF interface label is updated; its existing NKPI content is preserved.

## Browser and startup

Headless Chromium rendered the production evidence renderer at 1200, 760 and 390 pixels without horizontal page overflow. Both eye cards, group disclosures, calculation tables and observed-first order were checked. Screenshots were visually inspected.

The actual calculator component was run in a parent frame connected to the real Python service: synthetic example, both scores, new dropdown, input edit, clearing of stale evidence and recalculation passed with zero JavaScript runtime errors. This test blocked CDN resources; it did not repeat real OCR inference. Streamlit AppTest started successfully from the project root with no app exception or error.

## Packaging

The release uses ordinary DEFLATE ZIP entries. CRC, full extraction and SHA-256 manifest checks were run on a fresh extracted copy. No patient workbook, source reports or private fitting rows are included. The package contains source code, aggregate model artifacts, bundled OCR resources, tests, documentation and fictional preview data.

## Remaining validation

External same-day measurement precision has not been validated for this app's interday comparisons. The joint prior is a selected-cohort rate regularizer, not a validated future predictor. Additional visits are only included when their values, eye, dates and quality meet the stated import rules. Clinical use requires an appropriate validation study beyond these engineering checks.
