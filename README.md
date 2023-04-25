# pyCAT: The SWPC/UKMO Python CME Analysis Tool

The Space Weather Prediction Center (SWPC) is a laboratory and weather forecasting center of the United States National Oceanic and Atmospheric Organization (NOAA).

The Meterological Office of the United Kingdom (UKMO) is the UK's national weather service.

## The CME Analysis Tool (CAT)

The CME Analysis Tool (CAT) was originally developed at NOAA SWPC and has been used operationally by SWPC forecasters since 2011 (Millward et al 2013).  The CAT has since been implemented for operational space weather forecasting at the UKMO and other space weather centers worldwide.

The purpose of the original CAT was to enable forecasters to interactively create a 3D analytic model of an Earth-directed coronal mass ejection (CME) based on coronagraph observations.  The analytic model is a SWPC version of the Cone model, in which a CME is represented by a 3D leminiscate volume that propagates radially away from the Sun with a constant velocity.  The Cone model is fully described by four parameters that specify the speed and direction (latitude, longitude) of the velocity vector and the cross-sectional width, expressed as a cone angle.

One or more Cone models of CMEs are then introduced into the Enlil MHD heliosphere model to simulate the propagation of the CME from 21.5 Rsun to the Earth.  This propagation occurs amid an ambient solar wind that is computed by means of the Wang-Sheeley-Arge (WSA) model, based on photospheric magnetic field measurements by the [Global Oscillations Network Group (GONG)](https://gong.nso.edu/).  CAT-derived Cone models of CMEs can also be used with other coronal and heliosphere models and photospheric magnetograms from other sources.   Cone-WSA-Enlil simulations such as these are used by SWPC and UKMO to forecast CME arrival times at Earth.

Cone fits to halo CMEs with CAT are by far most reliable when multiple vantage points are available.  Current operational CAT implementations at SWPC and UKMO leverage observations from the LASCO C2 and C3 coronagraphs on NASA's [SOHO](https://soho.nascom.nasa.gov/) spacecraft and the COR2 coronagraph on NASA's [STEREO-A](https://stereo.gsfc.nasa.gov/) spacecraft (STEREO-B observations were also used before spacecraft communications were lost in 2014).

## pyCAT

pyCAT is a reimplementation and reimagining of CAT.  It will reproduce the capabilities of CAT in the sense that users will be able to interactively fit LASCO and STEREO coronagraph imagery to Cone models that can be introduced into WSA-Enlil simulations.  But, it is designed to do more: to enhance current functionality and to accommodate future developments that we can now only imagine.

Stay tuned for more details.

---

> G. Millward, D. Biesecker, V. Pizzo, and C. A. de Koning 2013, "An Operational Toole for the Analysis of Coronagraph Images: Determining CME Parameters for Input into the WSA-Enlil Heliospheric Model", Space Weather, 11, 57-68, [doi:10.1002/swe.20024](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/swe.20024)