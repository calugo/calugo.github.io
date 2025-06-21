---
title: "Lagrange Multipliers, Mechanics and Automatic Differentiation."
date: 2025-04-24
draft: false
description: "A little example "
tags: ["Autodiff", "Pyodide","Mechanics","WebGL","threejs"]
---

<div style = "text-align: justify">
Classical mechanics of particles is a subject which serves as gateway to concepts, tools and 
techniques which are common currency in every field which aims to describe dynamical phenomena, as well as in contemporary data science and machine learning
 which rely on finding solutions of optimization problems.

An example of a classical optimization problem is that of the motion of a particle subjected to constraints due to a physical barrier (see the movie below), where a mass under the action of gravity moves over a surface.
</div>

{{<gallery>}}
  <img src="gallery/Par2.gif" class="grid-w100" />
{{</gallery>}}<div style="text-align: justify"><b> <i>
Solution obtained with the implementation described in this post. In this example, a particle with an initial potential energy moves over the surface of a paraboloid. The code to solve this type of problems can be found <a href="https://github.com/calugo/Lagrange-Multipliers-with-autodiff" target="_blank">here</a>. 
</i></b>



<div style = "text-align: justify">
In this post I discuss how to solve the type of problem mentioned above using the Lagrange multipliers method. First, I briefly present the maths and then I describe how to use automatic differentiation to numerically solve the equations using the Runge-Kutta method.
</div>
<div style = "text-align: justify">

 As with almost every post, I also share an interactive implementation of the method. On this occasion, It is built using <a href="https://threejs.org/">threejs</a> and <a href="https://pyodide.org/en/stable/#">pyodide</a>.

</div>

### Interactive Demo:

<div style = "text-align": center>
 <iframe src="https://calugo.github.io/Lagrange-Multipliers-with-autodiff/"
 style="border: 3px dotted black; width: 100%; height: 500px;"> </iframe>
<b><i>Online implementation using Pyodide and Threejs. Of course, it works better on a <a href="https://calugo.github.io/Lagrange-Multipliers-with-autodiff/"  target="_blank">tab of its own!</a> Below I describe some details on how to make your own. For best result, make sure to check the <a href="https://pyodide.org/en/stable/#">Pyodide</a> documentation.   In this demo, once you have set the initial position xo and yo and the surface with parameters A,B. click on the <b>Run</b> button and wait until the <b>Plot</b> is enabled to plot the trajectory!. You can move the scene around and zoom, with the mouse or touch gestures.
</i></b>
</div>



## Mechanics of a particle with constraints: The Lagrange multipliers method.

<div style = "text-align: justify">

In rectangular coordinates {{< katex >}} \\( r=(x,y,z )\\) the motion of a particle of mass \\( m \\) under the effect of gravity has a Lagrangian function: $$ L_o = \frac{1}{2}  m \dot{r}^2 + m g z \quad(1)$$

If the particle is constrained to move over a surface such an inclined plane or another landscape which can be described by a function \\( z = f(x,y) \\). The Lagrangian \\( (1) \\) needs to be complemented with a contribution for the constraint as:

$$L = L_o + \lambda(z-f(x,y)) \quad(2)$$

Where \\( \lambda \\) is a constant called the lagrange multiplier, which needs to be determined to ensure the constrained is fulfilled.   The equations of motion obtained by optimizing \\( \(2\) \\) are:
$$m\ddot{x} = -\lambda f_x\quad(3)$$
$$m\ddot{y} = -\lambda f_y \quad(4)$$
$$m\ddot{z} = -mg + \lambda\quad(5)$$

Where the indices in \\( f\\) stand for the partial derivative with respect to that variable. The system \\( (3)-(5)\\) needs to be complemented with the constraint equation
 obtained differentiating \\( z \\) respect to time twice:

$$\ddot{z} =(\dot{x}^2 f_{xx} + \dot{y}^2f_{yy})+\dot{x}\dot{y}(f_{xy}+f_{yx})+(\ddot{x}f_x+\\dot{y}f_y)\quad(6)$$

Solving for \\( \lambda \\) using \\( (3)-(6)\\) gives:

