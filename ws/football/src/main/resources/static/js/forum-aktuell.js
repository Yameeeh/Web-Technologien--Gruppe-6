

/*Sidebar*/
document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById("check2");
    const sidebar = document.querySelector(".sidebar");

    const handleResize = () => {
        if (window.innerWidth > 1100) {
            checkbox.checked = false;
            sidebar.style.width = "25%";
        } else {
            if (!checkbox.checked) {
                sidebar.style.width = "100px";
            }
        }
    };

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            sidebar.style.width = "40%";
        } else {
            sidebar.style.width = "100px";
        }
    });

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set the correct sidebar state based on the initial window size
});




/*Pup-up für Kommentarpost - Löscht alles beim Schließen und erneuten Öffnen*/
function togglePopup() {
    const popup = document.getElementById("popup-1");
    const isActive = popup.classList.contains("active");

    if (!isActive) {
        // Wenn das Popup nicht aktiv ist, lösche die Daten und setze die Größe von imageOutput auf 0
        const imageOutput = document.getElementById('imageOutput');
        const userComment = document.getElementById('userComment');
        const imageHeight = imageOutput.clientHeight; // Höhe des Bildes erfassen
        imageOutput.innerHTML = '';
        imageOutput.style.height = '0'; // Setze die Größe von imageOutput auf 0
        userComment.value = ''; // Hier textarea leeren

        // Höhe der Content-Box anpassen
        const content = document.getElementById('content');
        content.style.height = (content.clientHeight - imageHeight) + 'px';

        // PhotoUploaded auf false setzen, da kein Bild mehr vorhanden ist
        photoUploaded = false;
    } else {
        // PhotoUploaded auf true setzen, da ein Bild vorhanden ist
        photoUploaded = true;
    }

    // Umschalten der "active" Klasse des Popups
    popup.classList.toggle("active");

    // Update des Upload-Buttons entsprechend dem Status von photoUploaded
    const uploadButton = document.getElementById('uploadButton');
    if (photoUploaded) {
        uploadButton.setAttribute('data-tooltip', 'Es kann nur ein Foto hochgeladen werden');
        uploadButton.disabled = true;
    } else {
        uploadButton.removeAttribute('data-tooltip');
        uploadButton.disabled = false;
    }
}




/* Image hochladen, Größe anpassen, max 1 Bild hochladen */
let photoUploaded = false;
const content = document.getElementById('content');
const initialContentHeight = content.clientHeight;
let currentImage = null;

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;

            if (currentImage) {
                // Bild austauschen
                currentImage.src = img.src;
            } else {
                // Neues Bild hinzufügen
                const closeIcon = document.createElement('button');
                closeIcon.innerHTML = '&times;';
                closeIcon.classList.add('close-icon');

                img.onload = function() {
                    if (img.naturalWidth > img.naturalHeight) {
                        img.classList.add('landscape');
                    } else {
                        img.classList.add('portrait');
                    }

                    const imageOutput = document.getElementById('imageOutput');
                    imageOutput.appendChild(img);
                    imageOutput.appendChild(closeIcon);

                    const newHeight = initialContentHeight + img.height;
                    content.style.height = newHeight + 'px';
                    imageOutput.style.height = img.height + 'px';

                    photoUploaded = true;
                    currentImage = img;
                };

                closeIcon.addEventListener('click', function() {
                    const imageOutput = document.getElementById('imageOutput');
                    imageOutput.innerHTML = '';
                    imageOutput.style.height = '0';

                    content.style.height = initialContentHeight + 'px'; // Setze die ursprüngliche Höhe zurück

                    photoUploaded = false;
                    const uploadButton = document.getElementById('uploadButton');
                    uploadButton.disabled = false;
                    uploadButton.removeAttribute('data-tooltip');

                    // Event-Handling für das Ändern der Datei erneut registrieren
                    document.getElementById('fileInput').addEventListener('change', handleFileChange);
                });
            }
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('uploadButton').addEventListener('click', function() {
    if (photoUploaded) {
        this.setAttribute('data-tooltip', 'Es kann nur ein Foto hochgeladen werden');
        this.disabled = true;
    } else {
        document.getElementById('fileInput').click();
    }
});

// Event-Handling für das Ändern der Datei registrieren
document.getElementById('fileInput').addEventListener('change', handleFileChange);

// Daten an Backend schicken
async function postComment() {
	const comment = document.getElementById('userComment').value;
	const fileInput = document.getElementById('fileInput');
	const file = fileInput.files[0];

	if (!comment) {
		alert('Bitte geben Sie einen Kommentar ein.');
		return;
	}

	const formData = new FormData();
	formData.append('comment', comment);
	formData.append('image', file);
	formData.append('topicId', currentTopicId); // Hinzufügen der Topic-ID

	try {
		const response = await fetch('http://localhost:8080/api/comments', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}

		const result = await response.text();
		console.log('Erfolgreich gepostet:', result);
		alert('Kommentar und Bild wurden erfolgreich gepostet!');
		// Hier könntest du den Kommentar und das Bild auf der Seite anzeigen
	} catch (error) {
		console.error('Es gab ein Problem mit der Anfrage:', error);
		alert('Es gab ein Problem beim Posten des Kommentars und Bildes.');
	}
}

// Event Listener für den Post-Button per ID
document.getElementById('postButton').addEventListener('click', postComment);



// Daten aus dem Backend laden 
async function loadComments(topicId) {
	try {
		const response = await fetch(`http://localhost:8080/api/comments?topicId=${topicId}`);
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}

		const comments = await response.json();
		const commentSection = document.getElementById(`comment-section-${topicId}`);
		commentSection.innerHTML = ''; // Leeren der Kommentar-Sektion

		comments.forEach(comment => {
			const commentElement = document.createElement('div');
			commentElement.classList.add('comment');
			commentElement.innerHTML = `
				<p>${comment.text}</p>
				<img src="http://localhost:8080/uploads/${comment.imagePath}" alt="Comment Image">
			`;
			commentSection.appendChild(commentElement);
		});

	} catch (error) {
		console.error('Es gab ein Problem beim Laden der Kommentare:', error);
	}
}

// Das richtige Topic Fenster öffnen
function openTopic(topicId) {
	let currentTopicId = null;
	currentTopicId = topicId;
	const tabs = document.querySelectorAll('.nav-link a');
	const commentSections = document.querySelectorAll('.comment-section');

	tabs.forEach(tab => tab.parentElement.classList.remove('active'));
	commentSections.forEach(section => section.classList.remove('active'));

	document.querySelector(`.nav-link:nth-child(${topicId + 3})`).classList.add('active');
	document.getElementById(`comment-section-${topicId}`).classList.add('active');

	document.getElementById('post-button-container').style.display = 'block';

	loadComments(topicId);
}

// Funktion, um die Farbe der Links beim Klicken zu ändern
function markActiveLink(topicId) {
    const links = document.querySelectorAll('.sidebar li .text');
    links.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.sidebar li:nth-child(${topicId}) .text`);
    if (activeLink) {
        activeLink.classList.add('active');
    }}