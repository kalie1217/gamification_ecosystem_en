var ecosysSVG = new Array();
var ecosysSVG1= new Array();
var ecosystemOBJSelectedArray = new Array();


function ecosystemsLoadSVGMap(){
		//create vector region highlights, export svg, rename extension to xml beforehand!
		//make sure the artboards in the svg file are set to 624x340
		var file = "xml/cip_" + projCode + "_ecosystemsMap.xml";
		var xmlObj = new load_XML(file);
		var regionMaps = new Array();
		var g_elements = xmlObj.tagNameElement("g");

		for (var i = 0; i < g_elements.length; i++){
			var obj = new Object();
			var id = g_elements[i].getAttribute('id');
			
			if (id && id != "null") {
				obj.name = id;
				for (var reg in ecosysRegions) {
					if (id.indexOf(reg) != -1) {
						var paths = xmlObj.tagNameElement("path",g_elements[i]);
						var string = "";
						
						for(var x = 0; x < paths.length; x++){
							string += paths[x].getAttribute('d') + " ";
							obj.fill = paths[x].getAttribute('fill')
						}// end x for
					}//end if 
				} // end for-in 
					//alert(string);
				obj.path = string;

				regionMaps[id] = obj;
			} //end if
		}// end i for

		$(function(){
			var r = Raphael('ecosysDivSVG', 624, 340);
			var r1 = Raphael('ecosysDivSVG1', 624, 340);

			for (var reg in regionMaps) {
			// alert(regionMaps[reg].path);
				var obj = r.path(regionMaps[reg].path);
				var obj1 = r1.path(regionMaps[reg].path);
				obj.id = reg;
				obj1.id = reg+ "_SVG";;
				ecosysSVG[obj.id] = obj;
				ecosysSVG1[obj1.id] = obj1;
				
				var attributes = {
					'fill': regionMaps[reg].fill,
					'fill-opacity': 0,
					'stroke-opacity': 0,
					'cursor':'pointer'
				};
				
				obj.attr(attributes);
				obj1.attr(attributes);
				obj.scale(1,1,0,0);
				obj1.scale(1,1,0,0);
				
				obj
				.hover(function(){
					
					ecosystemsRegionPopup(this.id);
					ecosysSVG1[this.id + "_SVG"].animate({'fill-opacity' : 0.8 }, 300);
					
					}, 

					function(){
						if (ecosystemOBJSelectedArray[this.id] != "true"){
							ecosysSVG1[this.id + "_SVG"].animate({'fill-opacity' : 0}, 300);
						}
						else {
							ecosysSVG1[this.id + "_SVG"].animate({'fill-opacity' : 0.5}, 300);
						}
						
						document.getElementById("ecosysDivregionPopup").style.display= "none";
					}
				);//end .hover

				obj.click(function(){
					var name = this.id;
					ecosystemOBJSelectedArray[name] = "true";
					ecosysSVG1[this.id + "_SVG"].attr({'fill-opacity': 0.5});
					ecosystemLoadRegion(name);
					document.getElementById("ecosysInstructionsBox").style.display= "none";
				});
				//alert(ecosysDivSVG1.innerHTML);
			}//end for
		});//end jquery SVG 
		
	document.getElementById("transparentPopUp").style.display= "none";
	//document.getElementById("ecoContent").style.display= "block";

} // end ecosystemsLoadSVGMap();

