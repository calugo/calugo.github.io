---
title: "Python in the browser:  Evolving Networks."
date: 2025-01-23
draft: false
description: "Evolving networks."
tags: ["learning and evolution", "game theory", "complex systems"]
url: "posts/Python in the browser - Evolving networks"
showTableOfContents: false
---

<div style= "text-align: justify">

The surge of technologies like  <a href="https://webassembly.org/" target = "_blank">
WebAssembly</a>
 and its associated ecosystem <a href="https://emscripten.org/index.html" target ="_blank">ecmscripten</a>
 ,  <a href="https://docs.pyscript.net/2025.3.1/" target="_blank">pyscript</a>  and  <a href="https://panel.holoviz.org/index.html" target="_blank">panel</a>, allow the development of web content in languages like C, Go, Julia or Python, which can be executed on almost any modern web-browser.  This provided me with an excellent justification to revise some interesting models and simulations close to my heart, and which can be used to produce demos I can put on spaces like this website.

One example which is very much of interest today not only to me but to several people in the ecology and evolution communities is that of the formation, co-evolution and resilience of ecological networks. 

The advantage of the ability to share codes in repositories for the interested user to carry out their own simulations, is now enhanced with the ability to  literally execute the same code in the browser! So anybody interested can get a flavour of the dynamics and emergent patterns of a complex system!
</div>

## Ecological Evolution as a complex system.

<div style = "text-align: justify">
Here I briefly discuss the main features of the <b>Webworld model</b>.  This milestone model has been applied and studied in several contexts.
 {{< katex >}} Essentially, the problem under consideration is to provide a dynamical framework to understand how an ecosystem produces the hierarchical predator/prey structures called <b>foodwebs</b> from an evolutionary point of view. And to produce networks of <b>who eats who</b> with properties similar to those observed in nature.</div>
</br>
</br>
</br>

<iframe src="https://calugo.github.io/WebWorld/fweb"
 style="height:690px;width:800px;" title="Iframe Example"></iframe>
 <div style="text-align: justify"><b> <i>
Typical foodweb evolution obtained with webworld. Each node represents a species, the node radius is equal to the logarithm of the population and the width of the links is equal to the strength of the interaction. We start with a single species, and continue to show the network as more species are introduced in the system. The arrows show the direction of the resources. At the very beginning of the evolution. The only species present feeds from the external resources.
</i></b></div>

## Foodwebs


<div style = "text-align: justify">
A <b>foodweb</b> is constructed by considering all the species present in an ecosystem and quantifying all the predators and prey of each species. If a species does not posses any prey, but the external resources, then it belongs to the basal level of the network, or <b>basal trophic level</b>. If on the contrary, a species posseses only prey, then it belongs to the <b>top trophic level</b>. A species which posseses both predator and prey relationships, is then accommodated in a <b>trophic level</b> computed by the shortest path to the external resources. In general foodwebs posses but a few of trophic levels and the population sizes of basal species is often orders of magnitude larger that those is the intermediate and upper levels.
</div>


## The webworld model - evolution as a complex system.

<div align = "justify">
A very important aspect of modelling natural phenomena consists of linking the set of equation and core ideas with some representation of the solutions, like a plot or a movie of the dynamical behaviour of the system. Which is of course a not an easy task itself. specially if the system under study is composed by many scales in space and time, as well as several different interacting elements, such as <b>complex systems</b>. 

Complex systems, are those in  which their components interact locally amongst them according to some local rule and are unaware of any global pattern emerging from those interactions. For instance, in an ecosystem, species interact by predator/prey relationships. Some species prey on other species, and at the same time are eaten by some predator species, alongside these, offspring production offspring and natural deaths lead to seasonal population updates, which in turn might lead to patterns, such as oscillatory behaviours, stable co-existense and extinctions. 

These seasonal population updates occur in the time scale of months/years and in general we can write a model as follows. {{< katex >}}  
</div>

$$\dot{N_i}(t)=\lambda \sum_j g_{ij}(t)N_i(t) - \sum_j g_{ji}(t)N_j(t)-d_iN_i(t) \quad (1)$$

<div align = "justify">

The parameters \\( \lambda\\) and \\(d_i\\) correspond to the efficiency at which the resources transfer from a prey to its predator, and the natural death rates.

The only remaining quantities required to complete this model are the specification of the predation rates \\(g_{kl}(t) \\) between species \\( k \\) and \\( l \\), and we have a nice population dynamics model for an ecosystem. However, the goal here is more ambitious, we want to know, how does and ecosystem is formed in the first place!, how does <b>natural selection</b> drove the system to a mature configuration, in which the system (1) operates. To do so, we might, first imagine a starting ecosystem consisting of a single species and establish the criteria to  establish a predator/prey relationship, as well as the mechanism to introduce new species by modifying an existing one.
</div>

### Species features and mutations.

<div style= "text-align: justify">
Species are defined by a set of <b>phenotypical features.</b> This is a set of \(L \) different integers \( f_i=\{n_j\}_{j=1}^L \) taken from a pool of \( K \) possible values. Each of the features is compared against each other by a score encoded in a anti-symmetric \( K\times K \) matrix \(\bf{M}\) which contains a random number. Then if we consider two species \( i,j \).  We score them by computing:

$$S_{ij} = \max \lbrace 0,\frac{1}{L}\sum_{a \in i, \thinspace b \in j} M_{a,b}\rbrace \quad(2)$$

