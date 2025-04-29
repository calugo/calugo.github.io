---
title: "Microtubules! - Cortical networks feature extraction."
date: 2024-12-27
draft: false
description: "Fun and useful analysis of tubulin content"
tags: ["Data visualization", "Microtubules", "Feature extraction", "Image analysis"]
---

<div align = "justify">

In this post I describe a small, yet fun, analysis that might be of use to researchers in the field of microtubules. The goal is to extract estimates of the amount and length of polymer from images of cortical networks such as the one below, courtesy of the [Ram Dixit lab.](https://sites.wustl.edu/dixitlab/) 

The polymer quantities estimated here can be used to postulate, inform, verify or constrain theoretical, mathematical and computational models of cytokeletal dynamics. Such models can become quite complicated, so, with these estimations are aimed to keep, calibrate or test the models to be within feasible biological, physiological and mechanical limits.


{{<gallery>}}
  <img src="gallery/cell.gif" class="grid-w100" />
{{</gallery>}}<div style="text-align: justify"><b> <i>
Time evolution of cortical microtubule networks in plant hypocotyl cells. This system is an example of a biological complex system out of equilibrium.</i></b>


The networks shown are microscopy images in which the flourescent signal is labeling the tubulin which composes the polymer filaments known as microtubules. The microtubules polymerise and de-polymerise at the tip, and are anchored to the cell membrane, in the inner surface of the cell wall.

The interaction between microtubules is mechanical due to collision events. An outcome of a collision is that the tip of the <b>incoming</b>  tubule can be lost, which results in a rapid depolymerisation or <b>catastrophe</b> of the filament. Other possible scenarios are: the incoming filament simply  <b>crosses</b>  over the target filament, or the two filaments  <b>zip</b>  together forming a bundle.
 
The frequency of such outcomes, the geometric constraints and some other chemical and  mechanical processes determine the organisation of the network. Which can be aligned arrays, like the ones in the movie, or disordered arrays.

This very lousy introduction to the topic is all I am going to mention, but I really encourage you to consult a proper reference in the subject, such as [this](https://doi.org/10.1017/CBO9780511607318).

</div>

<div style =  "text-align: justify">


## Extracting the length and amount of polymer using python.

### Pre-requisites and libraries.

The main library used is [numpy](https://numpy.org/doc/stable/index.html)

[Shapely]("https://pypi.org/project/shapely/") - Very handy geometry package.

[Scikit-image]("https://scikit-image.org/") - A very well developed and supported image processing library.

Matplotlib and pandas for plotting and data processing are also used.

<div style =  "text-align: justify">

### Step 1 - Cell of interest segmentation.

We will only be focusing on the cell at the center of the movie. So, the first step is to segment the region of interest across all the frames. This can be easily done by selecting a small set of points outlining the shape of the cell. This can be done using a program such as [FIJI/ImageJ]("https://imagej.net/software/fiji/downloads") or the [point picker]("https://gitlab.com/calugo/tubule-tiff-picker) GUI wrote ages ago to annotate microtubule collisions.

To form a polygon, the first and last points need to be the same. Once you have the set outlining the cell shape, and stored in a file, we need to load these in any way you prefer. Next, we load the tiff file. For this purpose I use scikit-image.
</div>

```
import skimage.io as io
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from shapely.geometry import Polygon, Point
```
<div style="text-align: center"><b> <i>
All the modules required for this post to work.</i></b></div>


<div style="text-align: justify">

Assuming that the image stack file is named `cortex.tiff`, then it can be loaded as follows:
</div>

```
file = 'cortex.tiff';
Z = io.imread(file);

```

<div style="text-align: justify">
And that's that! The stack is loaded into a numpy array. By using `Z.shape`, we can obtain information about the movie. In my case `print(Z.shape)` returns the tuple `(200, 512, 512)` which tells us that there are 200 frames, each frame containing a 512x512 array image.

To mask each frame, we need to set everything outside the region of interest to zero and keep the inside pixels unaltered.
</div>


{{<gallery>}}
  <img src="gallery/Mask.png" class="grid-w100" />
{{</gallery>}}
<div style="text-align: center"><b> <i>
Step I. Region of interest segmentation. Straightforward, yet essential.</i></b></div>


<div style="text-align: justify">

The figure above shows a masked frame. We need to mask all the frames, to do so, first we generate a polygon object and store all the inner points in a list:

```    
coords=[(i,j) for i,j in zip(list(X),list(Y))]
pl = Polygon(coords)
minx, miny, maxx, maxy = pl.bounds
minx, miny, maxx, maxy = int(minx), int(miny), int(maxx), int(maxy)
box_patch = [[x,y] for x in range(minx,maxx) for y in range(miny,maxy)]
pixels = []
for pb in box_patch: 
    pt = Point(pb[0],pb[1])
    if(pl.contains(pt)):
        pixels.append([int(pb[0]), int(pb[1])]) 
```

The above snippet computes all the pixels inside the `shapely` polygon object `pl`. This is assuming that
the polygon point coordinates are stored in the arrays `X` and `Y`. Then, to  get the masked array, we apply something like the snippet below to every frame:

```
A = Z[n,:,:]
B = np.zeros(B.shape)
for pix in pixels:
        B[pix[1],pix[0]]=A[pix[1],pix[0]]

```

{{< katex >}} 

By calling `pl.area`, we get the value of the area enclosed by the polygon, which we will use later to compute the desired length and amount polymer estimates. So far, we have been using pixel units. To translate any results to actual length units, we need the scale conversion factor from the file metadata, In the present example we have \\( \lambda = 512  px / 40.96 \mu m = 12.5 \mu m ^{-1} \\). The cell area \\( A = 93731 px^2 =  600 \mu m ^ {2}\\).

An extra step that can be performed is to scale all the masked frames pixel values to values between zero and one. I did this by applying the following function to the stack `Z`, using the list of pixels inside the polygon.

```
def scaleZ(Z,px):
    
    ZS = np.zeros(Z.shape);
    mins = []; maxs = [];
    
    for k in range(Z.shape[0]):
        for pix in px:
            ZS[k,pix[1],pix[0]] = Z[k,pix[1],pix[0]]
        
    MAX = np.max(ZS)
    ZS = ZS/MAX;
    print(ZS.shape)
    return ZS

```

</div>


### Step 2 - Background estimation and removal.

<div style="text-align: justify">


We have a stack of images showing the fluorescence signal \\( F \\) of tubulin. This means the more tubulin, the more intense the signal. If we assume that the variable of interest \\( L \\) is linearly related to the flourescence, then:  \\(\ L(r) = \alpha  F(r) + \beta \\) for every pixel \\(r\\) in the frame. The task is then to estimate the values of \\( \alpha \\) and \\( \beta \\). 

For the case of  \\( \beta \\), if we interpret the masked image as a surface \\( z = f(r)\\), then the level set  \\( z = c_b \\) with the largest number elements, is precisely the background. This can be found by computing the number of pixels on each level in the range of the signal as follows:

```
AVDATX = []; AVDATY = [];

for q in range(Z.shape[0]):
  BA = Z[q,:,:]
  BB = BA[BA > 0]
  nx = np.unique(BB)
  ny = []

  #Computes the level sets
  for nj in nx:
    dyj = BB[BB == nj];
    ny.append(len(dyj))

  # Computes a smoothed 
  # curve from the data

  wnx = []
  wny = []
  dn = 250
  for j in range(0,len(nx)-dn):
    wnx.append(np.mean(nx[j:j+dn]))
    wny.append(np.mean(ny[j:j+dn]))
    
  AVDATX.append(wnx);
  AVDATY.append(wny);

THX=[]
    
# Loops over the smooth versions 
# and finds the pair (xmax,ymax) which 
# maximises the curve

for j in range(ZS.shape[0]):
  ymax = max(AVDATY[j])
  xj = AVDATY[j].index(ymax)
  max = AVDATX[j][xj]
  THX.append(xmax);

```

The interactive panel below illustrates the results of what I just described for a single frame.

<div style = "text-align": center>
 <iframe src="https://calugo.github.io/TubulinCounts/bg.html"
 style="border: 3px dotted black; width: 100%; height: 240px;"> </iframe>
<b><i>Interactive Pyvista rendering of a frame as surface. (Left) full frame, (Middle) the masked frame. (Right) The signal with the background substracted. Play around with touch gestures or the mouse to zoom, translate and rotate.</i></b>
</div>



Applying the snippet above to every masked frame and collecting every `xmax` and `ymax` values, and plotting the results, we get something that looks like:

{{<gallery>}}
  <img src="gallery/WEBBKGH5.png" class="grid-w100" />
{{</gallery>}}
<b><i>(Left) Counts of the number of elements on each level set of the masked frames, for every frame. The black plots correspond to the respective smoothed signals using a sliding window, the black lines correspond to the maximum value of each smoothed plot. (Right) The smoothed signals, without the raw level set counts, alongside the set which the maximal numberf of elements (the background).</a>
</i></b>

From the plots above it es easy to set the background value as the average of values in which the plots are maximised. In this case it give a signal value of around 0.26.




{{<gallery>}}
  <img src="gallery/MTBG.gif" class="grid-w100" />
{{</gallery>}}
<b><i>Results of removing the background in every frame (Right) versus the original data (Left).</a>
</i></b>


We now need carry out the calibration step to obtain the value of \\( \alpha \\). 

</div>

### Step 3 - Tubulin/Intensity ratio estimation.

<div style="text-align: justify">

This is the final step. In a nutshell, it consists of picking a segment of what appears to be a <b>single</b> microtubule segment. If the segment has a length \\( l_o \\) and we measure the amount of signal \\( I_o \\) within a box of that length and height \\( h \\). Then we just find the value \\( \alpha \\) such as  \\( \ l_o = \alpha I_o \\). 

In other words \\( \alpha = \frac{l_o}{I_o} \\). Therefore, if a given amount of signal \\( I \\) is measured, we can say that it can be accommodated in a length \\( L = \frac{I}{I_o} l_o\\). By doing so, we can then calculate the full amount of signal in every frame and thus make an estimation of how long does a filament need to be to accommodate that amount of signal.

The first thing to do is to navigate through the movie and select a few segments which then will be used to make the calibration. This step is again a step that can be carried out using an external application to save points.


{{<gallery>}}
  <img src="gallery/Sl19.png" class="grid-w100" />
{{</gallery>}}
<b><i>Selecting a single filament by marking it allows to work on a small box around the microtubule signal. the sequence above sumarises the steps, until we have a box containing the filament with the background removed.</a>
</i></b>

If `P1 =(X1,Y1)` and `P2 = (X2,Y2)` are the coordinates, defining the segment. I chose to rotate the image around `Pa` to align the segment with the `X` axis. This is easily done using the rotate method from scikit image.

```
def Box(Zm, X, Y, dn, bkg):      
  X1=X[0]; Y1=Y[0]; X2=X[1];Y2=Y[1];
        
  if Y1 < Y2:
    Xa = X1; Xb = X2
    Ya = Y1; Yb = Y2
  else:
    Xa = X2; Xb = X1;
    Yb = Y1; Ya = Y2;
    
  Ux=Xb-Xa; Uy=Yb-Ya; R=np.sqrt(Ux**2+Uy**2)
  angle=np.arccos(Ux/R); angdeg=angle*(180/np.pi);
 
  Q = rotate(Zm,angdeg,center=(Xa,Ya),
            resize=False,preserve_range=True);

  n1=int(Xa); n2=int(Xa+R)
  m1=int(Ya)-dn; m2=int(Ya)+dn
  
  P = Q[m1:m2,n1:n2]
  Q = P - bkg;
  Q[Q<=0] = 0.0 
        
  return Q
```
<b><i>Function to compute  box  with the marked filament. The arguments are the frame `Zm`, the filament end points `X`,`Y`, the box height `dn` and the background value `bkg`. 
</i></b>

Once we have the box determined, we can systematically vary the width of from zero to values which contains all the signal inside. Then, the criteria to used the amount of signal of a single filament is: the box with width for which the amount of signal start to be almost constant. 


```
n1 = no
n2 = no+1
P = Q[n1:n2,0:Na]
dn.append(n2-n1)
In.append(sum(P.ravel()))
for n in range(no-1):
  n1 -=1
  n2 += 1          
  P = Q[n1:n2,:]
  dn.append(n2-n1)
  In.append(sum(P.ravel()))
```
<b><i>Snippet to compute the signal within a box of height `2no`. The arguments are `no` and `Na` which is the length of the box, as well as the array `Q`.
</i></b>


{{<gallery>}}
  <img src="gallery/cal1.png" class="grid-w100" />
{{</gallery>}} 
<b><i> Output from performing the calibration step over a segment. (Left) Measures of the amount of signal in the box. (Right) The filament enclosed in boxes of several heights.
</i></b>

By choosing several filaments across the movie, we can obtain several points and average to estimate the ratio signal/length. 


{{<gallery>}}
  <img src="gallery/CalibrationH5.png" class="grid-w100" />
{{</gallery>}}


```
#Average of the single segments from the previous step
Sm = avth/(Q.shape[0]*Q.shape[1]) 
#Ratio pixels/length in microns
rj=512/40.96 
#Box length in microns 
dx = Lmin/rj 
#Lists to store the Amount of polymer and length
Lk = [];Ik=[]; 
Area = pl.area

#Area in microns^2
Amu = Area/(rj*rj) 
#Length of equivalent area square
DLA = np.sqrt(Amu)

for j in range(ZS.shape[0]):
    
    Zm = ZS[j,:,:] - bg
    Zm[Zm<=0] = 0.0 
    Q = Zm.ravel()
    Qa = Q[Q>=Sm]
    Qn = sum(Zm.ravel())

    Lk.append((Qn/avth)*dx)
    Ik.append(Qn/Amu)
    
    nmin =  np.min(Qa); nmax = 1
    bins = np.arange(nmin,nmax,0.005)
    yh, bn = np.histogram(Qa, bins=bins)
    
Lkav = np.mean(Lk)
SLkav = np.std(Lk)

Ikav = np.mean(Ik)
SIkav = np.std(Ik)

```

From the previous step we know that \\( L = l_o \left( \frac{I}{I_o} \right) \\). Whereas the amount of polymer is the sum of the intensity above or equal to the calibration amount \\( I_o. \\) 


Executing the snippet and collecting the mean values we get an average linear polymer length per area of  \\( 1.52 \pm 0.13 \mu m \\) and the average amount of polymer per cell area of \\( 1.73 \pm 0.15 [\mu m ]^{-2}  \\) 



{{<gallery>}}
  <img src="gallery/H5_Results.png" class="grid-w100" />
{{</gallery>}}

I have prepared a jupyer notebook available here, to be used as you please.

The full analysis will probably find its way into an article appendix with some luck. If it is not the case, well, at least for now, here it is. To be read and maybe be used by someone interested!

</div>

### Useful tools.

<a href= "https://gitlab.com/calugo/tubule-tiff-picker">Microtubule Picker - Used in step 1 </a>

<a href= "https://imagej.net/software/fiji/downloads" >ImageJ/FIJI - Used in step 1</a>

<a href= "https://pypi.org/project/shapely/" >Shapely - Geometry package</a>


<a href = "https://scikit-image.org/">Scikit-image - General image processing library</a>