# Update to 8.5.0 — score outlook

1. Download `NKPI_v850_Extract.zip` and choose **Extract All** in Windows.
2. Upload the extracted contents to the calculator GitHub repository, preserving the folders and replacing files of the same names. Keep existing deployment secrets private.
3. Set Streamlit’s main file to `kcn_dual_calculator_app.py` and reboot the app.
4. Refresh the browser. The footer should show **8.5.0-score-outlook**.
5. Calculate verified **Single visit** inputs. Open **NKPI score outlook · 12 months**. Both-eye score lines should appear immediately, with Current, At 12 months, and change in points.
6. Try **Magnify change**, expand the exact-score table, edit an input, and recalculate. The affected eye’s old line must disappear until recalculated.

The numerical NKPI and trajectory formulas have not changed. The probability cards were replaced by score trajectories. This release does not claim improved clinical forecast accuracy. Two-visit cases retain their separate observed-change section.

The ZIP is standard DEFLATE, unencrypted, with no ZIP64 requirement and 99 files. Upload the files inside it, not the ZIP itself. Do not upload report images, private datasets or local credentials.
