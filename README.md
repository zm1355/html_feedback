## Description

This is a flask demo for the ArXiv bug report function. The bug report initiation could be done in two ways(screenshot and highlight). The link to design document is https://www.figma.com/file/p13ZktQJEV8CXx3M7Z10fe/ArXiv-Error-report?node-id=0%3A1&t=gEav7Q8shh8D9Du0-1.

## Steps to run the project

### Create virtual environment (below are based on mac)

- if you want to use virtualenv:
  `python3 -m venv venv`
- activate env
  `source venv/bin/activate`

### Install Dependencies

`pip install Flask, requests, Flask-SQLAlchemy, flask-cors`

### Create database

run a python interactive shell

- `from app import db`
- `db.create_all()`
- `exit()`

### Start Server

Start the server by `python app.py` or `flask --app app run`

## Details about the features(not finished)

1. Highlight
2. Screenshot
3. Use shortcut "p" to open report box, and "i" to close it.
4. Use "CT_Tech" to find add elements on HTML file.

## Future work & Current Problem

#### Important

1. **Put the report comments into a file (or other inspectable format) for a demo**
2. **Implement the DOM capture (get top level element and most specific element)**
3. **implement browser version info from javascript**
   Not sure what this mean?
4. Test Highlight Function: Related to 5. So Try to solve 5a!
   1. test highlight merged author/dept
   2. test highlight equation
   3. test highlighting words with extra chars like:
      1. \ANDAshish Vaswani
      2. Noam Shazeer1
5. Improve for select text report function. Finish one of them.
   a. For highlight method, sometimes it will make text invisiable.
   b. For create div method. Some text does not included.
   c. Try to create third method: Return the HTML file of it!
6. Report Mode for ScreenReader.

#### Future work

1. Show the demo to our users and optimize the user experience based on their feedback
2. Issues with screenshot functionality: Firstly, some characters cannot be captured (likely due to HTML2Canvas limitations), and secondly, in split-screen mode, the screenshot position shifts downwards.
   Solution?: Change document.nody to document.element. But the screenshot will become empty. Do not know why yet!

## Develop Log 4/ 22 - 4/28

#### Using Keyboard Shortcuts to Open and Close the Report Box

In web development, it's sometimes necessary to solicit feedback from users or allow them to report issues. To make it easier for users to submit feedback, we can add a report box to the page where they can enter their comments or upload screenshots.

To make it convenient for users to open and close the report box, we can use keyboard shortcuts. On Windows, users can press "Ctrl + /" to open the report box and "Ctrl + ." or ">" to close it. On Mac, users can press "Command + /" to open the report box and "Command + ." or ">" to close it.

#### Test HTML “add /test ”

#### Update Download：

Now it will download html file. And later I will try to just build a html file base on the users' vision.

#### Update in Develop_yichen

The function seems works now. It can capture the math equation now!
But just work for selected capture. There will be content you can downlaod and see!

#### Update in develop_zhilin

1. Implemented bug reporting mode: when press j and r keys together, user enters bug report mode with a report button shows up next to every div element. Now it shows with most paragraphs and images. Once clicked the report button, user submits the current html into the database as well.
2. Implemented hidden div similar to Reddit. For screenreader users only, there are announcement and instructions not visible to normal users. Screenreader user can click question mark to listen to the instructions.

## Develop Log 4/15 - 4/21

1. **BIG Update** to the components, we have now implemented Bootstrap. The report box now has a brand new look. We have reorganized and refactored the JS files, including removing unnecessary code. The report box now has a streamlined appearance that can be easily tested, and we will continue to build upon this framework for future code updates.
2. Investigating fast screenshot plugins or features. Puppeteer? dom-to-image? HTMLcanvas2 is in experimental stage, Puppeteer only provides help for some browsers, and dom-to-image doesn't work. Further research is needed. https://github.com/niklasvh/html2canvas
3. The previous Report box would retain the previous screenshot, but with this update, the screenshot is removed every time the report box is closed.
4. Adding a functionality to download the screenshot locally, hoping to further confirm if the screenshot is complete and clear.
5. The unclear screenshot issue is caused by changing the scale. After designing the new report box, the scale was changed back to the old one, making it clear again. I also found that some fonts cannot be captured, which is likely due to them being re-rendered later. Tried using rasterizeHTML, but it was not successful.![](assets/image-20230420001656731.png)

![image-20230420001808605](assets/image-20230420001808605.png)

6. We made the screenshot in the form clickable. By clicking on the screenshot, it will be enlarged so that users can see the details on it.
7. The screenshot could not show the exact contents that are highlighted by the users before. After modifying, the selected texts stay highlighted in the screenshot.
8. Fix the problem of bug button keeps floating. Now when we scroll the page, the report button that generated by select text will disappear.
9. Fix the issue of the report box not appearing after selecting text and clicking the button. When the report button is clicked, the mouse release (`mouseup`) event is triggered before the click (`click`) event. As a result, during the processing of the `mouseup` event, the button is removed, preventing the `click` event from triggering properly.