$$\lambda = \frac{m}{1+f_x^2+f_y^2}(g + \dot{x}^2f_{xx} + \dot{y}^2f_{yy} + \dot{x}\dot{y}(f_{xy}+f_{yx}))\quad(7) $$

Which leads to the equations of motion:

$$\ddot{x}=-\frac{g + \dot{x}^2f_{xx} + \dot{y}^2f_{yy} + \dot{x}\dot{y}(f_{xy}+f_{yx})  }{1+f_x^2+f_y^2} f_x \quad(8)$$
$$\ddot{y}=-\frac{g+ \dot{x}^2f_{xx} + \dot{y}^2f_{yy} + \dot{x}\dot{y}(f_{xy}+f_{yx})}{1+f_x^2+f_y^2} f_y \quad(9)$$
$$\ddot{z}=-g + \frac{g+\dot{x}^2f_{xx} + \dot{y}^2f_{yy} + \dot{x}\dot{y}(f_{xy}+f_{yx})}{1+f_x^2+f_y^2} \quad(10)$$

There is a lot that can be said about these equations, which is of course beyond the scope of this little blog, however, it is worth noticing that in general these constitute a nonlinear system, which can't be solved analytically, except for a few simple cases, such as an inclined plane. The system can be numerically solved using a general integration scheme such as the Runge-Kutta method, provided we can efficiently compute the derivatives of the constraint.

</div>

# Runge-Kutta integration.


<div style = "text-align: justify">

The numerical solution of a system of the form \\(\dot{ \bf{x} }= \bf{F(x,t)}  \\) is obtained by:

$${\bf{x}}_{n+1} = {\bf{x}}_n + (1/6)( {\bf{k}}_1 + 2 {\bf{k}}_2 + 2 {\bf{k}}_3 + {\bf{k}}_4 )\quad(11)$$


$$  {\bf{k}}_1 = {\bf{F(x }}_n,t ) \quad(12)$$
$$  {\bf{k}}_2 = {\bf{F(x }}_n + (h/2){\bf{k}}_1 ,t+h/2)\quad(13)   $$
$$  {\bf{k}}_3 = {\bf{F(x }}_n + (h/2){\bf{k}}_2,t+h/2)\quad(14)    $$
$$  {\bf{k}}_4 = {\bf{F(x }}_n + h{\bf{k}}_3,t+h)\quad(15)    $$

Where \\( h \\) is the integration step. This is a fourth order method and it requires to evaluate the function \\( \bf{F} \\) four times per iteration. In this case:  $$ {\bf{x}} = (x, y, z, \dot{x}, \dot{y},\dot{z}) \quad(16)$$

And the Function \\( \bf{F} \\):
$${\bf{F}} = (\dot{x},\dot{y},\dot{z},\ddot{x},\ddot{y},\dot{z})\quad(17) $$ where the last three entries are given by \\( (8)-(10) \\).

With everything defined then it is very simple to write a program to solve the problem as long as we know the partial derivatives of the constraint. This is where automatic differentiation shines!.
</div>

# Automatic differentiation.

<div style = "text-align: justify">

The numerical solution of optimization problems is required everywhere, as its is a fundamental component to machine learning and A.I. implementations. Accordingly, the availability of tools which automate the task of computing gradients has also evolved and are now available in a number of frameworks, such as <b>JAX</b> and <b>Pytorch</b> for the python language.  In what follows I will be using <a href="https://github.com/HIPS/autograd" target="_blank">Autograd</a>, as it is well mantained, documented and offers the versatility of using <b>numpy</b> and can be readily used in  <b>webassembly</b> projects.
</div>

## Enter Autograd.

Let us consider a set of functions which depend of \\( {(x,y)} \\) and a couple of parameters \\( {(A,B).} \ \ \\)  For example:

```python
def plane(a,b,x,y):
    return a*x + b*y
  
def paraboloid(a,b,x,y):
    return a*x*x + b*y*y

def wave(a,b,x,y):
    return 0.2*(x*x+y*y)*np.cos(a*x*x+b*y*y)

```

Then it is easy to write down the function \\( \bf{F} \\) in \\( (17) \\) as:

