---
layout: post
title: "Calcium dynamics in atrial tissues"
date: 2014-10-14 16:58:32 +0100
comments: true
categories: [python animations, Cardiac Tissue Models, Calcium Alternans, Cardiac Waves, Calcium Dynamics in the Human Heart, Cardiac Dynamics, Atrial Cells, Ryanodyne Receptors, Statistical Physics, Complexity]
image: "/images/Cai2png.png"
---
##Cell+Cell+Cell+...+Cell$\neq$Tissue! <!-- more -->

<p align="justify">
This is an ongoing project, and it consists of investigating the emergent phenomena resulting from coupling
cells (from the model presented
<a href="http://ajpheart.physiology.org/content/306/11/H1540" >here</a>) by coupling the membrane potential
$V_m(r,t)$ of every cell and distributing alternating-non alternating domains of cells and see what happens.
</p>
Cells are coupled by junctions as:

$$\frac{dVm(r)}{dt}=-\frac{I(r)}{C_m}+\frac{D}{(\Delta r)^2}\sum_{r' \in r_{n.n}}(V_m(r')-V_m(r))$$

With:

  * $\Delta r=0.025[\mu m]$ ,
  * $dt=0.01$  $[ms]$  (so $[D]=[\mu m]^2/[ms]$).
  * $T_{stim}=400$  $[ms]$ (Alternating regime)

<p align="justify">
Early versions of these
experiments showed wave blockage and re-entry waves in the $V_m$ field. Although I haven't
considered real human atria geometries I have dozens of cool results by setting up a variety of
arrangements for domains of sick and healthy cells.</p>
<p align="justify">
The one I show in this post is very interesting, it exhibits <b>discordant alternans</b>, induced only by the geometry.
This means that the alternans within the sick cells domain occurs completely
out of phase.</p>
<p align="justify">
 For a better understanding of what I am trying to communicate check the movies below.
</p>
<p>
$[Ca^{2+}]_{i}(x,y,t):$
</p>
<div style="text-align: center;">
<video width="320" height="240" controls>
 <source src="{{ root_url }}/movies/CAI2D.webm" type="video/mp4">
</video>
</div>

<p>
And, $V_m(x,y,t):$
</p>
<div style="text-align: center;">
<video width="320" height="240" controls>
 <source src="{{ root_url }}/movies/V2D.webm" type="video/mp4">
 Your browser does not support the video tag.
</video>
</div>

<p align="justify">
This is still an open project, although some results have been published,
we are still looking for a reduction of some dynamical aspects ot the
RyR dynamics, as well as to realistic homeomorphims of human atrial geometries.
</p>


# Movie Scripts.

<p align="justify">

To conclude with the post,  I'm going to briefly discuss the scripts
I use to make the movies. These are tweaked versions of the examples
discussed in the matplotlib documentation, and basically are created reading
 data files labeled using time containing a "picture" of a particular
 field variable at that given instant.
<p>

<p align="justify">
It requires the initial and final times, and the encoder FFMpeg installed, and
of course python and matplotlib. The movie is encoded in mp4 format, for
web usage perhaps is better to use "webm" (using ffmpeg -i V2D.mp4 V2D.webm
, for example).
<p>


{% codeblock lang:python %}
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.animation as manimation

FFMpegWriter = manimation.writers['ffmpeg']
metadata = dict(title='Movie Test', artist='Matplotlib',
        comment='Movie support!')
writer = FFMpegWriter(fps=15, metadata=metadata)

fig = plt.figure()
To=6000
Tf=20000
tmk=[]
zi=To
while zi<=Tf:
	tmk.append(zi)
	zi+=5

print tmk
raw_input()

#Initial Setup
Sn='Cai'
Fn="../snaps/"+str(To)+".000000"+Sn+".dat"
print Fn
Nk=np.loadtxt(Fn)

with writer.saving(fig, "CAI2D.mp4", 100):
	plt.imshow(Nk)#, extent = [0,50, 100, 0] )
	cax = plt.axes([0.80, 0.1, 0.04, 0.8])
	zmin=0.0000
	zmax=0.0014
	plt.clim(zmin,zmax)
	plt.colorbar(cax=cax)
	#plt.colorbar()
	fig.suptitle('T= '+str(To), fontsize=14, fontweight='bold')
        writer.grab_frame()
	plt.clf()
	#for i in range(1+To,1+Tf):
	for i in tmk:
		Fn="../snaps/"+str(i)+".000000"+Sn+".dat"
		print Fn
		Nk=np.loadtxt(Fn)
		plt.imshow(Nk)#, extent = [0,50, 100, 0] )
		cax = plt.axes([0.80, 0.1, 0.04, 0.8])
		plt.colorbar(cax=cax)
		plt.clim(zmin,zmax)
		#plt.colorbar(cax=cax)
		#plt.colorbar()
		fig.suptitle('T= '+str(i), fontsize=14, fontweight='bold')
        	writer.grab_frame()
		plt.clf()

{% endcodeblock %}
