<h1 align="center">
  <br>
  <a href="https://github.com/dhitchenor/shutdowngui">ShutdownGUI</a>
  <a href="https://opensource.org/license/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg"></a>
</h1>

<h4 align="center">A graphical user interface for the 'shutdown' utility, available on most Linux distributions; made with the lightweight framework: NeutralinoJS</h4>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#updating">Updating</a> •
  <a href="#features">Features</a> •
  <a href="#contributing">Contributing</a>
</p>

---

![shutdowngui usage](https://raw.githubusercontent.com/dhitchenor/shutdowngui/main/.github/images/shutdowngui_usage.gif)

## Installation

##### Prerequisites:
* Make sure you have NeutralinoJS installed; see [Your first neutralinojs app](https://neutralino.js.org/docs/getting-started/your-first-neutralinojs-app)

##### Building or Downloading:
1. **[Download](https://github.com/dhitchenor/shutdowngui/archive/main.zip)** or clone the repository with `git clone https://github.com/dhitchenor/shutdowngui`
2. Unzip, and/or change into the appropriate directory
3. Placing necessary files/folders.. read the important information below:

  > [!IMPORTANT]
  > If you DID NOT start your first NeutralinoJS app (you ONLY installed NeutralinoJS), you don't need to do step 3, skip to step 4
  > 
  > If you DID start your first NeutralinoJS app, COPY all files/folder EXCEPT the bin folder, and the neutralino.config.json file into your first NeutralinoJS app folder
  > but keep the files/folders for reference
  
4. Build (in the folder with the neutralino.config.json file) using the command: `neu build --release`
   * You should now have ShutdownGUI built in the `dist` folder, located in the current folder
   
  > [!IMPORTANT]
  > If you DID NOT start your first NeutralinoJS app, and you're running into issues using the files from the repository,
  > start your first NeutralinoJS app, and follow the instructions again

##### Incorporating into your system:
1.  **Move** the following files into your desired install directory, `eg. ~/Applications/ShutdownGUI`
   * the appropriate binary `eg. shutdowngui-linux_x64`
   * the `resources.neu` file

2. Use any of the provided files as templates for your own system
   * `shutdowngui.desktop` - a desktop file (when placed into the appropriate directory, will provide an entry within your systems applications menu)
      * Located in this repositories `extras` folder; make sure you make the appropriate required changes to this file.
      * Research your own Desktop Environment for instructions on how to use this file.
   * `shutdowngui.png` - a 200x200 png icon (from FeatherIcons, located in the `resources` folder)

## Updating
Replace any changed/updated files within the aforementioned install directory. The only files that would most likely be changed are:
   * the appropriate binary `eg. shutdowngui-linux_x64`
   * the `resources.neu` file

## Features
* Utilizes the 'shutdown' utility, that should be already available on most linux distributions
* Dark themed
* Easy to navigate, no extra visual noise
* Lightweight
* Made with NeutralinoJS, to leverage webview technologies that already exist on your system
* Time and Date are locale dependent
* Currently available in English, Esperanto, and Spanish

## Contributing

> [!TIP]
> Start an issue or file a PR. Briefly discuss the bug/feature, and the implementation of the fix/addition.
