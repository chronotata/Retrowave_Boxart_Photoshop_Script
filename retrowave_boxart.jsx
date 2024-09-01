// Replace Screenshot and Title images and save as PNG
#target photoshop

if (app.documents.length > 0) {
    var myDocument = app.activeDocument;
    var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
    var thePath = myDocument.path;

    app.preferences.rulerUnits = Units.PIXELS;

    // Find 'Calque 5' (title) and 'Calque 6' (screenshot) layers
    var layer0 = myDocument.layers["start_layer"];
    var layer_title_perm = myDocument.layerSets["Hidden"].layers["Calque 5"];
    var layer_ss_perm = myDocument.layerSets["Hidden"].layers["Calque 6"];
    var layer_backtitle = myDocument.layerSets["Hidden"].layers["Backtitle"];
    var layerSet_title = myDocument.layerSets["Title goes there"];
    var layerSet_ss = myDocument.layerSets["Image goes there"];
    var layerSet_backtitle = myDocument.layerSets["Backtitle Layer"];
    var check_file_extensions = [".tif", ".jpg", ".jpeg", ".png", ".bmp"];

    // PNG save options
    var pngOptions = new PNGSaveOptions()
    pngOptions.compression = 6
    pngOptions.interlaced = false

    // Check if all layers are found
    if (layer_title_perm && layer_ss_perm) {
        // Select Files for 'title' Smart Object
        // var folder1 = Folder.selectDialog("Select folder for the 'title' smart object images");
        var folder_title = Folder(thePath + "/title")
        if (folder_title) {
            var files_title = folder_title.getFiles(/\.(psd|tif|jpg|png)$/i);
            // alert(files1.length.toString() + " files detected");

            // Select Files for 'screenshot' Smart Object
            // var folder2 = Folder.selectDialog("Select folder for the 'screenshot' smart object images");
            var folder_ss = Folder(thePath + "/screenshot")
            if (folder_ss) {
                var files_ss = folder_ss.getFiles(/\.(psd|tif|jpg|png)$/i);
                // alert(files2.length.toString() + " files detected");

                // Get all the file names from both folders
                var arr_title = [];
                var arr_ss = [];

                // Get names without file extensions - to avoid issues with mixed image file types
                for (var i = 0; i < files_title.length; i++) {
                  raw_title_name = files_title[i].name.toString();
                  base_title_name = raw_title_name.match(/(.*)\.[^\.]+$/)[1];
                  arr_title.push(base_title_name);
                };

                for (var i = 0; i < files_ss.length; i++) {
                  raw_ss_name = files_ss[i].name.toString();
                  base_ss_name = raw_ss_name.match(/(.*)\.[^\.]+$/)[1];
                  arr_ss.push(base_ss_name);
                };

                // Merge the arrays and drop duplicates
                var arr_combined = arr_title.concat(arr_ss);

                // Need to write a special iterative function to drop duplicates
                // because Photoshop's JS "in" comparison doesn't work with special
                // characters which the scaped images files will have
                // Removing special characters not an option since that will break
                // being able to look up image by name
                var arr_unique = [];

                // Iterate through each element in combined array
                for (var i = 0; i < arr_combined.length; i++) {

                  // Check the element in combined array if it is already inside unique array
                  var find_counter = 0;

                  // Loop through each element already in the unique array
                  for (var j = 0; j < arr_unique.length; j++) {

                    // If a repeat values is found, iterate find counter and break loop
                    if (arr_combined[i] == arr_unique[j]) {
                      find_counter = find_counter + 1;
                      break;
                    }
                  }

                  // If the loop is complete without find_counter being iterated,
                  // add the new unique element to unique array
                  if (find_counter == 0) {
                    arr_unique.push(arr_combined[i])
                  }
                }

                // Iterate through each detected game
                for (var i = 0; i < arr_unique.length; i++) {
                    // alert(files_title[i].name);
                    // alert(arr_unique[i]);
                    var searchString = arr_unique[i];
                    searchString = searchString.replace(/([<>*()?+])/g, "\\$1");
                    // searchString = searchString.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
                    // searchString = '^'+searchString+'$';
                    // alert(searchString);
                    var searchRegExp = new RegExp(searchString);

                    // If there are layers in the title and screenshot sets, delete them first
                    try {
                      layerSet_title.layers[0].remove()
                    } catch (e) {
                      null;
                    }
                    try {
                      layerSet_ss.layers[0].remove()
                    } catch (e) {
                      null;
                    }
                    try {
                      layerSet_backtitle.layers[0].remove()
                    } catch (e) {
                      null;
                    }

                    // Duplicate permanent title and screenshot placeholders
                    // and move them to the correct sets
                    layer_title_perm.duplicate(layerSet_title, ElementPlacement.PLACEATEND);
                    var layer_title = layerSet_title.layers["Calque 5 copy"];
                    myDocument.activeLayer = layer_title;
                    runMenuItem(stringIDToTypeID('newPlacedLayer'));
                    var layer_title = layerSet_title.layers["Calque 5 copy"];

                    layer_ss_perm.duplicate(layerSet_ss, ElementPlacement.PLACEATEND);
                    var layer_ss = layerSet_ss.layers["Calque 6 copy"];
                    myDocument.activeLayer = layer_ss;
                    runMenuItem(stringIDToTypeID('newPlacedLayer'));
                    var layer_ss = layerSet_ss.layers["Calque 6 copy"];

                    // If the title image for the game exists, process the title image
                    // otherwise, leave it blank
                    if (folder_ss.getFiles(searchRegExp).length > 0) {
                        // Put raw screenshot image into new layer
                        myDocument.activeLayer = layer0;
                        addFileNewLayer(folder_ss.getFiles(searchRegExp)[0]);
                        myDocument.activeLayer.name = "raw_screenshot";

                        // Replace the reference screenshot with the game's
                        // screenshot and resize accordingly

                        // Loop through each common image extension to find image
                        for (var j = 0; j < check_file_extensions.length; j++) {
                          if (File(thePath + "/screenshot/" + arr_unique[i] + check_file_extensions[j]).exists) {
                            found_ss_filename = arr_unique[i] + check_file_extensions[j];
                          }
                        }

                        replaceContentWithResize("raw_screenshot", layerSet_ss, "Calque 6 copy", File(thePath + "/screenshot/" + found_ss_filename), "exceed");


                        // Delete the raw screenshot layer
                        myDocument.layers["raw_screenshot"].remove();
                    } else {
                      layerSet_ss.layers[0].remove();
                    }

                    // If the screenshot image for the game exists, process the screenshot image
                    // otherwise, leave it blank
                    if (folder_title.getFiles(searchRegExp).length > 0) {
                        // Put raw title image into new layer
                        myDocument.activeLayer = layer0;
                        addFileNewLayer(folder_title.getFiles(searchRegExp)[0]);
                        myDocument.activeLayer.name = "raw_title";

                        // Replace the reference title with the game's
                        // title and resize accordingly

                        // Loop through each common image extension to find image
                        for (var j = 0; j < check_file_extensions.length; j++) {
                          if (File(thePath + "/title/" + arr_unique[i] + check_file_extensions[j]).exists) {
                            found_title_filename = arr_unique[i] + check_file_extensions[j];
                          }
                        }

                        replaceContentWithResize("raw_title", layerSet_title, "Calque 5 copy", File(thePath + "/title/" + found_title_filename), "constrain");

                        // Delete the raw title layer
                        myDocument.layers["raw_title"].remove();

                        // Duplicate the back title layer to the visible set
                        layer_backtitle.duplicate(layerSet_backtitle, ElementPlacement.PLACEATEND);
                    } else {
                      layerSet_title.layers[0].remove();
                    }

                    // var theNewName = files_title[i].name.match(/(.*)\.[^\.]+$/)[1];
                    // var theNewName = arr_unique[i].match(/(.*)\.[^\.]+$/)[1];
                    var theNewName = arr_unique[i]

                    var f = new Folder(thePath + "/" + "outputs");
                    if ( ! f.exists ) {
	                      f.create()
                    }

                    // Save as PNG
                    myDocument.saveAs(new File(thePath + "/" + "outputs/" + theNewName + ".png"), pngOptions, true);
                }

            }
        }
    } else {
        alert("One or more of the 'title' or 'screenshot' smart objects were not found in the document.");
    }
}

