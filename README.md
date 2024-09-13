# Retrowave Theme Boxart Automated Script for Photoshop

![muOS_20240914_0019_0](https://github.com/user-attachments/assets/520ff583-9bce-47a3-b1d5-415fc532c2f4)

## What is this?

An automated script for Photoshop, along with the necessary PSD files, in order to create boxarts to fit the excellent RetroWave theme for MuOS for the Anbenic RG35XX family of retro handheld devices.

MuOS: https://muos.dev/

RetroWave theme on the MuOS official Discord: https://discord.com/channels/1152022492001603615/1248730050661191790

While the RetroWave theme comes with a Photoshop template for the user to create boxarts for their own use or to share with others, it is a manual process, so I have created this script which should save a lot of time, if you have already pre-scraped the screenshots, titles and/or boxes for your games.

## Disclaimers

This was tested with Photoshop CC 2015 on Windows 10. If you have any issues running it on your system please let me know.

Other users have created Skraper and Boxart Buddy templates for this theme. If you don't have Photoshop and/or think the scraper method would work better for you, you can find those templates on the RetroWave thread in the MuOS Discord, linked above. There are also pre-scraped boxarts using these templates available to download in the thread.

The advantages of using a Photoshop script as opposed to XML templates for scraping tools are:
- PSD files are a bit more powerful and flexible for creating certain image elements
- In the future, ability to generate alternate mixes made using PSD templates on pre-scraped files with this script, rather than having to re-scrape everything

## Available Mixes

Choose between the original mix created by the theme creator:

![Final Fantasy VII](https://github.com/user-attachments/assets/e9d7e41e-f568-412b-9837-77e4a8d6d538)

Or my own "remix" which has different placements and with game boxes for games that have them:

![Final Fantasy VII](https://github.com/user-attachments/assets/ec969d00-7f30-4b65-a5f5-5b8412c393e7)


## How to use?

### 1) Pre-scrape Titles/Screenshots/Boxes for your ROMs

For each of your ROM, you want to have the Title image and Screenshot image, and optionally Box image for my remix, stored separately in each folder. Each image should have exactly the same name as your ROM file.

You can easily do this by using Skraper or any similar retro game boxart scraping tools.

https://www.skraper.net/

For detailed guide on how to use Skraper, search Youtube for guides. For example: https://www.youtube.com/watch?v=RBQuFBbRsXs

In order to get the title images for your ROMs, in the "Media" tab, you will want to select Media Type "Image" and then "Wheel":

![skrapers_wheel](https://github.com/user-attachments/assets/7f096ae4-5171-4ea1-9dd8-e99bddc2009f)

And for the screenshots, you will want to scrape the Media Type "Image" and then "Screenshot":

![skrapers_screenshot](https://github.com/user-attachments/assets/c97fdc56-9a5e-4899-961b-50ef5913f053)

For boxes, scrape "Box 2D"

![skrapers_box](https://github.com/user-attachments/assets/db3c587f-8139-40c3-af3d-9da5d6a51cd2)

Make sure you select different output folders for each scaped element otherwise they might overwrite each other. You can scrape them all at the same time by using the + icon and add more images to scrape.


### 2) Put all the files in the right folders

Create a new folder anywhere on your computer, and create 2 subfolder there, "title" and "screenshot". All your scraped titles should go in the title folder, and likewise for the screenshot folder.

![title_folder](https://github.com/user-attachments/assets/7c3e24ed-80f9-4b9c-ae2a-b143090b7417)

![screenshot_folder](https://github.com/user-attachments/assets/4eac2f13-beda-41bb-9348-938788aefb2b)

For my remix, also put the box images in the "box" folder.

Now, download the "retrowave_boxart.jsx" Javascript file and either "RetroWave_game_box_Original_Mix.psd" Photoshop file for the original mix, or "RetroWave_game_box_Chrono_Mix.psd" for my remix, from this repository and put them in the same folder.

![input_files](https://github.com/user-attachments/assets/c8680da7-45f0-4afb-afe8-e57d18a6b7a6)


### 3) Open Photoshop file and run the script

Open RetroWave-game-boxarts_edit.psd, then go to "File" > "Scripts" > "Browse..." and select "retrowave_boxart.jsx". 

![browse_script](https://github.com/user-attachments/assets/8ad3740c-dd05-4169-af65-98fd87ff93a1)

This will run the script, which will create a new subfolder "outputs" and save the result files there.

![outputs_folder](https://github.com/user-attachments/assets/48da2881-6b02-421d-bc6e-6f4bff401208)

If you have a lot of games, it's probably going to take a while. Go make a cup of tea and maybe take some time to play games on your Anbernic instead of messing with themes and boxarts all day ;)


### 4) Put the files in the correct folder(s) on MuOS

The boxart files should go in the correct folders for their respective system. If you need some help on this, check https://muos.dev/help/artwork or ask for help on the official Discord

## Credits

- The Viz aka the Bootleg Gamer - creator of the RetroWave theme
- xonglebongle and all the other MuOS contributors. Do consider supporting them https://muos.dev/donate
- Anbernic for creating the amazing RG35XXSP which hasn't burned down my house yet