function ecosystemLoadRegion(regionName){

	document.getElementById("ecosysInstrDivText").style.display = "none";
	document.getElementById("ecosysReturnText").style.display = "block";
		//$("#ecoContent").effect("scale", { percent: 200 }, 1000);
		$("#ecoContent").fadeTo(1000,0);
		
		//document.getElementById("ecoContent").style.display= "none";
		$("#ecosysDivRegion").fadeTo(1000,1);
		//document.getElementById("ecosysDivRegion").style.display= "block";
		
		document.getElementById("ecosysDivRegion").innerHTML = "";
		var objDiv = document.createElement("div");
		objDiv.id ='ecosysRegionInhabitantBottom';
		document.getElementById("ecosysDivRegion").appendChild(objDiv);

		var string = "url(\'"+ecosysRegions[regionName].region.path + "\')";
		document.getElementById("ecosysDivRegion").style.backgroundImage = string;
		var arrayInhabitant = ecosysRegions[regionName].inhabitant
		
		document.getElementById("ecosysSubtitle").innerHTML = ecosysRegions[regionName].region.label;
		
		for (var reg in arrayInhabitant) {
			var objDiv = document.createElement("div");
			objDiv.className = 'ecosysRegionInhabitant';
			objDiv.id = arrayInhabitant[reg].id;
			//alert(arrayInhabitant[reg].label);
			objDiv.setAttribute("title",arrayInhabitant[reg].label);

			if (arrayInhabitant[reg].orientation == "left") {
				$(objDiv).tooltip({ 
					content: objDiv.getAttribute("title"),
					// track: true, 
					// delay: 0, 
					// showURL: false, 
					positionLeft: true, 
					fade: 250
				});
			}
			else {
				$(objDiv).tooltip({ 
					content: objDiv.getAttribute("title"),
					// track: true, 
					// delay: 0, 
					// showURL: false, 
					positionLeft: false, 
					fade: 250
				});
			}
			objDiv.style.left = arrayInhabitant[reg].xpos + "px";
			objDiv.style.top = arrayInhabitant[reg].ypos + "px";
			objDiv.style.width = arrayInhabitant[reg].width + "px";
			objDiv.style.height = arrayInhabitant[reg].height + "px";
			document.getElementById("ecosysDivRegion").appendChild(objDiv);
			
			objDiv.onmouseover = function() {
				document.getElementById("ecosysRegionInhabitantBottom").style.display = "block";
			//alert(this.id);
			document.getElementById("ecosysRegionInhabitantBottom").innerHTML = arrayInhabitant[this.id].description;
			var heightDiv = parseFloat( document.getElementById("ecosysRegionInhabitantBottom").offsetHeight);

			document.getElementById("ecosysRegionInhabitantBottom").style.top = (340 - (heightDiv + 2)) + "px";
		}
		objDiv.onmouseout = function() {
			document.getElementById("ecosysRegionInhabitantBottom").style.display = "none";
		}
	}	
}

function ecosystemsShowButtons(){
	document.getElementById("ecosysSubtitle").innerHTML = ecosysData.subtitle;
	document.getElementById("ecosysInstrDivText").style.display = "block";
	document.getElementById("ecosysReturnText").style.display = "none";
	//document.getElementById("ecoContent").style.display= "block";
	$("#ecoContent").fadeTo(500,1);
	//document.getElementById("ecosysDivRegion").style.display= "none";
	$("#ecosysDivRegion").fadeTo(500,0);
}

function ecosystemsRegionPopup( name){
	document.getElementById("ecosysDivregionPopup").style.display= "block";
	//alert(arrayInhabitant[name].description);
	document.getElementById("ecosysDivregionPopup").innerHTML=ecosysRegions[name].description;
	var heightDiv = parseFloat(document.getElementById("ecosysDivregionPopup").offsetHeight);
	document.getElementById("ecosysDivregionPopup").style.top=(340-(heightDiv+2)) + "px";
}