```python
def kn(r,pars,case):
    a = pars[0]
    b = pars[1]
    g = 10
    if case in ['plane','paraboloid','wave']:
        
        if case == 'plane':
            fn = plane
        if case == 'paraboloid':
            fn = paraboloid
        if case == 'wave':
            fn = wave
        
        x = r[0]; y = r[1]; z = r[2]
        vx = r[3]; vy =r[4]; vz= r[5]
        
        fx = grad(fn,2)(a,b,x,y)
        fy = grad(fn,3)(a,b,x,y)
        
        dg = np.array([fx,fy,1])
        dg2 = np.dot(dg,dg)
        
        fxx = grad(grad(fn,2),2)(a,b,x,y)
        fyy = grad(grad(fn,3),3)(a,b,x,y)

        fxy = grad(grad(fn,2),3)(a,b,x,y)
        fyx = grad(grad(fn,3),2)(a,b,x,y)

        ddg = np.array([fxx*vx*vx,fyy*vy*vy,g,vx*vy*(fxy+fyx)])
        Num = np.sum(ddg)
        Den = dg2
        A = Num/dg2
        
        F = np.array([vx,vy,vz,-A*fx,-A*fy,-g+A])
        
        return F

```

<div style = "text-align: justify">

The function objects depend of four variables, the two parameters \\(a,b \\) and the coordinates \\( x,y \\). To obtain the partial derivatives with respect to the variables we want, `grad` takes the index of the variable defined in the function. In the cases above \\( x \\) and \\( y \\) correspond to the second and third indices.  Then, the required derivatives are simply computed as:

</div>

```
fx = grad(fn,2)(a,b,x,y)
fy = grad(fn,3)(a,b,x,y)

fxx = grad(grad(fn,2),2)(a,b,x,y)
fyy = grad(grad(fn,3),3)(a,b,x,y)

fxy = grad(grad(fn,2),3)(a,b,x,y)
fyx = grad(grad(fn,3),2)(a,b,x,y)

```
And the Runge-Kutta loop as:

```python

def RK(tf,ro,case,h,a,b):

    
    dtp = 1e-3
    t = 0.0;
    u = np.zeros(6)
    u[0:3] = ro
    prm = [a,b]

    while t<tf:
        k1 = kn(u,prm,case)
        k2 = kn(u+0.5*h*k1,prm,case)
        k3 = kn(u+0.5*h*k2,prm,case)
        k4 = kn(u+h*k3,prm,case)
        u = u+ (h/6.0)*(k1+2*k2+2*k3+k4)
        t+=h

    return u

```
### Webassembly Implementation.

<div style = "text-align: justify">
This project was made with the excuse of developing the numerical work and the visualisation independently, and being able to share it on the blog, taking advantage of the lovely threejs library. To achieve this, the set of functions in a given file, can be accessed by the javascript scope as follows:
</div>

1. Import the Pyodide javascript module in the head of your document:

```javascript
<script src="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js"></script>
```

2. If the numerical methods are located all in a file named, lets say, "integrals.py". Then, the methods are made accessible to javascript in the initialisation part with something like this:

```javascript
//Load Pyodide and install the autograd package.
const pyodideRuntime = await loadPyodide();
await pyodideRuntime.loadPackage("micropip");
const micropip = pyodideRuntime.pyimport("micropip");
await micropip.install("autograd")

//Access the methods in "integrals.py".
pyodideRuntime.runPython(await (await fetch("integrals.py")).text());

//Registers the functions used in the three.js script. These can now be used as any JS function.

let pyparaboloid = pyodideRuntime.globals.get('paraboloid');
let pyplane = pyodideRuntime.globals.get('plane');
let pywave = pyodideRuntime.globals.get('wave');
let RK = pyodideRuntime.globals.get('RK');

```

<div style = "text-align": center>
That is all for now! The repository with the code to integrate, as well at the code used to put the simulation on line is available <a href="https://github.com/calugo/Lagrange-Multipliers-with-autodiff/tree/main" target="_blank">here</a>.  The live demo can be found <a href="https://github.com/calugo/Lagrange-Multipliers-with-autodiff">here</a>.

Until next time!
</div>