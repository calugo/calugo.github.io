---
layout: post
title: "Genome evolution in Host-Pathogen systems"
date: 2014-10-14 17:54:02 +0100
comments: true
categories: [Scientific computing, IPython, Systems Biology, Open Science, Monte-Carlo simulation]
image: "/images/pinfestans.svg"
---
## Finally the host pathogen entry! <!-- more -->
  <p align="justify">
  This entry is the reason behind setting up the blog. The idea is to build up a mathematical-computational
  model of plant pathogen's genome evolution to explore different scenarios such as evolutionary responses to  host jumps.  
  In the following I will be presenting and discussing every aspect of the  model
  in detail, maths, code, etc. Then  (soon I hope) it will be turned into a manuscript.
  </p>
  <p align="justify">
  Perhaps the final version will be published in Nature or Science and the results will grant me a Nobel prize and the blog a Pulitzer,
 or perhaps it might not be the case, however, it is an experiment which will allow me to share with everyone the ideas, techniques and intellectual process involved in carrying out research
  of this nature in <b>real time</b>.</p>

  <p align="justify">
    One of the advantages of this format is that I can share not only ideas and calculations but also code!. In fact,
   both <a href="http://github.com">GitHub</a> and <a href="http://octopress.org/">Octopress</a> are mostly used
    for that purpose, so yeah, I will be sharing and describing  code bits and pieces
   where appropiate. The full code (and more...) to reproduce the results described here are hosted and documented in its own
   <a href="http://calugo.github.io/TSL-PROJECT-A/">repository</a>.
  </p>
  <p align="justify">
    For this project I am  using python, (I do a lot of testing and tinkering in <a href="#ipyth"> <b>IPython</b></a>,
   I strongly advice you to do the same!). The model heavily  relies on the sampling of random variables and because  
   I love and respect the algorithms
   contained in the <a href="#gsl"><b>GNU Scientific Library</b></a> I
   ended up using the <a target="_blank" href="http://sourceforge.net/projects/pygsl/">pygsl</a>  wrapper, however <a target="_blank" href="http://www.numpy.org/">NumPy</a> and <a target="_blank" href="http://www.scipy.org/">SciPy</a> also contain well documented and functional modules.
  </p>

  <p align="justify">
   As expected with this sort of thing it would be really cool if you would like to leave a comment or e-mail me about
    the ideas presented here (<b>computational, biological or mathematical</b>). In any case, having
    said all the above let's begin without further ado.
 </p>

