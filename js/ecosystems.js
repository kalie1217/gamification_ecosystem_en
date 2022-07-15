// JavaScript Document


var ecosysRegions = new Array();
var ecosysData = new Object();
var ecosysInstr = new Object();
var ecosystemInstructionIsClicked = false;

function loadEcosystems_HTML5(){
	ecosystemsXMLParse();
	ecosystemsPopupInstr();
	ecosystemInstructionIsClicked = false;
}

function ecosystemsXMLParse(){
	var file = "xml/cip_" + projCode + "_ecosystemsHTML5.xml";
	var xmlObj = new load_XML(file);
	var elemArray = xmlObj.tagNameElement("eco_data");
	ecosysData.title = elemArray[0].getAttribute('title');
	ecosysData.path = elemArray[0].getAttribute('path');
	ecosysData.subtitle = elemArray[0].getAttribute('subtitle');
	ecosysData.subtitleX = elemArray[0].getAttribute('subtitleX');
	ecosysData.subtitleY = elemArray[0].getAttribute('subtitleY');
	ecosysData.titleX = elemArray[0].getAttribute('countryX');
	ecosysData.titleY = elemArray[0].getAttribute('countryY');
	elemArray = xmlObj.tagNameElement("instructions");
	ecosysInstr.title = elemArray[0].getAttribute('title');
	var instrChilds = elemArray[0].childNodes;
	
	for (var i = 0; i < instrChilds.length; i++){
		var xmlNode = instrChilds[i];
		if(xmlNode.nodeName != '#text'){
			switch (xmlNode.nodeName){
				case 'content':
				ecosysInstr.content = parseInlineNodes(xmlNode);
				break;
			}
		}
	}



	elemArray = xmlObj.tagNameElement("region");
	
	for (var i = 0; i < elemArray.length; i++){
		var obj = new Object();
		var objRegion = new Object();
		var arrayInhabitant = new Array();
		objRegion.id = elemArray[i].getAttribute('id');
		objRegion.xpos = elemArray[i].getAttribute('xpos');
		objRegion.ypos = elemArray[i].getAttribute('ypos');
		objRegion.path = elemArray[i].getAttribute('path');
		objRegion.label = elemArray[i].getAttribute('label');
		objRegion.isTextOutside = elemArray[i].getAttribute('isTextOutside');
		objRegion.labelWidthBox = elemArray[i].getAttribute('labelWidthBox');
		obj.region=objRegion;

		var regionChilds = elemArray[i].childNodes;
		
		for (var j=0; j< regionChilds.length; j++){
			var xmlNode = regionChilds[j];
			switch (xmlNode.nodeName){
				case 'description':
				obj.description = parseInlineNodes(xmlNode).innerHTML;
				break;

				case 'inhabitant':
				var objInhabitant = new Object();
				objInhabitant.id = xmlNode.getAttribute('id');
				objInhabitant.orientation = xmlNode.getAttribute('orientation');
				objInhabitant.xpos = xmlNode.getAttribute('xpos');
				objInhabitant.ypos = xmlNode.getAttribute('ypos');
				objInhabitant.width = xmlNode.getAttribute('width');
				objInhabitant.height = xmlNode.getAttribute('height');
				var inhabitantChilds = xmlNode.childNodes;
				
				for (var x = 0; x < inhabitantChilds.length; x++){
					var xmlNode = inhabitantChilds[x];
					switch (xmlNode.nodeName){
						case 'label':
						objInhabitant.label = parseInlineNodes(xmlNode).innerHTML;
						break;

						case 'description':
						objInhabitant.description = parseInlineNodes(xmlNode).innerHTML;
						break;


					}//switch
				} //end x for loop
				arrayInhabitant[objInhabitant.id] = objInhabitant;

				break;
			}//switch
		} // inner j for loop
							  
				obj.inhabitant = arrayInhabitant;

				ecosysRegions[objRegion.id] = obj;

	}//end i for loop
				//var inhabitantArray_ecoRegion2 = regions["ecoRegion1"].inhabitant
				//for(var i = 0; i < inhabitantArray_ecoRegion2.length; i++){
			//alert("inhabitantArray_ecoRegion2[i].id " + inhabitantArray_ecoRegion2[i].id);
			//alert(inhabitantArray_ecoRegion2[i].label);
			//alert(inhabitantArray_ecoRegion2[i].description);
				//}
				
} //end ecosystemsXMLParse();

			
			function parseInlineNodes(xmlNode){
				var inlPart = ce('span');
				for (var i = 0; i < xmlNode.childNodes.length; i++){
					var hPart;
					var xPart = xmlNode.childNodes[i];
					
					if (xPart.nodeName == '#text'){
						hPart = ce('span');
						
						hPart.appendChild(ctn(xPart.data));

					}  
					else {
							hPart = ce(xPart.nodeName); //html tags (b, u, i etc.)
							
							if (xPart.firstChild){
								hPart.appendChild(ctn(xPart.firstChild.data));
							}
						}
						inlPart.appendChild(hPart);
					}
					return inlPart;
				}


// "Helper" functions
function ce(name){
	var dn = document.createElement(name);
	return dn;
}

function ctn(from){
	var tn = document.createTextNode(from);
	return tn;
}

function convertTextToUnicode(string){
	var z = []
	var s = new String(string);
	for(var q = 0; q < s.length;  q++)
		z.push( "&#" + s.charCodeAt(q) + ";");

	return z.join("");			
}
