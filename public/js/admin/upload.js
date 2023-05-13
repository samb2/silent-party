//selecting all required elements
const dropArea = document.querySelector('.drag-area'),
    dragText = dropArea.querySelector('header'),
    button = dropArea.querySelector('button'),
    input = dropArea.querySelector('input');

const musicInput = document.getElementById('audioInput');

let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = () => {
    musicInput.click(); //if user click on the button then the input also clicked
};

musicInput.addEventListener('change', function () {
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = this.files[0];
    dropArea.classList.add('active');
    showFile(); //calling function
});
//If user Drag File Over DropArea
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault(); //preventing from default behaviour
    dropArea.classList.add('active');
    dragText.textContent = 'Release to Upload File';
});

//If user leave dragged File from DropArea
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
    dragText.textContent = 'Drag & Drop to Upload File';
});

//If user drop File on DropArea
dropArea.addEventListener('drop', (event) => {
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = event.dataTransfer.files[0];
    console.log(file);
    showFile(); //calling function
});

function showFile() {
    let fileType = file.type; //getting selected file type
    let validExtensions = ['audio/mpeg']; //adding some valid image extensions in array
    if (validExtensions.includes(fileType)) {
        // Prevent the default form submission behavior
        // Create a new DataTransfer object
        let dataTransfer = new DataTransfer();
        // Add the file to the DataTransfer object
        dataTransfer.items.add(file);
        // Assign the DataTransfer object to the audio input field
        musicInput.files = dataTransfer.files;
        // Get the form element and create a new FormData object
        var form = $('#upload-form')[0];
        var formData = new FormData(form);

        // Make the AJAX request
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                var modal = document.getElementById('uploadModal');
                $(modal).modal('hide');
                location.reload();
                console.log('Upload successful!');
            },
            error: function (xhr, status, error) {
                console.error('Upload failed:', error);
            },
        });
    } else {
        alert('This is not an Image File!');
        dropArea.classList.remove('active');
        dragText.textContent = 'Drag & Drop to Upload File';
    }
}