// Get PSDs, TIFs, and JPGs from files
function getFiles(theFile) {
    if (theFile.name.match(/\.(psd|tif|jpg)$/i) !== null || theFile.constructor.name === "Folder") {
        return true;
    }
}


// Find a layer by name
function findLayerByName(layerName) {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].name === layerName) {
            return layers[i];
        }
    }
    alert("Layer " + layerName + " not found.");
    return null; // Layer not found
}


// Replace SmartObject Contents
function replaceContents(newFile, theSO) {
    app.activeDocument.activeLayer = theSO;
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc3.putPath(idnull, new File(newFile));
    var idPgNm = charIDToTypeID("PgNm");
    desc3.putInteger(idPgNm, 1);
    executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
    return app.activeDocument.activeLayer;
}

// Replace SmartObject Contents
function addFileNewLayer(newFile) {
    var idPlc = charIDToTypeID( "Plc " );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    desc3.putPath(idnull, newFile);
    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc3.putEnumerated( idFTcs, idQCSt, idQcsa );
    executeAction( idPlc, desc3, DialogModes.NO );
    return app.activeDocument.activeLayer;
}

function replaceContentWithResize(rawLayerName, refLayerSet, refLayerName, replaceFile, logic) {
    // Get the width/height ratio of the raw screenshot

    var rawImgLayer = myDocument.layers[rawLayerName]
    var rawBounds = rawImgLayer.bounds;
    var rawWidth = rawBounds[2] - rawBounds[0];
    var rawHeight = rawBounds[3] - rawBounds[1];
    var rawRatio = rawWidth / rawHeight;

    // Get the width/height ratio of the ref screenshot
    var refLayer = refLayerSet.layers[refLayerName];
    var refBounds = refLayer.bounds;
    var refWidth = refBounds[2] - refBounds[0];
    var refHeight = refBounds[3] - refBounds[1];
    var refRatio = refWidth / refHeight;

    // Transform the reference Smart Object to be the same ratio as the raw image.
    // If the ratio between the raw image width to height is smaller than the
    // ratio between the reference width to height (e.g. the raw image
    // is narrower), then the reference image should  have its height increased.
    // Otherwise, the reference image should have its width stretched to match
    // the raw image ratio

    // Make the Smart Object the same size as the original images
    var ratioHeight = rawHeight / refHeight * 100;
    var ratioWidth = rawWidth / refWidth * 100;

    refLayer.resize(ratioWidth, ratioHeight);

    // Rasterise then convert back to Smart Object to reset the size
    refLayer.rasterize(RasterizeType.ENTIRELAYER);
    myDocument.activeLayer = refLayer;
    runMenuItem(stringIDToTypeID('newPlacedLayer'));
    var refLayer = refLayerSet.layers[0];

    // Replace Smart Objects
    refLayer = replaceContents(replaceFile, refLayer);

    // When the Smart Object is replaced, it might become
    // smaller if the raw file is smaller than the size
    // of the Smart Object. Therefore, need to resize the
    // Smart Object again so it is the right dimension

    // Get the width/height ratio of the placed screenshot
    var placedBounds = refLayer.bounds;
    var placedWidth = placedBounds[2] - placedBounds[0];
    var placedHeight = placedBounds[3] - placedBounds[1];

    // Transform the size to match the original ref image
    ratio2 = resizeWithLogic(refWidth, refHeight, placedWidth, placedHeight, logic);

    refLayer.resize(ratio2.ratioWidth2, ratio2.ratioHeight2);
}