Which allow us to determine if there exists a predator prey relationship between \\( i \\) and \\( j\\). With this definition of species we can treat the external resources as species \\( "0" \\), with a string fixed and a large population value \\( R \\).
</div>


### Choice of diet, rates and evolutionarily stable strategies.

<div style= "text-align: justify">
Once that we have a definition of species and a way to compare them, we can assume that species which are close in terms of features and posses a common prey, will face stronger competition that with species which are not very similar, and in fact, inter-specific competition will be the hardest. 
The competition score between species \(i\) and \(j\) is defined as: 

$$\alpha_{ij} = c+(1-c)q_{ij}\quad(3)$$ and \\(c \in (0,1)\\) is a competition parameter and \\(q_{ij}\\) is the fraction of common features between species.
</div>

<div style= "text-align: justify">

In webworld the consumption rates \\( g_ij(t) \\) make use of the generalised ratio dependent response:

$$g_{ij} = \frac{ f_{ij}S_{ij}N_j }{bNj + \sum_{k} \alpha_{ki}f_{kj}S_kjN_k} \quad(4)$$

The form introduces the fractions \\( f_{ij} \\) which weight the amount of effort a species \\ i \\) puts into hunting for \\(j \\). This means:

$$ f_{ij} = \frac{g_{ij}}{\sum_j g_{ij}} \quad(5)$$

The pair of equations \\( (4) \\) and \\( (5) \\). are re-adjusted everytime the populations change, and in fact determine the foraging strategy of the each predator. This choice of efforts is an evolutionary stable strategy (ESS), which means that any other strategy can be successful against it, provided the ESS is already taken by the majority. The dynamics of the efforts takes place in the shorter time scale of the model, which is that of days. 
</div>

{{<gallery>}}
  <img src="gallery/ESSX.gif" class="grid-w100" />
{{</gallery>}}<div style="text-align: justify"><b> <i>
Evolution of the system in between evolutionary steps, showing the population updates and the adjustment of the efforts (links thickness). We can see an extinction eeven, once a population reaches a value below 1.0
</i></b>


<div style= "text-align: justify">
For a fixed set of species, the foraging and population dynamics will eventually lead to a stationary state, at this point, this is when a new species is aggregated to the system. Once this is achieved, a new species is introduced, by choosing any of the surviving species when the equilibrium is achieved and replacing one of the features for a new one. 

The new species starts with a population on one individual and the short and intermediate time scale dynamics starts again.
</div>
</br>
<iframe src="https://calugo.github.io/WebWorld/joy"
 style= "width: 100%; height:470px;  title="Iframe Example"></iframe>
<div style="text-align: justify"><b> <i>
Evolution of the number of species (right panel) and the efforts matrix (left panel) corresponding to the foodwebs shown earlier. 
</i></b></div>
</br>
</br>

# Code repositories.

<div style = "text-align: justify">
If you want to play with this model in your own computer, or have an issue, there is a github repository available <a href="https://github.com/calugo/WebWorld">here</a>

For the live version of the code, the hugginface model space lives <a href="https://huggingface.co/spaces/kupkasmale/WebWorld"> here </a> and its embedded below!

</div>

## Live Version.
 <iframe
	src="https://kupkasmale-webworld.hf.space"
	frameborder="0"
	style = "width: 100%; height: 450px"
></iframe>
<div style="text-align: justify"><b> <i>
This is it! run the model right here! and right now!. Press the run button and you will see the number of species updating every few hundred evolutionary events (species introduction). This will run until the systems performs 5000 evolutionary time-steps or it reaches 59 species. Once the simulation is completed you can see a diagram of the foodweb in the tab labeled <b>PlotFW</b>. The diagram in the live version is drawn with <b>networkx</b> instead of matplotlib, such as the ones provided in the 
 <a href="https://github.com/calugo/WebWorld">github</a> repository. Please be sure you also visit the
 <a href="https://huggingface.co/spaces/kupkasmale/WebWorld"> hugginface </a> repository to run this on a full screen!
</i></b></div>
</br>
</br>


## Suggested readings for in-depth details and discussion of the model and results.

<div style = "text-align: justify">
 
 For a thorough discussion on the theory of ecological communities, details in the implementation of webworld and other evolutionary approaches, please check the papers and references in the following list:

</div>

1. *Modelling coevolution in multispecies communities*
[J. Theor. Biol.](https://doi.org/10.1006/jtbi.1998.0706)

2. *The influence of predator–prey population dynamics on the long-term evolution of food web structure*
[J. Theor. Biol.](https://doi.org/10.1006/jtbi.2000.2203)
3. *The impact of nonlinear functional responses on the long-term evolution of food web structure.*
[J. Theor. Biol.](https://doi.org/10.1016/j.jtbi.2004.04.033)
4. *Modelling food webs* [
    Handbook of Graphs and Networks: From the Genome to the Internet](https://doi.org/10.1002/3527602755.ch10)
5. *Topological structure and interaction strengths in model food webs.*
[Ecol. Model.](https://doi.org/10.1016/j.ecolmodel.2004.12.018)
6. *The robustness of the Webworld model to changes in its structure.*
[Ecological Complexity](https://doi.org/10.1016/j.ecocom.2007.06.012)

7. *The characteristics of species in an evolutionary food web model*
[J. Theor. Biol.](https://doi.org/10.1016/j.jtbi.2008.02.028)