+++
title = "EOG-Based Gaze-Directed Audio Control System"
summary = "Biomedical instrumentation prototype using EOG signal conditioning and LabVIEW classification to control directional audio focus."
project_summary = """
This team-based biomedical instrumentation project developed a proof-of-concept audio control system that used electrooculography (EOG) to infer gaze direction for assistive-hearing applications.

Our team designed a three-stage analog circuit to acquire and condition EOG signals before sending them to LabVIEW, where calibrated thresholds classified left, center, and right gaze positions and adjusted directional audio accordingly. Across all tested gaze transitions, the system switched audio as intended, keeping the target direction at 100% volume while attenuating the other channels to 10%. A key limitation was signal decay: lateral-gaze EOG signals returned toward baseline within roughly 4.7–6.1 seconds, which could eventually cause the system to reclassify sustained left or right gaze as center.
"""
date = 2026-01-01
draft = false
weight = 40
project_status = "2026.01 - 2026.04"
role = "System Integration"
figures = [
  { src = "/images/projects/eog/main-figure.png", alt = "Overview graphic for EOG-Based Gaze-Directed Audio Control System", caption = "EOG-based gaze detection workflow with signal conditioning, LabVIEW classification, and measured system response time." },
  { src = "/images/projects/eog/1_Circuit.png", alt = "Circuit diagram for the EOG signal conditioning system", caption = "Signal-conditioning circuit used for EOG acquisition." },
  { src = "/images/projects/eog/2_breadborad.png", alt = "Breadboard implementation of the EOG signal conditioning system", caption = "Breadboard implementation of the signal-conditioning circuit." },
  { src = "/images/projects/eog/3_Bode plot.png", alt = "Bode plot for the EOG signal conditioning circuit", caption = "Bode plot of the EOG signal-conditioning circuit." }
]
methods = ["EOG", "Custom analog signal conditioning", "Gaze classification", "Audio control", "LabVIEW"]
+++

## Key Methods

- EOG signal acquisition with LabVIEW
- Analog amplification and band-pass filtering
- Threshold-based gaze classification
- Real-time audio control

## Main Outputs

- Three-stage signal-conditioning circuit
- Directional audio switching across tested gaze transitions
- Characterization of EOG signal decay and recalibration limits
