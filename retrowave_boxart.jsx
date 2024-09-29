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
    var layerSet_hidden = myDocument.layerSets["Hidden"];
    var check_file_extensions = [".tif", ".jpg", ".jpeg", ".png", ".bmp"];

    try {
        var layer_box_perm = myDocument.layerSets["Hidden"].layers["Box placeholder"];
        var layer_boxback = myDocument.layerSets["Hidden"].layers["Boxback"];
        var layerSet_box = myDocument.layerSets["Boxart goes here"];
        var layerSet_boxback = myDocument.layerSets["Boxart Back"];
    }
    catch (e) {
        // if box art layers don't exist, do nothing here
    }

    try {
        var layerSet_tempVisible = myDocument.layerSets["Temp visible"];
        var layerSet_titleBlack = myDocument.layerSets["Title goes there BlackBorder"];
        var layerSet_titleWhite = myDocument.layerSets["Title goes there WhiteBorder"];
        var layer_whiteBack = myDocument.layerSets["Hidden"].layers["White Background"];
        var layer_blackBack = myDocument.layerSets["Hidden"].layers["Black Background"];
    }
    catch (e) {
        // if outlined title layers don't exist, do nothing here
    }

    // PNG save options
    var pngOptions = new PNGSaveOptions();
    pngOptions.compression = 6;
    pngOptions.interlaced = false;

    // Check if all layers are found
    if (layer_title_perm && layer_ss_perm) {
        // Select Files for 'title' Smart Object
        // var folder1 = Folder.selectDialog("Select folder for the 'title' smart object images");
        var folder_title = Folder(thePath + "/title");
        var folder_ss = Folder(thePath + "/screenshot");
        var folder_box = Folder(thePath + "/box");

        // Get all the file names from both folders
        var arr_title = [];
        var arr_ss = [];
        var arr_box = [];

        if (folder_title) {
            var files_title = folder_title.getFiles(/\.(psd|tif|jpg|png)$/i);

            for (var i = 0; i < files_title.length; i++) {
                raw_title_name = files_title[i].name.toString();
                base_title_name = raw_title_name.match(/(.*)\.[^\.]+$/)[1];
                arr_title.push(base_title_name);
            };
        }

        if (folder_ss) {
            var files_ss = folder_ss.getFiles(/\.(psd|tif|jpg|png)$/i);

            for (var i = 0; i < files_ss.length; i++) {
                raw_ss_name = files_ss[i].name.toString();
                base_ss_name = raw_ss_name.match(/(.*)\.[^\.]+$/)[1];
                arr_ss.push(base_ss_name);
            };
        }

        // Merge the arrays and drop duplicates
        var arr_combined = arr_title.concat(arr_ss);

        if (folder_box) {
            var files_box = folder_box.getFiles(/\.(psd|tif|jpg|png)$/i);

            for (var i = 0; i < files_box.length; i++) {
                raw_box_name = files_box[i].name.toString();
                base_box_name = raw_box_name.match(/(.*)\.[^\.]+$/)[1];
                arr_box.push(base_box_name);
            };

            arr_combined = arr_combined.concat(arr_box);
        }


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
            // Add escape character before special characters in file name
            searchString = searchString.replace(/([<>*()?+$])/g, "\\$1");
            // searchString = searchString.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            // searchString = '^'+searchString+'$';
            // alert(searchString);
            var searchRegExp = new RegExp(searchString);

            // If there are layers in the title and screenshot sets, delete them first
            try {
              layerSet_title.layers[0].remove();
            } catch (e) {
              null;
            }
            try {
              layerSet_titleBlack.layers[0].remove();
            } catch (e) {
              null;
            }
            try {
              layerSet_titleWhite.layers[0].remove();
            } catch (e) {
              null;
            }
            try {
              layerSet_ss.layers[0].remove();
            } catch (e) {
              null;
            }
            try {
              layerSet_box.layers[0].remove();
            } catch (e) {
              null;
            }

            // If there are layers in the back panel layers, move them back to the hidden folder
            try {
              while (layerSet_backtitle.layers[0]) {
                // layerSet_backtitle.layers[0].remove()
                layerSet_backtitle.layers[0].move(layerSet_hidden, ElementPlacement.PLACEATEND);
              }
            } catch (e) {
              null;
            }
            try {
              while (layerSet_boxback.layers[0]) {
                // layerSet_boxback.layers[0].remove()
                layerSet_boxback.layers[0].move(layerSet_hidden, ElementPlacement.PLACEATEND);
              }
            } catch (e) {
              null;
            }

            // If the title image for the game exists, process the title image
            // otherwise, leave it blank
            if (folder_title.getFiles(searchRegExp).length > 0) {
                // Put raw title image into new layer
                myDocument.activeLayer = layer0;
                addFileNewLayer(folder_title.getFiles(searchRegExp)[0]);
                myDocument.activeLayer.name = "raw_title";

                // Move raw box image to the layer set
                myDocument.layers["raw_title"].move(layerSet_title, ElementPlacement.PLACEATEND);

                // Loop through each common image extension to find image
                for (var j = 0; j < check_file_extensions.length; j++) {
                  if (File(thePath + "/title/" + arr_unique[i] + check_file_extensions[j]).exists) {
                    var found_title_filename = arr_unique[i] + check_file_extensions[j];
                  }
                }

                // Get resolution (PPI) of raw file to determine real size
                app.open(new File(thePath + "/title/" + found_title_filename));
                var raw_res = app.activeDocument.resolution ;
                app.activeDocument.close();

                // Add image and resize based on the reference placeholder
                replaceContentWithResize("raw_title", layerSet_title, "Calque 5", File(thePath + "/title/" + found_title_filename), "constrain", "", raw_res);

                // If the temp visible layer exists
                if (layerSet_tempVisible) {
                  // Temporarily move the raw_screenshot layer to the temp visible later to calculate the highlight border pixels
                  layerSet_title.layers[0].move(layerSet_tempVisible, ElementPlacement.PLACEATEND);

                  // Select opaque areas only
                  selectNonTransparent()

                  // Select inverse
                  var idInvs = charIDToTypeID( "Invs" );
                  executeAction( idInvs, undefined, DialogModes.NO);

                  // Expand selection by 2 pixels - to get the borders of the title
                  app.activeDocument.selection.expand(new UnitValue (2, "px"));

                  // Select only the visible border
                  colorRangeMidtones(0, 0, 255, 0);

                  // Get number of selected pixels
                  var visible_border_pxls = getNumSelectedPxls();

                  // Move the white back behind the title (for correctly getting the colours of semi-transparent logo edges)
                  layer_whiteBack.move(layerSet_tempVisible, ElementPlacement.PLACEATEND);

                  // Select only highlight shade pixels (range of 100 to 255)
                  colorRangeMidtones(0, 200, 255, 0);

                  // Get number of selected highlight pixels
                  var highlight_border_pxls = getNumSelectedPxls();

                  // Ratio highlight vs all pixels
                  if (highlight_border_pxls <= visible_border_pxls) {
                    var highlight_ratio = highlight_border_pxls / visible_border_pxls;
                  } else {
                    var highlight_ratio = 0.0;
                  }

                  // Move white layer back to Hidden
                  layer_whiteBack.move(layerSet_hidden, ElementPlacement.PLACEATEND);

                  // Move the black back behind the title (for correctly getting the colours of semi-transparent logo edges)
                  // layer_blackBack.move(layerSet_tempVisible, ElementPlacement.PLACEATEND);

                  // Select only very bright shade pixels (range of 100 to 255)
                  colorRangeMidtones(0, 230, 255, 0);

                  // Get number of selected highlight pixels
                  var vbright_border_pxls = getNumSelectedPxls();

                  // Ratio v. bright vs all pixels
                  if (vbright_border_pxls <= visible_border_pxls) {
                    var vbright_ratio = vbright_border_pxls / visible_border_pxls;
                  } else {
                    var vbright_ratio = 0.0;
                  }

                  // Move black layer back to Hidden
                  // layer_blackBack.move(layerSet_hidden, ElementPlacement.PLACEATEND);

                  // Select opaque areas only
                  selectNonTransparent()

                  // Select inverse
                  var idInvs = charIDToTypeID( "Invs" );
                  executeAction( idInvs, undefined, DialogModes.NO);

                  // Expand selection by 2 pixels - to get the borders of the title
                  app.activeDocument.selection.expand(new UnitValue (2, "px"));

                  // Select only the visible border
                  colorRangeMidtones(0, 0, 255, 0);

                  // Get number of selected pixels
                  // var visible_border_pxls = getNumSelectedPxls();

                  // Move the black back behind the title (for correctly getting the colours of semi-transparent logo edges)
                  layer_blackBack.move(layerSet_tempVisible, ElementPlacement.PLACEATEND);

                  // Select only shadow shade pixels (range of 0 to 80)
                  // colorRangeMidtones(0, 0, 30, 0);
                  colorRangeMidtones(0, 0, 80, 0);

                  // Get number of selected shadow pixels
                  var shadow_border_pxls = getNumSelectedPxls();

                  // Ratio shadow vs all pixels
                  if (shadow_border_pxls <= visible_border_pxls) {
                    var shadow_ratio = shadow_border_pxls / visible_border_pxls;
                  } else {
                    var shadow_ratio = 0.0;
                  }

                  // Move black layer back to Hidden
                  layer_blackBack.move(layerSet_hidden, ElementPlacement.PLACEATEND);

                  // Move the white back behind the title (for correctly getting the colours of semi-transparent logo edges)
                  layer_whiteBack.move(layerSet_tempVisible, ElementPlacement.PLACEATEND);

                  // Select only very dark shade pixels (range of 100 to 255)
                  // colorRangeMidtones(0, 0, 10, 0);
                  colorRangeMidtones(0, 0, 35, 0);

                  // Move white layer back to Hidden
                  layer_whiteBack.move(layerSet_hidden, ElementPlacement.PLACEATEND);

                  // Get number of selected highlight pixels
                  var vdark_border_pxls = getNumSelectedPxls();

                  // Ratio v. bright vs all pixels
                  if (vdark_border_pxls <= visible_border_pxls) {
                    var vdark_ratio = vdark_border_pxls / visible_border_pxls;
                  } else {
                    var vdark_ratio = 0.0;
                  }

                  // alert("Highlight %:" + highlight_ratio + "    Shadow %:" + shadow_ratio + "    V. Bright %:" + vbright_ratio + "    V. Dark %:" + vdark_ratio);

                  // If the ratio is lower than 25%, move the image back to the title layer set with white border
                  // Otherwise, send to set with black border
                  // if (highlight_ratio > 0.70) {
                  //   layerSet_tempVisible.layers[0].move(layerSet_title, ElementPlacement.PLACEATEND);
                  // } else {
                  //     if (vbright_ratio > 0.10) {
                  //       layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                  //     } else {
                  //         if (vdark_ratio < Math.min(vbright_ratio, 0.10)) {
                  //           layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                  //         } else {
                  //           if (highlight_ratio < 0.40) {
                  //             layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                  //           } else {
                  //               if (shadow_ratio > 0.30) {
                  //                 layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                  //               } else {
                  //                 layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                  //               }
                  //           }
                  //         }
                  //     }
                  // }

                  // if (highlight_ratio > 0.70) {
                  //   layerSet_tempVisible.layers[0].move(layerSet_title, ElementPlacement.PLACEATEND);
                  // } else {
                  //     if (vbright_ratio > 0.10) {
                  //       layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                  //     } else {
                  //         if (highlight_ratio < 0.40) {
                  //             if (vdark_ratio >= vbright_ratio) {
                  //               layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                  //             } else {
                  //                 if (vbright_ratio > 0.05) {
                  //                   layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                  //                 } else {
                  //                   layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                  //                 }
                  //             }
                  //         } else {
                  //           if (shadow_ratio > 0.30) {
                  //               layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                  //             } else {
                  //               layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                  //             }
                  //         }
                  //     }
                  // }

                  if (highlight_ratio > 0.70) {
                    layerSet_tempVisible.layers[0].move(layerSet_title, ElementPlacement.PLACEATEND);
                  } else {
                      if (vbright_ratio > 0.10) {
                          if (vdark_ratio >= vbright_ratio) {
                            layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                          } else {
                              if (vbright_ratio > 0.40) {
                                layerSet_tempVisible.layers[0].move(layerSet_title, ElementPlacement.PLACEATEND);
                              } else {
                                layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                              }
                          }
                      } else {
                          if (highlight_ratio < 0.40) {
                              if (vdark_ratio >= vbright_ratio) {
                                layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                              } else {
                                  if (vbright_ratio > 0.05) {
                                    layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                                  } else {
                                    layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                                  }
                              }
                          } else {
                            if (shadow_ratio > 0.30) {
                                layerSet_tempVisible.layers[0].move(layerSet_titleWhite, ElementPlacement.PLACEATEND);
                              } else {
                                layerSet_tempVisible.layers[0].move(layerSet_titleBlack, ElementPlacement.PLACEATEND);
                              }
                          }
                      }
                  }
                }

                // Duplicate the back title layer to the visible set
                layer_backtitle.move(layerSet_backtitle, ElementPlacement.PLACEATEND);
            } else {
              try {
                layerSet_title.layers[0].remove();
              } catch (e) {
                  // Do nothing
              }
            }

            // If the screenshot image for the game exists, process the screenshot image
            // otherwise, leave it blank
            if (folder_ss.getFiles(searchRegExp).length > 0) {
                // Put raw screenshot image into new layer
                myDocument.activeLayer = layer0;
                addFileNewLayer(folder_ss.getFiles(searchRegExp)[0]);
                myDocument.activeLayer.name = "raw_screenshot";

                // Move raw box image to the layer set
                myDocument.layers["raw_screenshot"].move(layerSet_ss, ElementPlacement.PLACEATEND);

                // Loop through each common image extension to find image
                for (var j = 0; j < check_file_extensions.length; j++) {
                  if (File(thePath + "/screenshot/" + arr_unique[i] + check_file_extensions[j]).exists) {
                    var found_ss_filename = arr_unique[i] + check_file_extensions[j];
                  }
                }

                // Get resolution (PPI) of raw file to determine real size
                app.open(new File(thePath + "/screenshot/" + found_ss_filename));
                var raw_res = app.activeDocument.resolution ;
                app.activeDocument.close();

                // Add image and resize based on the reference placeholder
                replaceContentWithResize("raw_screenshot", layerSet_ss, "Calque 6", File(thePath + "/screenshot/" + found_ss_filename), "exceed", "", raw_res);


                // // Delete the raw screenshot layer
                // myDocument.layers["raw_screenshot"].remove();
            } else {
              try {
                layerSet_ss.layers[0].remove();
              } catch (e) {
                  // Do nothing
              }
            }



            // If the box image for the game exists, process the box image
            // otherwise, leave it blank
            if ((folder_box.getFiles(searchRegExp).length > 0) && (layer_box_perm)) {
                // Put raw box image into new layer
                myDocument.activeLayer = layer0;
                addFileNewLayer(folder_box.getFiles(searchRegExp)[0]);
                myDocument.activeLayer.name = "raw_box";

                // Move raw box image to the layer set
                myDocument.layers["raw_box"].move(layerSet_box, ElementPlacement.PLACEATEND);

                // Loop through each common image extension to find image
                for (var j = 0; j < check_file_extensions.length; j++) {
                  if (File(thePath + "/box/" + arr_unique[i] + check_file_extensions[j]).exists) {
                    var found_box_filename = arr_unique[i] + check_file_extensions[j];
                  }
                }

                // Get resolution (PPI) of raw file to determine real size
                app.open(new File(thePath + "/title/" + found_title_filename));
                var raw_res = app.activeDocument.resolution ;
                app.activeDocument.close();

                // Add image and resize based on the reference placeholder
                // For boxart, anchor resize to centre right (rather than centre) of image
                replaceContentWithResize("raw_box", layerSet_box, "Box placeholder", File(thePath + "/box/" + found_box_filename), "constrain", "CENTERRIGHT", raw_res);

                // Duplicate the back title layer to the visible set
                layer_boxback.move(layerSet_boxback, ElementPlacement.PLACEATEND);
            } else {
              try {
                  layerSet_box.layers[0].remove();
              } catch (e) {
                  // Do nothing
              }
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


function replaceContentWithResize(rawLayerName, refLayerSet, refLayerName, replaceFile, logic, anchor, raw_res) {

    // Temporarily move the raw layer to Hidden set, as some sets have outline and drop shadow effects which interfere with size calculation
    refLayerSet.layers[rawLayerName].move(myDocument.layerSets["Hidden"], ElementPlacement.PLACEATEND);

    var rawImgLayer = myDocument.layerSets["Hidden"].layers[rawLayerName]

    // Get PPI of the template doc (default is 72)
    var doc_res = app.activeDocument.resolution ;
    // alert("doc res: " + doc_res + "   raw res: " + raw_res);

    // If the raw image PPI is not the same as the template PPI, then resize the image to correct for Photoshop downscaling it
    // If the raw PPI is larger than the template PPI, the image get downscaled, so needs to be upscaled to correct
    // If raw PPI is less than template PPI, just leave it, otherwise there will probably be over-downscaling, as the placed smart object will be limited by canvas size
    if (doc_res < raw_res) {
      var ppi_ratio = (raw_res / doc_res) * 100;

      // alert("resize due to mismatch ratio: " + ppi_ratio);

      rawImgLayer.resize(ppi_ratio, ppi_ratio);
    }

    // Get the width/height ratio of the raw screenshot
    var rawBounds = rawImgLayer.bounds;
    var rawWidth = rawBounds[2] - rawBounds[0];
    var rawHeight = rawBounds[3] - rawBounds[1];
    var rawRatio = rawWidth / rawHeight;

    var min_side = Math.min(rawWidth, rawHeight);
    var max_side = Math.max(rawWidth, rawHeight);

    // alert('max_side: ' + max_side);

    // Get the width/height ratio of the ref screenshot
    var refLayer = myDocument.layerSets["Hidden"].layers[refLayerName];
    var refBounds = refLayer.bounds;
    var refWidth = refBounds[2] - refBounds[0];
    var refHeight = refBounds[3] - refBounds[1];
    var refRatio = refWidth / refHeight;

    // alert("Raw width: " + rawWidth + "   Raw height: " + rawHeight + "   Ref width: " + refWidth + "   Ref height: " + refHeight);

    // Get the width/height ratio of the placed screenshot
    var placedBounds = rawImgLayer.bounds;
    var placedWidth = placedBounds[2] - placedBounds[0];
    var placedHeight = placedBounds[3] - placedBounds[1];

    // Calculate the ratio with which to resize the image
    ratio2 = resizeWithLogic(refWidth, refHeight, placedWidth, placedHeight, logic);

    // If maximum side is less than 200 pixels and is an enlargement transformation (i.e. ratio is larger than 100%), set interpolation method to Nearest Neighbour
    if ((max_side < 200) && ((ratio2.ratioWidth2 > 100) || (ratio2.ratioHeight > 100))) {
      app.preferences.interpolation = ResampleMethod.NEARESTNEIGHBOR;
    } else {
      app.preferences.interpolation = ResampleMethod.BICUBICAUTOMATIC;
    }

    // Resizing the pasted image basd on the template
    rawImgLayer.resize(ratio2.ratioWidth2, ratio2.ratioHeight2);

    // Move the transformed raw image to the location of the reference image
    // Use centre of image as reference in most cases, unless specified Otherwise
    if (anchor == 'BOTTOMRIGHT') {
        // Get bottom right location of the reference image
        var ref_x_loc = refBounds[2];
        var ref_y_loc = refBounds[3];

        // Get centre location of the transformed raw image
        var transBounds = rawImgLayer.bounds;
        var transWidth = transBounds[2] - transBounds[0];
        var transHeight = transBounds[3] - transBounds[1];

        var trans_x_loc = transBounds[2];
        var trans_y_loc = transBounds[3];

        // Translate the transformed layer to location of reference layer
        var deltaX = Math.round(ref_x_loc - trans_x_loc);
        var deltaY = Math.round(ref_y_loc - trans_y_loc);

        rawImgLayer.translate(deltaX, deltaY);

    } else if (anchor == 'CENTERRIGHT') {
        // Get centre right location of the reference image
        var ref_x_loc = refBounds[0] + refWidth / 2;
        var ref_y_loc = refBounds[3];

        // Get centre location of the transformed raw image
        var transBounds = rawImgLayer.bounds;
        var transWidth = transBounds[2] - transBounds[0];
        var transHeight = transBounds[3] - transBounds[1];

        var trans_x_loc = transBounds[0] + transWidth / 2;
        var trans_y_loc = transBounds[3];

        // Translate the transformed layer to location of reference layer
        var deltaX = Math.round(ref_x_loc - trans_x_loc);
        var deltaY = Math.round(ref_y_loc - trans_y_loc);

        rawImgLayer.translate(deltaX, deltaY);

    } else {
      // Get centre location of the reference image
      var ref_x_loc = refBounds[0] + refWidth / 2;
      var ref_y_loc = refBounds[1] + refHeight / 2;

      // Get centre location of the transformed raw image
      var transBounds = rawImgLayer.bounds;
      var transWidth = transBounds[2] - transBounds[0];
      var transHeight = transBounds[3] - transBounds[1];

      var trans_x_loc = transBounds[0] + transWidth / 2;
      var trans_y_loc = transBounds[1] + transHeight / 2;

      // Translate the transformed layer to location of reference layer
      var deltaX = Math.round(ref_x_loc - trans_x_loc);
      var deltaY = Math.round(ref_y_loc - trans_y_loc);

      rawImgLayer.translate(deltaX, deltaY);
    }

    // Reset interpolation method to Bicubic Automatic
    app.preferences.interpolation = ResampleMethod.BICUBICAUTOMATIC;

    // Move back to the ref layer set
    myDocument.layerSets["Hidden"].layers[rawLayerName].move(refLayerSet, ElementPlacement.PLACEATEND);
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

      // alert("ratioWidth2: " + ratioWidth2 + "   refWidth: " + refWidth + "   refHeight: " + refHeight + "   placedWidth: " + placedWidth + "   placedHeight: " + placedHeight);
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

function colorRangeMidtones(midtonesFuzziness, midtonesLowerLimit, midtonesUpperLimit, colorModel) {
	var s2t = function (s) {
		return app.stringIDToTypeID(s);
	};
	var descriptor = new ActionDescriptor();
	descriptor.putEnumerated( s2t( "colors" ), s2t( "colors" ), s2t( "midtones" ));
	descriptor.putInteger( s2t( "midtonesFuzziness" ), midtonesFuzziness );
	descriptor.putInteger( s2t( "midtonesLowerLimit" ), midtonesLowerLimit );
	descriptor.putInteger( s2t( "midtonesUpperLimit" ), midtonesUpperLimit );
	descriptor.putInteger( s2t( "colorModel" ), colorModel );
	executeAction( s2t( "colorRange" ), descriptor, DialogModes.NO );
}

function getNumSelectedPxls() {
  var a = 0, h = app.activeDocument.histogram;
  for (k=0; k<256;k++) {a+= h[k]}
  return a
}

function selectNonTransparent() {
  sTT = stringIDToTypeID;
  (ref1 = new ActionReference()).putProperty(c = sTT('channel'), sTT('selection'));
  (dsc = new ActionDescriptor()).putReference(sTT('null'), ref1);
  (ref2 = new ActionReference()).putEnumerated(c, c, sTT('transparencyEnum'))
  dsc.putReference(sTT('to'), ref2), executeAction(sTT('set'), dsc);
}