##Index
1. [Introduction](#Introduction)
2. [Model](#Model)
  * [Model Genes and Genomes](#Genes)
    * [I. Host Target Units](#TU)
    * [II. Pathogen Effector Units](#EF)
    * [III. TE and Non-Coding Units](#TE)
  * [Evolutionary Processes](#Evolutionary_Dynamics)
3. [Results](#Results)
4. [References](#References)


##<a id="Introduction"></a>Introduction
<p align="justify">
Comparative genomic analysis between elements in clades of plant pathogens exhibit some
striking differences in length and genome architecture, such divergences are mostly localised in genes and
regions of the genome which are in charge of coding the host-pathogen interactions. These domains
present a  high content of  transposable elements embedding sparse genetic units
in charge of establishing the trophic link with the host.  Those regions and genes are the object of this study.
</p>

<p align="justify">
The analysis also suggests that such  domains of <b>non-coding</b> and <b>effector</b> genes
could be the result of processes related to extreme environmental pressures, specifically
 a shift from one host into another (<b>host jump</b>).  
</p>

<p align="justify">
We will restrict to the case in which the set of effector proteins carried by the pathogen
is already successful in invading and tinkering the host's biochemistry, and we do
not be considering any co-evolutionary processes.
</p>



##<a id="Model"></a>Model

<p align="justify">
The genes responsible for the host-pathogen interaction are what we will call here <b>effector genes</b> (EG), we will assume
 that these EGs encode proteins which mediate the biochemical processes which allow the pathogen  to extract resources
  from the host, by establishing links with <b>target units</b> (TU) or molecules within the host.
</p>

###<a id="Genes"></a>Model Genes and Genomes.

###<a id="TU"></a>I. Host Target Sets.

<p align="justify">
We will identify the set of all TUs with a set of integers  $\mathcal{T}=\{1,\dots,K_T\}$ from which
 we can choose a subset to form particular
instances of hosts. For example if $K_T=5000$, then we can form two hosts by forming ordered arrays of
some length $L<K_T$, such as  $h_1=(1,10,100,1000)$ and $h_2=(20,90,835)$.
</p>

<p align="justify">
In python this can be achieved efficiently in a number of different ways. In order to
illustrate one method and to introduce the way in which we will be using the modules we write for the model,
I will write a function which will create lists of TU numbers with no repeated elements. The function will take
 three arguments: the length of the list $L$, the value $K_T$ and the handler for the random number generator which we
 will call rk.
 The function looks like:
</p>

{% codeblock lang:python %}
def NEWHOST(L,K,rk):

  hx=[]
  q=1
  zx=1+rk.uniform_int(K)
  hx.append(zx)
  while q<L:
    mu=0
    zx=1+rk.uniform_int(K)
    for j in hx:
      if j==zx:
        mu=1
        break

    if mu==0:
      hx.append(zx)
      q=q+1

  hx.sort()

  return hx

{% endcodeblock %}

<p align="justify">
Although Python is a very easy
 language to use, a word of caution most be said at this stage.
  In Python we should be aware of
the <b>indentation</b> level of the statements at all times! Indeed,
this is one of those scripting languages in which indentation matters, and if it is
not correct the code will not work. So keep it in mind always.
</p>

<p align="justify">
The function is called NEWHOST, and saved it in a file named
 <b>newhost.py</b>. This and every other
 file related to the model will be placed in a folder called <b>codes</b>.
 Of particular interest is a file named as <b>hpmodel.py</b> which I will use to import every function separately.
 For instance to import the host generating function we must add to it the line:
</p>

{% codeblock lang:python %}
import newhost
{% endcodeblock %}

<p>
The setup described so far will allow us to call <b>hpmodel</b> and all the
custom functions we import to it in the same way we use
any other python module. For instance:
</p>

{% codeblock lang:python %}
#!/usr/bin/env python
#INITIALIZATION
import sys #imports the sys module which we use to add a path
sys.path.append('../codes/') #adds the path to codes
from pygsl import rng as rn #the random numbers modules
import math as mth  
import numpy as np
import hpmodel as mda #HERE IS OUR MODULE!
import pickle
#Constants and Parameters
SEED=987654320 #The random number generator seed
rk=rn.rng()    #The instance generator
rk.set(SEED)   #
LH=10 #HOST LENGTH
Kh=500 # Host Urn Size
Kp=100 # Pathoghen Urn Size
NJMPS=10 #number of jumps
{% endcodeblock %}

<p align="justify">
These lines import some basic python modules which will be useful later, but also
import the custom <b>hpmodel</b> with the alias mda, then if we execute something like:
</p>

{% codeblock lang:python %}
#Hosts Arrays!!!!

ho=mda.newhost.NEWHOST(LH,Kh,rk) #Creates a new host

HSTa={} #UNCORR
HSTb={} #CORR
HSTc={} #UNEVENLENGTH
HSTa[0]=ho
HSTb[0]=ho
HSTc[0]=ho

print HSTa[0]
print HSTb[0]
print HSTc[0]



for j in range(1,NJMPS):
    print j
    HSTa[j]=mda.newhost.NEWHOST(LH,Kh,rk)
    HSTb[j]=mda.newhostcorr.NEWHOSTCORR(HSTb[j-1],Kh,rk)
    HSTc[j]=mda.newhostvarl.NEWHOSTVARL(LH,Kh,rk)
    print HSTa[j]
    print HSTb[j]
    print HSTc[j]
{% endcodeblock %}

<p align="justify">
We will end up with three dictionaries having ten diferent hosts. The one
called HSTa populated with the previously described function. The other
two populated with lists of correlated host (HSTb) and HSTc  populated with lists
of different lenghts (padded with zeroes) respectively. Both
modules also imported from <b>hpmodule</b>. A typical output should like
similar to:
</p>

```
[89L, 134L, 173L, 187L, 213L, 232L, 260L, 290L, 326L, 386L]
[89L, 134L, 173L, 187L, 213L, 232L, 260L, 290L, 326L, 386L]
[89L, 134L, 173L, 187L, 213L, 232L, 260L, 290L, 326L, 386L]
1
[25L, 31L, 140L, 162L, 172L, 196L, 281L, 328L, 388L, 464L]
[89L, 134L, 173L, 187L, 213L, 232L, 260L, 273L, 290L, 326L]
[7L, 16L, 0, 85L, 206L, 241L, 338L, 419L, 423L, 461L]
2
[42L, 98L, 129L, 184L, 250L, 315L, 333L, 335L, 458L, 481L]
[1L, 89L, 134L, 173L, 187L, 213L, 232L, 260L, 290L, 326L]
[6L, 57L, 135L, 139L, 155L, 248L, 0, 374L, 396L, 403L]
3
[40L, 92L, 168L, 192L, 206L, 249L, 274L, 333L, 354L, 417L]
[1L, 53L, 89L, 134L, 173L, 187L, 232L, 260L, 290L, 326L]
[72L, 0, 0, 0, 0, 338L, 373L, 0, 442L, 0]
4
[25L, 33L, 95L, 115L, 123L, 159L, 336L, 342L, 395L, 432L]
[1L, 53L, 89L, 134L, 173L, 182L, 187L, 232L, 260L, 326L]
[23L, 72L, 0, 0, 0, 103L, 0, 233L, 284L, 309L]
5
[39L, 230L, 253L, 322L, 341L, 386L, 440L, 447L, 471L, 496L]
[1L, 30L, 53L, 89L, 134L, 173L, 182L, 187L, 232L, 326L]
[0, 153L, 155L, 179L, 184L, 0, 325L, 368L, 0, 454L]
6
[63L, 162L, 166L, 271L, 325L, 328L, 331L, 417L, 450L, 464L]
[1L, 30L, 53L, 89L, 134L, 173L, 187L, 232L, 326L, 446L]
[25L, 42L, 52L, 60L, 0, 160L, 0, 334L, 0, 401L]
7
[2L, 55L, 75L, 104L, 115L, 261L, 310L, 422L, 456L, 458L]
[1L, 30L, 53L, 89L, 134L, 173L, 187L, 326L, 377L, 446L]
[136L, 152L, 237L, 272L, 301L, 374L, 391L, 404L, 437L, 0]
8
[16L, 17L, 91L, 195L, 216L, 230L, 297L, 310L, 361L, 449L]
[1L, 53L, 89L, 134L, 173L, 187L, 227L, 326L, 377L, 446L]
[0, 0, 0, 173L, 0, 219L, 334L, 354L, 464L, 0]
9
[34L, 44L, 147L, 192L, 231L, 236L, 320L, 326L, 341L, 346L]
[1L, 53L, 89L, 134L, 173L, 187L, 227L, 377L, 422L, 446L]
[1L, 71L, 103L, 0, 194L, 284L, 299L, 0, 0, 378L]
```

<p align="justify">
Once we have a function to generate lists of TUs, which  we will be
considering these as the inner degrees of freedom of our model hosts, we now
move into describing in detail our model pathogen genomes
</p>

###<a id="EF"></a>II. Effector Units.

<p align="justify">
As stated earlier, we are interested in the <b>structural aspects</b> of the
pathogen's genome evolution. We are not addressing directly the dynamics of
 gene frequencies which is described by the theory of population genetics. We do
 consider that the changes induced in the genome are the results of processes such as
 <b>mutation</b>, <b>selection</b>, <b>drift</b> coupled with dynamics at a different
 scales such as <b>horizontal gene transfer</b> every single process  will be
 explained  in detail the forthcoming sections.
</p>

<p align="justify">
The first  we would like to introduce is the model for EGs. We will define EGs by a
number of attributes rather than its particular nucleotide sequence. For instance, we will consider its number of bases (length),
the existence and strength of links between the EG and its particular list of TUs
within a  host, etc.
</p>

**Adjacency lists.**

<p align="justify">
First and foremost we will introduce the list of possible targets a particular EG is
able to <b>connect</b> to out of the universal set $\mathcal{T}$. We call this list the
EG's   adjacency list. To construct the adjacency set of a given effector we introduce
  a parameter $c \in (0,1)$ which we will use to assign the initial number of targets
in the list <b>accesible</b> to that effector.
  </p>
<p align="justify">
  If we want the initial number of TU's of every EGs present in the genome  to be (on average) equal to
  $cK_T$, we  need to sample numbers $n_i$ from a binomial distribution with parameters
  $c$ and $K_T$. Then the  initial adjacency list for
  each EG can be generated by using our function NEWHOST passing to it $n_i$  and $K_T$, for example:
</p>



{% codeblock lang:python %}

print C, Kh, Lwn
rk2=np.random.RandomState(SEED).binomial(Kh,C,10)
print rk2
for ni in rk2:
    li=mda.newhost.NEWHOST(ni,Kh,rk)
    print ni, li
{% endcodeblock %}

Which should produce an output similar to:

```
0.01 500 5.0
[4 5 4 4 7 2 7 4 2 8]
4 [113L, 301L, 319L, 373L]
5 [128L, 133L, 300L, 317L, 409L]
4 [30L, 46L, 314L, 366L]
4 [247L, 352L, 362L, 394L]
7 [35L, 154L, 218L, 248L, 327L, 353L, 395L]
2 [355L, 456L]
7 [250L, 278L, 318L, 350L, 372L, 438L, 450L]
4 [49L, 196L, 255L, 476L]
2 [219L, 461L]
8 [93L, 167L, 194L, 308L, 388L, 396L, 403L, 410L]
```

<p align="justify">
The above example shows the way we will generate the initial adjacency list for every EG in a genome.These list will
determine if the effector is able or not to gain resources from the host, by comparing the elements present in its  
list with the ones present at the  hosts.
</p>

<p align="justify">
The adjacency lists are not the only attribute we will be considering to determine interactions between a
give EGs and a host. We will also like the strength of such interaction to be evolving quantities.
</p>

**Link Weights and Effector Scores.**

<p align="justify">
To quantify the host-pathogen interaction dynamics is perhaps the most complicated
aspect when one attempts to build up models  which operate at this <b>mesoscopic</b> level of description. To do so
we will introduce two quantities which we call the <b>effector-target link scores</b> denoted by $s_{e,t}$ and the effector-target
  gain $g_{e,t}$. The former attempt to capture how good does an effector is in obtaining resources for the pathoghen.  
</p>



<p align="justify">
</p>

###<a id="TE"></a>III. Transposable Elements and Non-coding Units


##<a id="Results"></a>Results

<p align="justify">
</p>

##<a id="References"></a>References

1. <a name="ipyth"></a><a target="_blank" href="http://ipython.org">Fernando Pérez, Brian E. Granger, IPython: A System for Interactive Scientific Computing,
  Computing in Science and Engineering, vol. 9, no. 3, pp. 21-29, May/June 2007, doi:10.1109/MCSE.2007.53. URL: http://ipython.org</a>

1. <a name="gsl"></a><a target="_blank" href="http://www.gnu.org/software/gsl/"> M. Galassi et al, GNU Scientific Library Reference Manual (3rd Ed.), ISBN 0954612078.
If you want to give a url, URL: http://www.gnu.org/software/gsl/.</a>
