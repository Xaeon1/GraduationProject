// bring application forward for double-click events
app.bringToFront();

//Основна функция
function createCollage(){
	//Основни размери на миниатюрата
	const w = 800; //Ширина
	const h = w/2;	//Височина
	const g = 40;	//Отстояние
	
	//Размери на темплейта
	const documentWidth = 2.5*g + w + h;
	const documentHeight = 2*h + 2.5*g;

	//Създаване на нов документ
	var docRef= app.documents.add(documentWidth, documentHeight, 72, "docRef", NewDocumentMode.RGB, DocumentFill.WHITE);

	//Създаване на променлива за селекция
	var selectionBounds;

	//Създаване на шаблона
	for(var i=1; i<=4; i++){
		//Създаване на нов слой за миниатюрa
		docRef.artLayers.add().name = 'thumb ' + i;
		//Създаване на всички миниатюри
		switch(i){
			// Хоризонтален правоъгълник
			case 1:
				// Задаваме координати на селекцията
				selectionBounds = [[g, g], [w+g, g], [w+g, h+g], [g, h+g]];
				// Правим селекция и я запълваме с черен цвят
				makeSelection(docRef, selectionBounds);
				// Преоразмеряваме избрана снимка, така че да съвпада с правоъгълника
				resizeImageHorizontal(docRef, documentWidth, documentHeight, w, h);
				// Задаваме име на слоя, на който се намира снимката
				docRef.activeLayer.name = "photo " + i;
				// Преместваме преоразмерената снимка, така че центъра ѝ да съвпадне с центъра на правоъгълника
				docRef.activeLayer.translate(-(documentWidth/2-((w/2)+g)), -(documentHeight/2-((h/2)+g)));
				// Групираме двата слоя
				docRef.activeLayer.grouped = true;
				break;
			//Вертикален правоъгълник	
			case 2:
				selectionBounds = [[w+(1.5*g), g], [(1.5*w)+(1.5*g), g], [(1.5*w)+(1.5*g), w+(1.5*g)], [w+(1.5*g), w+(1.5*g)]];
				makeSelection(docRef, selectionBounds);
				resizeImageVertical(docRef, documentWidth, documentHeight, w, h, g);
				docRef.activeLayer.name = "photo " + i;
				docRef.activeLayer.translate((documentWidth-((w)+(1.5*g))), 0);
				docRef.activeLayer.grouped = true;
				break;
			// Ляв квадрат	
			case 3:
				selectionBounds = [[g, h+(1.5*g)], [(h-(g/4))+(1.25*g), h+(1.5*g)], [(h-(g/4))+(1.25*g), w+(1.5*g)], [g, w+(1.5*g)]];
				makeSelection(docRef, selectionBounds);
				resizeImageForSmallRectangles(docRef, documentWidth, documentHeight, w, h, g);
				docRef.activeLayer.name = "photo " + i;
				docRef.activeLayer.translate(-((documentWidth/2-((w/4)+g))), documentHeight/2-((h/2)+g));
				docRef.activeLayer.grouped = true;
				break;
			// Десен квадрат	
			case 4:
				selectionBounds = [[h+(1.5*g), h+(1.5*g)], [w+g, h+(1.5*g)], [w+g, w+(1.5*g)], [h+(1.5*g), w+(1.5*g)]];
				makeSelection(docRef, selectionBounds);
				resizeImageForSmallRectangles(docRef, documentWidth, documentHeight, w, h, g);
				docRef.activeLayer.name = "photo " + i;
				docRef.activeLayer.translate(0, documentHeight/2-((h/2)+g));
				docRef.activeLayer.grouped = true;
				break;
		}
	}
	// Фон на текстовете
	docRef.artLayers.add().name = 'Message Background';
	selectionBounds = [[documentWidth-(w/2), documentHeight-((h/2)+(g/4))],[documentWidth, documentHeight-((h/2)+(g/4))],[documentWidth, documentHeight-(2.25*g)],[documentWidth-(w/2),documentHeight-(2.25*g)]];
	docRef.selection.select(selectionBounds, SelectionType.REPLACE, 0, false);
	docRef.selection.fill(generateColor(91,103,112));
	docRef.selection.deselect();

	// Създаване на текстово поле за изписване на дестинация
	// Създаваме нов слой
	docRef.artLayers.add().name = 'Destination name';
	// Задаваме го като активен слой
	var destinationLayer = docRef.activeLayer;
	// Променяме типа му да бъде текстов
	destinationLayer.kind = LayerKind.TEXT;
	// Взимаме текста обвързан със слоя (в момента няма въведен текст)
	var destinationLayerRef = destinationLayer.textItem;
	// Подравняване на текста
	destinationLayerRef.justification = Justification.RIGHT;
	// Големина на шрифра (в пиксели)
	destinationLayerRef.size = 60;
	// Стил на шрифта
	destinationLayerRef.font = "TrebuchetMS";
	// Цвят на текста
	destinationLayerRef.color = generateColor(255,255,255);
	// Позициониране на текстовото поле
	destinationLayerRef.position = new Array(documentWidth-(g/2), documentHeight-(2.75*g));
	// Задаваме буквите да бъдат само главни
	destinationLayerRef.capitalization = TextCase.ALLCAPS;
	// Въвеждаме текст
	var destinationName = inputDestinationName("въведете име на дестинацията...");
	destinationLayerRef.contents = destinationName;

	// Създаване на текстово поле за изписване на поздрав
	docRef.artLayers.add().name = 'Greeting';
	var greetingLayer = docRef.activeLayer;
	greetingLayer.kind = LayerKind.TEXT;
	var greetingLayerRef = greetingLayer.textItem;
	greetingLayerRef.justification = Justification.LEFT;
	greetingLayerRef.size = 38;
	greetingLayerRef.font = "Courier";
	greetingLayerRef.color = generateColor(255,255,255);
	greetingLayerRef.position = new Array(documentWidth-((w/2) - (g/4)), documentHeight-(4.25*g));
	greetingLayerRef.capitalization = TextCase.ALLCAPS;
	greetingLayerRef.contents = getRandomGreeting();
	
	//Съхраняване на документа в PSD формат
	var saveFolder = Folder.selectDialog("Избери папка за съхранение на колажа.");
	var savePSdoc = saveOptionsPSD();
	var savePSDFile = new File(saveFolder.path + "/" + destinationName + "-postcard.psd");	     
	docRef.saveAs(savePSDFile, savePSdoc, false, Extension.LOWERCASE);

	//Създаване на папкo  а за съхранение на картичката
	var tempFolder = new Folder(saveFolder.path +"/Collage")
	tempFolder.create(); 

	//Съхраняване на документа в JPG формат
	var saveImage = saveOptionsJPG();
	var saveImgFile = new File(tempFolder.path + "/" + tempFolder.name + "/"+ destinationName +"-postcard.jpg");
	docRef.saveAs(saveImgFile, saveImage, true, Extension.LOWERCASE);

	// Запазваме промените по документа и го затваряме
	docRef.close(savePSdoc.SAVECHANGES); 
}

