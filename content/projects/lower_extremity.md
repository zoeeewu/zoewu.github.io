+++
title = "Population-Specific Modeling of Lower-Extremity Muscle Morphology"
summary = "Population-specific modeling project using CT-derived anatomy and anthropometrics to predict lower-extremity muscle MaxCSA."
project_summary = """
This project develops population-specific models of lower-extremity muscle morphology from CT-derived anatomical measurements. The goal is to translate these population-level relationships into individualized estimates of maximum cross-sectional area (MaxCSA), providing biomechanical information that can be used to personalize musculoskeletal models.

I processed lower-extremity CT data using 3D Slicer and TotalSegmentator to extract muscle morphology features, then linked these measurements with subject-level variables for predictive modeling. Current analyses suggest that sex and BMI explain a meaningful portion of population variation in MaxCSA, supporting a practical path toward subject-specific model personalization when direct muscle measurements are unavailable. The project is ongoing, with further work focused on refining these relationships across different muscle groups.
"""
date = 2026-05-01
draft = false
weight = 20
home_featured = true
project_status = "2026.05 - Present"
role = "Volunteer Researcher"
figures = [
  { src = "/images/projects/lower_extremity/main-figure.png", alt = "Overview graphic for Population-Specific Modeling of Lower-Extremity Muscle Morphology", caption = "CT-derived muscle segmentations were processed through a MATLAB pipeline to identify maximum cross-sectional area, which was then modeled against anthropometric characteristics." },
  { src = "/images/projects/lower_extremity/1_BMIGroup_ModelPerfor.png", alt = "Model performance comparison grouped by BMI", caption = "Model-performance comparison across BMI groups." },
  { src = "/images/projects/lower_extremity/2_TM.png", alt = "Lower-extremity tissue morphology visualization", caption = "Tissue morphology visualization from the modeling workflow." },
  { src = "/images/projects/lower_extremity/3_Cir.png", alt = "Lower-extremity circular measurement visualization", caption = "Measurement visualization of thigh circumference." }
]
methods = ["CT", "Population-specific mathematical models", "3D slicer", "TotalSegmentator"]
+++

## Key Methods

- Computational imaging and muscle-segmentation pipeline
- MATLAB-based muscle morphology analysis
- Computational biomechanical modeling

## Main Outputs

- CT-derived thigh circumference and muscle morphology measurements
- Population-specific MaxCSA prediction models
