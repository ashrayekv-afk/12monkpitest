# NKPI bilateral calculator — 8.5.0

This version makes the **NKPI score outlook** the primary baseline supplement. It shows actual current NKPI, an experimental projected score at 12 months, the change in points, and separate OD/OS lines. It does not display a progression percentage in that supplement.

## Deploy

1. Use Windows **Extract All** on **NKPI_v850_Extract.zip**.
2. Replace the previous GitHub repository files with these files, preserving the folders. The ZIP contains 99 files, below GitHub’s 100-file upload limit.
3. Streamlit main file: **kcn_dual_calculator_app.py**. Reboot after upload, then refresh the browser.
4. Calculate a **Single visit**, then open **NKPI score outlook · 12 months** beneath the NKPI results. The chart is immediately visible inside that dropdown.

Local: `pip install -r requirements.txt` then `streamlit run kcn_dual_calculator_app.py`.

## Display

- Current score → projected score at 12 months; change is in NKPI points.
- Filled markers are the current calculated score. Dashed lines and open markers are projected scores at 3, 6, 9 and 12 months.
- **Magnify change** switches to a symmetric point-change scale centered on zero. The normal score view retains the full 0–100 scale.
- Faint dotted lines are unchanged-score references. Exact scores are available in a disclosure below the chart.
- Each eye has an expandable sensitivity audit and a breakdown of the age term and estimated measurement contribution.
- Quality flags and sparse high-score support remain visible in neutral styling. Valid, verified measurements still receive their existing NKPI score with quality warnings.

## Accuracy and meaning

The displayed trajectory uses the existing dataset-fitted ridge model, trained on 232 eligible paired eyes / 130 patients. Coefficients and every numerical result are unchanged from v8.4. This is a presentation and interpretation update, not a newly validated forecast.

Near one year (45 eyes / 25 patients, 9–15 months), the internal trajectory RMSE was **3.869 NKPI points**, versus **3.862** for predicting no score change. Mean absolute errors were 1.954 and 1.908 points. Therefore, a more accurate prediction has not been demonstrated. A lower projected score can result from aging in the score formula or regression toward the cohort average; it does not establish improvement or stability. Future points assume no corneal treatment.

The user’s clinic observations concern eyes already judged to be progressing and scheduled for CXL in 1–2 months. These are not prospective 12-month outcomes and were not used to force the lines upward. There is only one eligible development eye with baseline NKPI >=65. Baseline NKPI and two-visit NKPI use different formulas.

Automatic extraction, original NKPI scores, longitudinal evidence and existing holds are preserved. The prior numerical-domain probability model remains in the audited JSON and research artifact for reproducibility; it has no probability card in the baseline display.

Open **docs/BASELINE_OUTLOOK_PREVIEW.html** after extraction for the working offline synthetic example. See **docs/BASELINE_OUTLOOK.md** for formulas and model results and **docs/TEST_REPORT.md** for checks. No patient source rows or clinical reports are included.