//Функция за съхранение на JPG изображение
function saveOptionsJPG(){
	// Опции за запис на документ в JPG формат
	var savejpgOptions = new JPEGSaveOptions();
	savejpgOptions.embedColorProfile = true;
	savejpgOptions.formatOptions = FormatOptions.STANDARDBASELINE;
	savejpgOptions.matte = MatteType.NONE;
	savejpgOptions.quality = 9;

	// Връща опциите за JPG файлов формат
	return savejpgOptions;  
}

//Функция за съхранение на PhotoShop файл
function saveOptionsPSD(){
	// Опции за запис на документ в PSD формат
	var savepsdOptions = new PhotoshopSaveOptions();
	savepsdOptions.layers = true;
	savepsdOptions.embedColorProfile = true;

	// Връща опциите за PSD файлов формат
	return savepsdOptions;     
}


// Метод за взимане на поздрав от файл на случаен принцип
function getRandomGreeting(){
	var dbFile = File.openDialog("Избери файл...");
	//var greetingFile = new File(openFile.path + "/" + "data.txt");
    dbFile.open ('r');
    var text; // Променлива, с която взимаме броя на поздравите от файла
    // Създаваме масив за поздравите
   var greetings = new Array();
   // Запълваме масива
   for(i=0; i<1000; i++){
        text = dbFile.readln();
		// Проверка дали ред от файла е празен
        if (text.length != 0){  
            greetings[i] = text;
        }else{
			break;
		}
    }
	// Взимане на случаен поздрав от масива
	var randomNumber = Math.floor(Math.random()*greetings.length);
	return greetings[randomNumber];
}

//Функция за въвеждане на име на дестинация
function inputDestinationName(input) {
	// Диалогов прозорец за въвеждане на име на дестинацията
    var destinationName  = prompt("Моля "+ input, "Постави текст"); 
	// Проверка дали е въведено име
    while (destinationName == "") {
		destinationName = prompt("Трябва да " + input, "Постави текст");
      if( destinationName === null ) break;
    }
    return destinationName;
 }

