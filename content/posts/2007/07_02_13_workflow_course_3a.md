+++
title = 'Workflow Course 3a'
date = 2007-02-13T00:00:00+01:00
tags = ['workflow']
+++

El proyecto WinHostWorkflow esta formado a su vez por dos proyectos, WinHostWorkflow contiene el motor de flujos de trabajo (WorkflowEngine.cs) y el interface de usuario (WorkflowSampleApp.cs),  la carpeta ExternalDataServices, contiene los servicios de intercambio de datos del 3er asalto, (CalculatorService.cs y MessengerService.cs)

El proyecto Workflows, contiene los interfaces para los servicios de intercambio de datos (ICalculator.cs y IMessenger.cs) así como los flujos de trabajo de ejemplo.

- WorkflowDelay.cs – Secuencial con una actividad Delay de 45seg.
- WorkflowDelay2.cs – Secuencial con una actividad Delay de 30 seg, una actividad Code que duerme el proceso un minuto y una actividad Delay de 30 seg.
- WorkflowLongWhile.cs - Seuencial con una actividad While que ejecuta una actividad Code.
- WorkflowSumNumbers.cs – Uso de parámetros, recibe dos parámetros y los suma en una actividad Code.
- WorkflowCallExternalMethod.cs - Llamada a métodos externos, usa el interface ICalculator, para  realizar operaciones con parámetros.
- WorkflowHandleExternalEvent.cs - Espera recibir un mensaje, interface IMessenger, después hace una pausa y a través del mismo interface nos lo devuelve.

![](/images/Sharepoint/wf_curso_20.gif)

WinHostWorkflow_3.zip (51,45 KB)