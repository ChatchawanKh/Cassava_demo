// function downloadURL() {
//     location.assign("https://gistdaportal.gistda.or.th/cassava_biz/downloads/");
// }

// location.assign("https://gistdaportal.gistda.or.th/cassava_biz/downloads/");

// function Replace() { 
//     location.replace("https://gistdaportal.gistda.or.th/cassava_biz/downloads/");
// }

const header = document.querySelector("header");

window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", this.window.scrollY > 0);
})

let menu = document.querySelector('#menu-icon');
let navmenu = document.querySelector('.navmenu')

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
}

// Add event listeners to the dropdowns
document.getElementById("Date").addEventListener("change", generateDownloadLink);
document.getElementById("Province").addEventListener("change", generateDownloadLink);

// Call the function initially to generate download link based on default values
generateDownloadLink();

async function generateDownloadLink() {
    var province = document.getElementById("Province").value.split('|');
    var provinceID = province[0];
    var provinceName = province[1];

    var month = document.getElementById("Date").value.split('|');
    var yearID = month[0];
    var monthID = month[1];
    var dayID = month[2];

    // https://gistdaportal.gistda.or.th/portal/apps/experiencebuilder/experience/?id=20635c55f935469994959c40e3e89506&page=Downloads

    if (monthID && provinceID) {
        // Constructing the URL based on selected options
        var baseUrl = "https://drought-765rkyfg3q-as.a.run.app/get/cassava/";
        var typeMapUrl = baseUrl + "map/pdf?year=" + yearID + "&month=" + monthID + "&province=" + provinceID;
        var typeReportUrl = baseUrl + "report/excel?year=" + yearID + "&month=" + monthID + "&province=" + provinceID;
        var typeZipUrl = baseUrl + "shp?year=" + yearID + "&month=" + monthID;

        var finalMapUrl = await getDownloadlinkfromAPI(typeMapUrl);
        var finalReportUrl = await getDownloadlinkfromAPI(typeReportUrl);
        var finalZipUrl = await getDownloadlinkfromAPI(typeZipUrl);

        // Creating clickable links
        var maplink = createDownloadLink(finalMapUrl, "แผนที่รายจังหวัด", "fa-solid fa-file-pdf");
		var reportlink = createDownloadLink(finalReportUrl, "รายงานรายจังหวัด", "fas fa-file-excel");
        var ziplink = createDownloadLink(finalZipUrl, "ข้อมูล Shapefile", "fa-solid fa-file-zipper");

        // Clearing previous links
        clearContainer(document.getElementById("downloadLinkContainer"));

        // Appending the links to the container
        var container = document.getElementById("downloadLinkContainer");
        container.appendChild(maplink);
        container.appendChild(document.createElement("br"));
        container.appendChild(reportlink);
        container.appendChild(document.createElement("br"));
        container.appendChild(ziplink);

        container.click();

        // Fade in
        container.style.opacity = "0";
        var fadeInInterval = setInterval(function() {
            container.style.opacity = (parseFloat(container.style.opacity) + 0.1).toString();
            if (parseFloat(container.style.opacity) >= 1) {
                clearInterval(fadeInInterval);
            }
        }, 100);
    } else {
        // If only province is selected, clear the container
        clearContainer(document.getElementById("downloadLinkContainer"));
    }
}


async function getDownloadlinkfromAPI(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.data && data.data.file_name_ && data.data.file_name_.length > 0) {
            const downloadLink = data.data.file_name_[0];
            console.log("Download Link:", downloadLink);
            return downloadLink;
        } else {
            console.log("File name not found in the response.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching download link:", error);
        return null;
    }
}

function createDownloadLink(url, text, iconClass) {

    var link = document.createElement("a");
    link.href = url;
    link.style.display = "flex";
    link.style.flexDirection = "column"; // Set flex-direction to column
    link.style.alignItems = "center"; // Align items to the center
    link.style.textAlign = "center"; // Center-align the text
    link.style.border = "3px solid #111";
    link.style.padding = "2rem";
    link.style.borderRadius = "5px";
    
    var icon = document.createElement("i");
    icon.className = iconClass;
    icon.style.color = "#111";
    icon.style.fontSize = "25px";
    icon.style.fontSize = "30px";

    var span = document.createElement("span");
    span.textContent = text;
    span.style.fontSize = "20px";
    
    link.appendChild(icon); // Append the icon to the link first
    link.appendChild(document.createElement("br")); // Add a line break
    link.appendChild(span); // Append the text to the link after the line break

    // Change text color on hover
    link.addEventListener("mouseenter", function() {
        link.style.backgroundColor = "#43873C";
        link.style.color = "#fff"; 
        icon.style.color = "#fff";
    });

    // Reset color when not hovered
    link.addEventListener("mouseleave", function() {
        link.style.backgroundColor = "transparent";
        link.style.color = "#111"; 
        icon.style.color = "inherit";
    });

    link.addEventListener("click", function() {
        link.style.backgroundColor = "#ddd"; // Change background color when clicked
        setTimeout(function() {
            link.style.backgroundColor = "transparent"; // Reset background color after a short delay
        }, 200);
    });
    return link;
}

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