// Return the transform ratios depending on the logic given
function resizeWithLogic(refWidth, refHeight, placedWidth, placedHeight, logic) {

    var placedRatio = placedWidth / placedHeight;
    var refRatio = refWidth / refHeight;

    if (logic == "exceed") {
      // If allows to exceed canvas edge, apply this logic

      // If the placed ratio is smaller (placed image is narrower) then the
      // width should be changed to match the original. Otherwise, the height
      // should be changed to match the original ref
      if (placedRatio <= refRatio) {
        var ratioWidth2 = refWidth / placedWidth * 100;
        var ratioHeight2 = ratioWidth2;
      } else {
        var ratioHeight2 = refHeight / placedHeight * 100;
        var ratioWidth2 = ratioHeight2;
      }
    } else if (logic == "constrain") {
      // If don't allow to exceed canvas edge, apply this logic

      // If the placed ratio is smaller (placed image is narrower) then the
      // width should be changed to match the original, but only to the
      // maximum height of the original refW. Likewise, for height,
      // it should not exceed the maximum refHeight
      // alert("placedWidth " + placedWidth);
      // alert("placedHeight " + placedHeight);
      // alert("refWidth " + refWidth);
      // alert("refHeight " + refHeight);
      if (placedRatio <= refRatio) {
        // alert("placedRatio less than refRatio");
        var unconst_ratioWidth2 = refWidth / placedWidth * 100;
        var unconst_ratioHeight2 = unconst_ratioWidth2;
        if (unconst_ratioHeight2 * placedHeight > refHeight) {
          var ratioHeight2 = refHeight / placedHeight * 100;
          var ratioWidth2 = ratioHeight2;
        } else {
          var ratioWidth2 = unconst_ratioWidth2;
          var ratioHeight2 = unconst_ratioHeight2;
        }
      } else {
        // alert("placedRatio more than refRatio");
        var unconst_ratioHeight2 = refHeight / placedHeight * 100;
        var unconst_ratioWidth2 = unconst_ratioHeight2;
        if (unconst_ratioWidth2 * placedWidth > refWidth) {
          var ratioWidth2 = refWidth / placedWidth * 100;
          var ratioHeight2 = ratioWidth2;
        } else {
          var ratioHeight2 = unconst_ratioHeight2;
          var ratioWidth2 = unconst_ratioWidth2;
        }
      }
    }
  return {
    ratioHeight2: ratioHeight2,
    ratioWidth2: ratioWidth2
  };
}

function unique(/*str[]*/ arr)
{
     var o={},
          r=[],
          n = arr.length,
          i;

     for( i=0 ; i<n ; ++i )
          o[arr] = null;

     for( i in o )
          r.push(i);

     return r;
}
