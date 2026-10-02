# Research artifacts — interface 8.5

`baseline_forecast_demo.json` plus its checksum stores the existing score trajectory and the historical v8.4 numerical-domain probability model. In v8.5 the score trajectory is the primary baseline display; the probability remains in audited JSON only. No coefficients were changed. See `../docs/BASELINE_OUTLOOK.md` for formulas, evaluation and caveats.

`evidence_model.json` and its checksum are used only for separately labelled cohort-adjusted observed rates. Primary reference-evidence flags do not use this fitted prior.

Offline reproduction requires authorized private data plus numpy, pandas, scipy and scikit-learn. Training is never run in the deployed calculator. `fit_observed_evidence.py` reproduces the observed-rate prior. `train_domain_outlook.py` contains the historical six-month endpoint experiments, the baseline probability experiments, and the score trajectory fitting recipe. Use separate private output folders and preserve the shipped active artifact unless deliberately conducting a reviewed model update.

The `domain_training/` probability candidates and `trajectory_feasibility.json` are historical, inactive experiments. Their numerical outcomes are not clinical adjudications. No patient rows or report images belong in this public package.
