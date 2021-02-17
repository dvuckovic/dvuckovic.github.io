---
title: winYAMB
image: https://cdn.dvuckovic.com/projects/winyamb/winyamb-dice.jpg
summary: Solitaire Yamb/Yahtzee based dice game for Windows® with game saving written in Visual Basic® 6.0
date: 2005-03-15
tags:
  - project
  - windows
  - game
readingTime: 15 Minutes
---

![winYAMB](https://cdn.dvuckovic.com/projects/winyamb/winyamb.gif#icon#nozoom)

winYAMB is a game for Windows which resembles similar dice game (Yamb/Yahtzee). The only difference between two of them is that winYAMB is a solitaire game, and original Yamb game is for two or more players.

This represents in lack of couple of game columns which exists in original Yamb game. Therefore winYAMB may serve as a training game before the real Yamb encounter starts. Also winYAMB is played with six dices and real Yamb only with five. Six dice only serves as an opportunity to gain some better combinations and maybe better score rating.

## Download

* [winYAMB.exe](https://cdn.dvuckovic.com/downloads/winYAMB.exe)

## Requirements

* Microsoft® Visual Basic® 6.0 Run-Time files

## Rules

Rules explained in this text apply to game of winYAMB type. They are slightly different from original Yamb rules.

### Turns/Rolls

First of all, Yamb should be considered as a **turn-based** dice game, which is consisted of **104** turns and exactly same number of fields. Each turn is consisted of **3** dice rolls: first (all of the dices are rolled), second and third (all of the dices are rolled except those which were keeped from first/second roll). Keeping of dice(s) is ofcourse optional. Six dices are rolled, but **only five** are considered when making combinations. Different combinations of dices arrise from these rolls and their value is entered in the **fields**. Value may be signed to the field immediately after the first roll. Next turn is available after the value is entered to the field.

### Fields/Columns

There are **13** types of **fields** which are assorted in **8 columns**. Each column is accessed in different manner, but fields are entered on same rules. Now follow rules on entering these fields. Note that lines marked with sigma (Σ) represent the **sum fields** which are automatically calculated when fields above them are entered.

| Field Name  | Rule                                                                                                  |
|-------------|-------------------------------------------------------------------------------------------------------|
| 1 through 6 | Number of ones, twos, ... multiplied by one, two, ...                                                 |
| Σ           | Sum of fields 1 through 6 (bonus +30 for sum 60 and greater)                                          |
| Maximum     | Sum of all dices (intended to be maximum sum)                                                         |
| Minimum     | Sum of all dices (intended to be minimum sum)                                                         |
| Σ           | Difference Max-Min multiplied by field 1                                                              |
| Straight    | 1,2,3,4,5 or 2,3,4,5,6 (entered value depends on roll number: for first roll 66, second 56, third 46) |
| Triple      | Three of a kind (sum of triple plus 20)                                                               |
| Full        | Full house - triple+pair (sum of full plus 30)                                                        |
| Poker       | Four of a kind (sum of poker plus 40)                                                                 |
| Yamb        | Five of a kind (sum of yamb plus 50)                                                                  |
| Σ           | Sum of straight, triple, full, poker and yamb fields                                                  |

| Symbol                                                                                 | Name     | Rule                                                                                  |
|----------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------|
| ![Downward](https://cdn.dvuckovic.com/projects/winyamb/winyamb-down.gif#invert#nozoom) | Downward | Fields are filled from top to bottom                                                  |
| ![Random](https://cdn.dvuckovic.com/projects/winyamb/winyamb-random.gif#invert#nozoom) | Random   | Any field may be entered at any time                                                  |
| ![Upward](https://cdn.dvuckovic.com/projects/winyamb/winyamb-up.gif#invert#nozoom)     | Upward   | Fields are filled from bottom to top                                                  |
| A                                                                                      | Announce | Any field may be announced in first roll and entered at the end of the turn           |
| H                                                                                      | Hand     | Any field may be entered but only if no dices were kept from previous roll            |
| ![Middle](https://cdn.dvuckovic.com/projects/winyamb/winyamb-mid.gif#invert#nozoom)    | Middle   | Fields are filled from middle, up and down                                            |
| ![UpDown](https://cdn.dvuckovic.com/projects/winyamb/winyamb-updown.gif#invert#nozoom) | UpDown   | Fields are filled from top and bottom at the same time                                |
| M                                                                                      | Maximum  | Any field may be entered but only [maximum values](#maximum) for a field are accepted |

If a field is entered and there haven’t been realized rules for that field, field will become crossed ( / ). Columns consists of same types of fields, but their availability depends on several rules.

These rules are not obligatory to remember because winYAMB will **automatically** enables/disables fields keeping these rules in mind and also assigns appropriate values to fields. This will manifest as two types of fields: **Enabled** (which may be entered), and **Disabled** (which may not be entered).

Moving along fields can be done via keyboard, using appropriate shortcut (Tab). For more keyboard shortcuts, [see here](#keyboard-shortcuts).

If you realize that upon entering some field you were wrong, there is still a chance to make it right. **Undo** option is available from **Game** menu, but only **within a turn**. You cannot undo field entering in case you already moved to next turn, if you announced field in **Announce** column or entered the Hand field (next turn is automatically done).

### Object

The object of the winYAMB game is to fill all of the fields with as much as possible greater values, which are then summed and final score is presented. If the final score is greater than one in the Best Scores list, player will have a chance to sign himself to this list.

## Maximum

Fields from **Maximum** column (**M**) should be filled only with maximum values for that field:

| Field Name | Maximum                 |
|------------|-------------------------|
| 1          | 4-5                     |
| 2          | 8-10                    |
| 3          | 12-15                   |
| 4          | 16-20                   |
| 5          | 20-25                   |
| 6          | 24-30                   |
| Maximum    | 29-30                   |
| Minimum    | 5-6                     |
| Straight   | 66 (only if first roll) |
| Triple     | 38 (three 6)            |
| Full       | 58 (three 6 and two 5)  |
| Poker      | 64 (four 6)             |
| Yamb       | 80 (five 6)             |

## Saving games

Once started game may be **saved** for playing later. Game can be saved from menu **Game > Save game**, only **between** turns. A familiar Windows dialog will popup and ask for a filename and location. Once saved game can be **opened** from **Game > Open game** menu. Again the dialog will appear asking for a filename and location. To start a **new** game or discard opened game you can click the **Game > New game** menu.

winYAMB saved game files have .wyb extension and may be shared between two computers with same winYAMB version. This extension is registered in Windows environment with standard winYAMB installation, and in that case game may be opened with a simple click on the file, too.

## Status bar

Status bar is located at the bottom left of the winYAMB window and contains few text boxes which provides some useful information. Some of these fields are not always available, but when they are, they look like on the following image.

![Status bar](https://cdn.dvuckovic.com/projects/winyamb/winyamb-status.gif#rect#nozoom)

First box from the left provides Undo function status. If it contains a capital "U" then Undo option is available for use. If it is empty Undo option is disabled. Next two boxes applies to the number of Rolls left in the turn and number of Turns left in the current game. Max and Min boxes provides quick maximum and minimum sum of rolled dices which are crucial for fields of type Maximum and Minimum (click here for more on field types).

## Keyboard shortcuts

### Numeric keypad

| Shortcut | Effect                      |
|----------|-----------------------------|
| *        | Roll dice (if available)    |
| 0        | Next turn (if available)    |
| 1-6      | Keep dice (see image below) |
| -        | Change active field (FW)    |
| /        | Change active field (BW)    |
| +        | Enter active field          |

![Numpad](https://cdn.dvuckovic.com/projects/winyamb/winyamb-numpad.gif#rect#nozoom)

### Keyboard

| Shortcut  | Effect                                                                   |
|-----------|--------------------------------------------------------------------------|
| Tab       | Change active field (FW)                                                 |
| Shift+Tab | Change active field (BW)                                                 |
| Space     | Enter active field and change to next turn (use only when sure about it) |
| F2        | New game                                                                 |
| Ctrl+S    | Save game                                                                |
| Ctrl+O    | Open game                                                                |

## Best scores

If final score of the finished game is greater than the one in **Best Scores** list, player will have an opportunity to rate themselves on this list, by providing their name in appropriate text box. winYAMB ships with a **blank** Best Scores list, but eventually you may reset this list to none using **Game > Reset Best Scores**.

## Source code

Complete [source code](https://github.com/dvuckovic/winYAMB) for program/game was written in Visual Basic 6, CHM help file in HTML and setup/installer was created using NSIS. Graphic for program was modeled/rendered in trueSpace, icons were then edited in Photoshop and produced in Microangelo.
