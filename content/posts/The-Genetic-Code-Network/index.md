---
title: "Interactive network visualisation - The Genetic Code"
date: 2024-12-11
draft: false
description: "a description"
tags: ["Data Visualization", "two.js","three,js", "Molecular Evolution", "Networks"]
---

<div align = "justify">

Studying molecular evolution presents a lot of opportunities
to venture into interesting side quests, such as the content of this post. Here, I showcase ways to visualise complex networks with some degree of interactivity.

These little renderings were conceived for lectures, talks and videos and  rarely make their way into an academic publication, despite their didactic value. The reason is very simple, publications are a two dimensional, almost static version of media. However, technologies such as Jupyter, WebGL and other rendering backend libraries have been available for a long time now, and their corresponding api's made very easy to use for everybody.
</div>

<div align = "justify">
For the sake of brevity, let's cut to the case, here I am going through how and why I made renderings such as the ones below and what exactly these represent.
</div>


### Viewer I.
<div style = "text-align": center>
 <iframe src="https://calugo.github.io/RNA-NETS/"
 style="border: 3px dotted black; width: 100%; height: 500px;"> </iframe>
<b><i>The genetic code mutation network, which is the example used for this post. It should work on most devices, but 
for a full session of fun, try it with a mouse on a separate tab.</i></b>
</div>

<div align = "justify">

The recommended way to play with the viewer, is on single window, which can be accessed <a href="https://calugo.github.io/RNA-NETS/" target="_blank">here</a> and a legacy version with draggable nodes  <a href="https://calugo.github.io/RNA-NETS/OLDNET" target="_blank">here</a>
</div>

### What is this network? : The genetic code.

<div style="text-align: justify">
For theoreticians, molecular evolution is often a problem to become familiar  with stochastic processes, as mutation and recombination of sequences which generate new genetic variants in DNA and RNA are probabilistic.

On its simplest form at least, the theory is also the prefect segway to understand the origin of important features present in living systems, such as the concepts of <b>robustness</b> of  <b>phenotypes</b> to perturbations of the  <b>genotype</b>  as well as <b>evolvability</b> or the origin of the great variability observed in the phenotypes.

These evolutionary features are also somewhat universal, and these are observed in systems of very different scale and nature, such as molecules, gene-regulation circuits and networks and metabolic networks.

Both, <b>robustness</b> and <b>evolvability</b>  are linked to the topology of the neutral genotype networks, which are defined by all the possible genotypes as nodes and linked if these are a mutation away.
</div> 

Take for instance the following table containing the genetic code:

|  ||Genetic code||  |
|-|-------|-------|-------|-------|-|
||Phe UUU|Ser UCU|Tyr UAU|Cys UGU||
||Phe UUC|Ser UCC|Tyr UAC|Cys UGC||
||Leu UUA|Ser UCA|Stp UAA|Stp UGA||
||Leu UUG|Ser UCG|Stp UAG|Trp UGG||
||Leu CUU|Pro CCU|His CAU|Arg CGU||
||Leu CUC|Pro CCC|His CAC|Arg CGC||
||Leu CUA|Pro CCA|Gln CAA|Arg CGA||
||Leu CUG|Pro CCG|Gln CAG|Arg CGG||
||Ile AUU|Thr ACU|Asn AAU|Ser AGU||
||Ile AUC|Thr ACC|Asn AAC|Ser AGC||
||Ile AUA|Thr ACA|Lys AAA|Arg AGA||
||Met AUG|Thr ACG|Lys AAG|Arg AGG||
||Val GUU|Ala GCU|Asp GAU|Gly GGU||
||Val GUC|Ala GCC|Asp GAC|Gly GGC||
||Val GUA|Ala GCA|Glu GAA|Gly GGA||
||Val GUG|Ala GCG|Glu GAG|Gly GGG||

<div style="text-align: justify">

Each cell contains, on the left, the aminoacid (phenotype) associated with the codon sequence (genotype) on the right.  {{< katex >}} 
In general for an alphabet of four characters like \\(  \\{U,G,A,C\\}  \\) there are \\( 4^L \\) unique sequences of length \\( L \\). Each one with \\( 3 L\\) neighbour sequences one character away from it. Using this and grouping the codons by aminoacid we get the following plot.

</div>


{{<gallery>}}
  <img src="gallery/full.png" class="grid-w100" />
{{</gallery>}}
<div style="text-align: center"><b> <i>
The genetic code network.  Click me.</i></b></div>

</br>

<div style="text-align: justify">
Although (to my taste) the graph is very pretty, it is very difficult to get any any useful information easily. However if we remove all the links from one phenotype to another, keeping just the mutation links within the same aminoacid (synonymous mutations) it is immediate to see what it is meant by robustness, as all cases with more than a single codon, posses mutations which leave the phenotype unchanged.
</div>
</br>
</br>
</br>

{{<gallery>}}
  <img src="gallery/syno.png" class="grid-w100" />
{{</gallery>}}
<div style="text-align: center"><b> <i>
The genetic code network II - Synonymous components.  Click me.</i></b></div>



<div style="text-align: justify">