function ecosystemsPopupInstr(){
	
	var ecosystem= document.getElementById("HTML5");
	var ecosystemsHTML5 = document.createElement("div");
	ecosystemsHTML5.setAttribute("id","ecosystemsHTML5");
	ecosystem.appendChild(ecosystemsHTML5);
	
	var ecoContent = document.createElement("div");
	ecoContent.setAttribute("id","ecoContent");
	ecosystemsHTML5.appendChild(ecoContent);
	
	var ecosysDivRegion = document.createElement("div");
	ecosysDivRegion.setAttribute("id","ecosysDivRegion");
	ecosystemsHTML5.appendChild(ecosysDivRegion);
	
	var transparentPopUp = document.createElement("div");
	transparentPopUp.setAttribute("id","transparentPopUp");
	ecosystemsHTML5.appendChild(transparentPopUp);
	
	var loadingText = document.createElement("div");
	loadingText.setAttribute("id","loadingText");
	loadingText.innerHTML = "Please wait for loading content...<br/>This message will disappear after the content has completed loading.";
	transparentPopUp.appendChild(loadingText);
	
	var loadingImage = document.createElement("img");
	loadingImage.setAttribute("id","loadingImage");
	loadingImage.setAttribute("src","images/ecosystems/ajax-loader.gif");
	transparentPopUp.appendChild(loadingImage);

	var ecosysDivregionPopup = document.createElement("div");
	ecosysDivregionPopup.setAttribute("id","ecosysDivregionPopup");
	ecoContent.appendChild(ecosysDivregionPopup);

	var ecosysDivSVG = document.createElement("div");
	ecosysDivSVG.setAttribute("id","ecosysDivSVG");
	ecoContent.appendChild(ecosysDivSVG);

	var ecosysDivRegionText = document.createElement("div");
	ecosysDivRegionText.setAttribute("id","ecosysDivRegionText");
	ecoContent.appendChild(ecosysDivRegionText);

	var ecosysDivSVG1 = document.createElement("div");
	ecosysDivSVG1.setAttribute("id","ecosysDivSVG1");
	ecoContent.appendChild(ecosysDivSVG1);

	var ecosysDivOverlay = document.createElement("div");
	ecosysDivOverlay.setAttribute("id","ecosysDivOverlay");
	ecoContent.appendChild(ecosysDivOverlay);
	
	var header = document.createElement("div");
	header.id = "ecosysHeader";
	ecosystemsHTML5.appendChild(header);

	var headerTitle = document.createElement("div");
	headerTitle.id = "headerTitle";
	// subtitle.style.left = ecosysData.subtitleX + "px";
	// subtitle.style.top =  ecosysData.subtitleY + "px";
	headerTitle.innerHTML = ecosysData.title + " | <span id='ecosysSubtitle'>" + ecosysData.subtitle + "</span>";
	header.appendChild(headerTitle);

	var instructionsText = document.createElement("div");
	instructionsText.id = "ecosysInstrDivText";
	instructionsText.innerHTML = ecosysInstr.title;
	header.appendChild(instructionsText);

	var returnText = document.createElement("div");
	returnText.id = "ecosysReturnText";
	returnText.innerHTML = "Return to Map";
	header.appendChild(returnText);

	var instructionsBox = document.createElement("div");
	instructionsBox.id = "ecosysInstructionsBox";
	ecosystemsHTML5.appendChild(instructionsBox);

	var closeX = document.createElement("div");
	closeX.id = "ecosysCloseX";
	closeX.innerHTML = "X"
	instructionsBox.appendChild(closeX);

	var instructionsTitle = document.createElement("div");
	instructionsTitle.id = "ecosysInstructionsTitle";
	instructionsTitle.innerHTML = ecosysInstr.title;
	instructionsBox.appendChild(instructionsTitle);
	if (ecosysData.titleX){
		var countryName = document.createElement("div");
		countryName.id = "ecosysCountryName";
		countryName.style.left= ecosysData.titleX + "px";
		countryName.style.top=  ecosysData.titleY + "px";
		countryName.innerHTML = ecosysData.title.toUpperCase();
		ecoContent.appendChild(countryName);
	}

	var instructionsContent = document.createElement("div");
	instructionsContent.id = "ecosysInstructionsContent";
	if (isMobile())
		instructionsContent.innerHTML= "Touch a region to highlight an ecosystem. <br/><br/>Touch the highlighted region a second time to learn more about the flora and fauna of that ecosystem."
	else
		instructionsContent.appendChild(ecosysInstr.content);
	
	instructionsBox.appendChild(instructionsContent);

	//hide return text to start
	returnText.style.display= "none";

	//create overlay image, must be 624x340
	var ecoMapOverlayDiv = document.createElement("div");
	ecoMapOverlayDiv.id = "ecoMapOverlay";
	var ecoMapOverlay = document.createElement("img");
	ecoMapOverlay.setAttribute('src',"images/ecosystems/eco_map_top_layer.png");
	ecoMapOverlayDiv.appendChild(ecoMapOverlay);
	ecoContent.appendChild(ecoMapOverlayDiv);

	//instructions button
	// instructionsText.onmouseover = function() {
	// 	this.style.cursor= "pointer";
	// 	this.style.color = "#F00000";
	// }
	// instructionsText.onmouseout = function() {
	// 	this.style.color = "#000000";
	// }
	instructionsText.onclick = function() {
		//show the instructions
		instructionsBox.style.display= "inline";
		$(instructionsBox).fadeTo(300,1);
	}

	returnText.onmouseover = function(){
		this.style.cursor= "pointer";
	}

	returnText.onclick = function() {
		ecosystemsShowButtons();
	}

	closeX.onmouseover = function() {
		this.style.cursor= "pointer";
		this.style.color = "#F00000";
	}
	closeX.onmouseout = function() {
		this.style.color = "#000000";
	}

	hideInstructionsBox = function(){
		$(instructionsBox).fadeTo(300,0);
		//remove the div after it has faded out
		displayNone = function(){
			instructionsBox.style.display= "none";
		}
		setTimeout(displayNone,300);
	}
	$(function(){	
		for (var reg in ecosysRegions) {
			var objDiv = document.createElement("div");
			document.getElementById("ecosysDivRegionText").appendChild(objDiv);
			objDiv.innerHTML= ecosysRegions[reg].region.label;
			objDiv.id = reg + "_text";
			objDiv.style.width= parseFloat(ecosysRegions[reg].region.labelWidthBox) + "px";
			objDiv.style.height= parseFloat(objDiv.offsetHeight) + "px";
			objDiv.className='ecosysRegionText';
			objDiv.style.left=ecosysRegions[reg].region.xpos + "px";
			objDiv.style.top=ecosysRegions[reg].region.ypos + "px";

			if (ecosysRegions[reg].region.isTextOutside== "true") {

				objDiv.style.position= "absolute";
				objDiv.style.zIndex=120;
				objDiv.style.cursor= "pointer";

				objDiv.onmouseover = function() {
				//alert(1);
				var name = this.id.split("_text");
				var name = this.id.split("_text");
				if (ecosystemInstructionIsClicked) {
					
					ecosystemsRegionPopup(name[0]);
					ecosysSVG1[name[0] + "_SVG"].attr({'fill-opacity' : 0.8});
				}
			}
			objDiv.onmouseout = function() {
				if (ecosystemInstructionIsClicked) {
					document.getElementById("ecosysDivregionPopup").style.display= "none";
					var name = this.id.split("_text");
					if (ecosystemOBJSelectedArray[name[0]] != "true")

						ecosysSVG1[name[0] + "_SVG"].animate({
							'fill-opacity' : 0
						}, 300);
					else
						ecosysSVG1[name[0] + "_SVG"].animate({
							'fill-opacity' : 0.5
						}, 300);
				}
			}

			objDiv.onclick = function() {
				if (!ecosystemInstructionIsClicked) {
					ecosystemInstructionIsClicked =true;
					ecosystemsLoadSVGMap();
				}
				var name = this.id.split("_text");
				ecosystemOBJSelectedArray[name[0]]= "true";
				ecosysSVG1[name[0] + "_SVG"].attr({'fill-opacity': 0.5});
				ecosystemLoadRegion(name[0]);
				document.getElementById("ecosysInstructionsBox").style.display= "none";
				
			}
		}

	}
});
	instructionsBox.onclick = function() {
		hideInstructionsBox();
		if (!ecosystemInstructionIsClicked) {
			if (navigator.userAgent.indexOf("MSIE") != -1) {
				document.getElementById("transparentPopUp").style.display= "block";
				setTimeout(ecosystemsLoadSVGMap,500);
			}
			else {
				ecosystemsLoadSVGMap();
				ecosystemInstructionIsClicked =true;
			}
		}
	}
	
}
function isMobile(){
	var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));   
	if (mobile)   
		return true;
	else
		return false;

}