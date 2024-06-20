+++
title = 'csegScript 2'
date = '2005-09-05T00:00:00+01:00'
tags = ['sharepoint', 'webpart']
+++

This weekend I have finished the first version of csegScript, now are two webparts in the package, the first webpart is the 0.99 version with some improvements in the code, the  operation basically is the same one. (See previous post)

The second new webpart uses a list to store the scripts, and has three slots to pass parameters to the webpart.  (Thanks to Stramit by your idea)

The list fields are:

Title: Script Title
References: Dll necessary to execute the code (remember that are Server based paths)
Code: The script code
Description: Short description of the code
Param1, Param2, Param3: Default values for parameters
Param1Desc, Param2Desc, Param3Desc: Parameters descriptions

If you uses the list you dont need add the double slash at the end of each line of code, now you can write the code in a list text field using cr-lf.

![csegScript list](/images/Sharepoint/csegScript1-2.gif)

To referer the params in the code use Param1, Param2 and Param3.

Hello World Sample

![](/images/Sharepoint/csegScript1-4.gif)

![](/images/Sharepoint/csegScript1-5.gif)



Running the webpart

When you runs the csegScript webpart you can view a combo box with all scripts that you have stored in the list and only needs select the one that you want to execute, you can view the script description and the parameters slots with your descriptions. If you changes the parameters values press apply to re-run the script. Also there is a link to the list to modify the script.

Attached in the zip file is the list template.

csegScriptWebPart1.zip (23,37 KB) 