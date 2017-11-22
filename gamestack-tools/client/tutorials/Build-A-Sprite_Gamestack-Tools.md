# Gamestack-Tools:

[![N|Solid](image/logo-sprite.png)](https://nodesource.com/products/nsolid)
  
Spritemaker combines a wide variety of behaviors that are common to game-sprites. When utilized correctly, this tool becomes a real catalyst for building, testing, and evaluating of Sprites. 
 
### Tutorial 1 : Build A spaceship Sprite with Animations and Sounds, using Gamestack.js:Sprite-Maker.

  - Build A Sprite with behavioral features
  - Attach Gamestack-Objects: This includes any Animations Sounds, Motions, Projectiles (bullets) for your Sprite.
  - Apply Event-Bindings
  
The source image for our spaceship-sprite:
 
![alt text](image/multi-space-ship.png "Logo Title Text 1")

Find the image in the gamestack/client/assets/.....ETC

### What on earth are these objects? And what's SpriteMaker?
  
  - It's all javascript. These are js class Objects, expressed as JSON data (javascript-object-notation). Any Sprite() created in the SpriteMaker can be saved, then referenced by javascript/html with the Gamestack.js library. 
*For more info see the Gamestack.js documentation.

### Let's Get Started!

## Step 1: Install and start Gamestack-Tools module
  Install Gamestack-Tools to a new project-folder:
```sh
npm install gamestack-tools
```

 Start the Gamestack-Tools module:
```sh
npm start
```

## Step 2: Open the tool

  Open the SpriteMaker tool: You should arrive at http://localhost:3137/tools/main.html. There are links on this page that point to separate Gamestack-Tools. Click the SpriteMaker tool-link, and the browser will open a connection to: http://localhost:3137/tools/sprite-maker.html
  
![start-gamestack](image/start-gamestack.PNG "Logo Title Text 1")

## Step 3.1:
 A new Sprite will be displayed in the browser-window. Click the first 'animation' attached to this Sprite. Then open the 'bottom-window' using the plus-minus in the bottom-right-corner of your screen (expands the bottom-window), and select your image in the file explorer. --hint: we're using the spaceship-image listed at the top of this tutorial.

![select-animation-image](image/select-animation-image.png "Logo Title Text 1")


## Step 3:2 Define the first Animation
  Define the Animation in the GUI-controller, using specific property values, as listed below:

### Animation() anime_one
| Property-Name | Property-Value |
| ------ | ------ |
| frameSize | {x:90, y:90} |
| frameBounds.min | {x:7, y:0} |
| frameBounds.max | {x:7, y:0} |
| frameBounds.termPoint | {x:7, y:0} |

*This is a single-frame animation, so the frameBounds properties are the same for min, max, and termPoint. Other animations will differ to express movement. This will be the default animation for the spaceship.

## Step 3:3 lean-left, lean-right, and spin Animations
  Apply class Objects and properties to your Sprite() as seen below.

### Animation() lean_left
| Property-Name | Property-Value |
| ------ | ------ |
| frameSize | {x:90, y:90} |
| frameBounds.min | {x:0, y:0} |
| frameBounds.max | {x:7, y:0} |
| frameBounds.termPoint | {x:7, y:0} |
| reverse | true OR checked | 
//*reverse to run frames backwards by default

### Animation() lean_right
| Property-Name | Property-Value |
| ------ | ------ |
| frameSize | {x:90, y:90} |
| frameBounds.min | {x:7, y:0} |
| frameBounds.max | {x:14, y:0} |
| frameBounds.termPoint | {x:14, y:0} |
| reverse | false OR unchecked | 

### Animation() spin
| Property-Name | Property-Value |
| ------ | ------ |
| frameSize | {x:90, y:90} |
| frameBounds.min | {x:0, y:0} |
| frameBounds.max | {x:14, y:0} |
| frameBounds.termPoint | {x:14, y:0} |

//A full spin of the spaceship

  *Using javascript-code and the Gamestack.js library, we can define the same Sprite() like this:
```sh
var mySprite = new Sprite({
property1: 'propValue'
});

//Animations are added like this:
mySprite.add(new Animation({prop:value}));
```

## Step 4: Adding sounds


##  Step 5:
Export your Sprite(). Click Sprite >> Save To File

## Step 8
The Sprite() is created, but how do we implement this Sprite() in html, and javascript with Gamestack.js? This file contains a Gamestack.js example with implementation of our Sprite(). Inspect the file to see how JSON is imported into Gamestack.js.
