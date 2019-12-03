# Installation 


Just npm install it to you project folder

```
    npm i --save elastic-bubble-animation
```

# Usage 

Create a new instance using the provider and then run the `init()` function on the instance variable


```

      const bubble = new ElasticBubbleAnimation({
            el: document.getElementById('bubble-container1'),
            bubbleSize: "55px",
            colors: ["#673AB7", "#FF9800", '#4CAF50'],
            bubbleCount: 11
        });

    bubble.init();


```


# API

The library provides the following options right now

```
{
    el: document.getElementById('bubble-container1'), // -> Element reference to use as the container for the animation
    bubbleSize: "55px", // -> Size of the bubbles
    colors: ["#673AB7", "#FF9800", '#4CAF50'], // -> Array of colors for random selections
    bubbleCount: 11 // -> Number of bubble on the screen
    bubbleBackground:'https://picsum.photos/id/237/200/300' // -> Background for the the bubbles, will override the colors
}
```