//Функция за създаване на селекция
function makeSelection(doc, select){
	//Селектиране
		doc.selection.select(select, SelectionType.REPLACE, 0, false);
		//Запълване с цвят
		doc.selection.fill(generateColor(0,0,0));
		// Премахване на селекция
		doc.selection.deselect();
}


//Функция за отваряне и поставяне на изображение
function resizeImageHorizontal(doc, docW, docH, w, h){
	// Избираме изображение
	var imgFile = File.openDialog('Избери изображение');
	// Отваряме изображението
	app.open(imgFile);
	// Задаваме го като активен документ
	imgFile = app.activeDocument;

	// Записваме в променливи ширината и височината
	var img_w = imgFile.width.value;
	var img_h = imgFile.height.value;
	// Отношение на ширината към височината
	var img_amount = img_w/img_h;

	// Проверка на размерите на изображението
	if((imgFile.width.value > imgFile.height.value) &&  (imgFile.width.value >= docW) &&  (imgFile.height.value >= docH)){
		// Преоразмеряване на изображението
		imgFile.resizeImage(w, w/img_amount , 72, ResampleMethod.AUTOMATIC);
		//Получаване на слоя на изображението
		var layerRef = imgFile.artLayers[0];
		//Дублиране в шаблона
		layerRef.duplicate(doc, ElementPlacement.PLACEATBEGINNING);

		//Затваряне на изображението
		imgFile.close(SaveOptions.DONOTSAVECHANGES);	
	}
}


function resizeImageVertical(doc, docW, docH, w, h, g){
	var imgFile = File.openDialog('Избери изображение');
	app.open(imgFile);
	imgFile = app.activeDocument;

	var img_w = imgFile.width.value;
	var img_h = imgFile.height.value;
	var img_amount = img_w/img_h;

	if((imgFile.width.value >= docW) &&  (imgFile.height.value >= docH)){
		imgFile.resizeImage(w*img_amount, (h*2+g/2), 72, ResampleMethod.AUTOMATIC);
		//Получаване на слоя на изображението
		var layerRef = imgFile.artLayers[0];
		//Дублиране в шаблона
		layerRef.duplicate(doc, ElementPlacement.PLACEATBEGINNING);

		//Затваряне на изображението
		imgFile.close(SaveOptions.DONOTSAVECHANGES);	
	}
}

function resizeImageForSmallRectangles(doc, docW, docH, w, h, g){
	var imgFile = File.openDialog('Избери изображение');
	app.open(imgFile);
	imgFile = app.activeDocument;

	var img_w = imgFile.width.value;
	var img_h = imgFile.height.value;
	var img_amount = img_w/img_h;

	if((imgFile.width.value >= docW) &&  (imgFile.height.value >= docH)){
		imgFile.resizeImage(w/img_amount, h, 72, ResampleMethod.AUTOMATIC);
		//Получаване на слоя на изображението
		var layerRef = imgFile.artLayers[0];
		//Дублиране в шаблона
		layerRef.duplicate(doc, ElementPlacement.PLACEATBEGINNING);

		//Затваряне на изображението
		imgFile.close(SaveOptions.DONOTSAVECHANGES);	
	}
}

//Функция за цвят
function generateColor(r, g, b){
	var solidColor = new SolidColor;
	solidColor.rgb.red = r;
	solidColor.rgb.green = g;
	solidColor.rgb.blue = b;
	return solidColor;
}


// Function isCorrectVersion() - Метод, проверяващ дали версията на приложението ни е Adobe Photoshop CS2 (v9) или по-нова
function isCorrectVersion() {
	if (parseInt(version, 10) >= 9) {
		return true;
	}
	else {
		alert('This script requires Adobe Photoshop CS2 or higher.', 'Wrong Version', false);
		return false;
	}
}

// showError() - Метод, който ни показва на кой ред в кода има грешка. 
function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}

// Проверка на версията на Adobe Photoshop преди изпълняването на main функцията.
if (isCorrectVersion()) {
	// Запаметяваме линейните стойности и ги променяме в пиксели.
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	try {
		createCollage();
	}
	catch(e) {
		// Ако потребителя прекъсне работата на скрипта, да не се отчита като грешка.
		if (e.number != 8007) {
			showError(e);
		}
	}

	// Превръщаме пикселите обратно в линейни стойности.
	preferences.rulerUnits = originalRulerUnits;
}