Now, the most important bit. Evolvability and how is it reflected in these diagrams. By choosing an aminoacid and plotting only the links from its nodes to the rest of the system, we can see how easy is to navigate the network from one aminoacid to all the other ones by only a few mutations, specially for those phenotypes with the largest number of codons.   

</div>

</br>


{{< gallery >}}
  <img src="gallery/Ala.png" class="grid-w33" />
  <img src="gallery/Arg.png" class="grid-w33" />
  <img src="gallery/Asn.png" class="grid-w33" />
{{< /gallery >}}
<div style="text-align: center"><b> <i>
Alanine, Arginine and Asparagine networks. Click on them!
</i></b></div>


{{< gallery >}}
  <img src="gallery/Asp.png" class="grid-w33" />
  <img src="gallery/Cys.png" class="grid-w33" />
  <img src="gallery/Gln.png" class="grid-w33" />
{{< /gallery >}}
<div style="text-align: center"><b> <i>
Aspartic acid, Cysteine and Glutamine networks. Click on them!
</i></b></div>


 {{< gallery >}}
  <img src="gallery/Glu.png" class="grid-w33" />
  <img src="gallery/Gly.png" class="grid-w33" />
  <img src="gallery/His.png" class="grid-w33" />
 {{</ gallery >}}
 <div style="text-align: center"><b> <i>
Glutamine acid, Glycine and Histidine networks. Click on them!
</i></b></div>



 {{< gallery >}} 
  <img src="gallery/Ile.png" class="grid-w33" />
  <img src="gallery/Leu.png" class="grid-w33" />
  <img src="gallery/Lys.png" class="grid-w33" />
{{< /gallery >}}
 <div style="text-align: center"><b> <i>
Isoleucine, Leucine and Lysine networks. Click on them!
</i></b></div>




 {{< gallery >}}
  <img src="gallery/Met.png" class="grid-w33" />
  <img src="gallery/Phe.png" class="grid-w33" />
  <img src="gallery/Pro.png" class="grid-w33" />
 {{< /gallery >}}
<div style="text-align: center"><b> <i>
Methionine, Penylalanine and Proline networks. Click on them!
</i></b></div>


{{< gallery >}}
  <img src="gallery/Ser.png" class="grid-w33" />
  <img src="gallery/Stop.png" class="grid-w33" />
  <img src="gallery/Thr.png" class="grid-w33" />
{{< /gallery >}}
<div style="text-align: center"><b> <i>
Serine, Stop and Threonine networks. Click on them!
</i></b></div>


 
 {{< gallery >}}
  <img src="gallery/Trp.png" class="grid-w33" />
  <img src="gallery/Tyr.png" class="grid-w33" />
  <img src="gallery/Val.png" class="grid-w33" />
 {{< /gallery >}}
 <div style="text-align: center"><b> <i>
Tryptophan, Tyrosin and Valine networks. Click on them!
</i></b></div>

As we can see from these awesome plots (to my taste) even this simple system contains enough complexity to make the graphical representation of the main ideas quite convoluted. For comparison purposes and fun, all the information so far presented is shown in the same form in the viewer already presented at the beginning of this entry, and also, in the same format as the plots above, in the following renderer.

### Viewer II.
<div style = "text-align": center>
 <iframe src="https://calugo.github.io/RNA-NETS/DISCNET/"
 style="border: 3px dotted black; width: 100%; height: 500px;"> </iframe>
<b><i>The genetic code mutation network and its components. This should work on most devices, but for a full session of fun, try it with a mouse on a separate tab. <a href="https://calugo.github.io/RNA-NETS/DISCNET/"  target="_blank">(Link here!)</a>
</i></b>
</div>

### Final comments.


<div align="justify">
The properties of resultant graph or <b>phenotype landscape</b> allow us to treat the problem of evolution as problem of navigating in a complex network. This is a problem suitable to be treated  with tools of statistical physics. If we posses the knowledge of a well defined <b>genotype-phenotype mapping</b>. This is of course a condition not easily satisfied in the vast majority of real systems. However, the theoretical framework is fairly universal. As an example of this, the plot below shows the case of of the connections between two secondary structures for the case of RNA sequences of length 12. For relatively short lengths, the secondary structure can be considered as a good approximation or proxy for the genotype-phenotype mapping.

</div>
</br>

{{<gallery>}}
  <img src="gallery/Union2.png" class="grid-w100" />
{{</gallery>}}
<div style="text-align: justify"><b> <i>Detail of the connections between two RNA secondary structures of length 12. Showing all the sequences which fold into such structures and connected to other sequences if these are one mutation away. Again, we can see that it is possible to mutate inside and outside the secondary structures, the folding temperature for this structures is T=27 C.</i></b></div>

<div  align="justify">

Finally, these are links for the repository containing the code, as well as for the viewers.

<a href="https://github.com/calugo/RNA-NETS"  target="_blank">Github repository.</a>

<a href="https://calugo.github.io/RNA-NETS/"  target="_blank">Viewer I.</a>

<a href="https://calugo.github.io/RNA-NETS/DISCNET/"  target="_blank">Viewer II.</a>

<a href="https://calugo.github.io/RNA-NETS/OLDNET/"  target="_blank">Legacy viewer with draggable nodes.</a>


