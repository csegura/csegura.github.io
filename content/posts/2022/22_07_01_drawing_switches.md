+++
title = 'Drawing Switches with node & graphviz'
date = 2022-07-01T00:00:00+01:00
tags = ['systems', 'node', 'snmp']
+++

I have been working on a project that requires me to draw a lot of switches. I'm using SNMP to get the information from the switches, and I'm using Python to draw the switches.

To do this, I have an small algorithm that reads the configuration of the switch and draws the switch in a SVG file. 

In a json file I have the main network configuration,, something like this

```json
.....
"switches": [
    {
      "ip": "10.10.10.1",
      "name": "SW32A001",
      "zone": "Zone1",
      "location": "Location A",
      "model": "41 HPE OfficeConnect 1950-12XGT-4SFP+ Switch",
      "nports": 18,
      "shape": "4 4 4 4 2"
    },
....
```	

This is a switch with 18 ports, and the shape is 4 4 4 4 2. This means that the switch has 1 rows of ports,  in four groups of 4 ports, and one group of 2 ports.

Of course, nports its not necessary, but it is useful to know how many ports are in the switch and check if the configuration is correct.

```json
      "nports": 28,
      "shape": "6 6 2/6 6 2"
```

This is a switch with 28 ports, and the shape is 6 6 2/6 6 2. This means that the switch has 2 rows of ports,  in two groups of 6 ports, and one group of 2 ports.

## Results

![Switch](/images/misc/draw_sw1.png)

![Switch](/images/misc/draw_sw2.png)

The code generate a .dot file using graphviz, and then convert it to a svg file using the dot command. This is the output of the dot file


```js
digraph G {
fontname="Arial"
node [fontname="Arial"]
edge [fontname="Arial"]
graph [rankdir="LR",fontsize=9 ];
node [fontsize=9, shape=ellipse];
edge [lblstyle="above, sloped"];
SW2 [
  shape=none,
  label = <<table border="1" cellborder="1" cellspacing="2" align="center" cellpadding="4">
  <tr>
   <td colspan="27" port="SW2" border="0">SW2</td>
  </tr>
  <tr>
   <td port="1" border="1"  bgcolor='#7fba00'  width="18">1</td>
   <td port="3" border="1"  bgcolor='#7fba00'  width="18">3</td>
   <td port="5" border="1"  bgcolor='#7fba00'  width="18">5</td>
   <td port="7" border="1"  bgcolor='#e53238'  width="18">7</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="9" border="1"  bgcolor='#e53238'  width="18">9</td>
   <td port="11" border="1"  bgcolor='#7fba00'  width="18">11</td>
   <td port="13" border="1"  bgcolor='#e53238'  width="18">13</td>
   <td port="15" border="1"  bgcolor='#7fba00'  width="18">15</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="17" border="1"  bgcolor='#7fba00'  width="18">17</td>
   <td port="19" border="1"  bgcolor='#e53238'  width="18">19</td>
   <td port="21" border="1"  bgcolor='#7fba00'  width="18">21</td>
   <td port="23" border="1"  bgcolor='#7fba00'  width="18">23</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="25" border="1"  bgcolor='#7fba00'  width="18">25</td>
   <td port="27" border="1"  bgcolor='#7fba00'  width="18">27</td>
   <td port="29" border="1"  width="18">29</td>
   <td port="31" border="1"  width="18">31</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="33" border="1"  width="18">33</td>
   <td port="35" border="1"  width="18">35</td>
  </tr>
  <tr>
   <td port="2" border="1"  bgcolor='#7fba00'  width="18">2</td>
   <td port="4" border="1"  bgcolor='#7fba00'  width="18">4</td>
   <td port="6" border="1"  bgcolor='#7fba00'  width="18">6</td>
   <td port="8" border="1"  bgcolor='#e53238'  width="18">8</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="10" border="1"  bgcolor='#e53238'  width="18">10</td>
   <td port="12" border="1"  bgcolor='#e53238'  width="18">12</td>
   <td port="14" border="1"  bgcolor='#e53238'  width="18">14</td>
   <td port="16" border="1"  bgcolor='#7fba00'  width="18">16</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="18" border="1"  bgcolor='#e53238'  width="18">18</td>
   <td port="20" border="1"  bgcolor='#7fba00'  width="18">20</td>
   <td port="22" border="1"  bgcolor='#e53238'  width="18">22</td>
   <td port="24" border="1"  bgcolor='#7fba00'  width="18">24</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="26" border="1"  bgcolor='#7fba00'  width="18">26</td>
   <td port="28" border="1"  bgcolor='#e53238'  width="18">28</td>
   <td port="30" border="1"  width="18">30</td>
   <td port="32" border="1"  width="18">32</td>
   <td port="" border="0">&nbsp;&nbsp;</td>
   <td port="34" border="1"  width="18">34</td>
   <td port="36" border="1"  width="18">36</td>
  </tr>
</table>>
]
}
```

The status of the ports, is obtained from the switch using snmp before drawing, and the color of the port is green if the port is up, and red if the port is down. 


