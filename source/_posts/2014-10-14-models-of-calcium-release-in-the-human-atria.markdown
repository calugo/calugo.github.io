---
layout: post
title: "Calcium dynamics in atrial cells"
date: 2014-10-14 16:53:29 +0100
comments: true
excerpt:
external-url: http://calugo.github.io/UPC-ATRIA/
categories: [Calcium Models, Cardiac Dynamics, Atrial Cells, Ryanodyne Receptors, Statistical Physics, Complexity]
image: "/images/CaiT.png"
---
## Avast Me Hearties! <!-- more --> -  Modelling cardiac dynamics.

<p align="justify">
The heart is such a marvelous system of study from a mathematical point of view because it exhibits
all the features which fascinate those interested in the science of collective phenomena.
Indeed, it is
out of equilibrium, it is highly non-linear, ionic signaling induces mechanical
 responses and it can be studied as an ensemble of discrete and stochastic elements
 which can be "renormalised"
until obtaining reaction-diffusion deterministic field description of the cell and even tissues!
</p>

<p align="justify">
Beyond mathematical reasons it is obvious to say that if we understand the mechanisms driving the state of cardiac myocytes, it is more likely we
 can apply solutions to pathologies which put health at peril, by shedding a light on routes to more specific drug development or non-invasive procedures to correct chronic anomalies.
</p>

<p aligned="justify">
As a member of the  <a href="http://www-fa.upc.es/websfa/eupb/NOLIN/CARDIAC/Welcome.html" >applied physics department</a> of UPC (Barcelona)
 I collaborated in the developmnet of a mathematical model of human atrial cells recently published and entitled:
</p>


 **[Are SR Ca content fluctuations or SR refractoriness the key to atrial cardiac alternans?: insights from a human atrial model](http://ajpheart.physiology.org/content/306/11/H1540)**.

<p align="justify">
The model is pretty detailed, it employs several expressions for pumps and currents developed by
Nygren et al, and Courtemanche et al., but reformulates the
calcium release mechanism in order to study the hypothesis of arrhythmogenesis
induced by refractoriness variability in the calcium release units.
</p>
<p align="justify">
The above means that the <b>calcium release units</b> physically associated with
ryanodine receptors can be mathematically treated as excitable media which undergo
transitions between states, such as <i>active/inactive</i> in which the recovery
time $\tau_{rec}$ is the reciprocal number to the rate of occurrence  one of such transitions.
</p>
<div style="text-align: center;">
<img src="{{ root_url }}/images/BCNATRIA.png" width="700" />
<p> A)The model's compartment schematics. B) RyRs states diagram.</p>
</div>
<p align="justify">
It is the relationship between $\tau_{rec}$ and the pacemaker cells $T_{stim}$ which governs
the mechanism known as "recovery from inactivation" and it is extensively described in our paper
and the references therein
</p>

<div style="text-align: center;">
<img src="{{ root_url }}/images/BCNRESULTS.png" width="700" />
<p>Some results obtained from varying the refractoriness: Bifurcations, Alternans, Hysteresis.
</p>
</div>
<p align="justify">
These  <b>RyRs stochastic dynamics</b> constitute the dynamical aspect which interests me the most. Hopefully I will post about
that soon, basically they can be described by Master Equations and which can be treated
analytically by perturbation analysis, Floquet theory and all the machinery of non-linear science, which
makes the entire class of systems a very rich and active field.  
</p>
<p align="justify">
That is all for now, I assume you have visited the UPC cardiac dynamics site, if not,
<a href="http://www-fa.upc.es/websfa/eupb/NOLIN/CARDIAC/Welcome.html" >here is the link </a> again. If you want
to start a PhD or are thinking of a  postdoc, check it out, they are pretty good and on top of that it is located
in the mighty city of Barcelona!.

 Finally, let me just link you all (asuming someone reads this) to the model's source code and project page, as well as to a
great site about virtual hearts mantained Liz Cherry and Flavio Fenton.
</p>  

## Links:

  * **UPC-Atrial model code:** [here](http://calugo.github.io/UPC-ATRIA/
) (Github project page)
  * [**The Virtual Heart!**](http://thevirtualheart.org/)
