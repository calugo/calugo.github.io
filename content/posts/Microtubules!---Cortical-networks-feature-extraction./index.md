---
title: "Microtubules! - Cortical networks feature extraction."
date: 2024-12-27
draft: false
description: "Fun and useful analysis of tubulin content"
tags: ["Data visualization", "Microtubules", "Feature extraction", "Image analysis"]
---

<div align = "justify">
A very important part of carrying out computer simulations of a system is to provide the models with as much relevant known information of the real system. In this way we have one less parameter to worry about when studying the possible scenarios which the system can undergo, as well as to keep the simulations withing feasible biological, physiological or mechanical limits. If the final objective is to publish the results of your work in a peer reviewed journal, you are probably aware that the process of organising, writing, submitting and eventually see your efforts published is always a very slow. 

Moreover, as a theoretician, publishing in life sciences journals often result in very low exposure, and many of the work done always ends up relegated to appendices, supplemental sections or even excluded from the final article, which often ends up having as any  authors as a footbal team!. These are the reasons behind this post, i.e. to put forward some small and fun analysis and results which might or might not end in an article, but I think are good to share with anybody interested. 
</div>

## Activity in Biology - The plant cell cortex.

<div style =  "text-align: justify">
First, let me introduce the system under study, namely, the plant cell cortex and the cytoskeleton. 

</div>


## Extracting the length and amount of polymer using python.

### Pre-requisites.

I use the following libraries for gemtery and to load the tiff stacks.

[Shapely]("https://pypi.org/project/shapely/") - Gorgoeous geometry package.

[Scikit-image]("https://scikit-image.org/") - A very well supported and handly image processing library.

I use [Pyvista]("https://docs.pyvista.org/") for the 3d renderings but as you will see, it is entirely optional.

Also numpy, matplotlib and pandas for array manipulation, plots and data processing are required.

<div style =  "text-align: justify">

### Step 1 - Segment the cell of interest.

In the analysis of the movies I choose only the cell which is at the center of the movie.  By selecting a small set of points outlining the shape of the cell, it is possible to divide the image in inner points and outer points using any basic geometry library or if you enjoy using another program such as [FIJI/ImageJ]("https://imagej.net/software/fiji/downloads") please do it by all means!. In my case I used a variant of a [point picker]("https://gitlab.com/calugo/tubule-tiff-picker) I wrote ages ago to annotate microtubule collisions. 

The set of points require to be ordered and the first and last points to be the same, in this way the polygonal line is closed. I read the points from an external file. Once the points are loaded in any way you prefer, then we load the tiff data file. For this purpose I use scikit-image.
</div>

```
import skimage.io as io
import matplotlib.pyplot as plt
import numpy as np
import pyvista as pv
import pandas as pd
import glob as glob
from shapely.geometry import Polygon, Point
```
<div style="text-align: center"><b> <i>
All the modules required for this post to work.</i></b></div>


<div style="text-align: justify">

If the movie stack file is named `cortex.tiff` then to import it we invoke:
</div>

```
file = 'cortex.tiff';
Z = io.imread(file);

```

<div style="text-align: justify">
And that's that! the stack is loaded into a numpy array. By using `Z.shape`, we can obtain information about the movie. In my case `print(Z.shape)` returns the tuple `(200, 512, 512)` which tells us that there are 200 frames, each frame containing a 512x512 array image.

Once the points are loaded and the arrays are loaded we can mask each frame by setting everything outside the region of interest to zero and keep the inside pixels unaltered.
</div>


{{<gallery>}}
  <img src="gallery/Mask.png" class="grid-w100" />
{{</gallery>}}
<div style="text-align: center"><b> <i>
Step I. Region of interest segmentation. Straightforward, yet essential.</i></b></div>


<div style="text-align: justify">

The figure above shows a masked frame, this needs to be applied to every frame. In order to apply the mask with the present approach we need to apply something like:

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

The above snippet computes all the pixels inside the `shapely` polygon object. This is of course assuming
the polygon point coordinates are stored in the arrays `X` and `Y`. Then, to  get the masked array:
```
A = Z[n,:,:]
B = np.zeros(B.shape)
for pix in pixels:
        B[pix[1],pix[0]]=A[pix[1],pix[0]]

```
Before discussing step 2. It is worth noticing a feature of shapely. By calling `pl.area`, we get the value of the area enclosed by the polygon, which we will use later to compute the desired length and amount polymer estimates. So far, we have been using pixel units. To translate any results to actual length units, we need the scale conversion factor from the file metadata.
</div>

### Step 2 - Background estimation and removal.

<div style="text-align: justify">

{{< katex >}} 

Once we have masked all the frames in the stack, is now easy to estimate the background bias in the data. By this I mean the following. We have a stack of images showing the flourescent signal bounded to tubulin. This means the more tubulin, the more intense the signal. If we assume that the amount of actual tubulin is related to the flourescent signal by a linear relatiionship of the form:  \\(\ T_r = \alpha  F_r + \beta_r \\) for every pixel \\(r\\) in the frame, we need to estimate the values of \\( \alpha \\) and \\( \beta \\) to obtain the estimates we need. 

To estimate the background \\( \beta \\) it is very easy to interpret the masked image as a surface \\( f(r)\\) in which the level set \\( f = c_j \\) with the more elements, is precisely the background. Again, taking advantage of numpy, we can actually compute the number of pixles with a value equal to a constant \\( c_j \\) using simple array operations as follows:

```
# A: masked array
B = A.ravel();
B1 = B[B>0.0];
bmin = min(B1); bmax = max(B1);
c = list(range(bmin,bmax+1))
cn = []
for cj in c:
    nj = B1[B1 == cj];
    cn.append(len(nj))
```

Applying that snippet to every masked frame, collecting every `c` and `cn` arrays, we can plot the results and we get something like:

{{<gallery>}}
  <img src="gallery/WEBBKGH5.png" class="grid-w100" />
{{</gallery>}}
<b><i>(Left) Counts of the number of elements on each level set of the masked frames, for every frame. The red plots correspond to the respective smoothed signals using a sliding window, the black lines correspond to the maximum value of each smoothed plot. (Right) The smoothed signals, without the raw level set counts, alongside the set which the maximal numberf of elements (the background).</a>
</i></b>

From the plots above it es easy to set the background value as the average of values in which the plots are maximised. In this case it give a signal value of around 5100.

{{< youtubeLite id="xBFyQNE88gY" label="Blowfish-tools demo" params="controls=0" >}}

We now need to calibrate the results by obtaining the value of \\( \alpha \\). 


<div style="text-align: justify">



</div>

### Step 3 - Tubulin/Intensity estimation.


</div>


### Useful tools.

<a href= "https://gitlab.com/calugo/tubule-tiff-picker">Microtubule Picker - Used in step 1 </a>

<a href= "https://imagej.net/software/fiji/downloads" >ImageJ/FIJI - Used in step 1</a>

<a href= "https://pypi.org/project/shapely/" >Shapely - Geometry package</a>


<a href = "https://scikit-image.org/">Scikit-image - General image processing library</a>