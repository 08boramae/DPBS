function printsayeon()  {
    const sayeon = document.getElementById('sayeon').value;
    document.getElementById("sayeon-result").innerText = sayeon;
}

function printcontent()  {
    const content = document.getElementById('content').value;
    document.getElementById("content-result").innerText = content;
}

function printtitle()  {
    const title = document.getElementById('title').value;
    document.getElementById("title-result").innerText = title;
    document.getElementById("title-preview").innerText = title;
}

function printartist()  {
    const artist = document.getElementById('artist').value;
    document.getElementById("artist-result").innerText = artist;
    document.getElementById("artist-preview").innerText = artist;
}

function printwriter()  {
    const writer = document.getElementById('writer').value;
    document.getElementById("writer-result").innerText = writer;
}

function printdate()  {
    const date = document.getElementById('date').value;
    document.getElementById("date-result").innerText = date;
}

// 수동 업로드 핸들러
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('albumArtUpload').click();
});

function changeColor(radio) {
    var divToChange = document.getElementById('writer-result');

    // 모든 라디오 버튼에 설정된 클래스를 제거
    document.querySelectorAll('input[name="colors"]').forEach(function (input) {
        divToChange.classList.remove(input.value);
    });

    // 선택된 라디오 버튼에 해당하는 클래스 추가
    if (radio.checked) {
        divToChange.classList.add(radio.value);
    }
}

function nextpost() {
    var nextpost = document.getElementById("nextpost");
    var postmusic = document.getElementById("postmusic");
    var posttext = document.getElementById("posttext");
    var currentVisibility = window.getComputedStyle(nextpost).getPropertyValue('visibility');

    if (currentVisibility === "hidden" || currentVisibility === "") {
        nextpost.style.visibility = "visible";
        postmusic.style.visibility = "hidden";
        posttext.style.transform = 'translateY(0px)';

    } else {
        nextpost.style.visibility = "hidden";
        postmusic.style.visibility = "visible";
        posttext.style.transform = 'translateY(-25px)';

    }
}

function togglecover() {
    var general = document.getElementById("general");
    var cover = document.getElementById("cover");
    var currentDisplay = window.getComputedStyle(cover).getPropertyValue('display');

    if (currentDisplay === 'flex') {
        general.style.display = 'flex';
        cover.style.display = 'none';
    } else {
        general.style.display = 'none';
        cover.style.display = 'flex';
    }
}

function clearwriter() {
    var writer = document.getElementById("writer");
    writer.value = '';
    document.getElementById("writer-result").innerText = '익명';
    
    var divToChange = document.getElementById('writer-result');
    document.querySelectorAll('input[name="colors"]').forEach(function (input) {
    divToChange.classList.remove(input.value);
    divToChange.classList.add('is-gray');
    });
}

function clearsayeon() {
    var sayeon = document.getElementById("sayeon");
    sayeon.value = '';
    document.getElementById("sayeon-result").innerText = '';
}

function clearcontent() {
    var content = document.getElementById("content");
    content.value = '';
    document.getElementById("content-result").innerText = '';
}



  // 함수: 16진수 색상을 HSB로 변환
function hexToHsb(hex) {
    const color = tinycolor(hex);
    const hsb = color.toHsv();
    return hsb;
}

  // 함수: HSB에서 S값 및 B값 변경
function changeSaturationAndBrightness(hsb, saturation, brightness) {
    hsb.s = saturation;
    hsb.v = brightness;
    return tinycolor(hsb).toHexString();
}

  // 함수: 그라디언트 색상 변경 및 적용
function changeGradientColors(hexColor) {
    const hsbColor = hexToHsb(hexColor);

    const color1 = hsbColor.s === 0
        ? changeSaturationAndBrightness({ ...hsbColor }, 0, 84)
        : changeSaturationAndBrightness({ ...hsbColor }, 10, 100);

    const color2 = hsbColor.s === 0
        ? changeSaturationAndBrightness({ ...hsbColor }, 0, 97)
        : changeSaturationAndBrightness({ ...hsbColor }, 12, 100);

    // CSS 변수로 설정
    document.documentElement.style.setProperty('--color1', color1);
    document.documentElement.style.setProperty('--color2', color2);
}

function pageloadGradient() {
    document.documentElement.style.setProperty('--color1', "#dbdbdb");
    document.documentElement.style.setProperty('--color2', "#e8e8e8");
}

window.onload = pageloadGradient;



$(function(){
    $("#save").on("click", function(){
    html2canvas(document.querySelector("#capture"), { scale: 45/29 }).then(canvas => {
        saveAs(canvas.toDataURL('image/jpg'),"lime.jpg"); //다운로드 되는 이미지 파일 이름 지정
                });

    });
    function saveAs(uri, filename) {
        // 캡처된 파일을 이미지 파일로 내보냄
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }
});

// 앨범 아트

function getAlbumart() {
    var title = document.getElementById('title').value;
    var artist = document.getElementById('artist').value;
    
    albumArt(artist, { album: title }, function (err, url) {
        if (err) {
            console.error(err);
        } else {
            document.getElementById("postAlbumart").style.backgroundImage = "url(" + url + ")";
            document.getElementById("previewAlbumart").style.backgroundImage = "url(" + url + ")";
            getAverageColor(url, function(averageColorHex) {
                // 여기서 averageColorHex로 그라디언트 색상을 바꿉니다.
                changeGradientColors(averageColorHex);
            });
        }
    });
}
function getAverageColor(imgSrc, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var colorThief = new ColorThief();
        var dominantColor = colorThief.getColor(img);
        var averageColorHex = tinycolor({ r: dominantColor[0], g: dominantColor[1], b: dominantColor[2] }).toHexString();
        callback(averageColorHex);
    };
    img.src = imgSrc;
}
// 앨범 아트 파일 업로드 핸들러
document.getElementById('albumArtUpload').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var imgSrc = e.target.result;

            // 렌더링
            document.getElementById("postAlbumart").style.backgroundImage = "url(" + imgSrc + ")";
            document.getElementById("previewAlbumart").style.backgroundImage = "url(" + imgSrc + ")";

            // 색상 추출 및 적용
            getAverageColorFromSrc(imgSrc, function(averageColorHex) {
                changeGradientColors(averageColorHex); // 색상 변경 함수 호출
            });
        };

        // 파일을 Data URL로 읽습니다.
        reader.readAsDataURL(e.target.files[0]);
    }
});

// 업로드한 이미지의 평균 색상을 구하는 함수입니다.
// 이미지를 로드하고, 이미지의 색상을 추출한 다음 콜백으로 전달합니다.
function getAverageColorFromSrc(imgSrc, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous'; // 코사야 안될때 설정
    img.onload = function() {
        var colorThief = new ColorThief();
        if (img.complete) {
            const color = colorThief.getColor(img);
            const averageColorHex = tinycolor({ r: color[0], g: color[1], b: color[2] }).toHexString();
            callback(averageColorHex);
        }
    };
    img.src = imgSrc;
}

// 수동적인 이미지 업로드를 구현한 이유는, 앨범 아트 API가 정상 작동 하지 않을때를 대비하였습니다.