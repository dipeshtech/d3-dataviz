# Data Visualization - US Flight Delays

## Summary

This visualization explores the relationship between **average flight departure delay time** and the hour of day. This also leads us to explore the relationship between delay time and other intervals of time as months of the year.

To start and locally view the visualization post git clone and changing the directory to the top level project directory:
> python -m SimpleHTTPServer 8080

## Design


### Bar Charts
After exploring the data, trying out different chart types and getting feedback, the best way to communicate the key point was by a simple bar chart. The bar chart simply communicates the message faster and clearer. 

The bar chart shows the average delay time for departing flights as seen by the hours of a day. It's a clear design choice because it easily helps the viewer compare the delay times by the size or height of the bar. Also given it's widespread usage, a viewer is familiar to interpreting these types of plots.

There was some thought around inclusion of scatter plot but that would have added complexity without adding much to the main point, instead take away attention from the key point and users might take much more time to understand. 

Additional design choices around the bar chart were first to add focus to the hours with highest average delay times, to contrast the main point of the visualization.This was accomplished by changing the *color* of the bars of interest. 


| Visual encodings |        Variable |
-------------------|-----------------|
| distance x | hour of day |
| distance y | average delay time |
| color hue  | high/low average delay time |

The same points applicable to volumes of flights bar chart. Keeping both of them the same chart type helps the viewer better compare the relationship between both variables.


### Line Chart
The next chart representing the relationship is a line chart, which shows the average delay times by month of year. A line chart was chosen to present this data so as to show the time relationship month by month. After exploring multiple years, the month variations stays roughly the same, and so it appears to be seasonal. To add focus on the months with highest delay times, I decided to change the color of the months with highest value, which turns out to be February, June-August (summer vacations) and December (holidays).

| Visual encodings | Variable |
-------------------|------------------|
| distance x | month of year |
| distance y | average delay time |
| color hue  | high/low average delay time |

### Layout and Narrative
The approach to layout was based on the flow of the exploratory exercise and best representation of the key information. The bar chart came as clear first pick to present the most information in a fast and clear manner.


#### Version 1

*This first implementation took some time as some data prep was involved. The data preparation involved basically formatting the data so that the site uses an aggregate sample because the original files are* **600mb** *or larger.*

#### Version 2

*For the second version, major changes based on feedback were*:

1. Include a note for the first and second graph.
2. Add chart titles and labels
3. Fixed an issue with the bar chart including NaN values


#### Version 3

*For the third version, major changes based on feedback were*:

1. Fixed issue with some labels in first visualization being different sizes
2. Updated the labels
3. Updated the x and y axis labels to define units
4. Improved titles, improved pop overs and added code comments.


### Final thoughts on design

I believe that the three charts clearly show:
* The worst flight delays tend to happen between **11pm and 3am**
* Flight delays prominent in **December holidays** and **summer** during vacations


## Feedback
To validate and review my visualizations, I conducted interviews over email with my coworkers and friends.

### First interview
> The representation was not very clear. The labels were not communicating the measuring units clearly.

### Second interview
> Representation was percieved i.e. tendency of departure delays to happen during 11pm to 3am.
One suggestion came in to correlate the data with amount of demand for travel, given the delays must happen by number of passengers, bags etc, adding to the whole on-boarding process. Unit was noted missing for Average flight delay by month chart.

### Third interview
> The content now gives a great sight into what each graph is about.
Instead of mean average other options could be investigated like median to relate it to real-life situation.


## Resources

- [D3.JS Documentation](d3js.org)
- [Dimple.JS Documentation](http://dimplejs.org/)
- [Bootstrap for styling](http://getbootstrap.com)

## Files and notes

- To process the original RITA files, I used python `Prep.py`.
- The data used is `data/2008-DateTime.csv` via D3.js.
