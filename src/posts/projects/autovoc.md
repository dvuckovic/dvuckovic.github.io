---
title: autoVoc
image: https://cdn.dvuckovic.com/projects/cyrillic.jpg
summary: Simple PHP class for auto-constructing vocative version of a person’s first name in BCS languages (Bosnian/Croatian/Serbian)
date: 2009-06-29
tags:
  - project
  - php
  - dtp
readingTime: 15 Minutes
---

autoVoc is a simple PHP class for auto-constructing vocative version of a person’s first name in BCS languages (Bosnian/Croatian/Serbian). Since there are many exceptions in construction rules in these languages for vocatives, a database table was created with some common names and is intended to grow as new names are encountered.

## Download

* [autovoc-v0.9.zip](https://cdn.dvuckovic.com/downloads/autovoc-v0.9.zip)

## Requirements

* PHP v4 or higher

## Why autoVoc?

autoVoc has many possible implementations, since these vocatives are used in person referencing. One of them is automatic text generation for direct and personalized letters. Since all first names exist only in their nominative forms in existing databases, there is a need to construct them on-the-fly in order to make the letter sound more personal.

I personally encountered the need for these auto vocatives, when I was trying to find a way to speed up generation for personalized prints in my then-current workplace (printing shop). Clients used to supply us with a table/database of names and corresponding addresses, which we were supposed to print on envelopes and also in personalized digital prints. Software for producing those personalized prints was already available, and had capability to import fields from text tables/databases. Since manual converting of first names in their vocative forms was time consuming and pretty boring (hence the possibility of errors), I tried to implement the rules in a script. Since I failed to find exact grammar rules, the problem intrigued me more and I was determined to solve it.

## Why in PHP?

PHP is primary choice for many developers in server side web field. Since many applications are moving online these days, a need may arose for automatic online generation. PHP also has its command line run-form, and is easily combined in other scripting languages.

## So, how does it work?

The backbone of entire script is a CSV tables of first names in nominative and their corresponding vocatives. I had a help from a friend in language field to compile start table, and was able to continue on my own with adding new names as they came up. Current table has 346 names, which is sufficient for most applications, since rare names constitute only around 1-5% of all names, so they are easily identified and manually translated. You can also include these names in the table once they are encountered, so the job becomes easier in each iteration.

CSV file has three fields:

```
Nominative,    Gender,    Vocative
[a-zšđčćž],    [0|1|2],   [a-zšđčćž]
```

Apart from the obvious fields for nominative and vocative form of the first name, CSV table also contains gender field, which is currently unused by the script, but offers scalability for future functions. Entire script (including the CSV table) is encoded in UTF-8 Unicode format, which is capable of storing special characters used by BSC languages correctly.

## Usage

There is a `test.php` file in ZIP distribution which demonstrates quickly the use of the class. Class’s single function is called in the following way:

```php
<?
// UTF-8 HTTP header
// We must make sure that current page will be output
// in correct encoding space (UTF-8)
header("Content-Type: text/html; charset=utf-8");

// Include autoVoc class
require_once("autovoc.php");

// Create an instance of autoVoc class in $myAutoVoc variable
$myAutoVoc = new autoVoc();

// Simple header for our test page
echo("<h1>autoVoc class test</h1>");

// $name_nominative is our input first name in nominative (n.)
$name_nominative = "Bojan";

// $name_vocative is output (vocative, v.)
// getVoc is internal function of the autoVoc class
// and actually does all job
$name_vocative = $myAutoVoc->getVoc($name_nominative);

// Output our I/O variables
echo("<p>$name_nominative, <em>n.</em><br/>\n$name_vocative, <em>v.</em></p>\n");

// Few more tests (a feminine name and a neutral name)
$name_nominative = "Ružica";
$name_vocative = $myAutoVoc->getVoc($name_nominative);
echo("<p>$name_nominative, <em>n.</em><br/>\n$name_vocative, <em>v.</em></p>\n");

$name_nominative = "Kića";
$name_vocative = $myAutoVoc->getVoc($name_nominative);
echo("<p>$name_nominative, <em>n.</em><br/>\n$name_vocative, <em>v.</em></p>\n");
?>
```

The output of the script above would be something like this:

```html
<h1>autoVoc class test</h1>

Bojan, <em>n.</em>
Bojane, <em>v.</em>

Ružica, <em>n.</em>
Ružice, <em>v.</em>

Kića, <em>n.</em>
Kićo, <em>v.</em>
```

<small>_Data courtesy of my friend, Milica!_</small>
